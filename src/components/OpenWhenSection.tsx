import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import {
  OPEN_WHEN_CLOSING,
  OPEN_WHEN_GREETING,
  OPEN_WHEN_LETTERS,
  OPEN_WHEN_SECTION,
  type OpenWhenLetter,
} from '../data/openWhenLetters'
import { useLiteEffects } from '../hooks/useLiteEffects'
import { OpenWhenEnvelope } from './illustrations/OpenWhenEnvelope'
import { Pressable } from './ui/Pressable'

interface OpenWhenSectionProps {
  openedIds: string[]
  onOpened: (id: string) => void
}

export function OpenWhenSection({
  openedIds,
  onOpened,
}: OpenWhenSectionProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [flapOpen, setFlapOpen] = useState(false)
  const [showLetter, setShowLetter] = useState(false)
  const reduceMotion = useReducedMotion()
  const lite = useLiteEffects()

  // Shorter choreography on phones — less time with 4 SVGs + a modal fighting the GPU.
  const openDelayMs = reduceMotion ? 0 : lite ? 180 : 300
  const closeDelayMs = reduceMotion ? 0 : lite ? 220 : 420

  const active = OPEN_WHEN_LETTERS.find((letter) => letter.id === activeId)

  function openLetter(letter: OpenWhenLetter) {
    if (activeId) return
    setActiveId(letter.id)
    onOpened(letter.id)

    if (reduceMotion) {
      setFlapOpen(true)
      setShowLetter(true)
      return
    }

    setFlapOpen(false)
    setShowLetter(false)
    window.requestAnimationFrame(() => {
      setFlapOpen(true)
      window.setTimeout(() => setShowLetter(true), openDelayMs)
    })
  }

  function closeLetter() {
    if (reduceMotion) {
      setShowLetter(false)
      setFlapOpen(false)
      setActiveId(null)
      return
    }

    setShowLetter(false)
    setFlapOpen(false)
    window.setTimeout(() => setActiveId(null), closeDelayMs)
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-display text-2xl text-berry">
          {OPEN_WHEN_SECTION.heading}
        </h2>
        <p className="mt-1 text-sm text-berry/75">
          {OPEN_WHEN_SECTION.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {OPEN_WHEN_LETTERS.map((letter) => {
          const readBefore = openedIds.includes(letter.id)
          const isActive = activeId === letter.id
          return (
            <button
              key={letter.id}
              type="button"
              onClick={() => openLetter(letter)}
              className="rounded-[1.5rem] border border-blush/60 bg-white/90 p-3 text-left shadow-[var(--shadow-soft)] transition-transform active:scale-[0.98]"
              aria-label={`${letter.title}${readBefore ? ', read before' : ''}`}
            >
              <OpenWhenEnvelope
                paper={letter.paper}
                accent={letter.accent}
                opened={isActive ? flapOpen : false}
                className="mx-auto h-auto w-full max-w-[130px]"
              />
              <p className="mt-2 text-center font-display text-sm leading-snug text-berry">
                {letter.shortLabel}
              </p>
              {readBefore && (
                <p className="mt-1 text-center text-[10px] tracking-[0.08em] text-rose uppercase">
                  Read before
                </p>
              )}
            </button>
          )
        })}
      </div>

      <p className="text-center font-script text-lg text-rose">
        {OPEN_WHEN_SECTION.footer}
      </p>

      <AnimatePresence>
        {active && showLetter && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
            <motion.button
              type="button"
              aria-label="Fold letter closed"
              className="absolute inset-0 bg-berry/35"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: lite ? 0.15 : 0.22 }}
              onClick={closeLetter}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={active.title}
              className="relative z-10 max-h-[85vh] w-full max-w-md overflow-y-auto rounded-[2rem] bg-[#FFF9F5] shadow-[var(--shadow-lift)]"
              initial={
                reduceMotion
                  ? false
                  : lite
                    ? { opacity: 0, y: 12 }
                    : { opacity: 0, y: 28, scale: 0.94 }
              }
              animate={
                lite ? { opacity: 1, y: 0 } : { opacity: 1, y: 0, scale: 1 }
              }
              exit={
                reduceMotion
                  ? { opacity: 0 }
                  : lite
                    ? { opacity: 0, y: 8 }
                    : { opacity: 0, y: 18, scale: 0.96 }
              }
              transition={
                lite || reduceMotion
                  ? { duration: 0.2, ease: [0.22, 1, 0.36, 1] }
                  : { type: 'spring', stiffness: 280, damping: 28 }
              }
            >
              <div
                className="px-5 py-4"
                style={{ backgroundColor: `${active.paper}` }}
              >
                <p className="text-xs tracking-[0.14em] text-rose uppercase">
                  Opened with love
                </p>
                <h3 className="font-display text-xl text-berry">
                  {active.title}
                </h3>
              </div>
              <div className="space-y-4 px-5 py-6">
                <p className="font-script text-2xl text-berry">
                  {OPEN_WHEN_GREETING}
                </p>
                <figure className="overflow-hidden rounded-[1.25rem] border border-blush/50 bg-white shadow-[var(--shadow-soft)]">
                  <picture>
                    <source srcSet={active.photo.webp} type="image/webp" />
                    <img
                      src={active.photo.jpg}
                      alt={active.photo.alt}
                      className="max-h-[42vh] w-full object-cover object-center"
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                </figure>
                <p className="whitespace-pre-line font-sans text-base leading-relaxed text-berry/85">
                  {active.body}
                </p>
                <p className="font-script text-xl text-berry">
                  {OPEN_WHEN_CLOSING}
                </p>
                <Pressable fullWidth onClick={closeLetter}>
                  Fold it back up
                </Pressable>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
