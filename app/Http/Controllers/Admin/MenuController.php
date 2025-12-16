<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use App\Services\ActivityLoggerService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controller for managing Menu items in the admin panel.
 * Provides full CRUD operations with hierarchical tree structure,
 * parent-child relationship management, and depth validation (max 2 levels).
 * 
 * @see Requirements 7.1, 7.2, 7.4
 */
class MenuController extends Controller
{
    protected ActivityLoggerService $activityLogger;

    /**
     * Menu locations
     */
    public const LOCATIONS = [
        'header' => 'Header',
        'footer' => 'Footer',
    ];

    /**
     * Maximum menu depth (2 levels: parent -> child)
     */
    public const MAX_DEPTH = 2;

    public function __construct(ActivityLoggerService $activityLogger)
    {
        $this->activityLogger = $activityLogger;
    }

    /**
     * Display menu items in a hierarchical tree structure.
     * 
     * @see Requirements 7.1
     */
    public function index(Request $request): Response
    {
        $location = $request->input('location', 'header');
        
        // Get root menus with their children for tree structure
        $menus = Menu::where('location', $location)
            ->whereNull('parent_id')
            ->with(['children' => function ($query) {
                $query->orderBy('order');
            }])
            ->orderBy('order')
            ->get();

        // Get statistics
        $statistics = $this->getStatistics();

        return Inertia::render('Admin/Menu/Index', [
            'menus' => $menus,
            'filters' => [
                'location' => $location,
            ],
            'locations' => self::LOCATIONS,
            'statistics' => $statistics,
            'maxDepth' => self::MAX_DEPTH,
        ]);
    }

    /**
     * Show the form for creating a new menu item.
     * 
     * @see Requirements 7.2
     */
    public function create(Request $request): Response
    {
        $location = $request->input('location', 'header');
        
        // Get potential parent menus (only root level items)
        $parentMenus = Menu::where('location', $location)
            ->whereNull('parent_id')
            ->orderBy('order')
            ->get(['id', 'label']);

        return Inertia::render('Admin/Menu/Create', [
            'locations' => self::LOCATIONS,
            'parentMenus' => $parentMenus,
            'defaultLocation' => $location,
        ]);
    }

    /**
     * Store a newly created menu item.
     * 
     * @see Requirements 7.2, 7.4
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'label' => 'required|string|max:255',
            'url' => 'nullable|string|max:500',
            'parent_id' => 'nullable|integer|exists:menus,id',
            'location' => 'required|string|in:' . implode(',', array_keys(self::LOCATIONS)),
            'icon' => 'nullable|string|max:100',
            'is_visible' => 'boolean',
        ]);

        // Validate depth constraint
        if (!empty($validated['parent_id'])) {
            $this->validateDepth($validated['parent_id']);
        }

        // Set defaults
        $validated['is_visible'] = $validated['is_visible'] ?? true;
        
        // Set order to be last within the same parent/location
        $validated['order'] = $this->getNextOrder(
            $validated['location'],
            $validated['parent_id'] ?? null
        );

        $menu = Menu::create($validated);

        $this->activityLogger->logCreated($menu);

        return redirect()->route('admin.menu.index', ['location' => $validated['location']])
            ->with('success', 'Menu berhasil ditambahkan');
    }

    /**
     * Display the specified menu item.
     */
    public function show(Menu $menu): Response
    {
        $menu->load('parent', 'children');

        return Inertia::render('Admin/Menu/Show', [
            'menu' => $menu,
            'locations' => self::LOCATIONS,
        ]);
    }

    /**
     * Show the form for editing the specified menu item.
     */
    public function edit(Menu $menu): Response
    {
        // Get potential parent menus (only root level items, excluding self and children)
        $parentMenus = Menu::where('location', $menu->location)
            ->whereNull('parent_id')
            ->where('id', '!=', $menu->id)
            ->orderBy('order')
            ->get(['id', 'label']);

        return Inertia::render('Admin/Menu/Edit', [
            'menu' => $menu,
            'locations' => self::LOCATIONS,
            'parentMenus' => $parentMenus,
        ]);
    }

