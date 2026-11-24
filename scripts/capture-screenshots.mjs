import { chromium, devices } from 'playwright'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const BASE_URL = process.env.BASE_URL ?? 'http://127.0.0.1:4173'
const OUT_DIR = path.resolve('screenshots')

const widths = [320, 375, 390, 430]

async function clearStorage(page) {
  await page.addInitScript(() => {
    localStorage.clear()
  })
}

async function completeOnboarding(page) {
  const button = page.getByRole('button', { name: /unwrap your gift/i })
  await button.waitFor({ state: 'visible', timeout: 10000 })
  await button.click()
  const continueCta = page.getByRole('button', { name: /let's sleigh/i })
  await continueCta.waitFor({ state: 'visible', timeout: 12000 })
  await continueCta.click()
  await page.getByRole('heading', { name: /hi, beautiful/i }).waitFor({
    timeout: 10000,
  })
}

async function capture(page, name) {
  await page.screenshot({
    path: path.join(OUT_DIR, `${name}.png`),
    fullPage: true,
  })
}

async function run() {
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
    await clearStorage(page)

    await page.goto(BASE_URL, { waitUntil: 'networkidle' })
    await capture(page, `welcome-${width}`)

    await completeOnboarding(page)
    await capture(page, `home-${width}`)

    await page.getByRole('link', { name: 'Calendar' }).click()
    await page.getByRole('heading', { name: 'Calendar' }).waitFor()
    await capture(page, `calendar-${width}`)

    await page.getByRole('link', { name: 'Progress' }).click()
    await page.getByRole('heading', { name: 'Progress' }).waitFor()
    await capture(page, `progress-${width}`)

    await page.getByRole('link', { name: 'With Love' }).click()
    await page.getByRole('heading', { name: 'With Love' }).waitFor()
    await capture(page, `with-love-${width}`)

    // Persistence check: reload should skip welcome
    await page.reload({ waitUntil: 'networkidle' })
    await page.getByRole('heading', { name: 'With Love' }).waitFor()
    await capture(page, `persisted-${width}`)

    await context.close()
  }

  await browser.close()
  console.log(`Screenshots written to ${OUT_DIR}`)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
