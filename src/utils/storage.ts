import { createSeedWorkouts } from '../data/seedWorkouts'
import {
  DEFAULT_SETTINGS,
  LAST_SEEN_BUILD_KEY,
  PENDING_WELCOME_REPLAY_KEY,
  STORAGE_KEY,
  STORAGE_VERSION,
  type AppSettings,
  type MilestoneId,
  type PersistedState,
  type Workout,
  type WorkoutJournal,
} from '../types/workout'

const MILESTONE_IDS: MilestoneId[] = [
  'first',
  'three',
  'six',
  'nine',
  'twelve',
]

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isAttendanceStatus(value: unknown): boolean {
  return (
    value === 'pending' ||
    value === 'planned' ||
    value === 'not_attending' ||
    value === 'completed'
  )
}

function isJournal(value: unknown): value is WorkoutJournal {
  if (!isObject(value)) return false
  const difficulty = value.difficulty
  return (
    typeof value.mood === 'string' &&
    (difficulty === 1 ||
      difficulty === 2 ||
      difficulty === 3 ||
      difficulty === 4 ||
      difficulty === 5) &&
    (value.notes === undefined || typeof value.notes === 'string')
  )
}

export function isValidWorkout(value: unknown): value is Workout {
  if (!isObject(value)) return false
  return (
    typeof value.id === 'string' &&
    typeof value.date === 'string' &&
    typeof value.startTime === 'string' &&
    typeof value.durationMinutes === 'number' &&
    typeof value.classType === 'string' &&
    typeof value.instructor === 'string' &&
    typeof value.location === 'string' &&
    Array.isArray(value.muscleFocus) &&
    value.muscleFocus.every((m) => typeof m === 'string') &&
    isAttendanceStatus(value.attendanceStatus) &&
    (value.bookingCanceledInApp === undefined ||
      typeof value.bookingCanceledInApp === 'boolean') &&
    (value.completedAt === undefined || typeof value.completedAt === 'string') &&
    (value.journal === undefined || isJournal(value.journal))
  )
}

function isValidSettings(value: unknown): value is AppSettings {
  if (!isObject(value)) return false
  return (
    typeof value.goalWorkoutDays === 'number' &&
    value.goalWorkoutDays > 0 &&
    typeof value.decisionDeadlineHours === 'number' &&
    value.decisionDeadlineHours > 0 &&
    typeof value.eveningReminderHour === 'number' &&
    value.eveningReminderHour >= 0 &&
    value.eveningReminderHour <= 23
  )
}

function isMilestoneArray(value: unknown): value is MilestoneId[] {
  return (
    Array.isArray(value) &&
    value.every((item) => MILESTONE_IDS.includes(item as MilestoneId))
  )
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

/** Accepts current + legacy payloads missing openedOpenWhenLetters / finalSurpriseSeen */
export function isValidPersistedState(value: unknown): value is PersistedState {
  if (!isObject(value)) return false
  const openedOk =
    value.openedOpenWhenLetters === undefined ||
    isStringArray(value.openedOpenWhenLetters)
  const finalSeenOk =
    value.finalSurpriseSeen === undefined ||
    typeof value.finalSurpriseSeen === 'boolean'
  return (
    value.version === STORAGE_VERSION &&
    Array.isArray(value.workouts) &&
    value.workouts.every(isValidWorkout) &&
    isValidSettings(value.settings) &&
    typeof value.onboardingCompleted === 'boolean' &&
    isMilestoneArray(value.unlockedMilestones) &&
    isMilestoneArray(value.celebratedMilestones) &&
    openedOk &&
    finalSeenOk
  )
}

export function normalizePersistedState(
  value: PersistedState | (Omit<PersistedState, 'openedOpenWhenLetters' | 'finalSurpriseSeen'> & {
    openedOpenWhenLetters?: string[]
    finalSurpriseSeen?: boolean
  }),
): PersistedState {
  return {
    ...value,
    settings: {
      ...value.settings,
      // Fixed Soliday challenge goal — legacy 12 (or any other) cannot override.
      goalWorkoutDays: DEFAULT_SETTINGS.goalWorkoutDays,
    },
    openedOpenWhenLetters: value.openedOpenWhenLetters ?? [],
    finalSurpriseSeen: value.finalSurpriseSeen ?? false,
  }
}

export function createInitialState(): PersistedState {
  return {
    version: STORAGE_VERSION,
    workouts: createSeedWorkouts(),
    settings: { ...DEFAULT_SETTINGS },
    onboardingCompleted: false,
    unlockedMilestones: [],
    celebratedMilestones: [],
    openedOpenWhenLetters: [],
    finalSurpriseSeen: false,
  }
}

export function loadState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createInitialState()

    const parsed: unknown = JSON.parse(raw)
    if (isValidPersistedState(parsed)) {
      return normalizePersistedState(parsed)
    }

    console.warn('Soliday: invalid LocalStorage payload, reseeding safely.')
    return createInitialState()
  } catch {
    console.warn('Soliday: corrupt LocalStorage payload, reseeding safely.')
    return createInitialState()
  }
}

