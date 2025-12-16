# Requirements Document

## Introduction

Dokumen ini berisi requirements untuk memperbaiki masalah-masalah krusial pada sistem Admin Panel Balai Bahasa Provinsi Sulawesi Tenggara. Masalah utama meliputi: perbedaan tampilan admin vs super admin yang tidak jelas, fitur aksi cepat yang tidak berfungsi, ringkasan modul yang tidak menampilkan data, statistik yang tidak terhubung, dan koneksi antara admin panel dengan halaman publik yang belum berfungsi.

## Glossary

- **Admin Panel**: Antarmuka khusus untuk pengelola konten dengan akses terbatas
- **Super Admin**: Role tertinggi dengan akses penuh ke semua fitur termasuk manajemen pengguna
- **Admin**: Role dengan akses ke sebagian besar fitur kecuali manajemen pengguna
- **Quick Actions**: Tombol aksi cepat di dashboard untuk membuat konten baru
- **Module Summary**: Ringkasan statistik untuk setiap modul konten
- **Public Page**: Halaman yang dapat dilihat oleh semua pengunjung website

## Requirements

### Requirement 1: Perbedaan Visual Admin vs Super Admin

**User Story:** As a super admin, I want to see a clear visual distinction between my interface and regular admin interface, so that I can easily identify my elevated privileges.

#### Acceptance Criteria

1. WHEN a super admin logs in THEN the Admin_Panel SHALL display a "Super Admin" badge next to the user name in the header
2. WHEN an admin logs in THEN the Admin_Panel SHALL display an "Admin" badge with different color styling
3. WHEN viewing the sidebar THEN the Admin_Panel SHALL show role-specific menu items with visual indicators for super admin exclusive features
4. WHEN a super admin views the dashboard THEN the Admin_Panel SHALL display additional administrative widgets not visible to regular admins
5. WHEN viewing user profile dropdown THEN the Admin_Panel SHALL display the current user role prominently

### Requirement 2: Aksi Cepat - Tambah Berita

**User Story:** As an admin, I want to quickly add news articles from the dashboard, so that I can efficiently publish content.

#### Acceptance Criteria

1. WHEN an admin clicks "Tambah Berita" quick action THEN the Admin_Panel SHALL navigate to the berita create form
2. WHEN an admin submits a new berita form THEN the Admin_Panel SHALL validate all required fields and save to database
3. WHEN a berita is successfully created THEN the Admin_Panel SHALL redirect to berita list with success notification
4. WHEN a berita is created with is_published=true THEN the Public_Page SHALL display the berita immediately
5. WHEN a berita is created THEN the Admin_Panel SHALL clear relevant caches to ensure public page shows updated content

### Requirement 3: Aksi Cepat - Upload Foto Gallery

**User Story:** As an admin, I want to quickly upload photos to the gallery from the dashboard, so that I can efficiently manage visual content.

#### Acceptance Criteria

1. WHEN an admin clicks "Upload Foto" quick action THEN the Admin_Panel SHALL navigate to the gallery create form
2. WHEN an admin uploads an image THEN the Admin_Panel SHALL validate file type (jpg, png, webp) and size (max 5MB)
3. WHEN a gallery item is successfully created THEN the Admin_Panel SHALL redirect to gallery list with success notification
4. WHEN a gallery item is created with is_active=true THEN the Public_Page SHALL display the image in galeri page
5. WHEN a gallery item is created THEN the Admin_Panel SHALL generate thumbnail automatically

### Requirement 4: Aksi Cepat - Tambah Dokumen PPID

**User Story:** As an admin, I want to quickly add PPID documents from the dashboard, so that I can maintain public information transparency.

#### Acceptance Criteria

1. WHEN an admin clicks "Tambah Dokumen PPID" quick action THEN the Admin_Panel SHALL navigate to the PPID document create form
2. WHEN an admin uploads a document THEN the Admin_Panel SHALL validate file type (pdf, doc, docx, xls, xlsx) and record file size
3. WHEN a PPID document is successfully created THEN the Admin_Panel SHALL redirect to PPID list with success notification
4. WHEN a PPID document is created with is_active=true THEN the Public_Page SHALL display the document in informasi publik page
5. WHEN a PPID document is downloaded from public page THEN the System SHALL increment download_count

### Requirement 5: Aksi Cepat - Tambah FAQ (SSD)

**User Story:** As an admin, I want to quickly add FAQ items from the dashboard, so that I can help visitors find answers to common questions.

#### Acceptance Criteria

1. WHEN an admin clicks "Tambah FAQ" quick action THEN the Admin_Panel SHALL navigate to the SSD create form
2. WHEN an admin submits a new SSD form THEN the Admin_Panel SHALL validate question and answer fields
3. WHEN an SSD item is successfully created THEN the Admin_Panel SHALL redirect to SSD list with success notification
4. WHEN an SSD item is created with is_active=true THEN the Public_Page SHALL display the FAQ in SSD page
5. WHEN an SSD item is created THEN the Admin_Panel SHALL assign default sort_order

### Requirement 6: Aksi Cepat - Upload Media

**User Story:** As an admin, I want to quickly upload media files from the dashboard, so that I can manage reusable assets.

#### Acceptance Criteria

