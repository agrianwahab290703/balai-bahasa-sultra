<?php

namespace Tests\Feature\Properties;

use App\Helpers\SlugGenerator;
use App\Models\Berita;
use Database\Factories\BeritaFactory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Property Test: Slug Generation Consistency
 * 
 * **Feature: admin-crud-management, Property 2: Slug Generation Consistency**
 * **Validates: Requirements 1.4**
 * 
 * *For any* title string, the auto-generated slug SHALL be URL-friendly 
 * (lowercase, hyphens instead of spaces, no special characters) AND unique 
 * within the same entity type.
 */
class SlugGenerationPropertyTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Property: Generated slugs are URL-friendly (lowercase)
     * 
     * For any title string, the generated slug should be entirely lowercase.
     */
    public function test_generated_slugs_are_lowercase(): void
    {
        // Property test: run 100 iterations with random titles
        for ($i = 0; $i < 100; $i++) {
            $title = fake()->sentence(rand(3, 10));
            
            $slug = SlugGenerator::generate($title);
            
            // Slug should be lowercase
            $this->assertEquals(
                strtolower($slug),
                $slug,
                "Slug '{$slug}' should be lowercase for title '{$title}'"
            );
        }
    }

    /**
     * Property: Generated slugs contain no spaces
     * 
     * For any title string, the generated slug should not contain spaces.
     */
    public function test_generated_slugs_contain_no_spaces(): void
    {
        // Property test: run 100 iterations with random titles
        for ($i = 0; $i < 100; $i++) {
            $title = fake()->sentence(rand(3, 10));
            
            $slug = SlugGenerator::generate($title);
            
            // Slug should not contain spaces
            $this->assertStringNotContainsString(
                ' ',
                $slug,
                "Slug '{$slug}' should not contain spaces for title '{$title}'"
            );
        }
    }

    /**
     * Property: Generated slugs contain only alphanumeric and hyphens
     * 
     * For any title string, the generated slug should only contain 
     * lowercase alphanumeric characters and hyphens.
     */
    public function test_generated_slugs_contain_only_valid_characters(): void
    {
        // Property test: run 100 iterations with random titles
        for ($i = 0; $i < 100; $i++) {
            $title = fake()->sentence(rand(3, 10));
            
            $slug = SlugGenerator::generate($title);
            
            // Skip empty slugs (can happen with non-latin characters only)
            if (empty($slug)) {
                continue;
            }
            
            // Slug should only contain alphanumeric and hyphens
            $this->assertMatchesRegularExpression(
                '/^[a-z0-9-]+$/',
                $slug,
                "Slug '{$slug}' should only contain lowercase alphanumeric and hyphens for title '{$title}'"
            );
        }
    }

    /**
     * Property: Generated slugs are deterministic
     * 
     * For any title string, generating a slug multiple times should 
     * produce the same result.
     */
    public function test_slug_generation_is_deterministic(): void
    {
        // Property test: run 100 iterations with random titles
        for ($i = 0; $i < 100; $i++) {
            $title = fake()->sentence(rand(3, 10));
            
            $slug1 = SlugGenerator::generate($title);
            $slug2 = SlugGenerator::generate($title);
            $slug3 = SlugGenerator::generate($title);
            
            // All generated slugs should be identical
            $this->assertEquals(
                $slug1,
                $slug2,
                "Slug generation should be deterministic for title '{$title}'"
            );
            $this->assertEquals(
                $slug2,
                $slug3,
                "Slug generation should be deterministic for title '{$title}'"
            );
        }
    }

    /**
     * Property: Unique slugs are unique within entity type
     * 
     * For any set of titles, generateUnique should produce unique slugs
     * within the same entity type.
     */
    public function test_unique_slugs_are_unique_within_entity_type(): void
    {
        $generatedSlugs = [];
        
        // Property test: run 50 iterations creating berita with same base title
        for ($i = 0; $i < 50; $i++) {
            $baseTitle = 'Test Article Title';
            
            $slug = SlugGenerator::generateUnique($baseTitle, Berita::class);
            
            // Create the berita with this slug using factory
            Berita::factory()->create([
                'judul_utama' => $baseTitle,
                'slug' => $slug,
            ]);
            
            // Slug should not be in our generated list
            $this->assertNotContains(
                $slug,
                $generatedSlugs,
                "Slug '{$slug}' should be unique"
            );
            
            $generatedSlugs[] = $slug;
        }
        
        // All slugs should be unique
        $this->assertCount(
            count($generatedSlugs),
            array_unique($generatedSlugs),
            "All generated slugs should be unique"
        );
    }

    /**
     * Property: Unique slugs exclude specified ID
     * 
     * When updating an entity, generateUnique should allow the same slug
     * if it belongs to the entity being updated.
     */
    public function test_unique_slugs_exclude_specified_id(): void
    {
        // Property test: run 50 iterations
        for ($i = 0; $i < 50; $i++) {
            $title = fake()->sentence(rand(3, 5));
            $slug = SlugGenerator::generate($title);
            
            // Create a berita using factory
            $berita = Berita::factory()->create([
                'judul_utama' => $title,
                'slug' => $slug,
            ]);
            
            // Generate unique slug with same title, excluding this berita's ID
            $newSlug = SlugGenerator::generateUnique($title, Berita::class, $berita->id);
            
            // Should get the same slug since we're excluding this ID
            $this->assertEquals(
                $berita->slug,
                $newSlug,
                "Should get same slug when excluding the entity's own ID"
            );
        }
    }

    /**
     * Property: Slug exists check is accurate
     * 
     * For any slug, slugExists should return true if and only if
     * the slug exists in the database for that entity type.
     */
    public function test_slug_exists_check_is_accurate(): void
    {
        // Property test: run 50 iterations
        for ($i = 0; $i < 50; $i++) {
            $title = fake()->unique()->sentence(rand(3, 5));
            $slug = SlugGenerator::generate($title);
            
            // Before creating, slug should not exist
            $this->assertFalse(
                SlugGenerator::slugExists($slug, Berita::class),
                "Slug '{$slug}' should not exist before creation"
            );
            
            // Create the berita using factory
            Berita::factory()->create([
                'judul_utama' => $title,
                'slug' => $slug,
            ]);
            
            // After creating, slug should exist
            $this->assertTrue(
                SlugGenerator::slugExists($slug, Berita::class),
                "Slug '{$slug}' should exist after creation"
            );
        }
    }

    /**
     * Property: isValidSlug correctly validates slugs
     * 
     * For any generated slug from a non-empty title, isValidSlug should return true.
     */
    public function test_generated_slugs_pass_validation(): void
    {
        // Property test: run 100 iterations with random titles
        for ($i = 0; $i < 100; $i++) {
            // Use words that will definitely produce valid slugs
            $title = fake()->words(rand(2, 5), true);
            
            $slug = SlugGenerator::generate($title);
            
            // Skip empty slugs
            if (empty($slug)) {
                continue;
            }
            
            // Generated slug should be valid
            $this->assertTrue(
                SlugGenerator::isValidSlug($slug),
                "Generated slug '{$slug}' should be valid for title '{$title}'"
            );
        }
    }

    /**
     * Property: Invalid slugs are rejected
     * 
     * Slugs with invalid characters should be rejected by isValidSlug.
     */
    public function test_invalid_slugs_are_rejected(): void
    {
        $invalidSlugs = [
            'Has Spaces',
            'UPPERCASE',
            'special@chars!',
            'double--hyphens',
            '-starts-with-hyphen',
            'ends-with-hyphen-',
            'has_underscore',
            'has.dot',
            '',
        ];
        
        foreach ($invalidSlugs as $slug) {
            $this->assertFalse(
                SlugGenerator::isValidSlug($slug),
                "Slug '{$slug}' should be invalid"
            );
        }
    }

    /**
     * Property: Sanitize produces valid slugs
     * 
     * For any string, sanitize should produce a valid URL-friendly slug.
     */
    public function test_sanitize_produces_valid_slugs(): void
    {
        // Property test: run 100 iterations with random strings
        for ($i = 0; $i < 100; $i++) {
            $input = fake()->sentence(rand(2, 5));
            
            $sanitized = SlugGenerator::sanitize($input);
            
            // Skip empty results
            if (empty($sanitized)) {
                continue;
            }
            
            // Sanitized slug should be lowercase
            $this->assertEquals(
                strtolower($sanitized),
                $sanitized,
                "Sanitized slug should be lowercase"
            );
            
            // Sanitized slug should not contain spaces
            $this->assertStringNotContainsString(
                ' ',
                $sanitized,
                "Sanitized slug should not contain spaces"
            );
            
            // Sanitized slug should only contain valid characters
            $this->assertMatchesRegularExpression(
                '/^[a-z0-9-]+$/',
                $sanitized,
                "Sanitized slug should only contain valid characters"
            );
        }
    }

    /**
     * Property: generateUniqueForModel works correctly
     * 
     * For any model instance, generateUniqueForModel should produce
     * a unique slug considering the model's existing ID.
     */
    public function test_generate_unique_for_model_works_correctly(): void
    {
        // Property test: run 30 iterations
        for ($i = 0; $i < 30; $i++) {
            $title = fake()->sentence(rand(3, 5));
            
            // Create a berita using factory (saved model)
            $berita = Berita::factory()->create([
                'judul_utama' => $title,
            ]);
            
            // Update the slug using generateUniqueForModel
            $slug = SlugGenerator::generateUniqueForModel($title, $berita);
            $berita->slug = $slug;
            $berita->save();
            
            // Slug should be set and unique
            $this->assertNotEmpty($berita->slug);
            
            // Generate slug again for the saved model with same title
            $newSlug = SlugGenerator::generateUniqueForModel($title, $berita);
            
            // Should get the same slug since we're updating
            $this->assertEquals(
                $berita->slug,
                $newSlug,
                "Should get same slug when updating existing model"
            );
        }
    }
}
