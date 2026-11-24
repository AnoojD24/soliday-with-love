interface KissMarkProps {
  className?: string
  tone?: 'blush' | 'rose' | 'berry'
}

const FILLS = {
  blush: '#F0C4D2',
  rose: '#C67C98',
  berry: '#9B4A66',
} as const

/**
 * Classic lipstick kiss print — upper/lower lips only.
 * No eye/smile strokes that read as a face.
 */
export function KissMark({ className = '', tone = 'rose' }: KissMarkProps) {
  const fill = FILLS[tone]
  return (
    <svg
      viewBox="0 0 72 56"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Upper lip */}
      <path
        d="M36 22
           C30 12 20 10 12 16
           C8 19 7 24 10 28
           C16 24 26 24 36 28
           C46 24 56 24 62 28
           C65 24 64 19 60 16
           C52 10 42 12 36 22Z"
        fill={fill}
      />
      {/* Lower lip */}
      <path
        d="M10 30
           C14 42 24 50 36 50
           C48 50 58 42 62 30
           C54 34 44 36 36 34
           C28 36 18 34 10 30Z"
        fill={fill}
      />
      {/* Soft print texture (lip ridges, not facial features) */}
      <path
        d="M22 20 C26 18 30 19 33 22"
        stroke="#FFF6F2"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.35"
      />
      <path
        d="M39 22 C42 19 46 18 50 20"
        stroke="#FFF6F2"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.35"
      />
      <path
        d="M24 38 C30 42 42 42 48 38"
        stroke="#FFF6F2"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.28"
      />
    </svg>
  )
}
