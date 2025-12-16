<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Berita;
use App\Models\GaleriFotoBerita;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BeritaController extends Controller
{
    /**
     * Display a listing of the news.
     */
    public function index(Request $request): Response
    {
        $search = $request->get('search', '');
        $category = $request->get('category', '');
        $page = $request->get('page', 1);

        // Cache for 30 minutes
        // Use consistent cache key pattern that aligns with CacheService
        // Requirements: 9.1, 9.2, 9.3 - Ensure only published berita are shown
        $cacheKey = \App\Services\CacheService::BERITA_INDEX_PREFIX . "{$category}_{$search}_{$page}";

        $berita = Cache::remember($cacheKey, 1800, function () use ($search, $category) {
            $query = Berita::published()
                ->with(['galeriFotoBerita' => function ($query) {
                    $query->where('tipe', 'hero')->orWhere('tipe', 'thumbnail');
                }]);

            if ($search) {
                $query->search($search);
            }

            if ($category) {
                $query->byCategory($category);
            }

            return $query->orderBy('created_at', 'desc')
                ->paginate(12)
                ->withQueryString();
        });

        // Get categories for filter - sementara kosongkan karena method belum ada
        $categories = [];

        // Get featured news
        $featuredNews = Cache::remember('featured_news', 1800, function () {
            return Berita::getFeatured(3);
        });

        // Get popular news
        $popularNews = Cache::remember('popular_news', 1800, function () {
            return Berita::getPopular(5);
        });

        return Inertia::render('Public/Berita/Index', [
            'berita' => $berita,
            'featuredNews' => $featuredNews,
            'popularNews' => $popularNews,
            'categories' => $categories,
            'filters' => [
                'search' => $search,
                'category' => $category,
            ],
        ]);
    }

    /**
     * Display the specified news.
     */
    public function show(string $slug): Response
    {
        // Use consistent cache key pattern that aligns with CacheService
        $cacheKey = \App\Services\CacheService::BERITA_SHOW_PREFIX . $slug;

        $berita = Cache::remember($cacheKey, 1800, function () use ($slug) {
            // Requirements: 9.1, 9.3 - Only published berita should be accessible
            return Berita::published()
                ->with([
                    'galeriFotoBerita' => function ($query) {
                        $query->orderBy('urutan');
                    }
                ])
                ->where('slug', $slug)
                ->firstOrFail();
        });

        // Increment view count outside cache to ensure it increments on every view
        // Requirements: 9.5 - WHEN a berita is viewed THEN the System SHALL increment view_count
        $berita->increment('view_count');

        // Get related news with consistent cache key pattern
        $relatedNews = Cache::remember(\App\Services\CacheService::BERITA_RELATED_PREFIX . $berita->id, 1800, function () use ($berita) {
            return $berita->relatedNews;
        });

        // Prepare gallery data
        $galeri = $berita->galeriFotoBerita->map(function ($foto) {
            return [
                'id' => $foto->id,
                'berita_id' => $foto->berita_id,
                'path_gambar' => $foto->file_path,
                'caption' => $foto->caption,
                'alt_text' => $foto->alt_text,
                'urutan' => $foto->urutan,
                'tipe_gambar' => $foto->tipe,
            ];
        })->sortBy('urutan')->values();

        // Prepare related news data
        $relatedNewsData = $relatedNews->map(function ($item) {
            $heroPhoto = $item->heroImage()->first();
            return [
                'id' => $item->id,
                'judul_utama' => $item->judul_utama,
                'slug' => $item->slug,
                'created_at' => $item->formatted_created_at,
                'hero_image' => $heroPhoto ? $heroPhoto->full_url : ($item->hero_image ? asset($item->hero_image) : null),
                'kategori' => $item->kategori,
                'view_count' => $item->view_count,
            ];
        });

        // Construct content from teras_berita field
        $content = '';
        if ($berita->teras_berita) $content .= '<div class="prose max-w-none">' . $berita->teras_berita . '</div>';

        $beritaData = [
            'id' => $berita->id,
            'judul_utama' => $berita->judul_utama,
            'slug' => $berita->slug,
            'hero_image' => asset($berita->hero_image),
            'hero_image_alt' => $berita->hero_image_alt ?? $berita->judul_utama,
            'lokasi' => $berita->lokasi,
            'tanggal_rilis' => $berita->tanggal_rilis->format('d F Y'),
            'teras_berita' => $berita->teras_berita,
            'content' => $content,
            'kategori' => $berita->kategori,
            'is_published' => $berita->is_published,
            'is_featured' => $berita->is_featured,
            'view_count' => $berita->view_count,
            'author' => $berita->author,
            'sumber_rilis' => $berita->sumber_rilis,
            'created_at' => $berita->created_at->format('d F Y H:i'),
            'updated_at' => $berita->updated_at->format('d F Y H:i'),
            'reading_time' => $berita->reading_time ?? 5,
            'time_ago' => $berita->created_at->diffForHumans(),
        ];

        return Inertia::render('Public/Berita/Show', [
            'berita' => $beritaData,
            'galeri' => $galeri,
            'beritaTerkait' => $relatedNewsData,
        ]);
    }

    /**
     * Increment view count (AJAX endpoint).
     * 
     * Requirements: 9.5 - WHEN a berita is viewed THEN the System SHALL increment view_count
     */
    public function incrementView(Request $request, int $id): JsonResponse
    {
        // Requirements: 9.1, 9.3 - Only published berita should be accessible
        $berita = Berita::published()->findOrFail($id);
        $berita->increment('view_count');

        // Clear cache for this news using consistent cache key pattern
        Cache::forget(\App\Services\CacheService::BERITA_SHOW_PREFIX . $berita->slug);

        return response()->json([
            'success' => true,
            'view_count' => $berita->view_count,
        ]);
    }

    /**
     * Get news by category (AJAX endpoint).
     */
    public function getByCategory(Request $request, string $category): JsonResponse
    {
        $page = $request->get('page', 1);
        $perPage = $request->get('per_page', 12);

        $berita = Berita::published()
            ->with(['galeriFotoBerita' => function ($query) {
                $query->where('tipe', 'hero');
            }])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        $data = $berita->getCollection()->map(function ($item) {
            return [
                'id' => $item->id,
                'judul_utama' => $item->judul_utama,
                'slug' => $item->slug,
                'hero_image' => asset($item->hero_image),
                'kategori' => $item->kategori,
                'tanggal_rilis' => $item->tanggal_rilis->format('d F Y'),
                'view_count' => $item->view_count,
                'time_ago' => $item->created_at->diffForHumans(),
            ];
        });

        return response()->json([
            'data' => $data,
            'pagination' => [
                'current_page' => $berita->currentPage(),
                'last_page' => $berita->lastPage(),
                'per_page' => $berita->perPage(),
                'total' => $berita->total(),
                'next_page_url' => $berita->nextPageUrl(),
                'prev_page_url' => $berita->previousPageUrl(),
            ],
        ]);
    }

    /**
     * Search news (AJAX endpoint).
     */
    public function search(Request $request): JsonResponse
    {
        $query = $request->get('q', '');
        $perPage = $request->get('per_page', 12);

        if (empty($query) || strlen($query) < 2) {
            return response()->json([
                'data' => [],
                'message' => 'Query too short',
            ]);
        }

        $berita = Berita::published()
            ->search($query)
            ->with(['galeriFoto' => function ($query) {
                $query->where('tipe', 'hero')->orWhere('tipe', 'thumbnail');
            }])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        $data = $berita->getCollection()->map(function ($item) {
            $heroPhoto = $item->heroPhoto()->first();
            return [
                'id' => $item->id,
                'judul_utama' => $item->judul_utama,
                'slug' => $item->slug,
                'hero_image' => $heroPhoto ? $heroPhoto->full_url : null,
                'kategori' => $item->kategori,
                'tanggal_rilis' => $item->formatted_tanggal_rilis,
                'view_count' => $item->view_count,
                'time_ago' => $item->time_ago,
            ];
        });

        return response()->json([
            'data' => $data,
            'pagination' => [
                'current_page' => $berita->currentPage(),
                'last_page' => $berita->lastPage(),
                'per_page' => $berita->perPage(),
                'total' => $berita->total(),
                'next_page_url' => $berita->nextPageUrl(),
                'prev_page_url' => $berita->previousPageUrl(),
            ],
        ]);
    }

    /**
     * Get popular news (AJAX endpoint).
     */
    public function getPopular(Request $request): JsonResponse
    {
        $limit = $request->get('limit', 5);

        $berita = Berita::getPopular($limit);

        $data = $berita->map(function ($item) {
            $heroPhoto = $item->heroPhoto()->first();
            return [
                'id' => $item->id,
                'judul_utama' => $item->judul_utama,
                'slug' => $item->slug,
                'hero_image' => $heroPhoto ? $heroPhoto->full_url : null,
                'kategori' => $item->kategori,
                'view_count' => $item->view_count,
                'time_ago' => $item->time_ago,
            ];
        });

        return response()->json([
            'data' => $data,
        ]);
    }

    /**
     * Get featured news (AJAX endpoint).
     */
    public function getFeatured(Request $request): JsonResponse
    {
        $limit = $request->get('limit', 3);

        $berita = Berita::getFeatured($limit);

        $data = $berita->map(function ($item) {
            $heroPhoto = $item->heroPhoto()->first();
            return [
                'id' => $item->id,
                'judul_utama' => $item->judul_utama,
                'slug' => $item->slug,
                'hero_image' => $heroPhoto ? $heroPhoto->full_url : null,
                'kategori' => $item->kategori,
                'tanggal_rilis' => $item->formatted_tanggal_rilis,
                'view_count' => $item->view_count,
                'time_ago' => $item->time_ago,
            ];
        });

        return response()->json([
            'data' => $data,
        ]);
    }

    /**
     * Get recent news (AJAX endpoint).
     */
    public function getRecent(Request $request): JsonResponse
    {
        $limit = $request->get('limit', 5);
        $days = $request->get('days', 7);

        $berita = Berita::published()
            ->recent($days)
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();

        $data = $berita->map(function ($item) {
            $heroPhoto = $item->heroPhoto()->first();
            return [
                'id' => $item->id,
                'judul_utama' => $item->judul_utama,
                'slug' => $item->slug,
                'hero_image' => $heroPhoto ? $heroPhoto->full_url : null,
                'kategori' => $item->kategori,
                'tanggal_rilis' => $item->formatted_tanggal_rilis,
                'view_count' => $item->view_count,
                'time_ago' => $item->time_ago,
            ];
        });

        return response()->json([
            'data' => $data,
        ]);
    }

    /**
     * Get news statistics (AJAX endpoint).
     */
    public function getStatistics(): JsonResponse
    {
        $stats = Berita::getStatistics();

        return response()->json([
            'statistics' => $stats,
        ]);
    }
}