import React, { useMemo, useState } from 'react'
import { Head, Link } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { Badge } from '@/Components/ui/badge'
import { Progress } from '@/Components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table'
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
  ChevronRight,
  ChevronLeft,
  Search,
  Settings,
  LogOut,
  User,
  FileText,
  HelpCircle,
  ClipboardList,
  Building2,
  Users,
  Lock,
} from 'lucide-react'
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

// Simple bar chart component with glassmorphism
const SimpleBarChart: React.FC<{
  data: number[]
  labels: string[]
  color?: string
  maxHeight?: number
}> = ({ data, labels, color = 'bg-tw-batik-blue', maxHeight = 100 }) => {
  const maxValue = Math.max(...data, 1)
  
  return (
    <div className="flex items-end gap-1 h-[100px]">
      {data.map((value, index) => {
        const height = (value / maxValue) * maxHeight
        return (
          <div key={index} className="flex-1 flex flex-col items-center gap-1">
            <div
              className={`w-full ${color} rounded-t transition-all duration-[var(--admin-transition-normal)] hover:opacity-80`}
              style={{ height: `${Math.max(height, 2)}px` }}
              title={`${labels[index]}: ${value}`}
            />
          </div>
        )
      })}
    </div>
  )
}

// Statistics card with glassmorphism and gradient
const StatCard: React.FC<{
  title: string
  value: number | string
  description?: string
  icon: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
  href?: string
  color?: string
}> = ({ title, value, description, icon, href, color = 'bg-white/80' }) => {
  const content = (
    <Card className={`${color} border-0 hover:shadow-md transition-shadow`} 
      style={{
        background: 'var(--admin-card-glass-bg)',
        backdropFilter: 'blur(var(--admin-card-glass-blur))',
        WebkitBackdropFilter: 'blur(var(--admin-card-glass-blur))',
        borderRadius: 'var(--admin-radius-md)',
        boxShadow: 'var(--admin-glass-shadow)',
      }}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-tw-black-text">{title}</p>
            <p className="text-2xl font-bold mt-1 text-tw-batik-blue">{value.toLocaleString()}</p>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          <div className="h-12 w-12 rounded-full bg-tw-gradient-primary flex items-center justify-center text-white shadow-lg" 
            style={{
              border: '2px solid var(--admin-yellow-accent)',
            }}>
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

// Quick action button with ripple effect
const QuickActionButton: React.FC<{
  label: string
  icon: React.ReactNode
  href: string
  variant?: 'default' | 'secondary' | 'outline'
}> = ({ label, icon, href, variant = 'default' }) => {
  const buttonClasses = {
    default: 'bg-tw-batik-blue hover:bg-tw-batik-blue/90 text-white',
    secondary: 'bg-tw-batik-gold hover:bg-tw-batik-gold/90 text-tw-black-text',
    outline: 'border-tw-batik-blue text-tw-batik-blue hover:bg-tw-batik-blue/10',
  }

  return (
    <Button 
      asChild 
      variant={variant} 
      className={`flex items-center gap-2 transition-all duration-[var(--admin-transition-normal)] hover:scale-105 hover:shadow-md min-h-[48px] px-4 py-2 relative overflow-hidden ${buttonClasses[variant] || ''}`}
      style={{
        background: variant === 'default' ? 'var(--admin-gradient-button)' : undefined,
      }}
    >
      <Link href={href} className="relative z-10">
        {icon}
        <span>{label}</span>
        {/* Ripple effect */}
        <span className="absolute inset-0 bg-[var(--admin-hover-overlay)] opacity-0 hover:opacity-100 transition-opacity duration-[var(--admin-ripple-duration)]" 
          style={{ pointerEvents: 'none' }}></span>
      </Link>
    </Button>
  )
}

// Activity item with timeline layout
const ActivityItem: React.FC<{
  activity: RecentActivity
  isLast?: boolean
}> = ({ activity, isLast = false }) => {
  // Color-coded badges for action types
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

  // Cultural icons for action types
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
    <div className="flex items-start gap-4 relative pl-6 group">
      {/* Timeline vertical line */}
      {!isLast && (
        <div className="absolute left-[7px] top-6 bottom-0 w-0.5 bg-gradient-to-b from-gray-300 to-gray-200" />
      )}
      
      {/* Timeline dot with animation */}
      <div className="absolute left-0 top-1.5 flex-shrink-0">
        <div className={`w-4 h-4 rounded-full ${dotColors[activity.action] || 'bg-tw-batik-blue'} border-2 border-white shadow-md ring-2 ring-gray-100 transition-all duration-[var(--admin-transition-fast)] group-hover:scale-125`} />
      </div>
      
      {/* Activity content with glassmorphism */}
      <div className="flex-1 min-w-0 pb-4 bg-white/50 rounded-lg p-3 transition-all duration-[var(--admin-transition-normal)] hover:bg-white/70 hover:shadow-sm">
        <div className="flex items-center flex-wrap gap-2 mb-1">
          {/* Color-coded badge */}
          <div className={`px-2 py-1 rounded text-xs font-medium ${actionColors[activity.action] || 'bg-gray-100 text-gray-800'}`}>
            {actionLabels[activity.action] || activity.action}
          </div>
          {/* Relative timestamp */}
          <div className="text-xs text-muted-foreground">
            {activity.time_ago}
          </div>
        </div>
        <p className="text-sm font-medium truncate flex items-center gap-2">
          {/* Cultural icon */}
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

// Popular content item with card flip animation
const PopularContentItem: React.FC<{
  item: PopularItem
  metric: 'views' | 'downloads'
  type?: 'berita' | 'ppid' | 'standar'
  rank?: number
}> = ({ item, metric, type = 'berita', rank }) => {
  const value = metric === 'views' ? item.views : item.downloads
  const icon = metric === 'views' ? <Eye className="h-4 w-4" /> : <Download className="h-4 w-4" />

  // Traditional visualization icons
  const typeIcons: Record<string, React.ReactNode> = {
    berita: <LontarIcon className="h-5 w-5 text-tw-batik-blue" />,
    ppid: <PrasastiIcon className="h-5 w-5 text-tw-batik-brown" />,
    standar: <CanangSariIcon className="h-5 w-5 text-tw-green-secondary" />,
  }

  // Rank medals for top 3
  const rankMedals: Record<number, string> = {
    1: '🥇',
    2: '🥈',
    3: '🥉',
  }

  // Flip animation state
  const [isFlipped, setIsFlipped] = useState(false)

  // Render rank indicator
  const renderRankIndicator = () => {
    if (!rank) return null
    
    // Top 3 get medal indicators
    if (rank <= 3) {
      return (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-tw-gradient-primary flex items-center justify-center shadow-sm" 
          style={{ border: '2px solid var(--admin-yellow-accent)' }}>
          <span className="text-lg font-bold text-white">{rankMedals[rank]}</span>
        </div>
      )
    }
    
    // Ranks 4-5 show number
    return (
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-tw-batik-blue font-bold text-sm shadow-sm">
        {rank}
      </div>
    )
  }

  return (
    // Flip card container
    <div className="perspective-1000">
      <div className={`flip-card ${isFlipped ? 'flipped' : ''}`} 
        onClick={() => setIsFlipped(!isFlipped)} 
        style={{ transition: 'transform var(--admin-flip-transition)' }}>
        {/* Front side */}
        <div className="flip-card-front flex items-center gap-3 py-3 px-3 rounded-lg bg-white/80 hover:bg-white transition-colors duration-[var(--admin-transition-normal)] cursor-pointer border border-white/20 shadow-sm">
          {/* Rank indicator */}
          {renderRankIndicator()}
          
          {/* Content info with cultural icon */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {typeIcons[type]}
              <p className="text-sm font-medium truncate">{item.title}</p>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{item.created_at}</p>
          </div>
          
          {/* Metric with traditional visualization */}
          <div className="flex items-center gap-2 text-sm font-medium">
            {icon}
            <span className="text-tw-batik-blue">{value?.toLocaleString() || 0}</span>
            {/* Traditional visualization */}
            {metric === 'views' && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span>👥</span>
                <span>{Math.floor((value || 0) / 100)}</span>
              </div>
            )}
            {metric === 'downloads' && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span>📜</span>
                <span>{Math.floor((value || 0) / 50)}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Back side - detailed view */}
        <div className="flip-card-back flex items-center gap-3 py-3 px-3 rounded-lg bg-tw-gradient-primary text-white">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{item.title}</p>
            <p className="text-xs opacity-80 mt-1">{item.created_at}</p>
            <p className="text-xs opacity-60 mt-1">{item.type}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{value?.toLocaleString() || 0}</div>
            <div className="text-xs opacity-80">{metric === 'views' ? 'Views' : 'Downloads'}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// PPID Document item with table row styling
const PPIDDocumentItem: React.FC<{
  document: PopularItem
  rank?: number
}> = ({ document, rank }) => {
  return (
    <TableRow className="hover:bg-[var(--admin-hover-overlay)] transition-colors duration-[var(--admin-transition-fast)] border-b border-white/20">
      <TableCell className="font-medium text-tw-batik-blue">{rank}</TableCell>
      <TableCell className="text-tw-black-text">{document.title}</TableCell>
      <TableCell className="text-tw-black-text">{document.downloads?.toLocaleString() || 0}</TableCell>
      <TableCell className="text-tw-black-text text-sm">{document.created_at}</TableCell>
      <TableCell className="text-right">
        <Badge variant="outline" className="text-tw-batik-blue border-tw-batik-blue">
          Dokumen
        </Badge>
      </TableCell>
    </TableRow>
  )
}

// Service standard card with bounce animation
const ServiceStandardCard: React.FC<{
  standard: PopularItem
  rank?: number
}> = ({ standard, rank }) => {
  return (
    <Card className="bg-white/80 hover:bg-white transition-all duration-[var(--admin-transition-normal)] hover:scale-[1.02] hover:shadow-md border border-white/20" 
      style={{
        borderRadius: 'var(--admin-radius-md)',
      }}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          {/* Rank indicator */}
          {rank && (
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-tw-gradient-primary flex items-center justify-center text-white font-bold shadow-sm">
              {rank}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-tw-batik-blue truncate">{standard.title}</p>
            <p className="text-xs text-muted-foreground mt-1">{standard.created_at}</p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-tw-batik-blue">{standard.downloads?.toLocaleString() || 0}</div>
            <div className="text-xs text-muted-foreground">Downloads</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Module summary card with progress bar
const ModuleSummaryCard: React.FC<{
  title: string
  value: number
  icon: React.ReactNode
  href: string
  maxValue: number
}> = ({ title, value, icon, href, maxValue }) => {
  const percentage = Math.min((value / maxValue) * 100, 100)

  return (
    <Link
      href={href}
      className="flex flex-col items-center p-4 rounded-lg bg-white/80 hover:bg-white transition-colors border border-white/20 hover:shadow-md" 
      style={{
        borderRadius: 'var(--admin-radius-md)',
      }}
    >
      <div className="h-12 w-12 rounded-full bg-tw-gradient-primary flex items-center justify-center text-white mb-2 shadow-sm" 
        style={{
          border: '2px solid var(--admin-yellow-accent)',
        }}>
        {icon}
      </div>
      <span className="text-2xl font-bold text-tw-batik-blue">{value}</span>
      <span className="text-xs text-muted-foreground text-center mt-1">{title}</span>
      <div className="w-full mt-3">
        <Progress value={percentage} className="h-2" 
          style={{
            background: 'rgba(255, 255, 255, 0.5)',
          }}
        />
        <div className="text-xs text-muted-foreground text-right mt-1">
          {Math.round(percentage)}%
        </div>
      </div>
    </Link>
  )
}

// CSS for flip animation
const flipCardStyles = `
.flip-card {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform var(--admin-flip-transition);
}

.flip-card.flipped {
  transform: rotateY(180deg);
}

.flip-card-front, .flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: var(--admin-radius-md);
}

.flip-card-back {
  transform: rotateY(180deg);
}

.perspective-1000 {
  perspective: 1000px;
}
`

export default function DashboardRedesigned({
  statistics: rawStatistics,
  recentActivities: rawRecentActivities,
  popularContent: rawPopularContent,
  viewsOverTime: rawViewsOverTime,
}: DashboardProps) {
  // Merge with defaults to ensure all values exist
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

  // Main statistics cards
  const mainStats = [
    {
      title: 'Total Berita',
      value: safeNumber(statistics.total_berita),
      description: `${safeNumber(statistics.published_berita)} dipublikasi, ${safeNumber(statistics.draft_berita)} draft`,
      icon: <LontarIcon className="h-6 w-6" />,
      href: '/admin/berita',
    },
    {
      title: 'Total Views',
      value: safeNumber(statistics.total_berita_views),
      description: 'Total kunjungan berita',
      icon: <LontarIcon className="h-6 w-6" />,
    },
    {
      title: 'Galeri Foto',
      value: safeNumber(statistics.total_gallery),
      description: `${safeNumber(statistics.featured_gallery)} featured`,
      icon: <WayangIcon className="h-6 w-6" />,
      href: '/admin/gallery',
    },
    {
      title: 'Dokumen PPID',
      value: safeNumber(statistics.total_ppid_documents),
      description: `${safeNumber(statistics.total_ppid_downloads)} downloads`,
      icon: <PrasastiIcon className="h-6 w-6" />,
      href: '/admin/ppid',
    },
  ]

  // Secondary statistics for module summary
  const secondaryStats = [
    {
      title: 'SSD (FAQ)',
      value: safeNumber(statistics.active_ssd),
      icon: <CepatMenulisIcon className="h-5 w-5" />,
      href: '/admin/ssd',
    },
    {
      title: 'Standar Pelayanan',
      value: safeNumber(statistics.active_standar_pelayanan),
      icon: <CanangSariIcon className="h-5 w-5" />,
      href: '/admin/standar-pelayanan',
    },
    {
      title: 'Profil Konten',
      value: safeNumber(statistics.active_profile_content),
      icon: <RumahAdatIcon className="h-5 w-5" />,
      href: '/admin/profile-content',
    },
    {
      title: 'Menu',
      value: safeNumber(statistics.visible_menus),
      icon: <MenuIcon className="h-5 w-5" />,
      href: '/admin/menu',
    },
    {
      title: 'Media Files',
      value: safeNumber(statistics.total_media),
      icon: <FolderOpen className="h-5 w-5" />,
      href: '/admin/media',
    },
    {
      title: 'Admin Users',
      value: safeNumber(statistics.active_admin_users),
      icon: <GotongRoyongIcon className="h-5 w-5" />,
      href: '/admin/users',
    },
  ]

  // Find max value for progress bars
  const maxModuleValue = Math.max(...secondaryStats.map(stat => stat.value), 10)

  return (
    <AdminLayout title="Dashboard" breadcrumbs={[{ label: 'Dashboard' }]}>
      <Head title="Dashboard Admin" />

      {/* Add flip card styles */}
      <style>{flipCardStyles}</style>

      <div className="space-y-6">
        {/* Hero Section with Cultural Design */}
        <div className="relative overflow-hidden rounded-xl bg-tw-gradient-primary p-4 sm:p-6 lg:p-8 mb-6 text-white shadow-lg" 
          style={{
            borderRadius: 'var(--admin-radius-lg)',
          }}>
          {/* Batik pattern overlay */}
          <div className="absolute inset-0 bg-batik-pattern opacity-15" />
          <div className="absolute inset-0 bg-wayang-pattern opacity-10" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display handwritten text-shadow-subtle">
                  Tut Wuri Handayani
                </h2>
                <p className="text-sm sm:text-base lg:text-lg mt-2 sm:mt-3 opacity-90 max-w-xl">
                  <span className="font-semibold">Balai Bahasa Provinsi Sulawesi Tenggara</span>
                  <br className="sm:hidden" />
                  <span className="text-white/80">Melestarikan bahasa dan budaya daerah</span>
                </p>
                <p className="text-xs sm:text-sm mt-2 opacity-75 italic">
                  "Di belakang memberi dorongan"
                </p>
              </div>
              
              <div className="hidden md:flex flex-shrink-0 items-center justify-center">
                <div className="w-20 h-20 lg:w-28 lg:h-28 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm animate-batik-stamp shadow-lg border border-white/30">
                  <BatikIcon className="h-10 w-10 lg:h-14 lg:w-14 text-white drop-shadow-md" />
                </div>
              </div>
            </div>
            
            <div className="mt-4 sm:mt-6 flex items-center gap-2 opacity-60">
              <div className="h-px flex-1 bg-gradient-to-r from-white/50 to-transparent" />
              <LontarIcon className="h-4 w-4 text-white/70" />
              <div className="h-px flex-1 bg-gradient-to-l from-white/50 to-transparent" />
            </div>
          </div>
        </div>

        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-tw-gradient-primary rounded-full flex items-center justify-center">
                <BatikIcon className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 font-display">Dashboard</h1>
            </div>
            <p className="text-muted-foreground">
              Selamat datang di Admin Panel Balai Bahasa Sultra
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="font-medium">Tut Wuri Handayani</span> - Di belakang memberi dorongan
            </p>
          </div>
          {!hasStatistics && (
            <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">Memuat data statistik...</span>
            </div>
          )}
        </div>

        {/* Main Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mainStats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Quick Actions Panel */}
        <Card className="bg-white/80" 
          style={{
            backdropFilter: 'blur(var(--admin-button-glass-blur))',
            WebkitBackdropFilter: 'blur(var(--admin-button-glass-blur))',
            borderRadius: 'var(--admin-radius-md)',
          }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Plus className="h-5 w-5 text-tw-batik-blue" />
              Aksi Cepat
            </CardTitle>
            <CardDescription>Buat konten baru dengan cepat</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Content Creation Hub */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-tw-batik-blue flex items-center gap-2">
                  <LontarIcon className="h-4 w-4" />
                  <span>Pusat Pembuatan Konten</span>
                </p>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <QuickActionButton
                    label="Tambah Berita"
                    icon={<LontarIcon className="h-4 w-4" />}
                    href="/admin/berita/create"
                  />
                  <QuickActionButton
                    label="Tambah Pengumuman"
                    icon={<Bell className="h-4 w-4" />}
                    href="/admin/pengumuman/create"
                    variant="secondary"
                  />
                  <QuickActionButton
                    label="Upload Foto"
                    icon={<WayangIcon className="h-4 w-4" />}
                    href="/admin/gallery/create"
                    variant="secondary"
                  />
                  <QuickActionButton
                    label="Tambah Dokumen PPID"
                    icon={<PrasastiIcon className="h-4 w-4" />}
                    href="/admin/ppid/create"
                    variant="secondary"
                  />
                </div>
              </div>
              
              {/* Management Tools */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-tw-green-secondary flex items-center gap-2">
                  <GotongRoyongIcon className="h-4 w-4" />
                  <span>Alat Manajemen</span>
                </p>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <QuickActionButton
                    label="Tambah FAQ"
                    icon={<CepatMenulisIcon className="h-4 w-4" />}
                    href="/admin/ssd/create"
                    variant="outline"
                  />
                  <QuickActionButton
                    label="Upload Media"
                    icon={<FolderOpen className="h-4 w-4" />}
                    href="/admin/media"
                    variant="outline"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts and Activities Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activity Chart */}
          <Card className="bg-white/80" 
            style={{
              backdropFilter: 'blur(var(--admin-activity-glass-blur))',
              WebkitBackdropFilter: 'blur(var(--admin-activity-glass-blur))',
              borderRadius: 'var(--admin-radius-md)',
            }}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-tw-batik-blue" />
                Aktivitas 30 Hari Terakhir
              </CardTitle>
              <CardDescription>Berita baru dan aktivitas admin</CardDescription>
            </CardHeader>
            <CardContent>
              {viewsOverTime.labels.length > 0 ? (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-tw-batik-blue flex items-center gap-2">
                        <LontarIcon className="h-4 w-4" />
                        Berita Baru
                      </span>
                      <span className="text-sm text-tw-batik-brown">
                        Total: {viewsOverTime.berita.reduce((a, b) => a + b, 0)}
                      </span>
                    </div>
                    <SimpleBarChart
                      data={viewsOverTime.berita}
                      labels={viewsOverTime.labels}
                      color="bg-tw-batik-blue"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-tw-green-secondary flex items-center gap-2">
                        <GotongRoyongIcon className="h-4 w-4" />
                        Aktivitas Admin
                      </span>
                      <span className="text-sm text-tw-batik-brown">
                        Total: {viewsOverTime.activities.reduce((a, b) => a + b, 0)}
                      </span>
                    </div>
                    <SimpleBarChart
                      data={viewsOverTime.activities}
                      labels={viewsOverTime.labels}
                      color="bg-tw-green-secondary"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Belum ada data aktivitas</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activities with Timeline */}
          <Card className="bg-white/80" 
            style={{
              backdropFilter: 'blur(var(--admin-activity-glass-blur))',
              WebkitBackdropFilter: 'blur(var(--admin-activity-glass-blur))',
              borderRadius: 'var(--admin-radius-md)',
            }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="h-5 w-5 text-tw-batik-blue" />
                    Aktivitas Terbaru
                  </CardTitle>
                  <CardDescription>10 aktivitas terakhir</CardDescription>
                </div>
                <Button asChild variant="outline" size="sm" className="border-tw-batik-blue text-tw-batik-blue hover:bg-tw-batik-blue/10 transition-colors">
                  <Link href="/admin/activity-logs">Lihat Semua</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentActivities.length > 0 ? (
                <div className="relative">
                  {recentActivities.map((activity, index) => (
                    <ActivityItem 
                      key={activity.id} 
                      activity={activity} 
                      isLast={index === recentActivities.length - 1} 
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Belum ada aktivitas</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Popular Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Popular Berita with Flip Cards */}
          <Card className="bg-white/80" 
            style={{
              backdropFilter: 'blur(var(--admin-card-glass-blur))',
              WebkitBackdropFilter: 'blur(var(--admin-card-glass-blur))',
              borderRadius: 'var(--admin-radius-md)',
            }}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <LontarIcon className="h-5 w-5 text-tw-batik-blue" />
                Berita Populer
              </CardTitle>
              <CardDescription>Berdasarkan jumlah views</CardDescription>
            </CardHeader>
            <CardContent>
              {popularContent.berita.length > 0 ? (
                <div className="space-y-3">
                  {popularContent.berita.map((item, index) => (
                    <PopularContentItem 
                      key={item.id} 
                      item={item} 
                      metric="views" 
                      type="berita" 
                      rank={index + 1}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-muted-foreground">Belum ada data</p>
              )}
            </CardContent>
          </Card>

          {/* Popular PPID Documents with Table */}
          <Card className="bg-white/80" 
            style={{
              backdropFilter: 'blur(var(--admin-table-glass-blur))',
              WebkitBackdropFilter: 'blur(var(--admin-table-glass-blur))',
              borderRadius: 'var(--admin-radius-md)',
            }}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <PrasastiIcon className="h-5 w-5 text-tw-batik-brown" />
                Dokumen PPID Populer
              </CardTitle>
              <CardDescription>Berdasarkan jumlah download</CardDescription>
            </CardHeader>
            <CardContent>
              {popularContent.ppid.length > 0 ? (
                <div className="space-y-2">
                  <Table>
                    <TableHeader className="bg-tw-gradient-table-header text-white">
                      <TableRow>
                        <TableHead className="w-[40px] text-white">No</TableHead>
                        <TableHead className="text-white">Judul</TableHead>
                        <TableHead className="text-white text-right">Downloads</TableHead>
                        <TableHead className="text-white">Tanggal</TableHead>
                        <TableHead className="text-right text-white">Tipe</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {popularContent.ppid.map((doc, index) => (
                        <PPIDDocumentItem 
                          key={doc.id} 
                          document={doc} 
                          rank={index + 1}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-center py-4 text-muted-foreground">Belum ada data</p>
              )}
            </CardContent>
          </Card>

          {/* Popular Standar Pelayanan with Cards */}
          <Card className="bg-white/80" 
            style={{
              backdropFilter: 'blur(var(--admin-card-glass-blur))',
              WebkitBackdropFilter: 'blur(var(--admin-card-glass-blur))',
              borderRadius: 'var(--admin-radius-md)',
            }}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CanangSariIcon className="h-5 w-5 text-tw-green-secondary" />
                Standar Pelayanan Populer
              </CardTitle>
              <CardDescription>Berdasarkan jumlah download</CardDescription>
            </CardHeader>
            <CardContent>
              {popularContent.standar_pelayanan.length > 0 ? (
                <div className="space-y-3">
                  {popularContent.standar_pelayanan.map((standard, index) => (
                    <ServiceStandardCard 
                      key={standard.id} 
                      standard={standard} 
                      rank={index + 1}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-muted-foreground">Belum ada data</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Module Summary with Progress Bars */}
        <Card className="bg-white/80" 
          style={{
            backdropFilter: 'blur(var(--admin-module-glass-blur))',
            WebkitBackdropFilter: 'blur(var(--admin-module-glass-blur))',
            borderRadius: 'var(--admin-radius-md)',
          }}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <GotongRoyongIcon className="h-5 w-5 text-tw-batik-blue" />
              Ringkasan Modul
            </CardTitle>
            <CardDescription>Status semua modul konten</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {secondaryStats.map((stat, index) => (
                <ModuleSummaryCard
                  key={index}
                  title={stat.title}
                  value={stat.value}
                  icon={stat.icon}
                  href={stat.href}
                  maxValue={maxModuleValue}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}