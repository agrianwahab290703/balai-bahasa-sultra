# Task List: Admin Panel - Sistem Manajemen Konten Balai Bahasa Sultra

## Relevant Files

### Backend Files
- `database/migrations/XXXX_create_admin_users_table.php` - Migration untuk tabel admin users
- `database/migrations/XXXX_create_menus_table.php` - Migration untuk manajemen menu
- `database/migrations/XXXX_create_custom_pages_table.php` - Migration untuk halaman custom
- `database/migrations/XXXX_create_media_table.php` - Migration untuk media library
- `database/migrations/XXXX_create_settings_table.php` - Migration untuk site settings
- `app/Models/AdminUser.php` - Model untuk admin users
- `app/Models/Menu.php` - Model untuk menu navigation
- `app/Models/CustomPage.php` - Model untuk custom pages
- `app/Models/Media.php` - Model untuk media library
- `app/Models/Setting.php` - Model untuk settings
- `app/Http/Middleware/AdminAuth.php` - Middleware untuk autentikasi admin
- `app/Http/Controllers/Admin/AuthController.php` - Controller untuk login/logout admin
- `app/Http/Controllers/Admin/DashboardController.php` - Controller untuk dashboard
- `app/Http/Controllers/Admin/BeritaController.php` - Controller CRUD berita
- `app/Http/Controllers/Admin/KegiatanController.php` - Controller CRUD kegiatan
- `app/Http/Controllers/Admin/LayananController.php` - Controller CRUD layanan
- `app/Http/Controllers/Admin/GaleriController.php` - Controller CRUD galeri
- `app/Http/Controllers/Admin/ProfilController.php` - Controller edit profil
- `app/Http/Controllers/Admin/PpidController.php` - Controller CRUD dokumen PPID
- `app/Http/Controllers/Admin/SakipController.php` - Controller CRUD dokumen SAKIP
- `app/Http/Controllers/Admin/TerbitanController.php` - Controller CRUD terbitan
- `app/Http/Controllers/Admin/MenuController.php` - Controller manajemen menu
- `app/Http/Controllers/Admin/MediaController.php` - Controller media library
- `app/Http/Controllers/Admin/SettingController.php` - Controller site settings
- `app/Http/Controllers/Admin/AdminUserController.php` - Controller user management
- `app/Services/MediaService.php` - Service untuk upload dan image processing
- `config/admin.php` - Config file untuk admin settings
- `routes/admin.php` - Routes khusus admin panel

### Frontend Files
- `resources/js/Pages/Admin/Login.tsx` - Halaman login admin
- `resources/js/Pages/Admin/Dashboard.tsx` - Dashboard admin
- `resources/js/Layouts/AdminLayout.tsx` - Layout untuk admin panel
- `resources/js/Components/Admin/Sidebar.tsx` - Sidebar navigation
- `resources/js/Components/Admin/TopBar.tsx` - Top bar dengan breadcrumb
- `resources/js/Components/Admin/RichTextEditor.tsx` - Rich text editor component
- `resources/js/Components/Admin/FileUploader.tsx` - File upload component
- `resources/js/Components/Admin/ImageGallery.tsx` - Image gallery manager
- `resources/js/Components/Admin/DataTable.tsx` - Reusable data table component
- `resources/js/Pages/Admin/Berita/Index.tsx` - List berita
- `resources/js/Pages/Admin/Berita/Create.tsx` - Create berita
- `resources/js/Pages/Admin/Berita/Edit.tsx` - Edit berita
- `resources/js/Pages/Admin/Kegiatan/Index.tsx` - List kegiatan
- `resources/js/Pages/Admin/Kegiatan/Form.tsx` - Form kegiatan (create/edit)
- `resources/js/Pages/Admin/Layanan/Index.tsx` - List layanan
- `resources/js/Pages/Admin/Layanan/Form.tsx` - Form layanan
- `resources/js/Pages/Admin/Galeri/Index.tsx` - Gallery management
- `resources/js/Pages/Admin/Profil/Edit.tsx` - Edit profil organisasi
- `resources/js/Pages/Admin/Dokumen/Ppid.tsx` - CRUD dokumen PPID
- `resources/js/Pages/Admin/Dokumen/Sakip.tsx` - CRUD dokumen SAKIP
- `resources/js/Pages/Admin/Terbitan/Index.tsx` - List terbitan
- `resources/js/Pages/Admin/Terbitan/Form.tsx` - Form terbitan
- `resources/js/Pages/Admin/Menu/Index.tsx` - Menu management
- `resources/js/Pages/Admin/Media/Library.tsx` - Media library
- `resources/js/Pages/Admin/Settings/Index.tsx` - Site settings
- `resources/js/Pages/Admin/Users/Index.tsx` - Admin user management
- `resources/js/hooks/useAdminAuth.ts` - Hook untuk admin authentication
- `resources/js/schemas/adminBeritaSchema.ts` - Zod schema untuk form berita
- `resources/js/schemas/adminKegiatanSchema.ts` - Zod schema untuk form kegiatan
- `resources/js/types/admin.ts` - TypeScript types untuk admin

