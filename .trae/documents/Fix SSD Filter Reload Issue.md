## Rencana Perbaikan Filter SSD

### Masalah
Filter SSD (semua, layanan, PPID, Teknis, Umum) menyebabkan full page reload saat diklik karena menggunakan `router.get()` yang tidak perlu.

### Solusi
1. **Modifikasi handleCategoryChange function**
   - Hapus `router.get()` call yang menyebabkan reload
   - Gunakan client-side filtering yang sudah ada

2. **Optimasi Search functionality**
   - Tambah debouncing untuk search input
   - Pertimbangkan client-side search untuk data yang sudah loaded

3. **Testing & Validation**
   - Pastikan semua filter berjalan smooth tanpa reload
   - Verify UI update instant saat ganti kategori

### File yang akan diubah:
- `resources/js/Pages/Public/Ssd/Index.tsx` (modifikasi handleCategoryChange)

### Expected Outcome:
- Filter kategori berjalan instant tanpa reload
- User experience lebih smooth
- Mengurangi unnecessary server requests