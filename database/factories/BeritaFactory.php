<?php

namespace Database\Factories;

use App\Models\Berita;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Carbon\Carbon;

class BeritaFactory extends Factory
{
    protected $model = Berita::class;

    public function definition(): array
    {
        $judulTemplates = [
            'Balai Bahasa Sultra Raih Penghargaan ZI WBK Tahun 2025',
            'Kemenpan RB Berikan Apresiasi kepada Balai Bahasa Sulawesi Tenggara',
            'Terobosan Baru: Balai Bahasa Sultra Jadi Role Model Reformasi Birokrasi',
            'Workshop Penulisan Kreatif: Tingkatkan Literasi di Kalangan Pelajar',
            'Seminar Bahasa Indonesia: Menyongsong Era Society 5.0',
            'Peluncuran Kamus Dialek Sulawesi Tenggara',
            'Festival Bahasa Daerah: Pelestarian Warisan Linguistik',
            'Aplikasi "Kamusku": Kamus Digital Bahasa Daerah Sultra',
            'Platform "CerdasBahasa": AI untuk Pembelajaran Bahasa',
            'Layanan Uji Kompetensi Bahasa: Standar Baru 2025'
        ];

        $lokasiRilis = [
            'Kendari', 'Jakarta', 'Surabaya', 'Makassar', 'Manado',
            'Palu', 'Kendari', 'Bau-Bau', 'Raha', 'Wakatobi'
        ];

        $pejabatData = [
            ['nama' => 'Dr. Budi Santoso, M.Hum.', 'jabatan' => 'Kepala Balai Bahasa Sulawesi Tenggara'],
            ['nama' => 'Prof. Dr. Siti Aminah, M.Pd.', 'jabatan' => 'Sekretaris Balai Bahasa Sulawesi Tenggara'],
            ['nama' => 'Ir. Ahmad Fauzi, M.Si.', 'jabatan' => 'Kepala Subbagian Tata Usaha'],
            ['nama' => 'Dra. Ratna Sari, M.Ed.', 'jabatan' => 'Kepala Bidang Pembinaan Bahasa dan Sastra'],
            ['nama' => 'Dr. Hendra Wijaya, M.Ling.', 'jabatan' => 'Kepala Bidang Pengembangan Bahasa']
        ];

        $judul = $this->faker->randomElement($judulTemplates);
        $pejabat = $this->faker->randomElement($pejabatData);
        $lokasi = $this->faker->randomElement($lokasiRilis);

        return [
            'judul_utama' => $judul,
            'slug' => Str::slug($judul) . '-' . $this->faker->unique()->randomNumber(4),
            'ringkasan_inti' => 'Balai Bahasa Provinsi Sulawesi Tenggara kembali menunjukkan komitmennya dalam mewujudkan tata kelola pemerintahan yang bersih dan berintegritas melalui pencapaian predikat Wilayah Bebas dari Korupsi (WBK) dari Kementerian Pendayagunaan Aparatur Negara dan Reformasi Birokrasi.',
            'konten' => $this->generateKontenLengkap($pejabat, $lokasi),
            'hero_image' => 'images/berita/hero-' . $this->faker->numberBetween(1, 20) . '.jpg',
            'hero_image_alt' => 'Hero image ' . $judul,
            'lokasi' => $lokasi,
            'tanggal_rilis' => $this->faker->dateTimeBetween('-6 months', 'now'),
            'teras_berita' => $this->generateLeadParagraph(),
            'konteks_latar_belakang' => $this->generateKonteksLatar(),
            'quote_pejabat_utama' => $this->generateQuotePejabat(),
            'nama_pejabat' => $pejabat['nama'],
            'jabatan_pejabat' => $pejabat['jabatan'],
            'data_capaian_kinerja' => $this->generateDataCapaian(),
            'mekanisme_penilaian' => $this->generateMekanismePenilaian(),
            'kesimpulan_komitmen' => $this->generateKesimpulan(),
            'kategori' => $this->faker->randomElement(['prestasi', 'kegiatan', 'kerjasama', 'inovasi', 'layanan']),
            'tag' => implode(', ', $this->faker->randomElements(['ZI WBK', 'Reformasi Birokrasi', 'Integritas', 'Inovasi', 'Layanan Publik', 'Balai Bahasa', 'Sulawesi Tenggara'], 3)),
            'is_published' => true,
            'is_featured' => $this->faker->boolean(20),
            'view_count' => $this->faker->numberBetween(100, 5000),
            'author' => $this->faker->name(),
            'biro' => 'Biro Komunikasi dan Layanan Informasi',
            'sumber_rilis' => 'Balai Bahasa Provinsi Sulawesi Tenggara',
            'lokasi_rilis' => $lokasi,
            'published_at' => $this->faker->dateTimeBetween('-6 months', 'now'),
        ];
    }