### Package Dependencies
- `package.json` - Tambah dependencies: @tiptap/react, @tiptap/starter-kit, react-dropzone
- `composer.json` - Dependencies sudah lengkap (Intervention Image sudah ada)

### Notes
- Gunakan pattern yang sama dengan public pages untuk consistency
- Semua form menggunakan React Hook Form + Zod validation
- Gunakan Shadcn UI components yang sudah ada
- Testing files akan dibuat setelah implementasi fitur

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Example:
- `- [ ] 1.1 Read file` → `- [x] 1.1 Read file` (after completing)

Update the file after completing each sub-task, not just after completing an entire parent task.

## Tasks

- [x] 0.0 Create feature branch
  - [x] 0.1 Create and checkout a new branch for this feature (`git checkout -b feature/admin-panel`)

- [ ] 1.0 Setup Database & Models untuk Admin System
  - [x] 1.1 Create migration untuk tabel `admin_users` (id, name, email, password, email_verified_at, remember_token, timestamps, soft deletes)
  - [x] 1.2 Create migration untuk tabel `menus` (id, label, url, parent_id, order, location enum(header/footer), icon, is_visible boolean, timestamps)
  - [x] 1.3 Create migration untuk tabel `custom_pages` (id, title, slug, content text, layout_template, meta_title, meta_description, status enum(draft/published), timestamps)
  - [x] 1.4 Create migration untuk tabel `media` (id, filename, path, mime_type, size, width nullable, height nullable, alt_text, uploaded_by foreign key to admin_users, timestamps)
  - [x] 1.5 Create migration untuk tabel `settings` (id, key unique, value text, type enum(text/json/boolean), timestamps)
  - [ ] 1.6 Run migrations (`php artisan migrate`) - PENDING: Database setup
  - [ ] 1.7 Create model `app/Models/AdminUser.php` extends Authenticatable dengan HasFactory, SoftDeletes
  - [ ] 1.8 Create model `app/Models/Menu.php` dengan relationships (parent, children)
  - [ ] 1.9 Create model `app/Models/CustomPage.php` dengan slug auto-generation
  - [ ] 1.10 Create model `app/Models/Media.php` dengan relationships (uploader)
  - [ ] 1.11 Create model `app/Models/Setting.php` dengan helper methods (get/set settings)
  - [ ] 1.12 Create seeder `database/seeders/AdminUserSeeder.php` untuk membuat default admin user (email: admin@balaibahasa.go.id, password: password)
  - [ ] 1.13 Run seeder (`php artisan db:seed --class=AdminUserSeeder`)

- [ ] 2.0 Setup Authentication System untuk Admin
  - [ ] 2.1 Create config file `config/admin.php` dengan settings: guard name, url prefix, middleware, etc.
  - [ ] 2.2 Update `config/auth.php` untuk menambah guard 'admin' menggunakan AdminUser model
  - [ ] 2.3 Create middleware `app/Http/Middleware/AdminAuth.php` untuk protect admin routes
  - [ ] 2.4 Create middleware `app/Http/Middleware/RedirectIfAdmin.php` untuk redirect jika sudah login
  - [ ] 2.5 Register middleware di `app/Http/Kernel.php`
  - [ ] 2.6 Create routes file `routes/admin.php`
  - [ ] 2.7 Include admin routes di `bootstrap/app.php` atau `app/Providers/RouteServiceProvider.php`
  - [ ] 2.8 Create `app/Http/Controllers/Admin/AuthController.php` dengan methods: showLogin, login, logout
  - [ ] 2.9 Add routes di `routes/admin.php`: GET /administrator/login, POST /administrator/login, POST /administrator/logout
  - [ ] 2.10 Create halaman login: `resources/js/Pages/Admin/Login.tsx` dengan form email & password
  - [ ] 2.11 Style login page dengan Shadcn UI Card, Input, Button components
  - [ ] 2.12 Implement login logic dengan Inertia post request
  - [ ] 2.13 Test login dengan seeder admin user
  - [ ] 2.14 Implement logout functionality
  - [ ] 2.15 Create custom hook `resources/js/hooks/useAdminAuth.ts` untuk cek admin auth state

