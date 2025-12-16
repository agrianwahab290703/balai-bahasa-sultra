<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\AdminUser;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controller for viewing Activity Logs.
 * Provides index with filters and detail view with old/new values.
 * 
 * @see Requirements 10.2, 10.3
 */
class ActivityLogController extends Controller
{
    /**
     * Display a paginated list of activity logs.
     * Supports filtering by user, action type, and date range.
     * 
     * @see Requirements 10.2
     */
    public function index(Request $request): Response
    {
        $query = ActivityLog::with('user');

        // Filter by user
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->input('user_id'));
        }

        // Filter by action type
        if ($request->filled('action')) {
            $query->where('action', $request->input('action'));
        }

        // Filter by loggable type (entity type)
        if ($request->filled('entity_type')) {
            $query->where('loggable_type', $request->input('entity_type'));
        }

        // Filter by date range
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->input('date_from'));
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->input('date_to'));
        }

        // Search in loggable type or values
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('loggable_type', 'like', "%{$search}%")
                  ->orWhere('old_values', 'like', "%{$search}%")
                  ->orWhere('new_values', 'like', "%{$search}%");
            });
        }

        // Sorting - default to newest first
        $sortColumn = $request->input('sort', 'created_at');
        $sortDirection = $request->input('direction', 'desc');
        $allowedSortColumns = ['created_at', 'action', 'loggable_type'];
        
        if (in_array($sortColumn, $allowedSortColumns)) {
            $query->orderBy($sortColumn, $sortDirection === 'asc' ? 'asc' : 'desc');
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $perPage = $request->input('per_page', 20);
        $logs = $query->paginate($perPage)->withQueryString();

        // Transform logs to include readable entity names
        $logs->getCollection()->transform(function ($log) {
            $log->entity_name = $this->getEntityName($log->loggable_type);
            $log->entity_label = $this->getEntityLabel($log);
            return $log;
        });

        // Get users for filter dropdown
        $users = AdminUser::select('id', 'name', 'email')
            ->orderBy('name')
            ->get();

        // Get unique entity types for filter
        $entityTypes = ActivityLog::select('loggable_type')
            ->distinct()
            ->pluck('loggable_type')
            ->map(function ($type) {
                return [
                    'value' => $type,
                    'label' => $this->getEntityName($type),
                ];
            });

        // Get statistics
        $statistics = [
            'total' => ActivityLog::count(),
            'today' => ActivityLog::whereDate('created_at', today())->count(),
            'this_week' => ActivityLog::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count(),
            'created' => ActivityLog::where('action', 'created')->count(),
            'updated' => ActivityLog::where('action', 'updated')->count(),
            'deleted' => ActivityLog::where('action', 'deleted')->count(),
        ];

        return Inertia::render('Admin/ActivityLog/Index', [
            'logs' => $logs,
            'filters' => [
                'search' => $request->input('search', ''),
                'user_id' => $request->input('user_id', ''),
                'action' => $request->input('action', ''),
                'entity_type' => $request->input('entity_type', ''),
                'date_from' => $request->input('date_from', ''),
                'date_to' => $request->input('date_to', ''),
                'sort' => $sortColumn,
                'direction' => $sortDirection,
            ],
            'users' => $users,
            'entityTypes' => $entityTypes,
            'actions' => ActivityLog::validActions(),
            'statistics' => $statistics,
        ]);
    }

    /**
     * Display the specified activity log detail.
     * Shows old/new values with change diff.
     * 
     * @see Requirements 10.3
     */
    public function show(ActivityLog $activityLog): Response
    {
        $activityLog->load('user');
        
        // Add readable entity name
        $activityLog->entity_name = $this->getEntityName($activityLog->loggable_type);
        $activityLog->entity_label = $this->getEntityLabel($activityLog);

        // Try to load the related entity if it still exists
        $relatedEntity = null;
        if ($activityLog->loggable_type && $activityLog->loggable_id) {
            try {
                $modelClass = $activityLog->loggable_type;
                if (class_exists($modelClass)) {
                    $relatedEntity = $modelClass::withTrashed()->find($activityLog->loggable_id);
                }
            } catch (\Exception $e) {
                // Entity might not exist or model doesn't support soft deletes
                $relatedEntity = null;
            }
        }

        // Calculate changes for display
        $changes = $this->calculateChanges($activityLog->old_values, $activityLog->new_values);

        return Inertia::render('Admin/ActivityLog/Show', [
            'log' => $activityLog,
            'relatedEntity' => $relatedEntity,
            'changes' => $changes,
        ]);
    }

    /**
     * Get a human-readable entity name from the model class.
     */
    protected function getEntityName(string $modelClass): string
    {
        $entityNames = [
            'App\\Models\\Berita' => 'Berita',
            'App\\Models\\Gallery' => 'Galeri',
            'App\\Models\\PpidDocument' => 'Dokumen PPID',
            'App\\Models\\Ssd' => 'SSD (FAQ)',
            'App\\Models\\StandarPelayanan' => 'Standar Pelayanan',
            'App\\Models\\ProfileContent' => 'Konten Profil',
            'App\\Models\\Menu' => 'Menu',
            'App\\Models\\Media' => 'Media',
            'App\\Models\\AdminUser' => 'Pengguna Admin',
            'App\\Models\\Pengumuman' => 'Pengumuman',
        ];

        return $entityNames[$modelClass] ?? class_basename($modelClass);
    }

    /**
     * Get a label for the entity (e.g., title or name).
     */
    protected function getEntityLabel(ActivityLog $log): string
    {
        // Try to get a meaningful label from old or new values
        $values = $log->new_values ?? $log->old_values ?? [];
        
        // Common label fields in order of preference
        $labelFields = ['title', 'judul', 'name', 'nama', 'label', 'question', 'pertanyaan'];
        
        foreach ($labelFields as $field) {
            if (!empty($values[$field])) {
                return $values[$field];
            }
        }

        return "ID: {$log->loggable_id}";
    }

    /**
     * Calculate the changes between old and new values.
     */
    protected function calculateChanges(?array $oldValues, ?array $newValues): array
    {
        $changes = [];
        $oldValues = $oldValues ?? [];
        $newValues = $newValues ?? [];

        // Get all keys from both arrays
        $allKeys = array_unique(array_merge(array_keys($oldValues), array_keys($newValues)));

        foreach ($allKeys as $key) {
            $oldValue = $oldValues[$key] ?? null;
            $newValue = $newValues[$key] ?? null;

            // Skip if values are the same
            if ($oldValue === $newValue) {
                continue;
            }

            $changes[] = [
                'field' => $key,
                'old_value' => $oldValue,
                'new_value' => $newValue,
                'type' => $this->getChangeType($oldValue, $newValue),
            ];
        }

        return $changes;
    }

    /**
     * Determine the type of change (added, removed, modified).
     */
    protected function getChangeType($oldValue, $newValue): string
    {
        if ($oldValue === null && $newValue !== null) {
            return 'added';
        }
        if ($oldValue !== null && $newValue === null) {
            return 'removed';
        }
        return 'modified';
    }
}
