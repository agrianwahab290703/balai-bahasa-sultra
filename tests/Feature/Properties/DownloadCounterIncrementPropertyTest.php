<?php

namespace Tests\Feature\Properties;

use App\Models\PpidDocument;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

/**
 * Property Test: Download Counter Increment
 * 
 * **Feature: admin-fixes, Property 9: Download Counter Increment**
 * **Validates: Requirements 4.5, 11.4**
 * 
 * *For any* document download operation, the download_count field SHALL be incremented by exactly 1.
 */
class DownloadCounterIncrementPropertyTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');
    }

    /**
     * Helper to create an active PpidDocument with all required fields
     */
    private function createActivePpidDocument(int $initialDownloadCount = 0): PpidDocument
    {
        // Create a fake file for the document
        $filePath = 'ppid/documents/' . fake()->uuid() . '.pdf';
        Storage::disk('public')->put($filePath, 'Test PDF content');

        return PpidDocument::create([
            'title' => fake()->sentence(),
            'file_path' => $filePath,
            'category' => fake()->randomElement(['setiap_saat', 'serta_merta', 'berkala', 'dikecualikan']),
            'file_type' => 'pdf',
            'file_size' => fake()->numberBetween(1024, 10485760),
            'download_count' => $initialDownloadCount,
            'is_active' => true,
        ]);
    }

    /**
     * Property: Download count increments by exactly 1 on each download
     * 
     * **Feature: admin-fixes, Property 9: Download Counter Increment**
     * **Validates: Requirements 4.5, 11.4**
     * 
     * For any PPID document, calling increment('download_count') should increase the download_count by exactly 1.
     */
    public function test_download_count_increments_by_exactly_one(): void
    {
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            // Arrange: Create a document with random initial download count
            $initialDownloadCount = fake()->numberBetween(0, 10000);
            $document = $this->createActivePpidDocument($initialDownloadCount);

            // Act: Increment download count (simulating a download)
            $document->increment('download_count');
            $document->refresh();

            // Assert: Download count should be exactly initialDownloadCount + 1
            $this->assertEquals(
                $initialDownloadCount + 1,
                $document->download_count,
                "Download count should be {$initialDownloadCount} + 1 = " . ($initialDownloadCount + 1) . ", but got {$document->download_count}"
            );

            // Cleanup
            $document->delete();
        }
    }

    /**
     * Property: Multiple download increments are cumulative
     * 
     * **Feature: admin-fixes, Property 9: Download Counter Increment**
     * **Validates: Requirements 4.5, 11.4**
     * 
     * For any PPID document, multiple increment operations should each add exactly 1 to the download_count.
     */
    public function test_multiple_download_increments_are_cumulative(): void
    {
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            // Arrange: Create a document with random initial download count
            $initialDownloadCount = fake()->numberBetween(0, 1000);
            $numberOfDownloads = fake()->numberBetween(1, 10);
            $document = $this->createActivePpidDocument($initialDownloadCount);

            // Act: Increment download count multiple times
            for ($j = 0; $j < $numberOfDownloads; $j++) {
                $document->increment('download_count');
            }
            $document->refresh();

            // Assert: Download count should be exactly initialDownloadCount + numberOfDownloads
            $expectedCount = $initialDownloadCount + $numberOfDownloads;
            $this->assertEquals(
                $expectedCount,
                $document->download_count,
                "After {$numberOfDownloads} downloads, count should be {$expectedCount}, but got {$document->download_count}"
            );

            // Cleanup
            $document->delete();
        }
    }

    /**
     * Property: Download count never decreases on increment
     * 
     * **Feature: admin-fixes, Property 9: Download Counter Increment**
     * **Validates: Requirements 4.5, 11.4**
     * 
     * For any PPID document, the download_count after increment should always be greater than before.
     */
    public function test_download_count_never_decreases_on_increment(): void
    {
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            // Arrange: Create a document with random initial download count
            $initialDownloadCount = fake()->numberBetween(0, 10000);
            $document = $this->createActivePpidDocument($initialDownloadCount);
            $countBefore = $document->download_count;

            // Act: Increment download count
            $document->increment('download_count');
            $document->refresh();

            // Assert: Download count should be greater than before
            $this->assertGreaterThan(
                $countBefore,
                $document->download_count,
                "Download count after increment ({$document->download_count}) should be greater than before ({$countBefore})"
            );

            // Cleanup
            $document->delete();
        }
    }

    /**
     * Property: Download endpoint increments download_count by exactly 1
     * 
     * **Feature: admin-fixes, Property 9: Download Counter Increment**
     * **Validates: Requirements 4.5, 11.4**
     * 
     * For any active PPID document, calling the download endpoint should increase download_count by exactly 1.
     */
    public function test_download_endpoint_increments_by_exactly_one(): void
    {
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            // Arrange: Create an active document with random initial download count
            $initialDownloadCount = fake()->numberBetween(0, 10000);
            $document = $this->createActivePpidDocument($initialDownloadCount);

            // Act: Call the download endpoint
            $response = $this->get("/ppid/download/{$document->id}");

            // Assert: Response should be successful (200 for download)
            $response->assertStatus(200);

            // Refresh and verify
            $document->refresh();

            // Assert: Download count should be exactly initialDownloadCount + 1
            $this->assertEquals(
                $initialDownloadCount + 1,
                $document->download_count,
                "Download count should be {$initialDownloadCount} + 1 = " . ($initialDownloadCount + 1) . ", but got {$document->download_count}"
            );

            // Cleanup
            $document->delete();
        }
    }

    /**
     * Property: Inactive documents cannot be downloaded (no increment)
     * 
     * **Feature: admin-fixes, Property 9: Download Counter Increment**
     * **Validates: Requirements 4.5, 11.4**
     * 
     * For any inactive PPID document, the download endpoint should return 404 and not increment download_count.
     */
    public function test_inactive_documents_cannot_be_downloaded(): void
    {
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            // Arrange: Create an inactive document
            $initialDownloadCount = fake()->numberBetween(0, 10000);
            
            // Create a fake file for the document
            $filePath = 'ppid/documents/' . fake()->uuid() . '.pdf';
            Storage::disk('public')->put($filePath, 'Test PDF content');

            $document = PpidDocument::create([
                'title' => fake()->sentence(),
                'file_path' => $filePath,
                'category' => fake()->randomElement(['setiap_saat', 'serta_merta', 'berkala', 'dikecualikan']),
                'file_type' => 'pdf',
                'file_size' => fake()->numberBetween(1024, 10485760),
                'download_count' => $initialDownloadCount,
                'is_active' => false, // Inactive document
            ]);

            // Act: Try to download the inactive document
            $response = $this->get("/ppid/download/{$document->id}");

            // Assert: Response should be 404 (not found)
            $response->assertStatus(404);

            // Refresh and verify download count unchanged
            $document->refresh();

            // Assert: Download count should remain unchanged
            $this->assertEquals(
                $initialDownloadCount,
                $document->download_count,
                "Download count should remain {$initialDownloadCount} for inactive document, but got {$document->download_count}"
            );

            // Cleanup
            $document->delete();
        }
    }
}
