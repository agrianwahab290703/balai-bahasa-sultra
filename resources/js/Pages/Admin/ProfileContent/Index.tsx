import React, { useCallback, useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { DataTable, ColumnDef, PaginatedData, BulkAction } from '@/Components/Admin/DataTable';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Plus, Eye, Pencil, Trash2, FileText, Check, X, Image, ChevronUp, ChevronDown, GripVertical } from 'lucide-react';

interface ProfileContent {
  id: number;
  type: string;
  title: string;
  content: string;
  images: string[] | null;
  metadata: Record<string, unknown> | null;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface TypeStats {
  total: number;
  active: number;
}

interface Props {
  contents: PaginatedData<ProfileContent>;
  filters: {
    search: string;
    type: string;
    status: string;
    sort: string;
    direction: string;
  };
  contentTypes: Record<string, string>;
  statistics: Record<string, TypeStats>;
}

export default function Index({ contents, filters, contentTypes, statistics }: Props) {
  const [selectedType, setSelectedType] = useState(filters.type || 'all');
  const [isFiltering, setIsFiltering] = useState(false);

  // Update selected type when URL changes
  useEffect(() => {
    setSelectedType(filters.type || 'all');
  }, [filters.type]);

  const columns: ColumnDef<ProfileContent>[] = [
    {
      key: 'title',
      label: 'Judul',
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-muted rounded">
            {row.images && row.images.length > 0 ? (
              <Image className="h-5 w-5 text-muted-foreground" />
            ) : (
              <FileText className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <div className="min-w-0">
            <p className="font-medium truncate max-w-xs">{row.title}</p>
            <p className="text-sm text-muted-foreground">
              {row.images ? `${row.images.length} gambar` : 'Tanpa gambar'}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Tipe',
      sortable: true,
      render: (value) => (
        <Badge variant="outline">
          {contentTypes[value as string] || String(value)}
        </Badge>
      ),
    },
    {
      key: 'order',
      label: 'Urutan',
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <GripVertical className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700 w-8">{row.order}</span>
          <div className="flex flex-col">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-gray-100"
              onClick={() => moveItem(row.id, 'up')}
              title="Pindah ke atas"
            >
              <ChevronUp className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-gray-100"
              onClick={() => moveItem(row.id, 'down')}
              title="Pindah ke bawah"
            >
              <ChevronDown className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ),
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (value) => (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Aktif' : 'Nonaktif'}
        </Badge>
      ),
    },
    {
      key: 'updated_at',
      label: 'Diperbarui',
      sortable: true,
      render: (value) => (
        <span className="text-sm text-muted-foreground">
          {new Date(value as string).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Aksi',
      render: (_, row) => (
        <div className="flex items-center gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            asChild
            title="Lihat Detail"
            className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
          >
            <Link href={route('admin.profile-content.show', row.id)}>
              <Eye className="h-4 w-4 mr-1" />
              Lihat
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            asChild
            title="Edit Konten"
            className="border-amber-200 text-amber-600 hover:bg-amber-50 hover:border-amber-300"
          >
            <Link href={route('admin.profile-content.edit', row.id)}>
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </Link>
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
      confirmMessage: 'Aktifkan semua konten yang dipilih?',
    },
    {
      key: 'deactivate',
      label: 'Nonaktifkan',
      icon: <X className="h-4 w-4 mr-1" />,
      confirmMessage: 'Nonaktifkan semua konten yang dipilih?',
    },
    {
      key: 'delete',
      label: 'Hapus',
      icon: <Trash2 className="h-4 w-4 mr-1" />,
      variant: 'destructive',
      confirmMessage: 'Hapus semua konten yang dipilih? Aksi ini tidak dapat dibatalkan.',
    },
  ];

  const filterConfigs = [
    {
      key: 'type',
      label: 'Tipe',
      options: Object.entries(contentTypes).map(([value, label]) => ({ value, label })),
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

  const handleBulkAction = useCallback((action: string, ids: (number | string)[]) => {
    router.post(route('admin.profile-content.bulk-action'), {
      action,
      ids,
    });
  }, []);

  const moveItem = (id: number, direction: 'up' | 'down') => {
    router.post(route('admin.profile-content.reorder'), {
      id,
      direction,
    });
  };

  const handleTypeFilter = useCallback((type: string) => {
    // Prevent unnecessary requests if same type is selected
    if (selectedType === type) return;

    setIsFiltering(true);
    setSelectedType(type);

    // Debounce the request to avoid rapid clicks
    const timeoutId = setTimeout(() => {
      const newParams = {
        ...filters,
        type: type === 'all' ? '' : type,
      };

      router.get(route('admin.profile-content.index'), newParams, {
        preserveState: true,
        preserveScroll: true,
        replace: true,
        onFinish: () => setIsFiltering(false),
      });
    }, 150); // 150ms debounce

    return () => clearTimeout(timeoutId);
  }, [filters, selectedType]);

  const breadcrumbs = [
    { label: 'Profil' }
  ];

  return (
    <AdminLayout title="Kelola Konten Profil" breadcrumbs={breadcrumbs}>
      <Head title="Kelola Konten Profil" />

      {/* Hero Section with Soft Glassmorphism */}
      <div className="relative mb-12">
        {/* Soft background with subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-yellow-50 rounded-3xl" />

        {/* Floating soft elements */}
        <div className="absolute top-8 left-8 w-20 h-20 rounded-full bg-blue-100 opacity-60 blur-xl animate-pulse" />
        <div className="absolute bottom-8 right-12 w-16 h-16 rounded-full bg-yellow-100 opacity-50 blur-xl animate-pulse" style={{ animationDelay: '1s' }} />

        {/* Main content container */}
        <div className="relative bg-white/60 backdrop-blur-sm border border-white/20 rounded-3xl p-10 shadow-2xl shadow-blue-100/50">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-blue-50 rounded-full border border-blue-100">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-sm font-medium text-blue-700">Sistem Manajemen Konten</span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-blue-500 to-white bg-clip-text text-transparent leading-tight">
                Konten Profil
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Kelola konten halaman profil organisasi dengan antarmuka yang
                <span className="font-semibold text-blue-600 mx-1">intuitif</span> dan
                <span className="font-semibold text-yellow-600 mx-1">elegan</span>
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                asChild
                className="group relative overflow-hidden bg-white border-2 border-blue-200 text-blue-600 hover:text-white hover:border-blue-400 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-200/50 px-8 py-4 rounded-2xl text-lg font-medium"
              >
                <Link href={route('admin.profile-content.create')} className="flex items-center">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <Plus className="h-5 w-5 mr-3 relative z-10 group-hover:rotate-90 transition-transform duration-500" />
                  <span className="relative z-10">Tambah Konten</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Menu */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8">
        <div className="w-full overflow-x-auto pb-2">
          <div className="flex flex-nowrap sm:flex-wrap items-center gap-3 min-w-max sm:min-w-0">
            <span className="text-sm font-medium text-gray-500 whitespace-nowrap">Menu Cepat:</span>
            <Link
              href={route('admin.dashboard')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium whitespace-nowrap"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </Link>
            <Link
              href={route('admin.media.index')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium whitespace-nowrap"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Media Files
            </Link>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
        {/* Total Content Card */}
        <div className="group relative bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl p-6 shadow-xl shadow-blue-100/30 hover:shadow-2xl hover:shadow-blue-200/40 transition-all duration-500 hover:scale-105">
          <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 group-hover:scale-125 transition-transform duration-500" />

          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700">Total Konten</h3>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                {statistics.all?.total || 0}
              </span>
              <span className="text-sm text-gray-500">konten</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-sm shadow-green-200" />
              <span className="text-sm text-gray-600 font-medium">
                {statistics.all?.active || 0} aktif
              </span>
            </div>
          </div>
        </div>

        {/* Content Type Cards */}
        {Object.entries(contentTypes).map(([key, label], index) => {
          const stat = statistics[key] || { total: 0, active: 0 };
          const colors = [
            'from-blue-500 to-blue-600',
            'from-purple-500 to-purple-600',
            'from-yellow-500 to-yellow-600',
            'from-green-500 to-green-600',
          ];
          const bgColors = [
            'from-blue-100 to-blue-50',
            'from-purple-100 to-purple-50',
            'from-yellow-100 to-yellow-50',
            'from-green-100 to-green-50',
          ];
          const colorClass = colors[index % colors.length];
          const bgClass = bgColors[index % bgColors.length];

          return (
            <div
              key={key}
              className="group relative bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl p-6 shadow-xl shadow-gray-100/30 hover:shadow-2xl hover:shadow-gray-200/40 transition-all duration-500 hover:scale-105"
            >
              <div className={`absolute top-4 right-4 w-12 h-12 rounded-full bg-gradient-to-br ${bgClass} group-hover:scale-125 transition-transform duration-500`} />

              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-700">{label}</h3>
                  <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${colorClass} flex items-center justify-center shadow-lg`}>
                    <Image className="h-5 w-5 text-white" />
                  </div>
                </div>

                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                    {stat.total}
                  </span>
                  <span className="text-sm text-gray-500">konten</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-sm shadow-green-200" />
                  <span className="text-sm text-gray-600 font-medium">
                    {stat.active} aktif
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabbed View by Type */}
      <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl shadow-xl shadow-gray-100/30 overflow-hidden">
        <Tabs value={selectedType} onValueChange={handleTypeFilter} className="w-full">
          <div className="border-b border-gray-100/50 bg-gray-50/30 relative">
            {isFiltering && (
              <div className="absolute inset-0 bg-white/20 backdrop-blur-sm z-10 flex items-center justify-center">
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full border border-blue-200">
                  <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm font-medium text-blue-700">Memfilter...</span>
                </div>
              </div>
            )}
            <div className="w-full overflow-x-auto pb-2">
              <TabsList className="h-auto p-1 bg-transparent min-w-max flex-nowrap sm:flex-wrap w-full justify-start gap-2">
                <TabsTrigger
                  value="all"
                  disabled={isFiltering}
                  className="px-6 py-3 rounded-2xl text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-100/50 data-[state=active]:text-blue-600 data-[state=active]:border-blue-200 bg-gray-100/50 text-gray-600 border border-transparent transition-all duration-300 hover:bg-gray-100/70 whitespace-nowrap"
                >
                  <div className="flex items-center gap-2">
                    <span>Semua Konten</span>
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                  </div>
                </TabsTrigger>
                {Object.entries(contentTypes).map(([key, label]) => (
                  <TabsTrigger
                    key={key}
                    value={key}
                    disabled={isFiltering}
                    className="px-6 py-3 rounded-2xl text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-100/50 data-[state=active]:text-blue-600 data-[state=active]:border-blue-200 bg-gray-100/50 text-gray-600 border border-transparent transition-all duration-300 hover:bg-gray-100/70 whitespace-nowrap"
                  >
                    <div className="flex items-center gap-2">
                      <span>{label}</span>
                      {statistics[key]?.total > 0 && (
                        <div className="w-5 h-5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold flex items-center justify-center">
                          {statistics[key]?.total}
                        </div>
                      )}
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </div>

          <TabsContent value={selectedType} className="p-4 sm:p-8">
            <div className="bg-white/60 backdrop-blur-sm border border-white/50 rounded-2xl p-4 sm:p-6 shadow-inner">
              <div className="overflow-x-auto">
                <DataTable
                  data={contents}
                  columns={columns}
                  searchable
                  searchPlaceholder="Cari konten..."
                  searchValue={filters.search}
                  filters={filterConfigs}
                  filterValues={{ type: selectedType === 'all' ? '' : selectedType, status: filters.status }}
                  bulkActions={bulkActions}
                  sortColumn={filters.sort}
                  sortDirection={filters.direction as 'asc' | 'desc'}
                  baseUrl={route('admin.profile-content.index')}
                  onBulkAction={handleBulkAction}
                  emptyMessage="Belum ada konten profil"
                  className="data-table-modern"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}