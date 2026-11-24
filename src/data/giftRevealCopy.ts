/** Copy + timing for the cinematic gift unwrap (edit freely). */

export const GIFT_REVEAL_COPY = {
  welcomeEyebrow: 'A little Christmas gift for you',
  brandTitle: 'Soliday With Love',
  welcomeLine:
    'For my favorite girl, who makes everything a little brighter.',
  welcomeSub:
    'Your workouts, your journey, and a little love from me along the way.',
  welcomeScript: 'Made just for Trisha',
  unwrapCta: 'Unwrap your gift',
  openingCta: 'Opening…',
  photoAlt: 'A photograph of Trisha, smiling softly',
  photoCaption: 'my beautiful girl ♡',
  introScript: 'A little surprise for my favorite girl',
  revealHeadline: 'My teddy bear',
  mainMessage: 'A thousand kisses and the biggest hug just for you <3',
  closing: 'Made with all my love (and cursors love).',
  continueCta: "Let's sleigh",
  backCta: 'Back to Soliday',
} as const

/** Phase durations in milliseconds (aligned to choreography windows). */
export const GIFT_REVEAL_TIMING = {
  anticipation: 400,
  unwrapping: 800,
  photoReveal: 800,
  affectionBurst: 1000,
} as const

export type GiftRevealPhase =
  | 'idle'
  | 'anticipation'
  | 'unwrapping'
  | 'photoReveal'
  | 'affectionBurst'
  | 'revealed'
  | 'continuing'

/** Deterministic decoration placements around the polaroid perimeter. */
export const KISS_MARKS = [
  { id: 'k1', x: 8, y: 10, scale: 1.15, rotate: -22, delay: 0 },
  { id: 'k2', x: 90, y: 8, scale: 1.25, rotate: 18, delay: 0.04 },
  { id: 'k3', x: 4, y: 34, scale: 1.05, rotate: -28, delay: 0.06 },
  { id: 'k4', x: 94, y: 32, scale: 1.12, rotate: 26, delay: 0.08 },
  { id: 'k5', x: 2, y: 58, scale: 1.2, rotate: -14, delay: 0.1 },
  { id: 'k6', x: 96, y: 60, scale: 1.08, rotate: 32, delay: 0.12 },
  // Keep bottom kisses at the sides — clear of the caption band
  { id: 'k7', x: 4, y: 78, scale: 1.18, rotate: -10, delay: 0.14 },
  { id: 'k8', x: 96, y: 78, scale: 1.0, rotate: 14, delay: 0.16 },
  { id: 'k9', x: 48, y: 2, scale: 0.95, rotate: 6, delay: 0.05 },
  { id: 'k10', x: 8, y: 92, scale: 1.0, rotate: -6, delay: 0.18 },
  { id: 'k11', x: 92, y: 92, scale: 1.05, rotate: 12, delay: 0.2 },
] as const

export const FLOAT_HEARTS = [
  { id: 'h1', x: 10, y: 72, delay: 0.05, duration: 3.4, size: 1.1 },
  { id: 'h2', x: 90, y: 70, delay: 0.35, duration: 3.8, size: 0.95 },
  { id: 'h3', x: 6, y: 88, delay: 0.7, duration: 3.2, size: 1.25 },
  { id: 'h4', x: 94, y: 86, delay: 1.0, duration: 4.0, size: 0.85 },
  { id: 'h5', x: 14, y: 54, delay: 1.3, duration: 3.6, size: 1.0 },
  { id: 'h6', x: 8, y: 48, delay: 0.5, duration: 4.2, size: 0.75 },
  { id: 'h7', x: 90, y: 52, delay: 0.9, duration: 3.9, size: 0.8 },
  { id: 'h8', x: 4, y: 30, delay: 1.6, duration: 3.5, size: 1.15 },
  { id: 'h9', x: 22, y: 60, delay: 0.25, duration: 3.7, size: 0.9 },
  { id: 'h10', x: 76, y: 58, delay: 1.1, duration: 4.1, size: 1.05 },
  { id: 'h11', x: 96, y: 40, delay: 0.85, duration: 3.3, size: 0.7 },
  { id: 'h12', x: 86, y: 80, delay: 1.45, duration: 3.8, size: 0.95 },
  { id: 'h13', x: 4, y: 30, delay: 0.15, duration: 3.6, size: 0.85 },
  { id: 'h14', x: 96, y: 34, delay: 0.4, duration: 3.9, size: 0.9 },
  { id: 'h15', x: 18, y: 18, delay: 0.55, duration: 4.0, size: 0.7 },
  { id: 'h16', x: 80, y: 16, delay: 0.65, duration: 3.5, size: 0.8 },
] as const

