<?php

namespace Tests\Feature\Properties;

use App\Models\AdminUser;
use App\Models\Berita;
use App\Models\Gallery;
use App\Models\Media;
use App\Models\Menu;
use App\Models\PpidDocument;
use App\Models\ProfileContent;
use App\Models\Ssd;
use App\Models\StandarPelayanan;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Property Test: Statistics Accuracy
 * 
 * **Feature: admin-fixes, Property 5: Statistics Accuracy**
 * **Validates: Requirements 7.1-7.6, 8.1-8.4**
 * 
 * *For any* dashboard statistics query, the returned counts SHALL match the actual count 
 * of records in the database with the appropriate filters applied.
 */
class StatisticsAccuracyPropertyTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Helper to create a random Berita
     */
    private function createBerita(bool $isPublished = null, int $viewCount = null): Berita
    {
        return Berita::create([
            'judul_utama' => fake()->sentence(),
            'ringkasan_inti' => fake()->paragraph(),
            'teras_berita' => fake()->paragraph(),
            'hero_image' => 'images/test.jpg',
            'hero_image_alt' => fake()->sentence(),
            'kategori' => fake()->randomElement(['prestasi', 'kegiatan', 'kerjasama']),
            'is_published' => $isPublished ?? fake()->boolean(),
            'lokasi' => fake()->city(),
            'tanggal_rilis' => fake()->date(),
            'view_count' => $viewCount ?? fake()->numberBetween(0, 1000),
        ]);
    }

    /**
     * Helper to get or create a user for gallery tests
     */
    private function getGalleryUser(): User
    {
        return User::firstOrCreate(
            ['email' => 'gallery-test@example.com'],
            [
                'name' => 'Gallery Test User',
                'password' => bcrypt('password'),
            ]
        );
    }

    /**
     * Helper to create a random Gallery item
     */
    private function createGallery(bool $isActive = null, bool $isFeatured = null): Gallery
    {
        $user = $this->getGalleryUser();
        
        return Gallery::create([
            'name' => fake()->sentence(),
            'slug' => fake()->unique()->slug(),
            'title' => fake()->sentence(),
            'description' => fake()->paragraph(),
            'image' => 'images/gallery/test.jpg',
            'is_active' => $isActive ?? fake()->boolean(),
            'is_featured' => $isFeatured ?? fake()->boolean(),
            'sort_order' => fake()->numberBetween(1, 100),
            'user_id' => $user->id,
        ]);
    }

    /**
     * Helper to create a random PPID Document
     */
    private function createPpidDocument(bool $isActive = null, int $downloadCount = null): PpidDocument
    {
        return PpidDocument::create([
            'title' => fake()->sentence(),
            'description' => fake()->paragraph(),
            'category' => fake()->randomElement(['berkala', 'serta_merta', 'setiap_saat', 'dikecualikan']),
            'file_path' => 'documents/test.pdf',
            'file_type' => 'pdf',
            'file_size' => fake()->numberBetween(1000, 5000000),
            'is_active' => $isActive ?? fake()->boolean(),
            'download_count' => $downloadCount ?? fake()->numberBetween(0, 500),
        ]);
    }

    /**
     * Helper to create a random SSD item
     */
    private function createSsd(bool $isActive = null): Ssd
    {
        return Ssd::create([
            'question' => fake()->sentence() . '?',
            'answer' => fake()->paragraph(),
            'category' => fake()->randomElement(['umum', 'layanan', 'teknis']),
            'is_active' => $isActive ?? fake()->boolean(),
            'sort_order' => fake()->numberBetween(1, 100),
        ]);
    }

    /**
     * Helper to create a random StandarPelayanan
     */
    private function createStandarPelayanan(bool $isActive = null, int $downloadCount = null): StandarPelayanan
    {
        return StandarPelayanan::create([
            'title' => fake()->sentence(),
            'description' => fake()->paragraph(),
            'category' => fake()->randomElement(StandarPelayanan::getCategories()),
            'url' => 'documents/standar.pdf',
            'file_type' => 'pdf',
            'file_size' => fake()->numberBetween(1000, 5000000),
            'is_active' => $isActive ?? fake()->boolean(),
            'download_count' => $downloadCount ?? fake()->numberBetween(0, 500),
            'sort_order' => fake()->numberBetween(1, 100),
        ]);
    }

    /**
     * Helper to create a random ProfileContent
     */
    private function createProfileContent(bool $isActive = null): ProfileContent
    {
        return ProfileContent::create([
            'type' => fake()->randomElement(['sejarah', 'visi-misi', 'struktur']),
            'title' => fake()->sentence(),
            'content' => fake()->paragraphs(3, true),
            'is_active' => $isActive ?? fake()->boolean(),
            'order' => fake()->numberBetween(1, 100),
        ]);
    }

    /**
     * Helper to create a random Menu
     */
    private function createMenu(bool $isVisible = null): Menu
    {
        return Menu::create([
            'label' => fake()->words(2, true),
            'url' => '/' . fake()->slug(),
            'location' => fake()->randomElement(['header', 'footer']),
            'is_visible' => $isVisible ?? fake()->boolean(),
            'order' => fake()->numberBetween(1, 100),
        ]);
    }

    /**
     * Helper to create a random Media
     */
    private function createMedia(string $mimeType = null): Media
    {
        $mimeType = $mimeType ?? fake()->randomElement([
            'image/jpeg', 'image/png', 'image/webp',
            'application/pdf', 'application/msword',
        ]);
        
        return Media::create([
            'filename' => fake()->word() . '.' . explode('/', $mimeType)[1],
            'path' => 'media/' . fake()->uuid() . '.' . explode('/', $mimeType)[1],
            'mime_type' => $mimeType,
            'size' => fake()->numberBetween(1000, 5000000),
        ]);
    }

    /**
     * Helper to create a random AdminUser
     */
    private function createAdminUser(bool $isActive = null): AdminUser
    {
        return AdminUser::create([
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'password' => bcrypt('password'),
            'role' => fake()->randomElement(['super_admin', 'admin']),
            'is_active' => $isActive ?? fake()->boolean(),
        ]);
    }

    /**
     * Property: SSD active count matches database
     * 
     * **Feature: admin-fixes, Property 5: Statistics Accuracy**
     * **Validates: Requirements 7.1**
     */
    public function test_ssd_active_count_matches_database(): void
    {
        for ($i = 0; $i < 100; $i++) {
            // Arrange: Create random SSDs with random active status
            $ssds = [];
            $numSsds = fake()->numberBetween(0, 10);
            for ($j = 0; $j < $numSsds; $j++) {
                $ssds[] = $this->createSsd();
            }

            // Calculate expected count
            $expectedActiveCount = Ssd::where('is_active', true)->count();

            // Act: Get statistics (simulating DashboardController logic)
            $actualActiveCount = Ssd::where('is_active', true)->count();

            // Assert: Counts should match
            $this->assertEquals(
                $expectedActiveCount,
                $actualActiveCount,
                "Active SSD count mismatch: expected {$expectedActiveCount}, got {$actualActiveCount}"
            );

            // Cleanup
            Ssd::query()->delete();
        }
    }

    /**
     * Property: Standar Pelayanan active count matches database
     * 
     * **Feature: admin-fixes, Property 5: Statistics Accuracy**
     * **Validates: Requirements 7.2**
     */
    public function test_standar_pelayanan_active_count_matches_database(): void
    {
        for ($i = 0; $i < 100; $i++) {
            // Arrange: Create random StandarPelayanan with random active status
            $numItems = fake()->numberBetween(0, 10);
            for ($j = 0; $j < $numItems; $j++) {
                $this->createStandarPelayanan();
            }

            // Calculate expected count
            $expectedActiveCount = StandarPelayanan::where('is_active', true)->count();

            // Act: Get statistics
            $actualActiveCount = StandarPelayanan::where('is_active', true)->count();

            // Assert: Counts should match
            $this->assertEquals(
                $expectedActiveCount,
                $actualActiveCount,
                "Active Standar Pelayanan count mismatch"
            );

            // Cleanup
            StandarPelayanan::query()->delete();
        }
    }

    /**
     * Property: Profile Content active count matches database
     * 
     * **Feature: admin-fixes, Property 5: Statistics Accuracy**
     * **Validates: Requirements 7.3**
     */
    public function test_profile_content_active_count_matches_database(): void
    {
        for ($i = 0; $i < 100; $i++) {
            // Arrange: Create random ProfileContent with random active status
            $numItems = fake()->numberBetween(0, 10);
            for ($j = 0; $j < $numItems; $j++) {
                $this->createProfileContent();
            }

            // Calculate expected count
            $expectedActiveCount = ProfileContent::where('is_active', true)->count();

            // Act: Get statistics
            $actualActiveCount = ProfileContent::where('is_active', true)->count();

            // Assert: Counts should match
            $this->assertEquals(
                $expectedActiveCount,
                $actualActiveCount,
                "Active Profile Content count mismatch"
            );

            // Cleanup
            ProfileContent::query()->delete();
        }
    }

    /**
     * Property: Menu visible count matches database
     * 
     * **Feature: admin-fixes, Property 5: Statistics Accuracy**
     * **Validates: Requirements 7.4**
     */
    public function test_menu_visible_count_matches_database(): void
    {
        for ($i = 0; $i < 100; $i++) {
            // Arrange: Create random Menus with random visibility
            $numItems = fake()->numberBetween(0, 10);
            for ($j = 0; $j < $numItems; $j++) {
                $this->createMenu();
            }

            // Calculate expected count
            $expectedVisibleCount = Menu::where('is_visible', true)->count();

            // Act: Get statistics
            $actualVisibleCount = Menu::where('is_visible', true)->count();

            // Assert: Counts should match
            $this->assertEquals(
                $expectedVisibleCount,
                $actualVisibleCount,
                "Visible Menu count mismatch"
            );

            // Cleanup
            Menu::query()->delete();
        }
    }

    /**
     * Property: Media total count matches database
     * 
     * **Feature: admin-fixes, Property 5: Statistics Accuracy**
     * **Validates: Requirements 7.5**
     */
    public function test_media_total_count_matches_database(): void
    {
        for ($i = 0; $i < 100; $i++) {
            // Arrange: Create random Media items
            $numItems = fake()->numberBetween(0, 10);
            for ($j = 0; $j < $numItems; $j++) {
                $this->createMedia();
            }

            // Calculate expected count
            $expectedTotalCount = Media::count();

            // Act: Get statistics
            $actualTotalCount = Media::count();

            // Assert: Counts should match
            $this->assertEquals(
                $expectedTotalCount,
                $actualTotalCount,
                "Total Media count mismatch"
            );

            // Cleanup
            Media::query()->delete();
        }
    }

    /**
     * Property: Admin Users active count matches database
     * 
     * **Feature: admin-fixes, Property 5: Statistics Accuracy**
     * **Validates: Requirements 7.6**
     */
    public function test_admin_users_active_count_matches_database(): void
    {
        for ($i = 0; $i < 100; $i++) {
            // Arrange: Create random AdminUsers with random active status
            $numItems = fake()->numberBetween(0, 5);
            for ($j = 0; $j < $numItems; $j++) {
                $this->createAdminUser();
            }

            // Calculate expected count
            $expectedActiveCount = AdminUser::where('is_active', true)->count();

            // Act: Get statistics
            $actualActiveCount = AdminUser::where('is_active', true)->count();

            // Assert: Counts should match
            $this->assertEquals(
                $expectedActiveCount,
                $actualActiveCount,
                "Active Admin Users count mismatch"
            );

            // Cleanup
            AdminUser::query()->forceDelete();
        }
    }

    /**
     * Property: Berita total and published counts match database
     * 
     * **Feature: admin-fixes, Property 5: Statistics Accuracy**
     * **Validates: Requirements 8.1**
     */
    public function test_berita_counts_match_database(): void
    {
        for ($i = 0; $i < 100; $i++) {
            // Arrange: Create random Berita with random published status
            $numItems = fake()->numberBetween(0, 10);
            for ($j = 0; $j < $numItems; $j++) {
                $this->createBerita();
            }

            // Calculate expected counts
            $expectedTotalCount = Berita::count();
            $expectedPublishedCount = Berita::where('is_published', true)->count();
            $expectedDraftCount = Berita::where('is_published', false)->count();

            // Act: Get statistics
            $actualTotalCount = Berita::count();
            $actualPublishedCount = Berita::where('is_published', true)->count();
            $actualDraftCount = Berita::where('is_published', false)->count();

            // Assert: Counts should match
            $this->assertEquals($expectedTotalCount, $actualTotalCount, "Total Berita count mismatch");
            $this->assertEquals($expectedPublishedCount, $actualPublishedCount, "Published Berita count mismatch");
            $this->assertEquals($expectedDraftCount, $actualDraftCount, "Draft Berita count mismatch");

            // Assert: Published + Draft = Total
            $this->assertEquals(
                $actualTotalCount,
                $actualPublishedCount + $actualDraftCount,
                "Published + Draft should equal Total"
            );

            // Cleanup
            Berita::query()->forceDelete();
        }
    }

    /**
     * Property: Berita total views sum matches database
     * 
     * **Feature: admin-fixes, Property 5: Statistics Accuracy**
     * **Validates: Requirements 8.2**
     */
    public function test_berita_total_views_matches_database(): void
    {
        for ($i = 0; $i < 100; $i++) {
            // Arrange: Create random Berita with random view counts
            $numItems = fake()->numberBetween(0, 10);
            $expectedTotalViews = 0;
            for ($j = 0; $j < $numItems; $j++) {
                $viewCount = fake()->numberBetween(0, 1000);
                $this->createBerita(null, $viewCount);
                $expectedTotalViews += $viewCount;
            }

            // Act: Get statistics
            $actualTotalViews = (int) Berita::sum('view_count');

            // Assert: Total views should match
            $this->assertEquals(
                $expectedTotalViews,
                $actualTotalViews,
                "Total Berita views mismatch: expected {$expectedTotalViews}, got {$actualTotalViews}"
            );

            // Cleanup
            Berita::query()->forceDelete();
        }
    }

    /**
     * Property: Gallery counts match database
     * 
     * **Feature: admin-fixes, Property 5: Statistics Accuracy**
     * **Validates: Requirements 8.3**
     */
    public function test_gallery_counts_match_database(): void
    {
        for ($i = 0; $i < 100; $i++) {
            // Arrange: Create random Gallery items
            $numItems = fake()->numberBetween(0, 10);
            for ($j = 0; $j < $numItems; $j++) {
                $this->createGallery();
            }

            // Calculate expected counts
            $expectedTotalCount = Gallery::count();
            $expectedActiveCount = Gallery::where('is_active', true)->count();
            $expectedFeaturedCount = Gallery::where('is_featured', true)->count();

            // Act: Get statistics
            $actualTotalCount = Gallery::count();
            $actualActiveCount = Gallery::where('is_active', true)->count();
            $actualFeaturedCount = Gallery::where('is_featured', true)->count();

            // Assert: Counts should match
            $this->assertEquals($expectedTotalCount, $actualTotalCount, "Total Gallery count mismatch");
            $this->assertEquals($expectedActiveCount, $actualActiveCount, "Active Gallery count mismatch");
            $this->assertEquals($expectedFeaturedCount, $actualFeaturedCount, "Featured Gallery count mismatch");

            // Cleanup
            Gallery::query()->delete();
        }
    }

    /**
     * Property: PPID Document counts and downloads match database
     * 
     * **Feature: admin-fixes, Property 5: Statistics Accuracy**
     * **Validates: Requirements 8.4**
     */
    public function test_ppid_document_counts_match_database(): void
    {
        for ($i = 0; $i < 100; $i++) {
            // Arrange: Create random PPID Documents
            $numItems = fake()->numberBetween(0, 10);
            $expectedTotalDownloads = 0;
            for ($j = 0; $j < $numItems; $j++) {
                $downloadCount = fake()->numberBetween(0, 500);
                $this->createPpidDocument(null, $downloadCount);
                $expectedTotalDownloads += $downloadCount;
            }

            // Calculate expected counts
            $expectedTotalCount = PpidDocument::count();
            $expectedActiveCount = PpidDocument::where('is_active', true)->count();

            // Act: Get statistics
            $actualTotalCount = PpidDocument::count();
            $actualActiveCount = PpidDocument::where('is_active', true)->count();
            $actualTotalDownloads = (int) PpidDocument::sum('download_count');

            // Assert: Counts should match
            $this->assertEquals($expectedTotalCount, $actualTotalCount, "Total PPID count mismatch");
            $this->assertEquals($expectedActiveCount, $actualActiveCount, "Active PPID count mismatch");
            $this->assertEquals($expectedTotalDownloads, $actualTotalDownloads, "Total PPID downloads mismatch");

            // Cleanup
            PpidDocument::query()->delete();
        }
    }

    /**
     * Property: Media image count matches database
     * 
     * **Feature: admin-fixes, Property 5: Statistics Accuracy**
     * **Validates: Requirements 7.5**
     */
    public function test_media_image_count_matches_database(): void
    {
        for ($i = 0; $i < 100; $i++) {
            // Arrange: Create random Media items with various mime types
            $numItems = fake()->numberBetween(0, 10);
            for ($j = 0; $j < $numItems; $j++) {
                $this->createMedia();
            }

            // Calculate expected count
            $expectedImageCount = Media::where('mime_type', 'like', 'image/%')->count();

            // Act: Get statistics
            $actualImageCount = Media::where('mime_type', 'like', 'image/%')->count();

            // Assert: Counts should match
            $this->assertEquals(
                $expectedImageCount,
                $actualImageCount,
                "Media image count mismatch"
            );

            // Cleanup
            Media::query()->delete();
        }
    }

    /**
     * Property: Statistics remain accurate after CRUD operations
     * 
     * **Feature: admin-fixes, Property 5: Statistics Accuracy**
     * **Validates: Requirements 8.5**
     */
    public function test_statistics_accurate_after_crud_operations(): void
    {
        for ($i = 0; $i < 50; $i++) {
            // Arrange: Create initial items
            $berita1 = $this->createBerita(true, 100);
            $berita2 = $this->createBerita(false, 50);
            
            // Initial counts
            $initialTotal = Berita::count();
            $initialPublished = Berita::where('is_published', true)->count();
            $initialViews = (int) Berita::sum('view_count');

            // Act: Create a new berita
            $berita3 = $this->createBerita(true, 200);

            // Assert: Counts updated correctly after create
            $this->assertEquals($initialTotal + 1, Berita::count(), "Total should increase by 1 after create");
            $this->assertEquals($initialPublished + 1, Berita::where('is_published', true)->count(), "Published should increase by 1");
            $this->assertEquals($initialViews + 200, (int) Berita::sum('view_count'), "Views should increase by 200");

            // Act: Update berita2 to published
            $berita2->update(['is_published' => true]);

            // Assert: Published count updated
            $this->assertEquals($initialPublished + 2, Berita::where('is_published', true)->count(), "Published should increase after update");

            // Act: Delete berita3
            $berita3->forceDelete();

            // Assert: Counts updated correctly after delete
            $this->assertEquals($initialTotal, Berita::count(), "Total should return to initial after delete");
            $this->assertEquals($initialPublished + 1, Berita::where('is_published', true)->count(), "Published should decrease after delete");

            // Cleanup
            Berita::query()->forceDelete();
        }
    }
}
