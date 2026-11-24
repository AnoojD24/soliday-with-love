import { readFileSync } from 'node:fs'

const s = readFileSync('tmp-muscle-map/female-muscle-map.svg', 'utf8')
const matches = [...s.matchAll(/id="(female-(?:front|rear)-silhouette-\d+)"[\s\S]*?<\/g>/g)]
console.log('silhouette groups', matches.length)
for (const m of matches.slice(0, 4)) {
  const chunk = m[0].slice(0, 500)
  console.log('---')
  console.log(chunk)
  const fills = [...m[0].matchAll(/fill="([^"]+)"/g)].map((x) => x[1])
  console.log('fills', fills)
}
