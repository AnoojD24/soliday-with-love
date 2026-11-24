import {
  CalendarPlus,
  Check,
  ChevronDown,
  Clock3,
  MoreHorizontal,
  Pencil,
  RotateCcw,
  Trash2,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { Workout } from '../types/workout'
import { needsCancellationReminder } from '../utils/attendance'
import { formatClassTime } from '../utils/dates'
import {
  buildIcsCalendar,
  downloadIcs,
  workoutToCalendarEvent,
} from '../utils/ics'
import { InstructorAvatar } from './InstructorAvatar'
import { MuscleFocusTags } from './MuscleFocusTags'
import { MuscleIllustration } from './illustrations/MuscleIllustration'
import { StudioLocationLink } from './StudioLocationLink'
import { Pressable } from './ui/Pressable'

function statusLabel(workout: Workout): string {
  if (workout.attendanceStatus === 'pending') return 'Decision pending'
  if (workout.attendanceStatus === 'planned') return 'Planning to attend'
  if (workout.attendanceStatus === 'completed') return 'Completed'
  if (needsCancellationReminder(workout)) {
    return 'Not attending — unconfirmed'
  }
  return 'Not attending — confirmed'
}

function statusStyles(workout: Workout): string {
  if (workout.attendanceStatus === 'pending') return 'bg-lavender text-berry'
  if (workout.attendanceStatus === 'planned') return 'bg-blush text-berry'
  if (workout.attendanceStatus === 'completed') return 'bg-sage text-[#45634a]'
  if (needsCancellationReminder(workout)) {
    return 'bg-[#fff0f3] text-[#9b3a4f] border border-[#f0c9d4]'
  }
  return 'bg-white text-rose border border-blush'
}

interface WorkoutCardProps {
  workout: Workout
  onEdit?: (workout: Workout) => void
  onDelete?: (workout: Workout) => void
  onComplete?: (workout: Workout) => void
  onUndoComplete?: (workout: Workout) => void
  onConfirmCancellation?: (workout: Workout, confirmed: boolean) => void
}

export function WorkoutCard({
  workout,
  onEdit,
  onDelete,
  onComplete,
  onUndoComplete,
  onConfirmCancellation,
}: WorkoutCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [muscleOpen, setMuscleOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  const canComplete =
    workout.attendanceStatus === 'planned' ||
    workout.attendanceStatus === 'pending'

  const canExportCalendar =
    workout.attendanceStatus === 'planned' ||
    workout.attendanceStatus === 'completed'

  function exportCalendar() {
    const ics = buildIcsCalendar([workoutToCalendarEvent(workout)])
    downloadIcs(`soliday-${workout.date}-${workout.startTime.replace(':', '')}.ics`, ics)
  }

  return (
    <article className="rounded-[1.5rem] border border-blush/70 bg-white/90 p-4 shadow-[var(--shadow-soft)]">
      <div className="flex items-start gap-3">
        <InstructorAvatar name={workout.instructor} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-display text-xl text-berry">
                {formatClassTime(workout.startTime)}
              </p>
              <p className="mt-0.5 text-sm font-medium text-berry">
                {workout.classType}
              </p>
              <p className="mt-0.5 text-sm text-rose">{workout.instructor}</p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-medium leading-none ${statusStyles(workout)}`}
              >
                {statusLabel(workout)}
              </span>
              {(onEdit || onDelete || onUndoComplete) && (
                <div className="relative" ref={menuRef}>
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full text-rose"
                    aria-label="More actions"
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen((open) => !open)}
                  >
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                  {menuOpen && (
                    <div className="absolute right-0 z-20 mt-1 w-40 overflow-hidden rounded-2xl border border-blush bg-white shadow-[var(--shadow-soft)]">
                      {onEdit && (
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 px-3 py-3 text-left text-sm text-berry hover:bg-blush/40"
                          onClick={() => {
                            setMenuOpen(false)
                            onEdit(workout)
                          }}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </button>
                      )}
                      {workout.attendanceStatus === 'completed' &&
                        onUndoComplete && (
                          <button
                            type="button"
                            className="flex w-full items-center gap-2 px-3 py-3 text-left text-sm text-berry hover:bg-blush/40"
                            onClick={() => {
                              setMenuOpen(false)
                              onUndoComplete(workout)
                            }}
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                            Undo complete
                          </button>
                        )}
                      {onDelete && (
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 px-3 py-3 text-left text-sm text-[#9b3a4f] hover:bg-[#fff0f3]"
                          onClick={() => {
                            setMenuOpen(false)
                            onDelete(workout)
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Remove
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="mt-3 space-y-1.5 text-sm text-berry/80">
            <p className="flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-rose" aria-hidden="true" />
              <span>{workout.durationMinutes} min</span>
            </p>
            <p className="flex items-center gap-2 text-sm text-berry/80">
              <StudioLocationLink location={workout.location} showIcon />
            </p>
          </div>

          <div className="mt-3">
            <button
              type="button"
              className="touch-target flex w-full items-center justify-between rounded-2xl bg-blush/40 px-3 py-2.5 text-left text-sm font-medium text-berry"
              aria-expanded={muscleOpen}
              onClick={() => setMuscleOpen((open) => !open)}
            >
              <span>Today&apos;s muscle focus</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${muscleOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {muscleOpen && (
              <div className="-mx-1 mt-2 space-y-3 rounded-[1.5rem] border border-blush/55 bg-cream/90 px-2.5 py-3 sm:mx-0 sm:px-3">
                <MuscleFocusTags muscles={workout.muscleFocus} />
                <MuscleIllustration muscles={workout.muscleFocus} />
                <p className="px-1 text-center text-[11px] leading-relaxed text-rose">
                  Highlights show this class&apos;s focus areas — a gentle guide,
                  not measured muscle activation.
                </p>
              </div>
            )}
          </div>

          {needsCancellationReminder(workout) && onConfirmCancellation && (
            <div className="mt-3 rounded-2xl bg-[#fff0f3] px-3 py-3">
              <p className="text-xs leading-relaxed text-[#9b3a4f]">
                Cancel this reservation in the official solidcore app when
                you can. Soliday does not cancel bookings.
              </p>
              <label className="mt-2 flex min-h-11 items-center gap-2 text-xs text-berry">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-berry"
                  checked={workout.bookingCanceledInApp === true}
                  onChange={(e) =>
                    onConfirmCancellation(workout, e.target.checked)
                  }
                />
                I canceled this in the solidcore app
              </label>
            </div>
          )}

          <div className="mt-4 space-y-2">
            {canExportCalendar && (
              <Pressable
                fullWidth
                variant="secondary"
                onClick={exportCalendar}
                aria-label="Add workout to my calendar"
              >
                <CalendarPlus className="h-4 w-4" />
                Add to my calendar
              </Pressable>
            )}
            {canComplete && onComplete && (
              <Pressable
                fullWidth
                onClick={() => onComplete(workout)}
                aria-label={`Mark ${workout.classType} complete`}
              >
                <Check className="h-4 w-4" />
                Mark complete
              </Pressable>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
