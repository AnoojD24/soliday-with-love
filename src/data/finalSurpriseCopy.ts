export type FinalSurprisePhase =
  | 'intro'
  | 'shaking'
  | 'burst'
  | 'photoReveal'
  | 'affection'
  | 'settled'
  | 'closing'

/** Editable copy for the Merry Soliday final surprise. */
export const FINAL_SURPRISE_COPY = {
  cardEyebrow: 'Final surprise',
  cardTitle: 'Merry Soliday',
  cardTeaser: 'A little surprise wrapped just for you.',
  cardReady: 'Your Soliday surprise is ready to open.',
  cardLockedHint: 'Unlocks after 10 workout days',
  cardUnlockedHint: 'Tap to unwrap',

  overlayEyebrow: 'Your final surprise ♡',
  youDidIt: 'YOU DID IT!',
  title: 'Merry Soliday',
  photoCaption: 'My strong, beautiful girl ♡',
  photoAlt: 'A keepsake photo from your Soliday journey',

  greeting: 'Hi Teddy,',
  letter:
    "You did it! I'm so proud of you for completing your Soliday challenge. All those early mornings, difficult classes, and long days finally paid off. You deserve that hoodie and the biggest hug from me.",
  closing: 'With love always <3',

  backCta: 'Back to Soliday',
  replayCta: 'Replay celebration ♡',
} as const

/** Timeline for the first-open cinematic (ms from start). */
export const FINAL_SURPRISE_TIMING = {
  introMs: 400,
  shakeMs: 1000,
  burstMs: 400,
  photoMs: 1000,
  affectionMs: 700,
  settleMs: 700,
} as const

export function finalSurprisePhaseAt(elapsedMs: number): FinalSurprisePhase {
  const t = FINAL_SURPRISE_TIMING
  let mark = 0
  mark += t.introMs
  if (elapsedMs < mark) return 'intro'
  mark += t.shakeMs
  if (elapsedMs < mark) return 'shaking'
  mark += t.burstMs
  if (elapsedMs < mark) return 'burst'
  mark += t.photoMs
  if (elapsedMs < mark) return 'photoReveal'
  mark += t.affectionMs
  if (elapsedMs < mark) return 'affection'
  return 'settled'
}

export const FINAL_SURPRISE_TOTAL_MS =
  FINAL_SURPRISE_TIMING.introMs +
  FINAL_SURPRISE_TIMING.shakeMs +
  FINAL_SURPRISE_TIMING.burstMs +
  FINAL_SURPRISE_TIMING.photoMs +
  FINAL_SURPRISE_TIMING.affectionMs +
  FINAL_SURPRISE_TIMING.settleMs
