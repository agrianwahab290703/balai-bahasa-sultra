import React from 'react';
import { Link } from '@inertiajs/react';
import { PublicLayout } from '@/Layouts/PublicLayout';
import { Card, CardContent } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { 
    ChevronRight, 
    Shield,
    Users,
    Target,
    ClipboardCheck,
    Sparkles,
    Settings,
    UserCog,
    BarChart3,
    Eye,
    Award
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ZI-WBK Categories with icons and colors
const ziWbkCategories = [
    {
        title: 'Manajemen Perubahan',
        description: 'Tim kerja, rencana pembangunan, pemantauan evaluasi, dan perubahan pola pikir',
        href: '/zi-wbk/manajemen-perubahan/tim-kerja',
        icon: Sparkles,
        color: 'from-rose-500 to-pink-600',
        lightColor: 'bg-rose-50',
        textColor: 'text-rose-600',
        items: ['Tim Kerja', 'Rencana Pembangunan WBK', 'Pemantauan & Evaluasi', 'Perubahan Pola Pikir']
    },
    {
        title: 'Penguatan Tata Laksana',
        description: 'Keterbukaan informasi, SOP, dan sistem pemerintahan berbasis elektronik',
        href: '/zi-wbk/penguatan-tata-laksana',
        icon: Settings,
        color: 'from-blue-500 to-indigo-600',
        lightColor: 'bg-blue-50',
        textColor: 'text-blue-600',
        items: ['Keterbukaan Informasi Publik', 'SOP Kegiatan Utama', 'SPBE']
    },
    {
        title: 'Manajemen SDM',
        description: 'Perencanaan kebutuhan pegawai, mutasi, pengembangan kompetensi, dan kinerja',
        href: '/zi-wbk/manajemen-sdm',
        icon: UserCog,
        color: 'from-emerald-500 to-teal-600',
        lightColor: 'bg-emerald-50',
        textColor: 'text-emerald-600',
        items: ['Perencanaan Kebutuhan', 'Pola Mutasi', 'Pengembangan Pegawai', 'Penetapan Kinerja']
    },
    {
        title: 'Akuntabilitas Kerja',
        description: 'Keterlibatan pimpinan dan pengelolaan akuntabilitas kinerja',
        href: '/zi-wbk/akuntabilitas-kerja',
        icon: BarChart3,
        color: 'from-amber-500 to-orange-600',
        lightColor: 'bg-amber-50',
        textColor: 'text-amber-600',
        items: ['Keterlibatan Pimpinan', 'Pengelolaan Akuntabilitas Kinerja']
    },
    {
        title: 'Penguatan Pengawasan',
        description: 'Pengendalian gratifikasi, SPIP, pengaduan, dan whistle-blowing system',
        href: '/zi-wbk/penguatan-pengawasan',
        icon: Eye,
        color: 'from-violet-500 to-purple-600',
        lightColor: 'bg-violet-50',
        textColor: 'text-violet-600',
        items: ['Pengendalian Gratifikasi', 'SPIP', 'Pengaduan Masyarakat', 'Whistle-Blowing']
    },
    {
        title: 'Penguatan Kualitas Pelayanan Publik',
        description: 'Standar pelayanan, budaya pelayanan prima, dan pemanfaatan teknologi',
        href: '/zi-wbk/penguatan-kualitas',
        icon: Award,
        color: 'from-cyan-500 to-sky-600',
        lightColor: 'bg-cyan-50',
        textColor: 'text-cyan-600',
        items: ['Standar Pelayanan', 'Budaya Pelayanan Prima', 'Penilaian Kepuasan']
    },
];

export default function ZiWbkIndex() {
    return (
        <PublicLayout 
            title="ZI-WBK - Zona Integritas" 
            description="Zona Integritas menuju Wilayah Bebas dari Korupsi Kantor Bahasa Sulawesi Tenggara"
        >
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-[#1e3a5f] via-[#2d5a87] to-[#1e4976] py-16 lg:py-24 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl" />
                </div>
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '32px 32px'}}></div>
                </div>

                <div className="container relative mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-6">
                            <Shield className="w-10 h-10 text-yellow-400" />
                        </div>
                        <Badge className="mb-6 bg-yellow-400/90 text-gray-900 hover:bg-yellow-400 font-medium px-5 py-2">
                            Zona Integritas
                        </Badge>
                        <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl mb-6">
                            Wilayah Bebas dari <span className="font-display italic text-yellow-400">Korupsi</span>
                        </h1>
                        <p className="text-lg text-blue-100/90 max-w-2xl mx-auto leading-relaxed">
                            Komitmen Kantor Bahasa Sulawesi Tenggara dalam mewujudkan birokrasi 
                            yang bersih, transparan, dan berintegritas melalui pembangunan 
                            Zona Integritas menuju WBK/WBBM.
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

            {/* Categories Grid */}
            <section className="bg-gradient-to-b from-white to-gray-50 py-12 lg:py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                                6 Area Perubahan
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Pembangunan Zona Integritas mencakup enam area perubahan yang saling 
                                terintegrasi untuk mewujudkan WBK/WBBM.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {ziWbkCategories.map((category, index) => {
                                const Icon = category.icon;
                                return (
                                    <Link key={category.href} href={category.href}>
                                        <Card className="group h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden bg-white hover:-translate-y-1">
                                            <CardContent className="p-6">
                                                <div className={cn(
                                                    "w-14 h-14 bg-gradient-to-br rounded-2xl flex items-center justify-center shadow-lg mb-4",
                                                    category.color
                                                )}>
                                                    <Icon className="w-7 h-7 text-white" />
                                                </div>
                                                
                                                <Badge className={cn("mb-3", category.lightColor, category.textColor)}>
                                                    Area {index + 1}
                                                </Badge>
                                                
                                                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                                    {category.title}
                                                </h3>
                                                
                                                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                                                    {category.description}
                                                </p>
                                                
                                                <div className="flex flex-wrap gap-1.5">
                                                    {category.items.slice(0, 3).map((item, i) => (
                                                        <span 
                                                            key={i} 
                                                            className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
                                                        >
                                                            {item}
                                                        </span>
                                                    ))}
                                                    {category.items.length > 3 && (
                                                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-500 rounded-full">
                                                            +{category.items.length - 3} lainnya
                                                        </span>
                                                    )}
                                                </div>
                                                
                                                <div className="mt-4 flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700">
                                                    Lihat Detail
                                                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Links */}
            <section className="bg-gray-50 py-12 border-t border-gray-100">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white overflow-hidden">
                            <CardContent className="p-8 text-center">
                                <Users className="w-12 h-12 mx-auto mb-4 text-blue-200" />
                                <h3 className="text-xl font-bold mb-2">Mulai dari Manajemen Perubahan</h3>
                                <p className="text-blue-100 mb-6 max-w-lg mx-auto">
                                    Lihat dokumen Tim Kerja, Rencana Pembangunan, Pemantauan Evaluasi, 
                                    dan Perubahan Pola Pikir sebagai fondasi pembangunan ZI.
                                </p>
                                <Link 
                                    href="/zi-wbk/manajemen-perubahan/tim-kerja"
                                    className="inline-flex items-center gap-2 bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
                                >
                                    Lihat Tim Kerja
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
