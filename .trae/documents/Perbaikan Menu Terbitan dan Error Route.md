## Rencana Perbaikan Menu Terbitan dan Error Route

### Masalah yang Ditemukan:

1. **Error "route is not defined" di Majalah.tsx**
   - Pada baris 111, pemanggilan `route(magazine.route)` tidak didefinisikan
   - Seharusnya menggunakan `router.visit()` atau `Link` dari Inertia.js

2. **Struktur Data yang Tidak Konsisten**
   - Data majalah di controller memiliki properti `route` yang tidak sesuai dengan routing di frontend
   - Implementasi halaman Pabitara, Glitera, dan Pogsa berbeda dengan Majalah

3. **Routing yang Tidak Lengkap**
   - Hanya ada routing untuk `/terbitan/majalah` di web.php
   - Tidak ada routing untuk submenu Pabitara, Glitera, dan Pogsa

### Perbaikan yang Akan Dilakukan:

1. **Memperbaiki Error Route di Majalah.tsx**
   - Mengganti `route(magazine.route)` dengan `router.visit(magazine.route)` atau menggunakan Link
   - Menambahkan import `router` dari @inertiajs/react

2. **Memperbaiki Struktur Data**
   - Menyesuaikan properti `route` di controller agar sesuai dengan routing yang ada
   - Memastikan konsistensi data antara Majalah.tsx dan halaman submenu lainnya

3. **Menambahkan Routing yang Hilang**
   - Menambahkan routing untuk `/terbitan/majalah/pabitara`, `/terbitan/majalah/glitera`, dan `/terbitan/majalah/pogsa`
   - Memastikan routing mengarah ke controller yang tepat

4. **Memperbaiki Navigasi Menu**
   - Memastikan menu dropdown Terbitan berfungsi dengan baik
   - Menambahkan validasi untuk mencegah error serupa

### File yang Akan Diubah:

* `resources/js/Pages/Public/Terbitan/Majalah.tsx` (perbaikan error route)
* `app/Http/Controllers/TerbitanController.php` (penyesuaian data)
* `routes/web.php` (penambahan routing)
* `resources/js/Components/Public/Header.tsx` (jika perlu penyesuaian menu)

