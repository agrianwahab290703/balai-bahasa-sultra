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
    ArrowUpRight,
    Home,
    Newspaper
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
const formatRelativeTime = (dateString: string | null | undefined): string => {
    if (!dateString) return '';

    // If dateString is already formatted (contains Indonesian month names), return as-is
    const indonesianMonths = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    if (typeof dateString === 'string' && indonesianMonths.some(month => dateString.includes(month))) {
        return dateString;
    }

    // Try to parse the date
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        // If invalid, return the original string or empty
        return typeof dateString === 'string' ? dateString : '';
    }

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 0) return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
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

// Safe date formatter - returns formatted date or empty string (never "Invalid Date")
const formatDateSafe = (dateString: string | null | undefined, options?: Intl.DateTimeFormatOptions): string => {
    if (!dateString) return '';

    // If already formatted, return as-is
    const indonesianMonths = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    if (typeof dateString === 'string' && indonesianMonths.some(month => dateString.includes(month))) {
        return dateString;
    }

    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        return date.toLocaleDateString('id-ID', options || { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
        return '';
    }
};

// Format view count with Indonesian number format
const formatViewCount = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}jt`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}rb`;
    return count.toString();
};

// Helper function to get proper image URL
const getImageUrl = (url: string | null | undefined): string => {
    if (!url || url.trim() === '') return '';
    // If already a full URL, return as-is
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    // If starts with /, return as-is
    if (url.startsWith('/')) return url;
    // If starts with storage/, add leading slash
    if (url.startsWith('storage/')) return `/${url}`;
    // Otherwise, assume it's in storage/berita and add proper path
    return `/storage/${url}`;
};

