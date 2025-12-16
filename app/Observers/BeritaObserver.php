<?php

namespace App\Observers;

use App\Models\Berita;
use App\Services\CacheService;

/**
 * BeritaObserver handles cache invalidation for Berita model events.
 * 
 * @see Requirements 13.1, 13.2, 13.3
 */
class BeritaObserver
{
    public function __construct(
        protected CacheService $cacheService
    ) {}

    /**
     * Handle the Berita "created" event.
     */
    public function created(Berita $berita): void
    {
        $this->cacheService->clearBeritaCache();
    }

    /**
     * Handle the Berita "updated" event.
     */
    public function updated(Berita $berita): void
    {
        $this->cacheService->clearBeritaCache($berita->slug, $berita->id);
    }

    /**
     * Handle the Berita "deleted" event.
     */
    public function deleted(Berita $berita): void
    {
        $this->cacheService->clearBeritaCache($berita->slug, $berita->id);
    }

    /**
     * Handle the Berita "restored" event.
     */
    public function restored(Berita $berita): void
    {
        $this->cacheService->clearBeritaCache($berita->slug, $berita->id);
    }

    /**
     * Handle the Berita "force deleted" event.
     */
    public function forceDeleted(Berita $berita): void
    {
        $this->cacheService->clearBeritaCache($berita->slug, $berita->id);
    }
}
