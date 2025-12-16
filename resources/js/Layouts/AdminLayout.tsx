import React, { useState, useMemo, useCallback } from 'react'
import { Head, Link, usePage, router } from '@inertiajs/react'
import { cn } from '@/lib/utils'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/Components/ui/dialog'
import { ToastProvider } from '@/Components/ui/toast'
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Home,
  Newspaper,
  Image,
  FileText,
  HelpCircle,
  ClipboardList,
  Users,
  Building2,
  Menu as MenuIcon,
  Settings,
  LogOut,
  User,
  Activity,
  FolderOpen,
  Search,
  Loader2,
  Lock,
} from 'lucide-react'
import { RoleBadge } from '@/Components/ui/role-badge'
import { Sidebar, Header } from '@/Components/Admin'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface AdminLayoutProps {
  children: React.ReactNode
  title?: string
  breadcrumbs?: BreadcrumbItem[]
}

interface MenuItem {
  label: string
  href: string
  icon: React.ReactNode
  children?: MenuItem[]
  roles?: string[] // Roles that can access this menu item (empty = all roles)
}

interface PageProps {
  auth?: {
    user?: {
      name: string
      email: string
      role?: string
    }
  }
  flash?: {
    success?: string
    error?: string
  }
  [key: string]: unknown
}

// Search result types
interface SearchResult {
  id: number
  title: string
  type: string
  url: string
  description?: string
}

interface SearchResults {
  berita: SearchResult[]
  gallery: SearchResult[]
  ppid: SearchResult[]
  ssd: SearchResult[]
  standar_pelayanan: SearchResult[]
  profile_content: SearchResult[]
  menu: SearchResult[]
  users: SearchResult[]
}

