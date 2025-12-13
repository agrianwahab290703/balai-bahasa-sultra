import React, { useState, useEffect } from 'react';
import { Link, Head } from '@inertiajs/react';
import { PublicLayout } from '@/Layouts/PublicLayout';
import { Card, CardContent } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import GaleriFotoBerita from '@/Components/Berita/GaleriFotoBerita';
import { 
    Calendar, 
    Eye, 
    BookOpen, 
    ChevronLeft,
    Clock,
    Share2,
    Copy,
    Check,
    ArrowLeft,
    User,
    Tag,
    ChevronRight,
    ArrowUpRight,
    MessageCircle,
    Bookmark,
    Printer,
    ExternalLink
} from 'lucide-react';

// Social Media Share Icons as SVG Components
const FacebookIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
);

const TwitterIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
);

const WhatsAppIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
);

const ThreadsIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01c.028-3.576.878-6.43 2.523-8.481C5.845 1.205 8.598.024 12.179 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.055 7.164 1.43 1.781 3.631 2.695 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.182.408-2.256 1.332-3.025.85-.707 2.117-1.166 3.564-1.292.927-.08 1.876-.046 2.82.102-.058-.465-.157-.855-.293-1.17-.376-.865-1.09-1.305-2.123-1.308-1.263.003-2.16.59-2.515 1.65l-1.923-.56c.532-1.81 2.181-2.963 4.438-2.963.015 0 .03 0 .045.001 1.604.013 2.831.597 3.545 1.687.523.8.77 1.822.735 3.044-.013.422-.044.823-.092 1.202 1.074.588 1.9 1.347 2.451 2.263.76 1.26.91 2.76.424 4.229-.67 2.029-2.383 3.772-4.942 5.033-1.628.803-3.463 1.222-5.457 1.248zM8.49 15.278c.005.578.268 1.088.739 1.435.56.414 1.33.612 2.164.556 1.09-.059 1.964-.448 2.599-1.155.493-.55.839-1.3 1.032-2.232-.723-.152-1.469-.222-2.214-.209-1.894.035-3.268.565-3.664 1.413-.138.296-.114.502.025.735-.026-.183-.667-.543-.681-.543z"/>
    </svg>
);

interface BeritaDetail {
    id: number;
    judul_utama: string;
    slug: string;
    ringkasan_inti: string;
    hero_image: string;
    hero_image_alt: string;
    lokasi: string;
    tanggal_rilis: string;
    content: string; // This is now provided by controller
    // Keep other fields for reference if needed, though content covers most
    teras_berita: string;
    konteks_latar_belakang: string;
    quote_pejabat: string;
    nama_pejabat: string;
    jabatan_pejabat: string;
    kategori: string;
    sub_kategori: string;
    tag: string;
    view_count: number;
    author: string;
    created_at: string;
    updated_at: string;
}

interface GaleriFoto {
    id: number;
    berita_id: number;
    file_path: string;
    file_name: string;
    caption?: string;
    alt_text?: string;
    urutan: number;
    tipe: 'hero' | 'gallery' | 'thumbnail';
}

interface BeritaTerkait {
    id: number;
    judul_utama: string;
    slug: string;
    ringkasan_inti: string;
    created_at: string;
    hero_image?: string;
    kategori?: string;
    view_count?: number;
}

interface BeritaShowProps {
    berita: BeritaDetail;
    galeri: GaleriFoto[];
    beritaTerkait: BeritaTerkait[];
}

