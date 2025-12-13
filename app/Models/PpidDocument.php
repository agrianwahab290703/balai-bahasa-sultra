<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PpidDocument extends Model
{
    use HasFactory;

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

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function getFileSizeAttribute($value)
    {
        return number_format($value / 1024, 2) . ' KB';
    }
}
