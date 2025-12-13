<?php

namespace App\Services;

use App\Models\Service;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class ServiceService
{
    public function getAll(array $filters = []): LengthAwarePaginator
    {
        $query = Service::with(['author']);

        if (isset($filters['is_active'])) {
            $query->where('is_active', $filters['is_active']);
        }

        if (isset($filters['locale'])) {
            $query->byLocale($filters['locale']);
        }

        return $query->orderBy('sort_order', 'asc')
                    ->paginate(10);
    }

    public function getById(int $id): ?Service
    {
        return Service::with(['author', 'translations'])
                      ->findOrFail($id);
    }

    public function getBySlug(string $slug): ?Service
    {
        return Service::with(['author', 'translations'])
                      ->where('slug', $slug)
                      ->firstOrFail();
    }

    public function getActive(): Collection
    {
        return Service::where('is_active', true)
                      ->with(['author'])
                      ->orderBy('sort_order', 'asc')
                      ->get();
    }

    public function getAllActive(): Collection
    {
        return $this->getActive();
    }
}
