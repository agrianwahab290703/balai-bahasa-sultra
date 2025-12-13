"""
Comprehensive News Scraper for Balai Bahasa Sultra
Scrapes ALL available news articles from the website
"""
import requests
from bs4 import BeautifulSoup
import json
import os
import time
from pathlib import Path
from datetime import datetime
from urllib.parse import urlparse
import re

# Configuration
BASE_URL = "https://balaibahasasultra.kemendikdasmen.go.id"
OUTPUT_DIR = "scraped-data"
IMAGES_DIR = "public/images/news"
MAX_ARTICLES = 1000  # Maximum articles to scrape

# Create directories
Path(OUTPUT_DIR).mkdir(parents=True, exist_ok=True)
Path(IMAGES_DIR).mkdir(parents=True, exist_ok=True)

# Headers
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
}


def is_news_article(url):
    """Check if URL is a news article"""
    # Skip non-article URLs
    skip_patterns = [
        '/category/', '/tag/', '/page/', '/wp-', '/feed', '/author/',
        '/berita-kegiatan/', '/ppid/', '/standar-pelayanan/', '/contact',
        '/home', '/about', '/services', '/projects', '/gallery',
        'lorem-ipsum', 'dolor-sit', 'dental', 'braces', 'advertising',
        'sitemap.xml', '.pdf', 'tds-checkout'
    ]
    
    for pattern in skip_patterns:
        if pattern in url.lower():
            return False
    
    # Must be from base URL and have a path
    if BASE_URL not in url:
        return False
    
    path = urlparse(url).path.strip('/')
    if not path or len(path) < 5:
        return False
    
    return True


def get_all_article_urls_from_sitemap():
    """Get all article URLs from XML sitemap"""
    print("Fetching URLs from sitemap...")
    urls = set()
    
    try:
        # Try post-sitemap.xml
        response = requests.get(f"{BASE_URL}/post-sitemap.xml", headers=HEADERS, timeout=30)
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'xml')
            for loc in soup.find_all('loc'):
                url = loc.get_text()
                if is_news_article(url):
                    urls.add(url)
            print(f"Found {len(urls)} URLs from post-sitemap.xml")
    except Exception as e:
        print(f"Error fetching post-sitemap: {e}")
    
    return list(urls)


def get_article_urls_from_page(page_url):
    """Extract article URLs from a page"""
    try:
        response = requests.get(page_url, headers=HEADERS, timeout=30)
        if response.status_code != 200:
            return []
        
        soup = BeautifulSoup(response.content, 'html.parser')
        urls = set()
        
        # Find all links
        for link in soup.find_all('a', href=True):
            href = link['href']
            if href.startswith('http') and is_news_article(href):
                urls.add(href)
        
        return list(urls)
    except Exception as e:
        print(f"Error getting URLs from {page_url}: {e}")
        return []


def get_all_article_urls():
    """Comprehensive URL collection"""
    all_urls = set()
    
    # Method 1: From sitemap
    sitemap_urls = get_all_article_urls_from_sitemap()
    all_urls.update(sitemap_urls)
    print(f"Total from sitemap: {len(all_urls)}")
    
    # Method 2: From main news page and pagination
    print("\nScanning news pages...")
    for page_num in range(1, 11):  # Check first 10 pages
        page_url = f"{BASE_URL}/berita-kegiatan/" if page_num == 1 else f"{BASE_URL}/berita-kegiatan/page/{page_num}/"
        page_urls = get_article_urls_from_page(page_url)
        all_urls.update(page_urls)
        print(f"Page {page_num}: +{len(page_urls)} URLs (Total: {len(all_urls)})")
        time.sleep(1)
    
    # Method 3: From category pages
    print("\nScanning category pages...")
    categories = [
        '/category/kegiatan/',
        '/category/siaran-pers-nasional/',
        '/category/berita/',
    ]
    
    for cat in categories:
        cat_url = BASE_URL + cat
        cat_urls = get_article_urls_from_page(cat_url)
        all_urls.update(cat_urls)
        print(f"{cat}: +{len(cat_urls)} URLs (Total: {len(all_urls)})")
        time.sleep(1)
    
    return list(all_urls)


def download_image(image_url, slug):
    """Download image"""
    try:
        response = requests.get(image_url, headers=HEADERS, timeout=30)
        if response.status_code == 200:
            ext = os.path.splitext(urlparse(image_url).path)[1]
            if not ext or ext.lower() not in ['.jpg', '.jpeg', '.png', '.webp']:
                ext = '.jpg'
            
            filename = f"{slug}{ext}"
            filepath = os.path.join(IMAGES_DIR, filename)
            
            with open(filepath, 'wb') as f:
                f.write(response.content)
            
            return f"images/news/{filename}"
        return None
    except Exception as e:
        return None


def get_slug_from_url(url):
    """Extract slug from URL"""
    path = urlparse(url).path
    slug = path.strip('/').split('/')[-1]
    return slug


def generate_summary(content, max_length=200):
    """Generate summary"""
    text = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', content)
    text = re.sub(r'[#*_`]', '', text)
    text = ' '.join(text.split())
    if len(text) > max_length:
        text = text[:max_length].rsplit(' ', 1)[0] + '...'
    return text


def determine_sentiment(title, summary):
    """Simple sentiment analysis"""
    positive_words = ['prestasi', 'sukses', 'berhasil', 'raih', 'menang', 'apresiasi', 'penghargaan', 'terbaik']
    negative_words = ['gagal', 'kecewa', 'masalah', 'konflik', 'kritik']
    
    text = (title + ' ' + summary).lower()
    
    pos_count = sum(1 for word in positive_words if word in text)
    neg_count = sum(1 for word in negative_words if word in text)
    
    if pos_count > neg_count:
        return "Positive"
    elif neg_count > pos_count:
        return "Negative"
    else:
        return "Neutral"


