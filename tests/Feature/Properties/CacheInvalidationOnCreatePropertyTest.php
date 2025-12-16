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
 * Property Test: Cache Invalidation on Create
 * 
 * **Feature: admin-fixes, Property 6: Cache Invalidation on Create**
 * **Validates: Requirements 2.5, 13.1**
 * 
 * *For any* content creation operation, the relevant cache keys SHALL be cleared 
 * immediately after successful database insertion.
 */
class CacheInvalidationOnCreatePropertyTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Cache keys that should be cleared when Berita is created
     */
    private array $beritaCacheKeys = [
        'featured_news',
        'popular_news',
        'berita_index___1',
        'berita_index___2',
        'berita_index___3',
    ];

    /**
     * Cache keys that should be cleared when Gallery is created
     */
    private array $galleryCacheKeys = [
        'gallery_public_index',
        'gallery_categories',
    ];

    /**
     * Cache keys that should be cleared when PPID Document is created
     */
    private array $ppidCacheKeys = [
        'ppid_documents_all',
    ];

    /**
     * Cache keys that should be cleared when SSD is created
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
                "Cache key '{$key}' should be cleared after content creation"
            );
        }
    }

    /**
     * Property: Berita creation clears berita cache
     * 
     * For any Berita creation, all berita-related cache keys should be cleared.
     */
    public function test_berita_creation_clears_berita_cache(): void
    {
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            // Arrange: Populate cache with test values
            $this->populateCache($this->beritaCacheKeys);
            
            // Verify cache is populated
            foreach ($this->beritaCacheKeys as $key) {
                $this->assertTrue(Cache::has($key), "Cache key '{$key}' should exist before creation");
            }

            // Act: Create a new Berita with random data (including all required fields)
            $berita = Berita::create([
                'judul_utama' => fake()->sentence(),
                'ringkasan_inti' => fake()->paragraph(),
                'teras_berita' => fake()->paragraph(),
                'hero_image' => 'images/test.jpg',
                'hero_image_alt' => fake()->sentence(),
                'kategori' => fake()->randomElement(['prestasi', 'kegiatan', 'kerjasama']),
                'is_published' => fake()->boolean(),
                'lokasi' => fake()->city(),
                'tanggal_rilis' => fake()->date(),
            ]);

            // Assert: Cache should be cleared
            $this->assertCacheCleared($this->beritaCacheKeys);

            // Cleanup
            $berita->forceDelete();
        }
    }

    /**
     * Property: Gallery creation clears gallery cache
     * 
     * For any Gallery creation, all gallery-related cache keys should be cleared.
     */
    public function test_gallery_creation_clears_gallery_cache(): void
    {
        // Create a user for the foreign key constraint
        $user = \App\Models\User::factory()->create();

        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            // Arrange: Populate cache with test values
            $this->populateCache($this->galleryCacheKeys);
            
            // Verify cache is populated
            foreach ($this->galleryCacheKeys as $key) {
                $this->assertTrue(Cache::has($key), "Cache key '{$key}' should exist before creation");
            }

            // Act: Create a new Gallery with random data (including all required fields)
            $name = fake()->sentence();
            $gallery = Gallery::create([
                'name' => $name,
                'title' => $name,
                'slug' => \Illuminate\Support\Str::slug($name) . '-' . fake()->unique()->randomNumber(4),
                'description' => fake()->optional()->paragraph(),
                'image' => 'images/gallery/' . fake()->uuid() . '.jpg',
                'category' => fake()->randomElement(['kegiatan', 'acara', 'dokumentasi']),
                'is_active' => fake()->boolean(),
                'is_featured' => fake()->boolean(20),
                'sort_order' => fake()->numberBetween(0, 100),
                'user_id' => $user->id,
            ]);

            // Assert: Cache should be cleared
            $this->assertCacheCleared($this->galleryCacheKeys);

            // Cleanup
            $gallery->forceDelete();
        }
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
     * Property: PPID Document creation clears PPID cache
     * 
     * For any PPID Document creation, all PPID-related cache keys should be cleared.
     */
    public function test_ppid_document_creation_clears_ppid_cache(): void
    {
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            // Arrange: Populate cache with test values
            $this->populateCache($this->ppidCacheKeys);
            
            // Verify cache is populated
            foreach ($this->ppidCacheKeys as $key) {
                $this->assertTrue(Cache::has($key), "Cache key '{$key}' should exist before creation");
            }

            // Act: Create a new PPID Document with random data
            $ppidDocument = PpidDocument::create([
                'title' => fake()->sentence(),
                'file_path' => 'documents/' . fake()->uuid() . '.pdf',
                'category' => fake()->randomElement(['informasi_berkala', 'informasi_serta_merta', 'informasi_setiap_saat']),
                'file_type' => fake()->randomElement(['pdf', 'doc', 'docx']),
                'file_size' => fake()->numberBetween(1024, 10485760),
                'is_active' => fake()->boolean(),
                'download_count' => 0,
            ]);

            // Assert: Cache should be cleared
            $this->assertCacheCleared($this->ppidCacheKeys);

            // Cleanup
            $ppidDocument->delete();
        }
    }

    /**
     * Property: SSD creation clears SSD cache
     * 
     * For any SSD creation, all SSD-related cache keys should be cleared.
     */
    public function test_ssd_creation_clears_ssd_cache(): void
    {
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            // Arrange: Populate cache with test values
            $this->populateCache($this->ssdCacheKeys);
            
            // Verify cache is populated
            foreach ($this->ssdCacheKeys as $key) {
                $this->assertTrue(Cache::has($key), "Cache key '{$key}' should exist before creation");
            }

            // Act: Create a new SSD with random data
            $ssd = Ssd::create([
                'question' => fake()->sentence() . '?',
                'answer' => fake()->paragraph(),
                'category' => fake()->randomElement(['umum', 'layanan', 'teknis']),
                'is_active' => fake()->boolean(),
                'sort_order' => fake()->numberBetween(0, 100),
            ]);

            // Assert: Cache should be cleared
            $this->assertCacheCleared($this->ssdCacheKeys);

            // Cleanup
            $ssd->delete();
        }
    }

    /**
     * Property: Cache invalidation is immediate after creation
     * 
     * For any content type, cache should be cleared immediately after the model
     * is saved to the database (not deferred).
     */
    public function test_cache_invalidation_is_immediate(): void
    {
        // Create a user for gallery foreign key constraint
        $user = \App\Models\User::factory()->create();
        
        // Property test: run 100 iterations with random content types
        $contentTypes = ['berita', 'gallery', 'ppid', 'ssd'];

        for ($i = 0; $i < 100; $i++) {
            $contentType = fake()->randomElement($contentTypes);
            
            switch ($contentType) {
                case 'berita':
                    $this->populateCache($this->beritaCacheKeys);
                    $model = $this->createBeritaWithRequiredFields();
                    // Immediately after create, cache should be cleared
                    $this->assertCacheCleared($this->beritaCacheKeys);
                    $model->forceDelete();
                    break;

                case 'gallery':
                    $this->populateCache($this->galleryCacheKeys);
                    $model = $this->createGalleryWithRequiredFields($user->id);
                    $this->assertCacheCleared($this->galleryCacheKeys);
                    $model->forceDelete();
                    break;

                case 'ppid':
                    $this->populateCache($this->ppidCacheKeys);
                    $model = PpidDocument::create([
                        'title' => fake()->sentence(),
                        'file_path' => 'documents/test.pdf',
                        'category' => 'informasi_berkala',
                        'file_type' => 'pdf',
                        'file_size' => 1024,
                        'is_active' => true,
                    ]);
                    $this->assertCacheCleared($this->ppidCacheKeys);
                    $model->delete();
                    break;

                case 'ssd':
                    $this->populateCache($this->ssdCacheKeys);
                    $model = Ssd::create([
                        'question' => fake()->sentence() . '?',
                        'answer' => fake()->paragraph(),
                        'category' => 'umum',
                        'is_active' => true,
                    ]);
                    $this->assertCacheCleared($this->ssdCacheKeys);
                    $model->delete();
                    break;
            }
        }
    }

    /**
     * Property: Only relevant cache is cleared on creation
     * 
     * For any content creation, only the cache keys related to that content type
     * should be cleared, not other content types' cache.
     */
    public function test_only_relevant_cache_is_cleared(): void
    {
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            // Populate all cache keys
            $this->populateCache($this->beritaCacheKeys);
            $this->populateCache($this->galleryCacheKeys);
            $this->populateCache($this->ppidCacheKeys);
            $this->populateCache($this->ssdCacheKeys);

            // Create a Berita with all required fields
            $berita = $this->createBeritaWithRequiredFields();

            // Berita cache should be cleared
            $this->assertCacheCleared($this->beritaCacheKeys);

            // Other caches should NOT be cleared
            foreach ($this->galleryCacheKeys as $key) {
                $this->assertTrue(
                    Cache::has($key),
                    "Gallery cache key '{$key}' should NOT be cleared when Berita is created"
                );
            }
            foreach ($this->ppidCacheKeys as $key) {
                $this->assertTrue(
                    Cache::has($key),
                    "PPID cache key '{$key}' should NOT be cleared when Berita is created"
                );
            }
            foreach ($this->ssdCacheKeys as $key) {
                $this->assertTrue(
                    Cache::has($key),
                    "SSD cache key '{$key}' should NOT be cleared when Berita is created"
                );
            }

            // Cleanup
            $berita->forceDelete();
        }
    }
}
