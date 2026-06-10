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
        Schema::create('credential_stocks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('reserved_order_id')->nullable()->constrained('orders')->nullOnDelete();
            $table->foreignId('delivered_order_id')->nullable()->constrained('orders')->nullOnDelete();
            $table->string('label')->nullable();
            $table->string('login_email')->nullable();
            $table->text('login_password')->nullable();
            $table->text('recovery_information')->nullable();
            $table->text('notes')->nullable();
            $table->string('status')->default('available')->index();
            $table->timestamp('reserved_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('credential_stocks');
    }
};