- [ ] 3.0 Create Admin Layout & Navigation
  - [ ] 3.1 Create `resources/js/Layouts/AdminLayout.tsx` dengan sidebar + main content area
  - [ ] 3.2 Create `resources/js/Components/Admin/Sidebar.tsx` dengan collapsible menu items
  - [ ] 3.3 Add menu items ke sidebar: Dashboard, Berita, Kegiatan, Layanan, Galeri, Profil, PPID, SAKIP, Terbitan, Menu, Media, Settings, Users
  - [ ] 3.4 Create `resources/js/Components/Admin/TopBar.tsx` dengan breadcrumb dan profile dropdown
  - [ ] 3.5 Add profile dropdown items: Nama admin, Logout button
  - [ ] 3.6 Implement breadcrumb logic berdasarkan current route
  - [ ] 3.7 Style layout dengan Tailwind CSS (darker sidebar, lighter content area)
  - [ ] 3.8 Make sidebar responsive (collapse pada tablet, hamburger menu)
  - [ ] 3.9 Add logo Balai Bahasa di sidebar header
  - [ ] 3.10 Test navigation antar menu items

- [ ] 4.0 Create Dashboard Admin
  - [ ] 4.1 Create `app/Http/Controllers/Admin/DashboardController.php` dengan method index
  - [ ] 4.2 Add route: GET /administrator/dashboard
  - [ ] 4.3 Query statistik: total berita, total kegiatan, total dokumen, total pengunjung (dari tabel visitors)
  - [ ] 4.4 Query 5 berita terbaru dengan eager loading author
  - [ ] 4.5 Create `resources/js/Pages/Admin/Dashboard.tsx`
  - [ ] 4.6 Create stat cards component untuk menampilkan statistik dengan icons
  - [ ] 4.7 Tampilkan tabel recent news dengan kolom: thumbnail, title, kategori, status, published_at, actions (edit/delete)
  - [ ] 4.8 Add quick actions buttons di setiap row (Edit, Delete)
  - [ ] 4.9 Style dashboard dengan grid layout untuk stat cards
  - [ ] 4.10 Test dashboard dengan data dummy

- [ ] 5.0 Create Reusable Admin Components
  - [ ] 5.1 Create `resources/js/Components/Admin/DataTable.tsx` - generic data table dengan pagination, sorting, filtering
  - [ ] 5.2 Add props: columns, data, pagination, onSort, onFilter, actions
  - [ ] 5.3 Implement pagination controls (prev, next, page numbers)
  - [ ] 5.4 Create `resources/js/Components/Admin/FileUploader.tsx` dengan react-dropzone
  - [ ] 5.5 Support drag-and-drop, file preview, progress bar
  - [ ] 5.6 Validation: file type, file size
  - [ ] 5.7 Create `resources/js/Components/Admin/ImageGallery.tsx` untuk manage multiple images
  - [ ] 5.8 Features: upload multiple, reorder (drag-and-drop), delete, set featured
  - [ ] 5.9 Create `resources/js/Components/Admin/ConfirmDialog.tsx` untuk delete confirmations
  - [ ] 5.10 Create `resources/js/Components/Admin/StatusBadge.tsx` untuk tampilkan status (draft/published/active/inactive)

- [ ] 6.0 Install & Setup Rich Text Editor (TipTap)
  - [ ] 6.1 Install TipTap packages: `npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link`
  - [ ] 6.2 Create `resources/js/Components/Admin/RichTextEditor.tsx`
  - [ ] 6.3 Setup TipTap editor dengan extensions: StarterKit, Image, Link
  - [ ] 6.4 Create toolbar dengan buttons: Bold, Italic, Heading (H1-H3), Bullet List, Ordered List, Link, Image
  - [ ] 6.5 Implement image upload ke server dari dalam editor (drag-and-drop image ke konten)
  - [ ] 6.6 Add character/word count indicator
  - [ ] 6.7 Style editor dengan border, min-height, prose styling
  - [ ] 6.8 Integrate dengan React Hook Form (controlled component)
  - [ ] 6.9 Test editor dengan dummy content

