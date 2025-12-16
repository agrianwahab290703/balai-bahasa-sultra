<?php

namespace Tests\Feature\Properties;

use App\Models\Berita;
use App\Models\Gallery;
use App\Models\PpidDocument;
use App\Models\Ssd;
use App\Services\CacheService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

/**
 * Property Test: Cache Invalidation on Update
 * 
 * **Feature: admin-fixes, Property 7: Cache Invalidation on Update**
 * **Validates: Requirements 13.2**
 * 
 * *For any* content update operation, the relevant cache keys SHALL be cleared 
 * immediately after successful database update.
 */
class CacheInvalidationOnUpdatePropertyTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Cache keys that should be cleared when Berita is updated
     */
    private array $beritaCacheKeys = [
        'featured_news',
        'popular_news',
        'berita_index___1',
        'berita_index___2',
        'berita_index___3',
    ];

    /**
     * Cache keys that should be cleared when Gallery is updated
     */
    private array $galleryCacheKeys = [
        'gallery_public_index',
        'gallery_categories',
    ];

    /**
     * Cache keys that should be cleared when PPID Document is updated
     */
    private array $ppidCacheKeys = [
        'ppid_documents_all',
    ];

    /**
     * Cache keys that should be cleared when SSD is updated
     */
    private array $ssdCacheKeys = [
        'ssd_public_index',
        'ssd_categories',
    ];

    /**
     * Helper to populate cache with test values
     */
    private function populateCache(array $keys): void
    {
        foreach ($keys as $key) {
            Cache::put($key, 'test_value_' . $key, 3600);
        }
    }

    /**
     * Helper to verify cache keys are cleared
     */
    private function assertCacheCleared(array $keys): void
    {
        foreach ($keys as $key) {
            $this->assertFalse(
                Cache::has($key),
                "Cache key '{$key}' should be cleared after content update"
            );
        }
    }

    /**
     * Helper to create a Berita with all required fields
     */
    private function createBeritaWithRequiredFields(): Berita
    {
        return Berita::create([
            'judul_utama' => fake()->sentence(),
            'ringkasan_inti' => fake()->paragraph(),
            'teras_berita' => fake()->paragraph(),
            'hero_image' => 'images/test.jpg',
            'hero_image_alt' => fake()->sentence(),
            'kategori' => 'kegiatan',
            'is_published' => true,
            'lokasi' => fake()->city(),
            'tanggal_rilis' => fake()->date(),
        ]);
    }

    /**
     * Helper to create a Gallery with all required fields
     */
    private function createGalleryWithRequiredFields(int $userId): Gallery
    {
        $name = fake()->sentence();
        return Gallery::create([
            'name' => $name,
            'title' => $name,
            'slug' => \Illuminate\Support\Str::slug($name) . '-' . fake()->unique()->randomNumber(5),
            'image' => 'images/gallery/test.jpg',
            'category' => 'kegiatan',
            'is_active' => true,
            'user_id' => $userId,
        ]);
    }

    /**
     * Property: Berita update clears berita cache
     * 
     * For any Berita update, all berita-related cache keys should be cleared.
     */
    public function test_berita_update_clears_berita_cache(): void
    {
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            // Arrange: Create a berita first
            $berita = $this->createBeritaWithRequiredFields();
            
            // Populate cache with test values AFTER creation (to reset cache state)
            $this->populateCache($this->beritaCacheKeys);
            
            // Verify cache is populated
            foreach ($this->beritaCacheKeys as $key) {
                $this->assertTrue(Cache::has($key), "Cache key '{$key}' should exist before update");
            }

            // Act: Update the Berita with random data
            $berita->update([
                'judul_utama' => fake()->sentence(),
                'ringkasan_inti' => fake()->paragraph(),
                'is_published' => fake()->boolean(),
            ]);

            // Assert: Cache should be cleared
            $this->assertCacheCleared($this->beritaCacheKeys);

            // Cleanup
            $berita->forceDelete();
        }
    }

    /**
     * Property: Gallery update clears gallery cache
     * 
     * For any Gallery update, all gallery-related cache keys should be cleared.
     */
    public function test_gallery_update_clears_gallery_cache(): void
    {
        // Create a user for the foreign key constraint
        $user = \App\Models\User::factory()->create();

        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            // Arrange: Create a gallery first
            $gallery = $this->createGalleryWithRequiredFields($user->id);
            
            // Populate cache with test values AFTER creation
            $this->populateCache($this->galleryCacheKeys);
            
            // Verify cache is populated
            foreach ($this->galleryCacheKeys as $key) {
                $this->assertTrue(Cache::has($key), "Cache key '{$key}' should exist before update");
            }

            // Act: Update the Gallery with random data
            $gallery->update([
                'name' => fake()->sentence(),
                'description' => fake()->paragraph(),
                'is_active' => fake()->boolean(),
                'is_featured' => fake()->boolean(20),
            ]);

            // Assert: Cache should be cleared
            $this->assertCacheCleared($this->galleryCacheKeys);

            // Cleanup
            $gallery->forceDelete();
        }
    }

    /**
     * Property: PPID Document update clears PPID cache
     * 
     * For any PPID Document update, all PPID-related cache keys should be cleared.
     */
    public function test_ppid_document_update_clears_ppid_cache(): void
    {
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            // Arrange: Create a PPID document first
            $ppidDocument = PpidDocument::create([
                'title' => fake()->sentence(),
                'file_path' => 'documents/' . fake()->uuid() . '.pdf',
                'category' => fake()->randomElement(['informasi_berkala', 'informasi_serta_merta', 'informasi_setiap_saat']),
                'file_type' => 'pdf',
                'file_size' => fake()->numberBetween(1024, 10485760),
                'is_active' => true,
                'download_count' => 0,
            ]);
            
            // Populate cache with test values AFTER creation
            $this->populateCache($this->ppidCacheKeys);
            
            // Verify cache is populated
            foreach ($this->ppidCacheKeys as $key) {
                $this->assertTrue(Cache::has($key), "Cache key '{$key}' should exist before update");
            }

            // Act: Update the PPID Document with random data
            $ppidDocument->update([
                'title' => fake()->sentence(),
                'is_active' => fake()->boolean(),
                'category' => fake()->randomElement(['informasi_berkala', 'informasi_serta_merta', 'informasi_setiap_saat']),
            ]);

            // Assert: Cache should be cleared
            $this->assertCacheCleared($this->ppidCacheKeys);

            // Cleanup
            $ppidDocument->delete();
        }
    }

    /**
     * Property: SSD update clears SSD cache
     * 
     * For any SSD update, all SSD-related cache keys should be cleared.
     */
    public function test_ssd_update_clears_ssd_cache(): void
    {
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            // Arrange: Create an SSD first
            $ssd = Ssd::create([
                'question' => fake()->sentence() . '?',
                'answer' => fake()->paragraph(),
                'category' => fake()->randomElement(['umum', 'layanan', 'teknis']),
                'is_active' => true,
                'sort_order' => fake()->numberBetween(0, 100),
            ]);
            
            // Populate cache with test values AFTER creation
            $this->populateCache($this->ssdCacheKeys);
            
            // Verify cache is populated
            foreach ($this->ssdCacheKeys as $key) {
                $this->assertTrue(Cache::has($key), "Cache key '{$key}' should exist before update");
            }

            // Act: Update the SSD with random data
            $ssd->update([
                'question' => fake()->sentence() . '?',
                'answer' => fake()->paragraph(),
                'is_active' => fake()->boolean(),
            ]);

            // Assert: Cache should be cleared
            $this->assertCacheCleared($this->ssdCacheKeys);

            // Cleanup
            $ssd->delete();
        }
    }

    /**
     * Property: Cache invalidation is immediate after update
     * 
     * For any content type, cache should be cleared immediately after the model
     * is updated in the database (not deferred).
     */
    public function test_cache_invalidation_is_immediate_after_update(): void
    {
        // Create a user for gallery foreign key constraint
        $user = \App\Models\User::factory()->create();
        
        // Property test: run 100 iterations with random content types
        $contentTypes = ['berita', 'gallery', 'ppid', 'ssd'];

        for ($i = 0; $i < 100; $i++) {
            $contentType = fake()->randomElement($contentTypes);
            
            switch ($contentType) {
                case 'berita':
                    $model = $this->createBeritaWithRequiredFields();
                    $this->populateCache($this->beritaCacheKeys);
                    $model->update(['judul_utama' => fake()->sentence()]);
                    // Immediately after update, cache should be cleared
                    $this->assertCacheCleared($this->beritaCacheKeys);
                    $model->forceDelete();
                    break;

                case 'gallery':
                    $model = $this->createGalleryWithRequiredFields($user->id);
                    $this->populateCache($this->galleryCacheKeys);
                    $model->update(['name' => fake()->sentence()]);
                    $this->assertCacheCleared($this->galleryCacheKeys);
                    $model->forceDelete();
                    break;

                case 'ppid':
                    $model = PpidDocument::create([
                        'title' => fake()->sentence(),
                        'file_path' => 'documents/test.pdf',
                        'category' => 'informasi_berkala',
                        'file_type' => 'pdf',
                        'file_size' => 1024,
                        'is_active' => true,
                    ]);
                    $this->populateCache($this->ppidCacheKeys);
                    $model->update(['title' => fake()->sentence()]);
                    $this->assertCacheCleared($this->ppidCacheKeys);
                    $model->delete();
                    break;

                case 'ssd':
                    $model = Ssd::create([
                        'question' => fake()->sentence() . '?',
                        'answer' => fake()->paragraph(),
                        'category' => 'umum',
                        'is_active' => true,
                    ]);
                    $this->populateCache($this->ssdCacheKeys);
                    $model->update(['question' => fake()->sentence() . '?']);
                    $this->assertCacheCleared($this->ssdCacheKeys);
                    $model->delete();
                    break;
            }
        }
    }

    /**
     * Property: Only relevant cache is cleared on update
     * 
     * For any content update, only the cache keys related to that content type
     * should be cleared, not other content types' cache.
     */
    public function test_only_relevant_cache_is_cleared_on_update(): void
    {
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            // Create a berita first
            $berita = $this->createBeritaWithRequiredFields();
            
            // Populate all cache keys
            $this->populateCache($this->beritaCacheKeys);
            $this->populateCache($this->galleryCacheKeys);
            $this->populateCache($this->ppidCacheKeys);
            $this->populateCache($this->ssdCacheKeys);

            // Update the Berita
            $berita->update(['judul_utama' => fake()->sentence()]);

            // Berita cache should be cleared
            $this->assertCacheCleared($this->beritaCacheKeys);

            // Other caches should NOT be cleared
            foreach ($this->galleryCacheKeys as $key) {
                $this->assertTrue(
                    Cache::has($key),
                    "Gallery cache key '{$key}' should NOT be cleared when Berita is updated"
                );
            }
            foreach ($this->ppidCacheKeys as $key) {
                $this->assertTrue(
                    Cache::has($key),
                    "PPID cache key '{$key}' should NOT be cleared when Berita is updated"
                );
            }
            foreach ($this->ssdCacheKeys as $key) {
                $this->assertTrue(
                    Cache::has($key),
                    "SSD cache key '{$key}' should NOT be cleared when Berita is updated"
                );
            }

            // Cleanup
            $berita->forceDelete();
        }
    }

    /**
     * Property: Multiple updates clear cache each time
     * 
     * For any content item, each update operation should clear the cache,
     * even if the item is updated multiple times in succession.
     */
    public function test_multiple_updates_clear_cache_each_time(): void
    {
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            // Create a berita
            $berita = $this->createBeritaWithRequiredFields();
            
            // Perform multiple updates, checking cache after each
            $updateCount = fake()->numberBetween(2, 5);
            
            for ($j = 0; $j < $updateCount; $j++) {
                // Populate cache before each update
                $this->populateCache($this->beritaCacheKeys);
                
                // Verify cache is populated
                foreach ($this->beritaCacheKeys as $key) {
                    $this->assertTrue(Cache::has($key), "Cache key '{$key}' should exist before update #{$j}");
                }
                
                // Update the berita
                $berita->update(['judul_utama' => fake()->sentence()]);
                
                // Cache should be cleared after each update
                $this->assertCacheCleared($this->beritaCacheKeys);
            }

            // Cleanup
            $berita->forceDelete();
        }
    }
}
