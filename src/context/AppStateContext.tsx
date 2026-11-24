import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from 'react'
import {
  type AppSettings,
  type MilestoneId,
  type PersistedState,
  type Workout,
  type WorkoutJournal,
} from '../types/workout'
import {
  applyFlexibleDecision,
  confirmBookingCanceled,
  markWorkoutCompleted,
  reverseWorkoutCompletion,
} from '../utils/attendance'
import {
  computeProgressStats,
  getNewlyAchievedCelebrations,
  getNewlyUnlockedMilestones,
} from '../utils/progress'
import {
  consumeWelcomeReplayOnBoot,
  createInitialState,
  loadState,
  markWelcomeReplayFinished,
  saveState,
} from '../utils/storage'

type AppAction =
  | { type: 'COMPLETE_ONBOARDING' }
  | { type: 'UPSERT_WORKOUT'; workout: Workout }
  | { type: 'DELETE_WORKOUT'; id: string }
  | { type: 'PATCH_WORKOUTS'; workouts: Workout[] }
  | { type: 'UPDATE_SETTINGS'; settings: Partial<AppSettings> }
  | { type: 'UNLOCK_MILESTONES'; ids: MilestoneId[] }
  | { type: 'CELEBRATE_MILESTONES'; ids: MilestoneId[] }
  | { type: 'MARK_OPEN_WHEN_READ'; id: string }
  | { type: 'MARK_FINAL_SURPRISE_SEEN' }
  | { type: 'REPLACE_STATE'; state: PersistedState }
  | { type: 'RESET_TO_SEED'; state: PersistedState }

function mergeMilestones(
  existing: MilestoneId[],
  incoming: MilestoneId[],
): MilestoneId[] {
  return [...new Set([...existing, ...incoming])]
}

function withMilestoneSync(state: PersistedState): PersistedState {
  const stats = computeProgressStats(state.workouts)
  const newlyUnlocked = getNewlyUnlockedMilestones(
    stats.completedWorkoutDays,
    state.settings.goalWorkoutDays,
    state.unlockedMilestones,
  )
  if (newlyUnlocked.length === 0) return state
  return {
    ...state,
    unlockedMilestones: mergeMilestones(
      state.unlockedMilestones,
      newlyUnlocked,
    ),
  }
}

function reducer(state: PersistedState, action: AppAction): PersistedState {
  switch (action.type) {
    case 'COMPLETE_ONBOARDING':
      return { ...state, onboardingCompleted: true }
    case 'UPSERT_WORKOUT': {
      const index = state.workouts.findIndex((w) => w.id === action.workout.id)
      const workouts =
        index === -1
          ? [...state.workouts, action.workout]
          : state.workouts.map((w, i) =>
              i === index ? action.workout : w,
            )
      return withMilestoneSync({ ...state, workouts })
    }
    case 'DELETE_WORKOUT':
      return {
        ...state,
        workouts: state.workouts.filter((w) => w.id !== action.id),
      }
    case 'PATCH_WORKOUTS': {
      const byId = new Map(action.workouts.map((w) => [w.id, w]))
      const workouts = state.workouts.map((w) => byId.get(w.id) ?? w)
      for (const workout of action.workouts) {
        if (!state.workouts.some((w) => w.id === workout.id)) {
          workouts.push(workout)
        }
      }
      return withMilestoneSync({ ...state, workouts })
    }
    case 'UPDATE_SETTINGS':
      return withMilestoneSync({
        ...state,
        settings: {
          ...state.settings,
          ...action.settings,
          goalWorkoutDays: state.settings.goalWorkoutDays,
        },
      })
    case 'UNLOCK_MILESTONES':
      return {
        ...state,
        unlockedMilestones: mergeMilestones(
          state.unlockedMilestones,
          action.ids,
        ),
      }
    case 'CELEBRATE_MILESTONES':
      return {
        ...state,
        celebratedMilestones: mergeMilestones(
          state.celebratedMilestones,
          action.ids,
        ),
      }
    case 'MARK_OPEN_WHEN_READ': {
      if (state.openedOpenWhenLetters.includes(action.id)) return state
      return {
        ...state,
        openedOpenWhenLetters: [...state.openedOpenWhenLetters, action.id],
      }
    }
    case 'MARK_FINAL_SURPRISE_SEEN':
      if (state.finalSurpriseSeen) return state
      return { ...state, finalSurpriseSeen: true }
    case 'REPLACE_STATE':
    case 'RESET_TO_SEED':
      return action.state
    default:
      return state
  }
}

interface AppStateContextValue {
  state: PersistedState
  replayingWelcome: boolean
  completeOnboarding: () => void
  startWelcomeReplay: () => void
  finishWelcomeReplay: () => void
  upsertWorkout: (workout: Workout) => void
  deleteWorkout: (id: string) => void
  updateSettings: (settings: Partial<AppSettings>) => void
  replaceState: (state: PersistedState) => void
  resetToSeed: () => void
  applyDayDecision: (date: string, selectedIds: string[]) => void
  setCancellationConfirmed: (id: string, confirmed: boolean) => void
  completeWorkout: (id: string, journal?: WorkoutJournal) => MilestoneId[]
  undoCompleteWorkout: (id: string) => void
  markMilestonesCelebrated: (ids: MilestoneId[]) => void
  markOpenWhenRead: (id: string) => void
  markFinalSurpriseSeen: () => void
}

