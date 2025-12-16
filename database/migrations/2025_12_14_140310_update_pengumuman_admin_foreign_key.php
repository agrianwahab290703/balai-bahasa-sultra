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
        // Convert string columns to unsignedBigInteger for foreign key
        Schema::table('pengumuman', function (Blueprint $table) {
            $table->unsignedBigInteger('created_by')->change();
            $table->unsignedBigInteger('updated_by')->nullable()->change();
            
            // Add foreign key constraints
            $table->foreign('created_by')->references('id')->on('admin_users');
            $table->foreign('updated_by')->references('id')->on('admin_users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pengumuman', function (Blueprint $table) {
            // Drop foreign key constraints first
            $table->dropForeign(['created_by']);
            $table->dropForeign(['updated_by']);
            
            // Revert columns back to string
            $table->string('created_by')->change();
            $table->string('updated_by')->nullable()->change();
        });
    }
};
