#!/bin/bash

echo "========================================"
echo "Balai Bahasa Sultra - News Crawler"
echo "========================================"
echo
echo "Starting news crawler with enhanced content extraction..."
echo

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    if ! command -v python &> /dev/null; then
        echo "ERROR: Python is not installed"
        echo "Please install Python 3.8+ and try again"
        exit 1
    else
        PYTHON_CMD="python"
    fi
else
    PYTHON_CMD="python3"
fi

echo "Using Python: $($PYTHON_CMD --version)"

# Check if required modules are installed
echo "Checking required Python modules..."
$PYTHON_CMD -c "import requests; from bs4 import BeautifulSoup" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "Installing required modules..."
    $PYTHON_CMD -m pip install requests beautifulsoup4
    if [ $? -ne 0 ]; then
        echo "Trying alternative installation method..."
        pip3 install requests beautifulsoup4 2>/dev/null
        if [ $? -ne 0 ]; then
            echo "========================================"
            echo "ERROR: Failed to install required modules"
            echo "========================================"
            echo
            echo "Please install manually:"
            echo "1. Run: $PYTHON_CMD -m pip install requests beautifulsoup4"
            echo "2. Or try: $PYTHON_CMD -m ensurepip --upgrade"
            echo
            echo "If you don't have pip, install it first:"
            echo "- Ubuntu/Debian: sudo apt install python3-pip"
            echo "- macOS: python3 -m ensurepip --upgrade"
            exit 1
        fi
    fi
    echo
    echo "Successfully installed required modules!"
    echo
fi

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$SCRIPT_DIR"

# Run the crawler
echo
echo "Starting crawler..."
echo "This may take several minutes depending on the number of articles..."
echo

$PYTHON_CMD scripts/python_scraper/news_crawler.py

if [ $? -eq 0 ]; then
    echo
    echo "========================================"
    echo "SUCCESS: Crawler completed successfully!"
    echo "========================================"
    echo
    echo "Data saved to:"
    echo "- scraped-data/news_data_final.json"
    echo "- scraped-data/news_urls_final.txt"
    echo "- Images saved to: public/images/news/"
    echo
    echo "Next steps:"
    echo "1. Run 'php artisan db:seed --class=NewsSeeder' to import to database"
    echo "2. Or import the SQL file: mysql -u root -p balai_bahasa_sultra < scraped-data/news_data.sql"
    echo
else
    echo
    echo "========================================"
    echo "ERROR: Crawler failed!"
    echo "========================================"
    echo "Please check the error messages above."
    echo
fi