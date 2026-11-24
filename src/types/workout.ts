import { SOLIDAY_GOAL_DAYS } from '../data/challenge'

export type AttendanceStatus =
  | 'pending'
  | 'planned'
  | 'not_attending'
  | 'completed'

export type MuscleFocus =
  | 'Hamstrings'
  | 'Center Glutes'
  | 'Outer Glutes'
  | 'Inner Thighs'
  | 'Biceps'
  | 'Triceps'
  | 'Shoulders'
  | 'Back'
  | 'Chest'
  | 'Leg Wrap'
  | 'Arm Wrap'
  | string

export interface WorkoutJournal {
  mood: string
  difficulty: 1 | 2 | 3 | 4 | 5
  notes?: string
}

export interface Workout {
  id: string
  date: string
  startTime: string
  durationMinutes: number
  classType: string
  instructor: string
  location: string
  muscleFocus: MuscleFocus[]
  attendanceStatus: AttendanceStatus
  bookingCanceledInApp?: boolean
  completedAt?: string
  journal?: WorkoutJournal
}

export interface AppSettings {
  goalWorkoutDays: number
  decisionDeadlineHours: number
  eveningReminderHour: number
}

export type MilestoneId =
  | 'first'
  | 'three'
  | 'six'
  | 'nine'
  | 'twelve'

export interface PersistedState {
  version: number
  workouts: Workout[]
  settings: AppSettings
  onboardingCompleted: boolean
  unlockedMilestones: MilestoneId[]
  celebratedMilestones: MilestoneId[]
  /** Open When letters that have been opened at least once */
  openedOpenWhenLetters: string[]
  /** True after the Merry Soliday celebration completes once */
  finalSurpriseSeen: boolean
}

export const DEFAULT_SETTINGS: AppSettings = {
  goalWorkoutDays: SOLIDAY_GOAL_DAYS,
  decisionDeadlineHours: 10,
  eveningReminderHour: 20,
}

export const STORAGE_VERSION = 1
export const STORAGE_KEY = 'soliday-with-love-v1'
/** Set before SW refresh so the next boot replays the welcome gift. */
export const PENDING_WELCOME_REPLAY_KEY = 'soliday-pending-welcome-replay'
export const TIMEZONE = 'America/Los_Angeles'
