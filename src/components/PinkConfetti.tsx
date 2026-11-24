import { BurstConfettiCanvas } from './BurstConfettiCanvas'

interface PinkConfettiProps {
  active: boolean
  lingering?: boolean
  /** Multiplier for piece count — final surprise can go higher. */
  density?: 'normal' | 'heavy'
  className?: string
}

/** Celebration confetti via one canvas — safe for phones. */
export function PinkConfetti({
  active,
  lingering = false,
  density = 'normal',
  className = '',
}: PinkConfettiProps) {
  return (
    <BurstConfettiCanvas
      active={active}
      lingering={lingering}
      density={density}
      className={className}
    />
  )
}
