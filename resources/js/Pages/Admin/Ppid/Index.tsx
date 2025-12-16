import React, { useCallback } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { DataTable, ColumnDef, PaginatedData, BulkAction } from '@/Components/Admin/DataTable';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { 
  Plus, Eye, Pencil, Trash2, Download, FileText, Check, X, 
  ChevronRight, FolderOpen, FileCheck, Clock, TrendingUp
} from 'lucide-react';

interface PpidDocument {
  id: number;
  title: string;
  category: string;
  file_path: string;
  file_type: string;
  file_size: number;
  file_size_formatted: string;
  file_url: string | null;
  download_count: number;
  is_active: boolean;
  created_at: string;
}

interface CategoryStats {
  total: number;
  active: number;
  total_downloads: number;
}

interface Props {
  documents: PaginatedData<PpidDocument>;
  filters: {
    search: string;
    category: string;
    status: string;
    sort: string;
    direction: string;
  };
  categories: Record<string, string>;
  statistics: Record<string, CategoryStats>;
}

export default function Index({ documents, filters, categories, statistics }: Props) {
  const columns: ColumnDef<PpidDocument>[] = [
    {
      key: 'title',
      label: 'Judul Dokumen',
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-100 flex items-center justify-center flex-shrink-0">
            <FileText className="h-6 w-6 text-teal-600" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-gray-900 line-clamp-1 max-w-xs">{row.title}</p>
            <p className="text-sm text-gray-500 uppercase">{row.file_type}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Kategori',
      sortable: true,
      render: (value) => (
        <Badge className="bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100">
          {categories[value as string] || String(value)}
        </Badge>
      ),
    },
    {
      key: 'file_size_formatted',
      label: 'Ukuran',
      render: (value) => (
        <span className="text-gray-600">{value as string}</span>
      ),
    },
    {
      key: 'download_count',
      label: 'Downloads',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-1.5 text-gray-600">
          <Download className="h-4 w-4 text-gray-400" />
          <span className="font-medium">{(value as number).toLocaleString()}</span>
        </div>
      ),
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (value) => (
        <Badge 
          className={value 
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
            : 'bg-gray-100 text-gray-600 border-gray-200'
          }
        >
          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${value ? 'bg-emerald-500' : 'bg-gray-400'}`} />
          {value ? 'Aktif' : 'Nonaktif'}
        </Badge>
      ),
    },
    {
      key: 'created_at',
      label: 'Tanggal',
      sortable: true,
      render: (value) => (
        <div className="text-sm">
          <p className="text-gray-900">
            {new Date(value as string).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </p>
        </div>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (_, row) => (
        <div className="flex items-center gap-1 justify-end">
          {row.file_url && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-gray-500 hover:text-teal-600 hover:bg-teal-50"
              asChild
            >
              <a href={route('admin.ppid.download', { ppid: row.id })} target="_blank">
                <Download className="h-4 w-4" />
              </a>
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
            asChild
          >
            <Link href={route('admin.ppid.show', { ppid: row.id })}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-gray-500 hover:text-amber-600 hover:bg-amber-50"
            asChild
          >
            <Link href={route('admin.ppid.edit', { ppid: row.id })}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50"
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
      options: Object.entries(categories).map(([value, label]) => ({ value, label })),
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
    // Validate ID before proceeding
    if (!id || id === undefined) {
      console.error('Invalid ID for delete:', id);
      alert('Error: ID dokumen tidak valid');
      return;
    }
    
    if (confirm('Hapus dokumen ini?')) {
      // Ensure ID is passed correctly to the route
      const deleteUrl = route('admin.ppid.destroy', { ppid: id });
      console.log('Delete URL:', deleteUrl, 'ID:', id);
      router.delete(deleteUrl);
    }
  }, []);

  const handleBulkAction = useCallback((action: string, ids: (number | string)[]) => {
    router.post(route('admin.ppid.bulk-action'), {
      action,
      ids,
    });
  }, []);

  const handleCategoryFilter = useCallback((category: string) => {
    router.get(route('admin.ppid.index'), {
      ...filters,
      category: category === 'all' ? '' : category,
    }, { preserveState: true });
  }, [filters]);

  const breadcrumbs = [
    { label: 'PPID' }
  ];

  return (
    <AdminLayout title="Kelola Dokumen PPID" breadcrumbs={breadcrumbs}>
      <Head title="Kelola Dokumen PPID" />

      <div className="space-y-6">
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 via-emerald-500 to-green-500 p-8">
          {/* Background decorations */}
          <div className="absolute inset-0 bg-grid-white/10" />
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-green-400/20 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <FolderOpen className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-white">Dokumen PPID</h1>
                  <p className="text-emerald-100 mt-1">Kelola dokumen keterbukaan informasi publik</p>
                </div>
              </div>
              
              <Link 
                href={route('admin.ppid.create')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-teal-600 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:bg-teal-50 transition-all duration-200 group"
              >
                <Plus className="h-5 w-5" />
                <span>Tambah Dokumen</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-8">
              {/* Total Card */}
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <FileCheck className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{statistics.all?.total || 0}</p>
                    <p className="text-sm text-emerald-100">Total</p>
                  </div>
                </div>
              </div>
              
              {/* Category Cards */}
              {Object.entries(categories).slice(0, 4).map(([key, label], index) => {
                const icons = [Clock, FileText, TrendingUp, Eye];
                const IconComponent = icons[index % icons.length];
                return (
                  <div key={key} className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">{statistics[key]?.total || 0}</p>
                        <p className="text-sm text-emerald-100 truncate max-w-[80px]" title={label}>
                          {label.split(' ').slice(-1)[0]}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tabbed View */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <Tabs defaultValue={filters.category || 'all'} onValueChange={handleCategoryFilter}>
            <div className="px-6 pt-4 border-b border-gray-100">
              <TabsList className="bg-gray-100/80 p-1">
                <TabsTrigger 
                  value="all" 
                  className="data-[state=active]:bg-white data-[state=active]:text-teal-600 data-[state=active]:shadow-sm"
                >
                  Semua
                </TabsTrigger>
                {Object.entries(categories).map(([key, label]) => (
                  <TabsTrigger 
                    key={key} 
                    value={key}
                    className="data-[state=active]:bg-white data-[state=active]:text-teal-600 data-[state=active]:shadow-sm"
                  >
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent value={filters.category || 'all'} className="p-6 pt-4">
              <DataTable
                data={documents}
                columns={columns}
                searchable
                searchPlaceholder="Cari dokumen..."
                searchValue={filters.search}
                filters={filterConfigs}
                filterValues={{ category: filters.category, status: filters.status }}
                bulkActions={bulkActions}
                sortColumn={filters.sort}
                sortDirection={filters.direction as 'asc' | 'desc'}
                baseUrl={route('admin.ppid.index')}
                onBulkAction={handleBulkAction}
                emptyMessage="Belum ada dokumen PPID"
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminLayout>
  );
}
