import { useState, useCallback } from 'react';
import { router } from '@inertiajs/react';

/**
 * Response from the image upload endpoint
 */
interface UploadResponse {
  success: boolean;
  url: string;
  id: number;
  filename: string;
  error?: string;
}

/**
 * Options for the useImageUpload hook
 */
interface UseImageUploadOptions {
  /** Upload context for validation (e.g., 'hero_image', 'media_library') */
  context?: string;
  /** Callback when upload starts */
  onUploadStart?: () => void;
  /** Callback when upload completes successfully */
  onUploadComplete?: (url: string, id: number) => void;
  /** Callback when upload fails */
  onUploadError?: (error: string) => void;
}

/**
 * Hook for uploading images to the MediaService
 * Provides drag-drop and direct upload functionality
 * 
 * @see Requirements 12.2
 * 
 * @example
 * ```tsx
 * const { uploadImage, isUploading, error } = useImageUpload({
 *   context: 'media_library',
 *   onUploadComplete: (url) => console.log('Uploaded:', url),
 * });
 * 
 * // Use with RichTextEditor
 * <RichTextEditor
 *   value={content}
 *   onChange={setContent}
 *   onImageUpload={uploadImage}
 * />
 * ```
 */
export function useImageUpload(options: UseImageUploadOptions = {}) {
  const {
    context = 'media_library',
    onUploadStart,
    onUploadComplete,
    onUploadError,
  } = options;

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  /**
   * Upload an image file to the server
   * @param file The file to upload
   * @returns Promise resolving to the uploaded image URL
   */
  const uploadImage = useCallback(async (file: File): Promise<string> => {
    setIsUploading(true);
    setError(null);
    setProgress(0);
    onUploadStart?.();

    try {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error(`File type '${file.type}' is not allowed. Allowed types: ${allowedTypes.join(', ')}`);
      }

      // Validate file size (max 10MB for media library)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error(`File size (${(file.size / (1024 * 1024)).toFixed(2)}MB) exceeds maximum allowed size (10MB).`);
      }

      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('context', context);

      // Upload using fetch for better progress tracking
      const response = await fetch('/admin/media/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(errorData.error || errorData.message || 'Upload failed');
      }

      const data: UploadResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Upload failed');
      }

      setProgress(100);
      onUploadComplete?.(data.url, data.id);
      
      return data.url;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      onUploadError?.(errorMessage);
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, [context, onUploadStart, onUploadComplete, onUploadError]);

  /**
   * Clear the current error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    uploadImage,
    isUploading,
    error,
    progress,
    clearError,
  };
}

export default useImageUpload;
