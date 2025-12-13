## 🎯 Tujuan
Memperbaiki kesalahan routing menu SSD yang saat ini malah membuka halaman Data Dukung SAKIP

## 📋 Rencana Perbaikan

### 1. Update Desktop Navigation Menu
- **File:** `resources/js/Components/Public/Header.tsx:1036`
- **Action:** Ubah `<NavLink href="/sakip/data-dukung">SSD</NavLink>` menjadi `<NavLink href="/ssd">SSD</NavLink>`

### 2. Update Mobile Menu (Sheet)
- **File:** `resources/js/Components/Public/Header.tsx:998-1003`
- **Action:** Ubah `href="/sakip/data-dukung"` menjadi `href="/ssd"`

### 3. Update Mobile Navigation Bar
- **File:** `resources/js/Components/Public/Header.tsx:1080-1082`
- **Action:** Ubah `href="/sakip/data-dukung"` menjadi `href="/ssd"`

### 4. Verifikasi Route
- **Route yang sudah benar:** `/ssd` → `SsdController@index` (line 52 di web.php)
- **Controller:** `app/Http/Controllers/SsdController.php` sudah ada dan berfungsi
- **View:** `resources/js/Pages/Public/Ssd/Index.tsx` sudah ada

## ✅ Hasil yang Diharapkan
- Menu SSD akan mengarah ke halaman FAQ (Soal Sering Ditanya) yang benar
- Tidak ada lagi redirect ke halaman Data Dukung SAKIP
- Konsistensi routing di semua device (desktop & mobile)

## 🔍 Testing
- Test klik menu SSD di desktop
- Test klik menu SSD di mobile navigation bar
- Test klik menu SSD di mobile sheet menu
- Pastikan semua mengarah ke halaman FAQ SSD yang benar