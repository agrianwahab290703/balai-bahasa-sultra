<?php

namespace App\Services;

use App\Models\ActivityLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

/**
 * Service for logging activity on models.
 * 
 * Implements automatic old/new value tracking and captures
 * IP address and user agent for audit purposes.
 * 
 * @see Requirements 10.1, 10.3
 */
class ActivityLoggerService
{
    /**
     * Log an activity for a model.
     *
     * @param string $action The action type (created, updated, deleted)
     * @param Model $model The model being logged
     * @param array|null $oldValues Previous values (for updates/deletes)
     * @param array|null $newValues New values (for creates/updates)
     * @return ActivityLog|null The created activity log entry, or null if no user
     */
    public function log(
        string $action,
        Model $model,
        ?array $oldValues = null,
        ?array $newValues = null
    ): ?ActivityLog {
        // Validate action type
        if (!in_array($action, ActivityLog::validActions(), true)) {
            throw new \InvalidArgumentException(
                "Invalid action type: {$action}. Valid actions are: " . 
                implode(', ', ActivityLog::validActions())
            );
        }

        // Get the authenticated admin user
        $userId = $this->getAuthenticatedUserId();
        
        // If no user is authenticated, we cannot log the activity
        if ($userId === null) {
            return null;
        }

        return ActivityLog::create([
            'user_id' => $userId,
            'action' => $action,
            'loggable_type' => get_class($model),
            'loggable_id' => $model->getKey(),
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'ip_address' => $this->getIpAddress(),
            'user_agent' => $this->getUserAgent(),
        ]);
    }


    /**
     * Log a create action for a model.
     *
     * @param Model $model The created model
     * @return ActivityLog|null
     */
    public function logCreated(Model $model): ?ActivityLog
    {
        return $this->log(
            ActivityLog::ACTION_CREATED,
            $model,
            null,
            $this->getModelAttributes($model)
        );
    }

    /**
     * Log an update action for a model.
     *
     * @param Model $model The updated model
     * @param array $oldValues The original values before update
     * @return ActivityLog|null
     */
    public function logUpdated(Model $model, array $oldValues): ?ActivityLog
    {
        $newValues = $this->getModelAttributes($model);
        
        // Only log if there are actual changes
        $changes = $this->getChangedAttributes($oldValues, $newValues);
        if (empty($changes['old']) && empty($changes['new'])) {
            return null;
        }

        return $this->log(
            ActivityLog::ACTION_UPDATED,
            $model,
            $changes['old'],
            $changes['new']
        );
    }

    /**
     * Log a delete action for a model.
     *
     * @param Model $model The deleted model
     * @return ActivityLog|null
     */
    public function logDeleted(Model $model): ?ActivityLog
    {
        return $this->log(
            ActivityLog::ACTION_DELETED,
            $model,
            $this->getModelAttributes($model),
            null
        );
    }

    /**
     * Get activity logs for a specific model.
     *
     * @param Model $model The model to get logs for
     * @return Collection
     */
    public function getLogsForModel(Model $model): Collection
    {
        return ActivityLog::where('loggable_type', get_class($model))
            ->where('loggable_id', $model->getKey())
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Get recent activity logs.
     *
     * @param int $limit Maximum number of logs to return
     * @return Collection
     */
    public function getRecentLogs(int $limit = 50): Collection
    {
        return ActivityLog::with('user')
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get the authenticated admin user ID.
     *
     * @return int|null
     */
    protected function getAuthenticatedUserId(): ?int
    {
        // Try admin guard first if it exists
        try {
            $user = Auth::guard('admin')->user();
            if ($user) {
                return $user->id;
            }
        } catch (\InvalidArgumentException $e) {
            // Admin guard not defined, continue to fallback
        }

        // Fallback to default guard
        $user = Auth::user();
        
        return $user?->id;
    }

    /**
     * Get the client IP address.
     *
     * @return string|null
     */
    protected function getIpAddress(): ?string
    {
        return Request::ip();
    }

    /**
     * Get the client user agent.
     *
     * @return string|null
     */
    protected function getUserAgent(): ?string
    {
        $userAgent = Request::userAgent();
        
        // Truncate if too long (database column is varchar)
        if ($userAgent && strlen($userAgent) > 255) {
            return substr($userAgent, 0, 255);
        }
        
        return $userAgent;
    }

    /**
     * Get model attributes for logging, excluding sensitive fields.
     *
     * @param Model $model
     * @return array
     */
    protected function getModelAttributes(Model $model): array
    {
        $attributes = $model->getAttributes();
        
        // Remove sensitive fields
        $sensitiveFields = ['password', 'remember_token', 'api_token'];
        foreach ($sensitiveFields as $field) {
            unset($attributes[$field]);
        }
        
        return $attributes;
    }

    /**
     * Get only the changed attributes between old and new values.
     *
     * @param array $oldValues
     * @param array $newValues
     * @return array{old: array, new: array}
     */
    protected function getChangedAttributes(array $oldValues, array $newValues): array
    {
        $changedOld = [];
        $changedNew = [];
        
        // Find changed values
        foreach ($newValues as $key => $newValue) {
            $oldValue = $oldValues[$key] ?? null;
            
            if ($oldValue !== $newValue) {
                $changedOld[$key] = $oldValue;
                $changedNew[$key] = $newValue;
            }
        }
        
        // Find removed values
        foreach ($oldValues as $key => $oldValue) {
            if (!array_key_exists($key, $newValues)) {
                $changedOld[$key] = $oldValue;
                $changedNew[$key] = null;
            }
        }
        
        return [
            'old' => $changedOld,
            'new' => $changedNew,
        ];
    }
}
