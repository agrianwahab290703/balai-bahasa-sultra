<?php

namespace Tests\Feature\Properties;

use App\Models\AdminUser;
use App\Models\Menu;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Property Test: Menu Depth Constraint
 * 
 * **Feature: admin-crud-management, Property 11: Menu Depth Constraint**
 * **Validates: Requirements 7.4**
 * 
 * *For any* menu item with a parent, the total nesting depth SHALL NOT exceed 
 * 2 levels (parent -> child, no grandchildren).
 */
class MenuDepthConstraintPropertyTest extends TestCase
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
     * Property: Creating a child menu under a root menu succeeds (depth 2)
     * 
     * For any root menu, creating a child menu should succeed because
     * it results in depth 2 which is within the allowed limit.
     */
    public function test_creating_child_under_root_menu_succeeds(): void
    {
        // Property test: run 50 iterations
        for ($i = 0; $i < 50; $i++) {
            // Create a root menu (depth 1)
            $rootMenu = Menu::factory()->root()->header()->create();
            
            // Attempt to create a child menu (depth 2) - should succeed
            $response = $this->actingAs($this->adminUser, 'admin')
                ->post(route('admin.menu.store'), [
                    'label' => fake()->words(rand(1, 3), true),
                    'url' => '/' . fake()->slug(rand(1, 3)),
                    'parent_id' => $rootMenu->id,
                    'location' => $rootMenu->location,
                    'is_visible' => true,
                ]);
            
            $response->assertRedirect();
            $response->assertSessionHasNoErrors();
            
            // Verify child was created
            $childMenu = Menu::where('parent_id', $rootMenu->id)->first();
            $this->assertNotNull($childMenu, "Child menu should be created under root menu");
            $this->assertEquals($rootMenu->id, $childMenu->parent_id);
            
            // Clean up for next iteration
            Menu::query()->delete();
        }
    }

    /**
     * Property: Creating a grandchild menu (depth 3) is rejected
     * 
     * For any menu that already has a parent (depth 2), attempting to create
     * a child under it should fail because it would result in depth 3.
     */
    public function test_creating_grandchild_menu_is_rejected(): void
    {
        // Property test: run 50 iterations
        for ($i = 0; $i < 50; $i++) {
            // Create a root menu (depth 1)
            $rootMenu = Menu::factory()->root()->header()->create();
            
            // Create a child menu (depth 2)
            $childMenu = Menu::factory()->childOf($rootMenu)->create();
            
            // Attempt to create a grandchild menu (depth 3) - should fail
            $response = $this->actingAs($this->adminUser, 'admin')
                ->post(route('admin.menu.store'), [
                    'label' => fake()->words(rand(1, 3), true),
                    'url' => '/' . fake()->slug(rand(1, 3)),
                    'parent_id' => $childMenu->id,
                    'location' => $childMenu->location,
                    'is_visible' => true,
                ]);
            
            // Should have validation error for parent_id
            $response->assertSessionHasErrors('parent_id');
            
            // Verify no grandchild was created
            $grandchildCount = Menu::where('parent_id', $childMenu->id)->count();
            $this->assertEquals(0, $grandchildCount, "No grandchild menu should be created");
            
            // Clean up for next iteration
            Menu::query()->delete();
        }
    }

    /**
     * Property: Updating a menu to become a grandchild is rejected
     * 
     * For any existing menu, attempting to update its parent to a menu
     * that already has a parent should fail.
     */
    public function test_updating_menu_to_become_grandchild_is_rejected(): void
    {
        // Property test: run 50 iterations
        for ($i = 0; $i < 50; $i++) {
            // Create menu hierarchy: root -> child
            $rootMenu = Menu::factory()->root()->header()->create();
            $childMenu = Menu::factory()->childOf($rootMenu)->create();
            
            // Create another root menu that we'll try to move under childMenu
            $anotherRootMenu = Menu::factory()->root()->header()->create();
            
            // Attempt to update anotherRootMenu to have childMenu as parent - should fail
            $response = $this->actingAs($this->adminUser, 'admin')
                ->put(route('admin.menu.update', $anotherRootMenu), [
                    'label' => $anotherRootMenu->label,
                    'url' => $anotherRootMenu->url,
                    'parent_id' => $childMenu->id,
                    'location' => $childMenu->location,
                    'is_visible' => true,
                ]);
            
            // Should have validation error for parent_id
            $response->assertSessionHasErrors('parent_id');
            
            // Verify the menu was not updated
            $anotherRootMenu->refresh();
            $this->assertNull($anotherRootMenu->parent_id, "Menu should remain a root menu");
            
            // Clean up for next iteration
            Menu::query()->delete();
        }
    }

    /**
     * Property: Reordering a menu to become a grandchild is rejected
     * 
     * For any reorder operation that would move a menu under a child menu,
     * the operation should fail.
     */
    public function test_reordering_menu_to_become_grandchild_is_rejected(): void
    {
        // Property test: run 50 iterations
        for ($i = 0; $i < 50; $i++) {
            // Create menu hierarchy: root -> child
            $rootMenu = Menu::factory()->root()->header()->create();
            $childMenu = Menu::factory()->childOf($rootMenu)->create();
            
            // Create another root menu
            $anotherRootMenu = Menu::factory()->root()->header()->create();
            
            // Attempt to reorder anotherRootMenu under childMenu - should fail
            $response = $this->actingAs($this->adminUser, 'admin')
                ->post(route('admin.menu.reorder'), [
                    'items' => [
                        [
                            'id' => $anotherRootMenu->id,
                            'order' => 0,
                            'parent_id' => $childMenu->id,
                        ],
                    ],
                ]);
            
            // Should have validation error
            $response->assertSessionHasErrors();
            
            // Verify the menu was not moved
            $anotherRootMenu->refresh();
            $this->assertNull($anotherRootMenu->parent_id, "Menu should remain a root menu after failed reorder");
            
            // Clean up for next iteration
            Menu::query()->delete();
        }
    }

    /**
     * Property: All menus in database have depth <= 2
     * 
     * After any sequence of operations, no menu in the database should
     * have a depth greater than 2.
     */
    public function test_all_menus_have_valid_depth(): void
    {
        // Property test: run 30 iterations with random operations
        for ($i = 0; $i < 30; $i++) {
            // Create random menu structure
            $rootCount = rand(2, 5);
            $rootMenus = [];
            
            for ($j = 0; $j < $rootCount; $j++) {
                $rootMenus[] = Menu::factory()->root()->header()->create();
            }
            
            // Add random children to some root menus
            foreach ($rootMenus as $root) {
                $childCount = rand(0, 3);
                for ($k = 0; $k < $childCount; $k++) {
                    Menu::factory()->childOf($root)->create();
                }
            }
            
            // Verify all menus have valid depth
            $allMenus = Menu::all();
            foreach ($allMenus as $menu) {
                $depth = $this->calculateMenuDepth($menu);
                $this->assertLessThanOrEqual(
                    2,
                    $depth,
                    "Menu '{$menu->label}' (ID: {$menu->id}) has depth {$depth}, which exceeds maximum of 2"
                );
            }
            
            // Clean up for next iteration
            Menu::query()->delete();
        }
    }

    /**
     * Property: Menu with children cannot become a child
     * 
     * For any menu that has children, attempting to set a parent for it
     * should fail (to prevent depth > 2).
     */
    public function test_menu_with_children_cannot_become_child(): void
    {
        // Property test: run 50 iterations
        for ($i = 0; $i < 50; $i++) {
            // Create a root menu with children
            $rootWithChildren = Menu::factory()->root()->header()->create();
            $childCount = rand(1, 3);
            for ($j = 0; $j < $childCount; $j++) {
                Menu::factory()->childOf($rootWithChildren)->create();
            }
            
            // Create another root menu
            $anotherRoot = Menu::factory()->root()->header()->create();
            
            // Attempt to make rootWithChildren a child of anotherRoot - should fail
            $response = $this->actingAs($this->adminUser, 'admin')
                ->put(route('admin.menu.update', $rootWithChildren), [
                    'label' => $rootWithChildren->label,
                    'url' => $rootWithChildren->url,
                    'parent_id' => $anotherRoot->id,
                    'location' => $rootWithChildren->location,
                    'is_visible' => true,
                ]);
            
            // Should have validation error
            $response->assertSessionHasErrors('parent_id');
            
            // Verify the menu was not updated
            $rootWithChildren->refresh();
            $this->assertNull($rootWithChildren->parent_id, "Menu with children should remain a root menu");
            
            // Clean up for next iteration
            Menu::query()->delete();
        }
    }

    /**
     * Calculate the depth of a menu item.
     * Root menus have depth 1, their children have depth 2, etc.
     */
    protected function calculateMenuDepth(Menu $menu): int
    {
        $depth = 1;
        $current = $menu;
        
        while ($current->parent_id !== null) {
            $depth++;
            $current = Menu::find($current->parent_id);
            
            if ($current === null) {
                break;
            }
        }
        
        return $depth;
    }
}
