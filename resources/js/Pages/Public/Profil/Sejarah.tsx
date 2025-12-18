import React from 'react';
import { Link } from '@inertiajs/react';
import { PublicLayout } from '@/Layouts/PublicLayout';
import { Card, CardContent } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { 
    History, 
    Calendar, 
    MapPin, 
    Users, 
    Building, 
    ChevronRight, 
    Quote,
    Milestone,
    ArrowLeft
} from 'lucide-react';

interface SejarahSection {
    id: number;
    type: string;
    title: string;
    content: string;
    images: string[] | null;
    metadata: {
        year?: number;
        highlight?: string;
        leaders?: Array<{ name: string; period: string }>;
    } | null;
    order: number;
}

interface SejarahProps {
    sections: SejarahSection[];
}

// Helper function to get correct image URL
const getImageUrl = (path: string | null | undefined): string => {
    if (!path) return '';
    // If already a full URL, return as is
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    // Laravel storage links to /storage, so we need to add /storage prefix
    if (path.startsWith('storage/')) return `/${path}`;
    if (path.startsWith('/storage/')) return path;
    // If starts with / already and it's not storage, return as is
    if (path.startsWith('/')) return path;
    // Otherwise, add /storage/ prefix for Laravel's storage system
    return `/storage/${path}`;
};

// Timeline milestones for visual interest
const milestones = [
    { year: 1997, event: 'HPBI Sultra mempelopori pembentukan' },
    { year: 1999, event: 'Proposal mendapat respons positif' },
    { year: 2001, event: 'Mendapat persetujuan Pusat Bahasa' },
    { year: 2003, event: 'MoU ditandatangani' },
    { year: 2004, event: 'Kantor Bahasa diresmikan' },
    { year: 2008, event: 'Gedung baru diresmikan' },
];

