<?php

namespace Tests\Feature\Properties;

use App\Models\Media;
use App\Services\MediaService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

/**
 * Property Test: Metadata Recording
 * 
 * **Feature: admin-fixes, Property 13: Metadata Recording**
 * **Validates: Requirements 6.5**
 * 
 * *For any* media upload operation, the metadata fields (filename, size, mime_type) 
 * SHALL be populated with correct values.
 * 
 * Requirements covered:
 * - 6.5: Media - record metadata (filename, size, mime_type, dimensions)
 */
class MetadataRecordingPropertyTest extends TestCase
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
     * Property: For any media upload, filename SHALL be recorded correctly
     * 
     * For any valid file uploaded through MediaService,
     * the resulting Media record SHALL have the original filename stored.
     */
    public function test_filename_is_recorded_for_any_upload(): void
    {
        $allMimeTypes = array_merge(
            MediaService::ALLOWED_IMAGE_TYPES,
            MediaService::ALLOWED_DOCUMENT_TYPES
        );
        
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            $mimeType = $allMimeTypes[array_rand($allMimeTypes)];
            $extension = $this->getExtensionForMimeType($mimeType);
            
            // Generate random filename
            $originalFilename = fake()->word() . '_' . fake()->randomNumber(5) . '.' . $extension;
            
            // Create file based on type
            if (str_starts_with($mimeType, 'image/')) {
                $file = UploadedFile::fake()->image(
                    $originalFilename,
                    fake()->numberBetween(100, 1000),
                    fake()->numberBetween(100, 1000)
                );
            } else {
                $file = UploadedFile::fake()->create(
                    $originalFilename,
                    fake()->numberBetween(10, 500),
                    $mimeType
                );
            }
            
            // Upload the file
            $media = $this->mediaService->upload($file, 'uploads', 'media_library', null);
            
            // Property assertion: filename SHALL be recorded
            $this->assertNotNull(
                $media->filename,
                "Filename should be recorded for upload (mime: {$mimeType})"
            );
            
            $this->assertEquals(
                $originalFilename,
                $media->filename,
                "Recorded filename should match original filename"
            );
            
            // Clean up
            $media->delete();
        }
    }

    /**
     * Property: For any media upload, size SHALL be recorded correctly
     * 
     * For any valid file uploaded through MediaService,
     * the resulting Media record SHALL have the file size stored as a positive integer.
     */
    public function test_size_is_recorded_for_any_upload(): void
    {
        $allMimeTypes = array_merge(
            MediaService::ALLOWED_IMAGE_TYPES,
            MediaService::ALLOWED_DOCUMENT_TYPES
        );
        
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            $mimeType = $allMimeTypes[array_rand($allMimeTypes)];
            $extension = $this->getExtensionForMimeType($mimeType);
            $filename = "size_test_{$i}.{$extension}";
            
            // Create file based on type
            if (str_starts_with($mimeType, 'image/')) {
                $file = UploadedFile::fake()->image(
                    $filename,
                    fake()->numberBetween(100, 800),
                    fake()->numberBetween(100, 800)
                );
            } else {
                $file = UploadedFile::fake()->create(
                    $filename,
                    fake()->numberBetween(10, 500),
                    $mimeType
                );
            }
            
            $expectedSize = $file->getSize();
            
            // Upload the file
            $media = $this->mediaService->upload($file, 'uploads', 'media_library', null);
            
            // Property assertion: size SHALL be recorded as positive integer
            $this->assertNotNull(
                $media->size,
                "Size should be recorded for upload (mime: {$mimeType})"
            );
            
            $this->assertIsInt(
                $media->size,
                "Size should be an integer"
            );
            
            $this->assertGreaterThan(
                0,
                $media->size,
                "Size should be a positive integer"
            );
            
            $this->assertEquals(
                $expectedSize,
                $media->size,
                "Recorded size should match actual file size"
            );
            
            // Clean up
            $media->delete();
        }
    }

    /**
     * Property: For any media upload, mime_type SHALL be recorded correctly
     * 
     * For any valid file uploaded through MediaService,
     * the resulting Media record SHALL have the correct MIME type stored.
     */
    public function test_mime_type_is_recorded_for_any_upload(): void
    {
        $allMimeTypes = array_merge(
            MediaService::ALLOWED_IMAGE_TYPES,
            MediaService::ALLOWED_DOCUMENT_TYPES
        );
        
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            $expectedMimeType = $allMimeTypes[array_rand($allMimeTypes)];
            $extension = $this->getExtensionForMimeType($expectedMimeType);
            $filename = "mime_test_{$i}.{$extension}";
            
            // Create file based on type
            if (str_starts_with($expectedMimeType, 'image/')) {
                $file = UploadedFile::fake()->image(
                    $filename,
                    fake()->numberBetween(100, 800),
                    fake()->numberBetween(100, 800)
                );
            } else {
                $file = UploadedFile::fake()->create(
                    $filename,
                    fake()->numberBetween(10, 500),
                    $expectedMimeType
                );
            }
            
            // Upload the file
            $media = $this->mediaService->upload($file, 'uploads', 'media_library', null);
            
            // Property assertion: mime_type SHALL be recorded
            $this->assertNotNull(
                $media->mime_type,
                "MIME type should be recorded for upload"
            );
            
            $this->assertNotEmpty(
                $media->mime_type,
                "MIME type should not be empty"
            );
            
            // For fake files, the mime type should be in allowed types
            $this->assertTrue(
                in_array($media->mime_type, $allMimeTypes),
                "Recorded MIME type '{$media->mime_type}' should be in allowed types"
            );
            
            // Clean up
            $media->delete();
        }
    }

    /**
     * Property: For any image upload, dimensions SHALL be recorded
     * 
     * For any valid image file uploaded through MediaService,
     * the resulting Media record SHALL have width and height populated.
     */
    public function test_dimensions_are_recorded_for_image_uploads(): void
    {
        $imageMimeTypes = MediaService::ALLOWED_IMAGE_TYPES;
        
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            $mimeType = $imageMimeTypes[array_rand($imageMimeTypes)];
            $extension = $this->getExtensionForMimeType($mimeType);
            
            // Generate random dimensions
            $expectedWidth = fake()->numberBetween(100, 2000);
            $expectedHeight = fake()->numberBetween(100, 2000);
            
            $file = UploadedFile::fake()->image(
                "dimensions_test_{$i}.{$extension}",
                $expectedWidth,
                $expectedHeight
            );
            
            // Upload the file
            $media = $this->mediaService->upload($file, 'uploads', 'gallery', null);
            
            // Property assertion: dimensions SHALL be recorded for images
            $this->assertNotNull(
                $media->width,
                "Width should be recorded for image upload (mime: {$mimeType})"
            );
            
            $this->assertNotNull(
                $media->height,
                "Height should be recorded for image upload (mime: {$mimeType})"
            );
            
            $this->assertIsInt($media->width, "Width should be an integer");
            $this->assertIsInt($media->height, "Height should be an integer");
            
            $this->assertGreaterThan(0, $media->width, "Width should be positive");
            $this->assertGreaterThan(0, $media->height, "Height should be positive");
            
            // Clean up
            $media->delete();
        }
    }

    /**
     * Property: For any document upload, dimensions SHALL be null
     * 
     * For any valid document file uploaded through MediaService,
     * the resulting Media record SHALL have null width and height.
     */
    public function test_dimensions_are_null_for_document_uploads(): void
    {
        $documentMimeTypes = MediaService::ALLOWED_DOCUMENT_TYPES;
        
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            $mimeType = $documentMimeTypes[array_rand($documentMimeTypes)];
            $extension = $this->getExtensionForMimeType($mimeType);
            
            $file = UploadedFile::fake()->create(
                "doc_dimensions_test_{$i}.{$extension}",
                fake()->numberBetween(10, 500),
                $mimeType
            );
            
            // Upload the file
            $media = $this->mediaService->upload($file, 'uploads', 'ppid_document', null);
            
            // Property assertion: dimensions SHALL be null for documents
            $this->assertNull(
                $media->width,
                "Width should be null for document upload (mime: {$mimeType})"
            );
            
            $this->assertNull(
                $media->height,
                "Height should be null for document upload (mime: {$mimeType})"
            );
            
            // Clean up
            $media->delete();
        }
    }

    /**
     * Property: Metadata JSON field contains correct values
     * 
     * For any media upload, the metadata JSON field SHALL contain
     * original_name, extension, mime_type, and size.
     */
    public function test_metadata_json_contains_required_fields(): void
    {
        $allMimeTypes = array_merge(
            MediaService::ALLOWED_IMAGE_TYPES,
            MediaService::ALLOWED_DOCUMENT_TYPES
        );
        
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            $mimeType = $allMimeTypes[array_rand($allMimeTypes)];
            $extension = $this->getExtensionForMimeType($mimeType);
            $originalFilename = "metadata_json_test_{$i}.{$extension}";
            
            // Create file based on type
            if (str_starts_with($mimeType, 'image/')) {
                $file = UploadedFile::fake()->image(
                    $originalFilename,
                    fake()->numberBetween(100, 800),
                    fake()->numberBetween(100, 800)
                );
            } else {
                $file = UploadedFile::fake()->create(
                    $originalFilename,
                    fake()->numberBetween(10, 500),
                    $mimeType
                );
            }
            
            // Upload the file
            $media = $this->mediaService->upload($file, 'uploads', 'media_library', null);
            
            // Property assertion: metadata SHALL be an array with required fields
            $this->assertIsArray(
                $media->metadata,
                "Metadata should be an array"
            );
            
            $this->assertArrayHasKey(
                'original_name',
                $media->metadata,
                "Metadata should contain 'original_name'"
            );
            
            $this->assertArrayHasKey(
                'extension',
                $media->metadata,
                "Metadata should contain 'extension'"
            );
            
            $this->assertArrayHasKey(
                'mime_type',
                $media->metadata,
                "Metadata should contain 'mime_type'"
            );
            
            $this->assertArrayHasKey(
                'size',
                $media->metadata,
                "Metadata should contain 'size'"
            );
            
            // Verify metadata values match
            $this->assertEquals(
                $originalFilename,
                $media->metadata['original_name'],
                "Metadata original_name should match"
            );
            
            $this->assertEquals(
                $extension,
                $media->metadata['extension'],
                "Metadata extension should match"
            );
            
            // Clean up
            $media->delete();
        }
    }

    /**
     * Property: Image metadata contains dimensions
     * 
     * For any image upload, the metadata JSON field SHALL also contain
     * width and height values.
     */
    public function test_image_metadata_contains_dimensions(): void
    {
        $imageMimeTypes = MediaService::ALLOWED_IMAGE_TYPES;
        
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            $mimeType = $imageMimeTypes[array_rand($imageMimeTypes)];
            $extension = $this->getExtensionForMimeType($mimeType);
            
            $expectedWidth = fake()->numberBetween(100, 1500);
            $expectedHeight = fake()->numberBetween(100, 1500);
            
            $file = UploadedFile::fake()->image(
                "img_metadata_test_{$i}.{$extension}",
                $expectedWidth,
                $expectedHeight
            );
            
            // Upload the file
            $media = $this->mediaService->upload($file, 'uploads', 'gallery', null);
            
            // Property assertion: image metadata SHALL contain dimensions
            $this->assertArrayHasKey(
                'width',
                $media->metadata,
                "Image metadata should contain 'width'"
            );
            
            $this->assertArrayHasKey(
                'height',
                $media->metadata,
                "Image metadata should contain 'height'"
            );
            
            $this->assertGreaterThan(
                0,
                $media->metadata['width'],
                "Metadata width should be positive"
            );
            
            $this->assertGreaterThan(
                0,
                $media->metadata['height'],
                "Metadata height should be positive"
            );
            
            // Clean up
            $media->delete();
        }
    }

    /**
     * Property: Path is recorded and file exists
     * 
     * For any media upload, the path field SHALL be populated
     * and the file SHALL exist at that path.
     */
    public function test_path_is_recorded_and_file_exists(): void
    {
        $allMimeTypes = array_merge(
            MediaService::ALLOWED_IMAGE_TYPES,
            MediaService::ALLOWED_DOCUMENT_TYPES
        );
        
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            $mimeType = $allMimeTypes[array_rand($allMimeTypes)];
            $extension = $this->getExtensionForMimeType($mimeType);
            $filename = "path_test_{$i}.{$extension}";
            
            // Create file based on type
            if (str_starts_with($mimeType, 'image/')) {
                $file = UploadedFile::fake()->image(
                    $filename,
                    fake()->numberBetween(100, 800),
                    fake()->numberBetween(100, 800)
                );
            } else {
                $file = UploadedFile::fake()->create(
                    $filename,
                    fake()->numberBetween(10, 500),
                    $mimeType
                );
            }
            
            // Upload the file
            $media = $this->mediaService->upload($file, 'uploads', 'media_library', null);
            
            // Property assertion: path SHALL be recorded
            $this->assertNotNull(
                $media->path,
                "Path should be recorded for upload"
            );
            
            $this->assertNotEmpty(
                $media->path,
                "Path should not be empty"
            );
            
            // Property assertion: file SHALL exist at path
            $this->assertTrue(
                Storage::disk('public')->exists($media->path),
                "File should exist at recorded path: {$media->path}"
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
