@echo off
REM GitHub Integration Setup untuk Windows
echo 🚀 Setup GitHub Integration untuk Balai Bahasa Sultra
echo ==================================================

REM Cek apakah sudah ada remote
git remote get-url origin >nul 2>&1
if %ERRORLEVEL%==0 (
    echo ⚠️ Remote 'origin' sudah ada. Ingin overwrite? (y/n)
    set /p response=
    if /i not "%response%"=="y" (
        echo ❌ Setup dibatalkan
        exit /b 1
    )
    git remote remove origin
)

REM Input GitHub repository URL
echo.
echo 📝 Masukkan informasi GitHub repository:
set /p username=GitHub Username:
set /p reponame=Repository Name:

REM Validasi input
if "%username%"=="" (
    echo ❌ Username harus diisi!
    exit /b 1
)
if "%reponame%"=="" (
    echo ❌ Repository name harus diisi!
    exit /b 1
)

REM Setup remote
set REPO_URL=https://github.com/%username%/%reponame%.git
echo.
echo 🔗 Menghubungkan ke: %REPO_URL%

git remote add origin "%REPO_URL%"
git branch -M main

echo ✅ Remote repository berhasil ditambahkan!
echo.
echo 📋 Next steps:
echo 1. Buat repository di GitHub: https://github.com/new
echo 2. Repository name: %reponame%
echo 3. Set sebagai Public/Private sesuai kebutuhan
echo 4. Jalankan: push-to-github.bat
echo.
echo 🔐 Untuk autentikasi tanpa password, setup SSH key:
echo    ssh-keygen -t ed25519 -C "your-email@example.com"
pause