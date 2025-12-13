<?php

namespace Database\Seeders;

use App\Models\StandarPelayanan;
use Illuminate\Database\Seeder;

class StandarPelayananSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $documents = [
            [
                'title' => 'Maklumat Pelayanan',
                'description' => 'Maklumat pelayanan publik Balai Bahasa Provinsi Sulawesi Tenggara sebagai bentuk komitmen dalam memberikan pelayanan terbaik kepada masyarakat',
                'category' => StandarPelayanan::CATEGORY_UMUM,
                'url' => 'https://balaibahasasultra.kemendikdasmen.go.id/wp-content/uploads/2025/11/SK-MAKLUMAT-PELAYANAN-2025.pdf',
                'file_type' => 'pdf',
                'file_size' => 256000, // ~250KB
                'sort_order' => 1,
            ],
            [
                'title' => 'Standar Pelayanan Uji Kemahiran Berbahasa Indonesia (UKBI)',
                'description' => 'Standar pelayanan pengujian kemahiran berbahasa Indonesia untuk mengukur tingkat kemahiran berbahasa Indonesia seseorang',
                'category' => StandarPelayanan::CATEGORY_UKBI,
                'url' => 'https://balaibahasasultra.kemendikdasmen.go.id/wp-content/uploads/2025/11/STANDAR-PELAYANAN-UKBI.pdf',
                'file_type' => 'pdf',
                'file_size' => 512000, // ~500KB
                'sort_order' => 2,
            ],
            [
                'title' => 'Standar Pelayanan Bahasa Indonesia bagi Penutur Asing (BIPA)',
                'description' => 'Standar pelayanan pembelajaran Bahasa Indonesia untuk penutur asing yang ingin mempelajari bahasa Indonesia',
                'category' => StandarPelayanan::CATEGORY_BIPA,
                'url' => 'https://balaibahasasultra.kemendikdasmen.go.id/wp-content/uploads/2025/11/STANDAR-PELAYANAN-BIPA.pdf',
                'file_type' => 'pdf',
                'file_size' => 384000, // ~375KB
                'sort_order' => 3,
            ],
            [
                'title' => 'Standar Pelayanan Ahli Bahasa',
                'description' => 'Standar pelayanan untuk sertifikasi dan pengembangan kompetensi ahli bahasa Indonesia',
                'category' => StandarPelayanan::CATEGORY_AHLI_BAHASA,
                'url' => 'https://balaibahasasultra.kemendikdasmen.go.id/wp-content/uploads/2025/11/STANDAR-PELAYANAN-AHLI-BAHASA.pdf',
                'file_type' => 'pdf',
                'file_size' => 448000, // ~437KB
                'sort_order' => 4,
            ],
            [
                'title' => 'Standar Pelayanan Penerjemah',
                'description' => 'Standar pelayanan untuk kegiatan penerjemahan dari bahasa Indonesia ke bahasa asing atau sebaliknya',
                'category' => StandarPelayanan::CATEGORY_PENERJEMAH,
                'url' => 'https://balaibahasasultra.kemendikdasmen.go.id/wp-content/uploads/2025/11/STANDAR-PELAYANAN-PENERJEMAHAN.pdf',
                'file_type' => 'pdf',
                'file_size' => 320000, // ~312KB
                'sort_order' => 5,
            ],
            [
                'title' => 'Standar Pelayanan Perpustakaan',
                'description' => 'Standar pelayanan perpustakaan untuk akses informasi dan literasi kebahasaan dan kesastraan',
                'category' => StandarPelayanan::CATEGORY_PERPUSTAKAAN,
                'url' => 'https://balaibahasasultra.kemendikdasmen.go.id/wp-content/uploads/2025/11/STANDAR-PELAYANAN-PERPUSTAKAAN.pdf',
                'file_type' => 'pdf',
                'file_size' => 288000, // ~281KB
                'sort_order' => 6,
            ],
            [
                'title' => 'Standar Pelayanan Data dan Informasi',
                'description' => 'Standar pelayanan untuk akses dan permintaan data serta informasi kebahasaan dan kesastraan',
                'category' => StandarPelayanan::CATEGORY_DATA,
                'url' => 'https://balaibahasasultra.kemendikdasmen.go.id/wp-content/uploads/2025/11/STANDAR-PELAYANAN-DATA-DAN-INFORMASI.pdf',
                'file_type' => 'pdf',
                'file_size' => 192000, // ~187KB
                'sort_order' => 7,
            ],
        ];

        foreach ($documents as $document) {
            StandarPelayanan::updateOrCreate(
                ['title' => $document['title']],
                $document
            );
        }
    }
}
