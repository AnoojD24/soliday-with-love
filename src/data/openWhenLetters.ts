import missMeJpg from '../assets/open-when/miss-me.jpg'
import missMeWebp from '../assets/open-when/miss-me.webp'
import tiredJpg from '../assets/open-when/tired.jpg'
import tiredWebp from '../assets/open-when/tired.webp'
import hardClassJpg from '../assets/open-when/hard-class.jpg'
import hardClassWebp from '../assets/open-when/hard-class.webp'
import badDayJpg from '../assets/open-when/bad-day.jpg'
import badDayWebp from '../assets/open-when/bad-day.webp'

export interface OpenWhenPhoto {
  jpg: string
  webp: string
  alt: string
}

export interface OpenWhenLetter {
  id: string
  title: string
  shortLabel: string
  body: string
  paper: string
  accent: string
  photo: OpenWhenPhoto
}

export const OPEN_WHEN_GREETING = 'Hi Teddy,'
export const OPEN_WHEN_CLOSING = 'With love always <3'

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
    body: "I wish I could be there with you right now to share some laughs and cuddles. You are so strong, and I truly believe everything will work out in your favor because of your good intentions and hard work.\n\nI will always be rooting for you, no matter what, and I can't wait to see you complete this journey. I'm so proud of you honey!",
    paper: '#F7DCE5',
    accent: '#C67C98',
    photo: {
      jpg: missMeJpg,
      webp: missMeWebp,
      alt: 'A memory for when you miss me',
    },
  },
  {
    id: 'tired',
    title: "Open when you're tired",
    shortLabel: "You're tired",
    body: "It's okay to feel tired with such an intense schedule. Make time to push yourself during solidcore, but don't forget to make time for yourself to unwind and recharge.\n\nI know work has been very stressful lately, but even when I'm not physically there, I'm always there in spirit. Whether you need to vent about your frustrations, talk about your day, or just share some laughs, I'm always here for you.\n\nYou work so hard honey and I hope you give yourself the same love and care that you give to everyone around you. You deserve to rest without feeling guilty about it.",
    paper: '#EFE0F5',
    accent: '#9B7BB0',
    photo: {
      jpg: tiredJpg,
      webp: tiredWebp,
      alt: 'A soft reminder to rest',
    },
  },
  {
    id: 'hard-class',
    title: 'Open when you had a hard class',
    shortLabel: 'You had a hard class',
    body: "Some classes are going to be harder than others, but don't let one hard session discourage you. I'm proud of you for showing up and challenging yourself, even on the days when it's not easy.\n\nI wish I was there to give you the biggest hug. Ik you will miss my professional massages ;)\n\nRemember how far you've come and give yourself credit for all the hard work you've been putting in. You don't have to be perfect in every class sweetie. What matters is that you're doing this for yourself and getting stronger along the way.\n\nI'll always be your biggest cheerleader!",
    paper: '#DDE8DA',
    accent: '#6F8F74',
    photo: {
      jpg: hardClassJpg,
      webp: hardClassWebp,
      alt: 'A hug after a hard class',
    },
  },
  {
    id: 'bad-day',
    title: "Open when you're having a bad day",
    shortLabel: "You're having a bad day",
    body: "Whatever happened today, don't be too hard on yourself. It's okay to be frustrated when things don't go your way. You don't always have to put on a smile and pretend everything is fine, especially around me.\n\nI may not always have the solution to your problems, but I will always be there to listen to you and keep you company. Never hesitate to call me, even if it's just to complain about the smallest inconvenience. I will always do my best to make you feel reassured and comfortable!\n\nI hope tomorrow treats you a little better. Just remember how much you are loved and how lucky I feel to have you in my life.",
    paper: '#E4EEF7',
    accent: '#7A96B5',
    photo: {
      jpg: badDayJpg,
      webp: badDayWebp,
      alt: 'Something soft for a hard day',
    },
  },
]
