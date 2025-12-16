<?php

namespace Database\Factories;

use App\Models\Gallery;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class GalleryFactory extends Factory
{
    protected $model = Gallery::class;

    public function definition(): array
    {
        $categories = ['kegiatan', 'acara', 'dokumentasi', 'penghargaan', 'lainnya'];
        $name = $this->faker->sentence(rand(3, 6));
        
        return [
            'name' => $name,
            'title' => $name,
            'slug' => Str::slug($name) . '-' . $this->faker->unique()->randomNumber(4),
            'description' => $this->faker->optional(0.7)->paragraph(),
            'cover_image' => 'images/gallery/' . $this->faker->uuid() . '.jpg',
            'image' => 'images/gallery/' . $this->faker->uuid() . '.jpg',
            'thumbnail' => null,
            'category' => $this->faker->randomElement($categories),
            'year' => $this->faker->year(),
            'is_featured' => false,
            'is_active' => true,
            'sort_order' => $this->faker->numberBetween(0, 100),
            'user_id' => User::factory(),
        ];
    }

    /**
     * Indicate that the gallery item is featured.
     */
    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
        ]);
    }

    /**
     * Indicate that the gallery item is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Set a specific category.
     */
    public function category(string $category): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => $category,
        ]);
    }

    /**
     * Set a specific sort order.
     */
    public function sortOrder(int $order): static
    {
        return $this->state(fn (array $attributes) => [
            'sort_order' => $order,
        ]);
    }
}
