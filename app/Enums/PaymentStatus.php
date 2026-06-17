<?php

namespace App\Enums;

enum PaymentStatus: string
{
    case Unpaid = 'unpaid';
    case Paid = 'paid';
    case Canceled = 'canceled';
    case Failed = 'failed';
    case Expired = 'expired';
}
