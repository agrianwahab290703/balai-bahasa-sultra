# PRD: Admin Panel - Sistem Manajemen Konten Balai Bahasa Sultra

## Introduction/Overview

Sistem Admin Panel adalah dashboard administratif terpisah yang memungkinkan staf Balai Bahasa Sultra untuk mengelola seluruh konten website tanpa memerlukan pengetahuan teknis IT yang mendalam. Panel ini menyediakan antarmuka visual yang intuitif untuk operasi CRUD (Create, Read, Update, Delete) pada semua tipe konten, manajemen file/dokumen, dan konfigurasi menu navigasi website.

**Problem Statement:**
Saat ini, website Balai Bahasa Sultra hanya memiliki tampilan publik tanpa sistem manajemen konten. Untuk mengupdate konten (berita, kegiatan, dokumen), diperlukan intervensi developer atau pengetahuan teknis. Mengingat staf Balai Bahasa memiliki keterbatasan pengetahuan IT, diperlukan sistem admin yang user-friendly namun powerful.

**Goal:**
Membangun admin panel lengkap yang memungkinkan staf non-teknis untuk mengelola seluruh website secara mandiri dengan antarmuka yang mudah dipahami dan fitur-fitur modern seperti rich text editor, preview real-time, dan drag-and-drop file upload.

## Goals

1. **Independensi Konten**: Staf dapat mengelola konten tanpa bantuan developer
2. **Keamanan**: Sistem login terpisah dengan autentikasi yang aman
3. **Kemudahan Penggunaan**: Interface intuitif untuk user dengan minimal IT skill
4. **Kelengkapan Fitur**: CRUD untuk semua tipe konten yang ada di website
5. **Fleksibilitas**: Kemampuan menambah menu dan halaman baru secara dinamis
6. **Efisiensi**: Workflow cepat dengan fitur preview, draft, dan bulk operations

## User Stories

### US-1: Login Admin
**Sebagai** admin Balai Bahasa,
**Saya ingin** login ke panel admin dengan email dan password,
**Sehingga** saya bisa mengakses dashboard untuk mengelola konten website.

### US-2: Manajemen Berita
**Sebagai** admin konten,
**Saya ingin** membuat, mengedit, dan menghapus berita dengan rich text editor dan upload gambar,
**Sehingga** berita terbaru dapat ditampilkan di website tanpa bantuan developer.

### US-3: Manajemen Kegiatan
**Sebagai** admin kegiatan,
**Saya ingin** mengelola kegiatan/aktivitas dengan galeri foto,
**Sehingga** masyarakat dapat melihat kegiatan yang dilakukan Balai Bahasa.

### US-4: Upload Dokumen
**Sebagai** admin PPID,
**Saya ingin** mengupload dokumen PDF/Word dengan drag-and-drop,
**Sehingga** dokumen publik dapat diakses masyarakat sesuai regulasi keterbukaan informasi.

### US-5: Edit Profil Organisasi
**Sebagai** admin,
**Saya ingin** mengedit konten halaman Profil (Sejarah, Visi Misi, Struktur Organisasi),
**Sehingga** informasi profil selalu up-to-date.

### US-6: Manajemen Menu
**Sebagai** super admin,
**Saya ingin** menambah, mengedit, menyembunyikan menu navigasi di header/footer,
**Sehingga** struktur website dapat disesuaikan tanpa mengubah kode.

### US-7: Preview Sebelum Publish
**Sebagai** admin konten,
**Saya ingin** melihat preview konten sebelum dipublikasikan,
**Sehingga** saya bisa memastikan tampilan sudah sesuai.

### US-8: Manajemen User Admin
**Sebagai** super admin,
**Saya ingin** menambah, edit, dan nonaktifkan user admin lain,
**Sehingga** akses ke panel admin dapat dikontrol.

## Functional Requirements

### 1. Authentication & Authorization

