import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'

export function AppShell() {
  return (
    <div className="mx-auto min-h-dvh w-full max-w-lg">
      <main className="safe-top safe-bottom px-5 pt-2">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
