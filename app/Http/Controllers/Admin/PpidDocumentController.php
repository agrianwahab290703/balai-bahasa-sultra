<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PpidDocument;
use App\Services\ActivityLoggerService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controller for managing PPID Documents in the admin panel.
 * Provides full CRUD operations with file upload, category grouping,
 * and download count tracking.
 * 
 * @see Requirements 3.1, 3.2, 3.4
 */
class PpidDocumentController extends Controller
{
    protected ActivityLoggerService $activityLogger;

    /**
     * PPID document categories
     */
    public const CATEGORIES = [
        'setiap_saat' => 'Informasi Setiap Saat',
        'serta_merta' => 'Informasi Serta Merta',
        'berkala' => 'Informasi Berkala',
        'dikecualikan' => 'Informasi Dikecualikan',
    ];

    /**
     * Allowed file types for PPID documents
     */
    public const ALLOWED_FILE_TYPES = ['pdf', 'doc', 'docx', 'xls', 'xlsx'];

    public function __construct(ActivityLoggerService $activityLogger)
    {
        $this->activityLogger = $activityLogger;
    }

    /**
     * Display documents grouped by category.
     * 
     * @see Requirements 3.1
     */
    public function index(Request $request): Response
    {
        $query = PpidDocument::query();

        // Search by title
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where('title', 'like', "%{$search}%");
        }

        // Filter by category
        if ($request->filled('category')) {
            $query->where('category', $request->input('category'));
        }

        // Filter by status
        if ($request->filled('status')) {
            $status = $request->input('status');
            $query->where('is_active', $status === 'active');
        }

        // Sorting
        $sortColumn = $request->input('sort', 'created_at');
        $sortDirection = $request->input('direction', 'desc');
        $allowedSortColumns = ['title', 'category', 'file_type', 'download_count', 'created_at'];
        
        if (in_array($sortColumn, $allowedSortColumns)) {
            $query->orderBy($sortColumn, $sortDirection === 'asc' ? 'asc' : 'desc');
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $perPage = $request->input('per_page', 10);
        $documents = $query->paginate($perPage)->withQueryString();

        // Get statistics grouped by category
        $statistics = $this->getStatistics();

        return Inertia::render('Admin/Ppid/Index', [
            'documents' => $documents,
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
     * Show the form for creating a new document.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Ppid/Create', [
            'categories' => self::CATEGORIES,
            'allowedFileTypes' => self::ALLOWED_FILE_TYPES,
        ]);
    }

    /**
     * Store a newly created document.
     * Validates file type and records file size.
     * 
     * @see Requirements 3.2
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|in:' . implode(',', array_keys(self::CATEGORIES)),
            'file' => 'required|file|mimes:' . implode(',', self::ALLOWED_FILE_TYPES) . '|max:10240',
            'is_active' => 'boolean',
        ]);

        $file = $request->file('file');
        $filePath = $file->store('ppid-documents', 'public');
        $fileType = $file->getClientOriginalExtension();
        $fileSize = $file->getSize();

        $document = PpidDocument::create([
            'title' => $validated['title'],
            'category' => $validated['category'],
            'file_path' => $filePath,
            'file_type' => $fileType,
            'file_size' => $fileSize,
            'is_active' => $validated['is_active'] ?? true,
            'download_count' => 0,
        ]);

        $this->activityLogger->logCreated($document);

        // Clear PPID cache to ensure public pages show updated content
        $this->clearPpidCache();

        return redirect()->route('admin.ppid.index')
            ->with('success', 'Dokumen PPID berhasil ditambahkan');
    }

    /**
     * Clear all PPID-related cache keys.
     * Called after create, update, and delete operations.
     * 
     * @see Requirements 4.3, 13.1, 13.2, 13.3
     */
    protected function clearPpidCache(): void
    {
        Cache::forget('ppid_documents_all');
    }

    /**
     * Display the specified document.
     */
    public function show(PpidDocument $ppid): Response
    {
        return Inertia::render('Admin/Ppid/Show', [
            'document' => $ppid,
            'categories' => self::CATEGORIES,
        ]);
    }

    /**
     * Show the form for editing the specified document.
     */
    public function edit(PpidDocument $ppid): Response
    {
        return Inertia::render('Admin/Ppid/Edit', [
            'document' => $ppid,
            'categories' => self::CATEGORIES,
            'allowedFileTypes' => self::ALLOWED_FILE_TYPES,
        ]);
    }

