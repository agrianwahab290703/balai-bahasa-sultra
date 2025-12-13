## 📋 Rencana Integrasi Gambar Cover Kamus

### 🎯 Tujuan

Menampilkan gambar cover asli kamus pada halaman terbitan untuk meningkatkan visual appeal dan user experience.

### 🔧 Perubahan yang Akan Dilakukan

**File Target**: `resources/js/Pages/Public/Terbitan/Kamus.tsx`

**Modifikasi Utama**:

1. **Mengganti ikon buku generik** dengan gambar cover asli (baris 218-220)
2. **Menambahkan error handling** dengan fallback ke ikon jika gambar gagal dimuat
3. **Mempertahankan efek hover** dan animasi yang sudah ada
4. **Optimasi tampilan** gambar dengan proper styling

### 📁 Sumber Daya yang Tersedia

* ✅ 10 file gambar cover di `public/images/kamus/`

* ✅ Data `coverImage` sudah terintegrasi dari controller

* ✅ Interface TypeScript sudah mendukung properti `coverImage`

### 🎨 Hasil yang Diharapkan

* Setiap card kamus menampilkan cover gambar asli

* Tampilan lebih menarik dan informatif

* Fallback yang elegan jika gambar tidak tersedia

* Performa yang optimal dengan proper image handling

### ⚡ Implementasi

* Menggunakan Next.js Image component untuk optimasi

* Error boundary untuk fallback handling

* CSS classes yang konsisten dengan desain existing

