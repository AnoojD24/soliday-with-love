import { useReducedMotion } from 'motion/react'
import { useLiteEffects } from '../../hooks/useLiteEffects'

interface OpenWhenEnvelopeProps {
  paper: string
  accent: string
  opened?: boolean
  className?: string
}

/**
 * CSS-driven flap (no Framer Motion on SVG). iPhone Safari stalls hard on
 * Motion-animated <g> rotates; compositor transitions stay smooth.
 */
export function OpenWhenEnvelope({
  paper,
  accent,
  opened = false,
  className = '',
}: OpenWhenEnvelopeProps) {
  const reduceMotion = useReducedMotion()
  const lite = useLiteEffects()
  const instant = Boolean(reduceMotion)
  const ms = instant ? 0 : lite ? 280 : 450
  const ease = 'cubic-bezier(0.22, 1, 0.36, 1)'
  const flapDeg = lite ? -148 : -168

  return (
    <svg
      viewBox="0 0 140 120"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ overflow: 'visible' }}
    >
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

      {/* letter rising — skipped on lite (snap) to cut paint work */}
      <g
        style={{
          opacity: opened ? 1 : 0,
          transform: opened ? 'translateY(-22px)' : 'translateY(10px)',
          transition: lite || instant
            ? `opacity ${ms}ms ${ease}`
            : `transform ${ms}ms ${ease}, opacity ${ms}ms ${ease}`,
          transitionDelay: opened && !instant && !lite ? '60ms' : '0ms',
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
      </g>

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

      {/* flap */}
      <g
        style={{
          transformOrigin: '70px 42px',
          transformBox: 'view-box',
          transform: opened ? `rotate(${flapDeg}deg)` : 'rotate(0deg)',
          transition: `transform ${ms}ms ${ease}`,
        }}
      >
        <path
          d="M16 42l54 36 54-36"
          fill="#FFF6F2"
          stroke={accent}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M16 42l54 36 54-36"
          fill={paper}
          stroke={accent}
          strokeWidth="2"
          strokeLinejoin="round"
          style={{
            opacity: opened ? 0 : 1,
            transition: `opacity ${instant ? 0 : 140}ms linear`,
            transitionDelay: opened && !instant ? '80ms' : '0ms',
          }}
        />
      </g>

      {/* wax seal */}
      <g
        style={{
          transformOrigin: '70px 68px',
          transformBox: 'view-box',
          transform: opened
            ? 'translateY(10px) scale(0.55)'
            : 'translateY(0px) scale(1)',
          opacity: opened ? 0 : 1,
          transition: `transform ${ms}ms ${ease}, opacity ${Math.min(ms, 280)}ms ${ease}`,
        }}
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
      </g>
    </svg>
  )
}
