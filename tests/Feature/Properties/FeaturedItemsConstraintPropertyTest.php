<?php

namespace Tests\Feature\Properties;

use App\Models\AdminUser;
use App\Models\Gallery;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Property Test: Featured Items Constraint
 * 
 * **Feature: admin-crud-management, Property 7: Featured Items Constraint**
 * **Validates: Requirements 2.5**
 * 
 * *For any* gallery, the count of items with is_featured=true 
 * SHALL NOT exceed the maximum limit (6).
 */
class FeaturedItemsConstraintPropertyTest extends TestCase
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
     * Property: Featured count never exceeds maximum limit
     * 
     * For any sequence of feature operations, the total count of featured
     * items should never exceed the maximum limit.
     */
    public function test_featured_count_never_exceeds_maximum(): void
    {
        $maxFeatured = Gallery::MAX_FEATURED_ITEMS;
        
        // Property test: run 30 iterations
        for ($i = 0; $i < 30; $i++) {
            // Create random number of gallery items (max + 5 to test overflow)
            $count = rand($maxFeatured + 1, $maxFeatured + 5);
            $galleries = Gallery::factory()->count($count)->create();
            
            // Try to feature all items
            foreach ($galleries as $gallery) {
                $this->actingAs($this->adminUser, 'admin')
                    ->post(route('admin.gallery.toggle-featured', $gallery->id));
            }
            
            // Verify featured count never exceeds maximum
            $featuredCount = Gallery::where('is_featured', true)->count();
            $this->assertLessThanOrEqual(
                $maxFeatured,
                $featuredCount,
                "Featured count ({$featuredCount}) should not exceed maximum ({$maxFeatured})"
            );
            
            // Clean up
            Gallery::query()->delete();
        }
    }

    /**
     * Property: Creating featured item respects limit
     * 
     * When creating a new gallery item with is_featured=true, the system
     * should reject it if the limit is already reached.
     */
    public function test_creating_featured_item_respects_limit(): void
    {
        $maxFeatured = Gallery::MAX_FEATURED_ITEMS;
        
        // Property test: run 20 iterations
        for ($i = 0; $i < 20; $i++) {
            // Create exactly max featured items
            Gallery::factory()->count($maxFeatured)->create(['is_featured' => true]);
            
            // Verify we're at the limit
            $this->assertEquals($maxFeatured, Gallery::featuredCount());
            
            // Try to create another featured item
            $response = $this->actingAs($this->adminUser, 'admin')
                ->post(route('admin.gallery.store'), [
                    'title' => 'Test Gallery ' . $i,
                    'image' => 'images/test.jpg',
                    'is_featured' => true,
                    'is_active' => true,
                ]);
            
            // Should redirect back with error
            $response->assertSessionHasErrors('is_featured');
            
            // Verify count is still at maximum
            $featuredCount = Gallery::where('is_featured', true)->count();
            $this->assertLessThanOrEqual(
                $maxFeatured,
                $featuredCount,
                "Featured count should not exceed maximum after rejected create"
            );
            
            // Clean up
            Gallery::query()->delete();
        }
    }

    /**
     * Property: Updating to featured respects limit
     * 
     * When updating an existing non-featured item to featured, the system
     * should reject it if the limit is already reached.
     */
    public function test_updating_to_featured_respects_limit(): void
    {
        $maxFeatured = Gallery::MAX_FEATURED_ITEMS;
        
        // Property test: run 20 iterations
        for ($i = 0; $i < 20; $i++) {
            // Create max featured items
            Gallery::factory()->count($maxFeatured)->create(['is_featured' => true]);
            
            // Create a non-featured item
            $nonFeatured = Gallery::factory()->create(['is_featured' => false]);
            
            // Try to update it to featured
            $response = $this->actingAs($this->adminUser, 'admin')
                ->put(route('admin.gallery.update', $nonFeatured->id), [
                    'title' => $nonFeatured->title,
                    'image' => $nonFeatured->image,
                    'is_featured' => true,
                    'is_active' => true,
                ]);
            
            // Should redirect back with error
            $response->assertSessionHasErrors('is_featured');
            
            // Verify the item is still not featured
            $nonFeatured->refresh();
            $this->assertFalse($nonFeatured->is_featured);
            
            // Verify count is still at maximum
            $featuredCount = Gallery::where('is_featured', true)->count();
            $this->assertEquals(
                $maxFeatured,
                $featuredCount,
                "Featured count should remain at maximum"
            );
            
            // Clean up
            Gallery::query()->delete();
        }
    }

    /**
     * Property: Bulk feature operation respects limit
     * 
     * When bulk featuring items, the system should reject the operation
     * if it would exceed the limit.
     */
    public function test_bulk_feature_respects_limit(): void
    {
        $maxFeatured = Gallery::MAX_FEATURED_ITEMS;
        
        // Property test: run 20 iterations
        for ($i = 0; $i < 20; $i++) {
            // Create some featured items (less than max)
            $existingFeatured = rand(1, $maxFeatured - 1);
            Gallery::factory()->count($existingFeatured)->create(['is_featured' => true]);
            
            // Create non-featured items that would exceed limit if all featured
            $nonFeaturedCount = $maxFeatured - $existingFeatured + rand(1, 3);
            $nonFeatured = Gallery::factory()->count($nonFeaturedCount)->create(['is_featured' => false]);
            
            // Try to bulk feature all non-featured items
            $response = $this->actingAs($this->adminUser, 'admin')
                ->post(route('admin.gallery.bulk-action'), [
                    'action' => 'feature',
                    'ids' => $nonFeatured->pluck('id')->toArray(),
                ]);
            
            // Should redirect back with error
            $response->assertSessionHasErrors('action');
            
            // Verify featured count hasn't changed
            $featuredCount = Gallery::where('is_featured', true)->count();
            $this->assertEquals(
                $existingFeatured,
                $featuredCount,
                "Featured count should remain unchanged after rejected bulk operation"
            );
            
            // Clean up
            Gallery::query()->delete();
        }
    }

    /**
     * Property: Unfeaturing allows new features
     * 
     * After unfeaturing an item, a new item should be able to be featured.
     */
    public function test_unfeaturing_allows_new_features(): void
    {
        $maxFeatured = Gallery::MAX_FEATURED_ITEMS;
        
        // Property test: run 20 iterations
        for ($i = 0; $i < 20; $i++) {
            // Create exactly max featured items
            $featured = Gallery::factory()->count($maxFeatured)->create(['is_featured' => true]);
            
            // Create a non-featured item
            $nonFeatured = Gallery::factory()->create(['is_featured' => false]);
            
            // Unfeature one item
            $toUnfeature = $featured->first();
            $this->actingAs($this->adminUser, 'admin')
                ->post(route('admin.gallery.toggle-featured', $toUnfeature->id));
            
            // Verify it's unfeatured
            $toUnfeature->refresh();
            $this->assertFalse($toUnfeature->is_featured);
            
            // Now feature the non-featured item
            $this->actingAs($this->adminUser, 'admin')
                ->post(route('admin.gallery.toggle-featured', $nonFeatured->id));
            
            // Verify it's now featured
            $nonFeatured->refresh();
            $this->assertTrue($nonFeatured->is_featured);
            
            // Verify total featured count is still at max
            $featuredCount = Gallery::where('is_featured', true)->count();
            $this->assertEquals(
                $maxFeatured,
                $featuredCount,
                "Featured count should be at maximum after swap"
            );
            
            // Clean up
            Gallery::query()->delete();
        }
    }

    /**
     * Property: canFeatureMore correctly reflects state
     * 
     * The canFeatureMore() method should return true only when
     * featured count is below the maximum.
     */
    public function test_can_feature_more_reflects_state(): void
    {
        $maxFeatured = Gallery::MAX_FEATURED_ITEMS;
        
        // Property test: run 30 iterations
        for ($i = 0; $i < 30; $i++) {
            // Create random number of featured items (0 to max)
            $featuredCount = rand(0, $maxFeatured);
            Gallery::factory()->count($featuredCount)->create(['is_featured' => true]);
            
            // Verify canFeatureMore reflects the state
            $canFeatureMore = Gallery::canFeatureMore();
            $expectedCanFeature = $featuredCount < $maxFeatured;
            
            $this->assertEquals(
                $expectedCanFeature,
                $canFeatureMore,
                "canFeatureMore() should be " . ($expectedCanFeature ? 'true' : 'false') . 
                " when featured count is {$featuredCount}"
            );
            
            // Clean up
            Gallery::query()->delete();
        }
    }
}