- [ ] 7.0 Create Media Service & Upload Handler
  - [ ] 7.1 Create `app/Services/MediaService.php`
  - [ ] 7.2 Method uploadImage: validate, resize dengan Intervention Image (max width 1920px), compress (80% quality), save to storage/app/public/media
  - [ ] 7.3 Method uploadDocument: validate file type (pdf, doc, docx, xls, xlsx), size limit 10MB, save to storage
  - [ ] 7.4 Method deleteMedia: delete file dari storage dan record dari database
  - [ ] 7.5 Method getMediaUrl: generate public URL untuk media
  - [ ] 7.6 Create `app/Http/Controllers/Admin/MediaController.php`
  - [ ] 7.7 Method index: list semua media dengan pagination, filter by type
  - [ ] 7.8 Method upload: handle upload request, call MediaService
  - [ ] 7.9 Method destroy: delete media
  - [ ] 7.10 Add routes: GET /administrator/media, POST /administrator/media/upload, DELETE /administrator/media/{id}
  - [ ] 7.11 Create symbolic link: `php artisan storage:link`
  - [ ] 7.12 Test upload image dan document

- [ ] 8.0 CRUD Berita (News)
  - [ ] 8.1 Create `app/Http/Controllers/Admin/BeritaController.php` dengan resource methods (index, create, store, edit, update, destroy)
  - [ ] 8.2 Method index: paginate berita dengan search, filter by kategori & status, eager load author & images
  - [ ] 8.3 Method create: return Inertia render dengan data kategori
  - [ ] 8.4 Method store: validate input, upload featured_image, save berita, handle gallery images, redirect dengan success message
  - [ ] 8.5 Method edit: find berita, eager load translations & images, return Inertia render
  - [ ] 8.6 Method update: validate, update berita, handle image updates, redirect
  - [ ] 8.7 Method destroy: soft delete berita, delete associated images
  - [ ] 8.8 Add routes di routes/admin.php: resource route untuk berita
  - [ ] 8.9 Create validation schema `resources/js/schemas/adminBeritaSchema.ts` (title required, slug, content required, status, published_at)
  - [ ] 8.10 Create `resources/js/Pages/Admin/Berita/Index.tsx` dengan DataTable component
  - [ ] 8.11 Tampilkan columns: thumbnail, title, kategori, status badge, published_at, views, actions (edit/delete)
  - [ ] 8.12 Implement search input dengan debounce
  - [ ] 8.13 Implement filter by kategori (dropdown), status (dropdown)
  - [ ] 8.14 Create `resources/js/Pages/Admin/Berita/Create.tsx`
  - [ ] 8.15 Form fields: title input, slug input (auto-generate dari title), kategori select, content (RichTextEditor), featured image upload, gallery images (ImageGallery), status radio (draft/published), published_at datetime picker
  - [ ] 8.16 Integrate React Hook Form dengan Zod schema
  - [ ] 8.17 Handle form submit dengan Inertia post
  - [ ] 8.18 Create `resources/js/Pages/Admin/Berita/Edit.tsx` (reuse form dari Create dengan pre-filled data)
  - [ ] 8.19 Implement delete dengan ConfirmDialog
  - [ ] 8.20 Add toast notifications untuk success/error
  - [ ] 8.21 Test create, edit, delete berita
  - [ ] 8.22 Test image upload dan gallery management

- [ ] 9.0 CRUD Kegiatan (Activities)
  - [ ] 9.1 Create `app/Http/Controllers/Admin/KegiatanController.php` (similar structure dengan BeritaController)
  - [ ] 9.2 Implement index, create, store, edit, update, destroy methods
  - [ ] 9.3 Add routes untuk kegiatan resource
  - [ ] 9.4 Create validation schema `resources/js/schemas/adminKegiatanSchema.ts`
  - [ ] 9.5 Create `resources/js/Pages/Admin/Kegiatan/Index.tsx`
  - [ ] 9.6 Create `resources/js/Pages/Admin/Kegiatan/Form.tsx` untuk create & edit
  - [ ] 9.7 Form fields: title, slug, description (RichTextEditor), event_date, location, featured_image, gallery (multiple images with drag reorder), status
  - [ ] 9.8 Implement gallery reorder functionality (update sort_order)
  - [ ] 9.9 Test CRUD kegiatan

