<?php

namespace Database\Factories;

use App\Models\Menu;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Menu>
 */
class MenuFactory extends Factory
{
    protected $model = Menu::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'label' => fake()->words(rand(1, 3), true),
            'url' => '/' . fake()->slug(rand(1, 3)),
            'parent_id' => null,
            'order' => fake()->numberBetween(0, 100),
            'location' => fake()->randomElement(['header', 'footer']),
            'icon' => fake()->optional(0.3)->randomElement(['home', 'info', 'settings', 'user', 'file']),
            'is_visible' => fake()->boolean(80),
        ];
    }

    /**
     * Indicate that the menu is a root menu (no parent).
     */
    public function root(): static
    {
        return $this->state(fn (array $attributes) => [
            'parent_id' => null,
        ]);
    }

    /**
     * Indicate that the menu is a child of another menu.
     */
    public function childOf(Menu $parent): static
    {
        return $this->state(fn (array $attributes) => [
            'parent_id' => $parent->id,
            'location' => $parent->location,
        ]);
    }

    /**
     * Indicate that the menu is visible.
     */
    public function visible(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_visible' => true,
        ]);
    }

    /**
     * Indicate that the menu is hidden.
     */
    public function hidden(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_visible' => false,
        ]);
    }

    /**
     * Indicate that the menu is in the header location.
     */
    public function header(): static
    {
        return $this->state(fn (array $attributes) => [
            'location' => 'header',
        ]);
    }

    /**
     * Indicate that the menu is in the footer location.
     */
    public function footer(): static
    {
        return $this->state(fn (array $attributes) => [
            'location' => 'footer',
        ]);
    }
}
