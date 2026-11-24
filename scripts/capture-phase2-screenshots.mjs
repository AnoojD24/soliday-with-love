import { chromium, devices } from 'playwright'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { createSeedWorkouts } from '../src/data/seedWorkouts.ts'

const BASE_URL = process.env.BASE_URL ?? 'http://127.0.0.1:4173'
const OUT_DIR = path.resolve('screenshots/phase2')
const widths = [320, 375, 390, 430]

function buildFixture(kind) {
  const workouts = createSeedWorkouts()
  const byDate = Object.groupBy
    ? Object.groupBy(workouts, (w) => w.date)
    : workouts.reduce((acc, w) => {
        ;(acc[w.date] ??= []).push(w)
        return acc
      }, {})

  if (kind === 'pre-challenge') {
    return {
      version: 1,
      workouts,
      settings: {
        goalWorkoutDays: 12,
        decisionDeadlineHours: 10,
        eveningReminderHour: 20,
      },
      onboardingCompleted: true,
      unlockedMilestones: [],
      celebratedMilestones: [],
    }
  }

  if (kind === 'flexible-open') {
    return {
      version: 1,
      workouts: workouts.map((w) =>
        w.date < '2026-12-13' && w.attendanceStatus === 'planned'
          ? {
              ...w,
              attendanceStatus: 'completed',
              completedAt: `${w.date}T20:00:00.000Z`,
            }
          : w,
      ),
      settings: {
        goalWorkoutDays: 12,
        decisionDeadlineHours: 10,
        eveningReminderHour: 20,
      },
      onboardingCompleted: true,
      unlockedMilestones: ['first', 'three', 'six'],
      celebratedMilestones: ['first', 'three', 'six'],
    }
  }

  if (kind === 'flexible-partial') {
    const day = byDate['2026-12-13']
    const morning = day.find((w) => w.startTime === '11:00')
    const evening = day.find((w) => w.startTime === '17:20')
    return {
      version: 1,
      workouts: workouts.map((w) => {
        if (w.date < '2026-12-13') {
          return {
            ...w,
            attendanceStatus: 'completed',
            completedAt: `${w.date}T20:00:00.000Z`,
          }
        }
        if (w.id === morning.id) {
          return { ...w, attendanceStatus: 'planned' }
        }
        if (w.id === evening.id) {
          return { ...w, attendanceStatus: 'not_attending' }
        }
        return w
      }),
      settings: {
        goalWorkoutDays: 12,
        decisionDeadlineHours: 10,
        eveningReminderHour: 20,
      },
      onboardingCompleted: true,
      unlockedMilestones: ['first', 'three', 'six'],
      celebratedMilestones: ['first', 'three', 'six'],
    }
  }

  if (kind === 'progress-six') {
    const dates = [...new Set(workouts.map((w) => w.date))].sort().slice(0, 6)
    const dateSet = new Set(dates)
    return {
      version: 1,
      workouts: workouts.map((w) =>
        dateSet.has(w.date)
          ? {
              ...w,
              attendanceStatus: 'completed',
              completedAt: `${w.date}T20:00:00.000Z`,
            }
          : w,
      ),
      settings: {
        goalWorkoutDays: 12,
        decisionDeadlineHours: 10,
        eveningReminderHour: 20,
      },
      onboardingCompleted: true,
      unlockedMilestones: ['first', 'three', 'six'],
      celebratedMilestones: ['first', 'three', 'six'],
    }
  }

  throw new Error(`Unknown fixture ${kind}`)
}

async function seed(page, fixture) {
  await page.addInitScript((data) => {
    localStorage.setItem('soliday-with-love-v1', JSON.stringify(data))
  }, fixture)
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

  // Home before challenge
  let page = await context.newPage()
  await seed(page, buildFixture('pre-challenge'))
  await page.goto(BASE_URL, { waitUntil: 'networkidle' })
  await page.getByRole('heading', { name: /hi, beautiful/i }).waitFor()
  await capture(page, `home-pre-challenge-${width}`)
  await page.close()

  // Home with upcoming flexible decision (after earlier days completed)
  page = await context.newPage()
  await seed(page, buildFixture('flexible-open'))
  await page.goto(BASE_URL, { waitUntil: 'networkidle' })
  await page.getByText(/choose your workout/i).first().waitFor()
  await capture(page, `home-flexible-${width}`)

  // Calendar Dec 13 before selecting
  await page.getByRole('link', { name: 'Calendar' }).click()
  await page.getByRole('heading', { name: 'Calendar' }).waitFor()
  await page.getByRole('button', { name: /December 13/i }).click()
  await page.getByText(/choose your workout/i).first().waitFor()
  await capture(page, `calendar-dec13-open-${width}`)
  await page.close()

  // Dec 13 after selecting one with outstanding cancellation
  page = await context.newPage()
  await seed(page, buildFixture('flexible-partial'))
  await page.goto(`${BASE_URL}/calendar`, { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: /December 13/i }).click()
  await page.getByText(/cancel this unused reservation|cancel this reservation/i).first().waitFor()
  await capture(page, `calendar-dec13-partial-${width}`)
  await page.close()

  // Calendar + Progress at 6 days + With Love unlocked/locked + opened letter
  page = await context.newPage()
  await seed(page, buildFixture('progress-six'))
  await page.goto(`${BASE_URL}/calendar`, { waitUntil: 'networkidle' })
  await capture(page, `calendar-completed-${width}`)

  await page.getByRole('link', { name: 'Progress' }).click()
  await page.getByRole('heading', { name: 'Progress' }).waitFor()
  await capture(page, `progress-six-${width}`)

  await page.getByRole('link', { name: 'With Love' }).click()
  await page.getByRole('heading', { name: 'With Love' }).waitFor()
  await capture(page, `with-love-mixed-${width}`)

  await page.getByRole('button', { name: /Halfway glow/i }).click()
  await page.getByRole('dialog').waitFor()
  await capture(page, `love-letter-open-${width}`)
  await page.close()

  await context.close()
}

async function run() {
  await mkdir(OUT_DIR, { recursive: true })
  const browser = await chromium.launch({ headless: true })
  for (const width of widths) {
    await runWidth(browser, width)
  }
  await browser.close()
  console.log(`Phase 2 screenshots written to ${OUT_DIR}`)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
