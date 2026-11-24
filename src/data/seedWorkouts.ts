import type { Workout } from '../types/workout'

type SeedInput = Omit<Workout, 'attendanceStatus' | 'id'> & {
  id: string
}

const rawSeed: SeedInput[] = [
  {
    id: 'w-2026-12-03-0530',
    date: '2026-12-03',
    startTime: '05:30',
    durationMinutes: 50,
    classType: 'Signature50: Full Body',
    instructor: 'Nia D.',
    location: 'Woodland Hills',
    muscleFocus: ['Hamstrings', 'Triceps'],
  },
  {
    id: 'w-2026-12-04-0600',
    date: '2026-12-04',
    startTime: '06:00',
    durationMinutes: 50,
    classType: 'Signature50: Full Body',
    instructor: 'Gabby L.',
    location: 'Costa Mesa',
    muscleFocus: ['Center Glutes', 'Biceps'],
  },
  {
    id: 'w-2026-12-06-1000',
    date: '2026-12-06',
    startTime: '10:00',
    durationMinutes: 50,
    classType: 'Signature50: Full Body',
    instructor: 'Gaby S.',
    location: 'Woodland Hills',
    muscleFocus: ['Hamstrings', 'Shoulders'],
  },
  {
    id: 'w-2026-12-07-1830',
    date: '2026-12-07',
    startTime: '18:30',
    durationMinutes: 50,
    classType: 'Signature50: Full Body',
    instructor: 'Phasja K.',
    location: 'Woodland Hills',
    muscleFocus: ['Inner Thighs', 'Back'],
  },
  {
    id: 'w-2026-12-09-1830',
    date: '2026-12-09',
    startTime: '18:30',
    durationMinutes: 50,
    classType: 'Signature50: Full Body',
    instructor: 'Liz G.',
    location: 'Woodland Hills',
    muscleFocus: ['Outer Glutes', 'Biceps'],
  },
  {
    id: 'w-2026-12-10-1830',
    date: '2026-12-10',
    startTime: '18:30',
    durationMinutes: 50,
    classType: 'Signature50: Full Body',
    instructor: 'Phasja K.',
    location: 'Woodland Hills',
    muscleFocus: ['Inner Thighs', 'Back'],
  },
  {
    id: 'w-2026-12-11-0530',
    date: '2026-12-11',
    startTime: '05:30',
    durationMinutes: 50,
    classType: 'Signature50: Full Body',
    instructor: 'Amaya P.',
    location: 'Woodland Hills',
    muscleFocus: ['Hamstrings', 'Arm Wrap'],
  },
  {
    id: 'w-2026-12-13-1100',
    date: '2026-12-13',
    startTime: '11:00',
    durationMinutes: 50,
    classType: 'Signature50: Full Body',
    instructor: 'Lydia E.',
    location: 'Costa Mesa',
    muscleFocus: ['Center Glutes', 'Back'],
  },
  {
    id: 'w-2026-12-13-1720',
    date: '2026-12-13',
    startTime: '17:20',
    durationMinutes: 30,
    classType: 'Power30: Core + Lower Body',
    instructor: 'Marissa B.',
    location: 'Costa Mesa',
    muscleFocus: ['Center Glutes', 'Back'],
  },
  {
    id: 'w-2026-12-14-1830',
    date: '2026-12-14',
    startTime: '18:30',
    durationMinutes: 50,
    classType: 'Signature50: Full Body',
    instructor: 'Phasja K.',
    location: 'Woodland Hills',
    muscleFocus: ['Hamstrings', 'Biceps'],
  },
  {
    id: 'w-2026-12-15-1830',
    date: '2026-12-15',
    startTime: '18:30',
    durationMinutes: 50,
    classType: 'Signature50: Full Body',
    instructor: 'Phasja K.',
    location: 'Woodland Hills',
    muscleFocus: ['Outer Glutes', 'Chest'],
  },
  {
    id: 'w-2026-12-16-1830',
    date: '2026-12-16',
    startTime: '18:30',
    durationMinutes: 50,
    classType: 'Signature50: Full Body',
    instructor: 'Liz G.',
    location: 'Woodland Hills',
    muscleFocus: ['Inner Thighs', 'Triceps'],
  },
  {
    id: 'w-2026-12-17-1830',
    date: '2026-12-17',
    startTime: '18:30',
    durationMinutes: 50,
    classType: 'Signature50: Full Body',
    instructor: 'Phasja K.',
    location: 'Woodland Hills',
    muscleFocus: ['Leg Wrap', 'Arm Wrap'],
  },
]

function countByDate(workouts: SeedInput[]): Map<string, number> {
  const counts = new Map<string, number>()
  for (const workout of workouts) {
    counts.set(workout.date, (counts.get(workout.date) ?? 0) + 1)
  }
  return counts
}

export function createSeedWorkouts(): Workout[] {
  const counts = countByDate(rawSeed)
  return rawSeed.map((workout) => ({
    ...workout,
    attendanceStatus: (counts.get(workout.date) ?? 0) > 1 ? 'pending' : 'planned',
  }))
}

export const SEED_BOOKING_COUNT = rawSeed.length
export const SEED_DISTINCT_DATES = new Set(rawSeed.map((w) => w.date)).size