/** Settled hearts around the frame — bottom center left open for the caption. */
export const SETTLED_HEARTS = [
  { id: 'sh1', x: 18, y: 8, scale: 1.0, delay: 0.15 },
  { id: 'sh2', x: 80, y: 6, scale: 0.85, delay: 0.22 },
  { id: 'sh3', x: 6, y: 28, scale: 1.15, delay: 0.28 },
  { id: 'sh4', x: 94, y: 30, scale: 0.95, delay: 0.2 },
  { id: 'sh5', x: 6, y: 68, scale: 0.8, delay: 0.34 },
  { id: 'sh6', x: 94, y: 68, scale: 1.05, delay: 0.4 },
  { id: 'sh7', x: 36, y: 4, scale: 0.75, delay: 0.18 },
  { id: 'sh8', x: 62, y: 5, scale: 0.9, delay: 0.24 },
  { id: 'sh9', x: 8, y: 46, scale: 0.85, delay: 0.3 },
  { id: 'sh10', x: 92, y: 48, scale: 1.0, delay: 0.36 },
  { id: 'sh11', x: 4, y: 88, scale: 0.95, delay: 0.42 },
  { id: 'sh12', x: 96, y: 88, scale: 0.8, delay: 0.46 },
  { id: 'sh13', x: 28, y: 16, scale: 0.7, delay: 0.12 },
  { id: 'sh14', x: 70, y: 14, scale: 0.88, delay: 0.26 },
  { id: 'sh15', x: 4, y: 62, scale: 1.1, delay: 0.32 },
  { id: 'sh16', x: 96, y: 64, scale: 0.78, delay: 0.38 },
  { id: 'sh19', x: 48, y: 10, scale: 0.65, delay: 0.2 },
] as const

export const XOXO_MARKS = [
  { id: 'x1', x: 6, y: 86, rotate: -12, delay: 0.28, text: 'XOXO' },
  { id: 'x2', x: 78, y: 4, rotate: 8, delay: 0.2, text: 'XOXO' },
  { id: 'x3', x: 6, y: 18, rotate: -18, delay: 0.12, text: 'xo' },
  { id: 'x4', x: 88, y: 20, rotate: 14, delay: 0.16, text: 'xo' },
  { id: 'x5', x: 20, y: 50, rotate: -8, delay: 0.24, text: 'xoxo' },
  { id: 'x6', x: 82, y: 54, rotate: 10, delay: 0.3, text: 'xoxo' },
  { id: 'x7', x: 94, y: 86, rotate: -4, delay: 0.34, text: 'XO' },
  { id: 'x8', x: 58, y: 0, rotate: 6, delay: 0.1, text: '♡ xo' },
] as const

export const SPARKLES = [
  { id: 's1', x: 34, y: 4, delay: 0.05 },
  { id: 's2', x: 66, y: 0, delay: 0.18 },
  { id: 's3', x: 4, y: 50, delay: 0.3 },
  { id: 's4', x: 96, y: 48, delay: 0.12 },
  { id: 's5', x: 8, y: 92, delay: 0.36 },
  { id: 's6', x: 92, y: 94, delay: 0.42 },
  { id: 's7', x: 12, y: 22, delay: 0.08 },
  { id: 's8', x: 88, y: 18, delay: 0.22 },
  { id: 's9', x: 50, y: 8, delay: 0.14 },
  { id: 's12', x: 8, y: 70, delay: 0.4 },
] as const

/** CSS object-position for the portrait crop — face + upper body. */
export const PHOTO_OBJECT_POSITION = '50% 18%'
