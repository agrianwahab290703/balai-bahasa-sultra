import { PublicLayout } from '@/Layouts/PublicLayout';
import { Head } from '@inertiajs/react';
import { FileText, Download, Calendar, ExternalLink, TrendingUp, BarChart3 } from 'lucide-react';

interface Report {
    id: number;
    year: number;
    title: string;
    description: string;
    link: string;
    type: string;
}

interface Props {
    reports: Report[];
}

export default function LaporanKinerja({ reports }: Props) {
    // Sort by year descending (newest first)
    const sortedReports = [...reports].sort((a, b) => b.year - a.year);

    const getGradientColor = (index: number) => {
        const gradients = [
            'from-blue-500 to-indigo-600',
            'from-emerald-500 to-teal-600',
            'from-orange-500 to-amber-600',
            'from-purple-500 to-violet-600',
            'from-rose-500 to-pink-600',
        ];
        return gradients[index % gradients.length];
    };

    const getIconBgColor = (index: number) => {
        const colors = [
            'bg-blue-100 text-blue-600',
            'bg-emerald-100 text-emerald-600',
            'bg-orange-100 text-orange-600',
            'bg-purple-100 text-purple-600',
            'bg-rose-100 text-rose-600',
        ];
        return colors[index % colors.length];
    };

    return (
        <PublicLayout>
            <Head title="Laporan Kinerja - SAKIP" />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 py-20 lg:py-28 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-72 h-72 bg-blue-400 rounded-full filter blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400 rounded-full filter blur-3xl"></div>
                </div>
                
                {/* Grid Pattern Overlay */}
                <div 
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }}
                ></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        {/* Icon */}
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl mb-8 shadow-xl shadow-blue-500/30">
                            <BarChart3 className="w-10 h-10 text-white" />
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                            Laporan Kinerja
                        </h1>
                        
                        <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                            Dokumen Laporan Akuntabilitas Kinerja Instansi Pemerintah (LAKIP) 
                            Balai Bahasa Provinsi Sulawesi Tenggara
                        </p>

                        {/* Breadcrumb */}
                        <nav className="flex justify-center items-center gap-2 text-sm text-blue-200">
                            <a href="/" className="hover:text-white transition-colors">Beranda</a>
                            <span className="text-blue-400">/</span>
                            <span className="text-blue-300">SAKIP</span>
                            <span className="text-blue-400">/</span>
                            <span className="text-white font-medium">Laporan Kinerja</span>
                        </nav>
                    </div>
                </div>

                {/* Bottom Wave */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                        <path d="M0 80L48 74.7C96 69 192 59 288 53.3C384 48 480 48 576 53.3C672 59 768 69 864 69.3C960 69 1056 59 1152 53.3C1248 48 1344 48 1392 48L1440 48V80H1392C1344 80 1248 80 1152 80C1056 80 960 80 864 80C768 80 672 80 576 80C480 80 384 80 288 80C192 80 96 80 48 80H0Z" fill="#f8fafc"/>
                    </svg>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-slate-50 py-8 border-b border-slate-200">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                                <FileText className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-800">{reports.length}</p>
                                <p className="text-sm text-slate-500">Total Laporan</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-800">
                                    {Math.min(...reports.map(r => r.year))} - {Math.max(...reports.map(r => r.year))}
                                </p>
                                <p className="text-sm text-slate-500">Periode Laporan</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-800">Tahunan</p>
                                <p className="text-sm text-slate-500">Frekuensi Pelaporan</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Reports Cards Section */}
            <section className="py-16 lg:py-24 bg-slate-50">
                <div className="container mx-auto px-4">
                    {/* Section Header */}
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                            Dokumen Laporan Kinerja
                        </h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            Unduh laporan kinerja tahunan untuk melihat capaian dan akuntabilitas 
                            Balai Bahasa Provinsi Sulawesi Tenggara
                        </p>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {sortedReports.map((report, index) => (
                            <div
                                key={report.id}
                                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
                            >
                                {/* Card Header with Gradient */}
                                <div className={`bg-gradient-to-br ${getGradientColor(index)} p-8 relative overflow-hidden`}>
                                    {/* Decorative circles */}
                                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full"></div>
                                    <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/10 rounded-full"></div>
                                    
                                    {/* Year Badge */}
                                    <div className="relative z-10">
                                        <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-4">
                                            Tahun {report.year}
                                        </span>
                                        <div className="flex items-center gap-3">
                                            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                                <FileText className="w-7 h-7 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-white/80 text-sm">LAKIP</p>
                                                <p className="text-white text-3xl font-bold">{report.year}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-6">
                                    <h3 className="text-lg font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">
                                        {report.title}
                                    </h3>
                                    <p className="text-slate-600 text-sm mb-6 line-clamp-2">
                                        {report.description}
                                    </p>

                                    {/* File Info */}
                                    <div className="flex items-center gap-2 mb-6 text-sm text-slate-500">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getIconBgColor(index)}`}>
                                            <FileText className="w-4 h-4" />
                                        </div>
                                        <span>Format PDF</span>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3">
                                        <a
                                            href={report.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r ${getGradientColor(index)} text-white rounded-xl font-medium hover:opacity-90 transition-opacity shadow-lg`}
                                        >
                                            <Download className="w-4 h-4" />
                                            Unduh
                                        </a>
                                        <a
                                            href={report.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center w-12 h-12 border-2 border-slate-200 rounded-xl hover:border-blue-500 hover:text-blue-500 transition-colors"
                                        >
                                            <ExternalLink className="w-5 h-5" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Info Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12 border border-blue-100">
                            <div className="flex flex-col md:flex-row items-start gap-6">
                                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                                    <BarChart3 className="w-8 h-8 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-3">
                                        Tentang Laporan Kinerja (LAKIP)
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed mb-4">
                                        Laporan Akuntabilitas Kinerja Instansi Pemerintah (LAKIP) merupakan 
                                        dokumen yang berisi pertanggungjawaban kinerja suatu instansi pemerintah 
                                        dalam mencapai tujuan/sasaran strategis instansi. LAKIP disusun dan 
                                        disampaikan kepada pihak-pihak yang berkepentingan setiap akhir tahun anggaran.
                                    </p>
                                    <ul className="text-slate-600 text-sm space-y-2">
                                        <li className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                            Memuat capaian kinerja organisasi
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                            Analisis dan evaluasi kinerja
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                            Rekomendasi perbaikan ke depan
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
