import React from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import {
  ChevronRight,
  Calendar,
  FileText,
  Download,
  ArrowLeft,
  ExternalLink,
  Image as ImageIcon,
} from 'lucide-react';

interface ContentItem {
  id: number;
  title: string;
  slug: string;
}

interface BreadcrumbItem {
  label: string;
  url: string | null;
}

interface PpidContent {
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
  published_at: string | null;
  category_label: string;
  sub_category_label: string | null;
}

interface Props {
  content: PpidContent;
  breadcrumb: BreadcrumbItem[];
  relatedContents: ContentItem[];
}

export default function Show({ content, breadcrumb, relatedContents }: Props) {
  return (
    <PublicLayout>
      <Head title={`${content.title} - PPID`} />

      {/* Breadcrumb */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm flex-wrap">
            {breadcrumb.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && <ChevronRight className="h-4 w-4 text-gray-400" />}
                {item.url ? (
                  <Link
                    href={item.url}
                    className="text-gray-600 hover:text-teal-600 transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-gray-900 font-medium">{item.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>
      </section>

      {/* Hero Header */}
      <section className="bg-gradient-to-br from-teal-600 via-emerald-500 to-green-500 py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium backdrop-blur-sm">
                {content.category_label}
              </span>
              {content.sub_category_label && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white/90 text-sm backdrop-blur-sm">
                  {content.sub_category_label}
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
              {content.title}
            </h1>
            {content.published_at && (
              <div className="flex items-center gap-2 text-emerald-100">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">
                  Dipublikasi: {new Date(content.published_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Featured Image */}
                {content.image_url && (
                  <div className="mb-8">
                    <div className="relative rounded-2xl overflow-hidden shadow-lg">
                      <img
                        src={content.image_url}
                        alt={content.title}
                        className="w-full h-auto max-h-[500px] object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* Content Body */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
                  <div
                    className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-teal-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl"
                    dangerouslySetInnerHTML={{ __html: content.content }}
                  />
                </div>

                {/* Document Download */}
                {content.document_url && (
                  <div className="mt-8 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl border border-teal-100 p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-teal-100 rounded-xl">
                        <FileText className="h-8 w-8 text-teal-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">Dokumen Terlampir</h3>
                        <p className="text-sm text-gray-600">
                          {content.document_path?.split('/').pop()}
                        </p>
                      </div>
                      <a
                        href={content.document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-5 py-2.5 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 transition-colors shadow-lg shadow-teal-500/25"
                      >
                        <Download className="h-5 w-5 mr-2" />
                        Download
                      </a>
                    </div>
                  </div>
                )}

                {/* Back Button */}
                <div className="mt-8">
                  <Link
                    href={route('ppid.index')}
                    className="inline-flex items-center text-gray-600 hover:text-teal-600 transition-colors"
                  >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Kembali ke PPID
                  </Link>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="lg:sticky lg:top-6 space-y-6">
                  {/* Related Contents */}
                  {relatedContents.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900">Konten Terkait</h3>
                      </div>
                      <div className="p-4 space-y-2">
                        {relatedContents.map((item) => (
                          <Link
                            key={item.id}
                            href={route('ppid.content.show', item.slug)}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                          >
                            <FileText className="h-5 w-5 text-gray-400 group-hover:text-teal-500 flex-shrink-0" />
                            <span className="text-gray-700 group-hover:text-teal-600 text-sm line-clamp-2">
                              {item.title}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick Links */}
                  <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl border border-teal-100 p-6">
                    <h3 className="font-semibold text-teal-900 mb-4">Layanan PPID</h3>
                    <div className="space-y-3">
                      <Link
                        href={route('ppid.permohonan')}
                        className="flex items-center gap-3 text-teal-700 hover:text-teal-900 transition-colors"
                      >
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-sm">Permohonan Informasi</span>
                      </Link>
                      <Link
                        href={route('ppid.pengajuan-keberatan')}
                        className="flex items-center gap-3 text-teal-700 hover:text-teal-900 transition-colors"
                      >
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-sm">Pengajuan Keberatan</span>
                      </Link>
                      <Link
                        href={route('ppid.informasi-publik')}
                        className="flex items-center gap-3 text-teal-700 hover:text-teal-900 transition-colors"
                      >
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-sm">Informasi Publik</span>
                      </Link>
                      <Link
                        href={route('ppid.profil')}
                        className="flex items-center gap-3 text-teal-700 hover:text-teal-900 transition-colors"
                      >
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-sm">Profil PPID</span>
                      </Link>
                    </div>
                  </div>

                  {/* Info Card */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Informasi</h3>
                    <div className="space-y-3 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Kategori</span>
                        <span className="font-medium text-gray-900">{content.category_label}</span>
                      </div>
                      {content.sub_category_label && (
                        <div className="flex justify-between">
                          <span>Sub-Kategori</span>
                          <span className="font-medium text-gray-900">{content.sub_category_label}</span>
                        </div>
                      )}
                      {content.published_at && (
                        <div className="flex justify-between">
                          <span>Tanggal</span>
                          <span className="font-medium text-gray-900">
                            {new Date(content.published_at).toLocaleDateString('id-ID')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
