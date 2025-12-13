<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\News;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Str;

class ScrapedNewsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Import news from scraped JSON data
     */
    public function run(): void
    {
        // Try multiple JSON file paths (prioritize news_final.json with complete content)
        $jsonPaths = [
            base_path('database/seeders/data/news_final.json'),
            base_path('scraped-data/news_data_all.json'),
            base_path('scraped-data/news_data_complete.json'),
        ];

        $jsonPath = null;
        foreach ($jsonPaths as $path) {
            if (file_exists($path)) {
                $jsonPath = $path;
                break;
            }
        }

        if (!$jsonPath) {
            $this->command->error('No JSON file found. Checked paths:');
            foreach ($jsonPaths as $path) {
                $this->command->error('  - ' . $path);
            }
            return;
        }

        $this->command->info('Using JSON file: ' . $jsonPath);

        $newsData = json_decode(file_get_contents($jsonPath), true);

        if (!$newsData) {
            $this->command->error('Failed to parse JSON file');
            return;
        }

        // Get or create a default admin user for the author
        $adminUser = User::first();
        if (!$adminUser) {
            $adminUser = User::create([
                'name' => 'Admin',
                'email' => 'admin@balaibahasasultra.go.id',
                'password' => bcrypt('password'),
            ]);
            $this->command->info('Created default admin user');
        }

        $this->command->info('Processing ' . count($newsData) . ' news articles...');

        $processed = 0;
        $skipped = 0;
        $errors = 0;

        foreach ($newsData as $item) {
            try {
                // Skip if no title
                if (empty($item['title'])) {
                    $skipped++;
                    continue;
                }

                // Generate slug if not present or ensure uniqueness
                $slug = $item['slug'] ?? Str::slug($item['title']);
                
                // Check for duplicate slug
                $existingNews = News::where('slug', $slug)->first();
                if ($existingNews) {
                    // Build content from summary if full content not available
                    $content = $item['content'] ?? $item['summary'] ?? '';
                    if (!empty($content) && !str_contains($content, '<')) {
                        $content = '<p>' . nl2br(e($content)) . '</p>';
                    }
                    
                    // Update existing instead of creating duplicate
                    $existingNews->update([
                        'content' => !empty($content) ? $content : $existingNews->content,
                        'excerpt' => $item['summary'] ?? $existingNews->excerpt,
                        'featured_image' => $item['image_path'] ?? $existingNews->featured_image,
                        'category' => $item['categories'][0] ?? 'Berita',
                        'categories' => $item['categories'] ?? ['Berita'],
                        'source_url' => $item['source_url'] ?? null,
                        'sentiment' => $item['sentiment'] ?? 'Neutral',
                        'validation_status' => $item['validation_status'] ?? 'Verified',
                    ]);
                    $this->command->line('<comment>Updated:</comment> ' . Str::limit($item['title'], 50));
                    $processed++;
                    continue;
                }

                // Parse published date
                $publishedAt = now();
                if (!empty($item['published_at'])) {
                    try {
                        $publishedAt = Carbon::parse($item['published_at']);
                    } catch (\Exception $e) {
                        $publishedAt = now();
                    }
                }

                // Build content from summary if full content not available
                $content = $item['content'] ?? $item['summary'] ?? '';
                
                // Wrap content in proper HTML if it's plain text
                if (!empty($content) && !str_contains($content, '<')) {
                    $content = '<p>' . nl2br(e($content)) . '</p>';
                }

                // Determine primary category
                $primaryCategory = 'Berita';
                if (!empty($item['categories']) && is_array($item['categories'])) {
                    $primaryCategory = $item['categories'][0];
                }

                // Create new news entry
                News::create([
                    'title' => $item['title'],
                    'slug' => $slug,
                    'excerpt' => $item['summary'] ?? Str::limit(strip_tags($content), 200),
                    'content' => $content,
                    'featured_image' => $item['image_path'] ?? null,
                    'status' => 'published',
                    'view_count' => rand(10, 500),
                    'published_at' => $publishedAt,
                    'user_id' => $adminUser->id,
                    'category' => $primaryCategory,
                    'categories' => $item['categories'] ?? ['Berita'],
                    'source_url' => $item['source_url'] ?? null,
                    'sentiment' => $item['sentiment'] ?? 'Neutral',
                    'validation_status' => $item['validation_status'] ?? 'Verified',
                ]);

                $this->command->line('<info>Created:</info> ' . Str::limit($item['title'], 50));
                $processed++;

            } catch (\Exception $e) {
                $this->command->error('Error processing: ' . ($item['title'] ?? 'Unknown') . ' - ' . $e->getMessage());
                $errors++;
            }
        }

        $this->command->newLine();
        $this->command->info('=== Seeding Complete ===');
        $this->command->info("Processed: {$processed}");
        $this->command->info("Skipped: {$skipped}");
        if ($errors > 0) {
            $this->command->error("Errors: {$errors}");
        }
    }
}
