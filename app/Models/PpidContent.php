<?php

namespace App\Models;

use App\Helpers\SlugGenerator;
use App\Traits\HasActivityLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PpidContent extends Model
{
    use HasFactory, HasActivityLog;

    /**
     * PPID content categories
     */
    public const CATEGORIES = [
        'profil' => 'Profil PPID',
        'informasi_publik' => 'Informasi Publik',
        'permohonan' => 'Permohonan Info',
        'keberatan' => 'Pengajuan Keberatan',
    ];

    /**
     * Sub-categories for 'informasi_publik' category
     */
    public const SUB_CATEGORIES = [
        'berkala' => 'Informasi Berkala',
        'serta_merta' => 'Informasi Serta Merta',
        'setiap_saat' => 'Informasi Setiap Saat',
        'dikecualikan' => 'Informasi Dikecualikan',
    ];

    protected $fillable = [
        'title',
        'slug',
        'category',
        'sub_category',
        'content',
        'image_path',
        'document_path',
        'status',
        'published_at',
        'created_by',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer',
        'published_at' => 'datetime',
    ];

    protected $appends = ['image_url', 'document_url', 'category_label', 'sub_category_label'];

    /**
     * Boot the model
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->slug)) {
                $model->slug = SlugGenerator::generate($model->title, self::class);
            }
            if (empty($model->published_at)) {
                $model->published_at = now();
            }
        });

        static::updating(function ($model) {
            if ($model->isDirty('title') && !$model->isDirty('slug')) {
                $model->slug = SlugGenerator::generate($model->title, self::class, $model->id);
            }
        });
    }

    /**
     * Get the admin user who created the content
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(AdminUser::class, 'created_by');
    }

    /**
     * Get full URL for image
     */
    public function getImageUrlAttribute(): ?string
    {
        if (!$this->image_path) {
            return null;
        }
        return asset('storage/' . $this->image_path);
    }

    /**
     * Get full URL for document
     */
    public function getDocumentUrlAttribute(): ?string
    {
        if (!$this->document_path) {
            return null;
        }
        return asset('storage/' . $this->document_path);
    }

    /**
     * Get human-readable category label
     */
    public function getCategoryLabelAttribute(): string
    {
        return self::CATEGORIES[$this->category] ?? $this->category;
    }

    /**
     * Get human-readable sub-category label
     */
    public function getSubCategoryLabelAttribute(): ?string
    {
        if (!$this->sub_category) {
            return null;
        }
        return self::SUB_CATEGORIES[$this->sub_category] ?? $this->sub_category;
    }

    /**
     * Scope: Active and published content
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope: Published content only
     */
    public function scopePublished($query)
    {
        return $query->where('status', 'published')
            ->where('is_active', true);
    }

    /**
     * Scope: Order by order column
     */
    public function scopeOrderByOrder($query)
    {
        return $query->orderBy('order', 'asc');
    }

    /**
     * Scope: Filter by category
     */
    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Scope: Filter by sub-category
     */
    public function scopeBySubCategory($query, $subCategory)
    {
        return $query->where('sub_category', $subCategory);
    }

    /**
     * Scope: Legacy type filter (for backward compatibility)
     */
    public function scopeByType($query, $type)
    {
        return $query->where('category', $type);
    }
}