#### 1.1 Login System
- **REQ-1.1.1**: Sistem harus memiliki halaman login terpisah di URL `/administrator` (atau custom URL yang ditentukan)
- **REQ-1.1.2**: Login menggunakan email dan password dengan validasi di backend
- **REQ-1.1.3**: Password harus di-hash menggunakan bcrypt/argon2
- **REQ-1.1.4**: Sistem harus menampilkan pesan error yang jelas jika login gagal
- **REQ-1.1.5**: Setelah login berhasil, redirect ke dashboard admin
- **REQ-1.1.6**: Session admin harus persisten dengan "Remember Me" option
- **REQ-1.1.7**: Logout button harus tersedia di semua halaman admin

#### 1.2 User Management
- **REQ-1.2.1**: Tabel `admin_users` terpisah dari tabel `users` publik
- **REQ-1.2.2**: Admin dapat membuat user admin baru dengan form: nama, email, password
- **REQ-1.2.3**: Admin dapat mengedit data user admin (nama, email, reset password)
- **REQ-1.2.4**: Admin dapat menonaktifkan (soft delete) user admin
- **REQ-1.2.5**: Tampilkan list semua admin users dengan status aktif/nonaktif
- **REQ-1.2.6**: Semua admin memiliki akses penuh ke seluruh fitur (single role: "admin")

### 2. Dashboard

#### 2.1 Overview Dashboard
- **REQ-2.1.1**: Tampilkan statistik ringkas: total berita, total kegiatan, total dokumen, total pengunjung
- **REQ-2.1.2**: Tampilkan grafik pengunjung website (opsional, jika sudah ada visitor tracking)
- **REQ-2.1.3**: Tampilkan 5 berita terbaru dengan quick actions (edit, delete)
- **REQ-2.1.4**: Tampilkan recent activities/logs admin (opsional)

### 3. CRUD Berita (News)

#### 3.1 Create Berita
- **REQ-3.1.1**: Form input: Judul, Slug (auto-generate dari judul), Kategori (dropdown), Konten (rich text editor), Featured Image, Gallery Images (multiple upload), Status (Draft/Published), Tanggal Publikasi
- **REQ-3.1.2**: Rich text editor harus support: bold, italic, heading, list, link, insert image, embed video
- **REQ-3.1.3**: Upload gambar dengan drag-and-drop atau file picker
- **REQ-3.1.4**: Preview gambar sebelum upload
- **REQ-3.1.5**: Validasi: judul wajib, konten wajib, featured image opsional
- **REQ-3.1.6**: Auto-save draft setiap 30 detik (opsional)
- **REQ-3.1.7**: Tombol "Simpan Draft" dan "Publish"

#### 3.2 Read/List Berita
- **REQ-3.2.1**: Tampilkan tabel list berita dengan kolom: Thumbnail, Judul, Kategori, Status, Tanggal Publikasi, Views, Actions (Edit/Delete)
- **REQ-3.2.2**: Pagination (10/20/50 per halaman)
- **REQ-3.2.3**: Filter by kategori, status (draft/published)
- **REQ-3.2.4**: Search by judul atau konten
- **REQ-3.2.5**: Sort by tanggal publikasi, views

#### 3.3 Update Berita
- **REQ-3.3.1**: Semua field yang ada di Create dapat diedit
- **REQ-3.3.2**: Tampilkan preview real-time di sidebar (opsional)
- **REQ-3.3.3**: Riwayat revisi (opsional, future enhancement)

#### 3.4 Delete Berita
- **REQ-3.4.1**: Soft delete dengan konfirmasi "Apakah Anda yakin?"
- **REQ-3.4.2**: Bulk delete: pilih multiple berita dan delete sekaligus

### 4. CRUD Kegiatan (Activities)

