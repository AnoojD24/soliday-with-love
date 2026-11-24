import { chromium, devices } from 'playwright'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const BASE_URL = process.env.BASE_URL ?? 'http://127.0.0.1:4173'
const OUT_DIR = path.resolve('screenshots/gift-reveal')
const widths = [320, 375, 390, 430]

const FRAMES = [
  { name: '00-welcome', at: 0 },
  { name: '01-lid-opening', at: 800 },
  { name: '02-photo-emerging', at: 1600 },
  { name: '03-affection', at: 2800 },
  { name: '04-revealed', at: 3800 },
]

async function captureWidth(browser, width, withVideo) {
  const context = await browser.newContext({
    ...devices['iPhone 13'],
    viewport: { width, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    recordVideo: withVideo
      ? { dir: OUT_DIR, size: { width, height: 844 } }
      : undefined,
  })
  const page = await context.newPage()
  page.setDefaultTimeout(20000)
  await page.addInitScript(() => localStorage.clear())
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' })
  await page.getByRole('button', { name: /unwrap your gift/i }).waitFor()

  if (FRAMES[0].at === 0) {
    await page.screenshot({
      path: path.join(OUT_DIR, `${FRAMES[0].name}-${width}.png`),
      fullPage: true,
    })
  }

  const start = Date.now()
  await page.getByRole('button', { name: /unwrap your gift/i }).click()

  for (const frame of FRAMES.slice(1)) {
    const wait = Math.max(0, frame.at - (Date.now() - start))
    await page.waitForTimeout(wait)
    await page.screenshot({
      path: path.join(OUT_DIR, `${frame.name}-${width}.png`),
      fullPage: true,
    })
  }

  await page.getByRole('button', { name: /let's sleigh/i }).waitFor({
    timeout: 8000,
  })
  await page.screenshot({
    path: path.join(OUT_DIR, `05-cta-ready-${width}.png`),
    fullPage: true,
  })

  await context.close()
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true })
  const browser = await chromium.launch({ headless: true })

  // Full video only at 390 to keep review focused
  await captureWidth(browser, 390, true)
  for (const width of widths.filter((w) => w !== 390)) {
    await captureWidth(browser, width, false)
  }

  await browser.close()
  console.log(`Gift reveal screenshots/video written to ${OUT_DIR}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
