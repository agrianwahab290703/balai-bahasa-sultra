import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import BeritaForm from './components/BeritaForm';
import { ArrowLeft, FileText } from 'lucide-react';

interface Props {
  categories: string[];
}

export default function Create({ categories }: Props) {
  const breadcrumbs = [
    { label: 'Berita', href: route('admin.berita.index') },
    { label: 'Tambah Berita' }
  ];

  return (
    <AdminLayout title="Tambah Berita" breadcrumbs={breadcrumbs}>
      <Head title="Tambah Berita" />

      <div className="space-y-6">
        {/* Modern Header */}
        <div className="relative overflow-hidden rounded-xl p-6 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600">
          <div className="absolute inset-0 bg-grid-white/10" />
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="relative flex items-center gap-4">
            <Link
              href={route('admin.berita.index')}
              className="w-10 h-10 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Tambah Berita</h1>
                  <p className="text-blue-100">Buat artikel berita baru untuk website</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <BeritaForm categories={categories} />
      </div>
    </AdminLayout>
  );
}
