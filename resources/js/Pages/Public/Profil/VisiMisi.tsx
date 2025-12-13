import React from 'react';
import { Link } from '@inertiajs/react';
import { PublicLayout } from '@/Layouts/PublicLayout';
import { Card, CardContent } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { 
    Target, 
    Flag, 
    ChevronRight, 
    ArrowLeft,
    Compass,
    CheckCircle2,
    Sparkles,
    Globe,
    BookOpen,
    Users
} from 'lucide-react';

interface VisiMisiSection {
    id: number;
    type: string;
    title: string;
    content: string;
    images: string[] | null;
    metadata: {
        period?: string;
        icon?: string;
        quote?: string;
        description?: string;
        missions?: string[];
    } | null;
    order: number;
}

interface VisiMisiProps {
    sections: VisiMisiSection[];
}

// Icons for mission items
const missionIcons = [BookOpen, Globe, Sparkles, Users];

export default function VisiMisi({ sections }: VisiMisiProps) {
    const visiSection = sections.find(s => s.order === 1);
    const misiSection = sections.find(s => s.order === 2);

    return (
        <PublicLayout title="Visi dan Misi" description="Visi dan Misi Kantor Bahasa Sulawesi Tenggara">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-[#0c4a6e] via-[#1e6091] to-[#0369a1] py-20 lg:py-24 overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl" />
                    <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-emerald-400/5 rounded-full blur-2xl" />
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
                            <span className="text-white">Visi dan Misi</span>
                        </div>

                        <Badge className="mb-6 bg-yellow-400/90 text-gray-900 hover:bg-yellow-400 font-medium px-4 py-1.5">
                            <Compass className="w-4 h-4 mr-2" />
                            Visi & Misi
                        </Badge>
                        <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl mb-6">
                            Visi dan <span className="font-display italic text-yellow-400">Misi</span>
                        </h1>
                        <p className="text-lg text-blue-100/90 max-w-2xl mx-auto leading-relaxed">
                            Arah dan tujuan Kantor Bahasa Provinsi Sulawesi Tenggara 
                            dalam mengembangkan dan membina bahasa Indonesia serta bahasa daerah.
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

            {/* Visi Section */}
            <section className="bg-gradient-to-b from-white to-gray-50 py-12 lg:py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        {visiSection && (
                            <div className="space-y-8">
                                {/* Section Header */}
                                <div className="text-center mb-12">
                                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl mb-6 shadow-xl">
                                        <Target className="w-10 h-10 text-white" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-3">
                                        {visiSection.title}
                                    </h2>
                                    {visiSection.metadata?.period && (
                                        <Badge className="bg-blue-100 text-blue-700 border-0 px-4 py-1.5 text-sm font-medium">
                                            Periode {visiSection.metadata.period}
                                        </Badge>
                                    )}
                                </div>

                                {/* Vision Content */}
                                <div className="space-y-8">
                                    {/* Introduction */}
                                    <Card className="border-0 shadow-lg bg-white">
                                        <CardContent className="p-6 lg:p-8">
                                            <p className="text-base lg:text-lg text-gray-700 leading-relaxed">
                                                {visiSection.content}
                                            </p>
                                        </CardContent>
                                    </Card>

                                    {/* Featured Quote Card */}
                                    {visiSection.metadata?.quote && (
                                        <Card className="border-0 shadow-2xl overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
                                            <CardContent className="p-8 lg:p-12">
                                                <div className="flex items-start gap-6">
                                                    <div className="shrink-0 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                                        <Sparkles className="w-8 h-8 text-yellow-400" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="mb-4">
                                                            <div className="w-12 h-1 bg-yellow-400 rounded-full" />
                                                        </div>
                                                        <blockquote className="text-xl lg:text-2xl font-semibold text-white leading-relaxed">
                                                            "{visiSection.metadata.quote}"
                                                        </blockquote>
                                                        <div className="mt-6 flex items-center gap-3">
                                                            <div className="h-px flex-1 bg-white/20" />
                                                            <Badge className="bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 font-medium">
                                                                Visi Strategis
                                                            </Badge>
                                                            <div className="h-px flex-1 bg-white/20" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* Description */}
                                    {visiSection.metadata?.description && (
                                        <Card className="border-0 shadow-lg bg-white">
                                            <CardContent className="p-6 lg:p-8">
                                                <p className="text-base lg:text-lg text-gray-700 leading-relaxed">
                                                    {visiSection.metadata.description}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>

                                {/* Vision Highlights */}
                                <div className="grid md:grid-cols-3 gap-6 mt-10">
                                    <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100/50 hover:shadow-xl transition-shadow">
                                        <CardContent className="p-6 text-center">
                                            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                                                <Globe className="w-7 h-7 text-white" />
                                            </div>
                                            <h3 className="font-bold text-gray-900 mb-2">Berdaulat</h3>
                                            <p className="text-sm text-gray-600">Indonesia maju dengan kedaulatan penuh</p>
                                        </CardContent>
                                    </Card>
                                    <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100/50 hover:shadow-xl transition-shadow">
                                        <CardContent className="p-6 text-center">
                                            <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                                                <Users className="w-7 h-7 text-white" />
                                            </div>
                                            <h3 className="font-bold text-gray-900 mb-2">Mandiri</h3>
                                            <p className="text-sm text-gray-600">Kemandirian dalam berbahasa</p>
                                        </CardContent>
                                    </Card>
                                    <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-amber-100/50 hover:shadow-xl transition-shadow">
                                        <CardContent className="p-6 text-center">
                                            <div className="w-14 h-14 bg-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                                                <Sparkles className="w-7 h-7 text-white" />
                                            </div>
                                            <h3 className="font-bold text-gray-900 mb-2">Berkepribadian</h3>
                                            <p className="text-sm text-gray-600">Identitas bangsa yang kuat</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Misi Section */}
            <section className="bg-white py-12 lg:py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        {misiSection && (
                            <div>
                                {/* Section Header */}
                                <div className="text-center mb-12">
                                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl mb-6 shadow-xl">
                                        <Flag className="w-10 h-10 text-white" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
                                        {misiSection.title}
                                    </h2>
                                    <div className="max-w-3xl mx-auto">
                                        <p className="text-base lg:text-lg text-gray-600 leading-relaxed mb-6">
                                            {misiSection.content}
                                        </p>
                                        <div className="flex items-center justify-center gap-3">
                                            <div className="h-px w-16 bg-emerald-200" />
                                            <Badge className="bg-emerald-100 text-emerald-700 border-0 px-3 py-1 text-xs font-medium">
                                                4 Pilar Misi
                                            </Badge>
                                            <div className="h-px w-16 bg-emerald-200" />
                                        </div>
                                    </div>
                                </div>

                                {/* Mission Cards */}
                                {misiSection.metadata?.missions && (
                                    <div className="space-y-6">
                                        {misiSection.metadata.missions.map((mission, index) => {
                                            const IconComponent = missionIcons[index] || CheckCircle2;
                                            const colors = [
                                                { 
                                                    bg: 'from-blue-500 to-blue-600', 
                                                    light: 'from-blue-50 to-blue-100/50', 
                                                    badge: 'bg-blue-100 text-blue-700',
                                                    number: 'bg-blue-600',
                                                    accent: 'bg-blue-500'
                                                },
                                                { 
                                                    bg: 'from-emerald-500 to-teal-600', 
                                                    light: 'from-emerald-50 to-emerald-100/50', 
                                                    badge: 'bg-emerald-100 text-emerald-700',
                                                    number: 'bg-emerald-600',
                                                    accent: 'bg-emerald-500'
                                                },
                                                { 
                                                    bg: 'from-purple-500 to-indigo-600', 
                                                    light: 'from-purple-50 to-purple-100/50', 
                                                    badge: 'bg-purple-100 text-purple-700',
                                                    number: 'bg-purple-600',
                                                    accent: 'bg-purple-500'
                                                },
                                                { 
                                                    bg: 'from-amber-500 to-orange-600', 
                                                    light: 'from-amber-50 to-amber-100/50', 
                                                    badge: 'bg-amber-100 text-amber-700',
                                                    number: 'bg-amber-600',
                                                    accent: 'bg-amber-500'
                                                },
                                            ];
                                            const color = colors[index % colors.length];

                                            return (
                                                <Card 
                                                    key={index} 
                                                    className="group border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
                                                >
                                                    <CardContent className="p-0">
                                                        <div className={`bg-gradient-to-r ${color.light}`}>
                                                            <div className="p-6 lg:p-8">
                                                                <div className="flex items-start gap-6">
                                                                    {/* Number Badge */}
                                                                    <div className="shrink-0">
                                                                        <div className={`w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br ${color.bg} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                                                            <span className="text-2xl lg:text-3xl font-bold text-white">
                                                                                {index + 1}
                                                                            </span>
                                                                        </div>
                                                                    </div>

                                                                    {/* Content */}
                                                                    <div className="flex-1 space-y-4">
                                                                        {/* Header */}
                                                                        <div className="flex items-center gap-3 flex-wrap">
                                                                            <div className={`w-10 h-10 bg-gradient-to-br ${color.bg} rounded-xl flex items-center justify-center`}>
                                                                                <IconComponent className="w-5 h-5 text-white" />
                                                                            </div>
                                                                            <Badge className={`${color.badge} border-0 px-3 py-1 font-semibold text-xs uppercase tracking-wide`}>
                                                                                Misi {index + 1}
                                                                            </Badge>
                                                                        </div>

                                                                        {/* Mission Text */}
                                                                        <div className="relative">
                                                                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${color.accent} rounded-full`} />
                                                                            <p className="text-base lg:text-lg text-gray-800 leading-relaxed font-medium pl-5">
                                                                                {mission}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Impact Statement */}
                                <Card className="border-0 shadow-xl bg-gradient-to-r from-gray-50 to-gray-100/50 mt-10">
                                    <CardContent className="p-6 lg:p-8 text-center">
                                        <div className="max-w-3xl mx-auto">
                                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <CheckCircle2 className="w-6 h-6 text-white" />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-3">
                                                Komitmen Kami untuk Sulawesi Tenggara
                                            </h3>
                                            <p className="text-gray-600 leading-relaxed">
                                                Melalui keempat misi ini, Kantor Bahasa Provinsi Sulawesi Tenggara berkomitmen untuk 
                                                mengembangkan, membina, dan melindungi bahasa Indonesia serta bahasa daerah dengan 
                                                tata kelola yang partisipatif, transparan, dan akuntabel.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
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
                            <h2 className="text-2xl font-bold sm:text-3xl mb-4">
                                Wujudkan Bersama Visi Kami
                            </h2>
                            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                                Mari bergabung dalam upaya pengembangan dan pelindungan bahasa Indonesia 
                                serta bahasa daerah di Sulawesi Tenggara.
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