#### 4.1 Structure (mirip dengan Berita)
- **REQ-4.1.1**: Form input: Judul, Slug, Deskripsi (rich text), Tanggal Kegiatan, Lokasi, Featured Image, Gallery Images (multiple), Status
- **REQ-4.1.2**: Fitur upload multiple images untuk galeri kegiatan
- **REQ-4.1.3**: Drag-and-drop reorder untuk urutan galeri
- **REQ-4.1.4**: List, edit, delete dengan fitur yang sama seperti Berita

### 5. CRUD Layanan (Services)

#### 5.1 Structure
- **REQ-5.1.1**: Form input: Nama Layanan, Slug, Deskripsi (rich text), Ikon (upload/pilih dari library), Kategori, Persyaratan (list), Waktu Penyelesaian, Biaya, Status (Aktif/Nonaktif)
- **REQ-5.1.2**: List, edit, delete dengan pagination dan search

### 6. CRUD Galeri

#### 6.1 Gallery Management
- **REQ-6.1.1**: Upload multiple images sekaligus dengan drag-and-drop
- **REQ-6.1.2**: Bulk upload progress bar
- **REQ-6.1.3**: Setiap foto: Judul, Deskripsi, Kategori (Kegiatan/Dokumentasi/Lainnya), Tanggal
- **REQ-6.1.4**: Grid view dengan thumbnail preview
- **REQ-6.1.5**: Bulk delete dan bulk edit kategori

### 7. CRUD Profil Organisasi

#### 7.1 Content Management
- **REQ-7.1.1**: Edit konten halaman: Sejarah, Visi Misi, Kedudukan, Tugas & Fungsi
- **REQ-7.1.2**: Edit Struktur Organisasi: upload gambar struktur + deskripsi jabatan
- **REQ-7.1.3**: Setiap konten menggunakan rich text editor
- **REQ-7.1.4**: Preview halaman profil sebelum publish

### 8. CRUD Dokumen PPID

#### 8.1 Document Upload
- **REQ-8.1.1**: Form: Judul Dokumen, Kategori (Setiap Saat/Serta Merta/Berkala/Dikecualikan), File Upload (PDF/DOC/DOCX/XLS/XLSX), Ukuran File, Tanggal Upload, Deskripsi
- **REQ-8.1.2**: Validasi tipe file dan ukuran maksimal (misal 10MB)
- **REQ-8.1.3**: Download counter untuk tracking
- **REQ-8.1.4**: List dokumen dengan filter by kategori

#### 8.2 Team PPID Management
- **REQ-8.2.1**: CRUD anggota tim PPID: Nama, Jabatan, Foto, Kontak
- **REQ-8.2.2**: Urutan tampilan dapat diatur (drag-and-drop)

### 9. CRUD Dokumen SAKIP, ZI-WBK, Standar Pelayanan

#### 9.1 Document Management (mirip PPID)
- **REQ-9.1.1**: Upload dokumen dengan kategori berbeda untuk SAKIP (Renstra, Renja, Lakip, dll)
- **REQ-9.1.2**: Upload dokumen ZI-WBK per sub-area
- **REQ-9.1.3**: Upload Standar Pelayanan dengan kategori layanan
- **REQ-9.1.4**: Setiap dokumen: Judul, Kategori, File, Tahun, Deskripsi

### 10. CRUD Terbitan (Publications)

#### 10.1 Publication Management
- **REQ-10.1.1**: Form: Judul Terbitan, Jenis (Majalah Pabitara/Glitera/Pogsa, Kamus, Cerita Rakyat, Cerita Anak, Hasil Penelitian), Cover Image, File PDF, Tahun Terbit, Deskripsi
- **REQ-10.1.2**: Preview PDF inline (jika memungkinkan)
- **REQ-10.1.3**: Download tracking

### 11. Manajemen Menu & Halaman

#### 11.1 Menu Management
- **REQ-11.1.1**: CRUD menu navigasi untuk Header dan Footer
- **REQ-11.1.2**: Setiap menu: Label, URL/Route, Parent Menu (untuk submenu), Urutan, Status (Tampil/Sembunyikan), Icon (opsional)
- **REQ-11.1.3**: Drag-and-drop untuk mengatur urutan menu
- **REQ-11.1.4**: Nested menu support (parent-child hierarchy)
- **REQ-11.1.5**: Preview struktur menu sebelum save

