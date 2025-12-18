<?php

namespace App\Models;

use App\Traits\HasActivityLog;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Gallery extends Model
{
    use HasFactory, HasActivityLog, SoftDeletes;

    /**
     * Maximum number of featured items allowed.
     * @see Requirements 2.5
     */
    public const MAX_FEATURED_ITEMS = 6;

    protected $fillable = [
        'name',
        'slug',
        'title',
        'description',
        'image',
        'thumbnail',
        'category',
        'is_featured',
        'is_active',
        'sort_order',
        'user_id',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    protected $appends = ['date', 'image_url', 'thumbnail_url'];

    protected $attributes = [
        'is_featured' => false,
        'is_active' => true,
        'sort_order' => 0,
    ];

    public function getDateAttribute(): string
    {
        return $this->created_at?->format('d M Y') ?? '';
    }

    public function getImageUrlAttribute(): ?string
    {
        if (!$this->image) {
            return null;
        }
        $img = ltrim($this->image, '/');
        if (str_starts_with($img, 'http')) {
            return $img;
        }
        if (str_starts_with($img, 'storage/')) {
            $img = substr($img, strlen('storage/'));
        }
        return asset('storage/' . $img);
    }

    public function getThumbnailUrlAttribute(): ?string
    {
        if ($this->thumbnail) {
            $thumb = ltrim($this->thumbnail, '/');
            if (str_starts_with($thumb, 'http')) {
                return $thumb;
            }
            if (str_starts_with($thumb, 'storage/')) {
                $thumb = substr($thumb, strlen('storage/'));
            }
            return asset('storage/' . $thumb);
        }
        return $this->image_url;
    }

    /**
     * Scope to get only active galleries.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to get only featured galleries.
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope to order by sort_order.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order', 'asc');
    }

    /**
     * Get the count of currently featured items.
     */
    public static function featuredCount(): int
    {
        return static::where('is_featured', true)->count();
    }

    /**
     * Check if more items can be featured.
     */
    public static function canFeatureMore(): bool
    {
        return static::featuredCount() < static::MAX_FEATURED_ITEMS;
    }

    /**
     * Get predefined categories.
     */
    public static function categories(): array
    {
        return [
            'kegiatan' => 'Kegiatan',
            'acara' => 'Acara',
            'dokumentasi' => 'Dokumentasi',
            'penghargaan' => 'Penghargaan',
            'lainnya' => 'Lainnya',
        ];
    }
}
