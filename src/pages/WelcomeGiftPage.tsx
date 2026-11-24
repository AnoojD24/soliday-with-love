import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { GiftIllustration } from '../components/illustrations/GiftIllustration'
import { BowMark, HeartMark } from '../components/illustrations/Ornaments'
import { Pressable } from '../components/ui/Pressable'
import { useAppState } from '../context/AppStateContext'

export function WelcomeGiftPage() {
  const {
    state,
    replayingWelcome,
    completeOnboarding,
    finishWelcomeReplay,
  } = useAppState()
  const [unwrapping, setUnwrapping] = useState(false)
  const reduceMotion = useReducedMotion()

  function handleUnwrap() {
    if (unwrapping) return
    setUnwrapping(true)
    window.setTimeout(
      () => {
        if (replayingWelcome && state.onboardingCompleted) {
          finishWelcomeReplay()
        } else {
          completeOnboarding()
        }
      },
      reduceMotion ? 100 : 1100,
    )
  }

  return (
    <main className="safe-top mx-auto flex min-h-dvh w-full max-w-lg flex-col px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <div className="flex items-center justify-between pt-2">
        <img
          src="/icons/icon.svg"
          alt=""
          className="h-10 w-10 rounded-2xl shadow-[var(--shadow-soft)]"
          aria-hidden="true"
        />
        <div className="flex items-center gap-2">
          <BowMark className="h-8 w-10" />
          <HeartMark className="h-5 w-5 opacity-80" />
        </div>
      </div>

      <motion.div
        className="mt-2 flex flex-1 flex-col items-center text-center"
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
      >
        <p className="font-script text-xl text-rose sm:text-2xl">
          A little Christmas gift for you
        </p>

        <div className="relative mt-1 w-full max-w-[260px] sm:max-w-sm">
          <GiftIllustration
            className="mx-auto h-auto w-full"
            unwrapping={unwrapping}
          />
          {unwrapping && !reduceMotion && (
            <>
              <motion.span
                className="absolute left-[20%] top-[30%] h-2 w-2 rounded-full bg-blush"
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 0, y: -30, x: -10 }}
                transition={{ duration: 0.8 }}
              />
              <motion.span
                className="absolute right-[22%] top-[28%] h-2 w-2 rounded-full bg-lavender"
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 0, y: -36, x: 12 }}
                transition={{ duration: 0.85, delay: 0.05 }}
              />
              <motion.span
                className="absolute left-1/2 top-[18%]"
                initial={{ opacity: 1, scale: 1 }}
                animate={{ opacity: 0, scale: 1.4, y: -24 }}
                transition={{ duration: 0.9 }}
              >
                <HeartMark className="h-4 w-4" />
              </motion.span>
            </>
          )}
        </div>

        <h1 className="mt-1 font-display text-[2rem] leading-tight text-berry sm:text-4xl">
          Soliday With Love
        </h1>

        <p className="mt-3 max-w-sm text-sm leading-relaxed text-berry/80 sm:text-base">
          For my favorite girl, who makes everything a little brighter.
        </p>
        <p className="mt-2 max-w-sm text-xs leading-relaxed text-rose sm:text-sm">
          Your workouts, your journey, and a little love from me along the way.
        </p>
        <p className="mt-4 font-script text-lg text-berry sm:text-xl">
          Made just for Trisha
        </p>

        <div className="mt-auto w-full space-y-2 pt-6">
          <Pressable
            fullWidth
            onClick={handleUnwrap}
            disabled={unwrapping}
            aria-label="Unwrap your gift"
          >
            {unwrapping ? 'Opening…' : 'Unwrap your gift'}
          </Pressable>
          {replayingWelcome && (
            <Pressable
              fullWidth
              variant="ghost"
              onClick={finishWelcomeReplay}
              disabled={unwrapping}
            >
              Back to Soliday
            </Pressable>
          )}
        </div>
      </motion.div>
    </main>
  )
}
