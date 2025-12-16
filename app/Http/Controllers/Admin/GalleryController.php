<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use App\Services\ActivityLoggerService;
use App\Services\MediaService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controller for managing Gallery in the admin panel.
 * Provides full CRUD operations with grid view, image processing,
 * drag-drop reordering, and featured item management.
 * 
 * @see Requirements 2.1, 2.2, 2.4, 2.5
 */
class GalleryController extends Controller
{
    protected ActivityLoggerService $activityLogger;
    protected MediaService $mediaService;

    public function __construct(ActivityLoggerService $activityLogger, MediaService $mediaService)
    {
        $this->activityLogger = $activityLogger;
        $this->mediaService = $mediaService;
    }

    /**
     * Display a grid view of all gallery images.
     * Supports search, filtering by category, and sorting.
     * 
     * @see Requirements 2.1
     */
    public function index(Request $request): Response
    {
        $query = Gallery::query();

        // Search by title or description
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filter by category
        if ($request->filled('category')) {
            $query->where('category', $request->input('category'));
        }

        // Filter by featured status
        if ($request->filled('featured')) {
            $query->where('is_featured', $request->input('featured') === 'true');
        }

        // Filter by active status
        if ($request->filled('status')) {
            $status = $request->input('status');
            $query->where('is_active', $status === 'active');
        }

        // Sorting - default by sort_order
        $sortColumn = $request->input('sort', 'sort_order');
        $sortDirection = $request->input('direction', 'asc');
        $allowedSortColumns = ['title', 'category', 'sort_order', 'created_at', 'is_featured'];
        
        if (in_array($sortColumn, $allowedSortColumns)) {
            $query->orderBy($sortColumn, $sortDirection === 'asc' ? 'asc' : 'desc');
        } else {
            $query->orderBy('sort_order', 'asc');
        }

        $perPage = $request->input('per_page', 12);
        $galleries = $query->paginate($perPage)->withQueryString();

        // Get unique categories for filter dropdown
        $categories = Gallery::categories();
        $featuredCount = Gallery::featuredCount();

        return Inertia::render('Admin/Gallery/Index', [
            'galleries' => $galleries,
            'filters' => [
                'search' => $request->input('search', ''),
                'category' => $request->input('category', ''),
                'featured' => $request->input('featured', ''),
                'status' => $request->input('status', ''),
                'sort' => $sortColumn,
                'direction' => $sortDirection,
            ],
            'categories' => $categories,
            'featuredCount' => $featuredCount,
            'maxFeatured' => Gallery::MAX_FEATURED_ITEMS,
        ]);
    }

    /**
     * Show the form for creating a new gallery item.
     * 
     * @see Requirements 2.2
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Gallery/Create', [
            'categories' => Gallery::categories(),
            'canFeatureMore' => Gallery::canFeatureMore(),
            'featuredCount' => Gallery::featuredCount(),
            'maxFeatured' => Gallery::MAX_FEATURED_ITEMS,
        ]);
    }

    /**
     * Store a newly created gallery item.
     * Processes image and generates thumbnail.
     * 
     * @see Requirements 2.2
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'image' => 'required|string|max:500',
            'category' => 'nullable|string|max:100',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
        ]);

        // Check featured limit
        if (($validated['is_featured'] ?? false) && !Gallery::canFeatureMore()) {
            return back()->withErrors([
                'is_featured' => 'Maksimal ' . Gallery::MAX_FEATURED_ITEMS . ' item dapat ditandai sebagai featured.',
            ])->withInput();
        }

        // Set defaults
        $validated['is_featured'] = $validated['is_featured'] ?? false;
        $validated['is_active'] = $validated['is_active'] ?? true;
        
        // Set sort_order to be last
        $validated['sort_order'] = Gallery::max('sort_order') + 1;

        $gallery = Gallery::create($validated);

        // Log activity
        $this->activityLogger->logCreated($gallery);

        // Clear gallery cache to ensure public pages show updated content
        $this->clearGalleryCache();

        return redirect()->route('admin.gallery.index')
            ->with('success', 'Gambar berhasil ditambahkan ke galeri');
    }

    /**
     * Clear all gallery-related cache keys.
     * Called after create, update, and delete operations.
     * 
     * @see Requirements 3.3, 13.1, 13.2, 13.3
     */
    protected function clearGalleryCache(): void
    {
        Cache::forget('gallery_public_index');
        Cache::forget('gallery_categories');
    }

    /**
     * Display the specified gallery item.
     */
    public function show(Gallery $gallery): Response
    {
        return Inertia::render('Admin/Gallery/Show', [
            'gallery' => $gallery,
        ]);
    }

    /**
     * Show the form for editing the specified gallery item.
     */
    public function edit(Gallery $gallery): Response
    {
        return Inertia::render('Admin/Gallery/Edit', [
            'gallery' => $gallery,
            'categories' => Gallery::categories(),
            'canFeatureMore' => Gallery::canFeatureMore() || $gallery->is_featured,
            'featuredCount' => Gallery::featuredCount(),
            'maxFeatured' => Gallery::MAX_FEATURED_ITEMS,
        ]);
    }

