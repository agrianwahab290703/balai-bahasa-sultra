<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Updates ppid_contents table to support hierarchical content structure
     * with categories (Profil, Informasi Publik, Permohonan, Keberatan)
     * and sub-categories for Informasi Publik
     */
    public function up(): void
    {
        Schema::table('ppid_contents', function (Blueprint $table) {
            // Rename 'type' to 'category' for clarity
            $table->renameColumn('type', 'category');
        });

        Schema::table('ppid_contents', function (Blueprint $table) {
            // Add new columns for hierarchical structure
            $table->string('sub_category')->nullable()->after('category');
            $table->string('slug')->unique()->after('title');
            $table->string('image_path')->nullable()->after('content');
            $table->string('document_path')->nullable()->after('image_path');
            $table->enum('status', ['draft', 'published'])->default('published')->after('document_path');
            $table->timestamp('published_at')->useCurrent()->after('status');
            $table->foreignId('created_by')->nullable()->after('published_at')->constrained('admin_users')->nullOnDelete();
            
            // Update content column to longText for rich HTML content
            $table->longText('content')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ppid_contents', function (Blueprint $table) {
            $table->dropForeign(['created_by']);
            $table->dropColumn([
                'sub_category',
                'slug',
                'image_path',
                'document_path',
                'status',
                'published_at',
                'created_by'
            ]);
        });

        Schema::table('ppid_contents', function (Blueprint $table) {
            $table->renameColumn('category', 'type');
            $table->text('content')->nullable()->change();
        });
    }
};
