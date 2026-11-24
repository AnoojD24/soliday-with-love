import { BurstConfettiCanvas } from '../BurstConfettiCanvas'

interface WelcomeGiftConfettiProps {
  active: boolean
}

/** Full-viewport burst for the welcome unwrap — canvas, not Motion DOM. */
export function WelcomeGiftConfetti({ active }: WelcomeGiftConfettiProps) {
  return (
    <BurstConfettiCanvas
      active={active}
      density="gift"
      className="z-[20]"
    />
  )
}
