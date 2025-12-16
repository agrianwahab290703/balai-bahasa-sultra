<?php

namespace App\Observers;

use App\Models\Gallery;
use App\Services\CacheService;

/**
 * GalleryObserver handles cache invalidation for Gallery model events.
 * 
 * @see Requirements 13.1, 13.2, 13.3
 */
class GalleryObserver
{
    public function __construct(
        protected CacheService $cacheService
    ) {}

    /**
     * Handle the Gallery "created" event.
     */
    public function created(Gallery $gallery): void
    {
        $this->cacheService->clearGalleryCache();
    }

    /**
     * Handle the Gallery "updated" event.
     */
    public function updated(Gallery $gallery): void
    {
        $this->cacheService->clearGalleryCache();
    }

    /**
     * Handle the Gallery "deleted" event.
     */
    public function deleted(Gallery $gallery): void
    {
        $this->cacheService->clearGalleryCache();
    }

    /**
     * Handle the Gallery "restored" event.
     */
    public function restored(Gallery $gallery): void
    {
        $this->cacheService->clearGalleryCache();
    }

    /**
     * Handle the Gallery "force deleted" event.
     */
    public function forceDeleted(Gallery $gallery): void
    {
        $this->cacheService->clearGalleryCache();
    }
}
