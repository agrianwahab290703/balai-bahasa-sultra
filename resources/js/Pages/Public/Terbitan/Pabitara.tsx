import { PublicLayout } from '@/Layouts/PublicLayout';
import { Head } from '@inertiajs/react';
import { BookOpen, Download, ExternalLink, AlertTriangle, Sparkles, ArrowRight, BookMarked, Languages } from 'lucide-react';

interface Magazine {
    title: string;
    subtitle: string;
    description: string;
    driveLink: string;
    coverImage: string | null;
    disclaimer: string;
    color: string;
}

interface Props {
    magazine: Magazine;
}

export default function Pabitara({ magazine }: Props) {
    return (
        <PublicLayout>
            <Head title={`${magazine.title} - Majalah`} />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 py-20 lg:py-32 overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400 rounded-full filter blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-400 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
                </div>
                
                {/* Book pattern overlay */}
                <div 
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 10L35 20H25L30 10zM30 50L25 40H35L30 50z' fill='%23ffffff' fill-opacity='0.4'/%3E%3C/svg%3E")`
                    }}
                ></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-5xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            {/* Content */}
                            <div className="text-center lg:text-left">
                                <div className="inline-flex items-center gap-2 bg-blue-500/20 backdrop-blur-sm text-blue-200 px-4 py-2 rounded-full text-sm font-medium mb-6">
                                    <BookMarked className="w-4 h-4" />
                                    Terbitan Majalah
                                </div>
                                
                                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-tight">
                                    {magazine.title}
                                </h1>
                                
                                <p className="text-xl md:text-2xl text-blue-200 mb-6 font-light">
                                    {magazine.subtitle}
                                </p>
                                
                                <p className="text-blue-100/80 text-lg leading-relaxed mb-8 max-w-xl">
                                    {magazine.description}
                                </p>

                                {/* CTA Buttons */}
                                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                                    <a
                                        href={magazine.driveLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-3 bg-white text-blue-900 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-blue-50 transition-all duration-300 shadow-xl shadow-blue-900/30 hover:shadow-2xl hover:-translate-y-1"
                                    >
                                        <Download className="w-5 h-5" />
                                        Unduh Majalah
                                    </a>
                                    <a
                                        href={magazine.driveLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-3 bg-blue-600/30 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-blue-600/50 transition-all duration-300 border border-blue-400/30"
                                    >
                                        <ExternalLink className="w-5 h-5" />
                                        Lihat di Google Drive
                                    </a>
                                </div>
                            </div>

                            {/* Magazine Visual */}
                            <div className="hidden lg:flex justify-center">
                                <div className="relative">
                                    {/* Decorative book stack */}
                                    <div className="absolute -bottom-6 -left-6 w-64 h-80 bg-blue-700/50 rounded-2xl transform rotate-6"></div>
                                    <div className="absolute -bottom-3 -left-3 w-64 h-80 bg-blue-600/50 rounded-2xl transform rotate-3"></div>
                                    
                                    {/* Main book cover */}
                                    <div className="relative w-64 h-80 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-2xl overflow-hidden transform hover:rotate-0 transition-transform duration-500">
                                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                                            <BookOpen className="w-20 h-20 text-white/80 mb-4" />
                                            <h3 className="text-3xl font-bold text-white mb-2">{magazine.title}</h3>
                                            <p className="text-blue-100 text-sm">Balai Bahasa</p>
                                            <p className="text-blue-100 text-sm">Sulawesi Tenggara</p>
                                        </div>
                                        {/* Shine effect */}
                                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Wave */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                        <path d="M0 80L48 74.7C96 69 192 59 288 53.3C384 48 480 48 576 53.3C672 59 768 69 864 69.3C960 69 1056 59 1152 53.3C1248 48 1344 48 1392 48L1440 48V80H0Z" fill="#f8fafc"/>
                    </svg>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 lg:py-24 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        {/* Section Header */}
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                                <Sparkles className="w-4 h-4" />
                                Tentang Majalah
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                                Majalah Kebahasaan & Kesastraan
                            </h2>
                            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                                Koleksi lengkap majalah {magazine.title} yang berisi artikel-artikel menarik tentang kebahasaan dan kesastraan Indonesia.
                            </p>
                        </div>

                        {/* Features Grid */}
                        <div className="grid md:grid-cols-3 gap-6 mb-12">
                            {[
                                {
                                    icon: BookOpen,
                                    title: 'Artikel Berkualitas',
                                    description: 'Berisi artikel-artikel pilihan tentang bahasa dan sastra Indonesia',
                                    color: 'blue'
                                },
                                {
                                    icon: Languages,
                                    title: 'Kajian Bahasa',
                                    description: 'Membahas berbagai aspek kebahasaan Indonesia dan daerah',
                                    color: 'indigo'
                                },
                                {
                                    icon: BookMarked,
                                    title: 'Karya Sastra',
                                    description: 'Memuat karya-karya sastra dari berbagai penulis daerah',
                                    color: 'purple'
                                }
                            ].map((feature, index) => (
                                <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                                    <div className={`w-14 h-14 rounded-xl bg-${feature.color}-100 flex items-center justify-center mb-4`}>
                                        <feature.icon className={`w-7 h-7 text-${feature.color}-600`} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-800 mb-2">{feature.title}</h3>
                                    <p className="text-slate-600 text-sm">{feature.description}</p>
                                </div>
                            ))}
                        </div>

                        {/* Download Card */}
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-12 text-center shadow-2xl">
                            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Download className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                                Unduh Koleksi Lengkap
                            </h3>
                            <p className="text-blue-100 mb-8 max-w-lg mx-auto">
                                Akses seluruh edisi majalah {magazine.title} secara gratis melalui Google Drive kami.
                            </p>
                            <a
                                href={magazine.driveLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 bg-white text-blue-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all duration-300"
                            >
                                Buka Google Drive
                                <ArrowRight className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Disclaimer Section */}
            <section className="py-12 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 md:p-8 flex items-start gap-4">
                            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <AlertTriangle className="w-6 h-6 text-amber-600" />
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-amber-800 mb-2">Perhatian</h4>
                                <p className="text-amber-700 leading-relaxed">
                                    {magazine.disclaimer}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Breadcrumb Navigation */}
            <section className="py-8 bg-slate-100 border-t border-slate-200">
                <div className="container mx-auto px-4">
                    <nav className="flex items-center gap-2 text-sm text-slate-600">
                        <a href="/" className="hover:text-blue-600 transition-colors">Beranda</a>
                        <span className="text-slate-400">/</span>
                        <span className="text-slate-400">Terbitan</span>
                        <span className="text-slate-400">/</span>
                        <span className="text-slate-400">Majalah</span>
                        <span className="text-slate-400">/</span>
                        <span className="text-slate-900 font-medium">{magazine.title}</span>
                    </nav>
                </div>
            </section>
        </PublicLayout>
    );
}
