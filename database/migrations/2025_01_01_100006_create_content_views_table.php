<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('content_views', function (Blueprint $table) {
            $table->id();
            $table->string('content_type'); // news, activity, gallery
            $table->unsignedBigInteger('content_id');
            $table->unsignedBigInteger('view_count')->default(0);
            $table->timestamp('updated_at');
            
            $table->unique(['content_type', 'content_id']);
            $table->index(['content_type', 'content_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('content_views');
    }
};
