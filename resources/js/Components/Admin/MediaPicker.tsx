import React, { useState, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/Components/ui/dialog';
import {
  Search,
  Upload,
  Image as ImageIcon,
  FileText,
  Check,
  X,
  Loader2,
  Grid,
  List,
} from 'lucide-react';
import { useImageUpload } from '@/hooks/useImageUpload';

/**
 * Media item from the server
 */
export interface MediaItem {
  id: number;
  filename: string;
  path: string;
  url: string;
  mime_type: string;
  size: number;
  thumbnail_url?: string;
  width?: number;
  height?: number;
  created_at: string;
}

/**
 * MediaPicker component props
 * @see Requirements 8.4, 12.2
 */
export interface MediaPickerProps {
  /** Whether the picker modal is open */
  open: boolean;
  /** Callback when modal is closed */
  onClose: () => void;
  /** Callback when media is selected */
  onSelect: (url: string, media?: MediaItem) => void;
  /** Whether to allow multiple selection */
  multiple?: boolean;
  /** Accepted file types filter */
  accept?: string[];
  /** Title for the modal */
  title?: string;
}

/**
 * Format file size for display
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Check if a MIME type is an image
 */
function isImage(mimeType: string): boolean {
  return mimeType.startsWith('image/');
}

/**
 * MediaPicker modal component
 * Allows selecting existing media from the library or uploading new files
 * 
 * @see Requirements 8.4, 12.2
 * 
 * @example
 * ```tsx
 * <MediaPicker
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   onSelect={(url) => {
 *     editor.insertImage(url);
 *     setIsOpen(false);
 *   }}
 * />
 * ```
 */
export const MediaPicker: React.FC<MediaPickerProps> = ({
  open,
  onClose,
  onSelect,
  multiple = false,
  accept = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  title = 'Select Media',
}) => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<MediaItem[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch media from the server
   */
  const fetchMedia = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (accept.length > 0) params.append('type', 'image');
      
      const response = await fetch(`/admin/media?${params.toString()}`, {
        headers: {
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch media');
      }
      
      const data = await response.json();
      setMedia(data.data || data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load media');
      setMedia([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, accept]);

  const { uploadImage, isUploading, error: uploadError } = useImageUpload({
    context: 'media_library',
    onUploadComplete: () => {
      // Refresh media list after upload
      setLoading(true);
      setError(null);
      fetchMedia();
    },
  });

  // Fetch media when modal opens or search query changes
  useEffect(() => {
    if (open) {
      setSelectedItems([]);
      fetchMedia();
    }
  }, [open]); // fetchMedia already handles searchQuery changes internally

  /**
   * Handle file upload from input
   */
  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      try {
        await uploadImage(files[i]);
      } catch (err) {
        console.error('Upload failed:', err);
      }
    }

    // Reset input
    event.target.value = '';
  }, [uploadImage]);

  /**
   * Handle media item selection
   */
  const handleItemClick = useCallback((item: MediaItem) => {
    if (multiple) {
      setSelectedItems(prev => {
        const isSelected = prev.some(i => i.id === item.id);
        if (isSelected) {
          return prev.filter(i => i.id !== item.id);
        }
        return [...prev, item];
      });
    } else {
      setSelectedItems([item]);
    }
  }, [multiple]);

  /**
   * Handle confirm selection
   */
  const handleConfirm = useCallback(() => {
    if (selectedItems.length === 0) return;
    
    if (multiple) {
      selectedItems.forEach(item => {
        onSelect(item.url, item);
      });
    } else {
      onSelect(selectedItems[0].url, selectedItems[0]);
    }
    
    onClose();
  }, [selectedItems, multiple, onSelect, onClose]);

  /**
   * Check if an item is selected
   */
  const isSelected = useCallback((item: MediaItem) => {
    return selectedItems.some(i => i.id === item.id);
  }, [selectedItems]);

  return (
    <Dialog open={open} onOpenChange={(isOpen: boolean) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl h-[70vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {/* Toolbar */}
        <div className="flex items-center gap-4 py-2 border-b">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search media..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-1 border rounded-md p-1">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8 w-8 p-0"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Upload button */}
          <div className="relative">
            <input
              type="file"
              accept={accept.join(',')}
              onChange={handleFileUpload}
              multiple={multiple}
              className="absolute inset-0 opacity-0 cursor-pointer"
              disabled={isUploading}
            />
            <Button variant="outline" disabled={isUploading}>
              {isUploading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              Upload
            </Button>
          </div>
        </div>

        {/* Error display */}
        {(error || uploadError) && (
          <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-md text-sm">
            {error || uploadError}
          </div>
        )}

        {/* Media grid/list */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : media.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <ImageIcon className="h-12 w-12 mb-2" />
              <p>No media found</p>
              <p className="text-sm">Upload some files to get started</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-4 gap-4 p-4">
              {media.map((item) => (
                <MediaGridItem
                  key={item.id}
                  item={item}
                  selected={isSelected(item)}
                  onClick={() => handleItemClick(item)}
                />
              ))}
            </div>
          ) : (
            <div className="divide-y">
              {media.map((item) => (
                <MediaListItem
                  key={item.id}
                  item={item}
                  selected={isSelected(item)}
                  onClick={() => handleItemClick(item)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Selected Items Preview */}
        {selectedItems.length > 0 && (
          <div className="border-t pt-4 flex-shrink-0">
            <p className="text-sm font-medium mb-2">Selected ({selectedItems.length})</p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {selectedItems.map((item) => (
                <div
                  key={item.id}
                  className="relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border group"
                >
                  {isImage(item.mime_type) ? (
                    <img
                      src={item.thumbnail_url || item.url}
                      alt={item.filename}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <FileText className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedItems(prev => prev.filter(i => i.id !== item.id));
                    }}
                    className="absolute top-0 right-0 bg-destructive text-destructive-foreground rounded-bl p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <DialogFooter className="border-t pt-4 flex-shrink-0 bg-background">
          <div className="flex items-center justify-between w-full">
            <span className="text-sm text-muted-foreground">
              {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={selectedItems.length === 0}
              >
                Select
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


/**
 * Grid item component for media display
 */
interface MediaGridItemProps {
  item: MediaItem;
  selected: boolean;
  onClick: () => void;
}

const MediaGridItem: React.FC<MediaGridItemProps> = ({ item, selected, onClick }) => {
  const isImageFile = isImage(item.mime_type);

  return (
    <div
      onClick={onClick}
      className={cn(
        'relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all',
        'hover:border-primary/50',
        selected ? 'border-primary ring-2 ring-primary/20' : 'border-transparent'
      )}
    >
      {isImageFile ? (
        <img
          src={item.thumbnail_url || item.url}
          alt={item.filename}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-muted">
          <FileText className="h-12 w-12 text-muted-foreground" />
        </div>
      )}
      
      {/* Selection indicator */}
      {selected && (
        <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
          <Check className="h-4 w-4" />
        </div>
      )}
      
      {/* Filename overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
        <p className="text-white text-xs truncate">{item.filename}</p>
      </div>
    </div>
  );
};

/**
 * List item component for media display
 */
interface MediaListItemProps {
  item: MediaItem;
  selected: boolean;
  onClick: () => void;
}

const MediaListItem: React.FC<MediaListItemProps> = ({ item, selected, onClick }) => {
  const isImageFile = isImage(item.mime_type);

  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-center gap-4 p-4 cursor-pointer transition-colors',
        'hover:bg-muted/50',
        selected && 'bg-primary/5'
      )}
    >
      {/* Thumbnail */}
      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
        {isImageFile ? (
          <img
            src={item.thumbnail_url || item.url}
            alt={item.filename}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{item.filename}</p>
        <p className="text-sm text-muted-foreground">
          {formatFileSize(item.size)}
          {item.width && item.height && ` • ${item.width}×${item.height}`}
        </p>
        <p className="text-xs text-muted-foreground">
          {new Date(item.created_at).toLocaleDateString()}
        </p>
      </div>

      {/* Selection indicator */}
      <div className={cn(
        'w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0',
        selected ? 'border-primary bg-primary' : 'border-muted-foreground'
      )}>
        {selected && <Check className="h-4 w-4 text-primary-foreground" />}
      </div>
    </div>
  );
};

export default MediaPicker;
