<?php

namespace Database\Seeders;

use App\Models\PpidContent;
use App\Models\PpidTeamMember;
use App\Models\PpidDocument;
use Illuminate\Database\Seeder;

class PpidSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // PPID Profile Content
        PpidContent::create([
            'title' => 'Profil PPID',
            'content' => 'Balai Bahasa Provinsi Sulawesi Tenggara adalah unit pelaksana teknis (UPT) di bawah Kementerian Pendidikan Dasar dan Menengah yang berada di bawah pengawasan Badan Pengembangan dan Pembinaan Bahasa. Sesuai dengan Peraturan Menteri Pendidikan Dasar dan Menengah Nomor 1 Tahun 2024 tentang Organisasi dan Tata Kerja Kementerian Kebudayaan, tugas Badan Pengembangan dan Pembinaan Bahasa, yaitu menyelenggarakan pengembangan, pembinaan, dan pelindungan bahasa dan sastra.',
            'type' => 'profile',
            'order' => 1,
            'is_active' => true,
        ]);

        // Legal Basis
        PpidContent::create([
            'title' => 'Dasar Hukum',
            'content' => 'Tim Pengelola Informasi dan Dokumentasi (PPID) Balai Bahasa Provinsi Sulawesi Tenggara dibentuk sebagai implementasi Undang-Undang Nomor 14 Tahun 2008 tentang Keterbukaan Informasi Publik.',
            'type' => 'legal_basis',
            'order' => 1,
            'is_active' => true,
        ]);

        // Principles of Public Information Disclosure
        $principles = [
            'Pelayanan diberikan secara cepat, tepat waktu, dan biaya yang proporsional.',
            'Prosedur pelayanan mudah dan sederhana.',
            'Pengecualian informasi publik bersifat ketat dan terbatas.',
            'Badan publik wajib membenahi sistem dokumentasi dan pelayanan informasi.',
        ];

        foreach ($principles as $index => $principle) {
            PpidContent::create([
                'title' => 'Prinsip ' . ($index + 1),
                'content' => $principle,
                'type' => 'principle',
                'order' => $index + 1,
                'is_active' => true,
            ]);
        }

        // Tasks and Functions
        $tasks = [
            ['Tugas dan Fungsi PPID sesuai dengan Permendikbud 41 Tahun 2020:', ''],
            ['penyediaan, penyimpanan, pendokumentasian, dan pengamanan Informasi;', '01.'],
            ['pelayanan Informasi sesuai dengan aturan yang berlaku;', '02.'],
            ['pelayanan Informasi Publik yang cepat, tepat, dan sederhana;', '03.'],
            ['penetapan prosedur operasional penyebarluasan Informasi Publik;', '04.'],
            ['pengujian Konsekuensi;', '05.'],
            ['pengklasifikasian Informasi dan/atau pengubahannya;', '06.'],
            ['penetapan Informasi Publik yang Dikecualikan yang telah habis jangka waktu pengecualiannya sebagai Informasi Publik yang dapat diakses;', '07.'],
            ['penetapan pertimbangan tertulis atas setiap kebijakan yang diambil untuk memenuhi hak setiap orang atas Informasi Publik;', '08.'],
            ['menyelesaikan sengketa Informasi Publik unit organisasi atau unit kerja yang bersangkutan;', '09.'],
            ['melakukan evaluasi terhadap PPID di unit organisasi atau unit kerja yang bersangkutan.', '10.'],
        ];

        foreach ($tasks as $index => $task) {
            if ($index === 0) {
                PpidContent::create([
                    'title' => $task[0],
                    'content' => '',
                    'type' => 'task_function',
                    'order' => $index + 1,
                    'is_active' => true,
                ]);
            } else {
                PpidContent::create([
                    'title' => $task[0],
                    'content' => $task[0],
                    'type' => 'task_function',
                    'order' => $index + 1,
                    'is_active' => true,
                ]);
            }
        }

        // Address
        PpidContent::create([
            'title' => 'Alamat',
            'content' => 'Jalan Haluoleo, Kompleks Bumi Praja Anduonohu, Kota Kendari, Sulawesi Tenggara',
            'type' => 'address',
            'order' => 1,
            'is_active' => true,
        ]);

        // Team Members
        PpidTeamMember::create([
            'name' => 'Dewi Pridayanti, S.Sos., M.Adm.SDA',
            'position' => 'Kepala Balai Provinsi Sulawesi Tenggara',
            'role' => 'ketua',
            'order' => 1,
            'is_active' => true,
        ]);

        $anggota = [
            'Abdul Razak, S.E., M.M.',
            'Cahyo Waskito Pur Antomo, S.S.',
            'I Made Ngurah Rai Febrianto, S.ST.',
            'Rahim Jamal, S.Kom.',
            'Febriyani Rahayu, S.S.',
            'Muhammad Jihad, S.Pd.',
        ];

        foreach ($anggota as $index => $name) {
            PpidTeamMember::create([
                'name' => $name,
                'position' => 'Anggota PPID',
                'role' => 'anggota',
                'order' => $index + 2,
                'is_active' => true,
            ]);
        }
    }
}
