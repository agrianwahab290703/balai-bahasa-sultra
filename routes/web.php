<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\BeritaController;
use App\Http\Controllers\LayananController;
use App\Http\Controllers\GaleriController;
use App\Http\Controllers\ProfilController;
use App\Http\Controllers\KontakController;
use App\Http\Controllers\ZiWbkController;
use App\Http\Controllers\SakipController;
use App\Http\Controllers\TerbitanController;
use App\Http\Controllers\PpidController;
use App\Http\Controllers\StandarPelayananController;
use App\Http\Controllers\SsdController;
use Illuminate\Support\Facades\Route;

// Public Routes
Route::get('/', [HomeController::class, 'index'])->name('home');

// Berita
Route::prefix('berita')->name('berita.')->group(function () {
    Route::get('/', [BeritaController::class, 'index'])->name('index');
    Route::get('/{slug}', [BeritaController::class, 'show'])->name('show');

    // API Routes for Berita
    Route::prefix('api')->name('api.')->group(function () {
        Route::get('/category/{category}', [BeritaController::class, 'getByCategory'])->name('category');
        Route::get('/search', [BeritaController::class, 'search'])->name('search');
        Route::get('/popular', [BeritaController::class, 'getPopular'])->name('popular');
        Route::get('/featured', [BeritaController::class, 'getFeatured'])->name('featured');
        Route::get('/recent', [BeritaController::class, 'getRecent'])->name('recent');
        Route::get('/statistics', [BeritaController::class, 'getStatistics'])->name('statistics');
        Route::post('/{id}/view', [BeritaController::class, 'incrementView'])->name('view');
    });
});

// Layanan
Route::get('/layanan', [LayananController::class, 'index'])->name('layanan.index');
Route::get('/layanan/{slug}', [LayananController::class, 'show'])->name('layanan.show');

// Galeri
Route::get('/galeri', [GaleriController::class, 'index'])->name('galeri.index');

// Profil
Route::get('/profil', [ProfilController::class, 'index'])->name('profil.index');
Route::get('/profil/sejarah', [ProfilController::class, 'sejarah'])->name('profil.sejarah');
Route::get('/profil/kedudukan', [ProfilController::class, 'kedudukan'])->name('profil.kedudukan');
Route::get('/profil/visi-misi', [ProfilController::class, 'visiMisi'])->name('profil.visi-misi');
Route::get('/profil/struktur', [ProfilController::class, 'struktur'])->name('profil.struktur');

// Kontak
Route::get('/kontak', [KontakController::class, 'index'])->name('kontak.index');
Route::post('/kontak', [KontakController::class, 'store'])->name('kontak.store');

// Standar Pelayanan
Route::get('/standar-pelayanan', [StandarPelayananController::class, 'index'])->name('standar-pelayanan.index');
Route::post('/standar-pelayanan/{standarPelayanan}/download', [StandarPelayananController::class, 'download'])->name('standar-pelayanan.download');

// SSD (Soal Sering Ditanya / FAQ)
Route::get('/ssd', [SsdController::class, 'index'])->name('ssd.index');

