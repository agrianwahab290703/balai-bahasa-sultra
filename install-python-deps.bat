@echo off
echo ========================================
echo Install Python Dependencies for Crawler
echo ========================================
echo.
echo This script will install the required Python packages:
echo - requests (for HTTP requests)
echo - beautifulsoup4 (for HTML parsing)
echo.

:: Try to find Python
echo Finding Python installation...
where python >nul 2>&1
if %errorlevel% equ 0 (
    echo Found Python:
    python --version
    set PYTHON_CMD=python
    goto :check_pip
)

where python3 >nul 2>&1
if %errorlevel% equ 0 (
    echo Found Python3:
    python3 --version
    set PYTHON_CMD=python3
    goto :check_pip
)

echo ERROR: Python not found in PATH
echo Please install Python from https://python.org
echo Make sure to check "Add Python to PATH" during installation
pause
exit /b 1

:check_pip
echo.
echo Checking pip...
%PYTHON_CMD% -m pip --version >nul 2>&1
if %errorlevel% equ 0 (
    echo pip is available
    goto :install
)

echo pip not found, trying to install...
%PYTHON_CMD% -m ensurepip --upgrade
if %errorlevel% neq 0 (
    echo Failed to install pip automatically
    echo Please install pip manually
    pause
    exit /b 1
)

:install
echo.
echo Installing packages...
echo This may take a few minutes...
echo.

:: Install packages
%PYTHON_CMD% -m pip install requests beautifulsoup4

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo SUCCESS: Packages installed successfully!
    echo ========================================
    echo.
    echo You can now run the crawler with: run-crawler.bat
) else (
    echo.
    echo ========================================
    echo ERROR: Failed to install packages
    echo ========================================
    echo.
    echo Try installing manually:
    echo %PYTHON_CMD% -m pip install requests beautifulsoup4
    echo.
    echo If that fails, try:
    echo 1. Open Command Prompt as Administrator
    echo 2. Run: %PYTHON_CMD% -m pip install --upgrade pip
    echo 3. Then: %PYTHON_CMD% -m pip install requests beautifulsoup4
)

pause