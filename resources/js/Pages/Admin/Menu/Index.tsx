import React, { useState, useCallback } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
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
import { SortableMenuItem } from './components/SortableMenuItem';
import { Plus, Menu as MenuIcon, LayoutGrid } from 'lucide-react';

interface MenuItem {
  id: number;
  label: string;
  url: string | null;
  parent_id: number | null;
  order: number;
  location: string;
  icon: string | null;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
  children?: MenuItem[];
}

interface LocationStats {
  total: number;
  visible: number;
  root: number;
}

interface Props {
  menus: MenuItem[];
  filters: {
    location: string;
  };
  locations: Record<string, string>;
  statistics: Record<string, LocationStats>;
  maxDepth: number;
}

export default function Index({ menus, filters, locations, statistics }: Props) {
  const [items, setItems] = useState(menus);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleLocationChange = useCallback((location: string) => {
    router.get(route('admin.menu.index'), { location }, { preserveState: true });
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newItems = arrayMove(items, oldIndex, newIndex);
        setItems(newItems);

        // Send reorder request to server
        const reorderData = newItems.map((item, index) => ({
          id: item.id,
          order: index,
        }));

        router.post(route('admin.menu.reorder'), { items: reorderData }, {
          preserveState: true,
          preserveScroll: true,
        });
      }
    }
  }, [items]);

  const handleDelete = useCallback((id: number) => {
    if (confirm('Hapus menu ini? Semua submenu juga akan dihapus.')) {
      router.delete(route('admin.menu.destroy', id));
    }
  }, []);

  const handleToggleVisible = useCallback((id: number) => {
    router.post(route('admin.menu.toggle-visible', id), {}, {
      preserveState: true,
      preserveScroll: true,
    });
  }, []);

  // Update items when menus data changes
  React.useEffect(() => {
    setItems(menus);
  }, [menus]);

  // Flatten items for sortable context (only root level)
  const rootItemIds = items.map((item) => item.id);

  const breadcrumbs = [
    { label: 'Menu' }
  ];

  return (
    <AdminLayout title="Kelola Menu" breadcrumbs={breadcrumbs}>
      <Head title="Kelola Menu" />

      {/* Hero Section with Glassmorphism */}
      <div className="relative mb-12">
        {/* Soft background with subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl" />

        {/* Floating soft elements */}
        <div className="absolute top-8 left-8 w-20 h-20 rounded-full bg-blue-100 opacity-60 blur-xl animate-pulse" />
        <div className="absolute bottom-8 right-12 w-16 h-16 rounded-full bg-purple-100 opacity-50 blur-xl animate-pulse" style={{ animationDelay: '1s' }} />

        {/* Main content container */}
        <div className="relative bg-white/60 backdrop-blur-sm border border-white/20 rounded-3xl p-10 shadow-2xl shadow-blue-100/50">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-blue-50 rounded-full border border-blue-100">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-sm font-medium text-blue-700">Sistem Manajemen Menu</span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-blue-500 to-white bg-clip-text text-transparent leading-tight">
                Manajemen Menu
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Kelola navigasi website dengan struktur <span className="font-semibold text-blue-600 mx-1">hierarki</span> yang
                <span className="font-semibold text-purple-600 mx-1">intuitif</span> dan
                <span className="font-semibold text-yellow-600 mx-1">efisien</span>
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                asChild
                className="group relative overflow-hidden bg-white border-2 border-purple-200 text-purple-600 hover:text-white hover:border-purple-400 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-200/50 px-8 py-4 rounded-2xl text-lg font-medium"
              >
                <Link href={route('admin.menu.create', { location: filters.location })} className="flex items-center">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <Plus className="h-5 w-5 mr-3 relative z-10 group-hover:rotate-90 transition-transform duration-500" />
                  <span className="relative z-10">Tambah Menu</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* Total Menu Card */}
        <div className="group relative bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl p-6 shadow-xl shadow-blue-100/30 hover:shadow-2xl hover:shadow-blue-200/40 transition-all duration-500 hover:scale-105">
          <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 group-hover:scale-125 transition-transform duration-500" />

          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700">Total Menu</h3>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <MenuIcon className="h-5 w-5 text-white" />
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                {statistics.all?.total || 0}
              </span>
              <span className="text-sm text-gray-500">menu</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-sm shadow-green-200" />
              <span className="text-sm text-gray-600 font-medium">
                {statistics.all?.visible || 0} ditampilkan
              </span>
            </div>
          </div>
        </div>

        {/* Location Cards */}
        {Object.entries(locations).map(([key, label], index) => {
          const colors = [
            'from-blue-500 to-blue-600',
            'from-purple-500 to-purple-600',
            'from-yellow-500 to-yellow-600',
          ];
          const bgColors = [
            'from-blue-100 to-blue-50',
            'from-purple-100 to-purple-50',
            'from-yellow-100 to-yellow-50',
          ];
          const colorClass = colors[index % colors.length];
          const bgClass = bgColors[index % bgColors.length];
          const stat = statistics[key] || { total: 0, root: 0, visible: 0 };

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
                    <LayoutGrid className="h-5 w-5 text-white" />
                  </div>
                </div>

                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                    {stat.total}
                  </span>
                  <span className="text-sm text-gray-500">menu</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-sm shadow-green-200" />
                  <span className="text-sm text-gray-600 font-medium">
                    {stat.root} utama, {stat.visible} ditampilkan
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabbed View by Location */}
      <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl shadow-xl shadow-gray-100/30 overflow-hidden">
        <Tabs value={filters.location} onValueChange={handleLocationChange} className="w-full">
          <div className="border-b border-gray-100/50 bg-gray-50/30">
            <TabsList className="h-auto p-1 bg-transparent w-full justify-start flex-wrap gap-2">
              {Object.entries(locations).map(([key, label]) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="px-6 py-3 rounded-2xl text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-100/50 data-[state=active]:text-blue-600 data-[state=active]:border-blue-200 bg-gray-100/50 text-gray-600 border border-transparent transition-all duration-300"
                >
                  <div className="flex items-center gap-2">
                    <LayoutGrid className="h-4 w-4" />
                    <span>{label}</span>
                    {statistics[key]?.total > 0 && (
                      <div className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                        {statistics[key]?.total}
                      </div>
                    )}
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {Object.keys(locations).map((location) => (
            <TabsContent key={location} value={location} className="p-8">
              {items.length === 0 ? (
                <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-3xl p-16 text-center">
                  <div className="w-20 h-20 rounded-full bg-gray-200 mx-auto mb-6 flex items-center justify-center">
                    <MenuIcon className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-3">
                    Belum ada menu untuk lokasi ini
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Tambahkan menu pertama untuk memulai navigasi {locations[location].toLowerCase()}
                  </p>
                  <Button
                    asChild
                    className="group relative overflow-hidden bg-white border-2 border-blue-200 text-blue-600 hover:text-white hover:border-blue-400 transition-all duration-500 hover:shadow-lg hover:shadow-blue-200/50 px-6 py-3 rounded-2xl font-medium"
                  >
                    <Link href={route('admin.menu.create', { location })} className="flex items-center">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <Plus className="h-4 w-4 mr-2 relative z-10" />
                      <span className="relative z-10">Tambah Menu Pertama</span>
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="bg-white/60 backdrop-blur-sm border-2 border-gray-200 rounded-2xl p-6">
                  <div className="bg-blue-50/80 backdrop-blur-sm border border-blue-200 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-blue-800">
                          Drag & Drop untuk Mengubah Urutan
                        </p>
                        <p className="text-xs text-blue-600">
                          Seret dan lepas untuk mengatur posisi menu
                        </p>
                      </div>
                    </div>
                  </div>

                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext items={rootItemIds} strategy={verticalListSortingStrategy}>
                      <div className="space-y-4">
                        {items.map((menu) => (
                          <SortableMenuItem
                            key={menu.id}
                            menu={menu}
                            onDelete={handleDelete}
                            onToggleVisible={handleToggleVisible}
                            locations={locations}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AdminLayout>
  );
}
