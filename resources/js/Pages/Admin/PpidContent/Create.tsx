import React, { useState, useCallback } from 'react';
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
import { RichTextEditor } from '@/Components/Admin/RichTextEditor';
import {
  ArrowLeft,
  Save,
  Loader2,
  Globe,
  FileText,
  Image as ImageIcon,
  File,
  X,
  Upload,
  FolderTree,
  Layers,
} from 'lucide-react';

interface Props {
  categories: Record<string, string>;
  subCategories: Record<string, string>;
}

export default function Create({ categories, subCategories }: Props) {
  const { data, setData, post, processing, errors, progress } = useForm({
    title: '',
    category: '',
    sub_category: '',
    content: '',
    image: null as File | null,
    document: null as File | null,
    status: 'published' as 'draft' | 'published',
    is_active: true,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('admin.ppid-content.store'), {
      forceFormData: true,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData('image', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData('document', file);
    }
  };

  const removeImage = () => {
    setData('image', null);
    setImagePreview(null);
  };

  const removeDocument = () => {
    setData('document', null);
  };

  const handleImageUpload = useCallback(async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(route('admin.media.upload'), {
      method: 'POST',
      body: formData,
      headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      },
    });

    const result = await response.json();
    return result.url;
  }, []);

  const showSubCategory = data.category === 'informasi_publik';

  return (
    <AdminLayout>
      <Head title="Tambah Konten PPID" />

      <div className="space-y-6">
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 via-emerald-500 to-green-500 p-6 lg:p-8">
          <div className="absolute inset-0 bg-grid-white/10" />
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-green-400/20 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Link
                href={route('admin.ppid-content.index')}
                className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl hidden sm:flex">
                  <FolderTree className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-white">Tambah Konten PPID</h1>
                  <p className="text-emerald-100 mt-1">Buat konten baru untuk halaman PPID</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info Card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Informasi Konten</h3>
                      <p className="text-xs text-gray-500">Judul dan kategori konten</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-5">
                  {/* Title */}
                  <div>
                    <Label htmlFor="title" className="text-sm font-medium text-gray-700 mb-2 block">
                      Judul <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      value={data.title}
                      onChange={(e) => setData('title', e.target.value)}
                      placeholder="Masukkan judul konten..."
                      className={`h-11 ${errors.title ? 'border-red-500' : 'border-gray-200'}`}
                    />
                    {errors.title && (
                      <p className="text-sm text-red-500 mt-1.5 flex items-center gap-1">
                        <X className="h-3.5 w-3.5" />
                        {errors.title}
                      </p>
                    )}
                  </div>

                  {/* Category */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5" /> Tipe Konten <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={data.category || undefined}
                      onValueChange={(value) => {
                        setData('category', value);
                        if (value !== 'informasi_publik') {
                          setData('sub_category', '');
                        }
                      }}
                    >
                      <SelectTrigger className={`h-11 ${errors.category ? 'border-red-500' : 'border-gray-200'}`}>
                        <SelectValue placeholder="Pilih tipe konten" />
                      </SelectTrigger>
                      <SelectContent className="z-50 bg-white border shadow-lg">
                        {Object.entries(categories).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-sm text-red-500 mt-1.5">{errors.category}</p>
                    )}
                  </div>

                  {/* Sub-Category (conditional) */}
                  {showSubCategory && (
                    <div className="animate-in slide-in-from-top-2 duration-200">
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">
                        Sub-Kategori <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={data.sub_category || undefined}
                        onValueChange={(value) => setData('sub_category', value)}
                      >
                        <SelectTrigger className={`h-11 ${errors.sub_category ? 'border-red-500' : 'border-gray-200'}`}>
                          <SelectValue placeholder="Pilih sub-kategori" />
                        </SelectTrigger>
                        <SelectContent className="z-50 bg-white border shadow-lg">
                          {Object.entries(subCategories).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.sub_category && (
                        <p className="text-sm text-red-500 mt-1.5">{errors.sub_category}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Content Editor Card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Konten</h3>
                      <p className="text-xs text-gray-500">Isi konten dengan rich text editor</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">
                    Isi Konten <span className="text-red-500">*</span>
                  </Label>
                  <RichTextEditor
                    value={data.content}
                    onChange={(value) => setData('content', value)}
                    placeholder="Tulis konten di sini..."
                    minHeight={300}
                    onImageUpload={handleImageUpload}
                    error={errors.content}
                  />
                </div>
              </div>

              {/* Media Upload Card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <ImageIcon className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Media</h3>
                      <p className="text-xs text-gray-500">Upload gambar dan dokumen pendukung</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  {/* Image Upload */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-3 block">
                      Gambar Utama
                    </Label>
                    <input
                      type="file"
                      id="image"
                      className="hidden"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageChange}
                    />
                    {imagePreview ? (
                      <div className="relative border-2 border-teal-200 bg-teal-50 rounded-xl p-4">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={removeImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <label
                        htmlFor="image"
                        className="block border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-teal-400 hover:bg-teal-50/50 transition-all group"
                      >
                        <div className="w-12 h-12 rounded-xl bg-gray-100 group-hover:bg-teal-100 flex items-center justify-center mx-auto mb-3 transition-colors">
                          <ImageIcon className="h-6 w-6 text-gray-400 group-hover:text-teal-500" />
                        </div>
                        <p className="text-sm font-medium text-gray-600">Klik untuk upload gambar</p>
                        <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP (Max 2MB)</p>
                      </label>
                    )}
                    {errors.image && (
                      <p className="text-sm text-red-500 mt-2">{errors.image}</p>
                    )}
                  </div>

                  {/* Document Upload */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-3 block">
                      Dokumen Pendukung
                    </Label>
                    <input
                      type="file"
                      id="document"
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={handleDocumentChange}
                    />
                    {data.document ? (
                      <div className="border-2 border-blue-200 bg-blue-50 rounded-xl p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                            <File className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{data.document.name}</p>
                            <p className="text-sm text-gray-500">
                              {(data.document.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={removeDocument}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <label
                        htmlFor="document"
                        className="block border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all group"
                      >
                        <div className="w-12 h-12 rounded-xl bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center mx-auto mb-3 transition-colors">
                          <Upload className="h-6 w-6 text-gray-400 group-hover:text-blue-500" />
                        </div>
                        <p className="text-sm font-medium text-gray-600">Klik untuk upload dokumen</p>
                        <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX (Max 10MB)</p>
                      </label>
                    )}
                    {errors.document && (
                      <p className="text-sm text-red-500 mt-2">{errors.document}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - 1 column */}
            <div className="lg:col-span-1">
              <div className="space-y-6 lg:sticky lg:top-6">
                {/* Status Card */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
                    <h3 className="font-semibold text-gray-900">Publikasi</h3>
                  </div>
                  <div className="p-5 space-y-4">
                    {/* Status Select */}
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">
                        Status
                      </Label>
                      <Select
                        value={data.status}
                        onValueChange={(value: 'draft' | 'published') => setData('status', value)}
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="published">Dipublikasi</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

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
                        checked={data.is_active}
                        onCheckedChange={(checked) => setData('is_active', checked)}
                        className="data-[state=checked]:bg-emerald-500"
                      />
                    </div>

                    {/* Submit Buttons */}
                    <div className="pt-3 space-y-2">
                      <Button
                        type="submit"
                        disabled={processing}
                        className="w-full h-11 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-sm font-medium shadow-lg shadow-teal-500/25"
                      >
                        {processing ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Menyimpan...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Simpan Konten
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-9 text-sm"
                        asChild
                      >
                        <Link href={route('admin.ppid-content.index')}>Batal</Link>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Info Card */}
                <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl border border-teal-100 p-5">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                      <FolderTree className="h-4 w-4 text-teal-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-teal-900 mb-1">Panduan</h4>
                      <ul className="text-sm text-teal-700 space-y-1">
                        <li>• Pilih tipe konten sesuai kategori PPID</li>
                        <li>• Sub-kategori hanya untuk Informasi Publik</li>
                        <li>• Gunakan editor untuk format teks</li>
                        <li>• Upload gambar dan dokumen pendukung</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Upload Progress */}
        {progress && (
          <div className="fixed bottom-6 right-6 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 w-80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Mengupload...</span>
              <span className="text-sm font-bold text-teal-600">{progress.percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-teal-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
