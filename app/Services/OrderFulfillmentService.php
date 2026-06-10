<?php

namespace App\Services;

use App\Models\CredentialStock;
use App\Models\Order;
use Illuminate\Support\Facades\DB;

class OrderFulfillmentService
{
    public function fulfillPaidOrder(Order $order): Order
    {
        return DB::transaction(function () use ($order): Order {
            $order = Order::query()
                ->with('items')
                ->lockForUpdate()
                ->findOrFail($order->id);

            if ($order->payment_status !== 'paid') {
                return $order;
            }

            if (in_array($order->fulfillment_status, ['fulfilled', 'manual_review'], true)) {
                return $order;
            }

            $requiresManualReview = false;

            foreach ($order->items as $item) {
                if (! in_array($item->product_type, ['credential_stock', 'voucher_code'], true)) {
                    $requiresManualReview = true;
                    continue;
                }

                $available = CredentialStock::query()
                    ->where('product_id', $item->product_id)
                    ->where('status', 'available')
                    ->count();

                if ($available < $item->quantity) {
                    $order->update([
                        'status' => 'paid_awaiting_stock',
                        'fulfillment_status' => 'awaiting_stock',
                    ]);

                    return $order->refresh();
                }

                for ($i = 0; $i < $item->quantity; $i++) {
                    $credential = CredentialStock::query()
                        ->where('product_id', $item->product_id)
                        ->where('status', 'available')
                        ->lockForUpdate()
                        ->firstOrFail();

                    $credential->update([
                        'status' => 'delivered',
                        'reserved_order_id' => $order->id,
                        'delivered_order_id' => $order->id,
                        'reserved_at' => now(),
                        'delivered_at' => now(),
                    ]);
                }
            }

            if ($requiresManualReview) {
                $order->update([
                    'status' => 'paid_manual_review',
                    'fulfillment_status' => 'manual_review',
                ]);

                return $order->refresh();
            }

            $order->update([
                'status' => 'completed',
                'fulfillment_status' => 'fulfilled',
                'fulfilled_at' => now(),
            ]);

            return $order->refresh();
        });
    }
}
