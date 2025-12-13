import requests
from bs4 import BeautifulSoup
import json
import re
import os
import time
from urllib.parse import urljoin, urlparse
from datetime import datetime
from pathlib import Path
import hashlib

class BalaiBeritaCrawler:
    def __init__(self, base_url, output_dir="scraped-data", images_dir="public/images/news"):
        self.base_url = base_url
        self.output_dir = output_dir
        self.images_dir = images_dir
        self.visited_urls = set()
        self.news_data = []
        
        # Buat direktori jika belum ada
        Path(output_dir).mkdir(parents=True, exist_ok=True)
        Path(images_dir).mkdir(parents=True, exist_ok=True)
        
        # Headers untuk request
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    
    def get_slug_from_url(self, url):
        """Extract slug from URL"""
        path = urlparse(url).path
        slug = path.strip('/').split('/')[-1]
        return slug
    
    def download_image(self, image_url, slug):
        """Download image dan simpan dengan nama berdasarkan slug"""
        try:
            response = requests.get(image_url, headers=self.headers, timeout=30)
            if response.status_code == 200:
                # Dapatkan ekstensi dari URL
                ext = os.path.splitext(urlparse(image_url).path)[1]
                if not ext or ext.lower() not in ['.jpg', '.jpeg', '.png', '.webp']:
                    ext = '.jpg'
                
                # Buat nama file
                filename = f"{slug}{ext}"
                filepath = os.path.join(self.images_dir, filename)
                
                # Simpan gambar
                with open(filepath, 'wb') as f:
                    f.write(response.content)
                
                # Return path relatif untuk database
                return f"images/news/{filename}"
            return None
        except Exception as e:
            print(f"Error downloading image {image_url}: {str(e)}")
            return None
    
    def extract_date_from_metadata(self, soup):
        """Extract published date from metadata"""
        # Coba dari meta tag
        date_meta = soup.find('meta', property='article:published_time')
        if date_meta and date_meta.get('content'):
            try:
                date_str = date_meta['content']
                # Parse ISO format datetime
                dt = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
                return dt.strftime('%Y-%m-%dT%H:%M:%SZ')
            except:
                pass
        
        # Default ke tanggal sekarang jika tidak ditemukan
        return datetime.now().strftime('%Y-%m-%dT%H:%M:%SZ')
    
    def extract_categories(self, soup):
        """Extract categories from article"""
        categories = []
        
        # Cari dari breadcrumb atau category links
        category_links = soup.find_all('a', rel='category tag')
        for link in category_links:
            cat_text = link.get_text(strip=True)
            if cat_text:
                categories.append(cat_text)
        
        # Default categories jika tidak ditemukan
        if not categories:
            categories = ["Berita", "Kegiatan"]
        
        return categories
    
    def generate_summary(self, content, max_length=200):
        """Generate summary from content"""
        # Bersihkan HTML tags
        text = re.sub('<[^<]+?>', '', content)
        # Bersihkan whitespace berlebih
        text = ' '.join(text.split())
        # Potong ke panjang maksimal
        if len(text) > max_length:
            text = text[:max_length].rsplit(' ', 1)[0] + '...'
        return text
    
    def determine_sentiment(self, title, summary):
        """Simple sentiment analysis based on keywords"""
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
    
    def scrape_article(self, url):
        """Scrape single article"""
        try:
            print(f"Scraping: {url}")
            response = requests.get(url, headers=self.headers, timeout=30)
            
            if response.status_code != 200:
                print(f"Failed to fetch {url}: Status {response.status_code}")
                return None
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Extract title
            title_tag = soup.find('h1') or soup.find('meta', property='og:title')
            title = title_tag.get_text(strip=True) if title_tag and hasattr(title_tag, 'get_text') else title_tag.get('content', '') if title_tag else "Untitled"
            
            # Extract slug
            slug = self.get_slug_from_url(url)
            
            # Extract content - multiple selectors for better compatibility
            content = ""
            content_selectors = [
                'div.entry-content',
                'div.post-content',
                'article.post-body',
                'div.article-content',
                'div.content',
                'div.main-content',
                'article[itemprop="articleBody"]',
                'div[itemprop="articleBody"]'
            ]

            for selector in content_selectors:
                content_div = soup.select_one(selector)
                if content_div:
                    # Get full HTML content for better formatting
                    content = str(content_div)
                    # Also get text version for summary generation
                    text_content = content_div.get_text(separator=' ', strip=True)
                    break

            # Fallback: try to find main content area
            if not content:
                # Look for main content area with heuristics
                potential_content = soup.find_all(['div', 'section', 'article'], class_=lambda x: x and any(keyword in x.lower() for keyword in ['content', 'article', 'post', 'main']))

                best_content = None
                max_length = 0

                for element in potential_content:
                    text = element.get_text(separator=' ', strip=True)
                    if len(text) > max_length and len(text) > 500:  # At least 500 characters
                        max_length = len(text)
                        best_content = element

                if best_content:
                    content = str(best_content)
                    text_content = best_content.get_text(separator=' ', strip=True)
                else:
                    text_content = ""

            # Generate summary from text content
            summary = self.generate_summary(text_content) if text_content else "Artikel dari Balai Bahasa Sulawesi Tenggara."
            
            # Extract and download image
            image_path = None
            og_image = soup.find('meta', property='og:image')
            if og_image and og_image.get('content'):
                image_url = og_image['content']
                image_path = self.download_image(image_url, slug)
            
            # Extract published date
            published_at = self.extract_date_from_metadata(soup)
            
            # Extract categories
            categories = self.extract_categories(soup)
            
            # Determine sentiment
            sentiment = self.determine_sentiment(title, summary)
            
            # Build article data
            article_data = {
                "title": title,
                "slug": slug,
                "excerpt": summary,  # excerpt for preview
                "content": content if content else f"<p>{summary}</p>",  # full HTML content
                "summary": summary,  # legacy field
                "source_url": url,
                "published_at": published_at,
                "sentiment": sentiment,
                "validation_status": "Verified",
                "image_path": image_path,
                "categories": categories
            }
            
            return article_data
            
        except Exception as e:
            print(f"Error scraping {url}: {str(e)}")
            return None
    
    def find_article_links(self, page_url):
        """Find all article links from a page"""
        try:
            print(f"Finding links on: {page_url}")
            response = requests.get(page_url, headers=self.headers, timeout=30)
            
            if response.status_code != 200:
                return []
            
            soup = BeautifulSoup(response.content, 'html.parser')
            links = []
            
            # Cari semua link artikel
            # Pattern 1: Link di dalam article atau post
            for article in soup.find_all(['article', 'div'], class_=lambda x: x and ('post' in x or 'article' in x)):
                link = article.find('a', href=True)
                if link:
                    href = link['href']
                    # Filter hanya link berita dari domain yang sama
                    if self.base_url in href and href not in self.visited_urls:
                        # Skip halaman kategori dan tag
                        if not any(x in href for x in ['/category/', '/tag/', '/page/', '/wp-', '/feed']):
                            links.append(href)
            
            # Pattern 2: Link dari daftar berita
            for link in soup.find_all('a', href=True):
                href = link['href']
                # Filter link berita
                if (self.base_url in href and 
                    href not in self.visited_urls and
                    not any(x in href for x in ['/category/', '/tag/', '/page/', '/wp-', '/feed', '/berita-kegiatan/'])):
                    # Harus memiliki struktur URL artikel (ada path setelah domain)
                    path = urlparse(href).path.strip('/')
                    if path and '/' not in path:  # Single level path (artikel)
                        links.append(href)
            
            return list(set(links))  # Hapus duplikat
            
        except Exception as e:
            print(f"Error finding links on {page_url}: {str(e)}")
            return []
    
    def crawl(self, start_url, max_depth=3, max_articles=50):
        """Main crawling function with depth and limit"""
        print(f"Starting crawl from: {start_url}")
        print(f"Max depth: {max_depth}, Max articles: {max_articles}")
        
        urls_to_visit = [(start_url, 0)]  # (url, depth)
        
        while urls_to_visit and len(self.news_data) < max_articles:
            current_url, depth = urls_to_visit.pop(0)
            
            if current_url in self.visited_urls or depth > max_depth:
                continue
            
            self.visited_urls.add(current_url)
            
            # Jika ini halaman daftar (berita-kegiatan), cari link artikel
            if '/berita-kegiatan' in current_url or current_url.endswith('/'):
                found_links = self.find_article_links(current_url)
                print(f"Found {len(found_links)} article links")
                
                for link in found_links:
                    if len(self.news_data) < max_articles:
                        urls_to_visit.append((link, depth + 1))
            else:
                # Ini artikel, scrape kontennya
                article_data = self.scrape_article(current_url)
                if article_data:
                    self.news_data.append(article_data)
                    print(f"✓ Scraped article {len(self.news_data)}/{max_articles}: {article_data['title'][:50]}...")
            
            # Rate limiting
            time.sleep(1)
        
        print(f"\nCrawling complete! Total articles scraped: {len(self.news_data)}")
        return self.news_data
    
    def save_to_json(self, filename="news_data.json"):
        """Save scraped data to JSON file"""
        filepath = os.path.join(self.output_dir, filename)
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(self.news_data, f, ensure_ascii=False, indent=2)
        print(f"Data saved to: {filepath}")
        return filepath
    
    def save_urls_list(self, filename="news_urls.txt"):
        """Save list of scraped URLs"""
        filepath = os.path.join(self.output_dir, filename)
        with open(filepath, 'w', encoding='utf-8') as f:
            for article in self.news_data:
                f.write(article['source_url'] + '\n')
        print(f"URLs saved to: {filepath}")
        return filepath


