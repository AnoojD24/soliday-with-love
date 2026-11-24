import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { AppShell } from './components/AppShell'
import { OfflineIndicator } from './components/OfflineIndicator'
import { PwaUpdatePrompt } from './components/PwaUpdatePrompt'
import { AppStateProvider, useAppState } from './context/AppStateContext'
import { CalendarPage } from './pages/CalendarPage'
import { HomePage } from './pages/HomePage'
import { ProgressPage } from './pages/ProgressPage'
import { WelcomeGiftPage } from './pages/WelcomeGiftPage'
import { WithLovePage } from './pages/WithLovePage'

const MuscleMapPreviewPage = import.meta.env.DEV
  ? lazy(() =>
      import('./pages/MuscleMapPreviewPage').then((m) => ({
        default: m.MuscleMapPreviewPage,
      })),
    )
  : null

function AppRoutes() {
  const { state, replayingWelcome } = useAppState()

  return (
    <Routes>
      {MuscleMapPreviewPage && (
        <Route
          path="dev/muscle-map"
          element={
            <Suspense fallback={null}>
              <MuscleMapPreviewPage />
            </Suspense>
          }
        />
      )}
      {!state.onboardingCompleted || replayingWelcome ? (
        <Route path="*" element={<WelcomeGiftPage />} />
      ) : (
        <Route element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="progress" element={<ProgressPage />} />
          <Route path="with-love" element={<WithLovePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      )}
    </Routes>
  )
}

export default function App() {
  return (
    <AppStateProvider>
      <BrowserRouter>
        {/* Register the service worker on every surface, including first-launch gift. */}
        <OfflineIndicator />
        <PwaUpdatePrompt />
        <AppRoutes />
      </BrowserRouter>
    </AppStateProvider>
  )
}