// ZI-WBK (Zona Integritas - Wilayah Bebas Korupsi)
Route::prefix('zi-wbk')->name('zi-wbk.')->group(function () {
    Route::get('/', [ZiWbkController::class, 'index'])->name('index');

    // Manajemen Perubahan
    Route::get('/manajemen-perubahan', [ZiWbkController::class, 'manajemenPerubahan'])->name('manajemen-perubahan');
    Route::get('/manajemen-perubahan/tim-kerja', [ZiWbkController::class, 'timKerja'])->name('tim-kerja');
    Route::get('/manajemen-perubahan/rencana-pembangunan', [ZiWbkController::class, 'rencanaPembangunan'])->name('rencana-pembangunan');
    Route::get('/manajemen-perubahan/pemantauan-evaluasi', [ZiWbkController::class, 'pemantauanEvaluasi'])->name('pemantauan-evaluasi');
    Route::get('/manajemen-perubahan/perubahan-pola-pikir', [ZiWbkController::class, 'perubahanPolaPikir'])->name('perubahan-pola-pikir');

    // Penguatan Tata Laksana
    Route::get('/penguatan-tata-laksana', [ZiWbkController::class, 'penguatanTataLaksana'])->name('penguatan-tata-laksana');
    Route::get('/penguatan-tata-laksana/keterbukaan-informasi', [ZiWbkController::class, 'keterbukaanInformasi'])->name('keterbukaan-informasi');
    Route::get('/penguatan-tata-laksana/sop-kegiatan-utama', [ZiWbkController::class, 'sopKegiatanUtama'])->name('sop-kegiatan-utama');
    Route::get('/penguatan-tata-laksana/spbe', [ZiWbkController::class, 'spbe'])->name('spbe');

    // Manajemen SDM
    Route::get('/manajemen-sdm', [ZiWbkController::class, 'manajemenSdm'])->name('manajemen-sdm');
    Route::get('/manajemen-sdm/perencanaan-kebutuhan', [ZiWbkController::class, 'perencanaanKebutuhan'])->name('perencanaan-kebutuhan');
    Route::get('/manajemen-sdm/pola-mutasi', [ZiWbkController::class, 'polaMutasi'])->name('pola-mutasi');
    Route::get('/manajemen-sdm/pengembangan-pegawai', [ZiWbkController::class, 'pengembanganPegawai'])->name('pengembangan-pegawai');
    Route::get('/manajemen-sdm/penetapan-kinerja', [ZiWbkController::class, 'penetapanKinerja'])->name('penetapan-kinerja');
    Route::get('/manajemen-sdm/sistem-informasi', [ZiWbkController::class, 'sistemInformasi'])->name('sistem-informasi');
    Route::get('/manajemen-sdm/penegakan-disiplin', [ZiWbkController::class, 'penegakanDisiplin'])->name('penegakan-disiplin');

    // Akuntabilitas Kerja
    Route::get('/akuntabilitas-kerja', [ZiWbkController::class, 'akuntabilitasKerja'])->name('akuntabilitas-kerja');
    Route::get('/akuntabilitas-kerja/keterlibatan-pimpinan', [ZiWbkController::class, 'keterlibatanPimpinan'])->name('keterlibatan-pimpinan');
    Route::get('/akuntabilitas-kerja/pengelolaan-akuntabilitas', [ZiWbkController::class, 'pengelolaanAkuntabilitas'])->name('pengelolaan-akuntabilitas');

    // Penguatan Pengawasan
    Route::get('/penguatan-pengawasan', [ZiWbkController::class, 'penguatanPengawasan'])->name('penguatan-pengawasan');
    Route::get('/penguatan-pengawasan/pengendalian-gratifikasi', [ZiWbkController::class, 'pengendalianGratifikasi'])->name('pengendalian-gratifikasi');
    Route::get('/penguatan-pengawasan/penerapan-spip', [ZiWbkController::class, 'penerapanSpip'])->name('penerapan-spip');
    Route::get('/penguatan-pengawasan/pengaduan-masyarakat', [ZiWbkController::class, 'pengaduanMasyarakat'])->name('pengaduan-masyarakat');
    Route::get('/penguatan-pengawasan/whistle-blowing', [ZiWbkController::class, 'whistleBlowing'])->name('whistle-blowing');
    Route::get('/penguatan-pengawasan/penanganan-benturan', [ZiWbkController::class, 'penangananBenturan'])->name('penanganan-benturan');

    // Penguatan Kualitas Pelayanan Publik
    Route::get('/penguatan-kualitas-pelayanan-publik', [ZiWbkController::class, 'penguatanKualitas'])->name('penguatan-kualitas');
    Route::get('/penguatan-kualitas-pelayanan-publik/budaya-pelayanan', [ZiWbkController::class, 'budayaPelayanan'])->name('budaya-pelayanan');
    Route::get('/penguatan-kualitas-pelayanan-publik/pemanfaatan-teknologi', [ZiWbkController::class, 'pemanfaatanTeknologi'])->name('pemanfaatan-teknologi');
    Route::get('/penguatan-kualitas-pelayanan-publik/pengelolaan-pengaduan', [ZiWbkController::class, 'pengelolaanPengaduan'])->name('pengelolaan-pengaduan');
    Route::get('/penguatan-kualitas-pelayanan-publik/penilaian-kepuasan', [ZiWbkController::class, 'penilaianKepuasan'])->name('penilaian-kepuasan');
    Route::get('/penguatan-kualitas-pelayanan-publik/standar-pelayanan', [ZiWbkController::class, 'standarPelayanan'])->name('standar-pelayanan');
    Route::get('/penguatan-kualitas-pelayanan-publik/penerapan-spip', [ZiWbkController::class, 'penerapanSpipKualitas'])->name('penerapan-spip-kualitas');
    Route::get('/penguatan-kualitas-pelayanan-publik/penanganan-benturan', [ZiWbkController::class, 'penangananBenturanKualitas'])->name('penanganan-benturan-kualitas');
});

