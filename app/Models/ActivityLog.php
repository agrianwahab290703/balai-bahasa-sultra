<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class ActivityLog extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'action',
        'loggable_type',
        'loggable_id',
        'old_values',
        'new_values',
        'ip_address',
        'user_agent',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'old_values' => 'array',
            'new_values' => 'array',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * Valid action types for activity logs.
     */
    public const ACTION_CREATED = 'created';
    public const ACTION_UPDATED = 'updated';
    public const ACTION_DELETED = 'deleted';

    /**
     * Get all valid action types.
     *
     * @return array<string>
     */
    public static function validActions(): array
    {
        return [
            self::ACTION_CREATED,
            self::ACTION_UPDATED,
            self::ACTION_DELETED,
        ];
    }

    /**
     * Get the admin user who performed the action.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(AdminUser::class, 'user_id');
    }

    /**
     * Get the loggable entity (polymorphic).
     */
    public function loggable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Scope to filter by action type.
     */
    public function scopeOfAction($query, string $action)
    {
        return $query->where('action', $action);
    }

    /**
     * Scope to filter by user.
     */
    public function scopeByUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope to filter by date range.
     */
    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('created_at', [$startDate, $endDate]);
    }

    /**
     * Scope to filter by loggable type.
     */
    public function scopeForModel($query, string $modelClass)
    {
        return $query->where('loggable_type', $modelClass);
    }

    /**
     * Get recent activity logs.
     */
    public function scopeRecent($query, int $limit = 50)
    {
        return $query->orderBy('created_at', 'desc')->limit($limit);
    }
}
