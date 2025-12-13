import json
import re

file_path = 'database/seeders/data/news_final.json'

# Read the file
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the specific unescaped quotes inside the content field
# We need to find quoted text inside content strings and escape them
# The problematic pattern is kebijakan "Pendidikan Bermutu untuk Semua"
content = content.replace('kebijakan "Pendidikan Bermutu untuk Semua"', 'kebijakan \\"Pendidikan Bermutu untuk Semua\\"')

# Also handle em dashes
content = content.replace('\u2014', '-')
content = content.replace('\u2013', '-')

# Replace any remaining curly quotes  
content = content.replace('\u201C', '\\"')
content = content.replace('\u201D', '\\"')

# Write the fixed content
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

# Validate the JSON
try:
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    print(f"JSON is valid! Total articles: {len(data)}")
except json.JSONDecodeError as e:
    print(f"JSON error: {e}")
