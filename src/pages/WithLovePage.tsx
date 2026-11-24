import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import {
  EnvelopeIllustration,
  SurpriseGiftIllustration,
} from '../components/illustrations/EnvelopeIllustration'
import { BowMark, HeartMark } from '../components/illustrations/Ornaments'
import { OpenWhenSection } from '../components/OpenWhenSection'
import { Pressable } from '../components/ui/Pressable'
import { useAppState } from '../context/AppStateContext'
import { FINAL_SURPRISE, LOVE_NOTES } from '../data/loveNotes'
import { computeProgressStats } from '../utils/progress'

const PAPER_COLORS = ['#F7DCE5', '#EFE0F5', '#DDE8DA', '#F3E4EC']

export function WithLovePage() {
  const { state, startWelcomeReplay, markOpenWhenRead } = useAppState()
  const stats = computeProgressStats(state.workouts)
  const reduceMotion = useReducedMotion()
  const [openId, setOpenId] = useState<string | null>(null)

  const goalReached =
    stats.completedWorkoutDays >= state.settings.goalWorkoutDays
  const openNote =
    LOVE_NOTES.find((note) => note.id === openId) ??
    (openId === FINAL_SURPRISE.id ? FINAL_SURPRISE : null)

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
          <BowMark className="h-7 w-9" />
          <HeartMark className="h-4 w-4" />
        </div>
        <p className="text-sm text-rose">Notes tucked between the workouts</p>
        <h1 className="font-display text-3xl text-berry">With Love</h1>
      </header>

      <section className="rounded-[2rem] border border-blush/70 bg-white/85 p-5 shadow-[var(--shadow-soft)]">
        <p className="font-script text-2xl text-berry">For Trisha</p>
        <p className="mt-3 text-sm leading-relaxed text-berry/75">
          Little envelopes unlock as your Soliday journey unfolds — sealed with
          care, opened with pride.
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

      <section className="grid grid-cols-2 gap-3">
        {LOVE_NOTES.map((note, index) => {
          const unlocked =
            stats.completedWorkoutDays >= note.thresholdDays ||
            state.unlockedMilestones.includes(note.id)
          return (
            <button
              key={note.id}
              type="button"
              disabled={!unlocked}
              onClick={() => setOpenId(note.id)}
              className={`rounded-[1.5rem] border p-3 text-left transition-transform ${
                unlocked
                  ? 'border-berry/20 bg-white/90 shadow-[var(--shadow-soft)] active:scale-[0.98]'
                  : 'border-blush/50 bg-white/55'
              }`}
              aria-label={`${note.title}, ${unlocked ? 'unlocked' : 'locked'}, opens at ${note.thresholdDays} days`}
            >
              <EnvelopeIllustration
                unlocked={unlocked}
                paper={PAPER_COLORS[index % PAPER_COLORS.length]}
                className="mx-auto h-auto w-full max-w-[120px]"
              />
              <p className="mt-2 text-center font-display text-base text-berry">
                {note.title}
              </p>
              <p className="mt-1 text-center text-[11px] text-rose">
                {unlocked ? 'Tap to open' : `Unlocks at ${note.thresholdDays} days`}
              </p>
            </button>
          )
        })}
      </section>

      <section>
        <button
          type="button"
          disabled={!goalReached}
          onClick={() => setOpenId(FINAL_SURPRISE.id)}
          className={`w-full rounded-[1.75rem] border p-5 text-left ${
            goalReached
              ? 'border-berry/25 bg-lavender/50 shadow-[var(--shadow-soft)]'
              : 'border-blush/50 bg-white/60'
          }`}
          aria-label={`${FINAL_SURPRISE.title}, ${goalReached ? 'unlocked' : 'locked'}, opens at your personal goal`}
        >
          <div className="flex items-center gap-4">
            <SurpriseGiftIllustration
              unlocked={goalReached}
              className="h-24 w-24 shrink-0"
            />
            <div>
              <p className="text-xs tracking-[0.12em] text-rose uppercase">
                Final surprise
              </p>
              <p className="mt-1 font-display text-xl text-berry">
                {FINAL_SURPRISE.title}
              </p>
              <p className="mt-1 text-sm text-berry/75">
                {goalReached
                  ? 'Your Soliday surprise is ready to open.'
                  : FINAL_SURPRISE.teaser}
              </p>
              <p className="mt-2 text-[11px] text-rose">
                {goalReached
                  ? 'Tap to unwrap'
                  : `Unlocks at ${state.settings.goalWorkoutDays} workout days`}
              </p>
            </div>
          </div>
        </button>
      </section>

      <OpenWhenSection
        openedIds={state.openedOpenWhenLetters}
        onOpened={markOpenWhenRead}
      />

      <AnimatePresence>
        {openNote && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
            <motion.button
              type="button"
              aria-label="Close letter"
              className="absolute inset-0 bg-berry/35"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenId(null)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={openNote.title}
              className="relative z-10 w-full max-w-md overflow-hidden rounded-[2rem] bg-cream shadow-[var(--shadow-lift)]"
              initial={
                reduceMotion
                  ? false
                  : { opacity: 0, y: 28, scale: 0.96 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: 16 }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            >
              <div className="bg-blush/50 px-5 py-4">
                <p className="text-xs tracking-[0.14em] text-rose uppercase">
                  Opened with love
                </p>
                <h2 className="font-display text-2xl text-berry">
                  {openNote.title}
                </h2>
              </div>
              <div className="px-5 py-6">
                <p className="font-script text-2xl leading-snug text-berry">
                  {openNote.letter}
                </p>
                <div className="mt-6">
                  <Pressable fullWidth onClick={() => setOpenId(null)}>
                    Close letter
                  </Pressable>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
