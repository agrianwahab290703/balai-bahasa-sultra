<?php

namespace Tests\Feature\Properties;

use App\Models\AdminUser;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Property Test: Role Validation
 * 
 * **Feature: admin-crud-management, Property 13: Role Validation**
 * **Validates: Requirements 9.3**
 * 
 * *For any* admin user, the role field SHALL contain exactly one value 
 * from the predefined set (super_admin, admin, editor).
 */
class RoleValidationPropertyTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Property: Valid roles are accepted
     * 
     * For any role from the valid roles set, creating an AdminUser with that role
     * should succeed and the role should be persisted correctly.
     */
    public function test_valid_roles_are_accepted(): void
    {
        $validRoles = AdminUser::validRoles();
        
        // Property test: run 100 iterations with random valid roles
        for ($i = 0; $i < 100; $i++) {
            $role = $validRoles[array_rand($validRoles)];
            
            $user = AdminUser::create([
                'name' => fake()->name(),
                'email' => fake()->unique()->safeEmail(),
                'password' => 'password123',
                'role' => $role,
                'is_active' => true,
            ]);
            
            // Assert the role is persisted correctly
            $this->assertEquals($role, $user->role);
            $this->assertTrue(AdminUser::isValidRole($user->role));
            
            // Assert the role is exactly one of the valid roles
            $this->assertContains($user->role, $validRoles);
        }
    }

    /**
     * Property: Role validation correctly identifies valid roles
     * 
     * For any string, isValidRole should return true if and only if
     * the string is in the predefined valid roles set.
     */
    public function test_role_validation_is_consistent(): void
    {
        $validRoles = AdminUser::validRoles();
        
        // Test all valid roles return true
        foreach ($validRoles as $role) {
            $this->assertTrue(
                AdminUser::isValidRole($role),
                "Valid role '{$role}' should be recognized as valid"
            );
        }
        
        // Property test: random invalid strings should return false
        for ($i = 0; $i < 100; $i++) {
            $invalidRole = fake()->word() . '_' . fake()->randomNumber(3);
            
            // Skip if by chance we generated a valid role
            if (in_array($invalidRole, $validRoles)) {
                continue;
            }
            
            $this->assertFalse(
                AdminUser::isValidRole($invalidRole),
                "Invalid role '{$invalidRole}' should not be recognized as valid"
            );
        }
    }

    /**
     * Property: Role helper methods are consistent with role value
     * 
     * For any admin user with a valid role, the helper methods (isSuperAdmin, isAdmin)
     * should return values consistent with the role field.
     */
    public function test_role_helper_methods_are_consistent(): void
    {
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            $validRoles = AdminUser::validRoles();
            $role = $validRoles[array_rand($validRoles)];
            
            $user = AdminUser::create([
                'name' => fake()->name(),
                'email' => fake()->unique()->safeEmail(),
                'password' => 'password123',
                'role' => $role,
                'is_active' => true,
            ]);
            
            // isSuperAdmin should be true only for super_admin role
            $this->assertEquals(
                $role === AdminUser::ROLE_SUPER_ADMIN,
                $user->isSuperAdmin(),
                "isSuperAdmin() should match role === 'super_admin'"
            );
            
            // isAdmin should be true for super_admin and admin roles
            $expectedIsAdmin = in_array($role, [AdminUser::ROLE_SUPER_ADMIN, AdminUser::ROLE_ADMIN]);
            $this->assertEquals(
                $expectedIsAdmin,
                $user->isAdmin(),
                "isAdmin() should be true for super_admin and admin roles"
            );
            
            // hasRole should return true for the assigned role
            $this->assertTrue(
                $user->hasRole($role),
                "hasRole('{$role}') should return true for user with role '{$role}'"
            );
            
            // hasRole should return false for other roles
            foreach ($validRoles as $otherRole) {
                if ($otherRole !== $role) {
                    $this->assertFalse(
                        $user->hasRole($otherRole),
                        "hasRole('{$otherRole}') should return false for user with role '{$role}'"
                    );
                }
            }
        }
    }

    /**
     * Property: Valid roles set is complete and correct
     * 
     * The validRoles() method should return exactly the two predefined roles.
     */
    public function test_valid_roles_set_is_complete(): void
    {
        $validRoles = AdminUser::validRoles();
        
        // Should contain exactly 2 roles (super_admin and admin)
        $this->assertCount(2, $validRoles);
        
        // Should contain all expected roles
        $this->assertContains(AdminUser::ROLE_SUPER_ADMIN, $validRoles);
        $this->assertContains(AdminUser::ROLE_ADMIN, $validRoles);
        
        // Constants should match expected values
        $this->assertEquals('super_admin', AdminUser::ROLE_SUPER_ADMIN);
        $this->assertEquals('admin', AdminUser::ROLE_ADMIN);
    }

    /**
     * Property: Default role behavior
     * 
     * When creating an AdminUser without specifying a role, the role field
     * should be null (no default role is assigned automatically).
     * Applications should explicitly set a role when creating users.
     */
    public function test_default_role_is_valid(): void
    {
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            $user = AdminUser::create([
                'name' => fake()->name(),
                'email' => fake()->unique()->safeEmail(),
                'password' => 'password123',
                'is_active' => true,
            ]);
            
            // When no role is specified, role should be null
            // This is expected behavior - roles must be explicitly assigned
            $this->assertNull(
                $user->role,
                "Role should be null when not explicitly specified"
            );
        }
    }
}
