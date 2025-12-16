<?php

namespace Tests\Feature\Properties;

use App\Models\Media;
use App\Services\MediaService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

/**
 * Property Test: Thumbnail Generation
 * 
 * **Feature: admin-fixes, Property 12: Thumbnail Generation**
 * **Validates: Requirements 3.5, 6.4**
 * 
 * *For any* image upload operation, a thumbnail SHALL be generated and the 
 * thumbnail_path SHALL be populated.
 * 
 * Requirements covered:
 * - 3.5: Gallery - generate thumbnail automatically when gallery item is created
 * - 6.4: Media - generate thumbnail automatically when image is uploaded
 */
class ThumbnailGenerationPropertyTest extends TestCase
{
    use RefreshDatabase;

    protected MediaService $mediaService;

    protected function setUp(): void
    {
        parent::setUp();
        
        Storage::fake('public');
        $this->mediaService = new MediaService();
    }

    /**
     * Property: For any image upload, thumbnail_path SHALL be populated
     * 
     * For any valid image file uploaded through MediaService,
     * the resulting Media record SHALL have a non-null thumbnail_path.
     */
    public function test_thumbnail_path_is_populated_for_any_image_upload(): void
    {
        $imageContexts = ['hero_image', 'gallery', 'profile_image', 'media_library'];
        $imageMimeTypes = MediaService::ALLOWED_IMAGE_TYPES;
        
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            $context = $imageContexts[array_rand($imageContexts)];
            $mimeType = $imageMimeTypes[array_rand($imageMimeTypes)];
            $extension = $this->getExtensionForMimeType($mimeType);
            
            // Generate random dimensions (100x100 to 2000x2000)
            $width = fake()->numberBetween(100, 2000);
            $height = fake()->numberBetween(100, 2000);
            
            // Create a fake image file
            $file = UploadedFile::fake()->image(
                "test_image_{$i}.{$extension}",
                $width,
                $height
            );
            
            // Upload the file
            $media = $this->mediaService->upload($file, 'uploads', $context, null);
            
            // Property assertion: thumbnail_path SHALL be populated for images
            $this->assertNotNull(
                $media->thumbnail_path,
                "Thumbnail path should be populated for image upload " .
                "(context: {$context}, mime: {$mimeType}, dimensions: {$width}x{$height})"
            );
            
            // Clean up
            $media->delete();
        }
    }

    /**
     * Property: For any image upload, thumbnail file SHALL exist on disk
     * 
     * For any valid image file uploaded through MediaService,
     * the thumbnail file SHALL physically exist in storage.
     */
    public function test_thumbnail_file_exists_for_any_image_upload(): void
    {
        $imageContexts = ['hero_image', 'gallery', 'profile_image', 'media_library'];
        $imageMimeTypes = MediaService::ALLOWED_IMAGE_TYPES;
        
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            $context = $imageContexts[array_rand($imageContexts)];
            $mimeType = $imageMimeTypes[array_rand($imageMimeTypes)];
            $extension = $this->getExtensionForMimeType($mimeType);
            
            // Generate random dimensions
            $width = fake()->numberBetween(100, 1500);
            $height = fake()->numberBetween(100, 1500);
            
            // Create a fake image file
            $file = UploadedFile::fake()->image(
                "test_thumb_exists_{$i}.{$extension}",
                $width,
                $height
            );
            
            // Upload the file
            $media = $this->mediaService->upload($file, 'uploads', $context, null);
            
            // Property assertion: thumbnail file SHALL exist on disk
            $this->assertTrue(
                Storage::disk('public')->exists($media->thumbnail_path),
                "Thumbnail file should exist on disk for image upload " .
                "(context: {$context}, path: {$media->thumbnail_path})"
            );
            
            // Clean up
            $media->delete();
        }
    }

    /**
     * Property: Thumbnail path follows expected naming convention
     * 
     * For any image upload, the thumbnail path SHALL contain 'thumbnails/' 
     * directory prefix and 'thumb_' filename prefix.
     */
    public function test_thumbnail_path_follows_naming_convention(): void
    {
        $imageMimeTypes = MediaService::ALLOWED_IMAGE_TYPES;
        
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            $mimeType = $imageMimeTypes[array_rand($imageMimeTypes)];
            $extension = $this->getExtensionForMimeType($mimeType);
            
            // Generate random dimensions
            $width = fake()->numberBetween(200, 1200);
            $height = fake()->numberBetween(200, 1200);
            
            // Create a fake image file
            $file = UploadedFile::fake()->image(
                "naming_test_{$i}.{$extension}",
                $width,
                $height
            );
            
            // Upload the file
            $media = $this->mediaService->upload($file, 'uploads', 'gallery', null);
            
            // Property assertions: thumbnail path follows naming convention
            $this->assertStringContainsString(
                'thumbnails/',
                $media->thumbnail_path,
                "Thumbnail path should contain 'thumbnails/' directory"
            );
            
            $this->assertStringContainsString(
                'thumb_',
                $media->thumbnail_path,
                "Thumbnail filename should contain 'thumb_' prefix"
            );
            
            // Clean up
            $media->delete();
        }
    }

    /**
     * Property: Non-image files SHALL NOT have thumbnail_path populated
     * 
     * For any document file uploaded through MediaService,
     * the resulting Media record SHALL have a null thumbnail_path.
     */
    public function test_non_image_files_have_null_thumbnail_path(): void
    {
        $documentMimeTypes = MediaService::ALLOWED_DOCUMENT_TYPES;
        $documentContexts = ['ppid_document', 'standar_pelayanan', 'media_library'];
        
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            $context = $documentContexts[array_rand($documentContexts)];
            $mimeType = $documentMimeTypes[array_rand($documentMimeTypes)];
            $extension = $this->getExtensionForMimeType($mimeType);
            
            // Generate random file size (10KB to 1MB)
            $sizeKb = fake()->numberBetween(10, 1024);
            
            // Create a fake document file
            $file = UploadedFile::fake()->create(
                "test_document_{$i}.{$extension}",
                $sizeKb,
                $mimeType
            );
            
            // Upload the file
            $media = $this->mediaService->upload($file, 'uploads', $context, null);
            
            // Property assertion: thumbnail_path SHALL be null for non-images
            $this->assertNull(
                $media->thumbnail_path,
                "Thumbnail path should be null for document upload " .
                "(context: {$context}, mime: {$mimeType})"
            );
            
            // Clean up
            $media->delete();
        }
    }

    /**
     * Property: Thumbnail generation is idempotent
     * 
     * For any image Media record, calling generateThumbnail multiple times
     * SHALL result in the same thumbnail_path (idempotent operation).
     */
    public function test_thumbnail_generation_is_idempotent(): void
    {
        $imageMimeTypes = MediaService::ALLOWED_IMAGE_TYPES;
        
        // Property test: run 50 iterations (fewer due to multiple operations per iteration)
        for ($i = 0; $i < 50; $i++) {
            $mimeType = $imageMimeTypes[array_rand($imageMimeTypes)];
            $extension = $this->getExtensionForMimeType($mimeType);
            
            // Generate random dimensions
            $width = fake()->numberBetween(200, 1000);
            $height = fake()->numberBetween(200, 1000);
            
            // Create a fake image file
            $file = UploadedFile::fake()->image(
                "idempotent_test_{$i}.{$extension}",
                $width,
                $height
            );
            
            // Upload the file (thumbnail generated automatically)
            $media = $this->mediaService->upload($file, 'uploads', 'gallery', null);
            $originalThumbnailPath = $media->thumbnail_path;
            
            // Call generateThumbnail again
            $newThumbnailPath = $this->mediaService->generateThumbnail($media);
            
            // Refresh from database
            $media->refresh();
            
            // Property assertion: thumbnail path should remain consistent
            $this->assertEquals(
                $originalThumbnailPath,
                $media->thumbnail_path,
                "Thumbnail path should remain the same after regeneration"
            );
            
            // Clean up
            $media->delete();
        }
    }

    /**
     * Property: isImage() correctly identifies image media
     * 
     * For any Media record created from an image upload,
     * the isImage() method SHALL return true.
     */
    public function test_is_image_returns_true_for_image_uploads(): void
    {
        $imageMimeTypes = MediaService::ALLOWED_IMAGE_TYPES;
        
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            $mimeType = $imageMimeTypes[array_rand($imageMimeTypes)];
            $extension = $this->getExtensionForMimeType($mimeType);
            
            // Create a fake image file
            $file = UploadedFile::fake()->image(
                "is_image_test_{$i}.{$extension}",
                fake()->numberBetween(100, 800),
                fake()->numberBetween(100, 800)
            );
            
            // Upload the file
            $media = $this->mediaService->upload($file, 'uploads', 'gallery', null);
            
            // Property assertion: isImage() SHALL return true for images
            $this->assertTrue(
                $media->isImage(),
                "isImage() should return true for image with MIME type '{$mimeType}'"
            );
            
            // Clean up
            $media->delete();
        }
    }

    /**
     * Helper method to get file extension for a MIME type.
     */
    protected function getExtensionForMimeType(string $mimeType): string
    {
        return match ($mimeType) {
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/webp' => 'webp',
            'image/gif' => 'gif',
            'application/pdf' => 'pdf',
            'application/msword' => 'doc',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => 'docx',
            'application/vnd.ms-excel' => 'xls',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' => 'xlsx',
            default => 'bin',
        };
    }
}
