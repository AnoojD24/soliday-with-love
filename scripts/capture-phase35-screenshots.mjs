import { chromium, devices } from 'playwright'
import { copyFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { createSeedWorkouts } from '../src/data/seedWorkouts.ts'

const BASE_URL = process.env.BASE_URL ?? 'http://127.0.0.1:4173'
const OUT_DIR = path.resolve('screenshots/phase35')
const widths = [320, 375, 390, 430]

function fixture() {
  return {
    version: 1,
    workouts: createSeedWorkouts(),
    settings: {
      goalWorkoutDays: 10,
      decisionDeadlineHours: 10,
      eveningReminderHour: 20,
    },
    onboardingCompleted: true,
    unlockedMilestones: [],
    celebratedMilestones: [],
    openedOpenWhenLetters: ['miss-me'],
  }
}

async function seed(page, data) {
  await page.addInitScript((payload) => {
    localStorage.setItem('soliday-with-love-v1', JSON.stringify(payload))
  }, data)
}

async function capture(page, name) {
  await page.screenshot({
    path: path.join(OUT_DIR, `${name}.png`),
    fullPage: true,
  })
}

async function run() {
  await mkdir(OUT_DIR, { recursive: true })
  await copyFile(
    path.resolve('public/icons/icon-512.png'),
    path.join(OUT_DIR, 'app-icon-512.png'),
  )
  await copyFile(
    path.resolve('public/icons/icon.svg'),
    path.join(OUT_DIR, 'app-icon.svg'),
  )

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
    await seed(page, fixture())
    await page.goto(`${BASE_URL}/with-love`, { waitUntil: 'networkidle' })
    await page.getByRole('heading', { name: 'With Love' }).waitFor()
    await capture(page, `with-love-${width}`)

    await page.getByText('Open when...').scrollIntoViewIfNeeded()
    await capture(page, `open-when-collection-${width}`)

    await page.getByRole('button', { name: /Open when you need a little love/i }).click()
    await page.getByRole('dialog').waitFor()
    await capture(page, `open-when-letter-${width}`)
    await context.close()
  }

  await browser.close()
  console.log(`Phase 3.5 screenshots written to ${OUT_DIR}`)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
