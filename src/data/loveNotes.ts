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
    title: 'Halfway glow',
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
    'You did it, beautiful. I\'m so proud of you. Merry Soliday. ♡',
  teaser: 'A little surprise wrapped just for you.',
}

export const DAILY_LOVE_NOTES = [
  'You make ordinary mornings feel like something worth dressing up for.',
  'I love the way you take care of yourself — softly, steadily, beautifully.',
  'Wherever today lands, I\'m cheering for you.',
  'Your strength looks lovely on you.',
  'Rest when you need it. Shine when you\'re ready.',
  'I packed a little extra pride into today, just in case you need it.',
  'You are allowed to go gently and still be unstoppable.',
  'Thinking of you between the warm-ups and the cool-downs.',
  'Every class you choose is another love note to yourself.',
  'I hope today feels kind in all the right places.',
  'You\'re doing better than you think, beautiful.',
  'Keep going at your pace. I\'ll be right here.',
]

export const PRE_CHALLENGE_MESSAGES = [
  'Soliday is almost here. Soft mornings, strong finishes, and a little love along the way.',
  'Your December chapter is waiting. No rush — just a beautiful beginning ahead.',
  'Before the first class, take a breath. You already belong in this journey.',
]
