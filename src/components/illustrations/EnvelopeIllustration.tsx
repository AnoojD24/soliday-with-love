interface EnvelopeIllustrationProps {
  unlocked?: boolean
  paper?: string
  className?: string
}

export function EnvelopeIllustration({
  unlocked = false,
  paper = '#F7DCE5',
  className = '',
}: EnvelopeIllustrationProps) {
  return (
    <svg
      viewBox="0 0 140 110"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="12"
        y="28"
        width="116"
        height="70"
        rx="12"
        fill={paper}
        stroke="#C67C98"
        strokeWidth="2"
      />
      <path
        d="M14 36l56 38 56-38"
        stroke="#C67C98"
        strokeWidth="2"
        strokeLinejoin="round"
        fill={unlocked ? '#FFF6F2' : paper}
      />
      <path
        d="M14 90l40-28M126 90l-40-28"
        stroke="#C67C98"
        strokeWidth="1.5"
        opacity="0.45"
      />
      <circle
        cx="70"
        cy="62"
        r="14"
        fill={unlocked ? '#80354D' : '#C67C98'}
        stroke="#FFF6F2"
        strokeWidth="2"
      />
      <path
        d="M70 68s-7-4.5-7-8.2C63 57.2 65 55 67.5 55c1.4 0 2.6.8 3.5 1.9.9-1.1 2.1-1.9 3.5-1.9 2.5 0 4.5 2.2 4.5 4.8 0 3.7-7 8.2-7 8.2z"
        fill="#F7DCE5"
      />
    </svg>
  )
}

export function SurpriseGiftIllustration({
  unlocked = false,
  className = '',
}: {
  unlocked?: boolean
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 140 120"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <ellipse cx="70" cy="102" rx="42" ry="8" fill="#80354D" opacity="0.08" />
      <rect
        x="28"
        y="48"
        width="84"
        height="54"
        rx="12"
        fill={unlocked ? '#EFE0F5' : '#F7DCE5'}
        stroke="#C67C98"
        strokeWidth="2"
      />
      <rect x="64" y="48" width="12" height="54" fill="#80354D" />
      <rect x="28" y="68" width="84" height="12" fill="#80354D" />
      <rect
        x="24"
        y="36"
        width="92"
        height="20"
        rx="8"
        fill="#E8B7C8"
        stroke="#C67C98"
        strokeWidth="2"
      />
      <path
        d="M70 36c-12-18-30-10-24 6 10-2 18 0 24-6z"
        fill="#C67C98"
      />
      <path
        d="M70 36c12-18 30-10 24 6-10-2-18 0-24-6z"
        fill="#80354D"
      />
      <circle cx="70" cy="38" r="5" fill="#F7DCE5" stroke="#80354D" />
    </svg>
  )
}
