import type { MilestoneId } from '../types/workout'

export interface LoveNote {
  id: MilestoneId
  title: string
  thresholdDays: number
  letter: string
}

export const LOVE_NOTES: LoveNote[] = [
  {
    id: 'first',
    title: 'First spark',
    thresholdDays: 1,
    letter:
      'Your Soliday era has officially begun. I\'m already proud of you.',
  },
  {
    id: 'three',
    title: 'Soft strength',
    thresholdDays: 3,
    letter:
      'Look at you showing up for yourself, one workout at a time.',
  },
  {
    id: 'six',
    title: 'Look at you glow',
    thresholdDays: 6,
    letter:
      'Halfway there, baby. I hope you\'re as proud of yourself as I am of you.',
  },
  {
    id: 'nine',
    title: 'Almost there',
    thresholdDays: 9,
    letter:
      'You\'ve come so far. Don\'t forget to take care of yourself along the way.',
  },
]

export const FINAL_SURPRISE = {
  id: 'twelve' as const satisfies MilestoneId,
  title: 'Merry Soliday',
  letter:
    "You did it! I'm so proud of you for completing your Soliday challenge. All those early mornings, difficult classes, and long days finally paid off. You deserve that hoodie and the biggest hug from me.",
  teaser: 'A little surprise wrapped just for you.',
}

export const DAILY_LOVE_NOTES = [
  '"Don\'t you worry your pretty little mind" — Taylor Swift the 🐐',
]

export const PRE_CHALLENGE_MESSAGES = [
  'Soliday is almost here. Soft mornings, strong finishes, and a little love along the way.',
  'Your December chapter is waiting. No rush — just a beautiful beginning ahead.',
  'Before the first class, take a breath. You already belong in this journey.',
]
