import React, { useCallback } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { DataTable, ColumnDef, PaginatedData, BulkAction } from '@/Components/Admin/DataTable';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { 
  Plus, Eye, Pencil, Trash2, Check, X, FileText, 
  TrendingUp, Clock, Star, ChevronRight, Newspaper
} from 'lucide-react';

interface Berita {
  id: number;
  judul_utama: string;
  slug: string;
  kategori: string | null;
  is_published: boolean;
  is_featured: boolean;
  view_count: number;
  tanggal_rilis: string | null;
  created_at: string;
  hero_image: string | null;
}

interface Props {
  berita: PaginatedData<Berita>;
  filters: {
    search: string;
    status: string;
    kategori: string;
    featured: string;
    sort: string;
    direction: string;
  };
  categories: string[];
}

export default function Index({ berita, filters, categories }: Props) {
  const columns: ColumnDef<Berita>[] = [
    {
      key: 'judul_utama',
      label: 'Judul',
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-4">
          {row.hero_image ? (
            <img
              src={row.hero_image}
              alt=""
              className="w-14 h-14 object-cover rounded-lg border border-gray-200 shadow-sm flex-shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0">
              <FileText className="h-6 w-6 text-gray-400" />
            </div>
          )}
          <div className="min-w-0">
            <p className="font-medium text-gray-900 line-clamp-1 max-w-xs">{row.judul_utama}</p>
            <p className="text-sm text-gray-500 line-clamp-1">{row.slug}</p>
            {row.is_featured && (
              <span className="inline-flex items-center gap-1 mt-1 text-xs text-amber-600">
                <Star className="h-3 w-3 fill-amber-500" />
                Featured
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'kategori',
      label: 'Kategori',
      sortable: true,
      render: (value) => value ? (
        <Badge className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
          {value as string}
        </Badge>
      ) : (
        <span className="text-gray-400">-</span>
      ),
    },
    {
      key: 'is_published',
      label: 'Status',
      sortable: true,
      render: (value) => (
        <Badge 
          className={value 
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
            : 'bg-gray-100 text-gray-600 border-gray-200'
          }
        >
          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${value ? 'bg-emerald-500' : 'bg-gray-400'}`} />
          {value ? 'Published' : 'Draft'}
        </Badge>
      ),
    },
    {
      key: 'view_count',
      label: 'Views',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-1.5 text-gray-600">
          <Eye className="h-4 w-4 text-gray-400" />
          <span>{(value as number).toLocaleString()}</span>
        </div>
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
          <p className="text-gray-500 text-xs">
            {new Date(value as string).toLocaleTimeString('id-ID', {
              hour: '2-digit',
              minute: '2-digit',
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
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
            asChild
          >
            <Link href={route('admin.berita.show', row.id)}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-gray-500 hover:text-amber-600 hover:bg-amber-50"
            asChild
          >
            <Link href={route('admin.berita.edit', row.id)}>
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
      key: 'publish',
      label: 'Publish',
      icon: <Check className="h-4 w-4 mr-1" />,
      confirmMessage: 'Publish semua berita yang dipilih?',
    },
    {
      key: 'unpublish',
      label: 'Unpublish',
      icon: <X className="h-4 w-4 mr-1" />,
      confirmMessage: 'Unpublish semua berita yang dipilih?',
    },
    {
      key: 'delete',
      label: 'Hapus',
      icon: <Trash2 className="h-4 w-4 mr-1" />,
      variant: 'destructive',
      confirmMessage: 'Hapus semua berita yang dipilih? Aksi ini tidak dapat dibatalkan.',
    },
  ];

  const filterConfigs = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'published', label: 'Published' },
        { value: 'draft', label: 'Draft' },
      ],
    },
    {
      key: 'kategori',
      label: 'Kategori',
      options: categories.map((cat) => ({ value: cat, label: cat })),
    },
  ];

  const handleDelete = useCallback((id: number) => {
    if (confirm('Hapus berita ini?')) {
      router.delete(route('admin.berita.destroy', id));
    }
  }, []);

  const handleBulkAction = useCallback((action: string, ids: (number | string)[]) => {
    router.post(route('admin.berita.bulk-action'), {
      action,
      ids,
    });
  }, []);

  const breadcrumbs = [
    { label: 'Berita' }
  ];

  // Calculate stats
  const totalBerita = berita.total || 0;
  const publishedCount = berita.data.filter(b => b.is_published).length;
  const draftCount = berita.data.filter(b => !b.is_published).length;
  const featuredCount = berita.data.filter(b => b.is_featured).length;

  return (
    <AdminLayout title="Kelola Berita" breadcrumbs={breadcrumbs}>
      <Head title="Kelola Berita" />

      <div className="space-y-6">
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 p-8">
          {/* Background decorations */}
          <div className="absolute inset-0 bg-grid-white/10" />
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Newspaper className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-white">Kelola Berita</h1>
                  <p className="text-blue-100 mt-1">Publikasikan dan kelola artikel berita website</p>
                </div>
              </div>
              
              <Link 
                href={route('admin.berita.create')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:bg-blue-50 transition-all duration-200 group"
              >
                <Plus className="h-5 w-5" />
                <span>Tambah Berita</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{totalBerita}</p>
                    <p className="text-sm text-blue-100">Total Berita</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-400/30 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-emerald-100" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{publishedCount}</p>
                    <p className="text-sm text-blue-100">Published</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-400/30 rounded-lg">
                    <Clock className="h-5 w-5 text-amber-100" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{draftCount}</p>
                    <p className="text-sm text-blue-100">Draft</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-400/30 rounded-lg">
                    <Star className="h-5 w-5 text-purple-100" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{featuredCount}</p>
                    <p className="text-sm text-blue-100">Featured</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6">
            <DataTable
              data={berita}
              columns={columns}
              searchable
              searchPlaceholder="Cari berita..."
              searchValue={filters.search}
              filters={filterConfigs}
              filterValues={{ status: filters.status, kategori: filters.kategori }}
              bulkActions={bulkActions}
              sortColumn={filters.sort}
              sortDirection={filters.direction as 'asc' | 'desc'}
              baseUrl={route('admin.berita.index')}
              onBulkAction={handleBulkAction}
              emptyMessage="Belum ada berita"
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
