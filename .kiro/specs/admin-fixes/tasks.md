# Implementation Plan

## Phase 1: Perbedaan Visual Admin vs Super Admin

- [x] 1. Implementasi Role Badge dan Visual Distinction






  - [x] 1.1 Buat komponen RoleBadge di resources/js/Components/ui/role-badge.tsx


    - Styling berbeda untuk super_admin (purple) dan admin (blue)
    - Support size variants (sm, md, lg)
    - _Requirements: 1.1, 1.2_

  - [x] 1.2 Update AdminLayout.tsx untuk menampilkan role badge di header


    - Tambahkan badge di sebelah nama user
    - Tampilkan role di dropdown profile
    - _Requirements: 1.1, 1.2, 1.5_

  - [x] 1.3 Update sidebar untuk menampilkan indikator visual pada menu super admin only


    - Tambahkan icon lock atau badge pada menu yang hanya untuk super admin
    - _Requirements: 1.3_

  - [x] 1.4 Write property test untuk role-based menu visibility






    - **Property 1: Role-Based Menu Visibility**
    - **Validates: Requirements 1.3**

- [x] 2. Checkpoint - Pastikan semua tests pass





  - Ensure all tests pass, ask the user if questions arise.

## Phase 2: Perbaiki Aksi Cepat (Quick Actions)

- [x] 3. Verifikasi dan perbaiki halaman Create untuk setiap modul






  - [x] 3.1 Verifikasi halaman Berita Create berfungsi


    - Periksa route /admin/berita/create
    - Pastikan form submission berfungsi
    - Tambahkan cache clearing setelah create
    - _Requirements: 2.1, 2.2, 2.3, 2.5_


  - [x] 3.2 Verifikasi halaman Gallery Create berfungsi

    - Periksa route /admin/gallery/create
    - Pastikan upload image berfungsi dengan validasi
    - Tambahkan cache clearing setelah create
    - _Requirements: 3.1, 3.2, 3.3_


  - [x] 3.3 Verifikasi halaman PPID Create berfungsi

    - Periksa route /admin/ppid/create
    - Pastikan upload document berfungsi dengan validasi
    - Tambahkan cache clearing setelah create
    - _Requirements: 4.1, 4.2, 4.3_

  - [x] 3.4 Verifikasi halaman SSD Create berfungsi


    - Periksa route /admin/ssd/create
    - Pastikan form submission berfungsi
    - Tambahkan cache clearing setelah create
    - _Requirements: 5.1, 5.2, 5.3, 5.5_


  - [x] 3.5 Verifikasi halaman Media Library berfungsi

    - Periksa route /admin/media
    - Pastikan upload berfungsi dengan validasi
    - Pastikan thumbnail generation berfungsi
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [x] 3.6 Write property test untuk file upload validation






    - **Property 4: File Upload Validation**
    - **Validates: Requirements 3.2, 4.2, 6.2**

- [x] 4. Checkpoint - Pastikan semua tests pass





  - Ensure all tests pass, ask the user if questions arise.

## Phase 3: Implementasi Cache Service

- [x] 5. Buat Cache Service untuk invalidation






  - [x] 5.1 Buat CacheService di app/Services/CacheService.php


    - Method clearBeritaCache()
    - Method clearGalleryCache()
    - Method clearPpidCache()
    - Method clearSsdCache()
    - Method clearAllPublicCache()
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

  - [x] 5.2 Buat Model Observers untuk cache invalidation


    - BeritaObserver - clear cache on create/update/delete
    - GalleryObserver - clear cache on create/update/delete
    - PpidDocumentObserver - clear cache on create/update/delete
    - SsdObserver - clear cache on create/update/delete
    - _Requirements: 13.1, 13.2, 13.3_

  - [x] 5.3 Register observers di AppServiceProvider


    - _Requirements: 13.1, 13.2, 13.3_

  - [x] 5.4 Write property test untuk cache invalidation on create









    - **Property 6: Cache Invalidation on Create**
    - **Validates: Requirements 2.5, 13.1**

  - [x] 5.5 Write property test untuk cache invalidation on update






    - **Property 7: Cache Invalidation on Update**
    - **Validates: Requirements 13.2**

  - [ ]* 5.6 Write property test untuk cache invalidation on delete
    - **Property 8: Cache Invalidation on Delete**
    - **Validates: Requirements 13.3**

- [x] 6. Checkpoint - Pastikan semua tests pass





  - Ensure all tests pass, ask the user if questions arise.

## Phase 4: Perbaiki Koneksi Admin ke Halaman Publik

