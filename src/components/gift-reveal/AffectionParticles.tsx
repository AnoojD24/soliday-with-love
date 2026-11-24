import { motion, useReducedMotion } from 'motion/react'
import {
  FLOAT_HEARTS,
  KISS_MARKS,
  SETTLED_HEARTS,
  SPARKLES,
  XOXO_MARKS,
} from '../../data/giftRevealCopy'
import { useLiteEffects } from '../../hooks/useLiteEffects'
import { KissMark } from './KissMark'

interface AffectionParticlesProps {
  burst: boolean
  ambient: boolean
  className?: string
}

const TONES = ['blush', 'rose', 'berry'] as const

function HeartSvg({ className = '', fill = '#C67C98' }: { className?: string; fill?: string }) {
  return (
    <svg viewBox="0 0 16 14" className={className} aria-hidden="true">
      <path
        d="M8 13S1 8.5 1 4.5C1 2.5 2.5 1 4.4 1 5.7 1 6.9 1.7 8 3c1.1-1.3 2.3-2 3.6-2C13.5 1 15 2.5 15 4.5 15 8.5 8 13 8 13z"
        fill={fill}
      />
    </svg>
  )
}

export function AffectionParticles({
  burst,
  ambient,
  className = '',
}: AffectionParticlesProps) {
  const reduceMotion = useReducedMotion()
  const lite = useLiteEffects()
  if (!burst && !ambient) return null

  const showStatic = Boolean(reduceMotion)
  // Phones: fewer decorations + no infinite Motion loops after the burst.
  const ambientOn = ambient && !lite && !showStatic
  const delayScale = lite ? 0.45 : 1
  const kisses = lite ? KISS_MARKS.slice(0, 6) : KISS_MARKS
  const settled = lite ? SETTLED_HEARTS.slice(0, 8) : SETTLED_HEARTS
  const floats = lite ? FLOAT_HEARTS.slice(0, 6) : FLOAT_HEARTS
  const sparkles = lite ? SPARKLES.slice(0, 5) : SPARKLES
  const xoxos = lite ? XOXO_MARKS.slice(0, 4) : XOXO_MARKS

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-[5] overflow-visible ${className}`}
      aria-hidden="true"
    >
      {settled.map((heart, index) => {
        const fill = index % 2 === 0 ? '#C67C98' : '#E8B7C8'
        if (showStatic) {
          return (
            <div
              key={heart.id}
              className="absolute"
              style={{
                left: `${heart.x}%`,
                top: `${heart.y}%`,
                width: `${1.35 * heart.scale}rem`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <HeartSvg className="h-auto w-full drop-shadow-sm" fill={fill} />
            </div>
          )
        }
        return (
          <motion.div
            key={heart.id}
            className="absolute"
            style={{
              left: `${heart.x}%`,
              top: `${heart.y}%`,
              width: `${1.35 * heart.scale}rem`,
            }}
            initial={{ opacity: 0, scale: 0.3, y: 10 }}
            animate={
              ambientOn
                ? {
                    opacity: [0.85, 1, 0.85],
                    scale: heart.scale,
                    y: [0, -5, 0],
                  }
                : { opacity: 1, scale: heart.scale, y: 0 }
            }
            transition={
              ambientOn
                ? {
                    duration: 2.8 + index * 0.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: heart.delay,
                  }
                : {
                    type: 'spring',
                    stiffness: 170,
                    damping: 11,
                    delay: heart.delay * delayScale,
                  }
            }
          >
            <div style={{ transform: 'translate(-50%, -50%)' }}>
              <HeartSvg className="h-auto w-full drop-shadow-sm" fill={fill} />
            </div>
          </motion.div>
        )
      })}

      {kisses.map((kiss, index) => {
        const tone = TONES[index % TONES.length]
        const sizeRem = 3.45 * kiss.scale
        if (showStatic) {
          return (
            <div
              key={kiss.id}
              className="absolute"
              style={{
                left: `${kiss.x}%`,
                top: `${kiss.y}%`,
                width: `${sizeRem}rem`,
                transform: `translate(-50%, -50%) rotate(${kiss.rotate}deg)`,
              }}
            >
              <KissMark tone={tone} className="h-auto w-full drop-shadow-sm" />
            </div>
          )
        }
        return (
          <motion.div
            key={kiss.id}
            className="absolute"
            style={{
              left: `${kiss.x}%`,
              top: `${kiss.y}%`,
              width: `${sizeRem}rem`,
            }}
            initial={{ opacity: 0, scale: 0.2, y: 14 }}
            animate={
              ambientOn
                ? {
                    opacity: [0.8, 1, 0.8],
                    scale: kiss.scale,
                    y: [0, -6, 0],
                    rotate: [
                      kiss.rotate - 3,
                      kiss.rotate + 3,
                      kiss.rotate - 3,
                    ],
                  }
                : {
                    opacity: 1,
                    scale: kiss.scale,
                    y: 0,
                    rotate: kiss.rotate,
                  }
            }
            transition={
              ambientOn
                ? {
                    duration: 3.2 + (index % 4) * 0.25,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: kiss.delay,
                  }
                : {
                    type: 'spring',
                    stiffness: 150,
                    damping: 10,
                    delay: kiss.delay * delayScale,
                  }
            }
          >
            <div style={{ transform: 'translate(-50%, -50%)' }}>
              <KissMark tone={tone} className="h-auto w-full drop-shadow-sm" />
            </div>
          </motion.div>
        )
      })}

      {xoxos.map((mark) => (
        <motion.span
          key={mark.id}
          className="absolute whitespace-nowrap font-script text-lg font-semibold text-berry/85 sm:text-xl"
          style={{ left: `${mark.x}%`, top: `${mark.y}%` }}
          initial={showStatic ? false : { opacity: 0, scale: 0.6 }}
          animate={{ opacity: 0.9, scale: 1, rotate: mark.rotate }}
          transition={{ delay: mark.delay * delayScale, duration: 0.45 }}
        >
          {mark.text}
        </motion.span>
      ))}

      {sparkles.map((sparkle) => (
        <motion.svg
          key={sparkle.id}
          viewBox="0 0 24 24"
          className="absolute h-3.5 w-3.5 text-rose"
          style={{ left: `${sparkle.x}%`, top: `${sparkle.y}%` }}
          initial={showStatic ? false : { opacity: 0, scale: 0 }}
          animate={
            ambientOn
              ? { opacity: [0.2, 1, 0.2], scale: [0.7, 1.25, 0.7] }
              : { opacity: 0.9, scale: 1 }
          }
          transition={
            ambientOn
              ? { duration: 2.4, repeat: Infinity, delay: sparkle.delay }
              : { delay: sparkle.delay * delayScale, duration: 0.35 }
          }
        >
          <path
            d="M12 2l1.2 7.2L20 12l-6.8 1.8L12 22l-1.2-8.2L4 12l6.8-2.8L12 2z"
            fill="currentColor"
          />
        </motion.svg>
      ))}

      {!showStatic &&
        floats.map((heart) => (
          <motion.div
            key={heart.id}
            className="absolute"
            style={{
              left: `${heart.x}%`,
              top: `${heart.y}%`,
              width: `${1.1 * heart.size}rem`,
            }}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 0.95, 0], y: lite ? -48 : -72 }}
            transition={{
              duration: lite ? Math.min(heart.duration, 2.4) : heart.duration,
              repeat: ambientOn ? Infinity : 0,
              delay: heart.delay * delayScale,
              ease: 'easeOut',
            }}
          >
            <HeartSvg className="h-auto w-full" fill="#C67C98" />
          </motion.div>
        ))}
    </div>
  )
}
