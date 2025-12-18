import React, { useState } from 'react';
import { PublicLayout } from '@/Layouts/PublicLayout';
import { Card, CardContent } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/Components/ui/carousel';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/Components/ui/sheet';
import { Image, Calendar, X, ChevronLeft, ChevronRight, Camera, ZoomIn } from 'lucide-react';

interface GalleryItem {
    id: number;
    title: string;
    description: string;
    image: string;
    category: string;
    date: string;
}

interface GaleriProps {
    galleries: GalleryItem[];
    categories: string[];
}

export default function Galeri({ galleries = [], categories = [] }: GaleriProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
    const [lightboxOpen, setLightboxOpen] = useState(false);

    const filteredGalleries = selectedCategory === 'all' 
        ? galleries 
        : galleries.filter(g => g.category === selectedCategory);

    const openLightbox = (item: GalleryItem) => {
        setSelectedImage(item);
        setLightboxOpen(true);
    };

    return (
        <PublicLayout title="Galeri">
            {/* Hero Section - Different style */}
            <section className="relative bg-gradient-to-br from-[#0c4a6e] via-[#1e6091] to-[#0369a1] py-20">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl" />
                </div>
                <div className="container relative mx-auto px-4">
                    <div className="max-w-3xl">
                        <Badge className="mb-4 bg-yellow-400/90 text-gray-900 font-medium px-4 py-1.5">
                            <Camera className="w-3.5 h-3.5 mr-1.5" />
                            Dokumentasi
                        </Badge>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
                            Galeri <span className="font-display italic text-yellow-400">Foto</span>
                        </h1>
                        <p className="text-lg text-blue-100 max-w-2xl">
                            Dokumentasi visual kegiatan, acara, dan momen penting Balai Bahasa Sulawesi Tenggara
                        </p>
                    </div>
                </div>
                {/* Wave decoration */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                        <path d="M0 60L48 55C96 50 192 40 288 35C384 30 480 30 576 32.5C672 35 768 40 864 42.5C960 45 1056 45 1152 42.5C1248 40 1344 35 1392 32.5L1440 30V60H1392C1344 60 1248 60 1152 60C1056 60 960 60 864 60C768 60 672 60 576 60C480 60 384 60 288 60C192 60 96 60 48 60H0Z" fill="white"/>
                    </svg>
                </div>
            </section>


            {/* Category Filter */}
            <section className="bg-white py-8 border-b shadow-sm">
                <div className="container mx-auto px-4">
                    <div className="flex gap-2 flex-wrap justify-center">
                        <Button 
                            variant={selectedCategory === 'all' ? 'default' : 'outline'} 
                            size="sm"
                            onClick={() => setSelectedCategory('all')}
                            className={selectedCategory === 'all' ? 'bg-blue-600' : ''}
                        >
                            <Image className="w-4 h-4 mr-2" />
                            Semua Foto
                        </Button>
                        {categories.map((cat) => (
                            <Button 
                                key={cat} 
                                variant={selectedCategory === cat ? 'default' : 'outline'} 
                                size="sm"
                                onClick={() => setSelectedCategory(cat)}
                                className={selectedCategory === cat ? 'bg-blue-600' : ''}
                            >
                                {cat}
                            </Button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Gallery Grid */}
            <section className="bg-gray-50 py-14">
                <div className="container mx-auto px-4">
                    {filteredGalleries.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                            {filteredGalleries.map((item, index) => (
                                <Card 
                                    key={item.id} 
                                    className={`group cursor-pointer overflow-hidden border-0 shadow-md hover:shadow-2xl transition-all duration-500 ${index === 0 ? 'sm:col-span-2 sm:row-span-2' : ''}`}
                                    onClick={() => openLightbox(item)}
                                >
                                    <div className={`${index === 0 ? 'aspect-square' : 'aspect-square'} w-full overflow-hidden bg-gray-100 relative`}>
                                        <img 
                                            src={item.image} 
                                            alt={item.title}
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                                            <div>
                                                <h3 className="text-white font-medium text-sm sm:text-base line-clamp-1">{item.title}</h3>
                                                <p className="text-white/70 text-xs mt-1">{item.date}</p>
                                            </div>
                                            <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                                                <ZoomIn className="w-5 h-5 text-white" />
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="border-0 shadow-md">
                            <CardContent className="p-16 text-center">
                                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                                    <Image className="h-10 w-10 text-gray-300" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Belum Ada Foto</h3>
                                <p className="text-muted-foreground mb-6">Galeri foto akan segera tersedia</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </section>

            {/* Lightbox Sheet */}
            <Sheet open={lightboxOpen} onOpenChange={setLightboxOpen}>
                <SheetContent side="bottom" className="h-[90vh] p-0">
                    {selectedImage && (
                        <div className="h-full flex flex-col">
                            <SheetHeader className="p-4 border-b">
                                <SheetTitle>{selectedImage.title}</SheetTitle>
                                <SheetDescription>
                                    {selectedImage.description}
                                </SheetDescription>
                            </SheetHeader>
                            <div className="flex-1 flex items-center justify-center bg-black p-4">
                                <img 
                                    src={selectedImage.image} 
                                    alt={selectedImage.title}
                                    className="max-h-full max-w-full object-contain"
                                />
                            </div>
                            <div className="p-4 bg-white border-t">
                                <p className="text-sm text-muted-foreground">{selectedImage.description}</p>
                                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                    <Calendar className="h-3 w-3" />
                                    {selectedImage.date}
                                </div>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </PublicLayout>
    );
}
