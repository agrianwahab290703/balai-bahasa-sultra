import React, { useState } from 'react';
import { Card, CardContent } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { cn } from '@/lib/utils';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import {
    FileDownloadIcon,
    ArrowUpRight01Icon,
    File01Icon,
    BookOpen02Icon,
    UserMultipleIcon,
    GraduationScrollIcon,
    LanguageCircleIcon,
    LibraryIcon,
    DatabaseIcon,
    StarIcon,
    Loading03Icon,
    Calendar03Icon,
    Download04Icon,
} from 'hugeicons-react';

export interface DocumentItem {
    id: number;
    title: string;
    description: string;
    category: string;
    url: string;
    file_type: string;
    file_size: number | null;
    formatted_file_size: string;
    download_count: number;
    updated_at: string;
}

interface DocumentCardProps {
    document: DocumentItem;
    index: number;
    onDownload?: (doc: DocumentItem) => void;
    onPreview?: (doc: DocumentItem) => void;
}

// Category configuration with colors and icons
const categoryConfig: Record<string, {
    icon: typeof File01Icon;
    gradient: string;
    light: string;
    text: string;
}> = {
    'Umum': {
        icon: File01Icon,
        gradient: 'from-blue-500 to-cyan-600',
        light: 'bg-blue-50',
        text: 'text-blue-600'
    },
    'UKBI': {
        icon: BookOpen02Icon,
        gradient: 'from-emerald-500 to-teal-600',
        light: 'bg-emerald-50',
        text: 'text-emerald-600'
    },
    'BIPA': {
        icon: UserMultipleIcon,
        gradient: 'from-violet-500 to-purple-600',
        light: 'bg-violet-50',
        text: 'text-violet-600'
    },
    'Ahli Bahasa': {
        icon: GraduationScrollIcon,
        gradient: 'from-amber-500 to-orange-600',
        light: 'bg-amber-50',
        text: 'text-amber-600'
    },
    'Penerjemah': {
        icon: LanguageCircleIcon,
        gradient: 'from-rose-500 to-pink-600',
        light: 'bg-rose-50',
        text: 'text-rose-600'
    },
    'Perpustakaan': {
        icon: LibraryIcon,
        gradient: 'from-indigo-500 to-blue-600',
        light: 'bg-indigo-50',
        text: 'text-indigo-600'
    },
    'Data & Informasi': {
        icon: DatabaseIcon,
        gradient: 'from-slate-500 to-gray-600',
        light: 'bg-slate-50',
        text: 'text-slate-600'
    },
};

export const DocumentCard: React.FC<DocumentCardProps> = ({
    document,
    index,
    onDownload,
    onPreview,
}) => {
    const { isMobile } = useDeviceDetection();
    const [isDownloading, setIsDownloading] = useState(false);
    
    const config = categoryConfig[document.category] || categoryConfig['Umum'];
    const IconComponent = config.icon;

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            if (onDownload) {
                await onDownload(document);
            } else {
                window.open(document.url, '_blank');
            }
        } finally {
            setTimeout(() => setIsDownloading(false), 500);
        }
    };

    const handlePreview = () => {
        if (onPreview) {
            onPreview(document);
        } else {
            window.open(document.url, '_blank');
        }
    };

    return (
        <Card className={cn(
            "group transition-all duration-300 border-0 bg-white overflow-hidden",
            "hover:shadow-xl hover:-translate-y-0.5",
            "touch-manipulation",
            isMobile && "active:scale-[0.98] active:shadow-lg"
        )}>
            <CardContent className="p-0">
                <div className="relative">
                    {/* Header Gradient Strip */}
                    <div className={cn(
                        "h-2 md:h-3 bg-gradient-to-r transition-all duration-300",
                        config.gradient,
                        "group-hover:h-3 md:group-hover:h-4"
                    )} />
                    
                    {/* Main Content */}
                    <div className={cn(
                        "p-4 md:p-6",
                        isMobile && "space-y-4"
                    )}>
                        <div className={cn(
                            "flex gap-3 md:gap-4",
                            isMobile ? "flex-col" : "items-start"
                        )}>
                            {/* Icon & Category - Row on Mobile */}
                            <div className={cn(
                                "flex items-center gap-3",
                                !isMobile && "shrink-0 flex-col items-center"
                            )}>
                                {/* Icon */}
                                <div className={cn(
                                    "rounded-xl md:rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110",
                                    config.light,
                                    isMobile ? "w-12 h-12" : "w-14 h-14"
                                )}>
                                    <IconComponent className={cn(
                                        isMobile ? "w-6 h-6" : "w-7 h-7",
                                        config.text
                                    )} />
                                </div>

                                {/* Category Badge - Mobile */}
                                {isMobile && (
                                    <Badge variant="secondary" className={cn(
                                        "text-xs font-medium",
                                        config.light,
                                        config.text
                                    )}>
                                        {document.category}
                                    </Badge>
                                )}
                            </div>

                            {/* Text Content */}
                            <div className="flex-1 min-w-0">
                                <h3 className={cn(
                                    "font-bold text-gray-900 group-hover:text-blue-600 transition-colors",
                                    isMobile ? "text-base leading-tight" : "text-lg mb-2",
                                    "line-clamp-2"
                                )}>
                                    {document.title}
                                </h3>
                                <p className={cn(
                                    "text-gray-600 leading-relaxed",
                                    isMobile ? "text-sm mt-2" : "text-sm",
                                    "line-clamp-2"
                                )}>
                                    {document.description}
                                </p>

                                {/* Meta Info */}
                                <div className={cn(
                                    "flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-500"
                                )}>
                                    <span className="flex items-center gap-1">
                                        <File01Icon className="w-3.5 h-3.5" />
                                        {document.formatted_file_size}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Download04Icon className="w-3.5 h-3.5" />
                                        {document.download_count} unduhan
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar03Icon className="w-3.5 h-3.5" />
                                        {document.updated_at}
                                    </span>
                                </div>
                            </div>

                            {/* Desktop Category Badge */}
                            {!isMobile && (
                                <div className="shrink-0">
                                    <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm shadow-sm border border-gray-100">
                                        <StarIcon className="w-3 h-3 mr-1 text-amber-400" />
                                        Dokumen Resmi
                                    </Badge>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className={cn(
                            "flex gap-2 md:gap-3",
                            isMobile ? "mt-4" : "mt-5"
                        )}>
                            <Button
                                onClick={handleDownload}
                                disabled={isDownloading}
                                className={cn(
                                    "flex-1 text-white shadow-lg hover:shadow-xl transition-all duration-300",
                                    `bg-gradient-to-r ${config.gradient}`,
                                    isMobile && "min-h-[44px] text-sm font-semibold"
                                )}
                            >
                                {isDownloading ? (
                                    <Loading03Icon className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <FileDownloadIcon className="w-4 h-4 mr-2" />
                                )}
                                {isDownloading ? 'Mengunduh...' : 'Unduh Dokumen'}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handlePreview}
                                className={cn(
                                    "border-gray-200 hover:bg-gray-50 hover:border-gray-300",
                                    isMobile && "min-h-[44px] min-w-[44px] p-0"
                                )}
                                title="Lihat di tab baru"
                            >
                                <ArrowUpRight01Icon className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default DocumentCard;
