import { useNavigate } from 'react-router-dom'
import { GiftRevealSequence } from '../components/gift-reveal/GiftRevealSequence'
import { useAppState } from '../context/AppStateContext'

export function WelcomeGiftPage() {
  const navigate = useNavigate()
  const {
    state,
    replayingWelcome,
    completeOnboarding,
    finishWelcomeReplay,
  } = useAppState()

  function handleComplete() {
    if (replayingWelcome && state.onboardingCompleted) {
      finishWelcomeReplay()
      navigate('/', { replace: true })
      return
    }
    completeOnboarding()
    navigate('/', { replace: true })
  }

  return (
    <GiftRevealSequence
      replaying={replayingWelcome && state.onboardingCompleted}
      onComplete={handleComplete}
      onBack={
        replayingWelcome && state.onboardingCompleted
          ? finishWelcomeReplay
          : undefined
      }
    />
  )
}
