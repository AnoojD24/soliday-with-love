import { motion, useReducedMotion } from 'motion/react'
import { HeartMark, SnowflakeMark } from '../components/illustrations/Ornaments'
import { useAppState } from '../context/AppStateContext'
import { SOLIDAY_GOAL_DAYS } from '../data/challenge'
import { computeProgressStats, heartSlotsForGoal } from '../utils/progress'

function progressEncouragement(completedDays: number): string {
  if (completedDays <= 0) {
    return '10 days of showing up for yourself. You\'ve got this, honey!'
  }
  if (completedDays >= SOLIDAY_GOAL_DAYS + 1) {
    return 'Look at you going above and beyond! Bonus days look beautiful on you.'
  }
  if (completedDays >= SOLIDAY_GOAL_DAYS) {
    return 'You did it, honey! 10 workout days in the books. Hoodie era unlocked! ♡'
  }
  if (completedDays === SOLIDAY_GOAL_DAYS - 1) {
    return 'One more day until you reach your goal — and that cute hoodie!'
  }
  if (completedDays === Math.floor(SOLIDAY_GOAL_DAYS / 2)) {
    return 'Halfway there, teddy! I\'m so proud of you. One step closer to your Solidays hoodie!'
  }
  return 'One step closer to your Solidays hoodie!'
}

export function ProgressPage() {
  const { state } = useAppState()
  const stats = computeProgressStats(state.workouts)
  const goalDays = SOLIDAY_GOAL_DAYS
  const hearts = heartSlotsForGoal(goalDays)
  const progressRatio = Math.min(
    1,
    stats.completedWorkoutDays / Math.max(goalDays, 1),
  )
  const reduceMotion = useReducedMotion()
  const encouragement = progressEncouragement(stats.completedWorkoutDays)

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm text-rose">A gentle record of showing up</p>
        <h1 className="font-display text-3xl text-berry">Progress</h1>
      </header>

      <section className="rounded-[2rem] border border-blush/70 bg-white/85 p-6 text-center shadow-[var(--shadow-soft)]">
        <p className="text-xs font-medium tracking-[0.14em] text-rose uppercase">
          Road to the hoodie ♡
        </p>
        <div className="relative mx-auto mt-3 flex h-40 w-40 items-center justify-center">
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
            <p className="text-xs text-rose">of {goalDays} days</p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-berry/75">
          {encouragement}
        </p>
        {stats.completedWorkoutDays < goalDays && (
          <p className="mt-2 font-script text-lg text-rose">
            10 workout days. One cute hoodie waiting for you. ♡
          </p>
        )}
      </section>

      <section className="rounded-[1.75rem] bg-white/80 p-5 shadow-[var(--shadow-soft)]">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-xl text-berry">Collectible hearts</h2>
          <HeartMark className="h-4 w-4" />
        </div>
        <div className="grid grid-cols-5 gap-2">
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
