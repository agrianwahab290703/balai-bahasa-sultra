<?php

namespace Tests\Feature;

use App\Models\Media;
use App\Services\MediaService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

/**
 * Verification test for MediaService thumbnail generation and metadata recording.
 * 
 * This test verifies:
 * - Thumbnail is generated for image uploads
 * - thumbnail_path is saved to database
 * - Metadata (filename, size, mime_type, dimensions) is recorded
 * 
 * @see Requirements 3.5, 6.4, 6.5
 */
class MediaServiceVerificationTest extends TestCase
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
     * Test that thumbnail is generated for image uploads.
     * 
     * @see Requirements 3.5, 6.4
     */
    public function test_thumbnail_is_generated_for_image_upload(): void
    {
        // Create a fake image file
        $file = UploadedFile::fake()->image('test_image.jpg', 800, 600);
        
        // Upload the file
        $media = $this->mediaService->upload($file, 'uploads', 'gallery', null);
        
        // Verify media was created
        $this->assertInstanceOf(Media::class, $media);
        $this->assertNotNull($media->id);
        
        // Verify thumbnail_path is populated
        $this->assertNotNull($media->thumbnail_path, 'Thumbnail path should be populated for image uploads');
        
        // Verify thumbnail file exists
        Storage::disk('public')->assertExists($media->thumbnail_path);
        
        // Verify thumbnail path follows expected pattern
        $this->assertStringContainsString('thumbnails/', $media->thumbnail_path);
        $this->assertStringContainsString('thumb_', $media->thumbnail_path);
    }

    /**
     * Test that metadata is recorded for image uploads.
     * 
     * @see Requirements 6.5
     */
    public function test_metadata_is_recorded_for_image_upload(): void
    {
        // Create a fake image file
        $file = UploadedFile::fake()->image('test_metadata.png', 1024, 768);
        
        // Upload the file
        $media = $this->mediaService->upload($file, 'uploads', 'media_library', null);
        
        // Verify basic fields are populated
        $this->assertNotNull($media->filename, 'Filename should be recorded');
        $this->assertNotNull($media->size, 'Size should be recorded');
        $this->assertNotNull($media->mime_type, 'MIME type should be recorded');
        
        // Verify dimensions are recorded for images
        $this->assertNotNull($media->width, 'Width should be recorded for images');
        $this->assertNotNull($media->height, 'Height should be recorded for images');
        
        // Verify metadata array is populated
        $this->assertNotNull($media->metadata, 'Metadata array should be populated');
        $this->assertIsArray($media->metadata);
        
        // Verify metadata contains expected keys
        $this->assertArrayHasKey('original_name', $media->metadata);
        $this->assertArrayHasKey('extension', $media->metadata);
        $this->assertArrayHasKey('mime_type', $media->metadata);
        $this->assertArrayHasKey('size', $media->metadata);
        $this->assertArrayHasKey('width', $media->metadata);
        $this->assertArrayHasKey('height', $media->metadata);
    }

    /**
     * Test that thumbnail is NOT generated for document uploads.
     */
    public function test_thumbnail_is_not_generated_for_document_upload(): void
    {
        // Create a fake PDF file
        $file = UploadedFile::fake()->create('test_document.pdf', 100, 'application/pdf');
        
        // Upload the file
        $media = $this->mediaService->upload($file, 'uploads', 'ppid_document', null);
        
        // Verify media was created
        $this->assertInstanceOf(Media::class, $media);
        
        // Verify thumbnail_path is null for documents
        $this->assertNull($media->thumbnail_path, 'Thumbnail path should be null for document uploads');
    }

    /**
     * Test that metadata is recorded for document uploads.
     */
    public function test_metadata_is_recorded_for_document_upload(): void
    {
        // Create a fake PDF file
        $file = UploadedFile::fake()->create('test_doc.pdf', 500, 'application/pdf');
        
        // Upload the file
        $media = $this->mediaService->upload($file, 'uploads', 'ppid_document', null);
        
        // Verify basic fields are populated
        $this->assertNotNull($media->filename, 'Filename should be recorded');
        $this->assertNotNull($media->size, 'Size should be recorded');
        $this->assertNotNull($media->mime_type, 'MIME type should be recorded');
        
        // Verify dimensions are null for documents
        $this->assertNull($media->width, 'Width should be null for documents');
        $this->assertNull($media->height, 'Height should be null for documents');
        
        // Verify metadata array is populated
        $this->assertNotNull($media->metadata, 'Metadata array should be populated');
        $this->assertIsArray($media->metadata);
    }

    /**
     * Test that the main file is stored correctly.
     */
    public function test_main_file_is_stored_correctly(): void
    {
        // Create a fake image file
        $file = UploadedFile::fake()->image('stored_image.jpg', 640, 480);
        
        // Upload the file
        $media = $this->mediaService->upload($file, 'uploads', 'gallery', null);
        
        // Verify main file exists
        Storage::disk('public')->assertExists($media->path);
        
        // Verify path follows expected pattern
        $this->assertStringStartsWith('uploads/', $media->path);
    }
}
