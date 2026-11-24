import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  GIFT_REVEAL_COPY,
  GIFT_REVEAL_TIMING,
  type GiftRevealPhase,
} from '../../data/giftRevealCopy'
import { HeartMark } from '../illustrations/Ornaments'
import { Pressable } from '../ui/Pressable'
import { AffectionParticles } from './AffectionParticles'
import { AnimatedGiftBox } from './AnimatedGiftBox'
import { HugRibbon } from './HugRibbon'
import { PolaroidReveal, preloadGiftPhoto } from './PolaroidReveal'
import { WelcomeGiftConfetti } from './WelcomeGiftConfetti'

interface GiftRevealSequenceProps {
  replaying: boolean
  onComplete: () => void
  onBack?: () => void
}

export function GiftRevealSequence({
  replaying,
  onComplete,
  onBack,
}: GiftRevealSequenceProps) {
  const reduceMotion = useReducedMotion()
  const [phase, setPhase] = useState<GiftRevealPhase>('idle')
  const [documentVisible, setDocumentVisible] = useState(
    typeof document === 'undefined' ? true : document.visibilityState === 'visible',
  )
  const lockedRef = useRef(false)
  const timersRef = useRef<number[]>([])

  useEffect(() => {
    preloadGiftPhoto()
  }, [])

  useEffect(() => {
    const onVisibility = () => {
      setDocumentVisible(document.visibilityState === 'visible')
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  useEffect(() => {
    return () => {
      for (const id of timersRef.current) window.clearTimeout(id)
    }
  }, [])

  const clearTimers = () => {
    for (const id of timersRef.current) window.clearTimeout(id)
    timersRef.current = []
  }

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms)
    timersRef.current.push(id)
  }, [])

  const advanceTo = useCallback((next: GiftRevealPhase) => {
    setPhase((current) => {
      if (current === 'continuing') return current
      return next
    })
  }, [])

  const startSequence = useCallback(() => {
    if (lockedRef.current) return
    lockedRef.current = true
    clearTimers()

    if (reduceMotion) {
      advanceTo('revealed')
      return
    }

    advanceTo('anticipation')
    schedule(() => advanceTo('unwrapping'), GIFT_REVEAL_TIMING.anticipation)
    // Safety nets if Motion completion callbacks miss
    schedule(
      () => setPhase((p) => (p === 'unwrapping' ? 'photoReveal' : p)),
      GIFT_REVEAL_TIMING.anticipation + GIFT_REVEAL_TIMING.unwrapping + 160,
    )
    schedule(
      () =>
        setPhase((p) => {
          if (p !== 'photoReveal') return p
          schedule(
            () => advanceTo('revealed'),
            GIFT_REVEAL_TIMING.affectionBurst,
          )
          return 'affectionBurst'
        }),
      GIFT_REVEAL_TIMING.anticipation +
        GIFT_REVEAL_TIMING.unwrapping +
        GIFT_REVEAL_TIMING.photoReveal +
        220,
    )
  }, [advanceTo, reduceMotion, schedule])

  const handleUnwrappingComplete = useCallback(() => {
    setPhase((p) => (p === 'unwrapping' ? 'photoReveal' : p))
  }, [])

  const handlePhotoRevealComplete = useCallback(() => {
    setPhase((p) => {
      if (p !== 'photoReveal') return p
      schedule(() => advanceTo('revealed'), GIFT_REVEAL_TIMING.affectionBurst)
      return 'affectionBurst'
    })
  }, [advanceTo, schedule])

  const handleContinue = () => {
    if (phase === 'continuing') return
    setPhase('continuing')
    onComplete()
  }

  const inMotion = phase !== 'idle'
  const showPhoto =
    phase === 'photoReveal' ||
    phase === 'affectionBurst' ||
    phase === 'revealed' ||
    phase === 'continuing'
  const showAffection =
    phase === 'affectionBurst' ||
    phase === 'revealed' ||
    phase === 'continuing'
  const showFinalCopy = phase === 'revealed' || phase === 'continuing'
  const ambient = showFinalCopy && documentVisible && !reduceMotion
  // Burst only through the open — don't keep a confetti layer into revealed.
  const showConfetti =
    phase === 'unwrapping' ||
    phase === 'photoReveal' ||
    phase === 'affectionBurst'

  return (
    <main className="safe-top relative mx-auto flex min-h-dvh w-full max-w-lg flex-col overflow-x-clip px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-5">
      <WelcomeGiftConfetti active={showConfetti && !reduceMotion} />
      <div className="relative z-30 flex items-center justify-between pt-2">
        <img
          src="/icons/icon.svg"
          alt=""
          className="h-10 w-10 rounded-2xl shadow-[var(--shadow-soft)]"
          aria-hidden="true"
        />
        <HeartMark className="h-5 w-5 opacity-80" />
      </div>

      <motion.div
        className="relative z-30 mt-2 flex flex-1 flex-col items-center text-center"
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
      >
        <AnimatePresence>
          {phase === 'idle' && (
            <motion.p
              className="font-script text-xl text-rose sm:text-2xl"
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {GIFT_REVEAL_COPY.welcomeEyebrow}
            </motion.p>
          )}
        </AnimatePresence>

        {showFinalCopy && (
          <motion.p
            className="mb-2 font-script text-xl text-rose sm:text-2xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            {GIFT_REVEAL_COPY.introScript}
          </motion.p>
        )}

        <div
          className={`relative flex w-full max-w-[340px] flex-col items-center ${
            showFinalCopy ? 'mt-5' : 'mt-1'
          }`}
        >
          {/* During emerge: gift behind; after settle: photo on top, gift tucked under */}
          {!showFinalCopy && (
            <div
              className={`relative w-full max-w-[260px] transition-opacity duration-500 sm:max-w-sm ${
                showPhoto ? 'opacity-75' : 'opacity-100'
              }`}
            >
              <AnimatedGiftBox
                phase={phase}
                className="mx-auto h-auto w-full"
                onUnwrappingComplete={handleUnwrappingComplete}
              />
            </div>
          )}

          {showPhoto && (
            <div
              className={`relative z-20 w-full ${
                showFinalCopy ? 'mt-3' : '-mt-28 sm:-mt-32'
              }`}
            >
              <div className="relative mx-auto w-full max-w-[300px] overflow-visible px-3 py-6">
                <HugRibbon active={showAffection} />
                <AffectionParticles
                  burst={showAffection}
                  ambient={ambient}
                />
                <div
                  className={`relative z-20 ${
                    phase === 'photoReveal'
                      ? 'overflow-hidden [clip-path:inset(0_0_8%_0)]'
                      : 'overflow-visible'
                  }`}
                >
                  <PolaroidReveal
                    phase={phase}
                    ambient={ambient}
                    onRevealComplete={handlePhotoRevealComplete}
                  />
                </div>
              </div>
            </div>
          )}

          {showFinalCopy && (
            <motion.div
              className="relative z-10 -mt-6 w-full max-w-[160px] opacity-80"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 0.8, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <AnimatedGiftBox
                phase={phase}
                className="mx-auto h-auto w-full"
              />
            </motion.div>
          )}
        </div>

        <AnimatePresence>
          {phase === 'idle' && (
            <motion.div
              className="mt-1 space-y-2"
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
            >
              <h1 className="font-display text-[2rem] leading-tight text-berry sm:text-4xl">
                {GIFT_REVEAL_COPY.brandTitle}
              </h1>
              <p className="mx-auto max-w-sm text-sm leading-relaxed text-berry/80 sm:text-base">
                {GIFT_REVEAL_COPY.welcomeLine}
              </p>
              <p className="mx-auto max-w-sm text-xs leading-relaxed text-rose sm:text-sm">
                {GIFT_REVEAL_COPY.welcomeSub}
              </p>
              <p className="font-script text-lg text-berry sm:text-xl">
                {GIFT_REVEAL_COPY.welcomeScript}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {showFinalCopy && (
          <motion.div
            className="mt-4 space-y-2 px-1"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
          >
            <h2 className="font-display text-2xl leading-snug text-berry sm:text-3xl">
              {GIFT_REVEAL_COPY.revealHeadline}
            </h2>
            <p className="text-sm leading-relaxed text-berry/85 sm:text-base">
              {GIFT_REVEAL_COPY.mainMessage}
            </p>
          </motion.div>
        )}

        <div className="mt-auto w-full space-y-2 pt-6">
          {phase === 'idle' && (
            <Pressable
              fullWidth
              onClick={startSequence}
              aria-label={GIFT_REVEAL_COPY.unwrapCta}
            >
              {GIFT_REVEAL_COPY.unwrapCta}
            </Pressable>
          )}

          {inMotion && !showFinalCopy && (
            <Pressable fullWidth disabled aria-label={GIFT_REVEAL_COPY.openingCta}>
              {GIFT_REVEAL_COPY.openingCta}
            </Pressable>
          )}

          {showFinalCopy && (
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.25 }}
            >
              <Pressable
                fullWidth
                onClick={handleContinue}
                disabled={phase === 'continuing'}
                aria-label={GIFT_REVEAL_COPY.continueCta}
              >
                {GIFT_REVEAL_COPY.continueCta}
              </Pressable>
              <p className="text-center font-script text-lg text-rose">
                {GIFT_REVEAL_COPY.closing}
              </p>
            </motion.div>
          )}

          {replaying && onBack && phase === 'idle' && (
            <Pressable fullWidth variant="ghost" onClick={onBack}>
              {GIFT_REVEAL_COPY.backCta}
            </Pressable>
          )}
          {replaying && onBack && showFinalCopy && (
            <Pressable
              fullWidth
              variant="ghost"
              onClick={onBack}
              disabled={phase === 'continuing'}
            >
              {GIFT_REVEAL_COPY.backCta}
            </Pressable>
          )}
        </div>
      </motion.div>
    </main>
  )
}
