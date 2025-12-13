"""
Convert scraped news data to Laravel seeder format
"""
import json
import os
from datetime import datetime
from pathlib import Path

def convert_to_php_seeder(json_file, output_file):
    """Convert JSON to PHP seeder format"""
    
    # Load JSON data
    with open(json_file, 'r', encoding='utf-8') as f:
        news_data = json.load(f)
    
    # PHP seeder template
    php_template = '''<?php

namespace Database\\Seeders;

use Illuminate\\Database\\Seeder;
use Illuminate\\Support\\Facades\\DB;
use Carbon\\Carbon;

class ScrapedNewsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * 
     * Data scraped from: https://balaibahasasultra.kemendikdasmen.go.id/
     * Total articles: {total}
     * Generated at: {generated_at}
     */
    public function run(): void
    {
        $newsData = {data};

        foreach ($newsData as $item) {
            // Insert ke tabel news
            $newsId = DB::table('news')->insertGetId([
                'title' => ['id' => $item['title'], 'en' => $item['title']],
                'slug' => $item['slug'],
                'excerpt' => ['id' => $item['summary'], 'en' => $item['summary']],
                'content' => ['id' => $item['summary'], 'en' => $item['summary']],
                'featured_image' => $item['image_path'],
                'published_at' => Carbon::parse($item['published_at']),
                'is_featured' => false,
                'status' => 'published',
                'views_count' => rand(50, 500),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Insert categories (if you have categories table)
            // foreach ($item['categories'] as $category) {
            //     DB::table('news_categories')->insert([
            //         'news_id' => $newsId,
            //         'category' => $category,
            //     ]);
            // }
        }

        $this->command->info('Scraped news seeded successfully!');
    }
}
'''

    # Convert Python data to PHP array format
    def python_to_php_array(data):
        """Convert Python data structure to PHP array syntax"""
        if isinstance(data, dict):
            items = []
            for key, value in data.items():
                php_value = python_to_php_array(value)
                items.append(f"'{key}' => {php_value}")
            return "[" + ", ".join(items) + "]"
        elif isinstance(data, list):
            items = [python_to_php_array(item) for item in data]
            return "[" + ", ".join(items) + "]"
        elif isinstance(data, str):
            # Escape single quotes for PHP
            escaped = data.replace("'", "\\'").replace('"', '\\"')
            return f"'{escaped}'"
        elif isinstance(data, bool):
            return 'true' if data else 'false'
        elif data is None:
            return 'null'
        else:
            return str(data)
    
    # Generate PHP array
    php_data = python_to_php_array(news_data)
    
    # Format the PHP seeder
    seeder_content = php_template.format(
        total=len(news_data),
        generated_at=datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        data=php_data
    )
    
    # Save to file
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(seeder_content)
    
    print(f"✓ PHP Seeder created: {output_file}")
    print(f"  Total records: {len(news_data)}")
    
    return output_file


def generate_sql_insert(json_file, output_file):
    """Generate SQL INSERT statements"""
    
    with open(json_file, 'r', encoding='utf-8') as f:
        news_data = json.load(f)
    
    sql_statements = []
    sql_statements.append("-- Scraped News Data")
    sql_statements.append(f"-- Total records: {len(news_data)}")
    sql_statements.append(f"-- Generated at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    sql_statements.append("")
    
    for item in news_data:
        # Escape single quotes for SQL
        title = item['title'].replace("'", "''")
        summary = item['summary'].replace("'", "''")
        slug = item['slug']
        source_url = item['source_url']
        published_at = item['published_at']
        image_path = item.get('image_path', '')
        categories = ','.join(item.get('categories', []))
        
        sql = f"""INSERT INTO news (title, slug, excerpt, content, featured_image, published_at, status, created_at, updated_at) 
VALUES (
    '{{"id": "{title}", "en": "{title}"}}',
    '{slug}',
    '{{"id": "{summary}", "en": "{summary}"}}',
    '{{"id": "{summary}", "en": "{summary}"}}',
    '{image_path}',
    '{published_at}',
    'published',
    NOW(),
    NOW()
);
"""
        sql_statements.append(sql)
    
    # Save to file
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(sql_statements))
    
    print(f"✓ SQL file created: {output_file}")
    print(f"  Total statements: {len(news_data)}")
    
    return output_file


def main():
    print("="*70)
    print("NEWS DATA CONVERTER")
    print("="*70)
    
    # Input/Output paths
    json_file = "scraped-data/news_data_complete.json"
    php_output = "database/seeders/ScrapedNewsSeeder.php"
    sql_output = "scraped-data/news_data.sql"
    
    if not os.path.exists(json_file):
        print(f"✗ Error: JSON file not found: {json_file}")
        print("  Run the scraper first: py scripts/python_scraper/simple_scraper.py")
        return
    
    print(f"\n📄 Input: {json_file}")
    print(f"\n🔄 Converting to multiple formats...\n")
    
    # Convert to PHP seeder
    try:
        convert_to_php_seeder(json_file, php_output)
    except Exception as e:
        print(f"✗ Error creating PHP seeder: {e}")
    
    # Generate SQL
    try:
        generate_sql_insert(json_file, sql_output)
    except Exception as e:
        print(f"✗ Error creating SQL file: {e}")
    
    print("\n" + "="*70)
    print("CONVERSION COMPLETE")
    print("="*70)
    print("\nNext steps:")
    print("1. Review the generated files")
    print("2. Run: php artisan db:seed --class=ScrapedNewsSeeder")
    print("   OR")
    print("3. Import SQL: mysql -u root -p database_name < scraped-data/news_data.sql")
    print("="*70)


if __name__ == "__main__":
    main()
