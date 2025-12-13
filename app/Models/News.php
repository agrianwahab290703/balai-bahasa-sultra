<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;

class News extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'featured_image',
        'status',
        'view_count',
        'published_at',
        'user_id',
        'category',
        'categories',
        'source_url',
        'sentiment',
        'validation_status',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'categories' => 'array',
    ];

    /**
     * Get the translations for this news item
     */
    public function translations(): HasMany
    {
        return $this->hasMany(NewsTranslation::class);
    }

    /**
     * Get the images for this news item
     */
    public function images(): HasMany
    {
        return $this->hasMany(NewsImage::class)->orderBy('sort_order');
    }

    /**
     * Get the author of this news item
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Scope for published news
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', 'published')
                    ->where('published_at', '<=', now());
    }

    /**
     * Scope for filtering by locale
     */
    public function scopeByLocale(Builder $query, string $locale): Builder
    {
        return $query->with(['translations' => function ($query) use ($locale) {
            $query->where('locale', $locale);
        }]);
    }

    /**
     * Scope for filtering by category
     */
    public function scopeByCategory(Builder $query, string $category): Builder
    {
        return $query->where(function ($q) use ($category) {
            $q->where('category', $category)
              ->orWhereJsonContains('categories', $category);
        });
    }

    /**
     * Get the full image URL
     */
    public function getFeaturedImageUrlAttribute(): ?string
    {
        if (!$this->featured_image) {
            return null;
        }
        
        if (str_starts_with($this->featured_image, 'http')) {
            return $this->featured_image;
        }
        
        return '/' . ltrim($this->featured_image, '/');
    }

    /**
     * Get the primary category
     */
    public function getPrimaryCategoryAttribute(): string
    {
        if ($this->category) {
            return $this->category;
        }
        
        if ($this->categories && is_array($this->categories) && count($this->categories) > 0) {
            return $this->categories[0];
        }
        
        return 'Berita';
    }
}
