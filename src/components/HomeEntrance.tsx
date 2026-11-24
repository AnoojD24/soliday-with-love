import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useState, type ReactNode } from 'react'
import { BowMark, HeartMark, SnowflakeMark } from './illustrations/Ornaments'

let playedThisPageLoad = false

interface HomeEntranceProps {
  children: ReactNode
}

export function HomeEntrance({ children }: HomeEntranceProps) {
  const reduceMotion = useReducedMotion()
  const [runEntrance] = useState(() => {
    if (playedThisPageLoad) return false
    playedThisPageLoad = true
    return true
  })
  const [flourishVisible, setFlourishVisible] = useState(
    () => runEntrance && reduceMotion !== true,
  )

  useEffect(() => {
    if (!runEntrance || reduceMotion) {
      setFlourishVisible(false)
      return
    }
    setFlourishVisible(true)
    const timer = window.setTimeout(() => setFlourishVisible(false), 1400)
    return () => window.clearTimeout(timer)
  }, [runEntrance, reduceMotion])

  const animateIn = runEntrance && !reduceMotion

  return (
    <div className="relative">
      <AnimatePresence>
        {flourishVisible && (
          <motion.div
            className="pointer-events-none absolute inset-x-0 top-0 z-10 flex h-28 items-start justify-center overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            aria-hidden="true"
          >
            <motion.div
              className="mt-2"
              initial={{ y: -12, scale: 0.85, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: -8, opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
            >
              <BowMark className="h-9 w-12 drop-shadow-sm" />
            </motion.div>
            <motion.div
              className="absolute left-[18%] top-8"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: [0, 1, 0], y: -18 }}
              transition={{ duration: 1.1, delay: 0.15 }}
            >
              <HeartMark className="h-4 w-4" />
            </motion.div>
            <motion.div
              className="absolute right-[20%] top-6"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: [0, 1, 0], y: -22 }}
              transition={{ duration: 1.15, delay: 0.22 }}
            >
              <SnowflakeMark className="h-4 w-4" />
            </motion.div>
            <motion.div
              className="absolute left-1/2 top-14 -translate-x-1/2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0, 1, 0], scale: 1.15, y: -10 }}
              transition={{ duration: 1.05, delay: 0.28 }}
            >
              <HeartMark className="h-3.5 w-3.5 opacity-80" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={animateIn ? { opacity: 0, y: 12 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut', delay: animateIn ? 0.1 : 0 }}
      >
        {children}
      </motion.div>
    </div>
  )
}
