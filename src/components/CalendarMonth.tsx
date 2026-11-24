import { format } from 'date-fns'
import type { Workout } from '../types/workout'
import {
  getDayVisualStatus,
  groupWorkoutsByDate,
  type DayVisualStatus,
} from '../utils/attendance'
import {
  getMonthGrid,
  isCurrentMonth,
  isTodayInLA,
  toDateKey,
} from '../utils/dates'
import { HeartMark, SnowflakeMark } from './illustrations/Ornaments'

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

interface CalendarMonthProps {
  visibleMonth: Date
  selectedDate: string
  workouts: Workout[]
  onSelectDate: (dateKey: string) => void
}

const dayTone: Record<DayVisualStatus, string> = {
  rest: 'bg-transparent text-berry/55',
  planned: 'bg-blush text-berry',
  flexible: 'bg-lavender text-berry',
  completed: 'bg-sage text-[#45634a]',
  mixed: 'bg-sage text-[#45634a]',
}

export function CalendarMonth({
  visibleMonth,
  selectedDate,
  workouts,
  onSelectDate,
}: CalendarMonthProps) {
  const days = getMonthGrid(
    visibleMonth.getFullYear(),
    visibleMonth.getMonth(),
  )
  const grouped = groupWorkoutsByDate(workouts)

  return (
    <section className="rounded-[2rem] border border-blush/70 bg-white/80 p-4 shadow-[var(--shadow-soft)]">
      <div className="mb-4 text-center">
        <p className="font-display text-xl text-berry">
          {format(visibleMonth, 'MMMM yyyy')}
        </p>
        <div className="mt-1 flex items-center justify-center gap-2 text-[11px] text-rose">
          <SnowflakeMark className="h-3.5 w-3.5" />
          <span>Your Soliday month</span>
          <SnowflakeMark className="h-3.5 w-3.5" />
        </div>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[11px] font-medium tracking-wide text-rose">
        {WEEKDAYS.map((day, index) => (
          <div key={`${day}-${index}`} className="py-1">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const key = toDateKey(day)
          const inMonth = isCurrentMonth(day, visibleMonth)
          const dayWorkouts = grouped.get(key) ?? []
          const status = getDayVisualStatus(dayWorkouts)
          const selected = key === selectedDate
          const today = isTodayInLA(day)
          const pendingCount = dayWorkouts.filter(
            (w) => w.attendanceStatus === 'pending',
          ).length
          const showCount = dayWorkouts.length > 1 && inMonth
          const showHeart =
            inMonth &&
            (status === 'completed' ||
              (status === 'mixed' &&
                dayWorkouts.some((w) => w.attendanceStatus === 'completed')))

          return (
            <button
              key={key}
              type="button"
              disabled={!inMonth}
              onClick={() => {
                if (inMonth) onSelectDate(key)
              }}
              className={`relative flex min-h-11 flex-col items-center justify-center rounded-2xl text-sm transition-colors ${
                inMonth ? dayTone[status] : 'cursor-default text-berry/25'
              } ${selected ? 'ring-2 ring-berry ring-offset-2 ring-offset-white' : ''} ${
                today && !selected && inMonth
                  ? 'outline outline-1 outline-rose/50'
                  : ''
              }`}
              aria-label={`${format(day, 'MMMM d')}${
                dayWorkouts.length
                  ? `, ${dayWorkouts.length} workout${dayWorkouts.length > 1 ? 's' : ''}`
                  : ', rest day'
              }${pendingCount ? ', decision pending' : ''}`}
              aria-pressed={selected}
            >
              <span className={inMonth ? 'font-medium' : ''}>
                {format(day, 'd')}
              </span>
              {showHeart && (
                <span className="absolute bottom-0.5">
                  <HeartMark className="h-2.5 w-2.5" />
                </span>
              )}
              {showCount && !showHeart && (
                <span className="absolute bottom-0.5 text-[9px] font-semibold text-berry/70">
                  {dayWorkouts.length}
                </span>
              )}
              {showCount && showHeart && pendingCount > 0 && (
                <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-berry" />
              )}
            </button>
          )
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-[11px] text-rose">
        <Legend swatch="bg-blush" label="Planned" />
        <Legend swatch="bg-lavender" label="Flexible" />
        <Legend swatch="bg-sage" label="Completed" />
      </div>
    </section>
  )
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`h-2.5 w-2.5 rounded-full ${swatch}`} />
      {label}
    </span>
  )
}
