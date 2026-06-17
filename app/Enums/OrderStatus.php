<?php

namespace App\Enums;

enum OrderStatus: string
{
    case PendingPayment = 'pending_payment';
    case Paid = 'paid';
    case PaidAwaitingStock = 'paid_awaiting_stock';
    case PaidManualReview = 'paid_manual_review';
    case Completed = 'completed';
    case PaymentFailed = 'payment_failed';

    public function label(): string
    {
        return match ($this) {
            self::PendingPayment => 'Menunggu Pembayaran',
            self::Paid => 'Pembayaran Berhasil',
            self::PaidAwaitingStock => 'Menunggu Stok',
            self::PaidManualReview => 'Diproses Manual',
            self::Completed => 'Selesai',
            self::PaymentFailed => 'Pembayaran Gagal',
        };
    }
}
