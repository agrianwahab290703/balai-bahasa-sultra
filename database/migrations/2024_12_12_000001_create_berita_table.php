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
        Schema::create('berita', function (Blueprint $table) {
            $table->id();
            $table->string('judul_utama'); // Headline
            $table->string('slug')->unique(); // SEO-friendly URL
            $table->text('ringkasan_inti'); // Ringkasan inti peristiwa untuk meta
            $table->string('hero_image'); // Path ke hero image
            $table->string('hero_image_alt'); // Alt text untuk accessibility
            $table->string('lokasi')->default('Jakarta'); // Lokasi berita
            $table->date('tanggal_rilis'); // Tanggal rilis
            $table->text('teras_berita'); // Lead paragraph (5W+1H)

            // Body sections
            $table->longText('konteks_latar_belakang')->nullable(); // Sub-Bagian 1
            $table->longText('quote_pejabat')->nullable(); // Sub-Bagian 2
            $table->string('nama_pejabat')->nullable(); // Nama pejabat yang di-quote
            $table->string('jabatan_pejabat')->nullable(); // Jabatan pejabat
            $table->longText('data_capaian_kinerja')->nullable(); // Sub-Bagian 3
            $table->json('statistik_kinerja')->nullable(); // Data JSON untuk statistik
            $table->longText('mekanisme_penilaian')->nullable(); // Sub-Bagian 4
            $table->longText('kesimpulan_komitmen')->nullable(); // Sub-Bagian 5

            // Metadata
            $table->string('kategori'); // Kategori berita (zi-wbk, kegiatan, pengumuman, dll)
            $table->string('sub_kategori')->nullable(); // Sub-kategori
            $table->string('tag')->nullable(); // Tags untuk SEO
            $table->boolean('is_published')->default(false);
            $table->boolean('is_featured')->default(false);
            $table->integer('view_count')->default(0);
            $table->string('author')->default('Admin');
            $table->string('sumber_rilis')->default('Biro Komunikasi dan Hubungan Masyarakat');

            // SEO & Social Media
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->string('og_image')->nullable(); // Open Graph image

            $table->timestamps();

            // Indexes
            $table->index('slug');
            $table->index('kategori');
            $table->index('is_published');
            $table->index('is_featured');
            $table->index('tanggal_rilis');
        });

        // Create galeri_foto table
        Schema::create('galeri_foto_berita', function (Blueprint $table) {
            $table->id();
            $table->foreignId('berita_id')->constrained('berita')->onDelete('cascade');
            $table->string('file_path'); // Path ke file foto
            $table->string('file_name'); // Nama asli file
            $table->string('caption')->nullable(); // Caption foto
            $table->string('alt_text')->nullable(); // Alt text untuk accessibility
            $table->integer('urutan')->default(0); // Urutan tampil
            $table->enum('tipe', ['hero', 'gallery', 'thumbnail'])->default('gallery');
            $table->timestamps();

            $table->index('berita_id');
            $table->index('tipe');
            $table->index('urutan');
        });

        // Create berita_related table untuk berita terkait
        Schema::create('berita_related', function (Blueprint $table) {
            $table->id();
            $table->foreignId('berita_id')->constrained('berita')->onDelete('cascade');
            $table->foreignId('related_berita_id')->constrained('berita')->onDelete('cascade');
            $table->timestamps();

            $table->unique(['berita_id', 'related_berita_id']);
            $table->index('berita_id');
            $table->index('related_berita_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('berita_related');
        Schema::dropIfExists('galeri_foto_berita');
        Schema::dropIfExists('berita');
    }
};