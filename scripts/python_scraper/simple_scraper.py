import requests
import json
import os
import time
from pathlib import Path
from datetime import datetime
from urllib.parse import urlparse
import hashlib

# Daftar URL artikel yang akan di-scrape
ARTICLE_URLS = [
    "https://balaibahasasultra.kemendikdasmen.go.id/indonesia-tegaskan-peran-global-pada-sidang-umum-unesco-ke-43/",
    "https://balaibahasasultra.kemendikdasmen.go.id/kemendikdasmen-apresiasi-unit-kerja-berintegritas-melalui-penghargaan-zi-wbk-wbbm-dan-pelayanan-prima/",
    "https://balaibahasasultra.kemendikdasmen.go.id/bbp-sultra-menerima-penghargaan-zi-wbk-dan-pekppp-mandiri-kemendikdasmen/",
    "https://balaibahasasultra.kemendikdasmen.go.id/bimtek-penguatan-penggunaan-bahasa-indonesia-bagi-pegawai-rri/",
    "https://balaibahasasultra.kemendikdasmen.go.id/5145-2/",
    "https://balaibahasasultra.kemendikdasmen.go.id/kemendikdasmen-ajak-pemerintah-daerah-yogyakarta-bersinergi-menegakkan-ketertiban-bahasa-indonesia/",
    "https://balaibahasasultra.kemendikdasmen.go.id/5119-2/",
    "https://balaibahasasultra.kemendikdasmen.go.id/kemendikdasmen-dukung-pengajuan-aksara-daerah-ke-unesco-lewat-peta-kebinekaan-dan-digitalisasi-unicode/",
    "https://balaibahasasultra.kemendikdasmen.go.id/bbp-sultra-terima-penghargaan-dari-bank-indonesia/",
    "https://balaibahasasultra.kemendikdasmen.go.id/pojok-baca-bbp-sultra-dalam-kegiatan-mobasa-expo/",
    "https://balaibahasasultra.kemendikdasmen.go.id/ukbi-adaptif-capai-1-juta-peserta-uji-wujudkan-peningkatan-literasi-dan-kemahiran-berbahasa-indonesia/",
    "https://balaibahasasultra.kemendikdasmen.go.id/pengawasan-penggunaan-bahasa-indonesia-pemerintah-daerah-bersinergi-wujudkan-kedaulatan-bahasa-indonesia/",
    "https://balaibahasasultra.kemendikdasmen.go.id/peluncuran-permendikdasmen-2025-perkuat-identitas-bangsa-dengan-menegakkan-kedaulatan-bahasa-indonesia/",
    "https://balaibahasasultra.kemendikdasmen.go.id/mendikdasmen-bahas-pendekatan-pembelajaran-mendalam-dan-pendidikan-karakter-di-uzbekistan/",
    "https://balaibahasasultra.kemendikdasmen.go.id/berbanggalah-warga-62-bahasa-indonesia-mulai-diajarkan-di-universitas-harvard/",
    "https://balaibahasasultra.kemendikdasmen.go.id/ftbi-kab-konawe-kolaborasi-ciamik-kbst-dan-pemkab-konawe/",
    "https://balaibahasasultra.kemendikdasmen.go.id/siswa-mtsn-1-kendari-mengikuti-simulasi-ukbi-adaptif-merdeka/",
    "https://balaibahasasultra.kemendikdasmen.go.id/konsolnas-dikdasmen-2025-wadah-pemangku-kepentingan-perkuat-komitmen-kolektif-bangun-pendidikan/",
    "https://balaibahasasultra.kemendikdasmen.go.id/biro-keuangan-dan-bmn-kemendikdasmen-lakukan-tindak-lanjut-bmn-di-bbp-sultra/",
    "https://balaibahasasultra.kemendikdasmen.go.id/bbp-sultra-beri-layanan-ahli-bahasa-kepada-penyidik-dari-polres-bombana/",
]

# Setup output directories
OUTPUT_DIR = "scraped-data"
IMAGES_DIR = "public/images/news"

Path(OUTPUT_DIR).mkdir(parents=True, exist_ok=True)
Path(IMAGES_DIR).mkdir(parents=True, exist_ok=True)