    /**
     * Update the specified gallery item.
     * 
     * @see Requirements 2.2, 2.5
     */
    public function update(Request $request, Gallery $gallery): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'image' => 'required|string|max:500',
            'category' => 'nullable|string|max:100',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
        ]);

        // Check featured limit (only if changing from non-featured to featured)
        $wantsFeatured = $validated['is_featured'] ?? false;
        if ($wantsFeatured && !$gallery->is_featured && !Gallery::canFeatureMore()) {
            return back()->withErrors([
                'is_featured' => 'Maksimal ' . Gallery::MAX_FEATURED_ITEMS . ' item dapat ditandai sebagai featured.',
            ])->withInput();
        }

        // Store old values for activity logging
        $oldValues = $gallery->getAttributes();

        $gallery->update($validated);

        // Log activity with changes
        $this->activityLogger->logUpdated($gallery, $oldValues);

        // Clear gallery cache
        $this->clearGalleryCache();

        return redirect()->route('admin.gallery.index')
            ->with('success', 'Galeri berhasil diperbarui');
    }

    /**
     * Remove the specified gallery item.
     */
    public function destroy(Gallery $gallery): RedirectResponse
    {
        // Log activity before deletion
        $this->activityLogger->logDeleted($gallery);
        
        $gallery->delete();

        // Clear gallery cache
        $this->clearGalleryCache();

        return redirect()->route('admin.gallery.index')
            ->with('success', 'Gambar berhasil dihapus dari galeri');
    }

    /**
     * Reorder gallery items via drag-drop.
     * Updates sort_order for all affected items.
     * 
     * @see Requirements 2.4
     */
    public function reorder(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|integer|exists:galleries,id',
            'items.*.sort_order' => 'required|integer|min:0',
        ]);

        DB::transaction(function () use ($validated) {
            foreach ($validated['items'] as $item) {
                Gallery::where('id', $item['id'])
                    ->update(['sort_order' => $item['sort_order']]);
            }
        });

        // Clear gallery cache
        $this->clearGalleryCache();

        return back()->with('success', 'Urutan galeri berhasil diperbarui');
    }

    /**
     * Toggle featured status for a gallery item.
     * Enforces maximum featured items limit.
     * 
     * @see Requirements 2.5
     */
    public function toggleFeatured(Gallery $gallery): RedirectResponse
    {
        // If trying to feature and already at limit
        if (!$gallery->is_featured && !Gallery::canFeatureMore()) {
            return back()->withErrors([
                'is_featured' => 'Maksimal ' . Gallery::MAX_FEATURED_ITEMS . ' item dapat ditandai sebagai featured.',
            ]);
        }

        $oldValues = $gallery->getAttributes();
        
        $gallery->is_featured = !$gallery->is_featured;
        $gallery->save();

        $this->activityLogger->logUpdated($gallery, $oldValues);

        // Clear gallery cache
        $this->clearGalleryCache();

        $message = $gallery->is_featured 
            ? 'Gambar ditandai sebagai featured' 
            : 'Gambar dihapus dari featured';

        return back()->with('success', $message);
    }

    /**
     * Toggle active status for a gallery item.
     */
    public function toggleActive(Gallery $gallery): RedirectResponse
    {
        $oldValues = $gallery->getAttributes();
        
        $gallery->is_active = !$gallery->is_active;
        $gallery->save();

        $this->activityLogger->logUpdated($gallery, $oldValues);

        // Clear gallery cache
        $this->clearGalleryCache();

        $message = $gallery->is_active 
            ? 'Gambar diaktifkan' 
            : 'Gambar dinonaktifkan';

        return back()->with('success', $message);
    }

    /**
     * Perform bulk actions on multiple gallery items.
     * Supports delete, feature, unfeature, activate, deactivate.
     */
    public function bulkAction(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'action' => 'required|in:delete,feature,unfeature,activate,deactivate',
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:galleries,id',
        ]);

        $ids = $validated['ids'];
        $action = $validated['action'];
        $count = count($ids);

        switch ($action) {
            case 'feature':
                // Check if we can feature all selected items
                $currentFeatured = Gallery::featuredCount();
                $toFeature = Gallery::whereIn('id', $ids)->where('is_featured', false)->count();
                
                if ($currentFeatured + $toFeature > Gallery::MAX_FEATURED_ITEMS) {
                    return back()->withErrors([
                        'action' => 'Tidak dapat menandai semua item sebagai featured. Maksimal ' . Gallery::MAX_FEATURED_ITEMS . ' item.',
                    ]);
                }
                
                Gallery::whereIn('id', $ids)->update(['is_featured' => true]);
                $message = "{$count} gambar ditandai sebagai featured";
                break;
                
            case 'unfeature':
                Gallery::whereIn('id', $ids)->update(['is_featured' => false]);
                $message = "{$count} gambar dihapus dari featured";
                break;
                
            case 'activate':
                Gallery::whereIn('id', $ids)->update(['is_active' => true]);
                $message = "{$count} gambar diaktifkan";
                break;
                
            case 'deactivate':
                Gallery::whereIn('id', $ids)->update(['is_active' => false]);
                $message = "{$count} gambar dinonaktifkan";
                break;
                
            case 'delete':
                $galleries = Gallery::whereIn('id', $ids)->get();
                foreach ($galleries as $gallery) {
                    $this->activityLogger->logDeleted($gallery);
                }
                Gallery::whereIn('id', $ids)->delete();
                $message = "{$count} gambar berhasil dihapus";
                break;
                
            default:
                $message = 'Aksi tidak valid';
        }

        // Clear gallery cache after any bulk action
        $this->clearGalleryCache();

        return redirect()->route('admin.gallery.index')
            ->with('success', $message);
    }
}
