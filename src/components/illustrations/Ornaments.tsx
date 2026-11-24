export function BowMark({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 56 40"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M28 18C16 2 2 8 10 20c7-3 12-1 18-2z"
        fill="#C67C98"
      />
      <path
        d="M28 18C40 2 54 8 46 20c-7-3-12-1-18-2z"
        fill="#80354D"
      />
      <path d="M26 20l-4 14h6l3-14h-5z" fill="#C67C98" />
      <path d="M30 20l4 14h-6l-3-14h5z" fill="#80354D" />
      <circle cx="28" cy="18" r="5" fill="#F7DCE5" stroke="#80354D" strokeWidth="1.5" />
      <path
        d="M25.5 17.5c1.5-2 3.5-2 5 0"
        stroke="#80354D"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function HeartMark({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 22"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 20S2.5 14.2 2.5 8.4C2.5 5.4 4.8 3 7.8 3c1.7 0 3.2.9 4.2 2.2C13 3.9 14.5 3 16.2 3c3 0 5.3 2.4 5.3 5.4C21.5 14.2 12 20 12 20z"
        fill="#C67C98"
      />
    </svg>
  )
}

export function SnowflakeMark({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 2v20M4.5 6.5l15 11M19.5 6.5l-15 11"
        stroke="#C67C98"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="1.8" fill="#EFE0F5" />
    </svg>
  )
}
