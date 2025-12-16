<?php

namespace App\Traits;

use App\Models\ActivityLog;
use App\Services\ActivityLoggerService;
use Illuminate\Database\Eloquent\Relations\MorphMany;

/**
 * Trait HasActivityLog
 * 
 * Provides automatic activity logging for Eloquent models.
 * When a model uses this trait, all create, update, and delete
 * operations will be automatically logged to the activity_logs table.
 * 
 * @see Requirements 10.1
 */
trait HasActivityLog
{
    /**
     * Store the original attributes before update for comparison.
     *
     * @var array
     */
    protected array $activityLogOriginalAttributes = [];

    /**
     * Boot the trait.
     */
    public static function bootHasActivityLog(): void
    {
        // Log when a model is created
        static::created(function ($model) {
            if (!static::isActivityLoggingDisabled()) {
                $model->logActivity(ActivityLog::ACTION_CREATED);
            }
        });

        // Store original attributes before updating
        static::updating(function ($model) {
            if (!static::isActivityLoggingDisabled()) {
                $model->activityLogOriginalAttributes = $model->getOriginal();
            }
        });

        // Log when a model is updated
        static::updated(function ($model) {
            if (!static::isActivityLoggingDisabled()) {
                $model->logActivity(
                    ActivityLog::ACTION_UPDATED,
                    $model->activityLogOriginalAttributes
                );
            }
        });

        // Log when a model is deleted (including soft deletes)
        static::deleted(function ($model) {
            if (!static::isActivityLoggingDisabled()) {
                $model->logActivity(ActivityLog::ACTION_DELETED);
            }
        });
    }

    /**
     * Get all activity logs for this model.
     */
    public function activityLogs(): MorphMany
    {
        return $this->morphMany(ActivityLog::class, 'loggable');
    }

    /**
     * Log an activity for this model.
     *
     * @param string $action The action type (created, updated, deleted)
     * @param array|null $oldValues Previous values (for updates)
     * @return ActivityLog|null
     */
    protected function logActivity(string $action, ?array $oldValues = null): ?ActivityLog
    {
        $logger = app(ActivityLoggerService::class);

        switch ($action) {
            case ActivityLog::ACTION_CREATED:
                return $logger->logCreated($this);
            
            case ActivityLog::ACTION_UPDATED:
                return $logger->logUpdated($this, $oldValues ?? []);
            
            case ActivityLog::ACTION_DELETED:
                return $logger->logDeleted($this);
            
            default:
                return null;
        }
    }

    /**
     * Get the recent activity logs for this model.
     *
     * @param int $limit
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getRecentActivityLogs(int $limit = 10)
    {
        return $this->activityLogs()
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get the last activity log for this model.
     *
     * @return ActivityLog|null
     */
    public function getLastActivityLog(): ?ActivityLog
    {
        return $this->activityLogs()
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->first();
    }

    /**
     * Check if this model has any activity logs.
     *
     * @return bool
     */
    public function hasActivityLogs(): bool
    {
        return $this->activityLogs()->exists();
    }

    /**
     * Get activity logs filtered by action type.
     *
     * @param string $action
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getActivityLogsByAction(string $action)
    {
        return $this->activityLogs()
            ->where('action', $action)
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Disable activity logging temporarily.
     * 
     * Use this when you need to perform operations without logging.
     *
     * @return void
     */
    public static function disableActivityLogging(): void
    {
        static::$activityLoggingDisabled = true;
    }

    /**
     * Enable activity logging.
     *
     * @return void
     */
    public static function enableActivityLogging(): void
    {
        static::$activityLoggingDisabled = false;
    }

    /**
     * Check if activity logging is disabled.
     *
     * @return bool
     */
    public static function isActivityLoggingDisabled(): bool
    {
        return static::$activityLoggingDisabled ?? false;
    }

    /**
     * Flag to track if activity logging is disabled.
     *
     * @var bool
     */
    protected static bool $activityLoggingDisabled = false;
}
