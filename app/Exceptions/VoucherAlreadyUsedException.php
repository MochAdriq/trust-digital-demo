<?php

namespace App\Exceptions;

use Exception;

class VoucherAlreadyUsedException extends Exception
{
    public function __construct(string $code = '')
    {
        parent::__construct(
            $code
                ? "Voucher '{$code}' sudah pernah digunakan."
                : 'Voucher ini sudah pernah digunakan.'
        );
    }
}
