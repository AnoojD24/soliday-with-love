import { MapPin } from 'lucide-react'
import { useState } from 'react'
import { getStudioMapLink } from '../data/studioLocations'
import { Pressable } from './ui/Pressable'

interface StudioLocationLinkProps {
  location: string
  /** Show the map-pin icon (workout cards). */
  showIcon?: boolean
  className?: string
}

/**
 * Tappable studio name → “Open in Maps” sheet → Apple Maps directions.
 */
export function StudioLocationLink({
  location,
  showIcon = false,
  className = '',
}: StudioLocationLinkProps) {
  const [promptOpen, setPromptOpen] = useState(false)
  const mapUrl = getStudioMapLink(location)

  if (!mapUrl) {
    return (
      <span className={`inline-flex items-center gap-2 ${className}`}>
        {showIcon && (
          <MapPin className="h-4 w-4 shrink-0 text-rose" aria-hidden="true" />
        )}
        {location}
      </span>
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setPromptOpen(true)}
        className={`inline-flex max-w-full items-center gap-2 text-left underline decoration-rose/35 underline-offset-2 transition-opacity active:opacity-70 ${className}`}
        aria-label={`Get directions to solidcore ${location}`}
      >
        {showIcon && (
          <MapPin className="h-4 w-4 shrink-0 text-rose" aria-hidden="true" />
        )}
        <span className="min-w-0">{location}</span>
      </button>

      {promptOpen && (
        <div className="fixed inset-0 z-[85] flex items-end justify-center px-4 sm:items-center">
          <button
            type="button"
            className="absolute inset-0 bg-berry/30"
            aria-label="Dismiss"
            onClick={() => setPromptOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Open in Maps"
            className="relative z-10 mb-[max(1rem,env(safe-area-inset-bottom))] w-full max-w-sm rounded-[1.75rem] border border-blush bg-cream p-5 shadow-[var(--shadow-lift)] sm:mb-0"
          >
            <p className="text-xs tracking-[0.12em] text-rose uppercase">
              Directions
            </p>
            <h2 className="mt-1 font-display text-2xl text-berry">
              Open in Maps?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-berry/80">
              Get directions to solidcore {location}.
            </p>
            <div className="mt-5 space-y-2">
              <Pressable
                fullWidth
                onClick={() => {
                  window.open(mapUrl, '_blank', 'noopener,noreferrer')
                  setPromptOpen(false)
                }}
              >
                Open in Maps
              </Pressable>
              <Pressable
                fullWidth
                variant="ghost"
                onClick={() => setPromptOpen(false)}
              >
                Not now
              </Pressable>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
