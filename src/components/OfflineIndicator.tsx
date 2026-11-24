import { WifiOff } from 'lucide-react'
import { useEffect, useState } from 'react'

export function OfflineIndicator() {
  const [offline, setOffline] = useState(!navigator.onLine)

  useEffect(() => {
    function goOffline() {
      setOffline(true)
    }
    function goOnline() {
      setOffline(false)
    }
    window.addEventListener('offline', goOffline)
    window.addEventListener('online', goOnline)
    return () => {
      window.removeEventListener('offline', goOffline)
      window.removeEventListener('online', goOnline)
    }
  }, [])

  if (!offline) return null

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] flex justify-center px-4"
      style={{ paddingTop: 'max(0.5rem, env(safe-area-inset-top))' }}
      role="status"
      aria-live="polite"
    >
      <div className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-blush bg-cream/95 px-3 py-2 text-xs text-berry shadow-[var(--shadow-soft)] backdrop-blur">
        <WifiOff className="h-3.5 w-3.5 text-rose" aria-hidden="true" />
        You&apos;re offline — Soliday still works with your saved progress.
      </div>
    </div>
  )
}
