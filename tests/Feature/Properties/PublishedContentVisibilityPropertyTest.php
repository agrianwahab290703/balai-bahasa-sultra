<?php

namespace Tests\Feature\Properties;

use App\Models\Berita;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Property Test: Published Content Visibility
 * 
 * **Feature: admin-fixes, Property 2: Published Content Visibility**
 * **Validates: Requirements 2.4, 9.1**
 * 
 * *For any* content item (Berita) with is_published=true, the item SHALL appear 
 * in the corresponding public page query results.
 */
class PublishedContentVisibilityPropertyTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Helper to create a Berita with all required fields
     */
    private function createBeritaWithRequiredFields(bool $isPublished): Berita
    {
        return Berita::create([
            'judul_utama' => fake()->sentence(),
            'ringkasan_inti' => fake()->paragraph(),
            'teras_berita' => fake()->paragraph(),
            'hero_image' => 'images/test.jpg',
            'hero_image_alt' => fake()->sentence(),
            'kategori' => fake()->randomElement(['prestasi', 'kegiatan', 'kerjasama']),
            'is_published' => $isPublished,
            'lokasi' => fake()->city(),
            'tanggal_rilis' => fake()->date(),
        ]);
    }

    /**
     * Property: Published berita appears in public query
     * 
     * **Feature: admin-fixes, Property 2: Published Content Visibility**
     * **Validates: Requirements 2.4, 9.1**
     * 
     * For any Berita with is_published=true, it should appear in the published() scope query.
     */
    public function test_published_berita_appears_in_public_query(): void
    {
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            // Arrange: Create a published berita with random data
            $berita = $this->createBeritaWithRequiredFields(true);

            // Act: Query using the published scope (same as public page)
            $publicBerita = Berita::published()->get();

            // Assert: The published berita should appear in the query results
            $this->assertTrue(
                $publicBerita->pluck('id')->contains($berita->id),
                "Published berita with id {$berita->id} should appear in public query results"
            );

            // Cleanup
            $berita->forceDelete();
        }
    }

    /**
     * Property: All published berita are included in public query
     * 
     * **Feature: admin-fixes, Property 2: Published Content Visibility**
     * **Validates: Requirements 2.4, 9.1**
     * 
     * For any set of published berita, all of them should appear in the published() scope query.
     */
    public function test_all_published_berita_are_included_in_public_query(): void
    {
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            // Arrange: Create a random number of published berita (1-5)
            $count = fake()->numberBetween(1, 5);
            $publishedBerita = [];
            
            for ($j = 0; $j < $count; $j++) {
                $publishedBerita[] = $this->createBeritaWithRequiredFields(true);
            }

            // Act: Query using the published scope
            $publicBerita = Berita::published()->get();
            $publicIds = $publicBerita->pluck('id')->toArray();

            // Assert: All published berita should appear in the query results
            foreach ($publishedBerita as $berita) {
                $this->assertContains(
                    $berita->id,
                    $publicIds,
                    "Published berita with id {$berita->id} should appear in public query results"
                );
            }

            // Cleanup
            foreach ($publishedBerita as $berita) {
                $berita->forceDelete();
            }
        }
    }

    /**
     * Property: Published berita with any valid category appears in public query
     * 
     * **Feature: admin-fixes, Property 2: Published Content Visibility**
     * **Validates: Requirements 2.4, 9.1**
     * 
     * For any published berita regardless of category, it should appear in the published() scope query.
     */
    public function test_published_berita_with_any_category_appears_in_public_query(): void
    {
        $categories = ['prestasi', 'kegiatan', 'kerjasama', 'pengumuman', 'berita'];

        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            // Arrange: Create a published berita with random category
            $category = fake()->randomElement($categories);
            $berita = Berita::create([
                'judul_utama' => fake()->sentence(),
                'ringkasan_inti' => fake()->paragraph(),
                'teras_berita' => fake()->paragraph(),
                'hero_image' => 'images/test.jpg',
                'hero_image_alt' => fake()->sentence(),
                'kategori' => $category,
                'is_published' => true,
                'lokasi' => fake()->city(),
                'tanggal_rilis' => fake()->date(),
            ]);

            // Act: Query using the published scope
            $publicBerita = Berita::published()->get();

            // Assert: The published berita should appear regardless of category
            $this->assertTrue(
                $publicBerita->pluck('id')->contains($berita->id),
                "Published berita with category '{$category}' should appear in public query results"
            );

            // Cleanup
            $berita->forceDelete();
        }
    }

    /**
     * Property: Published berita count matches database count
     * 
     * **Feature: admin-fixes, Property 2: Published Content Visibility**
     * **Validates: Requirements 2.4, 9.1**
     * 
     * The count of berita returned by published() scope should match the actual count
     * of berita with is_published=true in the database.
     */
    public function test_published_berita_count_matches_database_count(): void
    {
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            // Arrange: Create a mix of published and unpublished berita
            $publishedCount = fake()->numberBetween(1, 5);
            $unpublishedCount = fake()->numberBetween(0, 3);
            
            $allBerita = [];
            
            for ($j = 0; $j < $publishedCount; $j++) {
                $allBerita[] = $this->createBeritaWithRequiredFields(true);
            }
            
            for ($j = 0; $j < $unpublishedCount; $j++) {
                $allBerita[] = $this->createBeritaWithRequiredFields(false);
            }

            // Act: Query using the published scope
            $publicBeritaCount = Berita::published()->count();
            $actualPublishedCount = Berita::where('is_published', true)->count();

            // Assert: The counts should match
            $this->assertEquals(
                $actualPublishedCount,
                $publicBeritaCount,
                "Published scope count ({$publicBeritaCount}) should match actual published count ({$actualPublishedCount})"
            );

            // Cleanup
            foreach ($allBerita as $berita) {
                $berita->forceDelete();
            }
        }
    }
}
