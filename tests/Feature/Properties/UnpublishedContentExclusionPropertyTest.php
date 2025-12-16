<?php

namespace Tests\Feature\Properties;

use App\Models\Berita;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Property Test: Unpublished Content Exclusion
 * 
 * **Feature: admin-fixes, Property 3: Unpublished Content Exclusion**
 * **Validates: Requirements 9.3**
 * 
 * *For any* content item with is_published=false, the item SHALL NOT appear 
 * in public page query results.
 */
class UnpublishedContentExclusionPropertyTest extends TestCase
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
     * Property: Unpublished berita does not appear in public query
     * 
     * **Feature: admin-fixes, Property 3: Unpublished Content Exclusion**
     * **Validates: Requirements 9.3**
     * 
     * For any Berita with is_published=false, it should NOT appear in the published() scope query.
     */
    public function test_unpublished_berita_does_not_appear_in_public_query(): void
    {
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            // Arrange: Create an unpublished berita with random data
            $berita = $this->createBeritaWithRequiredFields(false);

            // Act: Query using the published scope (same as public page)
            $publicBerita = Berita::published()->get();

            // Assert: The unpublished berita should NOT appear in the query results
            $this->assertFalse(
                $publicBerita->pluck('id')->contains($berita->id),
                "Unpublished berita with id {$berita->id} should NOT appear in public query results"
            );

            // Cleanup
            $berita->forceDelete();
        }
    }

    /**
     * Property: Soft deleted berita does not appear in public query
     * 
     * **Feature: admin-fixes, Property 3: Unpublished Content Exclusion**
     * **Validates: Requirements 9.3**
     * 
     * For any Berita that is soft deleted, it should NOT appear in the published() scope query.
     */
    public function test_soft_deleted_berita_does_not_appear_in_public_query(): void
    {
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            // Arrange: Create a published berita and then soft delete it
            $berita = $this->createBeritaWithRequiredFields(true);
            $beritaId = $berita->id;
            
            // Soft delete the berita
            $berita->delete();

            // Act: Query using the published scope (same as public page)
            $publicBerita = Berita::published()->get();

            // Assert: The soft deleted berita should NOT appear in the query results
            $this->assertFalse(
                $publicBerita->pluck('id')->contains($beritaId),
                "Soft deleted berita with id {$beritaId} should NOT appear in public query results"
            );

            // Cleanup - force delete the soft deleted record
            Berita::withTrashed()->find($beritaId)?->forceDelete();
        }
    }

    /**
     * Property: Mixed published/unpublished - only published appear
     * 
     * **Feature: admin-fixes, Property 3: Unpublished Content Exclusion**
     * **Validates: Requirements 9.3**
     * 
     * For any mix of published and unpublished berita, only published ones should appear.
     */
    public function test_only_published_berita_appear_in_mixed_set(): void
    {
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            // Arrange: Create a mix of published and unpublished berita
            $publishedCount = fake()->numberBetween(1, 3);
            $unpublishedCount = fake()->numberBetween(1, 3);
            
            $publishedBerita = [];
            $unpublishedBerita = [];
            
            for ($j = 0; $j < $publishedCount; $j++) {
                $publishedBerita[] = $this->createBeritaWithRequiredFields(true);
            }
            
            for ($j = 0; $j < $unpublishedCount; $j++) {
                $unpublishedBerita[] = $this->createBeritaWithRequiredFields(false);
            }

            // Act: Query using the published scope
            $publicBerita = Berita::published()->get();
            $publicIds = $publicBerita->pluck('id')->toArray();

            // Assert: All published berita should appear
            foreach ($publishedBerita as $berita) {
                $this->assertContains(
                    $berita->id,
                    $publicIds,
                    "Published berita with id {$berita->id} should appear in public query results"
                );
            }

            // Assert: No unpublished berita should appear
            foreach ($unpublishedBerita as $berita) {
                $this->assertNotContains(
                    $berita->id,
                    $publicIds,
                    "Unpublished berita with id {$berita->id} should NOT appear in public query results"
                );
            }

            // Cleanup
            foreach ($publishedBerita as $berita) {
                $berita->forceDelete();
            }
            foreach ($unpublishedBerita as $berita) {
                $berita->forceDelete();
            }
        }
    }

    /**
     * Property: Unpublished count matches exclusion from public query
     * 
     * **Feature: admin-fixes, Property 3: Unpublished Content Exclusion**
     * **Validates: Requirements 9.3**
     * 
     * The count of berita returned by published() scope should exclude all unpublished berita.
     */
    public function test_unpublished_berita_count_excluded_from_public_query(): void
    {
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            // Arrange: Create a mix of published and unpublished berita
            $publishedCount = fake()->numberBetween(1, 5);
            $unpublishedCount = fake()->numberBetween(1, 3);
            
            $allBerita = [];
            
            for ($j = 0; $j < $publishedCount; $j++) {
                $allBerita[] = $this->createBeritaWithRequiredFields(true);
            }
            
            for ($j = 0; $j < $unpublishedCount; $j++) {
                $allBerita[] = $this->createBeritaWithRequiredFields(false);
            }

            // Act: Query counts
            $publicBeritaCount = Berita::published()->count();
            $totalCount = Berita::count();
            $unpublishedDbCount = Berita::where('is_published', false)->count();

            // Assert: Published count should equal total minus unpublished
            $this->assertEquals(
                $totalCount - $unpublishedDbCount,
                $publicBeritaCount,
                "Published scope count ({$publicBeritaCount}) should equal total ({$totalCount}) minus unpublished ({$unpublishedDbCount})"
            );

            // Cleanup
            foreach ($allBerita as $berita) {
                $berita->forceDelete();
            }
        }
    }
}
