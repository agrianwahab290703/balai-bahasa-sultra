# Panduan Penggunaan GitHub

Dokumentasi lengkap untuk mengelola kode project Balai Bahasa Sultra menggunakan Git dan GitHub.

---

## Daftar Isi

1. [Setup Awal](#1-setup-awal)
2. [Workflow Harian](#2-workflow-harian)
3. [Publish ke GitHub](#3-publish-ke-github)
4. [Update Fitur (Branch & Merge)](#4-update-fitur-branch--merge)
5. [Kembalikan Fitur Sebelumnya (Rollback)](#5-kembalikan-fitur-sebelumnya-rollback)
6. [Mengatasi Konflik](#6-mengatasi-konflik)
7. [Tips & Best Practices](#7-tips--best-practices)
8. [Perintah Git Lengkap](#8-perintah-git-lengkap)

---

## 1. Setup Awal

### Konfigurasi Git (Pertama Kali)

```bash
# Set nama dan email (wajib untuk commit)
git config --global user.name "Nama Anda"
git config --global user.email "email@example.com"

# Cek konfigurasi
git config --list
```

### Clone Repository yang Sudah Ada

```bash
# Clone dari GitHub
git clone https://github.com/username/balai-bahasa-sultra.git

# Masuk ke folder project
cd balai-bahasa-sultra
```

### Inisialisasi Repository Baru

```bash
# Di folder project
git init

# Tambahkan remote GitHub
git remote add origin https://github.com/username/balai-bahasa-sultra.git

# Verifikasi remote
git remote -v
```

---

## 2. Workflow Harian

### Cek Status Perubahan

```bash
# Lihat file yang berubah
git status

# Lihat detail perubahan
git diff

# Lihat perubahan file tertentu
git diff path/to/file.php
```

### Simpan Perubahan (Commit)

```bash
# Tambah semua file yang berubah
git add .

# Atau tambah file tertentu saja
git add app/Http/Controllers/PpidController.php
git add resources/js/Pages/Admin/

# Commit dengan pesan deskriptif
git commit -m "feat: tambah modul PPID content management"

# Commit dengan deskripsi panjang
git commit -m "feat: revamp modul admin PPID" -m "- Tambah hierarchical content structure
- Integrasi TipTap editor
- Upload gambar dan dokumen
- Breadcrumb navigation"
```

### Format Pesan Commit (Conventional Commits)

```
feat:     Fitur baru
fix:      Perbaikan bug
docs:     Dokumentasi
style:    Formatting (tidak mengubah logic)
refactor: Refactoring kode
test:     Menambah/update test
chore:    Maintenance (update dependencies, dll)
```

**Contoh:**
```bash
git commit -m "feat: tambah halaman PPID content"
git commit -m "fix: perbaiki error upload gambar"
git commit -m "docs: update panduan penggunaan"
git commit -m "refactor: optimasi query database"
```

---

## 3. Publish ke GitHub

### Push Pertama Kali

```bash
# Push branch main ke GitHub
git push -u origin main

# Jika branch default adalah master
git push -u origin master
```

### Push Perubahan (Setelah Commit)

```bash
# Ambil perubahan terbaru dari GitHub dulu (penting!)
git pull origin main

# Push perubahan lokal ke GitHub
git push origin main
```

### Push dengan Tag (Untuk Rilis Versi)

```bash
# Buat tag versi
git tag -a v1.0.0 -m "Rilis versi 1.0.0"

# Push tag ke GitHub
git push origin v1.0.0

# Push semua tag
git push origin --tags
```

---

## 4. Update Fitur (Branch & Merge)

### Workflow Branch untuk Fitur Baru

```bash
# 1. Pastikan di branch main dan update terbaru
git checkout main
git pull origin main

# 2. Buat branch baru untuk fitur
git checkout -b feature/ppid-revamp

# 3. Kerjakan fitur, commit secara berkala
git add .
git commit -m "feat: tambah migration ppid_contents"

git add .
git commit -m "feat: update model PpidContent"

# 4. Push branch ke GitHub
git push -u origin feature/ppid-revamp

# 5. Setelah fitur selesai, merge ke main
git checkout main
git pull origin main
git merge feature/ppid-revamp

# 6. Push hasil merge
git push origin main

# 7. Hapus branch fitur (opsional)
git branch -d feature/ppid-revamp
git push origin --delete feature/ppid-revamp
```

### Tipe Branch yang Umum Digunakan

| Prefix | Kegunaan | Contoh |
|--------|----------|--------|
| `feature/` | Fitur baru | `feature/ppid-revamp` |
| `fix/` | Perbaikan bug | `fix/upload-error` |
| `hotfix/` | Perbaikan urgent di production | `hotfix/security-patch` |
| `release/` | Persiapan rilis | `release/v1.2.0` |

### Merge dengan Pull Request (Recommended)

1. Push branch ke GitHub
2. Buka GitHub, klik "Pull Request"
3. Pilih branch source dan target
4. Tambahkan deskripsi
5. Review dan merge via GitHub UI

---

## 5. Kembalikan Fitur Sebelumnya (Rollback)

### Lihat Riwayat Commit

```bash
# Lihat log commit
git log --oneline

# Output contoh:
# a1b2c3d (HEAD -> main) feat: tambah ppid content
# e4f5g6h fix: perbaiki error validation
# i7j8k9l refactor: optimasi controller
# m0n1o2p feat: fitur sebelumnya

# Lihat log dengan grafik
git log --oneline --graph --all

# Lihat detail commit tertentu
git show a1b2c3d
```

### Rollback ke Commit Sebelumnya (Soft - Aman)

```bash
# Kembalikan file tertentu ke versi sebelumnya
git checkout e4f5g6h -- app/Http/Controllers/PpidController.php

# Buat commit baru yang membatalkan commit tertentu
git revert a1b2c3d
git push origin main
```

### Rollback ke Commit Sebelumnya (Hard - Hati-hati!)

```bash
# ⚠️ PERINGATAN: Ini akan menghapus semua perubahan setelah commit tersebut!

# Reset ke commit tertentu (lokal saja)
git reset --hard e4f5g6h

# Force push ke GitHub (sangat berbahaya jika tim lain sudah pull)
git push --force origin main
```

### Simpan Perubahan Sementara (Stash)

```bash
# Simpan perubahan sementara tanpa commit
git stash

# Lihat daftar stash
git stash list

# Kembalikan stash terakhir
git stash pop

# Kembalikan stash tertentu
git stash apply stash@{0}

# Hapus stash
git stash drop stash@{0}
```

### Rollback Migration Laravel

```bash
# Rollback migration terakhir
php artisan migrate:rollback

# Rollback beberapa step
php artisan migrate:rollback --step=3

# Reset semua migration
php artisan migrate:reset

# Fresh migration (reset + migrate)
php artisan migrate:fresh

# Fresh dengan seeder
php artisan migrate:fresh --seed
```

---

## 6. Mengatasi Konflik

### Saat Pull Terjadi Konflik

```bash
# Pull dan terjadi konflik
git pull origin main

# Git akan menandai file yang konflik
# Buka file tersebut, cari marker:
<<<<<<< HEAD
Kode versi lokal Anda
=======
Kode versi dari GitHub
>>>>>>> origin/main

# Edit file, hapus marker, pilih kode yang benar
# Kemudian:
git add .
git commit -m "fix: resolve merge conflict"
git push origin main
```

### Batalkan Merge yang Bermasalah

```bash
# Batalkan merge yang sedang berlangsung
git merge --abort

# Atau reset ke sebelum merge
git reset --hard HEAD~1
```

---

## 7. Tips & Best Practices

### ✅ DO (Lakukan)

1. **Commit sering dengan pesan jelas**
   ```bash
   git commit -m "feat: tambah validasi upload gambar max 2MB"
   ```

2. **Pull sebelum push**
   ```bash
   git pull origin main
   git push origin main
   ```

3. **Gunakan branch untuk fitur besar**
   ```bash
   git checkout -b feature/nama-fitur
   ```

4. **Review perubahan sebelum commit**
   ```bash
   git diff
   git status
   ```

5. **Backup dengan tag untuk rilis**
   ```bash
   git tag -a v1.0.0 -m "Rilis stabil"
   ```

### ❌ DON'T (Hindari)

1. **Jangan commit file sensitif**
   - `.env` (berisi password)
   - `storage/` (file upload)
   - `node_modules/`, `vendor/`

2. **Jangan force push ke branch utama**
   ```bash
   # ❌ HINDARI
   git push --force origin main
   ```

3. **Jangan commit kode yang rusak**
   - Test dulu sebelum commit
   - Pastikan `npm run build` sukses

4. **Jangan menggunakan pesan commit tidak jelas**
   ```bash
   # ❌ Buruk
   git commit -m "update"
   git commit -m "fix bug"
   
   # ✅ Baik
   git commit -m "fix: perbaiki error 500 saat upload PDF"
   ```

---

## 8. Perintah Git Lengkap

### Perintah Dasar

| Perintah | Fungsi |
|----------|--------|
| `git init` | Inisialisasi repository |
| `git clone <url>` | Clone repository |
| `git status` | Cek status perubahan |
| `git add .` | Stage semua perubahan |
| `git add <file>` | Stage file tertentu |
| `git commit -m "msg"` | Commit dengan pesan |
| `git push` | Upload ke remote |
| `git pull` | Download dari remote |

### Perintah Branch

| Perintah | Fungsi |
|----------|--------|
| `git branch` | Lihat daftar branch |
| `git branch <name>` | Buat branch baru |
| `git checkout <name>` | Pindah ke branch |
| `git checkout -b <name>` | Buat dan pindah branch |
| `git merge <name>` | Merge branch |
| `git branch -d <name>` | Hapus branch lokal |

### Perintah Riwayat

| Perintah | Fungsi |
|----------|--------|
| `git log` | Lihat riwayat commit |
| `git log --oneline` | Riwayat singkat |
| `git show <hash>` | Detail commit |
| `git diff` | Lihat perubahan |
| `git blame <file>` | Lihat siapa mengubah |

### Perintah Undo/Rollback

| Perintah | Fungsi |
|----------|--------|
| `git checkout -- <file>` | Batalkan perubahan file |
| `git reset HEAD <file>` | Unstage file |
| `git reset --soft HEAD~1` | Undo commit, keep changes |
| `git reset --hard HEAD~1` | Undo commit, discard changes |
| `git revert <hash>` | Buat commit kebalikan |
| `git stash` | Simpan sementara |

### Perintah Remote

| Perintah | Fungsi |
|----------|--------|
| `git remote -v` | Lihat remote URL |
| `git remote add origin <url>` | Tambah remote |
| `git fetch` | Download tanpa merge |
| `git push -u origin main` | Push + set upstream |

---

## Contoh Skenario Umum

### Skenario 1: Menambah Fitur Baru

```bash
# 1. Update main
git checkout main
git pull origin main

# 2. Buat branch fitur
git checkout -b feature/tambah-galeri

# 3. Coding... lalu commit
git add .
git commit -m "feat: tambah halaman galeri"

# 4. Push ke GitHub
git push -u origin feature/tambah-galeri

# 5. Buat Pull Request di GitHub

# 6. Setelah di-approve, merge
git checkout main
git pull origin main
git merge feature/tambah-galeri
git push origin main
```

### Skenario 2: Hotfix Bug di Production

```bash
# 1. Buat branch hotfix dari main
git checkout main
git pull origin main
git checkout -b hotfix/fix-login-error

# 2. Perbaiki bug, commit
git add .
git commit -m "fix: perbaiki error login session"

# 3. Merge langsung ke main
git checkout main
git merge hotfix/fix-login-error
git push origin main

# 4. Tag sebagai patch version
git tag -a v1.0.1 -m "Hotfix login error"
git push origin v1.0.1
```

### Skenario 3: Rollback Fitur Bermasalah

```bash
# 1. Cari commit sebelum fitur bermasalah
git log --oneline
# Output: a1b2c3d feat: fitur bermasalah
#         e4f5g6h feat: fitur sebelumnya (OK)

# 2. Revert commit bermasalah
git revert a1b2c3d

# 3. Push
git push origin main
```

---

## Script Bantuan

Project ini menyediakan script bantuan di:
- `push-to-github.bat` - Push cepat ke GitHub (Windows)
- `push-to-github.sh` - Push cepat ke GitHub (Linux/Mac)

```bash
# Windows
.\push-to-github.bat

# Linux/Mac
chmod +x push-to-github.sh
./push-to-github.sh
```

---

## Referensi

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Docs](https://docs.github.com)
- [Conventional Commits](https://www.conventionalcommits.org)
- [Git Branching Model](https://nvie.com/posts/a-successful-git-branching-model/)

---

*Dokumentasi ini dibuat untuk Project Balai Bahasa Sultra*
*Last updated: December 2025*
