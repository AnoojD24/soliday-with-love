import { chromium, devices } from 'playwright'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const BASE_URL = process.env.BASE_URL ?? 'http://127.0.0.1:5173'
const OUT_DIR = path.resolve('screenshots/muscle-map')
const widths = [320, 375, 390, 430]

const COMBOS = [
  'No highlights',
  'Hamstrings & Triceps',
  'Center Glutes & Biceps',
  'Outer Glutes & Chest',
  'Inner Thighs & Back',
  'Hamstrings & Shoulders',
  'Leg Wrap & Arm Wrap',
]

async function main() {
  await mkdir(OUT_DIR, { recursive: true })
  const browser = await chromium.launch({ headless: true })

  for (const width of widths) {
    const context = await browser.newContext({
      ...devices['iPhone 13'],
      viewport: { width, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    })
    const page = await context.newPage()
    page.setDefaultTimeout(30000)
    await page.goto(`${BASE_URL}/dev/muscle-map`, {
      waitUntil: 'domcontentloaded',
    })
    await page.getByRole('heading', { name: 'Muscle map review' }).waitFor()

    for (const title of COMBOS) {
      const section = page.locator(`[data-preview="${title}"]`)
      await section.scrollIntoViewIfNeeded()
      await page.waitForTimeout(200)
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
      await section.screenshot({
        path: path.join(OUT_DIR, `${slug}-${width}.png`),
      })
    }

    await page.screenshot({
      path: path.join(OUT_DIR, `full-page-${width}.png`),
      fullPage: true,
    })
    await context.close()
  }

  await browser.close()
  console.log(`Muscle map screenshots written to ${OUT_DIR}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
