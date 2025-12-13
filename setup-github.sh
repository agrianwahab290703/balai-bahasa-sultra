#!/bin/bash

# GitHub Integration Setup Script
# Script untuk menghubungkan project ke GitHub dengan otomasi

echo "🚀 Setup GitHub Integration untuk Balai Bahasa Sultra"
echo "=================================================="

# Cek apakah sudah ada remote
if git remote get-url origin 2>/dev/null; then
    echo "⚠️  Remote 'origin' sudah ada. Ingin overwrite? (y/n)"
    read -r response
    if [[ ! $response =~ ^[Yy]$ ]]; then
        echo "❌ Setup dibatalkan"
        exit 1
    fi
    git remote remove origin
fi

# Input GitHub repository URL
echo ""
echo "📝 Masukkan informasi GitHub repository:"
read -p "GitHub Username: " username
read -p "Repository Name: " reponame

# Validasi input
if [[ -z "$username" || -z "$reponame" ]]; then
    echo "❌ Username dan repository name harus diisi!"
    exit 1
fi

# Setup remote
REPO_URL="https://github.com/$username/$reponame.git"
echo ""
echo "🔗 Menghubungkan ke: $REPO_URL"

git remote add origin "$REPO_URL"
git branch -M main

echo "✅ Remote repository berhasil ditambahkan!"
echo ""
echo "📋 Next steps:"
echo "1. Buat repository di GitHub: https://github.com/new"
echo "2. Repository name: $reponame"
echo "3. Set sebagai Public/Private sesuai kebutuhan"
echo "4. Jalankan: ./push-to-github.sh"
echo ""
echo "🔐 Untuk autentikasi tanpa password, setup SSH key:"
echo "   ssh-keygen -t ed25519 -C \"your-email@example.com\""