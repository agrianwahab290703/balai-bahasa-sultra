<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\News;
use App\Models\Activity;
use App\Models\Service;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DummyDataSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        $user = User::firstOrCreate(
            ['email' => 'admin@balaibahasa.go.id'],
            [
                'name' => 'Administrator',
                'password' => bcrypt('password'),
            ]
        );

        // Create News
        $newsData = [
            [
                'title' => 'Pelatihan Bahasa Indonesia untuk Penutur Asing Tahun 2025',
                'excerpt' => 'Balai Bahasa Sulawesi Tenggara menyelenggarakan pelatihan BIPA untuk meningkatkan kemampuan berbahasa Indonesia bagi warga negara asing.',
                'content' => '<p>Balai Bahasa Kemendikdasmen Sulawesi Tenggara dengan bangga mengumumkan program Pelatihan Bahasa Indonesia untuk Penutur Asing (BIPA) tahun 2025. Program ini dirancang untuk membantu warga negara asing yang tinggal atau bekerja di Indonesia dalam meningkatkan kemampuan berbahasa Indonesia mereka.</p><p>Pelatihan akan dilaksanakan secara intensif selama 3 bulan dengan materi yang mencakup tata bahasa, kosakata, percakapan sehari-hari, dan pengenalan budaya Indonesia. Peserta akan mendapatkan sertifikat resmi dari Kemendikdasmen setelah menyelesaikan program.</p>',
                'featured_image' => 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800',
            ],
            [
                'title' => 'Lomba Menulis Cerpen Tingkat Provinsi Sulawesi Tenggara',
                'excerpt' => 'Dalam rangka memperingati Bulan Bahasa, Balai Bahasa mengadakan lomba menulis cerpen untuk pelajar dan mahasiswa.',
                'content' => '<p>Balai Bahasa Kemendikdasmen Sulawesi Tenggara mengundang seluruh pelajar dan mahasiswa untuk berpartisipasi dalam Lomba Menulis Cerpen Tingkat Provinsi. Lomba ini merupakan bagian dari rangkaian kegiatan Bulan Bahasa 2025.</p><p>Tema cerpen adalah "Kearifan Lokal Sulawesi Tenggara dalam Perspektif Generasi Muda". Hadiah menarik menanti para pemenang, termasuk uang tunai dan kesempatan untuk menerbitkan karya di antologi nasional.</p>',
                'featured_image' => 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800',
            ],
            [
                'title' => 'Seminar Nasional Pelestarian Bahasa Daerah',
                'excerpt' => 'Seminar membahas strategi pelestarian bahasa daerah di era digital dengan menghadirkan pakar linguistik nasional.',
                'content' => '<p>Dalam upaya melestarikan kekayaan bahasa daerah di Indonesia, Balai Bahasa Sulawesi Tenggara menyelenggarakan Seminar Nasional Pelestarian Bahasa Daerah. Acara ini menghadirkan para pakar linguistik dari berbagai universitas terkemuka di Indonesia.</p><p>Seminar akan membahas tantangan dan peluang pelestarian bahasa daerah di era digital, termasuk pemanfaatan teknologi untuk dokumentasi dan pembelajaran bahasa daerah.</p>',
                'featured_image' => 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
            ],
        ];

        $newsData[] = [
            'title' => 'Workshop Penulisan Karya Ilmiah untuk Guru',
            'excerpt' => 'Workshop ini bertujuan meningkatkan kemampuan guru dalam menulis karya ilmiah yang berkualitas.',
            'content' => '<p>Balai Bahasa Sulawesi Tenggara bekerja sama dengan Dinas Pendidikan Provinsi menyelenggarakan Workshop Penulisan Karya Ilmiah untuk Guru. Kegiatan ini bertujuan untuk meningkatkan kompetensi guru dalam menghasilkan karya tulis ilmiah yang berkualitas.</p>',
            'featured_image' => 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800',
        ];

        $newsData[] = [
            'title' => 'Peluncuran Kamus Digital Bahasa Tolaki',
            'excerpt' => 'Kamus digital bahasa Tolaki resmi diluncurkan sebagai upaya pelestarian bahasa daerah Sulawesi Tenggara.',
            'content' => '<p>Balai Bahasa Kemendikdasmen Sulawesi Tenggara dengan bangga meluncurkan Kamus Digital Bahasa Tolaki. Kamus ini merupakan hasil kerja keras tim peneliti selama 3 tahun dan berisi lebih dari 10.000 entri kata.</p>',
            'featured_image' => 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800',
        ];

        $newsData[] = [
            'title' => 'Festival Sastra Sulawesi Tenggara 2025',
            'excerpt' => 'Festival tahunan yang menampilkan berbagai pertunjukan sastra dan budaya dari seluruh kabupaten/kota.',
            'content' => '<p>Festival Sastra Sulawesi Tenggara 2025 akan diselenggarakan pada bulan Oktober mendatang. Festival ini akan menampilkan berbagai pertunjukan sastra, pembacaan puisi, teater, dan pameran buku dari seluruh kabupaten/kota di Sulawesi Tenggara.</p>',
            'featured_image' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
        ];

        foreach ($newsData as $index => $data) {
            News::create([
                'title' => $data['title'],
                'slug' => Str::slug($data['title']),
                'excerpt' => $data['excerpt'],
                'content' => $data['content'],
                'featured_image' => $data['featured_image'],
                'status' => 'published',
                'published_at' => now()->subDays($index),
                'user_id' => $user->id,
            ]);
        }

        // Create Activities
        $activityData = [
            [
                'title' => 'Sosialisasi Penggunaan Bahasa Indonesia yang Baik dan Benar',
                'description' => 'Kegiatan sosialisasi kepada aparatur sipil negara tentang penggunaan bahasa Indonesia yang baik dan benar dalam administrasi pemerintahan.',
                'location' => 'Aula Kantor Gubernur Sulawesi Tenggara',
                'event_date' => now()->addDays(7),
            ],
            [
                'title' => 'Pelatihan Jurnalistik untuk Siswa SMA',
                'description' => 'Pelatihan dasar jurnalistik untuk siswa SMA se-Kota Kendari dalam rangka meningkatkan literasi media.',
                'location' => 'Balai Bahasa Sulawesi Tenggara',
                'event_date' => now()->addDays(14),
            ],
            [
                'title' => 'Diskusi Sastra: Karya Sastra Lokal dalam Kurikulum',
                'description' => 'Diskusi tentang pentingnya memasukkan karya sastra lokal dalam kurikulum pendidikan di Sulawesi Tenggara.',
                'location' => 'Perpustakaan Daerah Sulawesi Tenggara',
                'event_date' => now()->addDays(21),
            ],
            [
                'title' => 'Kunjungan Edukasi ke Sekolah-sekolah',
                'description' => 'Program kunjungan edukasi ke sekolah-sekolah untuk memperkenalkan program dan layanan Balai Bahasa.',
                'location' => 'Berbagai Sekolah di Kendari',
                'event_date' => now()->addDays(28),
            ],
            [
                'title' => 'Pelatihan Penerjemahan Dokumen Resmi',
                'description' => 'Pelatihan penerjemahan dokumen resmi dari bahasa Indonesia ke bahasa Inggris dan sebaliknya.',
                'location' => 'Balai Bahasa Sulawesi Tenggara',
                'event_date' => now()->addDays(35),
            ],
            [
                'title' => 'Lomba Debat Bahasa Indonesia Tingkat SMP',
                'description' => 'Kompetisi debat bahasa Indonesia untuk siswa SMP se-Sulawesi Tenggara.',
                'location' => 'Gedung Kesenian Kendari',
                'event_date' => now()->addDays(42),
            ],
        ];

        foreach ($activityData as $data) {
            Activity::create([
                'title' => $data['title'],
                'slug' => Str::slug($data['title']),
                'description' => $data['description'],
                'location' => $data['location'],
                'event_date' => $data['event_date'],
                'status' => 'published',
                'user_id' => $user->id,
            ]);
        }


        // Create Services
        $serviceData = [
            [
                'name' => 'Konsultasi Kebahasaan',
                'description' => 'Layanan konsultasi gratis tentang penggunaan bahasa Indonesia yang baik dan benar, termasuk ejaan, tata bahasa, dan pemilihan kata.',
                'icon' => '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" /></svg>',
            ],
            [
                'name' => 'Penyuntingan Naskah',
                'description' => 'Layanan penyuntingan naskah untuk memastikan penggunaan bahasa yang tepat dalam dokumen resmi, karya ilmiah, dan publikasi.',
                'icon' => '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>',
            ],
            [
                'name' => 'Pelatihan Bahasa',
                'description' => 'Program pelatihan bahasa Indonesia untuk berbagai kalangan, termasuk BIPA, pelatihan jurnalistik, dan penulisan kreatif.',
                'icon' => '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" /></svg>',
            ],
            [
                'name' => 'Perpustakaan Digital',
                'description' => 'Akses ke koleksi digital buku, jurnal, dan referensi kebahasaan dan kesastraan Indonesia.',
                'icon' => '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>',
            ],
        ];

        foreach ($serviceData as $index => $data) {
            Service::create([
                'name' => $data['name'],
                'slug' => Str::slug($data['name']),
                'description' => $data['description'],
                'icon' => $data['icon'],
                'sort_order' => $index,
                'is_active' => true,
                'user_id' => $user->id,
            ]);
        }
    }
}
