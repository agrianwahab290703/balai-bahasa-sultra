<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class TerbitanController extends Controller
{
    /**
     * Display the Majalah overview page.
     */
    public function majalah()
    {
        $magazines = [
            [
                'title' => 'Pabitara',
                'subtitle' => 'Majalah Kebahasaan dan Kesastraan',
                'description' => 'Pabitara merupakan majalah terbitan Balai Bahasa Provinsi Sulawesi Tenggara yang memuat berbagai artikel tentang kebahasaan dan kesastraan.',
                'driveLink' => 'https://drive.google.com/drive/folders/1U-glL1Rxjrb695vfEFhMWumfKOetS3Rd?usp=sharing',
                'coverImage' => null,
                'disclaimer' => 'Setiap bahan bacaan agar tidak dicetak tanpa persetujuan dari Kantor Bahasa Sulawesi Tenggara',
                'color' => 'blue',
                'route' => 'terbitan.majalah.pabitara'
            ],
            [
                'title' => 'Glitera',
                'subtitle' => 'Majalah Sastra dan Budaya',
                'description' => 'Glitera merupakan majalah terbitan Balai Bahasa Provinsi Sulawesi Tenggara yang memuat berbagai karya sastra dan artikel budaya.',
                'driveLink' => 'https://drive.google.com/drive/folders/1x96ewxkYSjONZJ7xlU-3g2sOmCSTz1fh?usp=share_link',
                'coverImage' => null,
                'disclaimer' => 'Setiap bahan bacaan agar tidak dicetak tanpa persetujuan dari Kantor Bahasa Sulawesi Tenggara',
                'color' => 'emerald',
                'route' => 'terbitan.majalah.glitera'
            ],
            [
                'title' => 'Pogsa',
                'subtitle' => 'Majalah Bahasa dan Sastra Daerah',
                'description' => 'Pogsa merupakan majalah terbitan Balai Bahasa Provinsi Sulawesi Tenggara yang berfokus pada pelestarian dan pengembangan bahasa serta sastra daerah Sulawesi Tenggara.',
                'driveLink' => 'https://drive.google.com/file/d/1_ruHe6DkdlxLrJqw6WyKih9t_AxNfa6J/view?usp=sharing',
                'coverImage' => '/images/magazines/pogsa-cover.jpg',
                'disclaimer' => 'Setiap bahan bacaan agar tidak dicetak tanpa persetujuan dari Kantor Bahasa Sulawesi Tenggara',
                'color' => 'amber',
                'route' => 'terbitan.majalah.pogsa'
            ],
        ];

        $disclaimer = 'Setiap bahan bacaan agar tidak dicetak tanpa persetujuan dari Kantor Bahasa Sulawesi Tenggara';

        return Inertia::render('Public/Terbitan/Majalah', [
            'magazines' => $magazines,
            'disclaimer' => $disclaimer,
        ]);
    }

    /**
     * Display the Pabitara magazine page.
     */
    public function pabitara()
    {
        $magazine = [
            'title' => 'Pabitara',
            'subtitle' => 'Majalah Kebahasaan dan Kesastraan',
            'description' => 'Pabitara merupakan majalah terbitan Balai Bahasa Provinsi Sulawesi Tenggara yang memuat berbagai artikel tentang kebahasaan dan kesastraan.',
            'driveLink' => 'https://drive.google.com/drive/folders/1U-glL1Rxjrb695vfEFhMWumfKOetS3Rd?usp=sharing',
            'coverImage' => null,
            'disclaimer' => 'Setiap bahan bacaan agar tidak dicetak tanpa persetujuan dari Kantor Bahasa Sulawesi Tenggara',
            'color' => 'blue',
        ];

        return Inertia::render('Public/Terbitan/Pabitara', [
            'magazine' => $magazine,
        ]);
    }

    /**
     * Display the Glitera magazine page.
     */
    public function glitera()
    {
        $magazine = [
            'title' => 'Glitera',
            'subtitle' => 'Majalah Sastra dan Budaya',
            'description' => 'Glitera merupakan majalah terbitan Balai Bahasa Provinsi Sulawesi Tenggara yang memuat berbagai karya sastra dan artikel budaya.',
            'driveLink' => 'https://drive.google.com/drive/folders/1x96ewxkYSjONZJ7xlU-3g2sOmCSTz1fh?usp=share_link',
            'coverImage' => null,
            'disclaimer' => 'Setiap bahan bacaan agar tidak dicetak tanpa persetujuan dari Kantor Bahasa Sulawesi Tenggara',
            'color' => 'emerald',
        ];

        return Inertia::render('Public/Terbitan/Glitera', [
            'magazine' => $magazine,
        ]);
    }

    /**
     * Display the Pogsa magazine page.
     */
    public function pogsa()
    {
        $magazine = [
            'title' => 'Pogsa',
            'subtitle' => 'Majalah Bahasa dan Sastra Daerah',
            'description' => 'Pogsa merupakan majalah terbitan Balai Bahasa Provinsi Sulawesi Tenggara yang berfokus pada pelestarian dan pengembangan bahasa serta sastra daerah Sulawesi Tenggara.',
            'driveLink' => 'https://drive.google.com/file/d/1_ruHe6DkdlxLrJqw6WyKih9t_AxNfa6J/view?usp=sharing',
            'coverImage' => '/images/magazines/pogsa-cover.jpg',
            'disclaimer' => 'Setiap bahan bacaan agar tidak dicetak tanpa persetujuan dari Kantor Bahasa Sulawesi Tenggara',
            'color' => 'amber',
        ];

        return Inertia::render('Public/Terbitan/Pogsa', [
            'magazine' => $magazine,
        ]);
    }

    /**
     * Display the Cerita Rakyat (Folklore) page.
     */
    public function ceritaRakyat()
    {
        $folklores = [
            [
                'id' => 1,
                'title' => 'Cerita Rakyat Wawonii',
                'region' => 'Wawonii',
                'description' => 'Kumpulan cerita rakyat dari Kabupaten Konawe Kepulauan yang kaya akan nilai-nilai budaya dan kearifan lokal masyarakat Wawonii.',
                'driveLink' => 'https://drive.google.com/file/d/1MJU4aRvcjCmfUI6xalXNNY-jtYSINMnR/view?usp=sharing',
                'coverImage' => '/images/cerita-rakyat/wawonii-cover.jpg',
                'color' => 'rose',
            ],
            [
                'id' => 2,
                'title' => 'Cerita Rakyat Wakatobi',
                'region' => 'Wakatobi',
                'description' => 'Kumpulan cerita rakyat dari Kabupaten Wakatobi yang memuat berbagai legenda dan kisah turun-temurun dari pulau-pulau Wakatobi.',
                'driveLink' => 'https://drive.google.com/file/d/1ucpCxBD8wYuC44DkvEB70tRbbuYTQAKO/view?usp=sharing',
                'coverImage' => '/images/cerita-rakyat/wakatobi-cover.jpg',
                'color' => 'indigo',
            ],
        ];

        $disclaimer = 'Setiap bahan bacaan agar tidak dicetak tanpa persetujuan dari Kantor Bahasa Sulawesi Tenggara';

        return Inertia::render('Public/Terbitan/CeritaRakyat', [
            'folklores' => $folklores,
            'disclaimer' => $disclaimer,
        ]);
    }

    /**
     * Display the Hasil Penelitian Bahasa (Language Research) page.
     */
    public function penelitianBahasa()
    {
        $researches = [
            [
                'id' => 1,
                'title' => 'Hasil Penelitian Penggunaan Bahasa pada Berita Utama Kendari Pos Tahun 2020',
                'shortTitle' => 'Penggunaan Bahasa pada Berita Utama Kendari Pos',
                'year' => '2020',
                'category' => 'Penggunaan Bahasa',
                'description' => 'Penelitian tentang penggunaan bahasa pada berita utama di media Kendari Pos tahun 2020, menganalisis pola penggunaan bahasa Indonesia dalam jurnalisme media lokal.',
                'driveLink' => 'https://drive.google.com/file/d/13iTgnFj6ARmHaVnX-MK_THYLH_iFfyKy/view?usp=sharing',
                'coverImage' => '/images/research/bahasa-1.jpg',
                'color' => 'blue',
            ],
            [
                'id' => 2,
                'title' => 'Hasil Penelitian Kesalahan Penggunaan Ejaan pada Berita Utama Media Suktrakini.com, Antaranewssultra.com, dan Berita Kota',
                'shortTitle' => 'Kesalahan Penggunaan Ejaan pada Media Online',
                'year' => '2020',
                'category' => 'Ejaan',
                'description' => 'Penelitian tentang kesalahan penggunaan ejaan pada berita utama di berbagai media online Sulawesi Tenggara termasuk Suktrakini.com, Antaranewssultra.com, dan Berita Kota.',
                'driveLink' => 'https://drive.google.com/file/d/1yop4rrHhQWW0LRDQzo9t9MOMMbOH0xQR/view?usp=sharing',
                'coverImage' => '/images/research/bahasa-2.jpg',
                'color' => 'emerald',
            ],
            [
                'id' => 3,
                'title' => 'Hasil Penelitian Pengaruh Nilai UKBI dan Pengetahuan UKBI Terhadap Sikap Bahasa Guru Bahasa Indonesia Tingkat SMP di Sulawesi Tenggara',
                'shortTitle' => 'Pengaruh UKBI Terhadap Sikap Bahasa Guru',
                'year' => '2020',
                'category' => 'UKBI',
                'description' => 'Penelitian tentang pengaruh nilai UKBI dan pengetahuan UKBI terhadap sikap bahasa guru Bahasa Indonesia tingkat SMP di Sulawesi Tenggara.',
                'driveLink' => 'https://drive.google.com/file/d/11b5HEBc9WzWitYb174ZiEQz-T_6RdQxO/view?usp=sharing',
                'coverImage' => '/images/research/bahasa-3.jpg',
                'color' => 'violet',
            ],
        ];

        $disclaimer = 'Setiap bahan bacaan agar tidak dicetak tanpa persetujuan dari Kantor Bahasa Sulawesi Tenggara';

        return Inertia::render('Public/Terbitan/HasilPenelitian/Bahasa', [
            'researches' => $researches,
            'disclaimer' => $disclaimer,
        ]);
    }

    /**
     * Display the Hasil Penelitian Sastra (Literature Research) page.
     */
    public function penelitianSastra()
    {
        $researches = [
            [
                'id' => 1,
                'title' => 'Hasil Penelitian Kajian Vitalitas Sastra Lisan Tolaki Kinoho',
                'shortTitle' => 'Vitalitas Sastra Lisan Tolaki Kinoho',
                'year' => '2020',
                'category' => 'Sastra Lisan',
                'description' => 'Penelitian tentang kajian vitalitas sastra lisan Tolaki Kinoho yang merupakan warisan budaya masyarakat Tolaki di Sulawesi Tenggara.',
                'driveLink' => 'https://drive.google.com/file/d/140wbjms5XI9H3eFOKv6GzHj2cqhRG9o5/view?usp=sharing',
                'coverImage' => '/images/research/sastra-1.jpg',
                'color' => 'rose',
            ],
            [
                'id' => 2,
                'title' => 'Hasil Penelitian Pemakaian Bahasa dan Sastra Tingkat Sekolah Dasar Tahun 2017',
                'shortTitle' => 'Pemakaian Bahasa dan Sastra Tingkat SD',
                'year' => '2017',
                'category' => 'Pendidikan',
                'description' => 'Penelitian tentang pemakaian bahasa dan sastra pada tingkat Sekolah Dasar tahun 2017, menganalisis penerapan pembelajaran bahasa dan sastra di sekolah.',
                'driveLink' => 'https://drive.google.com/file/d/1_TKR9B0LeHOBw3m0h7eHp1yr1zczFnVq/view?usp=sharing',
                'coverImage' => '/images/research/sastra-2.jpg',
                'color' => 'amber',
            ],
            [
                'id' => 3,
                'title' => 'Hasil Penelitian Pemetaan Sastra di Sulawesi Tenggara: Sastra Lisan Tolaki, Muna, dan Wolio',
                'shortTitle' => 'Pemetaan Sastra Lisan Tolaki, Muna, dan Wolio',
                'year' => '2020',
                'category' => 'Pemetaan Sastra',
                'description' => 'Penelitian pemetaan sastra di Sulawesi Tenggara yang mencakup sastra lisan dari tiga etnis besar yaitu Tolaki, Muna, dan Wolio.',
                'driveLink' => 'https://drive.google.com/file/d/1LY4Alm8lbj-EJLWwctHVZD502Urjmr3b/view?usp=sharing',
                'coverImage' => '/images/research/sastra-3.jpg',
                'color' => 'indigo',
            ],
        ];

        $disclaimer = 'Setiap bahan bacaan agar tidak dicetak tanpa persetujuan dari Kantor Bahasa Sulawesi Tenggara';

        return Inertia::render('Public/Terbitan/HasilPenelitian/Sastra', [
            'researches' => $researches,
            'disclaimer' => $disclaimer,
        ]);
    }

    /**
     * Display the Kamus (Dictionary) page.
     */
    public function kamus()
    {
        $dictionaries = [
            [
                'id' => 1,
                'title' => 'Kamus Bergambar Indonesia-Kulisusu 2024',
                'shortTitle' => 'Kamus Bergambar Indo-Kulisusu',
                'category' => 'bahasa',
                'description' => 'Kamus bergambar bahasa Indonesia-Kulisusu untuk memudahkan pembelajaran bahasa daerah Kulisusu.',
                'driveLink' => 'https://drive.google.com/file/d/18uLXXFFrODR497QOmILXNJi88hhzxath/view?usp=sharing',
                'coverImage' => '/images/kamus/kamus-bergambar-kulisusu.jpg',
                'color' => 'teal',
            ],
            [
                'id' => 2,
                'title' => 'Kamus Indonesia-Kulisusu 2024',
                'shortTitle' => 'Kamus Indo-Kulisusu',
                'category' => 'bahasa',
                'description' => 'Kamus bahasa Indonesia-Kulisusu sebagai referensi kosakata bahasa daerah Kulisusu.',
                'driveLink' => 'https://drive.google.com/file/d/15tG_buqgfpQ_zBXcsEGNnaKCFKGP54Qj/view?usp=sharing',
                'coverImage' => '/images/kamus/kamus-kulisusu.jpg',
                'color' => 'blue',
            ],
            [
                'id' => 3,
                'title' => 'Kamus Indonesia-Cia-Cia',
                'shortTitle' => 'Kamus Indonesia-Cia-Cia',
                'category' => 'bahasa',
                'description' => 'Kamus bahasa Indonesia-Cia-Cia, dokumentasi bahasa daerah dari Kabupaten Buton.',
                'driveLink' => 'https://drive.google.com/file/d/1E5GSaSeXQp-jBO1BAoPeFE8HNclNIbtU/view?usp=sharing',
                'coverImage' => '/images/kamus/kamus-ciacia.jpg',
                'color' => 'emerald',
            ],
            [
                'id' => 4,
                'title' => 'Kamus Bergambar Bahasa Pulo Wakatobi-Indonesia',
                'shortTitle' => 'Kamus Bergambar Pulo Wakatobi',
                'category' => 'bahasa',
                'description' => 'Kamus bergambar bahasa Pulo Wakatobi-Indonesia dari kepulauan Wakatobi.',
                'driveLink' => 'https://drive.google.com/file/d/1R7TMdNdE7lSG3hxUU0v7gL119cfvO3B8/view?usp=sharing',
                'coverImage' => '/images/kamus/kamus-wakatobi.jpg',
                'color' => 'cyan',
            ],
            [
                'id' => 5,
                'title' => 'Kamus Bergambar Bahasa Indonesia-Tolaki (Edisi Revisi)',
                'shortTitle' => 'Kamus Bergambar Indo-Tolaki (Revisi)',
                'category' => 'bahasa',
                'description' => 'Edisi revisi kamus bergambar Indonesia-Tolaki dengan penambahan kosakata.',
                'driveLink' => 'https://drive.google.com/file/d/1lm4WTrgC4aa4tlAKeAl3gLKQ-QAvKFl6/view?usp=sharing',
                'coverImage' => '/images/kamus/kamus-tolaki-revisi.jpg',
                'color' => 'violet',
            ],
            [
                'id' => 6,
                'title' => 'Kamus Bergambar Bahasa Indonesia-Tolaki 2020',
                'shortTitle' => 'Kamus Bergambar Indo-Tolaki 2020',
                'category' => 'bahasa',
                'description' => 'Kamus bergambar bahasa Indonesia-Tolaki terbitan tahun 2020.',
                'driveLink' => 'https://drive.google.com/file/d/1zhDG_UMvR8CA2Z1SpVI-nrMbubZ5ouu9/view?usp=sharing',
                'coverImage' => '/images/kamus/kamus-tolaki-2020.jpg',
                'color' => 'rose',
            ],
            [
                'id' => 7,
                'title' => 'Kamus Muna-Indonesia',
                'shortTitle' => 'Kamus Muna-Indonesia',
                'category' => 'bahasa',
                'description' => 'Kamus bahasa Muna-Indonesia sebagai dokumentasi bahasa daerah Muna.',
                'driveLink' => 'https://drive.google.com/file/d/1XzfNOOhMY9AKB2VBYcvrhslG0LgtgwGN/view?usp=sharing',
                'coverImage' => '/images/kamus/kamus-muna.jpg',
                'color' => 'indigo',
            ],
            [
                'id' => 8,
                'title' => 'Kamus Culambacu',
                'shortTitle' => 'Kamus Culambacu',
                'category' => 'bahasa',
                'description' => 'Kamus bahasa Culambacu, dokumentasi bahasa daerah Sulawesi Tenggara.',
                'driveLink' => 'https://drive.google.com/file/d/1rBsXAu3sJc-JA6jxqfW7a4Cu_kiS8tvu/view?usp=sharing',
                'coverImage' => '/images/kamus/kamus-culambacu.jpg',
                'color' => 'orange',
            ],
            [
                'id' => 9,
                'title' => 'Kamus Budaya Sulawesi Tenggara Edisi II',
                'shortTitle' => 'Kamus Budaya Sultra Edisi II',
                'category' => 'budaya',
                'description' => 'Kamus budaya Sulawesi Tenggara edisi kedua, memuat istilah-istilah budaya daerah.',
                'driveLink' => 'https://drive.google.com/file/d/1mttyjRW2j06swn2nyvE0LE4WFBE4FHAv/view?usp=sharing',
                'coverImage' => '/images/kamus/kamus-budaya-2.jpg',
                'color' => 'amber',
            ],
            [
                'id' => 10,
                'title' => 'Kamus Budaya Sulawesi Tenggara',
                'shortTitle' => 'Kamus Budaya Sultra',
                'category' => 'budaya',
                'description' => 'Kamus budaya Sulawesi Tenggara, dokumentasi kekayaan budaya lokal.',
                'driveLink' => 'https://drive.google.com/file/d/1AtSZOCDtxSaOlGfwVe6KVVXgTF3Bb2Br/view?usp=drive_link',
                'coverImage' => '/images/kamus/kamus-budaya.jpg',
                'color' => 'purple',
            ],
        ];

        $disclaimer = 'Setiap bahan bacaan agar tidak dicetak tanpa persetujuan dari Kantor Bahasa Sulawesi Tenggara';

        return Inertia::render('Public/Terbitan/Kamus', [
            'dictionaries' => $dictionaries,
            'disclaimer' => $disclaimer,
        ]);
    }

    /**
     * Display the Cerita Anak (Children's Books) page.
     */
    public function ceritaAnak2024()
    {
        $books = [
            ['id' => 1, 'title' => 'Menyelamatkan Burung Bungkoloko', 'shortTitle' => 'Menyelamatkan Burung Bungkoloko', 'year' => '2024', 'description' => 'Cerita tentang penyelamatan burung langka Bungkoloko.', 'driveLink' => 'https://drive.google.com/file/d/1vSsQYh1lSHRHyGTIOzqJ2lA-oYR_csjF/view?usp=drive_link', 'coverImage' => '/images/cerita-anak/menyelamatkan-burung.jpg', 'color' => 'pink'],
            ['id' => 2, 'title' => 'Ce Ingin Pergi ke Laut', 'shortTitle' => 'Ce Ingin Pergi ke Laut', 'year' => '2024', 'description' => 'Petualangan Ce yang ingin melihat laut.', 'driveLink' => 'https://drive.google.com/file/d/1xwRhyDVs_8NFyElxnzImvmrKVyO5KHiD/view?usp=drive_link', 'coverImage' => '/images/cerita-anak/ce-pergi-laut.jpg', 'color' => 'blue'],
            ['id' => 3, 'title' => 'Petualangan si Kantong Plastik', 'shortTitle' => 'Petualangan si Kantong Plastik', 'year' => '2024', 'description' => 'Cerita edukatif tentang lingkungan.', 'driveLink' => 'https://drive.google.com/file/d/1t5wP9zacQ51Gc6HAte6aA8eQD7hNPwSI/view?usp=drive_link', 'coverImage' => '/images/cerita-anak/kantong-plastik.jpg', 'color' => 'green'],
            ['id' => 4, 'title' => 'Perjalanan si Bobo', 'shortTitle' => 'Perjalanan si Bobo', 'year' => '2024', 'description' => 'Petualangan menarik si Bobo.', 'driveLink' => 'https://drive.google.com/file/d/1QAknVWNYczodBiMI8QaBB-fQE547Dneb/view?usp=drive_link', 'coverImage' => '/images/cerita-anak/perjalanan-bobo.jpg', 'color' => 'orange'],
            ['id' => 5, 'title' => 'Pohon Kelapa yang Bersedih', 'shortTitle' => 'Pohon Kelapa yang Bersedih', 'year' => '2024', 'description' => 'Cerita tentang pohon kelapa yang kesepian.', 'driveLink' => 'https://drive.google.com/file/d/17eVwC32wAsM8BRxdqtV2QQDhnQmcwHyg/view?usp=drive_link', 'coverImage' => '/images/cerita-anak/pohon-kelapa.jpg', 'color' => 'teal'],
            ['id' => 6, 'title' => 'Rusa dan Impiannya', 'shortTitle' => 'Rusa dan Impiannya', 'year' => '2024', 'description' => 'Cerita inspiratif tentang rusa yang memiliki impian.', 'driveLink' => 'https://drive.google.com/file/d/1Zvj7Lucs0JW4gaHzLa5f66yvepXLnNlo/view?usp=drive_link', 'coverImage' => '/images/cerita-anak/rusa-impian.jpg', 'color' => 'amber'],
            ['id' => 7, 'title' => 'Pindara Teman Baruku', 'shortTitle' => 'Pindara Teman Baruku', 'year' => '2024', 'description' => 'Cerita tentang persahabatan dengan Pindara.', 'driveLink' => 'https://drive.google.com/file/d/1100eAlpwjCHIJtyKEtN3yyBpz83uxbMw/view?usp=sharing', 'coverImage' => '/images/cerita-anak/pindara.jpg', 'color' => 'purple'],
            ['id' => 8, 'title' => 'Anahino Tehi (Anak Laut)', 'shortTitle' => 'Anahino Tehi (Anak Laut)', 'year' => '2024', 'description' => 'Cerita anak laut dari Sulawesi Tenggara.', 'driveLink' => 'https://drive.google.com/file/d/1khjNNoHUtS1rsXcr1VDnAPW6I1wHuzaM/view?usp=drive_link', 'coverImage' => '/images/cerita-anak/anak-laut.jpg', 'color' => 'cyan'],
            ['id' => 9, 'title' => 'Benua Wembe Mongkano Dosu (Benua Kambing Pemakan Kardus)', 'shortTitle' => 'Benua Kambing Pemakan Kardus', 'year' => '2024', 'description' => 'Cerita lucu tentang kambing yang suka makan kardus.', 'driveLink' => 'https://drive.google.com/file/d/1C_0JRXDo0t1OIYLLhBXWpDA3yu5x3_r1/view?usp=drive_link', 'coverImage' => '/images/cerita-anak/benua-kambing.jpg', 'color' => 'pink'],
            ['id' => 10, 'title' => 'Mimpi Ayu Menari', 'shortTitle' => 'Mimpi Ayu Menari', 'year' => '2024', 'description' => 'Cerita inspiratif tentang mimpi Ayu menjadi penari.', 'driveLink' => 'https://drive.google.com/file/d/1HaIFZLZryWxtp2nIYRSgMi8UqCZu70zt/view?usp=drive_link', 'coverImage' => '/images/cerita-anak/mimpi-ayu.jpg', 'color' => 'rose'],
            ['id' => 11, 'title' => 'Pak Ode dan Nosi', 'shortTitle' => 'Pak Ode dan Nosi', 'year' => '2024', 'description' => 'Cerita tentang Pak Ode dan Nosi.', 'driveLink' => 'https://drive.google.com/file/d/1VvH8YTzj9OZq05sCoYQ-5cbNrRWAUGAH/view?usp=sharing', 'coverImage' => '/images/cerita-anak/pak-ode.jpg', 'color' => 'orange'],
            ['id' => 12, 'title' => 'Petualangan Nelayan Cilik', 'shortTitle' => 'Petualangan Nelayan Cilik', 'year' => '2024', 'description' => 'Cerita petualangan nelayan cilik.', 'driveLink' => 'https://drive.google.com/file/d/1xXX_lxHuYrgLJvMI5QgEo2h6gOl3WOyd/view?usp=drive_link', 'coverImage' => '/images/cerita-anak/nelayan-cilik.jpg', 'color' => 'blue'],
            ['id' => 13, 'title' => 'Pohon Surya Anaya', 'shortTitle' => 'Pohon Surya Anaya', 'year' => '2024', 'description' => 'Cerita tentang pohon Surya Anaya.', 'driveLink' => 'https://drive.google.com/file/d/1ehWufgTa4yITm00Pmw6a0pxdVIcQdORn/view?usp=drive_link', 'coverImage' => '/images/cerita-anak/pohon-surya.jpg', 'color' => 'amber'],
            ['id' => 14, 'title' => 'Mengapa Nyamuk Berdenging', 'shortTitle' => 'Mengapa Nyamuk Berdenging', 'year' => '2024', 'description' => 'Cerita asal-usul mengapa nyamuk berdenging.', 'driveLink' => 'https://drive.google.com/file/d/1OulLAsXdqbsjG0-MUGBAV-vFdAXyfZUX/view?usp=drive_link', 'coverImage' => '/images/cerita-anak/nyamuk.jpg', 'color' => 'cyan'],
            ['id' => 15, 'title' => 'Gara-Gara Pokea', 'shortTitle' => 'Gara-Gara Pokea', 'year' => '2024', 'description' => 'Cerita lucu gara-gara Pokea.', 'driveLink' => 'https://drive.google.com/file/d/1ZEEMGozBDoUQdn9YFubAerakCaw3Ij8c/view?usp=drive_link', 'coverImage' => '/images/cerita-anak/gara-pokea.jpg', 'color' => 'purple'],
            ['id' => 16, 'title' => 'Buku Gambar Tama', 'shortTitle' => 'Buku Gambar Tama', 'year' => '2024', 'description' => 'Cerita tentang buku gambar Tama.', 'driveLink' => 'https://drive.google.com/file/d/1SRaX4X2S9Qm6Kg_eSIrGatr1aFu25kjs/view?usp=sharing', 'coverImage' => '/images/cerita-anak/buku-tama.jpg', 'color' => 'teal'],
            ['id' => 17, 'title' => 'Misi Rahasia', 'shortTitle' => 'Misi Rahasia', 'year' => '2024', 'description' => 'Cerita petualangan misi rahasia.', 'driveLink' => 'https://drive.google.com/file/d/1THSTZBmtgR8H8TN60AFROgUPU0yvFQwW/view?usp=drive_link', 'coverImage' => '/images/cerita-anak/misi-rahasia.jpg', 'color' => 'indigo'],
            ['id' => 18, 'title' => 'Bungkus Jajanan Ima', 'shortTitle' => 'Bungkus Jajanan Ima', 'year' => '2024', 'description' => 'Cerita edukatif tentang sampah dan lingkungan.', 'driveLink' => 'https://drive.google.com/file/d/17Xo0IS6ru0c-DaW8BtWUs7j1V9IX8S_Z/view?usp=drive_link', 'coverImage' => '/images/cerita-anak/bungkus-ima.jpg', 'color' => 'green'],
            ['id' => 19, 'title' => 'Petualangan Nino', 'shortTitle' => 'Petualangan Nino', 'year' => '2024', 'description' => 'Petualangan menarik Nino.', 'driveLink' => 'https://drive.google.com/file/d/19lI4c-Je_mSIfT6_QW8qsbsVD0UX_rB6/view?usp=sharing', 'coverImage' => '/images/cerita-anak/petualangan-nino.jpg', 'color' => 'violet'],
            ['id' => 20, 'title' => 'Kemenangan Bersama', 'shortTitle' => 'Kemenangan Bersama', 'year' => '2024', 'description' => 'Cerita tentang kerja sama dan kemenangan.', 'driveLink' => 'https://drive.google.com/file/d/1wIkxQamxVoh3IL2TFQnNKl2N49ggAIyW/view?usp=drive_link', 'coverImage' => '/images/cerita-anak/kemenangan.jpg', 'color' => 'amber'],
            ['id' => 21, 'title' => 'Tekad Kiki', 'shortTitle' => 'Tekad Kiki', 'year' => '2024', 'description' => 'Cerita inspiratif tentang tekad Kiki.', 'driveLink' => 'https://drive.google.com/file/d/1imEI3BxCstav31fVKYQyJdz_--itY2iL/view?usp=drive_link', 'coverImage' => '/images/cerita-anak/tekad-kiki.jpg', 'color' => 'pink'],
            ['id' => 22, 'title' => 'Taman Impian Sari', 'shortTitle' => 'Taman Impian Sari', 'year' => '2024', 'description' => 'Cerita tentang taman impian Sari.', 'driveLink' => 'https://drive.google.com/file/d/1-ONzC5TPTN2ErVnW0s9vaUPjcyyE6fwF/view?usp=drive_link', 'coverImage' => '/images/cerita-anak/taman-sari.jpg', 'color' => 'rose'],
            ['id' => 23, 'title' => 'Pucuk-Pucuk Muda yang Memanggil Hujan', 'shortTitle' => 'Pucuk-Pucuk Muda Memanggil Hujan', 'year' => '2024', 'description' => 'Cerita tentang pucuk muda dan hujan.', 'driveLink' => 'https://drive.google.com/file/d/1GTrq3i_sEZUjnrss6G-a0vRZ_rXlZiQ-/view?usp=drive_link', 'coverImage' => '/images/cerita-anak/pucuk-muda.jpg', 'color' => 'green'],
            ['id' => 24, 'title' => 'Tina dan Rumah Adat Moronene', 'shortTitle' => 'Tina dan Rumah Adat Moronene', 'year' => '2024', 'description' => 'Cerita Tina mengenal rumah adat Moronene.', 'driveLink' => 'https://repositori.kemendikdasmen.go.id/33230/1/TINA%20DAN%20RUMAH%20ADAT%20MORONENE%20%28PDF%29.pdf', 'coverImage' => '/images/cerita-anak/tina-moronene.jpg', 'color' => 'cyan'],
            ['id' => 25, 'title' => 'Sorakan di Bawah Pelangi', 'shortTitle' => 'Sorakan di Bawah Pelangi', 'year' => '2024', 'description' => 'Cerita ceria di bawah pelangi.', 'driveLink' => 'https://drive.google.com/file/d/1wcVF44tUIZuvynHGlVAsZXbx17UW6RNr/view?usp=drive_link', 'coverImage' => '/images/cerita-anak/pelangi.jpg', 'color' => 'orange'],
            ['id' => 26, 'title' => 'Hari yang Penuh Kejutan', 'shortTitle' => 'Hari yang Penuh Kejutan', 'year' => '2024', 'description' => 'Cerita tentang hari yang penuh kejutan.', 'driveLink' => 'https://drive.google.com/file/d/1x6TmLWL8kU1kEMNyiFVXjzpHqtlrapGr/view?usp=drive_link', 'coverImage' => '/images/cerita-anak/hari-kejutan.jpg', 'color' => 'blue'],
            ['id' => 27, 'title' => 'La Buroto', 'shortTitle' => 'La Buroto', 'year' => '2024', 'description' => 'Cerita rakyat La Buroto.', 'driveLink' => 'https://drive.google.com/file/d/1O7nnEOA8FizgwPyl8x8Cct8BY7s9omQZ/view?usp=drive_link', 'coverImage' => '/images/cerita-anak/la-buroto.jpg', 'color' => 'purple'],
            ['id' => 28, 'title' => 'Legenda Tari Lumense', 'shortTitle' => 'Legenda Tari Lumense', 'year' => '2024', 'description' => 'Cerita tentang asal-usul tari Lumense.', 'driveLink' => 'https://drive.google.com/file/d/1kCD4eK00YtFTO00W6-AKz8Ew4sb82LMu/view?usp=drive_link', 'coverImage' => '/images/cerita-anak/tari-lumense.jpg', 'color' => 'teal'],
            ['id' => 29, 'title' => 'Atraksi Sori', 'shortTitle' => 'Atraksi Sori', 'year' => '2024', 'description' => 'Cerita tentang atraksi Sori.', 'driveLink' => 'https://drive.google.com/file/d/1AkuaZCIAfWc9EHx6mxc0wcIBMCq-LuZy/view?usp=drive_link', 'coverImage' => '/images/cerita-anak/atraksi-sori.jpg', 'color' => 'indigo'],
            ['id' => 30, 'title' => 'Menyambut Ramadan Bersama Tie dan Kawan-Kawannya', 'shortTitle' => 'Menyambut Ramadan Bersama Tie', 'year' => '2024', 'description' => 'Cerita menyambut bulan Ramadan.', 'driveLink' => 'https://drive.google.com/file/d/1HKmA-C_1f5ydUEkDiPuqS6lXM1lNEIuJ/view?usp=drive_link', 'coverImage' => '/images/cerita-anak/ramadan-tie.jpg', 'color' => 'amber'],
            ['id' => 31, 'title' => 'Ayahnya Matahari', 'shortTitle' => 'Ayahnya Matahari', 'year' => '2024', 'description' => 'Cerita tentang ayah yang penuh kasih.', 'driveLink' => 'https://drive.google.com/file/d/1GAp_3znkAMvaFZmbe05VQ8j6OoaCqAmS/view?usp=drive_link', 'coverImage' => '/images/cerita-anak/ayahnya-matahari.jpg', 'color' => 'pink'],
            ['id' => 32, 'title' => 'Sepatu Baru Yaya', 'shortTitle' => 'Sepatu Baru Yaya', 'year' => '2024', 'description' => 'Cerita tentang Yaya yang mendapat sepatu baru.', 'driveLink' => 'https://drive.google.com/file/d/15I-GgzirAAdTwlwElhikAjtqW-iA5Pta/view?usp=drive_link', 'coverImage' => '/images/cerita-anak/sepatu-yaya.jpg', 'color' => 'rose'],
            ['id' => 33, 'title' => 'Bantal Kakek', 'shortTitle' => 'Bantal Kakek', 'year' => '2024', 'description' => 'Cerita hangat tentang kakek dan cucunya.', 'driveLink' => 'https://drive.google.com/file/d/1mPLdHb1pgZ5ff_Mbz0FR2_Lr-rwuR3UA/view?usp=drive_link', 'coverImage' => '/images/cerita-anak/bantal-kakek.jpg', 'color' => 'violet'],
            ['id' => 34, 'title' => 'Seberapa Tinggi Gunung Itu', 'shortTitle' => 'Seberapa Tinggi Gunung Itu', 'year' => '2024', 'description' => 'Cerita tentang petualangan mendaki gunung.', 'driveLink' => 'https://drive.google.com/file/d/1uKdq3v9dV7VfPBNCXFlVdDEs7ilC4fck/view?usp=drive_link', 'coverImage' => '/images/cerita-anak/gunung.jpg', 'color' => 'blue'],
            ['id' => 35, 'title' => 'Wa Nada', 'shortTitle' => 'Wa Nada', 'year' => '2024', 'description' => 'Cerita tentang Wa Nada.', 'driveLink' => 'https://drive.google.com/file/d/1YlVW9cIWeamwzJy9svDzn-131zh5tFPI/view?usp=drive_link', 'coverImage' => '/images/cerita-anak/wa-nada.jpg', 'color' => 'orange'],
            ['id' => 36, 'title' => 'Perjalanan Pipit', 'shortTitle' => 'Perjalanan Pipit', 'year' => '2024', 'description' => 'Petualangan burung pipit.', 'driveLink' => 'https://drive.google.com/file/d/1Y3vJfRUsNXaNo9RQkNdbvponxB4jjHa7/view?usp=drive_link', 'coverImage' => '/images/cerita-anak/perjalanan-pipit.jpg', 'color' => 'teal'],
            ['id' => 37, 'title' => 'Selendang Anawaingguluri (Sambialano Anawai Ngguluri)', 'shortTitle' => 'Selendang Anawaingguluri', 'year' => '2024', 'description' => 'Cerita tentang selendang ajaib.', 'driveLink' => 'https://drive.google.com/file/d/18JBrcnxviEly0ZtE74M0dVwSGcXBNc6n/view?usp=drive_link', 'coverImage' => '/images/cerita-anak/selendang.jpg', 'color' => 'green'],
            ['id' => 38, 'title' => 'Semangat Aldian', 'shortTitle' => 'Semangat Aldian', 'year' => '2024', 'description' => 'Cerita inspiratif tentang semangat Aldian.', 'driveLink' => 'https://drive.google.com/file/d/1AAtEsZ5taVEVLKjNL7zhme1H5U7nc99X/view?usp=drive_link', 'coverImage' => '/images/cerita-anak/semangat-aldian.jpg', 'color' => 'purple'],
            ['id' => 39, 'title' => 'Petualangan Inalahi Popalia', 'shortTitle' => 'Petualangan Inalahi Popalia', 'year' => '2024', 'description' => 'Petualangan seru Inalahi Popalia.', 'driveLink' => 'https://drive.google.com/file/d/1WQ9RO_aXRserfzuCprVMHDFWQQvINwop/view?usp=drive_link', 'coverImage' => '/images/cerita-anak/inalahi-popalia.jpg', 'color' => 'indigo'],
        ];

        $disclaimer = 'Setiap bahan bacaan agar tidak dicetak tanpa persetujuan dari Kantor Bahasa Sulawesi Tenggara';

        return Inertia::render('Public/Terbitan/CeritaAnak', [
            'books' => $books,
            'disclaimer' => $disclaimer,
            'year' => '2024',
        ]);
    }
}