- [ ] 10.0 CRUD Layanan (Services)
  - [ ] 10.1 Create `app/Http/Controllers/Admin/LayananController.php`
  - [ ] 10.2 Implement CRUD methods untuk layanan
  - [ ] 10.3 Add routes untuk layanan
  - [ ] 10.4 Create `resources/js/Pages/Admin/Layanan/Index.tsx`
  - [ ] 10.5 Create `resources/js/Pages/Admin/Layanan/Form.tsx`
  - [ ] 10.6 Form fields: name, slug, description (RichTextEditor), icon (upload atau pilih dari Hugeicons), category, requirements (dynamic array input), processing_time, cost, status (active/inactive)
  - [ ] 10.7 Implement dynamic fields untuk requirements (add/remove requirement items)
  - [ ] 10.8 Test CRUD layanan

- [ ] 11.0 CRUD Galeri
  - [ ] 11.1 Create `app/Http/Controllers/Admin/GaleriController.php`
  - [ ] 11.2 Method index: list gallery items dengan grid view, filter by kategori
  - [ ] 11.3 Method bulkUpload: handle multiple image upload sekaligus
  - [ ] 11.4 Method update: edit title, description, category per image
  - [ ] 11.5 Method bulkDestroy: delete multiple images
  - [ ] 11.6 Add routes untuk galeri
  - [ ] 11.7 Create `resources/js/Pages/Admin/Galeri/Index.tsx`
  - [ ] 11.8 Implement grid layout dengan thumbnail previews
  - [ ] 11.9 Add bulk upload area dengan drag-and-drop multiple files
  - [ ] 11.10 Show upload progress bar untuk multiple files
  - [ ] 11.11 Implement checkbox selection untuk bulk actions (delete, change category)
  - [ ] 11.12 Add inline editing untuk title & description
  - [ ] 11.13 Test bulk upload dan bulk delete

- [ ] 12.0 Edit Profil Organisasi (Static Content)
  - [ ] 12.1 Check existing ProfileContent model dan table structure
  - [ ] 12.2 Create `app/Http/Controllers/Admin/ProfilController.php`
  - [ ] 12.3 Method edit: load content by section (sejarah, visi_misi, kedudukan, tugas_fungsi, struktur)
  - [ ] 12.4 Method update: save content untuk specific section
  - [ ] 12.5 Add routes untuk profil editing
  - [ ] 12.6 Create `resources/js/Pages/Admin/Profil/Edit.tsx`
  - [ ] 12.7 Tabs untuk section: Sejarah, Visi & Misi, Kedudukan, Tugas & Fungsi, Struktur Organisasi
  - [ ] 12.8 Setiap tab memiliki RichTextEditor untuk konten
  - [ ] 12.9 Tab Struktur: upload image struktur organisasi + RichTextEditor untuk deskripsi
  - [ ] 12.10 Add preview button untuk melihat hasil di public page
  - [ ] 12.11 Test edit dan simpan setiap section

- [ ] 13.0 CRUD Dokumen PPID
  - [ ] 13.1 Create `app/Http/Controllers/Admin/PpidController.php`
  - [ ] 13.2 Method index: list dokumen dengan filter by kategori (Setiap Saat, Serta Merta, Berkala, Dikecualikan)
  - [ ] 13.3 Method store: upload dokumen PDF/DOC, save metadata
  - [ ] 13.4 Method destroy: delete dokumen file dan record
  - [ ] 13.5 Add CRUD methods untuk PPID team members
  - [ ] 13.6 Add routes untuk PPID documents & team
  - [ ] 13.7 Create `resources/js/Pages/Admin/Dokumen/Ppid.tsx`
  - [ ] 13.8 Tabs: Dokumen Informasi, Tim PPID
  - [ ] 13.9 Tab Dokumen: DataTable dengan columns (title, kategori, file size, download count, tanggal upload, actions)
  - [ ] 13.10 Form upload dokumen: title, kategori select, file upload, description
  - [ ] 13.11 Tab Tim: CRUD team members dengan foto, nama, jabatan, kontak
  - [ ] 13.12 Implement drag-and-drop reorder untuk team members
  - [ ] 13.13 Test upload dan delete dokumen