    /**
     * Update the specified menu item.
     * 
     * @see Requirements 7.2, 7.4
     */
    public function update(Request $request, Menu $menu): RedirectResponse
    {
        $validated = $request->validate([
            'label' => 'required|string|max:255',
            'url' => 'nullable|string|max:500',
            'parent_id' => 'nullable|integer|exists:menus,id',
            'location' => 'required|string|in:' . implode(',', array_keys(self::LOCATIONS)),
            'icon' => 'nullable|string|max:100',
            'is_visible' => 'boolean',
        ]);

        // Prevent setting self as parent
        if (!empty($validated['parent_id']) && $validated['parent_id'] == $menu->id) {
            throw ValidationException::withMessages([
                'parent_id' => 'Menu tidak dapat menjadi parent dari dirinya sendiri.',
            ]);
        }

        // Prevent setting a child as parent (circular reference)
        if (!empty($validated['parent_id'])) {
            $childIds = $menu->children()->pluck('id')->toArray();
            if (in_array($validated['parent_id'], $childIds)) {
                throw ValidationException::withMessages([
                    'parent_id' => 'Menu tidak dapat menjadi parent dari child-nya sendiri.',
                ]);
            }
            
            // Validate depth constraint
            $this->validateDepth($validated['parent_id']);
        }

        // If menu has children and is being moved to become a child, prevent it
        if (!empty($validated['parent_id']) && $menu->children()->count() > 0) {
            throw ValidationException::withMessages([
                'parent_id' => 'Menu yang memiliki submenu tidak dapat dijadikan submenu.',
            ]);
        }

        $oldValues = $menu->getAttributes();

        $menu->update($validated);

        $this->activityLogger->logUpdated($menu, $oldValues);

        return redirect()->route('admin.menu.index', ['location' => $validated['location']])
            ->with('success', 'Menu berhasil diperbarui');
    }

    /**
     * Remove the specified menu item.
     */
    public function destroy(Menu $menu): RedirectResponse
    {
        $location = $menu->location;
        
        $this->activityLogger->logDeleted($menu);
        
        // Children will be deleted via cascade
        $menu->delete();

        return redirect()->route('admin.menu.index', ['location' => $location])
            ->with('success', 'Menu berhasil dihapus');
    }

    /**
     * Toggle menu visibility.
     * 
     * @see Requirements 7.5
     */
    public function toggleVisible(Menu $menu): RedirectResponse
    {
        $oldValues = $menu->getAttributes();
        
        $menu->update(['is_visible' => !$menu->is_visible]);
        
        $this->activityLogger->logUpdated($menu, $oldValues);

        $status = $menu->is_visible ? 'ditampilkan' : 'disembunyikan';
        return redirect()->back()
            ->with('success', "Menu berhasil {$status}");
    }

    /**
     * Reorder menu items via drag-drop.
     * Updates order for all affected items within the same level.
     * 
     * @see Requirements 7.3
     */
    public function reorder(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|integer|exists:menus,id',
            'items.*.order' => 'required|integer|min:0',
            'items.*.parent_id' => 'nullable|integer|exists:menus,id',
        ]);

        DB::transaction(function () use ($validated) {
            foreach ($validated['items'] as $item) {
                $updateData = ['order' => $item['order']];
                
                // Only update parent_id if explicitly provided
                if (array_key_exists('parent_id', $item)) {
                    // Validate depth if moving to a parent
                    if ($item['parent_id'] !== null) {
                        $this->validateDepth($item['parent_id']);
                        
                        // Check if menu has children
                        $menu = Menu::find($item['id']);
                        if ($menu && $menu->children()->count() > 0) {
                            throw ValidationException::withMessages([
                                'items' => 'Menu yang memiliki submenu tidak dapat dijadikan submenu.',
                            ]);
                        }
                    }
                    $updateData['parent_id'] = $item['parent_id'];
                }
                
                Menu::where('id', $item['id'])->update($updateData);
            }
        });

        return back()->with('success', 'Urutan menu berhasil diperbarui');
    }

    /**
     * Validate that adding a child to the given parent won't exceed max depth.
     * 
     * @throws ValidationException
     */
    protected function validateDepth(int $parentId): void
    {
        $parent = Menu::find($parentId);
        
        if (!$parent) {
            return;
        }

        // If parent already has a parent, we're at depth 2 (max)
        if ($parent->parent_id !== null) {
            throw ValidationException::withMessages([
                'parent_id' => 'Menu hanya dapat memiliki maksimal 2 level kedalaman.',
            ]);
        }
    }

    /**
     * Get the next order number for a menu item.
     */
    protected function getNextOrder(string $location, ?int $parentId): int
    {
        return Menu::where('location', $location)
            ->where('parent_id', $parentId)
            ->max('order') + 1;
    }

    /**
     * Get statistics for menus.
     */
    protected function getStatistics(): array
    {
        $stats = [];
        
        foreach (array_keys(self::LOCATIONS) as $location) {
            $locationMenus = Menu::where('location', $location);
            $stats[$location] = [
                'total' => (clone $locationMenus)->count(),
                'visible' => (clone $locationMenus)->where('is_visible', true)->count(),
                'root' => (clone $locationMenus)->whereNull('parent_id')->count(),
            ];
        }

        $stats['all'] = [
            'total' => Menu::count(),
            'visible' => Menu::where('is_visible', true)->count(),
        ];

        return $stats;
    }
}