#### 11.2 Custom Page Builder
- **REQ-11.2.1**: Buat halaman statis baru dengan: Judul, Slug, Konten (rich text editor), Layout Template (pilihan template)
- **REQ-11.2.2**: Halaman custom dapat ditambahkan ke menu navigasi
- **REQ-11.2.3**: SEO fields: Meta Title, Meta Description

### 12. File Manager

#### 12.1 Media Library
- **REQ-12.1.1**: Centralized media library untuk semua upload (gambar, dokumen, video)
- **REQ-12.1.2**: Grid view dengan thumbnail
- **REQ-12.1.3**: Search dan filter by tipe file, tanggal upload
- **REQ-12.1.4**: Bulk delete dan bulk download
- **REQ-12.1.5**: Detail info file: nama, ukuran, dimensi (untuk gambar), URL, digunakan di mana
- **REQ-12.1.6**: Copy URL to clipboard

### 13. Settings

#### 13.1 Site Settings
- **REQ-13.1.1**: Edit informasi umum: Nama Website, Logo, Favicon, Tagline, Footer Text
- **REQ-13.1.2**: Edit kontak: Alamat, Email, Telepon, Social Media Links
- **REQ-13.1.3**: SEO global: Default Meta Description, Keywords
- **REQ-13.1.4**: Google Analytics ID (opsional)

### 14. UI/UX Requirements

#### 14.1 Layout
- **REQ-14.1.1**: Sidebar navigation dengan collapsible menu
- **REQ-14.1.2**: Top bar dengan: Breadcrumb, Profile dropdown (nama admin, logout)
- **REQ-14.1.3**: Responsive design untuk tablet (desktop-first approach)
- **REQ-14.1.4**: Dark mode toggle (opsional)

#### 14.2 Components
- **REQ-14.2.1**: Gunakan Shadcn UI components konsisten dengan frontend publik
- **REQ-14.2.2**: Toast notifications untuk success/error messages
- **REQ-14.2.3**: Loading states untuk semua async operations
- **REQ-14.2.4**: Confirmation dialogs untuk delete actions

#### 14.3 Rich Text Editor
- **REQ-14.3.1**: Gunakan TipTap atau Lexical (modern WYSIWYG editor)
- **REQ-14.3.2**: Toolbar: Format text, headings, lists, links, images, tables
- **REQ-14.3.3**: Image upload langsung dari editor (drag-and-drop ke konten)
- **REQ-14.3.4**: Character/word count indicator

## Non-Goals (Out of Scope)

1. **Multi-tenancy**: Sistem ini hanya untuk satu instance Balai Bahasa Sultra, tidak mendukung multiple organizations
2. **Advanced Role-Based Access Control (RBAC)**: Phase 1 hanya single admin role dengan full access. RBAC dapat ditambahkan di fase berikutnya
3. **Multi-language Admin Panel**: Admin panel dalam Bahasa Indonesia saja (konten website tetap bisa multi-bahasa)
4. **Advanced Analytics Dashboard**: Statistik dasar saja, tidak termasuk analytics mendalam seperti user behavior tracking
5. **Email Marketing/Newsletter**: Tidak termasuk sistem broadcast email ke subscribers
6. **Comment Moderation**: Jika ada sistem komentar di website, moderasi komentar tidak termasuk di fase 1
7. **Mobile App Admin**: Admin panel untuk desktop/tablet, tidak ada native mobile app
8. **Version Control/Revision History**: Auto-save draft ada, tapi detailed revision history belum di fase 1

## Design Considerations

