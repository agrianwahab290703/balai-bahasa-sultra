import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import BeritaForm from './components/BeritaForm';
import { Button } from '@/Components/ui/button';
import { ArrowLeft } from 'lucide-react';

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
  sub_kategori: string | null;
  is_published: boolean;
  is_featured: boolean;
  author: string | null;
  sumber_rilis: string | null;
  lokasi: string | null;
  tanggal_rilis: string | null;
  biro: string | null;
  tags: string[] | null;
  meta_title: string | null;
  meta_description: string | null;
}

interface Props {
  berita: Berita;
  categories: string[];
}

export default function Edit({ berita, categories }: Props) {
  const breadcrumbs = [
    { label: 'Berita', href: route('admin.berita.index') },
    { label: 'Edit Berita' }
  ];

  return (
    <AdminLayout title={`Edit: ${berita.judul_utama}`} breadcrumbs={breadcrumbs}>
      <Head title={`Edit: ${berita.judul_utama}`} />

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={route('admin.berita.index')}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Edit Berita</h1>
            <p className="text-muted-foreground">{berita.judul_utama}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <BeritaForm berita={berita} categories={categories} />
        </div>
      </div>
    </AdminLayout>
  );
}