def download_image(image_url, slug):
    """Download image dan simpan dengan nama berdasarkan slug"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        response = requests.get(image_url, headers=headers, timeout=30)
        
        if response.status_code == 200:
            # Dapatkan ekstensi dari URL
            ext = os.path.splitext(urlparse(image_url).path)[1]
            if not ext or ext.lower() not in ['.jpg', '.jpeg', '.png', '.webp']:
                ext = '.jpg'
            
            # Buat nama file
            filename = f"{slug}{ext}"
            filepath = os.path.join(IMAGES_DIR, filename)
            
            # Simpan gambar
            with open(filepath, 'wb') as f:
                f.write(response.content)
            
            print(f"  ✓ Downloaded image: {filename}")
            return f"images/news/{filename}"
        return None
    except Exception as e:
        print(f"  ✗ Error downloading image {image_url}: {str(e)}")
        return None


def get_slug_from_url(url):
    """Extract slug from URL"""
    path = urlparse(url).path
    slug = path.strip('/').split('/')[-1]
    return slug


def generate_summary(content, max_length=200):
    """Generate summary from content"""
    import re
    # Bersihkan markdown links dan formatting
    text = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', content)
    text = re.sub(r'[#*_`]', '', text)
    # Bersihkan whitespace berlebih
    text = ' '.join(text.split())
    # Potong ke panjang maksimal
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


def extract_categories_from_content(markdown):
    """Extract categories from markdown content"""
    # Default categories
    categories = []
    
    # Keywords mapping
    if 'unesco' in markdown.lower():
        categories.append("Internasional")
    if 'penghargaan' in markdown.lower() or 'prestasi' in markdown.lower():
        categories.append("Prestasi")
    if 'pelatihan' in markdown.lower() or 'bimtek' in markdown.lower():
        categories.append("Pelatihan")
    if 'ukbi' in markdown.lower():
        categories.append("UKBI")
    if 'bahasa daerah' in markdown.lower():
        categories.append("Bahasa Daerah")
    if 'siswa' in markdown.lower() or 'pendidikan' in markdown.lower():
        categories.append("Pendidikan")
    
    # Default jika kosong
    if not categories:
        categories = ["Berita", "Kegiatan"]
    
    return categories


def scrape_article_simple(url):
    """Scrape artikel dengan requests biasa"""
    try:
        from bs4 import BeautifulSoup
        
        print(f"\nScraping: {url}")
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        response = requests.get(url, headers=headers, timeout=30)
        
        if response.status_code != 200:
            print(f"  ✗ Failed: Status {response.status_code}")
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
        categories = extract_categories_from_content(content)
        
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
        
        print(f"  ✓ Success: {title[:60]}...")
        return article_data
        
    except Exception as e:
        print(f"  ✗ Error: {str(e)}")
        return None


def main():
    print("="*70)
    print("BALAI BAHASA SULTRA - NEWS SCRAPER")
    print("="*70)
    print(f"Total URLs to scrape: {len(ARTICLE_URLS)}\n")
    
    news_data = []
    success_count = 0
    failed_count = 0
    
    for i, url in enumerate(ARTICLE_URLS, 1):
        print(f"\n[{i}/{len(ARTICLE_URLS)}]", end=" ")
        article = scrape_article_simple(url)
        
        if article:
            news_data.append(article)
            success_count += 1
        else:
            failed_count += 1
        
        # Rate limiting
        time.sleep(2)
    
    # Save results
    print("\n\n" + "="*70)
    print("SAVING RESULTS")
    print("="*70)
    
    # Save JSON
    json_path = os.path.join(OUTPUT_DIR, "news_data_complete.json")
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(news_data, f, ensure_ascii=False, indent=2)
    print(f"✓ JSON saved: {json_path}")
    
    # Save URLs list
    urls_path = os.path.join(OUTPUT_DIR, "news_urls_complete.txt")
    with open(urls_path, 'w', encoding='utf-8') as f:
        for article in news_data:
            f.write(article['source_url'] + '\n')
    print(f"✓ URLs saved: {urls_path}")
    
    # Summary
    print("\n" + "="*70)
    print("SCRAPING SUMMARY")
    print("="*70)
    print(f"Total articles scraped: {success_count}")
    print(f"Failed: {failed_count}")
    print(f"Images downloaded: {sum(1 for a in news_data if a.get('image_path'))}")
    print(f"Output directory: {OUTPUT_DIR}")
    print(f"Images directory: {IMAGES_DIR}")
    print("="*70)


if __name__ == "__main__":
    main()