// Menu items with role-based visibility
// Roles: super_admin, admin, editor
// Empty roles array = accessible by all roles
const menuItems: MenuItem[] = [
  { 
    label: 'Dashboard', 
    href: '/admin/dashboard', 
    icon: <Home className="h-5 w-5" />,
    roles: [] // All roles
  },
  { 
    label: 'Berita', 
    href: '/admin/berita', 
    icon: <Newspaper className="h-5 w-5" />,
    roles: [] // All roles
  },
  { 
    label: 'Galeri', 
    href: '/admin/gallery', 
    icon: <Image className="h-5 w-5" />,
    roles: [] // All roles
  },
  { 
    label: 'PPID', 
    href: '/admin/ppid', 
    icon: <FileText className="h-5 w-5" />,
    roles: ['super_admin', 'admin'] // Admin only
  },
  { 
    label: 'SSD (FAQ)', 
    href: '/admin/ssd', 
    icon: <HelpCircle className="h-5 w-5" />,
    roles: [] // All roles
  },
  { 
    label: 'Standar Pelayanan', 
    href: '/admin/standar-pelayanan', 
    icon: <ClipboardList className="h-5 w-5" />,
    roles: ['super_admin', 'admin'] // Admin only
  },
  { 
    label: 'Profil', 
    href: '/admin/profile-content', 
    icon: <Building2 className="h-5 w-5" />,
    roles: ['super_admin', 'admin'] // Admin only
  },
  { 
    label: 'Menu', 
    href: '/admin/menu', 
    icon: <MenuIcon className="h-5 w-5" />,
    roles: ['super_admin', 'admin'] // Admin only
  },
  { 
    label: 'Media Library', 
    href: '/admin/media', 
    icon: <FolderOpen className="h-5 w-5" />,
    roles: [] // All roles
  },
  { 
    label: 'Pengguna', 
    href: '/admin/users', 
    icon: <Users className="h-5 w-5" />,
    roles: ['super_admin'] // Super admin only
  },
  { 
    label: 'Activity Log', 
    href: '/admin/activity-logs', 
    icon: <Activity className="h-5 w-5" />,
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


const Sidebar: React.FC<{ collapsed: boolean; onToggle: () => void; userRole?: string }> = ({
  collapsed,
  onToggle,
  userRole,
}) => {
  const { url } = usePage()

  const isActive = (href: string) => {
    return url.startsWith(href)
  }

  // Filter menu items based on user role
  const visibleMenuItems = useMemo(() => {
    return menuItems.filter(item => canAccessMenuItem(item, userRole))
  }, [userRole])

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen transition-all duration-300",
        collapsed ? "w-[var(--admin-sidebar-width-collapsed)]" : "w-[var(--admin-sidebar-width)]"
      )}
      style={{
        background: 'var(--admin-gradient-sidebar)',
        backdropFilter: 'blur(var(--admin-glass-blur))',
        WebkitBackdropFilter: 'blur(var(--admin-glass-blur))',
        borderRadius: 'var(--admin-glass-radius)',
        boxShadow: 'var(--admin-glass-shadow)',
      }}
    >
      {/* Logo with glassmorphism effect */}
      <div className="flex h-[var(--admin-header-height)] items-center justify-between border-b border-white/10 px-4" style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}>
        {!collapsed && (
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <span className="text-lg font-bold text-white">Admin Panel</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="text-white hover:bg-white/20 transition-all duration-[var(--admin-transition-normal)]"
          style={{
            transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform var(--admin-sidebar-transition)',
          }}
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>

      {/* Navigation with glassmorphism */}
      <nav className="flex-1 overflow-y-auto p-4 scrollbar-hide">
        <ul className="space-y-1">
          {visibleMenuItems.map((item) => {
            const superAdminOnly = isSuperAdminOnly(item)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-[var(--admin-transition-normal)] relative overflow-hidden",
                    isActive(item.href)
                      ? "bg-white/20 text-white font-medium shadow-sm"
                      : "text-white/80 hover:bg-white/10 hover:text-white",
                    collapsed && "justify-center"
                  )}
                  title={collapsed ? item.label : undefined}
                  style={{
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  {/* Icon with hover effect */}
                  <div className="relative z-10">
                    {React.cloneElement(item.icon as React.ReactElement, {
                      className: "h-5 w-5 transition-all duration-[var(--admin-transition-fast)]"
                    })}
                  </div>
                  
                  {/* Text label - hidden when collapsed */}
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-white transition-all duration-[var(--admin-transition-fast)] hover:font-medium hover:underline hover:underline-offset-2">{item.label}</span>
                      {/* Lock icon for super admin only menus */}
                      {superAdminOnly && (
                        <span title="Super Admin Only">
                          <Lock className="h-3.5 w-3.5 text-purple-400" />
                        </span>
                      )}
                    </>
                  )}
                  
                  {/* Hover overlay effect */}
                  <div className="absolute inset-0 bg-[var(--admin-hover-overlay)] opacity-0 hover:opacity-100 transition-opacity duration-[var(--admin-transition-fast)]" style={{
                    pointerEvents: 'none',
                  }}></div>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}

const Header: React.FC<{ 
  onMenuClick: () => void
  onSearchOpen: () => void 
}> = ({ onMenuClick, onSearchOpen }) => {
  const { props } = usePage<PageProps>()
  const user = props.auth?.user
  const userRole = user?.role as 'super_admin' | 'admin' | undefined

  const handleLogout = () => {
    router.post('/admin/logout')
  }

  return (
    <header className="sticky top-0 z-30 flex h-[var(--admin-header-height)] items-center justify-between border-b px-6 shadow-sm" 
      style={{
        background: 'var(--admin-gradient-header)',
        backdropFilter: 'blur(var(--admin-header-glass-blur))',
        WebkitBackdropFilter: 'blur(var(--admin-header-glass-blur))',
        borderRadius: 'var(--admin-glass-radius)',
      }}>
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuClick}
        className="lg:hidden text-tw-batik-blue hover:bg-white/20"
      >
        <MenuIcon className="h-5 w-5" />
      </Button>

      {/* Global Search Button with glassmorphism */}
      <div className="flex-1 flex items-center justify-center px-4">
        <Button
          variant="outline"
          className="w-full max-w-md justify-start text-tw-black-text border-tw-batik-blue/20 hover:border-tw-batik-blue/40"
          onClick={onSearchOpen}
          style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
          }}
        >
          <Search className="h-4 w-4 mr-2 text-tw-batik-blue" />
          <span className="hidden sm:inline text-tw-black-text">Cari di semua konten...</span>
          <span className="sm:hidden text-tw-black-text">Cari...</span>
          <kbd className="ml-auto hidden sm:inline-flex pointer-events-none h-5 select-none items-center gap-1 rounded border bg-white/50 px-1.5 font-mono text-[10px] font-medium text-tw-batik-blue">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 text-tw-black-text hover:bg-white/20 transition-all duration-[var(--admin-transition-normal)]">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-tw-batik-blue text-white shadow-sm" 
              style={{
                border: '2px solid var(--admin-yellow-accent)',
              }}>
              <User className="h-4 w-4" />
            </div>
            <span className="hidden md:inline font-medium text-tw-black-text">{user?.name || 'Admin'}</span>
            {/* Role Badge next to user name */}
            {userRole && (
              <RoleBadge role={userRole} size="sm" showIcon={false} className="hidden md:inline-flex" />
            )}
            <ChevronDown className="h-4 w-4 text-tw-black-text" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56" 
          style={{
            animation: 'fade-in var(--admin-dropdown-transition)',
          }}>
          <DropdownMenuLabel>
            <div className="flex flex-col gap-1">
              <span className="font-medium text-tw-black-text">{user?.name || 'Admin'}</span>
              <span className="text-xs font-normal text-muted-foreground">
                {user?.email || 'admin@example.com'}
              </span>
              {/* Role Badge in dropdown profile */}
              {userRole && (
                <RoleBadge role={userRole} size="sm" className="mt-1 w-fit" />
              )}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/admin/settings" className="flex items-center gap-2 cursor-pointer hover:bg-[var(--admin-hover-overlay)] transition-colors duration-[var(--admin-transition-fast)]">
              <Settings className="h-4 w-4 text-tw-batik-blue" />
              <span className="text-tw-black-text">Pengaturan</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 cursor-pointer hover:bg-red-50 transition-colors duration-[var(--admin-transition-fast)]"
          >
            <LogOut className="h-4 w-4" />
            Keluar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}


