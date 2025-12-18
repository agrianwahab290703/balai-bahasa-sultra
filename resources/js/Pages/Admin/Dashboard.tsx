import React, { useMemo } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import GlassCard from '@/Components/Admin/GlassCard'
import GradientButton from '@/Components/Admin/GradientButton'
import {
  Menu as MenuIcon,
  FolderOpen,
  Eye,
  Download,
  Plus,
  Activity,
  TrendingUp,
  Clock,
  AlertCircle,
  Bell,
} from 'lucide-react'
import {
  File01Icon,
  Image01Icon,
  ViewIcon as EyeIcon,
  UserIcon as User01Icon,
  PlusSignCircleIcon as PlusCircleIcon,
  ImageAdd01Icon as ImageEdit01Icon,
  FileAddIcon as FileEdit01Icon,
  Settings01Icon,
} from 'hugeicons-react'
import {
  LontarIcon,
  WayangIcon,
  BatikIcon,
  PrasastiIcon,
  CanangSariIcon,
  RumahAdatIcon,
  CepatMenulisIcon,
  GotongRoyongIcon
} from '@/Components/Admin/CulturalIcons'

interface Statistics {
  // Berita
  total_berita: number
  published_berita: number
  draft_berita: number
  total_berita_views: number
  // Gallery
  total_gallery: number
  active_gallery: number
  featured_gallery: number
  // PPID
  total_ppid_documents: number
  active_ppid_documents: number
  total_ppid_downloads: number
  // SSD
  total_ssd: number
  active_ssd: number
  // Standar Pelayanan
  total_standar_pelayanan: number
  active_standar_pelayanan: number
  total_standar_downloads: number
  // Profile Content
  total_profile_content: number
  active_profile_content: number
  // Menu
  total_menus: number
  visible_menus: number
  // Media
  total_media: number
  total_images: number
  total_documents: number
  // Admin Users
  total_admin_users: number
  active_admin_users: number
  // Pengumuman
  total_pengumuman: number
  active_pengumuman: number
}

interface RecentActivity {
  id: number
  action: string
  loggable_type: string
  loggable_id: number
  user_name: string
  created_at: string
  time_ago: string
}

interface PopularItem {
  id: number
  title: string
  views?: number
  downloads?: number
  type: string
  created_at: string
}

interface PopularContent {
  berita: PopularItem[]
  ppid: PopularItem[]
  standar_pelayanan: PopularItem[]
}

interface ViewsOverTime {
  labels: string[]
  berita: number[]
  activities: number[]
}

interface DashboardProps {
  statistics?: Statistics | null
  recentActivities?: RecentActivity[] | null
  popularContent?: PopularContent | null
  viewsOverTime?: ViewsOverTime | null
}

// Default statistics values for fallback
const defaultStatistics: Statistics = {
  total_berita: 0,
  published_berita: 0,
  draft_berita: 0,
  total_berita_views: 0,
  total_gallery: 0,
  active_gallery: 0,
  featured_gallery: 0,
  total_ppid_documents: 0,
  active_ppid_documents: 0,
  total_ppid_downloads: 0,
  total_ssd: 0,
  active_ssd: 0,
  total_standar_pelayanan: 0,
  active_standar_pelayanan: 0,
  total_standar_downloads: 0,
  total_profile_content: 0,
  active_profile_content: 0,
  total_menus: 0,
  visible_menus: 0,
  total_media: 0,
  total_images: 0,
  total_documents: 0,
  total_admin_users: 0,
  active_admin_users: 0,
  total_pengumuman: 0,
  active_pengumuman: 0,
}

// Helper function to safely get a numeric value
const safeNumber = (value: number | undefined | null): number => {
  return typeof value === 'number' && !isNaN(value) ? value : 0
}

// Simple bar chart component (no external dependencies)
const SimpleBarChart: React.FC<{
  data: number[]
  labels: string[]
  color?: string
  maxHeight?: number
}> = ({ data, labels, color = 'bg-blue-500', maxHeight = 100 }) => {
  const maxValue = Math.max(...data, 1)
  
  return (
    <div className="flex items-end gap-1 h-[100px]">
      {data.map((value, index) => {
        const height = (value / maxValue) * maxHeight
        return (
          <div key={index} className="flex-1 flex flex-col items-center gap-1">
            <div
              className={`w-full ${color} rounded-t transition-all duration-300 hover:opacity-80`}
              style={{ height: `${Math.max(height, 2)}px` }}
              title={`${labels[index]}: ${value}`}
            />
          </div>
        )
      })}
    </div>
  )
}


