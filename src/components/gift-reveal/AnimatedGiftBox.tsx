import { motion, useReducedMotion } from 'motion/react'
import type { GiftRevealPhase } from '../../data/giftRevealCopy'

interface AnimatedGiftBoxProps {
  phase: GiftRevealPhase
  className?: string
  onUnwrappingComplete?: () => void
}

export function AnimatedGiftBox({
  phase,
  className = '',
  onUnwrappingComplete,
}: AnimatedGiftBoxProps) {
  const reduceMotion = useReducedMotion()
  const anticipates = phase === 'anticipation'
  const opens =
    phase === 'unwrapping' ||
    phase === 'photoReveal' ||
    phase === 'affectionBurst' ||
    phase === 'revealed' ||
    phase === 'continuing'
  const sparkle = anticipates || opens

  if (reduceMotion && opens) {
    return (
      <svg
        viewBox="0 0 280 260"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <GiftBody />
        <GiftLid open />
        <GiftBow open />
        <ellipse cx="140" cy="214" rx="78" ry="12" fill="#80354D" opacity="0.08" />
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 280 260"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="48" cy="42" r="4" fill="#F7DCE5" opacity="0.9" />
      <circle cx="232" cy="58" r="3" fill="#EFE0F5" />
      <path
        d="M62 78c6-10 18-10 24 0"
        stroke="#C67C98"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M210 34l4 8 8 1-6 5 2 8-8-4-8 4 2-8-6-5 8-1 4-8z"
        fill="#F7DCE5"
        opacity="0.85"
      />

      <ellipse cx="140" cy="214" rx="78" ry="12" fill="#80354D" opacity="0.08" />

      {/* Soft inner glow once open — opacity only (blur is costly on phones) */}
      <motion.ellipse
        cx="140"
        cy="150"
        rx="58"
        ry="32"
        fill="#F7DCE5"
        initial={{ opacity: 0 }}
        animate={{ opacity: opens ? 0.55 : 0 }}
        transition={{ duration: 0.45 }}
      />

      <motion.g
        style={{ transformOrigin: '140px 170px' }}
        animate={
          anticipates
            ? { rotate: [0, -3, 3, -2, 2, 0], scale: [1, 0.97, 1.02, 1] }
            : { rotate: 0, scale: 1 }
        }
        transition={
          anticipates
            ? { duration: 0.4, ease: 'easeInOut' }
            : { duration: 0.3 }
        }
      >
        <GiftBody />
      </motion.g>

      <motion.g
        style={{ transformOrigin: '140px 118px' }}
        initial={false}
        animate={
          opens
            ? { y: -56, x: 18, rotate: -14 }
            : anticipates
              ? { y: [0, -2, 0], rotate: [0, -1, 1, 0] }
              : { y: 0, x: 0, rotate: 0 }
        }
        transition={
          opens
            ? { type: 'spring', stiffness: 120, damping: 14, mass: 0.8 }
            : { duration: 0.4 }
        }
        onAnimationComplete={() => {
          if (phase === 'unwrapping') onUnwrappingComplete?.()
        }}
      >
        <GiftLid open={opens} />
      </motion.g>

      <motion.g
        style={{ transformOrigin: '140px 96px' }}
        initial={false}
        animate={
          opens
            ? { y: -72, x: -8, rotate: 12, scale: 1.05 }
            : anticipates
              ? { rotate: [0, 4, -4, 0], scale: [1, 1.04, 1] }
              : { y: 0, x: 0, rotate: 0, scale: 1 }
        }
        transition={
          opens
            ? { type: 'spring', stiffness: 110, damping: 12, mass: 0.7 }
            : { duration: 0.4 }
        }
      >
        <GiftBow open={opens} />
      </motion.g>

      {/* Ribbon tails falling */}
      <motion.path
        d="M108 108 C90 130 84 160 92 188"
        stroke="#C67C98"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={
          opens
            ? { pathLength: 1, opacity: 0.75 }
            : { pathLength: 0, opacity: 0 }
        }
        transition={{ duration: 0.7, ease: 'easeOut' }}
      />
      <motion.path
        d="M172 108 C190 132 198 162 188 190"
        stroke="#80354D"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={
          opens
            ? { pathLength: 1, opacity: 0.7 }
            : { pathLength: 0, opacity: 0 }
        }
        transition={{ duration: 0.75, ease: 'easeOut', delay: 0.05 }}
      />

      {sparkle &&
        [
          { cx: 118, cy: 78, delay: 0 },
          { cx: 162, cy: 70, delay: 0.08 },
          { cx: 140, cy: 58, delay: 0.14 },
          { cx: 100, cy: 96, delay: 0.1 },
          { cx: 180, cy: 92, delay: 0.16 },
        ].map((s) => (
          <motion.circle
            key={`${s.cx}-${s.cy}`}
            cx={s.cx}
            cy={s.cy}
            r="3"
            fill="#F7DCE5"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0.4, 1.2, 0.6] }}
            transition={{
              duration: 0.55,
              delay: s.delay,
              repeat: anticipates ? 0 : 0,
            }}
          />
        ))}

      {/* Hearts escaping the opening */}
      {opens &&
        [
          { x: 130, delay: 0.05 },
          { x: 150, delay: 0.12 },
          { x: 140, delay: 0.2 },
        ].map((h) => (
          <motion.path
            key={h.x}
            d="M0 4c0-2.5 2-4 4-4 1.5 0 3 1 4 2.5C9 1 10.5 0 12 0c2 0 4 1.5 4 4 0 5-8 9-8 9S0 9 0 4z"
            fill="#C67C98"
            transform={`translate(${h.x} 130)`}
            initial={{ opacity: 0, y: 0, scale: 0.6 }}
            animate={{ opacity: [0, 1, 0], y: -48, scale: 1 }}
            transition={{ duration: 0.9, delay: h.delay, ease: 'easeOut' }}
          />
        ))}
    </svg>
  )
}

function GiftBody() {
  return (
    <g>
      <rect
        x="74"
        y="118"
        width="132"
        height="96"
        rx="18"
        fill="#F7DCE5"
        stroke="#C67C98"
        strokeWidth="2"
      />
      <rect x="128" y="118" width="24" height="96" fill="#C67C98" />
      <rect x="74" y="154" width="132" height="22" fill="#C67C98" />
      <path
        d="M118 164c8-18 36-18 44 0"
        stroke="#FFF6F2"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.55"
      />
    </g>
  )
}

function GiftLid({ open = false }: { open?: boolean }) {
  return (
    <g opacity={open ? 0.95 : 1}>
      <rect
        x="70"
        y="96"
        width="140"
        height="34"
        rx="12"
        fill="#E8B7C8"
        stroke="#C67C98"
        strokeWidth="2"
      />
      <rect x="128" y="96" width="24" height="34" fill="#C67C98" />
    </g>
  )
}

function GiftBow({ open = false }: { open?: boolean }) {
  return (
    <g opacity={open ? 0.9 : 1}>
      <path
        d="M140 96c-18-28-48-18-40 8 18-4 30 0 40-8z"
        fill="#C67C98"
      />
      <path
        d="M140 96c18-28 48-18 40 8-18-4-30 0-40-8z"
        fill="#80354D"
      />
      <circle cx="140" cy="98" r="7" fill="#F7DCE5" stroke="#80354D" />
      <path
        d="M136 98c2-3 6-3 8 0"
        stroke="#80354D"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </g>
  )
}
