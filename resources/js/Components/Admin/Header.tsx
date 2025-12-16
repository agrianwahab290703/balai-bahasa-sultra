import React from 'react'
import { Link, usePage, router } from '@inertiajs/react'
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
import { RoleBadge } from '@/Components/ui/role-badge'
import {
  Menu01Icon,
  Search01Icon,
  User01Icon,
  ChevronDownIcon,
  Settings01Icon,
  Logout01Icon,
} from 'hugeicons-react'
import { cn } from '@/lib/utils'

interface HeaderProps {
  onMenuClick: () => void
  onSearchOpen: () => void
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, onSearchOpen }) => {
  const { props } = usePage<PageProps>()
  const user = props.auth?.user
  const userRole = user?.role as 'super_admin' | 'admin' | undefined

  const handleLogout = () => {
    router.post('/admin/logout')
  }

  return (
    <header
      data-testid="admin-header"
      style={{
        background: 'var(--admin-gradient-button)',
        backdropFilter: 'blur(10px)',
      }}
      className={cn(
        "sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--admin-glass-border)] px-6 shadow-[var(--admin-glass-shadow)]",
      )}
    >
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuClick}
        className="lg:hidden text-[var(--admin-primary-blue)] hover:bg-[var(--admin-glass-bg)]"
        style={{ transition: 'var(--admin-transition-normal)' }}
      >
        <Menu01Icon className="h-5 w-5" />
      </Button>

      {/* Global Search Button */}
      <div className="flex-1 flex items-center justify-center px-4">
        <Button
          variant="outline"
          className="w-full max-w-md justify-start text-[var(--admin-primary-blue)] hover:bg-[var(--admin-glass-bg)] hover:text-[var(--admin-accent-yellow)]"
          onClick={onSearchOpen}
          style={{ transition: 'var(--admin-transition-normal)' }}
        >
          <Search01Icon className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Cari di semua konten...</span>
          <span className="sm:hidden">Cari...</span>
          <kbd className="ml-auto hidden sm:inline-flex pointer-events-none h-5 select-none items-center gap-1 rounded border bg-[var(--admin-glass-bg)] px-1.5 font-mono text-[10px] font-medium text-[var(--admin-primary-blue)]">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </div>

      {/* User dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="flex items-center gap-2 text-[var(--admin-primary-blue)] hover:bg-[var(--admin-glass-bg)] hover:text-[var(--admin-accent-yellow)]"
            style={{ transition: 'var(--admin-transition-normal)' }}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--admin-primary-blue)] text-white">
              <User01Icon className="h-4 w-4" />
            </div>
            <span className="hidden md:inline">{user?.name || 'Admin'}</span>
            {/* Role Badge next to user name */}
            {userRole && (
              <RoleBadge role={userRole} size="sm" showIcon={false} className="hidden md:inline-flex" />
            )}
            <ChevronDownIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-56 bg-[var(--admin-glass-bg)] backdrop-blur-md border-[var(--admin-glass-border)] shadow-[var(--admin-glass-shadow)]"
          style={{ transition: 'var(--admin-transition-normal)' }}
        >
          <DropdownMenuLabel>
            <div className="flex flex-col gap-1">
              <span className="text-[var(--admin-primary-blue)]">{user?.name || 'Admin'}</span>
              <span className="text-xs font-normal text-[var(--admin-primary-blue)]">
                {user?.email || 'admin@example.com'}
              </span>
              {/* Role Badge in dropdown profile */}
              {userRole && (
                <RoleBadge role={userRole} size="sm" className="mt-1 w-fit" />
              )}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="border-[var(--admin-glass-border)]" />
          <DropdownMenuItem asChild className="hover:bg-[var(--admin-glass-bg)] focus:bg-[var(--admin-glass-bg)]">
            <Link href="/admin/settings" className="flex items-center gap-2 cursor-pointer text-[var(--admin-primary-blue)] hover:text-[var(--admin-accent-yellow)]">
              <Settings01Icon className="h-4 w-4" />
              Pengaturan
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="border-[var(--admin-glass-border)]" />
          <DropdownMenuItem
            onClick={handleLogout}
            className="flex items-center gap-2 text-[var(--admin-error)] cursor-pointer hover:bg-[var(--admin-glass-bg)] focus:bg-[var(--admin-glass-bg)]"
          >
            <Logout01Icon className="h-4 w-4" />
            Keluar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}

export default Header
