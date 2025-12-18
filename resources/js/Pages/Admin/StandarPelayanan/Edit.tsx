import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Switch } from '@/Components/ui/switch';
import { ArrowLeft, Download, FileText, Link2, Upload } from 'lucide-react';

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
  external_url: string | null;
}

interface Props {
  document: StandarPelayananDocument;
  allowedFileTypes: string[];
  maxFileSize: number;
}

const DOCUMENT_TYPES = [
  { value: 'file', label: 'Unggah File', description: 'Simpan dokumen di server', icon: FileText },
  { value: 'link', label: 'Tautan URL', description: 'Gunakan tautan eksternal', icon: Link2 },
];

export default function Edit({ document, allowedFileTypes, maxFileSize }: Props) {
  const { data, setData, post, processing, errors, progress } = useForm({
    _method: 'PUT',
    title: document.title,
    description: document.description ?? '',
    document_type: document.document_type,
    external_url: document.document_type === 'link' ? document.external_url ?? document.url ?? '' : '',
    file: null as File | null,
    is_active: document.is_active,
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    post(route('admin.standar-pelayanan.update', document.id), {
      forceFormData: true,
    });
  };

  const handleDocumentTypeChange = (type: 'file' | 'link') => {
    setData('document_type', type);
    if (type === 'file') {
      setData('external_url', '');
    } else {
      setData('file', null);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setData('file', file);
  };

  const handleClearFile = () => setData('file', null);

  const allowedExtensions = allowedFileTypes.map((ext) => `.${ext}`).join(',');

  return (
    <AdminLayout>
      <Head title={`Edit: ${document.title}`} />

      <div className="space-y-6">
        <div className="flex items-start gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href={route('admin.standar-pelayanan.index')}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Edit Standar Pelayanan</h1>
            <p className="text-muted-foreground">Perbarui informasi atau sumber dokumen</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Dokumen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Judul Dokumen <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="title"
                    value={data.title}
                    onChange={(event) => setData('title', event.target.value)}
                    placeholder="Judul dokumen"
                    className={errors.title ? 'border-destructive' : ''}
                  />
                  {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Deskripsi
                  </label>
                  <Textarea
                    id="description"
                    rows={4}
                    value={data.description}
                    onChange={(event) => setData('description', event.target.value)}
                    placeholder="Tambahkan keterangan (opsional)"
                    className={errors.description ? 'border-destructive' : ''}
                  />
                  {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sumber Dokumen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  {DOCUMENT_TYPES.map(({ value, label, description, icon: Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleDocumentTypeChange(value)}
                      className={`rounded-xl border px-4 py-3 text-left transition hover:border-primary ${
                        data.document_type === value ? 'border-primary bg-primary/5' : 'border-muted'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-medium">
                        <span className={`rounded-lg p-2 ${data.document_type === value ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                          <Icon className="h-4 w-4" />
                        </span>
                        {label}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                    </button>
                  ))}
                </div>

                {data.document_type === 'file' ? (
                  <div className="space-y-3">
                    <label htmlFor="file" className="text-sm font-medium">
                      File Dokumen
                    </label>
                    <input id="file" type="file" className="hidden" accept={allowedExtensions} onChange={handleFileChange} />

                    <label
                      htmlFor="file"
                      className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-8 text-center cursor-pointer transition ${
                        data.file ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary'
                      }`}
                    >
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      {data.file ? (
                        <>
                          <p className="mt-3 text-sm font-semibold">{data.file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(data.file.size / 1024).toFixed(2)} KB
                          </p>
                          <Button type="button" variant="outline" size="sm" className="mt-3" onClick={handleClearFile}>
                            Batalkan File Baru
                          </Button>
                        </>
                      ) : (
                        <>
                          <p className="mt-3 text-sm font-medium text-muted-foreground">Klik untuk memilih file baru</p>
                          <p className="text-xs text-muted-foreground">
                            Format: {allowedFileTypes.join(', ').toUpperCase()} • Maks. {Math.round(maxFileSize / 1024)} MB
                          </p>
                        </>
                      )}
                    </label>
                    {errors.file && <p className="text-sm text-destructive">{errors.file}</p>}
                    {progress && (
                      <div className="w-full rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-primary transition-all"
                          style={{ width: `${progress.percentage}%` }}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <label htmlFor="external_url" className="text-sm font-medium">
                      URL Dokumen <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="external_url"
                      type="url"
                      value={data.external_url}
                      onChange={(event) => setData('external_url', event.target.value)}
                      placeholder="https://contoh.go.id/berkas.pdf"
                      className={errors.external_url ? 'border-destructive' : ''}
                    />
                    {errors.external_url && <p className="text-sm text-destructive">{errors.external_url}</p>}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dokumen Saat Ini</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {document.document_type === 'file' ? (
                  <div className="rounded-lg border p-4">
                    <p className="font-semibold">Tersimpan di server</p>
                    <p className="text-muted-foreground">{document.file_type?.toUpperCase() ?? 'N/A'} • {document.file_size_formatted}</p>
                    {document.file_url && (
                      <Button variant="outline" size="sm" className="mt-3" asChild>
                        <a href={route('admin.standar-pelayanan.download', document.id)} target="_blank" rel="noreferrer">
                          <Download className="h-4 w-4 mr-2" />
                          Unduh File Lama
                        </a>
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="rounded-lg border p-4">
                    <p className="font-semibold">Tautan Eksternal</p>
                    <a
                      href={document.external_url ?? document.file_url ?? document.url ?? '#'}
                      className="text-primary break-all"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {document.external_url ?? document.url}
                    </a>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                  <div>
                    <p className="text-xs uppercase tracking-wide">Total Unduhan</p>
                    <p className="text-lg font-semibold text-foreground">{document.download_count}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide">Diperbarui</p>
                    <p className="text-lg font-semibold text-foreground">
                      {new Date(document.updated_at).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Status Publikasi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Tampilkan di halaman publik</p>
                    <p className="text-sm text-muted-foreground">Pengunjung hanya melihat dokumen yang aktif</p>
                  </div>
                  <Switch checked={data.is_active} onCheckedChange={(checked) => setData('is_active', checked)} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-col gap-3 pt-6">
                <Button type="submit" disabled={processing}>
                  {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href={route('admin.standar-pelayanan.index')}>Batal</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}