@echo off
REM Auto Push to GitHub untuk Windows
echo 🚀 Auto Push to GitHub
echo ====================

REM Cek apakah ada changes
git status --porcelain >nul
if %ERRORLEVEL%==1 (
    echo ⚠️ Tidak ada changes untuk di-commit
    pause
    exit /b 0
)

REM Show status
echo.
echo 📋 Git Status:
git status --short

REM Cek apakah ini breaking change
echo.
set /p is_feature=🔍 Apakah ini fitur baru atau breaking change? (y/n):

if /i "%is_feature%"=="y" (
    REM Buat feature branch
    for /f "tokens=2 delims==" %%A in ('wmic OS Get localdatetime /value') do set "dt=%%A"
    set "YYYY=%dt:~0,4%"
    set "MM=%dt:~4,2%"
    set "DD=%dt:~6,2%"
    set "HH=%dt:~8,2%"
    set "Min=%dt:~10,2%"
    set "Sec=%dt:~12,2%"
    set "timestamp=%YYYY%%MM%%DD%-%HH%%Min%%Sec%"
    set "BRANCH_NAME=feature-%timestamp%"

    echo ⚠️ Membuat feature branch: %BRANCH_NAME%
    git checkout -b "%BRANCH_NAME%"

    REM Add semua changes
    echo.
    echo 📝 Menambahkan semua changes...
    git add .

    REM Commit dengan timestamp
    set "COMMIT_MESSAGE=feat: Add new feature - %date% %time%"
    echo 💬 Commit message: %COMMIT_MESSAGE%
    git commit -m "%COMMIT_MESSAGE%"

    REM Push ke feature branch
    echo.
    echo ✅ Push ke feature branch...
    git push -u origin "%BRANCH_NAME%"

    echo.
    echo ✨ Feature berhasil di-push ke branch: %BRANCH_NAME%
    echo 📋 Create Pull Request di GitHub untuk merge ke main

) else (
    REM Untuk minor changes/fixes langsung ke main
    echo.
    echo 📝 Menambahkan changes...
    git add .

    REM Auto commit message
    set "COMMIT_MESSAGE=fix: Minor updates - %date% %time%"
    echo 💬 Commit message: %COMMIT_MESSAGE%

    REM Konfirmasi commit
    set /p confirm=🔍 Apakah commit message sudah sesuai? (y/n):
    if /i not "%confirm%"=="y" (
        set /p CUSTOM_MESSAGE=💬 Masukkan commit message custom:
        if not "%CUSTOM_MESSAGE%"=="" (
            set "COMMIT_MESSAGE=%CUSTOM_MESSAGE%"
        )
    )

    git commit -m "%COMMIT_MESSAGE%"

    REM Push ke main
    echo.
    echo ✅ Push ke main branch...
    git push origin main

    echo ✨ Changes berhasil di-push ke main!
)

echo.
echo 🎉 Selesai! Semua changes sudah di-push ke GitHub
echo.
echo 📋 Summary:
echo - Branch:
git branch --show-current
echo - Last commit:
git log -1 --oneline
echo - Remote:
git remote get-url origin 2>nul || echo Not configured
pause