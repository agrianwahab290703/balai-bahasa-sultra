@echo off
echo ========================================
echo Balai Bahasa Sultra - News Crawler
echo ========================================
echo.
echo Starting news crawler with enhanced content extraction...
echo.

:: Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ and try again
    pause
    exit /b 1
)

:: Check if required modules are installed
echo Checking required Python modules...
python -c "import requests; from bs4 import BeautifulSoup" 2>nul
if %errorlevel% neq 0 (
    echo Installing required modules...
    echo Method 1: Trying pip...
    python -m pip install requests beautifulsoup4
    if %errorlevel% neq 0 (
        echo Method 2: Trying pip directly...
        pip install requests beautifulsoup4
        if %errorlevel% neq 0 (
            echo Method 3: Trying pip3...
            pip3 install requests beautifulsoup4
            if %errorlevel% neq 0 (
                echo Method 4: Trying python -m pip3...
                python -m pip3 install requests beautifulsoup4
                if %errorlevel% neq 0 (
                    echo ========================================
                    echo ERROR: Failed to install required modules
                    echo ========================================
                    echo.
                    echo Please install manually:
                    echo 1. Open Command Prompt as Administrator
                    echo 2. Run: python -m pip install requests beautifulsoup4
                    echo 3. Or try: python -m ensurepip --upgrade
                    echo.
                    echo If still fails, try:
                    echo - Install Python from https://python.org
                    echo - Make sure "Add Python to PATH" is checked during installation
                    echo.
                    pause
                    exit /b 1
                )
            )
        )
    )
    echo.
    echo Successfully installed required modules!
    echo.
)

:: Navigate to project directory
cd /d "%~dp0"

:: Run the crawler
echo.
echo Starting crawler...
echo This may take several minutes depending on the number of articles...
echo.

python scripts\python_scraper\news_crawler.py

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo SUCCESS: Crawler completed successfully!
    echo ========================================
    echo.
    echo Data saved to:
    echo - scraped-data\news_data_final.json
    echo - scraped-data\news_urls_final.txt
    echo - Images saved to: public\images\news\
    echo.
    echo Next steps:
    echo 1. Run 'php artisan db:seed --class=NewsSeeder' to import to database
    echo 2. Or import the SQL file: mysql -u root -p balai_bahasa_sultra < scraped-data\news_data.sql
    echo.
) else (
    echo.
    echo ========================================
    echo ERROR: Crawler failed!
    echo ========================================
    echo Please check the error messages above.
    echo.
)

pause