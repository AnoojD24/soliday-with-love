import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isSameDay,
  isSameMonth,
  startOfMonth,
  subHours,
} from 'date-fns'
import { formatInTimeZone, fromZonedTime, toZonedTime } from 'date-fns-tz'
import { TIMEZONE } from '../types/workout'

export function nowInLA(): Date {
  return toZonedTime(new Date(), TIMEZONE)
}

export function formatLADate(date: Date, pattern = 'EEEE, MMMM d'): string {
  return formatInTimeZone(date, TIMEZONE, pattern)
}

export function toDateKey(date: Date): string {
  return formatInTimeZone(date, TIMEZONE, 'yyyy-MM-dd')
}

/** Wall-clock date+time in America/Los_Angeles → absolute Date */
export function parseWorkoutDateTime(date: string, startTime: string): Date {
  return fromZonedTime(`${date} ${startTime}:00`, TIMEZONE)
}

export function formatClassTime(startTime: string): string {
  const [hours, minutes] = startTime.split(':').map(Number)
  const date = new Date(2000, 0, 1, hours, minutes, 0, 0)
  return format(date, 'h:mm a')
}

export function getMonthGrid(year: number, monthIndex: number): Date[] {
  const monthStart = startOfMonth(new Date(year, monthIndex, 1))
  const monthEnd = endOfMonth(monthStart)
  const startOffset = getDay(monthStart)
  const gridStart = addDays(monthStart, -startOffset)
  const days = eachDayOfInterval({ start: gridStart, end: monthEnd })

  while (days.length % 7 !== 0) {
    days.push(addDays(days[days.length - 1], 1))
  }

  return days
}

export function isTodayInLA(date: Date): boolean {
  return isSameDay(date, nowInLA())
}

export function isCurrentMonth(date: Date, visibleMonth: Date): boolean {
  return isSameMonth(date, visibleMonth)
}

export function motivationIndexForDate(date: Date, length: number): number {
  const key = toDateKey(date)
  let hash = 0
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash + key.charCodeAt(i) * (i + 1)) % length
  }
  return hash
}

export function getDecisionDeadline(
  date: string,
  startTime: string,
  deadlineHours: number,
): Date {
  return subHours(parseWorkoutDateTime(date, startTime), deadlineHours)
}

export function getEveningReminder(
  date: string,
  eveningHour: number,
): Date {
  const dayBefore = addDays(fromZonedTime(`${date} 12:00:00`, TIMEZONE), -1)
  const key = formatInTimeZone(dayBefore, TIMEZONE, 'yyyy-MM-dd')
  const hour = String(eveningHour).padStart(2, '0')
  return fromZonedTime(`${key} ${hour}:00:00`, TIMEZONE)
}

export function formatCountdown(target: Date, now: Date = new Date()): string {
  const diffMs = target.getTime() - now.getTime()
  if (diffMs <= 0) return 'Started'
  const totalMinutes = Math.floor(diffMs / 60000)
  const days = Math.floor(totalMinutes / (60 * 24))
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60)
  const minutes = totalMinutes % 60
  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

export function formatDeadlineLabel(deadline: Date): string {
  return formatInTimeZone(deadline, TIMEZONE, "MMM d 'at' h:mm a")
}
