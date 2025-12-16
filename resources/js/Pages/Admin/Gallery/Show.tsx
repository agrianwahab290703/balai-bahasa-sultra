import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { ArrowLeft, Pencil, Trash2, Star, Eye, EyeOff } from 'lucide-react';

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
  created_at: string;
  updated_at: string;
}

interface Props {
  gallery: Gallery;
}

export default function Show({ gallery }: Props) {
  const handleDelete = () => {
    if (confirm('Hapus gambar ini dari galeri?')) {
      router.delete(route('admin.gallery.destroy', gallery.id));
    }
  };

  return (
    <AdminLayout>
      <Head title={`Galeri: ${gallery.title}`} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href={route('admin.gallery.index')}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-semibold">{gallery.title}</h1>
              <p className="text-muted-foreground">Detail gambar galeri</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={route('admin.gallery.edit', gallery.id)}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Hapus
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Image Preview */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                {gallery.image_url ? (
                  <img
                    src={gallery.image_url}
                    alt={gallery.title}
                    className="w-full rounded-lg"
                  />
                ) : (
                  <div className="aspect-video bg-muted flex items-center justify-center rounded-lg">
                    <span className="text-muted-foreground">No Image</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informasi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div className="flex gap-2 mt-1">
                    {gallery.is_active ? (
                      <Badge variant="default">
                        <Eye className="h-3 w-3 mr-1" />
                        Aktif
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <EyeOff className="h-3 w-3 mr-1" />
                        Nonaktif
                      </Badge>
                    )}
                    {gallery.is_featured && (
                      <Badge className="bg-yellow-500">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                </div>

                {gallery.category && (
                  <div>
                    <p className="text-sm text-muted-foreground">Kategori</p>
                    <Badge variant="outline" className="mt-1">
                      {gallery.category}
                    </Badge>
                  </div>
                )}

                {gallery.description && (
                  <div>
                    <p className="text-sm text-muted-foreground">Deskripsi</p>
                    <p className="mt-1">{gallery.description}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-muted-foreground">Urutan</p>
                  <p className="mt-1">{gallery.sort_order}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Tanggal Dibuat</p>
                  <p className="mt-1">{gallery.date}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
