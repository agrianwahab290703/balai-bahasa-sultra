<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BeritaController extends Controller
{
    /**
     * Display the news listing page with filtering and pagination
     */
    public function index(Request $request)
    {
        // Build the base query
        $query = News::where('status', 'published')
            ->where('published_at', '<=', now());

        // Apply category filter if provided
        if ($request->has('category') && $request->category !== 'all') {
            $query->where(function ($q) use ($request) {
                $q->where('category', $request->category)
                  ->orWhereJsonContains('categories', $request->category);
            });
        }

        // Apply search filter if provided
        if ($request->has('search') && $request->search) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('title', 'like', '%' . $searchTerm . '%')
                  ->orWhere('excerpt', 'like', '%' . $searchTerm . '%')
                  ->orWhere('content', 'like', '%' . $searchTerm . '%');
            });
        }

        // Get paginated results
        $news = $query->orderBy('published_at', 'desc')
            ->paginate(12)
            ->withQueryString();

        // Get all unique categories
        $categories = $this->getAllCategories();

        // Get featured news (top 3 with images)
        $featuredNews = News::where('status', 'published')
            ->where('published_at', '<=', now())
            ->whereNotNull('featured_image')
            ->orderBy('published_at', 'desc')
            ->limit(3)
            ->get();

        return Inertia::render('Public/Berita/Index', [
            'news' => $news,
            'categories' => $categories,
            'featuredNews' => $featuredNews,
            'filters' => [
                'category' => $request->category ?? 'all',
                'search' => $request->search ?? '',
            ],
        ]);
    }

    /**
     * Display a single news article
     */
    public function show($slug)
    {
        $news = News::where('slug', $slug)
            ->where('status', 'published')
            ->with(['images', 'author'])
            ->firstOrFail();

        // Increment view count
        $news->increment('view_count');

        // Refresh to get the updated view_count
        $news->refresh();

        // Get related news based on category
        $relatedNews = News::where('status', 'published')
            ->where('id', '!=', $news->id)
            ->where('published_at', '<=', now())
            ->where(function ($query) use ($news) {
                // Match by primary category
                $query->where('category', $news->category);
                
                // Also match if categories overlap (JSON column)
                if ($news->categories && is_array($news->categories)) {
                    foreach ($news->categories as $cat) {
                        $query->orWhereJsonContains('categories', $cat);
                    }
                }
            })
            ->orderBy('published_at', 'desc')
            ->limit(3)
            ->get();

        // If not enough related news, fill with recent news
        if ($relatedNews->count() < 3) {
            $additionalNews = News::where('status', 'published')
                ->where('id', '!=', $news->id)
                ->whereNotIn('id', $relatedNews->pluck('id'))
                ->where('published_at', '<=', now())
                ->orderBy('published_at', 'desc')
                ->limit(3 - $relatedNews->count())
                ->get();
            
            $relatedNews = $relatedNews->concat($additionalNews);
        }

        return Inertia::render('Public/Berita/Show', [
            'news' => $news,
            'relatedNews' => $relatedNews,
        ]);
    }

    /**
     * Get all unique categories from news
     */
    private function getAllCategories(): array
    {
        // Get categories from the category column
        $singleCategories = News::where('status', 'published')
            ->whereNotNull('category')
            ->distinct()
            ->pluck('category')
            ->filter()
            ->toArray();

        // Get categories from the categories JSON column
        $jsonCategories = News::where('status', 'published')
            ->whereNotNull('categories')
            ->get()
            ->pluck('categories')
            ->flatten()
            ->filter()
            ->unique()
            ->toArray();

        // Merge and deduplicate
        $allCategories = array_unique(array_merge($singleCategories, $jsonCategories));
        
        // Sort alphabetically
        sort($allCategories);

        return array_values($allCategories);
    }
}
