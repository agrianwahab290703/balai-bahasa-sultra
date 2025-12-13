import React, { useEffect } from 'react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { cn } from '@/lib/utils';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import type { DocumentItem } from './DocumentCard';
import {
    Cancel01Icon,
    FileDownloadIcon,
    ArrowUpRight01Icon,
    File01Icon,
    Calendar03Icon,
    Download04Icon,
} from 'hugeicons-react';

interface DocumentPreviewProps {
    document: DocumentItem | null;
    isOpen: boolean;
    onClose: () => void;
    onDownload?: (doc: DocumentItem) => void;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
    document,
    isOpen,
    onClose,
    onDownload,
}) => {
    const { isMobile } = useDeviceDetection();

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            globalThis.document.body.style.overflow = 'hidden';
        }
        return () => {
            globalThis.document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleEscape);
        }

        return () => {
            window.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen || !document) return null;

    const handleDownload = () => {
        if (onDownload) {
            onDownload(document);
        } else {
            window.open(document.url, '_blank');
        }
    };

    const handleOpenInNewTab = () => {
        window.open(document.url, '_blank');
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
                    "transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0"
                )}
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal */}
            <div
                className={cn(
                    "fixed z-50 bg-white rounded-t-2xl md:rounded-2xl shadow-2xl",
                    "transition-all duration-300 ease-out",
                    isMobile
                        ? "inset-x-0 bottom-0 max-h-[90vh]"
                        : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[85vh]",
                    isOpen
                        ? "opacity-100 translate-y-0 scale-100"
                        : "opacity-0 translate-y-4 scale-95"
                )}
                role="dialog"
                aria-modal="true"
            >
                {/* Drag Handle (Mobile) */}
                {isMobile && (
                    <div className="flex justify-center pt-2 pb-1">
                        <div className="w-10 h-1 bg-gray-300 rounded-full" />
                    </div>
                )}

                {/* Header */}
                <div className="flex items-start justify-between p-4 md:p-6 border-b border-gray-100">
                    <div className="flex-1 min-w-0 pr-4">
                        <Badge variant="secondary" className="mb-2 bg-blue-50 text-blue-700">
                            {document.category}
                        </Badge>
                        <h2 className={cn(
                            "font-bold text-gray-900",
                            isMobile ? "text-lg" : "text-xl"
                        )}>
                            {document.title}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className={cn(
                            "shrink-0 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors",
                            "touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                        )}
                        aria-label="Tutup"
                    >
                        <Cancel01Icon className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 md:p-6 space-y-4 overflow-y-auto max-h-[50vh]">
                    <p className="text-gray-600 leading-relaxed">
                        {document.description}
                    </p>

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1.5">
                            <File01Icon className="w-4 h-4" />
                            <span>{document.formatted_file_size}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Download04Icon className="w-4 h-4" />
                            <span>{document.download_count} unduhan</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Calendar03Icon className="w-4 h-4" />
                            <span>Diperbarui {document.updated_at}</span>
                        </div>
                    </div>

                    {/* PDF Preview (iframe) */}
                    <div className={cn(
                        "bg-gray-100 rounded-xl overflow-hidden",
                        isMobile ? "h-48" : "h-64"
                    )}>
                        <iframe
                            src={`${document.url}#toolbar=0&navpanes=0`}
                            className="w-full h-full border-0"
                            title={`Preview: ${document.title}`}
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className={cn(
                    "p-4 md:p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl",
                    "flex gap-3"
                )}>
                    <Button
                        onClick={handleDownload}
                        className={cn(
                            "flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg hover:shadow-xl",
                            isMobile && "min-h-[48px]"
                        )}
                    >
                        <FileDownloadIcon className="w-5 h-5 mr-2" />
                        Unduh Dokumen
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleOpenInNewTab}
                        className={cn(
                            "border-gray-200",
                            isMobile && "min-h-[48px] min-w-[48px] p-0"
                        )}
                    >
                        <ArrowUpRight01Icon className="w-5 h-5" />
                        {!isMobile && <span className="ml-2">Buka di Tab Baru</span>}
                    </Button>
                </div>
            </div>
        </>
    );
};

export default DocumentPreview;