    /**
     * Update the specified document.
     */
    public function update(Request $request, PpidDocument $ppid): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|in:' . implode(',', array_keys(self::CATEGORIES)),
            'file' => 'nullable|file|mimes:' . implode(',', self::ALLOWED_FILE_TYPES) . '|max:10240',
            'is_active' => 'boolean',
        ]);

        $oldValues = $ppid->getAttributes();

        $updateData = [
            'title' => $validated['title'],
            'category' => $validated['category'],
            'is_active' => $validated['is_active'] ?? $ppid->is_active,
        ];

        // Handle file upload if new file provided
        if ($request->hasFile('file')) {
            // Delete old file
            if ($ppid->file_path && Storage::disk('public')->exists($ppid->file_path)) {
                Storage::disk('public')->delete($ppid->file_path);
            }

            $file = $request->file('file');
            $updateData['file_path'] = $file->store('ppid-documents', 'public');
            $updateData['file_type'] = $file->getClientOriginalExtension();
            $updateData['file_size'] = $file->getSize();
        }

        $ppid->update($updateData);

        $this->activityLogger->logUpdated($ppid, $oldValues);

        // Clear PPID cache
        $this->clearPpidCache();

        return redirect()->route('admin.ppid.index')
            ->with('success', 'Dokumen PPID berhasil diperbarui');
    }

    /**
     * Remove the specified document.
     */
    public function destroy(PpidDocument $ppid): RedirectResponse
    {
        // Delete file from storage
        if ($ppid->file_path && Storage::disk('public')->exists($ppid->file_path)) {
            Storage::disk('public')->delete($ppid->file_path);
        }

        $this->activityLogger->logDeleted($ppid);
        
        $ppid->delete();

        // Clear PPID cache
        $this->clearPpidCache();

        return redirect()->route('admin.ppid.index')
            ->with('success', 'Dokumen PPID berhasil dihapus');
    }

    /**
     * Toggle document active status.
     * 
     * @see Requirements 3.5
     */
    public function toggleActive(PpidDocument $ppid): RedirectResponse
    {
        $oldValues = $ppid->getAttributes();
        
        $ppid->update(['is_active' => !$ppid->is_active]);
        
        $this->activityLogger->logUpdated($ppid, $oldValues);

        // Clear PPID cache
        $this->clearPpidCache();

        $status = $ppid->is_active ? 'diaktifkan' : 'dinonaktifkan';
        return redirect()->back()
            ->with('success', "Dokumen berhasil {$status}");
    }

    /**
     * Perform bulk actions on multiple documents.
     */
    public function bulkAction(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'action' => 'required|in:activate,deactivate,delete',
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:ppid_documents,id',
        ]);

        $ids = $validated['ids'];
        $action = $validated['action'];
        $count = count($ids);

        switch ($action) {
            case 'activate':
                PpidDocument::whereIn('id', $ids)->update(['is_active' => true]);
                $message = "{$count} dokumen berhasil diaktifkan";
                break;
                
            case 'deactivate':
                PpidDocument::whereIn('id', $ids)->update(['is_active' => false]);
                $message = "{$count} dokumen berhasil dinonaktifkan";
                break;
                
            case 'delete':
                $documents = PpidDocument::whereIn('id', $ids)->get();
                foreach ($documents as $doc) {
                    if ($doc->file_path && Storage::disk('public')->exists($doc->file_path)) {
                        Storage::disk('public')->delete($doc->file_path);
                    }
                    $this->activityLogger->logDeleted($doc);
                }
                PpidDocument::whereIn('id', $ids)->delete();
                $message = "{$count} dokumen berhasil dihapus";
                break;
                
            default:
                $message = 'Aksi tidak valid';
        }

        // Clear PPID cache after any bulk action
        $this->clearPpidCache();

        return redirect()->route('admin.ppid.index')
            ->with('success', $message);
    }

    /**
     * Download a document and increment download count.
     * 
     * @see Requirements 3.4
     */
    public function download(PpidDocument $ppid)
    {
        if (!$ppid->file_path || !Storage::disk('public')->exists($ppid->file_path)) {
            return redirect()->back()->with('error', 'File tidak ditemukan');
        }

        // Increment download count
        $ppid->increment('download_count');

        return Storage::disk('public')->download(
            $ppid->file_path,
            $ppid->title . '.' . $ppid->file_type
        );
    }

    /**
     * Get statistics grouped by category.
     */
    protected function getStatistics(): array
    {
        $stats = [];
        
        foreach (array_keys(self::CATEGORIES) as $category) {
            $categoryDocs = PpidDocument::where('category', $category);
            $stats[$category] = [
                'total' => (clone $categoryDocs)->count(),
                'active' => (clone $categoryDocs)->where('is_active', true)->count(),
                'total_downloads' => (clone $categoryDocs)->sum('download_count'),
            ];
        }

        $stats['all'] = [
            'total' => PpidDocument::count(),
            'active' => PpidDocument::where('is_active', true)->count(),
            'total_downloads' => PpidDocument::sum('download_count'),
        ];

        return $stats;
    }
}
