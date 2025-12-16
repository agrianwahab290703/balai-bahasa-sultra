import React from 'react';
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
import { ArrowLeft, Upload, FileText, Download } from 'lucide-react';

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
  allowedFileTypes: string[];
}

export default function Edit({ document, categories, allowedFileTypes }: Props) {
  const { data, setData, post, processing, errors, progress } = useForm({
    _method: 'PUT',
    title: document.title,
    description: document.description || '',
    category: document.category,
    file: null as File | null,
    is_active: document.is_active,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('admin.standar-pelayanan.update', document.id), {
      forceFormData: true,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData('file', file);
    }
  };

  return (
    <AdminLayout>
      <Head title={`Edit: ${document.title}`} />

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={route('admin.standar-pelayanan.index')}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Edit Standar Pelayanan</h1>
            <p className="text-muted-foreground">Perbarui informasi dokumen</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informasi Dokumen</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Judul Dokumen *</Label>
                    <Input
                      id="title"
                      value={data.title}
                      onChange={(e) => setData('title', e.target.value)}
                      placeholder="Masukkan judul dokumen"
                      className={errors.title ? 'border-destructive' : ''}
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
                      placeholder="Masukkan deskripsi dokumen (opsional)"
                      rows={3}
                      className={errors.description ? 'border-destructive' : ''}
                    />
                    {errors.description && (
                      <p className="text-sm text-destructive">{errors.description}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Kategori *</Label>
                    <Select
                      value={data.category || undefined}
                      onValueChange={(value) => setData('category', value)}
                    >
                      <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.filter(cat => cat && cat.trim() !== '').map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-sm text-destructive">{errors.category}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>File Dokumen</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Current File */}
                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-primary" />
                        <div>
                          <p className="font-medium">File Saat Ini</p>
                          <p className="text-sm text-muted-foreground">
                            {document.file_type.toUpperCase()} • {document.file_size_formatted}
                          </p>
                        </div>
                      </div>
                      {document.file_url && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={route('admin.standar-pelayanan.download', document.id)} target="_blank">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Upload New File */}
                  <div className="space-y-2">
                    <Label htmlFor="file">Ganti File (Opsional)</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      <input
                        type="file"
                        id="file"
                        className="hidden"
                        accept={allowedFileTypes.map(t => `.${t}`).join(',')}
                        onChange={handleFileChange}
                      />
                      {data.file ? (
                        <div className="flex items-center justify-center gap-3">
                          <FileText className="h-8 w-8 text-primary" />
                          <div className="text-left">
                            <p className="font-medium">{data.file.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {(data.file.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setData('file', null)}
                          >
                            Batal
                          </Button>
                        </div>
                      ) : (
                        <label htmlFor="file" className="cursor-pointer">
                          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Klik untuk upload file baru
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Format: {allowedFileTypes.join(', ').toUpperCase()} (Max 10MB)
                          </p>
                        </label>
                      )}
                    </div>
                    {errors.file && (
                      <p className="text-sm text-destructive">{errors.file}</p>
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
                  <CardTitle>Status</CardTitle>
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
                    Dokumen aktif akan ditampilkan di halaman publik Standar Pelayanan
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Statistik</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Download</span>
                    <span className="font-medium">{document.download_count}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Dibuat</span>
                    <span className="font-medium">
                      {new Date(document.created_at).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Diperbarui</span>
                    <span className="font-medium">
                      {new Date(document.updated_at).toLocaleDateString('id-ID')}
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
                      <Link href={route('admin.standar-pelayanan.index')}>Batal</Link>
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