    private function generateKontenLengkap($pejabat, $lokasi): string
    {
        $templates = [
            "Balai Bahasa Provinsi Sulawesi Tenggara kembali menunjukkan komitmennya dalam mewujudkan tata kelola pemerintahan yang bersih dan berintegritas. Pada tahun 2025, lembaga ini berhasil meraih predikat Wilayah Bebas dari Korupsi (WBK) dari Kementerian Pendayagunaan Aparatur Negara dan Reformasi Birokrasi.

Pencapaian ini merupakan bukti nyata dari implementasi reformasi birokrasi yang konsisten dan berkelanjutan di lingkungan Balai Bahasa Sulawesi Tenggara. Melalui berbagai inovasi dan perbaikan sistem, kami terus berupaya meningkatkan kualitas pelayanan publik yang transparan dan akuntabel.

Menurut {$pejabat['nama']}, 'Penghargaan ini bukanlah akhir dari perjuangan, melainkan awal dari komitmen yang lebih kuat untuk terus meningkatkan integritas dan kualitas pelayanan kami kepada masyarakat.'

Dengan pencapaian ini, Balai Bahasa Sulawesi Tenggara siap menjadi contoh bagi unit kerja lainnya dalam implementasi tata kelola pemerintahan yang baik dan bersih.",

            "Sebagai implementasi dari program Reformasi Birokrasi, Balai Bahasa Provinsi Sulawesi Tenggara telah melakukan berbagai inovasi dalam layanan kebahasaan. Salah satu terobosan terbaru adalah layanan uji kompetensi bahasa secara daring yang telah diakses oleh lebih dari 10.000 pengguna sepanjang tahun 2025.

Inovasi ini sejalan dengan transformasi digital yang digalakkan pemerintah pusat untuk meningkatkan efisiensi dan efektivitas layanan publik. Masyarakat kini dapat mengakses berbagai layanan Balai Bahasa tanpa harus datang langsung ke kantor.

{$pejabat['nama']} menyatakan, 'Digitalisasi bukan sekadar trend, melainkan kebutuhan yang harus kami penuhi untuk memberikan pelayanan terbaik bagi masyarakat luas, terutama di era society 5.0.'

Ke depan, Balai Bahasa Sulawesi Tenggara akan terus mengembangkan berbagai inovasi digital untuk mendukung program pemerintah dalam melestarikan dan mengembangkan bahasa Indonesia serta bahasa daerah di wilayah Sulawesi Tenggara."
        ];

        return $this->faker->randomElement($templates);
    }

    private function generateLeadParagraph(): string
    {
        $leads = [
            'Balai Bahasa Provinsi Sulawesi Tenggara kembali menunjukkan komitmennya dalam mewujudkan tata kelola pemerintahan yang bersih dan berintegritas melalui pencapaian predikat Wilayah Bebas dari Korupsi (WBK) dari Kementerian Pendayagunaan Aparatur Negara dan Reformasi Birokrasi.',
            'Dalam rangka meningkatkan kualitas pelayanan publik, Balai Bahasa Provinsi Sulawesi Tenggara meluncurkan berbagai inovasi digital untuk mendukung program kebahasaan di era modern.',
            'Menyongsong tantangan globalisasi, Balai Bahasa Provinsi Sulawesi Tenggara terus berinovasi dalam melestarikan dan mengembangkan bahasa Indonesia serta bahasa daerah melalui berbagai program unggulan.',
            'Sebagai bentuk komitmen terhadap reformasi birokrasi, Balai Bahasa Provinsi Sulawesi Tenggara berhasil meraih predikat Wilayah Bebas dari Korupsi (WBK) untuk kedua kalinya secara berturut-turut.'
        ];

        return $this->faker->randomElement($leads);
    }