- [ ] 14.0 CRUD Dokumen SAKIP, ZI-WBK, Standar Pelayanan
  - [ ] 14.1 Create `app/Http/Controllers/Admin/SakipController.php`
  - [ ] 14.2 Similar structure dengan PpidController untuk upload dokumen
  - [ ] 14.3 Kategori untuk SAKIP: Renstra, Renja, Lakip, Perjanjian Kinerja, dll
  - [ ] 14.4 Create `resources/js/Pages/Admin/Dokumen/Sakip.tsx`
  - [ ] 14.5 Create similar pages untuk ZI-WBK dan Standar Pelayanan
  - [ ] 14.6 Test upload dokumen untuk masing-masing kategori

- [ ] 15.0 CRUD Terbitan (Publications)
  - [ ] 15.1 Check existing models untuk terbitan (atau create new if needed)
  - [ ] 15.2 Create `app/Http/Controllers/Admin/TerbitanController.php`
  - [ ] 15.3 Method index: list terbitan dengan filter by jenis (Majalah, Kamus, Cerita Rakyat, Cerita Anak, Penelitian)
  - [ ] 15.4 Methods store/update untuk terbitan
  - [ ] 15.5 Add routes untuk terbitan
  - [ ] 15.6 Create `resources/js/Pages/Admin/Terbitan/Index.tsx`
  - [ ] 15.7 Create `resources/js/Pages/Admin/Terbitan/Form.tsx`
  - [ ] 15.8 Form fields: title, jenis select, cover image, PDF file, tahun, description (RichTextEditor)
  - [ ] 15.9 Show PDF preview inline (jika memungkinkan dengan browser PDF viewer)
  - [ ] 15.10 Track download count untuk terbitan
  - [ ] 15.11 Test create dan edit terbitan

- [ ] 16.0 Menu Management System
  - [ ] 16.1 Create `app/Http/Controllers/Admin/MenuController.php`
  - [ ] 16.2 Method index: load menu tree structure (parent-child hierarchy)
  - [ ] 16.3 Method store: create new menu item
  - [ ] 16.4 Method update: edit menu item
  - [ ] 16.5 Method reorder: update menu order dan parent-child relationships
  - [ ] 16.6 Method destroy: delete menu item (cascade delete children atau prevent if has children)
  - [ ] 16.7 Add routes untuk menu management
  - [ ] 16.8 Create `resources/js/Pages/Admin/Menu/Index.tsx`
  - [ ] 16.9 Tabs: Header Menu, Footer Menu
  - [ ] 16.10 Display menu tree dengan indentation untuk submenu
  - [ ] 16.11 Implement drag-and-drop untuk reorder dan change parent
  - [ ] 16.12 Form create/edit menu: label, URL/route, parent menu dropdown, icon (Hugeicons picker), status (visible/hidden)
  - [ ] 16.13 Add preview button untuk melihat struktur menu di public site
  - [ ] 16.14 Test create menu, create submenu, reorder, dan delete

- [ ] 17.0 Custom Page Builder
  - [ ] 17.1 Create `app/Http/Controllers/Admin/CustomPageController.php`
  - [ ] 17.2 CRUD methods untuk custom pages
  - [ ] 17.3 Add routes: resource route untuk custom_pages
  - [ ] 17.4 Create `resources/js/Pages/Admin/Pages/Index.tsx`
  - [ ] 17.5 Create `resources/js/Pages/Admin/Pages/Form.tsx`
  - [ ] 17.6 Form fields: title, slug (auto-generate), content (RichTextEditor), layout template select (default/full-width/sidebar), meta_title, meta_description, status (draft/published)
  - [ ] 17.7 Implement page preview sebelum publish
  - [ ] 17.8 Create public route handler untuk display custom pages: GET /{slug}
  - [ ] 17.9 Add middleware untuk check published status
  - [ ] 17.10 Test create custom page dan view di public site
  - [ ] 17.11 Test add custom page ke menu navigation

