import React from 'react'
import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'stat' | 'activity'
  hoverable?: boolean
  gradient?: boolean
  onClick?: () => void
  style?: React.CSSProperties
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  variant = 'default',
  hoverable = false,
  gradient = false,
  onClick,
  style,
}) => {
  const baseClasses = cn(
    "relative overflow-hidden rounded-xl",
    "border border-[var(--admin-glass-border)]",
    "shadow-[var(--admin-glass-shadow)]",
    "transition-all duration-300 ease-in-out",
    hoverable && "hover:transform hover:-translate-y-2 hover:shadow-xl cursor-pointer",
    gradient && "before:absolute before:inset-0 before:rounded-xl before:bg-[var(--admin-gradient-card)] before:opacity-20 before:z-0"
  )

  const variantClasses = {
    default: "bg-[var(--admin-glass-bg)] backdrop-blur-[var(--admin-glass-blur)]",
    stat: "bg-[var(--admin-glass-bg)] backdrop-blur-[var(--admin-glass-blur)] border-l-4 border-l-[var(--admin-accent-yellow)]",
    activity: "bg-[var(--admin-glass-bg)] backdrop-blur-[var(--admin-glass-blur)] border-l-4 border-l-[var(--admin-primary-blue)]"
  }

  const cardClasses = cn(
    baseClasses,
    variantClasses[variant],
    className
  )

  return (
    <div
      className={cardClasses}
      onClick={onClick}
      style={{
        background: 'var(--admin-glass-bg)',
        backdropFilter: `blur(${getComputedStyle(document.documentElement).getPropertyValue('--admin-glass-blur')})`,
        transition: 'var(--admin-transition-normal)',
        ...style
      }}
    >
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

export { GlassCard }
export default GlassCard