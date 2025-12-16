<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\AdminUser;
use App\Models\Berita;
use App\Models\Gallery;
use App\Models\Media;
use App\Models\Menu;
use App\Models\Pengumuman;
use App\Models\PpidDocument;
use App\Models\ProfileContent;
use App\Models\Ssd;
use App\Models\StandarPelayanan;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $statistics = $this->getStatistics();
        $recentActivities = $this->getRecentActivities();
        $popularContent = $this->getPopularContent();
        $viewsOverTime = $this->getViewsOverTime();

        return inertia('Admin/Dashboard', [
            'statistics' => $statistics,
            'recentActivities' => $recentActivities,
            'popularContent' => $popularContent,
            'viewsOverTime' => $viewsOverTime,
        ]);
    }

    /**
     * Safely count records from a model with error handling.
     * Returns 0 if the table doesn't exist or query fails.
     * 
     * @param string $modelClass
     * @param array $conditions
     * @return int
     */
    private function safeCount(string $modelClass, array $conditions = []): int
    {
        try {
            $query = $modelClass::query();
            foreach ($conditions as $column => $value) {
                if ($value === 'like') {
                    continue;
                }
                $query->where($column, $value);
            }
            return $query->count();
        } catch (\Exception $e) {
            Log::warning("Failed to count {$modelClass}: " . $e->getMessage());
            return 0;
        }
    }

    /**
     * Safely sum a column from a model with error handling.
     * Returns 0 if the table doesn't exist or query fails.
     * 
     * @param string $modelClass
     * @param string $column
     * @return int
     */
    private function safeSum(string $modelClass, string $column): int
    {
        try {
            return (int) $modelClass::sum($column);
        } catch (\Exception $e) {
            Log::warning("Failed to sum {$column} from {$modelClass}: " . $e->getMessage());
            return 0;
        }
    }

    /**
     * Get comprehensive statistics for all entities.
     * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 8.1, 8.2, 8.3, 8.4
     */
    private function getStatistics(): array
    {
        return [
            // Berita statistics - Requirements: 8.1, 8.2
            'total_berita' => $this->safeCount(Berita::class),
            'published_berita' => $this->safeCount(Berita::class, ['is_published' => true]),
            'draft_berita' => $this->safeCount(Berita::class, ['is_published' => false]),
            'total_berita_views' => $this->safeSum(Berita::class, 'view_count'),
            
            // Gallery statistics - Requirements: 8.3
            'total_gallery' => $this->safeCount(Gallery::class),
            'active_gallery' => $this->safeCount(Gallery::class, ['is_active' => true]),
            'featured_gallery' => $this->safeCount(Gallery::class, ['is_featured' => true]),
            
            // PPID Document statistics - Requirements: 8.4
            'total_ppid_documents' => $this->safeCount(PpidDocument::class),
            'active_ppid_documents' => $this->safeCount(PpidDocument::class, ['is_active' => true]),
            'total_ppid_downloads' => $this->safeSum(PpidDocument::class, 'download_count'),
            
            // SSD (FAQ) statistics - Requirements: 7.1
            'total_ssd' => $this->safeCount(Ssd::class),
            'active_ssd' => $this->safeCount(Ssd::class, ['is_active' => true]),
            
            // Standar Pelayanan statistics - Requirements: 7.2
            'total_standar_pelayanan' => $this->safeCount(StandarPelayanan::class),
            'active_standar_pelayanan' => $this->safeCount(StandarPelayanan::class, ['is_active' => true]),
            'total_standar_downloads' => $this->safeSum(StandarPelayanan::class, 'download_count'),
            
            // Profile Content statistics - Requirements: 7.3
            'total_profile_content' => $this->safeCount(ProfileContent::class),
            'active_profile_content' => $this->safeCount(ProfileContent::class, ['is_active' => true]),
            
            // Menu statistics - Requirements: 7.4
            'total_menus' => $this->safeCount(Menu::class),
            'visible_menus' => $this->safeCount(Menu::class, ['is_visible' => true]),
            
            // Media statistics - Requirements: 7.5
            'total_media' => $this->safeCount(Media::class),
            'total_images' => $this->safeCountWithLike(Media::class, 'mime_type', 'image/%'),
            'total_documents' => $this->safeCountDocuments(),
            
            // Admin User statistics - Requirements: 7.6
            'total_admin_users' => $this->safeCount(AdminUser::class),
            'active_admin_users' => $this->safeCount(AdminUser::class, ['is_active' => true]),
            
            // Pengumuman statistics
            'total_pengumuman' => $this->safeCount(Pengumuman::class),
            'active_pengumuman' => $this->safeCountWithCondition(Pengumuman::class, 'status', 'active'),
        ];
    }

    /**
     * Safely count records with LIKE condition.
     * 
     * @param string $modelClass
     * @param string $column
     * @param string $pattern
     * @return int
     */
    private function safeCountWithLike(string $modelClass, string $column, string $pattern): int
    {
        try {
            return $modelClass::where($column, 'like', $pattern)->count();
        } catch (\Exception $e) {
            Log::warning("Failed to count {$modelClass} with LIKE: " . $e->getMessage());
            return 0;
        }
    }

    /**
     * Safely count records with a specific condition.
     * 
     * @param string $modelClass
     * @param string $column
     * @param mixed $value
     * @return int
     */
    private function safeCountWithCondition(string $modelClass, string $column, $value): int
    {
        try {
            return $modelClass::where($column, $value)->count();
        } catch (\Exception $e) {
            Log::warning("Failed to count {$modelClass} with condition: " . $e->getMessage());
            return 0;
        }
    }

    /**
     * Safely count document media files.
     * 
     * @return int
     */
    private function safeCountDocuments(): int
    {
        try {
            return Media::whereIn('mime_type', [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            ])->count();
        } catch (\Exception $e) {
            Log::warning("Failed to count documents: " . $e->getMessage());
            return 0;
        }
    }

    /**
     * Get recent activities summary.
     * Requirements: 8.5
     */
    private function getRecentActivities(): array
    {
        try {
            return ActivityLog::with('user')
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get()
                ->map(function ($log) {
                    return [
                        'id' => $log->id,
                        'action' => $log->action,
                        'loggable_type' => class_basename($log->loggable_type ?? ''),
                        'loggable_id' => $log->loggable_id,
                        'user_name' => $log->user?->name ?? 'System',
                        'created_at' => $log->created_at?->format('Y-m-d H:i:s') ?? '',
                        'time_ago' => $log->created_at?->diffForHumans() ?? '',
                    ];
                })
                ->toArray();
        } catch (\Exception $e) {
            Log::warning("Failed to get recent activities: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Get popular content metrics.
     * Requirements: 8.2, 8.4
     */
    private function getPopularContent(): array
    {
        $popularBerita = [];
        $popularPpid = [];
        $popularStandar = [];

        // Get top 5 most viewed berita
        // Requirements: 4.1 (sorting by view_count descending)
        try {
            $popularBerita = Berita::where('is_published', true)
                ->orderBy('view_count', 'desc')
                ->limit(5)
                ->get(['id', 'judul_utama', 'view_count', 'created_at'])
                ->map(function ($berita) {
                    return [
                        'id' => $berita->id,
                        'title' => $berita->judul_utama ?? 'Untitled',
                        'views' => $berita->view_count ?? 0,
                        'type' => 'berita',
                        // Format date in Indonesian format: "15 Des 2025"
                        'created_at' => $berita->created_at?->translatedFormat('d M Y') ?? '',
                    ];
                })
                ->toArray();
        } catch (\Exception $e) {
            Log::warning("Failed to get popular berita: " . $e->getMessage());
        }

        // Get top 5 most downloaded PPID documents
        // Requirements: 5.1 (sorting by download_count descending), 5.4 (Indonesian date format)
        try {
            $popularPpid = PpidDocument::where('is_active', true)
                ->orderBy('download_count', 'desc')
                ->limit(5)
                ->get(['id', 'title', 'download_count', 'created_at'])
                ->map(function ($doc) {
                    return [
                        'id' => $doc->id,
                        'title' => $doc->title ?? 'Untitled',
                        'downloads' => $doc->download_count ?? 0,
                        'type' => 'ppid',
                        // Format date in Indonesian format: "15 Des 2025" - Requirements: 5.4
                        'created_at' => $doc->created_at?->translatedFormat('d M Y') ?? '',
                    ];
                })
                ->toArray();
        } catch (\Exception $e) {
            Log::warning("Failed to get popular PPID documents: " . $e->getMessage());
        }

        // Get top 5 most downloaded Standar Pelayanan
        // Requirements: 6.1 (sorting by download_count descending)
        try {
            $popularStandar = StandarPelayanan::where('is_active', true)
                ->orderBy('download_count', 'desc')
                ->limit(5)
                ->get(['id', 'title', 'download_count', 'created_at'])
                ->map(function ($doc) {
                    return [
                        'id' => $doc->id,
                        'title' => $doc->title ?? 'Untitled',
                        'downloads' => $doc->download_count ?? 0,
                        'type' => 'standar_pelayanan',
                        // Format date in Indonesian format: "15 Des 2025"
                        'created_at' => $doc->created_at?->translatedFormat('d M Y') ?? '',
                    ];
                })
                ->toArray();
        } catch (\Exception $e) {
            Log::warning("Failed to get popular Standar Pelayanan: " . $e->getMessage());
        }

        return [
            'berita' => $popularBerita,
            'ppid' => $popularPpid,
            'standar_pelayanan' => $popularStandar,
        ];
    }

    /**
     * Get views over time for charts.
     * Requirements: 8.5
     */
    private function getViewsOverTime(): array
    {
        $startDate = Carbon::now()->subDays(30);
        $endDate = Carbon::now();
        
        $beritaPerDay = [];
        $activitiesPerDay = [];

        // Get berita created per day for the last 30 days
        try {
            $beritaPerDay = Berita::selectRaw('DATE(created_at) as date, COUNT(*) as count')
                ->where('created_at', '>=', $startDate)
                ->groupBy('date')
                ->orderBy('date')
                ->get()
                ->pluck('count', 'date')
                ->toArray();
        } catch (\Exception $e) {
            Log::warning("Failed to get berita per day: " . $e->getMessage());
        }

        // Get activity logs per day for the last 30 days
        try {
            $activitiesPerDay = ActivityLog::selectRaw('DATE(created_at) as date, COUNT(*) as count')
                ->where('created_at', '>=', $startDate)
                ->groupBy('date')
                ->orderBy('date')
                ->get()
                ->pluck('count', 'date')
                ->toArray();
        } catch (\Exception $e) {
            Log::warning("Failed to get activities per day: " . $e->getMessage());
        }

        // Fill in missing dates with 0
        $dates = [];
        $beritaData = [];
        $activityData = [];
        
        for ($date = $startDate->copy(); $date <= $endDate; $date->addDay()) {
            $dateStr = $date->format('Y-m-d');
            $dates[] = $date->format('M d');
            $beritaData[] = $beritaPerDay[$dateStr] ?? 0;
            $activityData[] = $activitiesPerDay[$dateStr] ?? 0;
        }

        return [
            'labels' => $dates,
            'berita' => $beritaData,
            'activities' => $activityData,
        ];
    }
}
