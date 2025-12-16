import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { ArrowLeft, Pencil, Trash2, Eye, EyeOff, HelpCircle } from 'lucide-react';

interface Ssd {
  id: string;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface Props {
  ssd: Ssd;
  categories: Record<string, string>;
}

export default function Show({ ssd, categories }: Props) {
  const handleDelete = () => {
    if (confirm('Hapus FAQ ini?')) {
      router.delete(route('admin.ssd.destroy', ssd.id));
    }
  };

  const handleToggleActive = () => {
    router.post(route('admin.ssd.toggle-active', ssd.id), {}, {
      preserveScroll: true,
    });
  };

  return (
    <AdminLayout>
      <Head title={`FAQ: ${ssd.question.substring(0, 50)}...`} />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href={route('admin.ssd.index')}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-semibold">Detail FAQ</h1>
              <p className="text-muted-foreground">Lihat detail pertanyaan</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleToggleActive}>
              {ssd.is_active ? (
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
            <Button asChild>
              <Link href={route('admin.ssd.edit', ssd.id)}>
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
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Pertanyaan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">{ssd.question}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Jawaban</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: ssd.answer }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant={ssd.is_active ? 'default' : 'secondary'}>
                    {ssd.is_active ? 'Aktif' : 'Nonaktif'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Kategori</span>
                  <Badge variant="outline">
                    {categories[ssd.category] || ssd.category}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Urutan</span>
                  <span className="text-sm font-medium">{ssd.sort_order}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informasi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>ID</span>
                  <span className="font-mono text-xs">{ssd.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Dibuat</span>
                  <span>
                    {new Date(ssd.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Diperbarui</span>
                  <span>
                    {new Date(ssd.updated_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
