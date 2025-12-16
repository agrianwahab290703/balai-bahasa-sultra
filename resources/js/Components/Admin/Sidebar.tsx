import React, { useMemo, useEffect, useState } from 'react'
import { Link, usePage } from '@inertiajs/react'
import { cn } from '@/lib/utils'
import { Button } from '@/Components/ui/button'
import {
  Home01Icon,
  File01Icon,
  Image01Icon,
  Document01Icon,
  HelpCircleIcon,
  ClipboardListIcon,
  Building01Icon,
  Menu01Icon,
  FolderOpenIcon,
  Users01Icon,
  Activity01Icon,
  Settings01Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LockIcon,
} from 'hugeicons-react'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  userRole?: string
}

// localStorage key for sidebar state
const SIDEBAR_STATE_KEY = 'admin-sidebar-collapsed'

// Helper function to get initial collapsed state from localStorage
const getInitialCollapsedState = (): boolean => {
  if (typeof window === 'undefined') return false
  
  try {
    const stored = localStorage.getItem(SIDEBAR_STATE_KEY)
    return stored !== null ? JSON.parse(stored) : false
  } catch {
    // Fallback to expanded if localStorage is not available or corrupted
    return false
  }
}

// Helper function to save collapsed state to localStorage
const saveCollapsedState = (collapsed: boolean): void => {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(SIDEBAR_STATE_KEY, JSON.stringify(collapsed))
  } catch {
    // Silently fail if localStorage is not available
  }
}

interface MenuItem {
  label: string
  href: string
  icon: React.ReactNode
  roles?: string[] // Roles that can access this menu item (empty = all roles)
}

// Menu items with role-based visibility
// Roles: super_admin, admin, editor
// Empty roles array = accessible by all roles
const menuItems: MenuItem[] = [
  { 
    label: 'Dashboard', 
    href: '/admin/dashboard', 
    icon: <Home01Icon className="h-5 w-5" />,
    roles: [] // All roles
  },
  { 
    label: 'Berita', 
    href: '/admin/berita', 
    icon: <File01Icon className="h-5 w-5" />,
    roles: [] // All roles
  },
  { 
    label: 'Galeri', 
    href: '/admin/gallery', 
    icon: <Image01Icon className="h-5 w-5" />,
    roles: [] // All roles
  },
  { 
    label: 'PPID', 
    href: '/admin/ppid', 
    icon: <Document01Icon className="h-5 w-5" />,
    roles: ['super_admin', 'admin'] // Admin only
  },
  { 
    label: 'SSD (FAQ)', 
    href: '/admin/ssd', 
    icon: <HelpCircleIcon className="h-5 w-5" />,
    roles: [] // All roles
  },
  { 
    label: 'Standar Pelayanan', 
    href: '/admin/standar-pelayanan', 
    icon: <ClipboardListIcon className="h-5 w-5" />,
    roles: ['super_admin', 'admin'] // Admin only
  },
  { 
    label: 'Profil', 
    href: '/admin/profile-content', 
    icon: <Building01Icon className="h-5 w-5" />,
    roles: ['super_admin', 'admin'] // Admin only
  },
  { 
    label: 'Menu', 
    href: '/admin/menu', 
    icon: <Menu01Icon className="h-5 w-5" />,
    roles: ['super_admin', 'admin'] // Admin only
  },
  { 
    label: 'Media Library', 
    href: '/admin/media', 
    icon: <FolderOpenIcon className="h-5 w-5" />,
    roles: [] // All roles
  },
  { 
    label: 'Pengguna', 
    href: '/admin/users', 
    icon: <Users01Icon className="h-5 w-5" />,
    roles: ['super_admin'] // Super admin only
  },
  { 
    label: 'Activity Log', 
    href: '/admin/activity-logs', 
    icon: <Activity01Icon className="h-5 w-5" />,
    roles: ['super_admin', 'admin'] // Admin only
  },
]

// Helper function to check if user can access menu item
const canAccessMenuItem = (item: MenuItem, userRole?: string): boolean => {
  if (!item.roles || item.roles.length === 0) return true
  if (!userRole) return false
  return item.roles.includes(userRole)
}

// Helper function to check if menu item is super admin only
const isSuperAdminOnly = (item: MenuItem): boolean => {
  return item.roles?.length === 1 && item.roles[0] === 'super_admin'
}

const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggle,
  userRole,
}) => {
  const { url } = usePage()

  // Initialize collapsed state from localStorage on mount
  const [internalCollapsed, setInternalCollapsed] = useState<boolean>(() => 
    getInitialCollapsedState()
  )

  // Sync internal state with prop changes
  useEffect(() => {
    setInternalCollapsed(collapsed)
  }, [collapsed])

  // Save to localStorage whenever collapsed state changes
  useEffect(() => {
    saveCollapsedState(internalCollapsed)
  }, [internalCollapsed])

  const isActive = (href: string) => {
    return url.startsWith(href)
  }

  // Filter menu items based on user role
  const visibleMenuItems = useMemo(() => {
    return menuItems.filter(item => canAccessMenuItem(item, userRole))
  }, [userRole])

  return (
    <aside
      data-testid="admin-sidebar"
      style={{
        background: 'var(--admin-gradient-sidebar)',
        backdropFilter: 'blur(10px)',
      }}
      className={cn(
        "fixed left-0 top-0 z-40 h-screen transition-all duration-300",
        "border-r border-[var(--admin-glass-border)] shadow-[var(--admin-glass-shadow)]",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-[var(--admin-glass-border)] px-4">
        {!collapsed && (
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <span className="text-lg font-bold text-[var(--admin-primary-blue)]">Admin Panel</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            const newState = !internalCollapsed
            setInternalCollapsed(newState)
            onToggle()
          }}
          className="text-[var(--admin-primary-blue)] hover:bg-[var(--admin-glass-bg)]"
          style={{ transition: 'var(--admin-transition-normal)' }}
        >
          {internalCollapsed ? <ChevronRightIcon className="h-5 w-5" /> : <ChevronLeftIcon className="h-5 w-5" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {visibleMenuItems.map((item) => {
            const superAdminOnly = isSuperAdminOnly(item)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2",
                    "transition-[background-color,color,transform]",
                    isActive(item.href)
                      ? "bg-[var(--admin-primary-blue)] text-white shadow-md"
                      : "text-[var(--admin-primary-blue)] hover:bg-[var(--admin-glass-bg)] hover:scale-[1.02] hover:text-[var(--admin-accent-yellow)]",
                    internalCollapsed && "justify-center"
                  )}
                  style={{ transition: 'var(--admin-transition-normal)' }}
                  title={internalCollapsed ? item.label : undefined}
                >
                  {item.icon}
                  {!collapsed && (
                    <>
                      <span className="flex-1">{item.label}</span>
                      {/* Lock icon for super admin only menus */}
                      {superAdminOnly && (
                        <span title="Super Admin Only">
                          <LockIcon className="h-3.5 w-3.5 text-purple-400" />
                        </span>
                      )}
                    </>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
