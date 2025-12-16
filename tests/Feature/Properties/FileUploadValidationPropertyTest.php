<?php

namespace Tests\Feature\Properties;

use App\Services\MediaService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

/**
 * Property Test: File Upload Validation
 * 
 * **Feature: admin-fixes, Property 4: File Upload Validation**
 * **Validates: Requirements 3.2, 4.2, 6.2**
 * 
 * *For any* file upload attempt, the system SHALL accept the file if and only if 
 * the file type is in the allowed list AND the file size is within the maximum 
 * limit for that upload context.
 * 
 * Requirements covered:
 * - 3.2: Gallery - validate file type (jpg, png, webp) and size (max 5MB)
 * - 4.2: PPID - validate file type (pdf, doc, docx, xls, xlsx) and record file size
 * - 6.2: Media - validate file type and size based on configuration
 */
class FileUploadValidationPropertyTest extends TestCase
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
     * Property: Valid image files are accepted for image contexts
     * 
     * For any file with an allowed image MIME type and size within limits,
     * the validation should pass for image upload contexts.
     */
    public function test_valid_image_files_accepted_for_image_contexts(): void
    {
        $imageContexts = ['hero_image', 'gallery', 'profile_image'];
        $allowedImageTypes = MediaService::ALLOWED_IMAGE_TYPES;
        
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            $context = $imageContexts[array_rand($imageContexts)];
            $mimeType = $allowedImageTypes[array_rand($allowedImageTypes)];
            $maxSize = $this->mediaService->getMaxSizeForContext($context);
            
            // Generate a random valid size (1KB to max size)
            $size = fake()->numberBetween(1024, $maxSize);
            
            // Map MIME type to extension
            $extension = $this->getExtensionForMimeType($mimeType);
            
            $file = UploadedFile::fake()->create(
                "test_image_{$i}.{$extension}",
                $size / 1024, // Size in KB
                $mimeType
            );
            
            $isValid = $this->mediaService->isValidFile($file, $context);
            
            $this->assertTrue(
                $isValid,
                "File with MIME type '{$mimeType}' and size {$size} bytes should be valid for context '{$context}'"
            );
        }
    }

    /**
     * Property: Valid document files are accepted for document contexts
     * 
     * For any file with an allowed document MIME type and size within limits,
     * the validation should pass for document upload contexts.
     */
    public function test_valid_document_files_accepted_for_document_contexts(): void
    {
        $documentContexts = ['ppid_document', 'standar_pelayanan'];
        $allowedDocTypes = MediaService::ALLOWED_DOCUMENT_TYPES;
        
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            $context = $documentContexts[array_rand($documentContexts)];
            $mimeType = $allowedDocTypes[array_rand($allowedDocTypes)];
            $maxSize = $this->mediaService->getMaxSizeForContext($context);
            
            // Generate a random valid size (1KB to max size)
            $size = fake()->numberBetween(1024, $maxSize);
            
            // Map MIME type to extension
            $extension = $this->getExtensionForMimeType($mimeType);
            
            $file = UploadedFile::fake()->create(
                "test_document_{$i}.{$extension}",
                $size / 1024, // Size in KB
                $mimeType
            );
            
            $isValid = $this->mediaService->isValidFile($file, $context);
            
            $this->assertTrue(
                $isValid,
                "File with MIME type '{$mimeType}' and size {$size} bytes should be valid for context '{$context}'"
            );
        }
    }

    /**
     * Property: Files exceeding size limit are rejected
     * 
     * For any file with size exceeding the maximum limit for its context,
     * the validation should fail regardless of file type.
     */
    public function test_files_exceeding_size_limit_are_rejected(): void
    {
        $contexts = ['hero_image', 'gallery', 'ppid_document', 'standar_pelayanan', 'profile_image', 'media_library'];
        
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            $context = $contexts[array_rand($contexts)];
            $maxSize = $this->mediaService->getMaxSizeForContext($context);
            $allowedTypes = $this->mediaService->getAllowedTypesForContext($context);
            $mimeType = $allowedTypes[array_rand($allowedTypes)];
            
            // Generate a size that exceeds the limit (max + 1KB to max + 5MB)
            $oversizeAmount = fake()->numberBetween(1024, 5 * 1024 * 1024);
            $size = $maxSize + $oversizeAmount;
            
            $extension = $this->getExtensionForMimeType($mimeType);
            
            $file = UploadedFile::fake()->create(
                "oversize_file_{$i}.{$extension}",
                $size / 1024, // Size in KB
                $mimeType
            );
            
            $isValid = $this->mediaService->isValidFile($file, $context);
            
            $this->assertFalse(
                $isValid,
                "File with size {$size} bytes should be rejected for context '{$context}' (max: {$maxSize} bytes)"
            );
        }
    }

    /**
     * Property: Invalid MIME types are rejected
     * 
     * For any file with a MIME type not in the allowed list for its context,
     * the validation should fail regardless of file size.
     */
    public function test_invalid_mime_types_are_rejected(): void
    {
        $invalidMimeTypes = [
            'application/x-executable',
            'application/x-php',
            'text/html',
            'application/javascript',
            'application/x-sh',
            'application/x-bat',
            'video/mp4',
            'audio/mpeg',
        ];
        
        $imageContexts = ['hero_image', 'gallery', 'profile_image'];
        $documentContexts = ['ppid_document', 'standar_pelayanan'];
        
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            $mimeType = $invalidMimeTypes[array_rand($invalidMimeTypes)];
            
            // Test against image contexts
            $imageContext = $imageContexts[array_rand($imageContexts)];
            $file = UploadedFile::fake()->create(
                "invalid_file_{$i}.bin",
                100, // 100KB - well within limits
                $mimeType
            );
            
            $isValid = $this->mediaService->isValidFile($file, $imageContext);
            
            $this->assertFalse(
                $isValid,
                "File with MIME type '{$mimeType}' should be rejected for image context '{$imageContext}'"
            );
            
            // Test against document contexts
            $docContext = $documentContexts[array_rand($documentContexts)];
            $isValidDoc = $this->mediaService->isValidFile($file, $docContext);
            
            $this->assertFalse(
                $isValidDoc,
                "File with MIME type '{$mimeType}' should be rejected for document context '{$docContext}'"
            );
        }
    }

    /**
     * Property: Image files are rejected for document-only contexts
     * 
     * For any image file uploaded to a document-only context,
     * the validation should fail.
     */
    public function test_image_files_rejected_for_document_contexts(): void
    {
        $documentContexts = ['ppid_document', 'standar_pelayanan'];
        $imageMimeTypes = MediaService::ALLOWED_IMAGE_TYPES;
        
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            $context = $documentContexts[array_rand($documentContexts)];
            $mimeType = $imageMimeTypes[array_rand($imageMimeTypes)];
            $extension = $this->getExtensionForMimeType($mimeType);
            
            $file = UploadedFile::fake()->create(
                "image_file_{$i}.{$extension}",
                100, // 100KB
                $mimeType
            );
            
            $isValid = $this->mediaService->isValidFile($file, $context);
            
            $this->assertFalse(
                $isValid,
                "Image file with MIME type '{$mimeType}' should be rejected for document context '{$context}'"
            );
        }
    }

    /**
     * Property: Document files are rejected for image-only contexts
     * 
     * For any document file uploaded to an image-only context,
     * the validation should fail.
     */
    public function test_document_files_rejected_for_image_contexts(): void
    {
        $imageContexts = ['hero_image', 'gallery', 'profile_image'];
        $documentMimeTypes = MediaService::ALLOWED_DOCUMENT_TYPES;
        
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            $context = $imageContexts[array_rand($imageContexts)];
            $mimeType = $documentMimeTypes[array_rand($documentMimeTypes)];
            $extension = $this->getExtensionForMimeType($mimeType);
            
            $file = UploadedFile::fake()->create(
                "document_file_{$i}.{$extension}",
                100, // 100KB
                $mimeType
            );
            
            $isValid = $this->mediaService->isValidFile($file, $context);
            
            $this->assertFalse(
                $isValid,
                "Document file with MIME type '{$mimeType}' should be rejected for image context '{$context}'"
            );
        }
    }

    /**
     * Property: Hero image context enforces 2MB limit (Requirement 1.3)
     * 
     * For any file uploaded to hero_image context, files over 2MB should be rejected.
     */
    public function test_hero_image_enforces_2mb_limit(): void
    {
        $maxSize = 2 * 1024 * 1024; // 2MB
        
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            $mimeType = MediaService::ALLOWED_IMAGE_TYPES[array_rand(MediaService::ALLOWED_IMAGE_TYPES)];
            $extension = $this->getExtensionForMimeType($mimeType);
            
            // Test file just under limit (should pass)
            $validSize = fake()->numberBetween(1024, $maxSize);
            $validFile = UploadedFile::fake()->create(
                "valid_hero_{$i}.{$extension}",
                $validSize / 1024,
                $mimeType
            );
            
            $this->assertTrue(
                $this->mediaService->isValidFile($validFile, 'hero_image'),
                "File of {$validSize} bytes should be valid for hero_image"
            );
            
            // Test file over limit (should fail)
            $invalidSize = $maxSize + fake()->numberBetween(1024, 1024 * 1024);
            $invalidFile = UploadedFile::fake()->create(
                "invalid_hero_{$i}.{$extension}",
                $invalidSize / 1024,
                $mimeType
            );
            
            $this->assertFalse(
                $this->mediaService->isValidFile($invalidFile, 'hero_image'),
                "File of {$invalidSize} bytes should be rejected for hero_image (max: {$maxSize})"
            );
        }
    }

    /**
     * Property: Media library accepts both images and documents
     * 
     * For any valid image or document file within size limits,
     * the media_library context should accept it.
     */
    public function test_media_library_accepts_images_and_documents(): void
    {
        $allAllowedTypes = array_merge(
            MediaService::ALLOWED_IMAGE_TYPES,
            MediaService::ALLOWED_DOCUMENT_TYPES
        );
        $maxSize = $this->mediaService->getMaxSizeForContext('media_library');
        
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            $mimeType = $allAllowedTypes[array_rand($allAllowedTypes)];
            $extension = $this->getExtensionForMimeType($mimeType);
            $size = fake()->numberBetween(1024, $maxSize);
            
            $file = UploadedFile::fake()->create(
                "media_file_{$i}.{$extension}",
                $size / 1024,
                $mimeType
            );
            
            $isValid = $this->mediaService->isValidFile($file, 'media_library');
            
            $this->assertTrue(
                $isValid,
                "File with MIME type '{$mimeType}' and size {$size} bytes should be valid for media_library"
            );
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
