import React from 'react';
import { Link } from '@inertiajs/react';
import { PublicLayout } from '@/Layouts/PublicLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Phone, FileText, BookOpen, GraduationCap, ChevronRight, CheckCircle, Clock, Users, Sparkles, ArrowRight, MessageCircle, Briefcase } from 'lucide-react';

const layananList = [
    {
        id: 1,
        title: 'Konsultasi Bahasa',
        slug: 'konsultasi',
        icon: Phone,
        color: 'from-blue-500 to-blue-600',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-600',
        description: 'Layanan konsultasi kebahasaan gratis untuk masyarakat umum, instansi pemerintah, dan swasta. Dapatkan jawaban akurat dari ahli bahasa kami.',
        features: [
            'Konsultasi ejaan dan tata bahasa',
            'Konsultasi peristilahan baku',
            'Konsultasi penulisan karya ilmiah',
            'Konsultasi via telepon, email, atau tatap muka'
        ],
        schedule: 'Senin - Jumat, 08:00 - 16:00 WITA',
        highlight: 'Gratis untuk semua'
    },
    {
        id: 2,
        title: 'Penyuntingan Naskah',
        slug: 'penyuntingan',
        icon: FileText,
        color: 'from-emerald-500 to-emerald-600',
        bgColor: 'bg-emerald-50',
        textColor: 'text-emerald-600',
        description: 'Layanan penyuntingan profesional untuk memastikan kualitas bahasa dalam dokumen, naskah, dan publikasi Anda.',
        features: [
            'Penyuntingan ejaan dan tanda baca',
            'Penyuntingan struktur kalimat',
            'Penyuntingan gaya bahasa',
            'Penyuntingan dokumen resmi pemerintah'
        ],
        schedule: 'Sesuai perjanjian',
        highlight: 'Profesional & teliti'
    },
    {
        id: 3,
        title: 'Penerjemahan',
        slug: 'penerjemahan',
        icon: BookOpen,
        color: 'from-amber-500 to-orange-500',
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-600',
        description: 'Layanan penerjemahan dokumen dari dan ke bahasa Indonesia, termasuk bahasa daerah Sulawesi Tenggara.',
        features: [
            'Penerjemahan dokumen resmi',
            'Penerjemahan karya sastra daerah',
            'Penerjemahan bahasa Tolaki, Muna, Buton',
            'Penerjemahan tersumpah'
        ],
        schedule: 'Sesuai perjanjian',
        highlight: 'Bahasa daerah tersedia'
    },
    {
        id: 4,
        title: 'Pelatihan Kebahasaan',
        slug: 'pelatihan',
        icon: GraduationCap,
        color: 'from-violet-500 to-purple-600',
        bgColor: 'bg-violet-50',
        textColor: 'text-violet-600',
        description: 'Program pelatihan dan workshop untuk meningkatkan kemampuan berbahasa Indonesia yang baik dan benar.',
        features: [
            'Pelatihan penulisan karya ilmiah',
            'Pelatihan jurnalistik & konten digital',
            'Workshop sastra dan kreasi',
            'Pelatihan BIPA (Bahasa Indonesia bagi Penutur Asing)'
        ],
        schedule: 'Sesuai jadwal kegiatan',
        highlight: 'Sertifikat resmi'
    }
];

