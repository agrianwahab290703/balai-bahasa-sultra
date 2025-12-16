# Requirements Document

## Introduction

Sistem Admin CRUD Management untuk website Balai Bahasa Provinsi Sulawesi Tenggara. Sistem ini memungkinkan admin yang minim IT untuk mengelola seluruh konten website melalui antarmuka yang user-friendly. Admin panel terpisah dari halaman publik dengan URL berbeda (/admin/*) dan memiliki autentikasi tersendiri.

Sistem dibangun di atas fondasi yang sudah ada (Laravel + Inertia.js + React) dengan menambahkan modul CRUD untuk semua entitas konten.

## Glossary

- **Admin Panel**: Antarmuka khusus untuk pengelola konten dengan akses terbatas
- **CRUD**: Create, Read, Update, Delete - operasi dasar pengelolaan data
- **Berita**: Artikel berita yang dipublikasikan di website
- **Gallery**: Koleksi foto/gambar yang ditampilkan di halaman galeri
- **PPID**: Pejabat Pengelola Informasi dan Dokumentasi - bagian keterbukaan informasi publik
- **SSD**: Soal Sering Ditanya (FAQ) - pertanyaan yang sering diajukan
- **Standar Pelayanan**: Dokumen standar pelayanan publik
- **Profile Content**: Konten halaman profil (sejarah, visi-misi, struktur)
- **Menu**: Navigasi website yang dapat dikonfigurasi
- **Rich Text Editor**: Editor teks dengan formatting (bold, italic, gambar, dll)
- **Media Library**: Pustaka file dan gambar yang dapat digunakan ulang
- **Bulk Operation**: Operasi yang dilakukan pada banyak item sekaligus

## Requirements

### Requirement 1: Berita Management

**User Story:** As an admin, I want to manage news articles, so that I can publish and update information for website visitors.

#### Acceptance Criteria

1. WHEN an admin accesses the Berita management page THEN the Admin_Panel SHALL display a paginated list of all news articles with title, status, category, view count, and publication date
2. WHEN an admin creates a new Berita THEN the Admin_Panel SHALL provide a form with rich text editor for content fields (teras_berita, konteks_latar_belakang, data_capaian_kinerja, mekanisme_penilaian, kesimpulan_komitmen)
3. WHEN an admin uploads a hero image THEN the Admin_Panel SHALL validate the file type (jpg, png, webp) and maximum size (2MB) before storing
4. WHEN an admin saves a Berita without a slug THEN the Admin_Panel SHALL auto-generate a URL-friendly slug from the title
5. WHEN an admin searches for Berita THEN the Admin_Panel SHALL filter results by title, content, or category within 500ms response time
6. WHEN an admin performs bulk publish/unpublish/delete THEN the Admin_Panel SHALL apply the action to all selected items and display a confirmation message
7. WHEN an admin edits a Berita THEN the Admin_Panel SHALL load existing data including gallery images and allow modifications

### Requirement 2: Gallery Management

**User Story:** As an admin, I want to manage photo galleries, so that I can showcase visual content on the website.

#### Acceptance Criteria

1. WHEN an admin accesses the Gallery management page THEN the Admin_Panel SHALL display a grid view of all images with thumbnails, titles, and categories
2. WHEN an admin uploads multiple images THEN the Admin_Panel SHALL process each image, generate thumbnails, and store metadata
3. WHEN an admin assigns a category to gallery items THEN the Admin_Panel SHALL allow selection from predefined categories or creation of new categories
4. WHEN an admin reorders gallery items THEN the Admin_Panel SHALL save the new sort_order and reflect changes on the public page
5. WHEN an admin marks an image as featured THEN the Admin_Panel SHALL update the is_featured flag and limit featured images to a maximum of 6

### Requirement 3: PPID Document Management

**User Story:** As an admin, I want to manage PPID documents, so that I can maintain transparency and public information access.

#### Acceptance Criteria

1. WHEN an admin accesses the PPID management page THEN the Admin_Panel SHALL display documents grouped by category (setiap_saat, serta_merta, berkala, dikecualikan)
2. WHEN an admin uploads a PPID document THEN the Admin_Panel SHALL validate file type (pdf, doc, docx, xls, xlsx) and record file size
3. WHEN an admin categorizes a document THEN the Admin_Panel SHALL assign it to exactly one PPID category
4. WHEN an admin views document statistics THEN the Admin_Panel SHALL display download count for each document
5. WHEN an admin deactivates a document THEN the Admin_Panel SHALL set is_active to false and hide it from public view

### Requirement 4: SSD (FAQ) Management

**User Story:** As an admin, I want to manage frequently asked questions, so that visitors can find answers to common inquiries.

#### Acceptance Criteria

1. WHEN an admin accesses the SSD management page THEN the Admin_Panel SHALL display all FAQ items with question preview, category, and status
2. WHEN an admin creates a new SSD THEN the Admin_Panel SHALL provide fields for question, answer (with rich text), and category
3. WHEN an admin reorders SSD items THEN the Admin_Panel SHALL update sort_order using drag-and-drop interface
4. WHEN an admin filters SSD by category THEN the Admin_Panel SHALL display only items matching the selected category
5. WHEN an admin toggles SSD active status THEN the Admin_Panel SHALL immediately update is_active and reflect on public page

### Requirement 5: Standar Pelayanan Management

**User Story:** As an admin, I want to manage service standards documents, so that the public can access official service guidelines.

#### Acceptance Criteria

1. WHEN an admin accesses the Standar Pelayanan page THEN the Admin_Panel SHALL display documents with title, category, file type, and download count
2. WHEN an admin uploads a service standard document THEN the Admin_Panel SHALL store the file and auto-detect file type and size
3. WHEN an admin assigns a category THEN the Admin_Panel SHALL allow selection from predefined categories (Umum, UKBI, BIPA, Ahli Bahasa, Penerjemah, Perpustakaan, Data & Informasi)
4. WHEN an admin updates document order THEN the Admin_Panel SHALL save sort_order for display sequence on public page
5. WHEN an admin views download statistics THEN the Admin_Panel SHALL display total downloads per document

### Requirement 6: Profile Content Management

**User Story:** As an admin, I want to manage profile page content, so that I can update organizational information.

#### Acceptance Criteria

1. WHEN an admin accesses Profile Content management THEN the Admin_Panel SHALL display content sections grouped by type (sejarah, visi-misi, kedudukan, struktur)
2. WHEN an admin edits profile content THEN the Admin_Panel SHALL provide rich text editor with image upload capability
3. WHEN an admin uploads structure organization image THEN the Admin_Panel SHALL validate and store the image with proper dimensions
4. WHEN an admin reorders content sections THEN the Admin_Panel SHALL update the order field for display sequence
5. WHEN an admin toggles content visibility THEN the Admin_Panel SHALL update is_active status immediately

### Requirement 7: Menu Management

**User Story:** As an admin, I want to manage website navigation menus, so that I can organize site structure for visitors.

#### Acceptance Criteria

1. WHEN an admin accesses Menu management THEN the Admin_Panel SHALL display menu items in a hierarchical tree structure
2. WHEN an admin creates a menu item THEN the Admin_Panel SHALL allow setting label, URL, parent item, icon, and visibility
3. WHEN an admin reorders menu items THEN the Admin_Panel SHALL update order using drag-and-drop within the same level
4. WHEN an admin sets a parent menu THEN the Admin_Panel SHALL create a nested submenu structure with maximum 2 levels depth
5. WHEN an admin toggles menu visibility THEN the Admin_Panel SHALL update is_visible and immediately reflect on public navigation

### Requirement 8: Media Library

**User Story:** As an admin, I want a centralized media library, so that I can reuse images and files across different content.

#### Acceptance Criteria

1. WHEN an admin accesses Media Library THEN the Admin_Panel SHALL display all uploaded files in a grid with thumbnails and metadata
2. WHEN an admin uploads files THEN the Admin_Panel SHALL validate file types, generate thumbnails for images, and store metadata
3. WHEN an admin searches media THEN the Admin_Panel SHALL filter by filename, type, or upload date
4. WHEN an admin selects media for content THEN the Admin_Panel SHALL provide a modal picker that inserts the selected file
5. WHEN an admin deletes unused media THEN the Admin_Panel SHALL check for references and warn if the file is in use

### Requirement 9: User Management

**User Story:** As a super admin, I want to manage admin users, so that I can control access to the admin panel.

#### Acceptance Criteria

1. WHEN a super admin accesses User Management THEN the Admin_Panel SHALL display all admin users with name, email, role, and last login
2. WHEN a super admin creates a new admin THEN the Admin_Panel SHALL require name, email, password, and role assignment
3. WHEN a super admin assigns roles THEN the Admin_Panel SHALL allow selection from predefined roles (super_admin, admin, editor)
4. WHEN a super admin deactivates a user THEN the Admin_Panel SHALL prevent that user from logging in
5. WHEN an admin changes their password THEN the Admin_Panel SHALL validate password strength (minimum 8 characters, mixed case, numbers)

### Requirement 10: Activity Logging

**User Story:** As an admin, I want to see activity logs, so that I can track changes made to content.

#### Acceptance Criteria

1. WHEN any content is created, updated, or deleted THEN the Admin_Panel SHALL record the action with timestamp, user, and affected item
2. WHEN an admin views activity logs THEN the Admin_Panel SHALL display recent activities with filtering by user, action type, and date range
3. WHEN an admin views a specific content item THEN the Admin_Panel SHALL show its change history with previous values
4. WHEN activity logs exceed 90 days THEN the Admin_Panel SHALL archive old entries to maintain performance

### Requirement 11: Dashboard Analytics

**User Story:** As an admin, I want to see dashboard analytics, so that I can understand content performance.

#### Acceptance Criteria

1. WHEN an admin accesses the Dashboard THEN the Admin_Panel SHALL display summary statistics (total berita, total views, active documents, pending items)
2. WHEN an admin views the Dashboard THEN the Admin_Panel SHALL show recent activities and quick action buttons
3. WHEN an admin views content statistics THEN the Admin_Panel SHALL display charts for views over time and popular content
4. WHEN statistics are requested THEN the Admin_Panel SHALL load data within 1 second response time

### Requirement 12: Rich Text Editor Integration

**User Story:** As an admin, I want a rich text editor, so that I can format content without knowing HTML.

#### Acceptance Criteria

1. WHEN an admin edits text content THEN the Admin_Panel SHALL provide formatting options (bold, italic, headings, lists, links)
2. WHEN an admin inserts an image in editor THEN the Admin_Panel SHALL open Media Library picker or allow direct upload
3. WHEN an admin pastes content from external sources THEN the Admin_Panel SHALL clean HTML and preserve basic formatting
4. WHEN an admin saves content THEN the Admin_Panel SHALL sanitize HTML to prevent XSS attacks
