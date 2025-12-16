<?php

namespace App\Observers;

use App\Models\Ssd;
use App\Services\CacheService;

/**
 * SsdObserver handles cache invalidation for Ssd model events.
 * 
 * @see Requirements 13.1, 13.2, 13.3
 */
class SsdObserver
{
    public function __construct(
        protected CacheService $cacheService
    ) {}

    /**
     * Handle the Ssd "created" event.
     */
    public function created(Ssd $ssd): void
    {
        $this->cacheService->clearSsdCache();
    }

    /**
     * Handle the Ssd "updated" event.
     */
    public function updated(Ssd $ssd): void
    {
        $this->cacheService->clearSsdCache();
    }

    /**
     * Handle the Ssd "deleted" event.
     */
    public function deleted(Ssd $ssd): void
    {
        $this->cacheService->clearSsdCache();
    }
}
