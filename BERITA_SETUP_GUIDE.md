# 📰 SISTEM BERITA PROFESIONAL BALAI BAHASA SULAWESI TENGGARA

## 🎯 Overview

Sistem berita profesional dengan format jurnalistik lengkap yang terlihat human-made dan bukan AI-generated. Dilengkapi dengan 187 data dummy berita yang realistis dan profesional.

## ✨ Fitur Utama

### 🏆 Format Berita Jurnalistik Lengkap
- **Judul Utama (Headline)**: Ringkasan inti peristiwa
- **Hero Image**: Foto terbaik dengan caption profesional
- **Dateline**: Lokasi dan tanggal rilis
- **Teras Berita (Lead)**: Paragraf pembuka dengan 5W+1H
- **Isi Berita Terstruktur**:
  - Konteks & Latar Belakang
  - Pernyataan Kunci Pejabat Utama (Quote)
  - Data & Capaian Kinerja dengan statistik
  - Mekanisme Penilaian
  - Kesimpulan dan Komitmen Jangka Panjang
- **Galeri Foto Dokumentasi**: 4 foto kolase + 2 foto group shot
- **Kredit/Sumber Rilis**: Informasi biro yang merilis

### 🎨 UI/UX Professional
- **Mobile-first Design**: Responsive di semua perangkat
- **Loading Animations**: Smooth transitions
- **Social Sharing**: Facebook, Twitter, WhatsApp, Telegram
- **View Counter**: Tracking pembaca real-time
- **Reading Time**: Estimasi waktu baca
- **Related News**: Berita terkait otomatis
- **Search & Filter**: Pencarian dan filter berdasarkan kategori
- **Gallery Modal**: Lightbox untuk foto dokumentasi

### 🛠️ Teknologi
- **Backend**: Laravel 12.0 dengan Eloquent ORM
- **Frontend**: React 19.2 + TypeScript + Inertia.js
- **UI Components**: Shadcn UI + Tailwind CSS 4.0
- **Icons**: Lucide Icons
- **Database**: MySQL dengan optimasi indexing
- **Caching**: Redis/Laravel Cache untuk performa
- **SEO**: Open Graph, Twitter Cards, Structured Data

## 📦 Instalasi

### 1. Migration Database
```bash
# Jalankan migration untuk tabel berita
php artisan migrate
```

### 2. Seeder Data Berita
```bash
# Jalankan seeder untuk data dummy 187 berita profesional
php artisan db:seed --class=BeritaSeeder
```

### 3. Cache Configuration
```bash
# Clear cache untuk memastikan data fresh
php artisan config:clear
php artisan cache:clear
php artisan view:clear
```

### 4. Storage Setup
```bash
# Buat symbolic link untuk storage
php artisan storage:link

# Buat folder untuk gambar berita
mkdir -p storage/app/public/images/berita/galeri
mkdir -p storage/app/public/images/berita/thumbnails
```

## 🗂️ Struktur File

### Database Schema
```sql
-- Tabel utama berita
CREATE TABLE berita (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    judul_utama VARCHAR(500) NOT NULL,
    slug VARCHAR(600) UNIQUE NOT NULL,
    ringkasan_inti TEXT,
    hero_image VARCHAR(500),
    hero_image_alt VARCHAR(500),
    lokasi VARCHAR(100) DEFAULT 'Jakarta',
    tanggal_rilis DATE,
    teras_berita TEXT,
    konteks_latar_belakang TEXT,
    quote_pejabat TEXT,
    nama_pejabat VARCHAR(200),
    jabatan_pejabat VARCHAR(300),
    data_capaian_kinerja TEXT,
    statistik_kinerja JSON,
    mekanisme_penilaian TEXT,
    kesimpulan_komitmen TEXT,
    kategori VARCHAR(100),
    sub_kategori VARCHAR(100),
    tag VARCHAR(500),
    is_published BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    view_count BIGINT DEFAULT 0,
    author VARCHAR(200) DEFAULT 'Admin',
    sumber_rilis VARCHAR(300),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- Tabel galeri foto
CREATE TABLE galeri_foto_berita (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    berita_id BIGINT NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_name VARCHAR(300) NOT NULL,
    caption TEXT,
    alt_text VARCHAR(500),
    urutan INT DEFAULT 0,
    tipe ENUM('hero', 'gallery', 'thumbnail') DEFAULT 'gallery',
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (berita_id) REFERENCES berita(id) ON DELETE CASCADE
);

-- Tabel berita terkait
CREATE TABLE berita_related (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    berita_id BIGINT NOT NULL,
    related_berita_id BIGINT NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (berita_id) REFERENCES berita(id) ON DELETE CASCADE,
    FOREIGN KEY (related_berita_id) REFERENCES berita(id) ON DELETE CASCADE,
    UNIQUE(berita_id, related_berita_id)
);
```

