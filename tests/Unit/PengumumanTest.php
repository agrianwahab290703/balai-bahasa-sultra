<?php

namespace Tests\Unit;

use App\Models\Pengumuman;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PengumumanTest extends TestCase
{
    use RefreshDatabase;

    public function test_pengumuman_can_be_created()
    {
        $pengumuman = Pengumuman::factory()->create();
        $this->assertDatabaseHas('pengumuman', [
            'id' => $pengumuman->id,
            'judul' => $pengumuman->judul,
        ]);
    }

    public function test_pengumuman_status_defaults_to_draft()
    {
        $pengumuman = Pengumuman::factory()->create();
        $this->assertEquals('draft', $pengumuman->status);
    }
}
