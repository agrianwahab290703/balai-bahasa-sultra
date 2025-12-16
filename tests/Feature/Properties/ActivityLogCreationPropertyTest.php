<?php

namespace Tests\Feature\Properties;

use App\Models\ActivityLog;
use App\Models\AdminUser;
use App\Models\Berita;
use App\Services\ActivityLoggerService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;
use Tests\TestCase;

/**
 * Property Test: Activity Log Creation
 * 
 * **Feature: admin-crud-management, Property 16: Activity Log Creation**
 * **Validates: Requirements 10.1**
 * 
 * *For any* create, update, or delete operation on a loggable entity, 
 * an activity log entry SHALL be created with correct action type, 
 * user_id, and affected entity reference.
 */
class ActivityLogCreationPropertyTest extends TestCase
{
    use RefreshDatabase;

    protected ActivityLoggerService $loggerService;
    protected AdminUser $adminUser;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->loggerService = new ActivityLoggerService();
        
        // Configure admin guard for testing
        Config::set('auth.guards.admin', [
            'driver' => 'session',
            'provider' => 'admin_users',
        ]);
        Config::set('auth.providers.admin_users', [
            'driver' => 'eloquent',
            'model' => AdminUser::class,
        ]);
        
        // Create an admin user for testing
        $this->adminUser = AdminUser::create([
            'name' => 'Test Admin',
            'email' => 'admin@test.com',
            'password' => 'password123',
            'role' => AdminUser::ROLE_ADMIN,
            'is_active' => true,
        ]);
    }

    /**
     * Helper method to create a valid Berita instance with all required fields.
     */
    protected function createBerita(array $overrides = []): Berita
    {
        return Berita::create(array_merge([
            'judul_utama' => fake()->sentence(),
            'slug' => fake()->unique()->slug(),
            'ringkasan_inti' => fake()->paragraph(),
            'hero_image' => '/images/news/test.jpg',
            'hero_image_alt' => fake()->sentence(),
            'lokasi' => 'Kendari',
            'tanggal_rilis' => now(),
            'teras_berita' => fake()->paragraph(),
            'kategori' => 'kegiatan',
            'is_published' => true,
        ], $overrides));
    }


    /**
     * Property: Activity log is created for any valid action type
     * 
     * For any valid action type (created, updated, deleted), logging an action
     * should create an activity log entry with the correct action type.
     */
    public function test_activity_log_created_for_valid_action_types(): void
    {
        Auth::guard('admin')->login($this->adminUser);
        
        $validActions = ActivityLog::validActions();
        
        // Property test: run 100 iterations with random valid actions
        for ($i = 0; $i < 100; $i++) {
            $action = $validActions[array_rand($validActions)];
            
            $berita = $this->createBerita();
            
            $log = $this->loggerService->log(
                $action,
                $berita,
                $action === ActivityLog::ACTION_CREATED ? null : ['judul_utama' => 'old'],
                $action === ActivityLog::ACTION_DELETED ? null : ['judul_utama' => $berita->judul_utama]
            );
            
            $this->assertNotNull($log, "Activity log should be created for action: {$action}");
            $this->assertEquals($action, $log->action);
            $this->assertContains($log->action, $validActions);
        }
    }

    /**
     * Property: Activity log contains correct user_id
     * 
     * For any logged action, the user_id in the activity log should match
     * the authenticated admin user's ID.
     */
    public function test_activity_log_contains_correct_user_id(): void
    {
        // Property test: run 100 iterations with different admin users
        for ($i = 0; $i < 100; $i++) {
            $adminUser = AdminUser::create([
                'name' => fake()->name(),
                'email' => fake()->unique()->safeEmail(),
                'password' => 'password123',
                'role' => AdminUser::validRoles()[array_rand(AdminUser::validRoles())],
                'is_active' => true,
            ]);
            
            Auth::guard('admin')->login($adminUser);
            
            $berita = $this->createBerita();
            
            $log = $this->loggerService->logCreated($berita);
            
            $this->assertNotNull($log);
            $this->assertEquals($adminUser->id, $log->user_id);
            $this->assertEquals($adminUser->id, $log->user->id);
            
            Auth::guard('admin')->logout();
        }
    }

    /**
     * Property: Activity log contains correct entity reference
     * 
     * For any logged action on a model, the loggable_type and loggable_id
     * should correctly reference the affected entity.
     */
    public function test_activity_log_contains_correct_entity_reference(): void
    {
        Auth::guard('admin')->login($this->adminUser);
        
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            $berita = $this->createBerita(['is_published' => fake()->boolean()]);
            
            $action = ActivityLog::validActions()[array_rand(ActivityLog::validActions())];
            
            $log = $this->loggerService->log(
                $action,
                $berita,
                $action !== ActivityLog::ACTION_CREATED ? ['judul_utama' => 'old'] : null,
                $action !== ActivityLog::ACTION_DELETED ? ['judul_utama' => $berita->judul_utama] : null
            );
            
            $this->assertEquals(Berita::class, $log->loggable_type);
            $this->assertEquals($berita->id, $log->loggable_id);
            $this->assertInstanceOf(Berita::class, $log->loggable);
            $this->assertEquals($berita->id, $log->loggable->id);
        }
    }

    /**
     * Property: Created action logs new values only
     * 
     * For any create action, the activity log should have null old_values
     * and non-null new_values containing the created entity's attributes.
     */
    public function test_created_action_logs_new_values_only(): void
    {
        Auth::guard('admin')->login($this->adminUser);
        
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            $judul = fake()->sentence();
            $slug = fake()->unique()->slug();
            
            $berita = $this->createBerita([
                'judul_utama' => $judul,
                'slug' => $slug,
            ]);
            
            $log = $this->loggerService->logCreated($berita);
            
            $this->assertNull($log->old_values);
            $this->assertNotNull($log->new_values);
            $this->assertIsArray($log->new_values);
            $this->assertEquals($judul, $log->new_values['judul_utama']);
            $this->assertEquals($slug, $log->new_values['slug']);
        }
    }

    /**
     * Property: Deleted action logs old values only
     * 
     * For any delete action, the activity log should have non-null old_values
     * and null new_values.
     */
    public function test_deleted_action_logs_old_values_only(): void
    {
        Auth::guard('admin')->login($this->adminUser);
        
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            $judul = fake()->sentence();
            $slug = fake()->unique()->slug();
            
            $berita = $this->createBerita([
                'judul_utama' => $judul,
                'slug' => $slug,
            ]);
            
            $log = $this->loggerService->logDeleted($berita);
            
            $this->assertNull($log->new_values);
            $this->assertNotNull($log->old_values);
            $this->assertIsArray($log->old_values);
            $this->assertEquals($judul, $log->old_values['judul_utama']);
            $this->assertEquals($slug, $log->old_values['slug']);
        }
    }


    /**
     * Property: Updated action logs both old and new values
     * 
     * For any update action with actual changes, the activity log should
     * have both old_values and new_values containing only the changed fields.
     */
    public function test_updated_action_logs_changed_values(): void
    {
        Auth::guard('admin')->login($this->adminUser);
        
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            $oldJudul = fake()->sentence();
            $newJudul = fake()->sentence();
            
            $berita = $this->createBerita(['judul_utama' => $oldJudul]);
            
            $oldValues = $berita->getAttributes();
            
            // Update the model
            $berita->judul_utama = $newJudul;
            $berita->save();
            
            $log = $this->loggerService->logUpdated($berita, $oldValues);
            
            $this->assertNotNull($log);
            $this->assertNotNull($log->old_values);
            $this->assertNotNull($log->new_values);
            $this->assertArrayHasKey('judul_utama', $log->old_values);
            $this->assertArrayHasKey('judul_utama', $log->new_values);
            $this->assertEquals($oldJudul, $log->old_values['judul_utama']);
            $this->assertEquals($newJudul, $log->new_values['judul_utama']);
        }
    }

    /**
     * Property: No log created without authenticated user
     * 
     * For any action without an authenticated user, no activity log
     * should be created.
     */
    public function test_no_log_created_without_authenticated_user(): void
    {
        // Ensure no user is authenticated
        Auth::guard('admin')->logout();
        Auth::logout();
        
        // Property test: run 100 iterations
        for ($i = 0; $i < 100; $i++) {
            $berita = $this->createBerita();
            
            $action = ActivityLog::validActions()[array_rand(ActivityLog::validActions())];
            
            $log = $this->loggerService->log(
                $action,
                $berita,
                null,
                ['judul_utama' => $berita->judul_utama]
            );
            
            $this->assertNull($log);
        }
    }

    /**
     * Property: Invalid action types are rejected
     * 
     * For any invalid action type, the log method should throw an exception.
     */
    public function test_invalid_action_types_are_rejected(): void
    {
        Auth::guard('admin')->login($this->adminUser);
        
        $berita = $this->createBerita();
        
        // Test with a single invalid action to verify exception is thrown
        $invalidAction = 'invalid_action_' . fake()->randomNumber(5);
        
        $this->expectException(\InvalidArgumentException::class);
        $this->loggerService->log($invalidAction, $berita);
    }
}
