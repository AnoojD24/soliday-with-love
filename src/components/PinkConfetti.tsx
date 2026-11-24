import { motion, useReducedMotion } from 'motion/react'
import { useMemo } from 'react'

interface PinkConfettiProps {
  active: boolean
  lingering?: boolean
  /** Multiplier for piece count — final surprise can go higher. */
  density?: 'normal' | 'heavy'
  className?: string
}

const COLORS = [
  '#F7DCE5',
  '#E8B7C8',
  '#C67C98',
  '#80354D',
  '#FFF6F2',
  '#EFE0F5',
  '#F3C9D6',
  '#D9A0B5',
  '#FF8FB5',
  '#E85A8C',
]

type Piece = {
  id: string
  left: number
  top: number
  dx: number
  dy: number
  rotate: number
  delay: number
  duration: number
  size: number
  color: string
  shape: 'rect' | 'circle' | 'heart'
}

function seeded(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

function buildPieces(count: number, wave: number): Piece[] {
  return Array.from({ length: count }, (_, i) => {
    const r = seeded(i * 17 + wave * 91)
    const r2 = seeded(i * 31 + wave * 13)
    const r3 = seeded(i * 47 + wave * 7)
    const r4 = seeded(i * 63 + wave * 23)
    const angle = r * Math.PI * 2
    // Strong corner/edge coverage
    const dist = 55 + r2 * 120
    return {
      id: `w${wave}-${i}`,
      left: 20 + r4 * 60,
      top: 15 + r2 * 40,
      dx: Math.cos(angle) * dist * (1 + r3 * 0.6),
      dy: Math.sin(angle) * dist * 0.55 + 35 + r3 * 85,
      rotate: (r - 0.5) * 1200,
      delay: r3 * 0.28 + (wave === 2 ? 0.25 : wave === 3 ? 0.55 : wave === 4 ? 0.85 : 0),
      duration: 2.4 + r2 * 2.2,
      size: 10 + r * 16,
      color: COLORS[i % COLORS.length],
      shape: i % 4 === 0 ? 'heart' : i % 3 === 0 ? 'circle' : 'rect',
    }
  })
}

export function PinkConfetti({
  active,
  lingering = false,
  density = 'normal',
  className = '',
}: PinkConfettiProps) {
  const reduceMotion = useReducedMotion()
  const heavy = density === 'heavy'
  const burst = useMemo(
    () => buildPieces(heavy ? 180 : 120, 1),
    [heavy],
  )
  const second = useMemo(
    () => buildPieces(heavy ? 120 : 80, 2),
    [heavy],
  )
  const third = useMemo(
    () => buildPieces(heavy ? 90 : 60, 3),
    [heavy],
  )
  const fourth = useMemo(
    () => buildPieces(heavy ? 70 : 45, 4),
    [heavy],
  )
  const linger = useMemo(
    () => buildPieces(heavy ? 50 : 30, 5),
    [heavy],
  )

  if (!active && !lingering) return null

  // fixed full-viewport so parent overflow-x-clip cannot hide the burst
  const shellClass = `pointer-events-none fixed inset-0 overflow-hidden ${className}`

  if (reduceMotion) {
    return (
      <div className={shellClass} aria-hidden="true">
        {linger.slice(0, 16).map((p, i) => (
          <span
            key={p.id}
            className="absolute rounded-sm opacity-70"
            style={{
              left: `${6 + seeded(i + 3) * 88}%`,
              top: `${4 + seeded(i + 9) * 82}%`,
              width: p.size,
              height: p.shape === 'circle' ? p.size : p.size * 0.55,
              background: p.color,
              borderRadius: p.shape === 'circle' ? '999px' : 2,
            }}
          />
        ))}
      </div>
    )
  }

  const pieces = [
    ...(active ? burst : []),
    ...(active ? second : []),
    ...(active ? third : []),
    ...(active ? fourth : []),
    ...(lingering ? linger : []),
  ]

  return (
    <div className={shellClass} aria-hidden="true">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute drop-shadow-sm"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height:
              p.shape === 'circle'
                ? p.size
                : p.shape === 'heart'
                  ? p.size
                  : p.size * 0.5,
            background: p.shape === 'heart' ? 'transparent' : p.color,
            borderRadius: p.shape === 'circle' ? '999px' : 2,
            color: p.color,
            fontSize: p.size * 1.1,
            lineHeight: 1,
            zIndex: 40,
          }}
          initial={{ opacity: 0, x: 0, y: 0, rotate: 0, scale: 0.4 }}
          animate={{
            opacity: [0, 1, 1, 1, 0.9, 0],
            x: `${p.dx}vw`,
            y: `${p.dy}vh`,
            rotate: p.rotate,
            scale: [0.4, 1.25, 1.1, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {p.shape === 'heart' ? '♥' : null}
        </motion.span>
      ))}
    </div>
  )
}
