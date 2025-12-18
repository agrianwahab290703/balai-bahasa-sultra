import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { PublicLayout } from '@/Layouts/PublicLayout';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import {
    AlertTriangle,
    CalendarClock,
    Clock,
    Home,
    Megaphone,
    BellRing,
    Info,
    ArrowLeft,
    Share2,
    Download,
    Eye,
    Calendar,
    User,
    Maximize2,
    X
} from 'lucide-react';
import { Link } from '@inertiajs/react';

type PengumumanItem = {
    id: number;
    judul: string;
    slug: string;
    konten: string;
    tipe: 'umum' | 'urgent' | 'tanggal_spesifik';
    tanggal_berlaku: string | null;
    status: string;
    prioritas: number | null;
    created_at: string;
    gallery_images?: string[] | null;
};

type Props = {
    pengumuman: PengumumanItem;
};

const tipeLabel: Record<PengumumanItem['tipe'], { label: string; className: string }> = {
    umum: { label: 'Umum', className: 'bg-blue-50 text-blue-600 border-blue-100' },
    urgent: { label: 'Urgent', className: 'bg-red-50 text-red-600 border-red-100' },
    tanggal_spesifik: { label: 'Tanggal Spesifik', className: 'bg-amber-50 text-amber-700 border-amber-100' },
};

const formatDateTimeSafe = (value?: string | null) => {
    if (!value) return '-';
    const date = new Date(value);
    if (isNaN(date.getTime())) return value;
    return date.toLocaleString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const getImageUrl = (url?: string | null) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/')) return url;
    if (url.startsWith('storage/')) return `/${url}`;
    return `/${url}`;
};

