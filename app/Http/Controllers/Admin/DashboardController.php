<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Berita;
use App\Models\Pengumuman;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $statistics = [
            'total_berita' => Berita::count(),
            'published_berita' => Berita::where('is_published', true)->count(),
            'total_pengumuman' => Pengumuman::count(),
            'active_pengumuman' => Pengumuman::where('status', 'active')->count(),
            'total_foto' => 0, // Will be updated after Gallery model is referenced
            'recent_activities' => $this->getRecentActivities(),
        ];

        return inertia('Admin/Dashboard', compact('statistics'));
    }

    private function getRecentActivities()
    {
        // Implementation will be added in Activity Log task
        return collect([]);
    }
}
