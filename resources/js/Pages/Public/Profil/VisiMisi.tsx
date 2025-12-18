import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { PublicLayout } from '@/Layouts/PublicLayout';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import {
    Compass,
    ChevronRight,
    ArrowLeft,
    X,
    ZoomIn,
    FileText,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

type VisiMisiSection = {
    id: number;
    type: string;
    title: string;
    content: string;
    images?: string[] | null;
    image_urls?: string[] | null;
    metadata?: Record<string, unknown> | null;
    order: number;
};

interface VisiMisiProps {
    sections?: VisiMisiSection[];
}

export default function VisiMisi({ sections = [] }: VisiMisiProps) {
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);
    const sortedSections = [...sections].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    const openLightbox = (imageUrl: string) => setLightboxImage(imageUrl);
    const closeLightbox = () => setLightboxImage(null);

    const getImageUrls = (section: VisiMisiSection): string[] => {
        const prioritized = Array.isArray(section.image_urls) && section.image_urls.length > 0
            ? section.image_urls
            : Array.isArray(section.images)
                ? section.images
                : [];
        return prioritized.filter((url): url is string => Boolean(url));
    };

    return (
        <PublicLayout title="Visi dan Misi" description="Visi dan Misi Kantor Bahasa Sulawesi Tenggara">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-[#0c4a6e] via-[#1e6091] to-[#0369a1] py-20 lg:py-24 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl" />
                    <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-emerald-400/5 rounded-full blur-2xl" />
                </div>
                <div className="absolute inset-0 opacity-10">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
                            backgroundSize: '32px 32px',
                        }}
                    ></div>
                </div>

                <div className="container relative mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="flex items-center justify-center gap-2 text-blue-200 mb-6">
                            <Link href="/" className="hover:text-white transition-colors">
                                Beranda
                            </Link>
                            <ChevronRight className="h-4 w-4" />
                            <Link href="/profil" className="hover:text-white transition-colors">
                                Profil
                            </Link>
                            <ChevronRight className="h-4 w-4" />
                            <span className="text-white">Visi dan Misi</span>
                        </div>

                        <Badge className="mb-6 bg-yellow-400/90 text-gray-900 hover:bg-yellow-400 font-medium px-4 py-1.5">
                            <Compass className="w-4 h-4 mr-2" />
                            Visi &amp; Misi
                        </Badge>
                        <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl mb-6">
                            Visi dan <span className="font-display italic text-yellow-400">Misi</span>
                        </h1>
                        <p className="text-lg text-blue-100/90 max-w-2xl mx-auto leading-relaxed">
                            Arah dan tujuan Kantor Bahasa Provinsi Sulawesi Tenggara dalam mengembangkan dan membina bahasa Indonesia dan bahasa daerah.
                        </p>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                        <path
                            d="M0 120L48 110C96 100 192 80 288 70C384 60 480 60 576 65C672 70 768 80 864 85C960 90 1056 90 1152 85C1248 80 1344 70 1392 65L1440 60V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z"
                            fill="white"
                        />
                    </svg>
                </div>
            </section>

            {/* Lightbox */}
            <AnimatePresence>
                {lightboxImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
                        onClick={closeLightbox}
                    >
                        <button
                            className="absolute top-4 right-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                closeLightbox();
                            }}
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <motion.img
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            src={lightboxImage}
                            alt="Preview"
                            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Dynamic Content Sections */}
            <section className="bg-white py-12 lg:py-20">
                <div className="container mx-auto px-4">
                    {sortedSections.length > 0 ? (
                        <div className="space-y-12 lg:space-y-16">
                            {sortedSections.map((section, index) => {
                                const imageUrls = getImageUrls(section);
                                const hasImages = imageUrls.length > 0;
                                const isEven = index % 2 === 0;

                                return (
                                    <motion.article
                                        key={section.id}
                                        initial={{ opacity: 0, y: 40 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: '-50px' }}
                                        transition={{ duration: 0.6, ease: 'easeOut' }}
                                    >
                                        <div className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-blue-100/40 transition-all duration-500">
                                            {hasImages ? (
                                                <div className="flex flex-col lg:grid lg:grid-cols-2">
                                                    <div className={`p-6 sm:p-8 lg:p-10 ${!isEven ? 'lg:order-2' : ''}`}>
                                                        <div className="flex items-start gap-4 mb-6">
                                                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-lg font-bold shadow-lg shadow-blue-500/30">
                                                                {String(index + 1).padStart(2, '0')}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full mb-2 uppercase tracking-wide">
                                                                    Bagian {index + 1}
                                                                </span>
                                                                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                                                                    {section.title}
                                                                </h2>
                                                            </div>
                                                        </div>

                                                        <div
                                                            className="prose prose-lg prose-gray max-w-none
                                                                prose-headings:text-gray-900 prose-headings:font-semibold prose-headings:mb-3
                                                                prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-4
                                                                prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                                                                [&_ul]:list-disc
                                                                [&_ol.list-decimal]:list-decimal
                                                                [&_ol.list-alpha-lower]:list-[lower-alpha]
                                                                [&_ol.list-alpha-upper]:list-[upper-alpha]
                                                                [&_ol.list-roman-lower]:list-[lower-roman]
                                                                [&_ol.list-roman-upper]:list-[upper-roman]
                                                                [&_ol]:list-decimal"
                                                            dangerouslySetInnerHTML={{ __html: section.content }}
                                                        />
                                                    </div>
                                                    <div className={`${!isEven ? 'lg:order-1' : ''}`}>
                                                        {imageUrls.length === 1 ? (
                                                            <div
                                                                className="relative h-64 sm:h-80 lg:h-full lg:min-h-[400px] cursor-pointer group"
                                                                onClick={() => openLightbox(imageUrls[0])}
                                                            >
                                                                <img
                                                                    src={imageUrls[0]}
                                                                    alt={section.title}
                                                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                                    loading="lazy"
                                                                />
                                                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                                <div className="absolute bottom-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg">
                                                                    <ZoomIn className="w-5 h-5 text-gray-700" />
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="grid grid-cols-2 gap-2">
                                                                {imageUrls.slice(0, 4).map((url, imgIndex) => (
                                                                    <div
                                                                        key={`${section.id}-${imgIndex}`}
                                                                        className="relative h-40 sm:h-48 lg:h-52 cursor-pointer group overflow-hidden"
                                                                        onClick={() => openLightbox(url)}
                                                                    >
                                                                        <img
                                                                            src={url}
                                                                            alt={`${section.title} - ${imgIndex + 1}`}
                                                                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                                            loading="lazy"
                                                                        />
                                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                                        <div className="absolute bottom-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg">
                                                                            <ZoomIn className="w-4 h-4 text-gray-700" />
                                                                        </div>
                                                                        {imgIndex === 3 && imageUrls.length > 4 && (
                                                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-lg font-semibold">
                                                                                +{imageUrls.length - 4}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="p-6 sm:p-8 lg:p-10">
                                                    <div className="flex items-start gap-4 mb-6">
                                                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-lg font-bold shadow-lg shadow-blue-500/30">
                                                            {String(index + 1).padStart(2, '0')}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full mb-2 uppercase tracking-wide">
                                                                Bagian {index + 1}
                                                            </span>
                                                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                                                                {section.title}
                                                            </h2>
                                                        </div>
                                                    </div>

                                                    <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/60 via-white to-white">
                                                        <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-blue-500 via-blue-400 to-indigo-400" />
                                                        <div className="absolute -top-10 -right-8 w-32 h-32 rounded-full bg-blue-100/40 blur-3xl" />
                                                        <div className="absolute -bottom-12 right-6 w-36 h-36 rounded-full bg-indigo-100/40 blur-3xl" />

                                                        <div className="relative p-6 sm:p-8 lg:p-10">
                                                            <div
                                                                className="prose prose-lg prose-gray max-w-none
                                                                    prose-headings:text-gray-900 prose-headings:font-semibold prose-headings:mb-3
                                                                    prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-4
                                                                    prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                                                                    [&_ul]:list-disc
                                                                    [&_ol.list-decimal]:list-decimal
                                                                    [&_ol.list-alpha-lower]:list-[lower-alpha]
                                                                    [&_ol.list-alpha-upper]:list-[upper-alpha]
                                                                    [&_ol.list-roman-lower]:list-[lower-roman]
                                                                    [&_ol.list-roman-upper]:list-[upper-roman]
                                                                    [&_ol]:list-decimal"
                                                                dangerouslySetInnerHTML={{ __html: section.content }}
                                                            />

                                                            <div className="mt-8 flex items-center gap-3">
                                                                <div className="h-[2px] flex-1 bg-gradient-to-r from-blue-200 via-blue-100 to-transparent" />
                                                                <div className="text-[11px] tracking-[0.35em] text-blue-400 uppercase">Balai Bahasa</div>
                                                                <div className="h-[2px] flex-1 bg-gradient-to-l from-indigo-200 via-indigo-100 to-transparent" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </motion.article>
                                );
                            })}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-md mx-auto text-center py-20"
                        >
                            <div className="relative mb-8">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full blur-3xl" />
                                <div className="relative w-24 h-24 mx-auto bg-gradient-to-br from-gray-100 to-gray-50 rounded-3xl flex items-center justify-center shadow-xl">
                                    <FileText className="w-10 h-10 text-gray-400" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Belum Ada Konten</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Konten visi dan misi sedang dalam persiapan. Silakan kunjungi kembali halaman ini.
                            </p>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Navigation Links */}
            <section className="bg-white py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                            <Link href="/profil">
                                <Button variant="outline" className="gap-2">
                                    <ArrowLeft className="w-4 h-4" />
                                    Kembali ke Profil
                                </Button>
                            </Link>
                            <div className="flex flex-wrap gap-3">
                                <Link href="/profil/sejarah">
                                    <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                                        Sejarah
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </Link>
                                <Link href="/profil/kedudukan">
                                    <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                                        Kedudukan
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </Link>
                                <Link href="/profil/struktur">
                                    <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                                        Struktur Organisasi
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gray-50 py-12 sm:py-16">
                <div className="container mx-auto px-4">
                    <Card className="border-0 bg-gradient-to-r from-blue-600 to-blue-700 shadow-xl max-w-4xl mx-auto">
                        <CardContent className="p-8 sm:p-12 text-center text-white">
                            <h2 className="text-2xl font-bold sm:text-3xl mb-4">Wujudkan Bersama Visi Kami</h2>
                            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                                Mari bergabung dalam upaya pengembangan dan pelindungan bahasa Indonesia serta bahasa daerah di Sulawesi Tenggara.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <Link href="/layanan">
                                    <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 shadow-lg">
                                        Lihat Layanan Kami
                                        <ChevronRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                                <Link href="/kontak">
                                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                                        Hubungi Kami
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </PublicLayout>
    );
}