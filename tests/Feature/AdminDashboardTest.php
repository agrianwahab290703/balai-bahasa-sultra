<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminDashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_dashboard_loads()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $this->withoutMiddleware();
        

        
        $response = $this->actingAs($admin)->get('/admin/dashboard');
        $response->assertStatus(200);
    }

    public function test_dashboard_shows_statistics()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $this->withoutMiddleware();
        $response = $this->actingAs($admin)->get('/admin/dashboard');
        
        // Check if response is successful
        $response->assertStatus(200);
        
        // Check if Inertia page is returned and contains statistics
        $response->assertSessionHasNoErrors();
        // Check for encoded component name and statistics in data-page attribute
        $this->assertStringContainsString('Admin\\/Dashboard', $response->getContent());
        $this->assertStringContainsString('statistics', $response->getContent());
        $this->assertStringContainsString('total_pengumuman', $response->getContent());
        $this->assertStringContainsString('active_pengumuman', $response->getContent());
    }
}
