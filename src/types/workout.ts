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
}

export const DEFAULT_SETTINGS: AppSettings = {
  goalWorkoutDays: 12,
  decisionDeadlineHours: 10,
  eveningReminderHour: 20,
}

export const STORAGE_VERSION = 1
export const STORAGE_KEY = 'soliday-with-love-v1'
export const TIMEZONE = 'America/Los_Angeles'
