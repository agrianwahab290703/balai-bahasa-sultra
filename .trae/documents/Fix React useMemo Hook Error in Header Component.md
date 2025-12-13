## Rencana Perbaikan Error React useMemo

### Masalah
Error `Cannot read properties of null (reading 'useMemo')` terjadi karena `useMemo` dipanggil di luar komponen React pada baris 204 Header.tsx.

### Solusi
1. **Pindahkan `ziWbkItems` ke dalam komponen Header**
   - Pindahkan deklarasi `ziWbkItems` dari level top module ke dalam komponen Header
   - Pastikan `useMemo` dipanggil di dalam konteks komponen React

2. **Optimalisasi performa**
   - Pertahankan penggunaan `useMemo` untuk caching data
   - Pastikan dependency array benar

### Langkah Implementasi
1. Pindahkan baris 204 (`const ziWbkItems = useMemo(...)`) ke dalam komponen Header
2. Tempatkan setelah deklarasi state di dalam komponen
3. Verifikasi tidak ada error setelah perubahan

### Hasil yang Diharapkan
- Error React teratasi
- Komponen Header berfungsi normal
- Performa tetap optimal dengan useMemo