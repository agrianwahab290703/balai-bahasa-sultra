<?php

namespace Tests\Feature\Properties;

use App\Models\Berita;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Property Test: View Counter Increment
 * 
 * **Feature: admin-fixes, Property 10: View Counter Increment**
 * **Validates: Requirements 9.5**
 * 
 * *For any* berita view operation, the view_count field SHALL be incremented by exactly 1.
 */
class ViewCounterIncrementPropertyTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Helper to create a published Berita with all required fields
     */
    private function createPublishedBerita(int $initialViewCount = 0): Berita
    {
        return Berita::create([
            'judul_utama' => fake()->sentence(),
            'ringkasan_inti' => fake()->paragraph(),
            'teras_berita' => fake()->paragraph(),
            'hero_image' => 'images/test.jpg',
            'hero_image_alt' => fake()->sentence(),
            'kategori' => fake()->randomElement(['prestasi', 'kegiatan', 'kerjasama']),
            'is_published' => true,
            'lokasi' => fake()->city(),
            'tanggal_rilis' => fake()->date(),
            'view_count' => $initialViewCount,
        ]);
    }

    /**
     * Property: View count increments by exactly 1 on each view
     * 
     * **Feature: admin-fixes, Property 10: View Counter Increment**
     * **Validates: Requirements 9.5**
     * 
     * For any berita, calling increment('view_count') should increase the view_count by exactly 1.
     */
    public function test_view_count_increments_by_exactly_one(): void
    {
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            // Arrange: Create a berita with random initial view count
            $initialViewCount = fake()->numberBetween(0, 10000);
            $berita = $this->createPublishedBerita($initialViewCount);

            // Act: Increment view count (simulating a view)
            $berita->increment('view_count');
            $berita->refresh();

            // Assert: View count should be exactly initialViewCount + 1
            $this->assertEquals(
                $initialViewCount + 1,
                $berita->view_count,
                "View count should be {$initialViewCount} + 1 = " . ($initialViewCount + 1) . ", but got {$berita->view_count}"
            );

            // Cleanup
            $berita->forceDelete();
        }
    }

    /**
     * Property: Multiple view increments are cumulative
     * 
     * **Feature: admin-fixes, Property 10: View Counter Increment**
     * **Validates: Requirements 9.5**
     * 
     * For any berita, multiple increment operations should each add exactly 1 to the view_count.
     */
    public function test_multiple_view_increments_are_cumulative(): void
    {
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            // Arrange: Create a berita with random initial view count
            $initialViewCount = fake()->numberBetween(0, 1000);
            $numberOfViews = fake()->numberBetween(1, 10);
            $berita = $this->createPublishedBerita($initialViewCount);

            // Act: Increment view count multiple times
            for ($j = 0; $j < $numberOfViews; $j++) {
                $berita->increment('view_count');
            }
            $berita->refresh();

            // Assert: View count should be exactly initialViewCount + numberOfViews
            $expectedCount = $initialViewCount + $numberOfViews;
            $this->assertEquals(
                $expectedCount,
                $berita->view_count,
                "After {$numberOfViews} views, count should be {$expectedCount}, but got {$berita->view_count}"
            );

            // Cleanup
            $berita->forceDelete();
        }
    }

    /**
     * Property: incrementViewCount method increments by exactly 1
     * 
     * **Feature: admin-fixes, Property 10: View Counter Increment**
     * **Validates: Requirements 9.5**
     * 
     * For any berita, calling incrementViewCount() should increase the view_count by exactly 1.
     */
    public function test_increment_view_count_method_increments_by_exactly_one(): void
    {
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            // Arrange: Create a berita with random initial view count
            $initialViewCount = fake()->numberBetween(0, 10000);
            $berita = $this->createPublishedBerita($initialViewCount);

            // Act: Use the model's incrementViewCount method
            $newCount = $berita->incrementViewCount();
            $berita->refresh();

            // Assert: View count should be exactly initialViewCount + 1
            $this->assertEquals(
                $initialViewCount + 1,
                $berita->view_count,
                "View count should be {$initialViewCount} + 1 = " . ($initialViewCount + 1) . ", but got {$berita->view_count}"
            );

            // Assert: The returned value should match the new count
            $this->assertEquals(
                $berita->view_count,
                $newCount,
                "Returned count ({$newCount}) should match database count ({$berita->view_count})"
            );

            // Cleanup
            $berita->forceDelete();
        }
    }

    /**
     * Property: View count never decreases on increment
     * 
     * **Feature: admin-fixes, Property 10: View Counter Increment**
     * **Validates: Requirements 9.5**
     * 
     * For any berita, the view_count after increment should always be greater than before.
     */
    public function test_view_count_never_decreases_on_increment(): void
    {
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            // Arrange: Create a berita with random initial view count
            $initialViewCount = fake()->numberBetween(0, 10000);
            $berita = $this->createPublishedBerita($initialViewCount);
            $countBefore = $berita->view_count;

            // Act: Increment view count
            $berita->increment('view_count');
            $berita->refresh();

            // Assert: View count should be greater than before
            $this->assertGreaterThan(
                $countBefore,
                $berita->view_count,
                "View count after increment ({$berita->view_count}) should be greater than before ({$countBefore})"
            );

            // Cleanup
            $berita->forceDelete();
        }
    }

    /**
     * Property: View count increment via AJAX endpoint increments by exactly 1
     * 
     * **Feature: admin-fixes, Property 10: View Counter Increment**
     * **Validates: Requirements 9.5**
     * 
     * For any published berita, calling the incrementView endpoint should increase view_count by exactly 1.
     */
    public function test_ajax_increment_view_endpoint_increments_by_exactly_one(): void
    {
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            // Arrange: Create a published berita with random initial view count
            $initialViewCount = fake()->numberBetween(0, 10000);
            $berita = $this->createPublishedBerita($initialViewCount);

            // Act: Call the increment view endpoint (route: berita/api/{id}/view)
            $response = $this->postJson("/berita/api/{$berita->id}/view");

            // Assert: Response should be successful
            $response->assertStatus(200);
            $response->assertJson(['success' => true]);

            // Refresh and verify
            $berita->refresh();

            // Assert: View count should be exactly initialViewCount + 1
            $this->assertEquals(
                $initialViewCount + 1,
                $berita->view_count,
                "View count should be {$initialViewCount} + 1 = " . ($initialViewCount + 1) . ", but got {$berita->view_count}"
            );

            // Cleanup
            $berita->forceDelete();
        }
    }
}
