<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;
use Carbon\Carbon;

class Berita extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'berita';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'judul_utama',
        'slug',
        'ringkasan_inti',
        'teras_berita',
        'konteks_latar_belakang',
        'quote_pejabat',
        'nama_pejabat',
        'jabatan_pejabat',
        'data_capaian_kinerja',
        'mekanisme_penilaian',
        'kesimpulan_komitmen',
        'hero_image',
        'hero_image_alt',
        'kategori',
        'sub_kategori',
        'is_published',
        'is_featured',
        'view_count',
        'author',
        'sumber_rilis',
        'lokasi',
        'tanggal_rilis',
        'biro',
        'tags',
        'tag',
        'meta_title',
        'meta_description',
        'og_image',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'tanggal_rilis' => 'date',
        'tags' => 'array',
        'tag' => 'array',
        'is_featured' => 'boolean',
        'is_published' => 'boolean',
        'view_count' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'deleted_at',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        // Auto-generate slug when creating/updating
        static::saving(function ($berita) {
            if (empty($berita->slug)) {
                $berita->slug = Str::slug($berita->judul_utama);
            }

            // Ensure slug is unique
            $originalSlug = $berita->slug;
            $counter = 1;

            while (static::where('slug', $berita->slug)
                ->where('id', '!=', $berita->id)
                ->exists()) {
                $berita->slug = $originalSlug . '-' . $counter;
                $counter++;
            }
        });

        // Set default values
        static::creating(function ($berita) {
            $berita->lokasi = $berita->lokasi ?? 'Kendari';
            $berita->biro = $berita->biro ?? 'Biro Komunikasi dan Layanan Informasi';
            $berita->view_count = $berita->view_count ?? 0;
            $berita->is_published = $berita->is_published ?? true;
        });
    }

    /**
     * Get the galeri foto berita for the news.
     */
    public function galeriFotoBerita(): HasMany
    {
        return $this->hasMany(GaleriFotoBerita::class, 'berita_id')
            ->orderBy('urutan');
    }

    /**
     * Get the hero image for the news.
     */
    public function heroImage(): HasMany
    {
        return $this->hasMany(GaleriFotoBerita::class, 'berita_id')
            ->where('tipe', 'hero')
            ->orderBy('urutan');
    }

    /**
     * Get the gallery photos for the news.
     */
    public function galleryPhotos(): HasMany
    {
        return $this->hasMany(GaleriFotoBerita::class, 'berita_id')
            ->where('tipe', 'gallery')
            ->orderBy('urutan');
    }

    // Note: kategori is stored as string, not a relationship

    /**
     * Get related news articles.
     */
    public function relatedNews(): BelongsToMany
    {
        return $this->belongsToMany(Berita::class, 'berita_related', 'berita_id', 'related_berita_id');
    }

    /**
     * Get news that relates to this article.
     */
    public function reverseRelatedNews(): BelongsToMany
    {
        return $this->belongsToMany(Berita::class, 'berita_related', 'related_berita_id', 'berita_id');
    }

    /**
     * Scope a query to only include published news.
     */
    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    /**
     * Scope a query to only include featured news.
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope a query to filter by category.
     */
    public function scopeByCategory($query, string $category)
    {
        return $query->where('kategori', $category);
    }

    /**
     * Scope a query to search by title and content.
     */
    public function scopeSearch($query, string $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('judul_utama', 'like', "%{$search}%")
              ->orWhere('ringkasan_inti', 'like', "%{$search}%")
              ->orWhere('lead_paragraph', 'like', "%{$search}%")
              ->orWhere('konteks_latar_belakang', 'like', "%{$search}%")
              ->orWhere('data_capaian_kinerja', 'like', "%{$search}%")
              ->orWhereJsonContains('tags', $search);
        });
    }

    /**
     * Scope a query to get recent news.
     */
    public function scopeRecent($query, int $days = 30)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    /**
     * Get the formatted tanggal rilis.
     */
    public function getFormattedTanggalRilisAttribute(): string
    {
        return $this->tanggal_rilis->locale('id_ID')->format('d F Y');
    }

    /**
     * Get the formatted created at date.
     */
    public function getFormattedCreatedAtAttribute(): string
    {
        return $this->created_at->locale('id_ID')->format('d F Y H:i');
    }

    /**
     * Get the relative time for created at.
     */
    public function getTimeAgoAttribute(): string
    {
        return $this->created_at->diffForHumans(now(), 'id_ID');
    }

    
    /**
     * Get the URL for the news.
     */
    public function getUrlAttribute(): string
    {
        return route('berita.show', $this->slug);
    }

    /**
     * Get the full image URL.
     */
    public function getFullHeroImageUrlAttribute(): string
    {
        if (filter_var($this->hero_image_path, FILTER_VALIDATE_URL)) {
            return $this->hero_image_path;
        }

        return asset($this->hero_image_path);
    }

    /**
     * Get reading time in minutes.
     */
    public function getReadingTimeAttribute(): int
    {
        $content = implode(' ', [
            $this->teras_berita ?? '',
            $this->konteks_latar_belakang ?? '',
            $this->quote_pejabat ?? '',
            $this->data_capaian_kinerja ?? '',
            $this->mekanisme_penilaian ?? '',
            $this->kesimpulan_komitmen ?? '',
        ]);

        $wordCount = str_word_count(strip_tags($content));
        return max(1, ceil($wordCount / 200)); // Assuming 200 words per minute
    }

    /**
     * Get the formatted dateline.
     */
    public function getDatelineAttribute(): string
    {
        return "{$this->lokasi} – " . $this->tanggal_rilis->locale('id_ID')->format('d F Y');
    }

    /**
     * Get the tags as array.
     */
    public function getTagsArrayAttribute(): array
    {
        return $this->tags ?? [];
    }

    /**
     * Increment view count.
     */
    public function incrementViewCount(): int
    {
        $this->increment('view_count');
        return $this->view_count;
    }

    
    /**
     * Check if the news is recent (published within last 7 days).
     */
    public function isRecent(): bool
    {
        return $this->created_at->greaterThan(now()->subDays(7));
    }

    /**
     * Get related news based on category.
     */
    public function getRelatedNewsAttribute(): \Illuminate\Database\Eloquent\Collection
    {
        return self::published()
            ->where('id', '!=', $this->id)
            ->where('kategori', $this->kategori)
            ->orderBy('is_featured', 'desc')
            ->orderBy('created_at', 'desc')
            ->limit(3)
            ->get();
    }

    /**
     * Get popular news based on view count.
     */
    public static function getPopular(int $limit = 5): \Illuminate\Database\Eloquent\Collection
    {
        return self::published()
            ->orderBy('view_count', 'desc')
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get latest news.
     */
    public static function getLatest(int $limit = 10): \Illuminate\Database\Eloquent\Collection
    {
        return self::published()
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get featured news.
     */
    public static function getFeatured(int $limit = 3): \Illuminate\Database\Eloquent\Collection
    {
        return self::published()
            ->featured()
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get news by category with pagination.
     */
    public static function getByCategory(string $category, int $perPage = 10): \Illuminate\Contracts\Pagination\LengthAwarePaginator
    {
        return self::published()
            ->where('kategori', $category)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Get news statistics.
     */
    public static function getStatistics(): array
    {
        return [
            'total' => self::count(),
            'published' => self::published()->count(),
            'featured' => self::featured()->count(),
            'total_views' => self::sum('view_count'),
        ];
    }
}