// Statistics card component with cultural styling
const StatCard: React.FC<{
  title: string
  value: number | string
  description?: string
  icon: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
  href?: string
  color?: string
}> = ({ title, value, description, icon, href, color = 'bg-blue-50' }) => {
  const content = (
    <Card className={`${color} border-0 hover:shadow-md transition-shadow bg-batik-pattern`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1 text-tw-batik-blue">{value.toLocaleString()}</p>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          <div className="h-12 w-12 rounded-full bg-tw-gradient-primary flex items-center justify-center text-white shadow-lg">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}

// Quick action button component with cultural styling
const QuickActionButton: React.FC<{
  label: string
  icon: React.ReactNode
  href: string
  variant?: 'default' | 'secondary' | 'outline'
}> = ({ label, icon, href, variant = 'default' }) => {
  const buttonClasses = {
    default: 'bg-tw-batik-blue hover:bg-tw-batik-blue/90 text-white',
    secondary: 'bg-tw-batik-gold hover:bg-tw-batik-gold/90 text-tw-black-primary',
    outline: 'border-tw-batik-blue text-tw-batik-blue hover:bg-tw-batik-blue/10',
  }

  return (
    <Button 
      asChild 
      variant={variant} 
      className={`flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-md min-h-[48px] px-4 py-2 ${buttonClasses[variant] || ''}`}
    >
      <Link href={href}>
        {icon}
        <span>{label}</span>
      </Link>
    </Button>
  )
}

// Activity item component with timeline styling
// Requirements: 3.1 (timeline format), 3.2 (color-coded badges), 3.3 (cultural icons), 3.4 (relative timestamps)
const ActivityItem: React.FC<{
  activity: RecentActivity
  isLast?: boolean
}> = ({ activity, isLast = false }) => {
  // Color-coded badges for action types - Requirements: 3.2
  // Green for created, Blue for updated, Red for deleted
  const actionColors: Record<string, string> = {
    created: 'bg-green-100 text-green-800',
    updated: 'bg-blue-100 text-blue-800',
    deleted: 'bg-red-100 text-red-800',
  }

  const actionLabels: Record<string, string> = {
    created: 'Dibuat',
    updated: 'Diperbarui',
    deleted: 'Dihapus',
  }

  // Cultural icons for action types - Requirements: 3.3
  // Lontar for created, CepatMenulis for updated, Prasasti for deleted
  const actionIcons: Record<string, React.ReactNode> = {
    created: <LontarIcon className="h-4 w-4 text-green-600" />,
    updated: <CepatMenulisIcon className="h-4 w-4 text-blue-600" />,
    deleted: <PrasastiIcon className="h-4 w-4 text-red-600" />,
  }

  // Timeline dot colors matching action types
  const dotColors: Record<string, string> = {
    created: 'bg-green-500',
    updated: 'bg-blue-500',
    deleted: 'bg-red-500',
  }

  return (
    <div className="flex items-start gap-4 relative pl-6">
      {/* Timeline vertical line - Requirements: 3.1 */}
      {/* Connecting line between items */}
      {!isLast && (
        <div className="absolute left-[7px] top-6 bottom-0 w-0.5 bg-gradient-to-b from-gray-300 to-gray-200" />
      )}
      
      {/* Timeline dot - Requirements: 3.1 */}
      <div className="absolute left-0 top-1.5 flex-shrink-0">
        <div className={`w-4 h-4 rounded-full ${dotColors[activity.action] || 'bg-tw-batik-blue'} border-2 border-white shadow-md ring-2 ring-gray-100`} />
      </div>
      
      {/* Activity content */}
      <div className="flex-1 min-w-0 pb-4">
        <div className="flex items-center flex-wrap gap-2 mb-1">
          {/* Color-coded badge - Requirements: 3.2 */}
          <div className={`px-2 py-1 rounded text-xs font-medium ${actionColors[activity.action] || 'bg-gray-100 text-gray-800'}`}>
            {actionLabels[activity.action] || activity.action}
          </div>
          {/* Relative timestamp - Requirements: 3.4 */}
          <div className="text-xs text-muted-foreground">
            {activity.time_ago}
          </div>
        </div>
        <p className="text-sm font-medium truncate flex items-center gap-2">
          {/* Cultural icon - Requirements: 3.3 */}
          {actionIcons[activity.action] || <Activity className="h-4 w-4 text-gray-400" />}
          <span>{activity.loggable_type} #{activity.loggable_id}</span>
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          oleh {activity.user_name}
        </p>
      </div>
    </div>
  )
}

// Popular content item component with traditional visualizations
// Requirements: 4.1 (sorting/medals), 4.2 (Lontar icon), 4.3 (view count visualization), 4.4 (hover effect)
const PopularContentItem: React.FC<{
  item: PopularItem
  metric: 'views' | 'downloads'
  type?: 'berita' | 'ppid' | 'standar'
  rank?: number
}> = ({ item, metric, type = 'berita', rank }) => {
  const value = metric === 'views' ? item.views : item.downloads
  const icon = metric === 'views' ? <Eye className="h-4 w-4" /> : <Download className="h-4 w-4" />

  // Traditional visualization icons - Requirements: 4.2, 5.2, 6.2
  // Lontar for berita, Prasasti for PPID, CanangSari for standar pelayanan
  const typeIcons: Record<string, React.ReactNode> = {
    berita: <LontarIcon className="h-5 w-5 text-tw-batik-blue" />,
    ppid: <PrasastiIcon className="h-5 w-5 text-tw-batik-brown" />,
    standar: <CanangSariIcon className="h-5 w-5 text-tw-green-secondary" />,
  }

  // Rank medals for top 3 - Requirements: 4.1, 5.1, 6.1
  const rankMedals: Record<number, string> = {
    1: '🥇',
    2: '🥈',
    3: '🥉',
  }

  // Render rank indicator - shows medal for top 3, number for 4-5
  const renderRankIndicator = () => {
    if (!rank) return null
    
    // Top 3 get medal indicators - Requirements: 4.1
    if (rank <= 3) {
      return (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-tw-gradient-primary flex items-center justify-center shadow-sm">
          <span className="text-lg">{rankMedals[rank]}</span>
        </div>
      )
    }
    
    // Ranks 4-5 show number
    return (
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-sm shadow-sm">
        {rank}
      </div>
    )
  }

  return (
    // Hover effect with background color transition - Requirements: 4.4
    <div className="flex items-center gap-3 py-3 px-3 rounded-lg bg-white/50 hover:bg-white/70 transition-colors duration-200 cursor-pointer">
      {/* Rank indicator - Requirements: 4.1 */}
      {renderRankIndicator()}
      
      {/* Content info with cultural icon - Requirements: 4.2 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {typeIcons[type]}
          <p className="text-sm font-medium truncate">{item.title}</p>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{item.created_at}</p>
      </div>
      
      {/* Metric with traditional visualization - Requirements: 4.3 */}
      <div className="flex items-center gap-2 text-sm font-medium">
        {icon}
        <span className="text-tw-batik-blue">{value?.toLocaleString() || 0}</span>
        {/* Traditional "villagers reading" visualization - Requirements: 4.3 */}
        {/* 👥 icon with scaled number (value / 100) */}
        {metric === 'views' && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>👥</span>
            <span>{Math.floor((value || 0) / 100)}</span>
          </div>
        )}
        {/* Traditional "document messengers" visualization - Requirements: 5.3, 6.3 */}
        {/* 📜 icon with scaled number (value / 50) */}
        {metric === 'downloads' && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>📜</span>
            <span>{Math.floor((value || 0) / 50)}</span>
          </div>
        )}
      </div>
    </div>
  )
}


export default function Dashboard({
  statistics: rawStatistics,
  recentActivities: rawRecentActivities,
  popularContent: rawPopularContent,
  viewsOverTime: rawViewsOverTime,
}: DashboardProps) {
  // Merge with defaults to ensure all values exist - Requirements: 7.1-7.6, 8.1-8.4
  const statistics = useMemo(() => ({
    ...defaultStatistics,
    ...(rawStatistics || {}),
  }), [rawStatistics])

  // Safe access to arrays with fallbacks
  const recentActivities = rawRecentActivities || []
  const popularContent = rawPopularContent || { berita: [], ppid: [], standar_pelayanan: [] }
  const viewsOverTime = rawViewsOverTime || { labels: [], berita: [], activities: [] }

  // Check if data is loaded
  const hasStatistics = rawStatistics !== null && rawStatistics !== undefined

  // Main statistics cards - Requirements: 1.4, 8.1, 8.2, 8.3, 8.4, 9.3, 10.3
  // Cultural icons: Lontar untuk Berita, Wayang untuk Gallery, Prasasti untuk PPID
  // bg-batik-pattern applied via StatCard component
  const mainStats = [
    {
      title: 'Total Berita',
      value: safeNumber(statistics.total_berita),
      description: `${safeNumber(statistics.published_berita)} dipublikasi, ${safeNumber(statistics.draft_berita)} draft`,
      icon: <LontarIcon className="h-6 w-6" />,
      href: '/admin/berita',
      color: 'bg-yellow-50',
    },
    {
      title: 'Total Views',
      value: safeNumber(statistics.total_berita_views),
      description: 'Total kunjungan berita',
      icon: <LontarIcon className="h-6 w-6" />, // Cultural icon: Lontar represents reading/scrolls
      color: 'bg-green-50',
    },
    {
      title: 'Galeri Foto',
      value: safeNumber(statistics.total_gallery),
      description: `${safeNumber(statistics.featured_gallery)} featured`,
      icon: <WayangIcon className="h-6 w-6" />,
      href: '/admin/gallery',
      color: 'bg-purple-50',
    },
    {
      title: 'Dokumen PPID',
      value: safeNumber(statistics.total_ppid_documents),
      description: `${safeNumber(statistics.total_ppid_downloads)} downloads`,
      icon: <PrasastiIcon className="h-6 w-6" />,
      href: '/admin/ppid',
      color: 'bg-orange-50',
    },
  ]

  // Secondary statistics - Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6
  const secondaryStats = [
    {
      title: 'SSD (FAQ)',
      value: safeNumber(statistics.active_ssd),
      icon: <CepatMenulisIcon className="h-5 w-5 text-tw-batik-blue" />,
      href: '/admin/ssd',
    },
    {
      title: 'Standar Pelayanan',
      value: safeNumber(statistics.active_standar_pelayanan),
      icon: <CanangSariIcon className="h-5 w-5 text-tw-green-secondary" />,
      href: '/admin/standar-pelayanan',
    },
    {
      title: 'Profil Konten',
      value: safeNumber(statistics.active_profile_content),
      icon: <RumahAdatIcon className="h-5 w-5 text-tw-red-accent" />,
      href: '/admin/profile-content',
    },
    {
      title: 'Menu',
      value: safeNumber(statistics.visible_menus),
      icon: <MenuIcon className="h-5 w-5 text-tw-batik-brown" />,
      href: '/admin/menu',
    },
    {
      title: 'Media Files',
      value: safeNumber(statistics.total_media),
      icon: <FolderOpen className="h-5 w-5 text-tw-batik-gold" />,
      href: '/admin/media',
    },
    {
      title: 'Admin Users',
      value: safeNumber(statistics.active_admin_users),
      icon: <GotongRoyongIcon className="h-5 w-5 text-tw-yellow-primary" />,
      href: '/admin/users',
    },
  ]

  return (
    <AdminLayout title="Dashboard" breadcrumbs={[{ label: 'Dashboard' }]}>
      <Head title="Dashboard Admin" />

      <div className="space-y-6">
        {/* Compact Glassmorphism Hero Section */}
        <div className="relative overflow-hidden rounded-2xl p-5 sm:p-6 lg:p-7 mb-6 animate-fade-in">
          {/* Glassmorphism background */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(135deg, var(--admin-primary-blue) 0%, var(--admin-secondary-blue) 50%, var(--admin-tertiary-blue) 100%)',
          }} />

          {/* Glassmorphism overlay */}
          <div className="absolute inset-0" style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }} />

          {/* Subtle gradient orbs */}
          <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full" style={{
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
            filter: 'blur(20px)',
          }} />
          <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full" style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
            filter: 'blur(15px)',
          }} />

          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              {/* Main content */}
              <div className="flex-1 min-w-0">
                {/* Compact greeting badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3 animate-slide-up" style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}>
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{
                    background: 'var(--admin-accent-yellow)',
                  }} />
                  <span className="text-xs font-medium text-white/90">Panel Administrasi</span>
                </div>

                {/* Compact title section */}
                <div className="p-4 rounded-xl mb-4 animate-slide-up" style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-white leading-tight">
                    Selamat Datang
                  </h1>
                  <p className="text-lg sm:text-xl lg:text-2xl text-white/85 font-medium">
                    Balai Bahasa Sulawesi Tenggara
                  </p>
                </div>

                {/* Compact motto */}
                <div className="p-3 rounded-lg max-w-md animate-slide-up" style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                }}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{
                      background: 'var(--admin-accent-yellow)',
                    }}>
                      <span className="text-xs">🏛️</span>
                    </div>
                    <p className="text-sm font-bold text-white">Tut Wuri Handayani</p>
                  </div>
                  <p className="text-xs text-white/75">
                    Melestarikan bahasa dan budaya daerah
                  </p>
                </div>
              </div>

              {/* Compact icon container */}
              <div className="flex-shrink-0 hidden lg:block">
                <div className="relative">
                  <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl flex items-center justify-center" style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
                  }}>
                    <BatikIcon className="h-10 w-10 lg:h-12 lg:w-12 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Compact stats bar */}
            <div className="mt-4 pt-4 border-t border-white/15">
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg" style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
                    background: 'linear-gradient(135deg, var(--admin-accent-yellow), var(--admin-secondary-yellow))',
                  }}>
                    <File01Icon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white">{safeNumber(statistics.total_berita)}</p>
                    <p className="text-xs text-white/70">Berita</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg" style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
                    background: 'linear-gradient(135deg, #10b981, #34d399)',
                  }}>
                    <Image01Icon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white">{safeNumber(statistics.total_gallery)}</p>
                    <p className="text-xs text-white/70">Galeri</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg" style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
                    background: 'linear-gradient(135deg, #06b6d4, #22d3ee)',
                  }}>
                    <EyeIcon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white">{safeNumber(statistics.total_berita_views).toLocaleString('id-ID')}</p>
                    <p className="text-xs text-white/70">Kunjungan</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Statistics Section Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Statistik Konten</h2>
            <p className="text-sm text-muted-foreground">Detail informasi konten website</p>
          </div>
          {!hasStatistics && (
            <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">Memuat data...</span>
            </div>
          )}
        </div>

        {/* Glassmorphism Statistics Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="group relative overflow-hidden rounded-2xl p-6 animate-slide-up hover-scale" style={{
            background: 'var(--admin-glass-bg)',
            backdropFilter: 'var(--admin-glass-blur)',
            WebkitBackdropFilter: 'var(--admin-glass-blur)',
            border: '1px solid var(--admin-glass-border)',
            boxShadow: 'var(--admin-glass-shadow)',
            transition: 'all var(--admin-transition-normal)',
          }}>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
              background: 'linear-gradient(135deg, rgba(30, 64, 175, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
            }} />

            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300" style={{
                  background: 'var(--admin-gradient-icon)',
                  boxShadow: '0 8px 32px rgba(30, 64, 175, 0.3)',
                }}>
                  <File01Icon className="h-7 w-7 text-white" />
                </div>
                <div className="px-3 py-1 rounded-full text-xs font-bold" style={{
                  background: 'rgba(30, 64, 175, 0.1)',
                  color: 'var(--admin-primary-blue)',
                  border: '1px solid rgba(30, 64, 175, 0.2)',
                }}>
                  Berita
                </div>
              </div>
              <p className="text-4xl font-bold mb-2" style={{ color: 'var(--admin-black-text)' }}>
                {safeNumber(statistics.total_berita)}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--admin-black-text)', opacity: 0.7 }}>
                <span className="font-medium" style={{ color: 'var(--admin-success)' }}>{safeNumber(statistics.published_berita)}</span> publik,
                <span className="font-medium" style={{ color: 'var(--admin-warning)' }}>{safeNumber(statistics.draft_berita)}</span> draft
              </p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl p-6 animate-slide-up hover-scale animate-stagger-2" style={{
            background: 'var(--admin-glass-bg)',
            backdropFilter: 'var(--admin-glass-blur)',
            WebkitBackdropFilter: 'var(--admin-glass-blur)',
            border: '1px solid var(--admin-glass-border)',
            boxShadow: 'var(--admin-glass-shadow)',
            transition: 'all var(--admin-transition-normal)',
          }}>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(52, 211, 153, 0.05) 100%)',
            }} />

            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300" style={{
                  background: 'linear-gradient(135deg, #10b981, #34d399)',
                  boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)',
                }}>
                  <Image01Icon className="h-7 w-7 text-white" />
                </div>
                <div className="px-3 py-1 rounded-full text-xs font-bold" style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: '#10b981',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                }}>
                  Galeri
                </div>
              </div>
              <p className="text-4xl font-bold mb-2" style={{ color: 'var(--admin-black-text)' }}>
                {safeNumber(statistics.total_gallery)}
              </p>
              <p className="text-sm" style={{ color: 'var(--admin-black-text)', opacity: 0.7 }}>
                <span className="font-medium" style={{ color: 'var(--admin-success)' }}>{safeNumber(statistics.featured_gallery)}</span> featured
              </p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl p-6 animate-slide-up hover-scale animate-stagger-3" style={{
            background: 'var(--admin-glass-bg)',
            backdropFilter: 'var(--admin-glass-blur)',
            WebkitBackdropFilter: 'var(--admin-glass-blur)',
            border: '1px solid var(--admin-glass-border)',
            boxShadow: 'var(--admin-glass-shadow)',
            transition: 'all var(--admin-transition-normal)',
          }}>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(34, 211, 238, 0.05) 100%)',
            }} />

            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300" style={{
                  background: 'linear-gradient(135deg, #06b6d4, #22d3ee)',
                  boxShadow: '0 8px 32px rgba(6, 182, 212, 0.3)',
                }}>
                  <EyeIcon className="h-7 w-7 text-white" />
                </div>
                <div className="px-3 py-1 rounded-full text-xs font-bold" style={{
                  background: 'rgba(6, 182, 212, 0.1)',
                  color: '#06b6d4',
                  border: '1px solid rgba(6, 182, 212, 0.2)',
                }}>
                  Kunjungan
                </div>
              </div>
              <p className="text-4xl font-bold mb-2" style={{ color: 'var(--admin-black-text)' }}>
                {safeNumber(statistics.total_berita_views).toLocaleString('id-ID')}
              </p>
              <p className="text-sm" style={{ color: 'var(--admin-black-text)', opacity: 0.7 }}>Total views berita</p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl p-6 animate-slide-up hover-scale animate-stagger-4" style={{
            background: 'var(--admin-glass-bg)',
            backdropFilter: 'var(--admin-glass-blur)',
            WebkitBackdropFilter: 'var(--admin-glass-blur)',
            border: '1px solid var(--admin-glass-border)',
            boxShadow: 'var(--admin-glass-shadow)',
            transition: 'all var(--admin-transition-normal)',
          }}>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
              background: 'var(--admin-hover-overlay)',
            }} />

            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300" style={{
                  background: 'var(--admin-gradient-button-accent)',
                  boxShadow: '0 8px 32px rgba(255, 215, 0, 0.3)',
                }}>
                  <User01Icon className="h-7 w-7 text-white" />
                </div>
                <div className="px-3 py-1 rounded-full text-xs font-bold" style={{
                  background: 'rgba(255, 215, 0, 0.1)',
                  color: 'var(--admin-accent-yellow)',
                  border: '1px solid rgba(255, 215, 0, 0.2)',
                }}>
                  Admin
                </div>
              </div>
              <p className="text-4xl font-bold mb-2" style={{ color: 'var(--admin-black-text)' }}>
                {safeNumber(statistics.active_admin_users)}
              </p>
              <p className="text-sm" style={{ color: 'var(--admin-black-text)', opacity: 0.7 }}>Admin aktif</p>
            </div>
          </div>
        </div>

        {/* Glassmorphism Quick Actions */}
        <div className="rounded-2xl p-7 animate-slide-up animate-stagger-5" style={{
          background: 'var(--admin-glass-bg)',
          backdropFilter: 'var(--admin-glass-blur)',
          WebkitBackdropFilter: 'var(--admin-glass-blur)',
          border: '1px solid var(--admin-glass-border)',
          boxShadow: 'var(--admin-glass-shadow)',
        }}>
          <div className="flex items-center justify-between mb-7">
            <div>
              <h3 className="text-2xl font-bold" style={{ color: 'var(--admin-black-text)' }}>Aksi Cepat</h3>
              <p className="text-sm mt-1" style={{ color: 'var(--admin-black-text)', opacity: 0.7 }}>Buat konten baru dengan cepat</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <button
              onClick={() => router.visit('/admin/berita/create')}
              className="group flex items-center gap-4 p-5 rounded-2xl transition-all duration-300 hover:scale-105 hover-glow"
              style={{
                background: 'rgba(30, 64, 175, 0.08)',
                border: '1px solid rgba(30, 64, 175, 0.15)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(30, 64, 175, 0.12)'
                e.currentTarget.style.borderColor = 'rgba(30, 64, 175, 0.25)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(30, 64, 175, 0.08)'
                e.currentTarget.style.borderColor = 'rgba(30, 64, 175, 0.15)'
              }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300" style={{
                background: 'var(--admin-gradient-icon)',
                boxShadow: '0 8px 24px rgba(30, 64, 175, 0.3)',
              }}>
                <PlusCircleIcon className="h-6 w-6 text-white" />
              </div>
              <div className="text-left flex-1">
                <p className="font-bold text-base" style={{ color: 'var(--admin-primary-blue)' }}>Tambah Berita</p>
                <p className="text-xs mt-1" style={{ color: 'var(--admin-black-text)', opacity: 0.6 }}>Buat artikel baru</p>
              </div>
            </button>

            <button
              onClick={() => router.visit('/admin/pengumuman/create')}
              className="group flex items-center gap-4 p-5 rounded-2xl transition-all duration-300 hover:scale-105 hover-glow"
              style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.15)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)'
                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.25)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'
                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.15)'
              }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300" style={{
                background: 'linear-gradient(135deg, #ef4444, #f97316)',
                boxShadow: '0 8px 24px rgba(239, 68, 68, 0.3)',
              }}>
                <Bell className="h-6 w-6 text-white" />
              </div>
              <div className="text-left flex-1">
                <p className="font-bold text-base" style={{ color: '#ef4444' }}>Tambah Pengumuman</p>
                <p className="text-xs mt-1" style={{ color: 'var(--admin-black-text)', opacity: 0.6 }}>Sampaikan informasi penting</p>
              </div>
            </button>

            <button
              onClick={() => router.visit('/admin/gallery/create')}
              className="group flex items-center gap-4 p-5 rounded-2xl transition-all duration-300 hover:scale-105 hover-glow"
              style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.15)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(16, 185, 129, 0.12)'
                e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.25)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(16, 185, 129, 0.08)'
                e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.15)'
              }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300" style={{
                background: 'linear-gradient(135deg, #10b981, #34d399)',
                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
              }}>
                <ImageEdit01Icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-left flex-1">
                <p className="font-bold text-base" style={{ color: '#10b981' }}>Tambah Galeri</p>
                <p className="text-xs mt-1" style={{ color: 'var(--admin-black-text)', opacity: 0.6 }}>Upload foto baru</p>
              </div>
            </button>

            <button
              onClick={() => router.visit('/admin/ppid/create')}
              className="group flex items-center gap-4 p-5 rounded-2xl transition-all duration-300 hover:scale-105 hover-glow"
              style={{
                background: 'rgba(139, 92, 246, 0.08)',
                border: '1px solid rgba(139, 92, 246, 0.15)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(139, 92, 246, 0.12)'
                e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.25)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(139, 92, 246, 0.08)'
                e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.15)'
              }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300" style={{
                background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
                boxShadow: '0 8px 24px rgba(139, 92, 246, 0.3)',
              }}>
                <FileEdit01Icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-left flex-1">
                <p className="font-bold text-base" style={{ color: '#8b5cf6' }}>Tambah PPID</p>
                <p className="text-xs mt-1" style={{ color: 'var(--admin-black-text)', opacity: 0.6 }}>Dokumen publik</p>
              </div>
            </button>
          </div>
        </div>

        {/* Glassmorphism Charts and Activities Row */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-7">
          {/* Activity Chart - 3 columns */}
          <div className="lg:col-span-3 rounded-2xl p-7 animate-slide-up animate-stagger-6" style={{
            background: 'var(--admin-glass-bg)',
            backdropFilter: 'var(--admin-glass-blur)',
            WebkitBackdropFilter: 'var(--admin-glass-blur)',
            border: '1px solid var(--admin-glass-border)',
            boxShadow: 'var(--admin-glass-shadow)',
          }}>
            <div className="flex items-center justify-between mb-7">
              <div>
                <h3 className="text-2xl font-bold" style={{ color: 'var(--admin-black-text)' }}>Aktivitas 30 Hari Terakhir</h3>
                <p className="text-sm mt-1" style={{ color: 'var(--admin-black-text)', opacity: 0.7 }}>Trend berita baru dan aktivitas admin</p>
              </div>
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ background: 'var(--admin-primary-blue)' }} />
                  <span className="text-xs font-medium" style={{ color: 'var(--admin-black-text)', opacity: 0.7 }}>Berita</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ background: 'var(--admin-success)' }} />
                  <span className="text-xs font-medium" style={{ color: 'var(--admin-black-text)', opacity: 0.7 }}>Aktivitas</span>
                </div>
              </div>
            </div>

            {viewsOverTime.labels.length > 0 ? (
              <div className="space-y-6">
                {/* Berita Chart */}
                <div className="p-5 rounded-2xl hover-scale" style={{
                  background: 'rgba(30, 64, 175, 0.05)',
                  border: '1px solid rgba(30, 64, 175, 0.1)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{
                        background: 'var(--admin-gradient-icon)',
                        boxShadow: '0 6px 20px rgba(30, 64, 175, 0.25)',
                      }}>
                        <File01Icon className="h-5 w-5 text-white" />
                      </div>
                      <span className="font-bold text-base" style={{ color: 'var(--admin-primary-blue)' }}>Berita Baru</span>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold" style={{ color: 'var(--admin-primary-blue)' }}>
                        {viewsOverTime.berita.reduce((a, b) => a + b, 0)}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--admin-black-text)', opacity: 0.6 }}>Total</p>
                    </div>
                  </div>
                  <SimpleBarChart
                    data={viewsOverTime.berita}
                    labels={viewsOverTime.labels}
                    color="bg-blue-500"
                  />
                </div>

                {/* Aktivitas Chart */}
                <div className="p-5 rounded-2xl hover-scale" style={{
                  background: 'rgba(16, 185, 129, 0.05)',
                  border: '1px solid rgba(16, 185, 129, 0.1)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{
                        background: 'linear-gradient(135deg, #10b981, #34d399)',
                        boxShadow: '0 6px 20px rgba(16, 185, 129, 0.25)',
                      }}>
                        <Activity className="h-5 w-5 text-white" />
                      </div>
                      <span className="font-bold text-base" style={{ color: 'var(--admin-success)' }}>Aktivitas Admin</span>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold" style={{ color: 'var(--admin-success)' }}>
                        {viewsOverTime.activities.reduce((a, b) => a + b, 0)}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--admin-black-text)', opacity: 0.6 }}>Total</p>
                    </div>
                  </div>
                  <SimpleBarChart
                    data={viewsOverTime.activities}
                    labels={viewsOverTime.labels}
                    color="bg-emerald-500"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20" style={{ color: 'var(--admin-black-text)', opacity: 0.4 }}>
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5" style={{
                  background: 'rgba(107, 114, 128, 0.1)',
                  border: '1px solid rgba(107, 114, 128, 0.2)',
                }}>
                  <TrendingUp className="h-10 w-10" />
                </div>
                <p className="font-bold text-lg">Belum ada data aktivitas</p>
                <p className="text-sm mt-2">Data akan muncul setelah ada aktivitas</p>
              </div>
            )}
          </div>

          {/* Recent Activities - 2 columns with glassmorphism */}
          <div className="lg:col-span-2 rounded-2xl flex flex-col animate-slide-up animate-stagger-6" style={{
            background: 'var(--admin-glass-bg)',
            backdropFilter: 'var(--admin-glass-blur)',
            WebkitBackdropFilter: 'var(--admin-glass-blur)',
            border: '1px solid var(--admin-glass-border)',
            boxShadow: 'var(--admin-glass-shadow)',
          }}>
            <div className="p-6 border-b" style={{ borderColor: 'var(--admin-glass-border)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-3" style={{ color: 'var(--admin-black-text)' }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
                      background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
                      boxShadow: '0 4px 16px rgba(139, 92, 246, 0.25)',
                    }}>
                      <Activity className="h-4 w-4 text-white" />
                    </div>
                    Aktivitas Terbaru
                  </h3>
                  <p className="text-sm mt-1" style={{ color: 'var(--admin-black-text)', opacity: 0.7 }}>
                    {recentActivities.length} aktivitas terakhir
                  </p>
                </div>
                <Link
                  href="/admin/activity-logs"
                  className="text-sm font-bold px-3 py-1.5 rounded-lg transition-all duration-200 hover:scale-105"
                  style={{
                    color: 'var(--admin-primary-blue)',
                    background: 'rgba(30, 64, 175, 0.08)',
                    border: '1px solid rgba(30, 64, 175, 0.15)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(30, 64, 175, 0.12)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(30, 64, 175, 0.08)'
                  }}
                >
                  Lihat Semua
                </Link>
              </div>
            </div>

            {/* Scrollable activity list with glassmorphism styling */}
            <div className="flex-1 overflow-y-auto p-5" style={{ maxHeight: '420px' }}>
              {recentActivities.length > 0 ? (
                <div className="space-y-4">
                  {recentActivities.slice(0, 8).map((activity, index) => {
                    const actionConfig = {
                      created: {
                        bg: 'rgba(16, 185, 129, 0.1)',
                        text: '#10b981',
                        dot: '#10b981',
                        label: 'Dibuat',
                        icon: <LontarIcon className="h-4 w-4" />
                      },
                      updated: {
                        bg: 'rgba(30, 64, 175, 0.1)',
                        text: 'var(--admin-primary-blue)',
                        dot: 'var(--admin-primary-blue)',
                        label: 'Diperbarui',
                        icon: <CepatMenulisIcon className="h-4 w-4" />
                      },
                      deleted: {
                        bg: 'rgba(239, 68, 68, 0.1)',
                        text: '#ef4444',
                        dot: '#ef4444',
                        label: 'Dihapus',
                        icon: <PrasastiIcon className="h-4 w-4" />
                      },
                    }
                    const config = actionConfig[activity.action as keyof typeof actionConfig] || {
                      bg: 'rgba(107, 114, 128, 0.1)',
                      text: '#6b7280',
                      dot: '#6b7280',
                      label: activity.action,
                      icon: <Activity className="h-4 w-4" />
                    }

                    return (
                      <div key={activity.id} className="flex items-start gap-4 p-4 rounded-xl transition-all duration-200 hover:scale-102 hover-lift" style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(4px)',
                        WebkitBackdropFilter: 'blur(4px)',
                      }}>
                        <div className="relative flex-shrink-0">
                          <div className={`w-3 h-3 rounded-full mt-2`} style={{ backgroundColor: config.dot }} />
                          <div className={`absolute top-5 left-1.5 w-0.5 h-full`} style={{ backgroundColor: config.dot, opacity: 0.3 }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <span className="px-3 py-1 rounded-full text-xs font-bold" style={{
                              background: config.bg,
                              color: config.text,
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                            }}>
                              {config.label}
                            </span>
                            <span className="text-xs" style={{ color: 'var(--admin-black-text)', opacity: 0.5 }}>
                              {activity.time_ago}
                            </span>
                          </div>
                          <p className="text-sm font-bold mb-1 truncate flex items-center gap-2" style={{ color: 'var(--admin-black-text)' }}>
                            <span style={{ color: config.text }}>{config.icon}</span>
                            {activity.loggable_type} #{activity.loggable_id}
                          </p>
                          <p className="text-xs" style={{ color: 'var(--admin-black-text)', opacity: 0.6 }}>
                            oleh {activity.user_name}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20" style={{ color: 'var(--admin-black-text)', opacity: 0.4 }}>
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{
                    background: 'rgba(107, 114, 128, 0.1)',
                    border: '1px solid rgba(107, 114, 128, 0.2)',
                  }}>
                    <Clock className="h-8 w-8" />
                  </div>
                  <p className="font-bold">Belum ada aktivitas</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Popular Content Row - Modern Design */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Popular Berita */}
          <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                <Eye className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Berita Populer</h3>
                <p className="text-xs text-gray-500">Berdasarkan views</p>
              </div>
            </div>
            {popularContent.berita.length > 0 ? (
              <div className="space-y-2">
                {popularContent.berita.slice(0, 5).map((item, index) => (
                  <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-amber-100 text-amber-700' :
                      index === 1 ? 'bg-gray-200 text-gray-600' :
                      index === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-blue-600 font-medium">
                      <Eye className="h-3 w-3" />
                      {(item.views || 0).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                  <Eye className="h-6 w-6" />
                </div>
                <p className="text-sm">Belum ada data</p>
              </div>
            )}
          </div>

          {/* Popular PPID Documents */}
          <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-md">
                <Download className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Dokumen PPID</h3>
                <p className="text-xs text-gray-500">Berdasarkan download</p>
              </div>
            </div>
            {popularContent.ppid.length > 0 ? (
              <div className="space-y-2">
                {popularContent.ppid.slice(0, 5).map((item, index) => (
                  <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-amber-100 text-amber-700' :
                      index === 1 ? 'bg-gray-200 text-gray-600' :
                      index === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-violet-600 font-medium">
                      <Download className="h-3 w-3" />
                      {(item.downloads || 0).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                  <Download className="h-6 w-6" />
                </div>
                <p className="text-sm">Belum ada data</p>
              </div>
            )}
          </div>

          {/* Popular Standar Pelayanan */}
          <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md">
                <Download className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Standar Pelayanan</h3>
                <p className="text-xs text-gray-500">Berdasarkan download</p>
              </div>
            </div>
            {popularContent.standar_pelayanan.length > 0 ? (
              <div className="space-y-2">
                {popularContent.standar_pelayanan.slice(0, 5).map((item, index) => (
                  <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-amber-100 text-amber-700' :
                      index === 1 ? 'bg-gray-200 text-gray-600' :
                      index === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-emerald-600 font-medium">
                      <Download className="h-3 w-3" />
                      {(item.downloads || 0).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                  <Download className="h-6 w-6" />
                </div>
                <p className="text-sm">Belum ada data</p>
              </div>
            )}
          </div>
        </div>

        {/* Glassmorphism Module Summary */}
        <div className="rounded-2xl p-7 animate-slide-up animate-stagger-6" style={{
          background: 'var(--admin-glass-bg)',
          backdropFilter: 'var(--admin-glass-blur)',
          WebkitBackdropFilter: 'var(--admin-glass-blur)',
          border: '1px solid var(--admin-glass-border)',
          boxShadow: 'var(--admin-glass-shadow)',
        }}>
          <div className="flex items-center justify-between mb-7">
            <div>
              <h3 className="text-2xl font-bold" style={{ color: 'var(--admin-black-text)' }}>Ringkasan Modul</h3>
              <p className="text-sm mt-1" style={{ color: 'var(--admin-black-text)', opacity: 0.7 }}>Akses cepat ke semua modul konten</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
            {secondaryStats.map((stat, index) => {
              const colors = [
                'var(--admin-gradient-icon)',
                'linear-gradient(135deg, #10b981, #34d399)',
                'linear-gradient(135deg, #8b5cf6, #a78bfa)',
                'var(--admin-gradient-button-accent)',
                'linear-gradient(135deg, #06b6d4, #22d3ee)',
                'linear-gradient(135deg, #f43f5e, #fb7185)',
              ]
              return (
                <Link
                  key={index}
                  href={stat.href}
                  className="group flex flex-col items-center p-5 rounded-xl transition-all duration-300 hover:scale-105 hover-lift"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(4px)',
                    WebkitBackdropFilter: 'blur(4px)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                  }}
                >
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg group-hover:rotate-12 transition-transform duration-300" style={{
                    background: colors[index % colors.length],
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                  }}>
                    {stat.icon}
                  </div>
                  <span className="text-2xl font-bold" style={{ color: 'var(--admin-black-text)' }}>{stat.value}</span>
                  <span className="text-xs text-center mt-2" style={{ color: 'var(--admin-black-text)', opacity: 0.7 }}>{stat.title}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
