import { readFileSync } from 'node:fs'

const original = readFileSync('tmp-muscle-map/female-muscle-map.svg', 'utf8')
const processed = readFileSync(
  'src/assets/muscle-map/female-muscle-map.svg',
  'utf8',
)

for (const [label, s] of [
  ['original', original],
  ['processed', processed],
]) {
  const hasBody = /body|silhouette|skin|base/i.test(s)
  console.log(label, 'body-ish', hasBody)
  const darkFills = [
    ...new Set(
      [...s.matchAll(/stop-color="(#[0-9A-Fa-f]{3,8})"/g)].map((m) => m[1]),
    ),
  ]
  console.log(label, 'stop colors sample', darkFills.slice(0, 8), 'count', darkFills.length)
}

// Check female-front / female-rear wrappers
const frontOpen = original.indexOf('id="female-front"')
console.log('front snippet', original.slice(frontOpen, frontOpen + 400))
