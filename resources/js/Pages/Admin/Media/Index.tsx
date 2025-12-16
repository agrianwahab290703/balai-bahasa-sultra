import React, { useState, useCallback, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Badge } from '@/Components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/Components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/ui/select';
import { cn } from '@/lib/utils';
import {
  Search,
  Upload,
  Image as ImageIcon,
  FileText,
  Trash2,
  Grid,
  List,
  Loader2,
  Check,
  X,
  Eye,
  Download,
  AlertTriangle,
  FolderOpen,
  HardDrive,
  FileImage,
  Clock,
  Filter,
  Layers,
  CloudUpload,
  Sparkles,
  Zap,
  Shield,
} from 'lucide-react';

/**
 * Media item interface
 */
interface MediaItem {
  id: number;
  filename: string;
  path: string;
  url: string;
  mime_type: string;
  size: number;
  width?: number;
  height?: number;
  thumbnail_url?: string;
  usage_count: number;
  created_at: string;
}

/**
 * Paginated data interface
 */
interface PaginatedData<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

/**
 * Page props interface
 */
interface PageProps {
  media: PaginatedData<MediaItem>;
  filters: {
    search: string;
    type: string;
  };
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
 * Media Library Index Page
 * @see Requirements 8.1, 8.3
 */
export default function MediaIndex({ media, filters }: PageProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [typeFilter, setTypeFilter] = useState(filters.type || '');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Handle search
   */
  const handleSearch = useCallback(() => {
    router.get('/admin/media', {
      search: searchQuery,
      type: typeFilter,
    }, {
      preserveState: true,
      preserveScroll: true,
    });
  }, [searchQuery, typeFilter]);

  /**
   * Handle type filter change
   */
  const handleTypeChange = useCallback((value: string) => {
    setTypeFilter(value);
    router.get('/admin/media', {
      search: searchQuery,
      type: value === 'all' ? '' : value,
    }, {
      preserveState: true,
      preserveScroll: true,
    });
  }, [searchQuery]);

  /**
   * Handle file upload
   */
  const handleFileUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
    let uploaded = 0;
    const errors: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append('file', files[i]);
      formData.append('context', 'media_library');

      try {
        const response = await fetch('/admin/media/upload', {
          method: 'POST',
          headers: {
            'X-CSRF-TOKEN': csrfToken,
            'Accept': 'application/json',
          },
          body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
          const errorMsg = result.error || `Upload failed with status ${response.status}`;
          console.error('Upload failed:', result);
          errors.push(`File "${files[i].name}": ${errorMsg}`);
        } else if (!result.success) {
          console.error('Upload failed:', result);
          errors.push(`File "${files[i].name}": ${result.error || 'Unknown error'}`);
        } else {
          uploaded++;
          console.log('Upload successful:', result);
        }
      } catch (error) {
        console.error('Upload error:', error);
        errors.push(`File "${files[i].name}": Network error`);
      }

      setUploadProgress(Math.round(((i + 1) / files.length) * 100));
    }

    setIsUploading(false);
    setShowUploadModal(false);

    // Show success/error messages
    if (uploaded > 0) {
      const message = uploaded === 1
        ? '1 file uploaded successfully'
        : `${uploaded} files uploaded successfully`;

      if (errors.length > 0) {
        console.warn('Some files had errors:', errors);
      }

      // Refresh the page data without full reload
      router.get('/admin/media', {
        search: searchQuery || '',
        type: typeFilter || '',
      }, {
        preserveState: false, // Reset state to get fresh data
        preserveScroll: false,
        onSuccess: () => {
          // Optional: Show success message
          if (errors.length === 0) {
            // All files uploaded successfully
          } else {
            // Some files had errors - could show a toast here
          }
        },
      });
    } else {
      // All uploads failed
      console.error('All uploads failed:', errors);
      // Could show error toast here
    }
  }, [searchQuery, typeFilter, router]);


  /**
   * Handle item selection
   */
  const handleSelectItem = useCallback((id: number) => {
    setSelectedItems(prev => {
      if (prev.includes(id)) {
        return prev.filter(i => i !== id);
      }
      return [...prev, id];
    });
  }, []);

  /**
   * Handle select all
   */
  const handleSelectAll = useCallback(() => {
    if (selectedItems.length === media.data.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(media.data.map(item => item.id));
    }
  }, [selectedItems.length, media.data]);

  /**
   * Handle bulk delete
   */
  const handleBulkDelete = useCallback(async () => {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

    try {
      const response = await fetch('/admin/media/bulk-delete', {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': csrfToken,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: selectedItems }),
      });

      const result = await response.json();

      if (result.failed && result.failed.length > 0) {
        setDeleteError(`${result.deleted} file(s) deleted. ${result.failed.length} file(s) could not be deleted because they are in use.`);
      } else {
        setShowDeleteModal(false);
        setSelectedItems([]);
        router.reload({ only: ['media'] });
      }
    } catch (error) {
      setDeleteError('Failed to delete files');
    }
  }, [selectedItems]);

  /**
   * Handle single delete
   */
  const handleDelete = useCallback(async (item: MediaItem) => {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

    try {
      const response = await fetch(`/admin/media/${item.id}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-TOKEN': csrfToken,
          'Accept': 'application/json',
        },
      });

      const result = await response.json();

      if (!result.success) {
        setDeleteError(result.error || 'Failed to delete file');
        setShowDeleteModal(true);
      } else {
        router.reload({ only: ['media'] });
      }
    } catch (error) {
      setDeleteError('Failed to delete file');
      setShowDeleteModal(true);
    }
  }, []);

  /**
   * Handle view details
   */
  const handleViewDetails = useCallback((item: MediaItem) => {
    setSelectedMedia(item);
    setShowDetailModal(true);
  }, []);

  /**
   * Handle pagination
   */
  const handlePageChange = useCallback((page: number) => {
    router.get('/admin/media', {
      search: searchQuery,
      type: typeFilter,
      page,
    }, {
      preserveState: true,
      preserveScroll: true,
    });
  }, [searchQuery, typeFilter]);

  return (
    <AdminLayout
      title="Media Library"
      breadcrumbs={[{ label: 'Media Library' }]}
    >
      <Head title="Media Library" />

      {/* Hero Section with Enhanced Upload */}
      <div className="relative mb-12">
        {/* Soft background with subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl" />

        {/* Floating soft elements */}
        <div className="absolute top-8 left-8 w-20 h-20 rounded-full bg-blue-100 opacity-60 blur-xl animate-pulse" />
        <div className="absolute bottom-8 right-12 w-16 h-16 rounded-full bg-purple-100 opacity-50 blur-xl animate-pulse" style={{ animationDelay: '1s' }} />

        {/* Main content container */}
        <div className="relative bg-white/60 backdrop-blur-sm border border-white/20 rounded-3xl p-10 shadow-2xl shadow-blue-100/50">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-blue-50 rounded-full border border-blue-100">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-sm font-medium text-blue-700">Media Management</span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-blue-500 to-white bg-clip-text text-transparent leading-tight">
                Media Library
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Kelola upload file dan media dengan sistem yang
                <span className="font-semibold text-blue-600 mx-1">modern</span> dan
                <span className="font-semibold text-purple-600 mx-1">terorganisir</span>
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setShowUploadModal(true)}
                className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-500 hover:shadow-xl hover:shadow-blue-200/50 px-8 py-4 rounded-2xl font-medium text-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CloudUpload className="h-5 w-5 mr-3 relative z-10" />
                <span className="relative z-10">Upload Files</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Upload Section */}
      <div className="mb-8">
        <div
          className={cn(
            "relative bg-white/80 backdrop-blur-sm border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-500 overflow-hidden",
            "hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 hover:shadow-xl hover:shadow-blue-100/40",
            isDragging ? "border-blue-500 bg-blue-50 scale-[1.02]" : "border-gray-300 bg-white/60",
            isUploading && "pointer-events-none opacity-60"
          )}
          onClick={() => fileInputRef.current?.click()}
          onDragEnter={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(true);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
            handleFileUpload(e.dataTransfer.files);
          }}
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500" />
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/gif,application/pdf,.doc,.docx,.xls,.xlsx"
            onChange={(e) => handleFileUpload(e.target.files)}
            className="hidden"
          />

          <div className="relative z-10">
            {isUploading ? (
              <div className="space-y-6">
                <div className="relative mx-auto w-24 h-24">
                  <div className="absolute inset-0 bg-blue-100 rounded-full flex items-center justify-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                  </div>
                  <div className="absolute -inset-2 bg-blue-200 rounded-full animate-ping opacity-20" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-800">Uploading Files...</h3>
                  <p className="text-gray-600">Processing {uploadProgress}% complete</p>
                  <div className="w-full max-w-xs mx-auto bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative mx-auto w-24 h-24">
                  <div className={cn(
                    "absolute inset-0 rounded-full flex items-center justify-center transition-all duration-300",
                    isDragging ? "bg-blue-500 scale-110" : "bg-gradient-to-br from-blue-100 to-purple-100"
                  )}>
                    <CloudUpload className={cn(
                      "h-12 w-12 transition-colors duration-300",
                      isDragging ? "text-white" : "text-blue-600"
                    )} />
                  </div>
                  {isDragging && (
                    <div className="absolute -inset-4 bg-blue-200 rounded-full animate-ping opacity-30" />
                  )}
                </div>
                <div className="space-y-2">
                  <h3 className={cn(
                    "text-xl font-semibold transition-colors duration-300",
                    isDragging ? "text-blue-700" : "text-gray-800"
                  )}>
                    {isDragging ? 'Drop files here' : 'Click to upload or drag and drop'}
                  </h3>
                  <p className="text-gray-600">Support for images and documents</p>
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    <Badge variant="outline" className="px-3 py-1 bg-white/60 border-gray-200">
                      <FileImage className="h-3 w-3 mr-1" />
                      JPG
                    </Badge>
                    <Badge variant="outline" className="px-3 py-1 bg-white/60 border-gray-200">
                      <FileImage className="h-3 w-3 mr-1" />
                      PNG
                    </Badge>
                    <Badge variant="outline" className="px-3 py-1 bg-white/60 border-gray-200">
                      <FileImage className="h-3 w-3 mr-1" />
                      WebP
                    </Badge>
                    <Badge variant="outline" className="px-3 py-1 bg-white/60 border-gray-200">
                      <FileText className="h-3 w-3 mr-1" />
                      PDF
                    </Badge>
                    <Badge variant="outline" className="px-3 py-1 bg-white/60 border-gray-200">
                      <FileText className="h-3 w-3 mr-1" />
                      DOC
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-4 flex items-center justify-center gap-1">
                    <HardDrive className="h-3 w-3" />
                    Maximum file size: 10MB
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Toolbar */}
      <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-gray-100/30 p-6 mb-8">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search files by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="h-12 pl-12 pr-4 rounded-xl border-2 bg-white/70 backdrop-blur-sm border-gray-200 hover:border-gray-300 focus:border-blue-400 focus:shadow-lg focus:shadow-blue-100/50 transition-all duration-300"
            />
          </div>

          {/* Type filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={typeFilter || 'all'} onValueChange={handleTypeChange}>
              <SelectTrigger className="w-40 h-12 rounded-xl border-2 bg-white/70 backdrop-blur-sm border-gray-200 hover:border-gray-300 focus:border-blue-400 transition-all duration-300">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-2 border-gray-200 shadow-xl">
                <SelectItem value="all" className="rounded-lg hover:bg-blue-50">All Types</SelectItem>
                <SelectItem value="image" className="rounded-lg hover:bg-blue-50">Images</SelectItem>
                <SelectItem value="document" className="rounded-lg hover:bg-blue-50">Documents</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-1 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl p-1">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className={cn(
                "h-9 w-9 p-0 rounded-lg transition-all duration-300",
                viewMode === 'grid' ? 'bg-blue-100 text-blue-700 shadow-sm' : 'hover:bg-gray-100'
              )}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className={cn(
                "h-9 w-9 p-0 rounded-lg transition-all duration-300",
                viewMode === 'list' ? 'bg-blue-100 text-blue-700 shadow-sm' : 'hover:bg-gray-100'
              )}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          <Button
            onClick={handleSearch}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-100/50 px-6 py-3 rounded-xl font-medium"
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </div>

      {/* Enhanced Bulk Actions */}
      {selectedItems.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6 mb-8 shadow-lg shadow-blue-100/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center shadow-md">
                <Layers className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-semibold text-blue-800">
                  {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
                </span>
                <p className="text-sm text-blue-600">Ready for bulk actions</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setSelectedItems([])}
                className="bg-white/60 backdrop-blur-sm border-2 border-gray-200 hover:border-gray-300 hover:bg-white hover:shadow-md transition-all duration-300 px-4 py-2 rounded-xl"
              >
                Clear Selection
              </Button>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteModal(true)}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-300 hover:shadow-lg hover:shadow-red-100/50 px-4 py-2 rounded-xl"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Media Grid/List */}
      <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl shadow-xl shadow-gray-100/30 overflow-hidden">
        {media.data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full flex items-center justify-center">
                <FolderOpen className="h-12 w-12 text-gray-400" />
              </div>
              <div className="absolute -inset-4 bg-gray-100 rounded-full animate-pulse opacity-30" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Media Found</h3>
            <p className="text-gray-600 text-center max-w-md">
              Start by uploading some files using the drag-and-drop area above or click the Upload Files button.
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {media.data.map((item) => (
                <EnhancedMediaGridItem
                  key={item.id}
                  item={item}
                  selected={selectedItems.includes(item.id)}
                  onSelect={() => handleSelectItem(item.id)}
                  onView={() => handleViewDetails(item)}
                  onDelete={() => handleDelete(item)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200/50">
            <div className="flex items-center gap-4 px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50/30 text-sm font-semibold text-gray-700">
              <div className="w-8">
                <input
                  type="checkbox"
                  checked={selectedItems.length === media.data.length}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
              </div>
              <div className="w-20 text-center">Preview</div>
              <div className="flex-1">Filename</div>
              <div className="w-24">Type</div>
              <div className="w-24">Size</div>
              <div className="w-32">Date</div>
              <div className="w-28 text-center">Actions</div>
            </div>
            {media.data.map((item) => (
              <EnhancedMediaListItem
                key={item.id}
                item={item}
                selected={selectedItems.includes(item.id)}
                onSelect={() => handleSelectItem(item.id)}
                onView={() => handleViewDetails(item)}
                onDelete={() => handleDelete(item)}
              />
            ))}
          </div>
        )}

        {/* Enhanced Pagination */}
        {media.last_page > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200/50 bg-gradient-to-r from-gray-50 to-blue-50/30">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-800">
                {(media.current_page - 1) * media.per_page + 1}
              </span> to{' '}
              <span className="font-semibold text-gray-800">
                {Math.min(media.current_page * media.per_page, media.total)}
              </span>{' '}
              of <span className="font-semibold text-gray-800">{media.total}</span> items
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={media.current_page === 1}
                onClick={() => handlePageChange(media.current_page - 1)}
                className="bg-white/60 backdrop-blur-sm border-2 border-gray-200 hover:border-gray-300 hover:bg-white hover:shadow-md transition-all duration-300 px-4 py-2 rounded-xl"
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, media.last_page) }, (_, i) => {
                  const pageNum = i + 1;
                  const isCurrentPage = pageNum === media.current_page;
                  return (
                    <Button
                      key={pageNum}
                      variant={isCurrentPage ? "default" : "outline"}
                      onClick={() => handlePageChange(pageNum)}
                      className={cn(
                        "w-10 h-10 p-0 rounded-lg transition-all duration-300",
                        isCurrentPage
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-100/50"
                          : "bg-white/60 backdrop-blur-sm border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                      )}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                disabled={media.current_page === media.last_page}
                onClick={() => handlePageChange(media.current_page + 1)}
                className="bg-white/60 backdrop-blur-sm border-2 border-gray-200 hover:border-gray-300 hover:bg-white hover:shadow-md transition-all duration-300 px-4 py-2 rounded-xl"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Upload Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="sm:max-w-2xl bg-white/95 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl shadow-blue-100/40">
          {/* Modal Header with Gradient */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-t-3xl -m-6 mb-6">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <CloudUpload className="h-6 w-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-semibold text-white">Upload Files</DialogTitle>
                  <DialogDescription className="text-blue-100 text-sm">
                    Upload images or documents to the media library
                  </DialogDescription>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 px-6 pb-6">
            {/* Enhanced Upload Area */}
            <div
              className={cn(
                "relative bg-gradient-to-br from-blue-50 via-white to-purple-50 border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-500 overflow-hidden",
                "hover:border-blue-400 hover:shadow-xl hover:shadow-blue-100/40 hover:scale-[1.02]",
                isDragging ? "border-blue-500 bg-blue-50 scale-[1.02]" : "border-gray-300 bg-white/80",
                isUploading && "pointer-events-none opacity-60"
              )}
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(true);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(false);
                handleFileUpload(e.dataTransfer.files);
              }}
            >
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500" />
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/gif,application/pdf,.doc,.docx,.xls,.xlsx"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
              />

              <div className="relative z-10">
                {isUploading ? (
                  <div className="space-y-6">
                    <div className="relative mx-auto w-20 h-20">
                      <div className="absolute inset-0 bg-blue-100 rounded-full flex items-center justify-center">
                        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                      </div>
                      <div className="absolute -inset-2 bg-blue-200 rounded-full animate-ping opacity-20" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-gray-800">Uploading Files...</h3>
                      <p className="text-gray-600">Processing {uploadProgress}% complete</p>
                      <div className="w-full max-w-sm mx-auto bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative mx-auto w-20 h-20">
                      <div className={cn(
                        "absolute inset-0 rounded-full flex items-center justify-center transition-all duration-300",
                        isDragging ? "bg-blue-500 scale-110" : "bg-gradient-to-br from-blue-100 to-purple-100"
                      )}>
                        <CloudUpload className={cn(
                          "h-10 w-10 transition-colors duration-300",
                          isDragging ? "text-white" : "text-blue-600"
                        )} />
                      </div>
                      {isDragging && (
                        <div className="absolute -inset-4 bg-blue-200 rounded-full animate-ping opacity-30" />
                      )}
                    </div>
                    <div className="space-y-2">
                      <h3 className={cn(
                        "text-lg font-semibold transition-colors duration-300",
                        isDragging ? "text-blue-700" : "text-gray-800"
                      )}>
                        {isDragging ? 'Drop files here' : 'Click to upload or drag and drop'}
                      </h3>
                      <p className="text-gray-600">Support for images and documents</p>
                      <div className="flex flex-wrap justify-center gap-2 mt-3">
                        <Badge variant="outline" className="px-3 py-1 bg-white/60 border-gray-200">
                          <FileImage className="h-3 w-3 mr-1" />
                          JPG
                        </Badge>
                        <Badge variant="outline" className="px-3 py-1 bg-white/60 border-gray-200">
                          <FileImage className="h-3 w-3 mr-1" />
                          PNG
                        </Badge>
                        <Badge variant="outline" className="px-3 py-1 bg-white/60 border-gray-200">
                          <FileImage className="h-3 w-3 mr-1" />
                          WebP
                        </Badge>
                        <Badge variant="outline" className="px-3 py-1 bg-white/60 border-gray-200">
                          <FileText className="h-3 w-3 mr-1" />
                          PDF
                        </Badge>
                        <Badge variant="outline" className="px-3 py-1 bg-white/60 border-gray-200">
                          <FileText className="h-3 w-3 mr-1" />
                          DOC
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 mt-3 flex items-center justify-center gap-1">
                        <HardDrive className="h-3 w-3" />
                        Maximum file size: 10MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="px-6 pb-6">
            <Button
              variant="outline"
              onClick={() => setShowUploadModal(false)}
              disabled={isUploading}
              className="bg-white/60 backdrop-blur-sm border-2 border-gray-200 hover:border-gray-300 hover:bg-white hover:shadow-md hover:shadow-gray-100/50 px-6 py-2 rounded-xl font-medium transition-all duration-300"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    {/* Enhanced Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl shadow-red-100/30">
          <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-t-3xl -m-6 mb-6">
            <div className="flex items-center gap-3 text-white">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold text-white">Delete Files</DialogTitle>
                <DialogDescription className="text-red-100 text-sm">
                  This action cannot be undone
                </DialogDescription>
              </div>
            </div>
          </div>

          <div className="space-y-4 px-6 pb-6">
            <div className="bg-red-50/80 border border-red-200 rounded-2xl p-4">
              <p className="text-center text-gray-800">
                Are you sure you want to delete{' '}
                <span className="font-bold text-red-600">
                  {selectedItems.length} file{selectedItems.length !== 1 ? 's' : ''}
                </span>
                ?
              </p>
            </div>

            {deleteError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {deleteError}
              </div>
            )}
          </div>

          <DialogFooter className="px-6 pb-6">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false);
                setDeleteError(null);
              }}
              className="bg-white/60 backdrop-blur-sm border-2 border-gray-200 hover:border-gray-300 hover:bg-white hover:shadow-md hover:shadow-gray-100/50 px-6 py-2 rounded-xl font-medium transition-all duration-300"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-300 hover:shadow-lg hover:shadow-red-100/50 px-6 py-2 rounded-xl font-medium"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Enhanced Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="sm:max-w-4xl bg-white/95 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl shadow-blue-100/40">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-t-3xl -m-6 mb-6">
            <div className="flex items-center gap-3 text-white">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold text-white">Media Details</DialogTitle>
                <DialogDescription className="text-blue-100 text-sm">
                  View file information and properties
                </DialogDescription>
              </div>
            </div>
          </div>

          {selectedMedia && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-6 pb-6">
              {/* Enhanced Preview */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Preview</h3>
                <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200/50 overflow-hidden flex items-center justify-center shadow-lg">
                  {isImage(selectedMedia.mime_type) ? (
                    <img
                      src={selectedMedia.url}
                      alt={selectedMedia.filename}
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <div className="text-center">
                      <FileText className="h-24 w-24 text-gray-400 mx-auto mb-3" />
                      <span className="text-gray-600 font-medium">Document</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Enhanced Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">File Information</h3>
                <div className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Filename
                    </label>
                    <p className="text-sm text-gray-800 font-medium break-all bg-gray-50/80 px-3 py-2 rounded-lg">{selectedMedia.filename}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Type
                    </label>
                    <Badge variant="outline" className="w-fit px-3 py-1 bg-white/80 border-gray-200">
                      {selectedMedia.mime_type}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                      <HardDrive className="h-4 w-4" />
                      Size
                    </label>
                    <p className="text-sm text-gray-800 font-medium">{formatFileSize(selectedMedia.size)}</p>
                  </div>
                  {selectedMedia.width && selectedMedia.height && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        Dimensions
                      </label>
                      <p className="text-sm text-gray-800 font-medium">{selectedMedia.width} × {selectedMedia.height}</p>
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Usage Count
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <p className="text-sm text-gray-800 font-medium">
                        {selectedMedia.usage_count} reference{selectedMedia.usage_count !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Uploaded
                    </label>
                    <p className="text-sm text-gray-800 font-medium">{new Date(selectedMedia.created_at).toLocaleString()}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                      <CloudUpload className="h-4 w-4" />
                      URL
                    </label>
                    <Input value={selectedMedia.url} readOnly className="text-xs bg-gray-50/80 border-gray-200" />
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="px-6 pb-6">
            <Button
              variant="outline"
              onClick={() => setShowDetailModal(false)}
              className="bg-white/60 backdrop-blur-sm border-2 border-gray-200 hover:border-gray-300 hover:bg-white hover:shadow-md hover:shadow-gray-100/50 px-6 py-2 rounded-xl font-medium transition-all duration-300"
            >
              Close
            </Button>
            {selectedMedia && (
              <Button
                asChild
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-100/50 px-6 py-2 rounded-xl font-medium"
              >
                <a href={selectedMedia.url} download target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </a>
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}


/**
 * Enhanced Grid item component for media display
 */
interface MediaGridItemProps {
  item: MediaItem;
  selected: boolean;
  onSelect: () => void;
  onView: () => void;
  onDelete: () => void;
}

const EnhancedMediaGridItem: React.FC<MediaGridItemProps> = ({
  item,
  selected,
  onSelect,
  onView,
  onDelete,
}) => {
  const isImageFile = isImage(item.mime_type);

  return (
    <div
      className={cn(
        "group relative aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl",
        selected
          ? "border-blue-400 ring-4 ring-blue-100/50 shadow-lg shadow-blue-100/40"
          : "border-gray-200/50 hover:border-blue-300 shadow-lg shadow-gray-100/20"
      )}
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Thumbnail */}
      {isImageFile ? (
        <div className="relative w-full h-full">
          <img
            src={item.thumbnail_url || item.url}
            alt={item.filename}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <div className="text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-2" />
            <span className="text-xs text-gray-500 font-medium">Document</span>
          </div>
        </div>
      )}

      {/* Selection checkbox */}
      <div className="absolute top-3 left-3 z-10">
        <div className={cn(
          "w-6 h-6 rounded-lg border-2 bg-white/80 backdrop-blur-sm flex items-center justify-center transition-all duration-300",
          selected
            ? "border-blue-500 bg-blue-500"
            : "border-gray-300 hover:border-blue-400 hover:scale-110"
        )}>
          {selected && <Check className="h-3 w-3 text-white" />}
        </div>
        <input
          type="checkbox"
          checked={selected}
          onChange={onSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>

      {/* Usage indicator */}
      {item.usage_count > 0 && (
        <div className="absolute top-3 right-3 z-10">
          <div className="px-2 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-semibold rounded-full shadow-lg">
            {item.usage_count}
          </div>
        </div>
      )}

      {/* Hover overlay with actions */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-4">
        <div className="flex justify-end gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onView}
            className="h-8 w-8 p-0 bg-white/90 backdrop-blur-sm hover:bg-white hover:shadow-lg hover:shadow-gray-100/50 border border-white/20 rounded-lg transition-all duration-300"
          >
            <Eye className="h-4 w-4 text-gray-700" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={onDelete}
            className="h-8 w-8 p-0 bg-red-500/90 backdrop-blur-sm hover:bg-red-600 hover:shadow-lg hover:shadow-red-100/50 border border-red-400/20 rounded-lg transition-all duration-300"
          >
            <Trash2 className="h-4 w-4 text-white" />
          </Button>
        </div>

        <div className="text-white">
          <p className="text-sm font-medium truncate drop-shadow-lg">{item.filename}</p>
          <p className="text-xs opacity-80 mt-1">{formatFileSize(item.size)}</p>
        </div>
      </div>
    </div>
  );
};

/**
 * Enhanced List item component for media display
 */
interface MediaListItemProps {
  item: MediaItem;
  selected: boolean;
  onSelect: () => void;
  onView: () => void;
  onDelete: () => void;
}

const EnhancedMediaListItem: React.FC<MediaListItemProps> = ({
  item,
  selected,
  onSelect,
  onView,
  onDelete,
}) => {
  const isImageFile = isImage(item.mime_type);

  return (
    <div className={cn(
      "flex items-center gap-4 px-6 py-4 transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-purple-50/30 hover:shadow-md",
      selected && "bg-gradient-to-r from-blue-50/50 to-purple-50/50 border-l-4 border-blue-400 shadow-md"
    )}>
      {/* Checkbox */}
      <div className="w-8">
        <div className={cn(
          "w-5 h-5 rounded-lg border-2 bg-white/80 backdrop-blur-sm flex items-center justify-center transition-all duration-300",
          selected
            ? "border-blue-500 bg-blue-500"
            : "border-gray-300 hover:border-blue-400 hover:scale-110"
        )}>
          {selected && <Check className="h-3 w-3 text-white" />}
        </div>
        <input
          type="checkbox"
          checked={selected}
          onChange={onSelect}
          className="absolute opacity-0 cursor-pointer"
          style={{ width: '20px', height: '20px', marginLeft: '-20px' }}
        />
      </div>

      {/* Thumbnail */}
      <div className="w-20 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200/50 shadow-sm">
        {isImageFile ? (
          <img
            src={item.thumbnail_url || item.url}
            alt={item.filename}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
        )}
      </div>

      {/* Filename */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">{item.filename}</p>
        {item.usage_count > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <p className="text-xs text-gray-600">
              Used in {item.usage_count} place{item.usage_count !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>

      {/* Type */}
      <div className="w-28">
        <Badge variant="outline" className={cn(
          "px-3 py-1 text-xs font-medium rounded-full border-2",
          isImageFile
            ? "bg-green-50 text-green-700 border-green-200"
            : "bg-blue-50 text-blue-700 border-blue-200"
        )}>
          {isImageFile ? 'Image' : 'Document'}
        </Badge>
      </div>

      {/* Size */}
      <div className="w-24">
        <span className="text-sm text-gray-600 font-medium">{formatFileSize(item.size)}</span>
      </div>

      {/* Date */}
      <div className="w-32">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="h-3 w-3 text-gray-400" />
          <span>{new Date(item.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="w-28 flex gap-2 justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={onView}
          className="h-9 w-9 p-0 bg-white/60 backdrop-blur-sm border border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 hover:shadow-md hover:shadow-blue-100/50 rounded-lg transition-all duration-300"
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="h-9 w-9 p-0 bg-white/60 backdrop-blur-sm border border-gray-200 hover:bg-red-50 hover:border-red-300 hover:text-red-600 hover:shadow-md hover:shadow-red-100/50 rounded-lg transition-all duration-300"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
