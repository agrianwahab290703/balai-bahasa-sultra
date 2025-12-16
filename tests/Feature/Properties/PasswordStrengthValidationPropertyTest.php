<?php

namespace Tests\Feature\Properties;

use App\Models\AdminUser;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * Property Test: Password Strength Validation
 * 
 * **Feature: admin-crud-management, Property 15: Password Strength Validation**
 * **Validates: Requirements 9.5**
 * 
 * *For any* password change, the new password SHALL meet minimum requirements 
 * (8+ characters, mixed case, at least one number).
 */
class PasswordStrengthValidationPropertyTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Helper to generate a valid password that meets all requirements.
     * Requirements: 8+ chars, at least one uppercase, at least one lowercase, at least one number
     */
    private function generateValidPassword(): string
    {
        // Ensure we have: lowercase + uppercase + number + padding to reach 8+ chars
        $lowercase = 'abc';
        $uppercase = 'XYZ';
        $numbers = (string) rand(10, 99);
        
        // Shuffle to make it more random-looking
        $chars = str_split($lowercase . $uppercase . $numbers);
        shuffle($chars);
        
        return implode('', $chars);
    }

    /**
     * Helper to generate a password that is too short (less than 8 characters).
     */
    private function generateTooShortPassword(): string
    {
        // Generate 4-7 character password with mixed case and number
        $length = rand(4, 7);
        $password = 'aA1'; // Start with valid chars
        
        // Fill remaining with random lowercase chars
        while (strlen($password) < $length) {
            $password .= chr(rand(97, 122));
        }
        
        return $password;
    }

    /**
     * Helper to generate a password without uppercase letters.
     */
    private function generateNoUppercasePassword(): string
    {
        // 8+ chars, lowercase only with numbers - NO uppercase
        return 'abcdef' . rand(10, 99);
    }

    /**
     * Helper to generate a password without lowercase letters.
     */
    private function generateNoLowercasePassword(): string
    {
        // 8+ chars, uppercase only with numbers - NO lowercase
        return 'ABCDEF' . rand(10, 99);
    }

    /**
     * Helper to generate a password without numbers.
     */
    private function generateNoNumbersPassword(): string
    {
        // 8+ chars, mixed case, NO numbers
        return 'abcdEFGH';
    }

    /**
     * Create an authenticated super admin for testing.
     */
    private function createAuthenticatedSuperAdmin(): AdminUser
    {
        $admin = AdminUser::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@test.com',
            'password' => Hash::make('Password123'),
            'role' => AdminUser::ROLE_SUPER_ADMIN,
            'is_active' => true,
        ]);
        
        $this->actingAs($admin, 'admin');
        
        return $admin;
    }

    /**
     * Property: Valid passwords are accepted when creating users.
     * 
     * For any password that meets all requirements (8+ chars, mixed case, numbers),
     * the system should accept it.
     */
    public function test_valid_passwords_are_accepted_on_user_creation(): void
    {
        $this->createAuthenticatedSuperAdmin();

        // Property test: run 100 iterations with valid passwords
        for ($i = 0; $i < 100; $i++) {
            $validPassword = $this->generateValidPassword();
            
            $response = $this->post(route('admin.users.store'), [
                'name' => fake()->name(),
                'email' => fake()->unique()->safeEmail(),
                'password' => $validPassword,
                'password_confirmation' => $validPassword,
                'role' => AdminUser::validRoles()[array_rand(AdminUser::validRoles())],
                'is_active' => true,
            ]);

            // Should redirect (success) not have validation errors for password
            $response->assertSessionDoesntHaveErrors('password');
        }
    }

    /**
     * Property: Passwords shorter than 8 characters are rejected.
     * 
     * For any password with fewer than 8 characters, the system should reject it
     * regardless of other criteria being met.
     */
    public function test_short_passwords_are_rejected(): void
    {
        $this->createAuthenticatedSuperAdmin();

        // Property test: run 100 iterations with short passwords
        for ($i = 0; $i < 100; $i++) {
            $shortPassword = $this->generateTooShortPassword();
            
            $response = $this->post(route('admin.users.store'), [
                'name' => fake()->name(),
                'email' => fake()->unique()->safeEmail(),
                'password' => $shortPassword,
                'password_confirmation' => $shortPassword,
                'role' => AdminUser::validRoles()[array_rand(AdminUser::validRoles())],
                'is_active' => true,
            ]);

            // Should have validation error for password
            $response->assertSessionHasErrors('password');
        }
    }

    /**
     * Property: Passwords without uppercase letters are rejected.
     * 
     * For any password without at least one uppercase letter, the system should reject it.
     */
    public function test_passwords_without_uppercase_are_rejected(): void
    {
        $this->createAuthenticatedSuperAdmin();

        // Property test: run 100 iterations with no-uppercase passwords
        for ($i = 0; $i < 100; $i++) {
            $noUpperPassword = $this->generateNoUppercasePassword();
            
            $response = $this->post(route('admin.users.store'), [
                'name' => fake()->name(),
                'email' => fake()->unique()->safeEmail(),
                'password' => $noUpperPassword,
                'password_confirmation' => $noUpperPassword,
                'role' => AdminUser::validRoles()[array_rand(AdminUser::validRoles())],
                'is_active' => true,
            ]);

            // Should have validation error for password
            $response->assertSessionHasErrors('password');
        }
    }

    /**
     * Property: Passwords without lowercase letters are rejected.
     * 
     * For any password without at least one lowercase letter, the system should reject it.
     */
    public function test_passwords_without_lowercase_are_rejected(): void
    {
        $this->createAuthenticatedSuperAdmin();

        // Property test: run 100 iterations with no-lowercase passwords
        for ($i = 0; $i < 100; $i++) {
            $noLowerPassword = $this->generateNoLowercasePassword();
            
            $response = $this->post(route('admin.users.store'), [
                'name' => fake()->name(),
                'email' => fake()->unique()->safeEmail(),
                'password' => $noLowerPassword,
                'password_confirmation' => $noLowerPassword,
                'role' => AdminUser::validRoles()[array_rand(AdminUser::validRoles())],
                'is_active' => true,
            ]);

            // Should have validation error for password
            $response->assertSessionHasErrors('password');
        }
    }

    /**
     * Property: Passwords without numbers are rejected.
     * 
     * For any password without at least one number, the system should reject it.
     */
    public function test_passwords_without_numbers_are_rejected(): void
    {
        $this->createAuthenticatedSuperAdmin();

        // Property test: run 100 iterations with no-numbers passwords
        for ($i = 0; $i < 100; $i++) {
            $noNumbersPassword = $this->generateNoNumbersPassword();
            
            $response = $this->post(route('admin.users.store'), [
                'name' => fake()->name(),
                'email' => fake()->unique()->safeEmail(),
                'password' => $noNumbersPassword,
                'password_confirmation' => $noNumbersPassword,
                'role' => AdminUser::validRoles()[array_rand(AdminUser::validRoles())],
                'is_active' => true,
            ]);

            // Should have validation error for password
            $response->assertSessionHasErrors('password');
        }
    }

    /**
     * Property: Password confirmation must match.
     * 
     * For any password, if the confirmation doesn't match, the request should be rejected.
     */
    public function test_password_confirmation_must_match(): void
    {
        $this->createAuthenticatedSuperAdmin();

        // Property test: run 100 iterations with mismatched confirmations
        for ($i = 0; $i < 100; $i++) {
            $password = $this->generateValidPassword();
            $differentPassword = $this->generateValidPassword();
            
            // Ensure they're actually different
            while ($password === $differentPassword) {
                $differentPassword = $this->generateValidPassword();
            }
            
            $response = $this->post(route('admin.users.store'), [
                'name' => fake()->name(),
                'email' => fake()->unique()->safeEmail(),
                'password' => $password,
                'password_confirmation' => $differentPassword,
                'role' => AdminUser::validRoles()[array_rand(AdminUser::validRoles())],
                'is_active' => true,
            ]);

            // Should have validation error for password
            $response->assertSessionHasErrors('password');
        }
    }
}
