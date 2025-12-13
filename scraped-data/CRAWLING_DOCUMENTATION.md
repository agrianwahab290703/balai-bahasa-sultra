# Balai Bahasa Sultra - News Crawling Documentation

## 📋 Overview
Dokumentasi lengkap untuk crawling data berita dari website Balai Bahasa Sultra menggunakan Python.

## 🎯 Objective
Mengambil data berita dari website `https://balaibahasasultra.kemendikdasmen.go.id/berita-kegiatan/` dengan parameter:
- **Kedalaman crawling**: Configurable (default: 2-3 level)
- **Format output**: JSON
- **Filter URL**: Berita & Kegiatan
- **Download gambar**: Ya, disimpan di `public/images/news`

## 📊 Data Structure

### Output JSON Format
```json
{
  "title": "string - Judul berita",
  "slug": "string - URL slug untuk routing",
  "summary": "string - Ringkasan berita (max 200 karakter)",
  "source_url": "string - URL sumber original",
  "published_at": "string - ISO 8601 datetime (YYYY-MM-DDTHH:MM:SSZ)",
  "sentiment": "string - Positive|Neutral|Negative",
  "validation_status": "string - Verified|Pending|Draft",
  "image_path": "string - Relative path ke gambar",
  "categories": ["array of strings - Kategori berita"]
}
```

### Example Record
```json
{
  "title": "Indonesia Tegaskan Peran Global pada Sidang Umum UNESCO ke-43",
  "slug": "indonesia-tegaskan-peran-global-pada-sidang-umum-unesco-ke-43",
  "summary": "Momen bersejarah bagi Indonesia di kancah global di mana Bahasa Indonesia digunakan secara resmi sebagai bahasa sidang UNESCO untuk pertama kalinya...",
  "source_url": "https://balaibahasasultra.kemendikdasmen.go.id/indonesia-tegaskan-peran-global-pada-sidang-umum-unesco-ke-43/",
  "published_at": "2025-12-01T06:06:12Z",
  "sentiment": "Positive",
  "validation_status": "Verified",
  "image_path": "images/news/indonesia-tegaskan-peran-global-pada-sidang-umum-unesco-ke-43.jpeg",
  "categories": ["Internasional", "Prestasi"]
}
```

## 🛠️ Tools & Scripts

### 1. Simple Scraper (Recommended)
**File**: `scripts/python_scraper/simple_scraper.py`

**Features**:
- ✅ Scrape list of predefined URLs
- ✅ Download images automatically
- ✅ Extract metadata (title, date, categories)
- ✅ Sentiment analysis
- ✅ Category auto-detection

**Usage**:
```bash
py scripts/python_scraper/simple_scraper.py
```

**Output**:
- `scraped-data/news_data_complete.json` - Complete news data
- `scraped-data/news_urls_complete.txt` - List of scraped URLs
- `public/images/news/*.{jpg,jpeg,png}` - Downloaded images

### 2. Advanced Crawler
**File**: `scripts/python_scraper/news_crawler.py`

**Features**:
- ✅ Auto-discover article links
- ✅ Configurable depth & limit
- ✅ Recursive crawling
- ✅ Deduplication

**Usage**:
```bash
py scripts/python_scraper/news_crawler.py
```

**Configuration**:
```python
MAX_DEPTH = 3        # Kedalaman crawling
MAX_ARTICLES = 100   # Jumlah maksimal artikel
```

## 📁 Directory Structure

```
balai-bahasa-sultra/
├── scripts/
│   └── python_scraper/
│       ├── simple_scraper.py      # Simple URL-based scraper
│       └── news_crawler.py        # Advanced recursive crawler
├── scraped-data/
│   ├── news_data_complete.json    # Final JSON output
│   └── news_urls_complete.txt     # URLs list
└── public/
    └── images/
        └── news/                   # Downloaded images
            ├── article-slug-1.jpg
            ├── article-slug-2.jpeg
            └── ...
```

## 🔧 Dependencies

```bash
pip install beautifulsoup4 requests
```

**Required Libraries**:
- `beautifulsoup4` (4.14.3+) - HTML parsing
- `requests` (2.32.5+) - HTTP requests
- `json` (built-in) - JSON handling
- `pathlib` (built-in) - Path operations

## 🚀 Quick Start

### Step 1: Install Dependencies
```bash
py -m pip install beautifulsoup4 requests
```

### Step 2: Run Scraper
```bash
py scripts/python_scraper/simple_scraper.py
```

