<?php

namespace Tests\Feature\Properties;

use App\Models\AdminUser;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * Property Test: Deactivated User Authentication Block
 * 
 * **Feature: admin-crud-management, Property 14: Deactivated User Authentication Block**
 * **Validates: Requirements 9.4**
 * 
 * *For any* admin user with is_active=false, authentication attempts SHALL fail 
 * regardless of correct credentials.
 */
class DeactivatedUserAuthBlockPropertyTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Property: Deactivated users cannot authenticate via admin guard
     * 
     * For any admin user with is_active=false, attempting to authenticate with correct
     * credentials should fail.
     */
    public function test_deactivated_users_cannot_authenticate_via_admin_guard(): void
    {
        // Property test: run 100 iterations with random deactivated users
        for ($i = 0; $i < 100; $i++) {
            $password = 'password123';
            $role = AdminUser::validRoles()[array_rand(AdminUser::validRoles())];
            
            // Create a deactivated user with known password
            $user = AdminUser::create([
                'name' => fake()->name(),
                'email' => fake()->unique()->safeEmail(),
                'password' => Hash::make($password),
                'role' => $role,
                'is_active' => false,
            ]);
            
            // Attempt to authenticate via admin guard with correct credentials
            $authenticated = Auth::guard('admin')->attempt([
                'email' => $user->email,
                'password' => $password,
            ]);
            
            // Should NOT be authenticated - deactivated users must be blocked
            $this->assertFalse(
                $authenticated,
                "Deactivated user should not be able to authenticate even with correct credentials"
            );
            
            // Verify no session was created
            $this->assertFalse(Auth::guard('admin')->check());
        }
    }

    /**
     * Property: Active users CAN authenticate via admin guard
     * 
     * For any admin user with is_active=true, attempting to authenticate with correct
     * credentials should succeed (contrast test to ensure the property is meaningful).
     */
    public function test_active_users_can_authenticate_via_admin_guard(): void
    {
        // Property test: run 100 iterations with random active users
        for ($i = 0; $i < 100; $i++) {
            $password = 'password123';
            $role = AdminUser::validRoles()[array_rand(AdminUser::validRoles())];
            
            // Create an active user with known password
            $user = AdminUser::create([
                'name' => fake()->name(),
                'email' => fake()->unique()->safeEmail(),
                'password' => Hash::make($password),
                'role' => $role,
                'is_active' => true,
            ]);
            
            // Attempt to authenticate via admin guard
            $authenticated = Auth::guard('admin')->attempt([
                'email' => $user->email,
                'password' => $password,
            ]);
            
            // Should be authenticated
            $this->assertTrue(
                $authenticated,
                "Active user should be able to authenticate with correct credentials"
            );
            
            // Logout for next iteration
            Auth::guard('admin')->logout();
        }
    }

    /**
     * Property: Deactivated users fail authentication regardless of role
     * 
     * For any role (super_admin, admin, editor), if is_active=false,
     * authentication should fail.
     */
    public function test_deactivated_users_blocked_regardless_of_role(): void
    {
        $password = 'password123';
        
        // Test each role explicitly
        foreach (AdminUser::validRoles() as $role) {
            // Property test: run 30 iterations per role
            for ($i = 0; $i < 30; $i++) {
                $user = AdminUser::create([
                    'name' => fake()->name(),
                    'email' => fake()->unique()->safeEmail(),
                    'password' => Hash::make($password),
                    'role' => $role,
                    'is_active' => false,
                ]);
                
                // Attempt to authenticate via admin guard
                $authenticated = Auth::guard('admin')->attempt([
                    'email' => $user->email,
                    'password' => $password,
                ]);
                
                // Should NOT be authenticated regardless of role
                $this->assertFalse(
                    $authenticated,
                    "Deactivated user with role '{$role}' should not be able to authenticate"
                );
            }
        }
    }

    /**
     * Property: Toggling is_active to false blocks subsequent authentication
     * 
     * For any previously active user, when is_active is set to false,
     * subsequent authentication attempts should fail.
     */
    public function test_toggling_active_to_false_blocks_authentication(): void
    {
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            $password = 'password123';
            $role = AdminUser::validRoles()[array_rand(AdminUser::validRoles())];
            
            // Create an active user
            $user = AdminUser::create([
                'name' => fake()->name(),
                'email' => fake()->unique()->safeEmail(),
                'password' => Hash::make($password),
                'role' => $role,
                'is_active' => true,
            ]);
            
            // Verify they can authenticate initially
            $initialAuth = Auth::guard('admin')->attempt([
                'email' => $user->email,
                'password' => $password,
            ]);
            $this->assertTrue($initialAuth, "Active user should authenticate initially");
            Auth::guard('admin')->logout();
            
            // Deactivate the user
            $user->update(['is_active' => false]);
            
            // Attempt to authenticate again
            $subsequentAuth = Auth::guard('admin')->attempt([
                'email' => $user->email,
                'password' => $password,
            ]);
            
            // Should now be blocked
            $this->assertFalse(
                $subsequentAuth,
                "User should be blocked after is_active is set to false"
            );
        }
    }

    /**
     * Property: isActive() helper method is consistent with is_active field
     * 
     * For any admin user, the isActive() method should return the same value
     * as the is_active field.
     */
    public function test_is_active_helper_is_consistent(): void
    {
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            $isActive = fake()->boolean();
            
            $user = AdminUser::create([
                'name' => fake()->name(),
                'email' => fake()->unique()->safeEmail(),
                'password' => Hash::make('password'),
                'role' => AdminUser::validRoles()[array_rand(AdminUser::validRoles())],
                'is_active' => $isActive,
            ]);
            
            // isActive() should match is_active field
            $this->assertEquals(
                $isActive,
                $user->isActive(),
                "isActive() should return {$isActive} when is_active field is {$isActive}"
            );
            
            // Refresh from database and check again
            $user->refresh();
            $this->assertEquals(
                $isActive,
                $user->isActive(),
                "isActive() should be consistent after refresh"
            );
        }
    }
}
