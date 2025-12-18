import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import Layout from '@/Layouts/AdminLayout';
import {
  Bell,
  CalendarClock,
  Sparkles,
  AlertTriangle,
  Hash,
  Type,
  Wand2,
  Activity,
  Image,
  ArrowLeft,
  Save,
  Eye,
  Settings,
  Zap,
  Clock,
  BarChart3,
  FileText,
  Image as ImageIcon,
  X,
  Plus,
  ChevronRight,
  Info,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Users,
  Target,
  Lightbulb
} from 'lucide-react';
import SupportingImagesUploader from '@/Components/Admin/SupportingImagesUploader';

export default function Create() {
  const { data, setData, post, processing, errors, transform } = useForm({
    judul: '',
    konten: '',
    tipe: 'umum',
    tanggal_berlaku: '',
    status: 'draft',
    prioritas: 0,
    meta_description: '',
    gallery_images: [],
  });

  const [activeTab, setActiveTab] = useState('content');
  const [isPreview, setIsPreview] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [estimatedReadTime, setEstimatedReadTime] = useState(0);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    setCharCount(data.konten.length);
    const words = data.konten.split(/\s+/).filter(word => word.length > 0).length;
    setEstimatedReadTime(Math.ceil(words / 200)); // Average reading speed
  }, [data.konten]);

  const submit = (e) => {
    e.preventDefault();
    post(route('admin.pengumuman.store'), {
      onSuccess: () => {
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      }
    });
  };

  const tipeOptions = [
    {
      value: 'umum',
      label: 'Umum',
      icon: FileText,
      gradient: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-700',
      description: 'Informasi biasa untuk semua'
    },
    {
      value: 'urgent',
      label: 'Urgent',
      icon: Zap,
      gradient: 'from-red-500 to-orange-500',
      bgLight: 'bg-red-50',
      textColor: 'text-red-700',
      description: 'Penting & segera'
    },
    {
      value: 'tanggal_spesifik',
      label: 'Acara Spesial',
      icon: CalendarClock,
      gradient: 'from-amber-500 to-yellow-500',
      bgLight: 'bg-amber-50',
      textColor: 'text-amber-700',
      description: 'Ada tanggal khusus'
    },
  ];

  const statusConfig = {
    draft: {
      icon: FileText,
      color: 'bg-gray-100 text-gray-700 border-gray-200',
      label: 'Draft',
      description: 'Disimpan tapi belum dipublikasi'
    },
    active: {
      icon: CheckCircle2,
      color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      label: 'Publish',
      description: 'Sudah tayang di publik'
    },
  };

  const getPriorityColor = (value) => {
    if (value <= 3) return 'bg-gray-500';
    if (value <= 6) return 'bg-blue-500';
    if (value <= 8) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getPriorityLabel = (value) => {
    if (value <= 3) return 'Rendah';
    if (value <= 6) return 'Sedang';
    if (value <= 8) return 'Tinggi';
    return 'Sangat Tinggi';
  };

  return (
    <Layout>
      <Head title="Buat Pengumuman Baru" />

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 animate-pulse">
          <div className="bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium">Pengumuman berhasil dibuat!</span>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link
                  href={route('admin.pengumuman.index')}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <div className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Kembali</span>
                </Link>

                <div className="h-6 w-px bg-gray-200" />

                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white">
                      <Bell className="w-5 h-5" />
                    </div>
                    Buat Pengumuman Baru
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">Buat pengumuman yang menarik dan informatif</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsPreview(!isPreview)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    isPreview
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  {isPreview ? 'Edit Mode' : 'Preview'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Quick Navigation Menu */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8">
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
          {!isPreview ? (
            <form onSubmit={submit} className="space-y-8">
              {/* Main Content Grid */}
              <div className="grid lg:grid-cols-12 gap-8">
                {/* Left Column - Main Form */}
                <div className="lg:col-span-8 space-y-8">
                  {/* Card: Tipe Pengumuman */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-6 py-4">
                      <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Pilih Tipe Pengumuman
                      </h2>
                    </div>

                    <div className="p-6">
                      <div className="grid sm:grid-cols-3 gap-4">
                        {tipeOptions.map((tipe) => {
                          const Icon = tipe.icon;
                          return (
                            <button
                              key={tipe.value}
                              type="button"
                              onClick={() => setData('tipe', tipe.value)}
                              className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                                data.tipe === tipe.value
                                  ? 'border-blue-500 bg-blue-50 shadow-lg transform scale-[1.02]'
                                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                              }`}
                            >
                              {data.tipe === tipe.value && (
                                <div className="absolute -top-2 -right-2 bg-blue-500 rounded-full p-1">
                                  <CheckCircle2 className="w-4 h-4 text-white" />
                                </div>
                              )}

                              <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${tipe.gradient} text-white mb-3`}>
                                <Icon className="w-6 h-6" />
                              </div>

                              <h3 className="font-semibold text-gray-900 mb-1">{tipe.label}</h3>
                              <p className="text-xs text-gray-500">{tipe.description}</p>
                            </button>
                          );
                        })}
                      </div>
                      {errors.tipe && (
                        <p className="mt-3 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.tipe}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Card: Konten */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-600 px-6 py-4">
                      <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Konten Pengumuman
                      </h2>
                    </div>

                    <div className="p-6 space-y-6">
                      {/* Judul */}
                      <div>
                        <label htmlFor="judul" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <Type className="w-4 h-4 text-blue-600" />
                          Judul Pengumuman
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="judul"
                          type="text"
                          value={data.judul}
                          onChange={(e) => setData('judul', e.target.value)}
                          className="block w-full px-4 py-3 text-base rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-colors"
                          placeholder="Tulis judul yang menarik dan jelas..."
                        />
                        {errors.judul && (
                          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.judul}
                          </p>
                        )}
                      </div>

                      {/* Konten */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label htmlFor="konten" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-600" />
                            Isi Pengumuman
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>{charCount} karakter</span>
                            <span>~{estimatedReadTime} menit baca</span>
                          </div>
                        </div>
                        <div className="relative">
                          <textarea
                            id="konten"
                            rows={12}
                            value={data.konten}
                            onChange={(e) => setData('konten', e.target.value)}
                            className="block w-full px-4 py-3 text-base rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-colors resize-none"
                            placeholder="Tulis isi pengumuman secara detail dan terstruktur..."
                          />
                          <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                            Gunakan Enter untuk paragraf baru
                          </div>
                        </div>
                        {errors.konten && (
                          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.konten}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card: Gallery */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4">
                      <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <ImageIcon className="w-5 h-5" />
                        Foto Pendukung
                      </h2>
                    </div>

                    <div className="p-6">
                      <div className="mb-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                        <div className="flex items-start gap-3">
                          <Info className="w-5 h-5 text-amber-600 mt-0.5" />
                          <div className="text-sm text-amber-800">
                            <p className="font-semibold mb-1">Tips Foto Pendukung</p>
                            <ul className="text-xs space-y-1">
                              <li>• Maksimal 6 foto dengan resolusi tinggi</li>
                              <li>• Gunakan format JPEG atau PNG</li>
                              <li>• Pastikan foto relevan dengan konten</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <SupportingImagesUploader
                        value={data.gallery_images}
                        onChange={(next) => setData('gallery_images', next)}
                      />
                      {errors.gallery_images && (
                        <p className="mt-3 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.gallery_images}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column - Settings & Meta */}
                <div className="lg:col-span-4 space-y-8">
                  {/* Card: Quick Actions */}
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Lightbulb className="w-5 h-5" />
                        Quick Stats
                      </h3>
                      <TrendingUp className="w-5 h-5 opacity-70" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/20 rounded-lg p-3">
                        <div className="text-2xl font-bold">{charCount}</div>
                        <div className="text-xs opacity-90">Karakter</div>
                      </div>
                      <div className="bg-white/20 rounded-lg p-3">
                        <div className="text-2xl font-bold">{data.gallery_images.length}</div>
                        <div className="text-xs opacity-90">Foto</div>
                      </div>
                    </div>
                  </div>

                  {/* Card: Status & Publish */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-emerald-600" />
                        Status & Publikasi
                      </h3>
                    </div>

                    <div className="p-6 space-y-6">
                      {/* Status */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Status Publikasi</label>
                        <div className="space-y-2">
                          {Object.entries(statusConfig).map(([value, config]) => {
                            const Icon = config.icon;
                            return (
                              <button
                                key={value}
                                type="button"
                                onClick={() => setData('status', value)}
                                className={`w-full p-3 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${
                                  data.status === value
                                    ? 'border-emerald-500 bg-emerald-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <Icon className={`w-5 h-5 ${data.status === value ? 'text-emerald-600' : 'text-gray-400'}`} />
                                <div className="text-left">
                                  <p className="font-medium text-gray-900">{config.label}</p>
                                  <p className="text-xs text-gray-500">{config.description}</p>
                                </div>
                                {data.status === value && (
                                  <CheckCircle2 className="w-5 h-5 text-emerald-600 ml-auto" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                        {errors.status && (
                          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.status}
                          </p>
                        )}
                      </div>

                      {/* Tanggal Berlaku */}
                      <div>
                        <label htmlFor="tanggal_berlaku" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <CalendarClock className="w-4 h-4 text-blue-600" />
                          Tanggal Berlaku
                          <span className="text-xs text-gray-400 font-normal">(Opsional)</span>
                        </label>
                        <input
                          id="tanggal_berlaku"
                          type="datetime-local"
                          value={data.tanggal_berlaku}
                          onChange={(e) => setData('tanggal_berlaku', e.target.value)}
                          className="block w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-colors"
                        />
                        {errors.tanggal_berlaku && (
                          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.tanggal_berlaku}
                          </p>
                        )}
                      </div>

                      {/* Prioritas */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-purple-600" />
                          Prioritas
                        </label>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <input
                                type="range"
                                min="0"
                                max="10"
                                value={data.prioritas}
                                onChange={(e) => setData('prioritas', e.target.value)}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                style={{
                                  background: `linear-gradient(to right, ${getPriorityColor(data.prioritas)} 0%, ${getPriorityColor(data.prioritas)} ${data.prioritas * 10}%, #e5e7eb ${data.prioritas * 10}%, #e5e7eb 100%)`
                                }}
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min="0"
                                max="10"
                                value={data.prioritas}
                                onChange={(e) => setData('prioritas', e.target.value)}
                                className="w-16 px-3 py-2 text-center rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-0"
                              />
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">Rendah</span>
                            <span className={`px-2 py-1 rounded-lg text-white font-medium`} style={{backgroundColor: getPriorityColor(data.prioritas)}}>
                              {getPriorityLabel(data.prioritas)}
                            </span>
                            <span className="text-gray-500">Sangat Tinggi</span>
                          </div>
                        </div>
                        {errors.prioritas && (
                          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.prioritas}
                          </p>
                        )}
                      </div>

                      {/* Meta Description */}
                      <div>
                        <label htmlFor="meta_description" className="block text-sm font-semibold text-gray-700 mb-2">
                          Meta Description
                          <span className="text-xs text-gray-400 font-normal block">Untuk SEO</span>
                        </label>
                        <textarea
                          id="meta_description"
                          rows={3}
                          value={data.meta_description}
                          onChange={(e) => setData('meta_description', e.target.value)}
                          className="block w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-colors resize-none"
                          placeholder="Ringkasan singkat untuk mesin pencari..."
                        />
                        {errors.meta_description && (
                          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.meta_description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Alert for Urgent */}
                  {data.tipe === 'urgent' && (
                    <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-6">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-red-500 rounded-lg">
                          <AlertTriangle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-red-900 mb-1">Pengumuman Urgent</p>
                          <p className="text-sm text-red-700">
                            Pengumuman ini akan ditampilkan dengan penanda khusus dan prioritas tinggi. Pastikan informasi sudah benar.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      type="submit"
                      disabled={processing}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {processing ? (
                        <>
                          <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                          Menyimpan...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          {data.status === 'draft' ? 'Simpan Draft' : 'Publikasikan'}
                        </>
                      )}
                    </button>

                    <Link
                      href={route('admin.pengumuman.index')}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
                    >
                      <X className="w-5 h-5" />
                      Batal
                    </Link>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            /* Preview Mode */
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
                  <div className="flex items-center justify-between text-white">
                    <h2 className="text-xl font-semibold">Preview Pengumuman</h2>
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                      {data.tipe === 'urgent' ? 'Urgent' : data.tipe === 'tanggal_spesifik' ? 'Acara Spesial' : 'Umum'}
                    </span>
                  </div>
                </div>

                <div className="p-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {data.judul || 'Judul Pengumuman'}
                  </h1>

                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                    <span className="flex items-center gap-1">
                      <CalendarClock className="w-4 h-4" />
                      {new Date().toLocaleDateString('id-ID')}
                    </span>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      data.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {data.status === 'active' ? 'Dipublikasikan' : 'Draft'}
                    </span>
                    <span className="flex items-center gap-1">
                      <BarChart3 className="w-4 h-4" />
                      Prioritas: {getPriorityLabel(data.prioritas)}
                    </span>
                  </div>

                  <div className="prose max-w-none">
                    {data.konten ? (
                      data.konten.split('\n').map((paragraph, index) => (
                        <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                          {paragraph}
                        </p>
                      ))
                    ) : (
                      <p className="text-gray-400 italic">Konten pengumuman akan muncul di sini...</p>
                    )}
                  </div>

                  {data.gallery_images.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-blue-600" />
                        Foto Pendukung
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        {data.gallery_images.map((image, index) => (
                          <img
                            key={index}
                            src={image.url || '/placeholder-image.jpg'}
                            alt={`Foto ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {data.meta_description && (
                    <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-semibold text-gray-700 mb-1">Meta Description</h4>
                      <p className="text-sm text-gray-600">{data.meta_description}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </Layout>
  );
}