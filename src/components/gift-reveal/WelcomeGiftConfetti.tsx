import { motion, useReducedMotion } from 'motion/react'
import { useMemo } from 'react'

interface WelcomeGiftConfettiProps {
  active: boolean
}

const COLORS = [
  '#F7DCE5',
  '#E8B7C8',
  '#C67C98',
  '#80354D',
  '#FFF6F2',
  '#F3C9D6',
  '#FF8FB5',
  '#E85A8C',
]

function seeded(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

export function WelcomeGiftConfetti({ active }: WelcomeGiftConfettiProps) {
  const reduceMotion = useReducedMotion()
  const pieces = useMemo(
    () =>
      Array.from({ length: 140 }, (_, i) => {
        const r = seeded(i * 19)
        const r2 = seeded(i * 41)
        const r3 = seeded(i * 73)
        const angle = r * Math.PI * 2
        const dist = 50 + r2 * 110
        return {
          id: `wg-${i}`,
          left: 25 + r3 * 50,
          top: 20 + r2 * 35,
          dx: Math.cos(angle) * dist,
          dy: Math.sin(angle) * dist * 0.5 + 40 + r * 70,
          rotate: (r - 0.5) * 900,
          delay: r3 * 0.35,
          duration: 2.2 + r2 * 1.8,
          size: 9 + r * 14,
          color: COLORS[i % COLORS.length],
          heart: i % 5 === 0,
          circle: i % 3 === 0,
        }
      }),
    [],
  )

  if (!active || reduceMotion) return null

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[20] overflow-hidden"
      aria-hidden="true"
    >
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute drop-shadow-sm"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.circle || p.heart ? p.size : p.size * 0.48,
            background: p.heart ? 'transparent' : p.color,
            borderRadius: p.circle ? '999px' : 2,
            color: p.color,
            fontSize: p.size,
            lineHeight: 1,
          }}
          initial={{ opacity: 0, x: 0, y: 0, rotate: 0, scale: 0.3 }}
          animate={{
            opacity: [0, 1, 1, 0.85, 0],
            x: `${p.dx}vw`,
            y: `${p.dy}vh`,
            rotate: p.rotate,
            scale: [0.3, 1.2, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {p.heart ? '♥' : null}
        </motion.span>
      ))}
    </div>
  )
}
