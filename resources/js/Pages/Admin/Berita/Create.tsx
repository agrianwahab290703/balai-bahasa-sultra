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

        {/* Form Content */}
        <BeritaForm categories={categories} />
      </div>
    </AdminLayout>
  );
}
