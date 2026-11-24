import { describe, expect, it } from 'vitest'
import {
  createSeedWorkouts,
  SEED_BOOKING_COUNT,
  SEED_DISTINCT_DATES,
} from '../data/seedWorkouts'
import {
  applyFlexibleDecision,
  confirmBookingCanceled,
  getEarliestDecisionDeadline,
  getUnconfirmedCancellations,
  groupWorkoutsByDate,
  hasUnresolvedFlexibleBookings,
  markWorkoutCompleted,
  needsCancellationReminder,
  reverseWorkoutCompletion,
} from './attendance'
import { getDecisionDeadline, getEveningReminder } from './dates'
import {
  computeProgressStats,
  getMilestoneIdsForDays,
  getNewlyUnlockedMilestones,
  heartSlotsForGoal,
} from './progress'
import { LAST_SEEN_BUILD_KEY, PENDING_WELCOME_REPLAY_KEY } from '../types/workout'
import {
  consumeWelcomeReplayOnBoot,
  createInitialState,
  exportState,
  isValidPersistedState,
  markWelcomeReplayFinished,
  markWelcomeReplayPending,
  parseImportedState,
  resetWelcomeReplayConsumeLatch,
} from './storage'
import type { Workout } from '../types/workout'

function dec13(workouts: Workout[]) {
  return workouts.filter((w) => w.date === '2026-12-13')
}

describe('seed schedule integrity', () => {
  it('contains 13 bookings across 12 distinct dates', () => {
    const workouts = createSeedWorkouts()
    expect(SEED_BOOKING_COUNT).toBe(13)
    expect(SEED_DISTINCT_DATES).toBe(12)
    expect(workouts).toHaveLength(13)
    expect(new Set(workouts.map((w) => w.date)).size).toBe(12)
  })

  it('marks multi-booking days as pending and singles as planned', () => {
    const workouts = createSeedWorkouts()
    const grouped = groupWorkoutsByDate(workouts)
    for (const [, day] of grouped) {
      if (day.length > 1) {
        expect(day.every((w) => w.attendanceStatus === 'pending')).toBe(true)
      } else {
        expect(day[0].attendanceStatus).toBe('planned')
      }
    }
  })
})

describe('flexible booking decisions', () => {
  it('allows selecting one class without canceling the sibling reservation', () => {
    const day = dec13(createSeedWorkouts())
    const morning = day.find((w) => w.startTime === '11:00')!
    const updated = applyFlexibleDecision(day, [morning.id])
    const selected = updated.find((w) => w.id === morning.id)!
    const other = updated.find((w) => w.id !== morning.id)!

    expect(selected.attendanceStatus).toBe('planned')
    expect(other.attendanceStatus).toBe('not_attending')
    expect(other.bookingCanceledInApp).toBeUndefined()
    expect(needsCancellationReminder(other)).toBe(true)
  })

  it('supports selecting both classes', () => {
    const day = dec13(createSeedWorkouts())
    const updated = applyFlexibleDecision(
      day,
      day.map((w) => w.id),
    )
    expect(updated.every((w) => w.attendanceStatus === 'planned')).toBe(true)
    expect(updated.every((w) => w.bookingCanceledInApp !== true)).toBe(true)
  })

  it('supports decide later / partial resolve and changing decisions', () => {
    const day = dec13(createSeedWorkouts())
    const morning = day.find((w) => w.startTime === '11:00')!
    const evening = day.find((w) => w.startTime === '17:20')!

    let updated = applyFlexibleDecision(day, [morning.id])
    expect(hasUnresolvedFlexibleBookings(updated)).toBe(false)

    updated = applyFlexibleDecision(updated, [])
    expect(updated.every((w) => w.attendanceStatus === 'pending')).toBe(true)
    expect(hasUnresolvedFlexibleBookings(updated)).toBe(true)

    updated = applyFlexibleDecision(updated, [evening.id])
    expect(updated.find((w) => w.id === evening.id)?.attendanceStatus).toBe(
      'planned',
    )
  })

  it('does not overwrite completed workouts when changing decisions', () => {
    const day = dec13(createSeedWorkouts())
    const morning = day.find((w) => w.startTime === '11:00')!
    const evening = day.find((w) => w.startTime === '17:20')!
    const withCompleted = day.map((w) =>
      w.id === morning.id ? markWorkoutCompleted(w) : w,
    )

    const updated = applyFlexibleDecision(withCompleted, [evening.id])
    expect(updated.find((w) => w.id === morning.id)?.attendanceStatus).toBe(
      'completed',
    )
    expect(updated.find((w) => w.id === evening.id)?.attendanceStatus).toBe(
      'planned',
    )
  })

  it('keeps cancellation reminders until manually confirmed', () => {
    const day = dec13(createSeedWorkouts())
    const morning = day.find((w) => w.startTime === '11:00')!
    let updated = applyFlexibleDecision(day, [morning.id])
    const other = updated.find((w) => w.id !== morning.id)!

    expect(getUnconfirmedCancellations(updated)).toHaveLength(1)

    const confirmed = confirmBookingCanceled(other)
    updated = updated.map((w) => (w.id === other.id ? confirmed : w))
    expect(getUnconfirmedCancellations(updated)).toHaveLength(0)
    expect(needsCancellationReminder(confirmed)).toBe(false)
  })
})

