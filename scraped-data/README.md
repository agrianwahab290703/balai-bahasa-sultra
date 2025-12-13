# 📰 Scraped News Data - Balai Bahasa Sultra

## 📊 Quick Stats

- **Total Articles**: 20
- **Images Downloaded**: 20
- **Success Rate**: 100%
- **Source**: https://balaibahasasultra.kemendikdasmen.go.id/

## 📁 Files

### Data Files
- `news_data_complete.json` - Complete structured data (ready to use)
- `news_urls_complete.txt` - List of source URLs
- `news_data.sql` - SQL INSERT statements
- `CRAWLING_DOCUMENTATION.md` - Full documentation

### Images
- Located in: `public/images/news/`
- Format: JPG, JPEG, PNG
- Naming: Based on article slug

## 🚀 Quick Usage

### 1. View Data
```bash
# Windows
type news_data_complete.json

# Linux/Mac
cat news_data_complete.json
```

### 2. Import to Database

#### Option A: Laravel Seeder (Recommended)
```bash
php artisan db:seed --class=ScrapedNewsSeeder
```

#### Option B: Direct SQL Import
```bash
mysql -u root -p balai_bahasa_sultra < scraped-data/news_data.sql
```

### 3. Use in Frontend
```typescript
// Import the JSON directly
import newsData from '@/../../scraped-data/news_data_complete.json';

// Use in component
newsData.map(article => (
  <ArticleCard
    key={article.slug}
    title={article.title}
    summary={article.summary}
    image={article.image_path}
    categories={article.categories}
  />
))
```

## 📋 Data Structure

Each article contains:
```json
{
  "title": "Article title",
  "slug": "article-url-slug",
  "summary": "Brief summary (max 200 chars)",
  "source_url": "https://...",
  "published_at": "2025-12-01T06:06:12Z",
  "sentiment": "Positive|Neutral|Negative",
  "validation_status": "Verified",
  "image_path": "images/news/article-slug.jpg",
  "categories": ["Category1", "Category2"]
}
```

## 🎯 Categories Available

- **Internasional** - UNESCO, global events
- **Prestasi** - Awards, achievements
- **Pelatihan** - Training, workshops
- **UKBI** - Language proficiency tests
- **Bahasa Daerah** - Regional languages
- **Pendidikan** - Education-related
- **Berita/Kegiatan** - General news & activities

## 🔄 Re-scraping Data

If you need to update the data:

```bash
# Run the scraper
py scripts/python_scraper/simple_scraper.py

# This will update:
# - news_data_complete.json
# - news_urls_complete.txt
# - Images in public/images/news/
```

## ✅ Verification

All articles have been:
- ✅ Scraped successfully
- ✅ Images downloaded
- ✅ Metadata extracted
- ✅ Categories auto-assigned
- ✅ Sentiment analyzed
- ✅ Ready for production use

## 📝 Notes

1. **Image Paths**: All paths are relative (`images/news/...`)
2. **Dates**: ISO 8601 format (`YYYY-MM-DDTHH:MM:SSZ`)
3. **Encoding**: UTF-8 (supports Indonesian characters)
4. **Validation**: All articles marked as "Verified"

## 🐛 Issues?

If data is missing or incorrect:
1. Check source URL is accessible
2. Review scraping logs
3. Re-run scraper for specific articles
4. Contact: [Your contact info]

---

**Last Updated**: December 12, 2025
**Data Version**: 1.0.0
