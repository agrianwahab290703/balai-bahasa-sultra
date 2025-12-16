<?php

namespace App\Models;

use App\Traits\HasActivityLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PpidDocument extends Model
{
    use HasFactory, HasActivityLog;

    protected $fillable = [
        'title',
        'file_path',
        'category',
        'file_type',
        'file_size',
        'download_count',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'file_size' => 'integer',
        'download_count' => 'integer',
    ];

    /**
     * Attributes to append to JSON/array output
     */
    protected $appends = ['file_size_formatted', 'file_url'];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Get formatted file size for display
     */
    public function getFileSizeFormattedAttribute(): string
    {
        $bytes = $this->attributes['file_size'] ?? 0;
        
        if ($bytes >= 1048576) {
            return number_format($bytes / 1048576, 2) . ' MB';
        }
        
        return number_format($bytes / 1024, 2) . ' KB';
    }

    /**
     * Get the full URL to the file
     */
    public function getFileUrlAttribute(): ?string
    {
        if (!$this->file_path) {
            return null;
        }
        
        return asset('storage/' . $this->file_path);
    }
}
