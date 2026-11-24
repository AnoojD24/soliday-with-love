import { chromium } from 'playwright'
import { createSeedWorkouts } from '../src/data/seedWorkouts.ts'

const BASE_URL = process.env.BASE_URL ?? 'http://127.0.0.1:4173'

function state(overrides = {}) {
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
    openedOpenWhenLetters: [],
    ...overrides,
  }
}

async function main() {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext()
  const page = await context.newPage()
  const results = []

  function ok(name, pass, detail = '') {
    results.push({ name, pass, detail })
    console.log(`${pass ? 'PASS' : 'FAIL'} · ${name}${detail ? ` — ${detail}` : ''}`)
  }

  page.setDefaultTimeout(20000)

  // SW registration against production preview (registers even on gift welcome)
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' })
  const swAfter = await page.evaluate(async () => {
    if (!('serviceWorker' in navigator)) return { ok: false, detail: 'no SW API' }
    try {
      const ready = await Promise.race([
        navigator.serviceWorker.ready.then((reg) => ({
          ok: true,
          detail: reg.active?.scriptURL ?? 'ready',
        })),
        new Promise((resolve) =>
          setTimeout(() => resolve({ ok: false, detail: 'ready timeout' }), 15000),
        ),
      ])
      if (ready.ok) return ready
      const reg = await navigator.serviceWorker.getRegistration()
      return {
        ok: Boolean(reg),
        detail: reg?.active?.scriptURL ?? reg?.installing?.scriptURL ?? 'no registration',
      }
    } catch (error) {
      return { ok: false, detail: String(error) }
    }
  })
  ok('Service worker registration', swAfter.ok, swAfter.detail)

  // First launch
  await page.evaluate(() => localStorage.clear())
  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.getByRole('button', { name: /unwrap your gift/i }).waitFor()
  ok('First-launch welcome visible after clear', true)
  await page.getByRole('button', { name: /unwrap your gift/i }).click()
  await page.getByRole('button', { name: /let's sleigh/i }).waitFor({ timeout: 12000 })
  await page.getByRole('button', { name: /let's sleigh/i }).click()
  await page.getByRole('heading', { name: /hi, beautiful/i }).waitFor()
  ok('Unwrap transitions to Home', true)

  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.getByRole('heading', { name: /hi, beautiful/i }).waitFor()
  const welcomeAgain = await page.getByRole('button', { name: /unwrap your gift/i }).count()
  ok('Returning visit skips onboarding', welcomeAgain === 0)

  // Offline navigation
  await page.evaluate((payload) => {
    localStorage.setItem('soliday-with-love-v1', JSON.stringify(payload))
  }, state())
  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(2000)
  await context.setOffline(true)
  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.getByRole('heading', { name: /hi, beautiful/i }).waitFor()
  ok('Offline home loads after cache', true)
  await page.getByRole('link', { name: 'Calendar' }).click()
  await page.getByRole('heading', { name: 'Calendar' }).waitFor()
  ok('Offline calendar navigation', true)
  await page.getByRole('link', { name: 'With Love' }).click()
  await page.getByRole('heading', { name: 'With Love' }).waitFor()
  ok('Offline With Love navigation', true)
  await page.getByRole('button', { name: /Open when you miss me/i }).click()
  await page.getByRole('dialog').waitFor()
  ok('Open When letters work offline', true)
  await context.setOffline(false)

  // Open When independent of progress
  await page.evaluate((payload) => {
    localStorage.setItem('soliday-with-love-v1', JSON.stringify(payload))
  }, state())
  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.getByRole('link', { name: 'With Love' }).click()
  await page.getByText('Open when...').waitFor()
  const openWhenCount = await page.getByRole('button', { name: /Open when you/i }).count()
  ok('Open When available with zero completions', openWhenCount >= 6)

  // Install guide in settings
  await page.getByRole('link', { name: 'Progress' }).click()
  await page.getByRole('button', { name: 'Settings' }).click()
  await page.getByText(/take me with you/i).waitFor()
  ok('Install guide visible in Settings', true)

  await browser.close()

  const failed = results.filter((r) => !r.pass)
  console.log(`\nQA summary: ${results.length - failed.length}/${results.length} passed`)
  if (failed.length) process.exit(1)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
