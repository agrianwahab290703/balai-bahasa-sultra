<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('standar_pelayanans', 'category')) {
            Schema::table('standar_pelayanans', function (Blueprint $table) {
                $table->dropIndex('standar_pelayanans_category_index');
                $table->dropColumn('category');
            });
        }

        Schema::table('standar_pelayanans', function (Blueprint $table) {
            $table->enum('document_type', ['file', 'link'])->default('file')->after('description');
            $table->string('external_url', 2048)->nullable()->after('document_type');
            $table->timestamp('last_downloaded_at')->nullable()->after('download_count');
        });

        DB::table('standar_pelayanans')
            ->orderBy('id')
            ->chunkById(100, function ($documents) {
                foreach ($documents as $document) {
                    $isExternal = is_string($document->url)
                        && preg_match('/^https?:\/\//i', $document->url);

                    DB::table('standar_pelayanans')
                        ->where('id', $document->id)
                        ->update([
                            'document_type' => $isExternal ? 'link' : 'file',
                            'external_url' => $isExternal ? $document->url : null,
                        ]);
                }
            });
    }

    public function down(): void
    {
        Schema::table('standar_pelayanans', function (Blueprint $table) {
            $table->dropColumn(['document_type', 'external_url', 'last_downloaded_at']);
        });

        Schema::table('standar_pelayanans', function (Blueprint $table) {
            $table->string('category')->default('general')->after('description');
            $table->index('category');
        });
    }
};