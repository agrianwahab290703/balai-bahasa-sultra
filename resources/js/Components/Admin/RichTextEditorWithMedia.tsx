import React, { useState, useCallback, useRef, useEffect } from 'react';
import { RichTextEditor, RichTextEditorProps } from './RichTextEditor';
import { MediaPicker, MediaItem } from './MediaPicker';
import { useImageUpload } from '@/hooks/useImageUpload';

/**
 * Props for RichTextEditorWithMedia component
 * Extends RichTextEditorProps but handles media integration automatically
 */
export interface RichTextEditorWithMediaProps extends Omit<RichTextEditorProps, 'onImageUpload' | 'mediaLibraryEnabled' | 'onMediaLibraryOpen'> {
  /** Whether to enable media library integration */
  enableMediaLibrary?: boolean;
  /** Upload context for validation */
  uploadContext?: string;
  /** Callback when an image is inserted */
  onImageInserted?: (url: string, media?: MediaItem) => void;
}

/**
 * Rich Text Editor with integrated Media Library support
 * 
 * This component wraps the RichTextEditor and MediaPicker to provide
 * a seamless experience for inserting images from the media library
 * or uploading new images directly.
 * 
 * @see Requirements 12.2
 * 
 * @example
 * ```tsx
 * <RichTextEditorWithMedia
 *   value={content}
 *   onChange={setContent}
 *   placeholder="Write your content..."
 *   enableMediaLibrary
 * />
 * ```
 */
export const RichTextEditorWithMedia: React.FC<RichTextEditorWithMediaProps> = ({
  value,
  onChange,
  enableMediaLibrary = true,
  uploadContext = 'media_library',
  onImageInserted,
  ...props
}) => {
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  // Store a callback to insert images into the editor
  const insertImageRef = useRef<((url: string) => void) | null>(null);

  // Use the image upload hook
  const { uploadImage } = useImageUpload({
    context: uploadContext,
    onUploadComplete: (url) => {
      onImageInserted?.(url);
    },
  });

  /**
   * Handle image upload from the editor toolbar
   * This also captures the ability to insert images
   */
  const handleImageUpload = useCallback(async (file: File): Promise<string> => {
    const url = await uploadImage(file);
    onImageInserted?.(url);
    return url;
  }, [uploadImage, onImageInserted]);

  /**
   * Handle media selection from the picker
   * Inserts the selected image into the editor content
   */
  const handleMediaSelect = useCallback((url: string, media?: MediaItem) => {
    // Insert image tag into the content
    // We'll append an img tag to the current value
    const imgTag = `<img src="${url}" alt="${media?.filename || 'Image'}" class="max-w-full h-auto rounded-lg" />`;
    
    // Parse current content and append image
    // For simplicity, we append to the end. The editor will handle it.
    const newContent = value ? `${value}${imgTag}` : imgTag;
    onChange(newContent);
    
    onImageInserted?.(url, media);
    setIsMediaPickerOpen(false);
  }, [value, onChange, onImageInserted]);

  /**
   * Open the media picker modal
   */
  const handleOpenMediaLibrary = useCallback(() => {
    setIsMediaPickerOpen(true);
  }, []);

  return (
    <>
      <RichTextEditor
        value={value}
        onChange={onChange}
        onImageUpload={handleImageUpload}
        mediaLibraryEnabled={enableMediaLibrary}
        onMediaLibraryOpen={handleOpenMediaLibrary}
        {...props}
      />

      {enableMediaLibrary && (
        <MediaPicker
          open={isMediaPickerOpen}
          onClose={() => setIsMediaPickerOpen(false)}
          onSelect={handleMediaSelect}
          title="Insert Image"
          accept={['image/jpeg', 'image/png', 'image/webp', 'image/gif']}
        />
      )}
    </>
  );
};

export default RichTextEditorWithMedia;
