import { readFileSync } from 'node:fs'

const s = readFileSync('src/assets/muscle-map/female-muscle-map.svg', 'utf8')
const fills = [
  ...s.matchAll(/id="female-(?:front|rear)-silhouette-\d+"[\s\S]*?fill="([^"]+)"/g),
].map((m) => m[1])
console.log(fills)
