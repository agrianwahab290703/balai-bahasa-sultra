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
        NewsService $newsService,
        ServiceService $serviceService,
        VisitorService $visitorService
    ) {
        // Track visitor
        $visitorService->trackVisitor();
        
        // Get data
        $featuredNews = $newsService->getFeatured(6);
        $services = $serviceService->getAllActive();
        $visitorStats = $visitorService->getStatistics();

        return Inertia::render('Public/Homepage', [
            'featuredNews' => $featuredNews,
            'services' => $services,
            'visitorStats' => $visitorStats,
        ]);
    }
}