export default function LayananIndex() {
    return (
        <PublicLayout title="Layanan">
            {/* Hero Section - Different style */}
            <section className="relative bg-gradient-to-br from-[#0c4a6e] via-[#1e6091] to-[#0369a1] py-20">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl" />
                </div>
                <div className="container relative mx-auto px-4">
                    <div className="max-w-3xl">
                        <Badge className="mb-4 bg-yellow-400/90 text-gray-900 font-medium px-4 py-1.5">
                            <Briefcase className="w-3.5 h-3.5 mr-1.5" />
                            Layanan Kami
                        </Badge>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
                            Apa yang Bisa <span className="font-display italic text-yellow-400">Kami Bantu?</span>
                        </h1>
                        <p className="text-lg text-blue-100 max-w-2xl">
                            Berbagai layanan kebahasaan profesional untuk membantu Anda dalam penggunaan bahasa Indonesia yang baik dan benar
                        </p>
                    </div>
                </div>
                {/* Wave decoration */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                        <path d="M0 60L48 55C96 50 192 40 288 35C384 30 480 30 576 32.5C672 35 768 40 864 42.5C960 45 1056 45 1152 42.5C1248 40 1344 35 1392 32.5L1440 30V60H1392C1344 60 1248 60 1152 60C1056 60 960 60 864 60C768 60 672 60 576 60C480 60 384 60 288 60C192 60 96 60 48 60H0Z" fill="#f9fafb"/>
                    </svg>
                </div>
            </section>


            {/* Services List - Redesigned */}
            <section className="bg-gray-50 py-14 sm:py-20">
                <div className="container mx-auto px-4">
                    <div className="space-y-8">
                        {layananList.map((layanan, index) => (
                            <Card key={layanan.id} className="border-0 shadow-lg overflow-hidden group hover:shadow-2xl transition-shadow duration-500">
                                <div className={`h-1.5 bg-gradient-to-r ${layanan.color}`} />
                                <CardContent className="p-6 sm:p-8">
                                    <div className="grid gap-8 lg:grid-cols-4">
                                        {/* Icon & Title */}
                                        <div className="lg:col-span-1">
                                            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${layanan.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                                <layanan.icon className="h-8 w-8" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{layanan.title}</h3>
                                            <Badge className={`${layanan.bgColor} ${layanan.textColor} border-0`}>
                                                <Sparkles className="w-3 h-3 mr-1" />
                                                {layanan.highlight}
                                            </Badge>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
                                                <Clock className="h-4 w-4" />
                                                {layanan.schedule}
                                            </div>
                                        </div>
                                        
                                        {/* Description & Features */}
                                        <div className="lg:col-span-2">
                                            <p className="text-muted-foreground mb-6 text-base leading-relaxed">{layanan.description}</p>
                                            <div className="grid gap-3 sm:grid-cols-2">
                                                {layanan.features.map((feature, idx) => (
                                                    <div key={idx} className="flex items-start gap-3 text-sm">
                                                        <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                                                        <span className="text-gray-700">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        {/* CTA */}
                                        <div className="lg:col-span-1 flex flex-col justify-center gap-3">
                                            <Link href={`/layanan/${layanan.slug}`}>
                                                <Button className={`w-full bg-gradient-to-r ${layanan.color} hover:opacity-90 text-white`}>
                                                    Selengkapnya
                                                    <ChevronRight className="ml-2 h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Link href="/kontak">
                                                <Button variant="outline" className="w-full">
                                                    Ajukan Layanan
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* How to Access - Redesigned */}
            <section className="bg-white py-14 sm:py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Badge variant="outline" className="mb-4 border-blue-200 bg-blue-50 text-blue-700">
                            Panduan
                        </Badge>
                        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
                            Cara Mengakses <span className="font-display italic text-blue-600">Layanan</span>
                        </h2>
                        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">Langkah mudah untuk mendapatkan layanan kebahasaan dari kami</p>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            { step: 1, title: 'Pilih Layanan', desc: 'Tentukan jenis layanan yang sesuai dengan kebutuhan Anda', color: 'from-blue-500 to-blue-600' },
                            { step: 2, title: 'Hubungi Kami', desc: 'Kontak via telepon, email, atau kunjungi kantor kami langsung', color: 'from-emerald-500 to-emerald-600' },
                            { step: 3, title: 'Konsultasi', desc: 'Diskusikan kebutuhan Anda dengan tim ahli bahasa kami', color: 'from-amber-500 to-orange-500' },
                            { step: 4, title: 'Selesai', desc: 'Dapatkan layanan profesional sesuai kebutuhan Anda', color: 'from-violet-500 to-purple-600' },
                        ].map((item) => (
                            <Card key={item.step} className="border-0 shadow-md hover:shadow-lg transition-shadow text-center overflow-hidden group">
                                <div className={`h-1 bg-gradient-to-r ${item.color}`}></div>
                                <CardContent className="p-6">
                                    <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-white font-bold text-xl group-hover:scale-110 transition-transform`}>
                                        {item.step}
                                    </div>
                                    <h3 className="font-semibold text-gray-900 text-lg mb-2">{item.title}</h3>
                                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA - Redesigned */}
            <section className="relative py-16 sm:py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0c4a6e] via-[#1e6091] to-[#0369a1]"></div>
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.2) 1px, transparent 0)', backgroundSize: '40px 40px'}}></div>
                </div>
                
                <div className="container relative mx-auto px-4 text-center">
                    <Badge className="mb-4 bg-yellow-400/90 text-gray-900">
                        <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                        Siap Membantu
                    </Badge>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                        Butuh <span className="font-display italic text-yellow-400">Bantuan?</span>
                    </h2>
                    <p className="text-blue-200 mb-8 max-w-2xl mx-auto text-lg">
                        Tim kami siap membantu Anda dengan berbagai kebutuhan kebahasaan. Jangan ragu untuk menghubungi kami.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link href="/kontak">
                            <Button size="lg" className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 font-semibold px-8 shadow-lg">
                                <Phone className="mr-2 h-4 w-4" />
                                Hubungi Kami
                            </Button>
                        </Link>
                        <Link href="/layanan/konsultasi">
                            <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 font-medium">
                                Konsultasi Gratis
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
