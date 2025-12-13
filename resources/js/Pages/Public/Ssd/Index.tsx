import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { PublicLayout } from '@/Layouts/PublicLayout';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/Components/ui/accordion';
import { Search, HelpCircle, MessageCircleQuestion } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Ssd {
    id: string;
    question: string;
    answer: string;
    category: string;
    sort_order: number;
}

interface Props {
    ssds: Ssd[];
    categories: string[];
    filters: {
        search: string | null;
        category: string | null;
    };
}

export default function SsdIndex({ ssds, categories, filters }: Props) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || 'semua');
    const [expandedItems, setExpandedItems] = useState<string[]>([]);

    // Filter SSDs locally for instant feedback
    const filteredSsds = useMemo(() => {
        return ssds.filter((ssd) => {
            const matchesSearch = searchQuery
                ? ssd.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  ssd.answer.toLowerCase().includes(searchQuery.toLowerCase())
                : true;
            const matchesCategory =
                selectedCategory === 'semua' || ssd.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [ssds, searchQuery, selectedCategory]);

    // Group SSDs by category
    const groupedSsds = useMemo(() => {
        const groups: Record<string, Ssd[]> = {};
        filteredSsds.forEach((ssd) => {
            if (!groups[ssd.category]) {
                groups[ssd.category] = [];
            }
            groups[ssd.category].push(ssd);
        });
        return groups;
    }, [filteredSsds]);

    // Debounced search - updates URL without reload for bookmarkability
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const params = new URLSearchParams();
            if (searchQuery) params.set('search', searchQuery);
            if (selectedCategory !== 'semua') params.set('category', selectedCategory);
            
            const newUrl = params.toString() ? `/ssd?${params.toString()}` : '/ssd';
            window.history.replaceState({}, '', newUrl);
        }, 300);
        
        return () => clearTimeout(timeoutId);
    }, [searchQuery, selectedCategory]);

    const handleSearch = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        // Search is already handled client-side via filteredSsds useMemo
    }, []);

    const handleCategoryChange = useCallback((category: string) => {
        setSelectedCategory(category);
        // Filtering is handled client-side via filteredSsds useMemo - no reload needed
    }, []);

    const categoryLabels: Record<string, string> = {
        'umum': 'Umum',
        'layanan': 'Layanan',
        'ppid': 'PPID',
        'teknis': 'Teknis',
    };

    return (
        <PublicLayout>
            <Head title="Soal Sering Ditanya (SSD)" />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-[#1a5580] via-[#1e6091] to-[#2980b9] text-white overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full" />
                    <div className="absolute bottom-10 right-10 w-48 h-48 border-2 border-white rounded-full" />
                    <div className="absolute top-1/2 left-1/4 w-24 h-24 border border-white/50 rounded-full" />
                </div>

                <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20 relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-6">
                            <MessageCircleQuestion className="w-4 h-4" />
                            <span>Pusat Bantuan</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                            Soal Sering Ditanya
                        </h1>
                        <p className="text-lg sm:text-xl text-white/80 mb-8">
                            Temukan jawaban atas pertanyaan yang sering diajukan tentang layanan Balai Bahasa Sulawesi Tenggara
                        </p>

                        {/* Search Box */}
                        <form onSubmit={handleSearch} className="max-w-xl mx-auto">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Cari pertanyaan..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-24 py-4 rounded-xl text-gray-900 bg-white shadow-lg focus:outline-none focus:ring-4 focus:ring-white/30 transition-all"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors"
                                >
                                    Cari
                                </button>
                            </div>
                        </form>

                        {/* Stats */}
                        <div className="flex justify-center gap-8 mt-8">
                            <div className="text-center">
                                <div className="text-3xl font-bold">{ssds.length}</div>
                                <div className="text-sm text-white/70">Pertanyaan</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold">{categories.length}</div>
                                <div className="text-sm text-white/70">Kategori</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Wave Decoration */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 100" fill="none" className="w-full h-auto">
                        <path d="M0 50L60 45C120 40 240 30 360 35C480 40 600 60 720 65C840 70 960 60 1080 50C1200 40 1320 30 1380 25L1440 20V100H1380C1320 100 1200 100 1080 100C960 100 840 100 720 100C600 100 480 100 360 100C240 100 120 100 60 100H0V50Z" fill="white"/>
                    </svg>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-8 sm:py-12 lg:py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-2 justify-center mb-8">
                        <button
                            onClick={() => handleCategoryChange('semua')}
                            className={cn(
                                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                                selectedCategory === 'semua'
                                    ? "bg-blue-600 text-white shadow-md"
                                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                            )}
                        >
                            Semua
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => handleCategoryChange(cat)}
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-medium transition-all",
                                    selectedCategory === cat
                                        ? "bg-blue-600 text-white shadow-md"
                                        : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                                )}
                            >
                                {categoryLabels[cat] || cat}
                            </button>
                        ))}
                    </div>

                    {/* Results Count */}
                    <div className="text-center text-sm text-gray-500 mb-6">
                        Menampilkan {filteredSsds.length} dari {ssds.length} pertanyaan
                    </div>

                    {/* FAQ Accordion */}
                    <div className="max-w-3xl mx-auto">
                        {filteredSsds.length > 0 ? (
                            <Accordion
                                type="multiple"
                                value={expandedItems}
                                onValueChange={setExpandedItems}
                                className="space-y-3"
                            >
                                {filteredSsds.map((ssd, index) => (
                                    <AccordionItem
                                        key={ssd.id}
                                        value={ssd.id}
                                        className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                                    >
                                        <AccordionTrigger className="px-5 py-4 hover:no-underline group">
                                            <div className="flex items-start gap-4 text-left">
                                                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                    <HelpCircle className="w-4 h-4 text-blue-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                                        {ssd.question}
                                                    </h3>
                                                    <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-gray-100 text-gray-500 rounded">
                                                        {categoryLabels[ssd.category] || ssd.category}
                                                    </span>
                                                </div>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="px-5 pb-5">
                                            <div className="pl-12 text-gray-600 leading-relaxed whitespace-pre-wrap">
                                                {ssd.answer}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        ) : (
                            <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                                <MessageCircleQuestion className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Tidak ada pertanyaan ditemukan
                                </h3>
                                <p className="text-gray-500">
                                    Coba gunakan kata kunci lain atau pilih kategori berbeda
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Contact CTA */}
                    <div className="max-w-3xl mx-auto mt-12">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-center text-white">
                            <h3 className="text-xl sm:text-2xl font-bold mb-3">
                                Tidak menemukan jawaban?
                            </h3>
                            <p className="text-blue-100 mb-6">
                                Hubungi kami langsung dan tim kami akan dengan senang hati membantu Anda.
                            </p>
                            <a
                                href="/kontak"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
                            >
                                Hubungi Kami
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
