import { motion, useReducedMotion } from 'motion/react'

interface HugRibbonProps {
  active: boolean
  className?: string
}

/** Soft orbital hug curves that wrap around the polaroid. */
export function HugRibbon({ active, className = '' }: HugRibbonProps) {
  const reduceMotion = useReducedMotion()
  if (!active) return null

  return (
    <svg
      viewBox="0 0 320 420"
      className={`pointer-events-none absolute inset-[-22%] z-0 h-[144%] w-[144%] ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer orbit — pulled farther from the caption band */}
      <motion.path
        d="M40 55 C0 130 -4 290 44 380 C108 430 212 430 276 380 C324 290 320 130 280 55"
        stroke="#C67C98"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.55 }}
        transition={{ duration: 1.1, ease: 'easeInOut' }}
      />
      <motion.path
        d="M56 78 C18 148 14 290 58 365 C114 400 206 400 262 365 C306 290 302 148 264 78"
        stroke="#E8B7C8"
        strokeWidth="7"
        strokeLinecap="round"
        opacity={0.45}
        initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.45 }}
        transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.08 }}
      />

      {/* Soft embrace ribbons from each side */}
      <motion.path
        d="M20 180 C70 210 70 250 34 290"
        stroke="#80354D"
        strokeWidth="3.5"
        strokeLinecap="round"
        initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.5 }}
        transition={{ duration: 0.85, ease: 'easeOut', delay: 0.15 }}
      />
      <motion.path
        d="M300 180 C250 210 250 250 286 290"
        stroke="#80354D"
        strokeWidth="3.5"
        strokeLinecap="round"
        initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.5 }}
        transition={{ duration: 0.85, ease: 'easeOut', delay: 0.2 }}
      />

      {/* Tiny bow knots on the hug path */}
      <motion.circle
        cx="48"
        cy="210"
        r="5"
        fill="#F7DCE5"
        stroke="#C67C98"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, type: 'spring', stiffness: 180 }}
      />
      <motion.circle
        cx="272"
        cy="210"
        r="5"
        fill="#F7DCE5"
        stroke="#C67C98"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.78, type: 'spring', stiffness: 180 }}
      />
    </svg>
  )
}
