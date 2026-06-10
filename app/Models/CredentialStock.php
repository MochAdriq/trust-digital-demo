<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CredentialStock extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'login_password' => 'encrypted',
            'recovery_information' => 'encrypted',
            'notes' => 'encrypted',
            'reserved_at' => 'datetime',
            'delivered_at' => 'datetime',
        ];
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function reservedOrder(): BelongsTo
    {
        return $this->belongsTo(Order::class, 'reserved_order_id');
    }

    public function deliveredOrder(): BelongsTo
    {
        return $this->belongsTo(Order::class, 'delivered_order_id');
    }
}
