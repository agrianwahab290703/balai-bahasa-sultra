import { PublicLayout } from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';
import { FileText, ExternalLink, Calendar, Wallet, ChevronRight, BarChart3, Calculator, TrendingUp } from 'lucide-react';
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
        title: 'DIPA Tahun 2024',
        link: 'https://kantorbahasasultra.kemdikbud.go.id/wp-content/uploads/2024/06/DIPA-tahun-2024.pdf',
        type: 'pdf'
    },
    {
        id: 2,
        year: 2023,
        title: 'DIPA Tahun 2023',
        link: 'https://kantorbahasasultra.kemdikbud.go.id/wp-content/uploads/2024/06/DIPA-2023.pdf',
        type: 'pdf'
    },
    {
        id: 3,
        year: 2022,
        title: 'DIPA Tahun 2022',
        link: 'https://drive.google.com/file/d/1BL8CPyFfMJ9AzEVAcCasnBbM9coW-h5q/view',
        type: 'gdrive'
    },
];

export default function DipaRka() {
    const sortedDocuments = [...documents].sort((a, b) => b.year - a.year);

    const getYearStyle = (index: number) => {
        const styles = [
            { gradient: 'from-amber-500 to-orange-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: 'bg-amber-100 text-amber-600' },
            { gradient: 'from-blue-500 to-indigo-600', bg: 'bg-blue-50', border: 'border-blue-200', icon: 'bg-blue-100 text-blue-600' },
            { gradient: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: 'bg-emerald-100 text-emerald-600' },
        ];
        return styles[index % styles.length];
    };

    return (
        <PublicLayout
            title="DIPA / RKA"
            description="Dokumen DIPA dan RKA Balai Bahasa Provinsi Sulawesi Tenggara"
        >
            <Head title="DIPA / RKA - SAKIP" />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-[#92400e] via-[#b45309] to-[#92400e] py-16 lg:py-24 overflow-hidden">
                {/* Background decorations */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-orange-300/10 rounded-full blur-3xl" />
                </div>
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '32px 32px'}}></div>
                </div>

                <div className="container relative mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-amber-200 mb-6 text-sm flex-wrap">
                            <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
                            <ChevronRight className="h-4 w-4" />
                            <span className="text-white">SAKIP</span>
                            <ChevronRight className="h-4 w-4" />
                            <span className="text-white font-medium">DIPA / RKA</span>
                        </div>

                        <div className="flex items-start gap-6">
                            <div className="hidden sm:flex shrink-0 w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl items-center justify-center">
                                <Wallet className="w-8 h-8 text-amber-400" />
                            </div>
                            <div>
                                <Badge className="mb-4 bg-amber-400/90 text-gray-900 hover:bg-amber-400 font-medium px-4 py-1.5">
                                    <Calculator className="w-4 h-4 mr-2" />
                                    SAKIP
                                </Badge>
                                <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl mb-4">
                                    DIPA / <span className="font-display italic text-amber-400">RKA</span>
                                </h1>
                                <p className="text-lg text-amber-100/90 max-w-2xl leading-relaxed">
                                    Dokumen Daftar Isian Pelaksanaan Anggaran (DIPA) dan Rencana Kerja Anggaran (RKA) 
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
                            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                                <FileText className="w-6 h-6 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-800">{documents.length}</p>
                                <p className="text-sm text-slate-500">Total Dokumen</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-800">
                                    {Math.min(...documents.map(d => d.year))} - {Math.max(...documents.map(d => d.year))}
                                </p>
                                <p className="text-sm text-slate-500">Periode</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-800">Tahunan</p>
                                <p className="text-sm text-slate-500">Penganggaran</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Documents Section */}
            <section className="py-12 lg:py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        {/* Section Header */}
                        <div className="text-center mb-10">
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">
                                Dokumen DIPA / RKA
                            </h2>
                            <p className="text-slate-600">
                                Klik untuk melihat atau mengunduh dokumen anggaran
                            </p>
                        </div>

                        {/* Documents Cards */}
                        <div className="grid gap-6">
                            {sortedDocuments.map((doc, index) => {
                                const style = getYearStyle(index);
                                return (
                                    <a
                                        key={doc.id}
                                        href={doc.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group block"
                                    >
                                        <Card className={`border-2 ${style.border} ${style.bg} hover:shadow-xl transition-all duration-300 overflow-hidden group-hover:scale-[1.01]`}>
                                            <CardContent className="p-0">
                                                <div className="flex flex-col sm:flex-row">
                                                    {/* Year Section */}
                                                    <div className={`sm:w-40 bg-gradient-to-br ${style.gradient} p-6 flex flex-col items-center justify-center text-center`}>
                                                        <Wallet className="w-10 h-10 text-white/80 mb-2" />
                                                        <span className="text-4xl font-bold text-white">{doc.year}</span>
                                                        <span className="text-white/70 text-sm mt-1">Tahun Anggaran</span>
                                                    </div>

                                                    {/* Content Section */}
                                                    <div className="flex-1 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                                        <div>
                                                            <h3 className="text-xl font-bold text-slate-800 group-hover:text-amber-600 transition-colors mb-2">
                                                                {doc.title}
                                                            </h3>
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <Badge variant="secondary" className="text-xs">
                                                                    {doc.type === 'pdf' ? 'PDF Document' : 'Google Drive'}
                                                                </Badge>
                                                                <span className="text-sm text-slate-500">
                                                                    Daftar Isian Pelaksanaan Anggaran
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Action Button */}
                                                        <div className="flex items-center gap-3 shrink-0">
                                                            <span className="hidden lg:block text-sm font-medium text-slate-600 group-hover:text-amber-600 transition-colors">
                                                                Lihat Dokumen
                                                            </span>
                                                            <div className={`w-12 h-12 rounded-xl ${style.icon} group-hover:bg-amber-500 group-hover:text-white flex items-center justify-center transition-all duration-300`}>
                                                                <ExternalLink className="w-6 h-6" />
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

                        {/* Additional Info Cards */}
                        <div className="grid sm:grid-cols-2 gap-4 mt-8">
                            <Card className="border border-slate-200 bg-white">
                                <CardContent className="p-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                                            <BarChart3 className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-800">DIPA</h4>
                                            <p className="text-sm text-slate-500">Daftar Isian Pelaksanaan Anggaran</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border border-slate-200 bg-white">
                                <CardContent className="p-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                                            <Calculator className="w-6 h-6 text-emerald-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-800">RKA</h4>
                                            <p className="text-sm text-slate-500">Rencana Kerja dan Anggaran</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Info Section */}
            <section className="py-12 lg:py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50 overflow-hidden">
                            <CardContent className="p-6 lg:p-8">
                                <div className="flex items-start gap-4">
                                    <div className="shrink-0 w-12 h-12 bg-amber-600 rounded-xl flex items-center justify-center">
                                        <Wallet className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 mb-2">Tentang DIPA dan RKA</h2>
                                        <p className="text-gray-600 leading-relaxed mb-4">
                                            <strong>DIPA (Daftar Isian Pelaksanaan Anggaran)</strong> adalah dokumen pelaksanaan 
                                            anggaran yang disusun oleh Pengguna Anggaran/Kuasa Pengguna Anggaran dan disahkan 
                                            oleh Direktur Jenderal Perbendaharaan yang berfungsi sebagai dasar untuk melakukan 
                                            tindakan yang mengakibatkan pengeluaran negara.
                                        </p>
                                        <p className="text-gray-600 leading-relaxed mb-4">
                                            <strong>RKA (Rencana Kerja dan Anggaran)</strong> adalah dokumen perencanaan dan 
                                            penganggaran yang berisi rencana pendapatan dan belanja serta program dan kegiatan 
                                            yang akan dilaksanakan dalam satu tahun anggaran.
                                        </p>
                                        <ul className="text-gray-600 text-sm space-y-2">
                                            <li className="flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 shrink-0"></span>
                                                <span>Sebagai dasar pelaksanaan pengeluaran negara</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 shrink-0"></span>
                                                <span>Memuat rincian penggunaan anggaran per program/kegiatan</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 shrink-0"></span>
                                                <span>Alat pengendalian dan pertanggungjawaban anggaran</span>
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
