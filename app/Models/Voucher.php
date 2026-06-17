<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Voucher extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'is_used' => 'boolean',
            'used_at' => 'datetime',
        ];
    }

    /**
     * Generate kode voucher acak 16 karakter (uppercase alphanumeric).
     * Menggunakan random_bytes() untuk keamanan kriptografis.
     * Format: XXXX-XXXX-XXXX-XXXX (disimpan tanpa strip).
     */
    public static function generateCode(int $length = 16): string
    {
        do {
            // Gunakan random_bytes untuk keamanan kriptografis
            $code = strtoupper(substr(bin2hex(random_bytes($length)), 0, $length));
        } while (static::where('code', $code)->exists());

        return $code;
    }

    /**
     * Format kode untuk ditampilkan: XXXX-XXXX-XXXX-XXXX
     */
    public function getFormattedCodeAttribute(): string
    {
        return implode('-', str_split($this->code, 4));
    }

    /**
     * Scope: hanya voucher yang belum terpakai.
     */
    public function scopeAvailable($query)
    {
        return $query->where('is_used', false);
    }

    /**
     * Scope: hanya voucher yang sudah terpakai.
     */
    public function scopeUsed($query)
    {
        return $query->where('is_used', true);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function credentialStock(): BelongsTo
    {
        return $this->belongsTo(CredentialStock::class);
    }

    public function redeemedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'redeemed_by');
    }
}
