import React, { useState } from 'react';
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

    if (!galeri || galeri.length === 0) {
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
            ? (selectedImage - 1 + galeri.length) % galeri.length
            : (selectedImage + 1) % galeri.length;
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

    const getImageUrl = (url: string) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        if (url.startsWith('/')) return url;
        return `/${url}`;
    };

    return (
        <>
            {/* Gallery Grid */}
            <div className={`mt-16 pt-8 border-t-2 border-gray-200 ${className}`}>
                <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                    <span>📸</span> {title}
                </h3>

                {/* Mixed Layout: Hero image + grid */}
                {galeri.length > 0 && (
                    <div className="space-y-6">
                        {/* Hero Image (First image or marked as hero) */}
                        {(() => {
                            const heroImage = galeri.find(img => img.tipe === 'hero') || galeri[0];
                            if (!heroImage) return null;
                            return (
                                <div
                                    className="relative group overflow-hidden rounded-3xl bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer"
                                    onClick={() => openLightbox(galeri.indexOf(heroImage))}
                                >
                                    <div className="aspect-[16/10]">
                                        <img
                                            src={getImageUrl(heroImage.file_path)}
                                            alt={heroImage.caption || heroImage.alt_text || 'Foto utama'}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>
                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="bg-white/95 backdrop-blur-sm rounded-full p-4 shadow-2xl">
                                                <Maximize2 className="w-6 h-6 text-gray-800" />
                                            </div>
                                        </div>
                                    </div>
                                    {/* Caption */}
                                    {heroImage.caption && (
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
                                            <p className="text-white font-medium text-lg">{heroImage.caption}</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })()}

                        {/* Gallery Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {galeri
                                .filter((_, index) => {
                                    // Filter out the hero image from grid if it exists
                                    const heroImage = galeri.find(img => img.tipe === 'hero');
                                    return heroImage ? index !== galeri.indexOf(heroImage) : index !== 0;
                                })
                                .map((img, idx) => (
                                <div
                                    key={img.id}
                                    className="group relative overflow-hidden rounded-2xl bg-gray-50 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                                    onClick={() => openLightbox(galeri.indexOf(img))}
                                >
                                    <div className="aspect-[4/3]">
                                        <img
                                            src={getImageUrl(img.file_path)}
                                            alt={img.caption || img.alt_text || `Gambar ${idx + 1}`}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                    </div>
                )}

                {/* Photo info */}
                <div className="mt-6 text-center text-sm text-gray-500">
                    <p>Klik pada foto untuk melihat dalam ukuran penuh</p>
                </div>
            </div>

            {/* Lightbox */}
            {isFullscreen && selectedImage !== null && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm"
                    onClick={closeLightbox}
                    onKeyDown={handleKeyDown}
                    tabIndex={0}
                >
                    {/* Close button */}
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 z-50 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 transition-all"
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>

                    {/* Navigation */}
                    {galeri.length > 1 && (
                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigateImage('prev');
                                }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 z-40 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 transition-all"
                            >
                                <ChevronLeft className="w-6 h-6 text-white" />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigateImage('next');
                                }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 z-40 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 transition-all"
                            >
                                <ChevronRight className="w-6 h-6 text-white" />
                            </button>
                        </>
                    )}

                    {/* Image container */}
                    <div className="flex items-center justify-center h-full p-8">
                        <div className="relative max-w-7xl max-h-full">
                            <img
                                src={getImageUrl(galeri[selectedImage].file_path)}
                                alt={galeri[selectedImage].caption || galeri[selectedImage].alt_text || 'Foto'}
                                className="max-w-full max-h-[80vh] object-contain rounded-lg"
                                onClick={(e) => e.stopPropagation()}
                            />

                            {/* Caption */}
                            {galeri[selectedImage].caption && (
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-6 rounded-b-lg">
                                    <p className="text-white text-center font-medium text-lg">
                                        {galeri[selectedImage].caption}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Photo counter */}
                    {galeri.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                            <p className="text-white text-sm font-medium">
                                {selectedImage + 1} / {galeri.length}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}