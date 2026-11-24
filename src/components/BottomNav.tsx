import { CalendarDays, Heart, Home, Sparkles } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const tabs: {
  to: string
  label: string
  icon: typeof Home
  end?: boolean
}[] = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/calendar', label: 'Calendar', icon: CalendarDays },
  { to: '/progress', label: 'Progress', icon: Sparkles },
  { to: '/with-love', label: 'With Love', icon: Heart },
]

export function BottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-blush/80 bg-cream/95 backdrop-blur-md"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      aria-label="Primary"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-4 px-2 pt-1">
        {tabs.map(({ to, label, icon: Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={Boolean(end)}
              className={({ isActive }) =>
                `touch-target flex flex-col items-center justify-center gap-0.5 rounded-2xl px-2 py-2 text-[11px] font-medium transition-colors ${
                  isActive ? 'text-berry' : 'text-rose/70'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`rounded-2xl px-3 py-1.5 ${
                      isActive ? 'bg-blush' : 'bg-transparent'
                    }`}
                  >
                    <Icon
                      className="h-5 w-5"
                      strokeWidth={isActive ? 2.4 : 1.8}
                      aria-hidden="true"
                    />
                  </span>
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
