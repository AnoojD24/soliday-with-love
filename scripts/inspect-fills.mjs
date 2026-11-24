import { readFileSync } from 'node:fs'

const s = readFileSync('src/assets/muscle-map/female-muscle-map.svg', 'utf8')
console.log(s.match(/<path[^>]{0,160}/)?.[0])
console.log('fill count', (s.match(/\sfill=/g) || []).length)
console.log(
  'sample fills',
  [...new Set([...s.matchAll(/\sfill="([^"]+)"/g)].map((x) => x[1]))].slice(
    0,
    30,
  ),
)
console.log('url(# fills', (s.match(/fill="url\(/g) || []).length)
