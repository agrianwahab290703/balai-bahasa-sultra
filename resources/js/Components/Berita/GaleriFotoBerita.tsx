import React, { useMemo, useState } from 'react';
import { X, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/Components/ui/button';

interface GaleriItem {
    id: number;
    file_path: string;
    file_name: string;
    caption?: string;
    alt_text?: string;
    urutan: number;
    tipe: 'hero' | 'gallery' | 'thumbnail';
}

interface GaleriFotoBeritaProps {
    galeri: GaleriItem[];
    title?: string;
    className?: string;
}

export default function GaleriFotoBerita({
    galeri = [],
    title = 'Galeri Foto',
    className = ''
}: GaleriFotoBeritaProps) {
    const [selectedImage, setSelectedImage] = useState<number | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Use only "gallery" photos for this section. Hero image is already shown in the article header.
    // Also sort by urutan and enforce max 6 photos for consistent layout.
    const displayImages = useMemo(() => {
        if (!galeri || galeri.length === 0) return [];
        const galleryOnly = galeri.filter((img) => img.tipe === 'gallery');
        const source = galleryOnly.length > 0 ? galleryOnly : galeri;
        return [...source].sort((a, b) => (a.urutan ?? 0) - (b.urutan ?? 0)).slice(0, 6);
    }, [galeri]);

    if (!displayImages || displayImages.length === 0) {
        return null;
    }

    const openLightbox = (index: number) => {
        setSelectedImage(index);
        setIsFullscreen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setSelectedImage(null);
        setIsFullscreen(false);
        document.body.style.overflow = 'unset';
    };

    const navigateImage = (direction: 'prev' | 'next') => {
        if (selectedImage === null) return;

        const new_index = direction === 'prev'
            ? (selectedImage - 1 + displayImages.length) % displayImages.length
            : (selectedImage + 1) % displayImages.length;
        setSelectedImage(new_index);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isFullscreen) return;

        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                navigateImage('prev');
                break;
            case 'ArrowRight':
                navigateImage('next');
                break;
        }
    };

    const getImageUrl = (url: string | null | undefined): string => {
        if (!url || url.trim() === '') return '';
        // If already a full URL, return as-is
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        // If starts with /, return as-is
        if (url.startsWith('/')) return url;
        // If starts with storage/, add leading slash
        if (url.startsWith('storage/')) return `/${url}`;
        // Otherwise, assume it needs a leading slash
        return `/${url}`;
    };

    const count = displayImages.length;
    const gridColsClass = (() => {
        // Mobile: always 1 column for readability
        if (count === 1) return 'grid-cols-1';
        if (count === 2) return 'grid-cols-1 sm:grid-cols-2';
        if (count === 3) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
        if (count === 4) return 'grid-cols-1 sm:grid-cols-2';
        // 5–6
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    })();

    const aspectClass = count <= 2 ? 'aspect-[16/10]' : 'aspect-[4/3]';

    return (
        <>
            {/* Gallery Grid */}
            <div className={`mt-16 pt-8 border-t-2 border-gray-200 ${className}`}>
                <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                    <span>📸</span> {title}
                </h3>

                {/* Uniform Grid Layout (auto-adjust based on 1–6 photos) */}
                <div className={`grid ${gridColsClass} gap-4`}>
                    {displayImages.map((img, idx) => (
                                <div
                                    key={img.id}
                                    className="group relative overflow-hidden rounded-2xl bg-gray-50 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                            onClick={() => openLightbox(idx)}
                                >
                            <div className={aspectClass}>
                                        <img
                                            src={getImageUrl(img.file_path)}
                                            alt={img.caption || img.alt_text || `Gambar ${idx + 1}`}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    loading="lazy"
                                        />
                                    </div>
                                    {/* Quick view overlay */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <Maximize2 className="w-8 h-8 text-white drop-shadow-lg" />
                                        </div>
                                    </div>
                                    {/* Caption */}
                                    {img.caption && (
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                                            <p className="text-white text-sm font-medium line-clamp-2">{img.caption}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                {/* Photo info */}
                <div className="mt-6 text-center text-sm text-gray-500">
                    <p>Klik pada foto untuk melihat dalam ukuran penuh</p>
                </div>
            </div>

            {/* Lightbox */}
            {isFullscreen && selectedImage !== null && (
                <div
                    className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm"
                    onClick={closeLightbox}
                    onKeyDown={handleKeyDown}
                    tabIndex={0}
                >
                    {/* Close button */}
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 z-[210] bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 transition-all"
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>

                    {/* Navigation */}
                    {displayImages.length > 1 && (
                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigateImage('prev');
                                }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 z-[205] bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 transition-all"
                            >
                                <ChevronLeft className="w-6 h-6 text-white" />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigateImage('next');
                                }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 z-[205] bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 transition-all"
                            >
                                <ChevronRight className="w-6 h-6 text-white" />
                            </button>
                        </>
                    )}

                    {/* Image container */}
                    <div className="flex items-center justify-center h-full p-8">
                        <div className="relative max-w-7xl max-h-full">
                            <img
                                src={getImageUrl(displayImages[selectedImage].file_path)}
                                alt={displayImages[selectedImage].caption || displayImages[selectedImage].alt_text || 'Foto'}
                                className="max-w-full max-h-[80vh] object-contain rounded-lg"
                                onClick={(e) => e.stopPropagation()}
                            />

                            {/* Caption */}
                            {displayImages[selectedImage].caption && (
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-6 rounded-b-lg">
                                    <p className="text-white text-center font-medium text-lg">
                                        {displayImages[selectedImage].caption}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Photo counter */}
                    {displayImages.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                            <p className="text-white text-sm font-medium">
                                {selectedImage + 1} / {displayImages.length}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}