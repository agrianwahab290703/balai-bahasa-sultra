<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class AdminUser extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'admin_users';

    /**
     * Role constants.
     */
    public const ROLE_SUPER_ADMIN = 'super_admin';
    public const ROLE_ADMIN = 'admin';

    /**
     * Get all valid roles.
     *
     * @return array<string>
     */
    public static function validRoles(): array
    {
        return [
            self::ROLE_SUPER_ADMIN,
            self::ROLE_ADMIN,
        ];
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'is_active',
        'last_login_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'last_login_at' => 'datetime',
        ];
    }

    /**
     * Check if the user has a specific role.
     */
    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    /**
     * Check if the user is a super admin.
     */
    public function isSuperAdmin(): bool
    {
        return $this->hasRole(self::ROLE_SUPER_ADMIN);
    }

    /**
     * Check if the user is an admin (super_admin or admin).
     */
    public function isAdmin(): bool
    {
        return in_array($this->role, [self::ROLE_SUPER_ADMIN, self::ROLE_ADMIN]);
    }

    /**
     * Check if the user is active.
     */
    public function isActive(): bool
    {
        return $this->is_active === true;
    }

    /**
     * Validate if the role is valid.
     */
    public static function isValidRole(string $role): bool
    {
        return in_array($role, self::validRoles(), true);
    }

    /**
     * Scope to filter active users only.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to filter by role.
     */
    public function scopeOfRole($query, string $role)
    {
        return $query->where('role', $role);
    }

    /**
     * Get the media uploaded by this admin user.
     */
    public function uploadedMedia(): HasMany
    {
        return $this->hasMany(Media::class, 'uploaded_by');
    }

    /**
     * Get the activity logs for this admin user.
     */
    public function activityLogs(): HasMany
    {
        return $this->hasMany(ActivityLog::class, 'user_id');
    }
}
