<?php

namespace Tests\Feature\Properties;

use App\Models\AdminUser;
use App\Models\Berita;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Property Test: Data Loading Integrity
 * 
 * **Feature: admin-crud-management, Property 5: Data Loading Integrity**
 * **Validates: Requirements 1.7**
 * 
 * *For any* edit operation on an existing entity, the loaded form data 
 * SHALL contain all persisted field values matching the database record.
 */
class DataLoadingIntegrityPropertyTest extends TestCase
{
    use RefreshDatabase;

    protected AdminUser $adminUser;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create an admin user for authentication
        $this->adminUser = AdminUser::factory()->create([
            'role' => 'admin',
            'is_active' => true,
        ]);
    }

    /**
     * Property: Edit page loads all persisted field values
     * 
     * For any Berita entity, when accessing the edit page, all persisted
     * field values should be present in the response data.
     */
    public function test_edit_page_loads_all_persisted_field_values(): void
    {
        // Property test: run 50 iterations with random berita
        for ($i = 0; $i < 50; $i++) {
            // Create a berita with random data
            $berita = Berita::factory()->create();
            
            // Access the edit page as authenticated admin
            $response = $this->actingAs($this->adminUser, 'admin')
                ->get(route('admin.berita.edit', $berita));
            
            $response->assertStatus(200);
            
            // Get the Inertia page props
            $pageProps = $response->original->getData()['page']['props'];
            $loadedBerita = $pageProps['berita'];
            
            // Verify all key fields are loaded correctly
            $fieldsToCheck = [
                'id',
                'judul_utama',
                'slug',
                'ringkasan_inti',
                'teras_berita',
                'konteks_latar_belakang',
                'hero_image',
                'kategori',
                'is_published',
                'is_featured',
                'view_count',
            ];
            
            foreach ($fieldsToCheck as $field) {
                $this->assertEquals(
                    $berita->$field,
                    $loadedBerita[$field] ?? null,
                    "Field '{$field}' should match database value for berita ID {$berita->id}"
                );
            }
        }
    }

    /**
     * Property: Loaded data matches database record exactly
     * 
     * For any Berita entity, the loaded data should be an exact match
     * of the database record for all non-computed fields.
     */
    public function test_loaded_data_matches_database_record(): void
    {
        // Property test: run 50 iterations
        for ($i = 0; $i < 50; $i++) {
            // Create berita with specific values
            $testData = [
                'judul_utama' => fake()->sentence(rand(5, 10)),
                'ringkasan_inti' => fake()->paragraph(),
                'teras_berita' => fake()->paragraphs(2, true),
                'konteks_latar_belakang' => fake()->paragraphs(3, true),
                'kategori' => fake()->randomElement(['Berita', 'Pengumuman', 'Kegiatan']),
                'is_published' => fake()->boolean(),
                'is_featured' => fake()->boolean(),
                'author' => fake()->name(),
                'lokasi' => fake()->city(),
            ];
            
            $berita = Berita::factory()->create($testData);
            
            // Refresh from database to ensure we have the actual stored values
            $berita->refresh();
            
            // Access the edit page
            $response = $this->actingAs($this->adminUser, 'admin')
                ->get(route('admin.berita.edit', $berita));
            
            $response->assertStatus(200);
            
            $pageProps = $response->original->getData()['page']['props'];
            $loadedBerita = $pageProps['berita'];
            
            // Verify each test field matches
            foreach ($testData as $field => $expectedValue) {
                $loadedValue = $loadedBerita[$field] ?? null;
                
                // Handle boolean comparison
                if (is_bool($expectedValue)) {
                    $this->assertEquals(
                        $expectedValue,
                        (bool) $loadedValue,
                        "Boolean field '{$field}' should match for berita ID {$berita->id}"
                    );
                } else {
                    $this->assertEquals(
                        $berita->$field,
                        $loadedValue,
                        "Field '{$field}' should match database value for berita ID {$berita->id}"
                    );
                }
            }
        }
    }

    /**
     * Property: Show page loads complete entity data
     * 
     * For any Berita entity, the show page should load all entity data.
     */
    public function test_show_page_loads_complete_entity_data(): void
    {
        // Property test: run 50 iterations
        for ($i = 0; $i < 50; $i++) {
            $berita = Berita::factory()->create();
            
            $response = $this->actingAs($this->adminUser, 'admin')
                ->get(route('admin.berita.show', $berita));
            
            $response->assertStatus(200);
            
            $pageProps = $response->original->getData()['page']['props'];
            $loadedBerita = $pageProps['berita'];
            
            // Verify ID matches (fundamental integrity check)
            $this->assertEquals(
                $berita->id,
                $loadedBerita['id'],
                "Loaded berita ID should match requested ID"
            );
            
            // Verify title matches
            $this->assertEquals(
                $berita->judul_utama,
                $loadedBerita['judul_utama'],
                "Loaded berita title should match database"
            );
        }
    }

    /**
     * Property: Index page data integrity
     * 
     * For any set of Berita entities, the index page should load
     * accurate data for each item in the list.
     */
    public function test_index_page_data_integrity(): void
    {
        // Create multiple berita
        $beritaList = Berita::factory()->count(20)->create();
        
        $response = $this->actingAs($this->adminUser, 'admin')
            ->get(route('admin.berita.index'));
        
        $response->assertStatus(200);
        
        $pageProps = $response->original->getData()['page']['props'];
        $loadedBerita = collect($pageProps['berita']['data']);
        
        // Verify each loaded item matches database
        foreach ($loadedBerita as $loaded) {
            $original = Berita::find($loaded['id']);
            
            $this->assertNotNull($original, "Loaded berita ID {$loaded['id']} should exist in database");
            
            $this->assertEquals(
                $original->judul_utama,
                $loaded['judul_utama'],
                "Title should match for berita ID {$loaded['id']}"
            );
            
            $this->assertEquals(
                $original->slug,
                $loaded['slug'],
                "Slug should match for berita ID {$loaded['id']}"
            );
        }
    }
}
