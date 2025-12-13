<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\News;
use App\Models\NewsImage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Carbon\Carbon;

class NewsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing news data
        $this->command->info('Clearing existing news data...');
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        News::truncate();
        NewsImage::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Path to scraped data
        $jsonFilePath = database_path('seeders/data/news_final.json');

        if (!file_exists($jsonFilePath)) {
            // Try alternative paths
            $alternativePaths = [
                base_path('scraped-data/news_data_final.json'),
                base_path('scraped-data/news_final.json'),
                database_path('seeders/data/news_crawled.json'),
            ];

            $jsonFilePath = null;
            foreach ($alternativePaths as $path) {
                if (file_exists($path)) {
                    $jsonFilePath = $path;
                    break;
                }
            }

            if (!$jsonFilePath) {
                $this->command->error('No scraped news data file found!');
                $this->command->info('Please run the crawler first:');
                $this->command->info('- Windows: run-crawler.bat');
                $this->command->info('- Linux/Mac: ./run-crawler.sh');
                return;
            }
        }

        $this->command->info("Reading data from: {$jsonFilePath}");

        // Read JSON data
        $jsonContent = file_get_contents($jsonFilePath);
        $newsData = json_decode($jsonContent, true);

        if (!$newsData || !is_array($newsData)) {
            $this->command->error('Invalid JSON data in the scraped file!');
            return;
        }

        $this->command->info('Found ' . count($newsData) . ' articles to import');

        // Default user ID (you can change this)
        $defaultUserId = 1;

        // Import news articles
        foreach ($newsData as $index => $article) {
            try {
                $this->command->line("Importing article " . ($index + 1) . "/" . count($newsData) . ": " . substr($article['title'] ?? 'No Title', 0, 60) . "...");

                // Prepare data
                $newsData = [
                    'title' => $article['title'] ?? 'Untitled',
                    'slug' => $article['slug'] ?? str_slug($article['title'] ?? 'untitled'),
                    'excerpt' => $article['excerpt'] ?? $article['summary'] ?? null,
                    'content' => $article['content'] ?? '<p>' . ($article['summary'] ?? 'No content available') . '</p>',
                    'featured_image' => $article['image_path'] ?? null,
                    'status' => 'published',
                    'view_count' => 0,
                    'published_at' => isset($article['published_at'])
                        ? Carbon::parse($article['published_at'])
                        : now(),
                    'user_id' => $defaultUserId,
                    'category' => isset($article['categories'][0]) ? $article['categories'][0] : 'Berita',
                    'categories' => $article['categories'] ?? null,
                    'source_url' => $article['source_url'] ?? null,
                    'sentiment' => $article['sentiment'] ?? 'Neutral',
                    'validation_status' => $article['validation_status'] ?? 'Verified',
                    'created_at' => now(),
                    'updated_at' => now(),
                ];

                // Handle slug conflicts
                $originalSlug = $newsData['slug'];
                $counter = 1;
                while (News::where('slug', $newsData['slug'])->exists()) {
                    $newsData['slug'] = $originalSlug . '-' . $counter;
                    $counter++;
                }

                // Create news article
                $news = News::create($newsData);

                // Update view count to random value for realism
                $news->update([
                    'view_count' => rand(50, 1000)
                ]);

                // Handle featured image path
                if (!empty($article['image_path'])) {
                    $this->handleImage($article['image_path']);
                }

                $this->command->line("✓ Imported: " . $news->title);

            } catch (\Exception $e) {
                $this->command->error("Failed to import article: " . ($article['title'] ?? 'Unknown'));
                $this->command->error("Error: " . $e->getMessage());
                continue;
            }
        }

        $this->command->info('News import completed successfully!');

        // Show summary
        $totalNews = News::count();
        $this->command->line("\n📊 Import Summary:");
        $this->command->line("Total articles imported: {$totalNews}");

        if ($totalNews > 0) {
            $publishedCount = News::where('status', 'published')->count();
            $this->command->line("Published articles: {$publishedCount}");

            // Show categories
            $categories = News::whereNotNull('category')
                ->select('category', DB::raw('count(*) as count'))
                ->groupBy('category')
                ->get();

            $this->command->line("\n📂 Categories:");
            foreach ($categories as $cat) {
                $this->command->line("- {$cat->category}: {$cat->count} articles");
            }
        }
    }

    /**
     * Handle image file verification
     */
    private function handleImage($imagePath): void
    {
        if (empty($imagePath)) {
            return;
        }

        // Remove leading slash if present
        $imagePath = ltrim($imagePath, '/');

        // Full path to image
        $fullPath = public_path($imagePath);

        if (!file_exists($fullPath)) {
            $this->command->warn("Image not found: {$imagePath}");
            return;
        }

        // Check file size
        $fileSize = filesize($fullPath);
        if ($fileSize === 0) {
            $this->command->warn("Image is empty: {$imagePath}");
        }
    }
}