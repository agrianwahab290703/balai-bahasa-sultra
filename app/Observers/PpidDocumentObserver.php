<?php

namespace App\Observers;

use App\Models\PpidDocument;
use App\Services\CacheService;

/**
 * PpidDocumentObserver handles cache invalidation for PpidDocument model events.
 * 
 * @see Requirements 13.1, 13.2, 13.3
 */
class PpidDocumentObserver
{
    public function __construct(
        protected CacheService $cacheService
    ) {}

    /**
     * Handle the PpidDocument "created" event.
     */
    public function created(PpidDocument $ppidDocument): void
    {
        $this->cacheService->clearPpidCache();
    }

    /**
     * Handle the PpidDocument "updated" event.
     */
    public function updated(PpidDocument $ppidDocument): void
    {
        $this->cacheService->clearPpidCache();
    }

    /**
     * Handle the PpidDocument "deleted" event.
     */
    public function deleted(PpidDocument $ppidDocument): void
    {
        $this->cacheService->clearPpidCache();
    }
}
