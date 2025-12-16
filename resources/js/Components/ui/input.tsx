import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Base glassmorphism input styles
          "flex h-10 w-full rounded-lg border bg-white/10 backdrop-blur-md px-3 py-2 text-sm",
          "border-white/20 shadow-lg transition-all duration-200",
          "placeholder:text-white/60 focus:outline-none",
          "focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400/50",
          "focus:bg-white/15 focus:shadow-xl",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          // Hover effects
          "hover:bg-white/12 hover:border-white/30 hover:shadow-lg",
          // Active states
          "active:scale-[0.98]",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
