# 🕷️ News Crawler Setup Guide

## 📋 Prerequisites

### Required Software
- **Python 3.8+** - Download from [python.org](https://python.org)
- **Git** - For version control (optional but recommended)

### Python Packages
- `requests` - For making HTTP requests
- `beautifulsoup4` - For HTML parsing
- `lxml` - Optional XML parser (faster than built-in parser)

## 🚀 Quick Start

### Option 1: Automated Setup (Windows)

1. **Install Dependencies First:**
   ```batch
   install-python-deps.bat
   ```

2. **Run the Crawler:**
   ```batch
   run-crawler.bat
   ```

### Option 2: Manual Setup

1. **Install Python Packages:**
   ```bash
   python -m pip install requests beautifulsoup4
   ```

2. **Run Crawler:**
   ```bash
   python scripts/python_scraper/news_crawler.py
   ```

### Option 3: Linux/Mac

1. **Make script executable:**
   ```bash
   chmod +x run-crawler.sh
   ```

2. **Run:**
   ```bash
   ./run-crawler.sh
   ```

## 🐛 Troubleshooting

### Common Issues & Solutions

#### 1. "Python is not recognized"
**Problem:** Python is not in your PATH

**Solution:**
- Reinstall Python with "Add Python to PATH" checked
- Or add Python to PATH manually:
  ```bash
  # Windows (Add to Environment Variables)
  C:\Python39\;C:\Python39\Scripts\

  # Linux/Mac (Add to ~/.bashrc or ~/.zshrc)
  export PATH="$PATH:/usr/local/bin/python3"
  ```

#### 2. "pip is not recognized"
**Problem:** pip is not installed or not in PATH

**Solution:**
```bash
# Windows
python -m ensurepip --upgrade

# Linux/Mac
python3 -m ensurepip --upgrade

# Or install pip manually
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
python get-pip.py
```

#### 3. "ModuleNotFoundError: No module named 'requests'"
**Problem:** Required packages not installed

**Solution:**
```bash
# Install packages
python -m pip install requests beautifulsoup4

# Or install individually
python -m pip install requests
python -m pip install beautifulsoup4
```

#### 4. SSL Certificate Issues
**Problem:** HTTPS requests failing due to SSL verification

**Solution:**
```bash
# Update certificates
python -m pip install --upgrade certifi

# Or disable SSL verification (not recommended for production)
# In crawler script, change:
# response = requests.get(url, headers=self.headers, verify=False)
```

#### 5. Permission Denied
**Problem:** Can't write to directories

**Solution:**
- **Windows:** Run Command Prompt as Administrator
- **Linux/Mac:** Use `sudo` or fix permissions:
  ```bash
  sudo chmod +x scripts/python_scraper/news_crawler.py
  sudo mkdir -p scraped-data public/images/news
  ```

#### 6. Memory Issues with Large Crawls
**Problem:** Crawler crashes on large websites

**Solution:**
- Modify `MAX_ARTICLES` in the crawler script:
  ```python
  MAX_ARTICLES = 50  # Reduce from default
  ```
- Or run in smaller batches

#### 7. Website Blocking/Rate Limiting
**Problem:** Website blocks your crawler

**Solution:**
- Add delays between requests (already implemented)
- Rotate User-Agent strings
- Use proxy if needed

## 🔧 Configuration

### Modify Crawler Settings

Edit `scripts/python_scraper/news_crawler.py`:

```python
# Configuration
MAX_ARTICLES = 50        # Number of articles to crawl
MAX_DEPTH = 3           # Maximum crawl depth
DELAY_SECONDS = 1       # Delay between requests
```

### Change Target Website

```python
# Update these variables
BASE_URL = "https://your-website.com"
START_URL = "https://your-website.com/news/"
```

## 📊 Output Files

After successful crawl, you'll get:

- **`scraped-data/news_data_final.json`** - Structured article data
- **`scraped-data/news_urls_final.txt`** - List of scraped URLs
- **`public/images/news/`** - Downloaded images

## 🗄️ Database Import

### Option 1: Laravel Seeder
```bash
php artisan db:seed --class=NewsSeeder
```

### Option 2: Direct SQL
```bash
mysql -u root -p balai_bahasa_sultra < scraped-data/news_data.sql
```

## 🔍 Verify Results

1. **Check Data:**
   ```bash
   # View JSON data
   type scraped-data\news_data_final.json
   ```

2. **Check Images:**
   ```bash
   # List downloaded images
   dir public\images\news\
   ```

3. **Test in Browser:**
   - Navigate to your Laravel app
   - Go to `/berita` page
   - Check if articles display correctly

## 📞 Support

If you encounter issues:

1. Check the error messages carefully
2. Verify Python installation: `python --version`
3. Check package installation: `python -m pip list`
4. Review logs in the crawler output
5. Check file permissions

## 🔄 Regular Updates

To update crawler:

1. Pull latest changes: `git pull`
2. Update dependencies: `python -m pip install --upgrade requests beautifulsoup4`
3. Run crawler: `run-crawler.bat`

---

**Last Updated:** December 12, 2025
**Version:** 2.0 Enhanced Content Extraction