### UI/UX Design
- **Style**: Mengikuti design system yang sama dengan frontend publik (Tailwind CSS + Shadcn UI)
- **Color Scheme**: Gunakan warna berbeda untuk membedakan admin panel dari website publik (misal: darker sidebar, accent color berbeda)
- **Typography**: Konsisten dengan frontend (menggunakan system fonts)
- **Icons**: Hugeicons React atau Lucide React
- **Layout Reference**: Admin panel modern seperti Vercel Dashboard, Strapi, atau Filament PHP

### Accessibility
- **REQ-A.1**: Form fields harus memiliki label yang jelas
- **REQ-A.2**: Keyboard navigation support
- **REQ-A.3**: Color contrast ratio minimal 4.5:1 (WCAG AA)
- **REQ-A.4**: Error messages harus deskriptif dan actionable

### Responsive Breakpoints
- Desktop: 1024px ke atas (primary target)
- Tablet: 768px - 1023px (secondary)
- Mobile: < 768px (not optimized, show warning "Gunakan desktop untuk pengalaman terbaik")

## Technical Considerations

### Backend
- **Framework**: Laravel 12 (existing stack)
- **Authentication**: Laravel Fortify + custom admin guard
- **Database**: SQLite (development), dapat migrate ke MySQL/PostgreSQL (production)
- **File Storage**: Laravel Filesystem (local storage atau S3-compatible)
- **Image Processing**: Intervention Image untuk resize/optimize

### Frontend
- **Framework**: React 19 + Inertia.js (konsisten dengan frontend publik)
- **UI Library**: Shadcn UI + Radix Primitives
- **Forms**: React Hook Form + Zod validation
- **Rich Text Editor**: TipTap (recommended) atau Lexical
- **File Upload**: react-dropzone atau similar
- **State Management**: Inertia.js + React Context (jika diperlukan)
- **Icons**: Hugeicons React

### Database Schema (New Tables)
```
admin_users:
  - id, name, email, password, email_verified_at, remember_token, created_at, updated_at, deleted_at

menus:
  - id, label, url, parent_id, order, location (header/footer), icon, is_visible, created_at, updated_at

custom_pages:
  - id, title, slug, content, layout_template, meta_title, meta_description, status, created_at, updated_at

media:
  - id, filename, path, mime_type, size, width, height, alt_text, uploaded_by (admin_user_id), created_at, updated_at

settings:
  - id, key, value, type (text/json/boolean), created_at, updated_at
```

### API Endpoints Structure
```
POST   /administrator/login
POST   /administrator/logout
GET    /administrator/dashboard

# Berita
GET    /administrator/berita
POST   /administrator/berita
GET    /administrator/berita/{id}/edit
PUT    /administrator/berita/{id}
DELETE /administrator/berita/{id}

# Similar pattern untuk: kegiatan, layanan, galeri, dokumen, terbitan

# Menus
GET    /administrator/menus
POST   /administrator/menus
PUT    /administrator/menus/{id}
DELETE /administrator/menus/{id}
POST   /administrator/menus/reorder

# Media Library
GET    /administrator/media
POST   /administrator/media/upload
DELETE /administrator/media/{id}

# Settings
GET    /administrator/settings
PUT    /administrator/settings
```

### Security Considerations
- **REQ-S.1**: Semua admin routes harus menggunakan `auth:admin` middleware
- **REQ-S.2**: CSRF protection untuk semua POST/PUT/DELETE requests
- **REQ-S.3**: Rate limiting pada login endpoint (max 5 attempts per menit)
- **REQ-S.4**: File upload validation: tipe file whitelist, virus scan (jika memungkinkan)
- **REQ-S.5**: XSS protection: sanitize user input dari rich text editor
- **REQ-S.6**: SQL Injection protection: gunakan Eloquent ORM, hindari raw queries
- **REQ-S.7**: Admin panel harus di-protect dengan HTTPS (production)

### Performance Considerations
- **REQ-P.1**: Image optimization saat upload (resize, compress)
- **REQ-P.2**: Lazy loading untuk list data dengan pagination
- **REQ-P.3**: Debounce search input (300ms)
- **REQ-P.4**: Cache settings dan menu navigasi
- **REQ-P.5**: Index database columns yang sering di-query (title, slug, status)

