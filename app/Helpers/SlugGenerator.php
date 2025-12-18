<?php

namespace App\Helpers;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;

/**
 * SlugGenerator Helper
 * 
 * Generates URL-friendly slugs from titles with uniqueness check within entity type.
 * 
 * @see Requirements 1.4 - Auto-generate URL-friendly slug from title
 */
class SlugGenerator
{
    /**
     * Generate a URL-friendly slug from a title.
     *
     * @param string $title The title to generate slug from
     * @return string The generated slug (lowercase, hyphens instead of spaces, no special characters)
     */
    public static function generate(string $title): string
    {
        return Str::slug($title);
    }

    /**
     * Generate a unique slug within an entity type.
     *
     * @param string $title The title to generate slug from
     * @param string $modelClass The fully qualified model class name
     * @param int|null $excludeId Optional ID to exclude from uniqueness check (for updates)
     * @param string $slugColumn The column name for the slug (default: 'slug')
     * @return string The unique slug
     */
    public static function generateUnique(
        string $title,
        string $modelClass,
        ?int $excludeId = null,
        string $slugColumn = 'slug'
    ): string {
        $slug = self::generate($title);
        $originalSlug = $slug;
        $counter = 1;

        while (self::slugExists($slug, $modelClass, $excludeId, $slugColumn)) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }

    /**
     * Check if a slug already exists in the given model.
     *
     * @param string $slug The slug to check
     * @param string $modelClass The fully qualified model class name
     * @param int|null $excludeId Optional ID to exclude from check
     * @param string $slugColumn The column name for the slug
     * @return bool True if slug exists, false otherwise
     */
    public static function slugExists(
        string $slug,
        string $modelClass,
        ?int $excludeId = null,
        string $slugColumn = 'slug'
    ): bool {
        // Start query, including soft deleted records if model uses SoftDeletes trait
        // Check if the model uses the SoftDeletes trait by looking for the method
        // Note: withTrashed() is a static method on the model class when using SoftDeletes trait
        $query = null;
        
        // First try to call withTrashed() statically on the model class
        // This works if the model uses the SoftDeletes trait
        try {
            $query = $modelClass::withTrashed();
        } catch (\BadMethodCallException $e) {
            // Model doesn't have withTrashed method, use normal query
            $query = $modelClass::query();
        }
        
        $query->where($slugColumn, $slug);

        if ($excludeId !== null) {
            $query->where('id', '!=', $excludeId);
        }

        return $query->exists();
    }

    /**
     * Generate a unique slug for a model instance.
     * 
     * This is a convenience method that extracts the model class and ID automatically.
     *
     * @param string $title The title to generate slug from
     * @param Model $model The model instance
     * @param string $slugColumn The column name for the slug (default: 'slug')
     * @return string The unique slug
     */
    public static function generateUniqueForModel(
        string $title,
        Model $model,
        string $slugColumn = 'slug'
    ): string {
        $modelClass = get_class($model);
        $excludeId = $model->exists ? $model->id : null;

        return self::generateUnique($title, $modelClass, $excludeId, $slugColumn);
    }

    /**
     * Validate if a string is a valid URL-friendly slug.
     *
     * @param string $slug The slug to validate
     * @return bool True if valid, false otherwise
     */
    public static function isValidSlug(string $slug): bool
    {
        // Slug should be lowercase, contain only alphanumeric characters and hyphens
        // Should not start or end with a hyphen
        // Should not have consecutive hyphens
        return (bool) preg_match('/^[a-z0-9]+(-[a-z0-9]+)*$/', $slug);
    }

    /**
     * Sanitize a slug to ensure it's URL-friendly.
     *
     * @param string $slug The slug to sanitize
     * @return string The sanitized slug
     */
    public static function sanitize(string $slug): string
    {
        // Convert to lowercase
        $slug = strtolower($slug);
        
        // Replace any non-alphanumeric characters with hyphens
        $slug = preg_replace('/[^a-z0-9]+/', '-', $slug);
        
        // Remove leading/trailing hyphens
        $slug = trim($slug, '-');
        
        // Replace multiple consecutive hyphens with single hyphen
        $slug = preg_replace('/-+/', '-', $slug);
        
        return $slug;
    }
}
