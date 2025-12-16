import React, { useState, useCallback } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Checkbox } from '@/Components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
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
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableSsdItem } from './components/SortableSsdItem';
import {
  Plus,
  Search,
  Trash2,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  ChevronRight as ArrowRight,
  MessageCircleQuestion,
  TrendingUp,
} from 'lucide-react';

interface Ssd {
  id: string;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

interface PaginatedData {
  data: Ssd[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from?: number;
  to?: number;
}

interface CategoryStats {
  total: number;
  active: number;
}

interface Props {
  ssds: PaginatedData;
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

export default function Index({ ssds, filters, categories, statistics }: Props) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [localSearch, setLocalSearch] = useState(filters.search);
  const [items, setItems] = useState(ssds.data);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleSearch = useCallback(() => {
    router.get(route('admin.ssd.index'), { ...filters, search: localSearch }, { preserveState: true });
  }, [localSearch, filters]);

  const handleFilterChange = useCallback((key: string, value: string) => {
    router.get(
      route('admin.ssd.index'),
      { ...filters, [key]: value },
      { preserveState: true }
    );
  }, [filters]);

  const handleCategoryFilter = useCallback((category: string) => {
    router.get(route('admin.ssd.index'), {
      ...filters,
      category: category === 'all' ? '' : category,
    }, { preserveState: true });
  }, [filters]);

  const handleSelectAll = useCallback(() => {
    if (selectedIds.size === items.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map((item) => item.id)));
    }
  }, [items, selectedIds]);

