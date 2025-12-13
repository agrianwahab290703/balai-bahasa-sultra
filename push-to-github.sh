#!/bin/bash

# Auto Push to GitHub Script
# Script untuk otomatis commit dan push ke GitHub dengan safety checks

echo "🚀 Auto Push to GitHub"
echo "===================="

# Colors untuk output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function untuk print dengan warna
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Cek apakah ada changes
if [[ -z $(git status --porcelain) ]]; then
    print_warning "Tidak ada changes untuk di-commit"
    exit 0
fi

# Show status
echo ""
echo "📋 Git Status:"
git status --short

# Cek apakah ini breaking change
echo ""
read -p "🔍 Apakah ini fitur baru atau breaking change? (y/n): " is_feature

if [[ $is_feature =~ ^[Yy]$ ]]; then
    # Buat feature branch
    BRANCH_NAME="feature/$(date +%Y%m%d-%H%M%S)"
    print_warning "Membuat feature branch: $BRANCH_NAME"
    git checkout -b "$BRANCH_NAME"

    # Add semua changes
    echo ""
    echo "📝 Menambahkan semua changes..."
    git add .

    # Commit dengan timestamp
    COMMIT_MESSAGE="feat: Add new feature - $(date '+%Y-%m-%d %H:%M:%S')"
    echo "💬 Commit message: $COMMIT_MESSAGE"
    git commit -m "$COMMIT_MESSAGE"

    # Push ke feature branch
    echo ""
    print_success "Push ke feature branch..."
    git push -u origin "$BRANCH_NAME"

    echo ""
    print_success "✨ Feature berhasil di-push ke branch: $BRANCH_NAME"
    echo "📋 Create Pull Request di GitHub untuk merge ke main"

else
    # Untuk minor changes/fixes langsung ke main
    echo ""
    echo "📝 Menambahkan changes..."
    git add .

    # Auto commit message
    COMMIT_MESSAGE="fix: Minor updates - $(date '+%Y-%m-%d %H:%M:%S')"
    echo "💬 Commit message: $COMMIT_MESSAGE"

    # Konfirmasi commit
    read -p "🔍 Apakah commit message sudah sesuai? (y/n): " confirm
    if [[ ! $confirm =~ ^[Yy]$ ]]; then
        read -p "💬 Masukkan commit message custom: " CUSTOM_MESSAGE
        if [[ -n "$CUSTOM_MESSAGE" ]]; then
            COMMIT_MESSAGE="$CUSTOM_MESSAGE"
        fi
    fi

    git commit -m "$COMMIT_MESSAGE"

    # Push ke main
    echo ""
    print_success "Push ke main branch..."
    git push origin main

    print_success "✨ Changes berhasil di-push ke main!"
fi

echo ""
echo "🎉 Selesai! Semua changes sudah di-push ke GitHub"
echo ""
echo "📋 Summary:"
echo "- Branch: $(git branch --show-current)"
echo "- Last commit: $(git log -1 --oneline)"
echo "- Remote: $(git remote get-url origin 2>/dev/null || echo 'Not configured')"