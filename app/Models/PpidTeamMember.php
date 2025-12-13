<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PpidTeamMember extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'position',
        'role',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrderByOrder($query)
    {
        return $query->orderBy('order', 'asc');
    }

    public function scopeByRole($query, $role)
    {
        return $query->where('role', $role);
    }
}
