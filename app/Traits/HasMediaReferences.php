<?php

namespace App\Traits;

use App\Models\Media;
use App\Services\MediaService;

/**
 * Trait for models that reference media files.
 * 
 * This trait provides automatic tracking of media references
 * when models are created, updated, or deleted.
 * 
 * @see Requirements 8.5
 */
trait HasMediaReferences
{
    /**
     * Boot the trait.
     */
    public static function bootHasMediaReferences(): void
    {
        // Track media references when model is created
        static::created(function ($model) {
            $model->updateMediaReferences();
        });

        // Track media references when model is updated
        static::updated(function ($model) {
            $model->updateMediaReferences($model->getOriginal());
        });

        // Decrement media references when model is deleted
        static::deleted(function ($model) {
            $model->decrementMediaReferences();
        });
    }

    /**
     * Get the fields that may contain media references.
     * Override this in your model to specify which fields to check.
     *
     * @return array
     */
    public function getMediaReferenceFields(): array
    {
        return [];
    }

    /**
     * Update media references for this model.
     *
     * @param array|null $oldAttributes Previous attributes (for updates)
     * @return void
     */
    public function updateMediaReferences(?array $oldAttributes = null): void
    {
        $mediaService = app(MediaService::class);
        $fields = $this->getMediaReferenceFields();

        foreach ($fields as $field) {
            $newValue = $this->getAttribute($field);
            $oldValue = $oldAttributes[$field] ?? null;

            // If value changed, update references
            if ($newValue !== $oldValue) {
                // Decrement old media reference
                if ($oldValue) {
                    $oldMedia = $this->findMediaByPath($oldValue);
                    if ($oldMedia) {
                        $mediaService->decrementUsage($oldMedia);
                    }
                }

                // Increment new media reference
                if ($newValue) {
                    $newMedia = $this->findMediaByPath($newValue);
                    if ($newMedia) {
                        $mediaService->incrementUsage($newMedia);
                    }
                }
            }
        }
    }

    /**
     * Decrement all media references for this model.
     *
     * @return void
     */
    public function decrementMediaReferences(): void
    {
        $mediaService = app(MediaService::class);
        $fields = $this->getMediaReferenceFields();

        foreach ($fields as $field) {
            $value = $this->getAttribute($field);
            if ($value) {
                $media = $this->findMediaByPath($value);
                if ($media) {
                    $mediaService->decrementUsage($media);
                }
            }
        }
    }

    /**
     * Find a media record by its path or URL.
     *
     * @param string $pathOrUrl
     * @return Media|null
     */
    protected function findMediaByPath(string $pathOrUrl): ?Media
    {
        // Try to find by exact path
        $media = Media::where('path', $pathOrUrl)->first();
        if ($media) {
            return $media;
        }

        // Try to extract path from URL and find
        $path = $this->extractPathFromUrl($pathOrUrl);
        if ($path) {
            return Media::where('path', $path)->first();
        }

        // Try to find by partial path match
        return Media::where('path', 'LIKE', '%' . basename($pathOrUrl))->first();
    }

    /**
     * Extract storage path from a URL.
     *
     * @param string $url
     * @return string|null
     */
    protected function extractPathFromUrl(string $url): ?string
    {
        // Handle /storage/ URLs
        if (str_contains($url, '/storage/')) {
            $parts = explode('/storage/', $url);
            return $parts[1] ?? null;
        }

        return null;
    }
}
