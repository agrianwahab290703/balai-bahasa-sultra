import React, { useState, useEffect } from 'react';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { ArrowLeft, Upload, X, Image as ImageIcon, Users } from 'lucide-react';
import RichTextEditor from '@/Components/Admin/RichTextEditor';

interface Props {
  contentTypes: Record<string, string>;
  allowedImageTypes: string[];
  nextOrders?: Record<string, number>;
}

export default function Create({ contentTypes, allowedImageTypes, nextOrders = {} }: Props) {
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [leaders, setLeaders] = useState<Array<{name: string; period: string}>>([]);

  const { data, setData, post, processing, errors, progress } = useForm({
    type: '',
    title: '',
    content: '',
    images: [] as File[],
    year: '',
    highlight: '',
    leaders: [] as Array<{name: string; period: string}>,
    order: 0,
    is_active: true,
  });

  const isContentOptional = data.type === 'struktur';

  // Update order when type changes to show next available position
  useEffect(() => {
    if (data.type && nextOrders[data.type] !== undefined) {
      setData('order', nextOrders[data.type]);
    }
  }, [data.type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare metadata object
    const metadata: any = {};
    if (data.year) metadata.year = parseInt(data.year);
    if (data.highlight) metadata.highlight = data.highlight;
    if (leaders.length > 0) metadata.leaders = leaders;

    const formData = new FormData();
    formData.append('type', data.type);
    formData.append('title', data.title);
    formData.append('content', data.content);
    formData.append('order', data.order.toString());
    formData.append('is_active', data.is_active ? '1' : '0');

    // Add images
    data.images.forEach((image, index) => {
      formData.append(`images[${index}]`, image);
    });

    // Add metadata as JSON
    formData.append('metadata', JSON.stringify(metadata));

    post(route('admin.profile-content.store'), {
      data: formData,
      forceFormData: true,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setData('images', [...data.images, ...files]);
      
      // Create preview URLs
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviewImages([...previewImages, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...data.images];
    newImages.splice(index, 1);
    setData('images', newImages);
    
    // Revoke the preview URL and remove from state
    URL.revokeObjectURL(previewImages[index]);
    const newPreviews = [...previewImages];
    newPreviews.splice(index, 1);
    setPreviewImages(newPreviews);
  };

  // Get current type's item count for display
  const currentTypeCount = data.type ? (nextOrders[data.type] ?? 0) : 0;

  return (
    <AdminLayout>
      <Head title="Tambah Konten Profil" />

      {/* Soft Hero Section */}
      <div className="relative mb-12">
        {/* Soft background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-yellow-50 rounded-3xl" />

        {/* Floating soft elements */}
        <div className="absolute top-8 left-8 w-20 h-20 rounded-full bg-blue-100 opacity-60 blur-xl animate-pulse" />
        <div className="absolute bottom-8 right-12 w-16 h-16 rounded-full bg-yellow-100 opacity-50 blur-xl animate-pulse" style={{ animationDelay: '1s' }} />

        {/* Main content container */}
        <div className="relative bg-white/60 backdrop-blur-sm border border-white/20 rounded-3xl p-10 shadow-2xl shadow-blue-100/50">
          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-blue-300 rounded-2xl w-14 h-14 transition-all duration-500 hover:shadow-lg hover:shadow-blue-200/50"
            >
              <Link href={route('admin.profile-content.index')} className="flex items-center justify-center">
                <ArrowLeft className="h-6 w-6 text-gray-600 group-hover:text-blue-600 transition-colors duration-300" />
              </Link>
            </Button>

            <div className="flex-1">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-blue-50 rounded-full border border-blue-100">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-sm font-medium text-blue-700">Formulir Pembuatan Konten</span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-blue-500 to-white bg-clip-text text-transparent leading-tight">
                Tambah Konten Profil
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Buat konten <span className="font-semibold text-blue-600 mx-1">baru</span> untuk halaman profil dengan antarmuka yang
                <span className="font-semibold text-yellow-600 mx-1">elegan</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Content Information Card */}
            <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl shadow-xl shadow-blue-100/30 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-transparent p-6 border-b border-gray-100/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                    <ImageIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                      Informasi Konten
                    </h2>
                    <p className="text-sm text-gray-600">Isi data konten profil dengan lengkap</p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-8">
                <div className="space-y-4">
                  <Label htmlFor="type" className="text-base font-semibold text-gray-700 flex items-center gap-2">
                    Tipe Konten <span className="text-red-500 ml-1">*</span>
                    <div className="w-1 h-1 bg-blue-500 rounded-full" />
                  </Label>
                  <Select
                    value={data.type || undefined}
                    onValueChange={(value) => setData('type', value)}
                  >
                    <SelectTrigger
                      className={`h-12 bg-white/80 backdrop-blur-sm border-2 ${errors.type ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-200'} hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 rounded-2xl`}
                    >
                      <SelectValue placeholder="Pilih tipe konten" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl">
                      {Object.entries(contentTypes).map(([value, label]) => (
                        value && value.trim() !== '' ? (
                          <SelectItem key={value} value={value} className="py-3">
                            {label} {nextOrders[value] !== undefined && `(${nextOrders[value]} item)`}
                          </SelectItem>
                        ) : null
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.type && (
                    <div className="flex items-center gap-2 p-3 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl">
                      <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse" />
                      <p className="text-sm text-red-700 font-medium">{errors.type}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <Label htmlFor="title" className="text-base font-semibold text-gray-700 flex items-center gap-2">
                    Judul Konten <span className="text-red-500 ml-1">*</span>
                    <div className="w-1 h-1 bg-blue-500 rounded-full" />
                  </Label>
                  <Input
                    id="title"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    placeholder="Masukkan judul konten yang menarik"
                    className={`h-12 bg-white/80 backdrop-blur-sm border-2 ${errors.title ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-200'} hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 rounded-2xl text-base placeholder-gray-400`}
                  />
                  {errors.title && (
                    <div className="flex items-center gap-2 p-3 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl">
                      <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse" />
                      <p className="text-sm text-red-700 font-medium">{errors.title}</p>
                    </div>
                  )}
                </div>

                {/* Additional Fields for Sejarah */}
                {data.type === 'sejarah' && (
                  <>
                    <div className="space-y-4">
                      <Label htmlFor="year" className="text-base font-semibold text-gray-700 flex items-center gap-2">
                        Tahun Kejadian
                        <div className="w-1 h-1 bg-blue-500 rounded-full" />
                      </Label>
                      <Input
                        id="year"
                        type="number"
                        value={data.year}
                        onChange={(e) => setData('year', e.target.value)}
                        placeholder="Contoh: 2004"
                        className="h-12 bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 rounded-2xl text-base placeholder-gray-400"
                      />
                    </div>

                    <div className="space-y-4">
                      <Label htmlFor="highlight" className="text-base font-semibold text-gray-700 flex items-center gap-2">
                        Highlight/Deskripsi Singkat
                        <div className="w-1 h-1 bg-blue-500 rounded-full" />
                      </Label>
                      <Input
                        id="highlight"
                        value={data.highlight}
                        onChange={(e) => setData('highlight', e.target.value)}
                        placeholder="Contoh: Peresmian Kantor Bahasa Sulawesi Tenggara"
                        className="h-12 bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 rounded-2xl text-base placeholder-gray-400"
                      />
                    </div>
                  </>
                )}

                <div className="space-y-4">
                  <Label htmlFor="content" className="text-base font-semibold text-gray-700 flex items-center gap-2">
                    Konten
                    {isContentOptional ? (
                      <span className="text-sm font-normal text-gray-400">(Opsional untuk Struktur Organisasi)</span>
                    ) : (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                    <div className="w-1 h-1 bg-blue-500 rounded-full" />
                  </Label>
                  <div className="bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl overflow-hidden shadow-inner">
                    <RichTextEditor
                      value={data.content}
                      onChange={(value) => setData('content', value)}
                      placeholder="Tulis konten yang informatif dan menarik..."
                      minHeight={350}
                      className="border-0 bg-transparent"
                    />
                  </div>
                  {isContentOptional && (
                    <p className="text-sm text-gray-500">
                      Anda dapat melewati bagian ini jika struktur hanya membutuhkan gambar atau bagan.
                    </p>
                  )}
                  {errors.content && (
                    <div className="flex items-center gap-2 p-3 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl">
                      <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse" />
                      <p className="text-sm text-red-700 font-medium">{errors.content}</p>
                    </div>
                  )}
                </div>

                {/* Leaders Section for Sejarah */}
                {data.type === 'sejarah' && (
                  <>
                    <div className="bg-gradient-to-r from-amber-50 to-transparent p-4 rounded-2xl">
                      <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Daftar Kepala Kantor (Opsional)
                      </h3>
                      <div className="space-y-3">
                        {leaders.map((leader, index) => (
                          <div key={index} className="flex gap-3">
                            <Input
                              value={leader.name}
                              onChange={(e) => {
                                const newLeaders = [...leaders];
                                newLeaders[index].name = e.target.value;
                                setLeaders(newLeaders);
                              }}
                              placeholder="Nama kepala kantor"
                              className="bg-white/80 backdrop-blur-sm"
                            />
                            <Input
                              value={leader.period}
                              onChange={(e) => {
                                const newLeaders = [...leaders];
                                newLeaders[index].period = e.target.value;
                                setLeaders(newLeaders);
                              }}
                              placeholder="Masa jabatan"
                              className="bg-white/80 backdrop-blur-sm"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newLeaders = leaders.filter((_, i) => i !== index);
                                setLeaders(newLeaders);
                              }}
                              className="text-red-500 hover:text-red-600"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setLeaders([...leaders, { name: '', period: '' }])}
                          className="w-full"
                        >
                          Tambah Kepala Kantor
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Image Upload Card */}
            <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl shadow-xl shadow-blue-100/30 overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-50 to-transparent p-6 border-b border-gray-100/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg">
                    <Upload className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-500 bg-clip-text text-transparent">
                      Galeri Gambar
                    </h2>
                    <p className="text-sm text-gray-600">Upload gambar untuk konten profil</p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="bg-blue-50/80 backdrop-blur-sm border border-blue-200 rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-800 mb-1">Upload Gambar (Opsional)</p>
                      <p className="text-sm text-blue-600">
                        Upload gambar untuk konten ini. Sangat berguna untuk struktur organisasi dan visualisasi yang lebih baik.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Preview existing images */}
                {previewImages.length > 0 && (
                  <div className="space-y-4">
                    <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <span>Preview Gambar ({previewImages.length})</span>
                      <div className="w-1 h-1 bg-blue-500 rounded-full" />
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {previewImages.map((preview, index) => (
                        <div key={index} className="relative group">
                          <div className="bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-blue-100/30 transition-all duration-500 hover:scale-105">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-32 object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          </div>
                          <Button
                            type="button"
                            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-500/90 backdrop-blur-sm hover:bg-red-600 border-2 border-white shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-3 w-3 text-white" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div
                  className="relative bg-gradient-to-br from-blue-50 via-white to-yellow-50 border-2 border-dashed border-gray-300 rounded-3xl p-10 text-center cursor-pointer transition-all duration-500 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-100/30 group"
                  onClick={() => document.getElementById('images')?.click()}
                >
                  <input
                    type="file"
                    id="images"
                    className="hidden"
                    accept={allowedImageTypes.map(t => `.${t}`).join(',')}
                    multiple
                    onChange={handleImageChange}
                  />

                  <div className="w-20 h-20 rounded-full bg-white/80 backdrop-blur-sm border-2 border-gray-200 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 group-hover:border-blue-400 transition-all duration-500 shadow-lg">
                    <Upload className="h-10 w-10 text-blue-500" />
                  </div>

                  <p className="text-lg font-semibold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    Klik untuk upload gambar
                  </p>
                  <p className="text-sm text-gray-500">
                    Format: {allowedImageTypes.join(', ').toUpperCase()} • Max 2MB per file
                  </p>

                  <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-yellow-200 opacity-50 blur-xl group-hover:scale-150 transition-transform duration-500" />
                </div>

                {errors.images && (
                  <div className="flex items-center gap-3 p-4 bg-red-50/80 backdrop-blur-sm border-2 border-red-200 rounded-2xl">
                    <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                      <X className="h-3 w-3 text-white" />
                    </div>
                    <p className="text-sm text-red-700 font-medium">{errors.images}</p>
                  </div>
                )}

                {progress && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Mengupload...</span>
                      <span>{progress.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden shadow-inner">
                      <div
                        className="h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-blue-500 via-purple-500 to-yellow-500"
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:sticky lg:top-6 lg:self-start lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto lg:pr-2 space-y-6 form-sidebar">
            {/* Settings Card */}
            <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl shadow-xl shadow-blue-100/30 overflow-hidden sidebar-card">
              <div className="bg-gradient-to-r from-purple-50 to-transparent p-6 border-b border-gray-100/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <ImageIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent">
                      Pengaturan
                    </h2>
                    <p className="text-sm text-gray-600">Konfigurasi tampilan konten</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-8">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label htmlFor="is_active" className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-2">
                        Status Aktif
                        {data.is_active && (
                          <div className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                            AKTIF
                          </div>
                        )}
                      </Label>
                      <p className="text-sm text-gray-600">
                        Konten aktif akan ditampilkan di halaman publik dan dapat diakses oleh pengunjung
                      </p>
                    </div>
                    <Switch
                      id="is_active"
                      checked={data.is_active}
                      onCheckedChange={(checked) => setData('is_active', checked)}
                      className="scale-125"
                    />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-5">
                  <Label htmlFor="order" className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-3">
                    Urutan Tampil
                    <div className="w-1 h-1 bg-yellow-500 rounded-full" />
                  </Label>
                  <Input
                    id="order"
                    type="number"
                    min="0"
                    max={currentTypeCount}
                    value={data.order}
                    onChange={(e) => setData('order', parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="h-12 bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-yellow-400 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100 transition-all duration-300 rounded-2xl text-base text-center font-bold"
                  />
                  <div className="mt-3 p-3 bg-yellow-100/80 backdrop-blur-sm rounded-xl space-y-1">
                    <p className="text-xs text-yellow-800 font-medium">
                      📌 Angka lebih kecil = tampil lebih awal (0 = pertama)
                    </p>
                    {data.type && (
                      <p className="text-xs text-yellow-700">
                        💡 Tipe "{contentTypes[data.type]}" memiliki {currentTypeCount} item. 
                        Urutan {data.order} berarti posisi ke-{data.order + 1}.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons Card */}
            <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl shadow-xl shadow-green-100/30 overflow-hidden sidebar-card">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b border-gray-100/50">
                <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Aksi
                </h3>
              </div>

              <div className="p-6 space-y-4">
                <Button
                  type="submit"
                  className="w-full h-14 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl font-bold text-lg transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-blue-200/50 relative overflow-hidden group"
                  disabled={processing}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <span className="relative z-10 flex items-center justify-center">
                    {processing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        Simpan Konten
                      </>
                    )}
                  </span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  asChild
                  className="w-full h-14 bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-red-400 hover:bg-red-50/50 rounded-2xl font-bold text-lg text-gray-700 hover:text-red-600 transition-all duration-500 shadow-md hover:shadow-xl hover:shadow-red-100/30"
                >
                  <Link href={route('admin.profile-content.index')} className="flex items-center justify-center">
                    Batal
                  </Link>
                </Button>

                <div className="text-center text-xs text-gray-500 mt-4">
                  Semua perubahan akan tersimpan otomatis
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
