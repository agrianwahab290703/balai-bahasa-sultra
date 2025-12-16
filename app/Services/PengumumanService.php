<?php

namespace App\Services;

use App\Models\Pengumuman;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class PengumumanService
{
    public function getAll(array $filters = []): LengthAwarePaginator
    {
        $query = Pengumuman::with(['creator', 'updater']);

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['tipe'])) {
            $query->where('tipe', $filters['tipe']);
        }

        if (isset($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('judul', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('konten', 'like', '%' . $filters['search'] . '%');
            });
        }

        return $query->orderBy('prioritas', 'desc')
                    ->orderBy('created_at', 'desc')
                    ->paginate(10);
    }

    public function getById(int $id): ?Pengumuman
    {
        return Pengumuman::with(['creator', 'updater'])->findOrFail($id);
    }

    public function getBySlug(string $slug): ?Pengumuman
    {
        return Pengumuman::with(['creator', 'updater'])
                   ->where('slug', $slug)
                   ->firstOrFail();
    }

    public function getActive(int $limit = 10): Collection
    {
        return Pengumuman::where('status', 'active')
                   ->with(['creator'])
                   ->orderBy('prioritas', 'desc')
                   ->orderBy('created_at', 'desc')
                   ->limit($limit)
                   ->get();
    }

    public function create(array $data): Pengumuman
    {
        DB::beginTransaction();

        try {
            $data['slug'] = Str::slug($data['judul']);
            $data['created_by'] = Auth::guard('admin')->id();

            $pengumuman = Pengumuman::create($data);

            DB::commit();

            return $pengumuman;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function update(int $id, array $data): Pengumuman
    {
        DB::beginTransaction();

        try {
            $pengumuman = Pengumuman::findOrFail($id);

            if (isset($data['judul'])) {
                $data['slug'] = Str::slug($data['judul']);
            }

            $data['updated_by'] = Auth::guard('admin')->id();

            $pengumuman->update($data);

            DB::commit();

            return $pengumuman;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function delete(int $id): bool
    {
        return Pengumuman::findOrFail($id)->delete();
    }

    public function publish(int $id): bool
    {
        $pengumuman = Pengumuman::findOrFail($id);
        $pengumuman->update([
            'status' => 'active',
        ]);

        return true;
    }

    public function unpublish(int $id): bool
    {
        $pengumuman = Pengumuman::findOrFail($id);
        $pengumuman->update([
            'status' => 'draft',
        ]);

        return true;
    }

    public function bulkAction(array $ids, string $action): bool
    {
        DB::beginTransaction();

        try {
            $pengumuman = Pengumuman::whereIn('id', $ids);

            switch ($action) {
                case 'publish':
                    $pengumuman->update(['status' => 'active']);
                    break;
                case 'unpublish':
                    $pengumuman->update(['status' => 'draft']);
                    break;
                case 'delete':
                    $pengumuman->delete();
                    break;
                default:
                    throw new \InvalidArgumentException("Invalid bulk action: {$action}");
            }

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
