<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PpidContent;
use App\Services\ActivityLoggerService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controller for managing PPID Content in the admin panel.
 * Supports hierarchical content structure with categories and sub-categories.
 * Uses TipTap rich text editor for content.
 */
class PpidContentController extends Controller
{
    protected ActivityLoggerService $activityLogger;

    public function __construct(ActivityLoggerService $activityLogger)
    {
        $this->activityLogger = $activityLogger;
    }

    /**
     * Display a listing of PPID contents.
     */
    public function index(Request $request): Response
    {
        $query = PpidContent::with('creator');

        // Search by title
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where('title', 'like', "%{$search}%");
        }

        // Filter by category
        if ($request->filled('category')) {
            $query->where('category', $request->input('category'));
        }

        // Filter by sub-category
        if ($request->filled('sub_category')) {
            $query->where('sub_category', $request->input('sub_category'));
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        // Sorting
        $sortColumn = $request->input('sort', 'created_at');
        $sortDirection = $request->input('direction', 'desc');
        $allowedSortColumns = ['title', 'category', 'sub_category', 'status', 'created_at', 'order'];

        if (in_array($sortColumn, $allowedSortColumns)) {
            $query->orderBy($sortColumn, $sortDirection === 'asc' ? 'asc' : 'desc');
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $perPage = $request->input('per_page', 10);
        $contents = $query->paginate($perPage)->withQueryString();

        // Get statistics
        $statistics = $this->getStatistics();

        return Inertia::render('Admin/PpidContent/Index', [
            'contents' => $contents,
            'filters' => [
                'search' => $request->input('search', ''),
                'category' => $request->input('category', ''),
                'sub_category' => $request->input('sub_category', ''),
                'status' => $request->input('status', ''),
                'sort' => $sortColumn,
                'direction' => $sortDirection,
            ],
            'categories' => PpidContent::CATEGORIES,
            'subCategories' => PpidContent::SUB_CATEGORIES,
            'statistics' => $statistics,
        ]);
    }

    /**
     * Show the form for creating new content.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/PpidContent/Create', [
            'categories' => PpidContent::CATEGORIES,
            'subCategories' => PpidContent::SUB_CATEGORIES,
        ]);
    }

    /**
     * Store newly created content.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|in:' . implode(',', array_keys(PpidContent::CATEGORIES)),
            'sub_category' => [
                'nullable',
                'string',
                Rule::requiredIf($request->input('category') === 'informasi_publik'),
                Rule::in(array_keys(PpidContent::SUB_CATEGORIES)),
            ],
            'content' => 'required|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'document' => 'nullable|file|mimes:pdf,doc,docx|max:10240',
            'status' => 'required|in:draft,published',
            'is_active' => 'boolean',
        ]);

        // Handle image upload
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('ppid/images', 'public');
        }

        // Handle document upload
        $documentPath = null;
        if ($request->hasFile('document')) {
            $documentPath = $request->file('document')->store('ppid/documents', 'public');
        }

        // Get next order number for the category
        $maxOrder = PpidContent::where('category', $validated['category'])->max('order') ?? 0;

        $content = PpidContent::create([
            'title' => $validated['title'],
            'category' => $validated['category'],
            'sub_category' => $validated['sub_category'] ?? null,
            'content' => $validated['content'],
            'image_path' => $imagePath,
            'document_path' => $documentPath,
            'status' => $validated['status'],
            'is_active' => $validated['is_active'] ?? true,
            'order' => $maxOrder + 1,
            'created_by' => Auth::guard('admin')->id(),
            'published_at' => $validated['status'] === 'published' ? now() : null,
        ]);

        $this->activityLogger->logCreated($content);
        $this->clearPpidCache();

        return redirect()->route('admin.ppid-content.index')
            ->with('success', 'Konten PPID berhasil ditambahkan');
    }

    /**
     * Display the specified content.
     */
    public function show(PpidContent $ppidContent): Response
    {
        $ppidContent->load('creator');

        return Inertia::render('Admin/PpidContent/Show', [
            'content' => $ppidContent,
            'categories' => PpidContent::CATEGORIES,
            'subCategories' => PpidContent::SUB_CATEGORIES,
        ]);
    }

    /**
     * Show the form for editing content.
     */
    public function edit(PpidContent $ppidContent): Response
    {
        return Inertia::render('Admin/PpidContent/Edit', [
            'content' => $ppidContent,
            'categories' => PpidContent::CATEGORIES,
            'subCategories' => PpidContent::SUB_CATEGORIES,
        ]);
    }

    /**
     * Update the specified content.
     */
    public function update(Request $request, PpidContent $ppidContent): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|in:' . implode(',', array_keys(PpidContent::CATEGORIES)),
            'sub_category' => [
                'nullable',
                'string',
                Rule::requiredIf($request->input('category') === 'informasi_publik'),
                Rule::in(array_keys(PpidContent::SUB_CATEGORIES)),
            ],
            'content' => 'required|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'document' => 'nullable|file|mimes:pdf,doc,docx|max:10240',
            'status' => 'required|in:draft,published',
            'is_active' => 'boolean',
            'remove_image' => 'boolean',
            'remove_document' => 'boolean',
        ]);

        $oldValues = $ppidContent->getAttributes();

        $updateData = [
            'title' => $validated['title'],
            'category' => $validated['category'],
            'sub_category' => $validated['category'] === 'informasi_publik' ? $validated['sub_category'] : null,
            'content' => $validated['content'],
            'status' => $validated['status'],
            'is_active' => $validated['is_active'] ?? $ppidContent->is_active,
        ];

        // Update published_at if status changed to published
        if ($validated['status'] === 'published' && $ppidContent->status !== 'published') {
            $updateData['published_at'] = now();
        }

        // Handle image upload/removal
        if ($request->hasFile('image')) {
            // Delete old image
            if ($ppidContent->image_path && Storage::disk('public')->exists($ppidContent->image_path)) {
                Storage::disk('public')->delete($ppidContent->image_path);
            }
            $updateData['image_path'] = $request->file('image')->store('ppid/images', 'public');
        } elseif ($request->boolean('remove_image')) {
            if ($ppidContent->image_path && Storage::disk('public')->exists($ppidContent->image_path)) {
                Storage::disk('public')->delete($ppidContent->image_path);
            }
            $updateData['image_path'] = null;
        }

        // Handle document upload/removal
        if ($request->hasFile('document')) {
            // Delete old document
            if ($ppidContent->document_path && Storage::disk('public')->exists($ppidContent->document_path)) {
                Storage::disk('public')->delete($ppidContent->document_path);
            }
            $updateData['document_path'] = $request->file('document')->store('ppid/documents', 'public');
        } elseif ($request->boolean('remove_document')) {
            if ($ppidContent->document_path && Storage::disk('public')->exists($ppidContent->document_path)) {
                Storage::disk('public')->delete($ppidContent->document_path);
            }
            $updateData['document_path'] = null;
        }

        $ppidContent->update($updateData);

        $this->activityLogger->logUpdated($ppidContent, $oldValues);
        $this->clearPpidCache();

        return redirect()->route('admin.ppid-content.index')
            ->with('success', 'Konten PPID berhasil diperbarui');
    }

    /**
     * Remove the specified content.
     */
    public function destroy(PpidContent $ppidContent): RedirectResponse
    {
        // Delete associated files
        if ($ppidContent->image_path && Storage::disk('public')->exists($ppidContent->image_path)) {
            Storage::disk('public')->delete($ppidContent->image_path);
        }
        if ($ppidContent->document_path && Storage::disk('public')->exists($ppidContent->document_path)) {
            Storage::disk('public')->delete($ppidContent->document_path);
        }

        $this->activityLogger->logDeleted($ppidContent);

        $ppidContent->delete();

        $this->clearPpidCache();

        return redirect()->route('admin.ppid-content.index')
            ->with('success', 'Konten PPID berhasil dihapus');
    }

    /**
     * Toggle content active status.
     */
    public function toggleActive(PpidContent $ppidContent): RedirectResponse
    {
        $oldValues = $ppidContent->getAttributes();

        $ppidContent->update(['is_active' => !$ppidContent->is_active]);

        $this->activityLogger->logUpdated($ppidContent, $oldValues);
        $this->clearPpidCache();

        $status = $ppidContent->is_active ? 'diaktifkan' : 'dinonaktifkan';
        return redirect()->back()
            ->with('success', "Konten berhasil {$status}");
    }

    /**
     * Perform bulk actions on multiple contents.
     */
    public function bulkAction(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'action' => 'required|in:activate,deactivate,publish,draft,delete',
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:ppid_contents,id',
        ]);

        $ids = $validated['ids'];
        $action = $validated['action'];
        $count = count($ids);

        switch ($action) {
            case 'activate':
                PpidContent::whereIn('id', $ids)->update(['is_active' => true]);
                $message = "{$count} konten berhasil diaktifkan";
                break;

            case 'deactivate':
                PpidContent::whereIn('id', $ids)->update(['is_active' => false]);
                $message = "{$count} konten berhasil dinonaktifkan";
                break;

            case 'publish':
                PpidContent::whereIn('id', $ids)->update([
                    'status' => 'published',
                    'published_at' => now(),
                ]);
                $message = "{$count} konten berhasil dipublikasikan";
                break;

            case 'draft':
                PpidContent::whereIn('id', $ids)->update(['status' => 'draft']);
                $message = "{$count} konten berhasil dijadikan draft";
                break;

            case 'delete':
                $contents = PpidContent::whereIn('id', $ids)->get();
                foreach ($contents as $content) {
                    if ($content->image_path && Storage::disk('public')->exists($content->image_path)) {
                        Storage::disk('public')->delete($content->image_path);
                    }
                    if ($content->document_path && Storage::disk('public')->exists($content->document_path)) {
                        Storage::disk('public')->delete($content->document_path);
                    }
                    $this->activityLogger->logDeleted($content);
                }
                PpidContent::whereIn('id', $ids)->delete();
                $message = "{$count} konten berhasil dihapus";
                break;

            default:
                $message = 'Aksi tidak valid';
        }

        $this->clearPpidCache();

        return redirect()->route('admin.ppid-content.index')
            ->with('success', $message);
    }

    /**
     * Reorder content items.
     */
    public function reorder(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|integer|exists:ppid_contents,id',
            'items.*.order' => 'required|integer|min:0',
        ]);

        foreach ($validated['items'] as $item) {
            PpidContent::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        $this->clearPpidCache();

        return redirect()->back()
            ->with('success', 'Urutan konten berhasil diperbarui');
    }

    /**
     * Get statistics grouped by category.
     */
    protected function getStatistics(): array
    {
        $stats = [];

        foreach (array_keys(PpidContent::CATEGORIES) as $category) {
            $categoryContents = PpidContent::where('category', $category);
            $stats[$category] = [
                'total' => (clone $categoryContents)->count(),
                'published' => (clone $categoryContents)->where('status', 'published')->count(),
                'draft' => (clone $categoryContents)->where('status', 'draft')->count(),
                'active' => (clone $categoryContents)->where('is_active', true)->count(),
            ];
        }

        $stats['all'] = [
            'total' => PpidContent::count(),
            'published' => PpidContent::where('status', 'published')->count(),
            'draft' => PpidContent::where('status', 'draft')->count(),
            'active' => PpidContent::where('is_active', true)->count(),
        ];

        return $stats;
    }

    /**
     * Clear PPID-related cache.
     */
    protected function clearPpidCache(): void
    {
        Cache::forget('ppid_contents_all');
        Cache::forget('ppid_documents_all');

        foreach (array_keys(PpidContent::CATEGORIES) as $category) {
            Cache::forget("ppid_contents_{$category}");
        }

        foreach (array_keys(PpidContent::SUB_CATEGORIES) as $subCategory) {
            Cache::forget("ppid_contents_{$subCategory}");
        }
    }
}
