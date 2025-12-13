#!/bin/bash

# Git Status Monitor
# Script untuk monitoring status Git dan GitHub integration

echo "📊 Git Status Monitor"
echo "=================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
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

# Basic info
echo ""
print_info "Repository Information:"
echo "📁 Current directory: $(pwd)"
echo "🌿 Current branch: $(git branch --show-current 2>/dev/null || echo 'Not on any branch')"

# Remote info
echo ""
print_info "Remote Configuration:"
if git remote get-url origin >/dev/null 2>&1; then
    print_success "Remote origin configured: $(git remote get-url origin)"
else
    print_error "No remote origin configured"
fi

# Git status
echo ""
print_info "Working Directory Status:"
if [[ -z $(git status --porcelain) ]]; then
    print_success "Working directory clean"
else
    print_warning "Uncommitted changes:"
    git status --short
fi

# Last commit
echo ""
print_info "Last Commit:"
git log --oneline -1

# Unpushed commits
echo ""
print_info "Push Status:"
UNPUSHED=$(git log origin/$(git branch --show-current)..$(git branch --show-current) --oneline 2>/dev/null)
if [[ -n "$UNPUSHED" ]]; then
    print_warning "Unpushed commits:"
    echo "$UNPUSHED"
else
    print_success "All commits pushed"
fi

# GitHub connectivity test
echo ""
print_info "GitHub Connectivity:"
if git remote get-url origin >/dev/null 2>&1; then
    if git ls-remote origin >/dev/null 2>&1; then
        print_success "Connected to GitHub"
    else
        print_error "Cannot connect to GitHub"
    fi
else
    print_warning "No GitHub remote configured"
fi

# Branch list
echo ""
print_info "Local Branches:"
git branch -a

echo ""
print_success "Status check completed!"