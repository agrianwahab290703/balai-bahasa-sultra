import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import {
    Building2,
    FileText,
    ChevronRight,
    X,
    ZoomIn,
    ArrowLeft,
    ArrowRight,
    Maximize2,
    Loader
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type ProfileSection = {
    id: number;
    title: string;
    content: string;
    images?: string[] | null;
    image_urls?: string[] | null;
};

interface KedudukanProps {
    sections?: ProfileSection[];
}

const Kedudukan = ({ sections = [] }: KedudukanProps) => {
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const [currentSectionImages, setCurrentSectionImages] = useState<string[]>([]);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState<number | null>(null);
    const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set());
    const sectionRefs = useRef<(HTMLElement | null)[]>([]);

    // Calculate scroll progress
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = Math.min(scrollTop / docHeight, 1);
            setScrollProgress(progress);

            // Update active section for sticky navigation
            const sectionElements = sectionRefs.current.filter(Boolean);
            const current = sectionElements.find((el) => {
                if (!el) return false;
                const rect = el.getBoundingClientRect();
                return rect.top <= 100 && rect.bottom > 100;
            });

            if (current) {
                const index = sectionElements.indexOf(current);
                setActiveSection(index);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle image loading states
    const handleImageLoad = useCallback((src: string) => {
        setLoadingImages(prev => {
            const newSet = new Set(prev);
            newSet.delete(src);
            return newSet;
        });
    }, []);

    const handleImageLoadStart = useCallback((src: string) => {
        setLoadingImages(prev => new Set(prev).add(src));
    }, []);

    // Enhanced lightbox handlers
    const openLightbox = useCallback((imageSrc: string, allImages: string[], index: number = 0) => {
        setCurrentSectionImages(allImages);
        setCurrentImageIndex(index);
        setLightboxImage(imageSrc);
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }, []);

    const closeLightbox = useCallback(() => {
        setLightboxImage(null);
        setCurrentSectionImages([]);
        setCurrentImageIndex(0);
        // Restore body scroll
        document.body.style.overflow = 'unset';
    }, []);

    // Keyboard navigation for lightbox
    useEffect(() => {
        if (!lightboxImage) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    navigateImage(-1);
                    break;
                case 'ArrowRight':
                    navigateImage(1);
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxImage, currentImageIndex, currentSectionImages]);

    const navigateImage = useCallback((direction: number) => {
        if (currentSectionImages.length === 0) return;

        const newIndex = currentImageIndex + direction;
        if (newIndex < 0 || newIndex >= currentSectionImages.length) return;

        setCurrentImageIndex(newIndex);
        setLightboxImage(currentSectionImages[newIndex]);
    }, [currentImageIndex, currentSectionImages]);

    // Smooth scroll to section
    const scrollToSection = useCallback((index: number) => {
        sectionRefs.current[index]?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }, []);

    return (
        <PublicLayout>
            <Head>
                <title>Kedudukan, Tugas & Fungsi - Balai Bahasa Sultra</title>
                <meta name="description" content="Kedudukan, tugas, dan fungsi Balai Bahasa Provinsi Sulawesi Tenggara" />
            </Head>

            {/* Scroll Progress Bar */}
            <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
                <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
                    style={{ width: `${scrollProgress * 100}%` }}
                />
            </div>

            {/* Sticky Navigation (for sections) */}
            {sections.length > 0 && (
                <motion.div
                    initial={{ y: -100 }}
                    animate={{ y: scrollProgress > 0.1 ? 0 : -100 }}
                    className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40 bg-white/90 backdrop-blur-md rounded-full shadow-lg px-4 py-2 flex items-center gap-1 border border-gray-100"
                >
                    {sections.map((section, index) => (
                        <button
                            key={section.id}
                            onClick={() => scrollToSection(index)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                                activeSection === index
                                    ? 'bg-blue-500 text-white scale-110'
                                    : 'text-gray-500 hover:bg-gray-100'
                            }`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </motion.div>
            )}

            {/* Enhanced Lightbox Modal */}
            <AnimatePresence>
                {lightboxImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md"
                        onClick={closeLightbox}
                    >
                        {/* Navigation Buttons */}
                        {currentSectionImages.length > 1 && (
                            <>
                                <button
                                    className="absolute left-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigateImage(-1);
                                    }}
                                    disabled={currentImageIndex === 0}
                                >
                                    <ArrowLeft className="w-6 h-6" />
                                </button>
                                <button
                                    className="absolute right-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigateImage(1);
                                    }}
                                    disabled={currentImageIndex === currentSectionImages.length - 1}
                                >
                                    <ArrowRight className="w-6 h-6" />
                                </button>
                            </>
                        )}

                        {/* Close Button */}
                        <button
                            className="absolute top-4 right-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                            onClick={closeLightbox}
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Image Counter */}
                        {currentSectionImages.length > 1 && (
                            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                                {currentImageIndex + 1} / {currentSectionImages.length}
                            </div>
                        )}

                        {/* Main Image */}
                        <motion.img
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            key={lightboxImage}
                            src={lightboxImage}
                            alt="Preview"
                            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />

                        {/* Thumbnail Strip */}
                        {currentSectionImages.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 p-2 bg-black/50 backdrop-blur-sm rounded-full">
                                {currentSectionImages.map((url, index) => (
                                    <button
                                        key={index}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentImageIndex(index);
                                            setLightboxImage(url);
                                        }}
                                        className={`w-12 h-12 rounded-md overflow-hidden border-2 transition-all ${
                                            index === currentImageIndex
                                                ? 'border-white scale-110'
                                                : 'border-transparent hover:border-white/50'
                                        }`}
                                    >
                                        <img
                                            src={url}
                                            alt={`Thumbnail ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Keyboard Hint */}
                        <div className="absolute bottom-4 right-4 text-white/60 text-sm">
                            Use arrow keys to navigate
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
                {/* Hero Section */}
                <section className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800" />
                    <div className="absolute inset-0 opacity-30">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }} />
                    </div>
                    
                    <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

                    <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
                        <div className="max-w-4xl mx-auto text-center">
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 text-blue-200 text-sm mb-8"
                            >
                                <span>Beranda</span>
                                <ChevronRight className="w-4 h-4" />
                                <span>Profil</span>
                                <ChevronRight className="w-4 h-4" />
                                <span className="text-white font-medium">Kedudukan, Tugas & Fungsi</span>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, type: 'spring' }}
                                className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl mb-8 border border-white/20 shadow-2xl"
                            >
                                <Building2 className="w-10 h-10 text-white" />
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
                            >
                                Kedudukan, Tugas
                                <span className="block text-blue-200">&amp; Fungsi</span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-lg sm:text-xl text-blue-100/90 max-w-2xl mx-auto leading-relaxed"
                            >
                                Memahami peran strategis dan tanggung jawab Balai Bahasa Provinsi Sulawesi Tenggara dalam pembinaan dan pengembangan bahasa Indonesia
                            </motion.p>
                        </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0">
                        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f8fafc"/>
                        </svg>
                    </div>
                </section>

                {/* Content Section */}
                <section className="relative py-16 lg:py-24">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        {sections && sections.length > 0 ? (
                            <div className="space-y-12 lg:space-y-16">
                                {sections.map((section, index) => {
                                    const imageUrls = (section.image_urls || section.images || []) as string[];
                                    const hasImages = Array.isArray(imageUrls) && imageUrls.length > 0;
                                    const isEven = index % 2 === 0;

                                    return (
                                        <motion.article
                                            key={section.id}
                                            ref={(el) => (sectionRefs.current[index] = el)}
                                            initial={{ opacity: 0, y: 40 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true, margin: '-50px' }}
                                            transition={{ duration: 0.6, ease: 'easeOut' }}
                                            className="scroll-mt-24" // Offset for sticky nav
                                        >
                                            {/* Card Container */}
                                            <div className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-blue-100/30 transition-all duration-500">

                                                {hasImages ? (
                                                    /* ========== Enhanced Layout WITH Images ========== */
                                                    <div className={`flex flex-col ${imageUrls.length === 1 ? 'lg:grid lg:grid-cols-2' : ''}`}>
                                                        {/* Content Side */}
                                                        <div className={`p-6 sm:p-8 lg:p-10 ${imageUrls.length === 1 && !isEven ? 'lg:order-2' : ''}`}>
                                                            {/* Header with Badge */}
                                                            <div className="flex items-start gap-4 mb-6">
                                                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-lg font-bold shadow-lg shadow-blue-500/30">
                                                                    {String(index + 1).padStart(2, '0')}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full mb-2 uppercase tracking-wide">
                                                                        Bagian {index + 1}
                                                                    </span>
                                                                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                                                                        {section.title}
                                                                    </h2>
                                                                </div>
                                                            </div>

                                                            {/* Content */}
                                                            <div
                                                                className="prose prose-gray max-w-none
                                                                    prose-headings:text-gray-900 prose-headings:font-semibold prose-headings:mb-3
                                                                    prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-4
                                                                    prose-ul:pl-5 prose-ul:my-3 prose-ul:space-y-1
                                                                    prose-ol:pl-5 prose-ol:my-3 prose-ol:space-y-1
                                                                    prose-li:text-gray-600 prose-li:leading-relaxed
                                                                    prose-strong:text-gray-900 prose-strong:font-semibold
                                                                    prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                                                                    [&_ul]:list-disc
                                                                    [&_ol.list-decimal]:list-decimal
                                                                    [&_ol.list-alpha-lower]:list-[lower-alpha]
                                                                    [&_ol.list-alpha-upper]:list-[upper-alpha]
                                                                    [&_ol.list-roman-lower]:list-[lower-roman]
                                                                    [&_ol.list-roman-upper]:list-[upper-roman]
                                                                    [&_ol]:list-decimal"
                                                                dangerouslySetInnerHTML={{ __html: section.content }}
                                                            />
                                                        </div>

                                                        {/* Enhanced Image Layout */}
                                                        <div className={`${imageUrls.length === 1 && !isEven ? 'lg:order-1' : ''}`}>
                                                            {imageUrls.length === 1 ? (
                                                                /* Single Large Image */
                                                                <div
                                                                    className="relative h-64 sm:h-80 lg:h-full lg:min-h-[400px] cursor-pointer group"
                                                                    onClick={() => openLightbox(imageUrls[0], imageUrls, 0)}
                                                                >
                                                                    {/* Loading State */}
                                                                    {loadingImages.has(imageUrls[0]) && (
                                                                        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                                                                            <Loader className="w-8 h-8 text-gray-400 animate-spin" />
                                                                        </div>
                                                                    )}
                                                                    {/* Blur Placeholder */}
                                                                    <img
                                                                        src={imageUrls[0]}
                                                                        alt={section.title}
                                                                        className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                                                                        style={{
                                                                            filter: loadingImages.has(imageUrls[0]) ? 'blur(10px)' : 'none',
                                                                            opacity: loadingImages.has(imageUrls[0]) ? 0.5 : 1
                                                                        }}
                                                                        onLoadStart={() => handleImageLoadStart(imageUrls[0])}
                                                                        onLoad={() => handleImageLoad(imageUrls[0])}
                                                                        loading="lazy"
                                                                    />
                                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                                    <div className="absolute bottom-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg">
                                                                        <ZoomIn className="w-5 h-5 text-gray-700" />
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                /* Multiple Images Grid */
                                                                <div className={`grid gap-1 ${
                                                                    imageUrls.length === 2 ? 'grid-cols-2' :
                                                                    imageUrls.length === 3 ? 'grid-cols-2 lg:grid-cols-3 lg:grid-rows-2' :
                                                                    imageUrls.length >= 4 ? 'grid-cols-2 lg:grid-cols-2' : 'grid-cols-2'
                                                                }`}>
                                                                    {imageUrls.slice(0, 4).map((url, imgIndex) => {
                                                                        const isSpecialImage = imageUrls.length === 3 && imgIndex === 0;
                                                                        return (
                                                                            <div
                                                                                key={`${section.id}-${imgIndex}`}
                                                                                className={`relative h-40 sm:h-48 lg:h-52 cursor-pointer group overflow-hidden
                                                                                    ${isSpecialImage ? 'lg:col-span-2 lg:row-span-2' : ''}`}
                                                                                onClick={() => openLightbox(url, imageUrls, imgIndex)}
                                                                            >
                                                                                {/* Loading State */}
                                                                                {loadingImages.has(url) && (
                                                                                    <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
                                                                                        <Loader className="w-6 h-6 text-gray-400 animate-spin" />
                                                                                    </div>
                                                                                )}
                                                                                {/* Blur Placeholder */}
                                                                                <img
                                                                                    src={url}
                                                                                    alt={`${section.title} - ${imgIndex + 1}`}
                                                                                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110
                                                                                        ${loadingImages.has(url) ? 'blur-sm opacity-50' : ''}`}
                                                                                    onLoadStart={() => handleImageLoadStart(url)}
                                                                                    onLoad={() => handleImageLoad(url)}
                                                                                    loading="lazy"
                                                                                />
                                                                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                                                <div className="absolute bottom-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg">
                                                                                    <ZoomIn className="w-4 h-4 text-gray-700" />
                                                                                </div>
                                                                                {/* Image counter for more than 4 images */}
                                                                                {imgIndex === 3 && imageUrls.length > 4 && (
                                                                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-lg font-semibold">
                                                                                        +{imageUrls.length - 4}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    /* ========== Enhanced Layout WITHOUT Images ========== */
                                                    <div className="p-6 sm:p-8 lg:p-10">
                                                        {/* Header with Badge */}
                                                        <div className="flex items-start gap-4 mb-6">
                                                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-lg font-bold shadow-lg shadow-blue-500/30">
                                                                {String(index + 1).padStart(2, '0')}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full mb-2 uppercase tracking-wide">
                                                                    Bagian {index + 1}
                                                                </span>
                                                                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                                                                    {section.title}
                                                                </h2>
                                                            </div>
                                                        </div>

                                                        {/* Content - Single Column Layout */}
                                                        <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/60 via-white to-white">
                                                            <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-blue-500 via-blue-400 to-indigo-400" />
                                                            <div className="absolute -top-10 -right-8 w-32 h-32 rounded-full bg-blue-100/40 blur-3xl" />
                                                            <div className="absolute -bottom-12 right-6 w-36 h-36 rounded-full bg-indigo-100/40 blur-3xl" />

                                                            <div className="relative p-6 sm:p-8 lg:p-10">
                                                                <div
                                                                    className="prose prose-lg prose-gray max-w-none
                                                                        prose-headings:text-gray-900 prose-headings:font-semibold prose-headings:mb-3
                                                                        prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-4 prose-p:text-justify
                                                                        prose-ul:pl-6 prose-ul:my-4 prose-ul:space-y-2
                                                                        prose-ol:pl-6 prose-ol:my-4 prose-ol:space-y-2
                                                                        prose-li:text-gray-600 prose-li:leading-relaxed
                                                                        prose-strong:text-gray-900 prose-strong:font-semibold
                                                                        prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                                                                        [&_ul]:list-disc
                                                                        [&_ol.list-decimal]:list-decimal
                                                                        [&_ol.list-alpha-lower]:list-[lower-alpha]
                                                                        [&_ol.list-alpha-upper]:list-[upper-alpha]
                                                                        [&_ol.list-roman-lower]:list-[lower-roman]
                                                                        [&_ol.list-roman-upper]:list-[upper-roman]
                                                                        [&_ol]:list-decimal"
                                                                    dangerouslySetInnerHTML={{ __html: section.content }}
                                                                />

                                                                <div className="mt-8 flex items-center gap-3">
                                                                    <div className="h-[2px] flex-1 bg-gradient-to-r from-blue-200 via-blue-100 to-transparent" />
                                                                    <div className="text-[11px] tracking-[0.35em] text-blue-400 uppercase">Balai Bahasa</div>
                                                                    <div className="h-[2px] flex-1 bg-gradient-to-l from-indigo-200 via-indigo-100 to-transparent" />
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                )}
                                            </div>
                                        </motion.article>
                                    );
                                })}
                            </div>
                        ) : (
                            /* Empty State */
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="max-w-md mx-auto text-center py-20"
                            >
                                <div className="relative mb-8">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full blur-3xl" />
                                    <div className="relative w-24 h-24 mx-auto bg-gradient-to-br from-gray-100 to-gray-50 rounded-3xl flex items-center justify-center shadow-xl">
                                        <FileText className="w-10 h-10 text-gray-400" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                    Belum Ada Konten
                                </h3>
                                <p className="text-gray-500 leading-relaxed">
                                    Informasi mengenai kedudukan, tugas, dan fungsi sedang dalam persiapan. Silakan kunjungi kembali halaman ini.
                                </p>
                            </motion.div>
                        )}
                    </div>
                </section>

                {/* Bottom CTA Section */}
                {sections.length > 0 && (
                    <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-700">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="max-w-3xl mx-auto text-center text-white"
                            >
                                <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                                    Punya Pertanyaan?
                                </h2>
                                <p className="text-blue-100 mb-8 leading-relaxed">
                                    Jika Anda memiliki pertanyaan lebih lanjut mengenai kedudukan, tugas, dan fungsi Balai Bahasa, silakan hubungi kami.
                                </p>
                                <a
                                    href="/kontak"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-full hover:bg-blue-50 transition-all duration-300 shadow-xl shadow-blue-900/20 hover:shadow-blue-900/30 transform hover:scale-105"
                                >
                                    Hubungi Kami
                                    <ChevronRight className="w-5 h-5" />
                                </a>
                            </motion.div>
                        </div>
                    </section>
                )}

                {/* Back to Top Button */}
                <AnimatePresence>
                    {scrollProgress > 0.2 && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="fixed bottom-8 right-8 p-4 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-30 hover:scale-110"
                        >
                            <Maximize2 className="w-6 h-6" />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </PublicLayout>
    );
};

export default Kedudukan;
