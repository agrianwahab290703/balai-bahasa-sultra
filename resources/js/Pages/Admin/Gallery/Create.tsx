import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Switch } from '@/Components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/ui/select';
import MediaPicker from '@/Components/Admin/MediaPicker';
import { 
  ArrowLeft, Save, Star, AlertCircle, Image as ImageIcon, X, 
  Upload, Loader2, Globe, Layers, ChevronRight, Info, ImagePlus
} from 'lucide-react';
import { Alert, AlertDescription } from '@/Components/ui/alert';

interface Props {
  categories: Record<string, string>;
  canFeatureMore: boolean;
  featuredCount: number;
  maxFeatured: number;
}

export default function Create({ categories, canFeatureMore, featuredCount, maxFeatured }: Props) {
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  
  const { data, setData, post, processing, errors } = useForm({
    title: '',
    description: '',
    image: '',
    category: '',
    is_featured: false,
    is_active: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('admin.gallery.store'));
  };

  const handleMediaSelect = (url: string) => {
    setData('image', url);
    setMediaPickerOpen(false);
  };

  const breadcrumbs = [
    { label: 'Galeri', href: route('admin.gallery.index') },
    { label: 'Tambah Gambar' }
  ];

  return (
    <AdminLayout title="Tambah Gambar Galeri" breadcrumbs={breadcrumbs}>
      <Head title="Tambah Gambar Galeri" />

      <div className="space-y-6">
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-purple-500 to-fuchsia-500 p-6 lg:p-8">
          {/* Background decorations */}
          <div className="absolute inset-0 bg-grid-white/10" />
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-fuchsia-400/20 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Link 
                href={route('admin.gallery.index')}
                className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl hidden sm:flex">
                  <ImagePlus className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-white">Tambah Gambar</h1>
                  <p className="text-purple-100 mt-1">Tambahkan gambar baru ke galeri</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Navigation Menu */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-gray-500">Menu Cepat:</span>
            <Link
              href={route('admin.dashboard')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </Link>
            <Link
              href={route('admin.media.index')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Media Files
            </Link>
            <Link
              href={route('admin.users.index')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Admin Users
            </Link>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Upload Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                    <ImageIcon className="h-4 w-4 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Gambar</h3>
                    <p className="text-xs text-gray-500">Upload atau pilih gambar</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                {data.image ? (
                  <div className="relative group">
                    <img
                      src={
                        data.image.startsWith('http')
                          ? data.image
                          : data.image.includes('storage/')
                          ? (data.image.startsWith('/') ? data.image : `/${data.image}`)
                          : `/storage/${data.image}`
                      }
                      alt="Preview"
                      className="w-full max-h-80 object-cover rounded-xl border-2 border-gray-200 shadow-sm"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity flex items-center justify-center gap-3">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => setMediaPickerOpen(true)}
                        className="bg-white/90 hover:bg-white"
                      >
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Ganti
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => setData('image', '')}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Hapus
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => setMediaPickerOpen(true)}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer hover:border-violet-400 hover:bg-violet-50/50 transition-all group"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-gray-100 group-hover:bg-violet-100 flex items-center justify-center mb-4 transition-colors">
                      <Upload className="h-8 w-8 text-gray-400 group-hover:text-violet-500 transition-colors" />
                    </div>
                    <span className="text-base font-medium text-gray-600 group-hover:text-violet-600">Klik untuk pilih gambar</span>
                    <span className="text-sm text-gray-400 mt-2">PNG, JPG, WEBP hingga 5MB</span>
                  </div>
                )}
                {errors.image && (
                  <p className="text-sm text-red-500 mt-3 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.image}
                  </p>
                )}
                <MediaPicker
                  open={mediaPickerOpen}
                  onClose={() => setMediaPickerOpen(false)}
                  onSelect={handleMediaSelect}
                  accept={['image/jpeg', 'image/png', 'image/webp']}
                  title="Pilih Gambar Galeri"
                />
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Info className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Informasi</h3>
                    <p className="text-xs text-gray-500">Detail gambar galeri</p>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <Label htmlFor="title" className="text-sm font-medium text-gray-700 mb-2 block">
                    Judul Gambar <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    placeholder="Masukkan judul gambar yang menarik..."
                    className={`h-11 ${errors.title ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-violet-500'}`}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.title}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-2 block">
                    Deskripsi
                  </Label>
                  <Textarea
                    id="description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    placeholder="Deskripsi singkat tentang gambar ini (opsional)..."
                    rows={4}
                    className="border-gray-200 focus:ring-violet-500 resize-none"
                  />
                  <p className="text-xs text-gray-400 mt-1.5">{data.description.length}/500 karakter</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - 1 column */}
          <div className="lg:col-span-1">
            <div className="space-y-6 lg:sticky lg:top-6">
              {/* Publish Card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
                  <h3 className="font-semibold text-gray-900">Publikasi</h3>
                </div>
                <div className="p-5 space-y-4">
                  {/* Active Toggle */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg ${data.is_active ? 'bg-emerald-100' : 'bg-gray-200'} flex items-center justify-center transition-colors`}>
                        <Globe className={`h-4 w-4 ${data.is_active ? 'text-emerald-600' : 'text-gray-400'}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Aktif</p>
                        <p className="text-xs text-gray-500">{data.is_active ? 'Tampil publik' : 'Tersembunyi'}</p>
                      </div>
                    </div>
                    <Switch
                      id="is_active"
                      checked={data.is_active}
                      onCheckedChange={(checked) => setData('is_active', checked)}
                      className="data-[state=checked]:bg-emerald-500"
                    />
                  </div>

                  {/* Featured Toggle */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg ${data.is_featured ? 'bg-amber-100' : 'bg-gray-200'} flex items-center justify-center transition-colors`}>
                        <Star className={`h-4 w-4 ${data.is_featured ? 'text-amber-600 fill-amber-500' : 'text-gray-400'}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Featured</p>
                        <p className="text-xs text-gray-500">{featuredCount}/{maxFeatured} slot terpakai</p>
                      </div>
                    </div>
                    <Switch
                      id="is_featured"
                      checked={data.is_featured}
                      onCheckedChange={(checked) => setData('is_featured', checked)}
                      disabled={!canFeatureMore && !data.is_featured}
                      className="data-[state=checked]:bg-amber-500"
                    />
                  </div>

                  {!canFeatureMore && !data.is_featured && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-700">
                          Maksimal {maxFeatured} gambar dapat ditandai sebagai featured.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Submit Buttons */}
                  <div className="pt-3 space-y-2">
                    <Button 
                      type="submit" 
                      disabled={processing}
                      className="w-full h-11 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-sm font-medium shadow-lg shadow-violet-500/25"
                    >
                      {processing ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Simpan Gambar
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full h-9 text-sm"
                      asChild
                    >
                      <Link href={route('admin.gallery.index')}>Batal</Link>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Category Card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                  <h3 className="font-semibold text-gray-900">Kategori</h3>
                </div>
                <div className="p-5">
                  <Label className="text-xs font-medium text-gray-600 mb-1.5 block flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5" /> Pilih Kategori
                  </Label>
                  <Select
                    value={data.category || undefined}
                    onValueChange={(value) => setData('category', value)}
                  >
                    <SelectTrigger className="w-full h-10 border-gray-200 bg-white">
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-white border shadow-lg">
                      {Object.entries(categories).map(([value, label]) => (
                        value && value.trim() !== '' ? (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ) : null
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-red-500 mt-1.5">{errors.category}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
