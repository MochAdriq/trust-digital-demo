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
        Schema::table('credential_stocks', function (Blueprint $table) {
            // Reverse lookup: credential stock ini ditukarkan via voucher mana.
            $table->foreignId('voucher_id')
                ->nullable()
                ->after('delivered_order_id')
                ->constrained()
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('credential_stocks', function (Blueprint $table) {
            $table->dropConstrainedForeignId('voucher_id');
        });
    }
};
