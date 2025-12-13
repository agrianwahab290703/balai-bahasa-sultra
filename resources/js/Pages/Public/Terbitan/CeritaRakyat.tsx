import { PublicLayout } from '@/Layouts/PublicLayout';
import { Head } from '@inertiajs/react';
import { BookOpen, Download, ExternalLink, AlertTriangle, Sparkles, ArrowRight, Scroll, MapPin, Users, Mountain } from 'lucide-react';

interface Folklore {
    id: number;
    title: string;
    region: string;
    description: string;
    driveLink: string;
    coverImage: string;
    color: string;
}

interface Props {
    folklores: Folklore[];
    disclaimer: string;
}

export default function CeritaRakyat({ folklores, disclaimer }: Props) {
    const getGradientColors = (color: string) => {
        const colors: Record<string, { from: string; to: string; light: string; text: string }> = {
            rose: { from: 'from-rose-600', to: 'to-pink-700', light: 'bg-rose-100', text: 'text-rose-600' },
            indigo: { from: 'from-indigo-600', to: 'to-purple-700', light: 'bg-indigo-100', text: 'text-indigo-600' },
            emerald: { from: 'from-emerald-600', to: 'to-teal-700', light: 'bg-emerald-100', text: 'text-emerald-600' },
            amber: { from: 'from-amber-600', to: 'to-orange-700', light: 'bg-amber-100', text: 'text-amber-600' },
        };
        return colors[color] || colors.indigo;
    };

    return (
        <PublicLayout>
            <Head title="Cerita Rakyat - Terbitan" />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 py-20 lg:py-28 overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-purple-400 rounded-full filter blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-400 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-400 rounded-full filter blur-3xl animate-pulse delay-500"></div>
                </div>
                
                {/* Mystical pattern overlay */}
                <div 
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }}
                ></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        {/* Icon */}
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl mb-8 shadow-xl shadow-purple-500/30">
                            <Scroll className="w-10 h-10 text-white" />
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                            Cerita Rakyat
                        </h1>
                        
                        <p className="text-lg md:text-xl text-purple-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                            Kumpulan cerita rakyat dari berbagai daerah di Sulawesi Tenggara yang kaya akan 
                            nilai-nilai budaya, kearifan lokal, dan warisan leluhur.
                        </p>

                        {/* Breadcrumb */}
                        <nav className="flex justify-center items-center gap-2 text-sm text-purple-200">
                            <a href="/" className="hover:text-white transition-colors">Beranda</a>
                            <span className="text-purple-400">/</span>
                            <span className="text-purple-300">Terbitan</span>
                            <span className="text-purple-400">/</span>
                            <span className="text-white font-medium">Cerita Rakyat</span>
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
                            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                                <BookOpen className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-800">{folklores.length}</p>
                                <p className="text-sm text-slate-500">Koleksi Cerita</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center">
                                <MapPin className="w-6 h-6 text-rose-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-800">{folklores.length}</p>
                                <p className="text-sm text-slate-500">Daerah Asal</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                                <Users className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-800">Gratis</p>
                                <p className="text-sm text-slate-500">Akses untuk Semua</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Folklore Cards Section */}
            <section className="py-16 lg:py-24 bg-slate-50">
                <div className="container mx-auto px-4">
                    {/* Section Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                            <Sparkles className="w-4 h-4" />
                            Koleksi Cerita Rakyat
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                            Warisan Budaya Sulawesi Tenggara
                        </h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            Unduh dan baca cerita rakyat dari berbagai daerah di Sulawesi Tenggara
                        </p>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {folklores.map((folklore) => {
                            const colors = getGradientColors(folklore.color);
                            return (
                                <div
                                    key={folklore.id}
                                    className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2"
                                >
                                    {/* Card Header with Gradient */}
                                    <div className={`bg-gradient-to-br ${colors.from} ${colors.to} p-8 relative overflow-hidden`}>
                                        {/* Decorative circles */}
                                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
                                        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full"></div>
                                        
                                        <div className="relative z-10 flex items-center gap-6">
                                            {/* Book Cover Image */}
                                            <div className="w-28 h-36 relative overflow-hidden rounded-xl shadow-lg">
                                                {folklore.coverImage ? (
                                                    <img 
                                                        src={folklore.coverImage} 
                                                        alt={folklore.title}
                                                        className="w-full h-full object-cover rounded-xl"
                                                        onError={(e) => {
                                                            // Fallback to icon if image fails to load
                                                            e.currentTarget.style.display = 'none';
                                                            const sibling = e.currentTarget.nextElementSibling as HTMLElement | null;
                                                            if (sibling) sibling.style.display = 'flex';
                                                        }}
                                                    />
                                                ) : null}
                                                <div className="w-full h-full bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center" style={{ display: folklore.coverImage ? 'none' : 'flex' }}>
                                                    <div className="text-center">
                                                        <Scroll className="w-12 h-12 text-white/90 mx-auto mb-2" />
                                                        <p className="text-white/80 text-xs font-medium">{folklore.region}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Title & Region */}
                                            <div className="flex-1">
                                                <div className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white/90 text-xs font-medium mb-3">
                                                    <MapPin className="w-3 h-3" />
                                                    {folklore.region}
                                                </div>
                                                <h3 className="text-2xl font-bold text-white mb-2">
                                                    {folklore.title}
                                                </h3>
                                                <div className="flex items-center gap-2 text-white/80 text-sm">
                                                    <Mountain className="w-4 h-4" />
                                                    <span>Sulawesi Tenggara</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-6">
                                        <p className="text-slate-600 mb-6 leading-relaxed">
                                            {folklore.description}
                                        </p>

                                        {/* Features */}
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {['Cerita Legendaris', 'Nilai Budaya', 'Kearifan Lokal'].map((tag, idx) => (
                                                <span 
                                                    key={idx} 
                                                    className={`${colors.light} ${colors.text} text-xs font-medium px-3 py-1 rounded-full`}
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-3">
                                            <a
                                                href={folklore.driveLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r ${colors.from} ${colors.to} text-white rounded-xl font-medium hover:opacity-90 transition-opacity shadow-lg`}
                                            >
                                                <Download className="w-4 h-4" />
                                                Unduh Buku
                                            </a>
                                            <a
                                                href={folklore.driveLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center justify-center w-12 h-12 border-2 border-slate-200 rounded-xl hover:border-purple-500 hover:text-purple-500 transition-colors"
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

            {/* About Folklore Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl p-8 md:p-12 border border-purple-100">
                            <div className="flex flex-col md:flex-row items-start gap-6">
                                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                                    <Scroll className="w-8 h-8 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-3">
                                        Tentang Cerita Rakyat Sulawesi Tenggara
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed mb-4">
                                        Cerita rakyat merupakan warisan budaya tak benda yang diturunkan secara 
                                        lisan dari generasi ke generasi. Buku-buku cerita rakyat ini merupakan 
                                        hasil pendokumentasian yang dilakukan oleh Balai Bahasa Provinsi Sulawesi 
                                        Tenggara sebagai upaya pelestarian budaya daerah.
                                    </p>
                                    <ul className="text-slate-600 text-sm space-y-2">
                                        <li className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                                            Mengandung nilai-nilai moral dan pendidikan karakter
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                                            Melestarikan bahasa dan sastra daerah
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                                            Mengenalkan kearifan lokal kepada generasi muda
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
            <section className="py-16 bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.2) 1px, transparent 0)', backgroundSize: '40px 40px'}}></div>
                </div>
                
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                        Jelajahi Lebih Banyak Terbitan
                    </h3>
                    <p className="text-purple-200 mb-8 max-w-xl mx-auto">
                        Temukan koleksi majalah, kamus, dan karya sastra lainnya dari Balai Bahasa Sulawesi Tenggara
                    </p>
                    <a
                        href="/terbitan/majalah/pabitara"
                        className="inline-flex items-center gap-3 bg-white text-purple-900 px-8 py-4 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-300"
                    >
                        Lihat Koleksi Majalah
                        <ArrowRight className="w-5 h-5" />
                    </a>
                </div>
            </section>
        </PublicLayout>
    );
}
