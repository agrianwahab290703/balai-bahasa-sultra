<?php

namespace App\Services;

use App\Models\Activity;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class ActivityService
{
    public function getAll(array $filters = []): LengthAwarePaginator
    {
        $query = Activity::with(['author', 'images']);

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['locale'])) {
            $query->byLocale($filters['locale']);
        }

        return $query->orderBy('event_date', 'desc')
                    ->paginate(10);
    }

    public function getById(int $id): ?Activity
    {
        return Activity::with(['author', 'images', 'translations'])
                       ->findOrFail($id);
    }

    public function getBySlug(string $slug): ?Activity
    {
        return Activity::with(['author', 'images', 'translations'])
                       ->where('slug', $slug)
                       ->firstOrFail();
    }

    public function getLatest(int $limit = 6): Collection
    {
        return Activity::published()
                       ->with(['author', 'images'])
                       ->orderBy('event_date', 'desc')
                       ->limit($limit)
                       ->get();
    }
}
