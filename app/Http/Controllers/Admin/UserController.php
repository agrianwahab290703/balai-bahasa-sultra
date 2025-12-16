<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminUser;
use App\Services\ActivityLoggerService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controller for managing Admin Users (super_admin only).
 * Provides CRUD operations with role filtering and deactivation.
 * 
 * @see Requirements 9.1, 9.2, 9.4
 */
class UserController extends Controller
{
    protected ActivityLoggerService $activityLogger;

    public function __construct(ActivityLoggerService $activityLogger)
    {
        $this->activityLogger = $activityLogger;
    }

    /**
     * Display a paginated list of all admin users.
     * Supports search and filtering by role.
     * 
     * @see Requirements 9.1
     */
    public function index(Request $request): Response
    {
        $query = AdminUser::query();

        // Search by name or email
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filter by role
        if ($request->filled('role')) {
            $query->where('role', $request->input('role'));
        }

        // Filter by status
        if ($request->filled('status')) {
            $status = $request->input('status');
            if ($status === 'active') {
                $query->where('is_active', true);
            } elseif ($status === 'inactive') {
                $query->where('is_active', false);
            }
        }

        // Sorting
        $sortColumn = $request->input('sort', 'created_at');
        $sortDirection = $request->input('direction', 'desc');
        $allowedSortColumns = ['name', 'email', 'role', 'is_active', 'last_login_at', 'created_at'];
        
        if (in_array($sortColumn, $allowedSortColumns)) {
            $query->orderBy($sortColumn, $sortDirection === 'asc' ? 'asc' : 'desc');
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $perPage = $request->input('per_page', 10);
        $users = $query->paginate($perPage)->withQueryString();

        // Get statistics
        $statistics = [
            'total' => AdminUser::count(),
            'active' => AdminUser::where('is_active', true)->count(),
            'inactive' => AdminUser::where('is_active', false)->count(),
            'super_admin' => AdminUser::where('role', AdminUser::ROLE_SUPER_ADMIN)->count(),
            'admin' => AdminUser::where('role', AdminUser::ROLE_ADMIN)->count(),
        ];

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => [
                'search' => $request->input('search', ''),
                'role' => $request->input('role', ''),
                'status' => $request->input('status', ''),
                'sort' => $sortColumn,
                'direction' => $sortDirection,
            ],
            'roles' => AdminUser::validRoles(),
            'statistics' => $statistics,
        ]);
    }

    /**
     * Show the form for creating a new admin user.
     * 
     * @see Requirements 9.2
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Users/Create', [
            'roles' => AdminUser::validRoles(),
        ]);
    }

    /**
     * Store a newly created admin user.
     * Validates password strength requirements.
     * 
     * @see Requirements 9.2, 9.5
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:admin_users,email',
            'password' => [
                'required',
                'confirmed',
                Password::min(8)
                    ->mixedCase()
                    ->numbers(),
            ],
            'role' => 'required|in:' . implode(',', AdminUser::validRoles()),
            'is_active' => 'boolean',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $validated['is_active'] = $validated['is_active'] ?? true;

        $user = AdminUser::create($validated);

        // Log activity
        $this->activityLogger->logCreated($user);

        return redirect()->route('admin.users.index')
            ->with('success', 'Pengguna berhasil ditambahkan');
    }

    /**
     * Display the specified admin user.
     */
    public function show(AdminUser $user): Response
    {
        return Inertia::render('Admin/Users/Show', [
            'user' => $user,
            'roles' => AdminUser::validRoles(),
        ]);
    }

    /**
     * Show the form for editing the specified admin user.
     */
    public function edit(AdminUser $user): Response
    {
        return Inertia::render('Admin/Users/Edit', [
            'user' => $user,
            'roles' => AdminUser::validRoles(),
        ]);
    }

    /**
     * Update the specified admin user.
     * 
     * @see Requirements 9.2
     */
    public function update(Request $request, AdminUser $user): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:admin_users,email,' . $user->id,
            'role' => 'required|in:' . implode(',', AdminUser::validRoles()),
            'is_active' => 'boolean',
        ]);

        // Store old values for activity logging
        $oldValues = $user->getAttributes();

        $validated['is_active'] = $validated['is_active'] ?? $user->is_active;

        $user->update($validated);

        // Log activity with changes
        $this->activityLogger->logUpdated($user, $oldValues);

        return redirect()->route('admin.users.index')
            ->with('success', 'Pengguna berhasil diperbarui');
    }

    /**
     * Update the password for the specified admin user.
     * 
     * @see Requirements 9.5
     */
    public function updatePassword(Request $request, AdminUser $user): RedirectResponse
    {
        $validated = $request->validate([
            'password' => [
                'required',
                'confirmed',
                Password::min(8)
                    ->mixedCase()
                    ->numbers(),
            ],
        ]);

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        // Log activity
        $this->activityLogger->log('password_changed', $user);

        return redirect()->route('admin.users.index')
            ->with('success', 'Password berhasil diperbarui');
    }

    /**
     * Toggle the active status of the specified admin user.
     * Deactivated users cannot log in.
     * 
     * @see Requirements 9.4
     */
    public function toggleActive(AdminUser $user): RedirectResponse
    {
        // Prevent deactivating yourself
        if ($user->id === Auth::guard('admin')->id()) {
            return redirect()->route('admin.users.index')
                ->with('error', 'Anda tidak dapat menonaktifkan akun sendiri');
        }

        $oldValues = $user->getAttributes();
        
        $user->update([
            'is_active' => !$user->is_active,
        ]);

        // Log activity
        $this->activityLogger->logUpdated($user, $oldValues);

        $message = $user->is_active 
            ? 'Pengguna berhasil diaktifkan' 
            : 'Pengguna berhasil dinonaktifkan';

        return redirect()->route('admin.users.index')
            ->with('success', $message);
    }

    /**
     * Remove the specified admin user.
     */
    public function destroy(AdminUser $user): RedirectResponse
    {
        // Prevent deleting yourself
        if ($user->id === Auth::guard('admin')->id()) {
            return redirect()->route('admin.users.index')
                ->with('error', 'Anda tidak dapat menghapus akun sendiri');
        }

        // Log activity before deletion
        $this->activityLogger->logDeleted($user);
        
        $user->delete();

        return redirect()->route('admin.users.index')
            ->with('success', 'Pengguna berhasil dihapus');
    }
}
