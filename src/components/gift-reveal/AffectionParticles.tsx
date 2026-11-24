import { motion, useReducedMotion } from 'motion/react'
import {
  FLOAT_HEARTS,
  KISS_MARKS,
  SETTLED_HEARTS,
  SPARKLES,
  XOXO_MARKS,
} from '../../data/giftRevealCopy'
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
  if (!burst && !ambient) return null

  const showStatic = Boolean(reduceMotion)

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-[5] overflow-visible ${className}`}
      aria-hidden="true"
    >
      {/* Settled hearts — always visible once affection starts */}
      {SETTLED_HEARTS.map((heart, index) => {
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
              ambient
                ? {
                    opacity: [0.85, 1, 0.85],
                    scale: heart.scale,
                    y: [0, -5, 0],
                  }
                : { opacity: 1, scale: heart.scale, y: 0 }
            }
            transition={
              ambient
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
                    delay: heart.delay,
                  }
            }
          >
            <div style={{ transform: 'translate(-50%, -50%)' }}>
              <HeartSvg className="h-auto w-full drop-shadow-sm" fill={fill} />
            </div>
          </motion.div>
        )
      })}

      {/* Lipstick kisses — larger, more of them */}
      {KISS_MARKS.map((kiss, index) => {
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
              ambient
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
              ambient
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
                    delay: kiss.delay,
                  }
            }
          >
            <div style={{ transform: 'translate(-50%, -50%)' }}>
              <KissMark tone={tone} className="h-auto w-full drop-shadow-sm" />
            </div>
          </motion.div>
        )
      })}

      {XOXO_MARKS.map((mark) => (
        <motion.span
          key={mark.id}
          className="absolute whitespace-nowrap font-script text-lg font-semibold text-berry/85 sm:text-xl"
          style={{ left: `${mark.x}%`, top: `${mark.y}%` }}
          initial={showStatic ? false : { opacity: 0, scale: 0.6 }}
          animate={{ opacity: 0.9, scale: 1, rotate: mark.rotate }}
          transition={{ delay: mark.delay, duration: 0.45 }}
        >
          {mark.text}
        </motion.span>
      ))}

      {SPARKLES.map((sparkle) => (
        <motion.svg
          key={sparkle.id}
          viewBox="0 0 24 24"
          className="absolute h-3.5 w-3.5 text-rose"
          style={{ left: `${sparkle.x}%`, top: `${sparkle.y}%` }}
          initial={showStatic ? false : { opacity: 0, scale: 0 }}
          animate={
            ambient && !showStatic
              ? { opacity: [0.2, 1, 0.2], scale: [0.7, 1.25, 0.7] }
              : { opacity: 0.9, scale: 1 }
          }
          transition={
            ambient && !showStatic
              ? { duration: 2.4, repeat: Infinity, delay: sparkle.delay }
              : { delay: sparkle.delay, duration: 0.35 }
          }
        >
          <path
            d="M12 2l1.2 7.2L20 12l-6.8 1.8L12 22l-1.2-8.2L4 12l6.8-2.8L12 2z"
            fill="currentColor"
          />
        </motion.svg>
      ))}

      {/* Rising hearts */}
      {!showStatic &&
        FLOAT_HEARTS.map((heart) => (
          <motion.div
            key={heart.id}
            className="absolute"
            style={{
              left: `${heart.x}%`,
              top: `${heart.y}%`,
              width: `${1.1 * heart.size}rem`,
            }}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 0.95, 0], y: -72 }}
            transition={{
              duration: heart.duration,
              repeat: ambient ? Infinity : 0,
              delay: heart.delay,
              ease: 'easeOut',
            }}
          >
            <HeartSvg className="h-auto w-full" fill="#C67C98" />
          </motion.div>
        ))}
    </div>
  )
}
