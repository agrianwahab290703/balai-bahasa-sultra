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
    File02Icon,
    Calendar03Icon,
    Download04Icon,
    Link01Icon,
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

    useEffect(() => {
        if (isOpen) {
            globalThis.document.body.style.overflow = 'hidden';
        }
        return () => {
            globalThis.document.body.style.overflow = '';
        };
    }, [isOpen]);

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
        if (!document.url) return;

        if (onDownload) {
            onDownload(document);
        } else {
            window.open(document.url, '_blank');
        }
    };

    const handleOpenInNewTab = () => {
        if (!document.url) return;
        window.open(document.url, '_blank');
    };

    const isFile = document.source.type === 'file';

    return (
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm',
                    'transition-opacity duration-300',
                    isOpen ? 'opacity-100' : 'opacity-0'
                )}
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal Container */}
            <div
                className={cn(
                    'fixed inset-0 z-50 flex items-center justify-center p-4',
                    isMobile && 'items-end p-0'
                )}
            >
                <div
                    className={cn(
                        'relative flex w-full flex-col bg-white shadow-2xl',
                        'transition-all duration-300 ease-out',
                        isMobile
                            ? 'max-h-[90vh] rounded-t-3xl'
                            : 'max-h-[85vh] max-w-2xl rounded-2xl',
                        isOpen
                            ? 'translate-y-0 scale-100 opacity-100'
                            : 'translate-y-4 scale-95 opacity-0'
                    )}
                    role="dialog"
                    aria-modal="true"
                    onClick={(e) => e.stopPropagation()}
                >
                {/* Drag Handle (Mobile) */}
                {isMobile && (
                    <div className="flex shrink-0 justify-center pb-2 pt-3">
                        <div className="h-1.5 w-12 rounded-full bg-gray-300" />
                    </div>
                )}

                {/* Header */}
                <div className="flex shrink-0 items-start justify-between border-b border-gray-100 p-5 md:p-6">
                    <div className="min-w-0 flex-1 pr-4">
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                            <Badge
                                variant="secondary"
                                className={cn(
                                    'rounded-full px-3 py-1',
                                    isFile
                                        ? 'bg-sky-50 text-sky-700'
                                        : 'bg-emerald-50 text-emerald-700'
                                )}
                            >
                                {isFile ? (
                                    <File02Icon className="mr-1.5 h-4 w-4" />
                                ) : (
                                    <Link01Icon className="mr-1.5 h-4 w-4" />
                                )}
                                {document.source.label}
                            </Badge>
                            {document.file_type && (
                                <Badge variant="outline" className="rounded-full px-3 py-1 uppercase">
                                    {document.file_type}
                                </Badge>
                            )}
                        </div>
                        <h2 className="text-xl font-bold leading-tight text-gray-900 md:text-2xl">
                            {document.title}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                        aria-label="Tutup"
                    >
                        <Cancel01Icon className="h-6 w-6" />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 space-y-5 overflow-y-auto p-5 md:p-6">
                    {document.description && (
                        <p className="leading-relaxed text-gray-600">{document.description}</p>
                    )}

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-4 rounded-xl bg-gray-50 p-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                            <File02Icon className="h-5 w-5 text-gray-400" />
                            <span className="font-medium">{document.formatted_file_size}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <Download04Icon className="h-5 w-5 text-gray-400" />
                            <span className="font-medium">
                                {document.download_count.toLocaleString('id-ID')} unduhan
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <Calendar03Icon className="h-5 w-5 text-gray-400" />
                            <span className="font-medium">{document.updated_at}</span>
                        </div>
                    </div>

                    {/* Preview Area */}
                    {isFile && document.url ? (
                        <div
                            className={cn(
                                'overflow-hidden rounded-xl border border-gray-200 bg-gray-100',
                                isMobile ? 'h-64' : 'h-80'
                            )}
                        >
                            <iframe
                                src={`${document.url}#toolbar=0&navpanes=0`}
                                className="h-full w-full border-0"
                                title={`Preview: ${document.title}`}
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-8 text-center">
                            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
                                <Link01Icon className="h-7 w-7 text-emerald-600" />
                            </div>
                            <p className="text-sm font-medium text-gray-700">
                                Dokumen ini merupakan tautan eksternal.
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                                Klik tombol di bawah untuk mengakses dokumen.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer Actions - Fixed at bottom */}
                <div className="flex shrink-0 gap-3 border-t border-gray-100 bg-gray-50 p-5 md:p-6">
                    <Button
                        onClick={handleDownload}
                        size="lg"
                        className={cn(
                            'flex-1 gap-2 bg-sky-600 font-semibold text-white shadow-md transition-all hover:bg-sky-700 hover:shadow-lg',
                            isMobile && 'min-h-[52px]'
                        )}
                    >
                        <FileDownloadIcon className="h-5 w-5" />
                        Unduh Dokumen
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleOpenInNewTab}
                        size="lg"
                        className={cn(
                            'gap-2 border-gray-300 font-medium text-gray-700 transition-all hover:border-sky-400 hover:bg-sky-50 hover:text-sky-700',
                            isMobile ? 'min-h-[52px] min-w-[52px] px-3' : 'min-w-[160px]'
                        )}
                    >
                        <ArrowUpRight01Icon className="h-5 w-5" />
                        {!isMobile && 'Buka Tab Baru'}
                    </Button>
                </div>
                </div>
            </div>
        </>
    );
};

export default DocumentPreview;