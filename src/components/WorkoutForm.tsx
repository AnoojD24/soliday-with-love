import { useState, type FormEvent } from 'react'
import type { AttendanceStatus, Workout } from '../types/workout'
import { Pressable } from './ui/Pressable'

const CLASS_TYPES = [
  'Signature50: Full Body',
  'Power30: Core + Lower Body',
]

const LOCATIONS = ['Woodland Hills', 'Costa Mesa']

const MUSCLE_OPTIONS = [
  'Hamstrings',
  'Center Glutes',
  'Outer Glutes',
  'Inner Thighs',
  'Biceps',
  'Triceps',
  'Shoulders',
  'Back',
  'Chest',
  'Leg Wrap',
  'Arm Wrap',
]

const STATUS_OPTIONS: AttendanceStatus[] = [
  'pending',
  'planned',
  'not_attending',
  'completed',
]

interface WorkoutFormProps {
  initial?: Workout | null
  defaultDate?: string
  onSubmit: (workout: Workout) => void
  onCancel: () => void
}

function createId(date: string, startTime: string): string {
  return `w-${date}-${startTime.replace(':', '')}-${Math.random().toString(36).slice(2, 7)}`
}

export function WorkoutForm({
  initial,
  defaultDate,
  onSubmit,
  onCancel,
}: WorkoutFormProps) {
  const [date, setDate] = useState(initial?.date ?? defaultDate ?? '2026-12-01')
  const [startTime, setStartTime] = useState(initial?.startTime ?? '18:30')
  const [durationMinutes, setDurationMinutes] = useState(
    initial?.durationMinutes ?? 50,
  )
  const [classType, setClassType] = useState(
    initial?.classType ?? CLASS_TYPES[0],
  )
  const [instructor, setInstructor] = useState(initial?.instructor ?? '')
  const [location, setLocation] = useState(
    initial?.location ?? LOCATIONS[0],
  )
  const [muscleFocus, setMuscleFocus] = useState<string[]>(
    initial?.muscleFocus ?? [],
  )
  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus>(
    initial?.attendanceStatus ?? 'planned',
  )
  const [error, setError] = useState<string | null>(null)

  function toggleMuscle(muscle: string) {
    setMuscleFocus((current) =>
      current.includes(muscle)
        ? current.filter((item) => item !== muscle)
        : [...current, muscle],
    )
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!instructor.trim()) {
      setError('Please add an instructor name.')
      return
    }
    if (muscleFocus.length === 0) {
      setError('Choose at least one muscle focus.')
      return
    }

    onSubmit({
      id: initial?.id ?? createId(date, startTime),
      date,
      startTime,
      durationMinutes,
      classType,
      instructor: instructor.trim(),
      location,
      muscleFocus,
      attendanceStatus,
      bookingCanceledInApp: initial?.bookingCanceledInApp,
      completedAt:
        attendanceStatus === 'completed'
          ? (initial?.completedAt ?? new Date().toISOString())
          : undefined,
      journal: initial?.journal,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-berry">Date</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="touch-target w-full rounded-2xl border border-blush bg-white px-3 text-berry"
            required
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-berry">Start time</span>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="touch-target w-full rounded-2xl border border-blush bg-white px-3 text-berry"
            required
          />
        </label>
      </div>

      <label className="block text-sm">
        <span className="mb-1.5 block font-medium text-berry">Class type</span>
        <select
          value={classType}
          onChange={(e) => {
            setClassType(e.target.value)
            setDurationMinutes(e.target.value.startsWith('Power30') ? 30 : 50)
          }}
          className="touch-target w-full rounded-2xl border border-blush bg-white px-3 text-berry"
        >
          {CLASS_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-berry">Duration</span>
          <input
            type="number"
            min={15}
            max={90}
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(Number(e.target.value))}
            className="touch-target w-full rounded-2xl border border-blush bg-white px-3 text-berry"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-berry">Status</span>
          <select
            value={attendanceStatus}
            onChange={(e) =>
              setAttendanceStatus(e.target.value as AttendanceStatus)
            }
            className="touch-target w-full rounded-2xl border border-blush bg-white px-3 text-berry"
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status.replace('_', ' ')}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block text-sm">
        <span className="mb-1.5 block font-medium text-berry">Instructor</span>
        <input
          type="text"
          value={instructor}
          onChange={(e) => setInstructor(e.target.value)}
          className="touch-target w-full rounded-2xl border border-blush bg-white px-3 text-berry"
          placeholder="e.g. Phasja K."
          required
        />
      </label>

      <label className="block text-sm">
        <span className="mb-1.5 block font-medium text-berry">Studio</span>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="touch-target w-full rounded-2xl border border-blush bg-white px-3 text-berry"
        >
          {LOCATIONS.map((studio) => (
            <option key={studio} value={studio}>
              {studio}
            </option>
          ))}
        </select>
      </label>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-berry">
          Muscle focus
        </legend>
        <div className="flex flex-wrap gap-2">
          {MUSCLE_OPTIONS.map((muscle) => {
            const selected = muscleFocus.includes(muscle)
            return (
              <button
                key={muscle}
                type="button"
                onClick={() => toggleMuscle(muscle)}
                className={`touch-target rounded-full px-3 py-2 text-xs font-medium ${
                  selected
                    ? 'bg-berry text-cream'
                    : 'bg-blush/60 text-berry'
                }`}
              >
                {muscle}
              </button>
            )
          })}
        </div>
      </fieldset>

      {error && (
        <p className="text-sm text-[#9b3a4f]" role="alert">
          {error}
        </p>
      )}

      <div className="flex gap-2 pt-2">
        <Pressable variant="secondary" className="flex-1" onClick={onCancel}>
          Cancel
        </Pressable>
        <Pressable type="submit" className="flex-1">
          {initial ? 'Save changes' : 'Add workout'}
        </Pressable>
      </div>
    </form>
  )
}
