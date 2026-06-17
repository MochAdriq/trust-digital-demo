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
        Schema::table('products', function (Blueprint $table) {
            $table->json('features')->nullable()->after('description');
            $table->decimal('rating', 2, 1)->nullable()->after('features');
            $table->unsignedInteger('total_users')->nullable()->default(0)->after('rating');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['features', 'rating', 'total_users']);
        });
    }
};