// Safe date-time formatter (includes time)
const formatDateTimeSafe = (dateString: string | null | undefined, options?: Intl.DateTimeFormatOptions): string => {
    if (!dateString) return '';
    const baseOptions: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    };
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        return date.toLocaleString('id-ID', options || baseOptions);
    } catch {
        return '';
    }
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
            {/* Compact Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-12 lg:py-16">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                        {/* Left Content */}
                        <div className="flex-1 text-center lg:text-left">
                            {/* Breadcrumb */}
                            <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                                <Link href="/" className="text-blue-100 hover:text-white transition-colors flex items-center gap-1">
                                    <Home className="w-4 h-4" />
                                    Beranda
                                </Link>
                                <span className="text-blue-200">/</span>
                                <span className="text-white font-medium">Berita & Artikel</span>
                            </div>

                            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4">
                                Informasi Terkini <span className="text-yellow-400">Balai Bahasa</span>
                            </h1>

                            <p className="text-blue-100 text-lg max-w-2xl mb-6">
                                Temukan berita terbaru, artikel edukatif, dan informasi kegiatan seputar pembinaan bahasa dan sastra.
                            </p>

                            {/* Quick Stats */}
                            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                                    <div className="flex items-center gap-2">
                                        <Newspaper className="w-5 h-5 text-yellow-400" />
                                        <div>
                                            <div className="text-white font-semibold">{berita.total}</div>
                                            <div className="text-xs text-blue-200">Berita</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                                        <div>
                                            <div className="text-white font-semibold">{Object.keys(categories).length}</div>
                                            <div className="text-xs text-blue-200">Kategori</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Content - Hero Card Preview */}
                        {heroNews && (
                            <div className="flex-1 max-w-xl">
                                <Link href={`/berita/${heroNews.slug}`}>
                                    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
                                        <div className="aspect-[16/10] overflow-hidden">
                                            {heroNews.hero_image ? (
                                                <img
                                                    src={getImageUrl(heroNews.hero_image)}
                                                    alt={heroNews.judul_utama}
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
                                                    <BookOpen className="h-16 w-16 text-blue-300" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                                            {/* Overlay Content */}
                                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                                <Badge className="bg-yellow-400 text-gray-900 mb-3">
                                                    <Sparkles className="w-3.5 h-3.5 mr-1" /> Utama
                                                </Badge>
                                                <h3 className="text-white font-bold text-lg line-clamp-2 mb-2">
                                                    {heroNews.judul_utama}
                                                </h3>
                                                <div className="flex items-center gap-3 text-white/80 text-sm">
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        {formatRelativeTime(heroNews.created_at)}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Eye className="w-4 h-4" />
                                                        {formatViewCount(heroNews.view_count || 0)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Search & Filter Bar */}
            <section className="bg-white border-b border-gray-200 py-4 sticky top-16 z-40">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        {/* Search Input */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari berita atau artikel..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <X className="h-4 w-4 text-gray-400" />
                                </button>
                            )}
                        </div>

                        {/* Category Filter */}
                        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                            <Button
                                variant={activeCategory === 'all' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handleCategoryClick('all')}
                                className={`whitespace-nowrap ${
                                    activeCategory === 'all' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-white'
                                }`}
                            >
                                Semua
                            </Button>
                            {Object.entries(categories).map(([key, cat]) => (
                                <Button
                                    key={key}
                                    variant={activeCategory === key ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => handleCategoryClick(key)}
                                    className={`whitespace-nowrap ${
                                        activeCategory === key ? 'bg-blue-600 hover:bg-blue-700' : 'bg-white'
                                    }`}
                                >
                                    {cat.name}
                                </Button>
                            ))}
                        </div>

                        {/* View Toggle */}
                        <div className="hidden sm:flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setViewMode('grid')}
                                className={`p-2 ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                            >
                                <LayoutGrid className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setViewMode('list')}
                                className={`p-2 ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                            >
                                <List className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    {/* Featured Article (If not shown in hero) */}
                    {!heroNews && filteredNews.length > 0 && (
                        <div className="mb-8">
                            <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all bg-white">
                                <Link href={`/berita/${filteredNews[0].slug}`}>
                                    <div className="grid md:grid-cols-2 gap-0">
                                        <div className="aspect-[16/10] overflow-hidden">
                                            {filteredNews[0].hero_image ? (
                                                <img
                                                    src={getImageUrl(filteredNews[0].hero_image)}
                                                    alt={filteredNews[0].judul_utama}
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
                                                    <BookOpen className="h-16 w-16 text-blue-300" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-6 flex flex-col justify-center">
                                            <Badge className="bg-yellow-400 text-gray-900 w-fit mb-3">
                                                <Sparkles className="w-3.5 h-3.5 mr-1" /> Berita Utama
                                            </Badge>
                                            <h2 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                                {filteredNews[0].judul_utama}
                                            </h2>
                                            <p className="text-gray-600 mb-4 line-clamp-2">
                                                {filteredNews[0].ringkasan_inti}
                                            </p>
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {formatRelativeTime(filteredNews[0].created_at)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Eye className="w-4 h-4" />
                                                    {formatViewCount(filteredNews[0].view_count || 0)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </Card>
                        </div>
                    )}

                    {/* News Grid/List */}
                    {remainingNews.length > 0 ? (
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Berita Lainnya</h2>

                            {/* Grid View */}
                            {viewMode === 'grid' ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {remainingNews.map((item) => (
                                        <Link key={item.id} href={`/berita/${item.slug}`}>
                                            <Card className="group h-full overflow-hidden border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all bg-white rounded-xl">
                                                <div className="aspect-[16/10] overflow-hidden relative">
                                                    {item.hero_image ? (
                                                        <img
                                                            src={getImageUrl(item.hero_image)}
                                                            alt={item.judul_utama}
                                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                            loading="lazy"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                                            <BookOpen className="h-12 w-12 text-gray-400" />
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                                                    <Badge className="absolute top-3 left-3 bg-white/90 text-gray-700 text-xs">
                                                        {item.kategori || 'Berita'}
                                                    </Badge>
                                                </div>

                                                <CardContent className="p-5">
                                                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                                        {item.judul_utama}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                                        {item.ringkasan_inti}
                                                    </p>

                                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-3.5 h-3.5" />
                                                            {formatRelativeTime(item.created_at)}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Eye className="w-3.5 h-3.5" />
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
                                <div className="space-y-4">
                                    {remainingNews.map((item) => (
                                        <Link key={item.id} href={`/berita/${item.slug}`}>
                                            <Card className="group overflow-hidden border border-gray-200 hover:shadow-md transition-all bg-white">
                                                <div className="flex gap-4 p-4">
                                                    <div className="w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                                                        {item.hero_image ? (
                                                            <img
                                                                src={getImageUrl(item.hero_image)}
                                                                alt={item.judul_utama}
                                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                                                <BookOpen className="h-8 w-8 text-gray-400" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Badge variant="secondary" className="text-xs">
                                                                {item.kategori || 'Berita'}
                                                            </Badge>
                                                            <span className="text-xs text-gray-400">
                                                                {formatRelativeTime(item.created_at)}
                                                            </span>
                                                        </div>

                                                        <h3 className="font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                                            {item.judul_utama}
                                                        </h3>
                                                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                                                            {item.ringkasan_inti}
                                                        </p>

                                                        <div className="flex items-center gap-3 text-xs text-gray-500">
                                                            <span className="flex items-center gap-1">
                                                                <Eye className="w-3.5 h-3.5" />
                                                                {formatViewCount(item.view_count || 0)} pembaca
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Pagination */}
                            {berita.last_page > 1 && (
                                <div className="mt-10 flex justify-center">
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={berita.current_page === 1}
                                            onClick={() => handlePageChange(berita.current_page - 1)}
                                            className="gap-1"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                            Sebelumnya
                                        </Button>

                                        <div className="flex items-center gap-1">
                                            {getPaginationArray().map((page, index) => (
                                                page === '...' ? (
                                                    <span key={`ellipsis-${index}`} className="px-3 py-1 text-gray-400">...</span>
                                                ) : (
                                                    <Button
                                                        key={page}
                                                        variant={berita.current_page === page ? 'default' : 'ghost'}
                                                        size="sm"
                                                        onClick={() => handlePageChange(page as number)}
                                                        className={`w-10 h-10 ${
                                                            berita.current_page === page ? 'bg-blue-600 hover:bg-blue-700' : ''
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
                                            className="gap-1"
                                        >
                                            Selanjutnya
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : berita.data.length === 0 ? (
                        <div className="text-center py-16">
                            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Belum Ada Berita</h3>
                            <p className="text-gray-600">Belum ada berita yang tersedia saat ini.</p>
                        </div>
                    ) : null}
                </div>
            </section>
        </PublicLayout>
    );
}