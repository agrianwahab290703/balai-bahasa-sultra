<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Pengumuman>
 */
class PengumumanFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'judul' => fake()->sentence(),
            'slug' => fake()->slug(),
            'konten' => fake()->paragraphs(3, true), // Convert to string
            'tipe' => fake()->randomElement(['umum', 'urgent', 'tanggal_spesifik']),
            'tanggal_berlaku' => fake()->optional(0.7)->date(),
            'status' => 'draft',
            'prioritas' => fake()->numberBetween(0, 5),
            'meta_description' => fake()->sentence(),
            'created_by' => User::factory()->create()->id, // Create user and get ID as string
        ];
    }
}
