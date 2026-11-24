import { useRegisterSW } from 'virtual:pwa-register/react'
import { markWelcomeReplayPending } from '../utils/storage'
import { Pressable } from './ui/Pressable'

export function PwaUpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW() {
      // registration successful
    },
    onRegisterError(error) {
      console.warn('Soliday SW registration error', error)
    },
  })

  if (!needRefresh) return null

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[75] px-4"
      style={{
        paddingBottom: 'calc(5.5rem + env(safe-area-inset-bottom, 0px))',
      }}
      role="status"
      aria-live="polite"
    >
      <div className="mx-auto flex max-w-lg items-center gap-3 rounded-[1.5rem] border border-blush bg-cream/95 p-3 shadow-[var(--shadow-lift)] backdrop-blur">
        <p className="flex-1 text-sm text-berry">A little update is ready ♡</p>
        <Pressable
          className="px-3 py-2 text-xs"
          onClick={() => {
            // Survive the SW reload so she gets the gift unwrap again.
            markWelcomeReplayPending()
            void updateServiceWorker(true)
          }}
        >
          Refresh
        </Pressable>
        <Pressable
          variant="ghost"
          className="px-3 py-2 text-xs"
          onClick={() => setNeedRefresh(false)}
        >
          Later
        </Pressable>
      </div>
    </div>
  )
}
