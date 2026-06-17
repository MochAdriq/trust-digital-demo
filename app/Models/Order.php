<?php

namespace App\Models;

use App\Enums\FulfillmentStatus;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Order extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'status' => OrderStatus::class,
            'payment_status' => PaymentStatus::class,
            'fulfillment_status' => FulfillmentStatus::class,
            'total_price' => 'integer',
            'amount_payable' => 'integer',
            'points_used' => 'integer',
            'points_earned' => 'integer',
            'magic_link_expires_at' => 'datetime',
            'paid_at' => 'datetime',
            'fulfilled_at' => 'datetime',
        ];
    }

    /**
     * Generate a unique order number in format: TRX-YYMMDD-XXXXXX.
     */
    public static function generateOrderNumber(): string
    {
        do {
            $number = 'TRX-'.now()->format('ymd').'-'.Str::upper(Str::random(6));
        } while (static::where('order_number', $number)->exists());

        return $number;
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class, 'order_id');
    }

    public function paymentTransactions(): HasMany
    {
        return $this->hasMany(PaymentTransaction::class);
    }

    public function deliveredCredentials(): HasMany
    {
        return $this->hasMany(CredentialStock::class, 'delivered_order_id');
    }
}
