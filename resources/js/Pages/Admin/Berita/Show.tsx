import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { ArrowLeft, Pencil, Trash2, Eye, Calendar, MapPin, User } from 'lucide-react';

interface Berita {
  id: number;
  judul_utama: string;
  slug: string;
  ringkasan_inti: string | null;
  teras_berita: string | null;
  konteks_latar_belakang: string | null;
  quote_pejabat: string | null;
  nama_pejabat: string | null;
  jabatan_pejabat: string | null;
  data_capaian_kinerja: string | null;
  mekanisme_penilaian: string | null;
  kesimpulan_komitmen: string | null;
  hero_image: string | null;
  hero_image_alt: string | null;
  kategori: string | null;
  is_published: boolean;
  is_featured: boolean;
  view_count: number;
  author: string | null;
  lokasi: string | null;
  tanggal_rilis: string | null;
  created_at: string;
  galeri_foto_berita?: {
    id: number;
    file_path: string;
    tipe: string;
    caption?: string;
  }[];
}

interface Props {
  berita: Berita;
}

export default function Show({ berita }: Props) {
  const handleDelete = () => {
    if (confirm('Hapus berita ini?')) {
      router.delete(route('admin.berita.destroy', berita.id));
    }
  };

  return (
    <AdminLayout>
      <Head title={berita.judul_utama} />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href={route('admin.berita.index')}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-semibold">Detail Berita</h1>
              <p className="text-muted-foreground">Preview artikel</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href={route('admin.berita.edit', berita.id)}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Hapus
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            {berita.hero_image && (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <img
                  src={berita.hero_image}
                  alt={berita.hero_image_alt || berita.judul_utama}
                  className="w-full h-64 object-cover"
                />
              </div>
            )}

            {/* Title & Meta */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant={berita.is_published ? 'default' : 'secondary'}>
                  {berita.is_published ? 'Published' : 'Draft'}
                </Badge>
                {berita.is_featured && <Badge variant="outline">Featured</Badge>}
                {berita.kategori && <Badge variant="outline">{berita.kategori}</Badge>}
              </div>
              <h2 className="text-2xl font-bold mb-4">{berita.judul_utama}</h2>
              {berita.ringkasan_inti && (
                <p className="text-muted-foreground text-lg">{berita.ringkasan_inti}</p>
              )}
            </div>

            {/* Content Sections */}
            {berita.teras_berita && (
              <ContentSection title="Teras Berita" content={berita.teras_berita} />
            )}
            {berita.konteks_latar_belakang && (
              <ContentSection title="Konteks & Latar Belakang" content={berita.konteks_latar_belakang} />
            )}
            {berita.quote_pejabat && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold mb-3">Quote Pejabat</h3>
                <blockquote className="border-l-4 border-primary pl-4 italic">
                  "{berita.quote_pejabat}"
                  {(berita.nama_pejabat || berita.jabatan_pejabat) && (
                    <footer className="mt-2 text-sm text-muted-foreground not-italic">
                      — {berita.nama_pejabat}{berita.jabatan_pejabat && `, ${berita.jabatan_pejabat}`}
                    </footer>
                  )}
                </blockquote>
              </div>
            )}
            {berita.data_capaian_kinerja && (
              <ContentSection title="Data & Capaian Kinerja" content={berita.data_capaian_kinerja} />
            )}
            {berita.mekanisme_penilaian && (
              <ContentSection title="Mekanisme Penilaian" content={berita.mekanisme_penilaian} />
            )}
            {berita.kesimpulan_komitmen && (
              <ContentSection title="Kesimpulan & Komitmen" content={berita.kesimpulan_komitmen} />
            )}

            {/* Galeri Foto */}
            {berita.galeri_foto_berita && berita.galeri_foto_berita.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold mb-3">Galeri Foto</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {berita.galeri_foto_berita
                    .filter((img) => img.tipe === 'gallery')
                    .map((img) => (
                      <div key={img.id} className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={img.file_path}
                          alt={img.caption || 'Galeri foto'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold mb-4">Informasi</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <dt className="text-muted-foreground">Views:</dt>
                  <dd className="font-medium">{berita.view_count.toLocaleString()}</dd>
                </div>
                {berita.author && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <dt className="text-muted-foreground">Author:</dt>
                    <dd className="font-medium">{berita.author}</dd>
                  </div>
                )}
                {berita.lokasi && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <dt className="text-muted-foreground">Lokasi:</dt>
                    <dd className="font-medium">{berita.lokasi}</dd>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <dt className="text-muted-foreground">Dibuat:</dt>
                  <dd className="font-medium">
                    {new Date(berita.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </dd>
                </div>
                {berita.tanggal_rilis && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <dt className="text-muted-foreground">Tanggal Rilis:</dt>
                    <dd className="font-medium">
                      {new Date(berita.tanggal_rilis).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function ContentSection({ title, content }: { title: string; content: string }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="font-semibold mb-3">{title}</h3>
      <div
        className="prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
