<?php

namespace Database\Seeders;

use App\Models\ProfileContent;
use Illuminate\Database\Seeder;

class ProfileContentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing profile content to avoid duplicates
        ProfileContent::truncate();
        
        // Sejarah (History) content - split into sections for better presentation
        $sejarahSections = [
            [
                'type' => 'sejarah',
                'title' => 'Awal Mula Pendirian',
                'content' => 'Kantor Bahasa Provinsi Sulawesi Tenggara diresmikan operasionalnya pada 5 Juni 2004 oleh Wakil Gubernur Sulawesi Tenggara, Drs. H. Yusran Silondae, M.Si. Keberadaan kantor bahasa di Provinsi Sulawesi Tenggara merupakan tindak lanjut dari MoU (memorandum of understanding) yang ditandatangani oleh Gubernur Sulawesi Tenggara, Ali Mazi, S.H. dan Kepala Pusat Bahasa, Dr. Dendy Sugono, pada Senin, 17 Februari 2003.

Pada awalnya, pembentukan Kantor Bahasa Provinsi Sulawesi Tenggara dipelopori oleh HPBI Sultra pada tahun 1997. Usulan pembentukan kantor bahasa kemudian dikoordinasikan dengan Bapak Zalili Sailan sebagai Dekan FKIP UHO dan Koordinator Pembina Bahasa Indonesia Sulawesi Tenggara. Tahun 1999, proposal yang diajukan mengenai pendirian kantor bahasa mendapat respons positif dari Kepala Pusat Bahasa, Dr. Hasan Alwi.',
                'images' => ['/images/sejarah1.jpg'],
                'metadata' => ['year' => 2004, 'highlight' => 'Diresmikan 5 Juni 2004'],
                'order' => 1,
            ],
            [
                'type' => 'sejarah',
                'title' => 'Persetujuan dan Pembangunan',
                'content' => 'Tahun 2001 pembentukan Kantor Bahasa Provinsi Sulawesi Tenggara mendapat persetujuan dari Pusat Bahasa dan selanjutnya dilakukan pembenahan staf administrasi, termasuk penunjukan kepala kantor. Kantor Bahasa Provinsi Sulawesi Tenggara sebagai unit pelaksana teknis (UPT) Pusat Bahasa (sekarang Badan Pengembangan dan Pembinaan Bahasa) di Provinsi Sulawesi Tenggara menjadi salah satu sarana Badan Bahasa untuk mengimplementasikan visi dan misi di bidang kebahasaan dan kesastraan Indonesia dan daerah.

Dalam MoU yang ditandatangani bersama oleh Gubernur Sulawesi Tenggara dan Kepala Pusat Bahasa dinyatakan bahwa pemerintah daerah telah membantu menyediakan fasilitas tanah seluas 10.000 meter persegi untuk pembangunan gedung kantor bahasa di Kompleks Bumi Praja, Anduonohu, Kendari.',
                'images' => null,
                'metadata' => ['year' => 2001, 'highlight' => 'Luas tanah 10.000 m²'],
                'order' => 2,
            ],
            [
                'type' => 'sejarah',
                'title' => 'Perkembangan Organisasi',
                'content' => 'Operasional awal Kantor Bahasa Prov. Sulawesi Tenggara dibantu oleh staf (tenaga honorer) sebanyak tiga orang. Pada tahun 2004, staf kantor bahasa bertambah menjadi tujuh belas orang. Selanjutnya, pada 2010 jumlah staf bertambah hingga 33 orang.

Pada tahun 2004—2006 pelaksana harian Kepala Kantor Bahasa Provinsi Sulawesi Tenggara adalah Dra. Dad Murniah, M.Hum., semula bekerja sebagai staf peneliti dan pembantu pimpinan di Pusat Bahasa, Jakarta. Kemudian, periode 2006—2009 Kepala Kantor Bahasa Prov. Sultra dijabat oleh Drs. Haruddin, M.Hum. Tahun 2009—2013, Kantor Bahasa Prov. Sulawesi Tenggara dipimpin oleh Prof. Dr. Hanna, M.Pd. yang berasal dari Universitas Haluoleo, Kendari.

Setelah Pak Hanna menjabat sebagai Kepala LPMP Sulawesi Tenggara, kantor bahasa dipimpin oleh pelaksana tugas (plt.) Kepala Kantor Bahasa Prov. Sultra, H. Muhammad Nasir, S.H., M.M. Tahun 2016—2020, kantor bahasa dipimpin oleh Dr. Sandra Safitri Hanan, M.A. Setelah Ibu Sandra menjabat sebagai Kepala Balai Bahasa Prov. Sulawesi Tengah, pada pertengahan tahun 2020—Mei 2022, Kepala Kantor Bahasa Prov. Sultra dijabat oleh Dr. Herawati, S.S., M.A. Sejak pertengahan tahun 2022 hingga sekarang, Kepala Kantor Bahasa Prov. Sultra dijabat oleh Dr. Uniawati, S.Pd., M.Hum.',
                'images' => null,
                'metadata' => [
                    'leaders' => [
                        ['name' => 'Dra. Dad Murniah, M.Hum.', 'period' => '2004-2006'],
                        ['name' => 'Drs. Haruddin, M.Hum.', 'period' => '2006-2009'],
                        ['name' => 'Prof. Dr. Hanna, M.Pd.', 'period' => '2009-2013'],
                        ['name' => 'H. Muhammad Nasir, S.H., M.M.', 'period' => '2013-2016 (Plt.)'],
                        ['name' => 'Dr. Sandra Safitri Hanan, M.A.', 'period' => '2016-2020'],
                        ['name' => 'Dr. Herawati, S.S., M.A.', 'period' => '2020-2022'],
                        ['name' => 'Dr. Uniawati, S.Pd., M.Hum.', 'period' => '2022-sekarang'],
                    ]
                ],
                'order' => 3,
            ],
            [
                'type' => 'sejarah',
                'title' => 'Perjalanan Lokasi Kantor',
                'content' => 'Awalnya, Kantor Bahasa Provinsi Sulawesi Tenggara berlokasi di salah satu gedung perlengkapan Dinas Informasi dan Komunikasi Sultra yang saat itu menjadi ruang Satpol PP, tepatnya di Anduonohu. Lokasi tersebut diperoleh atas bantuan pemerintah daerah melalui Kepala Dinas Pendidikan Nasional Provinsi Sulawesi Tenggara.

Namun, karena kondisi ruangan yang dianggap kurang memadai, Kantor Bahasa Prov. Sultra akhirnya dipindahkan ke Kompleks Taman Budaya, Jalan Saranani, Nomor 193, Kendari. Sejak awal 2007, Kantor Bahasa Prov. Sulawesi Tenggara pindah ke Kompleks Bumi Praja, Anduonohu, Kendari.

Tahun 2008, pembangunan gedung Kantor Bahasa Prov. Sultra telah rampung dan dapat difungsikan. Pada tahun yang sama, gedung Kantor Bahasa Prov. Sultra diresmikan oleh Gubernur Provinsi Sulawesi Tenggara, H. Nur Alam, S.E.',
                'images' => ['/images/sejarah2.jpeg'],
                'metadata' => ['year' => 2008, 'highlight' => 'Gedung diresmikan tahun 2008'],
                'order' => 4,
            ],
        ];

        foreach ($sejarahSections as $section) {
            ProfileContent::create($section);
        }

        // Kedudukan (Position/Status) content
        $kedudukanSections = [
            [
                'type' => 'kedudukan',
                'title' => 'Kedudukan Kantor Bahasa',
                'content' => 'Kantor Bahasa Provinsi Sulawesi Tenggara merupakan unit pelaksana teknis (UPT) di bawah Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi dan bertanggung jawab kepada Kepala Badan Pengembangan dan Pembinaan Bahasa. Kantor Bahasa Provinsi Sulawesi Tenggara dipimpin oleh Kepala. Sesuai dengan Permendikbud Nomor 12 Tahun 2022 tentang Organisasi dan Tata Kerja Balai Bahasa dan Kantor Bahasa, Kantor Bahasa Provinsi Sulawesi Tenggara mempunyai tugas melaksanakan pelindungan dan pemasyarakatan bahasa dan sastra Indonesia di wilayah Sulawesi Tenggara.',
                'images' => null,
                'metadata' => [
                    'regulation' => 'Permendikbud Nomor 12 Tahun 2022',
                    'parent_org' => 'Badan Pengembangan dan Pembinaan Bahasa'
                ],
                'order' => 1,
            ],
            [
                'type' => 'kedudukan',
                'title' => 'Fungsi',
                'content' => 'Dalam melaksanakan tugas sebagaimana dimaksud, Kantor Bahasa Provinsi Sulawesi Tenggara menyelenggarakan fungsi:',
                'images' => null,
                'metadata' => [
                    'functions' => [
                        'Pelaksanaan pemetaan bahasa dan sastra daerah',
                        'Pelaksanaan inventarisasi kosakata dan karya sastra',
                        'Pelaksanaan konservasi dan revitalisasi bahasa dan sastra daerah',
                        'Pelaksanaan pemasyarakatan bahasa Indonesia',
                        'Pelaksanaan fasilitasi pelindungan dan pemasyarakatan bahasa dan sastra daerah',
                        'Pemberian layanan kebahasaan dan kesastraan',
                        'Pelaksanaan kemitraan di bidang kebahasaan dan kesastraan',
                        'Pelaksanaan pemantauan dan evaluasi di bidang kebahasaan dan kesastraan',
                        'Pelaksanaan urusan administrasi',
                    ]
                ],
                'order' => 2,
            ],
        ];

        foreach ($kedudukanSections as $section) {
            ProfileContent::create($section);
        }

        // Visi dan Misi content
        $visiMisiSections = [
            [
                'type' => 'visi-misi',
                'title' => 'Visi',
                'content' => 'Visi Kantor Bahasa Provinsi Sulawesi Tenggara tahun 2020—2024 mengacu pada visi Badan Pengembangan dan Pembinaan Bahasa dan visi Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi. Visi tersebut dirumuskan sebagai berikut.',
                'images' => null,
                'metadata' => [
                    'period' => '2020-2024',
                    'icon' => 'target',
                    'quote' => 'Mewujudkan Indonesia maju yang berdaulat, mandiri, dan berkepribadian berlandaskan gotong royong melalui terciptanya pelajar pancasila yang beriman, bertakwa kepada Tuhan YME, dan berakhlak mulia, berkebinekaan global, bergotong royong, mandiri, bernalar kritis, dan kreatif dengan bahasa dan sastra.',
                    'description' => 'Dari rumusan visi di atas, Indonesia maju terwujud ketika bangsa Indonesia berdaulat, mandiri, dan berkepribadian dengan tetap berpijak pada semangat gotong royong. Hal itu diejawantahkan dalam bidang kebahasaan dan kesastraan untuk membentuk sumber daya manusia Indonesia yang berdaulat, mandiri, dan berkepribadian melalui pengembangan, pembinaan, dan pelindungan bahasa dan sastra serta peningkatan fungsi bahasa Indonesia menjadi bahasa internasional.'
                ],
                'order' => 1,
            ],
            [
                'type' => 'visi-misi',
                'title' => 'Misi',
                'content' => 'Dalam rangka pencapaian visi dan misi Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi dalam Mewujudkan Pelestarian dan Pemajuan Kebudayaan serta Pengembangan Bahasa dan Sastra, serta mengacu pada misi Badan Pengembangan dan Pembinaan Bahasa. Kantor Bahasa Provinsi Sulawesi Tenggara memiliki misi sebagai berikut.',
                'images' => null,
                'metadata' => [
                    'missions' => [
                        'Mewujudkan literasi kebahasaan dan kesastraan serta pengarusutamaan bahasa dan sastra dalam pendidikan.',
                        'Mewujudkan fungsi bahasa Indonesia menjadi bahasa internasional.',
                        'Mewujudkan kelestarian bahasa daerah.',
                        'Mengoptimalkan tata kelola Kantor Bahasa Provinsi Sulawesi Tenggara yang partisipatif, transparan, dan akuntabel.'
                    ],
                    'icon' => 'flag'
                ],
                'order' => 2,
            ],
        ];

        foreach ($visiMisiSections as $section) {
            ProfileContent::create($section);
        }
    }
}
