<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ServiceTranslation extends Model
{
    use HasFactory;

    protected $fillable = [
        'service_id',
        'locale',
        'name',
        'description',
        'requirements',
        'procedures',
    ];

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }
}
