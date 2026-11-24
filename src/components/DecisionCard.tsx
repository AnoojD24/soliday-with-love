import { CalendarPlus } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { Workout } from '../types/workout'
import {
  getEarliestDecisionDeadline,
  getSuggestedEveningReminder,
  isDecisionOverdue,
  needsCancellationReminder,
} from '../utils/attendance'
import {
  formatClassTime,
  formatDeadlineLabel,
  formatLADate,
} from '../utils/dates'
import {
  buildIcsCalendar,
  decisionReminderEvent,
  downloadIcs,
  eveningReminderEvent,
} from '../utils/ics'
import { InstructorAvatar } from './InstructorAvatar'
import { MuscleFocusTags } from './MuscleFocusTags'
import { Pressable } from './ui/Pressable'

interface DecisionCardProps {
  date: string
  workouts: Workout[]
  deadlineHours: number
  eveningReminderHour: number
  onApplyDecision: (selectedIds: string[]) => void
  onConfirmCancellation: (id: string, confirmed: boolean) => void
  compact?: boolean
}

function statusLabel(workout: Workout): string {
  if (workout.attendanceStatus === 'pending') return 'Decision pending'
  if (workout.attendanceStatus === 'planned') return 'Planning to attend'
  if (workout.attendanceStatus === 'completed') return 'Completed'
  if (needsCancellationReminder(workout)) {
    return 'Not attending — cancel in solidcore'
  }
  return 'Not attending — cancellation confirmed'
}

function statusClass(workout: Workout): string {
  if (workout.attendanceStatus === 'pending') return 'bg-lavender text-berry'
  if (workout.attendanceStatus === 'planned') return 'bg-blush text-berry'
  if (workout.attendanceStatus === 'completed') return 'bg-sage text-[#45634a]'
  if (needsCancellationReminder(workout)) {
    return 'bg-[#fff0f3] text-[#9b3a4f] border border-[#f0c9d4]'
  }
  return 'bg-white text-rose border border-blush'
}