### File Project
```
📁 app/
├── Http/Controllers/Public/
│   └── BeritaController.php          # Controller berita dengan caching
├── Models/
│   ├── Berita.php                     # Model dengan relationships & scopes
│   └── GaleriFotoBerita.php          # Model untuk galeri foto
└── ...

📁 database/
├── migrations/
│   └── 2024_12_12_000001_create_berita_table.php
└── seeders/
    └── BeritaSeeder.php              # 187 berita dummy profesional

📁 resources/js/
├── Pages/Public/Berita/
│   ├── Show.tsx                      # Halaman detail berita
│   └── Index.tsx                     # Daftar berita (existing)
├── types/
│   └── berita.ts                     # TypeScript definitions
└── components/
    └── ui/ (shadcn-ui)

📁 storage/app/public/images/berita/
├── hero-zi-wbk-2025.jpg
├── og-zi-wbk-2025.jpg
└── galeri/
    ├── penyerahan-piagam-1.jpg
    ├── penyerahan-piagam-2.jpg
    ├── foto-bersama-1.jpg
    ├── foto-bersama-2.jpg
    └── ...
```

## 🚀 Usage Guide

### 1. Akses Halaman Berita
```
GET /berita                          # Daftar berita
GET /berita/{slug}                   # Detail berita
```

### 2. API Endpoints
```bash
# Get berita by category
GET /berita/api/category/{category}

# Search berita
GET /berita/api/search?q={query}

# Get popular news
GET /berita/api/popular?limit=5

# Get featured news
GET /berita/api/featured?limit=3

# Get recent news
GET /berita/api/recent?limit=5&days=7

# Get statistics
GET /berita/api/statistics

# Increment view count
POST /berita/api/{id}/view
```

### 3. Frontend Components Usage

#### Berita Detail Page
```tsx
// Import types
import type { BeritaShowProps } from '@/types/berita';

// Component usage (sudah ada di Show.tsx)
<BeritaShow
    berita={beritaData}
    galeri={galeriData}
    beritaTerkait={relatedNews}
/>
```

#### Berita Listing
```tsx
// Di Index.tsx gunakan props:
interface BeritaIndexProps {
    berita: BeritaIndex;
    featuredNews: BeritaList[];
    popularNews: BeritaList[];
    categories: Record<string, BeritaCategory>;
    filters: BeritaFilters;
}
```

## 🎯 Best Practices

### 1. SEO Optimization
- Setiap berita memiliki meta title, description, dan OG image
- URL slug yang SEO-friendly
- Structured data untuk Google News
- Alt text untuk semua gambar
- Internal linking antar berita terkait

### 2. Performance
- Caching untuk 30 menit (adjustable)
- Lazy loading untuk gambar
- Pagination dengan 12 items per page
- Database indexing untuk query cepat
- Image optimization dengan thumbnails

### 3. User Experience
- Loading states untuk async operations
- Error handling yang user-friendly
- Breadcrumb navigation
- Social media sharing
- Print-friendly version
- Mobile-optimized reading experience

### 4. Content Management
- Auto-generate slug dari judul
- Unique constraint untuk slug
- Soft delete untuk data retention
- Version control untuk perubahan
- Image management dengan proper naming

## 🔧 Customization

### 1. Menambah Kategori Baru
```php
// Di BeritaSeeder.php, tambahkan di $kategoriBerita:
$newCategories = [
    'kebijakan' => ['peraturan', 'kebijakan-publik', 'regulasi'],
    'prestasi' => ['penghargaan', 'juara', 'terbaik'],
];
```

### 2. Custom Query Scopes
```php
// Di Berita.php, tambahkan scope baru:
public function scopeByYear($query, int $year)
{
    return $query->whereYear('created_at', $year);
}

// Usage:
$berita2024 = Berita::published()->byYear(2024)->get();
```

### 3. Custom API Response
```php
// Di BeritaController.php, tambahkan method baru:
public function getByYear(Request $request, int $year): JsonResponse
{
    $berita = Berita::published()
        ->byYear($year)
        ->orderBy('created_at', 'desc')
        ->paginate(12);

    return response()->json($this->formatBeritaResponse($berita));
}
```

## 🐛 Troubleshooting

### 1. Migration Error
```bash
# Drop tables if exists
php artisan migrate:fresh --seed

# Atau rollback specific table
php artisan migrate:rollback --step=1
```

### 2. Cache Issues
```bash
# Clear all caches
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 3. Image Not Showing
```bash
# Check storage link
php artisan storage:link

# Check permissions
chmod -R 775 storage/app/public
chmod -R 775 public/storage
```

### 4. Performance Issues
```bash
# Cache warming
php artisan berita:warm-cache

# Check query log
php artisan tinker
>>> DB::enableQueryLog();
>>> Berita::published()->count();
>>> DB::getQueryLog();
```

## 📊 Analytics & Monitoring

### 1. Popular Articles Tracking
- View count otomatis ter-update
- Cache refresh setiap 30 menit
- Real-time statistics via API

### 2. SEO Performance
- Google Analytics integration
- Search Console monitoring
- Structured data validation

### 3. User Engagement
- Reading time calculation
- Social sharing tracking
- Related articles click-through rate

## 🔄 Updates & Maintenance

### 1. Regular Tasks
```bash
# Weekly cache refresh
php artisan cache:clear

# Monthly optimization
php artisan optimize

# Quarterly backup
php artisan backup:run
```

### 2. Adding New Features
- Follow existing patterns in controller
- Add proper validation rules
- Update TypeScript types
- Add tests for new functionality

---

## 📞 Support

Jika ada masalah atau pertanyaan:
1. Check error logs: `storage/logs/laravel.log`
2. Debug dengan `php artisan tinker`
3. Check documentation: `/docs`
4. Contact development team

---

**Created with ❤️ by AI Assistant for Balai Bahasa Sulawesi Tenggara**
*Last Updated: December 12, 2024*