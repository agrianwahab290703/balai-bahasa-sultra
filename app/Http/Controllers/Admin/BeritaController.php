<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Berita;
use App\Helpers\SlugGenerator;
use App\Services\ActivityLoggerService;
use App\Services\HtmlSanitizer;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controller for managing Berita (News) in the admin panel.
 * Provides full CRUD operations with pagination, search, filters,
 * activity logging, and soft delete support.
 * 
 * @see Requirements 1.1, 1.2, 1.4, 1.5, 1.6, 1.7
 */
class BeritaController extends Controller
{
    protected ActivityLoggerService $activityLogger;
    protected HtmlSanitizer $htmlSanitizer;

    public function __construct(ActivityLoggerService $activityLogger, HtmlSanitizer $htmlSanitizer)
    {
        $this->activityLogger = $activityLogger;
        $this->htmlSanitizer = $htmlSanitizer;
    }

    /**
     * Display a paginated list of all news articles.
     * Supports search, filtering by status/category, and sorting.
     * 
     * @see Requirements 1.1, 1.5
     */
    public function index(Request $request): Response
    {
        $query = Berita::query();

        // Search by title, content, or category
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('judul_utama', 'like', "%{$search}%")
                  ->orWhere('teras_berita', 'like', "%{$search}%")
                  ->orWhere('kategori', 'like', "%{$search}%");
            });
        }

        // Filter by status (published/draft)
        if ($request->filled('status')) {
            $status = $request->input('status');
            if ($status === 'published') {
                $query->where('is_published', true);
            } elseif ($status === 'draft') {
                $query->where('is_published', false);
            }
        }


        // Filter by category
        if ($request->filled('kategori')) {
            $query->where('kategori', $request->input('kategori'));
        }

        // Filter by featured
        if ($request->filled('featured')) {
            $query->where('is_featured', $request->input('featured') === 'true');
        }

        // Sorting
        $sortColumn = $request->input('sort', 'created_at');
        $sortDirection = $request->input('direction', 'desc');
        $allowedSortColumns = ['judul_utama', 'kategori', 'view_count', 'created_at', 'tanggal_rilis', 'is_published'];
        
        if (in_array($sortColumn, $allowedSortColumns)) {
            $query->orderBy($sortColumn, $sortDirection === 'asc' ? 'asc' : 'desc');
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $perPage = $request->input('per_page', 10);
        $berita = $query->paginate($perPage)->withQueryString();

        // Get unique categories for filter dropdown
        $categories = Berita::distinct()->pluck('kategori')->filter()->values();

        return Inertia::render('Admin/Berita/Index', [
            'berita' => $berita,
            'filters' => [
                'search' => $request->input('search', ''),
                'status' => $request->input('status', ''),
                'kategori' => $request->input('kategori', ''),
                'featured' => $request->input('featured', ''),
                'sort' => $sortColumn,
                'direction' => $sortDirection,
            ],
            'categories' => $categories,
        ]);
    }

    /**
     * Show the form for creating a new news article.
     * 
     * @see Requirements 1.2
     */
    public function create(): Response
    {
        $categories = Berita::distinct()->pluck('kategori')->filter()->values();
        
        return Inertia::render('Admin/Berita/Create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created news article.
     * Auto-generates slug from title and sanitizes HTML content.
     * 
     * @see Requirements 1.2, 1.4
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'judul_utama' => 'required|string|max:255',
            'teras_berita' => 'nullable|string',
            'hero_image' => 'nullable|string|max:500',
            'hero_image_alt' => 'nullable|string|max:255',
            'kategori' => 'nullable|string|max:100',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
            'author' => 'nullable|string|max:255',
            'sumber_rilis' => 'nullable|string|max:255',
            'lokasi' => 'nullable|string|max:255',
            'tanggal_rilis' => 'nullable|date',
            'biro' => 'nullable|string|max:255',
        ]);

        // Generate unique slug
        $validated['slug'] = SlugGenerator::generateUnique(
            $validated['judul_utama'],
            Berita::class
        );

        // Sanitize HTML content fields
        $htmlFields = ['teras_berita'];
        foreach ($htmlFields as $field) {
            if (!empty($validated[$field])) {
                $validated[$field] = $this->htmlSanitizer->sanitize($validated[$field]);
            }
        }

        // Set defaults
        $validated['is_published'] = $validated['is_published'] ?? false;
        $validated['is_featured'] = $validated['is_featured'] ?? false;
        $validated['view_count'] = 0;

        $berita = Berita::create($validated);

        // Log activity
        $this->activityLogger->logCreated($berita);

        // Clear berita cache to ensure public pages show updated content
        $this->clearBeritaCache();

        return redirect()->route('admin.berita.index')
            ->with('success', 'Berita berhasil ditambahkan');
    }

    /**
     * Clear all berita-related cache keys.
     * Called after create, update, and delete operations.
     * 
     * @see Requirements 2.5, 13.1, 13.2, 13.3
     */
    protected function clearBeritaCache(): void
    {
        // Clear featured and popular news cache
        Cache::forget('featured_news');
        Cache::forget('popular_news');
        
        // Clear index cache patterns (we can't clear all patterns, but clear common ones)
        // The cache will naturally expire for other patterns
        Cache::forget('berita_index___1');
        Cache::forget('berita_index___2');
        Cache::forget('berita_index___3');
    }


    /**
     * Display the specified news article.
     */
    public function show(Berita $beritum): Response
    {
        $beritum->load('galeriFotoBerita');
        
        return Inertia::render('Admin/Berita/Show', [
            'berita' => $beritum,
        ]);
    }

    /**
     * Show the form for editing the specified news article.
     * Loads existing data including gallery images.
     * 
     * @see Requirements 1.7
     */
    public function edit(Berita $beritum): Response
    {
        $beritum->load('galeriFotoBerita');
        $categories = Berita::distinct()->pluck('kategori')->filter()->values();
        
        return Inertia::render('Admin/Berita/Edit', [
            'berita' => $beritum,
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified news article.
     * Logs changes for audit trail.
     * 
     * @see Requirements 1.7
     */
    public function update(Request $request, Berita $beritum): RedirectResponse
    {
        $validated = $request->validate([
            'judul_utama' => 'required|string|max:255',
            'teras_berita' => 'nullable|string',
            'hero_image' => 'nullable|string|max:500',
            'hero_image_alt' => 'nullable|string|max:255',
            'kategori' => 'nullable|string|max:100',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
            'author' => 'nullable|string|max:255',
            'sumber_rilis' => 'nullable|string|max:255',
            'lokasi' => 'nullable|string|max:255',
            'tanggal_rilis' => 'nullable|date',
            'biro' => 'nullable|string|max:255',
        ]);

        // Store old values for activity logging
        $oldValues = $beritum->getAttributes();

        // Regenerate slug if title changed
        if ($validated['judul_utama'] !== $beritum->judul_utama) {
            $validated['slug'] = SlugGenerator::generateUnique(
                $validated['judul_utama'],
                Berita::class,
                $beritum->id
            );
        }

        // Sanitize HTML content fields
        $htmlFields = ['teras_berita'];
        foreach ($htmlFields as $field) {
            if (!empty($validated[$field])) {
                $validated[$field] = $this->htmlSanitizer->sanitize($validated[$field]);
            }
        }

        $beritum->update($validated);

        // Log activity with changes
        $this->activityLogger->logUpdated($beritum, $oldValues);

        // Clear berita cache including specific article cache
        $this->clearBeritaCache();
        Cache::forget("berita_show_{$beritum->slug}");
        Cache::forget("berita_related_{$beritum->id}");

        return redirect()->route('admin.berita.index')
            ->with('success', 'Berita berhasil diperbarui');
    }

    /**
     * Soft delete the specified news article.
     */
    public function destroy(Berita $beritum): RedirectResponse
    {
        // Store slug before deletion for cache clearing
        $slug = $beritum->slug;
        $id = $beritum->id;
        
        // Log activity before deletion
        $this->activityLogger->logDeleted($beritum);
        
        $beritum->delete();

        // Clear berita cache including specific article cache
        $this->clearBeritaCache();
        Cache::forget("berita_show_{$slug}");
        Cache::forget("berita_related_{$id}");

        return redirect()->route('admin.berita.index')
            ->with('success', 'Berita berhasil dihapus');
    }

    /**
     * Perform bulk actions on multiple news articles.
     * Supports publish, unpublish, and delete operations.
     * 
     * @see Requirements 1.6
     */
    public function bulkAction(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'action' => 'required|in:publish,unpublish,delete',
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:berita,id',
        ]);

        $ids = $validated['ids'];
        $action = $validated['action'];
        $count = count($ids);

        switch ($action) {
            case 'publish':
                Berita::whereIn('id', $ids)->update(['is_published' => true]);
                $message = "{$count} berita berhasil dipublish";
                break;
                
            case 'unpublish':
                Berita::whereIn('id', $ids)->update(['is_published' => false]);
                $message = "{$count} berita berhasil di-unpublish";
                break;
                
            case 'delete':
                // Log each deletion and collect slugs for cache clearing
                $beritaItems = Berita::whereIn('id', $ids)->get();
                foreach ($beritaItems as $berita) {
                    $this->activityLogger->logDeleted($berita);
                    Cache::forget("berita_show_{$berita->slug}");
                    Cache::forget("berita_related_{$berita->id}");
                }
                Berita::whereIn('id', $ids)->delete();
                $message = "{$count} berita berhasil dihapus";
                break;
                
            default:
                $message = 'Aksi tidak valid';
        }

        // Clear berita cache after any bulk action
        $this->clearBeritaCache();

        return redirect()->route('admin.berita.index')
            ->with('success', $message);
    }
}
