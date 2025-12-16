import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
        destructive:
          "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
        outline:
          "border border-white/20 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 hover:border-white/30 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
        secondary:
          "bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
        ghost: "text-white hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98]",
        link: "text-blue-400 underline-offset-4 hover:text-blue-300 hover:underline",
        "kemendikdasmen-blue": "bg-gradient-to-r from-blue-700 to-blue-800 text-white hover:from-blue-800 hover:to-blue-900 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
        "kemendikdasmen-gold": "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
        glass: "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