const AppStateContext = createContext<AppStateContextValue | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState)
  // New Vercel deploy (or Refresh on update banner) → reopen welcome gift once.
  const [replayingWelcome, setReplayingWelcome] = useState(() =>
    consumeWelcomeReplayOnBoot(loadState().onboardingCompleted),
  )

  useEffect(() => {
    saveState(state)
  }, [state])

  const completeOnboarding = useCallback(() => {
    dispatch({ type: 'COMPLETE_ONBOARDING' })
    markWelcomeReplayFinished()
    setReplayingWelcome(false)
  }, [])

  const startWelcomeReplay = useCallback(() => {
    setReplayingWelcome(true)
  }, [])

  const finishWelcomeReplay = useCallback(() => {
    markWelcomeReplayFinished()
    setReplayingWelcome(false)
  }, [])

  const upsertWorkout = useCallback((workout: Workout) => {
    dispatch({ type: 'UPSERT_WORKOUT', workout })
  }, [])

  const deleteWorkout = useCallback((id: string) => {
    dispatch({ type: 'DELETE_WORKOUT', id })
  }, [])

  const updateSettings = useCallback((settings: Partial<AppSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', settings })
  }, [])

  const replaceState = useCallback((next: PersistedState) => {
    dispatch({ type: 'REPLACE_STATE', state: next })
  }, [])

  const resetToSeed = useCallback(() => {
    dispatch({ type: 'RESET_TO_SEED', state: createInitialState() })
  }, [])

  const applyDayDecision = useCallback(
    (date: string, selectedIds: string[]) => {
      const dayWorkouts = state.workouts.filter((w) => w.date === date)
      const updated = applyFlexibleDecision(dayWorkouts, selectedIds)
      dispatch({ type: 'PATCH_WORKOUTS', workouts: updated })
    },
    [state.workouts],
  )

  const setCancellationConfirmed = useCallback(
    (id: string, confirmed: boolean) => {
      const workout = state.workouts.find((w) => w.id === id)
      if (!workout) return
      dispatch({
        type: 'UPSERT_WORKOUT',
        workout: confirmed
          ? confirmBookingCanceled(workout)
          : { ...workout, bookingCanceledInApp: false },
      })
    },
    [state.workouts],
  )

  const completeWorkout = useCallback(
    (id: string, journal?: WorkoutJournal): MilestoneId[] => {
      const workout = state.workouts.find((w) => w.id === id)
      if (!workout || workout.attendanceStatus === 'completed') return []

      const completed = {
        ...markWorkoutCompleted(workout),
        journal: journal ?? workout.journal,
      }
      const nextWorkouts = state.workouts.map((w) =>
        w.id === id ? completed : w,
      )
      const after = computeProgressStats(nextWorkouts).completedWorkoutDays
      const newlyCelebrated = getNewlyAchievedCelebrations(
        after,
        state.settings.goalWorkoutDays,
        state.celebratedMilestones,
      )

      dispatch({ type: 'UPSERT_WORKOUT', workout: completed })
      return newlyCelebrated
    },
    [state.workouts, state.settings.goalWorkoutDays, state.celebratedMilestones],
  )

  const undoCompleteWorkout = useCallback(
    (id: string) => {
      const workout = state.workouts.find((w) => w.id === id)
      if (!workout || workout.attendanceStatus !== 'completed') return
      dispatch({
        type: 'UPSERT_WORKOUT',
        workout: reverseWorkoutCompletion(workout),
      })
    },
    [state.workouts],
  )

  const markMilestonesCelebrated = useCallback((ids: MilestoneId[]) => {
    if (ids.length === 0) return
    dispatch({ type: 'CELEBRATE_MILESTONES', ids })
  }, [])

  const markOpenWhenRead = useCallback((id: string) => {
    dispatch({ type: 'MARK_OPEN_WHEN_READ', id })
  }, [])

  const markFinalSurpriseSeen = useCallback(() => {
    dispatch({ type: 'MARK_FINAL_SURPRISE_SEEN' })
  }, [])

  const value = useMemo(
    () => ({
      state,
      replayingWelcome,
      completeOnboarding,
      startWelcomeReplay,
      finishWelcomeReplay,
      upsertWorkout,
      deleteWorkout,
      updateSettings,
      replaceState,
      resetToSeed,
      applyDayDecision,
      setCancellationConfirmed,
      completeWorkout,
      undoCompleteWorkout,
      markMilestonesCelebrated,
      markOpenWhenRead,
      markFinalSurpriseSeen,
    }),
    [
      state,
      replayingWelcome,
      completeOnboarding,
      startWelcomeReplay,
      finishWelcomeReplay,
      upsertWorkout,
      deleteWorkout,
      updateSettings,
      replaceState,
      resetToSeed,
      applyDayDecision,
      setCancellationConfirmed,
      completeWorkout,
      undoCompleteWorkout,
      markMilestonesCelebrated,
      markOpenWhenRead,
      markFinalSurpriseSeen,
    ],
  )

  return (
    <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
  )
}

export function useAppState(): AppStateContextValue {
  const context = useContext(AppStateContext)
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider')
  }
  return context
}