if __name__ == "__main__":
    # Konfigurasi
    BASE_URL = "https://balaibahasasultra.kemendikdasmen.go.id"
    START_URL = "https://balaibahasasultra.kemendikdasmen.go.id/berita-kegiatan/"
    
    # Parameter crawling
    MAX_DEPTH = 3  # Kedalaman maksimal crawling
    MAX_ARTICLES = 100  # Jumlah maksimal artikel yang akan di-crawl
    
    # Inisialisasi crawler
    crawler = BalaiBeritaCrawler(
        base_url=BASE_URL,
        output_dir="scraped-data",
        images_dir="public/images/news"
    )
    
    # Mulai crawling
    print("="*60)
    print("BALAI BAHASA SULTRA - NEWS CRAWLER")
    print("="*60)
    
    news_data = crawler.crawl(
        start_url=START_URL,
        max_depth=MAX_DEPTH,
        max_articles=MAX_ARTICLES
    )
    
    # Simpan hasil
    print("\n" + "="*60)
    print("SAVING RESULTS")
    print("="*60)
    
    json_file = crawler.save_to_json("news_data_final.json")
    urls_file = crawler.save_urls_list("news_urls_final.txt")
    
    # Summary
    print("\n" + "="*60)
    print("CRAWLING SUMMARY")
    print("="*60)
    print(f"Total articles scraped: {len(news_data)}")
    print(f"Total URLs visited: {len(crawler.visited_urls)}")
    print(f"JSON output: {json_file}")
    print(f"URLs list: {urls_file}")
    print(f"Images directory: {crawler.images_dir}")
    print("="*60)