export default function Sejarah({ sections }: SejarahProps) {
    return (
        <PublicLayout title="Sejarah" description="Sejarah Balai Bahasa Sulawesi Tenggara">
            {/* Hero Section with Parallax Effect */}
            <section className="relative bg-gradient-to-br from-[#0c4a6e] via-[#1e6091] to-[#0369a1] py-20 lg:py-28 overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-white/5 rounded-full" />
                </div>
                {/* Subtle pattern overlay */}
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
                            <span className="text-white">Sejarah</span>
                        </div>

                        <Badge className="mb-6 bg-yellow-400/90 text-gray-900 hover:bg-yellow-400 font-medium px-4 py-1.5">
                            <History className="w-4 h-4 mr-2" />
                            Sejarah
                        </Badge>
                        <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl mb-6">
                            Perjalanan <span className="font-display italic text-yellow-400">Sejarah</span> Kami
                        </h1>
                        <p className="text-lg text-blue-100/90 max-w-2xl mx-auto leading-relaxed">
                            Kisah perjalanan Balai Bahasa Sulawesi Tenggara dalam melestarikan 
                            dan mengembangkan bahasa Indonesia serta bahasa daerah di Bumi Anoa.
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

            {/* Timeline Overview */}
            <section className="bg-white py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        <div className="flex flex-wrap justify-center gap-4 lg:gap-6">
                            {milestones.map((milestone, index) => (
                                <div 
                                    key={index}
                                    className="group flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-full border border-blue-100 hover:shadow-md transition-all"
                                >
                                    <span className="text-sm font-bold text-blue-700">{milestone.year}</span>
                                    <span className="hidden sm:inline text-xs text-gray-600">{milestone.event}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content - History Sections */}
            <section className="bg-gradient-to-b from-white to-gray-50 py-12 lg:py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        {/* History Sections - Dynamic layout based on content and images */}
                        <div className="space-y-12">
                            {sections.map((section, index) => (
                                <article
                                    key={section.id}
                                    className={`relative flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 lg:gap-12`}
                                >
                                    {/* Section number indicator */}
                                    <div className="absolute -left-4 lg:-left-12 top-0 hidden lg:flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-bold text-sm shadow-lg z-10">
                                        {index + 1}
                                    </div>

                                    {/* Images Section - Show if section has images */}
                                    {section.images && section.images.length > 0 && (
                                        <div className="lg:w-5/12">
                                            <div className="grid gap-4">
                                                {/* Main Image */}
                                                {section.images[0] && (
                                                    <div className="relative group overflow-hidden rounded-2xl shadow-xl">
                                                        <img
                                                            src={getImageUrl(section.images[0])}
                                                            alt={section.title}
                                                            className="w-full h-64 lg:h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                                                            onError={(e) => {
                                                                const img = e.target as HTMLImageElement;
                                                                img.classList.add('opacity-50');
                                                            }}
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                                                        {section.metadata?.year && (
                                                            <div className="absolute top-4 left-4">
                                                                <Badge className="bg-yellow-400 text-gray-900 font-bold">
                                                                    {section.metadata.year}
                                                                </Badge>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                {/* Additional Images Grid */}
                                                {section.images.length > 1 && (
                                                    <div className="grid grid-cols-2 gap-4">
                                                        {section.images.slice(1, 5).map((image, imgIndex) => (
                                                            <div key={imgIndex} className="relative group overflow-hidden rounded-xl shadow-lg">
                                                                <img
                                                                    src={getImageUrl(image)}
                                                                    alt={`${section.title} ${imgIndex + 2}`}
                                                                    className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-105"
                                                                    onError={(e) => {
                                                                        const img = e.target as HTMLImageElement;
                                                                        img.classList.add('opacity-50');
                                                                    }}
                                                                />
                                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                {/* Show more indicator */}
                                                {section.images.length > 5 && (
                                                    <div className="text-center">
                                                        <p className="text-sm text-gray-500">
                                                            +{section.images.length - 5} foto lainnya
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Content Section */}
                                    <div className={`${section.images && section.images.length > 0 ? 'lg:w-7/12' : 'w-full'}`}>
                                        <Card className="border-0 shadow-lg overflow-hidden bg-white hover:shadow-xl transition-shadow duration-300 h-full">
                                            <CardContent className="p-6 lg:p-8">
                                                {/* Year badge for sections without images */}
                                                {(!section.images || section.images.length === 0) && section.metadata?.year && (
                                                    <Badge className="bg-yellow-400 text-gray-900 font-bold mb-4">
                                                        {section.metadata.year}
                                                    </Badge>
                                                )}

                                                <div className="flex items-start gap-4 mb-6">
                                                    <div className="shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                                                        {index === 0 && <Milestone className="w-6 h-6 text-white" />}
                                                        {index === 1 && <Building className="w-6 h-6 text-white" />}
                                                        {index === 2 && <Users className="w-6 h-6 text-white" />}
                                                        {index === 3 && <MapPin className="w-6 h-6 text-white" />}
                                                        {index > 3 && <History className="w-6 h-6 text-white" />}
                                                    </div>
                                                    <div>
                                                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                                                            {section.title}
                                                        </h2>
                                                        {section.metadata?.highlight && (
                                                            <p className="text-sm text-blue-600 font-medium">
                                                                {section.metadata.highlight}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="prose prose-gray max-w-none">
                                                    <div
                                                        dangerouslySetInnerHTML={{ __html: section.content }}
                                                        className="text-gray-600 leading-relaxed text-lg"
                                                    />
                                                </div>

                                                {/* Leaders list if available */}
                                                {section.metadata?.leaders && (
                                                    <div className="mt-8 pt-6 border-t border-gray-100">
                                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                            <Users className="w-5 h-5 text-blue-600" />
                                                            Daftar Kepala Kantor
                                                        </h3>
                                                        <div className="grid sm:grid-cols-2 gap-3">
                                                            {section.metadata.leaders.map((leader, lIndex) => (
                                                                <div
                                                                    key={lIndex}
                                                                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors"
                                                                >
                                                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                                                                        {lIndex + 1}
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-semibold text-gray-900">{leader.name}</p>
                                                                        <p className="text-sm text-gray-600">{leader.period}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Quote Section */}
            <section className="bg-gradient-to-br from-blue-800 to-blue-900 py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <Quote className="w-12 h-12 mx-auto mb-6 text-yellow-400/50 rotate-180" />
                        <blockquote className="text-2xl sm:text-3xl font-display italic text-white leading-relaxed mb-6">
                            "Bahasa adalah jendela dunia, dan kami berkomitmen untuk membuka jendela itu 
                            selebar-lebarnya bagi masyarakat Sulawesi Tenggara."
                        </blockquote>
                        <div className="flex items-center justify-center gap-4">
                            <div className="h-px w-12 bg-yellow-400"></div>
                            <div>
                                <cite className="not-italic font-semibold text-yellow-400">Balai Bahasa Sultra</cite>
                                <p className="text-sm text-blue-200">Melayani Sejak 2004</p>
                            </div>
                            <div className="h-px w-12 bg-yellow-400"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Back Button & Related Links */}
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
                    <Card className="border-0 bg-gradient-to-r from-yellow-400 to-amber-400 shadow-xl max-w-4xl mx-auto">
                        <CardContent className="p-8 sm:p-12 text-center">
                            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl mb-4">
                                Ingin Mengetahui Lebih Lanjut?
                            </h2>
                            <p className="text-gray-800 mb-6 max-w-2xl mx-auto">
                                Jangan ragu untuk menghubungi kami jika Anda ingin mengetahui lebih dalam 
                                tentang sejarah dan perjalanan Balai Bahasa Sulawesi Tenggara.
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
