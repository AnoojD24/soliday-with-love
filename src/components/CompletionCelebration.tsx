import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { HeartMark } from './illustrations/Ornaments'
import { Pressable } from './ui/Pressable'

interface CompletionCelebrationProps {
  open: boolean
  message: string
  onJournal: () => void
  onDismiss: () => void
}

export function CompletionCelebration({
  open,
  message,
  onJournal,
  onDismiss,
}: CompletionCelebrationProps) {
  const reduceMotion = useReducedMotion()

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-5">
          <motion.button
            type="button"
            aria-label="Dismiss celebration"
            className="absolute inset-0 bg-berry/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onDismiss}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Workout completed"
            className="relative z-10 w-full max-w-sm rounded-[2rem] bg-cream px-6 py-8 text-center shadow-[var(--shadow-lift)]"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
          >
            <div className="relative mx-auto mb-4 h-16 w-24">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute left-1/2 top-1/2"
                  initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{
                    opacity: 1,
                    y: reduceMotion ? 0 : [-8, -28 - i * 6],
                    x: reduceMotion ? 0 : (i - 1) * 18,
                  }}
                  transition={{ duration: 0.8, delay: i * 0.08 }}
                >
                  <HeartMark className="h-6 w-6" />
                </motion.div>
              ))}
            </div>
            <p className="font-display text-2xl text-berry">You did it</p>
            <p className="mt-2 text-sm leading-relaxed text-berry/75">{message}</p>
            <div className="mt-6 space-y-2">
              <Pressable fullWidth onClick={onJournal}>
                Add a journal note
              </Pressable>
              <Pressable fullWidth variant="secondary" onClick={onDismiss}>
                Keep going
              </Pressable>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
