import React from 'react';
import { Link } from '@inertiajs/react';
import { PublicLayout } from '@/Layouts/PublicLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/Components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { Calendar, MapPin, Eye, ArrowRight, Users, BookOpen, Award, Phone, FileText, GraduationCap, ChevronRight, Quote, Sparkles, MessageCircle, Building2, Play, Mail } from 'lucide-react';

interface HomepageProps {
    featuredNews: any[];
    services: any[];
    visitorStats: {
        total: number;
        today: number;
        thisMonth: number;
    };
}

// Daily Indonesian language facts - rotates based on day
const languageFacts = [
    "Tahukah Anda? Bahasa Indonesia memiliki lebih dari 700 bahasa daerah yang memperkaya kosakatanya.",
    "Fakta Menarik: Kata 'orangutan' berasal dari bahasa Melayu yang berarti 'orang hutan'.",
    "Perlu Diketahui: Bahasa Indonesia adalah bahasa ke-9 yang paling banyak dituturkan di dunia.",
    "Wawasan: Ejaan bahasa Indonesia telah mengalami 4 kali perubahan sejak kemerdekaan.",
    "Menarik: Kata 'amok' dalam bahasa Inggris berasal dari kata 'amuk' dalam bahasa Melayu.",
    "Fakta: Bahasa Indonesia ditetapkan sebagai bahasa nasional pada Sumpah Pemuda, 28 Oktober 1928.",
    "Tahukah Anda? Kata 'kecap' dalam bahasa Inggris (ketchup) berasal dari bahasa Melayu.",
];

const getTodaysFact = () => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    return languageFacts[dayOfYear % languageFacts.length];
};

const heroSlides = [
    {
        title: "Melestarikan",
        titleHighlight: "Bahasa Indonesia",
        subtitle: "di Bumi Anoa",
        description: "Bersama memajukan bahasa dan sastra Indonesia di Sulawesi Tenggara melalui pembinaan, pengembangan, dan pelindungan yang berkelanjutan.",
        image: "/images/hero-1.jpg",
        cta: { text: "Kenali Kami Lebih Dekat", href: "/profil" },
        style: "gradient"
    },
    {
        title: "Konsultasi",
        titleHighlight: "Gratis",
        subtitle: "untuk Semua",
        description: "Punya pertanyaan tentang ejaan, tata bahasa, atau peristilahan? Tim ahli kami siap membantu tanpa biaya.",
        image: "/images/hero-2.jpg",
        cta: { text: "Tanyakan Sekarang", href: "/layanan/konsultasi" },
        style: "warm"
    },
    {
        title: "Tingkatkan",
        titleHighlight: "Kemampuan",
        subtitle: "Berbahasamu",
        description: "Ikuti pelatihan menulis, jurnalistik, dan workshop sastra bersama praktisi berpengalaman.",
        image: "/images/hero-3.jpg",
        cta: { text: "Lihat Jadwal Pelatihan", href: "/layanan/pelatihan" },
        style: "fresh"
    },
];

const quickServices = [
    { icon: Phone, title: "Konsultasi Bahasa", desc: "Tanya jawab seputar kebahasaan", href: "/layanan/konsultasi", color: "from-blue-500 to-blue-600" },
    { icon: FileText, title: "Penyuntingan", desc: "Perbaikan naskah & dokumen", href: "/layanan/penyuntingan", color: "from-emerald-500 to-emerald-600" },
    { icon: BookOpen, title: "Penerjemahan", desc: "Alih bahasa profesional", href: "/layanan/penerjemahan", color: "from-amber-500 to-orange-500" },
    { icon: GraduationCap, title: "Pelatihan", desc: "Workshop & kursus bahasa", href: "/layanan/pelatihan", color: "from-violet-500 to-purple-600" },
];

// Inspirational quotes about language
const inspirationalQuote = {
    text: "Bahasa menunjukkan bangsa. Bahasa adalah jati diri, bahasa adalah martabat bangsa.",
    author: "Ki Hajar Dewantara",
    role: "Bapak Pendidikan Indonesia"
};


