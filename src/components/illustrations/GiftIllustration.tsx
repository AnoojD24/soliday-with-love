interface GiftIllustrationProps {
  className?: string
  unwrapping?: boolean
}

export function GiftIllustration({
  className = '',
  unwrapping = false,
}: GiftIllustrationProps) {
  return (
    <svg
      viewBox="0 0 280 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="48" cy="42" r="4" fill="#F7DCE5" opacity="0.9" />
      <circle cx="232" cy="58" r="3" fill="#EFE0F5" />
      <path
        d="M62 78c6-10 18-10 24 0"
        stroke="#C67C98"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M210 34l4 8 8 1-6 5 2 8-8-4-8 4 2-8-6-5 8-1 4-8z"
        fill="#F7DCE5"
        opacity="0.85"
      />
      <path
        d="M36 168c8-4 14 6 8 12"
        stroke="#DDE8DA"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M244 150c-7 5-4 14 4 12"
        stroke="#EFE0F5"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <ellipse cx="140" cy="214" rx="78" ry="12" fill="#80354D" opacity="0.08" />

      <g
        style={{
          transformOrigin: '140px 170px',
          transform: unwrapping ? 'translateY(10px) scale(0.98)' : undefined,
          transition: 'transform 700ms ease',
        }}
      >
        <rect
          x="74"
          y="118"
          width="132"
          height="96"
          rx="18"
          fill="#F7DCE5"
          stroke="#C67C98"
          strokeWidth="2"
        />
        <rect x="128" y="118" width="24" height="96" fill="#C67C98" />
        <rect x="74" y="154" width="132" height="22" fill="#C67C98" />
        <path
          d="M118 164c8-18 36-18 44 0"
          stroke="#FFF6F2"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.55"
        />
      </g>

      <g
        style={{
          transformOrigin: '140px 118px',
          transform: unwrapping
            ? 'translateY(-56px) translateX(18px) rotate(-14deg)'
            : undefined,
          transition: 'transform 900ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <rect
          x="70"
          y="96"
          width="140"
          height="34"
          rx="12"
          fill="#E8B7C8"
          stroke="#C67C98"
          strokeWidth="2"
        />
        <rect x="128" y="96" width="24" height="34" fill="#C67C98" />
      </g>

      <g
        style={{
          transformOrigin: '140px 96px',
          transform: unwrapping
            ? 'translateY(-72px) translateX(-8px) rotate(12deg) scale(1.05)'
            : undefined,
          transition: 'transform 950ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <path
          d="M140 96c-18-28-48-18-40 8 18-4 30 0 40-8z"
          fill="#C67C98"
        />
        <path
          d="M140 96c18-28 48-18 40 8-18-4-30 0-40-8z"
          fill="#80354D"
        />
        <circle cx="140" cy="98" r="7" fill="#F7DCE5" stroke="#80354D" />
        <path
          d="M136 98c2-3 6-3 8 0"
          stroke="#80354D"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>

      <path
        d="M188 88c10-2 18 8 12 16"
        stroke="#C67C98"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity={unwrapping ? 0.15 : 0.7}
        style={{ transition: 'opacity 600ms ease' }}
      />
      <path
        d="M96 204l5 3 1 6-5-2-5 2 1-6 5-3z"
        fill="#EFE0F5"
        opacity="0.9"
      />
      <path
        d="M198 198l4 2 1 5-4-2-4 2 1-5 4-2z"
        fill="#F7DCE5"
      />
    </svg>
  )
}