- [x] 7. Perbaiki koneksi Berita admin ke halaman publik






  - [x] 7.1 Update BeritaController publik untuk memastikan query filter benar


    - Pastikan hanya is_published=true yang tampil
    - Pastikan cache key konsisten
    - _Requirements: 9.1, 9.2, 9.3_



  - [x] 7.2 Pastikan view_count increment berfungsi
    - _Requirements: 9.5_

  - [x] 7.3 Write property test untuk published content visibility






    - **Property 2: Published Content Visibility**
    - **Validates: Requirements 2.4, 9.1**

  - [x] 7.4 Write property test untuk unpublished content exclusion






    - **Property 3: Unpublished Content Exclusion**
    - **Validates: Requirements 9.3**

  - [x] 7.5 Write property test untuk view counter increment






    - **Property 10: View Counter Increment**
    - **Validates: Requirements 9.5**

- [x] 8. Perbaiki koneksi Gallery admin ke halaman publik







  - [x] 8.1 Update GaleriController publik untuk memastikan query filter benar

    - Pastikan hanya is_active=true yang tampil
    - Pastikan sort_order digunakan
    - _Requirements: 10.1, 10.2, 10.3, 10.5_

  - [x] 8.2 Write property test untuk sort order persistence






    - **Property 11: Sort Order Persistence**
    - **Validates: Requirements 10.5, 12.4**

- [x] 9. Perbaiki koneksi PPID admin ke halaman publik






  - [x] 9.1 Update PpidController publik untuk memastikan query filter benar


    - Pastikan hanya is_active=true yang tampil
    - Pastikan category filter berfungsi
    - _Requirements: 11.1, 11.2, 11.3, 11.5_

  - [x] 9.2 Pastikan download_count increment berfungsi


    - _Requirements: 11.4_

  - [x] 9.3 Write property test untuk download counter increment






    - **Property 9: Download Counter Increment**
    - **Validates: Requirements 4.5, 11.4**

- [x] 10. Perbaiki koneksi SSD admin ke halaman publik







  - [x] 10.1 Update SsdController publik untuk memastikan query filter benar

    - Pastikan hanya is_active=true yang tampil
    - Pastikan sort_order digunakan
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [x] 11. Checkpoint - Pastikan semua tests pass





  - Ensure all tests pass, ask the user if questions arise.

## Phase 5: Perbaiki Statistik Dashboard

- [x] 12. Perbaiki statistik dan ringkasan modul di Dashboard






  - [x] 12.1 Update DashboardController untuk memastikan query statistik akurat


    - Verifikasi semua count query menggunakan filter yang benar
    - Tambahkan error handling untuk model yang tidak ada
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 8.1, 8.2, 8.3, 8.4_

  - [x] 12.2 Update Dashboard.tsx untuk menampilkan statistik dengan benar


    - Pastikan semua card menampilkan data dari props
    - Tambahkan loading state
    - Tambahkan fallback untuk data kosong
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 8.1, 8.2, 8.3, 8.4_

  - [x] 12.3 Pastikan link navigasi dari module summary berfungsi


    - Verifikasi semua href mengarah ke halaman yang benar
    - _Requirements: 7.7_

  - [x] 12.4 Write property test untuk statistics accuracy






    - **Property 5: Statistics Accuracy**
    - **Validates: Requirements 7.1-7.6, 8.1-8.4**

- [x] 13. Checkpoint - Pastikan semua tests pass





  - Ensure all tests pass, ask the user if questions arise.

## Phase 6: Perbaiki Thumbnail dan Metadata

- [x] 14. Pastikan thumbnail generation dan metadata recording berfungsi







  - [x] 14.1 Verifikasi MediaService thumbnail generation

    - Pastikan thumbnail dibuat untuk semua image upload
    - Pastikan thumbnail_path disimpan di database
    - _Requirements: 3.5, 6.4_


  - [x] 14.2 Verifikasi metadata recording

    - Pastikan filename, size, mime_type disimpan
    - Pastikan dimensions disimpan untuk images
    - _Requirements: 6.5_

  - [x] 14.3 Write property test untuk thumbnail generation






    - **Property 12: Thumbnail Generation**
    - **Validates: Requirements 3.5, 6.4**

  - [x] 14.4 Write property test untuk metadata recording






    - **Property 13: Metadata Recording**
    - **Validates: Requirements 6.5**

- [x] 15. Final Checkpoint - Pastikan semua tests pass





  - Ensure all tests pass, ask the user if questions arise.

