<?php

namespace App\Http\Controllers;

use App\Models\Gallery;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

/**
 * Public GaleriController handles gallery display for visitors.
 * 
 * Filters and displays only active gallery items, prioritizing
 * featured items and respecting sort order.
 * 
 * @see Requirements 10.1, 10.2, 10.3, 10.4, 10.5
 */
class GaleriController extends Controller
{
    /**
     * Display the public gallery page.
     * 
     * Shows only active galleries, with featured items prioritized,
     * then sorted by sort_order and creation date.
     * 
     * @see Requirements 10.1 - Only is_active=true items displayed
     * @see Requirements 10.4 - Featured items prioritized
     * @see Requirements 10.5 - Sort order respected
     */
    public function index()
    {
        // Cache galleries for 30 minutes
        $galleries = Cache::remember('gallery_public_index', 1800, function () {
            return Gallery::where('is_active', true)
                ->orderBy('is_featured', 'desc')  // Featured items first (Req 10.4)
                ->orderBy('sort_order', 'asc')    // Then by sort order (Req 10.5)
                ->orderBy('created_at', 'desc')   // Then by newest
                ->get();
        });
        
        $categories = Cache::remember('gallery_categories', 1800, function () {
            return Gallery::where('is_active', true)
                ->distinct()
                ->pluck('category')
                ->filter()
                ->values();
        });

        // Get featured galleries separately for hero/highlight section
        $featuredGalleries = Cache::remember('gallery_featured', 1800, function () {
            return Gallery::where('is_active', true)
                ->where('is_featured', true)
                ->orderBy('sort_order', 'asc')
                ->orderBy('created_at', 'desc')
                ->get();
        });

        return Inertia::render('Public/Galeri', [
            'galleries' => $galleries,
            'categories' => $categories,
            'featuredGalleries' => $featuredGalleries,
        ]);
    }
}
