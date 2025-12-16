<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\StandarPelayanan;
use App\Services\ActivityLoggerService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controller for managing Standar Pelayanan (Service Standards) in the admin panel.
 * Provides full CRUD operations with file upload, category filtering,
 * and download statistics tracking.
 * 
 * @see Requirements 5.1, 5.2, 5.5
 */
class StandarPelayananController extends Controller
{
    protected ActivityLoggerService $activityLogger;

    /**
     * Allowed file types for Standar Pelayanan documents
     */
    public const ALLOWED_FILE_TYPES = ['pdf', 'doc', 'docx', 'xls', 'xlsx'];

    public function __construct(ActivityLoggerService $activityLogger)
    {
        $this->activityLogger = $activityLogger;
    }

    /**
     * Display documents with title, category, file type, and download count.
     * 
     * @see Requirements 5.1
     */
    public function index(Request $request): Response
    {
        $query = StandarPelayanan::query();

        // Search by title or description
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filter by category
        if ($request->filled('category') && $request->input('category') !== 'semua') {
            $query->where('category', $request->input('category'));
        }

        // Filter by status
        if ($request->filled('status')) {
            $status = $request->input('status');
            $query->where('is_active', $status === 'active');
        }

        // Sorting
        $sortColumn = $request->input('sort', 'sort_order');
        $sortDirection = $request->input('direction', 'asc');
        $allowedSortColumns = ['title', 'category', 'file_type', 'download_count', 'sort_order', 'created_at'];
        
        if (in_array($sortColumn, $allowedSortColumns)) {
            $query->orderBy($sortColumn, $sortDirection === 'asc' ? 'asc' : 'desc');
        } else {
            $query->orderBy('sort_order', 'asc');
        }

        $perPage = $request->input('per_page', 15);
        $documents = $query->paginate($perPage)->withQueryString();

        // Get statistics grouped by category
        $statistics = $this->getStatistics();

        return Inertia::render('Admin/StandarPelayanan/Index', [
            'documents' => $documents,
            'filters' => [
                'search' => $request->input('search', ''),
                'category' => $request->input('category', ''),
                'status' => $request->input('status', ''),
                'sort' => $sortColumn,
                'direction' => $sortDirection,
            ],
            'categories' => StandarPelayanan::getCategories(),
            'statistics' => $statistics,
        ]);
    }

    /**
     * Show the form for creating a new document.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/StandarPelayanan/Create', [
            'categories' => StandarPelayanan::getCategories(),
            'allowedFileTypes' => self::ALLOWED_FILE_TYPES,
        ]);
    }

    /**
     * Store a newly created document.
     * Auto-detects file type and size.
     * 
     * @see Requirements 5.2
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|string|in:' . implode(',', StandarPelayanan::getCategories()),
            'file' => 'required|file|mimes:' . implode(',', self::ALLOWED_FILE_TYPES) . '|max:10240',
            'is_active' => 'boolean',
        ]);

        $file = $request->file('file');
        $filePath = $file->store('standar-pelayanan', 'public');
        $fileType = $file->getClientOriginalExtension();
        $fileSize = $file->getSize();

        // Set sort_order to be last within the category
        $maxSortOrder = StandarPelayanan::where('category', $validated['category'])->max('sort_order') ?? 0;

        $document = StandarPelayanan::create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? '',
            'category' => $validated['category'],
            'url' => $filePath,
            'file_type' => $fileType,
            'file_size' => $fileSize,
            'is_active' => $validated['is_active'] ?? true,
            'download_count' => 0,
            'sort_order' => $maxSortOrder + 1,
        ]);

        $this->activityLogger->logCreated($document);

        return redirect()->route('admin.standar-pelayanan.index')
            ->with('success', 'Standar Pelayanan berhasil ditambahkan');
    }

    /**
     * Display the specified document.
     */
    public function show(StandarPelayanan $standarPelayanan): Response
    {
        return Inertia::render('Admin/StandarPelayanan/Show', [
            'document' => $this->formatDocument($standarPelayanan),
            'categories' => StandarPelayanan::getCategories(),
        ]);
    }

    /**
     * Show the form for editing the specified document.
     */
    public function edit(StandarPelayanan $standarPelayanan): Response
    {
        return Inertia::render('Admin/StandarPelayanan/Edit', [
            'document' => $this->formatDocument($standarPelayanan),
            'categories' => StandarPelayanan::getCategories(),
            'allowedFileTypes' => self::ALLOWED_FILE_TYPES,
        ]);
    }

