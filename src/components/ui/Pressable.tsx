import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

interface PressableProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  fullWidth?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  onClick?: () => void
  'aria-label'?: string
}

const variantClasses: Record<NonNullable<PressableProps['variant']>, string> = {
  primary:
    'bg-berry text-cream shadow-[var(--shadow-soft)] hover:bg-[#6f2d43]',
  secondary:
    'bg-white text-berry border border-blush shadow-[var(--shadow-soft)]',
  ghost: 'bg-transparent text-berry',
  danger: 'bg-white text-[#9b3a4f] border border-[#f0c9d4]',
}

export function Pressable({
  children,
  variant = 'primary',
  fullWidth = false,
  className = '',
  type = 'button',
  disabled,
  onClick,
  'aria-label': ariaLabel,
}: PressableProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      whileTap={reduceMotion || disabled ? undefined : { scale: 0.97 }}
      className={`touch-target inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </motion.button>
  )
}
