import { readFileSync } from 'node:fs'

const svg = readFileSync('tmp-muscle-map/female-muscle-map.svg', 'utf8')
const style = svg.match(/<style>[\s\S]*?<\/style>/)?.[0]
console.log(style?.slice(0, 2500))
console.log('---')

const views = { front: new Set(), rear: new Set() }
for (const m of svg.matchAll(
  /data-muscle-id="([^"]+)"[^>]*data-view="(front|rear)"/g,
)) {
  views[m[2]].add(m[1])
}
// also try reverse attribute order
for (const m of svg.matchAll(
  /data-view="(front|rear)"[^>]*data-muscle-id="([^"]+)"/g,
)) {
  views[m[1]].add(m[2])
}

console.log('front', [...views.front].sort().join(', '))
console.log('rear', [...views.rear].sort().join(', '))

const txs = []
for (const m of svg.matchAll(
  /id="female-(front|rear)-[^"]+" transform="translate\(([-\d.]+) ([-\d.]+)/g,
)) {
  txs.push({ view: m[1], x: +m[2], y: +m[3] })
}
for (const v of ['front', 'rear']) {
  const a = txs.filter((t) => t.view === v)
  console.log(
    v,
    'count',
    a.length,
    'x',
    Math.min(...a.map((t) => t.x)),
    '-',
    Math.max(...a.map((t) => t.x)),
    'y',
    Math.min(...a.map((t) => t.y)),
    '-',
    Math.max(...a.map((t) => t.y)),
  )
}

const head = svg.match(/id="female-head[\s\S]{0,800}/)
console.log('head snippet', head?.[0]?.slice(0, 400))
