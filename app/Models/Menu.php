<?php

namespace App\Models;

use App\Traits\HasActivityLog;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    use HasFactory, HasActivityLog;

    protected $fillable = [
        'label',
        'url',
        'parent_id',
        'order',
        'location',
        'icon',
        'is_visible',
    ];

    protected function casts(): array
    {
        return [
            'is_visible' => 'boolean',
            'order' => 'integer',
        ];
    }

    public function parent()
    {
        return $this->belongsTo(Menu::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Menu::class, 'parent_id')->orderBy('order');
    }

    public function scopeVisible($query)
    {
        return $query->where('is_visible', true);
    }

    public function scopeHeader($query)
    {
        return $query->where('location', 'header');
    }

    public function scopeFooter($query)
    {
        return $query->where('location', 'footer');
    }

    public function scopeRoot($query)
    {
        return $query->whereNull('parent_id')->orderBy('order');
    }
}
