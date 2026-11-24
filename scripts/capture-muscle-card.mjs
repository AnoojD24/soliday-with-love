import { chromium, devices } from 'playwright'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { createSeedWorkouts } from '../src/data/seedWorkouts.ts'

const BASE_URL = process.env.BASE_URL ?? 'http://127.0.0.1:5173'
const OUT_DIR = path.resolve('screenshots/muscle-map')

async function main() {
  await mkdir(OUT_DIR, { recursive: true })
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    ...devices['iPhone 13'],
    viewport: { width: 390, height: 900 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  })
  const page = await context.newPage()
  await page.addInitScript((payload) => {
    localStorage.setItem('soliday-with-love-v1', JSON.stringify(payload))
  }, {
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
    openedOpenWhenLetters: [],
  })

  await page.goto(`${BASE_URL}/calendar`, { waitUntil: 'networkidle' }).catch(
    async () => {
      await page.goto(`${BASE_URL}/calendar`, { waitUntil: 'domcontentloaded' })
    },
  )
  await page.getByRole('button', { name: 'December 3, 1 workout' }).click()
  await page.getByRole('button', { name: /Today's muscle focus/i }).click()
  await page.getByText('Class focus').waitFor()
  await page.getByText('Front').first().waitFor()

  const panel = page.locator('button[aria-expanded="true"] + div')
  await panel.scrollIntoViewIfNeeded()
  await page.waitForTimeout(400)
  await panel.screenshot({
    path: path.join(OUT_DIR, 'workout-card-panel-390.png'),
  })
  await page.screenshot({
    path: path.join(OUT_DIR, 'workout-card-muscle-focus-390.png'),
    fullPage: true,
  })

  await browser.close()
  console.log('Workout card muscle screenshots written')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
