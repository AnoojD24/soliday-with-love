import { readFileSync } from 'node:fs'

const s = readFileSync('tmp-muscle-map/female-muscle-map.svg', 'utf8')
const defs = s.match(/<defs>[\s\S]*?<\/defs>/)?.[0] ?? ''
console.log('defs length', defs.length)
console.log(defs.slice(0, 1500))
console.log('--- linearGradient count', (defs.match(/<linearGradient/g) || []).length)
console.log('--- radialGradient count', (defs.match(/<radialGradient/g) || []).length)

// Find non-region groups / silhouette
const ids = [...s.matchAll(/id="([^"]+)"/g)].map((m) => m[1])
console.log(
  'interesting ids',
  ids.filter(
    (id) =>
      !id.includes('front-') &&
      !id.includes('rear-') &&
      !id.includes('tone-') &&
      !id.includes('female-muscle'),
  ),
)
