<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SubscriptionPackage extends Model
{
    protected $guarded = [];

    protected $appends = ['original_price'];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function getOriginalPriceAttribute()
    {
        if (!$this->discount_percentage || !$this->price) {
            return null;
        }

        $discountFactor = 1 - ($this->discount_percentage / 100);
        if ($discountFactor <= 0) return $this->price;

        return round($this->price / $discountFactor);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
