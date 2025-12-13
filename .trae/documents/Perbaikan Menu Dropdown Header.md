## Rencana Perbaikan Menu Dropdown Header

### Masalah yang Ditemukan:

1. Komponen NavDropdown menggunakan DropdownMenu dari Radix UI dengan styling yang bentrok
2. Z-index dropdown terlalu rendah sehingga tertutup elemen lain
3. Positioning dropdown tidak optimal
4. Beberapa menu items memiliki routing yang tidak valid

### Perbaikan yang Akan Dilakukan:

1. **Memperbaiki Komponen NavDropdown**

   * Menambahkan z-index yang lebih tinggi (z-50)

   * Memperbaiki positioning dengan prop `side="bottom"` dan `align="start"`

   * Mengoptimalkan styling DropdownMenuContent

2. **Memvalidasi Menu Items**

   * Memeriksa semua routing pada menu items

   * Memisahkan menu "Informasi" yang terlalu padat

   * Menambahkan handling untuk external links

3. **Menambahkan Hover State yang Lebih Baik**

   * Menambahkan delay untuk membuka/menutup dropdown

   * Memperbaiki transisi animasi

4. **Testing Responsif**

   * Memastikan dropdown berfungsi baik di desktop dan mobile

   * Menambahkan fallback untuk layar kecil

### File yang Akan Diubah:

* `resources/js/Components/Public/Header.tsx` (perbaikan NavDropdown dan menu items)

