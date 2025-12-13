import { PublicLayout } from '@/Layouts/PublicLayout';
import { Head, Link, router } from '@inertiajs/react';
import { BookOpen, Download, ExternalLink, AlertTriangle, Sparkles, ArrowRight, BookMarked, Book } from 'lucide-react';

interface MagazineItem {
    title: string;
    subtitle: string;
    description: string;
    driveLink: string;
    coverImage: string | null;
    disclaimer: string;
    color: string;
    route: string;
}

interface Props {
    magazines: MagazineItem[];
    disclaimer: string;
}

// Color mapping untuk Tailwind (dynamic classes tidak di-support)
const colorGradients: Record<string, string> = {
    blue: 'from-blue-500 to-blue-700',
    emerald: 'from-emerald-500 to-emerald-700',
    amber: 'from-amber-500 to-amber-700',
    purple: 'from-purple-500 to-purple-700',
    indigo: 'from-indigo-500 to-indigo-700',
    rose: 'from-rose-500 to-rose-700',
};

export default function Majalah({ magazines, disclaimer }: Props) {
    return (
        <PublicLayout>
            <Head title="Majalah - Terbitan" />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900 py-20 lg:py-32 overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-purple-400 rounded-full filter blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-400 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
                </div>
                
                {/* Magazine pattern overlay */}
                <div 
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='5' y='5' width='50' height='50' rx='5' stroke='%23ffffff' stroke-width='2' fill-opacity='0'/%3E%3C/svg%3E")`
                    }}
                ></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 bg-purple-500/20 backdrop-blur-sm text-purple-200 px-4 py-2 rounded-full text-sm font-medium mb-6">
                            <Book className="w-4 h-4" />
                            Koleksi Majalah
                        </div>
                        
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-tight">
                            Majalah
                        </h1>
                        
                        <p className="text-xl md:text-2xl text-purple-200 mb-6 font-light">
                            Koleksi Majalah Balai Bahasa Provinsi Sulawesi Tenggara
                        </p>
                        
                        <p className="text-purple-100/80 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
                            Jelajahi berbagai majalah terbitan kami yang memuat artikel menarik tentang kebahasaan, kesastraan, dan budaya Sulawesi Tenggara.
                        </p>
                    </div>
                </div>

                {/* Wave */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                        <path d="M0 80L48 74.7C96 69 192 59 288 53.3C384 48 480 48 576 53.3C672 59 768 69 864 69.3C960 69 1056 59 1152 53.3C1248 48 1344 48 1392 48L1440 48V80H0Z" fill="#f8fafc"/>
                    </svg>
                </div>
            </section>

            {/* Magazines Grid Section */}
            <section className="py-16 lg:py-24 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        {/* Section Header */}
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                                <Sparkles className="w-4 h-4" />
                                Pilih Majalah
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                                Koleksi Majalah Kami
                            </h2>
                            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                                Pilih majalah yang ingin Anda jelajahi dari koleksi terbitan Balai Bahasa Provinsi Sulawesi Tenggara.
                            </p>
                        </div>

                        {/* Magazines Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                            {magazines.map((magazine, index) => (
                                <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                                    {/* Magazine Cover */}
                                    <div className={`h-48 bg-gradient-to-br from-${magazine.color}-500 to-${magazine.color}-700 relative overflow-hidden`}>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                                            <BookOpen className="w-16 h-16 text-white/80 mb-3" />
                                            <h3 className="text-2xl font-bold text-white">{magazine.title}</h3>
                                        </div>
                                        {/* Shine effect */}
                                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </div>
                                    
                                    {/* Magazine Content */}
                                    <div className="p-6">
                                        <h4 className="text-lg font-semibold text-slate-800 mb-2">{magazine.subtitle}</h4>
                                        <p className="text-slate-600 text-sm mb-4 line-clamp-2">{magazine.description}</p>
                                        
                                        {/* Action Buttons */}
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => router.visit(magazine.route)}
                                                className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl font-medium hover:bg-slate-800 transition-colors"
                                            >
                                                <BookOpen className="w-4 h-4" />
                                                Baca
                                            </button>
                                            <a
                                                href={magazine.driveLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-xl font-medium hover:bg-slate-200 transition-colors"
                                            >
                                                <Download className="w-4 h-4" />
                                                Unduh
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Features Section */}
                        <div className="grid md:grid-cols-3 gap-6 mb-12">
                            {[
                                {
                                    icon: BookOpen,
                                    title: 'Artikel Berkualitas',
                                    description: 'Berisi artikel-artikel pilihan tentang bahasa dan sastra Indonesia',
                                    color: 'blue'
                                },
                                {
                                    icon: BookMarked,
                                    title: 'Kajian Bahasa',
                                    description: 'Membahas berbagai aspek kebahasaan Indonesia dan daerah',
                                    color: 'indigo'
                                },
                                {
                                    icon: Book,
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
                                    {disclaimer}
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
                        <span className="text-slate-900 font-medium">Majalah</span>
                    </nav>
                </div>
            </section>
        </PublicLayout>
    );
}