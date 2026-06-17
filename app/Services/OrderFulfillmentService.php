<?php

namespace App\Services;

use App\Enums\FulfillmentStatus;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
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

            if ($order->payment_status !== PaymentStatus::Paid) {
                return $order;
            }

            if (in_array($order->fulfillment_status, [FulfillmentStatus::Fulfilled, FulfillmentStatus::ManualReview], true)) {
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
                        'status' => OrderStatus::PaidAwaitingStock,
                        'fulfillment_status' => FulfillmentStatus::AwaitingStock,
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
                    'status' => OrderStatus::PaidManualReview,
                    'fulfillment_status' => FulfillmentStatus::ManualReview,
                ]);

                return $order->refresh();
            }

            $order->update([
                'status' => OrderStatus::Completed,
                'fulfillment_status' => FulfillmentStatus::Fulfilled,
                'fulfilled_at' => now(),
            ]);

            return $order->refresh();
        });
    }
}
