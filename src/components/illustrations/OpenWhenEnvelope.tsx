import type { OpenWhenIcon } from '../../data/openWhenLetters'

interface OpenWhenEnvelopeProps {
  paper: string
  accent: string
  icon: OpenWhenIcon
  opened?: boolean
  className?: string
}

function ThematicIcon({
  icon,
  accent,
}: {
  icon: OpenWhenIcon
  accent: string
}) {
  switch (icon) {
    case 'heart':
      return (
        <path
          d="M70 34c-6-5-14-4-18 2-4-6-12-7-18-2-7 6-6 16 2 24l16 14 16-14c8-8 9-18 2-24z"
          fill={accent}
          opacity="0.85"
        />
      )
    case 'moon':
      return (
        <path
          d="M78 28c-10-2-20 4-22 14 8-4 18-2 22 6 8-4 8-16 0-20z"
          fill={accent}
          opacity="0.9"
        />
      )
    case 'sparkles':
      return (
        <g fill={accent}>
          <path d="M70 22l2.5 6 6.5 1-5 4.5 1.5 6.5-5.5-3.5-5.5 3.5 1.5-6.5-5-4.5 6.5-1 2.5-6z" />
          <circle cx="54" cy="34" r="2.2" />
          <circle cx="86" cy="36" r="1.8" />
        </g>
      )
    case 'dumbbell':
      return (
        <g stroke={accent} strokeWidth="3" strokeLinecap="round">
          <path d="M52 34h36" />
          <path d="M52 28v12M88 28v12" />
          <path d="M46 30v8M94 30v8" />
        </g>
      )
    case 'cloud':
      return (
        <path
          d="M50 40c0-6 5-10 11-10 2-5 7-8 13-8 8 0 14 6 14 14 5 0 8 4 8 8H50c-4 0-8-3-8-7 0-1 .2-2 .5-3z"
          fill={accent}
          opacity="0.85"
        />
      )
    case 'letter':
      return (
        <g>
          <rect
            x="52"
            y="24"
            width="36"
            height="26"
            rx="3"
            fill="#FFF6F2"
            stroke={accent}
            strokeWidth="2"
          />
          <path d="M54 26l16 12 16-12" stroke={accent} strokeWidth="2" fill="none" />
        </g>
      )
  }
}

export function OpenWhenEnvelope({
  paper,
  accent,
  icon,
  opened = false,
  className = '',
}: OpenWhenEnvelopeProps) {
  return (
    <svg
      viewBox="0 0 140 120"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* soft paper body */}
      <rect
        x="14"
        y="36"
        width="112"
        height="68"
        rx="10"
        fill={paper}
        stroke={accent}
        strokeWidth="2"
      />
      <path
        d="M16 42h108"
        stroke="#FFFFFF"
        strokeWidth="3"
        opacity="0.35"
      />

      {/* flap */}
      <g
        style={{
          transformOrigin: '70px 42px',
          transform: opened ? 'translateY(-6px) rotateX(28deg)' : undefined,
          transition: 'transform 500ms ease',
        }}
      >
        <path
          d="M16 42l54 36 54-36"
          fill={opened ? '#FFF6F2' : paper}
          stroke={accent}
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </g>

      {/* side folds */}
      <path
        d="M16 96l38-26M124 96l-38-26"
        stroke={accent}
        strokeWidth="1.4"
        opacity="0.4"
      />

      {/* thematic motif above seal */}
      <g transform="translate(0 -2)">
        <ThematicIcon icon={icon} accent={accent} />
      </g>

      {/* wax seal */}
      <g
        style={{
          transformOrigin: '70px 68px',
          transform: opened ? 'scale(0.7) translateY(8px)' : undefined,
          opacity: opened ? 0.35 : 1,
          transition: 'transform 450ms ease, opacity 450ms ease',
        }}
      >
        <circle cx="70" cy="68" r="15" fill="#80354D" stroke="#FFF6F2" strokeWidth="2" />
        <path
          d="M70 74s-7.5-4.8-7.5-8.8C62.5 62.4 65 60 67.8 60c1.5 0 2.8.9 3.7 2.1.9-1.2 2.2-2.1 3.7-2.1 2.8 0 5.3 2.4 5.3 5.2 0 4-7.5 8.8-7.5 8.8z"
          fill="#F7DCE5"
        />
      </g>
    </svg>
  )
}
