# Admin Panel Redesign Implementation Plan

> **For Droid:** REQUIRED SUB-SKILL: Use `executing-plans` skill to implement this plan task-by-task.

**Goal:** Implement complete visual redesign of all admin pages with blue-white-yellow color scheme, gradients, glassmorphism effects, and consistent component styling.

**Architecture:** Create a shared AdminLayout component with sidebar navigation, implement design tokens as CSS custom properties, update all existing admin pages to use the new layout and styling, ensure responsive behavior with sidebar collapse on smaller screens.

**Tech Stack:** React 19, TypeScript, Tailwind CSS 4.0, Shadcn UI components, Hugeicons React, Inertia.js 2.x, Vite 7.x

---

## Project Context

### Current Admin Structure
- **Layout:** Currently uses basic layout in `resources/js/Layouts/AdminLayout.tsx`
- **Pages:** 13 admin pages across 12 feature directories + Dashboard.tsx
- **Styling:** Basic Tailwind without consistent design system

### Design System Requirements
- **Colors:** Primary blue (#2563eb), white (#ffffff), accent yellow (#FFD700)
- **Gradients:** Multi-color stops (blue → white → yellow)
- **Effects:** Glassmorphism (backdrop blur), hover animations
- **Components:** Shadcn UI with custom variants, Hugeicons for icons

---

### Task 1: Create Admin Design System Tokens

**Files:**
- Create: `resources/js/styles/admin-design-tokens.css`
- Modify: `resources/css/app.css`
- Test: No tests needed (CSS file)

#### Step 1: Create design tokens CSS file

```css
/* resources/js/styles/admin-design-tokens.css */

:root {
  /* Primary Colors */
  --admin-primary-blue: #2563eb;
  --admin-accent-yellow: #FFD700;
  --admin-white: #ffffff;
  
  /* Semantic Colors */
  --admin-success: #10b981;
  --admin-warning: #f59e0b;
  --admin-error: #ef4444;
  --admin-info: #3b82f6;
  
  /* Gradients */
  --admin-gradient-sidebar: linear-gradient(180deg, #2563eb 0%, #3b82f6 25%, #ffffff 50%, #fef3c7 75%, #FFD700 100%);
  --admin-gradient-button: linear-gradient(90deg, #2563eb 0%, #ffffff 50%, #FFD700 100%);
  --admin-gradient-card: linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 215, 0, 0.1) 100%);
  
  /* Glassmorphism */
  --admin-glass-bg: rgba(255, 255, 255, 0.8);
  --admin-glass-border: rgba(37, 99, 235, 0.1);
  --admin-glass-shadow: 0 8px 32px rgba(37, 99, 235, 0.1);
  
  /* Animation */
  --admin-transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --admin-transition-normal: 300ms cubic-bezier(0.4, 0, 0.2, 1);
  --admin-transition-slow: 500ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

#### Step 2: Import design tokens into main CSS

Edit `resources/css/app.css` to add this line at the top:

```css
/* resources/css/app.css */
@import '../js/styles/admin-design-tokens.css';
```

#### Step 3: Verify CSS compilation

Run: `npm run build`
Expected: Successful compilation without errors
Check: No CSS errors in output

#### Step 4: Commit

```bash
git add resources/js/styles/admin-design-tokens.css resources/css/app.css
git commit -m "feat: add admin design system tokens"
```

---

### Task 2: Create Enhanced AdminLayout Component

**Files:**
- Modify: `resources/js/Layouts/AdminLayout.tsx`
- Create: `resources/js/Components/Admin/Sidebar.tsx`
- Create: `resources/js/Components/Admin/Header.tsx`
- Test: `resources/js/Layouts/AdminLayout.test.tsx`

#### Step 1: Write failing test for AdminLayout

```tsx
// resources/js/Layouts/AdminLayout.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import AdminLayout from './AdminLayout'

describe('AdminLayout', () => {
  it('renders sidebar and header with gradient styling', () => {
    render(
      <AdminLayout>
        <div>Test Content</div>
      </AdminLayout>
    )
    
    expect(screen.getByTestId('admin-sidebar')).toBeInTheDocument()
    expect(screen.getByTestId('admin-header')).toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })
  
  it('applies glassmorphism styling to sidebar', () => {
    render(
      <AdminLayout>
        <div>Test</div>
      </AdminLayout>
    )
    
    const sidebar = screen.getByTestId('admin-sidebar')
    expect(sidebar).toHaveClass('backdrop-blur-sm')
    expect(sidebar).toHaveClass('bg-white/80')
  })
})
```

#### Step 2: Run test to verify it fails

Run: `npm test resources/js/Layouts/AdminLayout.test.tsx`
Expected: FAIL with "Cannot find module" or test failures

#### Step 3: Create Sidebar component

```tsx
// resources/js/Components/Admin/Sidebar.tsx
import { useState } from 'react'
import { Link } from '@inertiajs/react'
import { cn } from '@/lib/utils'
import {
  Home01,
  LayoutGrid01,
  Users01,
  Settings01,
  File01,
  Image01,
  Video01,
  Document01,
  ChevronRight,
  ChevronDown,
} from 'hugeicons-react'

interface SidebarProps {
  collapsed: boolean
  onToggleCollapse: () => void
}

const navigationItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: Home01 },
  { name: 'Berita', href: '/admin/berita', icon: File01 },
  { name: 'Pengumuman', href: '/admin/pengumuman', icon: Document01 },
  { name: 'Gallery', href: '/admin/gallery', icon: Image01 },
  { name: 'Media', href: '/admin/media', icon: Video01 },
  { name: 'Users', href: '/admin/users', icon: Users01 },
  { name: 'Activity Log', href: '/admin/activity-log', icon: LayoutGrid01 },
  { name: 'Settings', href: '/admin/settings', icon: Settings01 },
]

