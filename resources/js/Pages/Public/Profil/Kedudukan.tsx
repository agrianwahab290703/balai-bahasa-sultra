import React from 'react';
import { Link } from '@inertiajs/react';
import { PublicLayout } from '@/Layouts/PublicLayout';
import { Card, CardContent } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { 
    Building2, 
    Scale, 
    ChevronRight, 
    ArrowLeft,
    FileText,
    Users,
    BookOpen,
    MessageSquare,
    Handshake,
    ClipboardCheck,
    Settings,
    CheckCircle2,
    Landmark
} from 'lucide-react';

interface KedudukanSection {
    id: number;
    type: string;
    title: string;
    content: string;
    images: string[] | null;
    metadata: {
        regulation?: string;
        parent_org?: string;
        functions?: string[];
    } | null;
    order: number;
}

interface KedudukanProps {
    sections: KedudukanSection[];
}

// Icons for each function
const functionIcons = [
    BookOpen,      // Pemetaan bahasa
    FileText,      // Inventarisasi
    Building2,     // Konservasi
    MessageSquare, // Pemasyarakatan
    Users,         // Fasilitasi
    Handshake,     // Layanan
    Scale,         // Kemitraan
    ClipboardCheck,// Pemantauan
    Settings,      // Administrasi
];

export default function Kedudukan({ sections }: KedudukanProps) {
    const mainSection = sections.find(s => s.order === 1);
    const functionsSection = sections.find(s => s.order === 2);

    return (
        <PublicLayout title="Kedudukan" description="Kedudukan Kantor Bahasa Sulawesi Tenggara">
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
                            <span className="text-white">Kedudukan</span>
                        </div>

                        <Badge className="mb-6 bg-yellow-400/90 text-gray-900 hover:bg-yellow-400 font-medium px-4 py-1.5">
                            <Landmark className="w-4 h-4 mr-2" />
                            Kedudukan
                        </Badge>
                        <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl mb-6">
                            Kedudukan <span className="font-display italic text-yellow-400">Organisasi</span>
                        </h1>
                        <p className="text-lg text-blue-100/90 max-w-2xl mx-auto leading-relaxed">
                            Memahami posisi dan peran Kantor Bahasa Sulawesi Tenggara 
                            dalam struktur pemerintahan Indonesia.
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

            {/* Main Content */}
            <section className="bg-white py-12 lg:py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        {/* Kedudukan Card */}
                        {mainSection && (
                            <Card className="border-0 shadow-xl overflow-hidden mb-12">
                                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 lg:p-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                            <Landmark className="w-8 h-8 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-white">{mainSection.title}</h2>
                                            {mainSection.metadata?.regulation && (
                                                <Badge className="mt-2 bg-white/20 text-white border-0">
                                                    <FileText className="w-3 h-3 mr-1" />
                                                    {mainSection.metadata.regulation}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <CardContent className="p-6 lg:p-8">
                                    <p className="text-gray-700 leading-relaxed text-lg">
                                        {mainSection.content}
                                    </p>
                                    
                                    {/* Key Info Cards */}
                                    <div className="grid sm:grid-cols-2 gap-4 mt-8">
                                        <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                    <Building2 className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <h3 className="font-semibold text-gray-900">Status</h3>
                                            </div>
                                            <p className="text-sm text-gray-600">Unit Pelaksana Teknis (UPT)</p>
                                        </div>
                                        <div className="bg-amber-50 rounded-xl p-5 border border-amber-100">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                                    <Users className="w-5 h-5 text-amber-600" />
                                                </div>
                                                <h3 className="font-semibold text-gray-900">Bertanggung Jawab Kepada</h3>
                                            </div>
                                            <p className="text-sm text-gray-600">{mainSection.metadata?.parent_org || 'Badan Pengembangan dan Pembinaan Bahasa'}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Functions Section */}
                        {functionsSection && functionsSection.metadata?.functions && (
                            <div>
                                <div className="text-center mb-10">
                                    <Badge className="mb-4 bg-emerald-100 text-emerald-700 border-0">
                                        <Scale className="w-3 h-3 mr-1" />
                                        Tugas Pokok
                                    </Badge>
                                    <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                                        Fungsi <span className="font-display italic text-emerald-600">Kantor Bahasa</span>
                                    </h2>
                                    <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
                                        {functionsSection.content}
                                    </p>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {functionsSection.metadata.functions.map((func, index) => {
                                        const IconComponent = functionIcons[index] || CheckCircle2;
                                        return (
                                            <Card 
                                                key={index} 
                                                className="group border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                                            >
                                                <CardContent className="p-5">
                                                    <div className="flex items-start gap-4">
                                                        <div className="shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                                            <IconComponent className="w-6 h-6 text-white" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <span className="w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-bold">
                                                                    {String.fromCharCode(97 + index)}
                                                                </span>
                                                            </div>
                                                            <p className="text-gray-700 text-sm leading-relaxed">
                                                                {func}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Visual Hierarchy Section */}
            <section className="bg-gradient-to-b from-gray-50 to-white py-12 lg:py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-10">
                            <h2 className="text-2xl font-bold text-gray-900">Struktur Hierarki</h2>
                            <p className="mt-2 text-gray-600">Posisi dalam struktur pemerintahan</p>
                        </div>

                        <div className="flex flex-col items-center gap-4">
                            {/* Level 1 */}
                            <div className="w-full max-w-md">
                                <Card className="border-2 border-blue-200 bg-blue-50">
                                    <CardContent className="p-4 text-center">
                                        <p className="font-semibold text-blue-800">Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi</p>
                                    </CardContent>
                                </Card>
                            </div>
                            
                            <div className="w-px h-8 bg-gray-300"></div>
                            
                            {/* Level 2 */}
                            <div className="w-full max-w-sm">
                                <Card className="border-2 border-emerald-200 bg-emerald-50">
                                    <CardContent className="p-4 text-center">
                                        <p className="font-semibold text-emerald-800">Badan Pengembangan dan Pembinaan Bahasa</p>
                                    </CardContent>
                                </Card>
                            </div>
                            
                            <div className="w-px h-8 bg-gray-300"></div>
                            
                            {/* Level 3 */}
                            <div className="w-full max-w-xs">
                                <Card className="border-2 border-yellow-400 bg-yellow-50 shadow-lg">
                                    <CardContent className="p-4 text-center">
                                        <Badge className="mb-2 bg-yellow-400 text-gray-900">UPT</Badge>
                                        <p className="font-bold text-gray-900">Kantor Bahasa Provinsi Sulawesi Tenggara</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
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
                    <Card className="border-0 bg-gradient-to-r from-emerald-500 to-teal-600 shadow-xl max-w-4xl mx-auto">
                        <CardContent className="p-8 sm:p-12 text-center text-white">
                            <h2 className="text-2xl font-bold sm:text-3xl mb-4">
                                Butuh Layanan Kebahasaan?
                            </h2>
                            <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">
                                Kami siap membantu Anda dengan berbagai layanan konsultasi bahasa, 
                                penyuntingan, dan pelatihan kebahasaan.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <Link href="/layanan">
                                    <Button size="lg" className="bg-white text-emerald-700 hover:bg-emerald-50 shadow-lg">
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
