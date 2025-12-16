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
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import MediaPicker from '@/Components/Admin/MediaPicker';
import { ArrowLeft, Save, Star, AlertCircle, Image as ImageIcon, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/Components/ui/alert';

interface Gallery {
  id: number;
  title: string;
  description: string | null;
  image: string | null;
  category: string | null;
  is_featured: boolean;
  is_active: boolean;
}

interface Props {
  gallery: Gallery;
  categories: Record<string, string>;
  canFeatureMore: boolean;
  featuredCount: number;
  maxFeatured: number;
}

export default function Edit({ gallery, categories, canFeatureMore, featuredCount, maxFeatured }: Props) {
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  
  const { data, setData, put, processing, errors } = useForm({
    title: gallery.title || '',
    description: gallery.description || '',
    image: gallery.image || '',
    category: gallery.category || '',
    is_featured: gallery.is_featured,
    is_active: gallery.is_active,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('admin.gallery.update', gallery.id));
  };

  const handleMediaSelect = (url: string) => {
    setData('image', url);
    setMediaPickerOpen(false);
  };

  const breadcrumbs = [
    { label: 'Galeri', href: route('admin.gallery.index') },
    { label: 'Edit Gambar' }
  ];

  return (
    <AdminLayout title="Edit Gambar Galeri" breadcrumbs={breadcrumbs}>
      <Head title="Edit Gambar Galeri" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={route('admin.gallery.index')}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Edit Gambar</h1>
            <p className="text-muted-foreground">Perbarui informasi gambar galeri</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Gambar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Judul *</Label>
                  <Input
                    id="title"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    placeholder="Masukkan judul gambar"
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive">{errors.title}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    placeholder="Deskripsi gambar (opsional)"
                    rows={3}
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive">{errors.description}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Gambar *</Label>
                  {data.image ? (
                    <div className="relative">
                      <img
                        src={data.image.startsWith('http') ? data.image : `/storage/${data.image}`}
                        alt="Preview"
                        className="w-full max-h-64 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => setData('image', '')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-32 border-dashed"
                      onClick={() => setMediaPickerOpen(true)}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        <span className="text-muted-foreground">Pilih Gambar</span>
                      </div>
                    </Button>
                  )}
                  {errors.image && (
                    <p className="text-sm text-destructive">{errors.image}</p>
                  )}
                  <MediaPicker
                    open={mediaPickerOpen}
                    onClose={() => setMediaPickerOpen(false)}
                    onSelect={handleMediaSelect}
                    accept={['image/jpeg', 'image/png', 'image/webp']}
                    title="Pilih Gambar Galeri"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Kategori</Label>
                  <Select
                    value={data.category || undefined}
                    onValueChange={(value) => setData('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
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
                    <p className="text-sm text-destructive">{errors.category}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="is_active">Aktif</Label>
                    <p className="text-xs text-muted-foreground">
                      Tampilkan di halaman publik
                    </p>
                  </div>
                  <Switch
                    id="is_active"
                    checked={data.is_active}
                    onCheckedChange={(checked) => setData('is_active', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="is_featured" className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      Featured
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {featuredCount}/{maxFeatured} slot terpakai
                    </p>
                  </div>
                  <Switch
                    id="is_featured"
                    checked={data.is_featured}
                    onCheckedChange={(checked) => setData('is_featured', checked)}
                    disabled={!canFeatureMore && !data.is_featured}
                  />
                </div>

                {!canFeatureMore && !data.is_featured && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Maksimal {maxFeatured} gambar dapat ditandai sebagai featured.
                    </AlertDescription>
                  </Alert>
                )}

                {errors.is_featured && (
                  <p className="text-sm text-destructive">{errors.is_featured}</p>
                )}
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button type="submit" disabled={processing} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                Simpan
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href={route('admin.gallery.index')}>Batal</Link>
              </Button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