export default function Sidebar({ collapsed, onToggleCollapse }: SidebarProps) {
  const [activeItem, setActiveItem] = useState('/admin/dashboard')

  return (
    <aside
      data-testid="admin-sidebar"
      className={cn(
        'fixed left-0 top-0 h-full z-40 transition-all duration-300 ease-in-out',
        'bg-gradient-to-b from-blue-600 via-white to-yellow-100',
        'backdrop-blur-sm bg-white/80 border-r border-gray-200/50',
        'shadow-lg shadow-blue-500/5',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Collapse Toggle */}
      <button
        onClick={onToggleCollapse}
        className="absolute -right-3 top-6 bg-white border border-gray-300 rounded-full p-1 shadow-md hover:shadow-lg hover:scale-105 transition-all"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4 text-blue-600" />
        ) : (
          <ChevronDown className="w-4 h-4 text-blue-600" />
        )}
      </button>

      {/* Logo */}
      <div className="p-4 border-b border-gray-200/50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-yellow-500 rounded-lg" />
          {!collapsed && (
            <span className="font-bold text-blue-600">Admin Panel</span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = activeItem === item.href
          
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setActiveItem(item.href)}
              className={cn(
                'flex items-center px-3 py-2 rounded-lg transition-all duration-200',
                'hover:bg-blue-50 hover:translate-x-1',
                isActive
                  ? 'bg-gradient-to-r from-blue-500/10 to-yellow-500/10 text-blue-600 font-semibold border-l-4 border-yellow-500'
                  : 'text-gray-700 hover:text-blue-600'
              )}
            >
              <Icon className={cn('w-5 h-5', isActive ? 'text-yellow-500' : 'text-gray-500')} />
              {!collapsed && (
                <span className="ml-3">{item.name}</span>
              )}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
```

#### Step 4: Create Header component

```tsx
// resources/js/Components/Admin/Header.tsx
import { useState } from 'react'
import { User01, Bell01, Search01, Logout01 } from 'hugeicons-react'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'

interface HeaderProps {
  sidebarCollapsed: boolean
}

export default function Header({ sidebarCollapsed }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header
      data-testid="admin-header"
      className={cn(
        'sticky top-0 z-30 transition-all duration-300',
        'bg-white/90 backdrop-blur-sm border-b border-gray-200/50',
        'shadow-sm shadow-blue-500/5',
        sidebarCollapsed ? 'ml-16' : 'ml-64'
      )}
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Search */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search01 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search admin panel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-50/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell01 className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 hover:bg-blue-50">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-yellow-500 rounded-full flex items-center justify-center">
                  <User01 className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-gray-500">Super Admin</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Logout01 className="mr-2 w-4 h-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
```

#### Step 5: Update AdminLayout component

```tsx
// resources/js/Layouts/AdminLayout.tsx
import { useState } from 'react'
import { cn } from '@/lib/utils'
import Sidebar from '@/Components/Admin/Sidebar'
import Header from '@/Components/Admin/Header'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50">
      <Sidebar collapsed={sidebarCollapsed} onToggleCollapse={toggleSidebar} />
      <Header sidebarCollapsed={sidebarCollapsed} />
      
      <main
        className={cn(
          'min-h-screen transition-all duration-300 ease-in-out pt-16',
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        )}
      >
        <div className="p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
```

#### Step 6: Run test to verify it passes

Run: `npm test resources/js/Layouts/AdminLayout.test.tsx`
Expected: PASS with all tests green

#### Step 7: Commit

```bash
git add resources/js/Layouts/AdminLayout.tsx resources/js/Layouts/AdminLayout.test.tsx resources/js/Components/Admin/
git commit -m "feat: implement enhanced AdminLayout with sidebar and header"
```

---

### Task 3: Create Enhanced Card Component

**Files:**
- Create: `resources/js/Components/Admin/Card.tsx`
- Test: `resources/js/Components/Admin/Card.test.tsx`

#### Step 1: Write failing test for Admin Card

```tsx
// resources/js/Components/Admin/Card.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import AdminCard from './Card'

describe('AdminCard', () => {
  it('renders card with glassmorphism styling', () => {
    render(<AdminCard>Test Content</AdminCard>)
    
    const card = screen.getByTestId('admin-card')
    expect(card).toHaveClass('backdrop-blur-sm')
    expect(card).toHaveClass('bg-white/80')
    expect(card).toHaveClass('rounded-xl')
  })
  
  it('applies hover effects', () => {
    render(<AdminCard>Test</AdminCard>)
    
    const card = screen.getByTestId('admin-card')
    expect(card).toHaveClass('hover:shadow-xl')
    expect(card).toHaveClass('hover:translate-y-[-2px]')
    expect(card).toHaveClass('transition-all')
  })
})
```

#### Step 2: Run test to verify it fails

Run: `npm test resources/js/Components/Admin/Card.test.tsx`
Expected: FAIL with "Cannot find module"

#### Step 3: Create Admin Card component

```tsx
// resources/js/Components/Admin/Card.tsx
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface AdminCardProps {
  children: ReactNode
  className?: string
  hoverEffect?: boolean
  gradient?: boolean
}

export default function AdminCard({
  children,
  className,
  hoverEffect = true,
  gradient = false,
}: AdminCardProps) {
  return (
    <div
      data-testid="admin-card"
      className={cn(
        'backdrop-blur-sm bg-white/80 border border-gray-200/50 rounded-xl',
        'shadow-lg shadow-blue-500/5 p-6',
        gradient && 'bg-gradient-to-br from-blue-50/30 via-white to-yellow-50/30',
        hoverEffect && 'hover:shadow-xl hover:shadow-blue-500/10 hover:translate-y-[-2px]',
        'transition-all duration-300 ease-in-out',
        className
      )}
    >
      {children}
    </div>
  )
}

// Card Header Component
interface CardHeaderProps {
  children: ReactNode
  className?: string
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn('mb-4 pb-4 border-b border-gray-200/50', className)}>
      <div className="flex items-center justify-between">
        {children}
      </div>
    </div>
  )
}

// Card Title Component
interface CardTitleProps {
  children: ReactNode
  className?: string
}

export function CardTitle({ children, className }: CardTitleProps) {
  return (
    <h3 className={cn('text-lg font-semibold text-gray-900', className)}>
      {children}
    </h3>
  )
}

// Card Content Component
interface CardContentProps {
  children: ReactNode
  className?: string
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={cn('text-gray-700', className)}>
      {children}
    </div>
  )
}

