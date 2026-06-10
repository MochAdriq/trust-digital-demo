<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LoyaltySetting extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public static function active(): self
    {
        return static::query()->where('is_active', true)->first()
            ?? static::query()->create([
                'name' => 'Default',
                'is_active' => true,
                'points_per_1000_idr' => 1,
                'minimum_paid_amount' => 10000,
            ]);
    }
}
