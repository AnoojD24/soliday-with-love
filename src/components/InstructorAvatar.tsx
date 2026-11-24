interface InstructorAvatarProps {
  name: string
  size?: 'sm' | 'md'
}

function initialsFromName(name: string): string {
  const parts = name.replace(/\./g, '').split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}

const palette = [
  'bg-[#F7DCE5] text-berry',
  'bg-[#EFE0F5] text-berry',
  'bg-[#DDE8DA] text-[#45634a]',
  'bg-[#f3c9d6] text-[#6f2d43]',
]

export function InstructorAvatar({ name, size = 'md' }: InstructorAvatarProps) {
  const initials = initialsFromName(name)
  const color = palette[name.length % palette.length]
  const sizeClass = size === 'sm' ? 'h-9 w-9 text-xs' : 'h-11 w-11 text-sm'

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full font-semibold ${sizeClass} ${color}`}
      aria-hidden="true"
    >
      {initials}
    </div>
  )
}