// Card Footer Component
interface CardFooterProps {
  children: ReactNode
  className?: string
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={cn('mt-4 pt-4 border-t border-gray-200/50', className)}>
      {children}
    </div>
  )
}
```

#### Step 4: Run test to verify it passes

Run: `npm test resources/js/Components/Admin/Card.test.tsx`
Expected: PASS with all tests green

#### Step 5: Commit

```bash
git add resources/js/Components/Admin/Card.tsx resources/js/Components/Admin/Card.test.tsx
git commit -m "feat: create enhanced AdminCard with glassmorphism effects"
```

---

### Task 4: Update Dashboard Page with New Design

**Files:**
- Modify: `resources/js/Pages/Admin/Dashboard.tsx`
- Test: `resources/js/Pages/Admin/Dashboard.test.tsx`

#### Step 1: Write failing test for Dashboard

```tsx
// resources/js/Pages/Admin/Dashboard.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Dashboard from './Dashboard'

describe('Dashboard', () => {
  it('renders dashboard with enhanced card components', () => {
    render(<Dashboard />)
    
    expect(screen.getByText('Dashboard Overview')).toBeInTheDocument()
    expect(screen.getAllByTestId('admin-card')).toHaveLength(4)
    expect(screen.getByText('Quick Stats')).toBeInTheDocument()
    expect(screen.getByText('Recent Activity')).toBeInTheDocument()
  })
})
```

#### Step 2: Run test to verify it fails

Run: `npm test resources/js/Pages/Admin/Dashboard.test.tsx`
Expected: FAIL (test may not exist or fail)

#### Step 3: Update Dashboard component

```tsx
// resources/js/Pages/Admin/Dashboard.tsx
import AdminLayout from '@/Layouts/AdminLayout'
import AdminCard, { CardHeader, CardTitle, CardContent, CardFooter } from '@/Components/Admin/Card'
import { Button } from '@/Components/ui/button'
import { Progress } from '@/Components/ui/progress'
import {
  TrendingUp01,
  Users01,
  File01,
  Eye01,
  Activity01,
  Calendar01,
  CheckCircle,
  AlertCircle,
} from 'hugeicons-react'

