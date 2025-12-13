<?php

namespace App\Http\Controllers;

use App\Models\Gallery;
use Inertia\Inertia;

class GaleriController extends Controller
{
    public function index()
    {
        $galleries = Gallery::orderBy('created_at', 'desc')->get();
        
        $categories = Gallery::distinct()
            ->pluck('category')
            ->filter()
            ->values();

        return Inertia::render('Public/Galeri', [
            'galleries' => $galleries,
            'categories' => $categories,
        ]);
    }
}
