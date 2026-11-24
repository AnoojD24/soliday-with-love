import { useMemo } from 'react'
import muscleMapSvg from '../../assets/muscle-map/female-muscle-map.svg?raw'
import {
  markActiveMuscleRegions,
  resolveActiveRegionIds,
  withViewBox,
} from '../../utils/muscleFocusMap'

interface MuscleIllustrationProps {
  muscles: string[]
  className?: string
  showInactiveLegend?: boolean
}

const FRONT_VIEWBOX = '20 30 560 1020'
const BACK_VIEWBOX = '640 30 560 1020'

function FigureView({
  label,
  viewBox,
  markup,
}: {
  label: string
  viewBox: string
  markup: string
}) {
  const cropped = withViewBox(markup, viewBox)

  return (
    <figure className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
      <div
        className="soliday-muscle-figure w-full overflow-hidden rounded-[1.25rem] bg-[#FFF6F2]"
        dangerouslySetInnerHTML={{ __html: cropped }}
      />
      <figcaption className="font-display text-sm tracking-wide text-berry">
        {label}
      </figcaption>
    </figure>
  )
}

export function MuscleIllustration({
  muscles,
  className = '',
  showInactiveLegend = true,
}: MuscleIllustrationProps) {
  const activeIds = useMemo(() => resolveActiveRegionIds(muscles), [muscles])
  const marked = useMemo(
    () => markActiveMuscleRegions(muscleMapSvg, activeIds),
    [activeIds],
  )

  return (
    <div className={`space-y-3 ${className}`}>
      <div
        className="flex items-start gap-2 sm:gap-3"
        role="img"
        aria-label={
          muscles.length
            ? `Muscle focus illustration highlighting ${muscles.join(', ')}`
            : 'Muscle focus illustration, front and back'
        }
      >
        <FigureView label="Front" viewBox={FRONT_VIEWBOX} markup={marked} />
        <FigureView label="Back" viewBox={BACK_VIEWBOX} markup={marked} />
      </div>

      {showInactiveLegend && (
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-rose">
          <span className="inline-flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-sm bg-rose"
              aria-hidden="true"
            />
            Class focus
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-sm"
              style={{ background: '#E6D6D2' }}
              aria-hidden="true"
            />
            Resting regions
          </span>
        </div>
      )}
    </div>
  )
}
