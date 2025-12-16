<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ssd;
use App\Services\ActivityLoggerService;
use App\Services\HtmlSanitizer;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controller for managing SSD (Soal Sering Ditanya/FAQ) in the admin panel.
 * Provides full CRUD operations with category filtering, drag-drop reordering,
 * and active status toggle.
 * 
 * @see Requirements 4.1, 4.3, 4.4, 4.5
 */
class SsdController extends Controller
{
    protected ActivityLoggerService $activityLogger;
    protected HtmlSanitizer $htmlSanitizer;

    /**
     * SSD categories
     */
    public const CATEGORIES = [
        'umum' => 'Umum',
        'ukbi' => 'UKBI',
        'bipa' => 'BIPA',
        'ahli_bahasa' => 'Ahli Bahasa',
        'penerjemah' => 'Penerjemah',
        'perpustakaan' => 'Perpustakaan',
        'layanan' => 'Layanan Lainnya',
    ];

    public function __construct(ActivityLoggerService $activityLogger, HtmlSanitizer $htmlSanitizer)
    {
        $this->activityLogger = $activityLogger;
        $this->htmlSanitizer = $htmlSanitizer;
    }

    /**
     * Display all FAQ items with question preview, category, and status.
     * Supports search, filtering by category, and sorting.
     * 
     * @see Requirements 4.1
     */
    public function index(Request $request): Response
    {
        $query = Ssd::query();

        // Search by question or answer
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('question', 'like', "%{$search}%")
                  ->orWhere('answer', 'like', "%{$search}%");
            });
        }

        // Filter by category
        if ($request->filled('category') && $request->input('category') !== 'semua') {
            $query->where('category', $request->input('category'));
        }

        // Filter by active status
        if ($request->filled('status')) {
            $status = $request->input('status');
            $query->where('is_active', $status === 'active');
        }

        // Sorting - default by sort_order
        $sortColumn = $request->input('sort', 'sort_order');
        $sortDirection = $request->input('direction', 'asc');
        $allowedSortColumns = ['question', 'category', 'sort_order', 'created_at', 'is_active'];
        
        if (in_array($sortColumn, $allowedSortColumns)) {
            $query->orderBy($sortColumn, $sortDirection === 'asc' ? 'asc' : 'desc');
        } else {
            $query->orderBy('sort_order', 'asc');
        }

        $perPage = $request->input('per_page', 15);
        $ssds = $query->paginate($perPage)->withQueryString();

        // Get statistics by category
        $statistics = $this->getStatistics();

        return Inertia::render('Admin/Ssd/Index', [
            'ssds' => $ssds,
            'filters' => [
                'search' => $request->input('search', ''),
                'category' => $request->input('category', ''),
                'status' => $request->input('status', ''),
                'sort' => $sortColumn,
                'direction' => $sortDirection,
            ],
            'categories' => self::CATEGORIES,
            'statistics' => $statistics,
        ]);
    }

    /**
     * Show the form for creating a new SSD.
     * 
     * @see Requirements 4.2
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Ssd/Create', [
            'categories' => self::CATEGORIES,
        ]);
    }

    /**
     * Store a newly created SSD.
     * 
     * @see Requirements 4.2
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'question' => 'required|string|max:1000',
            'answer' => 'required|string',
            'category' => 'required|string|in:' . implode(',', array_keys(self::CATEGORIES)),
            'is_active' => 'boolean',
        ]);

        // Sanitize HTML in answer
        $validated['answer'] = $this->htmlSanitizer->sanitize($validated['answer']);
        
        // Set defaults
        $validated['is_active'] = $validated['is_active'] ?? true;
        
        // Set sort_order to be last within the category
        $validated['sort_order'] = Ssd::where('category', $validated['category'])->max('sort_order') + 1;

        $ssd = Ssd::create($validated);

        $this->activityLogger->logCreated($ssd);

        // Clear SSD cache to ensure public pages show updated content
        $this->clearSsdCache();

        return redirect()->route('admin.ssd.index')
            ->with('success', 'FAQ berhasil ditambahkan');
    }

    /**
     * Clear all SSD-related cache keys.
     * Called after create, update, and delete operations.
     * 
     * @see Requirements 5.5, 13.1, 13.2, 13.3
     */
    protected function clearSsdCache(): void
    {
        Cache::forget('ssd_public_index');
        Cache::forget('ssd_categories');
    }

    /**
     * Display the specified SSD.
     */
    public function show(Ssd $ssd): Response
    {
        return Inertia::render('Admin/Ssd/Show', [
            'ssd' => $ssd,
            'categories' => self::CATEGORIES,
        ]);
    }

    /**
     * Show the form for editing the specified SSD.
     */
    public function edit(Ssd $ssd): Response
    {
        return Inertia::render('Admin/Ssd/Edit', [
            'ssd' => $ssd,
            'categories' => self::CATEGORIES,
        ]);
    }

    /**
     * Update the specified SSD.
     */
    public function update(Request $request, Ssd $ssd): RedirectResponse
    {
        $validated = $request->validate([
            'question' => 'required|string|max:1000',
            'answer' => 'required|string',
            'category' => 'required|string|in:' . implode(',', array_keys(self::CATEGORIES)),
            'is_active' => 'boolean',
        ]);

        // Sanitize HTML in answer
        $validated['answer'] = $this->htmlSanitizer->sanitize($validated['answer']);

        $oldValues = $ssd->getAttributes();

        $ssd->update($validated);

        $this->activityLogger->logUpdated($ssd, $oldValues);

        // Clear SSD cache
        $this->clearSsdCache();

        return redirect()->route('admin.ssd.index')
            ->with('success', 'FAQ berhasil diperbarui');
    }

    /**
     * Remove the specified SSD.
     */
    public function destroy(Ssd $ssd): RedirectResponse
    {
        $this->activityLogger->logDeleted($ssd);
        
        $ssd->delete();

        // Clear SSD cache
        $this->clearSsdCache();

        return redirect()->route('admin.ssd.index')
            ->with('success', 'FAQ berhasil dihapus');
    }

    /**
     * Toggle SSD active status.
     * 
     * @see Requirements 4.5
     */
    public function toggleActive(Ssd $ssd): RedirectResponse
    {
        $oldValues = $ssd->getAttributes();
        
        $ssd->update(['is_active' => !$ssd->is_active]);
        
        $this->activityLogger->logUpdated($ssd, $oldValues);

        // Clear SSD cache
        $this->clearSsdCache();

        $status = $ssd->is_active ? 'diaktifkan' : 'dinonaktifkan';
        return redirect()->back()
            ->with('success', "FAQ berhasil {$status}");
    }

    /**
     * Reorder SSD items via drag-drop.
     * Updates sort_order for all affected items.
     * 
     * @see Requirements 4.3
     */
    public function reorder(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|string|exists:ssds,id',
            'items.*.sort_order' => 'required|integer|min:0',
        ]);

        DB::transaction(function () use ($validated) {
            foreach ($validated['items'] as $item) {
                Ssd::where('id', $item['id'])
                    ->update(['sort_order' => $item['sort_order']]);
            }
        });

        // Clear SSD cache
        $this->clearSsdCache();

        return back()->with('success', 'Urutan FAQ berhasil diperbarui');
    }

    /**
     * Perform bulk actions on multiple SSDs.
     */
    public function bulkAction(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'action' => 'required|in:activate,deactivate,delete',
            'ids' => 'required|array',
            'ids.*' => 'string|exists:ssds,id',
        ]);

        $ids = $validated['ids'];
        $action = $validated['action'];
        $count = count($ids);

        switch ($action) {
            case 'activate':
                Ssd::whereIn('id', $ids)->update(['is_active' => true]);
                $message = "{$count} FAQ berhasil diaktifkan";
                break;
                
            case 'deactivate':
                Ssd::whereIn('id', $ids)->update(['is_active' => false]);
                $message = "{$count} FAQ berhasil dinonaktifkan";
                break;
                
            case 'delete':
                $ssds = Ssd::whereIn('id', $ids)->get();
                foreach ($ssds as $ssd) {
                    $this->activityLogger->logDeleted($ssd);
                }
                Ssd::whereIn('id', $ids)->delete();
                $message = "{$count} FAQ berhasil dihapus";
                break;
                
            default:
                $message = 'Aksi tidak valid';
        }

        // Clear SSD cache after any bulk action
        $this->clearSsdCache();

        return redirect()->route('admin.ssd.index')
            ->with('success', $message);
    }

    /**
     * Get statistics grouped by category.
     */
    protected function getStatistics(): array
    {
        $stats = [];
        
        foreach (array_keys(self::CATEGORIES) as $category) {
            $categoryItems = Ssd::where('category', $category);
            $stats[$category] = [
                'total' => (clone $categoryItems)->count(),
                'active' => (clone $categoryItems)->where('is_active', true)->count(),
            ];
        }

        $stats['all'] = [
            'total' => Ssd::count(),
            'active' => Ssd::where('is_active', true)->count(),
        ];

        return $stats;
    }
}
