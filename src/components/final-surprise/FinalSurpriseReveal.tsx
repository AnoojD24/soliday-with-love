import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { AnimatedGiftBox } from '../gift-reveal/AnimatedGiftBox'
import { Pressable } from '../ui/Pressable'
import {
  FINAL_SURPRISE_COPY,
  FINAL_SURPRISE_TOTAL_MS,
  finalSurprisePhaseAt,
  type FinalSurprisePhase,
} from '../../data/finalSurpriseCopy'
import type { GiftRevealPhase } from '../../data/giftRevealCopy'
import { FinalSurpriseConfetti } from './FinalSurpriseConfetti'
import { FinalSurprisePhotoCard } from './FinalSurprisePhotoCard'

interface FinalSurpriseRevealProps {
  open: boolean
  hasSeenBefore: boolean
  onClose: () => void
  onCelebrationComplete: () => void
}

function mapGiftPhase(phase: FinalSurprisePhase): GiftRevealPhase {
  switch (phase) {
    case 'intro':
      return 'idle'
    case 'shaking':
      return 'anticipation'
    case 'burst':
      return 'unwrapping'
    case 'photoReveal':
      return 'photoReveal'
    case 'affection':
      return 'affectionBurst'
    case 'settled':
    case 'closing':
      return 'revealed'
  }
}

export function FinalSurpriseReveal({
  open,
  hasSeenBefore,
  onClose,
  onCelebrationComplete,
}: FinalSurpriseRevealProps) {
  const reduceMotion = useReducedMotion()
  const [phase, setPhase] = useState<FinalSurprisePhase>('intro')
  const [forceCinematic, setForceCinematic] = useState(false)
  const [replayKey, setReplayKey] = useState(0)
  const markedRef = useRef(false)
  const playCinematic = forceCinematic || !hasSeenBefore

  useEffect(() => {
    if (!open) {
      setPhase('intro')
      setForceCinematic(false)
      setReplayKey(0)
      markedRef.current = false
      return
    }

    if (reduceMotion || !playCinematic) {
      setPhase('settled')
      return
    }

    setPhase('intro')
    const started = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const elapsed = now - started
      setPhase(finalSurprisePhaseAt(elapsed))
      if (elapsed < FINAL_SURPRISE_TOTAL_MS) {
        frame = requestAnimationFrame(tick)
      } else {
        setPhase('settled')
      }
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [open, playCinematic, reduceMotion, replayKey])

  useEffect(() => {
    if (!open || phase !== 'settled') return
    if (hasSeenBefore) return
    if (markedRef.current) return
    markedRef.current = true
    onCelebrationComplete()
  }, [open, phase, hasSeenBefore, onCelebrationComplete])

  const showGift =
    playCinematic &&
    !reduceMotion &&
    (phase === 'intro' || phase === 'shaking' || phase === 'burst')
  const showPhoto =
    phase === 'photoReveal' ||
    phase === 'affection' ||
    phase === 'settled' ||
    phase === 'closing' ||
    (!playCinematic && open) ||
    Boolean(reduceMotion && open)
  const showConfetti = phase === 'burst' || phase === 'photoReveal'
  const lingerConfetti =
    phase === 'affection' || phase === 'settled' || phase === 'closing'
  const showKeepsake =
    phase === 'settled' ||
    phase === 'closing' ||
    (!playCinematic && open) ||
    Boolean(reduceMotion && open)

  function handleReplay() {
    setForceCinematic(true)
    setReplayKey((key) => key + 1)
  }

  function handleClose() {
    setPhase('closing')
    window.setTimeout(() => onClose(), reduceMotion ? 0 : 220)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <motion.button
            type="button"
            aria-label="Close final surprise"
            className="absolute inset-0 bg-berry/45 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          <FinalSurpriseConfetti
            active={showConfetti && playCinematic && !reduceMotion}
            lingering={lingerConfetti && !reduceMotion}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={FINAL_SURPRISE_COPY.title}
            className="relative z-10 flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-t-[2rem] bg-[#FFF7F4] shadow-[var(--shadow-lift)] sm:rounded-[2rem]"
            initial={
              reduceMotion ? false : { opacity: 0, y: 40, scale: 0.96 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative min-h-[42vh] flex-1 overflow-y-auto px-5 pb-6 pt-5">

              {showGift && (
                <div className="relative z-10 mx-auto mb-2 flex flex-col items-center">
                  {(phase === 'intro' || phase === 'shaking') && (
                    <motion.p
                      className="mb-2 text-xs tracking-[0.14em] text-rose uppercase"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {FINAL_SURPRISE_COPY.overlayEyebrow}
                    </motion.p>
                  )}
                  <motion.div
                    className="relative"
                    animate={
                      phase === 'shaking'
                        ? {
                            rotate: [0, -5, 5, -4, 4, -2, 2, 0],
                            scale: [1, 1.04, 0.97, 1.05, 1],
                            filter: [
                              'drop-shadow(0 0 0 rgba(198,124,152,0))',
                              'drop-shadow(0 0 18px rgba(198,124,152,0.55))',
                              'drop-shadow(0 0 28px rgba(128,53,77,0.45))',
                            ],
                          }
                        : phase === 'burst'
                          ? { scale: [1.05, 1.12, 1], opacity: 1 }
                          : { rotate: 0, scale: 1 }
                    }
                    transition={
                      phase === 'shaking'
                        ? { duration: 0.95, ease: 'easeInOut' }
                        : { duration: 0.35 }
                    }
                  >
                    <AnimatedGiftBox
                      phase={mapGiftPhase(phase)}
                      className="h-44 w-44 sm:h-52 sm:w-52"
                    />
                  </motion.div>
                </div>
              )}

              <div
                className={`relative z-20 ${
                  showPhoto ? 'mt-1' : 'mt-0'
                }`}
              >
                {(showPhoto || showKeepsake) && (
                  <FinalSurprisePhotoCard visible={showPhoto || showKeepsake} />
                )}
              </div>

              <AnimatePresence>
                {showKeepsake && (
                  <motion.div
                    className="relative z-20 mt-5 space-y-3 text-center"
                    initial={
                      reduceMotion || !playCinematic
                        ? { opacity: 1 }
                        : { opacity: 0, y: 16 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: playCinematic && !reduceMotion ? 0.15 : 0 }}
                  >
                    <p className="text-xs tracking-[0.16em] text-rose uppercase">
                      {FINAL_SURPRISE_COPY.youDidIt}
                    </p>
                    <h2 className="font-display text-3xl text-berry">
                      {FINAL_SURPRISE_COPY.title}
                    </h2>
                    <p className="font-script text-2xl text-berry">
                      {FINAL_SURPRISE_COPY.greeting}
                    </p>
                    <p className="whitespace-pre-line text-left font-sans text-base leading-relaxed text-berry/85">
                      {FINAL_SURPRISE_COPY.letter}
                    </p>
                    <p className="font-script text-xl text-berry">
                      {FINAL_SURPRISE_COPY.closing}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {showKeepsake && (
              <motion.div
                className="relative z-20 space-y-2 border-t border-blush/50 bg-[#FFF7F4] px-5 py-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Pressable fullWidth onClick={handleClose}>
                  {FINAL_SURPRISE_COPY.backCta}
                </Pressable>
                {(hasSeenBefore || phase === 'settled') && (
                  <Pressable
                    fullWidth
                    variant="ghost"
                    onClick={handleReplay}
                    disabled={playCinematic && phase !== 'settled' && phase !== 'closing'}
                  >
                    {FINAL_SURPRISE_COPY.replayCta}
                  </Pressable>
                )}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