export default function Homepage({ 
    featuredNews, 
    services, 
    visitorStats 
}: HomepageProps) {
    return (
        <PublicLayout title="Beranda">
            {/* Hero Carousel Section - Varied Styles */}
            <section className="relative">
                <Carousel 
                    className="w-full" 
                    opts={{ 
                        loop: true,
                        duration: 30,
                    }}
                    plugins={[
                        Autoplay({
                            delay: 5000,
                            stopOnInteraction: true,
                            stopOnMouseEnter: true,
                        }),
                    ]}
                >
                    <CarouselContent>
                        {heroSlides.map((slide, index) => (
                            <CarouselItem key={index}>
                                <div className="relative overflow-hidden bg-gradient-to-br from-[#0c4a6e] via-[#1e6091] to-[#0369a1] min-h-[550px] lg:min-h-[650px]">
                                    {/* Decorative elements - organic shapes */}
                                    <div className="absolute inset-0 overflow-hidden">
                                        <div className="absolute -top-24 -right-24 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl" />
                                        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl" />
                                        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-white/5 blob-shape" />
                                    </div>
                                    {/* Subtle pattern overlay */}
                                    <div className="absolute inset-0 opacity-10">
                                        <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '32px 32px'}}></div>
                                    </div>
                                    <div className="container relative mx-auto px-4 py-20 lg:py-28">
                                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                                            {/* Text content - asymmetric layout */}
                                            <div className="text-white lg:pr-8">
                                                <Badge className="mb-6 bg-yellow-400/90 text-gray-900 hover:bg-yellow-400 font-medium px-4 py-1.5 text-sm">
                                                    <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                                                    Kementerian Pendidikan Dasar dan Menengah
                                                </Badge>
                                                <h1 className="mb-4 text-balance">
                                                    <span className="block text-3xl sm:text-4xl lg:text-5xl font-medium text-blue-100">
                                                        {slide.title}
                                                    </span>
                                                    <span className="block text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold font-display italic text-white mt-2">
                                                        {slide.titleHighlight}
                                                    </span>
                                                    <span className="block text-2xl sm:text-3xl lg:text-4xl font-medium text-yellow-400 mt-2">
                                                        {slide.subtitle}
                                                    </span>
                                                </h1>
                                                <p className="mb-8 max-w-lg text-base sm:text-lg text-blue-100/90 leading-relaxed">
                                                    {slide.description}
                                                </p>
                                                <div className="flex flex-wrap gap-4">
                                                    <Link href={slide.cta.href}>
                                                        <Button size="lg" className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 font-semibold px-6 shadow-lg shadow-yellow-400/25 hover:shadow-yellow-400/40 transition-all">
                                                            {slide.cta.text}
                                                            <ArrowRight className="ml-2 h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link href="/kontak">
                                                        <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 backdrop-blur-sm font-medium">
                                                            <MessageCircle className="mr-2 h-4 w-4" />
                                                            Hubungi Kami
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                            {/* Right side - decorative/stats - asymmetric */}
                                            <div className="hidden lg:block">
                                                <div className="relative">
                                                    {/* Floating stats cards */}
                                                    <div className="absolute -top-4 right-0 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 rotate-subtle-right animate-float">
                                                        <div className="text-3xl font-bold text-white">{new Intl.NumberFormat('id-ID').format(visitorStats.total)}+</div>
                                                        <div className="text-sm text-blue-200">Pengunjung</div>
                                                    </div>
                                                    <div className="absolute top-32 -left-8 bg-yellow-400/90 rounded-2xl p-5 shadow-xl rotate-subtle animation-delay-200 animate-float">
                                                        <div className="text-3xl font-bold text-gray-900">4</div>
                                                        <div className="text-sm text-gray-700">Layanan Aktif</div>
                                                    </div>
                                                    <div className="absolute bottom-0 right-12 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 animation-delay-400 animate-float">
                                                        <div className="text-3xl font-bold text-white">700+</div>
                                                        <div className="text-sm text-blue-200">Bahasa Daerah</div>
                                                    </div>
                                                    {/* Central decorative element */}
                                                    <div className="w-64 h-64 mx-auto bg-gradient-to-br from-white/10 to-transparent rounded-full flex items-center justify-center">
                                                        <div className="text-center text-white">
                                                            <BookOpen className="w-16 h-16 mx-auto mb-3 text-yellow-400" />
                                                            <div className="font-display italic text-xl">Bahasa</div>
                                                            <div className="text-sm text-blue-200">adalah identitas</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Wave decoration - organic shape */}
                                    <div className="absolute bottom-0 left-0 right-0">
                                        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                                            <path d="M0 120L48 110C96 100 192 80 288 70C384 60 480 60 576 65C672 70 768 80 864 85C960 90 1056 90 1152 85C1248 80 1344 70 1392 65L1440 60V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z" fill="white"/>
                                        </svg>
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-4 lg:left-8 bg-white/20 border-white/30 text-white hover:bg-white/30" />
                    <CarouselNext className="right-4 lg:right-8 bg-white/20 border-white/30 text-white hover:bg-white/30" />
                </Carousel>
            </section>

            {/* Quick Services Section */}
            <section className="bg-white relative z-10 py-12 sm:py-16 -mt-1">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 lg:grid-cols-4">
                        {quickServices.map((service, index) => (
                            <Link key={index} href={service.href}>
                                <Card className={`group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden h-full`}>
                                    <CardContent className="p-0">
                                        <div className={`bg-gradient-to-br ${service.color} p-5 sm:p-6`}>
                                            <div className="flex items-center justify-between">
                                                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 group-hover:scale-110 transition-transform duration-300">
                                                    <service.icon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                                                </div>
                                                <ArrowRight className="h-5 w-5 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                            </div>
                                        </div>
                                        <div className="p-4 sm:p-5">
                                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">{service.title}</h3>
                                            <p className="text-sm text-muted-foreground">{service.desc}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Welcome Section - Selamat Datang */}
            <section className="bg-gradient-to-b from-white to-gray-50 py-16 sm:py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            {/* Text Content */}
                            <div className="order-2 lg:order-1">
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-lg text-blue-600 font-medium mb-2">Selamat datang di laman</p>
                                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                                            <span className="text-blue-700">BALAI BAHASA</span>
                                        </h2>
                                        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mt-1">
                                            PROVINSI <span className="text-yellow-500">SULAWESI TENGGARA</span>
                                        </h3>
                                    </div>
                                    
                                    <div className="h-1 w-24 bg-gradient-to-r from-blue-600 to-yellow-500 rounded-full" />
                                    
                                    <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                                        Balai Bahasa Provinsi Sulawesi Tenggara merupakan Unit Pelaksana Teknis (UPT) 
                                        di bawah Kementerian Pendidikan Dasar dan Menengah dan bertanggung jawab kepada 
                                        Kepala Badan Pengembangan dan Pembinaan Bahasa.
                                    </p>
                                    
                                    <div className="flex flex-wrap gap-4 pt-2">
                                        <Link href="/profil/sejarah">
                                            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6">
                                                <Building2 className="mr-2 h-4 w-4" />
                                                Tentang Kami
                                            </Button>
                                        </Link>
                                        <Link href="/profil/visi-misi">
                                            <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                                                Visi & Misi
                                                <ChevronRight className="ml-1 h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Visual Element */}
                            <div className="order-1 lg:order-2">
                                <div className="relative">
                                    {/* Main Image/Visual */}
                                    <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                        <img 
                                            src="/images/sejarah2.jpeg" 
                                            alt="Gedung Balai Bahasa Sulawesi Tenggara"
                                            className="w-full h-72 sm:h-80 lg:h-96 object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-transparent to-transparent" />
                                        <div className="absolute bottom-0 left-0 right-0 p-6">
                                            <Badge className="bg-yellow-400 text-gray-900 font-medium">
                                                <Building2 className="w-3 h-3 mr-1" />
                                                Sejak 2004
                                            </Badge>
                                        </div>
                                    </div>
                                    
                                    {/* Floating Stats */}
                                    <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-xl p-4 border border-gray-100 hidden sm:block">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <Award className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500">Melayani</div>
                                                <div className="font-bold text-gray-900">20+ Tahun</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Daily Language Fact - Human Touch */}
            <section className="bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-center gap-3 text-center">
                        <Sparkles className="w-5 h-5 text-amber-500 shrink-0 animate-pulse-subtle" />
                        <p className="text-sm sm:text-base text-amber-900 font-medium">
                            {getTodaysFact()}
                        </p>
                    </div>
                </div>
            </section>


            {/* Inspirational Quote Section - Human Touch */}
            <section className="bg-white py-12 sm:py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <Quote className="w-12 h-12 mx-auto mb-6 text-blue-200 rotate-180" />
                        <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-display italic text-gray-800 leading-relaxed mb-6">
                            "{inspirationalQuote.text}"
                        </blockquote>
                        <div className="flex items-center justify-center gap-4">
                            <div className="h-px w-12 bg-yellow-400"></div>
                            <div>
                                <cite className="not-italic font-semibold text-gray-900">{inspirationalQuote.author}</cite>
                                <p className="text-sm text-muted-foreground">{inspirationalQuote.role}</p>
                            </div>
                            <div className="h-px w-12 bg-yellow-400"></div>
                        </div>
                    </div>
                </div>
            </section>


            {/* Stats Section - Redesigned */}
            <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-12 sm:py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Balai Bahasa dalam Angka</h2>
                        <p className="mt-2 text-muted-foreground">Jejak langkah kami melayani masyarakat</p>
                    </div>
                    <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
                        <Card className="border-0 bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden group">
                            <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                            <CardContent className="p-6 text-center">
                                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                                    <Users className="h-7 w-7" />
                                </div>
                                <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
                                    {new Intl.NumberFormat('id-ID').format(visitorStats.total)}
                                </div>
                                <div className="text-sm text-muted-foreground">Total Pengunjung</div>
                            </CardContent>
                        </Card>
                        <Card className="border-0 bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden group">
                            <div className="h-1 bg-gradient-to-r from-emerald-500 to-emerald-600"></div>
                            <CardContent className="p-6 text-center">
                                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
                                    <Eye className="h-7 w-7" />
                                </div>
                                <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
                                    {new Intl.NumberFormat('id-ID').format(visitorStats.today)}
                                </div>
                                <div className="text-sm text-muted-foreground">Kunjungan Hari Ini</div>
                            </CardContent>
                        </Card>
                        <Card className="border-0 bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden group">
                            <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-500"></div>
                            <CardContent className="p-6 text-center">
                                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 mb-4 group-hover:scale-110 transition-transform">
                                    <BookOpen className="h-7 w-7" />
                                </div>
                                <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
                                    {new Intl.NumberFormat('id-ID').format(visitorStats.thisMonth)}
                                </div>
                                <div className="text-sm text-muted-foreground">Bulan Ini</div>
                            </CardContent>
                        </Card>
                        <Card className="border-0 bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden group">
                            <div className="h-1 bg-gradient-to-r from-violet-500 to-purple-600"></div>
                            <CardContent className="p-6 text-center">
                                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-violet-100 text-violet-600 mb-4 group-hover:scale-110 transition-transform">
                                    <Award className="h-7 w-7" />
                                </div>
                                <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">4</div>
                                <div className="text-sm text-muted-foreground">Layanan Tersedia</div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Video Profile Section */}
            <section className="bg-white py-16 sm:py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid lg:grid-cols-5 gap-10 items-center">
                            {/* Video Embed */}
                            <div className="lg:col-span-3">
                                <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-900">
                                    {/* YouTube Embed */}
                                    <div className="aspect-video">
                                        <iframe 
                                            src="https://www.youtube.com/embed/I3x4y6pOPJU" 
                                            title="Profil Pembangunan ZIWBK Balai Bahasa Provinsi Sulawesi Tenggara"
                                            className="w-full h-full"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                            allowFullScreen
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Text Content */}
                            <div className="lg:col-span-2">
                                <Badge className="mb-4 bg-red-100 text-red-700 border-0">
                                    <Play className="w-3 h-3 mr-1" fill="currentColor" />
                                    Video Profil
                                </Badge>
                                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                                    Profil Pembangunan <span className="text-blue-600">ZIWBK</span>
                                </h2>
                                <p className="text-gray-600 leading-relaxed mb-6">
                                    Saksikan video profil pembangunan Zona Integritas Wilayah Bebas dari Korupsi (ZIWBK) 
                                    Balai Bahasa Provinsi Sulawesi Tenggara. Komitmen kami untuk memberikan pelayanan 
                                    yang transparan, akuntabel, dan bebas dari korupsi.
                                </p>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <Award className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <span className="text-sm">Zona Integritas Wilayah Bebas Korupsi</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                            <Users className="w-4 h-4 text-emerald-600" />
                                        </div>
                                        <span className="text-sm">Pelayanan Publik Berkualitas</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                                            <Building2 className="w-4 h-4 text-amber-600" />
                                        </div>
                                        <span className="text-sm">Tata Kelola Pemerintahan yang Baik</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Latest News with Carousel - Improved */}
            <section className="bg-white py-14 sm:py-20">
                <div className="container mx-auto px-4">
                    <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
                        <div>
                            <Badge variant="outline" className="mb-3 border-blue-200 bg-blue-50 text-blue-700">
                                Informasi Terkini
                            </Badge>
                            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
                                Berita & <span className="font-display italic text-blue-600">Artikel</span>
                            </h2>
                            <p className="mt-2 text-muted-foreground max-w-md">Kabar terbaru seputar kegiatan dan program kami</p>
                        </div>
                        <Link href="/berita">
                            <Button variant="outline" className="shrink-0 group">
                                Lihat Semua Berita
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>
                    
                    {featuredNews.length > 0 ? (
                        <Carousel opts={{ align: "start" }} className="w-full">
                            <CarouselContent className="-ml-4">
                                {featuredNews.map((news, index) => (
                                    <CarouselItem key={news.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                                        <Link href={`/berita/${news.slug}`}>
                                            <Card className={`group overflow-hidden border-0 shadow-md transition-all duration-500 hover:shadow-2xl h-full ${index === 0 ? 'ring-2 ring-yellow-400 ring-offset-2' : ''}`}>
                                                <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100 relative">
                                                    {index === 0 && (
                                                        <Badge className="absolute top-3 left-3 z-10 bg-yellow-400 text-gray-900">
                                                            <Sparkles className="w-3 h-3 mr-1" /> Terbaru
                                                        </Badge>
                                                    )}
                                                    {news.featured_image ? (
                                                        <img 
                                                            src={news.featured_image} 
                                                            alt={news.title}
                                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                                                            <BookOpen className="h-12 w-12 text-blue-300" />
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                                <CardContent className="p-5 sm:p-6">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                            <Calendar className="h-3 w-3" />
                                                            {new Date(news.published_at).toLocaleDateString('id-ID', { 
                                                                day: 'numeric', 
                                                                month: 'long', 
                                                                year: 'numeric' 
                                                            })}
                                                        </span>
                                                    </div>
                                                    <h3 className="mb-2 line-clamp-2 text-lg font-semibold leading-snug text-gray-900 group-hover:text-blue-600 transition-colors">
                                                        {news.title}
                                                    </h3>
                                                    <p className="mb-4 line-clamp-2 text-sm text-muted-foreground leading-relaxed">
                                                        {news.excerpt}
                                                    </p>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium text-blue-600 group-hover:underline flex items-center">
                                                            Baca selengkapnya
                                                            <ChevronRight className="ml-1 h-4 w-4" />
                                                        </span>
                                                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                            <Eye className="h-3 w-3" />
                                                            {news.view_count}
                                                        </span>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="-left-4 lg:-left-6 bg-white shadow-lg border-gray-200" />
                            <CarouselNext className="-right-4 lg:-right-6 bg-white shadow-lg border-gray-200" />
                        </Carousel>
                    ) : (
                        <Card className="border-0 shadow-md">
                            <CardContent className="p-12 text-center">
                                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                    <BookOpen className="h-10 w-10 text-gray-300" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Berita</h3>
                                <p className="text-muted-foreground mb-4">Berita terbaru akan segera hadir</p>
                                <Link href="/kontak">
                                    <Button variant="outline" size="sm">Hubungi Kami</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </section>




            {/* Services - Redesigned with asymmetric cards */}
            <section className="relative py-16 sm:py-24 overflow-hidden">
                {/* Background with pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0c4a6e] via-[#1e6091] to-[#0369a1]"></div>
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.2) 1px, transparent 0)', backgroundSize: '40px 40px'}}></div>
                </div>
                
                <div className="container relative mx-auto px-4">
                    <div className="mb-12 text-center">
                        <Badge className="mb-4 bg-yellow-400/90 text-gray-900">
                            Layanan Kami
                        </Badge>
                        <h2 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl mb-3">
                            Apa yang Bisa <span className="font-display italic text-yellow-400">Kami Bantu?</span>
                        </h2>
                        <p className="text-blue-200 max-w-2xl mx-auto">Berbagai layanan kebahasaan untuk mendukung kebutuhan Anda</p>
                    </div>
                    
                    {services.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {services.map((service, index) => (
                                <Card key={service.id} className={`group border-0 bg-white/10 backdrop-blur-sm transition-all duration-300 hover:bg-white/20 overflow-hidden ${index === 0 ? 'sm:col-span-2 lg:col-span-1' : ''}`}>
                                    <CardContent className="p-6 text-center text-white">
                                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-400/20 group-hover:bg-yellow-400/30 transition-colors">
                                            {service.icon ? (
                                                <div 
                                                    className="h-8 w-8 text-yellow-400"
                                                    dangerouslySetInnerHTML={{ __html: service.icon }}
                                                />
                                            ) : (
                                                <BookOpen className="h-8 w-8 text-yellow-400" />
                                            )}
                                        </div>
                                        <h3 className="mb-2 text-lg font-semibold">{service.name}</h3>
                                        <p className="text-sm text-blue-200 line-clamp-3 mb-4">
                                            {service.description}
                                        </p>
                                        <Link href={`/layanan/${service.slug}`}>
                                            <Button variant="ghost" size="sm" className="text-yellow-400 hover:text-yellow-300 hover:bg-white/10">
                                                Selengkapnya
                                                <ChevronRight className="ml-1 h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-12 text-center">
                            <BookOpen className="mx-auto mb-4 h-12 w-12 text-blue-300" />
                            <p className="text-blue-200">Layanan akan segera tersedia</p>
                        </div>
                    )}
                    
                    <div className="mt-10 text-center">
                        <Link href="/layanan">
                            <Button size="lg" className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 font-semibold px-8 shadow-lg">
                                Jelajahi Semua Layanan
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>


            {/* CTA Section - Redesigned */}
            <section className="bg-white py-16 sm:py-24">
                <div className="container mx-auto px-4">
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 p-8 sm:p-12 lg:p-16">
                        {/* Decorative elements */}
                        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/20 rounded-full blur-2xl"></div>
                        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-orange-400/30 rounded-full blur-3xl"></div>
                        
                        <div className="relative grid lg:grid-cols-2 gap-8 items-center">
                            <div>
                                <Badge className="mb-4 bg-white/30 text-gray-900 backdrop-blur-sm">
                                    <MessageCircle className="w-3 h-3 mr-1" /> Mari Berdiskusi
                                </Badge>
                                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 text-balance">
                                    Punya Pertanyaan <span className="font-display italic">Seputar Bahasa?</span>
                                </h2>
                                <p className="text-gray-800 text-lg mb-6 max-w-lg">
                                    Tim kami siap membantu dengan pertanyaan ejaan, tata bahasa, penyuntingan naskah, dan layanan kebahasaan lainnya.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <Link href="/layanan/konsultasi">
                                        <Button size="lg" className="bg-gray-900 text-white hover:bg-gray-800 font-semibold px-6 shadow-lg">
                                            <Phone className="mr-2 h-4 w-4" />
                                            Konsultasi Gratis
                                        </Button>
                                    </Link>
                                    <Link href="/layanan">
                                        <Button size="lg" variant="outline" className="border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white font-medium">
                                            Lihat Layanan
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                            <div className="hidden lg:flex justify-center">
                                <div className="relative">
                                    <div className="w-48 h-48 bg-white/40 backdrop-blur-sm rounded-2xl rotate-subtle flex items-center justify-center shadow-2xl">
                                        <Quote className="w-20 h-20 text-gray-800/50" />
                                    </div>
                                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/60 backdrop-blur-sm rounded-xl rotate-subtle-right flex items-center justify-center shadow-xl">
                                        <Sparkles className="w-10 h-10 text-amber-600" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Location Section */}
            <section className="bg-gradient-to-b from-gray-50 to-white py-16 sm:py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        {/* Section Header */}
                        <div className="text-center mb-12">
                            <Badge className="mb-4 bg-blue-100 text-blue-700 border-0">
                                <MapPin className="w-3 h-3 mr-1" />
                                Lokasi Kami
                            </Badge>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                                Kunjungi <span className="text-blue-600">Balai Bahasa</span>
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Temukan lokasi kantor kami dan kunjungi untuk mendapatkan layanan kebahasaan secara langsung
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Map */}
                            <div className="lg:col-span-2">
                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200 h-full min-h-[400px]">
                                    <iframe 
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3979.971232429346!2d122.5355995749754!3d-4.02628339594746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2d98936467557bcd%3A0x65c1443965909d6e!2sBalai%20Bahasa%20Provinsi%20Sulawesi%20Tenggara!5e0!3m2!1sen!2sid!4v1765213297585!5m2!1sen!2sid" 
                                        className="w-full h-full min-h-[400px]"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy" 
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="Lokasi Balai Bahasa Sulawesi Tenggara"
                                    />
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-6">
                                <Card className="border-0 shadow-lg">
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                                                <Building2 className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 mb-1">Alamat</h3>
                                                <p className="text-sm text-gray-600 leading-relaxed">
                                                    Jalan Haluoleo, Kompleks Bumi Praja, Anduonohu, Kendari, Sulawesi Tenggara
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-0 shadow-lg">
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                                                <Phone className="w-6 h-6 text-emerald-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 mb-1">WhatsApp</h3>
                                                <a 
                                                    href="https://wa.me/6281342520567" 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline"
                                                >
                                                    081342520567
                                                </a>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-0 shadow-lg">
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                                                <Mail className="w-6 h-6 text-amber-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                                                <a 
                                                    href="mailto:balaibahasasultra@kemdikbud.go.id"
                                                    className="text-sm text-amber-600 hover:text-amber-700 hover:underline break-all"
                                                >
                                                    balaibahasasultra@kemdikbud.go.id
                                                </a>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-0 shadow-lg">
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center shrink-0">
                                                <Calendar className="w-6 h-6 text-violet-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 mb-1">Jam Operasional</h3>
                                                <p className="text-sm text-gray-600">
                                                    Senin - Jumat: 08.00 - 16.00 WITA
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Link href="/kontak" className="block">
                                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                        <MessageCircle className="mr-2 h-4 w-4" />
                                        Hubungi Kami
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
