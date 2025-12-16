<?php

namespace Tests\Feature\Admin;

use App\Models\AdminUser;
use App\Models\Pengumuman;
use App\Http\Middleware\AdminAuthMiddleware;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PengumumanTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Register middleware alias for tests
        $this->app['router']->aliasMiddleware('admin.auth', AdminAuthMiddleware::class);
    }

    public function test_pengumuman_index_can_be_rendered()
    {
        $admin = AdminUser::factory()->admin()->create();
        Pengumuman::factory()->count(5)->create();
        
        $response = $this->actingAs($admin, 'admin')->get('/admin/pengumuman');
        $response->assertStatus(200);
    }

    public function test_can_create_pengumuman()
    {
        $admin = AdminUser::factory()->admin()->create();
        $data = [
            'judul' => 'Test Pengumuman',
            'konten' => 'Ini adalah konten test',
            'tipe' => 'umum',
            'status' => 'active',
        ];
        
        $response = $this->actingAs($admin, 'admin')
                        ->withSession(['_token' => 'test-token'])
                        ->post('/admin/pengumuman', array_merge($data, ['_token' => 'test-token']));
        $response->assertRedirect('/admin/pengumuman');
        $this->assertDatabaseHas('pengumuman', ['judul' => 'Test Pengumuman']);
    }
}
