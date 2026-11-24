import { Plus } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { BottomSheet } from '../components/BottomSheet'
import { CalendarMonth } from '../components/CalendarMonth'
import { CompletionCelebration } from '../components/CompletionCelebration'
import { DecisionCard } from '../components/DecisionCard'
import { HeartMark } from '../components/illustrations/Ornaments'
import { JournalSheet } from '../components/JournalSheet'
import { Pressable } from '../components/ui/Pressable'
import { WorkoutCard } from '../components/WorkoutCard'
import { WorkoutForm } from '../components/WorkoutForm'
import { useAppState } from '../context/AppStateContext'
import type { MilestoneId, Workout, WorkoutJournal } from '../types/workout'
import {
  groupWorkoutsByDate,
  hasUnresolvedFlexibleBookings,
  isFlexibleDay,
} from '../utils/attendance'
import { formatLADate, nowInLA, toDateKey } from '../utils/dates'

export function CalendarPage() {
  const location = useLocation()
  const {
    state,
    upsertWorkout,
    deleteWorkout,
    applyDayDecision,
    setCancellationConfirmed,
    completeWorkout,
    undoCompleteWorkout,
    markMilestonesCelebrated,
  } = useAppState()

  const focusDate = (location.state as { focusDate?: string } | null)?.focusDate

  const visibleMonth = useMemo(() => new Date(2026, 11, 1), [])
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = toDateKey(nowInLA())
    return today.startsWith('2026-12') ? today : '2026-12-03'
  })
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Workout | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Workout | null>(null)
  const [celebrationOpen, setCelebrationOpen] = useState(false)
  const [celebrationMessage, setCelebrationMessage] = useState('')
  const [journalWorkoutId, setJournalWorkoutId] = useState<string | null>(null)
  const [pendingCelebrations, setPendingCelebrations] = useState<MilestoneId[]>(
    [],
  )

  useEffect(() => {
    if (!focusDate?.startsWith('2026-12')) return
    setSelectedDate(focusDate)
  }, [focusDate])

  const grouped = useMemo(
    () => groupWorkoutsByDate(state.workouts),
    [state.workouts],
  )
  const selectedWorkouts = grouped.get(selectedDate) ?? []
  const selectedLabel = formatLADate(
    new Date(`${selectedDate}T12:00:00`),
    'EEEE, MMMM d',
  )
  const showDecision =
    isFlexibleDay(selectedWorkouts) &&
    (hasUnresolvedFlexibleBookings(selectedWorkouts) ||
      selectedWorkouts.some((w) => w.attendanceStatus === 'not_attending'))

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(workout: Workout) {
    setEditing(workout)
    setFormOpen(true)
  }

  function handleSave(workout: Workout) {
    upsertWorkout(workout)
    if (workout.date.startsWith('2026-12')) {
      setSelectedDate(workout.date)
    }
    setFormOpen(false)
    setEditing(null)
  }

  function confirmDelete() {
    if (!pendingDelete) return
    deleteWorkout(pendingDelete.id)
    setPendingDelete(null)
  }

  function handleComplete(workout: Workout) {
    const newly = completeWorkout(workout.id)
    setPendingCelebrations(newly)
    setCelebrationMessage(
      newly.length > 0
        ? 'A new Soliday milestone just unlocked. Your hearts are glowing.'
        : 'Another beautiful class in the books. Be proud of yourself.',
    )
    setCelebrationOpen(true)
    setJournalWorkoutId(workout.id)
  }

  function handleJournalSave(journal: WorkoutJournal) {
    if (!journalWorkoutId) return
    const workout = state.workouts.find((w) => w.id === journalWorkoutId)
    if (workout) {
      upsertWorkout({ ...workout, journal })
    }
    setJournalWorkoutId(null)
  }

  function dismissCelebration() {
    setCelebrationOpen(false)
    if (pendingCelebrations.length > 0) {
      markMilestonesCelebrated(pendingCelebrations)
      setPendingCelebrations([])
    }
  }

  return (
    <div className="space-y-5">
      <header className="flex items-end justify-between gap-3">
        <div>
          <p className="text-sm text-rose">December days, chosen with care</p>
          <h1 className="font-display text-3xl text-berry">Calendar</h1>
        </div>
        <Pressable
          variant="secondary"
          className="px-3 py-2.5"
          onClick={openCreate}
          aria-label="Add workout"
        >
          <Plus className="h-4 w-4" />
          Add
        </Pressable>
      </header>

      <CalendarMonth
        visibleMonth={visibleMonth}
        selectedDate={selectedDate}
        workouts={state.workouts}
        onSelectDate={setSelectedDate}
      />

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-2xl text-berry">{selectedLabel}</h2>
          <HeartMark className="h-4 w-4" />
        </div>

        {selectedWorkouts.length === 0 ? (
          <div className="rounded-[1.75rem] border border-dashed border-rose/30 bg-white/65 px-5 py-6">
            <p className="font-display text-xl text-berry">Rest & recharge</p>
            <p className="mt-2 text-sm leading-relaxed text-berry/75">
              A peaceful day with no class booked. Soft mornings and slow
              evenings are part of the journey too.
            </p>
            <div className="mt-4">
              <Pressable variant="secondary" onClick={openCreate}>
                <Plus className="h-4 w-4" />
                Add a class
              </Pressable>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {showDecision && (
              <DecisionCard
                date={selectedDate}
                workouts={selectedWorkouts}
                deadlineHours={state.settings.decisionDeadlineHours}
                eveningReminderHour={state.settings.eveningReminderHour}
                onApplyDecision={(ids) => applyDayDecision(selectedDate, ids)}
                onConfirmCancellation={setCancellationConfirmed}
              />
            )}
            {selectedWorkouts.map((workout) => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                onEdit={openEdit}
                onDelete={setPendingDelete}
                onComplete={handleComplete}
                onUndoComplete={(w) => undoCompleteWorkout(w.id)}
                onConfirmCancellation={(w, confirmed) =>
                  setCancellationConfirmed(w.id, confirmed)
                }
              />
            ))}
          </div>
        )}
      </section>

      <BottomSheet
        open={formOpen}
        title={editing ? 'Edit workout' : 'Add workout'}
        onClose={() => {
          setFormOpen(false)
          setEditing(null)
        }}
      >
        <WorkoutForm
          initial={editing}
          defaultDate={selectedDate}
          onSubmit={handleSave}
          onCancel={() => {
            setFormOpen(false)
            setEditing(null)
          }}
        />
      </BottomSheet>

      <BottomSheet
        open={Boolean(pendingDelete)}
        title="Remove workout?"
        onClose={() => setPendingDelete(null)}
      >
        <p className="text-sm leading-relaxed text-berry/80">
          This removes the session from Soliday only. It does not cancel your
          solidcore reservation.
        </p>
        <div className="mt-5 flex gap-2">
          <Pressable
            variant="secondary"
            className="flex-1"
            onClick={() => setPendingDelete(null)}
          >
            Keep it
          </Pressable>
          <Pressable variant="danger" className="flex-1" onClick={confirmDelete}>
            Remove
          </Pressable>
        </div>
      </BottomSheet>

      <CompletionCelebration
        open={celebrationOpen}
        message={celebrationMessage}
        onJournal={() => {
          dismissCelebration()
        }}
        onDismiss={() => {
          setJournalWorkoutId(null)
          dismissCelebration()
        }}
      />

      <JournalSheet
        open={Boolean(journalWorkoutId) && !celebrationOpen}
        initial={
          state.workouts.find((w) => w.id === journalWorkoutId)?.journal
        }
        onClose={() => setJournalWorkoutId(null)}
        onSave={handleJournalSave}
      />
    </div>
  )
}