1. WHEN an admin clicks "Upload Media" quick action THEN the Admin_Panel SHALL navigate to the media library page
2. WHEN an admin uploads a file THEN the Admin_Panel SHALL validate file type and size based on configuration
3. WHEN a media file is successfully uploaded THEN the Admin_Panel SHALL display the file in media library grid
4. WHEN an image is uploaded THEN the Admin_Panel SHALL generate thumbnail automatically
5. WHEN a media file is uploaded THEN the Admin_Panel SHALL record metadata (filename, size, mime_type, dimensions)

### Requirement 7: Ringkasan Modul - Statistik Akurat

**User Story:** As an admin, I want to see accurate module summaries on the dashboard, so that I can monitor content status at a glance.

#### Acceptance Criteria

1. WHEN an admin views the dashboard THEN the Admin_Panel SHALL display accurate count for SSD items (active only)
2. WHEN an admin views the dashboard THEN the Admin_Panel SHALL display accurate count for Standar Pelayanan items (active only)
3. WHEN an admin views the dashboard THEN the Admin_Panel SHALL display accurate count for Profile Content items (active only)
4. WHEN an admin views the dashboard THEN the Admin_Panel SHALL display accurate count for Menu items (visible only)
5. WHEN an admin views the dashboard THEN the Admin_Panel SHALL display accurate count for Media Files (total)
6. WHEN an admin views the dashboard THEN the Admin_Panel SHALL display accurate count for Admin Users (active only)
7. WHEN an admin clicks on a module summary card THEN the Admin_Panel SHALL navigate to that module's list page

### Requirement 8: Statistik Utama - Data Terhubung

**User Story:** As an admin, I want to see accurate main statistics on the dashboard, so that I can understand content performance.

#### Acceptance Criteria

1. WHEN an admin views the dashboard THEN the Admin_Panel SHALL display total berita count from database
2. WHEN an admin views the dashboard THEN the Admin_Panel SHALL display total views sum from all berita
3. WHEN an admin views the dashboard THEN the Admin_Panel SHALL display total gallery items count
4. WHEN an admin views the dashboard THEN the Admin_Panel SHALL display total PPID documents count with download statistics
5. WHEN statistics are updated via CRUD operations THEN the Admin_Panel SHALL reflect changes immediately without page refresh

### Requirement 9: Koneksi Admin ke Halaman Publik - Berita

**User Story:** As an admin, I want berita created in admin panel to appear on public pages, so that visitors can read the news.

#### Acceptance Criteria

1. WHEN a berita is created with is_published=true THEN the Public_Page SHALL include it in berita listing
2. WHEN a berita is updated in admin THEN the Public_Page SHALL reflect changes after cache clear
3. WHEN a berita is deleted (soft delete) THEN the Public_Page SHALL remove it from listing
4. WHEN a berita slug is accessed THEN the Public_Page SHALL display full article content
5. WHEN a berita is viewed THEN the System SHALL increment view_count

### Requirement 10: Koneksi Admin ke Halaman Publik - Gallery

**User Story:** As an admin, I want gallery items created in admin panel to appear on public galeri page, so that visitors can view photos.

#### Acceptance Criteria

1. WHEN a gallery item is created with is_active=true THEN the Public_Page SHALL include it in galeri listing
2. WHEN a gallery item is updated in admin THEN the Public_Page SHALL reflect changes
3. WHEN a gallery item is deleted THEN the Public_Page SHALL remove it from listing
4. WHEN a gallery item is marked as featured THEN the Public_Page SHALL prioritize its display
5. WHEN gallery items are reordered in admin THEN the Public_Page SHALL display them in new order

### Requirement 11: Koneksi Admin ke Halaman Publik - PPID

**User Story:** As an admin, I want PPID documents created in admin panel to appear on public PPID pages, so that visitors can access public information.

#### Acceptance Criteria

1. WHEN a PPID document is created with is_active=true THEN the Public_Page SHALL include it in appropriate category listing
2. WHEN a PPID document is updated in admin THEN the Public_Page SHALL reflect changes
3. WHEN a PPID document is deleted THEN the Public_Page SHALL remove it from listing
4. WHEN a PPID document is downloaded THEN the System SHALL track download_count
5. WHEN PPID documents are filtered by category THEN the Public_Page SHALL display correct documents

### Requirement 12: Koneksi Admin ke Halaman Publik - SSD

**User Story:** As an admin, I want SSD items created in admin panel to appear on public FAQ page, so that visitors can find answers.

#### Acceptance Criteria

1. WHEN an SSD item is created with is_active=true THEN the Public_Page SHALL include it in FAQ listing
2. WHEN an SSD item is updated in admin THEN the Public_Page SHALL reflect changes
3. WHEN an SSD item is deleted THEN the Public_Page SHALL remove it from listing
4. WHEN SSD items are reordered in admin THEN the Public_Page SHALL display them in new order
5. WHEN SSD items are filtered by category THEN the Public_Page SHALL display correct items

### Requirement 13: Cache Invalidation

**User Story:** As an admin, I want changes made in admin panel to appear immediately on public pages, so that visitors see up-to-date content.

#### Acceptance Criteria

1. WHEN any content is created THEN the System SHALL clear relevant cache keys
2. WHEN any content is updated THEN the System SHALL clear relevant cache keys
3. WHEN any content is deleted THEN the System SHALL clear relevant cache keys
4. WHEN cache is cleared THEN the Public_Page SHALL fetch fresh data from database
5. WHEN admin performs bulk operations THEN the System SHALL clear all affected cache keys

