import { motion, useReducedMotion } from 'motion/react'
import { useMemo, useState } from 'react'
import {
  InstallGuide,
  isStandaloneDisplay,
} from '../components/InstallGuide'
import { HeartMark, SnowflakeMark } from '../components/illustrations/Ornaments'
import { Pressable } from '../components/ui/Pressable'
import { useAppState } from '../context/AppStateContext'
import {
  downloadIcs,
  exportFlexibleDecisionRemindersIcs,
  exportPlannedWorkoutsIcs,
} from '../utils/ics'
import {
  createInitialState,
  exportState,
  parseImportedState,
} from '../utils/storage'
import { computeProgressStats, heartSlotsForGoal } from '../utils/progress'

export function ProgressPage() {
  const { state, updateSettings, replaceState, resetToSeed } = useAppState()
  const stats = computeProgressStats(state.workouts)
  const hearts = heartSlotsForGoal(state.settings.goalWorkoutDays)
  const progressRatio = Math.min(
    1,
    stats.completedWorkoutDays / Math.max(state.settings.goalWorkoutDays, 1),
  )
  const reduceMotion = useReducedMotion()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [goal, setGoal] = useState(state.settings.goalWorkoutDays)
  const [deadlineHours, setDeadlineHours] = useState(
    state.settings.decisionDeadlineHours,
  )
  const [importError, setImportError] = useState<string | null>(null)
  const standalone = useMemo(() => isStandaloneDisplay(), [])

  const encouragement =
    stats.completedWorkoutDays === 0
      ? 'Your hearts are waiting — every beginning counts.'
      : stats.completedWorkoutDays < state.settings.goalWorkoutDays
        ? 'Look at you showing up. Keep going at your beautiful pace.'
        : 'You reached your Soliday goal. I am so proud of you.'

  function saveSettings() {
    updateSettings({
      goalWorkoutDays: goal,
      decisionDeadlineHours: deadlineHours,
    })
    setSettingsOpen(false)
  }

  function handleExport() {
    const blob = new Blob([exportState(state)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'soliday-with-love-backup.json'
    anchor.click()
    URL.revokeObjectURL(url)
  }

  function handleImport(file: File) {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const next = parseImportedState(String(reader.result))
        replaceState(next)
        setImportError(null)
        setSettingsOpen(false)
      } catch {
        setImportError('That file could not be imported. Check the JSON and try again.')
      }
    }
    reader.readAsText(file)
  }

  function handleReset() {
    if (
      window.confirm(
        'Reset all Soliday progress and return to the original schedule? This cannot be undone.',
      )
    ) {
      resetToSeed()
      localStorage.setItem(
        'soliday-with-love-v1',
        JSON.stringify(createInitialState()),
      )
      setSettingsOpen(false)
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-3">
        <div>
          <p className="text-sm text-rose">A gentle record of showing up</p>
          <h1 className="font-display text-3xl text-berry">Progress</h1>
        </div>
        <Pressable
          variant="ghost"
          className="px-3 py-2 text-xs"
          onClick={() => setSettingsOpen((open) => !open)}
        >
          Settings
        </Pressable>
      </header>

      <section className="rounded-[2rem] border border-blush/70 bg-white/85 p-6 text-center shadow-[var(--shadow-soft)]">
        <div className="relative mx-auto flex h-40 w-40 items-center justify-center">
          <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full">
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="#F7DCE5"
              strokeWidth="10"
            />
            <motion.circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="#80354D"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 52}
              initial={
                reduceMotion
                  ? false
                  : { strokeDashoffset: 2 * Math.PI * 52 }
              }
              animate={{
                strokeDashoffset: 2 * Math.PI * 52 * (1 - progressRatio),
              }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              transform="rotate(-90 60 60)"
            />
          </svg>
          <div>
            <p className="font-display text-3xl text-berry">
              {stats.completedWorkoutDays}
            </p>
            <p className="text-xs text-rose">
              of {state.settings.goalWorkoutDays} days
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-berry/75">
          {encouragement}
        </p>
      </section>

      <section className="rounded-[1.75rem] bg-white/80 p-5 shadow-[var(--shadow-soft)]">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-xl text-berry">Collectible hearts</h2>
          <HeartMark className="h-4 w-4" />
        </div>
        <div className="grid grid-cols-6 gap-2">
          {hearts.map((index) => {
            const unlocked = index < stats.completedWorkoutDays
            return (
              <motion.div
                key={index}
                className={`flex aspect-square items-center justify-center rounded-2xl ${
                  unlocked ? 'bg-[#f3c4d3]' : 'bg-cream'
                }`}
                initial={false}
                animate={
                  unlocked && !reduceMotion
                    ? { scale: [1, 1.08, 1] }
                    : { scale: 1 }
                }
                transition={{ duration: 0.45, delay: index * 0.02 }}
                aria-label={
                  unlocked
                    ? `Heart ${index + 1} unlocked`
                    : `Heart ${index + 1} locked`
                }
              >
                <HeartMark
                  className={`h-5 w-5 ${
                    unlocked ? 'opacity-100 [&_path]:fill-[#80354D]' : 'opacity-25'
                  }`}
                />
              </motion.div>
            )
          })}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <Stat label="Workout days" value={String(stats.completedWorkoutDays)} />
        <Stat label="Classes" value={String(stats.completedClasses)} />
        <Stat label="Minutes" value={String(stats.completedMinutes)} />
        <Stat label="Planned" value={String(stats.upcomingPlanned)} />
        <Stat label="Decisions" value={String(stats.pendingDecisions)} />
        <Stat
          label="Cancel reminders"
          value={String(stats.unconfirmedCancellations)}
        />
      </section>

      {(Object.keys(stats.instructorFrequency).length > 0 ||
        Object.keys(stats.muscleFrequency).length > 0) && (
        <section className="space-y-4 rounded-[1.75rem] border border-blush/60 bg-white/70 p-5">
          <div>
            <h2 className="font-display text-xl text-berry">Instructors</h2>
            <p className="mt-1 text-xs text-rose">
              Based on completed classes only
            </p>
            <ul className="mt-3 space-y-2">
              {Object.entries(stats.instructorFrequency)
                .sort((a, b) => b[1] - a[1])
                .map(([name, count]) => (
                  <li
                    key={name}
                    className="flex items-center justify-between text-sm text-berry"
                  >
                    <span>{name}</span>
                    <span className="text-rose">{count}</span>
                  </li>
                ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-xl text-berry">Class focus</h2>
            <p className="mt-1 text-xs text-rose">
              Focus tags from completed classes — not measured activation
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {Object.entries(stats.muscleFrequency)
                .sort((a, b) => b[1] - a[1])
                .map(([name, count]) => (
                  <li
                    key={name}
                    className="rounded-full bg-blush/70 px-3 py-1 text-xs text-berry"
                  >
                    {name} · {count}
                  </li>
                ))}
            </ul>
          </div>
        </section>
      )}

      {settingsOpen && (
        <section className="space-y-4 rounded-[1.75rem] border border-blush bg-white p-5 shadow-[var(--shadow-soft)]">
          <h2 className="font-display text-xl text-berry">Settings</h2>

          <InstallGuide standalone={standalone} />

          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-berry">
              Workout day goal
            </span>
            <input
              type="number"
              min={1}
              max={31}
              value={goal}
              onChange={(e) => setGoal(Number(e.target.value))}
              className="touch-target w-full rounded-2xl border border-blush px-3 text-berry"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-berry">
              Decision deadline (hours before class)
            </span>
            <input
              type="number"
              min={1}
              max={48}
              value={deadlineHours}
              onChange={(e) => setDeadlineHours(Number(e.target.value))}
              className="touch-target w-full rounded-2xl border border-blush px-3 text-berry"
            />
          </label>
          <Pressable fullWidth onClick={saveSettings}>
            Save preferences
          </Pressable>

          <div className="space-y-2 rounded-[1.25rem] bg-blush/30 p-3">
            <p className="text-sm font-medium text-berry">Apple Calendar</p>
            <Pressable
              fullWidth
              variant="secondary"
              onClick={() =>
                downloadIcs(
                  'soliday-planned-workouts.ics',
                  exportPlannedWorkoutsIcs(state.workouts),
                )
              }
            >
              Export planned workouts
            </Pressable>
            <Pressable
              fullWidth
              variant="secondary"
              onClick={() =>
                downloadIcs(
                  'soliday-decision-reminders.ics',
                  exportFlexibleDecisionRemindersIcs(
                    state.workouts,
                    state.settings.decisionDeadlineHours,
                    state.settings.eveningReminderHour,
                  ),
                )
              }
            >
              Export decision reminders
            </Pressable>
            <p className="text-[11px] leading-relaxed text-rose">
              Exports do not create or cancel solidcore reservations. Imported
              events will not auto-sync if you change Soliday later. Import
              experience can vary by iOS version.
            </p>
          </div>

          <Pressable fullWidth variant="secondary" onClick={handleExport}>
            Export data backup
          </Pressable>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-berry">
              Import data backup
            </span>
            <input
              type="file"
              accept="application/json,.json"
              className="block w-full text-sm text-berry"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleImport(file)
              }}
            />
          </label>
          {importError && (
            <p className="text-sm text-[#9b3a4f]" role="alert">
              {importError}
            </p>
          )}

          <div className="rounded-[1.25rem] bg-cream px-3 py-3 text-[11px] leading-relaxed text-berry/75">
            Progress stays on this device. It does not sync across phones.
            Clearing website data, removing the home-screen app, or using a
            different browser may erase it. Export backups regularly.
          </div>

          <Pressable fullWidth variant="danger" onClick={handleReset}>
            Reset progress
          </Pressable>
        </section>
      )}

      <div className="flex items-center justify-center gap-2 pb-2 text-rose">
        <SnowflakeMark className="h-4 w-4" />
        <p className="text-xs">Hearts unlock with completed workout days</p>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] border border-blush/60 bg-white/75 px-4 py-4">
      <p className="text-xs tracking-[0.12em] text-rose uppercase">{label}</p>
      <p className="mt-1 font-display text-2xl text-berry">{value}</p>
    </div>
  )
}
