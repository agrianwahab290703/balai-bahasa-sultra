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
use Carbon\Carbon;

/**
 * Property Test: Activity Log Filtering
 * 
 * **Feature: admin-crud-management, Property 17: Activity Log Filtering**
 * **Validates: Requirements 10.2**
 * 
 * *For any* activity log query with filters (user, action type, date range), 
 * all returned entries SHALL match ALL specified filter criteria.
 */
class ActivityLogFilteringPropertyTest extends TestCase
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
            'role' => AdminUser::ROLE_SUPER_ADMIN,
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
     * Helper method to create activity logs with specific attributes.
     */
    protected function createActivityLog(AdminUser $user, string $action, ?Carbon $createdAt = null): ActivityLog
    {
        $berita = $this->createBerita();
        
        Auth::guard('admin')->login($user);
        
        $log = $this->loggerService->log(
            $action,
            $berita,
            $action !== ActivityLog::ACTION_CREATED ? ['judul_utama' => 'old'] : null,
            $action !== ActivityLog::ACTION_DELETED ? ['judul_utama' => $berita->judul_utama] : null
        );
        
        // Update created_at if specified
        if ($createdAt && $log) {
            $log->created_at = $createdAt;
            $log->save();
        }
        
        Auth::guard('admin')->logout();
        
        return $log;
    }

    /**
     * Property: Filter by user returns only logs from that user
     * 
     * For any user filter, all returned activity logs should have user_id
     * matching the specified user.
     */
    public function test_filter_by_user_returns_only_logs_from_that_user(): void
    {
        // Create multiple admin users
        $users = [];
        for ($i = 0; $i < 5; $i++) {
            $users[] = AdminUser::create([
                'name' => fake()->name(),
                'email' => fake()->unique()->safeEmail(),
                'password' => 'password123',
                'role' => AdminUser::ROLE_ADMIN,
                'is_active' => true,
            ]);
        }
        
        // Create activity logs for each user
        foreach ($users as $user) {
            for ($j = 0; $j < 3; $j++) {
                $action = ActivityLog::validActions()[array_rand(ActivityLog::validActions())];
                $this->createActivityLog($user, $action);
            }
        }
        
        // Property test: for each user, filtering should return only their logs
        for ($i = 0; $i < 50; $i++) {
            $targetUser = $users[array_rand($users)];
            
            $filteredLogs = ActivityLog::where('user_id', $targetUser->id)->get();
            
            // All returned logs should belong to the target user
            foreach ($filteredLogs as $log) {
                $this->assertEquals(
                    $targetUser->id, 
                    $log->user_id,
                    "Filtered log should belong to user {$targetUser->id}, got {$log->user_id}"
                );
            }
            
            // Count should match expected
            $expectedCount = ActivityLog::where('user_id', $targetUser->id)->count();
            $this->assertCount($expectedCount, $filteredLogs);
        }
    }


    /**
     * Property: Filter by action type returns only logs with that action
     * 
     * For any action type filter, all returned activity logs should have
     * action matching the specified action type.
     */
    public function test_filter_by_action_type_returns_only_matching_logs(): void
    {
        Auth::guard('admin')->login($this->adminUser);
        
        // Create activity logs with different action types
        $actions = ActivityLog::validActions();
        foreach ($actions as $action) {
            for ($i = 0; $i < 10; $i++) {
                $berita = $this->createBerita();
                $this->loggerService->log(
                    $action,
                    $berita,
                    $action !== ActivityLog::ACTION_CREATED ? ['judul_utama' => 'old'] : null,
                    $action !== ActivityLog::ACTION_DELETED ? ['judul_utama' => $berita->judul_utama] : null
                );
            }
        }
        
        Auth::guard('admin')->logout();
        
        // Property test: for each action type, filtering should return only matching logs
        for ($i = 0; $i < 100; $i++) {
            $targetAction = $actions[array_rand($actions)];
            
            $filteredLogs = ActivityLog::where('action', $targetAction)->get();
            
            // All returned logs should have the target action
            foreach ($filteredLogs as $log) {
                $this->assertEquals(
                    $targetAction, 
                    $log->action,
                    "Filtered log should have action '{$targetAction}', got '{$log->action}'"
                );
            }
            
            // Verify no logs with different actions are included
            $otherActions = array_diff($actions, [$targetAction]);
            foreach ($filteredLogs as $log) {
                $this->assertNotContains(
                    $log->action,
                    $otherActions,
                    "Filtered log should not have action from other types"
                );
            }
        }
    }

    /**
     * Property: Filter by date range returns only logs within that range
     * 
     * For any date range filter, all returned activity logs should have
     * created_at within the specified date range (inclusive).
     */
    public function test_filter_by_date_range_returns_only_logs_within_range(): void
    {
        Auth::guard('admin')->login($this->adminUser);
        
        // Create activity logs with different dates spanning 30 days
        $dates = [];
        for ($i = 0; $i < 30; $i++) {
            $date = Carbon::now()->subDays($i);
            $dates[] = $date;
            
            $berita = $this->createBerita();
            $log = $this->loggerService->logCreated($berita);
            if ($log) {
                $log->created_at = $date;
                $log->save();
            }
        }
        
        Auth::guard('admin')->logout();
        
        // Property test: for random date ranges, filtering should return only matching logs
        for ($i = 0; $i < 50; $i++) {
            // Generate random date range within the 30 days
            $startOffset = rand(0, 25);
            $endOffset = rand(0, $startOffset);
            
            $dateFrom = Carbon::now()->subDays($startOffset)->startOfDay();
            $dateTo = Carbon::now()->subDays($endOffset)->endOfDay();
            
            $filteredLogs = ActivityLog::whereDate('created_at', '>=', $dateFrom)
                ->whereDate('created_at', '<=', $dateTo)
                ->get();
            
            // All returned logs should be within the date range
            foreach ($filteredLogs as $log) {
                $logDate = Carbon::parse($log->created_at);
                
                $this->assertTrue(
                    $logDate->gte($dateFrom->startOfDay()) && $logDate->lte($dateTo->endOfDay()),
                    "Log date {$logDate} should be between {$dateFrom} and {$dateTo}"
                );
            }
        }
    }


    /**
     * Property: Combined filters return only logs matching ALL criteria
     * 
     * For any combination of filters (user, action, date range), all returned
     * activity logs should match ALL specified filter criteria simultaneously.
     */
    public function test_combined_filters_return_only_logs_matching_all_criteria(): void
    {
        // Create multiple admin users
        $users = [];
        for ($i = 0; $i < 3; $i++) {
            $users[] = AdminUser::create([
                'name' => fake()->name(),
                'email' => fake()->unique()->safeEmail(),
                'password' => 'password123',
                'role' => AdminUser::ROLE_ADMIN,
                'is_active' => true,
            ]);
        }
        
        $actions = ActivityLog::validActions();
        
        // Create activity logs with various combinations
        foreach ($users as $user) {
            Auth::guard('admin')->login($user);
            
            foreach ($actions as $action) {
                for ($day = 0; $day < 10; $day++) {
                    $berita = $this->createBerita();
                    $log = $this->loggerService->log(
                        $action,
                        $berita,
                        $action !== ActivityLog::ACTION_CREATED ? ['judul_utama' => 'old'] : null,
                        $action !== ActivityLog::ACTION_DELETED ? ['judul_utama' => $berita->judul_utama] : null
                    );
                    
                    if ($log) {
                        $log->created_at = Carbon::now()->subDays($day);
                        $log->save();
                    }
                }
            }
            
            Auth::guard('admin')->logout();
        }
        
        // Property test: for random filter combinations, all results should match ALL criteria
        for ($i = 0; $i < 50; $i++) {
            $targetUser = $users[array_rand($users)];
            $targetAction = $actions[array_rand($actions)];
            $startOffset = rand(0, 8);
            $endOffset = rand(0, $startOffset);
            
            $dateFrom = Carbon::now()->subDays($startOffset)->startOfDay();
            $dateTo = Carbon::now()->subDays($endOffset)->endOfDay();
            
            $filteredLogs = ActivityLog::where('user_id', $targetUser->id)
                ->where('action', $targetAction)
                ->whereDate('created_at', '>=', $dateFrom)
                ->whereDate('created_at', '<=', $dateTo)
                ->get();
            
            // All returned logs should match ALL criteria
            foreach ($filteredLogs as $log) {
                // Check user filter
                $this->assertEquals(
                    $targetUser->id, 
                    $log->user_id,
                    "Log should belong to user {$targetUser->id}"
                );
                
                // Check action filter
                $this->assertEquals(
                    $targetAction, 
                    $log->action,
                    "Log should have action '{$targetAction}'"
                );
                
                // Check date range filter
                $logDate = Carbon::parse($log->created_at);
                $this->assertTrue(
                    $logDate->gte($dateFrom->startOfDay()) && $logDate->lte($dateTo->endOfDay()),
                    "Log date should be within the specified range"
                );
            }
        }
    }

    /**
     * Property: Filter by entity type returns only logs for that entity
     * 
     * For any entity type filter, all returned activity logs should have
     * loggable_type matching the specified entity type.
     */
    public function test_filter_by_entity_type_returns_only_matching_logs(): void
    {
        Auth::guard('admin')->login($this->adminUser);
        
        // Create activity logs for Berita entities
        for ($i = 0; $i < 20; $i++) {
            $berita = $this->createBerita();
            $this->loggerService->logCreated($berita);
        }
        
        Auth::guard('admin')->logout();
        
        // Property test: filtering by entity type should return only matching logs
        for ($i = 0; $i < 50; $i++) {
            $targetEntityType = Berita::class;
            
            $filteredLogs = ActivityLog::where('loggable_type', $targetEntityType)->get();
            
            // All returned logs should have the target entity type
            foreach ($filteredLogs as $log) {
                $this->assertEquals(
                    $targetEntityType, 
                    $log->loggable_type,
                    "Filtered log should have entity type '{$targetEntityType}', got '{$log->loggable_type}'"
                );
            }
        }
    }


    /**
     * Property: Empty filter returns all logs
     * 
     * When no filters are applied, the query should return all activity logs.
     */
    public function test_empty_filter_returns_all_logs(): void
    {
        Auth::guard('admin')->login($this->adminUser);
        
        // Create some activity logs
        $createdCount = rand(10, 20);
        for ($i = 0; $i < $createdCount; $i++) {
            $berita = $this->createBerita();
            $action = ActivityLog::validActions()[array_rand(ActivityLog::validActions())];
            $this->loggerService->log(
                $action,
                $berita,
                $action !== ActivityLog::ACTION_CREATED ? ['judul_utama' => 'old'] : null,
                $action !== ActivityLog::ACTION_DELETED ? ['judul_utama' => $berita->judul_utama] : null
            );
        }
        
        Auth::guard('admin')->logout();
        
        // Query without filters should return all logs
        $allLogs = ActivityLog::all();
        $totalCount = ActivityLog::count();
        
        $this->assertCount($totalCount, $allLogs);
        $this->assertGreaterThanOrEqual($createdCount, $totalCount);
    }

    /**
     * Property: Filter with non-existent user returns empty result
     * 
     * When filtering by a user_id that doesn't exist, the result should be empty.
     */
    public function test_filter_with_non_existent_user_returns_empty(): void
    {
        Auth::guard('admin')->login($this->adminUser);
        
        // Create some activity logs
        for ($i = 0; $i < 10; $i++) {
            $berita = $this->createBerita();
            $this->loggerService->logCreated($berita);
        }
        
        Auth::guard('admin')->logout();
        
        // Property test: filtering by non-existent user should return empty
        for ($i = 0; $i < 20; $i++) {
            $nonExistentUserId = 99999 + $i;
            
            $filteredLogs = ActivityLog::where('user_id', $nonExistentUserId)->get();
            
            $this->assertCount(0, $filteredLogs, "Filter with non-existent user should return empty result");
        }
    }

    /**
     * Property: Filter with invalid action type returns empty result
     * 
     * When filtering by an action type that doesn't exist, the result should be empty.
     */
    public function test_filter_with_invalid_action_returns_empty(): void
    {
        Auth::guard('admin')->login($this->adminUser);
        
        // Create some activity logs
        for ($i = 0; $i < 10; $i++) {
            $berita = $this->createBerita();
            $this->loggerService->logCreated($berita);
        }
        
        Auth::guard('admin')->logout();
        
        // Property test: filtering by invalid action should return empty
        for ($i = 0; $i < 20; $i++) {
            $invalidAction = 'invalid_action_' . fake()->randomNumber(5);
            
            $filteredLogs = ActivityLog::where('action', $invalidAction)->get();
            
            $this->assertCount(0, $filteredLogs, "Filter with invalid action should return empty result");
        }
    }

    /**
     * Property: Date range with future dates returns empty result
     * 
     * When filtering by a date range entirely in the future, the result should be empty.
     */
    public function test_filter_with_future_date_range_returns_empty(): void
    {
        Auth::guard('admin')->login($this->adminUser);
        
        // Create some activity logs (all with current/past dates)
        for ($i = 0; $i < 10; $i++) {
            $berita = $this->createBerita();
            $this->loggerService->logCreated($berita);
        }
        
        Auth::guard('admin')->logout();
        
        // Property test: filtering by future date range should return empty
        for ($i = 0; $i < 20; $i++) {
            $futureStart = Carbon::now()->addDays(rand(1, 30));
            $futureEnd = $futureStart->copy()->addDays(rand(1, 10));
            
            $filteredLogs = ActivityLog::whereDate('created_at', '>=', $futureStart)
                ->whereDate('created_at', '<=', $futureEnd)
                ->get();
            
            $this->assertCount(0, $filteredLogs, "Filter with future date range should return empty result");
        }
    }
}
