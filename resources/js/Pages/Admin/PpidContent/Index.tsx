import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/Components/ui/table';
import { Badge } from '@/Components/ui/badge';
import { Checkbox } from '@/Components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  FileText,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Layers,
  FolderTree,
} from 'lucide-react';

interface PpidContent {
  id: number;
  title: string;
  slug: string;
  category: string;
  sub_category: string | null;
  status: 'draft' | 'published';
  is_active: boolean;
  created_at: string;
  published_at: string | null;
  category_label: string;
  sub_category_label: string | null;
  creator?: {
    id: number;
    name: string;
  };
}

interface PaginatedData {
  data: PpidContent[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

interface Statistics {
  [key: string]: {
    total: number;
    published: number;
    draft: number;
    active: number;
  };
}

interface Props {
  contents: PaginatedData;
  filters: {
    search: string;
    category: string;
    sub_category: string;
    status: string;
    sort: string;
    direction: string;
  };
  categories: Record<string, string>;
  subCategories: Record<string, string>;
  statistics: Statistics;
}

export default function Index({
  contents,
  filters,
  categories,
  subCategories,
  statistics,
}: Props) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [search, setSearch] = useState(filters.search);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get(route('admin.ppid-content.index'), { ...filters, search }, { preserveState: true });
  };

  const handleFilter = (key: string, value: string) => {
    router.get(
      route('admin.ppid-content.index'),
      { ...filters, [key]: value, page: 1 },
      { preserveState: true }
    );
  };

  const handleSort = (column: string) => {
    const direction = filters.sort === column && filters.direction === 'asc' ? 'desc' : 'asc';
    router.get(
      route('admin.ppid-content.index'),
      { ...filters, sort: column, direction },
      { preserveState: true }
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(contents.data.map((c) => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedIds.length === 0) return;
    
    if (action === 'delete' && !confirm(`Hapus ${selectedIds.length} konten yang dipilih?`)) {
      return;
    }

    router.post(route('admin.ppid-content.bulk-action'), {
      action,
      ids: selectedIds,
    }, {
      onSuccess: () => setSelectedIds([]),
    });
  };

  const handleDelete = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus konten ini?')) {
      router.delete(route('admin.ppid-content.destroy', id));
    }
  };

  const handleToggleActive = (id: number) => {
    router.post(route('admin.ppid-content.toggle-active', id));
  };

  const resetFilters = () => {
    router.get(route('admin.ppid-content.index'));
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      profil: 'bg-blue-100 text-blue-700',
      informasi_publik: 'bg-green-100 text-green-700',
      permohonan: 'bg-amber-100 text-amber-700',
      keberatan: 'bg-red-100 text-red-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <AdminLayout>
      <Head title="Kelola Konten PPID" />

      <div className="space-y-6">
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 via-emerald-500 to-green-500 p-6 lg:p-8">
          <div className="absolute inset-0 bg-grid-white/10" />
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-green-400/20 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <FolderTree className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-white">Konten PPID</h1>
                  <p className="text-emerald-100 mt-1">
                    Kelola konten hierarkis PPID (Profil, Informasi Publik, Permohonan, Keberatan)
                  </p>
                </div>
              </div>
              <Button
                asChild
                className="bg-white text-teal-600 hover:bg-teal-50 shadow-lg"
              >
                <Link href={route('admin.ppid-content.create')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Konten
                </Link>
              </Button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <p className="text-emerald-100 text-sm">Total Konten</p>
                <p className="text-2xl font-bold text-white">{statistics.all?.total || 0}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <p className="text-emerald-100 text-sm">Dipublikasi</p>
                <p className="text-2xl font-bold text-white">{statistics.all?.published || 0}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <p className="text-emerald-100 text-sm">Draft</p>
                <p className="text-2xl font-bold text-white">{statistics.all?.draft || 0}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <p className="text-emerald-100 text-sm">Aktif</p>
                <p className="text-2xl font-bold text-white">{statistics.all?.active || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari judul konten..."
                  className="pl-10"
                />
              </div>
            </form>

            <div className="flex flex-wrap gap-3">
              <Select
                value={filters.category || 'all'}
                onValueChange={(v) => handleFilter('category', v === 'all' ? '' : v)}
              >
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {Object.entries(categories).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {filters.category === 'informasi_publik' && (
                <Select
                  value={filters.sub_category || 'all'}
                  onValueChange={(v) => handleFilter('sub_category', v === 'all' ? '' : v)}
                >
                  <SelectTrigger className="w-[180px]">
                    <Layers className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Sub-Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Sub-Kategori</SelectItem>
                    {Object.entries(subCategories).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <Select
                value={filters.status || 'all'}
                onValueChange={(v) => handleFilter('status', v === 'all' ? '' : v)}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="published">Dipublikasi</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={resetFilters}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 flex items-center justify-between">
            <span className="text-teal-700 font-medium">
              {selectedIds.length} konten dipilih
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction('publish')}
              >
                Publikasi
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction('draft')}
              >
                Jadikan Draft
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction('activate')}
              >
                Aktifkan
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction('deactivate')}
              >
                Nonaktifkan
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleBulkAction('delete')}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Hapus
              </Button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedIds.length === contents.data.length && contents.data.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('title')}
                >
                  Judul
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('category')}
                >
                  Kategori
                </TableHead>
                <TableHead>Sub-Kategori</TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('status')}
                >
                  Status
                </TableHead>
                <TableHead>Aktif</TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('created_at')}
                >
                  Tanggal
                </TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contents.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12">
                    <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Belum ada konten PPID</p>
                    <Button asChild className="mt-4" variant="outline">
                      <Link href={route('admin.ppid-content.create')}>
                        <Plus className="h-4 w-4 mr-2" />
                        Tambah Konten Pertama
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                contents.data.map((content) => (
                  <TableRow key={content.id} className="hover:bg-gray-50">
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(content.id)}
                        onCheckedChange={(checked) =>
                          handleSelectOne(content.id, checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="font-medium text-gray-900 truncate">{content.title}</p>
                        <p className="text-xs text-gray-500 truncate">{content.slug}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(content.category)}>
                        {content.category_label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {content.sub_category_label ? (
                        <Badge variant="outline">{content.sub_category_label}</Badge>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={content.status === 'published' ? 'default' : 'secondary'}
                      >
                        {content.status === 'published' ? 'Dipublikasi' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleToggleActive(content.id)}
                        className="focus:outline-none"
                      >
                        {content.is_active ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-gray-300" />
                        )}
                      </button>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {new Date(content.created_at).toLocaleDateString('id-ID')}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={route('admin.ppid-content.show', content.id)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Lihat
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={route('admin.ppid-content.edit', content.id)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(content.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {contents.last_page > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Menampilkan {contents.from} - {contents.to} dari {contents.total} konten
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={contents.current_page === 1}
                  onClick={() =>
                    router.get(route('admin.ppid-content.index'), {
                      ...filters,
                      page: contents.current_page - 1,
                    })
                  }
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={contents.current_page === contents.last_page}
                  onClick={() =>
                    router.get(route('admin.ppid-content.index'), {
                      ...filters,
                      page: contents.current_page + 1,
                    })
                  }
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
