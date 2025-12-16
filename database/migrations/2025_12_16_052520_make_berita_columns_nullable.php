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
            // Make columns nullable that were previously NOT NULL
            $table->text('ringkasan_inti')->nullable()->change();
            $table->string('hero_image')->nullable()->change();
            $table->string('hero_image_alt')->nullable()->change();
            $table->string('kategori')->nullable()->change();
            $table->date('tanggal_rilis')->nullable()->change();
            $table->text('teras_berita')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('berita', function (Blueprint $table) {
            // Revert to NOT NULL (note: may fail if null values exist)
            $table->text('ringkasan_inti')->nullable(false)->change();
            $table->string('hero_image')->nullable(false)->change();
            $table->string('hero_image_alt')->nullable(false)->change();
            $table->string('kategori')->nullable(false)->change();
            $table->date('tanggal_rilis')->nullable(false)->change();
            $table->text('teras_berita')->nullable(false)->change();
        });
    }
};
