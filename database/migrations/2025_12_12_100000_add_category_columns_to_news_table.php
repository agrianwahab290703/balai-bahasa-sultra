<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Add category columns to news table for better content organization
     */
    public function up(): void
    {
        Schema::table('news', function (Blueprint $table) {
            // Primary category (single value)
            if (!Schema::hasColumn('news', 'category')) {
                $table->string('category')->nullable()->after('featured_image');
            }
            
            // Multiple categories as JSON array
            if (!Schema::hasColumn('news', 'categories')) {
                $table->json('categories')->nullable()->after('category');
            }
            
            // Source URL for scraped content
            if (!Schema::hasColumn('news', 'source_url')) {
                $table->string('source_url')->nullable()->after('categories');
            }
            
            // Sentiment analysis result
            if (!Schema::hasColumn('news', 'sentiment')) {
                $table->string('sentiment')->nullable()->after('source_url');
            }
            
            // Validation status
            if (!Schema::hasColumn('news', 'validation_status')) {
                $table->string('validation_status')->default('pending')->after('sentiment');
            }

            // Add index for faster category queries
            $table->index('category');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('news', function (Blueprint $table) {
            $table->dropIndex(['category']);
            $table->dropColumn([
                'category',
                'categories',
                'source_url',
                'sentiment',
                'validation_status',
            ]);
        });
    }
};
