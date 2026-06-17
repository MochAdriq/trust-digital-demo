<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    protected $guarded = [];

    protected $appends = ['original_price'];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'features' => 'array',
        ];
    }

    public function getOriginalPriceAttribute()
    {
        if (!$this->discount_percentage || !$this->price) {
            return null;
        }

        // Formula: Final Price = Original Price * (1 - Discount/100)
        // So: Original Price = Final Price / (1 - Discount/100)
        $discountFactor = 1 - ($this->discount_percentage / 100);
        if ($discountFactor <= 0) return $this->price; // Avoid division by zero if discount is 100% or more

        return round($this->price / $discountFactor);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function credentialStocks(): HasMany
    {
        return $this->hasMany(CredentialStock::class);
    }

    public function vouchers(): HasMany
    {
        return $this->hasMany(Voucher::class);
    }

    public function subscriptionPackages(): HasMany
    {
        return $this->hasMany(SubscriptionPackage::class);
    }
}
