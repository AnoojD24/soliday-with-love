import { useRef } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import {
  GIFT_REVEAL_COPY,
  PHOTO_OBJECT_POSITION,
  type GiftRevealPhase,
} from '../../data/giftRevealCopy'
import { useLiteEffects } from '../../hooks/useLiteEffects'
import trishaWebp from '../../assets/trisha.webp'
import trishaJpg from '../../assets/trisha.jpg'

interface PolaroidRevealProps {
  phase: GiftRevealPhase
  ambient?: boolean
  onRevealComplete?: () => void
  className?: string
}

const SHOW_FROM: GiftRevealPhase[] = [
  'photoReveal',
  'affectionBurst',
  'revealed',
  'continuing',
]

export function PolaroidReveal({
  phase,
  ambient = false,
  onRevealComplete,
  className = '',
}: PolaroidRevealProps) {
  const reduceMotion = useReducedMotion()
  const lite = useLiteEffects()
  const completedRef = useRef(false)
  const visible = SHOW_FROM.includes(phase)
  const settled =
    phase === 'affectionBurst' ||
    phase === 'revealed' ||
    phase === 'continuing'
  const floatAmbient = ambient && settled && !lite

  if (!visible) return null

  if (reduceMotion) {
    return (
      <div className={`relative mx-auto w-[78%] max-w-[300px] ${className}`}>
        <PolaroidFrame ambient={false} />
      </div>
    )
  }

  return (
    <motion.div
      className={`relative mx-auto w-[78%] max-w-[300px] ${className}`}
      initial={{
        opacity: 0,
        y: lite ? 64 : 100,
        scale: lite ? 0.78 : 0.65,
        rotate: 7,
      }}
      animate={{
        opacity: 1,
        y: floatAmbient ? [0, -2.5, 0] : 0,
        scale: 1,
        rotate: 3,
      }}
      transition={
        floatAmbient
          ? {
              y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
              opacity: { duration: 0.8 },
              scale: { type: 'spring', stiffness: 90, damping: 16 },
              rotate: { type: 'spring', stiffness: 90, damping: 16 },
            }
          : {
              type: 'spring',
              stiffness: lite ? 120 : 90,
              damping: lite ? 18 : 16,
              mass: 0.9,
            }
      }
      onAnimationComplete={() => {
        if (phase !== 'photoReveal' || completedRef.current) return
        completedRef.current = true
        onRevealComplete?.()
      }}
    >
      {/* Emerging-from-box mask while rising */}
      <div
        className="pointer-events-none absolute inset-x-[-8%] bottom-[-18%] top-[55%] z-10"
        style={{
          background:
            phase === 'photoReveal'
              ? 'linear-gradient(to top, #FFF6F2 35%, transparent)'
              : 'transparent',
          opacity: phase === 'photoReveal' ? 1 : 0,
          transition: 'opacity 400ms ease',
        }}
        aria-hidden="true"
      />
      <PolaroidFrame ambient={floatAmbient} />
      <div
        className="pointer-events-none absolute inset-0 -z-10 rounded-[1.25rem]"
        style={{
          background:
            'radial-gradient(circle at 50% 40%, rgba(198,124,152,0.28), transparent 68%)',
          transform: 'scale(1.06)',
        }}
        aria-hidden="true"
      />
    </motion.div>
  )
}

function PolaroidFrame({ ambient }: { ambient: boolean }) {
  return (
    <figure
      className="relative rounded-[1.1rem] border border-[#E8B7C8] bg-[#FFF9F4] p-2.5 pb-3 shadow-[0_18px_40px_rgba(128,53,77,0.16)]"
      style={{ boxShadow: '0 16px 36px rgba(128,53,77,0.14), inset 0 0 0 1px rgba(247,220,229,0.7)' }}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[0.65rem] bg-blush/40">
        <picture>
          <source srcSet={trishaWebp} type="image/webp" />
          <img
            src={trishaJpg}
            alt={GIFT_REVEAL_COPY.photoAlt}
            className="h-full w-full scale-[1.06] object-cover"
            style={{ objectPosition: PHOTO_OBJECT_POSITION }}
            decoding="async"
            fetchPriority="high"
            draggable={false}
          />
        </picture>
      </div>
      <figcaption className="relative z-40 mt-4 px-2 text-center font-script text-[1.65rem] leading-tight font-semibold tracking-wide text-[#80354D] sm:text-[1.85rem]">
        {GIFT_REVEAL_COPY.photoCaption}
      </figcaption>
      {ambient && (
        <motion.span
          className="pointer-events-none absolute -left-2 top-6 h-2 w-2 rounded-full bg-blush"
          animate={{ opacity: [0.2, 0.9, 0.2], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 2.8, repeat: Infinity }}
          aria-hidden="true"
        />
      )}
    </figure>
  )
}

/** Preload helpers so the image is ready before the box opens. */
export function preloadGiftPhoto() {
  const webp = new Image()
  webp.src = trishaWebp
  const jpg = new Image()
  jpg.src = trishaJpg
}
