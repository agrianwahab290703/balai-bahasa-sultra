<?php

namespace Tests\Feature\Properties;

use App\Models\AdminUser;
use App\Models\Gallery;
use App\Models\Ssd;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Property Test: Sort Order Persistence
 * 
 * **Feature: admin-fixes, Property 11: Sort Order Persistence**
 * **Validates: Requirements 10.5, 12.4**
 * 
 * *For any* reorder operation on orderable items (Gallery, SSD), the new sort_order values 
 * SHALL be persisted correctly, and subsequent queries SHALL return items 
 * in the updated order.
 */
class SortOrderPersistencePropertyTest extends TestCase
{
    use RefreshDatabase;

    protected AdminUser $adminUser;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->adminUser = AdminUser::factory()->create([
            'role' => 'admin',
            'is_active' => true,
        ]);
    }

    /**
     * Property: Reorder operation persists new sort_order values correctly
     * 
     * For any set of gallery items with a reorder operation, the new sort_order
     * values should be persisted to the database exactly as specified.
     */
    public function test_reorder_persists_sort_order_values(): void
    {
        // Property test: run 50 iterations
        for ($i = 0; $i < 50; $i++) {
            // Create random number of gallery items (3-10)
            $count = rand(3, 10);
            $galleries = Gallery::factory()->count($count)->create();
            
            // Generate a random permutation of sort orders
            $ids = $galleries->pluck('id')->toArray();
            shuffle($ids);
            
            // Create reorder data with new sort_order values
            $reorderData = [];
            foreach ($ids as $index => $id) {
                $reorderData[] = [
                    'id' => $id,
                    'sort_order' => $index,
                ];
            }
            
            // Perform reorder operation
            $response = $this->actingAs($this->adminUser, 'admin')
                ->post(route('admin.gallery.reorder'), ['items' => $reorderData]);
            
            $response->assertRedirect();
            
            // Verify each item has the correct sort_order in database
            foreach ($reorderData as $item) {
                $gallery = Gallery::find($item['id']);
                $this->assertEquals(
                    $item['sort_order'],
                    $gallery->sort_order,
                    "Gallery ID {$item['id']} should have sort_order {$item['sort_order']}"
                );
            }
            
            // Clean up for next iteration
            Gallery::query()->delete();
        }
    }

    /**
     * Property: Subsequent retrieval returns items in updated order
     * 
     * After a reorder operation, retrieving items ordered by sort_order
     * should return them in the new order.
     */
    public function test_retrieval_returns_items_in_updated_order(): void
    {
        // Property test: run 50 iterations
        for ($i = 0; $i < 50; $i++) {
            // Create gallery items
            $count = rand(3, 8);
            $galleries = Gallery::factory()->count($count)->create();
            
            // Generate random new order
            $ids = $galleries->pluck('id')->toArray();
            shuffle($ids);
            
            // Create reorder data
            $reorderData = [];
            foreach ($ids as $index => $id) {
                $reorderData[] = [
                    'id' => $id,
                    'sort_order' => $index,
                ];
            }
            
            // Perform reorder
            $this->actingAs($this->adminUser, 'admin')
                ->post(route('admin.gallery.reorder'), ['items' => $reorderData]);
            
            // Retrieve items ordered by sort_order
            $orderedGalleries = Gallery::orderBy('sort_order', 'asc')->get();
            
            // Verify the order matches the reorder request
            foreach ($orderedGalleries as $index => $gallery) {
                $this->assertEquals(
                    $ids[$index],
                    $gallery->id,
                    "Gallery at position {$index} should be ID {$ids[$index]}"
                );
            }
            
            // Clean up
            Gallery::query()->delete();
        }
    }

    /**
     * Property: Sort order is preserved in database after reorder
     * 
     * After reordering, querying the database should return items in the new order.
     * This tests the persistence layer without requiring Vite build artifacts.
     */
    public function test_sort_order_preserved_in_database(): void
    {
        // Property test: run 30 iterations
        for ($i = 0; $i < 30; $i++) {
            // Create gallery items
            $count = rand(3, 6);
            $galleries = Gallery::factory()->count($count)->create();
            
            // Generate random new order
            $ids = $galleries->pluck('id')->toArray();
            shuffle($ids);
            
            // Create reorder data
            $reorderData = [];
            foreach ($ids as $index => $id) {
                $reorderData[] = [
                    'id' => $id,
                    'sort_order' => $index,
                ];
            }
            
            // Perform reorder
            $this->actingAs($this->adminUser, 'admin')
                ->post(route('admin.gallery.reorder'), ['items' => $reorderData]);
            
            // Query database directly to verify persistence
            $orderedFromDb = Gallery::orderBy('sort_order', 'asc')->pluck('id')->toArray();
            
            // Verify order matches the reorder request
            $this->assertEquals(
                $ids,
                $orderedFromDb,
                "Database order should match reorder request"
            );
            
            // Clean up
            Gallery::query()->delete();
        }
    }

    /**
     * Property: Partial reorder maintains other items' positions
     * 
     * When reordering a subset of items, items not included in the reorder
     * should maintain their original sort_order values.
     */
    public function test_partial_reorder_maintains_other_positions(): void
    {
        // Property test: run 30 iterations
        for ($i = 0; $i < 30; $i++) {
            // Create gallery items with explicit sort_order
            $galleries = [];
            for ($j = 0; $j < 6; $j++) {
                $galleries[] = Gallery::factory()->create(['sort_order' => $j]);
            }
            
            // Select a random subset to reorder (2-4 items)
            $subsetSize = rand(2, 4);
            $allIds = array_map(fn($g) => $g->id, $galleries);
            shuffle($allIds);
            $subsetIds = array_slice($allIds, 0, $subsetSize);
            $excludedIds = array_slice($allIds, $subsetSize);
            
            // Store original sort_order for excluded items
            $originalOrders = [];
            foreach ($excludedIds as $id) {
                $originalOrders[$id] = Gallery::find($id)->sort_order;
            }
            
            // Create reorder data for subset only
            $reorderData = [];
            foreach ($subsetIds as $index => $id) {
                $reorderData[] = [
                    'id' => $id,
                    'sort_order' => $index * 10, // Use different values
                ];
            }
            
            // Perform reorder
            $this->actingAs($this->adminUser, 'admin')
                ->post(route('admin.gallery.reorder'), ['items' => $reorderData]);
            
            // Verify excluded items maintain their original sort_order
            foreach ($excludedIds as $id) {
                $gallery = Gallery::find($id);
                $this->assertEquals(
                    $originalOrders[$id],
                    $gallery->sort_order,
                    "Gallery ID {$id} should maintain original sort_order {$originalOrders[$id]}"
                );
            }
            
            // Clean up
            Gallery::query()->delete();
        }
    }

    /**
     * Property: SSD reorder operation persists new sort_order values correctly
     * 
     * **Feature: admin-fixes, Property 11: Sort Order Persistence**
     * **Validates: Requirements 12.4**
     * 
     * For any set of SSD items with a reorder operation, the new sort_order
     * values should be persisted to the database exactly as specified.
     */
    public function test_ssd_reorder_persists_sort_order_values(): void
    {
        // Property test: run 50 iterations
        for ($i = 0; $i < 50; $i++) {
            // Create random number of SSD items (3-10)
            $count = rand(3, 10);
            $ssds = [];
            for ($j = 0; $j < $count; $j++) {
                $ssds[] = Ssd::create([
                    'question' => 'Question ' . $j . ' iteration ' . $i,
                    'answer' => 'Answer ' . $j,
                    'category' => 'umum',
                    'is_active' => true,
                    'sort_order' => $j,
                ]);
            }
            
            // Generate a random permutation of sort orders
            $ids = array_map(fn($s) => $s->id, $ssds);
            shuffle($ids);
            
            // Create reorder data with new sort_order values
            $reorderData = [];
            foreach ($ids as $index => $id) {
                $reorderData[] = [
                    'id' => $id,
                    'sort_order' => $index,
                ];
            }
            
            // Perform reorder operation
            $response = $this->actingAs($this->adminUser, 'admin')
                ->post(route('admin.ssd.reorder'), ['items' => $reorderData]);
            
            $response->assertRedirect();
            
            // Verify each item has the correct sort_order in database
            foreach ($reorderData as $item) {
                $ssd = Ssd::find($item['id']);
                $this->assertEquals(
                    $item['sort_order'],
                    $ssd->sort_order,
                    "SSD ID {$item['id']} should have sort_order {$item['sort_order']}"
                );
            }
            
            // Clean up for next iteration
            Ssd::query()->delete();
        }
    }

    /**
     * Property: SSD subsequent retrieval returns items in updated order
     * 
     * **Feature: admin-fixes, Property 11: Sort Order Persistence**
     * **Validates: Requirements 12.4**
     * 
     * After a reorder operation on SSD items, retrieving items ordered by sort_order
     * should return them in the new order.
     */
    public function test_ssd_retrieval_returns_items_in_updated_order(): void
    {
        // Property test: run 50 iterations
        for ($i = 0; $i < 50; $i++) {
            // Create SSD items
            $count = rand(3, 8);
            $ssds = [];
            for ($j = 0; $j < $count; $j++) {
                $ssds[] = Ssd::create([
                    'question' => 'Question ' . $j . ' iteration ' . $i,
                    'answer' => 'Answer ' . $j,
                    'category' => 'umum',
                    'is_active' => true,
                    'sort_order' => $j,
                ]);
            }
            
            // Generate random new order
            $ids = array_map(fn($s) => $s->id, $ssds);
            shuffle($ids);
            
            // Create reorder data
            $reorderData = [];
            foreach ($ids as $index => $id) {
                $reorderData[] = [
                    'id' => $id,
                    'sort_order' => $index,
                ];
            }
            
            // Perform reorder
            $this->actingAs($this->adminUser, 'admin')
                ->post(route('admin.ssd.reorder'), ['items' => $reorderData]);
            
            // Retrieve items ordered by sort_order
            $orderedSsds = Ssd::orderBy('sort_order', 'asc')->get();
            
            // Verify the order matches the reorder request
            foreach ($orderedSsds as $index => $ssd) {
                $this->assertEquals(
                    $ids[$index],
                    $ssd->id,
                    "SSD at position {$index} should be ID {$ids[$index]}"
                );
            }
            
            // Clean up
            Ssd::query()->delete();
        }
    }

    /**
     * Property: SSD sort order is preserved in database after reorder
     * 
     * **Feature: admin-fixes, Property 11: Sort Order Persistence**
     * **Validates: Requirements 12.4**
     * 
     * After reordering SSD items, querying the database should return items in the new order.
     */
    public function test_ssd_sort_order_preserved_in_database(): void
    {
        // Property test: run 30 iterations
        for ($i = 0; $i < 30; $i++) {
            // Create SSD items
            $count = rand(3, 6);
            $ssds = [];
            for ($j = 0; $j < $count; $j++) {
                $ssds[] = Ssd::create([
                    'question' => 'Question ' . $j . ' iteration ' . $i,
                    'answer' => 'Answer ' . $j,
                    'category' => 'umum',
                    'is_active' => true,
                    'sort_order' => $j,
                ]);
            }
            
            // Generate random new order
            $ids = array_map(fn($s) => $s->id, $ssds);
            shuffle($ids);
            
            // Create reorder data
            $reorderData = [];
            foreach ($ids as $index => $id) {
                $reorderData[] = [
                    'id' => $id,
                    'sort_order' => $index,
                ];
            }
            
            // Perform reorder
            $this->actingAs($this->adminUser, 'admin')
                ->post(route('admin.ssd.reorder'), ['items' => $reorderData]);
            
            // Query database directly to verify persistence
            $orderedFromDb = Ssd::orderBy('sort_order', 'asc')->pluck('id')->toArray();
            
            // Verify order matches the reorder request
            $this->assertEquals(
                $ids,
                $orderedFromDb,
                "Database order should match reorder request"
            );
            
            // Clean up
            Ssd::query()->delete();
        }
    }

    /**
     * Property: SSD partial reorder maintains other items' positions
     * 
     * **Feature: admin-fixes, Property 11: Sort Order Persistence**
     * **Validates: Requirements 12.4**
     * 
     * When reordering a subset of SSD items, items not included in the reorder
     * should maintain their original sort_order values.
     */
    public function test_ssd_partial_reorder_maintains_other_positions(): void
    {
        // Property test: run 30 iterations
        for ($i = 0; $i < 30; $i++) {
            // Create SSD items with explicit sort_order
            $ssds = [];
            for ($j = 0; $j < 6; $j++) {
                $ssds[] = Ssd::create([
                    'question' => 'Question ' . $j . ' iteration ' . $i,
                    'answer' => 'Answer ' . $j,
                    'category' => 'umum',
                    'is_active' => true,
                    'sort_order' => $j,
                ]);
            }
            
            // Select a random subset to reorder (2-4 items)
            $subsetSize = rand(2, 4);
            $allIds = array_map(fn($s) => $s->id, $ssds);
            shuffle($allIds);
            $subsetIds = array_slice($allIds, 0, $subsetSize);
            $excludedIds = array_slice($allIds, $subsetSize);
            
            // Store original sort_order for excluded items
            $originalOrders = [];
            foreach ($excludedIds as $id) {
                $originalOrders[$id] = Ssd::find($id)->sort_order;
            }
            
            // Create reorder data for subset only
            $reorderData = [];
            foreach ($subsetIds as $index => $id) {
                $reorderData[] = [
                    'id' => $id,
                    'sort_order' => $index * 10, // Use different values
                ];
            }
            
            // Perform reorder
            $this->actingAs($this->adminUser, 'admin')
                ->post(route('admin.ssd.reorder'), ['items' => $reorderData]);
            
            // Verify excluded items maintain their original sort_order
            foreach ($excludedIds as $id) {
                $ssd = Ssd::find($id);
                $this->assertEquals(
                    $originalOrders[$id],
                    $ssd->sort_order,
                    "SSD ID {$id} should maintain original sort_order {$originalOrders[$id]}"
                );
            }
            
            // Clean up
            Ssd::query()->delete();
        }
    }
}
