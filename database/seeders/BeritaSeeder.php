<?php

namespace Database\Seeders;

use App\Models\Berita;
use App\Models\GaleriFotoBerita;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Carbon\Carbon;

class BeritaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Generate 187 berita
        for ($i = 1; $i <= 187; $i++) {
            $berita = Berita::factory()->create([
                'judul_utama' => $this->generateJudulBerita($i),
                'slug' => $this->generateSlugBerita($i),
                'published_at' => Carbon::now()->subDays(rand(1, 180))->format('Y-m-d H:i:s'),
                'view_count' => rand(150, 8900),
                'is_featured' => $i <= 12, // 12 berita unggulan
            ]);

            // Generate 4-6 gambar gallery untuk setiap berita
            $galleryCount = rand(4, 6);
            for ($j = 1; $j <= $galleryCount; $j++) {
                GaleriFotoBerita::factory()->create([
                    'berita_id' => $berita->id,
                    'tipe' => 'gallery',
                    'urutan' => $j,
                    'file_path' => "images/berita/gallery/berita-{$berita->id}-{$j}.jpg",
                    'file_name' => "berita-{$berita->id}-{$j}.jpg",
                ]);
            }

            // Generate 1 hero image
            GaleriFotoBerita::factory()->create([
                'berita_id' => $berita->id,
                'tipe' => 'hero',
                'urutan' => 0,
                'file_path' => "images/berita/hero/berita-{$berita->id}-hero.jpg",
                'file_name' => "berita-{$berita->id}-hero.jpg",
            ]);

            // Generate 2 group shots
            for ($k = 1; $k <= 2; $k++) {
                GaleriFotoBerita::factory()->create([
                    'berita_id' => $berita->id,
                    'tipe' => 'gallery',
                    'urutan' => $galleryCount + $k,
                    'caption' => $k == 1 ? 'Group Shot Peserta Kegiatan' : 'Group Shot Panitia dan Narasumber',
                    'file_path' => "images/berita/group/berita-{$berita->id}-group-{$k}.jpg",
                    'file_name' => "berita-{$berita->id}-group-{$k}.jpg",
                ]);
            }

            if ($i % 20 == 0) {
                $this->command->info("Generated {$i} berita...");
            }
        }

        $this->command->info('Successfully generated 187 berita with images!');
    }

    private function generateJudulBerita($index): string
    {
        $templates = [
            // Prestasi & Penghargaan (25 berita)
            'Prestasi' => [
                'Balai Bahasa Sultra Raih Penghargaan ZI WBK Tahun {year}',
                'Kemenpan RB Berikan Apresiasi kepada Balai Bahasa Sulawesi Tenggara',
                'Terobosan Baru: Balai Bahasa Sultra Jadi Role Model Reformasi Birokrasi',
                'Pencapaian Gemilang: Indeks Kepuasan Masyarakat Capai 4.7 dari 5.0',
                'Penghargaan Adi Buana untuk Balai Bahasa Provinsi Sulawesi Tenggara',
                'Best Practice Implementasi ZI WBK di Lingkungan Kemendikbudristek',
                'Platinum Award untuk Program Digitalisasi Layanan Bahasa',
                'Innovation Award 2025 untuk Layanan Uji Kompetensi Bahasa Daring',
                'Excellence in Public Service Award dari Lembaga Kebijakan Pengadaan',
                'National Quality Award untuk Kategori Tata Kelola Pemerintahan'
            ],

            // Kegiatan & Workshop (40 berita)
            'Kegiatan' => [
                'Workshop Penulisan Kreatif: Tingkatkan Literasi di Kalangan Pelajar',
                'Seminar Bahasa Indonesia: Menyongsong Era Society 5.0',
                'Pelatihan Jurnalistik Bahasa untuk Blogger Sulawesi Tenggara',
                'Festival Bahasa Daerah: Pelestarian Warisan Linguistik',
                'Lokakarya Standarisasi Istilah Bidang Pendidikan',
                'Workshop Penerjemahan Sastra: Membuka Jendela Dunia',
                'Pelatihan Pemandu Wisata Bahasa untuk Pariwisata Sultra',
                'Seminar Etika Komunikasi Digital: Bijak Bersosial Media',
                'Workshop Penyuntingan Naskah: Produksi Buku Berkualitas',
                'Pelatihan Public Speaking dalam Bahasa Indonesia'
            ],

            // Kolaborasi & Kerja Sama (25 berita)
            'Kerja Sama' => [
                'MoU dengan Pemerintah Daerah untuk Pengembangan Bahasa Lokal',
                'Kerja Sama dengan Universitas Halu Oleo untuk Penelitian Bahasa',
                'Kolaborasi Internasional: Program Pertukaran Budaya ASEAN',
                'Partnership dengan Google untuk Digitalisasi Kamus Daerah',
                'Kerja Sama dengan Media Lokal untuk Kampanye Bahasa Indonesia',
                'MoU dengan Kemenparekraf untuk Pengembangan Wisata Bahasa',
                'Kolaborasi dengan BPOM untuk Standarisasi Label Bahasa',
                'Partnership dengan Tokopedia untuk Kampanye Literasi Digital',
                'Kerja Sama dengan UNESCO untuk Pelestarian Bahasa Daerah',
                'MoU dengan Kementerian Luar Negeri untuk Diplomasi Bahasa'
            ],

            // Inovasi & Digital (35 berita)
            'Inovasi' => [
                'Aplikasi "Kamusku": Kamus Digital Bahasa Daerah Sultra',
                'Platform "CerdasBahasa": AI untuk Pembelajaran Bahasa',
                'E-Library Balai Bahasa: 10.000 Koleksi Digital Gratis',
                'Sistem "LayananKu": Permudah Akses Layanan Bahasa Online',
                'Podcast "Ngobrol Bahasa": Edukasi Bahasa era Digital',
                'Chatbot "TanyaBahasa": Asisten Virtual 24/7',
                'AR Experience: Jejak Bahasa di Sulawesi Tenggara',
                'Blockchain untuk Sertifikasi Kompetensi Bahasa',
                'Big Data Analytics: Pemetaan Penggunaan Bahasa di Sultra',
                'Metaverse untuk Pembelajaran Bahasa Interaktif'
            ],

            // Layanan Publik (30 berita)
            'Layanan' => [
                'Layanan Uji Kompetensi Bahasa: Standar Baru 2025',
                'Konsultasi Bahasa: Bantu Masyarakat Pahami Bahasa Indonesia',
                'Penerjemahan Resmi: Layanan Dokumen Legal Berstandar',
                'Sertifikasi Translator: Garansi Kualitas Terjemahan',
                'Klinik Penulisan: Permudah Produksi Karya Ilmiah',
                'Layanan Proofreading: Pastikan Kualitas Naskah Anda',
                'Standarisasi Nama: Layanan Pembuatan Nama Produk/Brand',
                'Konsultasi Istilah: Bantu Industri Ciptakan Istilah Teknis',
                'Penerbitan Buku: Dari Naskah Hingga Cetak',
                'Pelatihan Bahasa untuk Perusahaan: Custom Program'
            ],

            // Penelitian & Pengembangan (32 berita)
            'Riset' => [
                'Penelitian Dialek: Temuan Baru Bahasa Wolio di Buton',
                'Studi Korpus: Perkembangan Bahasa Indonesia di Media Sosial',
                'Survei Kepuasan Masyarakat: Layanan Balai Bahasa Tahun 2025',
                'Research Series: Efektivitas Pembelajaran Bahasa Daring',
                'Linguistic Landscape: Pemetaan Penggunaan Bahasa di Kota Kendari',
                'Sociolinguistic Study: Code-Switching di Kalangan Gen Z',
                'Phonology Research: Variasi Aksen Bahasa Indonesia Sultra',
                'Lexicography: Pengembangan Kamus Bahasa Tolaki Modern',
                'Discourse Analysis: Wacana Politik dalam Media Lokal',
                'Computational Linguistics: AI untuk Pengenalan Aksen Daerah'
            ]
        ];

        $category = array_rand($templates);
        $templateList = $templates[$category];
        $template = $templateList[array_rand($templateList)];

        return str_replace('{year}', 2025, $template);
    }

    private function generateSlugBerita($index): string
    {
        $baseSlug = 'berita-balai-bahasa-sulawesi-tenggara-' . $index;
        $uniqueSuffix = rand(1000, 9999);
        return $baseSlug . '-' . $uniqueSuffix;
    }
}