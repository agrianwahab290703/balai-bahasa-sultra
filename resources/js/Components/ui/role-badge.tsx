import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Shield, ShieldCheck } from "lucide-react"

const roleBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border font-semibold transition-colors",
  {
    variants: {
      role: {
        super_admin: "bg-purple-100 text-purple-800 border-purple-200",
        admin: "bg-blue-100 text-blue-800 border-blue-200",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-1 text-xs",
        lg: "px-3 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      role: "admin",
      size: "md",
    },
  }
)

const roleLabels: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
}

const roleIcons: Record<string, React.ReactNode> = {
  super_admin: <ShieldCheck className="h-3.5 w-3.5" />,
  admin: <Shield className="h-3.5 w-3.5" />,
}

export interface RoleBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Omit<VariantProps<typeof roleBadgeVariants>, 'role'> {
  role: 'super_admin' | 'admin'
  showIcon?: boolean
}

function RoleBadge({ 
  className, 
  role, 
  size, 
  showIcon = true,
  ...props 
}: RoleBadgeProps) {
  return (
    <div 
      className={cn(roleBadgeVariants({ role, size }), className)} 
      {...props}
    >
      {showIcon && roleIcons[role]}
      <span>{roleLabels[role]}</span>
    </div>
  )
}

export { RoleBadge, roleBadgeVariants, roleLabels }
