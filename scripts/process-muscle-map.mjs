import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs'
import path from 'node:path'

const src = readFileSync('tmp-muscle-map/female-muscle-map.svg', 'utf8')

const BASE_BODY = '#EFE5E1'
const INACTIVE_A = '#EFE5E1'
const INACTIVE_B = '#E6D6D2'
const CONTOUR = '#C9B3B2'

let svg = src
  .replace(/<style>[\s\S]*?<\/style>/, '')
  .replace(/\srole="button"/g, '')
  .replace(/\stabindex="0"/g, '')
  .replace(/\saria-pressed="false"/g, '')
  .replace(/\spointer-events="visiblePainted"/g, ' pointer-events="none"')
  .replace(/\sdata-selected="false"/g, '')

// Soft Soliday base body instead of charcoal silhouette
svg = svg.replace(
  /(id="female-(?:front|rear)-silhouette-\d+"[\s\S]*?<path[^>]*?)\sfill="#[0-9A-Fa-f]{3,8}"/g,
  `$1 fill="${BASE_BODY}"`,
)

// Warm Soliday inactive gradients (subtle depth, not cool gray)
svg = svg.replace(
  /<linearGradient id="([^"]+)"[^>]*>[\s\S]*?<\/linearGradient>/g,
  (_full, id) =>
    `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${INACTIVE_A}" /><stop offset="1" stop-color="${INACTIVE_B}" /></linearGradient>`,
)

// Soft anatomical contour strokes on every muscle path
svg = svg.replace(/<path\b([^>]*?)\s*\/>/g, (_full, attrs) => {
  let next = attrs
  if (!/\bstroke=/.test(next)) {
    next += ` stroke="${CONTOUR}"`
  } else {
    next = next.replace(/\bstroke="[^"]*"/, `stroke="${CONTOUR}"`)
  }
  if (!/\bstroke-width=/.test(next)) {
    next += ' stroke-width="1.4"'
  } else {
    next = next.replace(/\bstroke-width="[^"]*"/, 'stroke-width="1.4"')
  }
  if (!/\bstroke-linejoin=/.test(next)) {
    next += ' stroke-linejoin="round"'
  }
  return `<path${next} />`
})

svg = svg.replace(
  /id="female-muscle-map"/,
  'id="female-muscle-map" class="soliday-muscle-map"',
)

svg = svg.replace(
  /<desc id="female-desc">[\s\S]*?<\/desc>/,
  '<desc id="female-desc">Stylized female front and rear muscle map for Soliday class focus highlights. Adapted from Open Muscle Map (MIT).</desc>',
)

const outDir = path.resolve('src/assets/muscle-map')
mkdirSync(outDir, { recursive: true })
writeFileSync(path.join(outDir, 'female-muscle-map.svg'), svg)
copyFileSync('tmp-muscle-map/LICENSE', path.join(outDir, 'LICENSE'))
writeFileSync(
  path.join(outDir, 'ATTRIBUTION.md'),
  `# Open Muscle Map attribution

Female anatomical muscle map artwork adapted from:

**Open Muscle Map** by PerspicaciousGuy  
https://github.com/PerspicaciousGuy/Open-Muscle-Map

License: MIT (see LICENSE in this folder)

Changes for Soliday With Love:
- Interaction styles and tap targets removed
- Gradient fills restyled to the Soliday cream / blush palette
- Soft contour strokes added
- Embedded as a local offline asset with Soliday muscle-focus mapping
`,
)

console.log('Wrote processed SVG,', svg.length, 'bytes')
