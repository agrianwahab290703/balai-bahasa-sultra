<?php

namespace App\Http\Controllers;

use App\Models\Ssd;
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

        $ssds = Ssd::active()
            ->ordered()
            ->search($search)
            ->byCategory($category)
            ->get();

        $categories = Ssd::getCategories();

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
