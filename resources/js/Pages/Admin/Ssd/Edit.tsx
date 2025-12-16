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
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import RichTextEditor from '@/Components/Admin/RichTextEditor';
import { ArrowLeft, HelpCircle } from 'lucide-react';

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

export default function Edit({ ssd, categories }: Props) {
  const { data, setData, put, processing, errors } = useForm({
    question: ssd.question,
    answer: ssd.answer,
    category: ssd.category,
    is_active: ssd.is_active,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('admin.ssd.update', ssd.id));
  };

  return (
    <AdminLayout>
      <Head title="Edit FAQ" />

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={route('admin.ssd.index')}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Edit FAQ</h1>
            <p className="text-muted-foreground">Perbarui pertanyaan yang sering diajukan</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5" />
                    Pertanyaan & Jawaban
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="question">Pertanyaan *</Label>
                    <Textarea
                      id="question"
                      value={data.question}
                      onChange={(e) => setData('question', e.target.value)}
                      placeholder="Masukkan pertanyaan..."
                      rows={3}
                      className={errors.question ? 'border-destructive' : ''}
                    />
                    {errors.question && (
                      <p className="text-sm text-destructive">{errors.question}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="answer">Jawaban *</Label>
                    <RichTextEditor
                      value={data.answer}
                      onChange={(value) => setData('answer', value)}
                      placeholder="Masukkan jawaban..."
                      minHeight={200}
                    />
                    {errors.answer && (
                      <p className="text-sm text-destructive">{errors.answer}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Kategori</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                      <p className="text-sm text-destructive">{errors.category}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

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
                    FAQ aktif akan ditampilkan di halaman publik
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Informasi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    Dibuat: {new Date(ssd.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <p>
                    Diperbarui: {new Date(ssd.updated_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1" disabled={processing}>
                      {processing ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                    <Button type="button" variant="outline" asChild>
                      <Link href={route('admin.ssd.index')}>Batal</Link>
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
