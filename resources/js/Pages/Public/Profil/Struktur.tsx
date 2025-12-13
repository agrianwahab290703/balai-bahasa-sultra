import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { PublicLayout } from '@/Layouts/PublicLayout';
import { Card, CardContent } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { 
    Network, 
    ChevronRight, 
    ArrowLeft,
    Download,
    ZoomIn,
    ZoomOut,
    Maximize2,
    X
} from 'lucide-react';

interface StrukturProps {
    imageUrl: string;
}

export default function Struktur({ imageUrl }: StrukturProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = 'struktur-organisasi-kantor-bahasa-sultra.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <PublicLayout title="Struktur Organisasi" description="Struktur Organisasi Kantor Bahasa Sulawesi Tenggara">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-[#0c4a6e] via-[#1e6091] to-[#0369a1] py-20 lg:py-24 overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl" />
                </div>
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '32px 32px'}}></div>
                </div>

                <div className="container relative mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Breadcrumb */}
                        <div className="flex items-center justify-center gap-2 text-blue-200 mb-6">
                            <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
                            <ChevronRight className="h-4 w-4" />
                            <Link href="/profil" className="hover:text-white transition-colors">Profil</Link>
                            <ChevronRight className="h-4 w-4" />
                            <span className="text-white">Struktur Organisasi</span>
                        </div>

                        <Badge className="mb-6 bg-yellow-400/90 text-gray-900 hover:bg-yellow-400 font-medium px-4 py-1.5">
                            <Network className="w-4 h-4 mr-2" />
                            Struktur Organisasi
                        </Badge>
                        <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl mb-6">
                            Struktur <span className="font-display italic text-yellow-400">Organisasi</span>
                        </h1>
                        <p className="text-lg text-blue-100/90 max-w-2xl mx-auto leading-relaxed">
                            Susunan organisasi dan tata kerja Kantor Bahasa Provinsi Sulawesi Tenggara 
                            berdasarkan Permendikbud Nomor 12 Tahun 2022.
                        </p>
                    </div>
                </div>

                {/* Wave decoration */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                        <path d="M0 120L48 110C96 100 192 80 288 70C384 60 480 60 576 65C672 70 768 80 864 85C960 90 1056 90 1152 85C1248 80 1344 70 1392 65L1440 60V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z" fill="white"/>
                    </svg>
                </div>
            </section>

            {/* Organizational Chart Section */}
            <section className="bg-white py-12 lg:py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
                            <Button 
                                onClick={() => setIsModalOpen(true)}
                                variant="outline" 
                                className="gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                            >
                                <Maximize2 className="w-4 h-4" />
                                Lihat Ukuran Penuh
                            </Button>
                            <Button 
                                onClick={handleDownload}
                                className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                                <Download className="w-4 h-4" />
                                Unduh Gambar
                            </Button>
                        </div>

                        {/* Main Image Card */}
                        <Card className="border-0 shadow-2xl overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 lg:p-6">
                                <div className="flex items-center justify-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                        <Network className="w-5 h-5 text-white" />
                                    </div>
                                    <h2 className="text-lg font-semibold text-white">
                                        Bagan Struktur Organisasi
                                    </h2>
                                </div>
                            </div>
                            <CardContent className="p-4 lg:p-8 bg-gradient-to-b from-gray-50 to-white">
                                {/* Image Container */}
                                <div 
                                    className="relative group cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow-inner"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    <img 
                                        src={imageUrl} 
                                        alt="Struktur Organisasi Kantor Bahasa Provinsi Sulawesi Tenggara"
                                        className="w-full h-auto transition-transform duration-300 group-hover:scale-[1.02]"
                                    />
                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/10 transition-colors duration-300 flex items-center justify-center">
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-lg">
                                                <ZoomIn className="w-8 h-8 text-blue-600" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Image Caption */}
                                <div className="mt-6 text-center">
                                    <p className="text-sm text-gray-500">
                                        Klik gambar untuk memperbesar atau gunakan tombol di atas untuk mengunduh
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Description Cards */}
                        <div className="grid md:grid-cols-2 gap-6 mt-10">
                            <Card className="border-0 shadow-lg">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                                            <Network className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-2">Kepala Kantor</h3>
                                            <p className="text-sm text-gray-600 leading-relaxed">
                                                Kantor Bahasa Provinsi Sulawesi Tenggara dipimpin oleh seorang Kepala yang 
                                                bertanggung jawab langsung kepada Kepala Badan Pengembangan dan Pembinaan Bahasa.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md">
                                            <Network className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-2">Unit Kerja</h3>
                                            <p className="text-sm text-gray-600 leading-relaxed">
                                                Struktur organisasi terdiri dari unit-unit kerja yang menangani berbagai 
                                                fungsi pelindungan, pengembangan, dan pemasyarakatan bahasa dan sastra.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Full Screen Modal */}
            {isModalOpen && (
                <div 
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                    onClick={() => {
                        setIsModalOpen(false);
                        setIsZoomed(false);
                    }}
                >
                    {/* Close Button */}
                    <button 
                        onClick={() => {
                            setIsModalOpen(false);
                            setIsZoomed(false);
                        }}
                        className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>

                    {/* Zoom Toggle Button */}
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsZoomed(!isZoomed);
                        }}
                        className="absolute top-4 right-20 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
                    >
                        {isZoomed ? (
                            <ZoomOut className="w-6 h-6 text-white" />
                        ) : (
                            <ZoomIn className="w-6 h-6 text-white" />
                        )}
                    </button>

                    {/* Download Button */}
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDownload();
                        }}
                        className="absolute top-4 right-36 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
                    >
                        <Download className="w-6 h-6 text-white" />
                    </button>

                    {/* Modal Image */}
                    <div 
                        className={`${isZoomed ? 'overflow-auto max-w-none' : 'max-w-7xl'} w-full h-full flex items-center justify-center`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img 
                            src={imageUrl} 
                            alt="Struktur Organisasi Kantor Bahasa Provinsi Sulawesi Tenggara"
                            className={`${isZoomed ? 'max-w-none w-auto cursor-zoom-out' : 'max-w-full max-h-full cursor-zoom-in'} object-contain transition-all duration-300`}
                            onClick={() => setIsZoomed(!isZoomed)}
                        />
                    </div>
                </div>
            )}

            {/* Navigation Links */}
            <section className="bg-gray-50 py-12">
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
                                <Link href="/profil/visi-misi">
                                    <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                                        Visi & Misi
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-white py-12 sm:py-16">
                <div className="container mx-auto px-4">
                    <Card className="border-0 bg-gradient-to-r from-yellow-400 to-amber-400 shadow-xl max-w-4xl mx-auto">
                        <CardContent className="p-8 sm:p-12 text-center">
                            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl mb-4">
                                Ada Pertanyaan Tentang Struktur Kami?
                            </h2>
                            <p className="text-gray-800 mb-6 max-w-2xl mx-auto">
                                Jika Anda ingin mengetahui lebih lanjut tentang organisasi kami atau membutuhkan 
                                informasi spesifik, jangan ragu untuk menghubungi kami.
                            </p>
                            <Link href="/kontak">
                                <Button size="lg" className="bg-blue-700 text-white hover:bg-blue-800 shadow-lg">
                                    Hubungi Kami
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </PublicLayout>
    );
}
