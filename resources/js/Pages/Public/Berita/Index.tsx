import React, { useState, useMemo } from 'react';
import { Link, router } from '@inertiajs/react';
import { PublicLayout } from '@/Layouts/PublicLayout';
import { Card, CardContent } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { 
    Calendar, 
    Eye, 
    BookOpen, 
    Search, 
    ChevronLeft, 
    ChevronRight, 
    Sparkles, 
    FileText,
    Clock,
    TrendingUp,
    Filter,
    LayoutGrid,
    List,
    X,
    ArrowUpRight
} from 'lucide-react';

interface NewsItem {
    id: number;
    judul_utama: string;
    slug: string;
    ringkasan_inti: string;
    hero_image: string | null;
    tanggal_rilis: string;
    view_count: number;
    kategori: string;
    created_at: string;
}

interface BeritaIndexProps {
    berita: {
        data: NewsItem[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    featuredNews: NewsItem[];
    popularNews: NewsItem[];
    categories: Record<string, {name: string; count: number}>;
    filters: {
        search?: string;
        category?: string;
    };
}

// Format relative time in Indonesian
const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Baru saja';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit lalu`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam lalu`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} hari lalu`;
    
    return date.toLocaleDateString('id-ID', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
    });
};

// Format view count with Indonesian number format
const formatViewCount = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}jt`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}rb`;
    return count.toString();
};

