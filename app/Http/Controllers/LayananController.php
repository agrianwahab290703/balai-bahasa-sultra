<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Inertia\Inertia;

class LayananController extends Controller
{
    public function index()
    {
        $services = Service::where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('Public/Layanan/Index', [
            'services' => $services,
        ]);
    }

    public function show($slug)
    {
        $service = Service::where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        return Inertia::render('Public/Layanan/Show', [
            'service' => $service,
        ]);
    }
}
