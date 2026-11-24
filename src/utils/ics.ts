import type { Workout } from '../types/workout'
import {
  formatInTimeZone,
} from 'date-fns-tz'
import { addMinutes } from 'date-fns'
import {
  getDecisionDeadline,
  getEveningReminder,
  parseWorkoutDateTime,
} from './dates'
import { TIMEZONE } from '../types/workout'

export interface CalendarEventInput {
  uid: string
  title: string
  description: string
  location?: string
  start: Date
  end: Date
  alarmMinutesBefore?: number
}

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

/** Format a Date as UTC ICS timestamp */
export function toIcsUtc(date: Date): string {
  return (
    date.getUTCFullYear().toString() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    'T' +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds()) +
    'Z'
  )
}

export function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n')
}

function foldLine(line: string): string {
  if (line.length <= 75) return line
  const parts: string[] = []
  let remaining = line
  parts.push(remaining.slice(0, 75))
  remaining = remaining.slice(75)
  while (remaining.length > 0) {
    parts.push(` ${remaining.slice(0, 74)}`)
    remaining = remaining.slice(74)
  }
  return parts.join('\r\n')
}

export function buildIcsCalendar(events: CalendarEventInput[]): string {
  const stamp = toIcsUtc(new Date())
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Solidays With Love//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ]

  for (const event of events) {
    lines.push('BEGIN:VEVENT')
    lines.push(`UID:${event.uid}`)
    lines.push(`DTSTAMP:${stamp}`)
    lines.push(`DTSTART:${toIcsUtc(event.start)}`)
    lines.push(`DTEND:${toIcsUtc(event.end)}`)
    lines.push(`SUMMARY:${escapeIcsText(event.title)}`)
    lines.push(`DESCRIPTION:${escapeIcsText(event.description)}`)
    if (event.location) {
      lines.push(`LOCATION:${escapeIcsText(event.location)}`)
    }
    if (event.alarmMinutesBefore != null) {
      lines.push('BEGIN:VALARM')
      lines.push('ACTION:DISPLAY')
      lines.push(`DESCRIPTION:${escapeIcsText(event.title)}`)
      lines.push(`TRIGGER:-PT${event.alarmMinutesBefore}M`)
      lines.push('END:VALARM')
    }
    lines.push('END:VEVENT')
  }

  lines.push('END:VCALENDAR')
  return `${lines.map(foldLine).join('\r\n')}\r\n`
}

export function workoutToCalendarEvent(workout: Workout): CalendarEventInput {
  const start = parseWorkoutDateTime(workout.date, workout.startTime)
  const end = addMinutes(start, workout.durationMinutes)
  const muscles = workout.muscleFocus.join(', ')
  const description = [
    `${workout.classType}`,
    `Instructor: ${workout.instructor}`,
    `Studio: ${workout.location}`,
    `Focus: ${muscles}`,
    '',
    'Exported from Solidays With Love.',
    'This calendar event does not create or cancel solidcore reservations.',
  ].join('\n')

  return {
    uid: `soliday-workout-${workout.id}@soliday-with-love`,
    title: `solidcore · ${workout.classType}`,
    description,
    location: workout.location,
    start,
    end,
    alarmMinutesBefore: 60,
  }
}

export function decisionReminderEvent(
  workout: Workout,
  deadlineHours: number,
): CalendarEventInput {
  const deadline = getDecisionDeadline(
    workout.date,
    workout.startTime,
    deadlineHours,
  )
  const label = formatInTimeZone(
    parseWorkoutDateTime(workout.date, workout.startTime),
    TIMEZONE,
    'h:mm a',
  )
  return {
    uid: `soliday-decision-${workout.id}@soliday-with-love`,
    title: `Decide: ${workout.classType} (${label})`,
    description: [
      `Personal decision reminder for ${workout.classType} with ${workout.instructor}.`,
      `This is your personal preference timing, not a verified solidcore cancellation policy.`,
      'Cancel unused reservations separately in the official solidcore app.',
    ].join('\n'),
    location: workout.location,
    start: deadline,
    end: addMinutes(deadline, 15),
    alarmMinutesBefore: 0,
  }
}

export function eveningReminderEvent(
  date: string,
  eveningHour: number,
  sessionCount: number,
): CalendarEventInput {
  const start = getEveningReminder(date, eveningHour)
  return {
    uid: `soliday-evening-${date}@soliday-with-love`,
    title: `Solidays decision reminder · ${date}`,
    description: [
      `Gentle reminder: ${sessionCount} flexible booking${sessionCount > 1 ? 's' : ''} tomorrow still need a choice.`,
      'Open Solidays With Love to decide — and cancel unused reservations in the solidcore app separately.',
      'This reminder uses your personal preference, not official studio policy.',
    ].join('\n'),
    start,
    end: addMinutes(start, 15),
    alarmMinutesBefore: 0,
  }
}

export function downloadIcs(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

export function exportPlannedWorkoutsIcs(workouts: Workout[]): string {
  const planned = workouts
    .filter((w) => w.attendanceStatus === 'planned')
    .sort((a, b) =>
      `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`),
    )
  return buildIcsCalendar(planned.map(workoutToCalendarEvent))
}

export function exportFlexibleDecisionRemindersIcs(
  workouts: Workout[],
  deadlineHours: number,
  eveningHour: number,
): string {
  const pendingByDate = new Map<string, Workout[]>()
  for (const workout of workouts) {
    if (workout.attendanceStatus !== 'pending') continue
    const list = pendingByDate.get(workout.date) ?? []
    list.push(workout)
    pendingByDate.set(workout.date, list)
  }

  const events: CalendarEventInput[] = []
  for (const [date, dayWorkouts] of [...pendingByDate.entries()].sort()) {
    if (dayWorkouts.length < 2) continue
    for (const workout of dayWorkouts) {
      events.push(decisionReminderEvent(workout, deadlineHours))
    }
    events.push(eveningReminderEvent(date, eveningHour, dayWorkouts.length))
  }

  return buildIcsCalendar(events)
}
