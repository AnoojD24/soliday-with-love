import { useReducedMotion } from 'motion/react'
import { useLiteEffects } from '../../hooks/useLiteEffects'

interface HugRibbonProps {
  active: boolean
  className?: string
}

/** Soft orbital hug curves — static on phones (pathLength Motion is costly on iOS). */
export function HugRibbon({ active, className = '' }: HugRibbonProps) {
  const reduceMotion = useReducedMotion()
  const lite = useLiteEffects()
  if (!active) return null

  const animateIn = !reduceMotion && !lite

  return (
    <svg
      viewBox="0 0 320 420"
      className={`pointer-events-none absolute inset-[-22%] z-0 h-[144%] w-[144%] ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M40 55 C0 130 -4 290 44 380 C108 430 212 430 276 380 C324 290 320 130 280 55"
        stroke="#C67C98"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.55}
        style={
          animateIn
            ? {
                strokeDasharray: 1200,
                strokeDashoffset: 0,
                animation: 'soliday-draw 1s ease-out both',
              }
            : undefined
        }
      />
      <path
        d="M56 78 C18 148 14 290 58 365 C114 400 206 400 262 365 C306 290 302 148 264 78"
        stroke="#E8B7C8"
        strokeWidth="7"
        strokeLinecap="round"
        opacity={0.45}
      />
      <path
        d="M20 180 C70 210 70 250 34 290"
        stroke="#80354D"
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity={0.5}
      />
      <path
        d="M300 180 C250 210 250 250 286 290"
        stroke="#80354D"
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity={0.5}
      />
      <circle cx="48" cy="210" r="5" fill="#F7DCE5" stroke="#C67C98" />
      <circle cx="272" cy="210" r="5" fill="#F7DCE5" stroke="#C67C98" />
    </svg>
  )
}
