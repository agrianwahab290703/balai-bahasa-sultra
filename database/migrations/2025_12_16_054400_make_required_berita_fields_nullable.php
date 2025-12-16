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
            // Make additional fields nullable
            $table->string('sumber_rilis')->nullable()->change();
            $table->string('author')->nullable()->change();
            $table->string('lokasi')->nullable()->change();
            $table->string('biro')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('berita', function (Blueprint $table) {
            // Revert to NOT NULL (note: may fail if null values exist)
            $table->string('sumber_rilis')->nullable(false)->change();
            $table->string('author')->nullable(false)->change();
            $table->string('lokasi')->nullable(false)->change();
            $table->string('biro')->nullable(false)->change();
        });
    }
};
