import React, { useState, useCallback } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Input } from '@/Components/ui/input';
import { Checkbox } from '@/Components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/ui/select';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableGalleryItem } from './components/SortableGalleryItem';
import {
  Plus,
  Search,
  Star,
  Trash2,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Images,
  CheckCircle,
  XCircle,
  ChevronDown,
  GripVertical,
} from 'lucide-react';

interface Gallery {
  id: number;
  title: string;
  description: string | null;
  image: string | null;
  image_url: string | null;
  thumbnail_url: string | null;
  category: string | null;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  date: string;
}

interface PaginatedData {
  data: Gallery[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from?: number;
  to?: number;
}

interface Props {
  galleries: PaginatedData;
  filters: {
    search: string;
    category: string;
    featured: string;
    status: string;
    sort: string;
    direction: string;
  };
  categories: Record<string, string>;
  featuredCount: number;
  maxFeatured: number;
}

export default function Index({ galleries, filters, categories, featuredCount, maxFeatured }: Props) {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [localSearch, setLocalSearch] = useState(filters.search);
  const [items, setItems] = useState(galleries.data);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleSearch = useCallback(() => {
    router.get(route('admin.gallery.index'), { search: localSearch }, { preserveState: true });
  }, [localSearch]);

  const handleFilterChange = useCallback((key: string, value: string) => {
    router.get(
      route('admin.gallery.index'),
      { ...filters, [key]: value },
      { preserveState: true }
    );
  }, [filters]);

  const handleSelectAll = useCallback(() => {
    if (selectedIds.size === items.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map((item) => item.id)));
    }
  }, [items, selectedIds]);

  const handleSelectItem = useCallback((id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);

      // Send reorder request to server
      const reorderData = newItems.map((item, index) => ({
        id: item.id,
        sort_order: index,
      }));

      router.post(route('admin.gallery.reorder'), { items: reorderData }, {
        preserveState: true,
        preserveScroll: true,
      });
    }
  }, [items]);

  const handleBulkAction = useCallback((action: string) => {
    if (selectedIds.size === 0) return;

    const confirmMessages: Record<string, string> = {
      delete: 'Hapus semua gambar yang dipilih?',
      feature: 'Tandai semua gambar yang dipilih sebagai featured?',
      unfeature: 'Hapus semua gambar yang dipilih dari featured?',
      activate: 'Aktifkan semua gambar yang dipilih?',
      deactivate: 'Nonaktifkan semua gambar yang dipilih?',
    };

    if (confirm(confirmMessages[action])) {
      router.post(route('admin.gallery.bulk-action'), {
        action,
        ids: Array.from(selectedIds),
      });
      setSelectedIds(new Set());
    }
  }, [selectedIds]);

  const handleDelete = useCallback((id: number) => {
    if (confirm('Hapus gambar ini dari galeri?')) {
      router.delete(route('admin.gallery.destroy', id));
    }
  }, []);

  const handleToggleFeatured = useCallback((id: number) => {
    router.post(route('admin.gallery.toggle-featured', id), {}, {
      preserveState: true,
      preserveScroll: true,
    });
  }, []);

  const handleToggleActive = useCallback((id: number) => {
    router.post(route('admin.gallery.toggle-active', id), {}, {
      preserveState: true,
      preserveScroll: true,
    });
  }, []);

  const handlePageChange = useCallback((page: number) => {
    router.get(route('admin.gallery.index'), { ...filters, page }, { preserveState: true });
  }, [filters]);

  const breadcrumbs = [
    { label: 'Galeri' }
  ];

  // Calculate stats
  const totalImages = galleries.total || 0;
  const activeCount = items.filter(g => g.is_active).length;
  const inactiveCount = items.filter(g => !g.is_active).length;

  return (
    <AdminLayout title="Kelola Galeri" breadcrumbs={breadcrumbs}>
      <Head title="Kelola Galeri" />

      <div className="space-y-6">
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-purple-500 to-fuchsia-500 p-8">
          {/* Background decorations */}
          <div className="absolute inset-0 bg-grid-white/10" />
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-fuchsia-400/20 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Images className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-white">Galeri</h1>
                  <p className="text-purple-100 mt-1">Kelola foto dan gambar website</p>
                </div>
              </div>
              
              <Link 
                href={route('admin.gallery.create')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-purple-600 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:bg-purple-50 transition-all duration-200 group"
              >
                <Plus className="h-5 w-5" />
                <span>Tambah Gambar</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <ImageIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{totalImages}</p>
                    <p className="text-sm text-purple-100">Total Gambar</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-400/30 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-emerald-100" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{activeCount}</p>
                    <p className="text-sm text-purple-100">Aktif</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-400/30 rounded-lg">
                    <XCircle className="h-5 w-5 text-gray-200" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{inactiveCount}</p>
                    <p className="text-sm text-purple-100">Nonaktif</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-400/30 rounded-lg">
                    <Star className="h-5 w-5 text-amber-100" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{featuredCount}/{maxFeatured}</p>
                    <p className="text-sm text-purple-100">Featured</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Cari gambar..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 h-10 border-gray-200"
                />
              </div>
              
              {/* Category Filter */}
              <Select
                value={filters.category || '__all__'}
                onValueChange={(value) => handleFilterChange('category', value === '__all__' ? '' : value)}
              >
                <SelectTrigger className="w-full sm:w-[180px] h-10 border-gray-200">
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-white border shadow-lg">
                  <SelectItem value="__all__">Semua Kategori</SelectItem>
                  {Object.entries(categories).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Status Filter */}
              <Select
                value={filters.status || '__all__'}
                onValueChange={(value) => handleFilterChange('status', value === '__all__' ? '' : value)}
              >
                <SelectTrigger className="w-full sm:w-[140px] h-10 border-gray-200">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-white border shadow-lg">
                  <SelectItem value="__all__">Semua</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Nonaktif</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bulk Actions */}
            {selectedIds.size > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                  {selectedIds.size} dipilih
                </Badge>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleBulkAction('feature')}
                  className="h-9 text-amber-600 border-amber-200 hover:bg-amber-50"
                >
                  <Star className="h-4 w-4 mr-1" />
                  Featured
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleBulkAction('unfeature')}
                  className="h-9"
                >
                  Unfeature
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  onClick={() => handleBulkAction('delete')}
                  className="h-9"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Hapus
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Select All Bar */}
        {items.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-4 py-3">
            <div className="flex items-center gap-3">
              <Checkbox
                checked={selectedIds.size === items.length}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-gray-600">Pilih semua</span>
              <span className="text-xs text-gray-400">• Drag untuk mengatur urutan</span>
              <GripVertical className="h-4 w-4 text-gray-300" />
            </div>
          </div>
        )}

        {/* Gallery Grid */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6">
            {items.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <Images className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada gambar</h3>
                <p className="text-gray-500 mb-6">Mulai dengan menambahkan gambar pertama ke galeri</p>
                <Link 
                  href={route('admin.gallery.create')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium rounded-lg shadow hover:shadow-lg transition-all"
                >
                  <Plus className="h-4 w-4" />
                  Tambah Gambar
                </Link>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={items.map((i) => i.id)} strategy={rectSortingStrategy}>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {items.map((gallery) => (
                      <SortableGalleryItem
                        key={gallery.id}
                        gallery={gallery}
                        isSelected={selectedIds.has(gallery.id)}
                        onSelect={handleSelectItem}
                        onDelete={handleDelete}
                        onToggleFeatured={handleToggleFeatured}
                        onToggleActive={handleToggleActive}
                        categories={categories}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        </div>

        {/* Pagination */}
        {galleries.last_page > 1 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-6 py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Menampilkan <span className="font-medium">{galleries.from || 1}</span> - <span className="font-medium">{galleries.to || items.length}</span> dari <span className="font-medium">{galleries.total}</span> gambar
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(galleries.current_page - 1)}
                  disabled={galleries.current_page === 1}
                  className="h-9"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Prev
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: galleries.last_page }, (_, i) => i + 1)
                    .filter(page => {
                      const current = galleries.current_page;
                      return page === 1 || page === galleries.last_page || (page >= current - 1 && page <= current + 1);
                    })
                    .map((page, index, array) => (
                      <React.Fragment key={page}>
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="px-2 text-gray-400">...</span>
                        )}
                        <Button
                          variant={galleries.current_page === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className={`h-9 w-9 p-0 ${galleries.current_page === page ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                        >
                          {page}
                        </Button>
                      </React.Fragment>
                    ))
                  }
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(galleries.current_page + 1)}
                  disabled={galleries.current_page === galleries.last_page}
                  className="h-9"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