describe('decision deadlines', () => {
  it('calculates December 13 deadlines correctly for a 10-hour preference', () => {
    const morning = getDecisionDeadline('2026-12-13', '11:00', 10)
    const evening = getDecisionDeadline('2026-12-13', '17:20', 10)
    const reminder = getEveningReminder('2026-12-13', 20)

    // Compare via UTC ISO parts that encode LA wall times through fromZonedTime
    expect(morning.toISOString()).toBe(
      getDecisionDeadline('2026-12-13', '11:00', 10).toISOString(),
    )

    // 11:00 - 10h = 01:00 same day; 17:20 - 10h = 07:20 same day
    const morningLabel = morning.toLocaleString('en-US', {
      timeZone: 'America/Los_Angeles',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
    const eveningLabel = evening.toLocaleString('en-US', {
      timeZone: 'America/Los_Angeles',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
    const reminderLabel = reminder.toLocaleString('en-US', {
      timeZone: 'America/Los_Angeles',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })

    expect(morningLabel.replace(/\u202f/g, ' ')).toBe('1:00 AM')
    expect(eveningLabel.replace(/\u202f/g, ' ')).toBe('7:20 AM')
    expect(reminderLabel.replace(/\u202f/g, ' ')).toBe('Dec 12, 8:00 PM')

    const day = dec13(createSeedWorkouts())
    const earliest = getEarliestDecisionDeadline(day, 10)!
    expect(earliest.getTime()).toBe(morning.getTime())
  })
})

describe('completion and progress', () => {
  it('counts two Dec 13 completions as two classes, 80 minutes, one day', () => {
    const workouts = createSeedWorkouts()
    const day = dec13(workouts)
    const completedDay = day.map((w) => markWorkoutCompleted(w))
    const next = workouts.map(
      (w) => completedDay.find((c) => c.id === w.id) ?? w,
    )
    const stats = computeProgressStats(next)
    expect(stats.completedClasses).toBe(2)
    expect(stats.completedMinutes).toBe(80)
    expect(stats.completedWorkoutDays).toBe(1)
  })

  it('does not award progress for selection alone', () => {
    const workouts = createSeedWorkouts()
    const day = dec13(workouts)
    const planned = applyFlexibleDecision(
      day,
      day.map((w) => w.id),
    )
    const next = workouts.map((w) => planned.find((p) => p.id === w.id) ?? w)
    const stats = computeProgressStats(next)
    expect(stats.completedClasses).toBe(0)
    expect(stats.completedWorkoutDays).toBe(0)
  })

  it('supports completion reversal', () => {
    const workout = markWorkoutCompleted(createSeedWorkouts()[0])
    const reversed = reverseWorkoutCompletion(workout)
    expect(reversed.attendanceStatus).toBe('planned')
    expect(reversed.completedAt).toBeUndefined()
  })

  it('generates ten collectible hearts for the Soliday goal', async () => {
    const { SOLIDAY_GOAL_DAYS } = await import('../data/challenge')
    expect(heartSlotsForGoal(SOLIDAY_GOAL_DAYS)).toHaveLength(10)
    expect(heartSlotsForGoal(SOLIDAY_GOAL_DAYS)).toHaveLength(SOLIDAY_GOAL_DAYS)
  })

  it('unlocks milestones at 1, 3, 6, 9 and final at 10', () => {
    expect(getMilestoneIdsForDays(1, 10)).toEqual(['first'])
    expect(getMilestoneIdsForDays(6, 10)).toEqual(['first', 'three', 'six'])
    expect(getMilestoneIdsForDays(9, 10)).toEqual([
      'first',
      'three',
      'six',
      'nine',
    ])
    expect(getMilestoneIdsForDays(9, 10)).not.toContain('twelve')
    expect(getMilestoneIdsForDays(10, 10)).toContain('twelve')
    expect(getNewlyUnlockedMilestones(3, 10, ['first'])).toEqual(['three'])
  })

  it('counts only completed days inside Dec 3–17 for challenge progress', () => {
    const workouts = createSeedWorkouts()
    const withOutside = [
      ...workouts,
      {
        ...workouts[0],
        id: 'outside-before',
        date: '2026-12-02',
        attendanceStatus: 'completed' as const,
        completedAt: '2026-12-02T20:00:00.000Z',
      },
      {
        ...workouts[0],
        id: 'outside-after',
        date: '2026-12-18',
        attendanceStatus: 'completed' as const,
        completedAt: '2026-12-18T20:00:00.000Z',
      },
    ]
    const edges = withOutside.map((w) =>
      w.date === '2026-12-03' || w.date === '2026-12-17'
        ? {
            ...w,
            attendanceStatus: 'completed' as const,
            completedAt: `${w.date}T20:00:00.000Z`,
          }
        : w,
    )
    const stats = computeProgressStats(edges)
    expect(stats.completedWorkoutDays).toBe(2)
    expect(stats.completedClasses).toBeGreaterThanOrEqual(4)
  })
})

describe('persistence and onboarding', () => {
  it('creates initial state with onboarding incomplete and seed workouts', () => {
    const state = createInitialState()
    expect(state.onboardingCompleted).toBe(false)
    expect(state.workouts).toHaveLength(13)
    expect(state.settings.goalWorkoutDays).toBe(10)
    expect(state.openedOpenWhenLetters).toEqual([])
    expect(state.finalSurpriseSeen).toBe(false)
    expect(isValidPersistedState(state)).toBe(true)
  })

  it('forces legacy goal of 12 to the fixed challenge goal of 10', () => {
    const legacy = createInitialState()
    legacy.settings.goalWorkoutDays = 12
    const restored = parseImportedState(JSON.stringify(legacy))
    expect(restored.settings.goalWorkoutDays).toBe(10)
    expect(restored.workouts).toHaveLength(legacy.workouts.length)
  })

  it('defaults missing finalSurpriseSeen to false without wiping data', () => {
    const legacy = createInitialState()
    const { finalSurpriseSeen: _removed, ...without } = legacy
    expect(isValidPersistedState(without)).toBe(true)
    expect(parseImportedState(JSON.stringify(without)).finalSurpriseSeen).toBe(
      false,
    )
  })

  it('validates imported JSON and rejects invalid payloads', () => {
    const valid = createInitialState()
    valid.onboardingCompleted = true
    expect(parseImportedState(JSON.stringify(valid)).onboardingCompleted).toBe(
      true,
    )
    expect(() => parseImportedState('{"version":1}')).toThrow()
    expect(isValidPersistedState({ version: 1 })).toBe(false)
  })

  it('migrates legacy payloads missing openedOpenWhenLetters', () => {
    const legacy = createInitialState()
    const { openedOpenWhenLetters: _removed, ...without } = legacy
    expect(isValidPersistedState(without)).toBe(true)
    expect(
      parseImportedState(JSON.stringify(without)).openedOpenWhenLetters,
    ).toEqual([])
  })

  it('replays welcome gift on new build or explicit update refresh', () => {
    const store = new Map<string, string>()
    const local = {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, value)
      },
      removeItem: (key: string) => {
        store.delete(key)
      },
      clear: () => store.clear(),
    }
    Object.defineProperty(globalThis, 'localStorage', {
      value: local,
      configurable: true,
    })

    resetWelcomeReplayConsumeLatch()
    // First-time user: new build tracking must not force a "replay".
    expect(consumeWelcomeReplayOnBoot(false)).toBe(false)
    expect(store.get(LAST_SEEN_BUILD_KEY)).toBeUndefined()

    // Baseline an onboarded user on the current build.
    markWelcomeReplayFinished()
    resetWelcomeReplayConsumeLatch()
    expect(consumeWelcomeReplayOnBoot(true)).toBe(false)

    markWelcomeReplayPending()
    resetWelcomeReplayConsumeLatch()
    expect(consumeWelcomeReplayOnBoot(true)).toBe(true)
    // Sticky until finished — reload still replays.
    expect(store.get(PENDING_WELCOME_REPLAY_KEY)).toBe('1')
    expect(consumeWelcomeReplayOnBoot(true)).toBe(true)

    markWelcomeReplayFinished()
    resetWelcomeReplayConsumeLatch()
    expect(consumeWelcomeReplayOnBoot(true)).toBe(false)

    // Simulate a new deploy for an existing user.
    store.set(LAST_SEEN_BUILD_KEY, 'older-build')
    resetWelcomeReplayConsumeLatch()
    expect(consumeWelcomeReplayOnBoot(true)).toBe(true)
    expect(store.get(PENDING_WELCOME_REPLAY_KEY)).toBe('1')
    expect(store.get(LAST_SEEN_BUILD_KEY)).toBe('older-build')
  })
})

describe('open when letters', () => {
  it('includes four always-available letters with editable content', async () => {
    const { OPEN_WHEN_LETTERS } = await import('../data/openWhenLetters')
    expect(OPEN_WHEN_LETTERS).toHaveLength(4)
    expect(OPEN_WHEN_LETTERS.every((letter) => letter.title && letter.body)).toBe(
      true,
    )
  })

  it('keeps letter bodies out of LocalStorage and uses stable ids', async () => {
    const { LOVE_NOTES } = await import('../data/loveNotes')
    const { OPEN_WHEN_LETTERS } = await import('../data/openWhenLetters')

    const state = createInitialState()
    state.onboardingCompleted = true
    state.unlockedMilestones = ['first', 'three']
    state.openedOpenWhenLetters = ['miss-me', 'tired']
    const exported = exportState(state)

    expect(exported).toContain('"first"')
    expect(exported).toContain('"miss-me"')
    for (const note of LOVE_NOTES) {
      expect(exported).not.toContain(note.letter)
      expect(note.id).toMatch(/^(first|three|six|nine)$/)
    }
    for (const letter of OPEN_WHEN_LETTERS) {
      expect(exported).not.toContain(letter.body)
      expect(letter.id.length).toBeGreaterThan(0)
    }
  })
})

describe('calendar exports', () => {
  it('exports planned workouts with valid UTC times and details', async () => {
    const {
      buildIcsCalendar,
      exportPlannedWorkoutsIcs,
      workoutToCalendarEvent,
      toIcsUtc,
    } = await import('./ics')
    const workouts = createSeedWorkouts()
    const planned = workouts.find((w) => w.attendanceStatus === 'planned')!
    const event = workoutToCalendarEvent(planned)
    const ics = buildIcsCalendar([event])

    expect(ics).toContain('BEGIN:VCALENDAR')
    expect(ics).toContain('BEGIN:VEVENT')
    expect(ics).toContain(planned.classType)
    expect(ics).toContain(planned.instructor)
    expect(ics).toContain(planned.location)
    expect(ics).toContain('DTSTART:')
    expect(toIcsUtc(event.start)).toMatch(/^\d{8}T\d{6}Z$/)
    expect(exportPlannedWorkoutsIcs(workouts)).toContain('BEGIN:VEVENT')
  })

  it('exports flexible decision reminders without treating pending as attendance', async () => {
    const {
      exportFlexibleDecisionRemindersIcs,
      exportPlannedWorkoutsIcs,
    } = await import('./ics')
    const workouts = createSeedWorkouts()
    const reminders = exportFlexibleDecisionRemindersIcs(workouts, 10, 20)
    const planned = exportPlannedWorkoutsIcs(workouts)

    expect(reminders).toContain('Decide:')
    expect(reminders).toContain('soliday-decision-')
    expect(reminders).toContain('soliday-evening-2026-12-13')
    // Pending Dec 13 classes must not appear in planned attendance export
    expect(planned).not.toContain('Lydia E.')
    expect(planned).not.toContain('Marissa B.')
  })

  it('calculates Dec 13 reminder timestamps correctly', async () => {
    const { decisionReminderEvent, eveningReminderEvent } = await import('./ics')
    const day = dec13(createSeedWorkouts())
    const morning = day.find((w) => w.startTime === '11:00')!
    const evening = day.find((w) => w.startTime === '17:20')!
    const morningDeadline = decisionReminderEvent(morning, 10).start
    const eveningDeadline = decisionReminderEvent(evening, 10).start
    const reminder = eveningReminderEvent('2026-12-13', 20, 2).start

    const fmt = (d: Date) =>
      d
        .toLocaleString('en-US', {
          timeZone: 'America/Los_Angeles',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        })
        .replace(/\u202f/g, ' ')

    expect(fmt(morningDeadline)).toBe('Dec 13, 1:00 AM')
    expect(fmt(eveningDeadline)).toBe('Dec 13, 7:20 AM')
    expect(fmt(reminder)).toBe('Dec 12, 8:00 PM')
  })
})
