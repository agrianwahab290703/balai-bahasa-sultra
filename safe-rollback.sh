#!/bin/bash

# Safe Rollback Script
# Script untuk rollback ke commit sebelumnya dengan backup

echo "🔄 Safe Rollback System"
echo "====================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Show recent commits
echo ""
print_info "Recent commits:"
git log --oneline -10

echo ""
print_warning "⚠️  Rollback akan mengembalikan kode ke commit sebelumnya"
print_warning "   Current changes yang belum commit akan hilang!"
echo ""

read -p "🔍 Lanjutkan rollback? (y/n): " confirm
if [[ ! $confirm =~ ^[Yy]$ ]]; then
    print_error "Rollback dibatalkan"
    exit 1
fi

# Backup current state
BACKUP_BRANCH="backup-$(date +%Y%m%d-%H%M%S)"
print_info "Membuat backup branch: $BACKUP_BRANCH"
git checkout -b "$BACKUP_BRANCH"

# Kembali ke main/master
git checkout main 2>/dev/null || git checkout master

# Show commit to rollback to
TARGET_COMMIT=$(git log --oneline -2 | tail -n1 | awk '{print $1}')
echo ""
print_info "Akan rollback ke commit: $(git log --oneline -1 --skip=1)"
git log --oneline -1 --skip=1

echo ""
read -p "🔍 Rollback ke commit ini? (y/n): " final_confirm
if [[ ! $final_confirm =~ ^[Yy]$ ]]; then
    print_error "Rollback dibatalkan"
    git checkout main 2>/dev/null || git checkout master
    git branch -D "$BACKUP_BRANCH" 2>/dev/null
    exit 1
fi

# Perform rollback
echo ""
print_info "Melakukan rollback..."
git reset --hard "$TARGET_COMMIT"

# Push rollback
echo ""
print_warning "Push rollback ke GitHub..."
git push --force-with-lease origin main

print_success "✨ Rollback berhasil!"
echo ""
print_info "Backup branch tersedia: $BACKUP_BRANCH"
print_info "Untuk kembali ke backup: git checkout $BACKUP_BRANCH"
echo ""
echo "📋 Current status:"
echo "- HEAD now at: $(git log --oneline -1)"
echo "- Backup branch: $BACKUP_BRANCH"