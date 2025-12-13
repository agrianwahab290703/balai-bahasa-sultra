<?php

namespace App\Services;

use App\Models\News;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class NewsService
{
    public function getAll(array $filters = []): LengthAwarePaginator
    {
        $query = News::with(['author', 'images']);

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['locale'])) {
            $query->byLocale($filters['locale']);
        }

        return $query->orderBy('published_at', 'desc')
                    ->paginate(10);
    }

    public function getById(int $id): ?News
    {
        return News::with(['author', 'images', 'translations'])
                   ->findOrFail($id);
    }

    public function getBySlug(string $slug): ?News
    {
        return News::with(['author', 'images', 'translations'])
                   ->where('slug', $slug)
                   ->firstOrFail();
    }

    public function getFeatured(int $limit = 6): Collection
    {
        return News::published()
                   ->with(['author', 'images'])
                   ->orderBy('published_at', 'desc')
                   ->limit($limit)
                   ->get();
    }

    public function create(array $data): News
    {
        DB::beginTransaction();

        try {
            $news = News::create([
                'title' => $data['title'],
                'slug' => $data['slug'],
                'excerpt' => $data['excerpt'] ?? null,
                'content' => $data['content'],
                'featured_image' => $data['featured_image'] ?? null,
                'status' => $data['status'] ?? 'draft',
                'published_at' => $data['published_at'] ?? null,
                'user_id' => auth()->id(),
            ]);

            // Create translations
            if (isset($data['translations'])) {
                foreach ($data['translations'] as $locale => $translation) {
                    $news->translations()->create([
                        'locale' => $locale,
                        'title' => $translation['title'],
                        'excerpt' => $translation['excerpt'] ?? null,
                        'content' => $translation['content'],
                        'meta_title' => $translation['meta_title'] ?? null,
                        'meta_description' => $translation['meta_description'] ?? null,
                    ]);
                }
            }

            DB::commit();

            return $news;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function update(int $id, array $data): News
    {
        DB::beginTransaction();

        try {
            $news = News::findOrFail($id);

            $news->update([
                'title' => $data['title'] ?? $news->title,
                'slug' => $data['slug'] ?? $news->slug,
                'excerpt' => $data['excerpt'] ?? $news->excerpt,
                'content' => $data['content'] ?? $news->content,
                'featured_image' => $data['featured_image'] ?? $news->featured_image,
                'status' => $data['status'] ?? $news->status,
                'published_at' => $data['published_at'] ?? $news->published_at,
            ]);

            // Update translations
            if (isset($data['translations'])) {
                foreach ($data['translations'] as $locale => $translation) {
                    $news->translations()->updateOrCreate(
                        ['locale' => $locale],
                        [
                            'title' => $translation['title'],
                            'excerpt' => $translation['excerpt'] ?? null,
                            'content' => $translation['content'],
                            'meta_title' => $translation['meta_title'] ?? null,
                            'meta_description' => $translation['meta_description'] ?? null,
                        ]
                    );
                }
            }

            DB::commit();

            return $news;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function delete(int $id): bool
    {
        return News::findOrFail($id)->delete();
    }

    public function publish(int $id): bool
    {
        $news = News::findOrFail($id);
        $news->update([
            'status' => 'published',
            'published_at' => now(),
        ]);

        return true;
    }

    public function archive(int $id): bool
    {
        return News::findOrFail($id)->update(['status' => 'archived']);
    }

    public function incrementViewCount(int $id): void
    {
        News::where('id', $id)->increment('view_count');
    }
}