export default function BeritaIndex({ berita, featuredNews = [], popularNews = [], categories = {}, filters = {} }: BeritaIndexProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    // Destructure pagination values for easier access
    const { current_page, last_page, total } = berita;

    // Filter news based on search and category
    const filteredNews = useMemo(() => {
        return berita.data.filter(item => {
            const matchesSearch = searchQuery === '' ||
                item.judul_utama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.ringkasan_inti?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory = activeCategory === 'all' ||
                item.kategori === activeCategory;

            return matchesSearch && matchesCategory;
        });
    }, [berita.data, searchQuery, activeCategory]);

    // Get the featured/hero news item (most recent with image)
    const heroNews = useMemo(() => {
        if (featuredNews.length > 0) return featuredNews[0];
        return filteredNews.find(n => n.hero_image) || filteredNews[0];
    }, [filteredNews, featuredNews]);

    // Get remaining news (excluding hero)
    const remainingNews = useMemo(() => {
        if (!heroNews) return filteredNews;
        return filteredNews.filter(n => n.id !== heroNews.id);
    }, [filteredNews, heroNews]);

    const handleCategoryClick = (cat: string) => {
        setActiveCategory(cat);
    };

    const handlePageChange = (page: number) => {
        router.get('/berita', { page }, { preserveState: true, preserveScroll: true });
    };

    // Generate pagination array with ellipsis
    const getPaginationArray = () => {
        const pages: (number | string)[] = [];
        
        if (last_page <= 7) {
            for (let i = 1; i <= last_page; i++) pages.push(i);
        } else {
            if (current_page <= 3) {
                pages.push(1, 2, 3, 4, '...', last_page);
            } else if (current_page >= last_page - 2) {
                pages.push(1, '...', last_page - 3, last_page - 2, last_page - 1, last_page);
            } else {
                pages.push(1, '...', current_page - 1, current_page, current_page + 1, '...', last_page);
            }
        }
        return pages;
    };

    return (
        <PublicLayout 
            title="Berita & Artikel"
            description="Informasi terbaru seputar kegiatan, program, dan perkembangan kebahasaan dari Balai Bahasa Sulawesi Tenggara"
        >
            {/* Hero Section with Glassmorphism */}
            <section className="relative bg-gradient-to-br from-[#0c4a6e] via-[#1e6091] to-[#0369a1] py-16 lg:py-24 overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-300/5 rounded-full blur-3xl" />
                    {/* Subtle grid pattern */}
                    <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '40px 40px'}}></div>
                </div>
                
                <div className="container relative mx-auto px-4">
                    <div className="max-w-4xl">
                        {/* Breadcrumb-like badge */}
                        <div className="flex items-center gap-2 mb-6">
                            <Badge className="bg-white/10 text-white/90 backdrop-blur-sm border border-white/20 font-normal px-3 py-1">
                                <Link href="/" className="hover:text-yellow-400 transition-colors">Beranda</Link>
                            </Badge>
                            <span className="text-white/40">/</span>
                            <Badge className="bg-yellow-400/90 text-gray-900 font-medium px-4 py-1.5 shadow-lg">
                                <FileText className="w-3.5 h-3.5 mr-1.5" />
                                Berita & Artikel
                            </Badge>
                        </div>
                        
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 leading-tight">
                            Informasi & <span className="font-display italic text-yellow-400">Kegiatan</span>
                            <span className="block text-2xl sm:text-3xl lg:text-4xl font-medium text-blue-100 mt-2">
                                Balai Bahasa Sultra
                            </span>
                        </h1>
                        <p className="text-base sm:text-lg text-blue-100/90 max-w-2xl leading-relaxed mb-8">
                            Temukan berita terkini, artikel edukatif, dan informasi kegiatan seputar 
                            pembinaan, pengembangan, serta pelindungan bahasa dan sastra Indonesia.
                        </p>

                        {/* Stats Row */}
                        <div className="flex flex-wrap gap-4 sm:gap-6">
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/10">
                                <FileText className="w-5 h-5 text-yellow-400" />
                                <div>
                                    <div className="text-lg font-bold text-white">{berita.total}</div>
                                    <div className="text-xs text-blue-200">Total Berita</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/10">
                                <TrendingUp className="w-5 h-5 text-emerald-400" />
                                <div>
                                    <div className="text-lg font-bold text-white">{Object.keys(categories).length}</div>
                                    <div className="text-xs text-blue-200">Kategori</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/10">
                                <Eye className="w-5 h-5 text-blue-300" />
                                <div>
                                    <div className="text-lg font-bold text-white">
                                        {formatViewCount(berita.data.reduce((sum, n) => sum + (n.view_count || 0), 0))}
                                    </div>
                                    <div className="text-xs text-blue-200">Total Pembaca</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Wave decoration */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
                        <path d="M0 80L60 72C120 64 240 48 360 42.7C480 37 600 43 720 48C840 53 960 59 1080 58.7C1200 59 1320 53 1380 50L1440 47V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" fill="#f9fafb"/>
                    </svg>
                </div>
            </section>

            {/* Search & Filter Bar - Sticky */}
            <section className="bg-gray-50 py-6 border-b border-gray-200 sticky top-0 z-40 backdrop-blur-lg bg-gray-50/95">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                        {/* Search Input */}
                        <div className="relative w-full lg:w-96 group">
                            <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 blur transition-opacity duration-300 ${isSearchFocused ? 'opacity-20' : ''}`} />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                            <input
                                type="text"
                                placeholder="Cari berita, artikel, atau topik..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                                className="relative w-full pl-12 pr-10 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all shadow-sm"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors z-10"
                                >
                                    <X className="h-4 w-4 text-gray-400" />
                                </button>
                            )}
                        </div>
                        
                        {/* Filter & View Controls */}
                        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                            {/* Category Filter */}
                            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                                <span className="hidden sm:flex items-center gap-1.5 text-sm text-gray-500 whitespace-nowrap">
                                    <Filter className="h-4 w-4" />
                                    Filter:
                                </span>
                                <div className="flex gap-2">
                                    <Button 
                                        variant={activeCategory === 'all' ? 'default' : 'outline'} 
                                        size="sm" 
                                        onClick={() => handleCategoryClick('all')}
                                        className={`whitespace-nowrap transition-all ${
                                            activeCategory === 'all' 
                                                ? 'bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/25' 
                                                : 'bg-white hover:bg-gray-50'
                                        }`}
                                    >
                                        Semua
                                    </Button>
                                    {Object.entries(categories).slice(0, 5).map(([key, cat]) => (
                                        <Button
                                            key={key}
                                            variant={activeCategory === key ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => handleCategoryClick(key)}
                                            className={`whitespace-nowrap transition-all ${
                                                activeCategory === key
                                                    ? 'bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/25'
                                                    : 'bg-white hover:bg-gray-50'
                                            }`}
                                        >
                                            {cat.name}
                                        </Button>
                                    ))}
                                    {Object.keys(categories).length > 5 && (
                                        <Button variant="ghost" size="sm" className="text-blue-600">
                                            +{Object.keys(categories).length - 5} lainnya
                                        </Button>
                                    )}
                                </div>
                            </div>
                            
                            {/* View Toggle */}
                            <div className="hidden md:flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-400'}`}
                                >
                                    <LayoutGrid className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-400'}`}
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                    
                    {/* Active filters indicator */}
                    {(searchQuery || activeCategory !== 'all') && (
                        <div className="mt-4 flex items-center gap-2 text-sm">
                            <span className="text-gray-500">Menampilkan {filteredNews.length} dari {berita.total} berita</span>
                            {searchQuery && (
                                <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                                    "{searchQuery}"
                                    <button onClick={() => setSearchQuery('')} className="ml-1">
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            )}
                            {activeCategory !== 'all' && (
                                <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                                    {activeCategory}
                                    <button onClick={() => setActiveCategory('all')} className="ml-1">
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* Featured News Hero Card */}
            {heroNews && filteredNews.length > 0 && (
                <section className="bg-gray-50 pt-8 pb-4">
                    <div className="container mx-auto px-4">
                        <Link href={`/berita/${heroNews.slug}`}>
                            <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white">
                                <div className="grid lg:grid-cols-2 gap-0">
                                    {/* Image Side */}
                                    <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[400px] overflow-hidden">
                                        <Badge className="absolute top-4 left-4 z-10 bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 font-semibold shadow-lg">
                                            <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Berita Utama
                                        </Badge>
                                        {heroNews.hero_image ? (
                                            <img 
                                                src={heroNews.hero_image.startsWith('/') ? heroNews.hero_image : `/${heroNews.hero_image}`}
                                                alt={heroNews.judul_utama}
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                loading="eager"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100">
                                                <BookOpen className="h-20 w-20 text-blue-300" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </div>
                                    
                                    {/* Content Side */}
                                    <div className="p-6 lg:p-10 flex flex-col justify-center">
                                        <div className="flex flex-wrap items-center gap-2 mb-4">
                                            <Badge variant="secondary" className="bg-blue-100 text-blue-700 font-medium">
                                                {heroNews.kategori || 'Berita'}
                                            </Badge>
                                            <span className="text-xs text-gray-400">•</span>
                                            <span className="flex items-center gap-1 text-sm text-gray-500">
                                                <Clock className="h-3.5 w-3.5" />
                                                {formatRelativeTime(heroNews.tanggal_rilis || heroNews.created_at)}
                                            </span>
                                        </div>
                                        
                                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-blue-600 transition-colors line-clamp-3">
                                            {heroNews.judul_utama}
                                        </h2>
                                        
                                        <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3 text-base lg:text-lg">
                                            {heroNews.ringkasan_inti}
                                        </p>
                                        
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <div className="flex items-center gap-4">
                                                <span className="flex items-center gap-1.5 text-sm text-gray-500">
                                                    <Calendar className="h-4 w-4 text-blue-500" />
                                                    {heroNews.tanggal_rilis || new Date(heroNews.created_at).toLocaleDateString('id-ID', { 
                                                        weekday: 'long',
                                                        day: 'numeric', 
                                                        month: 'long', 
                                                        year: 'numeric' 
                                                    })}
                                                </span>
                                                <span className="flex items-center gap-1.5 text-sm text-gray-500">
                                                    <Eye className="h-4 w-4 text-emerald-500" />
                                                    {formatViewCount(heroNews.view_count || 0)} pembaca
                                                </span>
                                            </div>
                                            <span className="flex items-center gap-1 text-blue-600 font-medium text-sm group-hover:gap-2 transition-all">
                                                Baca selengkapnya
                                                <ArrowUpRight className="h-4 w-4" />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    </div>
                </section>
            )}

            {/* News Grid/List */}
            <section className="bg-gray-50 py-10">
                <div className="container mx-auto px-4">
                    {remainingNews.length > 0 ? (
                        <>
                            {/* Section Header */}
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
                                    Berita Lainnya
                                </h2>
                                <span className="text-sm text-gray-500">
                                    Menampilkan {berita.from || 1}-{berita.to || remainingNews.length} dari {berita.total}
                                </span>
                            </div>
                            
                            {/* Grid View */}
                            {viewMode === 'grid' ? (
                                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {remainingNews.map((item, index) => (
                                        <Link key={item.id} href={`/berita/${item.slug}`} className="block">
                                            <Card className="group h-full overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-500 bg-white rounded-xl">
                                                <div className="aspect-[16/10] w-full overflow-hidden bg-gray-100 relative rounded-t-xl">
                                                    {item.hero_image ? (
                                                        <img 
                                                            src={item.hero_image.startsWith('/') ? item.hero_image : `/${item.hero_image}`}
                                                            alt={item.judul_utama}
                                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                            loading="lazy"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                                                            <BookOpen className="h-10 w-10 text-blue-300" />
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    
                                                    {/* Category badge on image */}
                                                    <Badge className="absolute top-3 left-3 bg-white/90 text-gray-700 backdrop-blur-sm text-xs font-medium">
                                                        {item.kategori || 'Berita'}
                                                    </Badge>
                                                </div>
                                                
                                                <CardContent className="p-5 lg:p-6">
                                                    <h3 className="mb-3 line-clamp-2 text-base lg:text-lg font-bold leading-snug text-gray-900 group-hover:text-blue-600 transition-colors">
                                                        {item.judul_utama}
                                                    </h3>
                                                    <p className="mb-4 line-clamp-2 text-sm text-gray-500 leading-relaxed">
                                                        {item.ringkasan_inti}
                                                    </p>
                                                    
                                                    <div className="flex items-center justify-between text-xs text-gray-400 pt-4 border-t border-gray-100">
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="h-3.5 w-3.5" />
                                                            {formatRelativeTime(item.created_at)}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Eye className="h-3.5 w-3.5" />
                                                            {formatViewCount(item.view_count || 0)}
                                                        </span>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                /* List View */
                                <div className="space-y-6">
                                    {remainingNews.map((item) => (
                                        <Link key={item.id} href={`/berita/${item.slug}`} className="block">
                                            <Card className="group overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-100 transition-all duration-300 bg-white rounded-xl">
                                                <div className="flex flex-col sm:flex-row">
                                                    <div className="sm:w-56 lg:w-72 aspect-[16/10] sm:aspect-[4/3] overflow-hidden bg-gray-100 flex-shrink-0 rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none">
                                                        {item.hero_image ? (
                                                            <img 
                                                                src={item.hero_image.startsWith('/') ? item.hero_image : `/${item.hero_image}`}
                                                                alt={item.judul_utama}
                                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                                loading="lazy"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                                                                <BookOpen className="h-8 w-8 text-blue-300" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                    <CardContent className="p-6 lg:p-8 flex-1 flex flex-col justify-center">
                                                        <div className="flex flex-wrap items-center gap-2 mb-3">
                                                            <Badge variant="secondary" className="bg-blue-50 text-blue-600 text-xs">
                                                                {item.kategori || 'Berita'}
                                                            </Badge>
                                                            <span className="text-xs text-gray-400">
                                                                {formatRelativeTime(item.created_at)}
                                                            </span>
                                                        </div>
                                                        
                                                        <h3 className="mb-3 line-clamp-2 text-lg lg:text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug">
                                                            {item.judul_utama}
                                                        </h3>
                                                        <p className="mb-4 line-clamp-2 text-sm lg:text-base text-gray-500 leading-relaxed">
                                                            {item.ringkasan_inti}
                                                        </p>
                                                        
                                                        <div className="flex items-center gap-4 text-xs lg:text-sm text-gray-400 pt-4 border-t border-gray-100">
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="h-3.5 w-3.5" />
                                                                {new Date(item.created_at).toLocaleDateString('id-ID', { 
                                                                    day: 'numeric', 
                                                                    month: 'short', 
                                                                    year: 'numeric' 
                                                                })}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Eye className="h-3.5 w-3.5" />
                                                                {formatViewCount(item.view_count || 0)} pembaca
                                                            </span>
                                                        </div>
                                                    </CardContent>
                                                </div>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Pagination */}
                            {berita.last_page > 1 && (
                                <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={berita.current_page === 1}
                                            onClick={() => handlePageChange(berita.current_page - 1)}
                                            className="gap-1 bg-white border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 hover:shadow-md hover:shadow-blue-200/50 hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-white disabled:hover:border-gray-200 disabled:hover:text-gray-500"
                                        >
                                            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                                            <span className="hidden sm:inline">Sebelumnya</span>
                                        </Button>
                                        
                                        <div className="flex items-center gap-1">
                                            {getPaginationArray().map((page, index) => (
                                                page === '...' ? (
                                                    <span key={`ellipsis-${index}`} className="px-2 text-gray-400">...</span>
                                                ) : (
                                                    <Button
                                                        key={page}
                                                        variant={berita.current_page === page ? 'default' : 'ghost'}
                                                        size="sm"
                                                        onClick={() => handlePageChange(page as number)}
                                                        className={`w-10 h-10 ${
                                                            berita.current_page === page 
                                                                ? 'bg-blue-600 hover:bg-blue-700 shadow-md' 
                                                                : 'hover:bg-gray-100'
                                                        }`}
                                                    >
                                                        {page}
                                                    </Button>
                                                )
                                            ))}
                                        </div>
                                        
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={berita.current_page === berita.last_page}
                                            onClick={() => handlePageChange(berita.current_page + 1)}
                                            className="gap-1 bg-white border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 hover:shadow-md hover:shadow-blue-200/50 hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-white disabled:hover:border-gray-200 disabled:hover:text-gray-500"
                                        >
                                            <span className="hidden sm:inline">Selanjutnya</span>
                                            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                        </Button>
                                    </div>
                                    
                                    <span className="text-sm text-gray-500">
                                        Halaman {berita.current_page} dari {berita.last_page}
                                    </span>
                                </div>
                            )}
                        </>
                    ) : berita.data.length === 0 ? (
                        <Card className="border-0 shadow-lg bg-white">
                            <CardContent className="p-12 sm:p-16 text-center">
                                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                                    <BookOpen className="h-12 w-12 text-blue-300" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">Belum Ada Berita</h3>
                                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                                    Berita dan artikel akan segera tersedia. Kunjungi halaman ini kembali untuk informasi terbaru.
                                </p>
                                <Link href="/">
                                    <Button className="bg-blue-600 hover:bg-blue-700">Kembali ke Beranda</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        /* No results for search/filter */
                        <Card className="border-0 shadow-lg bg-white">
                            <CardContent className="p-12 text-center">
                                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                                    <Search className="h-10 w-10 text-gray-300" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Tidak Ditemukan</h3>
                                <p className="text-gray-500 mb-6">
                                    Tidak ada berita yang sesuai dengan pencarian "{searchQuery}" 
                                    {activeCategory !== 'all' && ` dalam kategori "${activeCategory}"`}
                                </p>
                                <Button 
                                    variant="outline" 
                                    onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                                >
                                    Hapus Filter
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
