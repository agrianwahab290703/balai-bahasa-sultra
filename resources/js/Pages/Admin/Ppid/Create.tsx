import React from 'react';
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
import { 
  ArrowLeft, Upload, FileText, Save, Loader2, Globe, 
  FolderOpen, File, X, ChevronRight, FileCheck, Layers
} from 'lucide-react';

interface Props {
  categories: Record<string, string>;
  allowedFileTypes: string[];
}

export default function Create({ categories, allowedFileTypes }: Props) {
  const { data, setData, post, processing, errors, progress } = useForm({
    title: '',
    category: '',
    file: null as File | null,
    is_active: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('admin.ppid.store'), {
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
      <Head title="Tambah Dokumen PPID" />

      <div className="space-y-6">
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 via-emerald-500 to-green-500 p-6 lg:p-8">
          {/* Background decorations */}
          <div className="absolute inset-0 bg-grid-white/10" />
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-green-400/20 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Link 
                href={route('admin.ppid.index')}
                className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl hidden sm:flex">
                  <FileCheck className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-white">Tambah Dokumen PPID</h1>
                  <p className="text-emerald-100 mt-1">Upload dokumen keterbukaan informasi publik</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Navigation Menu */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-gray-500">Menu Cepat:</span>
            <Link
              href={route('admin.dashboard')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </Link>
            <Link
              href={route('admin.media.index')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Media Files
            </Link>
            <Link
              href={route('admin.users.index')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Admin Users
            </Link>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              {/* Document Info Card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Informasi Dokumen</h3>
                      <p className="text-xs text-gray-500">Detail dokumen PPID</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-5">
                  <div>
                    <Label htmlFor="title" className="text-sm font-medium text-gray-700 mb-2 block">
                      Judul Dokumen <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      value={data.title}
                      onChange={(e) => setData('title', e.target.value)}
                      placeholder="Masukkan judul dokumen yang jelas..."
                      className={`h-11 ${errors.title ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-teal-500'}`}
                    />
                    {errors.title && (
                      <p className="text-sm text-red-500 mt-1.5 flex items-center gap-1">
                        <X className="h-3.5 w-3.5" />
                        {errors.title}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5" /> Kategori <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={data.category || undefined}
                      onValueChange={(value) => setData('category', value)}
                    >
                      <SelectTrigger className={`h-11 ${errors.category ? 'border-red-500' : 'border-gray-200'}`}>
                        <SelectValue placeholder="Pilih kategori dokumen" />
                      </SelectTrigger>
                      <SelectContent className="z-50 bg-white border shadow-lg">
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
                      <p className="text-sm text-red-500 mt-1.5">{errors.category}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* File Upload Card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <FolderOpen className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Upload File</h3>
                      <p className="text-xs text-gray-500">File dokumen yang akan dipublikasikan</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">
                    File Dokumen <span className="text-red-500">*</span>
                  </Label>
                  
                  <input
                    type="file"
                    id="file"
                    className="hidden"
                    accept={allowedFileTypes.map(t => `.${t}`).join(',')}
                    onChange={handleFileChange}
                  />
                  
                  {data.file ? (
                    <div className="border-2 border-teal-200 bg-teal-50 rounded-xl p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-teal-100 flex items-center justify-center flex-shrink-0">
                          <File className="h-7 w-7 text-teal-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{data.file.name}</p>
                          <p className="text-sm text-gray-500">
                            {(data.file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <label 
                            htmlFor="file" 
                            className="inline-flex items-center px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                          >
                            Ganti
                          </label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setData('file', null)}
                            className="h-9 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <label 
                      htmlFor="file" 
                      className="block border-2 border-dashed border-gray-300 rounded-xl p-10 text-center cursor-pointer hover:border-teal-400 hover:bg-teal-50/50 transition-all group"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-gray-100 group-hover:bg-teal-100 flex items-center justify-center mx-auto mb-4 transition-colors">
                        <Upload className="h-8 w-8 text-gray-400 group-hover:text-teal-500 transition-colors" />
                      </div>
                      <p className="text-base font-medium text-gray-600 group-hover:text-teal-600">Klik untuk upload atau drag & drop</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Format: {allowedFileTypes.join(', ').toUpperCase()} (Max 10MB)
                      </p>
                    </label>
                  )}
                  
                  {errors.file && (
                    <p className="text-sm text-red-500 mt-3 flex items-center gap-1">
                      <X className="h-4 w-4" />
                      {errors.file}
                    </p>
                  )}
                  
                  {progress && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">Uploading...</span>
                        <span className="font-medium text-teal-600">{progress.percentage}%</span>
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
              </div>
            </div>

            {/* Sidebar - 1 column */}
            <div className="lg:col-span-1">
              <div className="space-y-6 lg:sticky lg:top-6">
                {/* Status Card */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
                    <h3 className="font-semibold text-gray-900">Status</h3>
                  </div>
                  <div className="p-5 space-y-4">
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
                        id="is_active"
                        checked={data.is_active}
                        onCheckedChange={(checked) => setData('is_active', checked)}
                        className="data-[state=checked]:bg-emerald-500"
                      />
                    </div>

                    <p className="text-sm text-gray-500 px-1">
                      Dokumen aktif akan ditampilkan di halaman publik PPID
                    </p>

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
                            Simpan Dokumen
                          </>
                        )}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full h-9 text-sm"
                        asChild
                      >
                        <Link href={route('admin.ppid.index')}>Batal</Link>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Info Card */}
                <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl border border-teal-100 p-5">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                      <FileCheck className="h-4 w-4 text-teal-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-teal-900 mb-1">Tips Upload</h4>
                      <ul className="text-sm text-teal-700 space-y-1">
                        <li>• Gunakan judul yang jelas dan deskriptif</li>
                        <li>• Pastikan file tidak melebihi 10MB</li>
                        <li>• Format yang didukung: PDF, DOC, XLS</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
