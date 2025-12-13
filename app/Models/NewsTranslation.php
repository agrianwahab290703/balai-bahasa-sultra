<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NewsTranslation extends Model
{
    use HasFactory;

    protected $fillable = [
        'news_id',
        'locale',
        'title',
        'excerpt',
        'content',
        'meta_title',
        'meta_description',
    ];

    protected $casts = [
        'news_id' => 'integer',
    ];

    public function news(): BelongsTo
    {
        return $this->belongsTo(News::class);
    }
}
