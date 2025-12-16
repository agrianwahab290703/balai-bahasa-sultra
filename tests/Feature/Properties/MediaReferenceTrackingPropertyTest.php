<?php

namespace Tests\Feature\Properties;

use App\Models\Berita;
use App\Models\Media;
use App\Models\ProfileContent;
use App\Services\MediaService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

/**
 * Property Test: Media Reference Tracking
 * 
 * **Feature: admin-crud-management, Property 12: Media Reference Tracking**
 * **Validates: Requirements 8.5**
 * 
 * *For any* media deletion attempt, if the media is referenced by other entities, 
 * the system SHALL prevent deletion and return the list of referencing entities.
 */
class MediaReferenceTrackingPropertyTest extends TestCase
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
     * Helper to create a media record with a fake file.
     */
    protected function createMedia(array $overrides = []): Media
    {
        $filename = fake()->unique()->slug() . '.jpg';
        $path = 'uploads/' . $filename;
        
        // Create a fake file in storage
        Storage::disk('public')->put($path, 'fake image content');
        
        return Media::create(array_merge([
            'filename' => $filename,
            'path' => $path,
            'mime_type' => 'image/jpeg',
            'size' => 1024,
            'width' => 800,
            'height' => 600,
            'usage_count' => 0,
        ], $overrides));
    }

    /**
     * Helper to create a Berita that references a media file.
     */
    protected function createBeritaWithMedia(Media $media): Berita
    {
        return Berita::create([
            'judul_utama' => fake()->sentence(),
            'slug' => fake()->unique()->slug(),
            'ringkasan_inti' => fake()->paragraph(),
            'hero_image' => $media->path,
            'hero_image_alt' => fake()->sentence(),
            'lokasi' => 'Kendari',
            'tanggal_rilis' => now(),
            'teras_berita' => fake()->paragraph(),
            'kategori' => 'kegiatan',
            'is_published' => true,
        ]);
    }

    /**
     * Property: Referenced media cannot be deleted
     * 
     * For any media file that is referenced by at least one entity,
     * deletion should be prevented and throw an exception.
     */
    public function test_referenced_media_cannot_be_deleted(): void
    {
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            $media = $this->createMedia();
            
            // Create a Berita that references this media
            $berita = $this->createBeritaWithMedia($media);
            
            // Update usage count to reflect the reference
            $media->update(['usage_count' => 1]);
            
            // Attempt to delete should throw exception
            $exceptionThrown = false;
            try {
                $this->mediaService->delete($media);
            } catch (\RuntimeException $e) {
                $exceptionThrown = true;
                $this->assertStringContainsString(
                    'Cannot delete media',
                    $e->getMessage()
                );
            }
            
            $this->assertTrue(
                $exceptionThrown,
                "Deletion of referenced media should throw RuntimeException"
            );
            
            // Verify media still exists
            $this->assertDatabaseHas('media', ['id' => $media->id]);
            
            // Clean up for next iteration
            $berita->forceDelete();
            $media->update(['usage_count' => 0]);
            $this->mediaService->delete($media);
        }
    }

    /**
     * Property: Unreferenced media can be deleted
     * 
     * For any media file that is not referenced by any entity,
     * deletion should succeed.
     */
    public function test_unreferenced_media_can_be_deleted(): void
    {
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            $media = $this->createMedia();
            
            // Ensure usage count is 0
            $this->assertEquals(0, $media->usage_count);
            
            // Deletion should succeed
            $result = $this->mediaService->delete($media);
            
            $this->assertTrue($result, "Deletion of unreferenced media should succeed");
            
            // Verify media is deleted
            $this->assertDatabaseMissing('media', ['id' => $media->id]);
        }
    }

    /**
     * Property: findReferences returns all referencing entities
     * 
     * For any media file referenced by multiple entities,
     * findReferences should return all of them.
     */
    public function test_find_references_returns_all_referencing_entities(): void
    {
        // Property test: run 50 iterations (fewer due to more complex setup)
        for ($i = 0; $i < 50; $i++) {
            $media = $this->createMedia();
            
            // Create random number of Berita references (1-5)
            $numReferences = fake()->numberBetween(1, 5);
            $beritas = [];
            
            for ($j = 0; $j < $numReferences; $j++) {
                $beritas[] = $this->createBeritaWithMedia($media);
            }
            
            // Find references
            $references = $this->mediaService->findReferences($media);
            
            // Should find all references
            $this->assertCount(
                $numReferences,
                $references,
                "Should find exactly {$numReferences} references"
            );
            
            // All references should be of type Berita
            foreach ($references as $ref) {
                $this->assertEquals('Berita', $ref['type']);
                $this->assertArrayHasKey('id', $ref);
                $this->assertArrayHasKey('title', $ref);
            }
            
            // Clean up
            foreach ($beritas as $berita) {
                $berita->forceDelete();
            }
            $media->delete();
        }
    }

    /**
     * Property: Usage count reflects actual references
     * 
     * For any media file, the usage_count should accurately reflect
     * the number of entities referencing it after updateUsageCount is called.
     */
    public function test_usage_count_reflects_actual_references(): void
    {
        // Property test: run 50 iterations
        for ($i = 0; $i < 50; $i++) {
            $media = $this->createMedia();
            
            // Create random number of references (0-5)
            $numReferences = fake()->numberBetween(0, 5);
            $beritas = [];
            
            for ($j = 0; $j < $numReferences; $j++) {
                $beritas[] = $this->createBeritaWithMedia($media);
            }
            
            // Update usage count
            $count = $this->mediaService->updateUsageCount($media);
            
            // Usage count should match number of references
            $this->assertEquals(
                $numReferences,
                $count,
                "Usage count should be {$numReferences}"
            );
            
            // Refresh and verify
            $media->refresh();
            $this->assertEquals($numReferences, $media->usage_count);
            
            // Clean up
            foreach ($beritas as $berita) {
                $berita->forceDelete();
            }
            $media->delete();
        }
    }

    /**
     * Property: isInUse correctly identifies referenced media
     * 
     * For any media file, isInUse should return true if and only if
     * usage_count is greater than 0.
     */
    public function test_is_in_use_correctly_identifies_referenced_media(): void
    {
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            $usageCount = fake()->numberBetween(0, 10);
            
            $media = $this->createMedia(['usage_count' => $usageCount]);
            
            $isInUse = $media->isInUse();
            
            if ($usageCount > 0) {
                $this->assertTrue(
                    $isInUse,
                    "Media with usage_count {$usageCount} should be in use"
                );
            } else {
                $this->assertFalse(
                    $isInUse,
                    "Media with usage_count 0 should not be in use"
                );
            }
            
            // Clean up
            $media->delete();
        }
    }

    /**
     * Property: Increment and decrement usage count work correctly
     * 
     * For any media file, incrementUsage should increase usage_count by 1,
     * and decrementUsage should decrease it by 1 (but not below 0).
     */
    public function test_increment_decrement_usage_count(): void
    {
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            $initialCount = fake()->numberBetween(0, 100);
            $media = $this->createMedia(['usage_count' => $initialCount]);
            
            // Test increment
            $this->mediaService->incrementUsage($media);
            $media->refresh();
            $this->assertEquals(
                $initialCount + 1,
                $media->usage_count,
                "Increment should increase count by 1"
            );
            
            // Test decrement
            $this->mediaService->decrementUsage($media);
            $media->refresh();
            $this->assertEquals(
                $initialCount,
                $media->usage_count,
                "Decrement should decrease count by 1"
            );
            
            // Clean up
            $media->delete();
        }
    }

    /**
     * Property: Decrement does not go below zero
     * 
     * For any media file with usage_count of 0,
     * decrementUsage should not make it negative.
     */
    public function test_decrement_does_not_go_below_zero(): void
    {
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            $media = $this->createMedia(['usage_count' => 0]);
            
            // Try to decrement multiple times
            $decrementAttempts = fake()->numberBetween(1, 10);
            for ($j = 0; $j < $decrementAttempts; $j++) {
                $this->mediaService->decrementUsage($media);
            }
            
            $media->refresh();
            
            $this->assertEquals(
                0,
                $media->usage_count,
                "Usage count should not go below 0"
            );
            
            // Clean up
            $media->delete();
        }
    }
}
