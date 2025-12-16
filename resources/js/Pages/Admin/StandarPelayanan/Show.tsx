import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { ArrowLeft, Pencil, Trash2, Download, FileText, Calendar } from 'lucide-react';

interface StandarPelayananDocument {
  id: number;
  title: string;
  description: string;
  category: string;
  url: string;
  file_type: string;
  file_size: number;
  file_size_formatted: string;
  file_url: string | null;
  download_count: number;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface Props {
  document: StandarPelayananDocument;
  categories: string[];
}

export default function Show({ document, categories }: Props) {
  const handleDelete = () => {
    if (confirm('Hapus dokumen ini? Aksi ini tidak dapat dibatalkan.')) {
      router.delete(route('admin.standar-pelayanan.destroy', document.id));
    }
  };

  return (
    <AdminLayout>
      <Head title={document.title} />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href={route('admin.standar-pelayanan.index')}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-semibold">{document.title}</h1>
              <p className="text-muted-foreground">Detail dokumen Standar Pelayanan</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href={route('admin.standar-pelayanan.edit', document.id)}>
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
                <CardTitle>Informasi Dokumen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Judul</p>
                    <p className="font-medium">{document.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Kategori</p>
                    <Badge variant="outline" className="mt-1">
                      {document.category}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant={document.is_active ? 'default' : 'secondary'} className="mt-1">
                      {document.is_active ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tipe File</p>
                    <p className="font-medium uppercase">{document.file_type}</p>
                  </div>
                </div>
                {document.description && (
                  <div>
                    <p className="text-sm text-muted-foreground">Deskripsi</p>
                    <p className="mt-1">{document.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>File</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-background rounded-lg">
                      <FileText className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{document.title}.{document.file_type}</p>
                      <p className="text-sm text-muted-foreground">
                        {document.file_size_formatted}
                      </p>
                    </div>
                  </div>
                  {document.file_url && (
                    <Button asChild>
                      <a href={route('admin.standar-pelayanan.download', document.id)} target="_blank">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Statistik</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded">
                    <Download className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{document.download_count}</p>
                    <p className="text-sm text-muted-foreground">Total Download</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informasi Waktu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Dibuat</p>
                    <p className="font-medium">
                      {new Date(document.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Terakhir Diperbarui</p>
                    <p className="font-medium">
                      {new Date(document.updated_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
