<?php

namespace App\Http\Controllers;

use App\Services\NewsService;
use App\Services\ServiceService;
use App\Services\VisitorService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index(
        ServiceService $serviceService,
        VisitorService $visitorService
    ) {
        // Track visitor
        $visitorService->trackVisitor();
        
        // Get data
        // Use Berita (admin-managed) for homepage featured list
        $featuredNews = \App\Models\Berita::getFeatured(6)->map(function ($item) {
            return [
                'id' => $item->id,
                'title' => $item->judul_utama,
                'slug' => $item->slug,
                'excerpt' => $item->ringkasan_inti,
                'featured_image' => $item->hero_image ? asset($item->hero_image) : null,
                'published_at' => $item->tanggal_rilis ? $item->tanggal_rilis->format('Y-m-d') : ($item->created_at?->format('Y-m-d')),
                'view_count' => $item->view_count ?? 0,
            ];
        });

        $services = $serviceService->getAllActive();
        $visitorStats = $visitorService->getStatistics();

        return Inertia::render('Public/Homepage', [
            'featuredNews' => $featuredNews,
            'services' => $services,
            'visitorStats' => $visitorStats,
        ]);
    }
}
