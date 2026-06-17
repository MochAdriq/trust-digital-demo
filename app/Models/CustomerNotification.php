<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CustomerNotification extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'payload' => 'array',
            'read_at' => 'datetime',
        ];
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Scope: only unread notifications.
     */
    public function scopeUnread(Builder $query): Builder
    {
        return $query->whereNull('read_at');
    }
}
