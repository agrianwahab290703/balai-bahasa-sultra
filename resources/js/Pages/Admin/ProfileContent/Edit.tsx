import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Switch } from '@/Components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { ArrowLeft, X, Image as ImageIcon } from 'lucide-react';
import RichTextEditor from '@/Components/Admin/RichTextEditor';

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

interface Props {
  content: ProfileContent;
  contentTypes: Record<string, string>;
  allowedImageTypes: string[];
}

export default function Edit({ content, contentTypes, allowedImageTypes }: Props) {
  const [existingImages, setExistingImages] = useState<string[]>(content.images || []);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  
  const { data, setData, post, processing, errors, progress } = useForm({
    _method: 'PUT',
    type: content.type,
    title: content.title,
    content: content.content,
    images: [] as File[],
    existing_images: content.images || [],
    order: content.order,
    is_active: content.is_active,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('admin.profile-content.update', content.id), {
      forceFormData: true,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setData('images', [...data.images, ...files]);
      
      // Create preview URLs
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setNewImagePreviews([...newImagePreviews, ...newPreviews]);
    }
  };

  const removeExistingImage = (index: number) => {
    const newExisting = [...existingImages];
    newExisting.splice(index, 1);
    setExistingImages(newExisting);
    setData('existing_images', newExisting);
  };

  const removeNewImage = (index: number) => {
    const newImages = [...data.images];
    newImages.splice(index, 1);
    setData('images', newImages);
    
    // Revoke the preview URL and remove from state
    URL.revokeObjectURL(newImagePreviews[index]);
    const newPreviews = [...newImagePreviews];
    newPreviews.splice(index, 1);
    setNewImagePreviews(newPreviews);
  };

  return (
    <AdminLayout>
      <Head title={`Edit: ${content.title}`} />

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={route('admin.profile-content.index')}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Edit Konten Profil</h1>
            <p className="text-muted-foreground">Perbarui konten halaman profil</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informasi Konten</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipe Konten *</Label>
                    <Select
                      value={data.type || undefined}
                      onValueChange={(value) => setData('type', value)}
                    >
                      <SelectTrigger className={errors.type ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Pilih tipe konten" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(contentTypes).map(([value, label]) => (
                          value && value.trim() !== '' ? (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ) : null
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.type && (
                      <p className="text-sm text-destructive">{errors.type}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Judul *</Label>
                    <Input
                      id="title"
                      value={data.title}
                      onChange={(e) => setData('title', e.target.value)}
                      placeholder="Masukkan judul konten"
                      className={errors.title ? 'border-destructive' : ''}
                    />
                    {errors.title && (
                      <p className="text-sm text-destructive">{errors.title}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Konten *</Label>
                    <RichTextEditor
                      value={data.content}
                      onChange={(value) => setData('content', value)}
                      placeholder="Tulis konten di sini..."
                      minHeight={300}
                    />
                    {errors.content && (
                      <p className="text-sm text-destructive">{errors.content}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Image Upload */}
              <Card>
                <CardHeader>
                  <CardTitle>Gambar</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Gambar Saat Ini</Label>
                    
                    {/* Existing images */}
                    {existingImages.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        {existingImages.map((imagePath, index) => (
                          <div key={`existing-${index}`} className="relative group">
                            <img
                              src={`/storage/${imagePath}`}
                              alt={`Image ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeExistingImage(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* New image previews */}
                    {newImagePreviews.length > 0 && (
                      <>
                        <Label className="text-sm text-muted-foreground">Gambar Baru</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                          {newImagePreviews.map((preview, index) => (
                            <div key={`new-${index}`} className="relative group">
                              <img
                                src={preview}
                                alt={`New ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg border border-primary"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeNewImage(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      <input
                        type="file"
                        id="images"
                        className="hidden"
                        accept={allowedImageTypes.map(t => `.${t}`).join(',')}
                        multiple
                        onChange={handleImageChange}
                      />
                      <label htmlFor="images" className="cursor-pointer">
                        <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Klik untuk upload gambar tambahan
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Format: {allowedImageTypes.join(', ').toUpperCase()} (Max 2MB per file)
                        </p>
                      </label>
                    </div>
                    {errors.images && (
                      <p className="text-sm text-destructive">{errors.images}</p>
                    )}
                    {progress && (
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${progress.percentage}%` }}
                        />
                      </div>
                    )}
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="is_active">Aktif</Label>
                    <Switch
                      id="is_active"
                      checked={data.is_active}
                      onCheckedChange={(checked) => setData('is_active', checked)}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Konten aktif akan ditampilkan di halaman publik
                  </p>

                  <div className="space-y-2 pt-4 border-t">
                    <Label htmlFor="order">Urutan</Label>
                    <Input
                      id="order"
                      type="number"
                      min="0"
                      value={data.order}
                      onChange={(e) => setData('order', parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                    <p className="text-sm text-muted-foreground">
                      Urutan tampil dalam tipe yang sama (0 = pertama)
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Dibuat</span>
                    <span className="font-medium">
                      {new Date(content.created_at).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Diperbarui</span>
                    <span className="font-medium">
                      {new Date(content.updated_at).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1" disabled={processing}>
                      {processing ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                    <Button type="button" variant="outline" asChild>
                      <Link href={route('admin.profile-content.index')}>Batal</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
