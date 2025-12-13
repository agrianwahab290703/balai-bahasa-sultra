import React, { useState, useMemo, useRef } from 'react';
import { Link, router } from '@inertiajs/react';
import { PublicLayout } from '@/Layouts/PublicLayout';
import { Card, CardContent } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { cn } from '@/lib/utils';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import {
    DocumentCard,
    DocumentFilter,
    DocumentPreview,
    DocumentSkeleton,
    FloatingActionButton,
    type DocumentItem,
} from '@/Components/StandarPelayanan';
import {
    Search01Icon,
    SparklesIcon,
    File01Icon,
    CheckmarkCircle02Icon,
    BookOpen01Icon,
    UserMultipleIcon,
    FileDownloadIcon,
    BookOpen02Icon,
} from 'hugeicons-react';

interface Props {
    documents: DocumentItem[];
    categories: string[];
}

export default function StandarPelayananIndex({ documents, categories }: Props) {
    const { isMobile } = useDeviceDetection();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'name'>('latest');
    const [previewDocument, setPreviewDocument] = useState<DocumentItem | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Filter and sort documents
    const filteredDocuments = useMemo(() => {
        let result = documents.filter(doc => {
            const matchesSearch = 
                doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                doc.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = !selectedCategory || doc.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });

        // Sort
        switch (sortBy) {
            case 'popular':
                result = [...result].sort((a, b) => b.download_count - a.download_count);
                break;
            case 'name':
                result = [...result].sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'latest':
            default:
                // Already sorted by updated_at from backend
                break;
        }

        return result;
    }, [documents, searchQuery, selectedCategory, sortBy]);

    // Handle document download with tracking
    const handleDownload = async (doc: DocumentItem) => {
        try {
            const response = await fetch(`/standar-pelayanan/${doc.id}/download`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });
            
            if (response.ok) {
                window.open(doc.url, '_blank');
            }
        } catch (error) {
            // Fallback to direct open
            window.open(doc.url, '_blank');
        }
    };

    const handlePreview = (doc: DocumentItem) => {
        setPreviewDocument(doc);
    };

    const scrollToSearch = () => {
        searchInputRef.current?.focus();
        searchInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    return (
        <PublicLayout 
            title="Standar Pelayanan" 
            description="Standar Pelayanan Balai Bahasa Provinsi Sulawesi Tenggara - Dokumen kebijakan dan standar pelayanan publik"
        >
            {/* Hero Section - Simplified for Mobile */}
            <section className={cn(
                "relative bg-gradient-to-br from-[#0ea5e9] via-[#0284c7] to-[#0369a1] overflow-hidden",
                isMobile ? "py-12" : "py-20 lg:py-28"
            )}>
                {/* Background Decorations */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-cyan-300/20 rounded-full blur-3xl" />
                </div>

                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div 
                        className="absolute inset-0" 
                        style={{
                            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
                            backgroundSize: '32px 32px'
                        }}
                    />
                </div>

                <div className="container relative mx-auto px-4">
                    <div className={cn(
                        "mx-auto text-center",
                        isMobile ? "max-w-full" : "max-w-5xl"
                    )}>
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-4 md:mb-6">
                            <SparklesIcon className="w-4 h-4 text-cyan-200" />
                            <span className="text-xs md:text-sm font-medium text-white">Layanan Publik Terpercaya</span>
                        </div>

                        {/* Title */}
                        <h1 className={cn(
                            "font-black text-white tracking-tight mb-4 md:mb-6",
                            isMobile ? "text-3xl" : "text-4xl md:text-5xl lg:text-6xl"
                        )}>
                            Standar Pelayanan
                        </h1>
                        
                        <p className={cn(
                            "text-cyan-50 leading-relaxed mb-6 md:mb-8 max-w-3xl mx-auto",
                            isMobile ? "text-sm px-2" : "text-lg md:text-xl"
                        )}>
                            Dokumen resmi standar pelayanan Balai Bahasa Provinsi Sulawesi Tenggara
                        </p>

                        {/* Stats - Compact on Mobile */}
                        <div className={cn(
                            "flex items-center justify-center",
                            isMobile ? "gap-4" : "gap-6 md:gap-8"
                        )}>
                            <div className="flex items-center gap-2 text-white/90">
                                <div className={cn(
                                    "bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center",
                                    isMobile ? "w-8 h-8" : "w-10 h-10"
                                )}>
                                    <File01Icon className={cn(isMobile ? "w-4 h-4" : "w-5 h-5")} />
                                </div>
                                <div className="text-left">
                                    <div className={cn("font-bold", isMobile ? "text-lg" : "text-2xl")}>{documents.length}</div>
                                    <div className={cn("text-cyan-100", isMobile ? "text-xs" : "text-sm")}>Dokumen</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-white/90">
                                <div className={cn(
                                    "bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center",
                                    isMobile ? "w-8 h-8" : "w-10 h-10"
                                )}>
                                    <CheckmarkCircle02Icon className={cn(isMobile ? "w-4 h-4" : "w-5 h-5")} />
                                </div>
                                <div className="text-left">
                                    <div className={cn("font-bold", isMobile ? "text-lg" : "text-2xl")}>100%</div>
                                    <div className={cn("text-cyan-100", isMobile ? "text-xs" : "text-sm")}>Resmi</div>
                                </div>
                            </div>
                            {!isMobile && (
                                <div className="flex items-center gap-2 text-white/90">
                                    <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                        <BookOpen01Icon className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-2xl font-bold">Akses</div>
                                        <div className="text-sm text-cyan-100">Terbuka</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Wave Bottom */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" className="w-full h-auto text-gray-50 fill-current">
                        <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,100L1392,100C1344,100,1248,100,1152,100C1056,100,960,100,864,100C768,100,672,100,576,100C480,100,384,100,288,100C192,100,96,100,48,100L0,100Z"></path>
                    </svg>
                </div>
            </section>

            {/* Main Content */}
            <section className={cn(
                "bg-gray-50",
                isMobile ? "py-6" : "py-16 lg:py-20"
            )}>
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        {/* Search Bar */}
                        <div className={cn(
                            "animate-in fade-in slide-in-from-bottom-4 duration-700",
                            isMobile ? "mb-4" : "mb-8"
                        )}>
                            <div className={cn(
                                "relative mx-auto",
                                isMobile ? "max-w-full" : "max-w-2xl"
                            )}>
                                <Search01Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Cari dokumen standar pelayanan..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={cn(
                                        "w-full pl-12 pr-4 bg-white border border-gray-200 rounded-xl md:rounded-2xl",
                                        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                                        "shadow-sm hover:shadow-md transition-shadow",
                                        isMobile ? "py-3 text-sm" : "py-4"
                                    )}
                                />
                            </div>
                        </div>

                        {/* Filter Section */}
                        <div className={cn(
                            "animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100",
                            isMobile ? "mb-4" : "mb-8"
                        )}>
                            <DocumentFilter
                                categories={categories}
                                selectedCategory={selectedCategory}
                                onCategoryChange={setSelectedCategory}
                                sortBy={sortBy}
                                onSortChange={setSortBy}
                                resultCount={filteredDocuments.length}
                            />
                        </div>

                        {/* Info Card - Hidden on Mobile for cleaner UX */}
                        {!isMobile && (
                            <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 via-white to-cyan-50">
                                    <CardContent className="p-6 md:p-8">
                                        <div className="flex items-start gap-4 md:gap-6">
                                            <div className="shrink-0 w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
                                                <BookOpen02Icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-3">
                                                    Tentang Standar Pelayanan
                                                </h2>
                                                <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-3 md:mb-4">
                                                    Standar Pelayanan adalah tolok ukur yang dipergunakan sebagai pedoman penyelenggaraan pelayanan dan acuan penilaian kualitas pelayanan.
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">Transparan</Badge>
                                                    <Badge variant="secondary" className="bg-green-100 text-green-700">Akuntabel</Badge>
                                                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">Profesional</Badge>
                                                    <Badge variant="secondary" className="bg-orange-100 text-orange-700">Berkualitas</Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* Documents List */}
                        <div className="space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                            {/* Section Header */}
                            <div className="flex items-center justify-between">
                                <h2 className={cn(
                                    "font-bold text-gray-900",
                                    isMobile ? "text-lg" : "text-2xl"
                                )}>
                                    Dokumen
                                    <span className="ml-2 text-sm font-normal text-gray-500">
                                        ({filteredDocuments.length})
                                    </span>
                                </h2>
                            </div>

                            {/* Document Cards */}
                            {isLoading ? (
                                <DocumentSkeleton count={3} />
                            ) : filteredDocuments.length > 0 ? (
                                <div className="grid gap-4 md:gap-6">
                                    {filteredDocuments.map((doc, index) => (
                                        <DocumentCard
                                            key={doc.id}
                                            document={doc}
                                            index={index}
                                            onDownload={handleDownload}
                                            onPreview={handlePreview}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <Card className="border-0 shadow-lg">
                                    <CardContent className={cn(
                                        "text-center",
                                        isMobile ? "p-8" : "p-12"
                                    )}>
                                        <div className={cn(
                                            "bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4",
                                            isMobile ? "w-14 h-14" : "w-16 h-16"
                                        )}>
                                            <Search01Icon className={cn(
                                                "text-gray-400",
                                                isMobile ? "w-6 h-6" : "w-8 h-8"
                                            )} />
                                        </div>
                                        <h3 className={cn(
                                            "font-semibold text-gray-900 mb-2",
                                            isMobile ? "text-base" : "text-lg"
                                        )}>
                                            Tidak ada dokumen ditemukan
                                        </h3>
                                        <p className={cn(
                                            "text-gray-600",
                                            isMobile && "text-sm"
                                        )}>
                                            Coba gunakan kata kunci atau filter yang berbeda
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Additional Info Cards */}
                        <div className={cn(
                            "grid gap-4 md:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300",
                            isMobile ? "mt-6 grid-cols-1" : "mt-12 md:grid-cols-2"
                        )}>
                            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                                <CardContent className={cn(isMobile ? "p-4" : "p-6")}>
                                    <div className="flex items-start gap-3 md:gap-4">
                                        <div className={cn(
                                            "shrink-0 bg-emerald-100 rounded-xl flex items-center justify-center",
                                            isMobile ? "w-10 h-10" : "w-12 h-12"
                                        )}>
                                            <CheckmarkCircle02Icon className={cn(
                                                "text-emerald-600",
                                                isMobile ? "w-5 h-5" : "w-6 h-6"
                                            )} />
                                        </div>
                                        <div>
                                            <h3 className={cn(
                                                "font-bold text-gray-900 mb-1 md:mb-2",
                                                isMobile && "text-sm"
                                            )}>Dokumen Resmi</h3>
                                            <p className={cn(
                                                "text-gray-600 leading-relaxed",
                                                isMobile ? "text-xs" : "text-sm"
                                            )}>
                                                Semua dokumen telah ditetapkan dan disahkan sesuai peraturan yang berlaku.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                                <CardContent className={cn(isMobile ? "p-4" : "p-6")}>
                                    <div className="flex items-start gap-3 md:gap-4">
                                        <div className={cn(
                                            "shrink-0 bg-blue-100 rounded-xl flex items-center justify-center",
                                            isMobile ? "w-10 h-10" : "w-12 h-12"
                                        )}>
                                            <FileDownloadIcon className={cn(
                                                "text-blue-600",
                                                isMobile ? "w-5 h-5" : "w-6 h-6"
                                            )} />
                                        </div>
                                        <div>
                                            <h3 className={cn(
                                                "font-bold text-gray-900 mb-1 md:mb-2",
                                                isMobile && "text-sm"
                                            )}>Akses Terbuka</h3>
                                            <p className={cn(
                                                "text-gray-600 leading-relaxed",
                                                isMobile ? "text-xs" : "text-sm"
                                            )}>
                                                Seluruh dokumen dapat diunduh secara gratis untuk keperluan masyarakat.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className={cn(
                "bg-gradient-to-br from-blue-600 to-cyan-600",
                isMobile ? "py-10" : "py-16"
            )}>
                <div className="container mx-auto px-4">
                    <div className={cn(
                        "mx-auto text-center",
                        isMobile ? "max-w-full" : "max-w-4xl"
                    )}>
                        <h2 className={cn(
                            "font-bold text-white mb-3 md:mb-4",
                            isMobile ? "text-2xl" : "text-3xl md:text-4xl"
                        )}>
                            Butuh Informasi Lebih Lanjut?
                        </h2>
                        <p className={cn(
                            "text-blue-50 mb-6 md:mb-8",
                            isMobile ? "text-sm" : "text-lg"
                        )}>
                            Hubungi kami untuk konsultasi dan informasi detail
                        </p>
                        <div className={cn(
                            "flex gap-3 md:gap-4 justify-center",
                            isMobile ? "flex-col px-4" : "flex-row"
                        )}>
                            <Link href="/kontak" className={isMobile ? "w-full" : ""}>
                                <Button 
                                    size={isMobile ? "default" : "lg"} 
                                    className={cn(
                                        "bg-white text-blue-600 hover:bg-blue-50 shadow-xl",
                                        isMobile && "w-full min-h-[44px]"
                                    )}
                                >
                                    <UserMultipleIcon className="w-5 h-5 mr-2" />
                                    Hubungi Kami
                                </Button>
                            </Link>
                            <Link href="/layanan" className={isMobile ? "w-full" : ""}>
                                <Button 
                                    size={isMobile ? "default" : "lg"} 
                                    variant="outline" 
                                    className={cn(
                                        "border-white text-white hover:bg-white/10",
                                        isMobile && "w-full min-h-[44px]"
                                    )}
                                >
                                    <BookOpen01Icon className="w-5 h-5 mr-2" />
                                    Lihat Semua Layanan
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Document Preview Modal */}
            <DocumentPreview
                document={previewDocument}
                isOpen={!!previewDocument}
                onClose={() => setPreviewDocument(null)}
                onDownload={handleDownload}
            />

            {/* Floating Action Button (Mobile) */}
            <FloatingActionButton
                onOpenSearch={scrollToSearch}
            />
        </PublicLayout>
    );
}
