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
        Schema::create('standar_pelayanans', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->string('category'); // UKBI, BIPA, Ahli Bahasa, Penerjemah, Perpustakaan, Data, Umum
            $table->string('url');
            $table->string('file_type')->default('pdf');
            $table->bigInteger('file_size')->nullable(); // in bytes
            $table->unsignedInteger('download_count')->default(0);
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            // Indexes for better query performance
            $table->index('category');
            $table->index('is_active');
            $table->index(['is_active', 'sort_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('standar_pelayanans');
    }
};
