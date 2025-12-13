import { PublicLayout } from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';
import { FileText, ExternalLink, Calendar, Target, ChevronRight, ListChecks, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';

interface Document {
    id: number;
    year: number;
    title: string;
    link: string;
    type: 'pdf' | 'gdrive';
}

const documents: Document[] = [
    {
        id: 1,
        year: 2024,
        title: 'Rencana Aksi Tahun 2024',
        link: 'https://kantorbahasasultra.kemdikbud.go.id/wp-content/uploads/2024/06/Rencana-Aksi-2024.pdf',
        type: 'pdf'
    },
    {
        id: 2,
        year: 2023,
        title: 'Rencana Aksi Tahun 2023',
        link: 'https://kantorbahasasultra.kemdikbud.go.id/wp-content/uploads/2023/07/RENCANA-AKSI-KBST-2023-1.pdf',
        type: 'pdf'
    },
    {
        id: 3,
        year: 2022,
        title: 'Rencana Aksi Tahun 2022',
        link: 'https://drive.google.com/file/d/1Ne88MxguRoDtkKq7vFnZRaeeG5MyYk30/view',
        type: 'gdrive'
    },
    {
        id: 4,
        year: 2021,
        title: 'Rencana Aksi Tahun 2021',
        link: 'https://drive.google.com/file/d/1ILlG-Tn8O0bFpyVj2xLPfHxhQqMbCTVq/view',
        type: 'gdrive'
    },
    {
        id: 5,
        year: 2020,
        title: 'Rencana Aksi Tahun 2020',
        link: 'https://drive.google.com/file/d/1dPt-9Pm9FMWULiU8VuuXPkxX3r_S_KPe/view',
        type: 'gdrive'
    },
    {
        id: 6,
        year: 2019,
        title: 'Rencana Aksi Tahun 2019',
        link: 'https://drive.google.com/file/d/1ixc8hZJxb7_Yy9bAh9vZuH-D4HA1DQHV/view',
        type: 'gdrive'
    },
    {
        id: 7,
        year: 2018,
        title: 'Rencana Aksi Tahun 2018',
        link: 'https://drive.google.com/file/d/14bQPWNdZoRxvYCYKwsMpxqPa3WgWFNVT/view',
        type: 'gdrive'
    },
];

export default function RencanaAksi() {
    const sortedDocuments = [...documents].sort((a, b) => b.year - a.year);

    const getYearColor = (index: number) => {
        const colors = [
            { bg: 'bg-emerald-500', gradient: 'from-emerald-500 to-teal-600', light: 'bg-emerald-50 border-emerald-200' },
            { bg: 'bg-blue-500', gradient: 'from-blue-500 to-indigo-600', light: 'bg-blue-50 border-blue-200' },
            { bg: 'bg-violet-500', gradient: 'from-violet-500 to-purple-600', light: 'bg-violet-50 border-violet-200' },
            { bg: 'bg-amber-500', gradient: 'from-amber-500 to-orange-600', light: 'bg-amber-50 border-amber-200' },
            { bg: 'bg-rose-500', gradient: 'from-rose-500 to-pink-600', light: 'bg-rose-50 border-rose-200' },
            { bg: 'bg-cyan-500', gradient: 'from-cyan-500 to-sky-600', light: 'bg-cyan-50 border-cyan-200' },
            { bg: 'bg-lime-500', gradient: 'from-lime-500 to-green-600', light: 'bg-lime-50 border-lime-200' },
        ];
        return colors[index % colors.length];
    };

    return (
        <PublicLayout
            title="Rencana Aksi"
            description="Dokumen Rencana Aksi Balai Bahasa Provinsi Sulawesi Tenggara"
        >
            <Head title="Rencana Aksi - SAKIP" />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-[#065f46] via-[#047857] to-[#065f46] py-16 lg:py-24 overflow-hidden">
                {/* Background decorations */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-teal-300/10 rounded-full blur-3xl" />
                </div>
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '32px 32px'}}></div>
                </div>

                <div className="container relative mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-emerald-200 mb-6 text-sm flex-wrap">
                            <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
                            <ChevronRight className="h-4 w-4" />
                            <span className="text-white">SAKIP</span>
                            <ChevronRight className="h-4 w-4" />
                            <span className="text-white font-medium">Rencana Aksi</span>
                        </div>

                        <div className="flex items-start gap-6">
                            <div className="hidden sm:flex shrink-0 w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl items-center justify-center">
                                <Target className="w-8 h-8 text-emerald-400" />
                            </div>
                            <div>
                                <Badge className="mb-4 bg-emerald-400/90 text-gray-900 hover:bg-emerald-400 font-medium px-4 py-1.5">
                                    <ListChecks className="w-4 h-4 mr-2" />
                                    SAKIP
                                </Badge>
                                <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl mb-4">
                                    Rencana <span className="font-display italic text-emerald-400">Aksi</span>
                                </h1>
                                <p className="text-lg text-emerald-100/90 max-w-2xl leading-relaxed">
                                    Dokumen penjabaran perjanjian kinerja ke dalam langkah-langkah aksi nyata
                                    Balai Bahasa Provinsi Sulawesi Tenggara
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Wave decoration */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                        <path d="M0 60L60 55C120 50 240 40 360 35C480 30 600 30 720 33.3C840 37 960 43 1080 45C1200 47 1320 45 1380 44L1440 43V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z" fill="#f8fafc"/>
                    </svg>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-slate-50 py-8 border-b border-slate-200">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                                <FileText className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-800">{documents.length}</p>
                                <p className="text-sm text-slate-500">Total Dokumen</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-800">
                                    {Math.min(...documents.map(d => d.year))} - {Math.max(...documents.map(d => d.year))}
                                </p>
                                <p className="text-sm text-slate-500">Periode</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
                                <Target className="w-6 h-6 text-violet-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-800">Tahunan</p>
                                <p className="text-sm text-slate-500">Penyusunan</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Documents List Section */}
            <section className="py-12 lg:py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        {/* Section Header */}
                        <div className="text-center mb-10">
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">
                                Dokumen Rencana Aksi
                            </h2>
                            <p className="text-slate-600">
                                Klik untuk melihat atau mengunduh dokumen
                            </p>
                        </div>

                        {/* Documents Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {sortedDocuments.map((doc, index) => {
                                const colors = getYearColor(index);
                                return (
                                    <a
                                        key={doc.id}
                                        href={doc.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group block"
                                    >
                                        <Card className={`border ${colors.light} hover:shadow-lg transition-all duration-300 overflow-hidden group-hover:scale-[1.02] h-full`}>
                                            <CardContent className="p-0">
                                                <div className="flex items-stretch h-full">
                                                    {/* Year Badge */}
                                                    <div className={`w-20 sm:w-24 bg-gradient-to-br ${colors.gradient} flex flex-col items-center justify-center py-6 shrink-0`}>
                                                        <span className="text-2xl sm:text-3xl font-bold text-white">{doc.year}</span>
                                                        <Sparkles className="w-4 h-4 text-white/60 mt-1" />
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-1 p-4 sm:p-5 flex flex-col justify-center">
                                                        <h3 className="font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors mb-2">
                                                            {doc.title}
                                                        </h3>
                                                        <div className="flex items-center justify-between gap-2">
                                                            <Badge variant="secondary" className="text-xs">
                                                                {doc.type === 'pdf' ? 'PDF' : 'Google Drive'}
                                                            </Badge>
                                                            <div className="flex items-center gap-1 text-sm text-slate-500 group-hover:text-emerald-600 transition-colors">
                                                                <span className="hidden sm:inline">Lihat</span>
                                                                <ExternalLink className="w-4 h-4" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Info Section */}
            <section className="py-12 lg:py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-teal-50 overflow-hidden">
                            <CardContent className="p-6 lg:p-8">
                                <div className="flex items-start gap-4">
                                    <div className="shrink-0 w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center">
                                        <Target className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 mb-2">Tentang Rencana Aksi</h2>
                                        <p className="text-gray-600 leading-relaxed mb-4">
                                            Rencana Aksi (RA) merupakan penjabaran dari perjanjian kinerja yang memuat 
                                            tahapan-tahapan pencapaian target kinerja, rencana kegiatan, waktu pelaksanaan, 
                                            dan sumber daya yang dibutuhkan. Rencana Aksi menjadi panduan operasional dalam 
                                            pelaksanaan kegiatan sehari-hari untuk memastikan tercapainya target kinerja 
                                            yang telah ditetapkan.
                                        </p>
                                        <ul className="text-gray-600 text-sm space-y-2">
                                            <li className="flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 shrink-0"></span>
                                                <span>Menjabarkan target kinerja menjadi langkah-langkah konkret</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 shrink-0"></span>
                                                <span>Menetapkan jadwal dan milestone pencapaian</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 shrink-0"></span>
                                                <span>Mengidentifikasi sumber daya yang diperlukan</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
