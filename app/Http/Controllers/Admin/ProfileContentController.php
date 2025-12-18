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

        // Sorting - always sort by type first, then by order within each type
        $sortColumn = $request->input('sort', 'order');
        $sortDirection = $request->input('direction', 'asc');
        $allowedSortColumns = ['title', 'type', 'order', 'is_active', 'created_at', 'updated_at'];
        
        if (in_array($sortColumn, $allowedSortColumns)) {
            // When sorting by order, also sort by type first for consistency
            if ($sortColumn === 'order') {
                $query->orderBy('type', 'asc')->orderBy('order', $sortDirection === 'asc' ? 'asc' : 'desc');
            } else {
                $query->orderBy($sortColumn, $sortDirection === 'asc' ? 'asc' : 'desc');
            }
        } else {
            $query->orderBy('type', 'asc')->orderBy('order', 'asc');
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
        // Get the next available order for each type
        $nextOrders = [];
        foreach (array_keys(self::CONTENT_TYPES) as $type) {
            $nextOrders[$type] = ProfileContent::where('type', $type)->count();
        }

        return Inertia::render('Admin/ProfileContent/Create', [
            'contentTypes' => self::CONTENT_TYPES,
            'allowedImageTypes' => self::ALLOWED_IMAGE_TYPES,
            'nextOrders' => $nextOrders,
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
            'content' => ['required_unless:type,struktur', 'nullable', 'string'],
            'images' => 'nullable|array',
            'images.*' => 'nullable|image|mimes:' . implode(',', self::ALLOWED_IMAGE_TYPES) . '|max:2048',
            'metadata' => 'nullable|array',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        // Sanitize HTML content
        $sanitizedContent = isset($validated['content']) ? $this->htmlSanitizer->sanitize($validated['content']) : null;

        // Handle image uploads
        $imagePaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('profile-content', 'public');
                $imagePaths[] = $path;
            }
        }

        // Get the desired order position
        $desiredOrder = $validated['order'] ?? null;
        
        // Count existing items of this type
        $existingCount = ProfileContent::where('type', $validated['type'])->count();
        
        if ($desiredOrder === null || $desiredOrder >= $existingCount) {
            // If no order specified or order is beyond existing items, append at the end
            $order = $existingCount;
        } else {
            // Insert at specific position - shift existing items down
            $order = max(0, (int) $desiredOrder);
            
            ProfileContent::where('type', $validated['type'])
                ->where('order', '>=', $order)
                ->increment('order');
        }

        $profileContent = ProfileContent::create([
            'type' => $validated['type'],
            'title' => $validated['title'],
            'content' => $sanitizedContent,
            'images' => !empty($imagePaths) ? $imagePaths : null,
            'metadata' => $validated['metadata'] ?? null,
            'order' => $order,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        // Normalize orders to ensure sequential numbering (0, 1, 2, ...)
        $this->normalizeOrders($validated['type']);

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
            'content' => ['required_unless:type,struktur', 'nullable', 'string'],
            'images' => 'nullable|array',
            'images.*' => 'nullable|image|mimes:' . implode(',', self::ALLOWED_IMAGE_TYPES) . '|max:2048',
            'existing_images' => 'nullable|array',
            'metadata' => 'nullable|array',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        $oldValues = $profileContent->getAttributes();
        $oldType = $profileContent->type;
        $oldOrder = $profileContent->order;

        // Sanitize HTML content
        $sanitizedContent = isset($validated['content']) ? $this->htmlSanitizer->sanitize($validated['content']) : null;

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

        // Handle order change
        $newOrder = $validated['order'] ?? $profileContent->order;
        $newType = $validated['type'];

        // If type changed, need to re-order both old and new types
        if ($oldType !== $newType) {
            // Remove from old type's ordering
            ProfileContent::where('type', $oldType)
                ->where('order', '>', $oldOrder)
                ->decrement('order');
            
            // Add to new type at the end or at specified position
            $newTypeCount = ProfileContent::where('type', $newType)->count();
            if ($newOrder >= $newTypeCount) {
                $newOrder = $newTypeCount;
            } else {
                ProfileContent::where('type', $newType)
                    ->where('order', '>=', $newOrder)
                    ->increment('order');
            }
        } else if ($newOrder !== $oldOrder) {
            // Same type but order changed
            if ($newOrder < $oldOrder) {
                // Moving up - shift items between new and old position down
                ProfileContent::where('type', $newType)
                    ->where('id', '!=', $profileContent->id)
                    ->where('order', '>=', $newOrder)
                    ->where('order', '<', $oldOrder)
                    ->increment('order');
            } else {
                // Moving down - shift items between old and new position up
                ProfileContent::where('type', $newType)
                    ->where('id', '!=', $profileContent->id)
                    ->where('order', '>', $oldOrder)
                    ->where('order', '<=', $newOrder)
                    ->decrement('order');
            }
        }

        $profileContent->update([
            'type' => $newType,
            'title' => $validated['title'],
            'content' => $sanitizedContent,
            'images' => !empty($imagePaths) ? $imagePaths : null,
            'metadata' => $validated['metadata'] ?? $profileContent->metadata,
            'order' => $newOrder,
            'is_active' => $validated['is_active'] ?? $profileContent->is_active,
        ]);

        // Normalize orders for affected types
        $this->normalizeOrders($newType);
        if ($oldType !== $newType) {
            $this->normalizeOrders($oldType);
        }

        $this->activityLogger->logUpdated($profileContent, $oldValues);

        return redirect()->route('admin.profile-content.index')
            ->with('success', 'Konten profil berhasil diperbarui');
    }

    /**
     * Remove the specified content.
     */
    public function destroy(ProfileContent $profileContent): RedirectResponse
    {
        $type = $profileContent->type;
        $order = $profileContent->order;

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

        // Shift remaining items up to fill the gap
        ProfileContent::where('type', $type)
            ->where('order', '>', $order)
            ->decrement('order');

        // Normalize orders to ensure no gaps
        $this->normalizeOrders($type);

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
     * Move item up or down in order
     */
    public function moveUpDown(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'id' => 'required|integer|exists:profile_contents,id',
            'direction' => 'required|in:up,down',
        ]);

        $content = ProfileContent::findOrFail($validated['id']);

        // Get all contents of the same type, ordered by order
        $typeContents = ProfileContent::where('type', $content->type)
            ->orderBy('order')
            ->get();

        $currentIndex = $typeContents->search(function ($item) use ($content) {
            return $item->id === $content->id;
        });

        if ($validated['direction'] === 'up' && $currentIndex > 0) {
            // Swap with previous item
            $previousItem = $typeContents[$currentIndex - 1];
            $tempOrder = $content->order;
            $content->order = $previousItem->order;
            $previousItem->order = $tempOrder;
            $content->save();
            $previousItem->save();
        } elseif ($validated['direction'] === 'down' && $currentIndex < $typeContents->count() - 1) {
            // Swap with next item
            $nextItem = $typeContents[$currentIndex + 1];
            $tempOrder = $content->order;
            $content->order = $nextItem->order;
            $nextItem->order = $tempOrder;
            $content->save();
            $nextItem->save();
        }

        // Normalize to ensure sequential ordering
        $this->normalizeOrders($content->type);

        return redirect()->back()->with('success', 'Urutan berhasil diperbarui');
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

        // Track affected types for normalization
        $affectedTypes = ProfileContent::whereIn('id', $ids)->pluck('type')->unique()->toArray();

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
                
                // Normalize orders for affected types after deletion
                foreach ($affectedTypes as $type) {
                    $this->normalizeOrders($type);
                }
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

    /**
     * Normalize orders for a specific type to ensure sequential numbering (0, 1, 2, ...)
     */
    protected function normalizeOrders(string $type): void
    {
        $contents = ProfileContent::where('type', $type)
            ->orderBy('order')
            ->orderBy('id') // Secondary sort by ID for consistency
            ->get();

        foreach ($contents as $index => $content) {
            if ($content->order !== $index) {
                $content->update(['order' => $index]);
            }
        }
    }

    /**
     * Fix duplicate orders for all content types (admin utility)
     */
    public function fixOrders(): RedirectResponse
    {
        $types = array_keys(self::CONTENT_TYPES);

        foreach ($types as $type) {
            $this->normalizeOrders($type);
        }

        return redirect()->back()->with('success', 'Urutan konten telah diperbaiki');
    }
}
