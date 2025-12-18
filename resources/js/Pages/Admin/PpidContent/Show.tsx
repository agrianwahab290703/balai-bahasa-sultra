import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Globe,
  Calendar,
  User,
  FileText,
  Image as ImageIcon,
  File,
  Download,
  ExternalLink,
  FolderTree,
  CheckCircle,
  XCircle,
} from 'lucide-react';

interface Creator {
  id: number;
  name: string;
}

interface PpidContentData {
  id: number;
  title: string;
  slug: string;
  category: string;
  sub_category: string | null;
  content: string;
  image_path: string | null;
  document_path: string | null;
  image_url: string | null;
  document_url: string | null;
  status: 'draft' | 'published';
  is_active: boolean;
  created_at: string;
  published_at: string | null;
  category_label: string;
  sub_category_label: string | null;
  creator?: Creator;
}

interface Props {
  content: PpidContentData;
  categories: Record<string, string>;
  subCategories: Record<string, string>;
}

export default function Show({ content, categories, subCategories }: Props) {
  const handleDelete = () => {
    if (confirm('Apakah Anda yakin ingin menghapus konten ini? Tindakan ini tidak dapat dibatalkan.')) {
      router.delete(route('admin.ppid-content.destroy', content.id));
    }
  };

  const handleToggleActive = () => {
    router.post(route('admin.ppid-content.toggle-active', content.id));
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      profil: 'bg-blue-100 text-blue-700',
      informasi_publik: 'bg-green-100 text-green-700',
      permohonan: 'bg-amber-100 text-amber-700',
      keberatan: 'bg-red-100 text-red-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <AdminLayout>
      <Head title={content.title} />

      <div className="space-y-6">
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500 p-6 lg:p-8">
          <div className="absolute inset-0 bg-grid-white/10" />
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex items-start gap-4">
                <Link
                  href={route('admin.ppid-content.index')}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors mt-1"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className={getCategoryColor(content.category)}>
                      {content.category_label}
                    </Badge>
                    {content.sub_category_label && (
                      <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                        {content.sub_category_label}
                      </Badge>
                    )}
                    <Badge
                      variant={content.status === 'published' ? 'default' : 'secondary'}
                      className="bg-white/20 text-white"
                    >
                      {content.status === 'published' ? 'Dipublikasi' : 'Draft'}
                    </Badge>
                  </div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-white">{content.title}</h1>
                  <p className="text-purple-100 mt-1">/{content.slug}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                  asChild
                >
                  <Link href={route('admin.ppid-content.edit', content.id)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Link>
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Hapus
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Content Preview */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Konten</h3>
                    <p className="text-xs text-gray-500">Preview konten yang akan ditampilkan</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: content.content }}
                />
              </div>
            </div>

            {/* Media */}
            {(content.image_url || content.document_url) && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <ImageIcon className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Media</h3>
                      <p className="text-xs text-gray-500">Gambar dan dokumen terlampir</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  {content.image_url && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-3">Gambar Utama</p>
                      <div className="relative rounded-xl overflow-hidden border border-gray-200">
                        <img
                          src={content.image_url}
                          alt={content.title}
                          className="w-full h-64 object-cover"
                        />
                        <a
                          href={content.image_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute top-3 right-3 inline-flex items-center px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-sm font-medium text-gray-700 hover:bg-white transition-colors"
                        >
                          <ExternalLink className="h-4 w-4 mr-1.5" />
                          Buka
                        </a>
                      </div>
                    </div>
                  )}

                  {content.document_url && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-3">Dokumen Pendukung</p>
                      <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                          <File className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {content.document_path?.split('/').pop()}
                          </p>
                          <p className="text-sm text-gray-500">Dokumen PDF/DOC</p>
                        </div>
                        <a
                          href={content.document_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - 1 column */}
          <div className="lg:col-span-1">
            <div className="space-y-6 lg:sticky lg:top-6">
              {/* Info Card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
                  <h3 className="font-semibold text-gray-900">Informasi</h3>
                </div>
                <div className="p-5 space-y-4">
                  {/* Status */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Status</span>
                    <Badge variant={content.status === 'published' ? 'default' : 'secondary'}>
                      {content.status === 'published' ? 'Dipublikasi' : 'Draft'}
                    </Badge>
                  </div>

                  {/* Active */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Aktif</span>
                    <button
                      onClick={handleToggleActive}
                      className="focus:outline-none"
                    >
                      {content.is_active ? (
                        <div className="flex items-center gap-1.5 text-green-600">
                          <CheckCircle className="h-5 w-5" />
                          <span className="text-sm font-medium">Ya</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-gray-400">
                          <XCircle className="h-5 w-5" />
                          <span className="text-sm font-medium">Tidak</span>
                        </div>
                      )}
                    </button>
                  </div>

                  {/* Category */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Kategori</span>
                    <Badge className={getCategoryColor(content.category)}>
                      {content.category_label}
                    </Badge>
                  </div>

                  {/* Sub-Category */}
                  {content.sub_category_label && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Sub-Kategori</span>
                      <Badge variant="outline">{content.sub_category_label}</Badge>
                    </div>
                  )}

                  <div className="border-t border-gray-100 pt-4 space-y-3">
                    {/* Created */}
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>Dibuat: {new Date(content.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}</span>
                    </div>

                    {/* Published */}
                    {content.published_at && (
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <Globe className="h-4 w-4" />
                        <span>Dipublikasi: {new Date(content.published_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}</span>
                      </div>
                    )}

                    {/* Creator */}
                    {content.creator && (
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <User className="h-4 w-4" />
                        <span>Oleh: {content.creator.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
                <Button
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  asChild
                >
                  <Link href={route('admin.ppid-content.edit', content.id)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Konten
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={route('admin.ppid-content.index')}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Kembali ke Daftar
                  </Link>
                </Button>
              </div>

              {/* Quick Links */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 p-5">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <FolderTree className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-indigo-900 mb-2">Link Publik</h4>
                    <p className="text-sm text-indigo-700 break-all">
                      /ppid/{content.category.replace('_', '-')}/{content.slug}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
