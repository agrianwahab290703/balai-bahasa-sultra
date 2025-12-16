<?php

namespace Tests\Feature\Properties;

use App\Models\AdminUser;
use App\Models\PpidDocument;
use App\Models\Ssd;
use App\Models\ProfileContent;
use App\Models\Menu;
use Faker\Factory as FakerFactory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Property Test: Visibility Toggle Effect
 * 
 * **Feature: admin-crud-management, Property 10: Visibility Toggle Effect**
 * **Validates: Requirements 3.5, 4.5, 6.5, 7.5**
 * 
 * *For any* entity with is_active/is_visible toggle, when toggled to false, 
 * the entity SHALL NOT appear in public-facing queries.
 */
class VisibilityToggleEffectPropertyTest extends TestCase
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
     * Get a fresh faker instance to avoid unique value exhaustion
     */
    protected function getFreshFaker(): \Faker\Generator
    {
        return FakerFactory::create();
    }

    /**
     * Property: Inactive PpidDocument does not appear in public queries
     * 
     * For any PpidDocument with is_active=false, querying with the active() scope
     * should NOT return that document.
     * 
     * @see Requirements 3.5
     */
    public function test_inactive_ppid_document_not_in_public_queries(): void
    {
        // Property test: run 50 iterations
        for ($i = 0; $i < 50; $i++) {
            $faker = $this->getFreshFaker();
            
            // Create a random number of documents (2-8)
            $count = rand(2, 8);
            $categories = ['setiap_saat', 'serta_merta', 'berkala', 'dikecualikan'];
            
            $documents = [];
            for ($j = 0; $j < $count; $j++) {
                $documents[] = PpidDocument::create([
                    'title' => 'Document ' . $faker->uuid(),
                    'file_path' => 'ppid-documents/test-' . $faker->uuid() . '.pdf',
                    'category' => $categories[array_rand($categories)],
                    'file_type' => 'pdf',
                    'file_size' => rand(1000, 100000),
                    'download_count' => rand(0, 100),
                    'is_active' => true,
                ]);
            }
            
            // Randomly select some documents to deactivate
            $deactivateCount = rand(1, max(1, $count - 1));
            $deactivatedIds = [];
            
            for ($j = 0; $j < $deactivateCount; $j++) {
                $doc = $documents[$j];
                $doc->update(['is_active' => false]);
                $deactivatedIds[] = $doc->id;
            }
            
            // Query using active() scope (public-facing query)
            $activeDocuments = PpidDocument::active()->get();
            
            // Verify: No deactivated document should appear in results
            foreach ($activeDocuments as $doc) {
                $this->assertNotContains(
                    $doc->id,
                    $deactivatedIds,
                    "Deactivated document ID {$doc->id} should NOT appear in active() query"
                );
            }
            
            // Verify: All active documents should appear
            $activeIds = $activeDocuments->pluck('id')->toArray();
            foreach ($documents as $doc) {
                if (!in_array($doc->id, $deactivatedIds)) {
                    $this->assertContains(
                        $doc->id,
                        $activeIds,
                        "Active document ID {$doc->id} should appear in active() query"
                    );
                }
            }
            
            // Clean up for next iteration
            PpidDocument::query()->delete();
        }
    }

    /**
     * Property: Inactive Ssd does not appear in public queries
     * 
     * For any Ssd with is_active=false, querying with the active() scope
     * should NOT return that FAQ item.
     * 
     * @see Requirements 4.5
     */
    public function test_inactive_ssd_not_in_public_queries(): void
    {
        // Property test: run 50 iterations
        for ($i = 0; $i < 50; $i++) {
            $faker = $this->getFreshFaker();
            
            // Create a random number of SSDs (2-8)
            $count = rand(2, 8);
            $categories = ['umum', 'layanan', 'teknis', 'administrasi'];
            
            $ssds = [];
            for ($j = 0; $j < $count; $j++) {
                $ssds[] = Ssd::create([
                    'question' => 'Question ' . $faker->uuid(),
                    'answer' => $faker->paragraph(),
                    'category' => $categories[array_rand($categories)],
                    'sort_order' => $j,
                    'is_active' => true,
                ]);
            }
            
            // Randomly select some SSDs to deactivate
            $deactivateCount = rand(1, max(1, $count - 1));
            $deactivatedIds = [];
            
            for ($j = 0; $j < $deactivateCount; $j++) {
                $ssd = $ssds[$j];
                $ssd->update(['is_active' => false]);
                $deactivatedIds[] = $ssd->id;
            }
            
            // Query using active() scope (public-facing query)
            $activeSsds = Ssd::active()->get();
            
            // Verify: No deactivated SSD should appear in results
            foreach ($activeSsds as $ssd) {
                $this->assertNotContains(
                    $ssd->id,
                    $deactivatedIds,
                    "Deactivated SSD ID {$ssd->id} should NOT appear in active() query"
                );
            }
            
            // Verify: All active SSDs should appear
            $activeIds = $activeSsds->pluck('id')->toArray();
            foreach ($ssds as $ssd) {
                if (!in_array($ssd->id, $deactivatedIds)) {
                    $this->assertContains(
                        $ssd->id,
                        $activeIds,
                        "Active SSD ID {$ssd->id} should appear in active() query"
                    );
                }
            }
            
            // Clean up for next iteration
            Ssd::query()->delete();
        }
    }

    /**
     * Property: Inactive ProfileContent does not appear in public queries
     * 
     * For any ProfileContent with is_active=false, querying with the byType() scope
     * (which includes is_active=true filter) should NOT return that content.
     * 
     * @see Requirements 6.5
     */
    public function test_inactive_profile_content_not_in_public_queries(): void
    {
        // Property test: run 50 iterations
        for ($i = 0; $i < 50; $i++) {
            $faker = $this->getFreshFaker();
            
            // Create a random number of profile contents (2-6)
            $count = rand(2, 6);
            $types = ['sejarah', 'visi-misi', 'kedudukan', 'struktur'];
            $type = $types[array_rand($types)];
            
            $contents = [];
            for ($j = 0; $j < $count; $j++) {
                $contents[] = ProfileContent::create([
                    'type' => $type,
                    'title' => 'Content ' . $faker->uuid(),
                    'content' => $faker->paragraph(),
                    'order' => $j,
                    'is_active' => true,
                ]);
            }
            
            // Randomly select some contents to deactivate
            $deactivateCount = rand(1, max(1, $count - 1));
            $deactivatedIds = [];
            
            for ($j = 0; $j < $deactivateCount; $j++) {
                $content = $contents[$j];
                $content->update(['is_active' => false]);
                $deactivatedIds[] = $content->id;
            }
            
            // Query using byType() scope (public-facing query - includes is_active=true)
            $activeContents = ProfileContent::byType($type)->get();
            
            // Verify: No deactivated content should appear in results
            foreach ($activeContents as $content) {
                $this->assertNotContains(
                    $content->id,
                    $deactivatedIds,
                    "Deactivated ProfileContent ID {$content->id} should NOT appear in byType() query"
                );
            }
            
            // Verify: All active contents should appear
            $activeIds = $activeContents->pluck('id')->toArray();
            foreach ($contents as $content) {
                if (!in_array($content->id, $deactivatedIds)) {
                    $this->assertContains(
                        $content->id,
                        $activeIds,
                        "Active ProfileContent ID {$content->id} should appear in byType() query"
                    );
                }
            }
            
            // Clean up for next iteration
            ProfileContent::query()->delete();
        }
    }

    /**
     * Property: Hidden Menu does not appear in public queries
     * 
     * For any Menu with is_visible=false, querying with the visible() scope
     * should NOT return that menu item.
     * 
     * @see Requirements 7.5
     */
    public function test_hidden_menu_not_in_public_queries(): void
    {
        // Property test: run 50 iterations
        for ($i = 0; $i < 50; $i++) {
            $faker = $this->getFreshFaker();
            
            // Create a random number of menus (2-8)
            $count = rand(2, 8);
            $locations = ['header', 'footer'];
            
            $menus = [];
            for ($j = 0; $j < $count; $j++) {
                $menus[] = Menu::create([
                    'label' => 'Menu ' . $faker->uuid(),
                    'url' => '/' . $faker->slug(),
                    'location' => $locations[array_rand($locations)],
                    'order' => $j,
                    'is_visible' => true,
                ]);
            }
            
            // Randomly select some menus to hide
            $hideCount = rand(1, max(1, $count - 1));
            $hiddenIds = [];
            
            for ($j = 0; $j < $hideCount; $j++) {
                $menu = $menus[$j];
                $menu->update(['is_visible' => false]);
                $hiddenIds[] = $menu->id;
            }
            
            // Query using visible() scope (public-facing query)
            $visibleMenus = Menu::visible()->get();
            
            // Verify: No hidden menu should appear in results
            foreach ($visibleMenus as $menu) {
                $this->assertNotContains(
                    $menu->id,
                    $hiddenIds,
                    "Hidden Menu ID {$menu->id} should NOT appear in visible() query"
                );
            }
            
            // Verify: All visible menus should appear
            $visibleIds = $visibleMenus->pluck('id')->toArray();
            foreach ($menus as $menu) {
                if (!in_array($menu->id, $hiddenIds)) {
                    $this->assertContains(
                        $menu->id,
                        $visibleIds,
                        "Visible Menu ID {$menu->id} should appear in visible() query"
                    );
                }
            }
            
            // Clean up for next iteration
            Menu::query()->delete();
        }
    }

    /**
     * Property: Toggle from active to inactive removes from public queries
     * 
     * For any entity that is initially active and then toggled to inactive,
     * it should immediately stop appearing in public-facing queries.
     */
    public function test_toggle_to_inactive_removes_from_public_queries(): void
    {
        // Property test: run 30 iterations
        for ($i = 0; $i < 30; $i++) {
            $faker = $this->getFreshFaker();
            
            // Create an active PpidDocument
            $document = PpidDocument::create([
                'title' => 'Document ' . $faker->uuid(),
                'file_path' => 'ppid-documents/test-' . $faker->uuid() . '.pdf',
                'category' => 'setiap_saat',
                'file_type' => 'pdf',
                'file_size' => rand(1000, 100000),
                'download_count' => 0,
                'is_active' => true,
            ]);
            
            // Verify it appears in active query
            $this->assertTrue(
                PpidDocument::active()->where('id', $document->id)->exists(),
                "Active document should appear in active() query"
            );
            
            // Toggle to inactive
            $document->update(['is_active' => false]);
            
            // Verify it no longer appears in active query
            $this->assertFalse(
                PpidDocument::active()->where('id', $document->id)->exists(),
                "Deactivated document should NOT appear in active() query after toggle"
            );
            
            // Clean up
            PpidDocument::query()->delete();
        }
    }

    /**
     * Property: Toggle from inactive to active adds to public queries
     * 
     * For any entity that is initially inactive and then toggled to active,
     * it should immediately start appearing in public-facing queries.
     */
    public function test_toggle_to_active_adds_to_public_queries(): void
    {
        // Property test: run 30 iterations
        for ($i = 0; $i < 30; $i++) {
            $faker = $this->getFreshFaker();
            
            // Create an inactive Ssd
            $ssd = Ssd::create([
                'question' => 'Question ' . $faker->uuid(),
                'answer' => $faker->paragraph(),
                'category' => 'umum',
                'sort_order' => 0,
                'is_active' => false,
            ]);
            
            // Verify it does NOT appear in active query
            $this->assertFalse(
                Ssd::active()->where('id', $ssd->id)->exists(),
                "Inactive SSD should NOT appear in active() query"
            );
            
            // Toggle to active
            $ssd->update(['is_active' => true]);
            
            // Verify it now appears in active query
            $this->assertTrue(
                Ssd::active()->where('id', $ssd->id)->exists(),
                "Activated SSD should appear in active() query after toggle"
            );
            
            // Clean up
            Ssd::query()->delete();
        }
    }

    /**
     * Property: Visibility toggle via controller endpoint works correctly
     * 
     * For any PpidDocument, calling the toggleActive endpoint should
     * correctly flip the is_active status and affect public queries.
     */
    public function test_visibility_toggle_via_controller_endpoint(): void
    {
        // Property test: run 30 iterations
        for ($i = 0; $i < 30; $i++) {
            $faker = $this->getFreshFaker();
            
            // Create a document with random initial state
            $initialActive = (bool) rand(0, 1);
            
            $document = PpidDocument::create([
                'title' => 'Document ' . $faker->uuid(),
                'file_path' => 'ppid-documents/test-' . $faker->uuid() . '.pdf',
                'category' => 'berkala',
                'file_type' => 'pdf',
                'file_size' => rand(1000, 100000),
                'download_count' => 0,
                'is_active' => $initialActive,
            ]);
            
            // Call toggle endpoint
            $response = $this->actingAs($this->adminUser, 'admin')
                ->post(route('admin.ppid.toggle-active', $document));
            
            $response->assertRedirect();
            
            // Refresh from database
            $document->refresh();
            
            // Verify the status was toggled
            $this->assertEquals(
                !$initialActive,
                $document->is_active,
                "Document is_active should be toggled from " . ($initialActive ? 'true' : 'false') . " to " . (!$initialActive ? 'true' : 'false')
            );
            
            // Verify public query reflects the new state
            $appearsInPublic = PpidDocument::active()->where('id', $document->id)->exists();
            $this->assertEquals(
                !$initialActive,
                $appearsInPublic,
                "Document should " . (!$initialActive ? '' : 'NOT ') . "appear in public query after toggle"
            );
            
            // Clean up
            PpidDocument::query()->delete();
        }
    }
}
