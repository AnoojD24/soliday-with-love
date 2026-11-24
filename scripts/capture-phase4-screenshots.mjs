import { chromium, devices } from 'playwright'
import { copyFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { createSeedWorkouts } from '../src/data/seedWorkouts.ts'

const BASE_URL = process.env.BASE_URL ?? 'http://127.0.0.1:4173'
const OUT_DIR = path.resolve('screenshots/phase4')
const widths = [390, 430]

function baseState(overrides = {}) {
  return {
    version: 1,
    workouts: createSeedWorkouts(),
    settings: {
      goalWorkoutDays: 12,
      decisionDeadlineHours: 10,
      eveningReminderHour: 20,
    },
    onboardingCompleted: true,
    unlockedMilestones: [],
    celebratedMilestones: [],
    openedOpenWhenLetters: [],
    ...overrides,
  }
}

function progressSix() {
  const workouts = createSeedWorkouts()
  const dates = [...new Set(workouts.map((w) => w.date))].sort().slice(0, 6)
  const set = new Set(dates)
  return baseState({
    workouts: workouts.map((w) =>
      set.has(w.date)
        ? {
            ...w,
            attendanceStatus: 'completed',
            completedAt: `${w.date}T20:00:00.000Z`,
          }
        : w,
    ),
    unlockedMilestones: ['first', 'three', 'six'],
    celebratedMilestones: ['first', 'three', 'six'],
  })
}

function flexibleOpen() {
  const workouts = createSeedWorkouts()
  return baseState({
    workouts: workouts.map((w) =>
      w.date < '2026-12-13' && w.attendanceStatus === 'planned'
        ? {
            ...w,
            attendanceStatus: 'completed',
            completedAt: `${w.date}T20:00:00.000Z`,
          }
        : w,
    ),
    unlockedMilestones: ['first', 'three', 'six'],
    celebratedMilestones: ['first', 'three', 'six'],
  })
}

function cancellationReminder() {
  const workouts = createSeedWorkouts()
  const day = workouts.filter((w) => w.date === '2026-12-13')
  const morning = day.find((w) => w.startTime === '11:00')
  const evening = day.find((w) => w.startTime === '17:20')
  return baseState({
    workouts: workouts.map((w) => {
      if (morning && w.id === morning.id) {
        return { ...w, attendanceStatus: 'planned' }
      }
      if (evening && w.id === evening.id) {
        return {
          ...w,
          attendanceStatus: 'not_attending',
          bookingCanceledInApp: false,
        }
      }
      return w
    }),
  })
}

function finalGift() {
  const workouts = createSeedWorkouts()
  return baseState({
    workouts: workouts.map((w) => ({
      ...w,
      attendanceStatus: 'completed',
      completedAt: `${w.date}T20:00:00.000Z`,
    })),
    unlockedMilestones: ['first', 'three', 'six', 'nine', 'twelve'],
    celebratedMilestones: ['first', 'three', 'six', 'nine', 'twelve'],
  })
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

async function runWidth(browser, width) {
  const context = await browser.newContext({
    ...devices['iPhone 13'],
    viewport: { width, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  })

  // Welcome
  let page = await context.newPage()
  await page.addInitScript(() => localStorage.clear())
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' })
  await page.getByRole('button', { name: /unwrap your gift/i }).waitFor()
  await capture(page, `welcome-${width}`)
  await page.close()

  // Home pre-challenge
  page = await context.newPage()
  await seed(page, baseState())
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' })
  await page.getByRole('heading', { name: /hi, beautiful/i }).waitFor()
  await capture(page, `home-pre-${width}`)

  // Wait for SW + precache before simulating offline
  await page.evaluate(async () => {
    if (!('serviceWorker' in navigator)) return
    await navigator.serviceWorker.ready
    await new Promise((resolve) => setTimeout(resolve, 1500))
  })
  await context.setOffline(true)
  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.getByRole('heading', { name: /hi, beautiful/i }).waitFor()
  await capture(page, `offline-home-${width}`)
  await context.setOffline(false)
  await page.close()

  // Flexible home + calendar
  page = await context.newPage()
  await seed(page, flexibleOpen())
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' })
  await page.getByText(/choose your workout/i).first().waitFor()
  await capture(page, `home-flexible-${width}`)
  await page.getByRole('link', { name: 'Calendar' }).click()
  await page.getByRole('heading', { name: 'Calendar' }).waitFor()
  await capture(page, `calendar-${width}`)
  await page.getByRole('button', { name: /December 13/i }).click()
  await page.getByText(/choose your workout/i).first().waitFor()
  await capture(page, `flexible-select-${width}`)
  await page.close()

  // Cancellation reminder
  page = await context.newPage()
  await seed(page, cancellationReminder())
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' })
  await page.getByText(/cancel this unused reservation|cancellation/i).first().waitFor()
  await capture(page, `cancellation-reminder-${width}`)
  await page.getByRole('link', { name: 'Calendar' }).click()
  await page.getByRole('button', { name: /December 13/i }).click()
  await page.getByText(/I canceled this in the solidcore app/i).first().waitFor()
  await capture(page, `cancellation-detail-${width}`)
  await page.close()

  // Progress six + muscle + install guide + with love
  page = await context.newPage()
  await seed(page, progressSix())
  await page.goto(`${BASE_URL}/calendar`, { waitUntil: 'domcontentloaded' })
  await page.getByRole('button', { name: 'December 3, 1 workout' }).click()
  await page.getByText(/today's muscle focus/i).click()
  await capture(page, `muscle-focus-${width}`)

  await page.getByRole('link', { name: 'Progress' }).click()
  await page.getByRole('heading', { name: 'Progress' }).waitFor()
  await capture(page, `progress-six-${width}`)
  await page.getByRole('button', { name: 'Settings' }).click()
  await page.getByText(/take me with you/i).waitFor()
  await capture(page, `install-guide-${width}`)

  await page.getByRole('link', { name: 'With Love' }).click()
  await page.getByRole('heading', { name: 'With Love' }).waitFor()
  await capture(page, `with-love-${width}`)
  await page.getByText('Open when...').scrollIntoViewIfNeeded()
  await capture(page, `open-when-${width}`)
  await page.getByRole('button', { name: /Open when you need a little love/i }).click()
  await page.getByRole('dialog').waitFor()
  await capture(page, `open-when-letter-${width}`)
  await page.getByRole('button', { name: /fold it back up/i }).click()
  await page.getByRole('button', { name: /Halfway glow/i }).click()
  await page.getByRole('dialog').waitFor()
  await capture(page, `milestone-letter-${width}`)
  await page.close()

  // Final gift unlocked
  page = await context.newPage()
  await seed(page, finalGift())
  await page.goto(`${BASE_URL}/with-love`, { waitUntil: 'domcontentloaded' })
  await page.getByRole('heading', { name: 'With Love' }).waitFor()
  await page.getByText(/Merry Soliday/i).first().waitFor()
  await capture(page, `final-gift-${width}`)
  await context.close()
}

async function run() {
  await mkdir(OUT_DIR, { recursive: true })
  await copyFile(
    path.resolve('public/icons/icon-512.png'),
    path.join(OUT_DIR, 'app-icon.png'),
  )

  const browser = await chromium.launch({ headless: true })
  for (const width of widths) {
    await runWidth(browser, width)
  }
  await browser.close()
  console.log(`Phase 4 screenshots written to ${OUT_DIR}`)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
