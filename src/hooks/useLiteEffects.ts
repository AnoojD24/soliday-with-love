import { useEffect, useState } from 'react'

/**
 * True on phones / coarse pointers / Save-Data — dial back particle storms.
 * Desktop stays richer; gift choreography still plays on both.
 */
export function useLiteEffects() {
  const [lite, setLite] = useState(() => readLite())

  useEffect(() => {
    if (typeof window === 'undefined') return

    const queries = [
      window.matchMedia('(pointer: coarse)'),
      window.matchMedia('(max-width: 768px)'),
      window.matchMedia('(prefers-reduced-data: reduce)'),
    ]

    const sync = () => setLite(readLite())
    for (const q of queries) {
      q.addEventListener('change', sync)
    }
    window.addEventListener('resize', sync)

    return () => {
      for (const q of queries) {
        q.removeEventListener('change', sync)
      }
      window.removeEventListener('resize', sync)
    }
  }, [])

  return lite
}

function readLite() {
  if (typeof window === 'undefined') return false
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const narrow = window.matchMedia('(max-width: 768px)').matches
  const saveData =
    window.matchMedia('(prefers-reduced-data: reduce)').matches ||
    Boolean(
      (navigator as Navigator & { connection?: { saveData?: boolean } })
        .connection?.saveData,
    )
  // iPhone Safari specifically — even on larger iPads with fine pointer quirks.
  const appleTouch =
    typeof navigator !== 'undefined' &&
    /iPhone|iPad|iPod/i.test(navigator.userAgent)
  return coarse || narrow || saveData || appleTouch
}