export function saveState(state: PersistedState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function exportState(state: PersistedState): string {
  return JSON.stringify(state, null, 2)
}

export function parseImportedState(raw: string): PersistedState {
  const parsed: unknown = JSON.parse(raw)
  if (!isValidPersistedState(parsed)) {
    throw new Error('Imported data failed validation.')
  }
  return normalizePersistedState(parsed)
}

/** Survives React StrictMode double-mount in the same JS realm. */
let welcomeReplayConsumed: boolean | null = null

export function getSolidayBuildId(): string {
  try {
    return typeof __SOLIDAY_BUILD_ID__ === 'string' && __SOLIDAY_BUILD_ID__
      ? __SOLIDAY_BUILD_ID__
      : 'dev'
  } catch {
    return 'dev'
  }
}

/** Mark that the next page load should open the welcome gift (PWA update refresh). */
export function markWelcomeReplayPending(): void {
  welcomeReplayConsumed = null
  try {
    // localStorage survives SW reclaim better than sessionStorage across updates.
    localStorage.setItem(PENDING_WELCOME_REPLAY_KEY, '1')
  } catch {
    // Private mode / blocked storage — gift replay is best-effort.
  }
}

/**
 * After a new deploy (or explicit Refresh), reopen the welcome gift once
 * for users who already finished first onboarding. Progress is untouched.
 */
export function consumeWelcomeReplayOnBoot(onboardingCompleted: boolean): boolean {
  if (welcomeReplayConsumed !== null) return welcomeReplayConsumed

  let pending = false
  let buildChanged = false
  try {
    pending = localStorage.getItem(PENDING_WELCOME_REPLAY_KEY) === '1'
    if (pending) localStorage.removeItem(PENDING_WELCOME_REPLAY_KEY)

    const buildId = getSolidayBuildId()
    const lastSeen = localStorage.getItem(LAST_SEEN_BUILD_KEY)
    buildChanged = lastSeen !== buildId
    if (buildChanged) {
      localStorage.setItem(LAST_SEEN_BUILD_KEY, buildId)
    }
  } catch {
    welcomeReplayConsumed = false
    return false
  }

  // First-time gift is already shown via !onboardingCompleted — only replay after that.
  const replay = onboardingCompleted && (pending || buildChanged)
  welcomeReplayConsumed = replay
  return replay
}

/** @deprecated Use consumeWelcomeReplayOnBoot — kept for tests/compat. */
export function consumeWelcomeReplayPending(): boolean {
  return consumeWelcomeReplayOnBoot(true)
}

/** Test helper — reset in-memory consume latch. */
export function resetWelcomeReplayConsumeLatch(): void {
  welcomeReplayConsumed = null
}
