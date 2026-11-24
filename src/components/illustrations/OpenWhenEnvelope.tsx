import { motion, useReducedMotion } from 'motion/react'

interface OpenWhenEnvelopeProps {
  paper: string
  accent: string
  opened?: boolean
  className?: string
}

const FLAP_EASE = [0.22, 1, 0.36, 1] as const

export function OpenWhenEnvelope({
  paper,
  accent,
  opened = false,
  className = '',
}: OpenWhenEnvelopeProps) {
  const reduceMotion = useReducedMotion()
  const duration = reduceMotion ? 0.01 : 0.55

  return (
    <svg
      viewBox="0 0 140 120"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ overflow: 'visible' }}
    >
      {/* envelope back */}
      <rect
        x="14"
        y="36"
        width="112"
        height="68"
        rx="10"
        fill={paper}
        stroke={accent}
        strokeWidth="2"
      />

      {/* letter rising from inside */}
      <motion.g
        initial={false}
        animate={
          opened ? { y: -24, opacity: 1 } : { y: 12, opacity: 0 }
        }
        transition={{
          duration: reduceMotion ? 0.01 : 0.45,
          ease: FLAP_EASE,
          delay: opened && !reduceMotion ? 0.1 : 0,
        }}
      >
        <rect
          x="34"
          y="44"
          width="72"
          height="50"
          rx="4"
          fill="#FFFBF8"
          stroke={accent}
          strokeWidth="1.5"
        />
        <path
          d="M42 56h56M42 66h40M42 76h48"
          stroke={accent}
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.45"
        />
      </motion.g>

      {/* left & right inner folds */}
      <path
        d="M16 42l54 36v26H22c-3.3 0-6-2.7-6-6V42z"
        fill={paper}
        stroke={accent}
        strokeWidth="1.5"
        strokeLinejoin="round"
        opacity="0.92"
      />
      <path
        d="M124 42l-54 36v26h48c3.3 0 6-2.7 6-6V42z"
        fill={paper}
        stroke={accent}
        strokeWidth="1.5"
        strokeLinejoin="round"
        opacity="0.92"
      />

      {/* front bottom panel */}
      <path
        d="M16 104c0 3.3 2.7 6 6 6h96c3.3 0 6-2.7 6-6V78L70 48 16 78v26z"
        fill={paper}
        stroke={accent}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M16 42h108"
        stroke="#FFFFFF"
        strokeWidth="3"
        opacity="0.3"
      />

      {/* flap hinges at top edge, folds back when opened */}
      <motion.g
        initial={false}
        animate={opened ? { rotate: -172 } : { rotate: 0 }}
        transition={{ duration, ease: FLAP_EASE }}
        style={{ transformOrigin: '70px 42px' }}
      >
        <path
          d="M16 42l54 36 54-36"
          fill="#FFF6F2"
          stroke={accent}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <motion.path
          d="M16 42l54 36 54-36"
          fill={paper}
          stroke={accent}
          strokeWidth="2"
          strokeLinejoin="round"
          initial={false}
          animate={{ opacity: opened ? 0 : 1 }}
          transition={{
            duration: reduceMotion ? 0.01 : 0.18,
            delay: opened && !reduceMotion ? 0.12 : 0,
          }}
        />
      </motion.g>

      {/* wax seal */}
      <motion.g
        initial={false}
        animate={
          opened
            ? { scale: 0.5, y: 12, opacity: 0 }
            : { scale: 1, y: 0, opacity: 1 }
        }
        transition={{
          duration: reduceMotion ? 0.01 : 0.35,
          ease: FLAP_EASE,
        }}
        style={{ transformOrigin: '70px 68px' }}
      >
        <circle
          cx="70"
          cy="68"
          r="15"
          fill="#80354D"
          stroke="#FFF6F2"
          strokeWidth="2"
        />
        <path
          d="M70 74s-7.5-4.8-7.5-8.8C62.5 62.4 65 60 67.8 60c1.5 0 2.8.9 3.7 2.1.9-1.2 2.2-2.1 3.7-2.1 2.8 0 5.3 2.4 5.3 5.2 0 4-7.5 8.8-7.5 8.8z"
          fill="#F7DCE5"
          transform="translate(-1 0)"
        />
      </motion.g>
    </svg>
  )
}
