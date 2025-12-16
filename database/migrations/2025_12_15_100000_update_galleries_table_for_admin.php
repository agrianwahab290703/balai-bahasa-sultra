<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration to update galleries table for admin CRUD functionality.
 * Adds thumbnail, is_active, and soft deletes support.
 * 
 * @see Requirements 2.1, 2.2, 2.4, 2.5
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('galleries', function (Blueprint $table) {
            // Check and add columns if they don't exist
            if (!Schema::hasColumn('galleries', 'title')) {
                $table->string('title')->nullable()->after('id');
            }
            
            if (!Schema::hasColumn('galleries', 'image')) {
                $table->string('image')->nullable()->after('description');
            }
            
            if (!Schema::hasColumn('galleries', 'thumbnail')) {
                $table->string('thumbnail')->nullable()->after('image');
            }
            
            if (!Schema::hasColumn('galleries', 'is_featured')) {
                $table->boolean('is_featured')->default(false)->after('category');
            }
            
            if (!Schema::hasColumn('galleries', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('is_featured');
            }
            
            if (!Schema::hasColumn('galleries', 'sort_order')) {
                $table->unsignedInteger('sort_order')->default(0)->after('is_active');
            }
            
            if (!Schema::hasColumn('galleries', 'deleted_at')) {
                $table->softDeletes();
            }
        });

        // Add indexes for performance
        Schema::table('galleries', function (Blueprint $table) {
            // Only add indexes if they don't exist
            $indexes = collect(Schema::getIndexes('galleries'))->pluck('name')->toArray();
            
            if (!in_array('galleries_is_featured_index', $indexes)) {
                $table->index('is_featured');
            }
            
            if (!in_array('galleries_is_active_index', $indexes)) {
                $table->index('is_active');
            }
            
            if (!in_array('galleries_sort_order_index', $indexes)) {
                $table->index('sort_order');
            }
        });
    }

    public function down(): void
    {
        Schema::table('galleries', function (Blueprint $table) {
            $table->dropSoftDeletes();
            
            if (Schema::hasColumn('galleries', 'thumbnail')) {
                $table->dropColumn('thumbnail');
            }
            
            if (Schema::hasColumn('galleries', 'is_active')) {
                $table->dropColumn('is_active');
            }
        });
    }
};