export function DecisionCard({
  date,
  workouts,
  deadlineHours,
  eveningReminderHour,
  onApplyDecision,
  onConfirmCancellation,
  compact = false,
}: DecisionCardProps) {
  const initialSelected = workouts
    .filter((w) => w.attendanceStatus === 'planned')
    .map((w) => w.id)
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelected)
  const [mode, setMode] = useState<'choose' | 'idle'>(
    workouts.some((w) => w.attendanceStatus === 'pending') ? 'choose' : 'idle',
  )

  const earliest = useMemo(
    () => getEarliestDecisionDeadline(workouts, deadlineHours),
    [workouts, deadlineHours],
  )
  const evening = useMemo(
    () => getSuggestedEveningReminder(date, eveningReminderHour),
    [date, eveningReminderHour],
  )

  const editable = workouts.filter((w) => w.attendanceStatus !== 'completed')

  function toggle(id: string) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    )
    setMode('choose')
  }

  function decideLater() {
    onApplyDecision([])
    setSelectedIds([])
    setMode('idle')
  }

  function saveSelection() {
    onApplyDecision(selectedIds)
    setMode('idle')
  }

  return (
    <section
      className={`rounded-[1.75rem] border border-lavender bg-lavender/35 shadow-[var(--shadow-soft)] ${
        compact ? 'p-4' : 'p-5'
      }`}
    >
      <p className="text-xs font-medium tracking-[0.12em] text-rose uppercase">
        Choose your workout
      </p>
      <h3 className="mt-1 font-display text-2xl text-berry">
        {formatLADate(new Date(`${date}T12:00:00`), 'MMMM d')}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-berry/75">
        Pick one, both, or decide later. Choosing here never cancels a solidcore
        reservation — cancel unused bookings in the official app separately.
      </p>

      {(earliest || evening) && (
        <div className="mt-3 space-y-1 rounded-2xl bg-white/70 px-3 py-3 text-xs text-berry/80">
          {earliest && (
            <p>
              Earliest personal deadline:{' '}
              <span className="font-medium">{formatDeadlineLabel(earliest)}</span>
            </p>
          )}
          <p>
            Suggested early reminder:{' '}
            <span className="font-medium">{formatDeadlineLabel(evening)}</span>
          </p>
          <p className="text-rose">
            The {deadlineHours}-hour timing is your personal preference, not a
            verified studio policy.
          </p>
        </div>
      )}

      <div className="mt-4 space-y-3">
        {workouts.map((workout) => {
          const selected = selectedIds.includes(workout.id)
          const locked = workout.attendanceStatus === 'completed'
          const overdue = isDecisionOverdue(workout, deadlineHours)
          return (
            <div
              key={workout.id}
              className={`rounded-[1.35rem] border bg-white/90 p-3.5 ${
                selected ? 'border-berry' : 'border-blush/70'
              }`}
            >
              <button
                type="button"
                disabled={locked || mode === 'idle'}
                onClick={() => toggle(workout.id)}
                className="flex w-full items-start gap-3 text-left disabled:cursor-default"
                aria-pressed={selected}
                aria-label={`${workout.classType} with ${workout.instructor}`}
              >
                <InstructorAvatar name={workout.instructor} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-display text-lg text-berry">
                        {formatClassTime(workout.startTime)}
                      </p>
                      <p className="text-sm text-berry/80">{workout.classType}</p>
                      <p className="text-xs text-rose">
                        {workout.instructor} · {workout.location} ·{' '}
                        {workout.durationMinutes} min
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-medium ${statusClass(workout)}`}
                    >
                      {statusLabel(workout)}
                    </span>
                  </div>
                  <div className="mt-2">
                    <MuscleFocusTags muscles={workout.muscleFocus} />
                  </div>
                  {overdue && workout.attendanceStatus === 'pending' && (
                    <p className="mt-2 text-xs font-medium text-[#9b3a4f]">
                      Personal decision deadline has passed — still okay to
                      choose gently.
                    </p>
                  )}
                </div>
              </button>

              {needsCancellationReminder(workout) && (
                <div className="mt-3 rounded-2xl bg-[#fff0f3] px-3 py-3">
                  <p className="text-xs leading-relaxed text-[#9b3a4f]">
                    Reminder: cancel this unused reservation in the official
                    solidcore app. Soliday cannot cancel it for you.
                  </p>
                  <label className="mt-2 flex min-h-11 items-center gap-2 text-xs text-berry">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-berry"
                      checked={workout.bookingCanceledInApp === true}
                      onChange={(e) =>
                        onConfirmCancellation(workout.id, e.target.checked)
                      }
                    />
                    I canceled this in the solidcore app
                  </label>
                </div>
              )}

              {workout.attendanceStatus === 'not_attending' &&
                workout.bookingCanceledInApp === true && (
                  <p className="mt-2 text-xs text-rose">
                    Cancellation confirmed by you — reminder cleared.
                  </p>
                )}
            </div>
          )
        })}
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {mode === 'choose' ? (
          <>
            <Pressable
              fullWidth
              onClick={saveSelection}
              disabled={editable.length === 0}
            >
              {selectedIds.length === 0
                ? 'Save as decide later'
                : selectedIds.length === 1
                  ? 'Plan selected class'
                  : 'Plan selected classes'}
            </Pressable>
            <Pressable fullWidth variant="secondary" onClick={decideLater}>
              Decide later
            </Pressable>
          </>
        ) : (
          <Pressable
            fullWidth
            variant="secondary"
            onClick={() => {
              setSelectedIds(
                workouts
                  .filter((w) => w.attendanceStatus === 'planned')
                  .map((w) => w.id),
              )
              setMode('choose')
            }}
          >
            Change decision
          </Pressable>
        )}
        {workouts.some((w) => w.attendanceStatus === 'pending') && (
          <Pressable
            fullWidth
            variant="ghost"
            onClick={() => {
              const pending = workouts.filter(
                (w) => w.attendanceStatus === 'pending',
              )
              const events = [
                ...pending.map((w) =>
                  decisionReminderEvent(w, deadlineHours),
                ),
                eveningReminderEvent(
                  date,
                  eveningReminderHour,
                  pending.length,
                ),
              ]
              downloadIcs(
                `soliday-reminders-${date}.ics`,
                buildIcsCalendar(events),
              )
            }}
          >
            <CalendarPlus className="h-4 w-4" />
            Add reminders to my calendar
          </Pressable>
        )}
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-rose">
        Calendar exports do not create or cancel solidcore reservations, and
        they will not auto-update if you change Soliday later.
      </p>
    </section>
  )
}
