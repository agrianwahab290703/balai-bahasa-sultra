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
    /**
     * Generate unique slug for pengumuman
     */
    protected function generateUniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $base = Str::slug($title);
        $slug = $base;
        $counter = 2;

        while (
            Pengumuman::withTrashed()
                ->where('slug', $slug)
                ->when($ignoreId, fn($q) => $q->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $slug = $base . '-' . $counter;
            $counter++;
        }

        return $slug;
    }

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
            $data['slug'] = $this->generateUniqueSlug($data['judul']);
            $data['created_by'] = Auth::guard('admin')->id();

            // Ensure gallery_images is properly handled
            if (!isset($data['gallery_images'])) {
                $data['gallery_images'] = [];
            }

            $pengumuman = Pengumuman::create($data);

            DB::commit();

            return $pengumuman;
        } catch (\Illuminate\Database\UniqueConstraintViolationException $e) {
            DB::rollBack();

            // Extract the duplicate key information from the error message
            if (preg_match("/Duplicate entry '(.+?)' for key/", $e->getMessage(), $matches)) {
                $duplicateSlug = $matches[1];
                throw new \Exception("Judul pengumuman ini sudah digunakan. Silakan gunakan judul yang berbeda atau tambahkan identifier unik.");
            }

            throw new \Exception("Terjadi kesalahan saat membuat pengumuman. Judul mungkin sudah digunakan.");
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
                $data['slug'] = $this->generateUniqueSlug($data['judul'], $id);
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
                case 'draft':
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
