<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class SakipController extends Controller
{
    public function dataDukung()
    {
        return Inertia::render('Public/Sakip/DataDukungSakip', [
            'documents' => [
                ['id' => 1, 'title' => 'Bukti Kirim LAKIN melalui SPASIKITA', 'link' => 'https://drive.google.com/file/d/1xA77K99K_olyfLQBhLic1tqf_ZQ19SlI/view', 'type' => 'gdrive'],
                ['id' => 2, 'title' => 'Crosscutting Program Kegiatan', 'link' => 'https://drive.google.com/file/d/1xA77K99K_olyfLQBhLic1tqf_ZQ19SlI/view', 'type' => 'gdrive'],
                ['id' => 3, 'title' => 'Definisi Operasional Tahun 2022', 'link' => 'https://drive.google.com/file/d/1xA77K99K_olyfLQBhLic1tqf_ZQ19SlI/view', 'type' => 'gdrive'],
                ['id' => 4, 'title' => 'DIPA Awal Tahun 2022', 'link' => 'https://drive.google.com/file/d/1xvC_HlB12HaV4Cy1mFoeLgchlCX9Ux20/view?usp=sharing', 'type' => 'gdrive'],
                ['id' => 5, 'title' => 'DIPA Revisi Akhir Tahun 2022', 'link' => 'https://drive.google.com/file/d/1BL8CPyFfMJ9AzEVAcCasnBbM9coW-h5q/view?usp=sharing', 'type' => 'gdrive'],
                ['id' => 6, 'title' => 'DIPA/RKA Tahun 2023', 'link' => 'https://kantorbahasasultra.kemdikbud.go.id/wp-content/uploads/2024/06/DIPA-2023.pdf', 'type' => 'pdf'],
                ['id' => 7, 'title' => 'DIPA/RKA Tahun 2024', 'link' => 'https://kantorbahasasultra.kemdikbud.go.id/wp-content/uploads/2024/06/DIPA-tahun-2024.pdf', 'type' => 'pdf'],
                ['id' => 8, 'title' => 'Hasil Pengukuran Kinerja TW-1', 'link' => 'https://drive.google.com/file/d/1UIoc_qSouJK12nvkC-ZfGnnzP5eXVL0l/view?usp=sharing', 'type' => 'gdrive'],
                ['id' => 9, 'title' => 'Hasil Pengukuran Kinerja TW-2', 'link' => 'https://drive.google.com/file/d/1OOIRUcRDYgvKswoZx-cRaKwZJ3gAIg4i/view?usp=sharing', 'type' => 'gdrive'],
                ['id' => 10, 'title' => 'Hasil Penilaian ZI-WBK dan Sosialisasi Anti Korupsi', 'link' => 'https://drive.google.com/file/d/1ZvP0OhezAUl2lolZfFi4b-lsWSKx6hW7/view?usp=sharing', 'type' => 'gdrive'],
                ['id' => 11, 'title' => 'Indikator Kinerja (LAKIN) Tahun 2021', 'link' => 'https://drive.google.com/file/d/1I_qXqY9uQTeDIP9_OBSSxa45-Z44loYN/view?usp=sharing', 'type' => 'gdrive'],
                ['id' => 12, 'title' => 'Hasil Kinerja Utama (IKU) 2022-2024', 'link' => 'https://drive.google.com/file/d/1I_qXqY9uQTeDIP9_OBSSxa45-Z44loYN/view?usp=sharing', 'type' => 'gdrive'],
                ['id' => 13, 'title' => 'Laporan Bulanan KKLP (Capaian Kinerja)', 'link' => 'https://drive.google.com/file/d/1P2oqy_9g6ES8KyzRumofEygirqUmWLFt/view?usp=sharing', 'type' => 'gdrive'],
                ['id' => 14, 'title' => 'LHE Sakip Tahun 2021', 'link' => 'https://drive.google.com/file/d/1dtJ3ugN8aGb4FcpG9bvxGsWbL9Jbfen6/view?usp=sharing', 'type' => 'gdrive'],
                ['id' => 15, 'title' => 'LHE Sakip Tahun 2022', 'link' => 'https://kantorbahasasultra.kemdikbud.go.id/hal-lhe-sakip-2022.html', 'type' => 'external'],
                ['id' => 16, 'title' => 'Matriks Peran Hasil Tahun 2022', 'link' => 'https://drive.google.com/file/d/1wuxKPPU0nWaM5D2DMgCus0k3AlN6nZWx/view?usp=sharing', 'type' => 'gdrive'],
                ['id' => 17, 'title' => 'Notula Evaluasi Kinerja Awal Tahun', 'link' => 'https://drive.google.com/file/d/1uLLHG6xgzrgQD2Lgb2uuBFHzb2DUfYQ6/view?usp=sharing', 'type' => 'gdrive'],
                ['id' => 18, 'title' => 'Notula Rapat Implementasi SAKIP', 'link' => 'https://drive.google.com/file/d/1ULQZ6Dtpb_rDIearypVv8TIPp7pAQbie/view?usp=sharing', 'type' => 'gdrive'],
                ['id' => 19, 'title' => 'Notula Rapat Pengukuran Kinerja TW-1', 'link' => 'https://drive.google.com/file/d/1Fhwmc4ZF_n8RTeaOZh0xJkR8qwTdZ4Fo/view?usp=sharing', 'type' => 'gdrive'],
                ['id' => 20, 'title' => 'Notula Rapat Pengukuran Kinerja TW-2', 'link' => 'https://drive.google.com/file/d/1d4vR8snVcH9cuxTsn6iwx6KnDl1UBZpJ/view?usp=sharing', 'type' => 'gdrive'],
                ['id' => 21, 'title' => 'Notula Rapat Penyusunan LAKIN 2021', 'link' => 'https://drive.google.com/file/d/1t_ck_ljYTJOuwvgd2SuqkmOH0Nfvh9gb/view?usp=sharing', 'type' => 'gdrive'],
                ['id' => 22, 'title' => 'Notula Rapat Penyusunan POS', 'link' => 'https://drive.google.com/file/d/1sAUdgXW7PW1Cm79Xo7nfBmqDtpJr5mFp/view?usp=sharing', 'type' => 'gdrive'],
                ['id' => 23, 'title' => 'Notula Rapat Revisi Renstra', 'link' => 'https://drive.google.com/file/d/1R4kpEPqMDLkhxmoXmpQzZgAT6bES_Sqh/view?usp=sharing', 'type' => 'gdrive'],
                ['id' => 24, 'title' => 'Notula Rapat Sosialisasi PK', 'link' => 'https://drive.google.com/file/d/1UnK76_N5x0wAR6J2B6xzGLTUUu4C_P0T/view?usp=sharing', 'type' => 'gdrive'],
                ['id' => 25, 'title' => 'Notula Rapat Tindak Lanjut LHE', 'link' => 'https://drive.google.com/file/d/1BRRgHi0-xCt3Eb9IyTB4lV-veVuH5QX3/view?usp=sharing', 'type' => 'gdrive'],
                ['id' => 26, 'title' => 'Perbaikan Dokumen Crosscutting Tahun 2022', 'link' => 'https://drive.google.com/file/d/1pDuYPFoqq7BcNRpKT2ID_Y0B-4ITexqZ/view?usp=sharing', 'type' => 'gdrive'],
                ['id' => 27, 'title' => 'Perjanjian Kinerja (PK) Tahun 2022', 'link' => 'https://drive.google.com/file/d/1FPAR0-F1hz1CxMt2a8jtetmyfzNBPse4/view?usp=sharing', 'type' => 'gdrive'],
                ['id' => 28, 'title' => 'Perjanjian Kinerja (PK) Tahun 2023', 'link' => 'https://kantorbahasasultra.kemdikbud.go.id/wp-content/uploads/2024/06/PK-Gabung-2023.pdf', 'type' => 'pdf'],
                ['id' => 29, 'title' => 'Perjanjian Kinerja (PK) Tahun 2024', 'link' => 'https://kantorbahasasultra.kemdikbud.go.id/wp-content/uploads/2024/06/Perjanjian-Kinerja-2024.pdf', 'type' => 'pdf'],
                ['id' => 30, 'title' => 'Pohon Kinerja Tahun 2022', 'link' => 'https://drive.google.com/file/d/1pDboDJ6X_h_cbBnqBX2jpCjjsj0k4uXf/view?usp=sharing', 'type' => 'gdrive'],
                ['id' => 31, 'title' => 'POS Pengukuran Kinerja Sultra', 'link' => 'https://drive.google.com/file/d/1wpL4kZIs23jV60eGPMcv88t5YM6t2zeU/view?usp=sharing', 'type' => 'gdrive'],
                ['id' => 32, 'title' => 'POS Pengumpulan Data Kinerja', 'link' => 'https://drive.google.com/file/d/1yEdlSlQSt3Nf21GRSXhBz5uP_b3AORSq/view?usp=sharing', 'type' => 'gdrive'],
                ['id' => 33, 'title' => 'POS Juknis Pengumpulan Dana Kinerja Eselon 1', 'link' => 'https://drive.google.com/file/d/1yYBeEYohiFGxGO56NofLbdGv4e4PJlkX/view?usp=sharing', 'type' => 'gdrive'],
                ['id' => 34, 'title' => 'Punisment Pegawai Tahun 2022', 'link' => 'https://drive.google.com/file/d/1_lndQUd9CLx94XRQu5-C6A_KgvJl17Ko/view?usp=sharing', 'type' => 'gdrive'],
                ['id' => 35, 'title' => 'RAB Kegiatan Tahun 2022', 'link' => 'https://drive.google.com/file/d/1yMHS4PWUYwA2vGH9pn6JZf5VInzzWoA-/view?usp=sharing', 'type' => 'gdrive'],
                ['id' => 36, 'title' => 'Rencana Aksi Tahun 2022', 'link' => 'https://drive.google.com/file/d/1Ne88MxguRoDtkKq7vFnZRaeeG5MyYk30/view?usp=sharing', 'type' => 'gdrive'],
                ['id' => 37, 'title' => 'Rencana Aksi Tahun 2023', 'link' => 'https://kantorbahasasultra.kemdikbud.go.id/wp-content/uploads/2023/07/RENCANA-AKSI-KBST-2023.pdf', 'type' => 'pdf'],
                ['id' => 38, 'title' => 'Rencana Aksi Tahun 2024', 'link' => 'https://kantorbahasasultra.kemdikbud.go.id/wp-content/uploads/2024/06/Rencana-Aksi-2024.pdf', 'type' => 'pdf'],
                ['id' => 39, 'title' => 'Renstra Revisi 2020-2024', 'link' => 'https://kantorbahasasultra.kemdikbud.go.id/wp-content/uploads/2023/07/Perbaikan-Revisi-Renstra-2020-2024-1.pdf', 'type' => 'pdf'],
                ['id' => 40, 'title' => 'Reward Penghargaan Pegawai 2022', 'link' => 'https://drive.google.com/file/d/1BurDQwvlHKuF-AXu4j9XCBCDpme9n9Zs/view?usp=sharing', 'type' => 'gdrive'],
                ['id' => 41, 'title' => 'RKA Awal Tahun 2022', 'link' => 'https://drive.google.com/file/d/1Q2kr8tYX_8uhGyRkJjddsJrM_q95bP9r/view?usp=sharing', 'type' => 'gdrive'],
                ['id' => 42, 'title' => 'RKA Revisi Akhir Tahun 2022', 'link' => 'https://drive.google.com/file/d/1FEugLcUQ1IJs0gk4GJfUcF2GNZQXugFV/view?usp=sharing', 'type' => 'gdrive'],
                ['id' => 43, 'title' => 'RKT Renja Tahun 2023', 'link' => 'https://drive.google.com/file/d/1pRl8BeL_Nd7jjRkv0_x6UctkqaoMayRQ/view?usp=sharing', 'type' => 'gdrive'],
                ['id' => 44, 'title' => 'Sertifikasi Diklat SAKIP', 'link' => 'https://drive.google.com/file/d/1czxhTe4nCA_dedB136TFjnlxGsCveak3/view?usp=sharing', 'type' => 'gdrive'],
                ['id' => 45, 'title' => 'SK Tim Penyusunan LAKIN', 'link' => 'https://drive.google.com/file/d/10SS1JcpGJM1ic7R5pa_fTWmOk2SARJ8H/view?usp=sharing', 'type' => 'gdrive'],
                ['id' => 46, 'title' => 'SK Tim Review Laporan Kerja', 'link' => 'https://drive.google.com/file/d/18UWA0o2EPYLUu2MVbMhF7nS0GnwlFBE0/view?usp=sharing', 'type' => 'gdrive'],
                ['id' => 47, 'title' => 'SKP Pegawai Tahun 2022', 'link' => 'https://drive.google.com/file/d/1UKtnrJ_3xmdwvyc_1Wlw81cQM7hCdP2V/view?usp=sharing', 'type' => 'gdrive'],
                ['id' => 48, 'title' => 'Surat Pernyataan Kirim Lakin dan Renstra', 'link' => 'https://kantorbahasasultra.kemdikbud.go.id/hal-surat-pernyataan-kirim-lakin-dan-renstra.html', 'type' => 'external'],
                ['id' => 49, 'title' => 'Surat Pernyataan Reviu Lakin Tahun 2022', 'link' => 'https://drive.google.com/file/d/1cyt1RN7kLsW4kMQlUCt-VJgO02nFJFEB/view?usp=sharing', 'type' => 'gdrive'],
                ['id' => 50, 'title' => 'Target dan Estimasi Capaian IKK Akhir Tahun', 'link' => 'https://drive.google.com/file/d/1L_h2tdVFqvfmxqhf4EaTxyjdsGwZZ1SA/view?usp=sharing', 'type' => 'gdrive'],
                ['id' => 51, 'title' => 'Tindak Lanjut LHE Rekomendasi SAKIP 2021', 'link' => 'https://drive.google.com/file/d/1FRaP-_WJPZvq8nXhJPV0RcY_4-BzX9-J/view?usp=sharing', 'type' => 'gdrive'],
                ['id' => 52, 'title' => 'TOR KAK Tahun 2022', 'link' => 'https://drive.google.com/file/d/1dMeOTabzdJCcnD-SyQqJdQwcBZ0XhUTy/view?usp=sharing', 'type' => 'gdrive'],
                ['id' => 53, 'title' => 'Usulan Mutasi Jabatan Internal Pegawai Tahun 2022', 'link' => 'https://drive.google.com/file/d/1DToc3dffN8uZ-zpYD5a13P40SNGTW2Z2/view?usp=sharing', 'type' => 'gdrive'],
            ],
        ]);
    }

    public function laporanKinerja()
    {
        return Inertia::render('Public/Sakip/LaporanKinerja', [
            'reports' => [
                [
                    'id' => 1,
                    'year' => 2022,
                    'title' => 'Laporan Kinerja Tahun 2022',
                    'description' => 'Laporan Akuntabilitas Kinerja Instansi Pemerintah (LAKIP) Balai Bahasa Provinsi Sulawesi Tenggara Tahun 2022',
                    'link' => 'https://kantorbahasasultra.kemdikbud.go.id/wp-content/uploads/2023/07/LAKIN-KBST-TAHUN-2022-1.pdf',
                    'type' => 'pdf'
                ],
                [
                    'id' => 2,
                    'year' => 2023,
                    'title' => 'Laporan Kinerja Tahun 2023',
                    'description' => 'Laporan Akuntabilitas Kinerja Instansi Pemerintah (LAKIP) Balai Bahasa Provinsi Sulawesi Tenggara Tahun 2023',
                    'link' => 'https://kantorbahasasultra.kemdikbud.go.id/wp-content/uploads/2024/03/LAKIN-KBST-TAHUN-2023-FIX.pdf',
                    'type' => 'pdf'
                ],
                [
                    'id' => 3,
                    'year' => 2024,
                    'title' => 'Laporan Kinerja Tahun 2024',
                    'description' => 'Laporan Akuntabilitas Kinerja Instansi Pemerintah (LAKIP) Balai Bahasa Provinsi Sulawesi Tenggara Tahun 2024',
                    'link' => 'https://balaibahasasultra.kemendikdasmen.go.id/wp-content/uploads/2025/09/LAKIN-2024.pdf',
                    'type' => 'pdf'
                ],
            ],
        ]);
    }

    public function perjanjianKinerja()
    {
        return Inertia::render('Public/Sakip/PerjanjianKinerja');
    }

    public function rencanaAksi()
    {
        return Inertia::render('Public/Sakip/RencanaAksi');
    }

    public function rencanaStrategis()
    {
        return Inertia::render('Public/Sakip/RencanaStrategis');
    }

    public function dipaRka()
    {
        return Inertia::render('Public/Sakip/DipaRka');
    }
}
