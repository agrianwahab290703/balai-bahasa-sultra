# DOKUMENTASI SISTEM ADMIN CRUD MANAGEMENT
## Website Balai Bahasa Provinsi Sulawesi Tenggara

---

## 1. PENDAHULUAN

Sistem Admin CRUD Management adalah panel administrasi untuk mengelola konten website Balai Bahasa Provinsi Sulawesi Tenggara. Sistem ini dibangun menggunakan Laravel + Inertia.js + React dan dapat diakses melalui URL `/admin`.

---

## 2. AKTOR SISTEM

Sistem ini memiliki 2 (dua) jenis aktor/pengguna dengan hak akses berbeda:

### 2.1 Super Admin
Pengguna dengan hak akses tertinggi yang dapat mengelola seluruh sistem termasuk manajemen pengguna.

### 2.2 Admin
Pengguna dengan hak akses untuk mengelola seluruh konten website kecuali manajemen pengguna.

---

## 3. KREDENSIAL LOGIN DEFAULT

| No | Role | Nama | Email | Password |
|----|------|------|-------|----------|
| 1 | Super Admin | Super Administrator | superadmin@balaibahasa.go.id | password123 |
| 2 | Admin | Administrator | admin@balaibahasa.go.id | password123 |

**URL Login:** `http://[domain]/admin/login`

**PENTING:** Segera ganti password default setelah login pertama kali!

---

## 4. HAK AKSES PER ROLE

### 4.1 Super Admin
Super Admin memiliki akses penuh ke seluruh fitur sistem:

| No | Modul | Hak Akses |
|----|-------|-----------|
| 1 | Dashboard | ✅ Lihat statistik dan aktivitas |
| 2 | Berita | ✅ Create, Read, Update, Delete, Bulk Actions |
| 3 | Gallery | ✅ Create, Read, Update, Delete, Reorder |
| 4 | PPID | ✅ Create, Read, Update, Delete |
| 5 | SSD (FAQ) | ✅ Create, Read, Update, Delete, Reorder |
| 6 | Standar Pelayanan | ✅ Create, Read, Update, Delete |
| 7 | Profile Content | ✅ Create, Read, Update, Delete |
| 8 | Menu | ✅ Create, Read, Update, Delete, Reorder |
| 9 | Media Library | ✅ Upload, Delete, Manage |
| 10 | User Management | ✅ Create, Read, Update, Delete, Activate/Deactivate |
| 11 | Activity Log | ✅ View all logs |

### 4.2 Admin
Admin memiliki akses ke semua fitur kecuali User Management:

| No | Modul | Hak Akses |
|----|-------|-----------|
| 1 | Dashboard | ✅ Lihat statistik dan aktivitas |
| 2 | Berita | ✅ Create, Read, Update, Delete, Bulk Actions |
| 3 | Gallery | ✅ Create, Read, Update, Delete, Reorder |
| 4 | PPID | ✅ Create, Read, Update, Delete |
| 5 | SSD (FAQ) | ✅ Create, Read, Update, Delete, Reorder |
| 6 | Standar Pelayanan | ✅ Create, Read, Update, Delete |
| 7 | Profile Content | ✅ Create, Read, Update, Delete |
| 8 | Menu | ✅ Create, Read, Update, Delete, Reorder |
| 9 | Media Library | ✅ Upload, Delete, Manage |
| 10 | User Management | ❌ Tidak dapat diakses |
| 11 | Activity Log | ✅ View all logs |

---

## 5. DESKRIPSI MODUL

### 5.1 Dashboard
- Menampilkan statistik keseluruhan (total berita, views, dokumen, dll)
- Menampilkan aktivitas terbaru
- Menampilkan konten populer
- Quick action buttons untuk membuat konten baru

### 5.2 Berita
- Mengelola artikel berita website
- Fitur: Rich text editor, upload gambar hero, kategori, status publish/draft
- Bulk actions: publish, unpublish, delete

### 5.3 Gallery
- Mengelola foto/gambar galeri
- Fitur: Upload multiple images, drag-drop reorder, featured toggle (max 6)
- Kategori dan status aktif/nonaktif

### 5.4 PPID (Pejabat Pengelola Informasi dan Dokumentasi)
- Mengelola dokumen keterbukaan informasi publik
- Kategori: Setiap Saat, Serta Merta, Berkala, Dikecualikan
- Fitur: Upload dokumen (PDF, DOC, XLS), tracking download

### 5.5 SSD (Soal Sering Ditanya / FAQ)
- Mengelola pertanyaan yang sering diajukan
- Fitur: Rich text editor untuk jawaban, drag-drop reorder, kategori

### 5.6 Standar Pelayanan
- Mengelola dokumen standar pelayanan publik
- Kategori: Umum, UKBI, BIPA, Ahli Bahasa, Penerjemah, Perpustakaan, Data & Informasi
- Fitur: Upload dokumen, tracking download

### 5.7 Profile Content
- Mengelola konten halaman profil organisasi
- Tipe: Sejarah, Visi-Misi, Kedudukan, Struktur Organisasi
- Fitur: Rich text editor, upload gambar struktur

### 5.8 Menu
- Mengelola navigasi website
- Fitur: Hierarchical tree (max 2 level), drag-drop reorder, visibility toggle

### 5.9 Media Library
- Pustaka file dan gambar terpusat
- Fitur: Upload, search, filter, thumbnail generation
- Dapat digunakan di semua modul konten

### 5.10 User Management (Super Admin Only)
- Mengelola akun admin
- Fitur: Create user, assign role, activate/deactivate, reset password

### 5.11 Activity Log
- Melihat riwayat perubahan konten
- Filter: User, action type, date range
- Detail: Old values vs new values

---

## 6. PANDUAN PENGGUNAAN

### 6.1 Login
1. Buka URL: `http://[domain]/admin/login`
2. Masukkan email dan password
3. Klik tombol "Login"

### 6.2 Logout
1. Klik nama user di pojok kanan atas
2. Pilih "Logout"

### 6.3 Membuat Konten Baru
1. Pilih modul dari sidebar (contoh: Berita)
2. Klik tombol "Tambah" atau "Create"
3. Isi form yang tersedia
4. Klik "Simpan" atau "Save"

### 6.4 Mengedit Konten
1. Pilih modul dari sidebar
2. Cari konten yang ingin diedit
3. Klik tombol "Edit" (ikon pensil)
4. Ubah data yang diperlukan
5. Klik "Update" atau "Simpan"

### 6.5 Menghapus Konten
1. Pilih modul dari sidebar
2. Cari konten yang ingin dihapus
3. Klik tombol "Delete" (ikon tempat sampah)
4. Konfirmasi penghapusan

### 6.6 Bulk Actions
1. Pilih modul dari sidebar
2. Centang checkbox pada item yang ingin diproses
3. Pilih action dari dropdown "Bulk Actions"
4. Konfirmasi action

---

## 7. KEAMANAN

### 7.1 Password Requirements
- Minimal 8 karakter
- Kombinasi huruf besar dan kecil
- Minimal 1 angka

### 7.2 Session
- Session akan expired setelah periode tidak aktif
- Login ulang diperlukan setelah session expired

### 7.3 Activity Logging
- Semua perubahan dicatat dalam activity log
- Log mencakup: user, action, timestamp, old/new values

---

## 8. KONTAK SUPPORT

Jika mengalami kendala teknis, hubungi:
- Email: [email support]
- Telepon: [nomor telepon]

---

**Dokumen ini dibuat pada:** Desember 2025
**Versi:** 1.0
