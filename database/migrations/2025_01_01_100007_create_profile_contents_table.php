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
        Schema::create('profile_contents', function (Blueprint $table) {
            $table->id();
            $table->string('type')->index(); // sejarah, visi-misi, struktur, tugas-fungsi
            $table->string('title');
            $table->text('content');
            $table->json('images')->nullable(); // Array of image paths
            $table->json('metadata')->nullable(); // Additional data like stats, dates, etc.
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profile_contents');
    }
};
