import React, { useState, useCallback } from 'react';
import { useForm } from '@inertiajs/react';
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
import { MediaPicker } from '@/Components/Admin/MediaPicker';
import {
  Image as ImageIcon,
  X,
  Loader2,
  FileText,
  User,
  MapPin,
  Calendar,
  Building,
  Globe,
  Star,
  Upload
} from 'lucide-react';

interface Berita {
  id: number;
  judul_utama: string;
  slug: string;
  teras_berita: string | null;
  hero_image: string | null;
  hero_image_alt: string | null;
  kategori: string | null;
  is_published: boolean;
  is_featured: boolean;
  author: string | null;
  sumber_rilis: string | null;
  lokasi: string | null;
  tanggal_rilis: string | null;
  biro: string | null;
}

interface Props {
  berita?: Berita;
  categories: string[];
}

export default function BeritaForm({ berita, categories }: Props) {
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [activeEditorField, setActiveEditorField] = useState<string | null>(null);

  const { data, setData, post, put, processing, errors } = useForm({
    judul_utama: berita?.judul_utama || '',
    teras_berita: berita?.teras_berita || '',
    hero_image: berita?.hero_image || '',
    hero_image_alt: berita?.hero_image_alt || '',
    kategori: berita?.kategori || '',
    is_published: berita?.is_published ?? false,
    is_featured: berita?.is_featured ?? false,
    author: berita?.author || '',
    sumber_rilis: berita?.sumber_rilis || '',
    lokasi: berita?.lokasi || 'Kendari',
    tanggal_rilis: berita?.tanggal_rilis || new Date().toISOString().split('T')[0],
    biro: berita?.biro || 'Biro Komunikasi dan Layanan Informasi',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (berita) {
      put(route('admin.berita.update', berita.id));
    } else {
      post(route('admin.berita.store'));
    }
  };

  const handleImageUpload = useCallback(async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('context', 'hero_image');

    const response = await fetch('/admin/media/upload', {
      method: 'POST',
      headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const result = await response.json();
    return result.url;
  }, []); // No dependencies needed for this function

  const handleMediaSelect = useCallback((url: string) => {
    if (activeEditorField) {
      // Insert into rich text editor - handled by the editor itself
    } else {
      setData('hero_image', url);
    }
    setMediaPickerOpen(false);
  }, [activeEditorField, setData]);

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Judul Utama Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Judul Utama</h3>
                  <p className="text-xs text-gray-500">Judul berita yang akan tampil</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div>
                <Label htmlFor="judul_utama" className="text-sm font-medium text-gray-700 mb-2 block">
                  Judul Utama <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="judul_utama"
                  value={data.judul_utama}
                  onChange={(e) => setData('judul_utama', e.target.value)}
                  placeholder="Masukkan judul berita yang menarik..."
                  className={`h-12 text-lg ${errors.judul_utama ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'}`}
                />
                {errors.judul_utama && (
                  <p className="text-sm text-red-500 mt-1.5 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-red-500" />
                    {errors.judul_utama}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Hero Image Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                  <ImageIcon className="h-4 w-4 text-violet-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Gambar Utama</h3>
                  <p className="text-xs text-gray-500">Hero image untuk thumbnail</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="flex gap-6">
                {data.hero_image ? (
                  <div className="relative group">
                    <img
                      src={data.hero_image}
                      alt={data.hero_image_alt || 'Hero image'}
                      className="w-64 h-40 object-cover rounded-xl border-2 border-gray-200 shadow-sm"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity flex items-center justify-center gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setActiveEditorField(null);
                          setMediaPickerOpen(true);
                        }}
                        className="bg-white/90 hover:bg-white"
                      >
                        Ganti
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => setData('hero_image', '')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      setActiveEditorField(null);
                      setMediaPickerOpen(true);
                    }}
                    className="w-64 h-40 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center mb-3 transition-colors">
                      <Upload className="h-6 w-6 text-gray-400 group-hover:text-blue-500" />
                    </div>
                    <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600">Pilih Gambar</span>
                    <span className="text-xs text-gray-400 mt-1">PNG, JPG hingga 5MB</span>
                  </div>
                )}
                
                <div className="flex-1 space-y-4">
                  <div>
                    <Label htmlFor="hero_image_alt" className="text-sm font-medium text-gray-700 mb-2 block">
                      Alt Text (SEO)
                    </Label>
                    <Input
                      id="hero_image_alt"
                      value={data.hero_image_alt}
                      onChange={(e) => setData('hero_image_alt', e.target.value)}
                      placeholder="Deskripsi gambar untuk aksesibilitas"
                      className="border-gray-200"
                    />
                    <p className="text-xs text-gray-400 mt-1.5">Penting untuk SEO dan screen readers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Konten Berita Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Konten Berita</h3>
                  <p className="text-xs text-gray-500">Tulis isi berita secara lengkap</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Konten Berita</Label>
                <RichTextEditor
                  value={data.teras_berita}
                  onChange={(value) => setData('teras_berita', value)}
                  placeholder="Tulis isi berita secara lengkap..."
                  onImageUpload={handleImageUpload}
                  mediaLibraryEnabled
                  onMediaLibraryOpen={() => {
                    setActiveEditorField('teras_berita');
                    setMediaPickerOpen(true);
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - 1 column */}
        <div className="lg:col-span-1">
          <div className="space-y-6 lg:sticky lg:top-6">
            {/* Publish Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
                <h3 className="font-semibold text-gray-900">Publikasi</h3>
              </div>
              <div className="p-5 space-y-4">
                {/* Publish Toggle */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg ${data.is_published ? 'bg-emerald-100' : 'bg-gray-200'} flex items-center justify-center transition-colors`}>
                      <Globe className={`h-4 w-4 ${data.is_published ? 'text-emerald-600' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Publish</p>
                      <p className="text-xs text-gray-500">{data.is_published ? 'Aktif' : 'Draft'}</p>
                    </div>
                  </div>
                  <Switch
                    checked={data.is_published}
                    onCheckedChange={(checked) => setData('is_published', checked)}
                    className="data-[state=checked]:bg-emerald-500"
                  />
                </div>

                {/* Featured Toggle */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg ${data.is_featured ? 'bg-amber-100' : 'bg-gray-200'} flex items-center justify-center transition-colors`}>
                      <Star className={`h-4 w-4 ${data.is_featured ? 'text-amber-600' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Featured</p>
                      <p className="text-xs text-gray-500">Tampil di homepage</p>
                    </div>
                  </div>
                  <Switch
                    checked={data.is_featured}
                    onCheckedChange={(checked) => setData('is_featured', checked)}
                    className="data-[state=checked]:bg-amber-500"
                  />
                </div>

                {/* Submit Buttons */}
                <div className="pt-3 space-y-2">
                  <Button 
                    type="submit" 
                    disabled={processing}
                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-sm font-medium shadow-lg shadow-blue-500/25"
                  >
                    {processing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    {berita ? 'Simpan Perubahan' : 'Publish Berita'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full h-9 text-sm"
                    onClick={() => window.history.back()}
                  >
                    Batal
                  </Button>
                </div>
              </div>
            </div>

            {/* Metadata Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                <h3 className="font-semibold text-gray-900">Metadata</h3>
              </div>
              <div className="p-5 space-y-4">
                <div className="relative">
                  <Label className="text-xs font-medium text-gray-600 mb-1.5 block flex items-center gap-1.5">
                    <Building className="h-3.5 w-3.5" /> Kategori
                  </Label>
                  <Select
                    value={data.kategori || undefined}
                    onValueChange={(value) => setData('kategori', value)}
                  >
                    <SelectTrigger className="w-full h-10 border-gray-200 bg-white">
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-white border shadow-lg">
                      {categories.filter(cat => cat && cat.trim() !== '').map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                      {!categories.includes('Berita') && <SelectItem value="Berita">Berita</SelectItem>}
                      {!categories.includes('Pengumuman') && <SelectItem value="Pengumuman">Pengumuman</SelectItem>}
                      {!categories.includes('Kegiatan') && <SelectItem value="Kegiatan">Kegiatan</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs font-medium text-gray-600 mb-1.5 block flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" /> Author
                  </Label>
                  <Input
                    value={data.author}
                    onChange={(e) => setData('author', e.target.value)}
                    placeholder="Nama penulis"
                    className="h-10 border-gray-200"
                  />
                </div>

                <div>
                  <Label className="text-xs font-medium text-gray-600 mb-1.5 block flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" /> Lokasi
                  </Label>
                  <Input
                    value={data.lokasi}
                    onChange={(e) => setData('lokasi', e.target.value)}
                    placeholder="Lokasi berita"
                    className="h-10 border-gray-200"
                  />
                </div>

              <div>
                <Label className="text-xs font-medium text-gray-600 mb-1.5 block flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" /> Tanggal Rilis
                </Label>
                <Input
                  type="date"
                  value={data.tanggal_rilis}
                  onChange={(e) => setData('tanggal_rilis', e.target.value)}
                  className="border-gray-200"
                />
              </div>

              <div>
                <Label className="text-xs font-medium text-gray-600 mb-1.5 block">Sumber</Label>
                <Input
                  value={data.sumber_rilis}
                  onChange={(e) => setData('sumber_rilis', e.target.value)}
                  placeholder="Sumber berita"
                  className="border-gray-200"
                />
              </div>

              <div>
                <Label className="text-xs font-medium text-gray-600 mb-1.5 block">Biro</Label>
                <Input
                  value={data.biro}
                  onChange={(e) => setData('biro', e.target.value)}
                  placeholder="Biro terkait"
                  className="border-gray-200"
                />
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Media Picker Modal */}
      <MediaPicker
        open={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={handleMediaSelect}
        title="Pilih Gambar"
      />
    </form>
  );
}
