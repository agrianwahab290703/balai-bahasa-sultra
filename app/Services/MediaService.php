<?php

namespace App\Services;

use App\Models\Media;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

/**
 * Service for managing media files including upload, thumbnail generation,
 * and reference tracking.
 * 
 * @see Requirements 8.2, 8.5
 */
class MediaService
{
    /**
     * Allowed image MIME types.
     */
    public const ALLOWED_IMAGE_TYPES = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
    ];

    /**
     * Allowed document MIME types.
     */
    public const ALLOWED_DOCUMENT_TYPES = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    /**
     * Maximum file sizes in bytes by context.
     */
    public const MAX_FILE_SIZES = [
        'hero_image' => 2 * 1024 * 1024,      // 2MB for hero images (Req 1.3)
        'gallery' => 5 * 1024 * 1024,          // 5MB for gallery images
        'ppid_document' => 10 * 1024 * 1024,   // 10MB for PPID documents (Req 3.2)
        'standar_pelayanan' => 10 * 1024 * 1024, // 10MB for service standards (Req 5.2)
        'profile_image' => 5 * 1024 * 1024,    // 5MB for profile images (Req 6.3)
        'media_library' => 10 * 1024 * 1024,   // 10MB for general media (Req 8.2)
        'default' => 5 * 1024 * 1024,          // 5MB default
    ];

    /**
     * Thumbnail dimensions.
     */
    public const THUMBNAIL_WIDTH = 300;
    public const THUMBNAIL_HEIGHT = 300;

    protected string $disk = 'public';

    /**
     * Upload a file and create a Media record.
     *
     * @param UploadedFile $file The uploaded file
     * @param string $folder The folder to store the file in
     * @param string $context The upload context for validation (e.g., 'hero_image', 'ppid_document')
     * @param int|null $uploadedBy The admin user ID who uploaded the file
     * @return Media The created media record
     * @throws \InvalidArgumentException If file validation fails
     */
    public function upload(
        UploadedFile $file,
        string $folder = 'uploads',
        string $context = 'default',
        ?int $uploadedBy = null
    ): Media {
        // Validate file
        $this->validateFile($file, $context);

        // Generate unique filename
        $filename = $this->generateUniqueFilename($file);

        \Log::info('MediaService upload:', [
            'original_name' => $file->getClientOriginalName(),
            'generated_filename' => $filename,
            'folder' => $folder,
            'disk' => $this->disk,
            'size' => $file->getSize(),
        ]);

        // Store the file
        $path = $file->storeAs($folder, $filename, $this->disk);

        if (!$path) {
            throw new \Exception('Failed to store file to disk');
        }

        \Log::info('File stored successfully:', ['path' => $path]);

        // Get file metadata
        $metadata = $this->extractMetadata($file);

        // Create media record
        $mediaData = [
            'filename' => $file->getClientOriginalName(),
            'path' => $path,
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'width' => $metadata['width'] ?? null,
            'height' => $metadata['height'] ?? null,
            'uploaded_by' => $uploadedBy,
            'metadata' => $metadata,
            'usage_count' => 0,
        ];

        \Log::info('Creating media record:', $mediaData);

        $media = Media::create($mediaData);

        \Log::info('Media record created:', ['id' => $media->id, 'url' => $media->url]);

        // Generate thumbnail for images
        if ($media->isImage()) {
            $this->generateThumbnail($media);
        }

        return $media;
    }

    /**
     * Validate a file against allowed types and size limits.
     *
     * @param UploadedFile $file The file to validate
     * @param string $context The upload context
     * @return bool True if valid
     * @throws \InvalidArgumentException If validation fails
     */
    public function validateFile(UploadedFile $file, string $context = 'default'): bool
    {
        $mimeType = $file->getMimeType();
        $size = $file->getSize();
        
        // Get allowed types based on context
        $allowedTypes = $this->getAllowedTypesForContext($context);
        
        // Validate MIME type
        if (!in_array($mimeType, $allowedTypes, true)) {
            throw new \InvalidArgumentException(
                "File type '{$mimeType}' is not allowed for context '{$context}'. " .
                "Allowed types: " . implode(', ', $allowedTypes)
            );
        }
        
        // Get max size for context
        $maxSize = self::MAX_FILE_SIZES[$context] ?? self::MAX_FILE_SIZES['default'];
        
        // Validate file size
        if ($size > $maxSize) {
            $maxSizeMB = round($maxSize / (1024 * 1024), 2);
            $fileSizeMB = round($size / (1024 * 1024), 2);
            throw new \InvalidArgumentException(
                "File size ({$fileSizeMB}MB) exceeds maximum allowed size ({$maxSizeMB}MB) for context '{$context}'."
            );
        }
        
        return true;
    }

    /**
     * Check if a file is valid without throwing exceptions.
     *
     * @param UploadedFile $file The file to check
     * @param string $context The upload context
     * @return bool True if valid, false otherwise
     */
    public function isValidFile(UploadedFile $file, string $context = 'default'): bool
    {
        try {
            return $this->validateFile($file, $context);
        } catch (\InvalidArgumentException $e) {
            return false;
        }
    }

    /**
     * Get allowed MIME types for a given context.
     *
     * @param string $context The upload context
     * @return array Array of allowed MIME types
     */
    public function getAllowedTypesForContext(string $context): array
    {
        return match ($context) {
            'hero_image', 'gallery', 'profile_image' => self::ALLOWED_IMAGE_TYPES,
            'ppid_document', 'standar_pelayanan' => self::ALLOWED_DOCUMENT_TYPES,
            'media_library', 'default' => array_merge(
                self::ALLOWED_IMAGE_TYPES,
                self::ALLOWED_DOCUMENT_TYPES
            ),
            default => array_merge(
                self::ALLOWED_IMAGE_TYPES,
                self::ALLOWED_DOCUMENT_TYPES
            ),
        };
    }

    /**
     * Get maximum file size for a given context.
     *
     * @param string $context The upload context
     * @return int Maximum file size in bytes
     */
    public function getMaxSizeForContext(string $context): int
    {
        return self::MAX_FILE_SIZES[$context] ?? self::MAX_FILE_SIZES['default'];
    }

    /**
     * Generate a thumbnail for an image media.
     *
     * @param Media $media The media to generate thumbnail for
     * @return string|null The thumbnail path, or null if not an image
     */
    public function generateThumbnail(Media $media): ?string
    {
        if (!$media->isImage()) {
            return null;
        }

        $storagePath = Storage::disk($this->disk)->path($media->path);
        
        if (!file_exists($storagePath)) {
            return null;
        }

        // Create thumbnail directory
        $thumbnailFolder = 'thumbnails/' . dirname($media->path);
        $thumbnailFilename = 'thumb_' . basename($media->path);
        $thumbnailPath = $thumbnailFolder . '/' . $thumbnailFilename;
        
        // Ensure thumbnail directory exists
        Storage::disk($this->disk)->makeDirectory($thumbnailFolder);
        
        $thumbnailFullPath = Storage::disk($this->disk)->path($thumbnailPath);

        try {
            // Use Intervention Image to create thumbnail
            $manager = new ImageManager(new Driver());
            $image = $manager->read($storagePath);
            
            // Resize maintaining aspect ratio, fitting within bounds
            $image->scaleDown(self::THUMBNAIL_WIDTH, self::THUMBNAIL_HEIGHT);
            
            // Save thumbnail
            $image->save($thumbnailFullPath);
            
            // Update media record
            $media->update(['thumbnail_path' => $thumbnailPath]);
            
            return $thumbnailPath;
        } catch (\Exception $e) {
            // Log error but don't fail the upload
            \Log::warning("Failed to generate thumbnail for media {$media->id}: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Delete a media file and its thumbnail.
     *
     * @param Media $media The media to delete
     * @return bool True if deleted successfully
     * @throws \RuntimeException If media is in use
     */
    public function delete(Media $media): bool
    {
        // Check if media is in use
        if ($media->isInUse()) {
            $references = $this->findReferences($media);
            throw new \RuntimeException(
                "Cannot delete media '{$media->filename}' because it is referenced by " .
                count($references) . " entities."
            );
        }

        // Delete thumbnail if exists
        if ($media->thumbnail_path) {
            Storage::disk($this->disk)->delete($media->thumbnail_path);
        }

        // Delete main file
        Storage::disk($this->disk)->delete($media->path);

        // Delete database record
        return $media->delete();
    }

    /**
     * Find entities that reference a media file.
     *
     * @param Media $media The media to find references for
     * @return array Array of referencing entities with type and id
     */
    public function findReferences(Media $media): array
    {
        $references = [];
        $mediaUrl = $media->url;
        $mediaPath = $media->path;

        // Check Berita hero_image
        $beritaReferences = \App\Models\Berita::where('hero_image', 'LIKE', "%{$mediaPath}%")
            ->orWhere('hero_image', 'LIKE', "%{$mediaUrl}%")
            ->get();
        
        foreach ($beritaReferences as $berita) {
            $references[] = [
                'type' => 'Berita',
                'id' => $berita->id,
                'title' => $berita->judul_utama,
            ];
        }

        // Check ProfileContent for images in content
        $profileReferences = \App\Models\ProfileContent::where('content', 'LIKE', "%{$mediaPath}%")
            ->orWhere('content', 'LIKE', "%{$mediaUrl}%")
            ->orWhere('image_path', 'LIKE', "%{$mediaPath}%")
            ->get();
        
        foreach ($profileReferences as $profile) {
            $references[] = [
                'type' => 'ProfileContent',
                'id' => $profile->id,
                'title' => $profile->type,
            ];
        }

        // Check PpidDocument
        $ppidReferences = \App\Models\PpidDocument::where('file_path', 'LIKE', "%{$mediaPath}%")
            ->get();
        
        foreach ($ppidReferences as $ppid) {
            $references[] = [
                'type' => 'PpidDocument',
                'id' => $ppid->id,
                'title' => $ppid->title,
            ];
        }

        // Check StandarPelayanan (uses 'url' field instead of 'file_path')
        $standarReferences = \App\Models\StandarPelayanan::where('url', 'LIKE', "%{$mediaPath}%")
            ->orWhere('url', 'LIKE', "%{$mediaUrl}%")
            ->get();
        
        foreach ($standarReferences as $standar) {
            $references[] = [
                'type' => 'StandarPelayanan',
                'id' => $standar->id,
                'title' => $standar->title,
            ];
        }

        // Check Gallery
        try {
            $galleryReferences = \App\Models\Gallery::where('image_path', 'LIKE', "%{$mediaPath}%")
                ->orWhere('image_path', 'LIKE', "%{$mediaUrl}%")
                ->get();
            
            foreach ($galleryReferences as $gallery) {
                $references[] = [
                    'type' => 'Gallery',
                    'id' => $gallery->id,
                    'title' => $gallery->title ?? 'Gallery Image',
                ];
            }
        } catch (\Exception $e) {
            // Gallery model might not exist or have different structure
        }

        return $references;
    }

    /**
     * Search media files.
     *
     * @param string $query Search query
     * @param array $filters Additional filters (type, date_from, date_to)
     * @return Collection
     */
    public function search(string $query, array $filters = []): Collection
    {
        $queryBuilder = Media::query();

        // Search by filename
        if (!empty($query)) {
            $queryBuilder->where('filename', 'LIKE', "%{$query}%");
        }

        // Filter by type
        if (!empty($filters['type'])) {
            if ($filters['type'] === 'image') {
                $queryBuilder->images();
            } elseif ($filters['type'] === 'document') {
                $queryBuilder->documents();
            }
        }

        // Filter by date range
        if (!empty($filters['date_from'])) {
            $queryBuilder->where('created_at', '>=', $filters['date_from']);
        }
        if (!empty($filters['date_to'])) {
            $queryBuilder->where('created_at', '<=', $filters['date_to']);
        }

        return $queryBuilder->orderBy('created_at', 'desc')->get();
    }

    /**
     * Generate a unique filename for storage.
     *
     * @param UploadedFile $file The uploaded file
     * @return string The unique filename
     */
    protected function generateUniqueFilename(UploadedFile $file): string
    {
        $extension = $file->getClientOriginalExtension();
        $basename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $slug = Str::slug($basename);
        $uniqueId = Str::random(8);
        $timestamp = now()->format('Ymd_His');
        
        return "{$slug}_{$timestamp}_{$uniqueId}.{$extension}";
    }

    /**
     * Extract metadata from a file.
     *
     * @param UploadedFile $file The uploaded file
     * @return array Metadata array
     */
    protected function extractMetadata(UploadedFile $file): array
    {
        $metadata = [
            'original_name' => $file->getClientOriginalName(),
            'extension' => $file->getClientOriginalExtension(),
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
        ];

        // Extract image dimensions if it's an image
        if (str_starts_with($file->getMimeType(), 'image/')) {
            try {
                $imageInfo = getimagesize($file->getPathname());
                if ($imageInfo) {
                    $metadata['width'] = $imageInfo[0];
                    $metadata['height'] = $imageInfo[1];
                }
            } catch (\Exception $e) {
                // Ignore errors getting image dimensions
            }
        }

        return $metadata;
    }

    /**
     * Increment usage count for a media file.
     *
     * @param Media $media The media to increment
     * @return void
     */
    public function incrementUsage(Media $media): void
    {
        $media->incrementUsage();
    }

    /**
     * Decrement usage count for a media file.
     *
     * @param Media $media The media to decrement
     * @return void
     */
    public function decrementUsage(Media $media): void
    {
        $media->decrementUsage();
    }

    /**
     * Update usage count based on actual references.
     *
     * @param Media $media The media to update
     * @return int The new usage count
     */
    public function updateUsageCount(Media $media): int
    {
        $references = $this->findReferences($media);
        $count = count($references);
        
        $media->update(['usage_count' => $count]);
        
        return $count;
    }
}