    /**
     * Update the specified document.
     */
    public function update(Request $request, StandarPelayanan $standarPelayanan): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|string|in:' . implode(',', StandarPelayanan::getCategories()),
            'file' => 'nullable|file|mimes:' . implode(',', self::ALLOWED_FILE_TYPES) . '|max:10240',
            'is_active' => 'boolean',
        ]);

        $oldValues = $standarPelayanan->getAttributes();

        $updateData = [
            'title' => $validated['title'],
            'description' => $validated['description'] ?? '',
            'category' => $validated['category'],
            'is_active' => $validated['is_active'] ?? $standarPelayanan->is_active,
        ];

        // Handle file upload if new file provided
        if ($request->hasFile('file')) {
            // Delete old file
            if ($standarPelayanan->url && Storage::disk('public')->exists($standarPelayanan->url)) {
                Storage::disk('public')->delete($standarPelayanan->url);
            }

            $file = $request->file('file');
            $updateData['url'] = $file->store('standar-pelayanan', 'public');
            $updateData['file_type'] = $file->getClientOriginalExtension();
            $updateData['file_size'] = $file->getSize();
        }

        $standarPelayanan->update($updateData);

        $this->activityLogger->logUpdated($standarPelayanan, $oldValues);

        return redirect()->route('admin.standar-pelayanan.index')
            ->with('success', 'Standar Pelayanan berhasil diperbarui');
    }

    /**
     * Remove the specified document.
     */
    public function destroy(StandarPelayanan $standarPelayanan): RedirectResponse
    {
        // Delete file from storage
        if ($standarPelayanan->url && Storage::disk('public')->exists($standarPelayanan->url)) {
            Storage::disk('public')->delete($standarPelayanan->url);
        }

        $this->activityLogger->logDeleted($standarPelayanan);
        
        $standarPelayanan->delete();

        return redirect()->route('admin.standar-pelayanan.index')
            ->with('success', 'Standar Pelayanan berhasil dihapus');
    }

    /**
     * Toggle document active status.
     */
    public function toggleActive(StandarPelayanan $standarPelayanan): RedirectResponse
    {
        $oldValues = $standarPelayanan->getAttributes();
        
        $standarPelayanan->update(['is_active' => !$standarPelayanan->is_active]);
        
        $this->activityLogger->logUpdated($standarPelayanan, $oldValues);

        $status = $standarPelayanan->is_active ? 'diaktifkan' : 'dinonaktifkan';
        return redirect()->back()
            ->with('success', "Standar Pelayanan berhasil {$status}");
    }

    /**
     * Reorder documents via drag-drop.
     * Updates sort_order for all affected items.
     * 
     * @see Requirements 5.4
     */
    public function reorder(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|integer|exists:standar_pelayanans,id',
            'items.*.sort_order' => 'required|integer|min:0',
        ]);

        DB::transaction(function () use ($validated) {
            foreach ($validated['items'] as $item) {
                StandarPelayanan::where('id', $item['id'])
                    ->update(['sort_order' => $item['sort_order']]);
            }
        });

        return back()->with('success', 'Urutan berhasil diperbarui');
    }

    /**
     * Perform bulk actions on multiple documents.
     */
    public function bulkAction(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'action' => 'required|in:activate,deactivate,delete',
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:standar_pelayanans,id',
        ]);

        $ids = $validated['ids'];
        $action = $validated['action'];
        $count = count($ids);

        switch ($action) {
            case 'activate':
                StandarPelayanan::whereIn('id', $ids)->update(['is_active' => true]);
                $message = "{$count} dokumen berhasil diaktifkan";
                break;
                
            case 'deactivate':
                StandarPelayanan::whereIn('id', $ids)->update(['is_active' => false]);
                $message = "{$count} dokumen berhasil dinonaktifkan";
                break;
                
            case 'delete':
                $documents = StandarPelayanan::whereIn('id', $ids)->get();
                foreach ($documents as $doc) {
                    if ($doc->url && Storage::disk('public')->exists($doc->url)) {
                        Storage::disk('public')->delete($doc->url);
                    }
                    $this->activityLogger->logDeleted($doc);
                }
                StandarPelayanan::whereIn('id', $ids)->delete();
                $message = "{$count} dokumen berhasil dihapus";
                break;
                
            default:
                $message = 'Aksi tidak valid';
        }

        return redirect()->route('admin.standar-pelayanan.index')
            ->with('success', $message);
    }

    /**
     * Download a document and increment download count.
     * 
     * @see Requirements 5.5
     */
    public function download(StandarPelayanan $standarPelayanan)
    {
        if (!$standarPelayanan->url || !Storage::disk('public')->exists($standarPelayanan->url)) {
            return redirect()->back()->with('error', 'File tidak ditemukan');
        }

        // Increment download count
        $standarPelayanan->incrementDownloadCount();

        return Storage::disk('public')->download(
            $standarPelayanan->url,
            $standarPelayanan->title . '.' . $standarPelayanan->file_type
        );
    }

    /**
     * Get statistics grouped by category.
     */
    protected function getStatistics(): array
    {
        $stats = [];
        $categories = StandarPelayanan::getCategories();
        
        foreach ($categories as $category) {
            $categoryDocs = StandarPelayanan::where('category', $category);
            $stats[$category] = [
                'total' => (clone $categoryDocs)->count(),
                'active' => (clone $categoryDocs)->where('is_active', true)->count(),
                'total_downloads' => (clone $categoryDocs)->sum('download_count'),
            ];
        }

        $stats['all'] = [
            'total' => StandarPelayanan::count(),
            'active' => StandarPelayanan::where('is_active', true)->count(),
            'total_downloads' => StandarPelayanan::sum('download_count'),
        ];

        return $stats;
    }

    /**
     * Format document for frontend with computed attributes.
     */
    protected function formatDocument(StandarPelayanan $document): array
    {
        return array_merge($document->toArray(), [
            'file_size_formatted' => $document->formatted_file_size,
            'file_url' => $document->url ? Storage::disk('public')->url($document->url) : null,
        ]);
    }
}
