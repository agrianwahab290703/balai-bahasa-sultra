<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('berita', function (Blueprint $table) {
            // Add missing konten field first
            if (!Schema::hasColumn('berita', 'konten')) {
                $table->longText('konten')->nullable()->after('ringkasan_inti');
            }

            // Struktur berita fields - check if exists first
            if (!Schema::hasColumn('berita', 'lead_paragraph')) {
                $table->text('lead_paragraph')->nullable()->after('konten');
            }
            if (!Schema::hasColumn('berita', 'quote_pejabat_utama')) {
                $table->text('quote_pejabat_utama')->nullable()->after('konteks_latar_belakang');
            }
            if (!Schema::hasColumn('berita', 'nama_pejabat')) {
                $table->string('nama_pejabat', 150)->nullable()->after('quote_pejabat_utama');
            }
            if (!Schema::hasColumn('berita', 'jabatan_pejabat')) {
                $table->string('jabatan_pejabat', 200)->nullable()->after('nama_pejabat');
            }
            if (!Schema::hasColumn('berita', 'mekanisme_penilaian')) {
                $table->text('mekanisme_penilaian')->nullable()->after('data_capaian_kinerja');
            }
            if (!Schema::hasColumn('berita', 'kesimpulan_komitmen')) {
                $table->text('kesimpulan_komitmen')->nullable()->after('mekanisme_penilaian');
            }

            // Dateline fields
            if (!Schema::hasColumn('berita', 'lokasi_rilis')) {
                $table->string('lokasi_rilis', 100)->nullable()->after('sumber_rilis');
            }
            if (!Schema::hasColumn('berita', 'tanggal_rilis')) {
                $table->date('tanggal_rilis')->nullable()->after('lokasi_rilis');
            }

            // Additional metadata
            if (!Schema::hasColumn('berita', 'biro')) {
                $table->string('biro', 100)->nullable()->after('author');
            }
            if (!Schema::hasColumn('berita', 'tags')) {
                $table->json('tags')->nullable()->after('view_count');
            }

            // Add published_at field
            if (!Schema::hasColumn('berita', 'published_at')) {
                $table->timestamp('published_at')->nullable()->after('tags');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('berita', function (Blueprint $table) {
            $table->dropColumn([
                'lead_paragraph',
                'konteks_latar_belakang',
                'quote_pejabat_utama',
                'nama_pejabat',
                'jabatan_pejabat',
                'data_capaian_kinerja',
                'mekanisme_penilaian',
                'kesimpulan_komitmen',
                'lokasi_rilis',
                'tanggal_rilis',
                'biro',
                'tags'
            ]);
        });
    }
};