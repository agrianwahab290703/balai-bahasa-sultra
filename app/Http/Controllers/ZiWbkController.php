<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class ZiWbkController extends Controller
{
    // Main ZI-WBK index page
    public function index()
    {
        return Inertia::render('Public/ZiWbk/Index');
    }

    // Manajemen Perubahan section
    public function manajemenPerubahan()
    {
        return Inertia::render('Public/ZiWbk/ManajemenPerubahan/Index');
    }

    public function timKerja()
    {
        return Inertia::render('Public/ZiWbk/ManajemenPerubahan/TimKerja', [
            'documents' => [
                [
                    'id' => 1,
                    'title' => 'Unit kerja telah membentuk tim untuk melakukan pembangunan zona integritas',
                    'description' => 'Dokumen pembentukan tim zona integritas',
                    'folderId' => '1ENxhltfO0q-fDe7gF6PlmKy38ZWz6VDw',
                ],
                [
                    'id' => 2,
                    'title' => 'Penentuan anggota tim dipilih melalui prosedur/mekanisme yang jelas',
                    'description' => 'Dokumen prosedur pemilihan anggota tim',
                    'folderId' => '1F_C-_EBGnnVNp_FxSZZSHpUI3QM7xQ6a',
                ],
            ],
        ]);
    }

    public function rencanaPembangunan()
    {
        return Inertia::render('Public/ZiWbk/ManajemenPerubahan/RencanaPembangunan', [
            'documents' => [
                [
                    'id' => 1,
                    'title' => 'Terdapat dokumen rencana kerja pembangunan Zona Integritas menuju WBK/WBBM',
                    'description' => 'Dokumen rencana kerja pembangunan ZI',
                    'folderId' => '1HAjT3EL5ARUSMk3BSPh6gK9FYEcggvv1',
                ],
                [
                    'id' => 2,
                    'title' => 'Dalam dokumen pembangunan terdapat target-target prioritas yang relevan dengan tujuan pembangunan WBK/WBBM',
                    'description' => 'Dokumen target prioritas pembangunan',
                    'folderId' => '1xWZty4IEqi4WH3ZIOH4m3oPMR3b_-rL1',
                ],
                [
                    'id' => 3,
                    'title' => 'Terdapat mekanisme atau media untuk mensosialisasikan pembangunan WBK/WBBM',
                    'description' => 'Dokumen mekanisme sosialisasi',
                    'folderId' => '1u-qRTYmv5Z8jmoui_BI8RhMSerfM7_q1',
                ],
            ],
        ]);
    }

    public function pemantauanEvaluasi()
    {
        return Inertia::render('Public/ZiWbk/ManajemenPerubahan/PemantauanEvaluasi', [
            'documents' => [
                [
                    'id' => 1,
                    'title' => 'Seluruh kegiatan pembangunan sudah dilaksanakan sesuai dengan rencana',
                    'description' => 'Dokumen pelaksanaan kegiatan pembangunan',
                    'folderId' => '1IykUkzpABckfLdGI5FOD7Om7XBhsL7lE',
                ],
                [
                    'id' => 2,
                    'title' => 'Terdapat monitoring dan evaluasi terhadap pembangunan Zona Integritas',
                    'description' => 'Dokumen monitoring dan evaluasi',
                    'folderId' => '12qA8agk6E5Ma4Ud1x6mbhXhVZNtLtgF4',
                ],
                [
                    'id' => 3,
                    'title' => 'Hasil monitoring dan evaluasi telah ditindaklanjuti',
                    'description' => 'Dokumen tindak lanjut hasil monev',
                    'folderId' => '1ugwynWVsczpcDfv0GiM8d_skW8V5uUjp',
                ],
            ],
        ]);
    }

    public function perubahanPolaPikir()
    {
        return Inertia::render('Public/ZiWbk/ManajemenPerubahan/PerubahanPolaPikir', [
            'documents' => [
                [
                    'id' => 1,
                    'title' => 'Pimpinan berperan sebagai role model dalam pelaksanaan Pembangunan WBK/WBBM',
                    'description' => 'Dokumen peran pimpinan sebagai role model',
                    'folderId' => '1BlekyO_Il7si7qXKMGnBHMxm0bN1ouwY',
                ],
                [
                    'id' => 2,
                    'title' => 'Sudah ditetapkan agen perubahan',
                    'description' => 'Dokumen penetapan agen perubahan',
                    'folderId' => '174u8UR5X707rgatUGW7CtfGCY-yUDPPR',
                ],
                [
                    'id' => 3,
                    'title' => 'Telah dibangun budaya kerja dan pola pikir di lingkungan organisasi',
                    'description' => 'Dokumen budaya kerja organisasi',
                    'folderId' => '18raDyaIqBv6bQK2UKtNEFqw3EJLHJJsD',
                ],
                [
                    'id' => 4,
                    'title' => 'Anggota organisasi terlibat dalam pembangunan Zona Integritas menuju WBK/WBBM',
                    'description' => 'Dokumen keterlibatan anggota organisasi',
                    'folderId' => '1ebgw5u2eCOwlTyIKk4atG6JMhOYdm3dy',
                ],
            ],
        ]);
    }

    // Penguatan Tata Laksana section
    public function penguatanTataLaksana()
    {
        return Inertia::render('Public/ZiWbk/PenguatanTataLaksana/Index');
    }

    public function keterbukaanInformasi()
    {
        return Inertia::render('Public/ZiWbk/PenguatanTataLaksana/KeterbukaanInformasi', [
            'documents' => [
                [
                    'id' => 1,
                    'title' => 'Kebijakan tentang keterbukaan informasi publik telah diterapkan',
                    'description' => 'Dokumen kebijakan keterbukaan informasi',
                    'folderId' => '18dO7PbEKQrsJ77_I3Xo1shKR5s-5JIov',
                ],
                [
                    'id' => 2,
                    'title' => 'Telah dilakukan monitoring dan evaluasi pelaksanaan kebijakan keterbukaan informasi publik',
                    'description' => 'Dokumen monitoring dan evaluasi kebijakan',
                    'folderId' => '12Lv0xebQKoOt7-KbcpqMUmLBBUv52Oim',
                ],
            ],
        ]);
    }

    public function sopKegiatanUtama()
    {
        return Inertia::render('Public/ZiWbk/PenguatanTataLaksana/SopKegiatanUtama', [
            'documents' => [
                [
                    'id' => 1,
                    'title' => 'SOP mengacu pada peta proses bisnis instansi',
                    'description' => 'Dokumen SOP mengacu peta proses bisnis',
                    'folderId' => '1D5DOqEWv7NmjrpooxxlGH9fA9JgexBtn',
                ],
                [
                    'id' => 2,
                    'title' => 'Prosedur operasional tetap (SOP) telah diterapkan',
                    'description' => 'Dokumen penerapan SOP',
                    'folderId' => '1iCwUO6zoOPyqUxLKxhVQ_c9RutiqiSsG',
                ],
                [
                    'id' => 3,
                    'title' => 'Prosedur operasional tetap (SOP) telah dievaluasi',
                    'description' => 'Dokumen evaluasi SOP',
                    'folderId' => '1mow2JR9ahwLG9LiXmbyhyb0kKgv81kuY',
                ],
            ],
        ]);
    }

    public function spbe()
    {
        return Inertia::render('Public/ZiWbk/PenguatanTataLaksana/Spbe', [
            'documents' => [
                [
                    'id' => 1,
                    'title' => 'Sistem pengukuran kinerja unit sudah menggunakan teknologi informasi',
                    'description' => 'Dokumen sistem pengukuran kinerja berbasis TI',
                    'folderId' => '1v2TomRCP3dQt4jAP6ilkcICMNtG2njEy',
                ],
                [
                    'id' => 2,
                    'title' => 'Operasionalisasi manajemen SDM sudah menggunakan teknologi informasi',
                    'description' => 'Dokumen manajemen SDM berbasis TI',
                    'folderId' => '1_U5Stsz8D67l8MFdPnzjRt2cggvOgy8q',
                ],
                [
                    'id' => 3,
                    'title' => 'Pemberian pelayanan kepada publik sudah menggunakan teknologi informasi',
                    'description' => 'Dokumen pelayanan publik berbasis TI',
                    'folderId' => '1dHGw_JhdBWunXJUmKQ36yPqvp4_4Tgfo',
                ],
                [
                    'id' => 4,
                    'title' => 'Telah dilakukan monitoring dan evaluasi terhadap pemanfaatan teknologi informasi dalam pengukuran kinerja unit, operasionalisasi SDM, dan pemberian layanan kepada publik',
                    'description' => 'Dokumen monitoring dan evaluasi pemanfaatan TI',
                    'folderId' => '10AXqF_dolgPBe9wQPDQAoWYgUX-fg3TJ',
                ],
            ],
        ]);
    }

    // Manajemen SDM section
    public function manajemenSdm()
    {
        return Inertia::render('Public/ZiWbk/ManajemenSdm/Index');
    }

    public function perencanaanKebutuhan()
    {
        return Inertia::render('Public/ZiWbk/ManajemenSdm/PerencanaanKebutuhan', [
            'documents' => [
                [
                    'id' => 1,
                    'title' => 'Kebutuhan pegawai yang disusun oleh unit kerja mengacu kepada peta jabatan dan hasil analisis beban kerja untuk masing-masing jabatan',
                    'description' => 'Dokumen kebutuhan pegawai berdasarkan peta jabatan',
                    'folderId' => '1RWlpNKSXJ7TOZyye4slFhxvEjucctDZ6',
                ],
                [
                    'id' => 2,
                    'title' => 'Penempatan pegawai hasil rekrutmen murni mengacu kepada kebutuhan pegawai yang telah disusun per jabatan',
                    'description' => 'Dokumen penempatan pegawai hasil rekrutmen',
                    'folderId' => '1ymgOqmJE-wm-k3VKCh0WwB0RrMkLb6Lk',
                ],
                [
                    'id' => 3,
                    'title' => 'Telah dilakukan monitoring dan evaluasi terhadap penempatan pegawai rekrutmen untuk memenuhi kebutuhan jabatan dalam organisasi telah memberikan perbaikan terhadap kinerja unit kerja',
                    'description' => 'Dokumen monitoring dan evaluasi penempatan pegawai',
                    'folderId' => '1TkPENwy8Suq-XGk69aZLjud4XUcpBUuK',
                ],
            ],
        ]);
    }

    public function polaMutasi()
    {
        return Inertia::render('Public/ZiWbk/ManajemenSdm/PolaMutasi', [
            'documents' => [
                [
                    'id' => 1,
                    'title' => 'Dalam melakukan pengembangan karier pegawai, telah dilakukan mutasi pegawai antar jabatan',
                    'description' => 'Dokumen mutasi pegawai antar jabatan',
                    'folderId' => '1lR_8I3UMrRwHN130dFlmhaQXGAg815jH',
                ],
                [
                    'id' => 2,
                    'title' => 'Dalam melakukan mutasi pegawai antar jabatan telah memperhatikan kompetensi jabatan dan mengikuti pola mutasi yang telah ditetapkan',
                    'description' => 'Dokumen pola mutasi berdasarkan kompetensi',
                    'folderId' => '18GjWU4ibGSpg4E0_KnDD2aq260zfJ1o9',
                ],
                [
                    'id' => 3,
                    'title' => 'Telah dilakukan monitoring dan evaluasi terhadap kegiatan mutasi yang telah dilakukan dalam kaitannya dengan perbaikan kinerja',
                    'description' => 'Dokumen monitoring dan evaluasi mutasi',
                    'folderId' => '1JJIwIyAdoNT4AUj4zwLfUoJD1KWHhTxQ',
                ],
            ],
        ]);
    }

    public function pengembanganPegawai()
    {
        return Inertia::render('Public/ZiWbk/ManajemenSdm/PengembanganPegawai', [
            'documents' => [
                [
                    'id' => 1,
                    'title' => 'Unit Kerja melakukan Training Need Analysis untuk pengembangan kompetensi',
                    'description' => 'Dokumen Training Need Analysis',
                    'folderId' => '133biL7mlTiB_3yi5tLk5mkV-2C9pdVRF',
                ],
                [
                    'id' => 2,
                    'title' => 'Dalam menyusun rencana pengembangan kompetensi pegawai, telah mempertimbangkan hasil pengelolaan kinerja pegawai',
                    'description' => 'Dokumen rencana pengembangan kompetensi',
                    'folderId' => '1PxIZNiWJ3vV3eEd4uIQPJ2hd2_cv8mHg',
                ],
                [
                    'id' => 3,
                    'title' => 'Tingkat kesenjangan kompetensi pegawai yang ada dengan standar kompetensi yang ditetapkan untuk masing-masing jabatan',
                    'description' => 'Dokumen kesenjangan kompetensi',
                    'folderId' => '1KTIqm_tcpbBsR9fAn_NVcgAf8Er9puxC',
                ],
                [
                    'id' => 4,
                    'title' => 'Pegawai di Unit Kerja telah memperoleh kesempatan/hak untuk mengikuti diklat maupun pengembangan kompetensi lainnya',
                    'description' => 'Dokumen kesempatan diklat pegawai',
                    'folderId' => '1KTIqm_tcpbBsR9fAn_NVcgAf8Er9puxC',
                ],
                [
                    'id' => 5,
                    'title' => 'Dalam pelaksanaan pengembangan kompetensi, unit kerja melakukan upaya pengembangan kompetensi kepada pegawai (seperti pengikutsertaan pada lembaga pelatihan, in-house training, coaching, atau mentoring)',
                    'description' => 'Dokumen pelaksanaan pengembangan kompetensi',
                    'folderId' => '1IwDGzTRXY2Z6Bgz5wWjAEbGGcszHl7iS',
                ],
                [
                    'id' => 6,
                    'title' => 'Telah dilakukan monitoring dan evaluasi terhadap hasil pengembangan kompetensi dalam kaitannya dengan perbaikan kinerja',
                    'description' => 'Dokumen monitoring dan evaluasi pengembangan',
                    'folderId' => '1fllbJQYdj2Eyl7XkROjUDDsGODfWfkfG',
                ],
            ],
        ]);
    }

    public function penetapanKinerja()
    {
        return Inertia::render('Public/ZiWbk/ManajemenSdm/PenetapanKinerja', [
            'documents' => [
                [
                    'id' => 1,
                    'title' => 'Terdapat penetapan kinerja individu yang terkait dengan perjanjian kinerja organisasi',
                    'description' => 'Dokumen penetapan kinerja individu',
                    'folderId' => '1o7K4jpVDxAFehbFe4UxGzrMi_MRIvZoj',
                ],
                [
                    'id' => 2,
                    'title' => 'Ukuran kinerja individu telah memiliki kesesuaian dengan indikator kinerja individu level diatasnya',
                    'description' => 'Dokumen kesesuaian ukuran kinerja',
                    'folderId' => '124hT_1W2bN-40E0myI0Mxv7-cvUc6RNi',
                ],
                [
                    'id' => 3,
                    'title' => 'Pengukuran kinerja individu dilakukan secara periodik',
                    'description' => 'Dokumen pengukuran kinerja periodik',
                    'folderId' => '1bI0gpDXE4wjz_6QPif1BOAWpX8qBk8CD',
                ],
                [
                    'id' => 4,
                    'title' => 'Hasil penilaian kinerja individu telah dijadikan dasar untuk pemberian reward',
                    'description' => 'Dokumen penilaian kinerja untuk reward',
                    'folderId' => '1j3WXLbE-5GnhmXJMoY5BEJhWGcYRKTpU',
                ],
            ],
        ]);
    }

    public function sistemInformasi()
    {
        return Inertia::render('Public/ZiWbk/ManajemenSdm/SistemInformasi', [
            'documents' => [
                [
                    'id' => 1,
                    'title' => 'Data informasi kepegawaian unit kerja telah dimutakhirkan secara berkala',
                    'description' => 'Dokumen pemutakhiran data kepegawaian',
                    'folderId' => '1ylRfrm0DWuCLEoBo-UD60GQgb5Sl5yDM',
                ],
            ],
        ]);
    }

    public function penegakanDisiplin()
    {
        return Inertia::render('Public/ZiWbk/ManajemenSdm/PenegakanDisiplin', [
            'documents' => [
                [
                    'id' => 1,
                    'title' => 'Aturan disiplin/kode etik/kode perilaku telah dilaksanakan/diimplementasikan',
                    'description' => 'Dokumen implementasi aturan disiplin',
                    'folderId' => '1RHHUwqXuvwPUkK6am6YzkWxsG-bCHApp',
                ],
            ],
        ]);
    }

    // Akuntabilitas Kerja section
    public function akuntabilitasKerja()
    {
        return Inertia::render('Public/ZiWbk/AkuntabilitasKerja/Index');
    }

    public function keterlibatanPimpinan()
    {
        return Inertia::render('Public/ZiWbk/AkuntabilitasKerja/KeterlibatanPimpinan', [
            'documents' => [
                [
                    'id' => 1,
                    'title' => 'Unit kerja telah melibatkan pimpinan secara langsung pada saat penyusunan perencanaan',
                    'description' => 'Dokumen keterlibatan pimpinan dalam perencanaan',
                    'folderId' => '1YvATG0fDXvyddu7mrfOJbXfRV3p91xOO',
                ],
                [
                    'id' => 2,
                    'title' => 'Unit kerja telah melibatkan secara langsung pimpinan saat penyusunan penetapan kinerja',
                    'description' => 'Dokumen keterlibatan pimpinan dalam penetapan kinerja',
                    'folderId' => '13gfewJ1LtV8wmZxmO-DDQMUNf2JfsP5l',
                ],
                [
                    'id' => 3,
                    'title' => 'Pimpinan memantau pencapaian kinerja secara berkala',
                    'description' => 'Dokumen pemantauan kinerja oleh pimpinan',
                    'folderId' => '1cfO4ya8hffH63CIK657ZIWE7L9ouDSPO',
                ],
            ],
        ]);
    }

    public function pengelolaanAkuntabilitas()
    {
        return Inertia::render('Public/ZiWbk/AkuntabilitasKerja/PengelolaanAkuntabilitas', [
            'documents' => [
                [
                    'id' => 1,
                    'title' => 'Dokumen perencanaan kinerja sudah ada',
                    'description' => 'Dokumen perencanaan kinerja',
                    'folderId' => '15E_-vJJAyZG-oTA5d2yk_X0Lhdb78eI3',
                ],
                [
                    'id' => 2,
                    'title' => 'Perencanaan kinerja telah berorientasi hasil',
                    'description' => 'Dokumen perencanaan berorientasi hasil',
                    'folderId' => '1CydIW_JRdER7pDgXQQGFS9qOB1_ksdja',
                ],
                [
                    'id' => 3,
                    'title' => 'Terdapat penetapan Indikator Kinerja Utama (IKU)',
                    'description' => 'Dokumen penetapan IKU',
                    'folderId' => '10TNpm1rAWzg34tyxCc2IVRG1sHQU91Hb',
                ],
                [
                    'id' => 4,
                    'title' => 'Indikator kinerja telah memenuhi kriteria SMART',
                    'description' => 'Dokumen indikator kinerja SMART',
                    'folderId' => '1Kco3FtLH1Cky3amEBtEUC9razYTCsgHr',
                ],
                [
                    'id' => 5,
                    'title' => 'Laporan kinerja telah disusun tepat waktu',
                    'description' => 'Dokumen laporan kinerja tepat waktu',
                    'folderId' => '17Pw2k82D1psDbDItc1qk--usqBqGlyv1',
                ],
                [
                    'id' => 6,
                    'title' => 'Laporan kinerja telah memberikan informasi tentang kinerja',
                    'description' => 'Dokumen informasi laporan kinerja',
                    'folderId' => '1TH-U8Y0FyZImbA1tnCsh3qzHDpOxS9Dg',
                ],
                [
                    'id' => 7,
                    'title' => 'Terdapat sistem informasi/mekanisme informasi kinerja',
                    'description' => 'Dokumen sistem informasi kinerja',
                    'folderId' => '1IDy40OeSGt0Yi_k_KGlmI6pCvdWLgjWM',
                ],
                [
                    'id' => 8,
                    'title' => 'Unit kerja telah berupaya meningkatkan kapasitas SDM yang menangani akuntabilitas kinerja',
                    'description' => 'Dokumen peningkatan kapasitas SDM akuntabilitas',
                    'folderId' => '1hjqvhk39X-Zx2HPmXBJcisI7S2aiG6Mb',
                ],
            ],
        ]);
    }

    // Penguatan Pengawasan section
    public function penguatanPengawasan()
    {
        return Inertia::render('Public/ZiWbk/PenguatanPengawasan/Index');
    }

    public function pengendalianGratifikasi()
    {
        return Inertia::render('Public/ZiWbk/PenguatanPengawasan/PengendalianGratifikasi', [
            'documents' => [
                [
                    'id' => 1,
                    'title' => 'Telah dilakukan public campaign tentang pengendalian gratifikasi',
                    'description' => 'Dokumen public campaign gratifikasi',
                    'folderId' => '1DzKEacc1SHH8WQk49ZitB3biBuXpmAfk',
                ],
                [
                    'id' => 2,
                    'title' => 'Pengendalian gratifikasi telah diimplementasikan',
                    'description' => 'Dokumen implementasi pengendalian gratifikasi',
                    'folderId' => '11MQwjj0SPCIy40ks5yZ4W8-6oi4j3fx_',
                ],
            ],
        ]);
    }

    public function penerapanSpip()
    {
        return Inertia::render('Public/ZiWbk/PenguatanPengawasan/PenerapanSpip', [
            'documents' => [
                [
                    'id' => 1,
                    'title' => 'Telah dibangun lingkungan pengendalian',
                    'description' => 'Dokumen lingkungan pengendalian',
                    'folderId' => '1lKekEdmpqGJRSNXu8rL4Vv78YKiCkZxY',
                ],
                [
                    'id' => 2,
                    'title' => 'Telah dilakukan penilaian risiko atas pelaksanaan kebijakan',
                    'description' => 'Dokumen penilaian risiko',
                    'folderId' => '1aIRkTkYwNYhGT-P1dM4FdtG4eHcTM201',
                ],
                [
                    'id' => 3,
                    'title' => 'Telah dilakukan kegiatan pengendalian untuk meminimalisir risiko yang telah diidentifikasi',
                    'description' => 'Dokumen kegiatan pengendalian risiko',
                    'folderId' => '1R_rCvAT2vn6GIVYoK6n4FyU53A3uMhAX',
                ],
                [
                    'id' => 4,
                    'title' => 'SPI telah diinformasikan dan dikomunikasikan kepada seluruh pihak terkait',
                    'description' => 'Dokumen komunikasi SPI',
                    'folderId' => '1XWQv7IXeGfq8YkNcIqoosyAuEb9TIUvr',
                ],
                [
                    'id' => 5,
                    'title' => 'Materi Manajemen Risiko',
                    'description' => 'Dokumen materi manajemen risiko',
                    'folderId' => 'PDF_LINK',
                    'pdfUrl' => 'https://balaibahasasultra.kemdikbud.go.id/wp-content/uploads/2025/02/Manajemen-Risiko.pdf',
                ],
            ],
        ]);
    }

    public function pengaduanMasyarakat()
    {
        return Inertia::render('Public/ZiWbk/PenguatanPengawasan/PengaduanMasyarakat', [
            'documents' => [
                [
                    'id' => 1,
                    'title' => 'Kebijakan Pengaduan masyarakat telah diimplementasikan',
                    'description' => 'Dokumen implementasi kebijakan pengaduan',
                    'folderId' => '1FaRwCSOww17_8umWAJ7anEkqiXIrT37Z',
                ],
                [
                    'id' => 2,
                    'title' => 'Pengaduan masyarakat ditindaklanjuti',
                    'description' => 'Dokumen tindak lanjut pengaduan',
                    'folderId' => '1gd6cwWXMPzGcdcP15NvbQ_oeDQ1M1kLW',
                ],
                [
                    'id' => 3,
                    'title' => 'Telah dilakukan monitoring dan evaluasi atas penanganan pengaduan masyarakat',
                    'description' => 'Dokumen monitoring pengaduan',
                    'folderId' => '1eNAUpBCl-uSzbc0XpAji4L3R_Coe9qXZ',
                ],
                [
                    'id' => 4,
                    'title' => 'Hasil evaluasi atas penanganan pengaduan masyarakat telah ditindaklanjuti',
                    'description' => 'Dokumen tindak lanjut evaluasi pengaduan',
                    'folderId' => '1yPSOJ3MiOHO1QDN3kYt1E0pvDOcoX1OL',
                ],
            ],
        ]);
    }

    public function whistleBlowing()
    {
        return Inertia::render('Public/ZiWbk/PenguatanPengawasan/WhistleBlowing', [
            'documents' => [
                [
                    'id' => 1,
                    'title' => 'Whistle Blowing System telah diterapkan',
                    'description' => 'Dokumen penerapan WBS',
                    'folderId' => '1P9R99-9SFUMZR_Ch25n6w08sjpE6ADHW',
                ],
                [
                    'id' => 2,
                    'title' => 'Telah dilakukan evaluasi atas penerapan Whistle Blowing System',
                    'description' => 'Dokumen evaluasi WBS',
                    'folderId' => '1t4I-FZWlJC2jdIGeRhK3rsZjFwUntAtY',
                ],
                [
                    'id' => 3,
                    'title' => 'Hasil evaluasi atas penerapan Whistle Blowing System telah ditindaklanjuti',
                    'description' => 'Dokumen tindak lanjut evaluasi WBS',
                    'folderId' => '1F6h0RnoLsQ-P7NwGZCMbQU99tmwncEG2',
                ],
            ],
        ]);
    }

    public function penangananBenturan()
    {
        return Inertia::render('Public/ZiWbk/PenguatanPengawasan/PenangananBenturan', [
            'documents' => [
                [
                    'id' => 1,
                    'title' => 'Telah terdapat identifikasi/pemetaan benturan kepentingan dalam tugas fungsi utama',
                    'description' => 'Dokumen identifikasi benturan kepentingan',
                    'folderId' => '1YCAAaFyWpeKmsR2-pDWdJPjOmZQODF5T',
                ],
                [
                    'id' => 2,
                    'title' => 'Penanganan Benturan Kepentingan telah disosialisasikan/internalisasi',
                    'description' => 'Dokumen sosialisasi benturan kepentingan',
                    'folderId' => '1vfWotw2VSO4zweRCYzJR9Bfcxl6Fr8OI',
                ],
                [
                    'id' => 3,
                    'title' => 'Penanganan Benturan Kepentingan telah diimplementasikan',
                    'description' => 'Dokumen implementasi penanganan benturan',
                    'folderId' => '1h9L0UiHpU6UAxu7R_WNiZZzCda93wt_V',
                ],
                [
                    'id' => 4,
                    'title' => 'Telah dilakukan evaluasi atas Penanganan Benturan Kepentingan',
                    'description' => 'Dokumen evaluasi penanganan benturan',
                    'folderId' => '1S4blTYW8f3Sgaj5Vj8l97wlezM92F6dk',
                ],
                [
                    'id' => 5,
                    'title' => 'Hasil evaluasi atas Penanganan Benturan Kepentingan telah ditindaklanjuti',
                    'description' => 'Dokumen tindak lanjut evaluasi benturan',
                    'folderId' => '1oY8soNq_nba6bYKkP9Zo32g_O-_u5KzH',
                ],
            ],
        ]);
    }

    // Penguatan Kualitas Pelayanan Publik section
    public function penguatanKualitas()
    {
        return Inertia::render('Public/ZiWbk/PenguatanKualitas/Index');
    }

    public function budayaPelayanan()
    {
        return Inertia::render('Public/ZiWbk/PenguatanKualitas/BudayaPelayanan', [
            'documents' => [
                [
                    'id' => 1,
                    'title' => 'Telah dilakukan berbagai upaya peningkatan kemampuan dan/atau kompetensi tentang penerapan budaya pelayanan prima',
                    'description' => 'Dokumen upaya peningkatan kemampuan pelayanan prima',
                    'folderId' => '1fC6f5qHYTU-AEanHxSynAEbOvKXyXuoX',
                ],
                [
                    'id' => 2,
                    'title' => 'Informasi tentang pelayanan mudah diakses melalui berbagai media',
                    'description' => 'Dokumen aksesibilitas informasi pelayanan',
                    'folderId' => '1TijNrxC7_DdBiP6V6mXgqzhBFHpud7kN',
                ],
                [
                    'id' => 3,
                    'title' => 'Telah terdapat sistem pemberian penghargaan dan sanksi bagi petugas pemberi pelayanan',
                    'description' => 'Dokumen sistem penghargaan dan sanksi',
                    'folderId' => '1kgiO6ltxA_oxLxolkT3M7I4SotcOFgDh',
                ],
                [
                    'id' => 4,
                    'title' => 'Telah terdapat sistem pemberian kompensasi kepada penerima layanan bila layanan tidak sesuai standar',
                    'description' => 'Dokumen sistem kompensasi layanan',
                    'folderId' => '1ZxO_jlekvWiM2P5r3qXjfRnv60Vz3LSa',
                ],
                [
                    'id' => 5,
                    'title' => 'Terdapat sarana layanan terpadu/terintegrasi',
                    'description' => 'Dokumen sarana layanan terpadu',
                    'folderId' => '138GDZCiBLjing_xlD7Tueuxp9Lb64oww',
                ],
                [
                    'id' => 6,
                    'title' => 'Terdapat inovasi pelayanan',
                    'description' => 'Dokumen inovasi pelayanan',
                    'folderId' => '12j35BE8XgJhPX4apaSutUToCNEb24cap',
                ],
            ],
        ]);
    }

    public function pemanfaatanTeknologi()
    {
        return Inertia::render('Public/ZiWbk/PenguatanKualitas/PemanfaatanTeknologi', [
            'documents' => [
                [
                    'id' => 1,
                    'title' => 'Telah menerapkan teknologi informasi dalam memberikan pelayanan',
                    'description' => 'Dokumen penerapan teknologi informasi',
                    'folderId' => '1ppi6yt2gNLCVayOC4Iih9pb_F4JatF68',
                ],
                [
                    'id' => 2,
                    'title' => 'Telah dilakukan perbaikan secara terus menerus',
                    'description' => 'Dokumen perbaikan berkelanjutan',
                    'folderId' => '1XJ3aOUzH4PeVqd7FL-3VRPcuN7sp3ahE',
                ],
                [
                    'id' => 3,
                    'title' => 'Telah membangun database pelayanan yang terintegrasi',
                    'description' => 'Dokumen database pelayanan terintegrasi',
                    'folderId' => '1SdZucQrUabSU7QIISsB1xBRUSJaNYMvt',
                ],
            ],
        ]);
    }

    public function pengelolaanPengaduan()
    {
        return Inertia::render('Public/ZiWbk/PenguatanKualitas/PengelolaanPengaduan', [
            'documents' => [
                [
                    'id' => 1,
                    'title' => 'Terdapat media pengaduan dan konsultasi pelayanan yang terintegrasi dengan SP4N-Lapor!',
                    'description' => 'Dokumen media pengaduan terintegrasi SP4N-Lapor',
                    'folderId' => '1mjHI47H8_dmxzNAB6xC8e8S__P7oge8j',
                ],
                [
                    'id' => 2,
                    'title' => 'Terdapat unit yang mengelola pengaduan dan konsultasi pelayanan',
                    'description' => 'Dokumen unit pengelola pengaduan',
                    'folderId' => '11zv6St-mmMYoMtNrpZchUr9D5FSLsRYo',
                ],
                [
                    'id' => 3,
                    'title' => 'Telah dilakukan evaluasi atas penanganan keluhan/masukan dan konsultasi',
                    'description' => 'Dokumen evaluasi penanganan keluhan',
                    'folderId' => '1QrkdxGr97f_ELbXte0AiZ88V2XiodzHm',
                ],
            ],
        ]);
    }

    public function penilaianKepuasan()
    {
        return Inertia::render('Public/ZiWbk/PenguatanKualitas/PenilaianKepuasan', [
            'documents' => [
                [
                    'id' => 1,
                    'title' => 'Telah dilakukan survey kepuasan masyarakat terhadap pelayanan',
                    'description' => 'Dokumen survei kepuasan masyarakat',
                    'folderId' => '1Ayfg7fQk7c2B0KcRKqhngBBZndctJ55q',
                ],
                [
                    'id' => 2,
                    'title' => 'Hasil survei kepuasan masyarakat dapat diakses secara terbuka',
                    'description' => 'Dokumen akses hasil survei kepuasan',
                    'folderId' => '1IMDgG8kcRqNAwn1RPUELVCfzOgIAjNax',
                ],
                [
                    'id' => 3,
                    'title' => 'Dilakukan tindak lanjut atas hasil survei kepuasan masyarakat',
                    'description' => 'Dokumen tindak lanjut survei kepuasan',
                    'folderId' => '1kje2T_fZrhOeVwiX7wLXxqpo_h6XZpcx',
                ],
            ],
        ]);
    }

    public function standarPelayanan()
    {
        return Inertia::render('Public/ZiWbk/PenguatanKualitas/StandarPelayanan', [
            'documents' => [
                [
                    'id' => 1,
                    'title' => 'Terdapat kebijakan standar pelayanan',
                    'description' => 'Dokumen kebijakan standar pelayanan',
                    'folderId' => '17j4oYuq0Z9i_NmpEHGC41V7QOtuFYLFl',
                ],
                [
                    'id' => 2,
                    'title' => 'Standar pelayanan telah dimaklumatkan',
                    'description' => 'Dokumen maklumat standar pelayanan',
                    'folderId' => '1MrfoGq4HkJqTOnloBrHiguK7pxWoD-OG',
                ],
                [
                    'id' => 3,
                    'title' => 'Dilakukan reviu dan perbaikan atas standar pelayanan',
                    'description' => 'Dokumen reviu dan perbaikan standar',
                    'folderId' => '1-2MaQ9sPv9sx-USQ1rwyXgmJbDChTtM-',
                ],
                [
                    'id' => 4,
                    'title' => 'Telah melakukan publikasi atas standar pelayanan dan maklumat pelayanan',
                    'description' => 'Dokumen publikasi standar pelayanan',
                    'folderId' => '1vU-8BwnlbM7y8yNEgkHZJGt-xreFN6Qb',
                ],
            ],
        ]);
    }

    public function penerapanSpipKualitas()
    {
        return Inertia::render('Public/ZiWbk/PenguatanKualitas/PenerapanSpip', [
            'documents' => [
                [
                    'id' => 1,
                    'title' => 'Telah dibangun lingkungan pengendalian',
                    'description' => 'Dokumen lingkungan pengendalian',
                    'folderId' => '1lKekEdmpqGJRSNXu8rL4Vv78YKiCkZxY',
                ],
                [
                    'id' => 2,
                    'title' => 'Telah dilakukan penilaian risiko atas pelaksanaan kebijakan',
                    'description' => 'Dokumen penilaian risiko kebijakan',
                    'folderId' => '1aIRkTkYwNYhGT-P1dM4FdtG4eHcTM201',
                ],
                [
                    'id' => 3,
                    'title' => 'Telah dilakukan kegiatan pengendalian untuk meminimalisir risiko yang telah diidentifikasi',
                    'description' => 'Dokumen kegiatan pengendalian risiko',
                    'folderId' => '1R_rCvAT2vn6GIVYoK6n4FyU53A3uMhAX',
                ],
                [
                    'id' => 4,
                    'title' => 'SPI telah diinformasikan dan dikomunikasikan kepada seluruh pihak terkait',
                    'description' => 'Dokumen komunikasi SPI',
                    'folderId' => '1XWQv7IXeGfq8YkNcIqoosyAuEb9TIUvr',
                ],
                [
                    'id' => 5,
                    'title' => 'Materi Manajemen Risiko',
                    'description' => 'Dokumen materi manajemen risiko',
                    'folderId' => 'PDF_LINK',
                    'pdfUrl' => 'https://balaibahasasultra.kemdikbud.go.id/wp-content/uploads/2025/02/Manajemen-Risiko.pdf',
                ],
            ],
        ]);
    }

    public function penangananBenturanKualitas()
    {
        return Inertia::render('Public/ZiWbk/PenguatanKualitas/PenangananBenturan', [
            'documents' => [
                [
                    'id' => 1,
                    'title' => 'Telah terdapat identifikasi/pemetaan benturan kepentingan dalam tugas fungsi utama',
                    'description' => 'Dokumen identifikasi benturan kepentingan',
                    'folderId' => '1YCAAaFyWpeKmsR2-pDWdJPjOmZQODF5T',
                ],
                [
                    'id' => 2,
                    'title' => 'Penanganan Benturan Kepentingan telah disosialisasikan/internalisasi',
                    'description' => 'Dokumen sosialisasi penanganan benturan',
                    'folderId' => '1vfWotw2VSO4zweRCYzJR9Bfcxl6Fr8OI',
                ],
                [
                    'id' => 3,
                    'title' => 'Penanganan Benturan Kepentingan telah diimplementasikan',
                    'description' => 'Dokumen implementasi penanganan benturan',
                    'folderId' => '1h9L0UiHpU6UAxu7R_WNiZZzCda93wt_V',
                ],
                [
                    'id' => 4,
                    'title' => 'Telah dilakukan evaluasi atas Penanganan Benturan Kepentingan',
                    'description' => 'Dokumen evaluasi penanganan benturan',
                    'folderId' => '1S4blTYW8f3Sgaj5Vj8l97wlezM92F6dk',
                ],
                [
                    'id' => 5,
                    'title' => 'Hasil evaluasi atas Penanganan Benturan Kepentingan telah ditindaklanjuti',
                    'description' => 'Dokumen tindak lanjut evaluasi benturan',
                    'folderId' => '1oY8soNq_nba6bYKkP9Zo32g_O-_u5KzH',
                ],
            ],
        ]);
    }
}