### Step 3: Check Results
```bash
# View JSON data
type scraped-data\news_data_complete.json

# Count articles
py -c "import json; print(len(json.load(open('scraped-data/news_data_complete.json'))))"

# Check images
dir public\images\news
```

## 📊 Scraping Results (Latest Run)

### Summary
- **Total Articles**: 20
- **Success Rate**: 100%
- **Images Downloaded**: 20
- **Average Summary Length**: ~180 characters
- **Categories Detected**: 7 unique categories

### Category Distribution
- **Pendidikan**: 17 articles
- **Prestasi**: 8 articles
- **Internasional**: 5 articles
- **Bahasa Daerah**: 6 articles
- **UKBI**: 4 articles
- **Pelatihan**: 3 articles
- **Berita/Kegiatan**: 2 articles

### Sentiment Analysis
- **Positive**: 25%
- **Neutral**: 70%
- **Negative**: 5%

## 🎨 Category Auto-Detection Logic

The scraper automatically categorizes articles based on keywords:

| Keyword | Category |
|---------|----------|
| unesco, internasional | Internasional |
| penghargaan, prestasi, sukses | Prestasi |
| pelatihan, bimtek | Pelatihan |
| ukbi | UKBI |
| bahasa daerah | Bahasa Daerah |
| siswa, pendidikan | Pendidikan |
| Default | Berita, Kegiatan |

## 🔍 Sentiment Analysis Logic

**Positive Keywords**: prestasi, sukses, berhasil, raih, menang, apresiasi, penghargaan, terbaik

**Negative Keywords**: gagal, kecewa, masalah, konflik, kritik

**Logic**:
- More positive keywords → Positive
- More negative keywords → Negative
- Equal or no keywords → Neutral

## 📝 Customization Guide

### Adding More URLs
Edit `simple_scraper.py`:
```python
ARTICLE_URLS = [
    "https://balaibahasasultra.kemendikdasmen.go.id/your-article-1/",
    "https://balaibahasasultra.kemendikdasmen.go.id/your-article-2/",
    # Add more URLs here
]
```

### Changing Output Directory
```python
OUTPUT_DIR = "your-custom-output-dir"
IMAGES_DIR = "public/images/your-custom-dir"
```

### Adjusting Summary Length
```python
def generate_summary(content, max_length=200):  # Change 200 to your desired length
    # ...
```

### Adding Custom Categories
```python
def extract_categories_from_content(markdown):
    categories = []
    
    if 'your-keyword' in markdown.lower():
        categories.append("Your Category")
    
    # Add more rules here
```

## 🐛 Troubleshooting

### Issue: Module Not Found
```bash
ModuleNotFoundError: No module named 'bs4'
```
**Solution**:
```bash
py -m pip install beautifulsoup4 requests
```

### Issue: Permission Denied
```bash
PermissionError: [Errno 13] Permission denied
```
**Solution**: Ensure output directories exist and are writable:
```bash
mkdir scraped-data
mkdir public\images\news
```

### Issue: Timeout Errors
```bash
requests.exceptions.Timeout
```
**Solution**: Increase timeout or add retry logic:
```python
response = requests.get(url, headers=headers, timeout=60)  # Increase from 30 to 60
```

## 🔄 Next Steps (Integration)

### 1. Import to Database
Create a Laravel seeder or use the data directly:

```php
// database/seeders/NewsSeeder.php
$json = file_get_contents(base_path('scraped-data/news_data_complete.json'));
$newsData = json_decode($json, true);

foreach ($newsData as $item) {
    News::create([
        'title' => $item['title'],
        'slug' => $item['slug'],
        'summary' => $item['summary'],
        // ... map other fields
    ]);
}
```

### 2. Create Migration
```bash
php artisan make:migration create_scraped_news_table
```

### 3. Build News Component
Use the JSON data to populate your React/Vue components:

```typescript
import newsData from '@/data/news_data_complete.json';

export function NewsList() {
  return (
    <div>
      {newsData.map((news) => (
        <NewsCard key={news.slug} {...news} />
      ))}
    </div>
  );
}
```

## 📚 References

- **Source Website**: https://balaibahasasultra.kemendikdasmen.go.id/
- **BeautifulSoup Docs**: https://www.crummy.com/software/BeautifulSoup/bs4/doc/
- **Requests Docs**: https://requests.readthedocs.io/

## 📧 Support

For issues or questions:
1. Check troubleshooting section above
2. Review script comments for inline documentation
3. Test with smaller URL sets first

---

**Last Updated**: December 12, 2025
**Script Version**: 1.0.0
**Python Version**: 3.13+
