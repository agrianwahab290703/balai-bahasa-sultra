<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

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
        'url',
        'external_url',
        'document_type',
        'file_type',
        'file_size',
        'download_count',
        'sort_order',
        'is_active',
        'last_downloaded_at',
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
        'last_downloaded_at' => 'datetime',
    ];

    protected $appends = [
        'is_external',
        'public_url',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
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

    public function getIsExternalAttribute(): bool
    {
        if (($this->attributes['document_type'] ?? 'file') === 'link') {
            return true;
        }

        if (!empty($this->attributes['external_url'])) {
            return true;
        }

        $url = $this->attributes['url'] ?? null;

        if (!$url) {
            return false;
        }

        return Str::startsWith(strtolower($url), ['http://', 'https://']);
    }

    public function getPublicUrlAttribute(): ?string
    {
        if (($this->document_type ?? 'file') === 'link') {
            return $this->external_url;
        }

        if (!$this->url) {
            return null;
        }

        if ($this->is_external) {
            return $this->url;
        }

        return Storage::disk('public')->url($this->url);
    }

    /**
     * Increment download count
     *
     * @return bool
     */
    public function incrementDownloadCount(): bool
    {
        return $this->increment('download_count', 1, [
            'last_downloaded_at' => now(),
        ]);
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
