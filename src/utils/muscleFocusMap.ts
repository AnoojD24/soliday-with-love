/**
 * Maps Soliday class focus labels → Open Muscle Map region IDs.
 * Wrap terms are intentional broad illustrative regions, not precise anatomy.
 */

export const MUSCLE_FOCUS_LABELS = [
  'Hamstrings',
  'Center Glutes',
  'Outer Glutes',
  'Inner Thighs',
  'Biceps',
  'Triceps',
  'Shoulders',
  'Back',
  'Chest',
  'Leg Wrap',
  'Arm Wrap',
] as const

export type MuscleFocusLabel = (typeof MUSCLE_FOCUS_LABELS)[number]

/** Anatomical region IDs present in the Open Muscle Map female SVG. */
export type MuscleRegionId =
  | 'biceps_brachii'
  | 'brachialis'
  | 'triceps_brachii'
  | 'anterior_deltoid'
  | 'lateral_deltoid'
  | 'posterior_deltoid'
  | 'pectoralis_major'
  | 'trapezius'
  | 'latissimus_dorsi'
  | 'erector_spinae'
  | 'posterior_rotator_cuff'
  | 'hip_adductors'
  | 'gluteus_maximus'
  | 'gluteus_medius'
  | 'biceps_femoris'
  | 'medial_hamstrings'
  | 'rectus_femoris'
  | 'vastus_lateralis'
  | 'vastus_medialis'
  | 'tensor_fasciae_latae'
  | 'sartorius'
  | 'iliopsoas'
  | 'iliotibial_tract'
  | 'forearm_flexors'
  | 'forearm_extensors'
  | 'external_oblique'
  | 'gastrocnemius'
  | 'soleus'

const FOCUS_TO_REGIONS: Record<string, MuscleRegionId[]> = {
  Hamstrings: ['biceps_femoris', 'medial_hamstrings'],
  'Center Glutes': ['gluteus_maximus'],
  'Outer Glutes': ['gluteus_medius', 'tensor_fasciae_latae'],
  'Inner Thighs': ['hip_adductors'],
  Biceps: ['biceps_brachii', 'brachialis'],
  Triceps: ['triceps_brachii'],
  Shoulders: ['anterior_deltoid', 'lateral_deltoid', 'posterior_deltoid'],
  Back: [
    'trapezius',
    'latissimus_dorsi',
    'erector_spinae',
    'posterior_rotator_cuff',
  ],
  Chest: ['pectoralis_major'],
  'Leg Wrap': [
    'gluteus_maximus',
    'gluteus_medius',
    'hip_adductors',
    'biceps_femoris',
    'medial_hamstrings',
    'rectus_femoris',
    'vastus_lateralis',
    'vastus_medialis',
    'tensor_fasciae_latae',
    'sartorius',
    'iliopsoas',
    'iliotibial_tract',
  ],
  'Arm Wrap': [
    'biceps_brachii',
    'brachialis',
    'triceps_brachii',
    'anterior_deltoid',
    'lateral_deltoid',
    'posterior_deltoid',
    'forearm_flexors',
    'forearm_extensors',
  ],
}

export function resolveActiveRegionIds(muscles: string[]): Set<string> {
  const active = new Set<string>()
  for (const muscle of muscles) {
    const regions = FOCUS_TO_REGIONS[muscle]
    if (!regions) continue
    for (const id of regions) active.add(id)
  }
  return active
}

export function markActiveMuscleRegions(
  svgMarkup: string,
  activeRegionIds: Set<string>,
): string {
  return svgMarkup.replace(/<g\b[^>]*>/g, (tag) => {
    const id = tag.match(/data-muscle-id="([^"]+)"/)?.[1]
    if (!id || !activeRegionIds.has(id)) return tag
    if (/\bclass="/.test(tag)) {
      return tag.replace(/\bclass="/, 'class="is-active ')
    }
    return tag.replace(/>$/, ' class="is-active">')
  })
}

export function withViewBox(svgMarkup: string, viewBox: string): string {
  return svgMarkup
    .replace(/\sviewBox="[^"]*"/, ` viewBox="${viewBox}"`)
    .replace(/\swidth="[^"]*"/, ' width="100%"')
    .replace(/\sheight="[^"]*"/, ' height="100%"')
}
