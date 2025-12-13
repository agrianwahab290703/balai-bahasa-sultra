<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pengumuman', function (Blueprint $table) {
            $table->id();
            $table->string('judul');
            $table->string('slug')->unique();
            $table->longText('konten');
            $table->enum('tipe', ['umum', 'urgent', 'tanggal_spesifik'])->default('umum');
            $table->date('tanggal_berlaku')->nullable();
            $table->enum('status', ['draft', 'active', 'expired'])->default('draft');
            $table->integer('prioritas')->default(0);
            $table->text('meta_description')->nullable();
            $table->string('created_by');
            $table->string('updated_by')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pengumuman');
    }
};
