import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { ArrowLeft, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';

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
}

export default function Show({ content, contentTypes }: Props) {
  const handleDelete = () => {
    if (confirm('Hapus konten ini? Aksi ini tidak dapat dibatalkan.')) {
      router.delete(route('admin.profile-content.destroy', content.id));
    }
  };

  const handleToggleActive = () => {
    router.post(route('admin.profile-content.toggle-active', content.id));
  };

  return (
    <AdminLayout>
      <Head title={content.title} />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href={route('admin.profile-content.index')}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-semibold">{content.title}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">
                  {contentTypes[content.type] || content.type}
                </Badge>
                <Badge variant={content.is_active ? 'default' : 'secondary'}>
                  {content.is_active ? 'Aktif' : 'Nonaktif'}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleToggleActive}>
              {content.is_active ? (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Nonaktifkan
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Aktifkan
                </>
              )}
            </Button>
            <Button variant="outline" asChild>
              <Link href={route('admin.profile-content.edit', content.id)}>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Konten</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: content.content }}
                />
              </CardContent>
            </Card>

            {/* Images */}
            {content.images && content.images.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Gambar ({content.images.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {content.images.map((imagePath, index) => (
                      <a
                        key={index}
                        href={`/storage/${imagePath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <img
                          src={`/storage/${imagePath}`}
                          alt={`Image ${index + 1}`}
                          className="w-full h-40 object-cover rounded-lg border hover:opacity-90 transition-opacity"
                        />
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informasi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tipe</span>
                  <span className="font-medium">
                    {contentTypes[content.type] || content.type}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Urutan</span>
                  <span className="font-medium">{content.order}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant={content.is_active ? 'default' : 'secondary'}>
                    {content.is_active ? 'Aktif' : 'Nonaktif'}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Jumlah Gambar</span>
                  <span className="font-medium">
                    {content.images ? content.images.length : 0}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Waktu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Dibuat</span>
                  <span className="font-medium">
                    {new Date(content.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Diperbarui</span>
                  <span className="font-medium">
                    {new Date(content.updated_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Metadata if exists */}
            {content.metadata && Object.keys(content.metadata).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Metadata</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs bg-muted p-3 rounded overflow-auto">
                    {JSON.stringify(content.metadata, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
