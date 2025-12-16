<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Media extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'filename',
        'path',
        'mime_type',
        'size',
        'width',
        'height',
        'alt_text',
        'uploaded_by',
        'thumbnail_path',
        'metadata',
        'usage_count',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'size' => 'integer',
            'width' => 'integer',
            'height' => 'integer',
            'metadata' => 'array',
            'usage_count' => 'integer',
        ];
    }

    /**
     * Get the admin user who uploaded this media.
     */
    public function uploader(): BelongsTo
    {
        return $this->belongsTo(AdminUser::class, 'uploaded_by');
    }

    /**
     * Get the full URL for the media file.
     */
    public function getUrlAttribute(): string
    {
        return Storage::url($this->path);
    }

    /**
     * Get the full URL for the thumbnail.
     */
    public function getThumbnailUrlAttribute(): ?string
    {
        if ($this->thumbnail_path) {
            return Storage::url($this->thumbnail_path);
        }
        
        // Return main image URL for images without thumbnail
        if ($this->isImage()) {
            return $this->url;
        }
        
        return null;
    }

    /**
     * Check if the media is an image.
     */
    public function isImage(): bool
    {
        return str_starts_with($this->mime_type, 'image/');
    }

    /**
     * Check if the media is a document.
     */
    public function isDocument(): bool
    {
        $documentTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ];
        
        return in_array($this->mime_type, $documentTypes);
    }

    /**
     * Get human-readable file size.
     */
    public function getHumanSizeAttribute(): string
    {
        $bytes = $this->size;
        $units = ['B', 'KB', 'MB', 'GB'];
        
        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, 2) . ' ' . $units[$i];
    }

    /**
     * Increment the usage count.
     */
    public function incrementUsage(): void
    {
        $this->increment('usage_count');
    }

    /**
     * Decrement the usage count.
     */
    public function decrementUsage(): void
    {
        if ($this->usage_count > 0) {
            $this->decrement('usage_count');
        }
    }

    /**
     * Check if the media is in use.
     */
    public function isInUse(): bool
    {
        return $this->usage_count > 0;
    }

    /**
     * Scope to filter images only.
     */
    public function scopeImages($query)
    {
        return $query->where('mime_type', 'like', 'image/%');
    }

    /**
     * Scope to filter documents only.
     */
    public function scopeDocuments($query)
    {
        return $query->whereIn('mime_type', [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ]);
    }

    /**
     * Scope to filter unused media.
     */
    public function scopeUnused($query)
    {
        return $query->where('usage_count', 0);
    }

    /**
     * Scope to search by filename.
     */
    public function scopeSearch($query, string $search)
    {
        return $query->where('filename', 'like', "%{$search}%");
    }
}
