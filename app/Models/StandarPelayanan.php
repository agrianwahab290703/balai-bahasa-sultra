<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class StandarPelayanan extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'standar_pelayanans';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'description',
        'category',
        'url',
        'file_type',
        'file_size',
        'download_count',
        'sort_order',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'file_size' => 'integer',
        'download_count' => 'integer',
        'sort_order' => 'integer',
        'is_active' => 'boolean',
    ];

    /**
     * Category constants
     */
    const CATEGORY_UMUM = 'Umum';
    const CATEGORY_UKBI = 'UKBI';
    const CATEGORY_BIPA = 'BIPA';
    const CATEGORY_AHLI_BAHASA = 'Ahli Bahasa';
    const CATEGORY_PENERJEMAH = 'Penerjemah';
    const CATEGORY_PERPUSTAKAAN = 'Perpustakaan';
    const CATEGORY_DATA = 'Data & Informasi';

    /**
     * Get all available categories
     *
     * @return array<string>
     */
    public static function getCategories(): array
    {
        return [
            self::CATEGORY_UMUM,
            self::CATEGORY_UKBI,
            self::CATEGORY_BIPA,
            self::CATEGORY_AHLI_BAHASA,
            self::CATEGORY_PENERJEMAH,
            self::CATEGORY_PERPUSTAKAAN,
            self::CATEGORY_DATA,
        ];
    }

    /**
     * Scope to filter active records
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to filter by category
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $category
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Scope to order by sort order
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order');
    }

    /**
     * Increment download count
     *
     * @return bool
     */
    public function incrementDownloadCount(): bool
    {
        return $this->increment('download_count');
    }

    /**
     * Get human readable file size
     *
     * @return string
     */
    public function getFormattedFileSizeAttribute(): string
    {
        if (!$this->file_size) {
            return '-';
        }

        $bytes = $this->file_size;
        $units = ['B', 'KB', 'MB', 'GB'];
        $i = 0;

        while ($bytes >= 1024 && $i < count($units) - 1) {
            $bytes /= 1024;
            $i++;
        }

        return round($bytes, 2) . ' ' . $units[$i];
    }
}
