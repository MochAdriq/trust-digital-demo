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
        Schema::create('vouchers', function (Blueprint $table) {
            $table->id();

            // Kode voucher unik 16 karakter (uppercase alphanumeric).
            // Di-generate secara acak menggunakan secure random bytes.
            $table->string('code', 16)->unique();

            // Produk yang terkait dengan voucher ini.
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();

            // Status apakah voucher sudah ditukarkan.
            $table->boolean('is_used')->default(false)->index();

            // Waktu voucher ditukarkan.
            $table->timestamp('used_at')->nullable();

            // ID Pesanan dari Shopee untuk jejak audit.
            $table->string('shopee_order_id')->nullable()->index();

            // Credential stock yang diberikan saat penukaran.
            $table->foreignId('credential_stock_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            // User (kasir) yang melakukan penukaran.
            $table->foreignId('redeemed_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vouchers');
    }
};
