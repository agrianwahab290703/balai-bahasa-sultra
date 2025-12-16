import React from 'react'
import { cn } from '@/lib/utils'

interface GradientButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'accent'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  onClick?: () => void
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

const GradientButton: React.FC<GradientButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className,
  type = 'button',
}) => {
  const baseClasses = cn(
    "relative inline-flex items-center justify-center",
    "font-semibold text-white rounded-lg",
    "transition-all duration-200 ease-in-out",
    "hover:scale-[1.02] hover:brightness-110",
    "focus:outline-none focus:ring-2 focus:ring-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:brightness-100",
    "border border-transparent",
    "shadow-md hover:shadow-lg"
  )

  const variantClasses = {
    primary: "bg-[var(--admin-gradient-button)] text-white focus:ring-[var(--admin-primary-blue)]",
    secondary: "bg-[var(--admin-gradient-header)] text-[var(--admin-primary-blue)] focus:ring-[var(--admin-secondary-blue)]",
    accent: "bg-[var(--admin-accent-yellow)] text-[var(--admin-primary-blue)] focus:ring-[var(--admin-accent-yellow)]"
  }

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm min-h-[36px]",
    md: "px-4 py-2 text-base min-h-[44px]",
    lg: "px-6 py-3 text-lg min-h-[48px]",
    icon: "p-2 min-h-[36px] min-w-[36px]"
  }

  const buttonClasses = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  )

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      style={{
        background: variant === 'primary' 
          ? 'var(--admin-gradient-button)'
          : variant === 'secondary'
          ? 'var(--admin-gradient-header)'
          : 'var(--admin-accent-yellow)',
        transition: 'var(--admin-transition-fast)'
      }}
    >
      <span className="relative z-10">{children}</span>
    </button>
  )
}

export { GradientButton }
export default GradientButton