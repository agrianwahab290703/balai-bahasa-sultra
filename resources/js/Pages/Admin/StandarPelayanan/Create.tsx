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
import { ArrowLeft, Upload, FileText } from 'lucide-react';

interface Props {
  categories: string[];
  allowedFileTypes: string[];
}

export default function Create({ categories, allowedFileTypes }: Props) {
  const { data, setData, post, processing, errors, progress } = useForm({
    title: '',
    description: '',
    category: '',
    file: null as File | null,
    is_active: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('admin.standar-pelayanan.store'), {
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
      <Head title="Tambah Standar Pelayanan" />

      <div className="min-h-screen p-6 animate-fade-in">
        {/* Glassmorphism Header */}
        <div className="relative overflow-hidden rounded-2xl p-6 mb-8">
          {/* Glassmorphism background */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(135deg, var(--admin-primary-blue) 0%, var(--admin-secondary-blue) 50%, var(--admin-tertiary-blue) 100%)',
          }} />

          {/* Glassmorphism overlay */}
          <div className="absolute inset-0" style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }} />

          {/* Floating gradient orbs */}
          <div className="absolute -top-8 -right-8 w-20 h-20 rounded-full" style={{
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
            filter: 'blur(12px)',
          }} />
          <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full" style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
            filter: 'blur(10px)',
          }} />

          <div className="relative z-10 flex items-center gap-6">
            {/* Back button */}
            <Link
              href={route('admin.standar-pelayanan.index')}
              className="group flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <ArrowLeft className="h-4 w-4 text-white group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium text-white">Kembali</span>
            </Link>

            {/* Title container */}
            <div className="flex-1">
              <div className="p-4 rounded-xl animate-slide-up" style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}>
                <h1 className="text-3xl font-bold mb-2 text-white leading-tight">
                  Tambah Standar Pelayanan
                </h1>
                <p className="text-lg text-white/90">
                  Upload dokumen standar pelayanan publik
                </p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Glassmorphism Document Info Card */}
              <div className="rounded-2xl p-6 animate-slide-up" style={{
                background: 'var(--admin-glass-bg)',
                backdropFilter: 'var(--admin-glass-blur)',
                WebkitBackdropFilter: 'var(--admin-glass-blur)',
                border: '1px solid var(--admin-glass-border)',
                boxShadow: 'var(--admin-glass-shadow)',
              }}>
                <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--admin-black-text)' }}>Informasi Dokumen</h2>

                <div className="space-y-6">
                  {/* Title Field */}
                  <div className="space-y-3">
                    <label htmlFor="title" className="block text-sm font-bold" style={{ color: 'var(--admin-black-text)' }}>
                      Judul Dokumen <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="title"
                      type="text"
                      value={data.title}
                      onChange={(e) => setData('title', e.target.value)}
                      placeholder="Masukkan judul dokumen"
                      className={`w-full px-4 py-3 rounded-xl transition-all duration-200 ${
                        errors.title
                          ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-500/20'
                          : 'focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20'
                      }`}
                      style={{
                        background: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(4px)',
                        WebkitBackdropFilter: 'blur(4px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        color: 'var(--admin-black-text)',
                      }}
                    />
                    {errors.title && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <span>⚠️</span> {errors.title}
                      </p>
                    )}
                  </div>

                  {/* Description Field */}
                  <div className="space-y-3">
                    <label htmlFor="description" className="block text-sm font-bold" style={{ color: 'var(--admin-black-text)' }}>
                      Deskripsi
                    </label>
                    <textarea
                      id="description"
                      value={data.description}
                      onChange={(e) => setData('description', e.target.value)}
                      placeholder="Masukkan deskripsi dokumen (opsional)"
                      rows={4}
                      className={`w-full px-4 py-3 rounded-xl transition-all duration-200 resize-none ${
                        errors.description
                          ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-500/20'
                          : 'focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20'
                      }`}
                      style={{
                        background: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(4px)',
                        WebkitBackdropFilter: 'blur(4px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        color: 'var(--admin-black-text)',
                      }}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <span>⚠️</span> {errors.description}
                      </p>
                    )}
                  </div>

                  {/* Category Field */}
                  <div className="space-y-3">
                    <label htmlFor="category" className="block text-sm font-bold" style={{ color: 'var(--admin-black-text)' }}>
                      Kategori <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={data.category || ''}
                        onChange={(e) => setData('category', e.target.value)}
                        className={`w-full px-4 py-3 pr-10 rounded-xl transition-all duration-200 appearance-none cursor-pointer ${
                          errors.category
                            ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-500/20'
                            : 'focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20'
                        }`}
                        style={{
                          background: 'rgba(255, 255, 255, 0.8)',
                          backdropFilter: 'blur(4px)',
                          WebkitBackdropFilter: 'blur(4px)',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          color: 'var(--admin-black-text)',
                        }}
                      >
                        <option value="">Pilih kategori</option>
                        {categories.filter(cat => cat && cat.trim() !== '').map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                      {/* Custom arrow */}
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-5 h-5" style={{ color: 'var(--admin-black-text)', opacity: 0.5 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    {errors.category && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <span>⚠️</span> {errors.category}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Glassmorphism File Upload Card */}
              <div className="rounded-2xl p-6 animate-slide-up animate-stagger-2" style={{
                background: 'var(--admin-glass-bg)',
                backdropFilter: 'var(--admin-glass-blur)',
                WebkitBackdropFilter: 'var(--admin-glass-blur)',
                border: '1px solid var(--admin-glass-border)',
                boxShadow: 'var(--admin-glass-shadow)',
              }}>
                <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--admin-black-text)' }}>Upload File</h2>

                <div className="space-y-4">
                  <label htmlFor="file" className="block text-sm font-bold" style={{ color: 'var(--admin-black-text)' }}>
                    File Dokumen <span className="text-red-500">*</span>
                  </label>

                  {/* Enhanced File Upload Area */}
                  <div className="relative">
                    <input
                      type="file"
                      id="file"
                      className="hidden"
                      accept={allowedFileTypes.map(t => `.${t}`).join(',')}
                      onChange={handleFileChange}
                    />
                    <label
                      htmlFor="file"
                      className={`block cursor-pointer transition-all duration-200 ${
                        data.file ? 'border-blue-400' : 'border-dashed border-gray-400'
                      } rounded-2xl p-8 text-center hover:border-blue-400 hover:scale-102`}
                      style={{
                        background: 'rgba(255, 255, 255, 0.5)',
                        backdropFilter: 'blur(4px)',
                        WebkitBackdropFilter: 'blur(4px)',
                        border: '2px dashed rgba(107, 114, 128, 0.3)',
                      }}
                    >
                      {data.file ? (
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{
                            background: 'var(--admin-gradient-icon)',
                            boxShadow: '0 8px 24px rgba(30, 64, 175, 0.3)',
                          }}>
                            <FileText className="h-8 w-8 text-white" />
                          </div>
                          <div className="text-center">
                            <p className="font-bold" style={{ color: 'var(--admin-black-text)' }}>{data.file.name}</p>
                            <p className="text-sm" style={{ color: 'var(--admin-black-text)', opacity: 0.7 }}>
                              {(data.file.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setData('file', null);
                            }}
                            className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105"
                            style={{
                              background: 'rgba(239, 68, 68, 0.1)',
                              color: '#ef4444',
                              border: '1px solid rgba(239, 68, 68, 0.2)',
                            }}
                          >
                            Ganti File
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{
                            background: 'rgba(107, 114, 128, 0.1)',
                            border: '1px solid rgba(107, 114, 128, 0.2)',
                          }}>
                            <Upload className="h-10 w-10" style={{ color: 'var(--admin-black-text)', opacity: 0.5 }} />
                          </div>
                          <div className="text-center">
                            <p className="font-medium" style={{ color: 'var(--admin-black-text)' }}>
                              Klik untuk upload atau drag & drop
                            </p>
                            <p className="text-sm mt-2" style={{ color: 'var(--admin-black-text)', opacity: 0.6 }}>
                              Format: {allowedFileTypes.join(', ').toUpperCase()} (Max 10MB)
                            </p>
                          </div>
                        </div>
                      )}
                    </label>
                  </div>

                  {errors.file && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <span>⚠️</span> {errors.file}
                    </p>
                  )}

                  {/* Progress Bar */}
                  {progress && (
                    <div className="relative">
                      <div className="w-full rounded-full h-3 overflow-hidden" style={{
                        background: 'rgba(107, 114, 128, 0.1)',
                        border: '1px solid rgba(107, 114, 128, 0.2)',
                      }}>
                        <div
                          className="h-full rounded-full transition-all duration-300 flex items-center justify-center"
                          style={{
                            width: `${progress.percentage}%`,
                            background: 'var(--admin-gradient-button)',
                          }}
                        >
                          <span className="text-xs font-bold text-white">
                            {progress.percentage}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Glassmorphism Sidebar */}
            <div className="space-y-6">
              {/* Status Card */}
              <div className="rounded-2xl p-6 animate-slide-up animate-stagger-3" style={{
                background: 'var(--admin-glass-bg)',
                backdropFilter: 'var(--admin-glass-blur)',
                WebkitBackdropFilter: 'var(--admin-glass-blur)',
                border: '1px solid var(--admin-glass-border)',
                boxShadow: 'var(--admin-glass-shadow)',
              }}>
                <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--admin-black-text)' }}>Status Publikasi</h2>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <label htmlFor="is_active" className="block text-sm font-bold" style={{ color: 'var(--admin-black-text)' }}>
                      Dokumen Aktif
                    </label>
                    <div className="relative">
                      <input
                        type="checkbox"
                        id="is_active"
                        checked={data.is_active}
                        onChange={(e) => setData('is_active', e.target.checked)}
                        className="sr-only"
                      />
                      <button
                        type="button"
                        onClick={() => setData('is_active', !data.is_active)}
                        className={`relative w-14 h-7 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          data.is_active ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                        style={{
                          boxShadow: data.is_active ? '0 4px 16px rgba(34, 197, 94, 0.3)' : '0 4px 16px rgba(107, 114, 128, 0.2)',
                        }}
                      >
                        <div
                          className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                            data.is_active ? 'translate-x-7' : 'translate-x-0'
                          }`}
                          style={{
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                          }}
                        />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--admin-black-text)', opacity: 0.7 }}>
                    Dokumen aktif akan ditampilkan di halaman publik Standar Pelayanan dan dapat diakses oleh pengunjung.
                  </p>
                </div>
              </div>

              {/* Action Buttons Card */}
              <div className="rounded-2xl p-6 animate-slide-up animate-stagger-4 sticky top-24" style={{
                background: 'var(--admin-glass-bg)',
                backdropFilter: 'var(--admin-glass-blur)',
                WebkitBackdropFilter: 'var(--admin-glass-blur)',
                border: '1px solid var(--admin-glass-border)',
                boxShadow: 'var(--admin-glass-shadow)',
              }}>
                <div className="space-y-4">
                  <button
                    type="submit"
                    disabled={processing}
                    className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                      processing ? 'animate-pulse' : ''
                    }`}
                    style={{
                      background: processing ? 'rgba(107, 114, 128, 0.5)' : 'var(--admin-gradient-button)',
                      boxShadow: processing ? 'none' : '0 8px 32px rgba(30, 64, 175, 0.3)',
                    }}
                  >
                    {processing ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Menyimpan...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Simpan Dokumen</span>
                      </div>
                    )}
                  </button>

                  <Link
                    href={route('admin.standar-pelayanan.index')}
                    className="block w-full py-4 rounded-xl font-medium transition-all duration-200 hover:scale-105 text-center"
                    style={{
                      background: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(4px)',
                      WebkitBackdropFilter: 'blur(4px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      color: 'var(--admin-black-text)',
                    }}
                  >
                    Batal
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
