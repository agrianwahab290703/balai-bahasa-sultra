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
        Schema::create('keberatans', function (Blueprint $table) {
            $table->id();
            
            // Nomor registrasi keberatan (unique identifier)
            $table->string('nomor_registrasi', 50)->unique();
            
            // Data Pemohon Keberatan
            $table->string('nama_lengkap');
            $table->text('alamat');
            $table->string('pekerjaan');
            $table->string('email');
            $table->string('telepon', 20);
            $table->string('nomor_registrasi_permohonan', 50); // Reference to original permohonan
            $table->enum('hubungan_dengan_pemohon', ['pemohon_sendiri', 'kuasa_pemohon']);
            
            // Detail Keberatan
            $table->enum('alasan_keberatan', [
                'permohonan_ditolak',
                'informasi_tidak_sesuai',
                'tidak_ditanggapi',
                'biaya_tidak_wajar',
                'waktu_tidak_sesuai',
                'lainnya'
            ]);
            $table->text('tujuan_penggunaan_informasi');
            $table->text('informasi_yang_diminta');
            $table->text('kronologi_keberatan');
            $table->string('dokumen_pendukung')->nullable(); // File path if uploaded
            
            // Status & Tracking
            $table->enum('status', ['pending', 'dalam_proses', 'selesai', 'ditolak'])->default('pending');
            $table->timestamp('tanggal_pengajuan')->nullable();
            $table->timestamp('tanggal_keputusan')->nullable();
            $table->text('keputusan')->nullable(); // Decision from Atasan PPID
            $table->text('catatan_admin')->nullable(); // Admin notes
            
            $table->timestamps();
            
            // Indexes for faster queries
            $table->index('email');
            $table->index('status');
            $table->index('tanggal_pengajuan');
            $table->index('nomor_registrasi_permohonan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('keberatans');
    }
};
