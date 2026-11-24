import { useNavigate } from 'react-router-dom'
import { DecisionCard } from '../components/DecisionCard'
import { HomeEntrance } from '../components/HomeEntrance'
import {
  BowMark,
  HeartMark,
  SnowflakeMark,
} from '../components/illustrations/Ornaments'
import { InstructorAvatar } from '../components/InstructorAvatar'
import { MuscleFocusTags } from '../components/MuscleFocusTags'
import { Pressable } from '../components/ui/Pressable'
import { useAppState } from '../context/AppStateContext'
import {
  DAILY_LOVE_NOTES,
  PRE_CHALLENGE_MESSAGES,
} from '../data/loveNotes'
import {
  getNextRelevantWorkouts,
  getUnconfirmedCancellations,
  getUpcomingFlexibleDecisionDays,
  groupWorkoutsByDate,
  hasUnresolvedFlexibleBookings,
  workoutStartsAt,
} from '../utils/attendance'
import {
  formatClassTime,
  formatCountdown,
  formatLADate,
  motivationIndexForDate,
  nowInLA,
  toDateKey,
} from '../utils/dates'
import { computeProgressStats } from '../utils/progress'

const CHALLENGE_START = '2026-12-03'
const CHALLENGE_END = '2026-12-17'

export function HomePage() {
  const navigate = useNavigate()
  const {
    state,
    applyDayDecision,
    setCancellationConfirmed,
  } = useAppState()
  const today = nowInLA()
  const todayKey = toDateKey(today)
  const loveNote =
    DAILY_LOVE_NOTES[motivationIndexForDate(today, DAILY_LOVE_NOTES.length)]
  const preChallenge =
    PRE_CHALLENGE_MESSAGES[
      motivationIndexForDate(today, PRE_CHALLENGE_MESSAGES.length)
    ]

  const grouped = groupWorkoutsByDate(state.workouts)
  const todaysWorkouts = grouped.get(todayKey) ?? []
  const nextGroup = getNextRelevantWorkouts(state.workouts, todayKey)
  const progress = computeProgressStats(state.workouts)
  const nextIsFlexible =
    nextGroup.length > 1 && hasUnresolvedFlexibleBookings(nextGroup)
  const nextWorkout = nextGroup[0]
  const decisionDates = getUpcomingFlexibleDecisionDays(
    state.workouts,
    todayKey,
  )
  const cancelReminders = getUnconfirmedCancellations(state.workouts)
  const hasStartedChallenge = state.workouts.some(
    (w) =>
      w.attendanceStatus === 'completed' ||
      (w.date <= todayKey &&
        (w.attendanceStatus === 'planned' ||
          w.attendanceStatus === 'pending' ||
          w.attendanceStatus === 'not_attending')),
  )
  const beforeChallenge = todayKey < CHALLENGE_START && !hasStartedChallenge
  const afterChallenge =
    todayKey > CHALLENGE_END &&
    !state.workouts.some(
      (w) =>
        w.date >= todayKey &&
        (w.attendanceStatus === 'planned' || w.attendanceStatus === 'pending'),
    )

  const todayIsAlsoNext =
    nextWorkout &&
    nextWorkout.date === todayKey &&
    !nextIsFlexible

  return (
    <HomeEntrance>
    <div className="space-y-6">
      <header className="space-y-2">
        <div className="flex items-center justify-between">
          <BowMark className="h-7 w-9" />
          <SnowflakeMark className="h-4 w-4 text-rose" />
        </div>
        <p className="text-sm text-rose">{formatLADate(today)}</p>
        <h1 className="font-display text-3xl text-berry">Hi, beautiful ♡</h1>
      </header>

      <section className="space-y-3">
        {!nextWorkout ? (
          <div className="rounded-[1.75rem] border border-blush/70 bg-white/90 px-5 py-6 shadow-[var(--shadow-soft)]">
            <p className="text-xs font-medium tracking-[0.12em] text-rose uppercase">
              {afterChallenge ? 'Soliday complete' : 'Up next'}
            </p>
            <h2 className="mt-2 font-display text-2xl text-berry">
              {afterChallenge
                ? 'What a beautiful December'
                : 'No upcoming classes'}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-berry/75">
              {afterChallenge
                ? 'Your scheduled Soliday sessions are complete. Rest in that pride — and add more love on the calendar anytime.'
                : 'Add a class whenever you are ready. Your journey stays soft and open.'}
            </p>
          </div>
        ) : nextIsFlexible ? (
          <DecisionCard
            date={nextWorkout.date}
            workouts={nextGroup}
            deadlineHours={state.settings.decisionDeadlineHours}
            eveningReminderHour={state.settings.eveningReminderHour}
            onApplyDecision={(ids) => applyDayDecision(nextWorkout.date, ids)}
            onConfirmCancellation={setCancellationConfirmed}
          />
        ) : (
          <article className="rounded-[2rem] border border-blush/80 bg-white/95 p-5 shadow-[var(--shadow-lift)]">
            <p className="text-xs font-medium tracking-[0.12em] text-rose uppercase">
              Next workout
            </p>
            <p className="mt-3 font-display text-4xl leading-none text-berry">
              {formatClassTime(nextWorkout.startTime)}
            </p>
            <p className="mt-2 text-sm text-rose">
              {formatLADate(
                new Date(`${nextWorkout.date}T12:00:00`),
                'EEEE, MMMM d',
              )}
            </p>
            <div className="mt-4 flex items-start gap-3">
              <InstructorAvatar name={nextWorkout.instructor} />
              <div className="min-w-0">
                <h2 className="font-display text-xl text-berry">
                  {nextWorkout.classType}
                </h2>
                <p className="mt-1 text-sm text-berry/80">
                  {nextWorkout.instructor}
                </p>
                <p className="text-sm text-rose">{nextWorkout.location}</p>
              </div>
            </div>
            <div className="mt-4">
              <MuscleFocusTags muscles={nextWorkout.muscleFocus} />
            </div>
            <div className="mt-5 flex items-center justify-between gap-3 rounded-[1.25rem] bg-blush/50 px-4 py-3">
              <div>
                <p className="text-[11px] tracking-[0.12em] text-rose uppercase">
                  Countdown
                </p>
                <p className="font-display text-xl text-berry">
                  {formatCountdown(workoutStartsAt(nextWorkout))}
                </p>
              </div>
              <HeartMark className="h-5 w-5" />
            </div>
            <div className="mt-4">
              <Pressable
                fullWidth
                variant="secondary"
                onClick={() =>
                  navigate('/calendar', {
                    state: { focusDate: nextWorkout.date },
                  })
                }
              >
                View in calendar
              </Pressable>
            </div>
          </article>
        )}
      </section>

      {decisionDates.length > 0 &&
        !(nextIsFlexible && decisionDates[0] === nextWorkout?.date) && (
          <section className="rounded-[1.5rem] border border-lavender bg-lavender/40 px-4 py-4">
            <p className="text-xs font-medium tracking-[0.12em] text-rose uppercase">
              Upcoming decisions
            </p>
            <p className="mt-1 text-sm text-berry">
              {decisionDates.length} flexible booking day
              {decisionDates.length > 1 ? 's' : ''} still need your gentle choice.
            </p>
            <Pressable
              className="mt-3"
              variant="secondary"
              onClick={() =>
                navigate('/calendar', {
                  state: { focusDate: decisionDates[0] },
                })
              }
            >
              Review decisions
            </Pressable>
          </section>
        )}

      {cancelReminders.length > 0 && (
        <section className="rounded-[1.5rem] border border-[#f0c9d4] bg-[#fff0f3] px-4 py-4">
          <p className="text-xs font-medium tracking-[0.12em] text-[#9b3a4f] uppercase">
            Cancellation reminders
          </p>
          <p className="mt-1 text-sm text-berry/80">
            {cancelReminders.length} unused reservation
            {cancelReminders.length > 1 ? 's' : ''} still need canceling in the
            official solidcore app.
          </p>
        </section>
      )}

      <section className="rounded-[1.75rem] border border-blush/80 bg-white/85 p-5 shadow-[var(--shadow-soft)]">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-medium tracking-[0.14em] text-rose uppercase">
            Soliday progress
          </p>
          <HeartMark className="h-4 w-4" />
        </div>
        <p className="font-display text-3xl text-berry">
          {progress.completedWorkoutDays}
          <span className="text-xl text-rose">
            {' '}
            / {state.settings.goalWorkoutDays}
          </span>
        </p>
        <p className="mt-1 text-sm text-berry/70">workout days completed</p>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-blush/70">
          <div
            className="h-full rounded-full bg-berry transition-all"
            style={{
              width: `${Math.min(
                100,
                (progress.completedWorkoutDays /
                  state.settings.goalWorkoutDays) *
                  100,
              )}%`,
            }}
          />
        </div>
      </section>

      <section className="space-y-3">
        {beforeChallenge ? (
          <>
            <h2 className="font-display text-2xl text-berry">
              Before Soliday begins
            </h2>
            <div className="rounded-[1.75rem] border border-dashed border-rose/30 bg-white/70 px-5 py-6">
              <p className="text-sm leading-relaxed text-berry/80">
                {preChallenge}
              </p>
              <p className="mt-3 text-xs text-rose">
                First class lands December 3 · 5:30 AM
              </p>
            </div>
          </>
        ) : todaysWorkouts.length === 0 ? (
          <>
            <h2 className="font-display text-2xl text-berry">A soft rest day</h2>
            <div className="rounded-[1.75rem] border border-dashed border-rose/30 bg-white/60 px-5 py-6">
              <p className="text-sm leading-relaxed text-berry/75">
                No class on the books today. Rest, recharge, and keep a little
                sparkle for the next one.
              </p>
            </div>
          </>
        ) : todayIsAlsoNext ? (
          <>
            <h2 className="font-display text-2xl text-berry">Today</h2>
            <p className="text-sm text-berry/70">
              Your next workout is today — details are featured above.
            </p>
          </>
        ) : (
          <>
            <h2 className="font-display text-2xl text-berry">Today</h2>
            <div className="space-y-2">
              {todaysWorkouts.map((workout) => (
                <div
                  key={workout.id}
                  className="rounded-[1.5rem] bg-white/85 px-4 py-3 shadow-[var(--shadow-soft)]"
                >
                  <p className="font-medium text-berry">
                    {formatClassTime(workout.startTime)} · {workout.classType}
                  </p>
                  <p className="text-sm text-rose">
                    {workout.instructor} · {workout.location}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      <section className="rounded-[1.75rem] bg-blush/40 px-5 py-5">
        <p className="text-xs font-medium tracking-[0.12em] text-rose uppercase">
          A little love note
        </p>
        <p className="mt-2 font-script text-2xl leading-snug text-berry">
          {loveNote}
        </p>
      </section>
    </div>
    </HomeEntrance>
  )
}
