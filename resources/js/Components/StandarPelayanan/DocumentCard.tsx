import React, { useState } from 'react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { cn } from '@/lib/utils';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import {
  FileDownloadIcon,
  ViewIcon,
  File02Icon,
  Link01Icon,
  Calendar03Icon,
  Download04Icon,
  Loading03Icon,
} from 'hugeicons-react';

export type DocumentSource = {
  type: 'file' | 'link';
  label: string;
};

export interface DocumentItem {
  id: number;
  title: string;
  description: string;
  url: string | null;
  file_type: string | null;
  file_size: number | null;
  formatted_file_size: string;
  download_count: number;
  updated_at: string;
  last_downloaded_at?: string | null;
  source: DocumentSource;
}

interface DocumentCardProps {
  document: DocumentItem;
  onDownload?: (doc: DocumentItem) => Promise<void> | void;
  onPreview?: (doc: DocumentItem) => void;
}

const SOURCE_CONFIG: Record<
  DocumentSource['type'],
  { icon: typeof File02Icon; iconBg: string; iconColor: string; badgeBg: string; badgeText: string }
> = {
  file: {
    icon: File02Icon,
    iconBg: 'bg-sky-100',
    iconColor: 'text-sky-600',
    badgeBg: 'bg-sky-50',
    badgeText: 'text-sky-700',
  },
  link: {
    icon: Link01Icon,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
  },
};

export const DocumentCard: React.FC<DocumentCardProps> = ({ document, onDownload, onPreview }) => {
  const { isMobile } = useDeviceDetection();
  const [isDownloading, setIsDownloading] = useState(false);

  const config = SOURCE_CONFIG[document.source.type];
  const Icon = config.icon;

  const handleDownload = async () => {
    if (!onDownload) {
      if (document.url) {
        window.open(document.url, '_blank');
      }
      return;
    }

    setIsDownloading(true);
    try {
      await onDownload(document);
    } finally {
      setTimeout(() => setIsDownloading(false), 400);
    }
  };

  const handlePreview = () => {
    onPreview?.(document);
  };

  return (
    <li className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:border-sky-300 hover:shadow-md">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
        {/* Icon */}
        <div
          className={cn(
            'flex h-14 w-14 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105',
            config.iconBg
          )}
        >
          <Icon className={cn('h-7 w-7', config.iconColor)} />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Badges */}
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge
              variant="secondary"
              className={cn('rounded-full px-3 py-0.5 text-xs font-medium', config.badgeBg, config.badgeText)}
            >
              {document.source.label}
            </Badge>
            {document.file_type && (
              <Badge variant="outline" className="rounded-full px-3 py-0.5 text-xs font-medium uppercase">
                {document.file_type}
              </Badge>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold leading-snug text-gray-900 group-hover:text-sky-700">
            {document.title}
          </h3>

          {/* Description */}
          {document.description && (
            <p className="mt-1.5 text-sm leading-relaxed text-gray-600 line-clamp-2">
              {document.description}
            </p>
          )}

          {/* Meta Info */}
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1.5">
              <File02Icon className="h-4 w-4" />
              {document.formatted_file_size}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Download04Icon className="h-4 w-4" />
              {document.download_count.toLocaleString('id-ID')} unduhan
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar03Icon className="h-4 w-4" />
              {document.updated_at}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 gap-2 sm:flex-col sm:items-end lg:flex-row">
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            size={isMobile ? 'lg' : 'default'}
            className={cn(
              'flex-1 gap-2 bg-sky-600 font-semibold text-white shadow-sm transition-all hover:bg-sky-700 hover:shadow-md sm:flex-initial',
              isMobile ? 'min-h-[48px] w-full' : 'min-w-[130px]'
            )}
          >
            {isDownloading ? (
              <Loading03Icon className="h-5 w-5 animate-spin" />
            ) : (
              <FileDownloadIcon className="h-5 w-5" />
            )}
            {isDownloading ? 'Mengunduh...' : 'Unduh'}
          </Button>
          <Button
            variant="outline"
            onClick={handlePreview}
            size={isMobile ? 'lg' : 'default'}
            className={cn(
              'gap-2 border-gray-300 font-medium text-gray-700 transition-all hover:border-sky-400 hover:bg-sky-50 hover:text-sky-700',
              isMobile ? 'min-h-[48px] flex-1' : 'min-w-[110px]'
            )}
          >
            <ViewIcon className="h-5 w-5" />
            Lihat Detail
          </Button>
        </div>
      </div>
    </li>
  );
};

export default DocumentCard;