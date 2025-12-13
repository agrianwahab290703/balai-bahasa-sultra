import { PublicLayout } from '@/Layouts/PublicLayout';
import { Head } from '@inertiajs/react';
import { BookOpen, Download, ExternalLink, AlertTriangle, Sparkles, ArrowRight, FileText, Calendar, Tag, Feather, BookMarked, Globe } from 'lucide-react';

interface Research {
    id: number;
    title: string;
    shortTitle: string;
    year: string;
    category: string;
    description: string;
    driveLink: string;
    coverImage: string;
    color: string;
}

interface Props {
    researches: Research[];
    disclaimer: string;
}

export default function Sastra({ researches, disclaimer }: Props) {
    const getGradientColors = (color: string) => {
        const colors: Record<string, { from: string; to: string; light: string; text: string; border: string }> = {
            rose: { from: 'from-rose-600', to: 'to-pink-700', light: 'bg-rose-100', text: 'text-rose-600', border: 'border-rose-200' },
            amber: { from: 'from-amber-600', to: 'to-orange-700', light: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-200' },
            indigo: { from: 'from-indigo-600', to: 'to-purple-700', light: 'bg-indigo-100', text: 'text-indigo-600', border: 'border-indigo-200' },
            emerald: { from: 'from-emerald-600', to: 'to-teal-700', light: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-200' },
            violet: { from: 'from-violet-600', to: 'to-purple-700', light: 'bg-violet-100', text: 'text-violet-600', border: 'border-violet-200' },
            blue: { from: 'from-blue-600', to: 'to-cyan-700', light: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
        };
        return colors[color] || colors.rose;
    };

    return (
        <PublicLayout>
            <Head title="Hasil Penelitian Sastra - Terbitan" />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-rose-900 via-pink-900 to-slate-900 py-20 lg:py-28 overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-rose-400 rounded-full filter blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-400 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-amber-400 rounded-full filter blur-3xl animate-pulse delay-500"></div>
                </div>
                
                {/* Pattern overlay */}
                <div 
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }}
                ></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        {/* Icon */}
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-rose-400 to-pink-500 rounded-2xl mb-8 shadow-xl shadow-rose-500/30">
                            <Feather className="w-10 h-10 text-white" />
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                            Hasil Penelitian Sastra
                        </h1>
                        
                        <p className="text-lg md:text-xl text-rose-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                            Kumpulan hasil penelitian kesastraan dari Balai Bahasa Provinsi Sulawesi Tenggara 
                            yang mengkaji berbagai aspek sastra lisan dan tulisan di daerah.
                        </p>

                        {/* Breadcrumb */}
                        <nav className="flex justify-center items-center gap-2 text-sm text-rose-200 flex-wrap">
                            <a href="/" className="hover:text-white transition-colors">Beranda</a>
                            <span className="text-rose-400">/</span>
                            <span className="text-rose-300">Terbitan</span>
                            <span className="text-rose-400">/</span>
                            <span className="text-rose-300">Hasil Penelitian</span>
                            <span className="text-rose-400">/</span>
                            <span className="text-white font-medium">Sastra</span>
                        </nav>
                    </div>
                </div>

                {/* Bottom Wave */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                        <path d="M0 80L48 74.7C96 69 192 59 288 53.3C384 48 480 48 576 53.3C672 59 768 69 864 69.3C960 69 1056 59 1152 53.3C1248 48 1344 48 1392 48L1440 48V80H0Z" fill="#f8fafc"/>
                    </svg>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-slate-50 py-8 border-b border-slate-200">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center">
                                <FileText className="w-6 h-6 text-rose-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-800">{researches.length}</p>
                                <p className="text-sm text-slate-500">Hasil Penelitian</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center">
                                <Globe className="w-6 h-6 text-pink-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-800">Sastra</p>
                                <p className="text-sm text-slate-500">Bidang Kajian</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                                <BookMarked className="w-6 h-6 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-800">Gratis</p>
                                <p className="text-sm text-slate-500">Akses untuk Semua</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Research Cards Section */}
            <section className="py-16 lg:py-24 bg-slate-50">
                <div className="container mx-auto px-4">
                    {/* Section Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                            <Sparkles className="w-4 h-4" />
                            Koleksi Penelitian Sastra
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                            Publikasi Ilmiah Kesastraan
                        </h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            Unduh dan baca hasil penelitian tentang sastra lisan dan sastra daerah di Sulawesi Tenggara
                        </p>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
                        {researches.map((research) => {
                            const colors = getGradientColors(research.color);
                            return (
                                <div
                                    key={research.id}
                                    className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2"
                                >
                                    {/* Card Header with Gradient */}
                                    <div className={`bg-gradient-to-br ${colors.from} ${colors.to} p-6 relative overflow-hidden`}>
                                        {/* Decorative circles */}
                                        <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full"></div>
                                        <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/10 rounded-full"></div>
                                        
                                        <div className="relative z-10">
                                            {/* Category Badge */}
                                            <div className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white/90 text-xs font-medium mb-4">
                                                <Tag className="w-3 h-3" />
                                                {research.category}
                                            </div>
                                            
                                            {/* Visual */}
                                            <div className="flex items-center gap-4">
                                                <div className="w-20 h-24 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                                    <Feather className="w-10 h-10 text-white/90" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                                                        {research.shortTitle}
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-white/80 text-sm">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>Tahun {research.year}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-6">
                                        <p className="text-slate-600 mb-6 leading-relaxed text-sm line-clamp-3">
                                            {research.description}
                                        </p>

                                        {/* Full Title */}
                                        <div className={`${colors.light} ${colors.border} border rounded-xl p-3 mb-6`}>
                                            <p className={`text-xs font-medium ${colors.text} line-clamp-3`}>
                                                {research.title}
                                            </p>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-3">
                                            <a
                                                href={research.driveLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r ${colors.from} ${colors.to} text-white rounded-xl font-medium hover:opacity-90 transition-opacity shadow-lg text-sm`}
                                            >
                                                <Download className="w-4 h-4" />
                                                Unduh
                                            </a>
                                            <a
                                                href={research.driveLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center justify-center w-12 h-12 border-2 border-slate-200 rounded-xl hover:border-rose-500 hover:text-rose-500 transition-colors"
                                            >
                                                <ExternalLink className="w-5 h-5" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-3xl p-8 md:p-12 border border-rose-100">
                            <div className="flex flex-col md:flex-row items-start gap-6">
                                <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                                    <Feather className="w-8 h-8 text-rose-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-3">
                                        Tentang Penelitian Sastra
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed mb-4">
                                        Penelitian sastra merupakan kegiatan ilmiah yang dilakukan oleh Balai Bahasa 
                                        Provinsi Sulawesi Tenggara untuk mengkaji dan mendokumentasikan berbagai bentuk 
                                        sastra daerah, baik sastra lisan maupun sastra tulisan yang berkembang di masyarakat 
                                        Sulawesi Tenggara.
                                    </p>
                                    <ul className="text-slate-600 text-sm space-y-2">
                                        <li className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                                            Mendokumentasikan sastra lisan dari berbagai etnis
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                                            Mengkaji vitalitas sastra daerah
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                                            Memetakan sastra di wilayah Sulawesi Tenggara
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Disclaimer Section */}
            <section className="py-12 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 md:p-8 flex items-start gap-4">
                            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <AlertTriangle className="w-6 h-6 text-amber-600" />
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-amber-800 mb-2">Perhatian</h4>
                                <p className="text-amber-700 leading-relaxed">
                                    {disclaimer}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-br from-rose-900 via-pink-900 to-slate-900 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.2) 1px, transparent 0)', backgroundSize: '40px 40px'}}></div>
                </div>
                
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                        Jelajahi Penelitian Bahasa
                    </h3>
                    <p className="text-rose-200 mb-8 max-w-xl mx-auto">
                        Temukan juga koleksi hasil penelitian bahasa dari Balai Bahasa Sulawesi Tenggara
                    </p>
                    <a
                        href="/terbitan/hasil-penelitian/bahasa"
                        className="inline-flex items-center gap-3 bg-white text-rose-900 px-8 py-4 rounded-xl font-semibold hover:bg-rose-50 transition-all duration-300"
                    >
                        Lihat Penelitian Bahasa
                        <ArrowRight className="w-5 h-5" />
                    </a>
                </div>
            </section>
        </PublicLayout>
    );
}