export default function Dashboard() {
  const stats = [
    { label: 'Total Users', value: '1,254', change: '+12%', icon: Users01, color: 'blue' },
    { label: 'Total Posts', value: '342', change: '+5%', icon: File01, color: 'green' },
    { label: 'Page Views', value: '8.9k', change: '+23%', icon: Eye01, color: 'yellow' },
    { label: 'Engagement', value: '78%', change: '+8%', icon: Activity01, color: 'purple' },
  ]

  const recentActivity = [
    { user: 'Admin User', action: 'created new post', time: '2 minutes ago', status: 'success' },
    { user: 'Editor', action: 'updated gallery', time: '15 minutes ago', status: 'info' },
    { user: 'Moderator', action: 'deleted comment', time: '1 hour ago', status: 'warning' },
    { user: 'Admin User', action: 'changed settings', time: '2 hours ago', status: 'success' },
  ]

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your site today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <AdminCard key={index} hoverEffect gradient>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp01 className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">{stat.change}</span>
                    <span className="text-sm text-gray-500 ml-2">from last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </AdminCard>
          )
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <AdminCard>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full justify-start bg-gradient-to-r from-blue-600 to-yellow-500 hover:from-blue-700 hover:to-yellow-600">
                <File01 className="mr-2 w-4 h-4" />
                Create New Post
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users01 className="mr-2 w-4 h-4" />
                Manage Users
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar01 className="mr-2 w-4 h-4" />
                Schedule Content
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Activity01 className="mr-2 w-4 h-4" />
                View Analytics
              </Button>
            </div>
          </CardContent>
        </AdminCard>

        {/* Recent Activity */}
        <AdminCard className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <Button variant="ghost" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50/50 rounded-lg transition-colors">
                  <div className="flex items-center">
                    {activity.status === 'success' ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    ) : activity.status === 'warning' ? (
                      <AlertCircle className="w-5 h-5 text-yellow-500 mr-3" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-blue-500 mr-3" />
                    )}
                    <div>
                      <p className="font-medium">{activity.user}</p>
                      <p className="text-sm text-gray-600">{activity.action}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </AdminCard>

        {/* Progress Section */}
        <AdminCard className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Site Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Page Load Speed</span>
                  <span className="text-sm text-gray-600">1.8s / 2.5s target</span>
                </div>
                <Progress value={72} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Uptime</span>
                  <span className="text-sm text-gray-600">99.8% / 99.9% target</span>
                </div>
                <Progress value={99.8} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Storage Usage</span>
                  <span className="text-sm text-gray-600">4.2GB / 10GB</span>
                </div>
                <Progress value={42} className="h-2" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View Detailed Reports</Button>
          </CardFooter>
        </AdminCard>
      </div>
    </AdminLayout>
  )
}
```

#### Step 4: Run test to verify it passes

Run: `npm test resources/js/Pages/Admin/Dashboard.test.tsx`
Expected: PASS with all tests green

#### Step 5: Commit

```bash
git add resources/js/Pages/Admin/Dashboard.tsx resources/js/Pages/Admin/Dashboard.test.tsx
git commit -m "feat: update Dashboard page with new design system"
```

---

### Task 5: Update All Admin Pages to Use New Layout

**Files:** (All admin pages - update each directory)
- Modify: `resources/js/Pages/Admin/ActivityLog/**/*.tsx`
- Modify: `resources/js/Pages/Admin/Berita/**/*.tsx`
- Modify: `resources/js/Pages/Admin/Gallery/**/*.tsx`
- Modify: `resources/js/Pages/Admin/Media/**/*.tsx`
- Modify: `resources/js/Pages/Admin/Menu/**/*.tsx`
- Modify: `resources/js/Pages/Admin/Pengumuman/**/*.tsx`
- Modify: `resources/js/Pages/Admin/Ppid/**/*.tsx`
- Modify: `resources/js/Pages/Admin/ProfileContent/**/*.tsx`
- Modify: `resources/js/Pages/Admin/Ssd/**/*.tsx`
- Modify: `resources/js/Pages/Admin/StandarPelayanan/**/*.tsx`
- Modify: `resources/js/Pages/Admin/Users/**/*.tsx`

**Note:** Each page update follows the same pattern:

#### Pattern for updating admin pages:

1. **Wrap page with AdminLayout**
2. **Replace existing container classes with new design**
3. **Use AdminCard components where appropriate**
4. **Apply new color scheme and hover effects**

**Example for Berita/Index.tsx:**

```tsx
// Before:
export default function BeritaIndex() {
  return (
    <div className="container mx-auto px-4">
      {/* existing content */}
    </div>
  )
}