- [ ] 18.0 Media Library Management
  - [ ] 18.1 Create `resources/js/Pages/Admin/Media/Library.tsx`
  - [ ] 18.2 Display grid view untuk semua media (images & documents)
  - [ ] 18.3 Thumbnail preview untuk images, icon untuk documents
  - [ ] 18.4 Filter by file type (images, documents, videos)
  - [ ] 18.5 Filter by upload date (date range picker)
  - [ ] 18.6 Search by filename atau alt text
  - [ ] 18.7 Detail sidebar saat click media: filename, size, dimensions (images), URL, uploaded by, upload date, "used in" list
  - [ ] 18.8 Copy URL to clipboard button
  - [ ] 18.9 Edit alt text inline
  - [ ] 18.10 Bulk select dan bulk delete
  - [ ] 18.11 Pagination untuk large libraries
  - [ ] 18.12 Test upload via media library langsung

- [ ] 19.0 Site Settings Management
  - [ ] 19.1 Create `app/Http/Controllers/Admin/SettingController.php`
  - [ ] 19.2 Method index: load all settings grouped by category
  - [ ] 19.3 Method update: batch update settings
  - [ ] 19.4 Create helper methods di Setting model: getSetting(), setSetting()
  - [ ] 19.5 Add routes untuk settings
  - [ ] 19.6 Create `resources/js/Pages/Admin/Settings/Index.tsx`
  - [ ] 19.7 Tabs: General, Contact, SEO, Advanced
  - [ ] 19.8 Tab General: site name, logo upload, favicon upload, tagline, footer text
  - [ ] 19.9 Tab Contact: address (textarea), phone, email, social media links (facebook, twitter, instagram, youtube)
  - [ ] 19.10 Tab SEO: default meta description, keywords, Google Analytics ID
  - [ ] 19.11 Tab Advanced: maintenance mode toggle, items per page (pagination default)
  - [ ] 19.12 Preview logo dan favicon setelah upload
  - [ ] 19.13 Test save settings dan verify changes di public site

- [ ] 20.0 Admin User Management
  - [ ] 20.1 Create `app/Http/Controllers/Admin/AdminUserController.php`
  - [ ] 20.2 CRUD methods untuk admin users
  - [ ] 20.3 Add routes untuk admin user management
  - [ ] 20.4 Create `resources/js/Pages/Admin/Users/Index.tsx`
  - [ ] 20.5 DataTable dengan columns: name, email, status (active/inactive), last login, created at, actions
  - [ ] 20.6 Form create user: name, email, password, password confirmation
  - [ ] 20.7 Form edit user: name, email, reset password (optional checkbox)
  - [ ] 20.8 Soft delete user (deactivate)
  - [ ] 20.9 Prevent deleting self
  - [ ] 20.10 Test create, edit, deactivate admin user

- [ ] 21.0 Integrate Menu System dengan Public Frontend
  - [ ] 21.1 Update `app/Http/Middleware/HandleInertiaRequests.php` untuk share menu data globally
  - [ ] 21.2 Query active menus dari Menu model untuk header & footer
  - [ ] 21.3 Build menu tree structure helper method
  - [ ] 21.4 Update `resources/js/Components/Public/Header.tsx` untuk render dynamic menu dari database
  - [ ] 21.5 Handle submenu rendering dengan dropdown
  - [ ] 21.6 Update `resources/js/Components/Public/Footer.tsx` untuk footer menu
  - [ ] 21.7 Test menu visibility toggle dari admin panel
  - [ ] 21.8 Test custom pages accessible via menu links

- [ ] 22.0 Security & Validation Enhancements
  - [ ] 22.1 Add CSRF token validation untuk semua POST/PUT/DELETE requests (already handled by Laravel)
  - [ ] 22.2 Implement rate limiting di routes/admin.php untuk login endpoint (max 5 attempts per minute)
  - [ ] 22.3 Add file upload validation: whitelist allowed MIME types, max file size
  - [ ] 22.4 Sanitize HTML input dari RichTextEditor (strip dangerous tags dengan HTMLPurifier atau similar)
  - [ ] 22.5 Add SQL injection protection (already handled by Eloquent, but verify no raw queries)
  - [ ] 22.6 Ensure all admin routes protected dengan AdminAuth middleware
  - [ ] 22.7 Add audit log untuk critical actions (optional: create activity_logs table)
  - [ ] 22.8 Test security: try SQL injection, XSS attacks, CSRF bypass

