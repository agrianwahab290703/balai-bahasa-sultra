<?php

namespace Tests\Feature;

use App\Models\AdminUser;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Http\Middleware\AdminAuthMiddleware;

class AdminAuthTest extends TestCase
{
    use RefreshDatabase;
    
    protected function setUp(): void
    {
        parent::setUp();
        
        // Register middleware alias for tests
        $this->app['router']->aliasMiddleware('admin.auth', AdminAuthMiddleware::class);
    }

    public function test_admin_login_page_loads()
    {
        $response = $this->get('/admin/login');
        $response->assertStatus(200);
    }

    public function test_admin_can_login_with_valid_credentials()
    {
        $admin = AdminUser::factory()->create([
            'role' => 'admin',
            'is_active' => true,
        ]);
        $response = $this->withSession(['_token' => 'test-token'])
                         ->post('/admin/login', [
            'email' => $admin->email,
            'password' => 'password',
            '_token' => 'test-token'
        ]);
        $response->assertRedirect('/admin/dashboard');
    }
    
    public function test_admin_dashboard_requires_authentication()
    {
        // Test without authentication
        $response = $this->get('/admin/dashboard');
        $response->assertRedirect('/admin/login');
    }
}
