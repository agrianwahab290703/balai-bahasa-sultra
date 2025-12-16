<?php

namespace App\Http\Controllers;

use App\Models\Ssd;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Illuminate\Http\Request;

class SsdController extends Controller
{
    /**
     * Display the SSD (Soal Sering Ditanya / FAQ) page.
     */
    public function index(Request $request)
    {
        $search = $request->get('search');
        $category = $request->get('category');

        // Only cache when no filters are applied
        if (empty($search) && empty($category)) {
            $ssds = Cache::remember('ssd_public_index', 1800, function () {
                return Ssd::active()
                    ->ordered()
                    ->get();
            });
        } else {
            $ssds = Ssd::active()
                ->ordered()
                ->search($search)
                ->byCategory($category)
                ->get();
        }

        $categories = Cache::remember('ssd_categories', 1800, function () {
            return Ssd::getCategories();
        });

        return Inertia::render('Public/Ssd/Index', [
            'ssds' => $ssds,
            'categories' => $categories,
            'filters' => [
                'search' => $search,
                'category' => $category,
            ],
        ]);
    }
}
