<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProfileContent;
use App\Services\ActivityLoggerService;
use App\Services\HtmlSanitizer;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controller for managing Profile Content in the admin panel.
 * Provides full CRUD operations with rich text editing and image upload.
 * 
 * @see Requirements 6.1, 6.2, 6.3
 */
class ProfileContentController extends Controller
{
    protected ActivityLoggerService $activityLogger;
    protected HtmlSanitizer $htmlSanitizer;

    /**
     * Profile content types
     */
    public const CONTENT_TYPES = [
        'sejarah' => 'Sejarah',
        'visi-misi' => 'Visi & Misi',
        'kedudukan' => 'Kedudukan, Tugas & Fungsi',
        'struktur' => 'Struktur Organisasi',
    ];

    /**
     * Allowed image types for struktur
     */
    public const ALLOWED_IMAGE_TYPES = ['jpg', 'jpeg', 'png', 'webp'];

    public function __construct(ActivityLoggerService $activityLogger, HtmlSanitizer $htmlSanitizer)
    {
        $this->activityLogger = $activityLogger;
        $this->htmlSanitizer = $htmlSanitizer;
    }

    /**
     * Display content grouped by type.
     * 
     * @see Requirements 6.1
     */
    public function index(Request $request): Response
    {
        $query = ProfileContent::query();

        // Search by title or content
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%");
            });
        }

        // Filter by type
        if ($request->filled('type')) {
            $query->where('type', $request->input('type'));
        }

        // Filter by status
        if ($request->filled('status')) {
            $status = $request->input('status');
            $query->where('is_active', $status === 'active');
        }

        // Sorting
        $sortColumn = $request->input('sort', 'order');
        $sortDirection = $request->input('direction', 'asc');
        $allowedSortColumns = ['title', 'type', 'order', 'is_active', 'created_at', 'updated_at'];
        
        if (in_array($sortColumn, $allowedSortColumns)) {
            $query->orderBy($sortColumn, $sortDirection === 'asc' ? 'asc' : 'desc');
        } else {
            $query->orderBy('type')->orderBy('order');
        }

        $perPage = $request->input('per_page', 10);
        $contents = $query->paginate($perPage)->withQueryString();

        // Get statistics grouped by type
        $statistics = $this->getStatistics();

        return Inertia::render('Admin/ProfileContent/Index', [
            'contents' => $contents,
            'filters' => [
                'search' => $request->input('search', ''),
                'type' => $request->input('type', ''),
                'status' => $request->input('status', ''),
                'sort' => $sortColumn,
                'direction' => $sortDirection,
            ],
            'contentTypes' => self::CONTENT_TYPES,
            'statistics' => $statistics,
        ]);
    }

    /**
     * Show the form for creating new content.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/ProfileContent/Create', [
            'contentTypes' => self::CONTENT_TYPES,
            'allowedImageTypes' => self::ALLOWED_IMAGE_TYPES,
        ]);
    }

    /**
     * Store newly created content.
     * 
     * @see Requirements 6.2, 6.3
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'type' => 'required|string|in:' . implode(',', array_keys(self::CONTENT_TYPES)),
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'images' => 'nullable|array',
            'images.*' => 'nullable|image|mimes:' . implode(',', self::ALLOWED_IMAGE_TYPES) . '|max:2048',
            'metadata' => 'nullable|array',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        // Sanitize HTML content
        $sanitizedContent = $this->htmlSanitizer->sanitize($validated['content']);

        // Handle image uploads
        $imagePaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('profile-content', 'public');
                $imagePaths[] = $path;
            }
        }

        // Get max order for this type
        $maxOrder = ProfileContent::where('type', $validated['type'])->max('order') ?? 0;

        $profileContent = ProfileContent::create([
            'type' => $validated['type'],
            'title' => $validated['title'],
            'content' => $sanitizedContent,
            'images' => !empty($imagePaths) ? $imagePaths : null,
            'metadata' => $validated['metadata'] ?? null,
            'order' => $validated['order'] ?? ($maxOrder + 1),
            'is_active' => $validated['is_active'] ?? true,
        ]);

        $this->activityLogger->logCreated($profileContent);

        return redirect()->route('admin.profile-content.index')
            ->with('success', 'Konten profil berhasil ditambahkan');
    }

    /**
     * Display the specified content.
     */
    public function show(ProfileContent $profileContent): Response
    {
        return Inertia::render('Admin/ProfileContent/Show', [
            'content' => $profileContent,
            'contentTypes' => self::CONTENT_TYPES,
        ]);
    }

    /**
     * Show the form for editing the specified content.
     */
    public function edit(ProfileContent $profileContent): Response
    {
        return Inertia::render('Admin/ProfileContent/Edit', [
            'content' => $profileContent,
            'contentTypes' => self::CONTENT_TYPES,
            'allowedImageTypes' => self::ALLOWED_IMAGE_TYPES,
        ]);
    }

    /**
     * Update the specified content.
     * 
     * @see Requirements 6.2, 6.3
     */
    public function update(Request $request, ProfileContent $profileContent): RedirectResponse
    {
        $validated = $request->validate([
            'type' => 'required|string|in:' . implode(',', array_keys(self::CONTENT_TYPES)),
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'images' => 'nullable|array',
            'images.*' => 'nullable|image|mimes:' . implode(',', self::ALLOWED_IMAGE_TYPES) . '|max:2048',
            'existing_images' => 'nullable|array',
            'metadata' => 'nullable|array',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        $oldValues = $profileContent->getAttributes();

        // Sanitize HTML content
        $sanitizedContent = $this->htmlSanitizer->sanitize($validated['content']);

        // Handle existing images
        $existingImages = $validated['existing_images'] ?? [];
        $currentImages = $profileContent->images ?? [];
        
        // Delete removed images
        foreach ($currentImages as $imagePath) {
            if (!in_array($imagePath, $existingImages) && Storage::disk('public')->exists($imagePath)) {
                Storage::disk('public')->delete($imagePath);
            }
        }

        // Handle new image uploads
        $imagePaths = $existingImages;
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('profile-content', 'public');
                $imagePaths[] = $path;
            }
        }

        $profileContent->update([
            'type' => $validated['type'],
            'title' => $validated['title'],
            'content' => $sanitizedContent,
            'images' => !empty($imagePaths) ? $imagePaths : null,
            'metadata' => $validated['metadata'] ?? $profileContent->metadata,
            'order' => $validated['order'] ?? $profileContent->order,
            'is_active' => $validated['is_active'] ?? $profileContent->is_active,
        ]);

        $this->activityLogger->logUpdated($profileContent, $oldValues);

        return redirect()->route('admin.profile-content.index')
            ->with('success', 'Konten profil berhasil diperbarui');
    }

    /**
     * Remove the specified content.
     */
    public function destroy(ProfileContent $profileContent): RedirectResponse
    {
        // Delete associated images
        if ($profileContent->images) {
            foreach ($profileContent->images as $imagePath) {
                if (Storage::disk('public')->exists($imagePath)) {
                    Storage::disk('public')->delete($imagePath);
                }
            }
        }

        $this->activityLogger->logDeleted($profileContent);
        
        $profileContent->delete();

        return redirect()->route('admin.profile-content.index')
            ->with('success', 'Konten profil berhasil dihapus');
    }

    /**
     * Toggle content active status.
     * 
     * @see Requirements 6.5
     */
    public function toggleActive(ProfileContent $profileContent): RedirectResponse
    {
        $oldValues = $profileContent->getAttributes();
        
        $profileContent->update(['is_active' => !$profileContent->is_active]);
        
        $this->activityLogger->logUpdated($profileContent, $oldValues);

        $status = $profileContent->is_active ? 'diaktifkan' : 'dinonaktifkan';
        return redirect()->back()
            ->with('success', "Konten berhasil {$status}");
    }

    /**
     * Reorder content items.
     * 
     * @see Requirements 6.4
     */
    public function reorder(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|integer|exists:profile_contents,id',
            'items.*.order' => 'required|integer|min:0',
        ]);

        foreach ($validated['items'] as $item) {
            ProfileContent::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return redirect()->back()
            ->with('success', 'Urutan konten berhasil diperbarui');
    }

    /**
     * Perform bulk actions on multiple contents.
     */
    public function bulkAction(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'action' => 'required|in:activate,deactivate,delete',
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:profile_contents,id',
        ]);

        $ids = $validated['ids'];
        $action = $validated['action'];
        $count = count($ids);

        switch ($action) {
            case 'activate':
                ProfileContent::whereIn('id', $ids)->update(['is_active' => true]);
                $message = "{$count} konten berhasil diaktifkan";
                break;
                
            case 'deactivate':
                ProfileContent::whereIn('id', $ids)->update(['is_active' => false]);
                $message = "{$count} konten berhasil dinonaktifkan";
                break;
                
            case 'delete':
                $contents = ProfileContent::whereIn('id', $ids)->get();
                foreach ($contents as $content) {
                    if ($content->images) {
                        foreach ($content->images as $imagePath) {
                            if (Storage::disk('public')->exists($imagePath)) {
                                Storage::disk('public')->delete($imagePath);
                            }
                        }
                    }
                    $this->activityLogger->logDeleted($content);
                }
                ProfileContent::whereIn('id', $ids)->delete();
                $message = "{$count} konten berhasil dihapus";
                break;
                
            default:
                $message = 'Aksi tidak valid';
        }

        return redirect()->route('admin.profile-content.index')
            ->with('success', $message);
    }

    /**
     * Get statistics grouped by type.
     */
    protected function getStatistics(): array
    {
        $stats = [];
        
        foreach (array_keys(self::CONTENT_TYPES) as $type) {
            $typeContents = ProfileContent::where('type', $type);
            $stats[$type] = [
                'total' => (clone $typeContents)->count(),
                'active' => (clone $typeContents)->where('is_active', true)->count(),
            ];
        }

        $stats['all'] = [
            'total' => ProfileContent::count(),
            'active' => ProfileContent::where('is_active', true)->count(),
        ];

        return $stats;
    }
}
