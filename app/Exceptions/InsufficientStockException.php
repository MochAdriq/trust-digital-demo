<?php

namespace App\Exceptions;

use Exception;

class InsufficientStockException extends Exception
{
    public function __construct(string $productName = '')
    {
        parent::__construct(
            $productName
                ? "Stok akun digital untuk produk '{$productName}' sudah habis."
                : 'Stok akun digital untuk produk ini sudah habis.'
        );
    }
}
