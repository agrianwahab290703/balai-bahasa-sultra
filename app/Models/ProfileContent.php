<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProfileContent extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'title',
        'content',
        'images',
        'metadata',
        'order',
        'is_active',
    ];

    protected $casts = [
        'images' => 'array',
        'metadata' => 'array',
        'is_active' => 'boolean',
    ];

    /**
     * Scope to get content by type
     */
    public function scopeByType($query, string $type)
    {
        return $query->where('type', $type)->where('is_active', true)->orderBy('order');
    }

    /**
     * Get sejarah (history) content
     */
    public static function getSejarah()
    {
        return static::byType('sejarah')->get();
    }

    /**
     * Get visi-misi content
     */
    public static function getVisiMisi()
    {
        return static::byType('visi-misi')->get();
    }
}
