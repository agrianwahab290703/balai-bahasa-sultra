import React, { useCallback } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { DataTable, ColumnDef, PaginatedData, BulkAction } from '@/Components/Admin/DataTable';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Download, Eye, Pencil, Trash2, Check, X, Search, Plus } from 'lucide-react';
import {
  File02Icon,
  GridViewIcon,
  PencilEdit02Icon,
  Globe02Icon,
  UserIcon,
  TranslateIcon,
  LibraryIcon,
  Database01Icon,
  FileValidationIcon
} from 'hugeicons-react';

interface StandarPelayananDocument {
  id: number;
  title: string;
  description: string;
  category: string;
  url: string;
  file_type: string;
  file_size: number;
  formatted_file_size: string;
  download_count: number;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

interface CategoryStats {
  total: number;
  active: number;
  total_downloads: number;
}

interface Props {
  documents: PaginatedData<StandarPelayananDocument>;
  filters: {
    search: string;
    category: string;
    status: string;
    sort: string;
    direction: string;
  };
  categories: string[];
  statistics: Record<string, CategoryStats>;
}

const CATEGORY_ICONS: Record<string, React.ComponentType<any>> = {
  'Umum': GridViewIcon,
  'UKBI': PencilEdit02Icon,
  'BIPA': Globe02Icon,
  'Ahli Bahasa': UserIcon,
  'Penerjemah': TranslateIcon,
  'Perpustakaan': LibraryIcon,
  'Data & Informasi': Database01Icon,
};

const CATEGORY_COLORS: Record<string, string> = {
  'Umum': 'text-blue-500 bg-blue-50',
  'UKBI': 'text-green-500 bg-green-50',
  'BIPA': 'text-purple-500 bg-purple-50',
  'Ahli Bahasa': 'text-orange-500 bg-orange-50',
  'Penerjemah': 'text-pink-500 bg-pink-50',
  'Perpustakaan': 'text-indigo-500 bg-indigo-50',
  'Data & Informasi': 'text-cyan-500 bg-cyan-50',
};

export default function Index({ documents, filters, categories, statistics }: Props) {
  const columns: ColumnDef<StandarPelayananDocument>[] = [
    {
      key: 'title',
      label: 'Judul Dokumen',
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl shrink-0 group-hover:scale-110 transition-transform" style={{
            background: 'rgba(30, 64, 175, 0.1)',
            border: '1px solid rgba(30, 64, 175, 0.2)',
          }}>
            <FileValidationIcon className="h-6 w-6" style={{ color: 'var(--admin-primary-blue)' }} />
          </div>
          <div className="min-w-0">
            <p className="font-bold truncate max-w-sm" style={{ color: 'var(--admin-black-text)' }}>{row.title}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="px-2 py-0.5 rounded-full text-xs font-medium" style={{
                background: 'rgba(30, 64, 175, 0.08)',
                color: 'var(--admin-primary-blue)',
                border: '1px solid rgba(30, 64, 175, 0.15)',
              }}>
                {row.file_type}
              </div>
              <span className="text-xs" style={{ color: 'var(--admin-black-text)', opacity: 0.6 }}>{row.formatted_file_size}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Kategori',
      sortable: true,
      render: (value) => {
        const catAsString = String(value);
        const Icon = CATEGORY_ICONS[catAsString] || GridViewIcon;
        return (
          <Badge variant="secondary" className="pl-1 pr-2 py-1 gap-1.5 font-medium">
            <Icon className="w-3.5 h-3.5" />
            {catAsString}
          </Badge>
        );
      },
    },
    {
      key: 'download_count',
      label: 'Downloads',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-1.5 font-medium text-muted-foreground">
          <Download className="h-4 w-4" />
          <span>{(value as number).toLocaleString()}</span>
        </div>
      ),
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (value) => (
        <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
          value
            ? 'bg-green-100 text-green-700 border-green-200'
            : 'bg-red-100 text-red-700 border-red-200'
        }`}>
          {value ? '✓ Aktif' : '✗ Nonaktif'}
        </div>
      ),
    },
    {
      key: 'created_at',
      label: 'Tanggal',
      sortable: true,
      render: (value) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium">
            {new Date(value as string).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </span>
          <span className="text-xs text-muted-foreground">
            {new Date(value as string).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (_, row) => (
        <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
          {row.url && (
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" asChild>
              <a href={route('admin.standar-pelayanan.download', row.id)} target="_blank">
                <Download className="h-4 w-4" />
              </a>
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-blue-500" asChild>
            <Link href={route('admin.standar-pelayanan.show', row.id)}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-orange-500" asChild>
            <Link href={route('admin.standar-pelayanan.edit', row.id)}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => handleDelete(row.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const bulkActions: BulkAction[] = [
    {
      key: 'activate',
      label: 'Aktifkan',
      icon: <Check className="h-4 w-4 mr-1" />,
      confirmMessage: 'Aktifkan semua dokumen yang dipilih?',
    },
    {
      key: 'deactivate',
      label: 'Nonaktifkan',
      icon: <X className="h-4 w-4 mr-1" />,
      confirmMessage: 'Nonaktifkan semua dokumen yang dipilih?',
    },
    {
      key: 'delete',
      label: 'Hapus',
      icon: <Trash2 className="h-4 w-4 mr-1" />,
      variant: 'destructive',
      confirmMessage: 'Hapus semua dokumen yang dipilih? Aksi ini tidak dapat dibatalkan.',
    },
  ];

  const filterConfigs = [
    {
      key: 'category',
      label: 'Kategori',
      options: categories.map((cat) => ({ value: cat, label: cat })),
    },
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'active', label: 'Aktif' },
        { value: 'inactive', label: 'Nonaktif' },
      ],
    },
  ];

  const handleDelete = useCallback((id: number) => {
    if (confirm('Hapus dokumen ini?')) {
      router.delete(route('admin.standar-pelayanan.destroy', id));
    }
  }, []);

  const handleBulkAction = useCallback((action: string, ids: (number | string)[]) => {
    router.post(route('admin.standar-pelayanan.bulk-action'), {
      action,
      ids,
    });
  }, []);

  const handleCategoryFilter = useCallback((category: string) => {
    router.get(route('admin.standar-pelayanan.index'), {
      ...filters,
      category: category === 'all' ? '' : category,
    }, { preserveState: true });
  }, [filters]);

  const breadcrumbs = [
    { label: 'Standar Pelayanan' }
  ];

  return (
    <AdminLayout title="Kelola Standar Pelayanan" breadcrumbs={breadcrumbs}>
      <Head title="Kelola Standar Pelayanan" />

      <div className="space-y-7">
        {/* Glassmorphism Header Section */}
        <div className="relative overflow-hidden rounded-2xl p-6 sm:p-8 animate-fade-in">
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

          {/* Floating gradient orbs */}
          <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full" style={{
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
            filter: 'blur(15px)',
          }} />
          <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full" style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
            filter: 'blur(12px)',
          }} />

          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex-1 min-w-0">
                {/* Title container */}
                <div className="p-4 rounded-xl mb-4 animate-slide-up" style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}>
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-white leading-tight">
                    Standar Pelayanan
                  </h1>
                  <p className="text-lg text-white/90 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{
                      background: 'var(--admin-accent-yellow)',
                    }}>
                      <FileValidationIcon className="h-3 w-3 text-gray-900" />
                    </div>
                    Kelola dokumen dan standar pelayanan publik
                  </p>
                </div>
              </div>

              <div className="flex-shrink-0">
                <button
                  onClick={() => router.visit(route('admin.standar-pelayanan.create'))}
                  className="group flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105"
                  style={{
                    background: 'var(--admin-gradient-button-accent)',
                    boxShadow: '0 8px 32px rgba(255, 215, 0, 0.3)',
                  }}
                >
                  <Plus className="h-5 w-5 text-white group-hover:rotate-90 transition-transform duration-300" />
                  <span className="font-bold text-white">Tambah Dokumen</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Glassmorphism Statistics Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Documents Card */}
          <div className="group relative overflow-hidden rounded-xl p-5 animate-slide-up hover-scale" style={{
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
                <div className="text-xs font-bold px-3 py-1 rounded-full" style={{
                  background: 'rgba(30, 64, 175, 0.1)',
                  color: 'var(--admin-primary-blue)',
                  border: '1px solid rgba(30, 64, 175, 0.2)',
                }}>
                  Total Dokumen
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300" style={{
                  background: 'var(--admin-gradient-icon)',
                  boxShadow: '0 6px 20px rgba(30, 64, 175, 0.25)',
                }}>
                  <File02Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold mb-2" style={{ color: 'var(--admin-black-text)' }}>
                {statistics.all?.total || 0}
              </p>
              <p className="text-sm" style={{ color: 'var(--admin-black-text)', opacity: 0.7 }}>
                <span className="font-medium" style={{ color: 'var(--admin-success)' }}>
                  {(statistics.all?.total_downloads || 0).toLocaleString()}
                </span> total unduhan
              </p>
            </div>
          </div>

          {/* Category Cards */}
          {categories.map((category, index) => {
            const Icon = CATEGORY_ICONS[category] || GridViewIcon;
            const categoryColors = {
              'Umum': 'linear-gradient(135deg, #3b82f6, #60a5fa)',
              'UKBI': 'linear-gradient(135deg, #10b981, #34d399)',
              'BIPA': 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
              'Ahli Bahasa': 'linear-gradient(135deg, #f97316, #fb923c)',
              'Penerjemah': 'linear-gradient(135deg, #ec4899, #f472b6)',
              'Perpustakaan': 'linear-gradient(135deg, #6366f1, #818cf8)',
              'Data & Informasi': 'linear-gradient(135deg, #06b6d4, #22d3ee)',
            };

            return (
              <div key={category} className={`group relative overflow-hidden rounded-xl p-5 animate-slide-up hover-scale ${index > 0 ? `animate-stagger-${index}` : ''}`} style={{
                background: 'var(--admin-glass-bg)',
                backdropFilter: 'var(--admin-glass-blur)',
                WebkitBackdropFilter: 'var(--admin-glass-blur)',
                border: '1px solid var(--admin-glass-border)',
                boxShadow: 'var(--admin-glass-shadow)',
                transition: 'all var(--admin-transition-normal)',
              }}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
                  background: categoryColors[category] ? `${categoryColors[category].replace(')', ', 0.1)').replace('linear-gradient', 'linear-gradient')} 0%, transparent 70%)` : 'rgba(107, 114, 128, 0.1)',
                }} />

                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-xs font-bold px-3 py-1 rounded-full truncate max-w-[100px]" style={{
                      background: categoryColors[category] ? `${categoryColors[category].replace(')', ', 0.1)').replace('linear-gradient', 'linear-gradient')} 0%, transparent 70%)` : 'rgba(107, 114, 128, 0.1)',
                      color: 'var(--admin-black-text)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    }} title={category}>
                      {category}
                    </div>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300" style={{
                      background: categoryColors[category] || 'linear-gradient(135deg, #6b7280, #9ca3af)',
                      boxShadow: categoryColors[category] ? '0 6px 20px rgba(0, 0, 0, 0.2)' : '0 6px 20px rgba(107, 114, 128, 0.2)',
                    }}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold mb-2" style={{ color: 'var(--admin-black-text)' }}>
                    {statistics[category]?.total || 0}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--admin-black-text)', opacity: 0.7 }}>
                    <span className="font-medium" style={{ color: 'var(--admin-success)' }}>
                      {(statistics[category]?.total_downloads || 0).toLocaleString()}
                    </span> unduhan
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Glassmorphism Tabbed View & Data Table */}
        <div className="space-y-5">
          <Tabs defaultValue={filters.category || 'all'} onValueChange={handleCategoryFilter} className="w-full">
            <div className="relative">
              {/* Glassmorphism tabs container */}
              <div className="p-1 rounded-2xl animate-slide-up" style={{
                background: 'var(--admin-glass-bg)',
                backdropFilter: 'var(--admin-glass-blur)',
                WebkitBackdropFilter: 'var(--admin-glass-blur)',
                border: '1px solid var(--admin-glass-border)',
                boxShadow: 'var(--admin-glass-shadow)',
              }}>
                <TabsList className="h-auto p-1 bg-transparent flex-wrap gap-2" style={{
                  background: 'transparent',
                  border: 'none',
                }}>
                  <TabsTrigger
                    value="all"
                    className="rounded-xl data-[state=active]:shadow-lg transition-all duration-200 py-2 px-5 font-medium"
                    style={{
                      color: 'var(--admin-black-text)',
                      background: 'transparent',
                    }}
                    data-active-style={{
                      background: 'var(--admin-primary-blue)',
                      color: 'white',
                    }}
                  >
                    Semua Dokumen
                  </TabsTrigger>
                  {categories.map((category) => {
                    const Icon = CATEGORY_ICONS[category] || GridViewIcon;
                    return (
                      <TabsTrigger
                        key={category}
                        value={category}
                        className="rounded-xl data-[state=active]:shadow-lg transition-all duration-200 py-2 px-4 gap-2 font-medium text-sm"
                        style={{
                          color: 'var(--admin-black-text)',
                          background: 'transparent',
                        }}
                        data-active-style={{
                          background: 'var(--admin-primary-blue)',
                          color: 'white',
                        }}
                      >
                        <Icon className="w-4 h-4" />
                        {category}
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </div>
            </div>

            <TabsContent value={filters.category || 'all'} className="mt-0">
              <div className="rounded-2xl overflow-hidden animate-slide-up" style={{
                background: 'var(--admin-glass-bg)',
                backdropFilter: 'var(--admin-glass-blur)',
                WebkitBackdropFilter: 'var(--admin-glass-blur)',
                border: '1px solid var(--admin-glass-border)',
                boxShadow: 'var(--admin-glass-shadow)',
              }}>
                <DataTable
                  data={documents}
                  columns={columns}
                  searchable
                  searchPlaceholder="Cari dokumen berdasarkan judul..."
                  searchValue={filters.search}
                  filters={filterConfigs}
                  filterValues={{ category: filters.category, status: filters.status }}
                  bulkActions={bulkActions}
                  sortColumn={filters.sort}
                  sortDirection={filters.direction as 'asc' | 'desc'}
                  baseUrl={route('admin.standar-pelayanan.index')}
                  onBulkAction={handleBulkAction}
                  emptyMessage={
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 animate-bounce" style={{
                        background: 'rgba(107, 114, 128, 0.1)',
                        border: '1px solid rgba(107, 114, 128, 0.2)',
                      }}>
                        <Search className="h-10 w-10" style={{ color: 'var(--admin-black-text)', opacity: 0.4 }} />
                      </div>
                      <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--admin-black-text)' }}>Tidak ada dokumen ditemukan</h3>
                      <p className="text-sm max-w-md mb-6" style={{ color: 'var(--admin-black-text)', opacity: 0.7 }}>
                        Cobalah mengubah filter pencarian atau kategori anda, atau tambahkan dokumen baru.
                      </p>
                      {filters.search && (
                        <button
                          onClick={() => router.get(route('admin.standar-pelayanan.index'))}
                          className="px-6 py-2 rounded-xl transition-all duration-200 hover:scale-105"
                          style={{
                            background: 'var(--admin-gradient-button-secondary)',
                            boxShadow: '0 4px 16px rgba(30, 64, 175, 0.2)',
                          }}
                        >
                          <span className="font-medium text-white">Reset Pencarian</span>
                        </button>
                      )}
                    </div>
                  }
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Floating Action Button */}
        <div className="fixed bottom-8 right-8 z-50">
          <button
            onClick={() => router.visit(route('admin.standar-pelayanan.create'))}
            className="group relative w-16 h-16 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 animate-float"
            style={{
              background: 'var(--admin-gradient-button-accent)',
              boxShadow: '0 12px 48px rgba(255, 215, 0, 0.4)',
            }}
          >
            <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
              background: 'conic-gradient(from 0deg, var(--admin-accent-yellow), var(--admin-secondary-blue), var(--admin-accent-yellow))',
              filter: 'blur(8px)',
              animation: 'rotate 3s linear infinite',
            }} />
            <Plus className="h-7 w-7 text-white relative z-10 group-hover:rotate-90 transition-transform duration-300" />

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap" style={{
              background: 'rgba(0, 0, 0, 0.9)',
              color: 'white',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
            }}>
              <span className="text-sm font-medium">Tambah Dokumen Baru</span>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1" style={{
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '6px solid rgba(0, 0, 0, 0.9)',
              }} />
            </div>
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