// After:
import AdminLayout from '@/Layouts/AdminLayout'
import AdminCard from '@/Components/Admin/Card'

export default function BeritaIndex() {
  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <AdminCard>
          {/* existing content with updated styling */}
        </AdminCard>
      </div>
    </AdminLayout>
  )
}
```

#### Step 1: Update ActivityLog pages

Check directory structure and update all files in `ActivityLog/` directory.

#### Step 2: Update Berita pages

Update all files in `Berita/` directory.

#### Step 3: Update Gallery pages

Update all files in `Gallery/` directory.

#### Step 4: Update Media pages

Update all files in `Media/` directory.

#### Step 5: Update Menu pages

Update all files in `Menu/` directory.

#### Step 6: Update Pengumuman pages

Update all files in `Pengumuman/` directory.

#### Step 7: Update Ppid pages

Update all files in `Ppid/` directory.

#### Step 8: Update ProfileContent pages

Update all files in `ProfileContent/` directory.

#### Step 9: Update Ssd pages

Update all files in `Ssd/` directory.

#### Step 10: Update StandarPelayanan pages

Update all files in `StandarPelayanan/` directory.

#### Step 11: Update Users pages

Update all files in `Users/` directory.

#### Step 12: Run tests to verify all pages work

Run: `npm test`
Expected: All existing tests pass

#### Step 13: Commit

```bash
git add resources/js/Pages/Admin/
git commit -m "feat: update all admin pages to use new layout and design system"
```

---

### Task 6: Add Hover Effects and Transitions

**Files:**
- Create: `resources/js/styles/admin-animations.css`
- Modify: `resources/css/app.css`
- Modify: Various component files to add animation classes

#### Step 1: Create animations CSS

```css
/* resources/js/styles/admin-animations.css */