def extract_categories(content):
    """Extract categories"""
    categories = []
    
    if 'unesco' in content.lower() or 'internasional' in content.lower():
        categories.append("Internasional")
    if 'penghargaan' in content.lower() or 'prestasi' in content.lower():
        categories.append("Prestasi")
    if 'pelatihan' in content.lower() or 'bimtek' in content.lower():
        categories.append("Pelatihan")
    if 'ukbi' in content.lower():
        categories.append("UKBI")
    if 'bahasa daerah' in content.lower():
        categories.append("Bahasa Daerah")
    if 'siswa' in content.lower() or 'pendidikan' in content.lower():
        categories.append("Pendidikan")
    
    if not categories:
        categories = ["Berita", "Kegiatan"]
    
    return categories


def scrape_article(url):
    """Scrape single article"""
    try:
        response = requests.get(url, headers=HEADERS, timeout=30)
        
        if response.status_code != 200:
            return None
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Extract title
        title_tag = soup.find('meta', property='og:title') or soup.find('h1')
        if title_tag:
            title = title_tag.get('content') if title_tag.name == 'meta' else title_tag.get_text(strip=True)
        else:
            title = "Untitled"
        
        # Extract slug
        slug = get_slug_from_url(url)
        
        # Extract content
        content_div = soup.find('div', class_='entry-content')
        content = content_div.get_text(strip=True) if content_div else ""
        
        # Generate summary
        summary = generate_summary(content) if content else "No summary available"
        
        # Extract and download image
        image_path = None
        og_image = soup.find('meta', property='og:image')
        if og_image and og_image.get('content'):
            image_url = og_image['content']
            image_path = download_image(image_url, slug)
        
        # Extract published date
        date_meta = soup.find('meta', property='article:published_time')
        if date_meta and date_meta.get('content'):
            try:
                dt_str = date_meta['content']
                dt = datetime.fromisoformat(dt_str.replace('Z', '+00:00'))
                published_at = dt.strftime('%Y-%m-%dT%H:%M:%SZ')
            except:
                published_at = datetime.now().strftime('%Y-%m-%dT%H:%M:%SZ')
        else:
            published_at = datetime.now().strftime('%Y-%m-%dT%H:%M:%SZ')
        
        # Extract categories
        categories = extract_categories(content)
        
        # Determine sentiment
        sentiment = determine_sentiment(title, summary)
        
        # Build article data
        article_data = {
            "title": title,
            "slug": slug,
            "summary": summary,
            "source_url": url,
            "published_at": published_at,
            "sentiment": sentiment,
            "validation_status": "Verified",
            "image_path": image_path,
            "categories": categories
        }
        
        return article_data
        
    except Exception as e:
        return None


def main():
    print("="*70)
    print("COMPREHENSIVE NEWS SCRAPER - BALAI BAHASA SULTRA")
    print("="*70)
    
    # Get all article URLs
    print("\n🔍 STEP 1: Discovering article URLs...")
    all_urls = get_all_article_urls()
    print(f"\n✅ Found {len(all_urls)} unique article URLs")
    
    # Limit to MAX_ARTICLES
    if len(all_urls) > MAX_ARTICLES:
        print(f"⚠️  Limiting to first {MAX_ARTICLES} articles")
        all_urls = all_urls[:MAX_ARTICLES]
    
    # Scrape articles
    print(f"\n🚀 STEP 2: Scraping {len(all_urls)} articles...")
    print("="*70)
    
    news_data = []
    success_count = 0
    failed_count = 0
    
    for i, url in enumerate(all_urls, 1):
        print(f"\n[{i}/{len(all_urls)}] {url[:80]}...")
        article = scrape_article(url)
        
        if article:
            news_data.append(article)
            success_count += 1
            print(f"  ✓ {article['title'][:60]}...")
            if article['image_path']:
                print(f"  ✓ Image downloaded")
        else:
            failed_count += 1
            print(f"  ✗ Failed to scrape")
        
        # Rate limiting
        time.sleep(2)
        
        # Save progress every 50 articles
        if i % 50 == 0:
            temp_file = os.path.join(OUTPUT_DIR, f"news_data_progress_{i}.json")
            with open(temp_file, 'w', encoding='utf-8') as f:
                json.dump(news_data, f, ensure_ascii=False, indent=2)
            print(f"\n💾 Progress saved: {temp_file}")
    
    # Save final results
    print("\n\n" + "="*70)
    print("SAVING FINAL RESULTS")
    print("="*70)
    
    # Save JSON
    json_path = os.path.join(OUTPUT_DIR, "news_data_all.json")
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(news_data, f, ensure_ascii=False, indent=2)
    print(f"✓ JSON saved: {json_path}")
    
    # Save URLs list
    urls_path = os.path.join(OUTPUT_DIR, "news_urls_all.txt")
    with open(urls_path, 'w', encoding='utf-8') as f:
        for article in news_data:
            f.write(article['source_url'] + '\n')
    print(f"✓ URLs saved: {urls_path}")
    
    # Summary
    print("\n" + "="*70)
    print("SCRAPING SUMMARY")
    print("="*70)
    print(f"Total URLs discovered: {len(all_urls)}")
    print(f"Successfully scraped: {success_count}")
    print(f"Failed: {failed_count}")
    print(f"Images downloaded: {sum(1 for a in news_data if a.get('image_path'))}")
    print(f"Success rate: {(success_count/len(all_urls)*100):.1f}%")
    print(f"Output file: {json_path}")
    print(f"Images directory: {IMAGES_DIR}")
    print("="*70)


if __name__ == "__main__":
    main()