    private function generateKonteksLatar(): string
    {
        return "Pencapaian ini merupakan bagian dari implementasi Reformasi Birokrasi yang telah digalakkan sejak tahun 2020. Melalui program Zona Integritas, Balai Bahasa Sulawesi Tenggara secara konsisten melakukan perbaikan dalam enam area perubahan, yaitu: manajemen perubahan, penataan tatalaksana, penataan sistem manajemen SDM, penguatan pengawasan, penguatan akuntabilitas, dan peningkatan kualitas pelayanan publik.";
    }

    private function generateQuotePejabat(): string
    {
        $quotes = [
            "Penghargaan ZI WBK ini bukan sekadar prestasi, melainkan komitmen moral kami untuk memberikan pelayanan terbaik kepada masyarakat dengan tetap menjunjung tinggi integritas dan transparansi.",
            "Integritas adalah fondasi dari kepercayaan publik. Tanpa integritas, reformasi birokrasi hanya akan menjadi slogan tanpa makna. Kami berkomitmen untuk menjadikan Balai Bahasa Sulawesi Tenggara sebagai teladan dalam tata kelola pemerintahan yang baik.",
            "Transformasi digital bukanlah pilihan, melainkan keharusan. Kami harus beradaptasi dan berinovasi untuk tetap relevan dan memberikan nilai tambah bagi masyarakat yang kami layani.",
            "Bahasa adalah identitas bangsa. Melalui berbagai program kebahasaan, kami terus berupaya melestarikan warisan linguistik kita sambil mempersiapkan generasi muda menghadapi tantangan global."
        ];

        return $this->faker->randomElement($quotes);
    }

    private function generateDataCapaian(): string
    {
        $capaian = [
            "Tahun 2025, Balai Bahasa Sulawesi Tenggara telah berhasil:\n- Melayani 15.000 pengguna layanan bahasa\n- Melaksanakan 250 kegiatan pelatihan dan workshop\n- Menerbitkan 50 karya tulis ilmiah\n- Menjalin kerja sama dengan 20 institusi\n- Mencapai indeks kepuasan masyarakat 4.6 dari 5.0\n- Mengurangi waktu layanan dari 7 hari menjadi 2 hari kerja",
            "Capaian kinerja tahun 2025 menunjukkan peningkatan signifikan:\n- Penyederhanaan birokrasi dari 8 alur menjadi 4 alur layanan\n- Implementasi sistem pengaduan online dengan response time 24 jam\n- Digitalisasi 90% layanan administratif\n- Peningkatan kompetensi SDM dengan 15 program sertifikasi\n- Penghematan anggaran sebesar 23% melalui efisiensi proses"
        ];

        return $this->faker->randomElement($capaian);
    }

    private function generateMekanismePenilaian(): string
    {
        return "Penilaian ZI WBK dilakukan melalui beberapa tahap:\n1. Evaluasi dokumen reformasi birokrasi\n2. Penilaian lapangan oleh tim dari Kemenpan RB\n3. Survei kepuasan masyarakat\n4. Penilaian akuntabilitas kinerja\n5. Validasi implementasi sistem pengendalian internal\n\nSetiap tahapan dinilai dengan metodologi yang obyektif dan transparan untuk memastikan kualitas dan konsistensi implementasi Zona Integritas.";
    }

    private function generateKesimpulan(): string
    {
        return "Pencapaian predikat WBK merupakan langkah awal dalam perjalanan panjang mewujudkan tata kelola pemerintahan yang bersih dan berintegritas. Balai Bahasa Sulawesi Tenggara akan terus berkomitmen untuk:\n- Menjaga dan meningkatkan kualitas layanan publik\n- Memperkuat kultur integritas di seluruh lini organisasi\n- Berinovasi dalam program dan layanan kebahasaan\n- Menjadi role model bagi unit kerja lainnya\n\nTransformasi ini bukanlah tujuan akhir, melainkan proses berkelanjutan untuk terus memberikan yang terbaik bagi bangsa dan negara.";
    }
}