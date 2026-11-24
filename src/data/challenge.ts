/** Official Solidcore Soliday challenge (America/Los_Angeles calendar dates). */
export const CHALLENGE_START = '2026-12-03'
export const CHALLENGE_END = '2026-12-17'

/** Fixed completed-workout-day goal for the free hoodie. */
export const SOLIDAY_GOAL_DAYS = 10

export function isChallengeDate(date: string): boolean {
  return date >= CHALLENGE_START && date <= CHALLENGE_END
}
