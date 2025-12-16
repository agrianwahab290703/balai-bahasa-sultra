import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
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
import RichTextEditor from '@/Components/Admin/RichTextEditor';
import { 
  ArrowLeft, 
  MessageCircleQuestion, 
  ChevronRight, 
  FolderOpen,
  Globe,
  Lightbulb,
  Save,
  X
} from 'lucide-react';

interface Props {
  categories: Record<string, string>;
}

export default function Create({ categories }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    question: '',
    answer: '',
    category: '',
    is_active: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('admin.ssd.store'));
  };

  return (
    <AdminLayout>
      <Head title="Tambah FAQ" />

      <div className="space-y-6">
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 p-8">
          {/* Background decorations */}
          <div className="absolute inset-0 bg-grid-white/10" />
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl" />
          
          <div className="relative">
            <div className="flex items-center gap-4">
              <Link 
                href={route('admin.ssd.index')}
                className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <MessageCircleQuestion className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Tambah FAQ Baru</h1>
                  <p className="text-white/80 text-sm">Buat pertanyaan yang sering diajukan</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              {/* Question & Answer Card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-amber-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                      <MessageCircleQuestion className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-900">Pertanyaan & Jawaban</h2>
                      <p className="text-xs text-gray-500">Isi pertanyaan dan jawaban FAQ</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  {/* Question Field */}
                  <div className="space-y-2">
                    <Label htmlFor="question" className="text-sm font-medium text-gray-700">
                      Pertanyaan <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="question"
                      value={data.question}
                      onChange={(e) => setData('question', e.target.value)}
                      placeholder="Contoh: Bagaimana cara mendaftar kursus bahasa?"
                      rows={3}
                      className={`resize-none border-gray-200 focus:border-orange-400 focus:ring-orange-400/20 ${
                        errors.question ? 'border-red-400 focus:border-red-400' : ''
                      }`}
                    />
                    {errors.question && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <X className="h-3 w-3" />
                        {errors.question}
                      </p>
                    )}
                    <p className="text-xs text-gray-400">Tulis pertanyaan yang jelas dan mudah dipahami</p>
                  </div>

                  {/* Answer Field */}
                  <div className="space-y-2">
                    <Label htmlFor="answer" className="text-sm font-medium text-gray-700">
                      Jawaban <span className="text-red-500">*</span>
                    </Label>
                    <RichTextEditor
                      value={data.answer}
                      onChange={(value) => setData('answer', value)}
                      placeholder="Tulis jawaban lengkap di sini..."
                      minHeight={250}
                    />
                    {errors.answer && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <X className="h-3 w-3" />
                        {errors.answer}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - 1 column */}
            <div className="lg:col-span-1">
              <div className="space-y-6 lg:sticky lg:top-6">
                {/* Category Card */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="h-4 w-4 text-orange-500" />
                      <h3 className="font-semibold text-gray-900">Kategori</h3>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                        Pilih Kategori <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={data.category || undefined}
                        onValueChange={(value) => setData('category', value)}
                      >
                        <SelectTrigger 
                          className={`w-full border-gray-200 focus:border-orange-400 focus:ring-orange-400/20 ${
                            errors.category ? 'border-red-400' : ''
                          }`}
                        >
                          <SelectValue placeholder="Pilih kategori FAQ" />
                        </SelectTrigger>
                        <SelectContent className="z-50 bg-white">
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
                        <p className="text-sm text-red-500">{errors.category}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status Card */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-orange-500" />
                      <h3 className="font-semibold text-gray-900">Status Publikasi</h3>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg ${data.is_active ? 'bg-emerald-100' : 'bg-gray-200'} flex items-center justify-center transition-colors`}>
                          <Globe className={`h-4 w-4 ${data.is_active ? 'text-emerald-600' : 'text-gray-400'}`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {data.is_active ? 'Aktif' : 'Nonaktif'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {data.is_active ? 'Tampil di publik' : 'Disembunyikan'}
                          </p>
                        </div>
                      </div>
                      <Switch
                        id="is_active"
                        checked={data.is_active}
                        onCheckedChange={(checked) => setData('is_active', checked)}
                        className="data-[state=checked]:bg-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Tips Card */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-amber-900 mb-1">Tips Membuat FAQ</h4>
                      <ul className="text-xs text-amber-700 space-y-1">
                        <li className="flex items-start gap-1">
                          <ChevronRight className="h-3 w-3 mt-0.5 flex-shrink-0" />
                          <span>Gunakan pertanyaan yang sering ditanyakan</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <ChevronRight className="h-3 w-3 mt-0.5 flex-shrink-0" />
                          <span>Berikan jawaban yang jelas dan lengkap</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <ChevronRight className="h-3 w-3 mt-0.5 flex-shrink-0" />
                          <span>Pilih kategori yang sesuai</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                  <div className="flex gap-3">
                    <Button 
                      type="submit" 
                      className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/25"
                      disabled={processing}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {processing ? 'Menyimpan...' : 'Simpan FAQ'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      asChild
                      className="border-gray-200 text-gray-600 hover:bg-gray-50"
                    >
                      <Link href={route('admin.ssd.index')}>Batal</Link>
                    </Button>
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
