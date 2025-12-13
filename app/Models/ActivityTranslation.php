<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityTranslation extends Model
{
    use HasFactory;

    protected $fillable = [
        'activity_id',
        'locale',
        'title',
        'description',
    ];

    protected $casts = [
        'activity_id' => 'integer',
    ];

    public function activity(): BelongsTo
    {
        return $this->belongsTo(Activity::class);
    }
}
