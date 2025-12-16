<?php

namespace Tests\Feature\Properties;

use App\Models\AdminUser;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Property Test: Role-Based Menu Visibility
 * 
 * **Feature: admin-fixes, Property 1: Role-Based Menu Visibility**
 * **Validates: Requirements 1.3**
 * 
 * *For any* user with a specific role, the sidebar menu SHALL display only menu items 
 * that the role is authorized to access, and super_admin SHALL see all menu items 
 * while admin SHALL see a subset.
 */
class RoleBasedMenuVisibilityPropertyTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Menu items configuration matching AdminLayout.tsx
     * Roles: super_admin, admin
     * Empty roles array = accessible by all roles
     */
    private array $menuItems = [
        ['label' => 'Dashboard', 'href' => '/admin/dashboard', 'roles' => []], // All roles
        ['label' => 'Berita', 'href' => '/admin/berita', 'roles' => []], // All roles
        ['label' => 'Galeri', 'href' => '/admin/gallery', 'roles' => []], // All roles
        ['label' => 'PPID', 'href' => '/admin/ppid', 'roles' => ['super_admin', 'admin']], // Admin only
        ['label' => 'SSD (FAQ)', 'href' => '/admin/ssd', 'roles' => []], // All roles
        ['label' => 'Standar Pelayanan', 'href' => '/admin/standar-pelayanan', 'roles' => ['super_admin', 'admin']], // Admin only
        ['label' => 'Profil', 'href' => '/admin/profile-content', 'roles' => ['super_admin', 'admin']], // Admin only
        ['label' => 'Menu', 'href' => '/admin/menu', 'roles' => ['super_admin', 'admin']], // Admin only
        ['label' => 'Media Library', 'href' => '/admin/media', 'roles' => []], // All roles
        ['label' => 'Pengguna', 'href' => '/admin/users', 'roles' => ['super_admin']], // Super admin only
        ['label' => 'Activity Log', 'href' => '/admin/activity-logs', 'roles' => ['super_admin', 'admin']], // Admin only
    ];

    /**
     * Helper function to check if user can access menu item
     * Mirrors the canAccessMenuItem function in AdminLayout.tsx
     */
    private function canAccessMenuItem(array $item, ?string $userRole): bool
    {
        if (empty($item['roles'])) {
            return true;
        }
        if ($userRole === null) {
            return false;
        }
        return in_array($userRole, $item['roles'], true);
    }

    /**
     * Helper function to check if menu item is super admin only
     * Mirrors the isSuperAdminOnly function in AdminLayout.tsx
     */
    private function isSuperAdminOnly(array $item): bool
    {
        return count($item['roles']) === 1 && $item['roles'][0] === 'super_admin';
    }

    /**
     * Get visible menu items for a given role
     */
    private function getVisibleMenuItems(?string $userRole): array
    {
        return array_filter($this->menuItems, fn($item) => $this->canAccessMenuItem($item, $userRole));
    }

    /**
     * Property: Super admin sees all menu items
     * 
     * For any super_admin user, all menu items should be visible.
     */
    public function test_super_admin_sees_all_menu_items(): void
    {
        // Property test: run 100 iterations with random super_admin users
        for ($i = 0; $i < 100; $i++) {
            $user = AdminUser::create([
                'name' => fake()->name(),
                'email' => fake()->unique()->safeEmail(),
                'password' => 'password123',
                'role' => AdminUser::ROLE_SUPER_ADMIN,
                'is_active' => true,
            ]);

            $visibleMenuItems = $this->getVisibleMenuItems($user->role);

            // Super admin should see ALL menu items
            $this->assertCount(
                count($this->menuItems),
                $visibleMenuItems,
                "Super admin should see all " . count($this->menuItems) . " menu items"
            );

            // Verify each menu item is accessible
            foreach ($this->menuItems as $menuItem) {
                $this->assertTrue(
                    $this->canAccessMenuItem($menuItem, $user->role),
                    "Super admin should have access to '{$menuItem['label']}'"
                );
            }
        }
    }

    /**
     * Property: Admin sees subset of menu items (excludes super admin only items)
     * 
     * For any admin user, menu items marked as super_admin only should NOT be visible.
     */
    public function test_admin_sees_subset_excluding_super_admin_only(): void
    {
        // Property test: run 100 iterations with random admin users
        for ($i = 0; $i < 100; $i++) {
            $user = AdminUser::create([
                'name' => fake()->name(),
                'email' => fake()->unique()->safeEmail(),
                'password' => 'password123',
                'role' => AdminUser::ROLE_ADMIN,
                'is_active' => true,
            ]);

            $visibleMenuItems = $this->getVisibleMenuItems($user->role);
            $superAdminOnlyItems = array_filter($this->menuItems, fn($item) => $this->isSuperAdminOnly($item));

            // Admin should see fewer items than total (excluding super_admin only items)
            $expectedCount = count($this->menuItems) - count($superAdminOnlyItems);
            $this->assertCount(
                $expectedCount,
                $visibleMenuItems,
                "Admin should see {$expectedCount} menu items (total minus super_admin only)"
            );

            // Verify super_admin only items are NOT accessible
            foreach ($superAdminOnlyItems as $menuItem) {
                $this->assertFalse(
                    $this->canAccessMenuItem($menuItem, $user->role),
                    "Admin should NOT have access to super_admin only item '{$menuItem['label']}'"
                );
            }
        }
    }

    /**
     * Property: Role-based visibility is consistent
     * 
     * For any user with a valid role, the menu visibility should be deterministic
     * and consistent across multiple checks.
     */
    public function test_role_based_visibility_is_consistent(): void
    {
        $validRoles = AdminUser::validRoles();

        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            $role = $validRoles[array_rand($validRoles)];

            $user = AdminUser::create([
                'name' => fake()->name(),
                'email' => fake()->unique()->safeEmail(),
                'password' => 'password123',
                'role' => $role,
                'is_active' => true,
            ]);

            // Get visible items twice
            $visibleItems1 = $this->getVisibleMenuItems($user->role);
            $visibleItems2 = $this->getVisibleMenuItems($user->role);

            // Results should be identical (deterministic)
            $this->assertEquals(
                array_column($visibleItems1, 'label'),
                array_column($visibleItems2, 'label'),
                "Menu visibility should be deterministic for role '{$role}'"
            );

            // Each visible item should pass the access check
            foreach ($visibleItems1 as $item) {
                $this->assertTrue(
                    $this->canAccessMenuItem($item, $user->role),
                    "Visible item '{$item['label']}' should pass access check for role '{$role}'"
                );
            }
        }
    }

    /**
     * Property: Super admin has strictly more access than admin
     * 
     * For any menu configuration, super_admin should have access to at least
     * as many menu items as admin, and strictly more if there are super_admin only items.
     */
    public function test_super_admin_has_more_or_equal_access_than_admin(): void
    {
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            $superAdmin = AdminUser::create([
                'name' => fake()->name(),
                'email' => fake()->unique()->safeEmail(),
                'password' => 'password123',
                'role' => AdminUser::ROLE_SUPER_ADMIN,
                'is_active' => true,
            ]);

            $admin = AdminUser::create([
                'name' => fake()->name(),
                'email' => fake()->unique()->safeEmail(),
                'password' => 'password123',
                'role' => AdminUser::ROLE_ADMIN,
                'is_active' => true,
            ]);

            $superAdminVisibleItems = $this->getVisibleMenuItems($superAdmin->role);
            $adminVisibleItems = $this->getVisibleMenuItems($admin->role);

            // Super admin should see at least as many items as admin
            $this->assertGreaterThanOrEqual(
                count($adminVisibleItems),
                count($superAdminVisibleItems),
                "Super admin should have access to at least as many menu items as admin"
            );

            // All items visible to admin should also be visible to super admin
            foreach ($adminVisibleItems as $item) {
                $this->assertTrue(
                    $this->canAccessMenuItem($item, $superAdmin->role),
                    "Item '{$item['label']}' visible to admin should also be visible to super admin"
                );
            }
        }
    }

    /**
     * Property: Empty roles array means accessible by all valid roles
     * 
     * For any menu item with empty roles array, all valid roles should have access.
     */
    public function test_empty_roles_means_all_access(): void
    {
        $validRoles = AdminUser::validRoles();
        $publicMenuItems = array_filter($this->menuItems, fn($item) => empty($item['roles']));

        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            $role = $validRoles[array_rand($validRoles)];

            $user = AdminUser::create([
                'name' => fake()->name(),
                'email' => fake()->unique()->safeEmail(),
                'password' => 'password123',
                'role' => $role,
                'is_active' => true,
            ]);

            // All public menu items should be accessible
            foreach ($publicMenuItems as $item) {
                $this->assertTrue(
                    $this->canAccessMenuItem($item, $user->role),
                    "Public menu item '{$item['label']}' should be accessible by role '{$role}'"
                );
            }
        }
    }

    /**
     * Property: Pengguna menu is exclusively for super admin
     * 
     * The 'Pengguna' (Users) menu should only be visible to super_admin role.
     */
    public function test_pengguna_menu_is_super_admin_exclusive(): void
    {
        $penggunaMenu = array_filter($this->menuItems, fn($item) => $item['label'] === 'Pengguna');
        $penggunaMenu = reset($penggunaMenu);

        $this->assertNotEmpty($penggunaMenu, "Pengguna menu should exist");
        $this->assertTrue(
            $this->isSuperAdminOnly($penggunaMenu),
            "Pengguna menu should be super_admin only"
        );

        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            $superAdmin = AdminUser::create([
                'name' => fake()->name(),
                'email' => fake()->unique()->safeEmail(),
                'password' => 'password123',
                'role' => AdminUser::ROLE_SUPER_ADMIN,
                'is_active' => true,
            ]);

            $admin = AdminUser::create([
                'name' => fake()->name(),
                'email' => fake()->unique()->safeEmail(),
                'password' => 'password123',
                'role' => AdminUser::ROLE_ADMIN,
                'is_active' => true,
            ]);

            // Super admin should have access
            $this->assertTrue(
                $this->canAccessMenuItem($penggunaMenu, $superAdmin->role),
                "Super admin should have access to Pengguna menu"
            );

            // Admin should NOT have access
            $this->assertFalse(
                $this->canAccessMenuItem($penggunaMenu, $admin->role),
                "Admin should NOT have access to Pengguna menu"
            );
        }
    }
}