  const handleSelectItem = useCallback((id: string) => {
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

      router.post(route('admin.ssd.reorder'), { items: reorderData }, {
        preserveState: true,
        preserveScroll: true,
      });
    }
  }, [items]);

  const handleBulkAction = useCallback((action: string) => {
    if (selectedIds.size === 0) return;

    const confirmMessages: Record<string, string> = {
      delete: 'Hapus semua FAQ yang dipilih?',
      activate: 'Aktifkan semua FAQ yang dipilih?',
      deactivate: 'Nonaktifkan semua FAQ yang dipilih?',
    };

    if (confirm(confirmMessages[action])) {
      router.post(route('admin.ssd.bulk-action'), {
        action,
        ids: Array.from(selectedIds),
      });
      setSelectedIds(new Set());
    }
  }, [selectedIds]);

  const handleDelete = useCallback((id: string) => {
    if (confirm('Hapus FAQ ini?')) {
      router.delete(route('admin.ssd.destroy', id));
    }
  }, []);

  const handleToggleActive = useCallback((id: string) => {
    router.post(route('admin.ssd.toggle-active', id), {}, {
      preserveState: true,
      preserveScroll: true,
    });
  }, []);

  const handlePageChange = useCallback((page: number) => {
    router.get(route('admin.ssd.index'), { ...filters, page }, { preserveState: true });
  }, [filters]);

  // Update items when ssds data changes
  React.useEffect(() => {
    setItems(ssds.data);
  }, [ssds.data]);

  const breadcrumbs = [
    { label: 'SSD (FAQ)' }
  ];

  // Calculate totals
  const totalFAQ = statistics.all?.total || 0;
  const activeFAQ = statistics.all?.active || 0;
  const inactiveFAQ = totalFAQ - activeFAQ;

  return (
    <AdminLayout title="Kelola SSD (FAQ)" breadcrumbs={breadcrumbs}>
      <Head title="Kelola SSD (FAQ)" />

      <div className="space-y-6">
        {/* Hero Header with Stats */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 p-8">
          {/* Background decorations */}
          <div className="absolute inset-0 bg-grid-white/10" />
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl" />
          
          <div className="relative">
            {/* Header content */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <MessageCircleQuestion className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1">
                    Soal Sering Ditanya
                  </h1>
                  <p className="text-white/80 text-sm lg:text-base">
                    Kelola pertanyaan yang sering diajukan oleh masyarakat
                  </p>
                </div>
              </div>
              
              <Link
                href={route('admin.ssd.create')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-orange-600 font-semibold rounded-xl hover:bg-orange-50 transition-colors shadow-lg shadow-orange-600/20 self-start"
              >
                <Plus className="h-4 w-4" />
                Tambah FAQ
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {/* Total FAQ */}
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                    <HelpCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{totalFAQ}</p>
                    <p className="text-white/70 text-xs">Total FAQ</p>
                  </div>
                </div>
              </div>
              
              {/* Active */}
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-400/30 flex items-center justify-center">
                    <Check className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{activeFAQ}</p>
                    <p className="text-white/70 text-xs">Aktif</p>
                  </div>
                </div>
              </div>
              
              {/* Inactive */}
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-400/30 flex items-center justify-center">
                    <X className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{inactiveFAQ}</p>
                    <p className="text-white/70 text-xs">Nonaktif</p>
                  </div>
                </div>
              </div>
              
              {/* Categories */}
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-400/30 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{Object.keys(categories).length}</p>
                    <p className="text-white/70 text-xs">Kategori</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Filters Bar */}
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-1 gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Cari pertanyaan..."
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-9 bg-white border-gray-200 focus:border-orange-400 focus:ring-orange-400/20"
                  />
                </div>
                <Select
                  value={filters.status || '__all__'}
                  onValueChange={(value) => handleFilterChange('status', value === '__all__' ? '' : value)}
                >
                  <SelectTrigger className="w-[140px] bg-white border-gray-200">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-white">
                    <SelectItem value="__all__">Semua</SelectItem>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="inactive">Nonaktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bulk Actions */}
              {selectedIds.size > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 font-medium">
                    {selectedIds.size} item dipilih
                  </span>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleBulkAction('activate')}
                    className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Aktifkan
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleBulkAction('deactivate')}
                    className="border-gray-200 text-gray-600 hover:bg-gray-50"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Nonaktifkan
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={() => handleBulkAction('delete')}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Hapus
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Tabbed View by Category */}
          <Tabs defaultValue={filters.category || 'all'} onValueChange={handleCategoryFilter}>
            <div className="border-b border-gray-100 px-4">
              <TabsList className="flex-wrap h-auto bg-transparent gap-1 p-0">
                <TabsTrigger 
                  value="all"
                  className="px-4 py-2.5 text-sm font-medium text-gray-600 data-[state=active]:text-orange-600 data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:bg-transparent rounded-none bg-transparent hover:text-orange-600 transition-colors"
                >
                  Semua
                </TabsTrigger>
                {Object.entries(categories).map(([key, label]) => (
                  <TabsTrigger 
                    key={key} 
                    value={key}
                    className="px-4 py-2.5 text-sm font-medium text-gray-600 data-[state=active]:text-orange-600 data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:bg-transparent rounded-none bg-transparent hover:text-orange-600 transition-colors"
                  >
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent value={filters.category || 'all'} className="p-4">
              {/* Select All */}
              {items.length > 0 && (
                <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                  <Checkbox
                    checked={selectedIds.size === items.length && items.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                  <span className="text-sm text-gray-600 font-medium">Pilih semua</span>
                  <span className="text-xs text-gray-400">({items.length} item)</span>
                </div>
              )}

              {/* FAQ List with Drag & Drop */}
              {items.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center mb-4">
                    <MessageCircleQuestion className="h-10 w-10 text-orange-400" />
                  </div>
                  <h3 className="text-gray-900 font-semibold mb-2">Belum ada FAQ</h3>
                  <p className="text-gray-500 text-sm mb-6">Mulai tambahkan pertanyaan yang sering diajukan</p>
                  <Link
                    href={route('admin.ssd.create')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Tambah FAQ Pertama
                  </Link>
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                      {items.map((ssd) => (
                        <SortableSsdItem
                          key={ssd.id}
                          ssd={ssd}
                          isSelected={selectedIds.has(ssd.id)}
                          onSelect={handleSelectItem}
                          onDelete={handleDelete}
                          onToggleActive={handleToggleActive}
                          categories={categories}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}

              {/* Pagination */}
              {ssds.last_page > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-500">
                    Menampilkan {ssds.from || 1} - {ssds.to || items.length} dari {ssds.total} FAQ
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(ssds.current_page - 1)}
                      disabled={ssds.current_page === 1}
                      className="h-9 w-9 border-gray-200"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg">
                      {ssds.current_page} / {ssds.last_page}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(ssds.current_page + 1)}
                      disabled={ssds.current_page === ssds.last_page}
                      className="h-9 w-9 border-gray-200"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminLayout>
  );
}
