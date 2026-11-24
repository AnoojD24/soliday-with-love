export type OpenWhenIcon =
  | 'heart'
  | 'moon'
  | 'sparkles'
  | 'dumbbell'
  | 'cloud'
  | 'letter'

export interface OpenWhenLetter {
  id: string
  title: string
  shortLabel: string
  body: string
  icon: OpenWhenIcon
  paper: string
  accent: string
}

export const OPEN_WHEN_GREETING = 'Hi, baby...'
export const OPEN_WHEN_CLOSING = 'With love, always. ♡'

export const OPEN_WHEN_SECTION = {
  heading: 'Open when...',
  subtitle: 'A little piece of me, whenever you need it.',
  footer: 'No milestones required. Just because I love you.',
} as const

export const OPEN_WHEN_LETTERS: OpenWhenLetter[] = [
  {
    id: 'miss-me',
    title: 'Open when you miss me',
    shortLabel: 'You miss me',
    body: "I wish I could be there with you right now, holding you and doing absolutely nothing together. Until I see you again, just know there's someone thinking about you and counting down the days.",
    icon: 'heart',
    paper: '#F7DCE5',
    accent: '#C67C98',
  },
  {
    id: 'tired',
    title: "Open when you're tired",
    shortLabel: "You're tired",
    body: "You don't have to be productive every second of every day. Get cozy, put on something you love, and give yourself the rest you deserve. I love you just the same.",
    icon: 'moon',
    paper: '#EFE0F5',
    accent: '#9B7BB0',
  },
  {
    id: 'motivation',
    title: 'Open when you need motivation',
    shortLabel: 'You need motivation',
    body: "I hope you know how much I admire your dedication. Take things one day at a time. I'm cheering for you through all of it.",
    icon: 'sparkles',
    paper: '#FFF6F2',
    accent: '#C67C98',
  },
  {
    id: 'hard-class',
    title: 'Open when you had a hard class',
    shortLabel: 'You had a hard class',
    body: 'Some classes are going to feel harder than others, and that\'s okay. You showed up for yourself today, and that\'s something worth being proud of.',
    icon: 'dumbbell',
    paper: '#DDE8DA',
    accent: '#6F8F74',
  },
  {
    id: 'bad-day',
    title: "Open when you're having a bad day",
    shortLabel: "You're having a bad day",
    body: "I wish I could make today a little easier for you. You don't have to pretend everything is okay around me. I'm here for you, on the good days and the difficult ones.",
    icon: 'cloud',
    paper: '#E4EEF7',
    accent: '#7A96B5',
  },
  {
    id: 'little-love',
    title: 'Open when you need a little love',
    shortLabel: 'You need a little love',
    body: "No special occasion, no milestone, no reason needed. I just love you, and I'm really happy I get to call you my girlfriend.",
    icon: 'letter',
    paper: '#F3C9D6',
    accent: '#80354D',
  },
]