## Success Metrics

### Primary Metrics
1. **Adoption Rate**: 100% staf yang bertanggung jawab atas konten berhasil login dan menggunakan admin panel dalam 1 bulan
2. **Content Update Frequency**: Minimal 3 berita baru per minggu diupload via admin panel
3. **Reduction in Developer Support Requests**: Pengurangan 80% permintaan ke developer untuk update konten

### Secondary Metrics
4. **Time to Publish**: Waktu rata-rata dari draft ke publish < 10 menit
5. **User Satisfaction**: Survey kepuasan pengguna admin panel ≥ 4/5
6. **Error Rate**: < 5% error saat submit form (validasi yang baik)
7. **Training Time**: Staf baru dapat menggunakan admin panel dengan minimal 2 jam training

### Technical Metrics
8. **Page Load Time**: Admin dashboard load < 2 detik
9. **Upload Success Rate**: > 95% file upload berhasil
10. **System Uptime**: 99% uptime untuk admin panel

## Open Questions

1. **URL Admin Panel**: ✅ **CONFIRMED** - Menggunakan `/administrator`

2. **Workflow Approval**: Apakah diperlukan sistem approval untuk konten sebelum publish? (misal: editor review berita sebelum publish)

3. **Notification System**: Apakah admin perlu notifikasi email saat ada permohonan PPID baru atau keberatan baru masuk?

4. **Backup & Restore**: Apakah perlu fitur backup database dan restore dari admin panel?

5. **Activity Logs**: Seberapa detail activity logs yang diperlukan? (misal: siapa edit apa kapan)

6. **Multi-language Content Management**: Konten seperti berita perlu versi Bahasa Inggris atau bahasa daerah? Jika ya, bagaimana workflow translationnya?

7. **Content Scheduling**: Apakah perlu fitur schedule publish (misal: publish berita otomatis pada tanggal tertentu)?

8. **Image Optimization Level**: Berapa kualitas kompresi yang diinginkan untuk uploaded images? (misal: 80% quality, max width 1920px)

9. **File Size Limits**: Berapa ukuran maksimal untuk upload dokumen PDF? (saat ini diasumsikan 10MB)

10. **Backup Admin**: Apakah ada super admin khusus yang tidak bisa dihapus? Atau semua admin setara?

## Implementation Phases (Recommended)

Mengingat scope yang luas (semua fitur menjadi prioritas berdasarkan jawaban user), disarankan implementasi bertahap:

### Phase 1: Foundation (Week 1-2)
- Authentication system (Login, Logout, Session)
- Admin dashboard dengan statistik dasar
- Admin user management (CRUD admin users)

### Phase 2: Core Content Management (Week 3-4)
- CRUD Berita (News) dengan rich text editor dan image upload
- CRUD Kegiatan (Activities) dengan gallery
- Media Library dasar

### Phase 3: Document & Service Management (Week 5-6)
- CRUD Layanan (Services)
- CRUD Dokumen PPID
- CRUD Dokumen SAKIP, ZI-WBK, Standar Pelayanan

### Phase 4: Static Content & Menu Management (Week 7-8)
- Edit Profil Organisasi (Sejarah, Visi Misi, Struktur)
- Menu Management dengan drag-and-drop
- Custom Page Builder

### Phase 5: Publications & Gallery (Week 9-10)
- CRUD Terbitan (Publications)
- CRUD Galeri
- Enhanced Media Library

### Phase 6: Settings & Polish (Week 11-12)
- Site Settings
- UI/UX refinements
- Testing & bug fixes
- User training & documentation

---

**Document Version**: 1.0
**Created**: 2025-12-13
**Status**: Draft - Awaiting Clarification on Open Questions
**Next Steps**: Confirm URL admin panel, review PRD, then proceed to task generation
