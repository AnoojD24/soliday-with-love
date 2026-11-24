import { createSeedWorkouts } from '../data/seedWorkouts'
import {
  DEFAULT_SETTINGS,
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

/** Accepts current + legacy payloads missing openedOpenWhenLetters */
export function isValidPersistedState(value: unknown): value is PersistedState {
  if (!isObject(value)) return false
  const openedOk =
    value.openedOpenWhenLetters === undefined ||
    isStringArray(value.openedOpenWhenLetters)
  return (
    value.version === STORAGE_VERSION &&
    Array.isArray(value.workouts) &&
    value.workouts.every(isValidWorkout) &&
    isValidSettings(value.settings) &&
    typeof value.onboardingCompleted === 'boolean' &&
    isMilestoneArray(value.unlockedMilestones) &&
    isMilestoneArray(value.celebratedMilestones) &&
    openedOk
  )
}

export function normalizePersistedState(
  value: PersistedState | Omit<PersistedState, 'openedOpenWhenLetters'> & {
    openedOpenWhenLetters?: string[]
  },
): PersistedState {
  return {
    ...value,
    openedOpenWhenLetters: value.openedOpenWhenLetters ?? [],
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
