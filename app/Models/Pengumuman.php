<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Pengumuman extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'pengumuman';
    
    protected $fillable = [
        'judul',
        'slug',
        'konten',
        'tipe',
        'tanggal_berlaku',
        'status',
        'prioritas',
        'meta_description',
        'gallery_images',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'tanggal_berlaku' => 'date',
        'gallery_images' => 'array',
    ];

    public function creator()
    {
        return $this->belongsTo(AdminUser::class, 'created_by');
    }

    public function updater()
    {
        return $this->belongsTo(AdminUser::class, 'updated_by');
    }

    public function getIsActiveAttribute()
    {
        return $this->status === 'active' && 
               (!$this->tanggal_berlaku || $this->tanggal_berlaku >= now());
    }
}
