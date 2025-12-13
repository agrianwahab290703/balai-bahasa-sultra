<?php

namespace Database\Seeders;

use App\Models\Ssd;
use Illuminate\Database\Seeder;

class SsdSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ssds = [
            // Kategori Umum
            [
                'question' => 'Apa itu Balai Bahasa Sulawesi Tenggara?',
                'answer' => 'Balai Bahasa Sulawesi Tenggara adalah Unit Pelaksana Teknis (UPT) Badan Pengembangan dan Pembinaan Bahasa, Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi yang bertugas melaksanakan pengembangan, pembinaan, dan pelindungan bahasa dan sastra Indonesia dan daerah di wilayah Sulawesi Tenggara.',
                'category' => 'umum',
                'sort_order' => 1,
            ],
            [
                'question' => 'Di mana lokasi Balai Bahasa Sulawesi Tenggara?',
                'answer' => 'Balai Bahasa Sulawesi Tenggara berlokasi di Jl. Haluoleo, Kompleks Bumi Praja, Anduonohu, Kec. Kambu, Kota Kendari, Sulawesi Tenggara 93232.',
                'category' => 'umum',
                'sort_order' => 2,
            ],
            [
                'question' => 'Apa saja jam operasional Balai Bahasa Sulawesi Tenggara?',
                'answer' => "Jam operasional Balai Bahasa Sulawesi Tenggara:\n- Senin - Kamis: 08.00 - 16.00 WITA\n- Jumat: 08.00 - 16.30 WITA\n- Sabtu - Minggu: Libur",
                'category' => 'umum',
                'sort_order' => 3,
            ],
            [
                'question' => 'Bagaimana cara menghubungi Balai Bahasa Sulawesi Tenggara?',
                'answer' => "Anda dapat menghubungi kami melalui:\n- Telepon: (0401) 3195151\n- Email: balaibahasa.sultra@kemdikbud.go.id\n- Website: https://balaibahasa-sultra.kemdikbud.go.id\n- Media Sosial: Instagram @balaibahasa.sultra",
                'category' => 'umum',
                'sort_order' => 4,
            ],

            // Kategori Layanan
            [
                'question' => 'Apa saja layanan yang tersedia di Balai Bahasa Sulawesi Tenggara?',
                'answer' => "Layanan yang tersedia meliputi:\n1. Konsultasi Kebahasaan dan Kesastraan\n2. Penyuntingan Naskah\n3. Penerjemahan\n4. Uji Kemahiran Berbahasa Indonesia (UKBI)\n5. Pendampingan BIPA (Bahasa Indonesia bagi Penutur Asing)\n6. Fasilitasi Kegiatan Kebahasaan dan Kesastraan",
                'category' => 'layanan',
                'sort_order' => 5,
            ],
            [
                'question' => 'Apakah layanan di Balai Bahasa Sulawesi Tenggara berbayar?',
                'answer' => 'Sebagian besar layanan yang disediakan Balai Bahasa Sulawesi Tenggara bersifat gratis untuk masyarakat umum. Namun, beberapa layanan seperti UKBI memiliki biaya sesuai dengan ketentuan yang berlaku.',
                'category' => 'layanan',
                'sort_order' => 6,
            ],
            [
                'question' => 'Bagaimana cara mengajukan konsultasi kebahasaan?',
                'answer' => "Untuk mengajukan konsultasi kebahasaan, Anda dapat:\n1. Datang langsung ke kantor Balai Bahasa Sulawesi Tenggara\n2. Menghubungi melalui telepon atau email\n3. Mengisi formulir konsultasi online di website kami\n\nKonsultasi dapat dilakukan secara tatap muka atau daring sesuai kebutuhan.",
                'category' => 'layanan',
                'sort_order' => 7,
            ],
            [
                'question' => 'Apa itu UKBI dan bagaimana cara mengikutinya?',
                'answer' => "UKBI (Uji Kemahiran Berbahasa Indonesia) adalah tes untuk mengukur kemahiran seseorang dalam berbahasa Indonesia. Untuk mengikuti UKBI:\n1. Daftar melalui website resmi UKBI\n2. Pilih jadwal dan lokasi tes\n3. Lakukan pembayaran sesuai ketentuan\n4. Datang pada jadwal yang ditentukan dengan membawa identitas\n\nHasil UKBI dapat digunakan untuk berbagai keperluan seperti syarat beasiswa, pekerjaan, atau pengajuan kewarganegaraan.",
                'category' => 'layanan',
                'sort_order' => 8,
            ],

            // Kategori PPID
            [
                'question' => 'Apa itu PPID?',
                'answer' => 'PPID (Pejabat Pengelola Informasi dan Dokumentasi) adalah pejabat yang bertanggung jawab dalam bidang penyimpanan, pendokumentasian, penyediaan, dan/atau pelayanan informasi di Balai Bahasa Sulawesi Tenggara sesuai dengan Undang-Undang Keterbukaan Informasi Publik.',
                'category' => 'ppid',
                'sort_order' => 9,
            ],
            [
                'question' => 'Bagaimana cara mengajukan permohonan informasi publik?',
                'answer' => "Untuk mengajukan permohonan informasi publik:\n1. Kunjungi halaman PPID di website kami\n2. Pilih menu \"Permohonan Informasi Publik\"\n3. Isi formulir permohonan dengan lengkap\n4. Lampirkan dokumen identitas yang diperlukan\n5. Kirim permohonan\n\nPermohonan akan diproses dalam waktu maksimal 10 hari kerja.",
                'category' => 'ppid',
                'sort_order' => 10,
            ],
            [
                'question' => 'Apa saja informasi yang dapat dimohonkan?',
                'answer' => "Informasi yang dapat dimohonkan meliputi:\n1. Informasi Berkala: profil, program kerja, laporan tahunan\n2. Informasi Setiap Saat: peraturan, SOP, hasil penelitian\n3. Informasi Serta Merta: informasi yang dapat mengancam hajat hidup orang banyak\n\nKecuali informasi yang dikecualikan sesuai UU KIP.",
                'category' => 'ppid',
                'sort_order' => 11,
            ],

            // Kategori Teknis
            [
                'question' => 'Bagaimana cara mengunduh dokumen dari website?',
                'answer' => "Untuk mengunduh dokumen:\n1. Navigasi ke halaman yang berisi dokumen\n2. Klik tombol \"Unduh\" atau ikon download pada dokumen yang diinginkan\n3. Dokumen akan otomatis terunduh ke perangkat Anda\n\nPastikan koneksi internet stabil untuk mengunduh dokumen berukuran besar.",
                'category' => 'teknis',
                'sort_order' => 12,
            ],
            [
                'question' => 'Website tidak dapat diakses, apa yang harus dilakukan?',
                'answer' => "Jika website tidak dapat diakses:\n1. Periksa koneksi internet Anda\n2. Coba refresh halaman atau bersihkan cache browser\n3. Gunakan browser lain\n4. Jika masih bermasalah, hubungi kami melalui email atau telepon\n\nKami berusaha menjaga website tetap online 24/7.",
                'category' => 'teknis',
                'sort_order' => 13,
            ],
            [
                'question' => 'Bagaimana cara melaporkan masalah atau bug pada website?',
                'answer' => "Untuk melaporkan masalah pada website:\n1. Kirim email ke balaibahasa.sultra@kemdikbud.go.id\n2. Sertakan deskripsi masalah yang jelas\n3. Lampirkan screenshot jika memungkinkan\n4. Sebutkan browser dan perangkat yang digunakan\n\nTim IT kami akan merespons dalam 1-2 hari kerja.",
                'category' => 'teknis',
                'sort_order' => 14,
            ],
        ];

        foreach ($ssds as $ssd) {
            Ssd::create($ssd);
        }
    }
}
