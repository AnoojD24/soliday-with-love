import { FinalSurpriseReveal } from '../components/final-surprise/FinalSurpriseReveal'
import { SurpriseGiftIllustration } from '../components/illustrations/EnvelopeIllustration'
import { HeartMark } from '../components/illustrations/Ornaments'
import { OpenWhenSection } from '../components/OpenWhenSection'
import { Pressable } from '../components/ui/Pressable'
import { useAppState } from '../context/AppStateContext'
import { SOLIDAY_GOAL_DAYS } from '../data/challenge'
import { FINAL_SURPRISE_COPY } from '../data/finalSurpriseCopy'
import { computeProgressStats } from '../utils/progress'
import { useState } from 'react'

export function WithLovePage() {
  const {
    state,
    startWelcomeReplay,
    markOpenWhenRead,
    markFinalSurpriseSeen,
  } = useAppState()
  const stats = computeProgressStats(state.workouts)
  const [finalOpen, setFinalOpen] = useState(false)

  const goalReached = stats.completedWorkoutDays >= SOLIDAY_GOAL_DAYS

  return (
    <div className="space-y-6">
      <header>
        <div className="mb-2 flex items-center gap-2">
          <img
            src="/icons/icon.svg"
            alt=""
            className="h-9 w-9 rounded-xl shadow-[var(--shadow-soft)]"
            aria-hidden="true"
          />
          <HeartMark className="h-4 w-4" />
        </div>
        <p className="text-sm text-rose">Notes tucked between the workouts</p>
        <h1 className="font-display text-3xl text-berry">With Love</h1>
      </header>

      <section className="rounded-[2rem] border border-blush/70 bg-white/85 p-5 shadow-[var(--shadow-soft)]">
        <p className="font-script text-2xl text-berry">For Trisha</p>
        <p className="mt-3 text-sm leading-relaxed text-berry/75">
          A little surprise waits at the end of your Solidays journey — sealed
          with care, opened with pride.
        </p>
        <p className="mt-4 text-xs tracking-[0.12em] text-rose uppercase">
          {stats.completedWorkoutDays} workout days completed
        </p>
        <div className="mt-4">
          <Pressable
            fullWidth
            variant="secondary"
            onClick={startWelcomeReplay}
            aria-label="Replay the welcome gift"
          >
            Replay the gift
          </Pressable>
        </div>
      </section>

      <section>
        <button
          type="button"
          disabled={!goalReached}
          onClick={() => setFinalOpen(true)}
          className={`w-full rounded-[1.75rem] border p-5 text-left ${
            goalReached
              ? 'border-berry/25 bg-lavender/50 shadow-[var(--shadow-soft)]'
              : 'border-blush/50 bg-white/60'
          }`}
          aria-label={`${FINAL_SURPRISE_COPY.cardTitle}, ${goalReached ? 'unlocked' : 'locked'}, opens after 10 workout days`}
        >
          <div className="flex items-center gap-4">
            <SurpriseGiftIllustration
              unlocked={goalReached}
              className="h-24 w-24 shrink-0"
            />
            <div>
              <p className="text-xs tracking-[0.12em] text-rose uppercase">
                {FINAL_SURPRISE_COPY.cardEyebrow}
              </p>
              <p className="mt-1 font-display text-xl text-berry">
                {FINAL_SURPRISE_COPY.cardTitle}
              </p>
              <p className="mt-1 text-sm text-berry/75">
                {goalReached
                  ? FINAL_SURPRISE_COPY.cardReady
                  : FINAL_SURPRISE_COPY.cardTeaser}
              </p>
              <p className="mt-2 text-[11px] text-rose">
                {goalReached
                  ? FINAL_SURPRISE_COPY.cardUnlockedHint
                  : FINAL_SURPRISE_COPY.cardLockedHint}
              </p>
            </div>
          </div>
        </button>
      </section>

      <OpenWhenSection
        openedIds={state.openedOpenWhenLetters}
        onOpened={markOpenWhenRead}
      />

      <FinalSurpriseReveal
        open={finalOpen}
        hasSeenBefore={state.finalSurpriseSeen}
        onClose={() => setFinalOpen(false)}
        onCelebrationComplete={markFinalSurpriseSeen}
      />
    </div>
  )
}
