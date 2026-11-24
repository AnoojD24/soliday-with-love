import { mkdir, readFile, writeFile, copyFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve('.')
const ICONS = path.join(ROOT, 'public', 'icons')
const MASTER = path.join(ICONS, 'icon.svg')

async function renderPng(size, filename) {
  const svg = await readFile(MASTER)
  await sharp(svg, { density: 384 })
    .resize(size, size, { fit: 'fill' })
    .png()
    .toFile(path.join(ICONS, filename))
  console.log(`wrote ${filename} (${size}x${size})`)
}

async function renderMaskable(size, filename, insetRatio = 0.1) {
  const svg = await readFile(MASTER)
  const inner = Math.round(size * (1 - insetRatio * 2))
  const pad = Math.round((size - inner) / 2)
  const innerPng = await sharp(svg, { density: 384 })
    .resize(inner, inner, { fit: 'fill' })
    .png()
    .toBuffer()

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 3,
      background: { r: 245, g: 214, b: 226 },
    },
  })
    .composite([{ input: innerPng, top: pad, left: pad }])
    .png()
    .toFile(path.join(ICONS, filename))

  console.log(`wrote ${filename} (${size}x${size}, maskable inset ${insetRatio})`)
}

async function run() {
  await mkdir(ICONS, { recursive: true })
  await copyFile(MASTER, path.join(ICONS, 'favicon.svg'))
  await copyFile(MASTER, path.join(ICONS, 'apple-touch-icon.svg'))

  await renderPng(192, 'icon-192.png')
  await renderPng(512, 'icon-512.png')
  await renderMaskable(512, 'icon-512-maskable.png', 0.1)
  await renderPng(180, 'apple-touch-icon.png')
  await renderPng(32, 'favicon-32.png')
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
