<?php

namespace Database\Factories;

use App\Models\GaleriFotoBerita;
use App\Models\Berita;
use Illuminate\Database\Eloquent\Factories\Factory;

class GaleriFotoBeritaFactory extends Factory
{
    protected $model = GaleriFotoBerita::class;

    public function definition(): array
    {
        return [
            'berita_id' => Berita::factory(),
            'file_path' => 'images/berita/gallery-' . $this->faker->numberBetween(1, 100) . '.jpg',
            'file_name' => 'gallery-' . $this->faker->numberBetween(1, 100) . '.jpg',
            'alt_text' => $this->faker->sentence(),
            'caption' => $this->faker->randomElement([
                'Suasana serah terima penghargaan ZI WBK',
                'Foto bersama seluruh pegawai Balai Bahasa Sulawesi Tenggara',
                'Workshop penulisan kreatif untuk guru SMA/SMK',
                'Peluncuran kamus dialek Sulawesi Tenggara',
                'Sesi diskusi dengan ahli bahasa',
                'Penandatanganan MoU kerja sama internasional',
                'Kegiatan sosialisasi bahasa Indonesia di masyarakat',
                'Uji kompetensi bahasa untuk profesional'
            ]),
            'tipe' => $this->faker->randomElement(['hero', 'gallery', 'thumbnail']),
            'urutan' => $this->faker->numberBetween(1, 10),
        ];
    }
}