export default function PengumumanShow({ pengumuman }: Props) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    return (
        <PublicLayout>
            <Head title={pengumuman.judul} />

      
            {/* Hero Section dengan Gradient Modern */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600" />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                </div>

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
                    <div className="flex flex-col gap-6">
                        {/* Breadcrumb */}
                        <div className="text-sm text-blue-100/80 flex items-center gap-2">
                            <Link href={route('home')} className="inline-flex items-center gap-1 text-blue-100 hover:text-white transition-colors">
                                <Home className="w-4 h-4" />
                                Beranda
                            </Link>
                            <span>/</span>
                            <Link href={route('pengumuman.index')} className="text-blue-100 hover:text-white transition-colors">
                                Pengumuman
                            </Link>
                            <span>/</span>
                            <span className="text-blue-100 line-clamp-1">{pengumuman.judul}</span>
                        </div>

                        {/* Header Badge */}
                        <div className="flex items-center gap-3">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 text-sm font-semibold text-white border border-white/30">
                                <Megaphone className="w-4 h-4" />
                                Pengumuman Resmi
                            </div>
                            {pengumuman.tipe === 'urgent' && (
                                <div className="inline-flex items-center gap-2 rounded-full bg-red-500 backdrop-blur-sm px-4 py-2 text-sm font-semibold text-white animate-pulse">
                                    <AlertTriangle className="w-4 h-4" />
                                    Urgent
                                </div>
                            )}
                        </div>

                        {/* Title */}
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight max-w-4xl">
                            {pengumuman.judul}
                        </h1>

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-4">
                            <Badge className={`border-2 ${tipeLabel[pengumuman.tipe].className} px-4 py-2 text-sm font-bold bg-white`}>
                                {tipeLabel[pengumuman.tipe].label}
                            </Badge>
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-white">
                                <Calendar className="w-4 h-4" />
                                Berlaku: {formatDateTimeSafe(pengumuman.tanggal_berlaku)}
                            </div>
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-white">
                                <Clock className="w-4 h-4" />
                                {formatDateTimeSafe(pengumuman.created_at)}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                            <Button
                                variant="secondary"
                                size="sm"
                                className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
                                onClick={() => window.print()}
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Cetak
                            </Button>
                            <Button
                                variant="secondary"
                                size="sm"
                                className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
                                onClick={() => {
                                    if (navigator.share) {
                                        navigator.share({
                                            title: pengumuman.judul,
                                            url: window.location.href
                                        });
                                    }
                                }}
                            >
                                <Share2 className="w-4 h-4 mr-2" />
                                Bagikan
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 -mt-10">
                <div className="relative">
                    {/* Card Shadow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl transform translate-y-4 rotate-1" />

                    {/* Main Content Card */}
                    <Card className="relative bg-white rounded-2xl shadow-2xl border-0 overflow-hidden">
                        {/* Urgent Alert */}
                        {pengumuman.tipe === 'urgent' && (
                            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="w-6 h-6 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-bold text-lg">⚠️ Pengumuman Penting</p>
                                        <p className="text-red-100">Mohon perhatikan informasi berikut dengan saksama.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Content Body */}
                        <CardContent className="p-8 lg:p-12">
                            {/* Reading Metrics */}
                            <div className="flex items-center gap-6 pb-6 mb-6 border-b border-gray-200">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Eye className="w-4 h-4" />
                                    <span>Estimasi baca: 3 menit</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <User className="w-4 h-4" />
                                    <span>Diterbitkan oleh Admin</span>
                                </div>
                                {typeof pengumuman.prioritas === 'number' && pengumuman.prioritas > 5 && (
                                    <div className="flex items-center gap-2 text-sm text-amber-600 font-semibold">
                                        <Info className="w-4 h-4" />
                                        <span>Prioritas Tinggi</span>
                                    </div>
                                )}
                            </div>

                            {/* Main Content */}
                            <div
                                className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: pengumuman.konten }}
                                style={{
                                    fontSize: '18px',
                                    lineHeight: '1.8'
                                }}
                            />
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Gallery Section */}
            {pengumuman.gallery_images && pengumuman.gallery_images.length > 0 && (
                <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Galeri Pengumuman</h2>
                        <p className="text-gray-600">Dokumentasi visual terkait pengumuman</p>
                    </div>

                    {/* Gallery Grid */}
                    <div
                        className={`grid gap-6 ${
                            pengumuman.gallery_images.length === 1
                                ? 'grid-cols-1 max-w-2xl mx-auto'
                                : pengumuman.gallery_images.length === 2
                                ? 'grid-cols-1 sm:grid-cols-2 max-w-4xl'
                                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                        }`}
                    >
                        {pengumuman.gallery_images.slice(0, 6).map((url, idx) => (
                            <div
                                key={idx}
                                className="group relative overflow-hidden rounded-2xl bg-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                            >
                                <img
                                    src={getImageUrl(url)}
                                    alt={`Pengumuman ${idx + 1}`}
                                    className="w-full h-64 sm:h-72 lg:h-80 object-cover"
                                    loading="lazy"
                                />

                                {/* Image Overlay on Hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {/* View Button */}
                                <button
                                    onClick={() => setSelectedImage(getImageUrl(url))}
                                    className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-2 hover:bg-white"
                                >
                                    <Eye className="w-4 h-4" />
                                    Lihat
                                </button>

                                {/* Image Counter */}
                                {pengumuman.gallery_images.length > 3 && idx === 2 && (
                                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                                        <div className="text-center text-white">
                                            <p className="text-3xl font-bold">+{pengumuman.gallery_images.length - 3}</p>
                                            <p className="text-sm">Foto lainnya</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Show All Button */}
                    {pengumuman.gallery_images.length > 6 && (
                        <div className="text-center mt-10">
                            <Button
                                variant="outline"
                                size="lg"
                                className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                            >
                                Lihat Semua {pengumuman.gallery_images.length} Foto
                            </Button>
                        </div>
                    )}
                </section>
            )}

            {/* Lightbox Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-6xl max-h-[90vh] w-full">
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
                        >
                            <X className="w-8 h-8" />
                        </button>
                        <img
                            src={selectedImage}
                            alt="Full size image"
                            className="w-full h-full object-contain rounded-lg"
                        />
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                            <p className="text-white text-sm">Tekan ESC untuk menutup</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Related Section */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Butuh informasi lebih lanjut?</h3>
                    <p className="text-gray-600 mb-6">Hubungi kami melalui saluran yang tersedia</p>
                    <div className="flex gap-4 justify-center">
                        <Link href="/kontak">
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                Hubungi Kami
                            </Button>
                        </Link>
                        <Link href={route('pengumuman.index')}>
                            <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                                Lihat Pengumuman Lainnya
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}

