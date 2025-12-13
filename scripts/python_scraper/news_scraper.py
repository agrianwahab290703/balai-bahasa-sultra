
import requests
from bs4 import BeautifulSoup
import json
import os
from datetime import datetime
from urllib.parse import urljoin

# Konfigurasi Target
TARGET_URL = "https://balaibahasasultra.kemendikdasmen.go.id/berita-kegiatan/"
OUTPUT_FILE = "../../database/seeders/data/news_dataset_final.json"
IMAGE_DIR = "../../public/images/news/"

# Header untuk simulasi browser (Bypass Basic Protection)
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7'
}

def analyze_sentiment(text):
    """
    Analisis sentimen sederhana berbasis kata kunci.
    Dalam produksi, gunakan library NLTK atau TextBlob.
    """
    positive_keywords = ['prestasi', 'juara', 'sukses', 'berhasil', 'penghargaan', 'resmi', 'dukung', 'positif']
    negative_keywords = ['gagal', 'batal', 'rusak', 'korupsi', 'kendala', 'negatif']
    
    score = 0
    text_lower = text.lower()
    
    for word in positive_keywords:
        if word in text_lower: score += 1
    for word in negative_keywords:
        if word in text_lower: score -= 1
        
    if score > 0: return "Positive"
    if score < 0: return "Negative"
    return "Neutral"

def scrape_news():
    print(f"[*] Memulai crawling ke: {TARGET_URL}")
    
    try:
        response = requests.get(TARGET_URL, headers=HEADERS, timeout=15)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        articles = soup.find_all('article') # Sesuaikan selector dengan struktur web target
        
        data = []
        
        for article in articles:
            # Ekstraksi Data
            title_el = article.find('h2', class_='entry-title')
            link_el = title_el.find('a') if title_el else None
            date_el = article.find('time', class_='entry-date')
            content_el = article.find('div', class_='entry-content')
            img_el = article.find('img')
            
            if title_el and link_el:
                title = title_el.get_text(strip=True)
                url = link_el['href']
                date = date_el['datetime'] if date_el else datetime.now().isoformat()
                summary = content_el.get_text(strip=True)[:200] + "..." if content_el else ""
                image_src = img_el['src'] if img_el else None
                
                # Analisis Sentimen
                sentiment = analyze_sentiment(title + " " + summary)
                
                news_item = {
                    "title": title,
                    "slug": url.split('/')[-2],
                    "summary": summary,
                    "source_url": url,
                    "published_at": date,
                    "sentiment": sentiment,
                    "image_url": image_src,
                    "scraped_at": datetime.now().isoformat()
                }
                
                data.append(news_item)
                print(f"[+] Berhasil ekstrak: {title}")

        # Simpan ke JSON
        os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
            
        print(f"[*] Selesai. {len(data)} data tersimpan di {OUTPUT_FILE}")

    except Exception as e:
        print(f"[!] Error: {e}")

if __name__ == "__main__":
    scrape_news()
