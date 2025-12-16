<?php

namespace Tests\Feature\Properties;

use App\Models\AdminUser;
use App\Models\PpidDocument;
use App\Models\StandarPelayanan;
use App\Http\Controllers\Admin\PpidDocumentController;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

/**
 * Property Test: Single Category Assignment
 * 
 * **Feature: admin-crud-management, Property 9: Single Category Assignment**
 * **Validates: Requirements 3.3, 5.3**
 * 
 * *For any* categorizable entity, the entity SHALL have exactly one category 
 * value (not null, not multiple).
 */
class SingleCategoryAssignmentPropertyTest extends TestCase
{
    use RefreshDatabase;

    protected AdminUser $adminUser;

    protected function setUp(): void
    {
        parent::setUp();
        
        Storage::fake('public');
        
        $this->adminUser = AdminUser::factory()->create([
            'role' => 'admin',
            'is_active' => true,
        ]);
    }

    /**
     * Property: PPID Document always has exactly one non-null category
     * 
     * For any PPID document created with a valid category, the category field
     * should contain exactly one value from the predefined set.
     */
    public function test_ppid_document_has_exactly_one_category(): void
    {
        $validCategories = array_keys(PpidDocumentController::CATEGORIES);
        
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            // Pick a random valid category
            $selectedCategory = $validCategories[array_rand($validCategories)];
            
            $doc = PpidDocument::create([
                'title' => fake()->sentence(3),
                'file_path' => 'ppid-documents/test-' . uniqid() . '.pdf',
                'category' => $selectedCategory,
                'file_type' => 'pdf',
                'file_size' => rand(1000, 100000),
                'download_count' => 0,
                'is_active' => true,
            ]);
            
            // Refresh from database to ensure we're testing persisted value
            $doc->refresh();
            
            // Category should not be null
            $this->assertNotNull(
                $doc->category,
                "PPID Document ID {$doc->id} should have a non-null category"
            );
            
            // Category should be a string (single value, not array)
            $this->assertIsString(
                $doc->category,
                "PPID Document ID {$doc->id} category should be a string, not an array or object"
            );
            
            // Category should be one of the valid categories
            $this->assertContains(
                $doc->category,
                $validCategories,
                "PPID Document ID {$doc->id} category '{$doc->category}' should be one of: " . implode(', ', $validCategories)
            );
            
            // Category should match what was assigned
            $this->assertEquals(
                $selectedCategory,
                $doc->category,
                "PPID Document ID {$doc->id} should have category '{$selectedCategory}'"
            );
        }
    }

    /**
     * Property: Standar Pelayanan always has exactly one non-null category
     * 
     * For any Standar Pelayanan created with a valid category, the category field
     * should contain exactly one value from the predefined set.
     */
    public function test_standar_pelayanan_has_exactly_one_category(): void
    {
        $validCategories = StandarPelayanan::getCategories();
        
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            // Pick a random valid category
            $selectedCategory = $validCategories[array_rand($validCategories)];
            
            $standar = StandarPelayanan::create([
                'title' => fake()->sentence(3),
                'description' => fake()->paragraph(),
                'category' => $selectedCategory,
                'url' => 'standar-pelayanan/test-' . uniqid() . '.pdf',
                'file_type' => 'pdf',
                'file_size' => rand(1000, 100000),
                'download_count' => 0,
                'sort_order' => $i,
                'is_active' => true,
            ]);
            
            // Refresh from database to ensure we're testing persisted value
            $standar->refresh();
            
            // Category should not be null
            $this->assertNotNull(
                $standar->category,
                "Standar Pelayanan ID {$standar->id} should have a non-null category"
            );
            
            // Category should be a string (single value, not array)
            $this->assertIsString(
                $standar->category,
                "Standar Pelayanan ID {$standar->id} category should be a string, not an array or object"
            );
            
            // Category should be one of the valid categories
            $this->assertContains(
                $standar->category,
                $validCategories,
                "Standar Pelayanan ID {$standar->id} category '{$standar->category}' should be one of: " . implode(', ', $validCategories)
            );
            
            // Category should match what was assigned
            $this->assertEquals(
                $selectedCategory,
                $standar->category,
                "Standar Pelayanan ID {$standar->id} should have category '{$selectedCategory}'"
            );
        }
    }

    /**
     * Property: Category update replaces previous value (not appends)
     * 
     * For any entity, updating the category should replace the old value
     * with exactly one new value, not create multiple categories.
     */
    public function test_ppid_category_update_replaces_previous_value(): void
    {
        $validCategories = array_keys(PpidDocumentController::CATEGORIES);
        
        // Property test: run 50 iterations
        for ($i = 0; $i < 50; $i++) {
            // Create document with initial category
            $initialCategory = $validCategories[array_rand($validCategories)];
            
            $doc = PpidDocument::create([
                'title' => fake()->sentence(3),
                'file_path' => 'ppid-documents/test-' . uniqid() . '.pdf',
                'category' => $initialCategory,
                'file_type' => 'pdf',
                'file_size' => rand(1000, 100000),
                'download_count' => 0,
                'is_active' => true,
            ]);
            
            // Select a different category
            $newCategory = $validCategories[array_rand($validCategories)];
            while ($newCategory === $initialCategory && count($validCategories) > 1) {
                $newCategory = $validCategories[array_rand($validCategories)];
            }
            
            // Update category
            $doc->update(['category' => $newCategory]);
            $doc->refresh();
            
            // Should have exactly one category (the new one)
            $this->assertNotNull($doc->category);
            $this->assertIsString($doc->category);
            $this->assertEquals(
                $newCategory,
                $doc->category,
                "After update, document should have only the new category '{$newCategory}', not '{$doc->category}'"
            );
            
            // Verify old category is completely replaced
            $this->assertNotEquals(
                $initialCategory,
                $doc->category,
                "Old category '{$initialCategory}' should be replaced"
            );
        }
    }

    /**
     * Property: Standar Pelayanan category update replaces previous value
     */
    public function test_standar_pelayanan_category_update_replaces_previous_value(): void
    {
        $validCategories = StandarPelayanan::getCategories();
        
        // Property test: run 50 iterations
        for ($i = 0; $i < 50; $i++) {
            // Create with initial category
            $initialCategory = $validCategories[array_rand($validCategories)];
            
            $standar = StandarPelayanan::create([
                'title' => fake()->sentence(3),
                'description' => fake()->paragraph(),
                'category' => $initialCategory,
                'url' => 'standar-pelayanan/test-' . uniqid() . '.pdf',
                'file_type' => 'pdf',
                'file_size' => rand(1000, 100000),
                'download_count' => 0,
                'sort_order' => $i,
                'is_active' => true,
            ]);
            
            // Select a different category
            $newCategory = $validCategories[array_rand($validCategories)];
            while ($newCategory === $initialCategory && count($validCategories) > 1) {
                $newCategory = $validCategories[array_rand($validCategories)];
            }
            
            // Update category
            $standar->update(['category' => $newCategory]);
            $standar->refresh();
            
            // Should have exactly one category (the new one)
            $this->assertNotNull($standar->category);
            $this->assertIsString($standar->category);
            $this->assertEquals(
                $newCategory,
                $standar->category,
                "After update, standar pelayanan should have only the new category '{$newCategory}'"
            );
        }
    }

    /**
     * Property: Database enforces single category per record
     * 
     * Verify that the database schema stores category as a single value,
     * not as a JSON array or multiple columns.
     */
    public function test_database_stores_single_category_value(): void
    {
        $ppidCategories = array_keys(PpidDocumentController::CATEGORIES);
        $standarCategories = StandarPelayanan::getCategories();
        
        // Property test: run 30 iterations
        for ($i = 0; $i < 30; $i++) {
            // Create PPID document
            $ppidCategory = $ppidCategories[array_rand($ppidCategories)];
            $doc = PpidDocument::create([
                'title' => fake()->sentence(3),
                'file_path' => 'ppid-documents/test-' . uniqid() . '.pdf',
                'category' => $ppidCategory,
                'file_type' => 'pdf',
                'file_size' => rand(1000, 100000),
                'download_count' => 0,
                'is_active' => true,
            ]);
            
            // Query raw from database
            $rawDoc = \DB::table('ppid_documents')->where('id', $doc->id)->first();
            
            // Category should be stored as plain string, not JSON
            $this->assertIsString($rawDoc->category);
            $this->assertEquals($ppidCategory, $rawDoc->category);
            
            // Verify it's not a JSON array
            $decoded = json_decode($rawDoc->category, true);
            $this->assertNull(
                $decoded,
                "Category should be stored as plain string, not JSON"
            );
            
            // Create Standar Pelayanan
            $standarCategory = $standarCategories[array_rand($standarCategories)];
            $standar = StandarPelayanan::create([
                'title' => fake()->sentence(3),
                'description' => fake()->paragraph(),
                'category' => $standarCategory,
                'url' => 'standar-pelayanan/test-' . uniqid() . '.pdf',
                'file_type' => 'pdf',
                'file_size' => rand(1000, 100000),
                'download_count' => 0,
                'sort_order' => $i,
                'is_active' => true,
            ]);
            
            // Query raw from database
            $rawStandar = \DB::table('standar_pelayanans')->where('id', $standar->id)->first();
            
            // Category should be stored as plain string
            $this->assertIsString($rawStandar->category);
            $this->assertEquals($standarCategory, $rawStandar->category);
        }
    }

    /**
     * Property: Each entity belongs to exactly one category in queries
     * 
     * For any entity, querying by its category should return it,
     * and querying by other categories should not return it.
     */
    public function test_entity_belongs_to_exactly_one_category_in_queries(): void
    {
        $ppidCategories = array_keys(PpidDocumentController::CATEGORIES);
        
        // Property test: run 50 iterations
        for ($i = 0; $i < 50; $i++) {
            // Create document with specific category
            $assignedCategory = $ppidCategories[array_rand($ppidCategories)];
            
            $doc = PpidDocument::create([
                'title' => fake()->sentence(3),
                'file_path' => 'ppid-documents/test-' . uniqid() . '.pdf',
                'category' => $assignedCategory,
                'file_type' => 'pdf',
                'file_size' => rand(1000, 100000),
                'download_count' => 0,
                'is_active' => true,
            ]);
            
            // Count how many categories this document appears in
            $categoryAppearances = 0;
            
            foreach ($ppidCategories as $category) {
                $found = PpidDocument::where('id', $doc->id)
                    ->where('category', $category)
                    ->exists();
                    
                if ($found) {
                    $categoryAppearances++;
                    
                    // Should only be found in assigned category
                    $this->assertEquals(
                        $assignedCategory,
                        $category,
                        "Document should only be found in its assigned category"
                    );
                }
            }
            
            // Document should appear in exactly one category
            $this->assertEquals(
                1,
                $categoryAppearances,
                "Document ID {$doc->id} should appear in exactly 1 category, found in {$categoryAppearances}"
            );
            
            // Clean up for next iteration
            $doc->delete();
        }
    }
}
