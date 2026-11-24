import { describe, expect, it } from 'vitest'
import {
  markActiveMuscleRegions,
  resolveActiveRegionIds,
} from './muscleFocusMap'

describe('muscle focus mapping', () => {
  it('maps hamstrings to posterior thigh regions only', () => {
    const ids = resolveActiveRegionIds(['Hamstrings'])
    expect(ids.has('biceps_femoris')).toBe(true)
    expect(ids.has('medial_hamstrings')).toBe(true)
    expect(ids.has('gastrocnemius')).toBe(false)
    expect(ids.has('soleus')).toBe(false)
  })

  it('maps center and outer glutes distinctly', () => {
    const center = resolveActiveRegionIds(['Center Glutes'])
    const outer = resolveActiveRegionIds(['Outer Glutes'])
    expect(center.has('gluteus_maximus')).toBe(true)
    expect(center.has('gluteus_medius')).toBe(false)
    expect(outer.has('gluteus_medius')).toBe(true)
  })

  it('supports combined workout focuses', () => {
    const ids = resolveActiveRegionIds(['Hamstrings', 'Triceps'])
    expect(ids.has('biceps_femoris')).toBe(true)
    expect(ids.has('triceps_brachii')).toBe(true)
  })

  it('marks matching SVG groups as active', () => {
    const markup =
      '<g data-muscle-id="triceps_brachii" data-view="rear"><path /></g>' +
      '<g data-muscle-id="biceps_brachii" data-view="front"><path /></g>'
    const next = markActiveMuscleRegions(
      markup,
      resolveActiveRegionIds(['Triceps']),
    )
    expect(next).toContain('class="is-active"')
    expect(next.indexOf('is-active')).toBeLessThan(
      next.indexOf('biceps_brachii'),
    )
  })
})
