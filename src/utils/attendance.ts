import type { Workout } from '../types/workout'
import {
  getDecisionDeadline,
  getEveningReminder,
  parseWorkoutDateTime,
} from './dates'

export function groupWorkoutsByDate(
  workouts: Workout[],
): Map<string, Workout[]> {
  const grouped = new Map<string, Workout[]>()
  for (const workout of workouts) {
    const existing = grouped.get(workout.date) ?? []
    existing.push(workout)
    grouped.set(workout.date, existing)
  }
  for (const [, dayWorkouts] of grouped) {
    dayWorkouts.sort((a, b) => a.startTime.localeCompare(b.startTime))
  }
  return grouped
}

export function isFlexibleDay(workouts: Workout[]): boolean {
  return workouts.length > 1
}

export function hasUnresolvedFlexibleBookings(workouts: Workout[]): boolean {
  if (!isFlexibleDay(workouts)) return false
  return workouts.some((workout) => workout.attendanceStatus === 'pending')
}

export type DayVisualStatus =
  | 'rest'
  | 'planned'
  | 'flexible'
  | 'completed'
  | 'mixed'

export function getDayVisualStatus(workouts: Workout[]): DayVisualStatus {
  if (workouts.length === 0) return 'rest'

  const hasPending = workouts.some((w) => w.attendanceStatus === 'pending')
  const hasCompleted = workouts.some((w) => w.attendanceStatus === 'completed')
  const hasPlanned = workouts.some((w) => w.attendanceStatus === 'planned')
  const allCompleted = workouts.every((w) => w.attendanceStatus === 'completed')
  const allNotAttending = workouts.every(
    (w) => w.attendanceStatus === 'not_attending',
  )

  // Outstanding decisions always win visually, even alongside completions
  if (isFlexibleDay(workouts) && hasPending) return 'flexible'
  if (allCompleted) return 'completed'
  if (hasCompleted && (hasPlanned || hasPending)) return 'mixed'
  if (hasPlanned || hasCompleted) return 'planned'
  if (allNotAttending) return 'rest'
  return 'planned'
}

export function getNextRelevantWorkouts(
  workouts: Workout[],
  fromDateKey: string,
): Workout[] {
  const eligible = workouts
    .filter(
      (w) =>
        w.attendanceStatus !== 'completed' &&
        w.attendanceStatus !== 'not_attending' &&
        w.date >= fromDateKey,
    )
    .sort((a, b) =>
      `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`),
    )

  if (eligible.length === 0) return []

  const nextDate = eligible[0].date
  return eligible.filter((w) => w.date === nextDate)
}

export function needsCancellationReminder(workout: Workout): boolean {
  return (
    workout.attendanceStatus === 'not_attending' &&
    workout.bookingCanceledInApp !== true
  )
}

export function getUnconfirmedCancellations(workouts: Workout[]): Workout[] {
  return workouts.filter(needsCancellationReminder)
}

export function getUpcomingFlexibleDecisionDays(
  workouts: Workout[],
  fromDateKey: string,
): string[] {
  const grouped = groupWorkoutsByDate(workouts)
  const dates: string[] = []
  for (const [date, dayWorkouts] of grouped) {
    if (date < fromDateKey) continue
    if (hasUnresolvedFlexibleBookings(dayWorkouts)) {
      dates.push(date)
    }
  }
  return dates.sort()
}

export function getEarliestDecisionDeadline(
  workouts: Workout[],
  deadlineHours: number,
): Date | null {
  const pending = workouts.filter((w) => w.attendanceStatus === 'pending')
  if (pending.length === 0) return null
  const deadlines = pending.map((w) =>
    getDecisionDeadline(w.date, w.startTime, deadlineHours),
  )
  return deadlines.reduce((earliest, current) =>
    current < earliest ? current : earliest,
  )
}

export function getSuggestedEveningReminder(
  date: string,
  eveningHour: number,
): Date {
  return getEveningReminder(date, eveningHour)
}

/**
 * Apply attendance decisions for a flexible day.
 * Never changes bookingCanceledInApp automatically.
 * Never overwrites completed workouts.
 */
export function applyFlexibleDecision(
  dayWorkouts: Workout[],
  selectedIds: string[],
): Workout[] {
  const selected = new Set(selectedIds)
  return dayWorkouts.map((workout) => {
    if (workout.attendanceStatus === 'completed') {
      return workout
    }
    if (selected.size === 0) {
      return {
        ...workout,
        attendanceStatus: 'pending',
        completedAt: undefined,
      }
    }
    if (selected.has(workout.id)) {
      return {
        ...workout,
        attendanceStatus: 'planned',
        completedAt: undefined,
      }
    }
    return {
      ...workout,
      attendanceStatus: 'not_attending',
      completedAt: undefined,
    }
  })
}

export function confirmBookingCanceled(workout: Workout): Workout {
  return { ...workout, bookingCanceledInApp: true }
}

export function clearBookingCanceled(workout: Workout): Workout {
  return { ...workout, bookingCanceledInApp: false }
}

export function markWorkoutCompleted(
  workout: Workout,
  completedAt = new Date().toISOString(),
): Workout {
  return {
    ...workout,
    attendanceStatus: 'completed',
    completedAt,
  }
}

export function reverseWorkoutCompletion(workout: Workout): Workout {
  return {
    ...workout,
    attendanceStatus: 'planned',
    completedAt: undefined,
  }
}

export function isDecisionOverdue(
  workout: Workout,
  deadlineHours: number,
  now: Date = new Date(),
): boolean {
  if (workout.attendanceStatus !== 'pending') return false
  return getDecisionDeadline(workout.date, workout.startTime, deadlineHours) < now
}

export function workoutStartsAt(workout: Workout): Date {
  return parseWorkoutDateTime(workout.date, workout.startTime)
}