/* Button hover effects */
.admin-button-hover {
  transition: all var(--admin-transition-normal);
}

.admin-button-hover:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.3);
}

/* Card lift effect */
.admin-card-lift {
  transition: all var(--admin-transition-normal);
}

.admin-card-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px -10px rgba(37, 99, 235, 0.15);
}

/* Icon spin effect */
.admin-icon-spin {
  transition: transform var(--admin-transition-normal);
}

.admin-icon-spin:hover {
  transform: rotate(15deg);
}

/* Gradient text animation */
.admin-gradient-text {
  background: linear-gradient(90deg, #2563eb, #ffffff, #FFD700);
  background-size: 200% auto;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient-text 3s ease-in-out infinite;
}

@keyframes gradient-text {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* Pulse animation for notifications */
@keyframes admin-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.admin-pulse {
  animation: admin-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Slide in animations */
.admin-slide-in-right {
  animation: slideInRight 0.3s ease-out;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.admin-slide-in-left {
  animation: slideInLeft 0.3s ease-out;
}

@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```

#### Step 2: Import animations CSS

Add to `resources/css/app.css`:

```css
@import '../js/styles/admin-animations.css';
```

#### Step 3: Update Button component to use hover effects

Check if shadcn Button component needs enhancement or create custom variant.

#### Step 4: Verify animations work

Run dev server and test hover effects.

#### Step 5: Commit

```bash
git add resources/js/styles/admin-animations.css resources/css/app.css
git commit -m "feat: add hover effects and animations for admin panel"
```

---

### Task 7: Responsive Design Testing

**Files:**
- Test: Manual testing with browser dev tools
- Update: Any responsive breakpoint issues found

#### Step 1: Test on mobile breakpoint (640px)

Check sidebar collapse behavior, table scrolling, form layouts.

#### Step 2: Test on tablet breakpoint (768px)

Verify grid layouts, card stacking, navigation.

#### Step 3: Test on desktop breakpoints (1024px, 1280px, 1536px)

Ensure all components scale properly.

#### Step 4: Fix any responsive issues found

Update component classes with appropriate responsive prefixes.

#### Step 5: Commit

```bash
git add resources/js/Components/Admin/ resources/js/Pages/Admin/
git commit -m "fix: responsive design improvements for admin panel"
```

---

### Task 8: Final Verification and Testing

**Files:**
- Run: All tests
- Check: Browser compatibility
- Verify: Accessibility compliance

#### Step 1: Run all frontend tests

```bash
npm test
```
Expected: All tests pass

#### Step 2: Build production bundle

```bash
npm run build
```
Expected: Successful build without errors

#### Step 3: Start dev server and manually test

```bash
npm run dev
```
Test: Navigate through all admin pages, check hover effects, sidebar collapse, etc.

#### Step 4: Accessibility audit

Check: Keyboard navigation, screen reader compatibility, color contrast.

#### Step 5: Performance check

Check: Bundle size, loading times, animation performance (60fps).

#### Step 6: Commit final changes

```bash
git add .
git commit -m "chore: final verification and testing for admin redesign"
```

---

## Execution Notes

1. **TDD Approach:** Each task follows RED-GREEN-REFACTOR cycle
2. **Frequent Commits:** Commit after each successful task
3. **Component Reuse:** Use existing shadcn UI components with custom styling
4. **Icon Selection:** Search hugeicons for appropriate icons before implementation
5. **Responsive Design:** Test on multiple screen sizes at each stage
6. **Accessibility:** Ensure keyboard navigation and screen reader compatibility

## Estimated Timeline
- Task 1: 15 minutes
- Task 2: 30 minutes  
- Task 3: 20 minutes
- Task 4: 25 minutes
- Task 5: 60 minutes (spread across pages)
- Task 6: 20 minutes
- Task 7: 30 minutes
- Task 8: 25 minutes
**Total:** ~3.5 hours

---

*Plan created: 2025-12-15*
*Design reference: docs/plans/2025-12-15-admin-redesign-design.md*
