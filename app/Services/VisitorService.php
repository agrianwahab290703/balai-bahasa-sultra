<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Request;

class VisitorService
{
    /**
     * Track visitor berdasarkan IP address
     * Hanya menghitung sekali per IP dalam 24 jam
     */
    public function trackVisitor(): void
    {
        $ip = Request::ip();
        $cacheKey = 'visitor_' . md5($ip);
        
        // Cek apakah IP sudah tercatat dalam 24 jam terakhir
        if (!Cache::has($cacheKey)) {
            // Tandai IP ini sudah berkunjung (expire 24 jam)
            Cache::put($cacheKey, true, now()->addHours(24));
            
            // Increment total visitor
            $total = Cache::get('visitor_total', 0);
            Cache::forever('visitor_total', $total + 1);
            
            // Increment visitor hari ini
            $todayKey = 'visitor_today_' . now()->format('Y-m-d');
            $today = Cache::get($todayKey, 0);
            Cache::put($todayKey, $today + 1, now()->endOfDay());
            
            // Increment visitor bulan ini
            $monthKey = 'visitor_month_' . now()->format('Y-m');
            $month = Cache::get($monthKey, 0);
            Cache::put($monthKey, $month + 1, now()->endOfMonth());
        }
    }

    /**
     * Get visitor statistics
     */
    public function getStatistics(): array
    {
        return [
            'total' => Cache::get('visitor_total', 0),
            'today' => Cache::get('visitor_today_' . now()->format('Y-m-d'), 0),
            'thisMonth' => Cache::get('visitor_month_' . now()->format('Y-m'), 0),
        ];
    }
}
