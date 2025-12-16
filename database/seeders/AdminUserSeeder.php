<?php

namespace Database\Seeders;

use App\Models\AdminUser;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Super Admin
        // Note: Don't use Hash::make() here because the model has 'password' => 'hashed' cast
        // which automatically hashes the password when set
        AdminUser::firstOrCreate(
            ['email' => 'superadmin@balaibahasa.go.id'],
            [
                'name' => 'Super Administrator',
                'password' => 'password',
                'role' => AdminUser::ROLE_SUPER_ADMIN,
                'is_active' => true,
            ]
        );

        // Create Admin
        AdminUser::firstOrCreate(
            ['email' => 'admin@balaibahasa.go.id'],
            [
                'name' => 'Administrator',
                'password' => 'password',
                'role' => AdminUser::ROLE_ADMIN,
                'is_active' => true,
            ]
        );
    }
}
