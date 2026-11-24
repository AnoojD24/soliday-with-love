import { PinkConfetti } from '../PinkConfetti'

interface FinalSurpriseConfettiProps {
  active: boolean
  lingering?: boolean
}

export function FinalSurpriseConfetti({
  active,
  lingering = false,
}: FinalSurpriseConfettiProps) {
  return (
    <PinkConfetti
      active={active}
      lingering={lingering}
      density="heavy"
      className="z-[5]"
    />
  )
}
