import React from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import {
  FileText,
  Users,
  FolderOpen,
  MessageSquare,
  AlertCircle,
  ChevronRight,
  Download,
  ExternalLink,
} from 'lucide-react';

interface ContentItem {
  id: number;
  title: string;
  slug: string;
}

interface MenuItems {
  profil: ContentItem[];
  informasi_publik: {
    berkala: ContentItem[];
    serta_merta: ContentItem[];
    setiap_saat: ContentItem[];
    dikecualikan: ContentItem[];
  };
  permohonan: ContentItem[];
  keberatan: ContentItem[];
}

interface Props {
  menuItems: MenuItems;
  categories: Record<string, string>;
  subCategories: Record<string, string>;
}

export default function Index({ menuItems, categories, subCategories }: Props) {
  const categoryIcons: Record<string, React.ReactNode> = {
    profil: <Users className="h-6 w-6" />,
    informasi_publik: <FolderOpen className="h-6 w-6" />,
    permohonan: <MessageSquare className="h-6 w-6" />,
    keberatan: <AlertCircle className="h-6 w-6" />,
  };

  const categoryColors: Record<string, string> = {
    profil: 'from-blue-500 to-indigo-600',
    informasi_publik: 'from-green-500 to-emerald-600',
    permohonan: 'from-amber-500 to-orange-600',
    keberatan: 'from-red-500 to-rose-600',
  };

  const categoryBgColors: Record<string, string> = {
    profil: 'bg-blue-50 border-blue-100',
    informasi_publik: 'bg-green-50 border-green-100',
    permohonan: 'bg-amber-50 border-amber-100',
    keberatan: 'bg-red-50 border-red-100',
  };

  const getCategoryUrl = (category: string): string => {
    switch (category) {
      case 'profil':
        return route('ppid.profil');
      case 'informasi_publik':
        return route('ppid.informasi-publik');
      case 'permohonan':
        return route('ppid.permohonan');
      case 'keberatan':
        return route('ppid.pengajuan-keberatan');
      default:
        return route('ppid.index');
    }
  };

  const getSubCategoryUrl = (subCategory: string): string => {
    switch (subCategory) {
      case 'setiap_saat':
        return route('ppid.informasi-publik.setiap-saat');
      case 'serta_merta':
        return route('ppid.informasi-publik.serta-merta');
      case 'berkala':
        return route('ppid.informasi-publik.berkala');
      case 'dikecualikan':
        return route('ppid.informasi-publik.dikecualikan');
      default:
        return route('ppid.informasi-publik');
    }
  };

  return (
    <PublicLayout>
      <Head title="PPID - Pejabat Pengelola Informasi dan Dokumentasi" />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-teal-600 via-emerald-500 to-green-500 py-16 lg:py-24">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-green-400/20 rounded-full blur-3xl" />

        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Pejabat Pengelola Informasi dan Dokumentasi
            </h1>
            <p className="text-lg md:text-xl text-emerald-100 mb-8">
              Portal keterbukaan informasi publik Balai Bahasa Provinsi Sulawesi Tenggara.
              Akses informasi yang tersedia untuk publik sesuai dengan Undang-Undang Keterbukaan Informasi Publik.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href={route('ppid.permohonan')}
                className="inline-flex items-center px-6 py-3 bg-white text-teal-600 font-semibold rounded-xl hover:bg-teal-50 transition-colors shadow-lg"
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                Ajukan Permohonan
              </Link>
              <Link
                href={route('ppid.informasi-publik')}
                className="inline-flex items-center px-6 py-3 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-colors backdrop-blur-sm"
              >
                <FolderOpen className="h-5 w-5 mr-2" />
                Lihat Informasi Publik
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Category Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {Object.entries(categories).map(([key, label]) => (
                <div
                  key={key}
                  className={`rounded-2xl border ${categoryBgColors[key]} overflow-hidden`}
                >
                  <Link
                    href={getCategoryUrl(key)}
                    className={`block p-6 bg-gradient-to-r ${categoryColors[key]} text-white`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                        {categoryIcons[key]}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">{label}</h2>
                        <p className="text-white/80 text-sm mt-1">
                          {key === 'profil' && 'Tentang PPID dan struktur organisasi'}
                          {key === 'informasi_publik' && 'Dokumen dan informasi yang tersedia'}
                          {key === 'permohonan' && 'Ajukan permohonan informasi'}
                          {key === 'keberatan' && 'Pengajuan keberatan atas informasi'}
                        </p>
                      </div>
                      <ChevronRight className="h-6 w-6 ml-auto" />
                    </div>
                  </Link>

                  {/* Content Items */}
                  <div className="p-4">
                    {key === 'informasi_publik' ? (
                      <div className="space-y-3">
                        {Object.entries(subCategories).map(([subKey, subLabel]) => {
                          const items = menuItems.informasi_publik[subKey as keyof typeof menuItems.informasi_publik] || [];
                          return (
                            <Link
                              key={subKey}
                              href={getSubCategoryUrl(subKey)}
                              className="flex items-center justify-between p-3 bg-white rounded-xl hover:shadow-md transition-all group"
                            >
                              <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-green-500" />
                                <span className="font-medium text-gray-700">{subLabel}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-400">{items.length} item</span>
                                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-green-500 transition-colors" />
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {(menuItems[key as keyof MenuItems] as ContentItem[])?.slice(0, 5).map((item) => (
                          <Link
                            key={item.id}
                            href={route('ppid.content.show', item.slug)}
                            className="flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow-md transition-all group"
                          >
                            <FileText className="h-5 w-5 text-gray-400 group-hover:text-teal-500" />
                            <span className="text-gray-700 group-hover:text-teal-600 transition-colors">
                              {item.title}
                            </span>
                            <ChevronRight className="h-4 w-4 text-gray-400 ml-auto group-hover:text-teal-500" />
                          </Link>
                        ))}
                        {(menuItems[key as keyof MenuItems] as ContentItem[])?.length === 0 && (
                          <p className="text-gray-400 text-sm text-center py-4">
                            Belum ada konten
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Akses Cepat</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link
                  href={route('ppid.permohonan')}
                  className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-teal-300 hover:bg-teal-50 transition-all group"
                >
                  <div className="p-3 bg-teal-100 rounded-xl group-hover:bg-teal-200 transition-colors">
                    <MessageSquare className="h-6 w-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Permohonan Informasi</h3>
                    <p className="text-sm text-gray-500">Ajukan permohonan baru</p>
                  </div>
                </Link>

                <Link
                  href={route('ppid.pengajuan-keberatan')}
                  className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-amber-300 hover:bg-amber-50 transition-all group"
                >
                  <div className="p-3 bg-amber-100 rounded-xl group-hover:bg-amber-200 transition-colors">
                    <AlertCircle className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Pengajuan Keberatan</h3>
                    <p className="text-sm text-gray-500">Ajukan keberatan informasi</p>
                  </div>
                </Link>

                <Link
                  href={route('ppid.informasi-publik')}
                  className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all group"
                >
                  <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
                    <Download className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Download Dokumen</h3>
                    <p className="text-sm text-gray-500">Akses dokumen publik</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
