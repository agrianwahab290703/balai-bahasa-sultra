 import { PublicLayout } from '@/Layouts/PublicLayout';
 import { Head } from '@inertiajs/react';
 import { BookOpen, Download, ExternalLink, AlertTriangle, Sparkles, Search, Star, Heart, Baby } from 'lucide-react';
 import { useState } from 'react';
 
 interface ChildrenBook {
     id: number;
     title: string;
     shortTitle: string;
     year: string;
     description: string;
     driveLink: string;
     coverImage: string;
     color: string;
 }
 
 interface Props {
     books: ChildrenBook[];
     disclaimer: string;
     year: string;
 }
 
 export default function CeritaAnak({ books, disclaimer, year }: Props) {
     const [searchQuery, setSearchQuery] = useState('');
 
     const getGradientColors = (color: string) => {
         const colors: Record<string, { from: string; to: string; light: string; text: string }> = {
             pink: { from: 'from-pink-500', to: 'to-rose-500', light: 'bg-pink-100', text: 'text-pink-600' },
             purple: { from: 'from-purple-500', to: 'to-indigo-500', light: 'bg-purple-100', text: 'text-purple-600' },
             blue: { from: 'from-blue-500', to: 'to-cyan-500', light: 'bg-blue-100', text: 'text-blue-600' },
             green: { from: 'from-green-500', to: 'to-emerald-500', light: 'bg-green-100', text: 'text-green-600' },
             orange: { from: 'from-orange-500', to: 'to-amber-500', light: 'bg-orange-100', text: 'text-orange-600' },
             red: { from: 'from-red-500', to: 'to-rose-500', light: 'bg-red-100', text: 'text-red-600' },
             teal: { from: 'from-teal-500', to: 'to-cyan-500', light: 'bg-teal-100', text: 'text-teal-600' },
             indigo: { from: 'from-indigo-500', to: 'to-purple-500', light: 'bg-indigo-100', text: 'text-indigo-600' },
             amber: { from: 'from-amber-500', to: 'to-yellow-500', light: 'bg-amber-100', text: 'text-amber-600' },
             cyan: { from: 'from-cyan-500', to: 'to-blue-500', light: 'bg-cyan-100', text: 'text-cyan-600' },
             rose: { from: 'from-rose-500', to: 'to-pink-500', light: 'bg-rose-100', text: 'text-rose-600' },
             violet: { from: 'from-violet-500', to: 'to-purple-500', light: 'bg-violet-100', text: 'text-violet-600' },
         };
         return colors[color] || colors.pink;
     };
 
     const filteredBooks = books.filter((book) =>
         book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
         book.shortTitle.toLowerCase().includes(searchQuery.toLowerCase())
     );
 
     return (
         <PublicLayout>
             <Head title={`Buku Cerita Anak ${year} - Terbitan`} />
 
             {/* Hero Section */}
             <section className="relative bg-gradient-to-br from-pink-600 via-rose-500 to-orange-500 py-20 lg:py-28 overflow-hidden">
                 {/* Decorative elements */}
                 <div className="absolute inset-0 opacity-20">
                     <div className="absolute top-10 left-10 w-72 h-72 bg-yellow-400 rounded-full filter blur-3xl animate-pulse"></div>
                     <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-400 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
                     <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-orange-400 rounded-full filter blur-3xl animate-pulse delay-500"></div>
                 </div>
                 
                 {/* Fun pattern overlay */}
                 <div 
                     className="absolute inset-0 opacity-10"
                     style={{
                         backgroundImage: `url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                     }}
                 ></div>
 
                 <div className="container mx-auto px-4 relative z-10">
                     <div className="text-center max-w-4xl mx-auto">
                         {/* Icon */}
                         <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-8 shadow-xl">
                             <Baby className="w-10 h-10 text-white" />
                         </div>
 
                         <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                             Buku Cerita Anak
                         </h1>
                         
                         <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-white text-lg font-medium mb-6">
                             <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                             Terbitan Tahun {year}
                             <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                         </div>
                         
                         <p className="text-lg md:text-xl text-pink-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                             Koleksi buku cerita anak yang menarik dan edukatif, menanamkan nilai-nilai positif 
                             dan kecintaan pada bahasa serta budaya Sulawesi Tenggara.
                         </p>
 
                         {/* Breadcrumb */}
                         <nav className="flex justify-center items-center gap-2 text-sm text-pink-200">
                             <a href="/" className="hover:text-white transition-colors">Beranda</a>
                             <span className="text-pink-300">/</span>
                             <span className="text-pink-200">Terbitan</span>
                             <span className="text-pink-300">/</span>
                             <span className="text-white font-medium">Cerita Anak {year}</span>
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
                             <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center">
                                 <BookOpen className="w-6 h-6 text-pink-600" />
                             </div>
                             <div>
                                 <p className="text-2xl font-bold text-slate-800">{books.length}</p>
                                 <p className="text-sm text-slate-500">Buku Cerita</p>
                             </div>
                         </div>
                         <div className="flex items-center gap-3">
                             <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center">
                                 <Heart className="w-6 h-6 text-rose-600" />
                             </div>
                             <div>
                                 <p className="text-2xl font-bold text-slate-800">Edukatif</p>
                                 <p className="text-sm text-slate-500">Nilai Positif</p>
                             </div>
                         </div>
                         <div className="flex items-center gap-3">
                             <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                                 <Star className="w-6 h-6 text-amber-600" />
                             </div>
                             <div>
                                 <p className="text-2xl font-bold text-slate-800">Gratis</p>
                                 <p className="text-sm text-slate-500">Akses untuk Semua</p>
                             </div>
                         </div>
                     </div>
                 </div>
             </section>
 
             {/* Search Section */}
             <section className="bg-slate-50 py-8">
                 <div className="container mx-auto px-4">
                     <div className="max-w-2xl mx-auto">
                         <div className="relative">
                             <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                             <input
                                 type="text"
                                 placeholder="Cari judul buku cerita..."
                                 value={searchQuery}
                                 onChange={(e) => setSearchQuery(e.target.value)}
                                 className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
                             />
                         </div>
                     </div>
                 </div>
             </section>
 
             {/* Books Grid */}
             <section className="py-12 lg:py-20 bg-slate-50">
                 <div className="container mx-auto px-4">
                     {/* Section Header */}
                     <div className="text-center mb-12">
                         <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                             <Sparkles className="w-4 h-4" />
                             Koleksi Lengkap
                         </div>
                         <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                             Buku Cerita Anak Terbitan {year}
                         </h2>
                         <p className="text-slate-600 max-w-2xl mx-auto">
                             Unduh dan baca buku-buku cerita anak yang menarik untuk buah hati Anda
                         </p>
                     </div>
 
                     {/* Cards Grid */}
                     {filteredBooks.length > 0 ? (
                         <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 max-w-7xl mx-auto">
                             {filteredBooks.map((book) => {
                                 const colors = getGradientColors(book.color);
                                 return (
                                     <div
                                         key={book.id}
                                         className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
                                     >
                                         {/* Card Header */}
                                         <div className={`bg-gradient-to-br ${colors.from} ${colors.to} p-5 relative overflow-hidden`}>
                                             {/* Decorative elements */}
                                             <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full"></div>
                                             <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-white/10 rounded-full"></div>
                                             
                                             <div className="relative z-10 flex flex-col items-center">
                                                 {/* Book Cover Image */}
                                                 <div className="w-20 h-28 relative overflow-hidden rounded-lg shadow-lg group-hover:scale-105 transition-transform">
                                                     {book.coverImage ? (
                                                         <img 
                                                             src={book.coverImage} 
                                                             alt={book.shortTitle}
                                                             className="w-full h-full object-cover rounded-lg"
                                                             onError={(e) => {
                                                                 // Fallback to icon if image fails to load
                                                                 e.currentTarget.style.display = 'none';
                                                                 const sibling = e.currentTarget.nextElementSibling as HTMLElement | null;
                                                                 if (sibling) sibling.style.display = 'flex';
                                                             }}
                                                         />
                                                     ) : null}
                                                     <div className="w-full h-full bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center" style={{ display: book.coverImage ? 'none' : 'flex' }}>
                                                         <BookOpen className="w-8 h-8 text-white/90" />
                                                     </div>
                                                 </div>
                                             </div>
                                         </div>
 
                                         {/* Card Body */}
                                         <div className="p-4">
                                             <h3 className="text-sm font-semibold text-slate-800 mb-2 line-clamp-2 min-h-[40px]">
                                                 {book.shortTitle}
                                             </h3>
                                             
                                             {/* Year Badge */}
                                             <span className={`inline-flex items-center gap-1 ${colors.light} ${colors.text} text-xs font-medium px-2 py-1 rounded-full mb-3`}>
                                                 <Star className="w-3 h-3" />
                                                 {book.year}
                                             </span>
 
                                             {/* Action Buttons */}
                                             <div className="flex gap-2">
                                                 <a
                                                     href={book.driveLink}
                                                     target="_blank"
                                                     rel="noopener noreferrer"
                                                     className={`flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-gradient-to-r ${colors.from} ${colors.to} text-white rounded-lg font-medium text-xs hover:opacity-90 transition-opacity shadow-md`}
                                                 >
                                                     <Download className="w-3 h-3" />
                                                     Unduh
                                                 </a>
                                                 <a
                                                     href={book.driveLink}
                                                     target="_blank"
                                                     rel="noopener noreferrer"
                                                     className="inline-flex items-center justify-center w-9 h-9 border border-slate-200 rounded-lg hover:border-pink-500 hover:text-pink-500 transition-colors"
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
                             <p className="text-slate-500">Coba ubah kata kunci pencarian</p>
                         </div>
                     )}
                 </div>
             </section>
 
             {/* About Section */}
             <section className="py-16 bg-white">
                 <div className="container mx-auto px-4">
                     <div className="max-w-4xl mx-auto">
                         <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl p-8 md:p-12 border border-pink-100">
                             <div className="flex flex-col md:flex-row items-start gap-6">
                                 <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                                     <Baby className="w-8 h-8 text-pink-600" />
                                 </div>
                                 <div>
                                     <h3 className="text-xl font-bold text-slate-800 mb-3">
                                         Tentang Buku Cerita Anak
                                     </h3>
                                     <p className="text-slate-600 leading-relaxed mb-4">
                                         Buku cerita anak terbitan Balai Bahasa Provinsi Sulawesi Tenggara 
                                         dirancang khusus untuk menumbuhkan minat baca dan kecintaan terhadap 
                                         bahasa serta budaya daerah sejak usia dini. Setiap cerita mengandung 
                                         nilai-nilai moral dan pendidikan karakter yang positif.
                                     </p>
                                     <ul className="text-slate-600 text-sm space-y-2">
                                         <li className="flex items-center gap-2">
                                             <span className="w-1.5 h-1.5 bg-pink-500 rounded-full"></span>
                                             Ilustrasi menarik dan penuh warna
                                         </li>
                                         <li className="flex items-center gap-2">
                                             <span className="w-1.5 h-1.5 bg-pink-500 rounded-full"></span>
                                             Cerita edukatif dengan nilai moral
                                         </li>
                                         <li className="flex items-center gap-2">
                                             <span className="w-1.5 h-1.5 bg-pink-500 rounded-full"></span>
                                             Mengangkat kearifan lokal Sulawesi Tenggara
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