// SAKIP (Sistem Akuntabilitas Kinerja Instansi Pemerintah)
Route::prefix('sakip')->name('sakip.')->group(function () {
    Route::get('/data-dukung', [SakipController::class, 'dataDukung'])->name('data-dukung');
    Route::get('/laporan-kinerja', [SakipController::class, 'laporanKinerja'])->name('laporan-kinerja');
    Route::get('/perjanjian-kinerja', [SakipController::class, 'perjanjianKinerja'])->name('perjanjian-kinerja');
    Route::get('/rencana-aksi', [SakipController::class, 'rencanaAksi'])->name('rencana-aksi');
    Route::get('/rencana-strategis', [SakipController::class, 'rencanaStrategis'])->name('rencana-strategis');
    Route::get('/dipa-rka', [SakipController::class, 'dipaRka'])->name('dipa-rka');
});

// Terbitan - Majalah
Route::prefix('terbitan/majalah')->name('terbitan.majalah.')->group(function () {
    // Redirect /terbitan/majalah ke sub-menu pertama (Pabitara)
    Route::get('/', function () {
        return redirect()->route('terbitan.majalah.pabitara');
    })->name('index');
    Route::get('/pabitara', [TerbitanController::class, 'pabitara'])->name('pabitara');
    Route::get('/glitera', [TerbitanController::class, 'glitera'])->name('glitera');
    Route::get('/pogsa', [TerbitanController::class, 'pogsa'])->name('pogsa');
});

// Terbitan - Cerita Rakyat
Route::get('/terbitan/cerita-rakyat', [TerbitanController::class, 'ceritaRakyat'])->name('terbitan.cerita-rakyat');

// Terbitan - Kamus
Route::get('/terbitan/kamus', [TerbitanController::class, 'kamus'])->name('terbitan.kamus');

// Terbitan - Cerita Anak
Route::get('/terbitan/cerita-anak/2024', [TerbitanController::class, 'ceritaAnak2024'])->name('terbitan.cerita-anak.2024');
Route::get('/terbitan/cerita-anak', [TerbitanController::class, 'ceritaAnak2024'])->name('terbitan.cerita-anak');
Route::get('/cerita-anak', [TerbitanController::class, 'ceritaAnak2024'])->name('cerita-anak');

// Terbitan - Hasil Penelitian
Route::prefix('terbitan/hasil-penelitian')->name('terbitan.hasil-penelitian.')->group(function () {
    Route::get('/', [TerbitanController::class, 'penelitianBahasa'])->name('bahasa');
    Route::get('/bahasa', [TerbitanController::class, 'penelitianBahasa'])->name('bahasa');
    Route::get('/sastra', [TerbitanController::class, 'penelitianSastra'])->name('sastra');
});

// PPID (Pejabat Pengelola Informasi dan Dokumentasi)
Route::prefix('ppid')->name('ppid.')->group(function () {
    Route::get('/', [PpidController::class, 'profil'])->name('profil');
    Route::get('/profil', [PpidController::class, 'profil'])->name('profil');
    Route::get('/informasi-publik', [PpidController::class, 'informasiPublik'])->name('informasi-publik');
    Route::get('/informasi-publik/setiap-saat', [PpidController::class, 'informasiSetiapSaat'])->name('informasi-publik.setiap-saat');
    Route::get('/informasi-publik/serta-merta', [PpidController::class, 'informasiSertaMerta'])->name('informasi-publik.serta-merta');
    Route::get('/informasi-publik/berkala', [PpidController::class, 'informasiBerkala'])->name('informasi-publik.berkala');
    Route::get('/informasi-publik/dikecualikan', [PpidController::class, 'informasiDikecualikan'])->name('informasi-publik.dikecualikan');
    Route::get('/permohonan', [PpidController::class, 'permohonan'])->name('permohonan');
    Route::get('/pengajuan-keberatan', [PpidController::class, 'pengajuanKeberatan'])->name('pengajuan-keberatan');
    Route::post('/pengajuan-keberatan', [PpidController::class, 'storeKeberatan'])->name('pengajuan-keberatan.store');
    Route::get('/download/{id}', [PpidController::class, 'downloadDocument'])->name('download');
});

// Dashboard Routes (will add later)

require __DIR__.'/web_admin.php';
