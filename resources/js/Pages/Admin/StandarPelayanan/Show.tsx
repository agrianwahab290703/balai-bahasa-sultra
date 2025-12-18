import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { ArrowLeft, Pencil, Trash2, Download, Link2, FileText } from 'lucide-react';

interface StandarPelayananDocument {
  id: number;
  title: string;
  description: string;
  url: string | null;
  file_url: string | null;
  file_type: string | null;
  file_size: number | null;
  file_size_formatted: string;
  download_count: number;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  document_type: 'file' | 'link';
  source_label: string;
  external_url: string | null;
}

interface Props {
  document: StandarPelayananDocument;
}

export default function Show({ document }: Props) {
  const handleDelete = () => {
    if (confirm('Hapus dokumen ini? Aksi tidak dapat dibatalkan.')) {
      router.delete(route('admin.standar-pelayanan.destroy', document.id));
    }
  };

  return (
    <AdminLayout>
      <Head title={document.title} />

      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href={route('admin.standar-pelayanan.index')}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-semibold">{document.title}</h1>
              <p className="text-muted-foreground">Detail dokumen standar pelayanan</p>
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
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Umum</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={document.is_active ? 'default' : 'secondary'}>
                    {document.is_active ? 'Aktif' : 'Nonaktif'}
                  </Badge>
                  <Badge variant="outline">{document.source_label}</Badge>
                  {document.document_type === 'file' && document.file_type && (
                    <Badge variant="outline">{document.file_type.toUpperCase()}</Badge>
                  )}
                </div>

                {document.description && (
                  <p className="text-muted-foreground leading-relaxed">{document.description}</p>
                )}

                <div className="grid gap-4 sm:grid-cols-2 text-sm">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Dibuat</p>
                    <p className="font-medium text-foreground">
                      {new Date(document.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Diperbarui</p>
                    <p className="font-medium text-foreground">
                      {new Date(document.updated_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sumber Dokumen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {document.document_type === 'file' ? (
                  <div className="rounded-lg border p-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2 font-semibold">
                      <span className="rounded-full bg-primary/10 p-2 text-primary">
                        <FileText className="h-4 w-4" />
                      </span>
                      Disimpan di server
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {document.file_type?.toUpperCase() ?? 'N/A'} • {document.file_size_formatted}
                    </p>
                    {document.file_url && (
                      <Button variant="outline" className="w-fit mt-2" asChild>
                        <a href={route('admin.standar-pelayanan.download', document.id)} target="_blank" rel="noreferrer">
                          <Download className="h-4 w-4 mr-2" />
                          Unduh File
                        </a>
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="rounded-lg border p-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2 font-semibold text-primary">
                      <Link2 className="h-4 w-4" />
                      Tautan Eksternal
                    </div>
                    <a
                      href={document.external_url ?? document.file_url ?? document.url ?? '#'}
                      className="break-all text-sm text-primary"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {document.external_url ?? document.url}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Statistik</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-lg border p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Total Unduhan</p>
                  <p className="text-3xl font-bold text-foreground">{document.download_count}</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Status</p>
                  <p className="text-lg font-semibold text-foreground">{document.is_active ? 'Aktif' : 'Nonaktif'}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}