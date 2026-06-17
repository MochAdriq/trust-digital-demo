<?php

namespace App\Exceptions;

use Exception;

class VoucherNotFoundException extends Exception
{
    public function __construct(string $code = '')
    {
        parent::__construct(
            $code
                ? "Voucher dengan kode '{$code}' tidak ditemukan."
                : 'Kode voucher tidak valid.'
        );
    }
}
