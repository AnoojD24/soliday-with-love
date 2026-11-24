import type { MilestoneId, Workout } from '../types/workout'
import { needsCancellationReminder } from './attendance'

export interface ProgressStats {
  completedWorkoutDays: number
  completedClasses: number
  completedMinutes: number
  upcomingPlanned: number
  pendingDecisions: number
  unconfirmedCancellations: number
  instructorFrequency: Record<string, number>
  muscleFrequency: Record<string, number>
}

const MILESTONE_THRESHOLDS: { id: MilestoneId; days: number }[] = [
  { id: 'first', days: 1 },
  { id: 'three', days: 3 },
  { id: 'six', days: 6 },
  { id: 'nine', days: 9 },
  { id: 'twelve', days: 12 },
]

export function computeProgressStats(workouts: Workout[]): ProgressStats {
  const completed = workouts.filter((w) => w.attendanceStatus === 'completed')
  const completedDays = new Set(completed.map((w) => w.date))

  const instructorFrequency: Record<string, number> = {}
  const muscleFrequency: Record<string, number> = {}

  for (const workout of completed) {
    instructorFrequency[workout.instructor] =
      (instructorFrequency[workout.instructor] ?? 0) + 1
    for (const muscle of workout.muscleFocus) {
      muscleFrequency[muscle] = (muscleFrequency[muscle] ?? 0) + 1
    }
  }

  const pendingByDate = new Map<string, Workout[]>()
  for (const workout of workouts) {
    const list = pendingByDate.get(workout.date) ?? []
    list.push(workout)
    pendingByDate.set(workout.date, list)
  }

  let pendingDecisions = 0
  for (const dayWorkouts of pendingByDate.values()) {
    if (
      dayWorkouts.length > 1 &&
      dayWorkouts.some((w) => w.attendanceStatus === 'pending')
    ) {
      pendingDecisions += 1
    }
  }

  return {
    completedWorkoutDays: completedDays.size,
    completedClasses: completed.length,
    completedMinutes: completed.reduce((sum, w) => sum + w.durationMinutes, 0),
    upcomingPlanned: workouts.filter((w) => w.attendanceStatus === 'planned')
      .length,
    pendingDecisions,
    unconfirmedCancellations: workouts.filter(needsCancellationReminder).length,
    instructorFrequency,
    muscleFrequency,
  }
}

export function getMilestoneIdsForDays(
  completedDays: number,
  goalWorkoutDays: number,
): MilestoneId[] {
  return MILESTONE_THRESHOLDS.filter((m) => {
    if (m.id === 'twelve') return completedDays >= goalWorkoutDays
    return completedDays >= m.days
  }).map((m) => m.id)
}

export function getNewlyUnlockedMilestones(
  completedDays: number,
  goalWorkoutDays: number,
  alreadyUnlocked: MilestoneId[],
): MilestoneId[] {
  const unlocked = new Set(alreadyUnlocked)
  return getMilestoneIdsForDays(completedDays, goalWorkoutDays).filter(
    (id) => !unlocked.has(id),
  )
}

export function getNewlyAchievedCelebrations(
  completedDays: number,
  goalWorkoutDays: number,
  alreadyCelebrated: MilestoneId[],
): MilestoneId[] {
  const celebrated = new Set(alreadyCelebrated)
  return getMilestoneIdsForDays(completedDays, goalWorkoutDays).filter(
    (id) => !celebrated.has(id),
  )
}

export function heartSlotsForGoal(goalWorkoutDays: number): number[] {
  return Array.from({ length: Math.max(goalWorkoutDays, 0) }, (_, i) => i)
}

export { MILESTONE_THRESHOLDS }
