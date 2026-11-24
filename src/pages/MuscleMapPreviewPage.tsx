import { MuscleIllustration } from '../components/illustrations/MuscleIllustration'
import { MuscleFocusTags } from '../components/MuscleFocusTags'
import { MUSCLE_FOCUS_LABELS } from '../utils/muscleFocusMap'

const COMBOS: { title: string; muscles: string[] }[] = [
  { title: 'No highlights', muscles: [] },
  { title: 'Hamstrings & Triceps', muscles: ['Hamstrings', 'Triceps'] },
  { title: 'Center Glutes & Biceps', muscles: ['Center Glutes', 'Biceps'] },
  { title: 'Outer Glutes & Chest', muscles: ['Outer Glutes', 'Chest'] },
  { title: 'Inner Thighs & Back', muscles: ['Inner Thighs', 'Back'] },
  { title: 'Hamstrings & Shoulders', muscles: ['Hamstrings', 'Shoulders'] },
  { title: 'Leg Wrap & Arm Wrap', muscles: ['Leg Wrap', 'Arm Wrap'] },
]

/** Development-only visual QA surface for anatomical highlights. */
export function MuscleMapPreviewPage() {
  return (
    <div className="mx-auto max-w-lg space-y-8 px-4 py-6 safe-top safe-bottom">
      <header className="space-y-2">
        <p className="text-xs font-medium tracking-[0.14em] text-rose uppercase">
          Dev preview
        </p>
        <h1 className="font-display text-3xl text-berry">Muscle map review</h1>
        <p className="text-sm leading-relaxed text-berry/75">
          Temporary page for approving anatomical highlights. Not part of the
          gifted product experience.
        </p>
      </header>

      <section className="space-y-3 rounded-[1.5rem] border border-blush/60 bg-cream/90 p-3">
        <h2 className="font-display text-xl text-berry">Single groups</h2>
        <div className="space-y-8">
          {MUSCLE_FOCUS_LABELS.map((muscle) => (
            <div key={muscle} className="space-y-2" data-preview={muscle}>
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-medium text-berry">{muscle}</h3>
                <MuscleFocusTags muscles={[muscle]} />
              </div>
              <MuscleIllustration muscles={[muscle]} />
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3 rounded-[1.5rem] border border-blush/60 bg-cream/90 p-3">
        <h2 className="font-display text-xl text-berry">Workout combos</h2>
        <div className="space-y-8">
          {COMBOS.map((combo) => (
            <div
              key={combo.title}
              className="space-y-2"
              data-preview={combo.title}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-medium text-berry">{combo.title}</h3>
                {combo.muscles.length > 0 && (
                  <MuscleFocusTags muscles={combo.muscles} />
                )}
              </div>
              <MuscleIllustration muscles={combo.muscles} />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
