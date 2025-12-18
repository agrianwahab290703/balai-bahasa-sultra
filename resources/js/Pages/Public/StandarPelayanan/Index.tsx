import React, { useMemo, useRef, useState } from 'react';
import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { PublicLayout } from '@/Layouts/PublicLayout';
import {
  DocumentCard,
  DocumentPreview,
  DocumentSkeleton,
  FloatingActionButton,
  type DocumentItem,
} from '@/Components/StandarPelayanan';
import { Card, CardContent } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import {
  Search01Icon,
  SparklesIcon,
  File02Icon,
  Download04Icon,
  Link01Icon,
  Cancel01Icon,
  CustomerService01Icon,
  FilterIcon,
  GridViewIcon,
  Menu01Icon,
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
  Clock01Icon,
} from 'hugeicons-react';

interface Props {
  documents: DocumentItem[];
}

type FilterType = 'all' | 'file' | 'link';
type ViewMode = 'list' | 'grid';

export default function StandarPelayananIndex({ documents }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [previewDocument, setPreviewDocument] = useState<DocumentItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const documentSectionRef = useRef<HTMLDivElement>(null);

  const filteredDocuments = useMemo(() => {
    const keyword = searchQuery.toLowerCase();
    return documents.filter((doc) => {
      const matchesSearch =
        doc.title.toLowerCase().includes(keyword) ||
        doc.description.toLowerCase().includes(keyword);
      const matchesFilter =
        filterType === 'all' || doc.source.type === filterType;
      return matchesSearch && matchesFilter;
    });
  }, [documents, searchQuery, filterType]);

  const handleDownload = async (doc: DocumentItem) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/standar-pelayanan/${doc.id}/download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });

      const data = await response.json();
      if (response.ok && data.url) {
        window.open(data.url, '_blank');
      }
    } finally {
      setTimeout(() => setIsLoading(false), 400);
    }
  };

  const handlePreview = (doc: DocumentItem) => setPreviewDocument(doc);

  const scrollToDocuments = () => {
    documentSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => searchInputRef.current?.focus(), 500);
  };

  const stats = {
    total: documents.length,
    downloads: documents.reduce((total, doc) => total + doc.download_count, 0),
    files: documents.filter((doc) => doc.source.type === 'file').length,
    links: documents.filter((doc) => doc.source.type === 'link').length,
  };

  const filterOptions: { value: FilterType; label: string; count: number }[] = [
    { value: 'all', label: 'Semua', count: stats.total },
    { value: 'file', label: 'Berkas', count: stats.files },
    { value: 'link', label: 'Tautan', count: stats.links },
  ];

  return (
    <PublicLayout
      title="Standar Pelayanan"
      description="Dokumen standar pelayanan Balai Bahasa Provinsi Sulawesi Tenggara"
    >
      {/* Hero Section - Redesigned */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-600 via-blue-600 to-indigo-700 py-16 lg:py-24">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.4) 1px, transparent 0)',
              backgroundSize: '32px 32px',
            }}
          />
          <motion.div
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-20 -right-20 h-96 w-96 rounded-full bg-white/10 blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -30, 0],
              y: [0, 50, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-sky-400/20 blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-indigo-500/10 blur-3xl"
          />
        </div>

        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center text-white"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-medium backdrop-blur-md"
              >
                <SparklesIcon className="h-4 w-4 text-yellow-300" />
                <span>Layanan Publik Transparan</span>
                <span className="h-1 w-1 rounded-full bg-white/50" />
                <span className="text-white/70">Update Terkini</span>
              </motion.div>

              <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Standar Pelayanan
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/80 lg:text-xl">
                Akses dokumen resmi terkait standar pelayanan Balai Bahasa Provinsi Sulawesi
                Tenggara secara <span className="text-white font-semibold">mudah</span>, <span className="text-white font-semibold">cepat</span>, dan <span className="text-white font-semibold">transparan</span>.
              </p>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8"
              >
                <Button
                  onClick={scrollToDocuments}
                  size="lg"
                  className="group gap-3 rounded-full bg-white px-8 py-6 text-base font-semibold text-sky-700 shadow-xl transition-all hover:bg-white hover:shadow-2xl hover:-translate-y-1"
                >
                  <File02Icon className="h-5 w-5" />
                  Lihat Dokumen
                  <ArrowRight01Icon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
            </motion.div>

            {/* Stats Cards - Redesigned */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-14 grid gap-4 sm:grid-cols-3"
            >
              {[
                {
                  icon: File02Icon,
                  value: stats.total,
                  label: 'Dokumen Tersedia',
                  color: 'from-white/20 to-white/10',
                },
                {
                  icon: Download04Icon,
                  value: stats.downloads,
                  label: 'Total Unduhan',
                  color: 'from-emerald-400/20 to-emerald-400/10',
                },
                {
                  icon: CheckmarkCircle02Icon,
                  value: `${stats.files} Berkas`,
                  sublabel: `${stats.links} Tautan`,
                  label: 'Jenis Dokumen',
                  color: 'from-amber-400/20 to-amber-400/10',
                },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className={`group relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br ${stat.color} p-6 backdrop-blur-md transition-all`}
                >
                  <div className="absolute inset-0 bg-white/5 opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="relative">
                    <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 shadow-inner">
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <p className="text-3xl font-bold tracking-tight">
                      {typeof stat.value === 'number' ? stat.value.toLocaleString('id-ID') : stat.value}
                    </p>
                    {stat.sublabel && (
                      <p className="text-sm text-white/60">{stat.sublabel}</p>
                    )}
                    <p className="mt-1 text-sm font-medium text-white/70">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Wave Divider - Improved */}
        <div className="absolute -bottom-1 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="h-16 w-full lg:h-24">
            <path
              d="M0 60L48 55C96 50 192 40 288 35C384 30 480 30 576 38C672 45 768 60 864 65C960 70 1056 65 1152 58C1248 50 1344 40 1392 35L1440 30V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0V60Z"
              fill="#f8fafc"
            />
          </svg>
        </div>
      </section>

      {/* Documents Section - Redesigned */}
      <section ref={documentSectionRef} className="bg-slate-50 py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8 text-center"
            >
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Daftar Dokumen
              </h2>
              <p className="mt-2 text-gray-600">
                Temukan dokumen standar pelayanan yang Anda butuhkan
              </p>
            </motion.div>

            {/* Search & Filter Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-6 space-y-4"
            >
              {/* Search Input */}
              <div className="relative">
                <Search01Icon className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Cari dokumen berdasarkan judul atau deskripsi..."
                  className="w-full rounded-2xl border-2 border-gray-200 bg-white py-4 pl-14 pr-14 text-base shadow-sm transition-all placeholder:text-gray-400 focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-100"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                  >
                    <Cancel01Icon className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Filter & View Options */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Filter Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  <FilterIcon className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <div className="flex gap-2">
                    {filterOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setFilterType(option.value)}
                        className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
                          filterType === option.value
                            ? 'bg-sky-600 text-white shadow-md'
                            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                        }`}
                      >
                        {option.label}
                        <Badge
                          variant="secondary"
                          className={`rounded-full px-2 py-0.5 text-xs ${
                            filterType === option.value
                              ? 'bg-white/20 text-white'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {option.count}
                        </Badge>
                      </button>
                    ))}
                  </div>
                </div>

                {/* View Toggle */}
                <div className="flex items-center gap-2 bg-white rounded-xl p-1 border border-gray-200 shadow-sm">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                      viewMode === 'list'
                        ? 'bg-sky-100 text-sky-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Menu01Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">Daftar</span>
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                      viewMode === 'grid'
                        ? 'bg-sky-100 text-sky-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <GridViewIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">Grid</span>
                  </button>
                </div>
              </div>

              {/* Search Results Info */}
              <AnimatePresence>
                {searchQuery && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 text-sm text-gray-500"
                  >
                    <InformationCircleIcon className="h-4 w-4" />
                    Menampilkan <span className="font-semibold text-sky-600">{filteredDocuments.length}</span> dari{' '}
                    <span className="font-semibold">{documents.length}</span> dokumen untuk "{searchQuery}"
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Document List/Grid */}
            <div className="space-y-4">
              {isLoading ? (
                <DocumentSkeleton count={4} />
              ) : filteredDocuments.length > 0 ? (
                <motion.ul
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={viewMode === 'grid' ? 'grid gap-4 sm:grid-cols-2' : 'space-y-4'}
                >
                  <AnimatePresence mode="popLayout">
                    {filteredDocuments.map((doc, index) => (
                      <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <DocumentCard
                          document={doc}
                          onDownload={handleDownload}
                          onPreview={handlePreview}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.ul>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Card className="border-2 border-dashed border-gray-200 bg-white/80 backdrop-blur-sm">
                    <CardContent className="py-16 text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                        className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-50 shadow-inner"
                      >
                        <Search01Icon className="h-10 w-10 text-gray-400" />
                      </motion.div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Dokumen tidak ditemukan
                      </h3>
                      <p className="mx-auto mt-3 max-w-md text-gray-500">
                        Tidak ada dokumen yang cocok dengan kata kunci "<span className="font-medium text-gray-700">{searchQuery}</span>".
                        Coba gunakan kata kunci lain atau hapus filter.
                      </p>
                      <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                        <Button
                          className="gap-2 rounded-xl bg-sky-600 px-6 py-2.5 font-medium text-white shadow-md transition-all hover:bg-sky-700 hover:shadow-lg"
                          onClick={() => {
                            setSearchQuery('');
                            setFilterType('all');
                          }}
                        >
                          <Cancel01Icon className="h-5 w-5" />
                          Reset Pencarian
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>

            {/* Info Banner */}
            {filteredDocuments.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-8 flex items-start gap-4 rounded-2xl bg-gradient-to-r from-sky-50 to-blue-50 p-5 border border-sky-100"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-sky-100">
                  <InformationCircleIcon className="h-5 w-5 text-sky-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Cara Mengakses Dokumen</h4>
                  <p className="mt-1 text-sm text-gray-600">
                    Klik tombol <span className="font-medium text-sky-700">"Unduh"</span> untuk mengunduh dokumen berkas,
                    atau <span className="font-medium text-sky-700">"Lihat Detail"</span> untuk melihat pratinjau dokumen.
                    Dokumen tautan eksternal akan dibuka di tab baru.
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Help Section - Redesigned */}
      <section className="bg-white py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="mx-auto max-w-5xl overflow-hidden border-0 bg-gradient-to-br from-sky-600 to-indigo-700 shadow-2xl">
              <CardContent className="relative overflow-hidden p-8 lg:p-12">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage:
                        'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)',
                      backgroundSize: '24px 24px',
                    }}
                  />
                </div>

                <div className="relative flex flex-col items-center gap-8 text-center lg:flex-row lg:justify-between lg:text-left">
                  <div className="flex flex-col items-center gap-5 lg:flex-row lg:items-start">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 shadow-inner backdrop-blur-sm">
                      <CustomerService01Icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-white">
                      <h2 className="text-2xl font-bold lg:text-3xl">Butuh Bantuan?</h2>
                      <p className="mt-2 max-w-md text-white/80 lg:text-lg">
                        Tim kami siap membantu Anda mendapatkan informasi dan dokumen yang dibutuhkan.
                      </p>
                      <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm lg:justify-start">
                        <span className="inline-flex items-center gap-2 text-white/70">
                          <Clock01Icon className="h-4 w-4" />
                          Senin - Jumat, 08:00 - 16:00 WITA
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link href="/kontak">
                    <Button
                      size="lg"
                      className="group gap-3 rounded-xl bg-white px-8 py-6 text-base font-semibold text-sky-700 shadow-xl transition-all hover:bg-white hover:shadow-2xl hover:-translate-y-1"
                    >
                      <CustomerService01Icon className="h-5 w-5" />
                      Hubungi Kami
                      <ArrowRight01Icon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <DocumentPreview
        document={previewDocument}
        isOpen={Boolean(previewDocument)}
        onClose={() => setPreviewDocument(null)}
        onDownload={handleDownload}
      />
      <FloatingActionButton onOpenSearch={scrollToDocuments} />
    </PublicLayout>
  );
}