- [ ] 23.0 Performance Optimization
  - [ ] 23.1 Add database indexes: news(slug, status, published_at), menus(order, parent_id), media(mime_type)
  - [ ] 23.2 Implement image optimization saat upload (resize, compress)
  - [ ] 23.3 Add caching untuk settings (cache()->remember for settings)
  - [ ] 23.4 Add caching untuk menu structure (clear cache saat menu updated)
  - [ ] 23.5 Optimize N+1 queries dengan eager loading (with() dalam controllers)
  - [ ] 23.6 Add pagination untuk semua list pages (already planned)
  - [ ] 23.7 Lazy load images di DataTable untuk performance
  - [ ] 23.8 Test page load times dengan browser DevTools

- [ ] 24.0 UI/UX Polish & Responsiveness
  - [ ] 24.1 Review semua pages untuk konsistensi spacing, typography
  - [ ] 24.2 Add loading states untuk semua async operations (spinner/skeleton)
  - [ ] 24.3 Implement toast notifications library (sonner atau react-hot-toast)
  - [ ] 24.4 Add empty states untuk tables dengan no data ("Belum ada berita", dengan CTA "Tambah Berita")
  - [ ] 24.5 Test responsive layout di tablet (768px-1023px)
  - [ ] 24.6 Show warning message di mobile (<768px): "Gunakan desktop untuk pengalaman terbaik"
  - [ ] 24.7 Add keyboard shortcuts untuk common actions (Cmd+S untuk save, Cmd+K untuk search)
  - [ ] 24.8 Improve form validation error messages (clear & actionable)
  - [ ] 24.9 Add confirmation before leaving page dengan unsaved changes
  - [ ] 24.10 Test accessibility dengan keyboard navigation

- [ ] 25.0 Testing & Bug Fixes
  - [ ] 25.1 Test semua CRUD operations untuk setiap module
  - [ ] 25.2 Test file upload: images, documents, multiple files
  - [ ] 25.3 Test form validation: required fields, file size limits, file types
  - [ ] 25.4 Test authentication: login, logout, session expiry
  - [ ] 25.5 Test authorization: verify AdminAuth middleware working
  - [ ] 25.6 Test pagination, sorting, filtering di setiap list page
  - [ ] 25.7 Test search functionality
  - [ ] 25.8 Test drag-and-drop: gallery reorder, menu reorder, team member reorder
  - [ ] 25.9 Test delete confirmations
  - [ ] 25.10 Test preview functionality (berita, custom pages)
  - [ ] 25.11 Cross-browser testing (Chrome, Firefox, Safari, Edge)
  - [ ] 25.12 Fix any bugs found during testing
  - [ ] 25.13 Collect feedback dari potential users (staf Balai Bahasa)
  - [ ] 25.14 Iterate based on feedback

- [ ] 26.0 Documentation & User Training
  - [ ] 26.1 Create user manual PDF: "Panduan Penggunaan Admin Panel Balai Bahasa Sultra"
  - [ ] 26.2 Include screenshots untuk setiap fitur
  - [ ] 26.3 Write step-by-step instructions untuk common tasks (tambah berita, upload dokumen, edit menu)
  - [ ] 26.4 Create video tutorial (optional): screen recording untuk common workflows
  - [ ] 26.5 Prepare training session materials (slides + hands-on exercises)
  - [ ] 26.6 Add help tooltips di form fields yang kompleks
  - [ ] 26.7 Create FAQ section di admin panel (optional)
  - [ ] 26.8 Document technical setup untuk developers (README di repo)

- [ ] 27.0 Deployment Preparation
  - [ ] 27.1 Review `.env.example` untuk admin-related configs
  - [ ] 27.2 Update deployment script untuk run admin migrations
  - [ ] 27.3 Ensure storage symlink created di production (`php artisan storage:link`)
  - [ ] 27.4 Set proper file permissions untuk storage/app/public
  - [ ] 27.5 Configure web server (Nginx/Apache) untuk serve admin routes
  - [ ] 27.6 Enable HTTPS untuk admin panel di production
  - [ ] 27.7 Setup backup strategy untuk uploaded media files
  - [ ] 27.8 Test deployment di staging environment
  - [ ] 27.9 Create admin users di production database
  - [ ] 27.10 Final smoke test di production

---

**Total Tasks**: 27 Parent Tasks, 300+ Sub-tasks
**Estimated Timeline**: 10-12 weeks (mengikuti phases di PRD)
**Priority**: Start dengan Task 0-7 (Foundation & Authentication) terlebih dahulu
**Next Action**: Mulai dengan Task 0.0 - Create feature branch
