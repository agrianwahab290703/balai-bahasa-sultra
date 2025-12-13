<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GaleriFotoBerita extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'galeri_foto_berita';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'berita_id',
        'file_path',
        'file_name',
        'caption',
        'alt_text',
        'urutan',
        'tipe',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'urutan' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the news that owns the photo.
     */
    public function berita(): BelongsTo
    {
        return $this->belongsTo(Berita::class, 'berita_id');
    }

    /**
     * Get the full image URL.
     */
    public function getFullUrlAttribute(): string
    {
        if (filter_var($this->file_path, FILTER_VALIDATE_URL)) {
            return $this->file_path;
        }

        return asset($this->file_path);
    }

    /**
     * Get the thumbnail URL.
     */
    public function getThumbnailUrlAttribute(): string
    {
        if (filter_var($this->file_path, FILTER_VALIDATE_URL)) {
            return $this->file_path;
        }

        // Generate thumbnail path (you might want to implement actual thumbnail generation)
        $pathInfo = pathinfo($this->file_path);
        $thumbnailPath = $pathInfo['dirname'] . '/thumbnails/' . $pathInfo['filename'] . '_thumb.' . ($pathInfo['extension'] ?? 'jpg');

        return file_exists(public_path($thumbnailPath)) ? asset($thumbnailPath) : $this->full_url;
    }

    /**
     * Scope a query to get hero images.
     */
    public function scopeHero($query)
    {
        return $query->where('tipe', 'hero');
    }

    /**
     * Scope a query to get gallery images.
     */
    public function scopeGallery($query)
    {
        return $query->where('tipe', 'gallery');
    }

    /**
     * Scope a query to get thumbnails.
     */
    public function scopeThumbnail($query)
    {
        return $query->where('tipe', 'thumbnail');
    }

    /**
     * Scope a query to order by urutan.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('urutan');
    }
}