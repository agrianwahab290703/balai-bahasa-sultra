 import { PublicLayout } from '@/Layouts/PublicLayout';
 import { Head } from '@inertiajs/react';
 import { BookOpen, Download, ExternalLink, AlertTriangle, Sparkles, Search, Languages, Globe } from 'lucide-react';
 import { useState, useCallback } from 'react';
 
 interface Dictionary {
     id: number;
     title: string;
     shortTitle: string;
     category: 'bahasa' | 'budaya';
     description: string;
     driveLink: string;
     coverImage: string;
     color: string;
 }
 
 interface Props {
     dictionaries: Dictionary[];
     disclaimer: string;
 }
 
 export default function Kamus({ dictionaries, disclaimer }: Props) {
     const [activeFilter, setActiveFilter] = useState<'all' | 'bahasa' | 'budaya'>('all');
     const [searchQuery, setSearchQuery] = useState('');
     const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
 
     // Handle image load error - fallback to icon
     const handleImageError = useCallback((dictionaryId: number) => {
         setFailedImages(prev => new Set(prev).add(dictionaryId));
     }, []);
 
     const getGradientColors = (color: string) => {
         const colors: Record<string, { from: string; to: string; light: string; text: string; border: string }> = {
             blue: { from: 'from-blue-600', to: 'to-cyan-600', light: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
             emerald: { from: 'from-emerald-600', to: 'to-teal-600', light: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-200' },
             violet: { from: 'from-violet-600', to: 'to-purple-600', light: 'bg-violet-100', text: 'text-violet-600', border: 'border-violet-200' },
             amber: { from: 'from-amber-600', to: 'to-orange-600', light: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-200' },
             rose: { from: 'from-rose-600', to: 'to-pink-600', light: 'bg-rose-100', text: 'text-rose-600', border: 'border-rose-200' },
             indigo: { from: 'from-indigo-600', to: 'to-blue-600', light: 'bg-indigo-100', text: 'text-indigo-600', border: 'border-indigo-200' },
             cyan: { from: 'from-cyan-600', to: 'to-teal-600', light: 'bg-cyan-100', text: 'text-cyan-600', border: 'border-cyan-200' },
             orange: { from: 'from-orange-600', to: 'to-red-500', light: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200' },
             teal: { from: 'from-teal-600', to: 'to-emerald-600', light: 'bg-teal-100', text: 'text-teal-600', border: 'border-teal-200' },
             purple: { from: 'from-purple-600', to: 'to-fuchsia-600', light: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
         };
         return colors[color] || colors.blue;
     };
 
     const filteredDictionaries = dictionaries.filter((dict) => {
         const matchesFilter = activeFilter === 'all' || dict.category === activeFilter;
         const matchesSearch = dict.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             dict.shortTitle.toLowerCase().includes(searchQuery.toLowerCase());
         return matchesFilter && matchesSearch;
     });
 
     const bahasaCount = dictionaries.filter(d => d.category === 'bahasa').length;
     const budayaCount = dictionaries.filter(d => d.category === 'budaya').length;
 
     return (
         <PublicLayout>
             <Head title="Kamus - Terbitan" />
 
             {/* Hero Section */}
             <section className="relative bg-gradient-to-br from-teal-900 via-cyan-800 to-blue-900 py-20 lg:py-28 overflow-hidden">
                 {/* Decorative elements */}
                 <div className="absolute inset-0 opacity-20">
                     <div className="absolute top-10 left-10 w-72 h-72 bg-teal-400 rounded-full filter blur-3xl animate-pulse"></div>
                     <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-400 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
                     <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-400 rounded-full filter blur-3xl animate-pulse delay-500"></div>
                 </div>
                 
                 {/* Pattern overlay */}
                 <div 
                     className="absolute inset-0 opacity-5"
                     style={{
                         backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zm20.97 0l9.315 9.314-1.414 1.414L34.828 0h2.83zM22.344 0L13.03 9.314l1.414 1.414L25.172 0h-2.83zM32 0l12.142 12.142-1.414 1.414L30 .828 17.272 13.556l-1.414-1.414L28 0h4zM.284 0l28 28-1.414 1.414L0 2.544V0h.284zM0 5.373l25.456 25.455-1.414 1.414L0 8.2V5.374zm0 5.656l22.627 22.627-1.414 1.414L0 13.86v-2.83zm0 5.656l19.799 19.8-1.415 1.413L0 19.514v-2.83zm0 5.657l16.97 16.97-1.414 1.415L0 25.172v-2.83zM0 28l14.142 14.142-1.414 1.414L0 30.828V28zm0 5.657L11.314 44.97 9.9 46.386l-9.9-9.9v-2.828zm0 5.657L8.485 47.8 7.07 49.212 0 42.143v-2.83zm0 5.657l5.657 5.657-1.414 1.415L0 47.8v-2.83zm0 5.657l2.828 2.83-1.414 1.413L0 53.456v-2.83zM54.627 60L30 35.373 5.373 60H8.2L30 38.2 51.8 60h2.827zm-5.656 0L30 41.03 11.03 60h2.828L30 43.858 46.142 60h2.83zm-5.656 0L30 46.686 16.686 60h2.83L30 49.515 40.485 60h2.83zm-5.657 0L30 52.343 22.344 60h2.83L30 55.172 34.828 60h2.83zM32 60l-2-2-2 2h4zM59.716 0l-28 28 1.414 1.414L60 2.544V0h-.284zM60 5.373L34.544 30.828l1.414 1.414L60 8.2V5.374zm0 5.656L37.373 33.656l1.414 1.414L60 13.86v-2.83zm0 5.656l-19.8 19.8 1.415 1.413L60 19.514v-2.83zm0 5.657l-16.97 16.97 1.414 1.415L60 25.172v-2.83zM60 28L45.858 42.142l1.414 1.414L60 30.828V28zm0 5.657L48.686 44.97l1.415 1.415 9.9-9.9v-2.828zm0 5.657L51.515 47.8l1.414 1.413 7.07-7.07v-2.83zm0 5.657l-5.657 5.657 1.414 1.415L60 47.8v-2.83zm0 5.657l-2.828 2.83 1.414 1.413L60 53.456v-2.83zM39.9 16.385l1.414-1.414L30 3.658 18.686 14.97l1.415 1.415 9.9-9.9 9.9 9.9zm-2.83 2.828l1.415-1.414L30 9.313 21.515 17.8l1.414 1.413L30 12.142l7.07 7.07zm-2.827 2.83l1.414-1.415L30 14.97l-5.657 5.657 1.414 1.415L30 17.8l4.243 4.242zm-2.83 2.827l1.415-1.414L30 20.626l-2.828 2.83 1.414 1.414L30 23.456l1.414 1.414zM56.87 59.414L58.284 58 30 29.716 1.716 58l1.414 1.414L30 32.544l26.87 26.87z' fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`
                     }}
                 ></div>
 
                 <div className="container mx-auto px-4 relative z-10">
                     <div className="text-center max-w-4xl mx-auto">
                         {/* Icon */}
                         <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl mb-8 shadow-xl shadow-teal-500/30">
                             <Languages className="w-10 h-10 text-white" />
                         </div>
 
                         <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                             Terbitan Kamus
                         </h1>
                         
                         <p className="text-lg md:text-xl text-teal-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                             Koleksi kamus bahasa daerah dan kamus budaya Sulawesi Tenggara sebagai upaya 
                             pelestarian dan dokumentasi kekayaan linguistik daerah.
                         </p>
 
                         {/* Breadcrumb */}
                         <nav className="flex justify-center items-center gap-2 text-sm text-teal-200">
                             <a href="/" className="hover:text-white transition-colors">Beranda</a>
                             <span className="text-teal-400">/</span>
                             <span className="text-teal-300">Terbitan</span>
                             <span className="text-teal-400">/</span>
                             <span className="text-white font-medium">Kamus</span>
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
                             <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center">
                                 <BookOpen className="w-6 h-6 text-teal-600" />
                             </div>
                             <div>
                                 <p className="text-2xl font-bold text-slate-800">{dictionaries.length}</p>
                                 <p className="text-sm text-slate-500">Total Kamus</p>
                             </div>
                         </div>
                         <div className="flex items-center gap-3">
                             <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                                 <Languages className="w-6 h-6 text-blue-600" />
                             </div>
                             <div>
                                 <p className="text-2xl font-bold text-slate-800">{bahasaCount}</p>
                                 <p className="text-sm text-slate-500">Kamus Bahasa</p>
                             </div>
                         </div>
                         <div className="flex items-center gap-3">
                             <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                                 <Globe className="w-6 h-6 text-amber-600" />
                             </div>
                             <div>
                                 <p className="text-2xl font-bold text-slate-800">{budayaCount}</p>
                                 <p className="text-sm text-slate-500">Kamus Budaya</p>
                             </div>
                         </div>
                     </div>
                 </div>
             </section>
 
             {/* Filter & Search Section */}
             <section className="bg-slate-50 py-8">
                 <div className="container mx-auto px-4">
                     <div className="max-w-4xl mx-auto">
                         {/* Search Bar */}
                         <div className="relative mb-6">
                             <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                             <input
                                 type="text"
                                 placeholder="Cari kamus berdasarkan judul..."
                                 value={searchQuery}
                                 onChange={(e) => setSearchQuery(e.target.value)}
                                 className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                             />
                         </div>
 
                         {/* Filter Tabs */}
                         <div className="flex flex-wrap justify-center gap-3">
                             {[
                                 { key: 'all', label: 'Semua Kamus', count: dictionaries.length },
                                 { key: 'bahasa', label: 'Kamus Bahasa', count: bahasaCount },
                                 { key: 'budaya', label: 'Kamus Budaya', count: budayaCount },
                             ].map((filter) => (
                                 <button
                                     key={filter.key}
                                     onClick={() => setActiveFilter(filter.key as 'all' | 'bahasa' | 'budaya')}
                                     className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                                         activeFilter === filter.key
                                             ? 'bg-teal-600 text-white shadow-lg shadow-teal-200'
                                             : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                                     }`}
                                 >
                                     {filter.label} ({filter.count})
                                 </button>
                             ))}
                         </div>
                     </div>
                 </div>
             </section>
 
             {/* Dictionary Cards Grid */}
             <section className="py-12 lg:py-20 bg-slate-50">
                 <div className="container mx-auto px-4">
                     {/* Section Header */}
                     <div className="text-center mb-12">
                         <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                             <Sparkles className="w-4 h-4" />
                             Koleksi Kamus
                         </div>
                         <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                             Kamus Bahasa & Budaya Daerah
                         </h2>
                         <p className="text-slate-600 max-w-2xl mx-auto">
                             Unduh dan pelajari kamus bahasa daerah serta kamus budaya Sulawesi Tenggara
                         </p>
                     </div>
 
                     {/* Cards Grid */}
                     {filteredDictionaries.length > 0 ? (
                         <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
                             {filteredDictionaries.map((dictionary) => {
                                 const colors = getGradientColors(dictionary.color);
                                 return (
                                     <div
                                         key={dictionary.id}
                                         className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
                                     >
                                         {/* Card Header with Book Cover */}
                                         <div className={`bg-gradient-to-br ${colors.from} ${colors.to} p-6 relative overflow-hidden`}>
                                             {/* Decorative circles */}
                                             <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/10 rounded-full"></div>
                                             <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-white/10 rounded-full"></div>
                                             
                                             <div className="relative z-10 flex flex-col items-center">
                                                 {/* Book Cover Image */}
                                                 <div className="w-24 h-32 bg-white/20 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg mb-3 group-hover:scale-105 transition-transform">
                                                     {dictionary.coverImage && !failedImages.has(dictionary.id) ? (
                                                         <img
                                                             src={dictionary.coverImage}
                                                             alt={`Cover ${dictionary.shortTitle}`}
                                                             className="w-full h-full object-cover"
                                                             onError={() => handleImageError(dictionary.id)}
                                                             loading="lazy"
                                                         />
                                                     ) : (
                                                         <div className="w-full h-full flex items-center justify-center">
                                                             <BookOpen className="w-10 h-10 text-white/90" />
                                                         </div>
                                                     )}
                                                 </div>
                                                 
                                                 {/* Category Badge */}
                                                 <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white/90 text-xs font-medium">
                                                     {dictionary.category === 'bahasa' ? (
                                                         <><Languages className="w-3 h-3" /> Kamus Bahasa</>
                                                     ) : (
                                                         <><Globe className="w-3 h-3" /> Kamus Budaya</>
                                                     )}
                                                 </span>
                                             </div>
                                         </div>
 
                                         {/* Card Body */}
                                         <div className="p-5">
                                             <h3 className="text-base font-semibold text-slate-800 mb-2 line-clamp-2 min-h-[48px]">
                                                 {dictionary.shortTitle}
                                             </h3>
                                             <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                                                 {dictionary.description}
                                             </p>
 
                                             {/* Action Buttons */}
                                             <div className="flex gap-2">
                                                 <a
                                                     href={dictionary.driveLink}
                                                     target="_blank"
                                                     rel="noopener noreferrer"
                                                     className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r ${colors.from} ${colors.to} text-white rounded-lg font-medium text-sm hover:opacity-90 transition-opacity shadow-md`}
                                                 >
                                                     <Download className="w-4 h-4" />
                                                     Unduh
                                                 </a>
                                                 <a
                                                     href={dictionary.driveLink}
                                                     target="_blank"
                                                     rel="noopener noreferrer"
                                                     className="inline-flex items-center justify-center w-10 h-10 border border-slate-200 rounded-lg hover:border-teal-500 hover:text-teal-500 transition-colors"
                                                 >
                                                     <ExternalLink className="w-4 h-4" />
                                                 </a>
                                             </div>
                                         </div>
                                     </div>
                                 );
                             })}
                         </div>
                     ) : (
                         <div className="text-center py-16">
                             <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                 <Search className="w-8 h-8 text-slate-400" />
                             </div>
                             <h3 className="text-lg font-semibold text-slate-800 mb-2">Tidak ada hasil</h3>
                             <p className="text-slate-500">Coba ubah kata kunci pencarian atau filter</p>
                         </div>
                     )}
                 </div>
             </section>
 
             {/* About Section */}
             <section className="py-16 bg-white">
                 <div className="container mx-auto px-4">
                     <div className="max-w-4xl mx-auto">
                         <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-3xl p-8 md:p-12 border border-teal-100">
                             <div className="flex flex-col md:flex-row items-start gap-6">
                                 <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                                     <Languages className="w-8 h-8 text-teal-600" />
                                 </div>
                                 <div>
                                     <h3 className="text-xl font-bold text-slate-800 mb-3">
                                         Tentang Terbitan Kamus
                                     </h3>
                                     <p className="text-slate-600 leading-relaxed mb-4">
                                         Kamus-kamus yang diterbitkan oleh Balai Bahasa Provinsi Sulawesi Tenggara 
                                         merupakan hasil penelitian dan pendokumentasian bahasa-bahasa daerah serta 
                                         budaya lokal. Terbitan ini bertujuan untuk melestarikan kekayaan linguistik 
                                         dan budaya Sulawesi Tenggara.
                                     </p>
                                     <ul className="text-slate-600 text-sm space-y-2">
                                         <li className="flex items-center gap-2">
                                             <span className="w-1.5 h-1.5 bg-teal-500 rounded-full"></span>
                                             Kamus bahasa daerah: Tolaki, Muna, Kulisusu, Cia-Cia, Wakatobi, dll
                                         </li>
                                         <li className="flex items-center gap-2">
                                             <span className="w-1.5 h-1.5 bg-teal-500 rounded-full"></span>
                                             Kamus bergambar untuk pembelajaran yang lebih mudah
                                         </li>
                                         <li className="flex items-center gap-2">
                                             <span className="w-1.5 h-1.5 bg-teal-500 rounded-full"></span>
                                             Kamus budaya untuk memahami kearifan lokal daerah
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
         </PublicLayout>
     );
 }