const Breadcrumbs: React.FC<{ items?: BreadcrumbItem[] }> = ({ items }) => {
  if (!items || items.length === 0) return null

  return (
    <nav className="mb-4" aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 text-sm text-muted-foreground">
        <li>
          <Link href="/admin/dashboard" className="hover:text-foreground transition-colors">
            <Home className="h-4 w-4" />
          </Link>
        </li>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <li className="text-muted-foreground/50">/</li>
            <li>
              {item.href ? (
                <Link href={item.href} className="hover:text-foreground transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-foreground font-medium">{item.label}</span>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  )
}

// Entity type labels for search results
const entityTypeLabels: Record<string, { label: string; icon: React.ReactNode }> = {
  berita: { label: 'Berita', icon: <Newspaper className="h-4 w-4" /> },
  gallery: { label: 'Galeri', icon: <Image className="h-4 w-4" /> },
  ppid: { label: 'PPID', icon: <FileText className="h-4 w-4" /> },
  ssd: { label: 'SSD (FAQ)', icon: <HelpCircle className="h-4 w-4" /> },
  standar_pelayanan: { label: 'Standar Pelayanan', icon: <ClipboardList className="h-4 w-4" /> },
  profile_content: { label: 'Profil', icon: <Building2 className="h-4 w-4" /> },
  menu: { label: 'Menu', icon: <MenuIcon className="h-4 w-4" /> },
  users: { label: 'Pengguna', icon: <Users className="h-4 w-4" /> },
}

// Global Search Dialog Component
const GlobalSearchDialog: React.FC<{
  open: boolean
  onOpenChange: (open: boolean) => void
}> = ({ open, onOpenChange }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResults | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Debounced search
  const performSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults(null)
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/admin/search?q=${encodeURIComponent(searchQuery)}`)
      if (response.ok) {
        const data = await response.json()
        setResults(data)
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query)
    }, 300)
    return () => clearTimeout(timer)
  }, [query, performSearch])

  // Reset on close
  React.useEffect(() => {
    if (!open) {
      setQuery('')
      setResults(null)
    }
  }, [open])

  const handleResultClick = (url: string) => {
    onOpenChange(false)
    router.visit(url)
  }

  const hasResults = results && Object.values(results).some(arr => arr.length > 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0">
        <DialogHeader className="px-4 pt-4 pb-0">
          <DialogTitle className="sr-only">Pencarian Global</DialogTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari berita, galeri, dokumen, pengguna..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-4"
              autoFocus
            />
          </div>
        </DialogHeader>
        
        <div className="max-h-[400px] overflow-y-auto p-4">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {!isLoading && query.length < 2 && (
            <div className="text-center py-8 text-muted-foreground">
              Ketik minimal 2 karakter untuk mencari
            </div>
          )}

          {!isLoading && query.length >= 2 && !hasResults && (
            <div className="text-center py-8 text-muted-foreground">
              Tidak ada hasil untuk "{query}"
            </div>
          )}

          {!isLoading && hasResults && (
            <div className="space-y-4">
              {Object.entries(results!).map(([type, items]) => {
                if (items.length === 0) return null
                const typeInfo = entityTypeLabels[type] || { label: type, icon: null }
                
                return (
                  <div key={type}>
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                      {typeInfo.icon}
                      <span>{typeInfo.label}</span>
                      <span className="text-xs bg-muted px-1.5 py-0.5 rounded">
                        {items.length}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {items.map((item) => (
                        <button
                          key={`${type}-${item.id}`}
                          onClick={() => handleResultClick(item.url)}
                          className="w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors"
                        >
                          <div className="font-medium truncate">{item.title}</div>
                          {item.description && (
                            <div className="text-sm text-muted-foreground truncate">
                              {item.description}
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  title = 'Admin Panel',
  breadcrumbs,
}) => {
  const { props } = usePage<PageProps>()
  const userRole = props.auth?.user?.role
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  // Keyboard shortcut for search (Cmd/Ctrl + K)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-100">
        <Head>
          <title>{title} - Balai Bahasa Sultra</title>
        </Head>

        {/* Sidebar with role-based menu visibility */}
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          userRole={userRole}
        />

        {/* Mobile overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Main content */}
        <div
          className={cn(
            "transition-all duration-300",
            sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
          )}
        >
          <Header 
            onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            onSearchOpen={() => setSearchOpen(true)}
          />

          <main className="p-6">
            <Breadcrumbs items={breadcrumbs} />
            {children}
          </main>
        </div>

        {/* Global Search Dialog */}
        <GlobalSearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      </div>
    </ToastProvider>
  )
}

export default AdminLayout
