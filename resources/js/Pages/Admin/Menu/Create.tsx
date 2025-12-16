import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Switch } from '@/Components/ui/switch';
import { Badge } from '@/Components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/ui/select';
import {
  ArrowLeft,
  Save,
  Plus,
  Settings,
  Globe,
  Link as LinkIcon,
  Type,
  Eye,
  EyeOff,
  Info,
  Check
} from 'lucide-react';

interface ParentMenu {
  id: number;
  label: string;
}

interface Props {
  locations: Record<string, string>;
  parentMenus: ParentMenu[];
  defaultLocation: string;
}

export default function Create({ locations, parentMenus, defaultLocation }: Props) {
  // Get parent_id from URL if provided
  const urlParams = new URLSearchParams(window.location.search);
  const defaultParentId = urlParams.get('parent_id');

  const { data, setData, post, processing, errors } = useForm({
    label: '',
    url: '',
    parent_id: defaultParentId || '',
    location: defaultLocation,
    icon: '',
    is_visible: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('admin.menu.store'));
  };

  const breadcrumbs = [
    { label: 'Menu' },
    { label: 'Tambah Menu' }
  ];

  return (
    <AdminLayout title="Tambah Menu" breadcrumbs={breadcrumbs}>
      <Head title="Tambah Menu" />

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
                <span className="text-sm font-medium text-blue-700">Formulir Menu</span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-blue-500 to-white bg-clip-text text-transparent leading-tight">
                Tambah Menu Baru
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Buat navigasi baru dengan pengaturan yang
                <span className="font-semibold text-blue-600 mx-1">lengkap</span> dan
                <span className="font-semibold text-purple-600 mx-1">intuitif</span>
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="ghost"
                asChild
                className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border-2 border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-300 transition-all duration-500 hover:shadow-lg hover:shadow-gray-200/50 px-6 py-3 rounded-2xl font-medium"
              >
                <Link href={route('admin.menu.index', { location: data.location })} className="flex items-center">
                  <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                  <span>Kembali</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-8">
          <form onSubmit={handleSubmit}>
            {/* Basic Information Card */}
            <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl shadow-xl shadow-gray-100/30 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Type className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">Informasi Dasar</h2>
                    <p className="text-blue-100 text-sm">Nama dan lokasi menu</p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-6">
                {/* Label */}
                <div className="space-y-3">
                  <Label htmlFor="label" className="text-base font-medium text-gray-700 flex items-center gap-2">
                    <Type className="h-4 w-4 text-blue-500" />
                    Label Menu <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="label"
                    value={data.label}
                    onChange={(e) => setData('label', e.target.value)}
                    placeholder="Contoh: Beranda, Tentang Kami"
                    className={`h-12 px-4 rounded-xl border-2 transition-all duration-300 focus:border-blue-400 focus:shadow-lg focus:shadow-blue-100/50 ${
                      errors.label
                        ? 'border-red-400 bg-red-50/50'
                        : 'bg-white/70 backdrop-blur-sm border-gray-200 hover:border-gray-300'
                    }`}
                  />
                  {errors.label && (
                    <p className="text-sm text-red-600 font-medium flex items-center gap-1">
                      <div className="w-1 h-1 rounded-full bg-red-500" />
                      {errors.label}
                    </p>
                  )}
                </div>

                {/* URL */}
                <div className="space-y-3">
                  <Label htmlFor="url" className="text-base font-medium text-gray-700 flex items-center gap-2">
                    <LinkIcon className="h-4 w-4 text-blue-500" />
                    URL Target
                  </Label>
                  <Input
                    id="url"
                    value={data.url}
                    onChange={(e) => setData('url', e.target.value)}
                    placeholder="Contoh: /tentang-kami atau https://example.com"
                    className={`h-12 px-4 rounded-xl border-2 transition-all duration-300 focus:border-blue-400 focus:shadow-lg focus:shadow-blue-100/50 ${
                      errors.url
                        ? 'border-red-400 bg-red-50/50'
                        : 'bg-white/70 backdrop-blur-sm border-gray-200 hover:border-gray-300'
                    }`}
                  />
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 rounded-full bg-blue-100" />
                    <span>Kosongkan jika menu hanya sebagai parent (dropdown)</span>
                  </div>
                  {errors.url && (
                    <p className="text-sm text-red-600 font-medium flex items-center gap-1">
                      <div className="w-1 h-1 rounded-full bg-red-500" />
                      {errors.url}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div className="space-y-3">
                  <Label htmlFor="location" className="text-base font-medium text-gray-700 flex items-center gap-2">
                    <Globe className="h-4 w-4 text-blue-500" />
                    Lokasi Menu <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={data.location}
                    onValueChange={(value) => setData('location', value)}
                  >
                    <SelectTrigger
                      className={`h-12 px-4 rounded-xl border-2 transition-all duration-300 focus:border-blue-400 focus:shadow-lg focus:shadow-blue-100/50 ${
                        errors.location
                          ? 'border-red-400 bg-red-50/50'
                          : 'bg-white/70 backdrop-blur-sm border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <SelectValue placeholder="Pilih lokasi" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-2 border-gray-200 shadow-xl">
                      {Object.entries(locations).map(([value, label]) => (
                        <SelectItem
                          key={value}
                          value={value}
                          className="rounded-lg hover:bg-blue-50 focus:bg-blue-100"
                        >
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.location && (
                    <p className="text-sm text-red-600 font-medium flex items-center gap-1">
                      <div className="w-1 h-1 rounded-full bg-red-500" />
                      {errors.location}
                    </p>
                  )}
                </div>

                {/* Parent Menu */}
                <div className="space-y-3">
                  <Label htmlFor="parent_id" className="text-base font-medium text-gray-700 flex items-center gap-2">
                    <Plus className="h-4 w-4 text-blue-500" />
                    Parent Menu
                  </Label>
                  <Select
                    value={data.parent_id || 'none'}
                    onValueChange={(value) => setData('parent_id', value === 'none' ? '' : value)}
                  >
                    <SelectTrigger
                      className={`h-12 px-4 rounded-xl border-2 transition-all duration-300 focus:border-blue-400 focus:shadow-lg focus:shadow-blue-100/50 ${
                        errors.parent_id
                          ? 'border-red-400 bg-red-50/50'
                          : 'bg-white/70 backdrop-blur-sm border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <SelectValue placeholder="Pilih parent (opsional)" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-2 border-gray-200 shadow-xl">
                      <SelectItem value="none" className="rounded-lg hover:bg-blue-50 focus:bg-blue-100">
                        Tidak ada (Menu Utama)
                      </SelectItem>
                      {parentMenus.map((parent) => (
                        <SelectItem key={parent.id} value={String(parent.id)} className="rounded-lg hover:bg-blue-50 focus:bg-blue-100">
                          {parent.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 rounded-full bg-blue-100" />
                    <span>Pilih parent untuk membuat submenu (maksimal 2 level)</span>
                  </div>
                  {errors.parent_id && (
                    <p className="text-sm text-red-600 font-medium flex items-center gap-1">
                      <div className="w-1 h-1 rounded-full bg-red-500" />
                      {errors.parent_id}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Advanced Settings Card */}
            <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl shadow-xl shadow-gray-100/30 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Settings className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">Pengaturan Lanjutan</h2>
                    <p className="text-purple-100 text-sm">Icon dan visibilitas menu</p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-6">
                {/* Icon */}
                <div className="space-y-3">
                  <Label htmlFor="icon" className="text-base font-medium text-gray-700 flex items-center gap-2">
                    <Settings className="h-4 w-4 text-purple-500" />
                    Icon Menu (Opsional)
                  </Label>
                  <Input
                    id="icon"
                    value={data.icon}
                    onChange={(e) => setData('icon', e.target.value)}
                    placeholder="Contoh: home, info, file-text"
                    className={`h-12 px-4 rounded-xl border-2 transition-all duration-300 focus:border-purple-400 focus:shadow-lg focus:shadow-purple-100/50 ${
                      errors.icon
                        ? 'border-red-400 bg-red-50/50'
                        : 'bg-white/70 backdrop-blur-sm border-gray-200 hover:border-gray-300'
                    }`}
                  />
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 rounded-full bg-purple-100" />
                    <span>Nama icon dari Lucide Icons</span>
                  </div>
                  {errors.icon && (
                    <p className="text-sm text-red-600 font-medium flex items-center gap-1">
                      <div className="w-1 h-1 rounded-full bg-red-500" />
                      {errors.icon}
                    </p>
                  )}
                </div>

                {/* Visibility */}
                <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center">
                      {data.is_visible ? (
                        <Eye className="h-6 w-6 text-blue-600" />
                      ) : (
                        <EyeOff className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <Label htmlFor="is_visible" className="text-base font-medium text-gray-800">
                        Tampilkan Menu
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">
                        Menu akan ditampilkan di navigasi website
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="is_visible"
                    checked={data.is_visible}
                    onCheckedChange={(checked) => setData('is_visible', checked)}
                    className="scale-110"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 p-6">
              <Button
                type="submit"
                disabled={processing}
                className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-500 hover:shadow-xl hover:shadow-blue-200/50 px-8 py-3 rounded-2xl font-medium text-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Save className="h-5 w-5 mr-3 relative z-10" />
                <span className="relative z-10">Simpan Menu</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                asChild
                className="group bg-white/80 backdrop-blur-sm border-2 border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-700 transition-all duration-500 hover:shadow-lg hover:shadow-gray-200/50 px-6 py-3 rounded-2xl font-medium"
              >
                <Link href={route('admin.menu.index', { location: data.location })}>
                  Batal
                </Link>
              </Button>
            </div>
          </form>
        </div>

        {/* Sidebar */}
        <div className="lg:sticky lg:top-6 lg:self-start space-y-6">
          {/* Quick Info Card */}
          <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 border border-white/50 rounded-3xl p-6 shadow-xl shadow-blue-100/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <Info className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Info Cepat</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-sm text-gray-600">
                  Menu akan ditampilkan sesuai lokasi yang dipilih
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <span className="text-sm text-gray-600">
                  Submenu maksimal 2 level kedalaman
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm text-gray-600">
                  Gunakan icon untuk identifikasi visual
                </span>
              </div>
            </div>
          </div>

          {/* Status Card */}
          <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl p-6 shadow-xl shadow-gray-100/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                <Check className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Status</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50/80 rounded-xl">
                <span className="text-sm font-medium text-gray-700">Visibilitas</span>
                <Badge variant={data.is_visible ? "default" : "secondary"} className="rounded-full">
                  {data.is_visible ? 'Aktif' : 'Tersembunyi'}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50/80 rounded-xl">
                <span className="text-sm font-medium text-gray-700">Tipe</span>
                <Badge variant="outline" className="rounded-full">
                  {data.parent_id ? 'Submenu' : 'Menu Utama'}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