// Format relative time in Indonesian
const formatRelativeTime = (dateString: string): string => {
    // If dateString is already formatted like "12 Desember 2025", try to parse it
    // But since we can't easily parse Indonesian date strings back to Date objects in JS without a library,
    // we'll just return it if it looks like a formatted date.
    // For now, let's assume if it contains spaces it's already formatted.
    if (dateString && dateString.includes(' ')) return dateString;
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (isNaN(diffInSeconds)) return dateString; // Fallback

    if (diffInSeconds < 60) return 'Baru saja';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit lalu`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam lalu`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} hari lalu`;
    
    return date.toLocaleDateString('id-ID', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    });
};

// Format view count
const formatViewCount = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)} jt`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)} rb`;
    return count.toString();
};

// Calculate reading time (words per minute)
const calculateReadingTime = (content: string): number => {
    const wordsPerMinute = 200;
    // Strip HTML tags for accurate word count
    const cleanContent = content?.replace(/<[^>]*>/g, '') || '';
    const wordCount = cleanContent.split(/\s+/).length || 0;
    return Math.ceil(wordCount / wordsPerMinute);
};

export default function BeritaShow({ berita, galeri = [], beritaTerkait = [] }: BeritaShowProps) {
    const [copied, setCopied] = useState(false);
    const [currentUrl, setCurrentUrl] = useState('');

    useEffect(() => {
        setCurrentUrl(window.location.href);
    }, []);

    // Safety check - if berita is undefined, return null or loader
    if (!berita) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    const readingTime = calculateReadingTime(berita.content);

    // Share handlers
    const shareUrl = currentUrl;
    const shareTitle = berita.judul_utama;
    const shareText = berita.ringkasan_inti || berita.judul_utama;

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleShare = (platform: string) => {
        const encodedUrl = encodeURIComponent(shareUrl);
        const encodedTitle = encodeURIComponent(shareTitle);
        
        const shareUrls: Record<string, string> = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
            whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
            threads: `https://threads.net/intent/post?text=${encodedTitle}%20${encodedUrl}`,
        };

        if (shareUrls[platform]) {
            window.open(shareUrls[platform], '_blank', 'width=600,height=400');
        }
    };

    const handlePrint = () => {
        window.print();
    };

    // Helper for image URLs
    const getImageUrl = (url: string) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        if (url.startsWith('/')) return url;
        return `/${url}`;
    };

    return (
        <PublicLayout 
            title={berita.judul_utama}
            description={berita.ringkasan_inti}
        >
            <Head>
                {/* Open Graph Meta Tags */}
                <meta property="og:title" content={berita.judul_utama} />
                <meta property="og:description" content={berita.ringkasan_inti} />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={currentUrl} />
                {berita.hero_image && (
                    <meta property="og:image" content={getImageUrl(berita.hero_image)} />
                )}
                
                {/* Twitter Card Meta Tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={berita.judul_utama} />
                <meta name="twitter:description" content={berita.ringkasan_inti} />
                {berita.hero_image && (
                    <meta name="twitter:image" content={getImageUrl(berita.hero_image)} />
                )}
            </Head>

            {/* Enhanced Hero Section with Floating Title */}
            <section className="relative">
                {/* Background Image with Title Overlay */}
                <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden">
                    {berita.hero_image ? (
                        <>
                            <img
                                src={getImageUrl(berita.hero_image)}
                                alt={berita.hero_image_alt || berita.judul_utama}
                                className="h-full w-full object-cover"
                            />
                            {/* Enhanced gradient for better text readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent" />
                            {/* Subtle pattern overlay */}
                            <div className="absolute inset-0 bg-black/30" />
                        </>
                    ) : (
                        <div className="h-full w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <BookOpen className="h-24 w-24 text-white/10 mx-auto mb-4" />
                                    <p className="text-white/20 text-sm">Featured Image</p>
                                </div>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        </div>
                    )}

                    {/* Floating Title and Meta */}
                    <div className="absolute bottom-0 left-0 right-0">
                        <div className="container mx-auto px-4 pb-8">
                            <div className="max-w-4xl mx-auto">
                                {/* Back button overlay */}
                                <Link
                                    href="/berita"
                                    className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors backdrop-blur-sm bg-white/10 rounded-full px-4 py-2 border border-white/20"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Kembali ke Berita
                                </Link>

                                {/* Category badge */}
                                <div className="flex items-center gap-3 mb-4">
                                    <Badge className="bg-yellow-500 text-gray-900 border-0 font-semibold px-4 py-2 shadow-lg">
                                        <Tag className="w-4 h-4 mr-2" />
                                        {berita.kategori || 'Berita'}
                                    </Badge>
                                    <span className="text-white/90 text-sm font-medium">
                                        {formatRelativeTime(berita.tanggal_rilis)}
                                    </span>
                                </div>

                                {/* Title */}
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-6 drop-shadow-lg">
                                    {berita.judul_utama}
                                </h1>

                                {/* Author and Meta Info */}
                                <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-white/90">
                                    {/* Author */}
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                            <User className="w-5 h-5 text-white" />
                                        </div>
                                        <span className="font-medium">
                                            {berita.author || 'Tim Redaksi'}
                                        </span>
                                    </div>

                                    {/* Publish Date */}
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5 text-yellow-400" />
                                        <span>
                                            {berita.tanggal_rilis}
                                        </span>
                                    </div>

                                    {/* Reading Time */}
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-5 w-5 text-green-400" />
                                        <span>{readingTime} menit baca</span>
                                    </div>

                                    {/* View Count */}
                                    <div className="flex items-center gap-2">
                                        <Eye className="h-5 w-5 text-blue-400" />
                                        <span>{formatViewCount(berita.view_count || 0)} pembaca</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Enhanced Main Content */}
            <section className="bg-white py-12 lg:py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="grid lg:grid-cols-12 gap-12">
                            {/* Sidebar - Share & Actions (Desktop) */}
                            <aside className="hidden lg:block lg:col-span-1">
                                <div className="sticky top-32 flex flex-col items-center gap-4">
                                    {/* Share Label */}
                                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        Bagikan
                                    </span>

                                    {/* Enhanced Social Share Buttons */}
                                    <div className="flex flex-col items-center gap-3">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleShare('facebook')}
                                            className="w-12 h-12 rounded-full bg-blue-600 text-white hover:bg-blue-700 border-0 shadow-lg hover:shadow-xl transition-all"
                                            title="Bagikan ke Facebook"
                                        >
                                            <FacebookIcon className="w-5 h-5" />
                                        </Button>

                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleShare('twitter')}
                                            className="w-12 h-12 rounded-full bg-black text-white hover:bg-gray-900 border-0 shadow-lg hover:shadow-xl transition-all"
                                            title="Bagikan ke X (Twitter)"
                                        >
                                            <TwitterIcon className="w-5 h-5" />
                                        </Button>

                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleShare('whatsapp')}
                                            className="w-12 h-12 rounded-full bg-green-600 text-white hover:bg-green-700 border-0 shadow-lg hover:shadow-xl transition-all"
                                            title="Bagikan ke WhatsApp"
                                        >
                                            <WhatsAppIcon className="w-5 h-5" />
                                        </Button>

                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleShare('threads')}
                                            className="w-12 h-12 rounded-full bg-gray-900 text-white hover:bg-black border-0 shadow-lg hover:shadow-xl transition-all"
                                            title="Bagikan ke Threads"
                                        >
                                            <ThreadsIcon className="w-5 h-5" />
                                        </Button>
                                    </div>

                                    {/* Divider */}
                                    <div className="w-8 h-px bg-gray-300 my-2" />

                                    {/* Action Buttons */}
                                    <div className="flex flex-col items-center gap-3">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={handleCopyLink}
                                            className={`w-12 h-12 rounded-full transition-all border-2 ${
                                                copied
                                                    ? 'bg-green-100 text-green-600 border-green-400'
                                                    : 'bg-white hover:bg-gray-50 border-gray-300'
                                            }`}
                                            title={copied ? "Tersalin!" : "Salin Link"}
                                        >
                                            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                        </Button>

                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={handlePrint}
                                            className="w-12 h-12 rounded-full bg-white hover:bg-gray-50 border-2 border-gray-300 transition-all"
                                            title="Cetak Artikel"
                                        >
                                            <Printer className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </div>
                            </aside>

                            {/* Article Content */}
                            <article className="lg:col-span-11">
                                {/* Lead/Excerpt */}
                                {berita.ringkasan_inti && (
                                    <div className="mb-12">
                                        <p className="text-xl sm:text-2xl leading-relaxed text-gray-600 font-serif italic border-l-4 border-blue-600 pl-6 py-4 bg-blue-50/30 rounded-r-lg">
                                            {berita.ringkasan_inti}
                                        </p>
                                    </div>
                                )}

                                {/* Enhanced Article Content */}
                                <Card className="border-0 shadow-0 bg-transparent">
                                    <CardContent className="p-0">
                                        <div
                                            className="prose prose-lg max-w-none font-serif
                                                prose-headings:font-sans prose-headings:font-bold prose-headings:text-gray-900 prose-headings:mb-4 prose-headings:mt-8
                                                prose-h1:text-3xl prose-h1:mt-0
                                                prose-h2:text-2xl
                                                prose-h3:text-xl
                                                prose-p:text-gray-700 prose-p:leading-8 prose-p:mb-6 prose-p:text-lg
                                                prose-a:text-blue-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-a:transition-colors
                                                prose-img:rounded-2xl prose-img:shadow-xl prose-img:my-8 prose-img:border prose-img:border-gray-200
                                                prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-gradient-to-r prose-blockquote:from-blue-50 prose-blockquote:to-transparent prose-blockquote:py-6 prose-blockquote:px-6 prose-blockquote:rounded-lg prose-blockquote:not-italic prose-blockquote:text-gray-700
                                                prose-strong:text-gray-900 prose-strong:font-semibold
                                                prose-em:text-blue-600
                                                prose-ul:text-gray-700 prose-ul:space-y-2 prose-ul:list-disc
                                                prose-ol:text-gray-700 prose-ol:space-y-2 prose-ol:list-decimal
                                                prose-li:text-lg prose-li:leading-7
                                                prose-li:marker:text-blue-600 prose-li:marker:font-bold
                                                prose-code:bg-gray-100 prose-code:text-pink-600 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono
                                                prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-6 prose-pre:rounded-xl prose-pre:overflow-x-auto
                                                prose-hr:border-gray-200 prose-hr:my-12"
                                            dangerouslySetInnerHTML={{ __html: berita.content || '<p class="text-center text-gray-500 py-8">Konten artikel sedang dimuat...</p>' }}
                                        />

                                        {/* Enhanced Gallery Component */}
                                        <GaleriFotoBerita
                                            galeri={galeri}
                                            title="Galeri Foto Kegiatan"
                                        />

                                        {/* Categories/Tags */}
                                        {berita.tag && (
                                            <div className="mt-16 pt-8 border-t-2 border-gray-200">
                                                <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                                    <Tag className="w-5 h-5 text-blue-600" />
                                                    Tag Terkait
                                                </h4>
                                                <div className="flex flex-wrap gap-3">
                                                    {berita.tag.split(',').map((tag, idx) => (
                                                        <Link
                                                            key={idx}
                                                            href={`/berita?search=${encodeURIComponent(tag.trim())}`}
                                                            className="inline-block"
                                                        >
                                                            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-600 hover:text-white transition-all cursor-pointer px-4 py-2 text-sm font-medium border-0">
                                                                {tag.trim()}
                                                            </Badge>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Enhanced Mobile Share Bar */}
                                        <div className="lg:hidden mt-12 pt-8 border-t-2 border-gray-200">
                                            <h4 className="text-lg font-bold text-gray-900 mb-6">Bagikan Artikel:</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <Button
                                                    onClick={() => handleShare('facebook')}
                                                    className="gap-3 bg-blue-600 text-white hover:bg-blue-700 py-4 font-medium"
                                                >
                                                    <FacebookIcon className="w-5 h-5" />
                                                    Facebook
                                                </Button>
                                                <Button
                                                    onClick={() => handleShare('twitter')}
                                                    className="gap-3 bg-black text-white hover:bg-gray-900 py-4 font-medium"
                                                >
                                                    <TwitterIcon className="w-5 h-5" />
                                                    X (Twitter)
                                                </Button>
                                                <Button
                                                    onClick={() => handleShare('whatsapp')}
                                                    className="gap-3 bg-green-600 text-white hover:bg-green-700 py-4 font-medium"
                                                >
                                                    <WhatsAppIcon className="w-5 h-5" />
                                                    WhatsApp
                                                </Button>
                                                <Button
                                                    onClick={handleCopyLink}
                                                    className={`gap-3 py-4 font-medium border-2 ${
                                                        copied
                                                            ? 'bg-green-100 text-green-600 border-green-400'
                                                            : 'bg-white hover:bg-gray-50 border-gray-300'
                                                    }`}
                                                >
                                                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                                    {copied ? 'Tersalin!' : 'Salin Link'}
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Enhanced Author Card */}
                                <Card className="mt-12 border-0 shadow-xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                                    <CardContent className="p-8">
                                        <div className="flex flex-col sm:flex-row items-center gap-6">
                                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                                                <User className="w-10 h-10 text-white" />
                                            </div>
                                            <div className="text-center sm:text-left">
                                                <p className="text-sm text-gray-600 mb-2 font-medium">Tentang Penulis</p>
                                                <h4 className="font-bold text-gray-900 text-xl mb-1">{berita.author || 'Tim Redaksi Balai Bahasa Sultra'}</h4>
                                                <p className="text-gray-700">Balai Bahasa Provinsi Sulawesi Tenggara</p>
                                                <p className="text-sm text-gray-600 mt-2">Menyajikan informasi seputar bahasa, sastra, dan kebudayaan Indonesia</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </article>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related News */}
            {beritaTerkait && beritaTerkait.length > 0 && (
                <section className="bg-white py-12 lg:py-16">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                                    Berita <span className="text-blue-600">Terkait</span>
                                </h2>
                                <Link 
                                    href="/berita"
                                    className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                                >
                                    Lihat Semua
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {beritaTerkait.slice(0, 3).map((item) => (
                                    <Link key={item.id} href={`/berita/${item.slug}`}>
                                        <Card className="group h-full overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white">
                                            <div className="aspect-[16/10] w-full overflow-hidden bg-gray-100 relative">
                                                {item.hero_image ? (
                                                    <img 
                                                        src={getImageUrl(item.hero_image)}
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
                                            </div>
                                            
                                            <CardContent className="p-5">
                                                <Badge variant="secondary" className="mb-3 bg-blue-50 text-blue-600 text-xs">
                                                    {item.kategori || 'Berita'}
                                                </Badge>
                                                <h3 className="mb-2 line-clamp-2 text-base font-semibold leading-snug text-gray-900 group-hover:text-blue-600 transition-colors">
                                                    {item.judul_utama}
                                                </h3>
                                                <div className="flex items-center gap-3 text-xs text-gray-400">
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
                        </div>
                    </div>
                </section>
            )}

            {/* Back to News CTA */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-12">
                <div className="container mx-auto px-4 text-center">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
                        Jelajahi Berita Lainnya
                    </h3>
                    <p className="text-blue-100 mb-6 max-w-xl mx-auto">
                        Temukan informasi terbaru seputar kegiatan, program, dan perkembangan kebahasaan
                    </p>
                    <Link href="/berita">
                        <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold">
                            <BookOpen className="w-4 h-4 mr-2" />
                            Lihat Semua Berita
                        </Button>
                    </Link>
                </div>
            </section>
        </PublicLayout>
    );
}