<?php

namespace App\Enums;

enum FulfillmentStatus: string
{
    case Pending = 'pending';
    case AwaitingStock = 'awaiting_stock';
    case ManualReview = 'manual_review';
    case Fulfilled = 'fulfilled';
}
