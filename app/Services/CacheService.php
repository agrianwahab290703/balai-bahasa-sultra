<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;

/**
 * CacheService handles cache invalidation for public-facing content.
 * 
 * This service centralizes cache clearing logic to ensure consistency
 * between admin operations and public page content.
 * 
 * @see Requirements 13.1, 13.2, 13.3, 13.4, 13.5
 */
class CacheService
{
    /**
     * Cache key prefix for Berita index pages
     */
    public const BERITA_INDEX_PREFIX = 'berita_index_';

    /**
     * Cache key prefix for Berita show pages
     */
    public const BERITA_SHOW_PREFIX = 'berita_show_';

    /**
     * Cache key prefix for Berita related
     */
    public const BERITA_RELATED_PREFIX = 'berita_related_';

    /**
     * Cache keys for Berita module (static keys)
     */
    protected array $beritaCacheKeys = [
        'featured_news',
        'popular_news',
    ];

    /**
     * Cache keys for Gallery module
     */
    protected array $galleryCacheKeys = [
        'gallery_public_index',
        'gallery_categories',
        'gallery_featured',
    ];

    /**
     * Cache keys for PPID module
     */
    protected array $ppidCacheKeys = [
        'ppid_documents_all',
        'ppid_documents_setiap_saat',
        'ppid_documents_serta_merta',
        'ppid_documents_berkala',
        'ppid_documents_dikecualikan',
    ];

    /**
     * Cache keys for SSD module
     */
    protected array $ssdCacheKeys = [
        'ssd_public_index',
        'ssd_categories',
    ];

    /**
     * Clear all Berita-related cache.
     * 
     * Clears static cache keys and optionally specific article/related caches.
     * Also clears paginated index caches by pattern.
     * 
     * @param string|null $slug Optional slug for specific article cache
     * @param int|null $id Optional ID for related news cache
     * @return void
     * @see Requirements 9.2, 13.1, 13.2, 13.3
     */
    public function clearBeritaCache(?string $slug = null, ?int $id = null): void
    {
        // Clear static cache keys
        foreach ($this->beritaCacheKeys as $key) {
            Cache::forget($key);
        }

        // Clear paginated index caches (common pagination patterns)
        // Since Laravel's file/database cache doesn't support pattern deletion,
        // we clear the most common pagination keys
        for ($page = 1; $page <= 20; $page++) {
            // Clear index pages with empty filters
            Cache::forget(self::BERITA_INDEX_PREFIX . "___{$page}");
            // Clear index pages with various category/search combinations
            Cache::forget(self::BERITA_INDEX_PREFIX . "__{$page}");
        }

        // Clear specific article cache if slug provided
        if ($slug) {
            Cache::forget(self::BERITA_SHOW_PREFIX . $slug);
        }

        // Clear related news cache if ID provided
        if ($id) {
            Cache::forget(self::BERITA_RELATED_PREFIX . $id);
        }
    }

    /**
     * Clear all Gallery-related cache.
     * 
     * @return void
     */
    public function clearGalleryCache(): void
    {
        foreach ($this->galleryCacheKeys as $key) {
            Cache::forget($key);
        }
    }

    /**
     * Clear all PPID-related cache.
     * 
     * Clears static cache keys and paginated category pages.
     * 
     * @return void
     * @see Requirements 11.2, 11.3, 13.1, 13.2, 13.3
     */
    public function clearPpidCache(): void
    {
        // Clear static cache keys
        foreach ($this->ppidCacheKeys as $key) {
            Cache::forget($key);
        }
        
        // Clear paginated category pages (common pagination patterns)
        $categories = ['setiap_saat', 'serta_merta', 'berkala', 'dikecualikan'];
        foreach ($categories as $category) {
            for ($page = 1; $page <= 20; $page++) {
                Cache::forget("ppid_documents_{$category}_page_{$page}");
            }
        }
    }

    /**
     * Clear all SSD-related cache.
     * 
     * @return void
     */
    public function clearSsdCache(): void
    {
        foreach ($this->ssdCacheKeys as $key) {
            Cache::forget($key);
        }
    }

    /**
     * Clear all public-facing cache.
     * 
     * @return void
     */
    public function clearAllPublicCache(): void
    {
        $this->clearBeritaCache();
        $this->clearGalleryCache();
        $this->clearPpidCache();
        $this->clearSsdCache();
    }
}
