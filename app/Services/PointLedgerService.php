<?php

namespace App\Services;

use App\Models\Customer;
use App\Models\LoyaltySetting;
use App\Models\Order;
use App\Models\PointLedgerEntry;
use Illuminate\Support\Facades\DB;

class PointLedgerService
{
    public function spendForOrder(Order $order, int $points, string $description = 'Point purchase'): void
    {
        if ($points <= 0) {
            return;
        }

        DB::transaction(function () use ($order, $points, $description): void {
            $customer = Customer::query()->lockForUpdate()->findOrFail($order->customer_id);

            if ($customer->points_balance < $points) {
                throw new \RuntimeException('Insufficient points balance.');
            }

            $customer->decrement('points_balance', $points);
            $customer->refresh();

            PointLedgerEntry::create([
                'customer_id' => $customer->id,
                'order_id' => $order->id,
                'type' => 'spend',
                'points_delta' => -$points,
                'balance_after' => $customer->points_balance,
                'description' => $description,
            ]);
        });
    }

    public function earnForOrder(Order $order): int
    {
        if ($order->payment_method === 'points') {
            return 0;
        }

        $setting = LoyaltySetting::active();

        if (! $setting->is_active || $order->total_price < $setting->minimum_paid_amount) {
            return 0;
        }

        $earned = (int) floor($order->total_price / 1000) * $setting->points_per_1000_idr;

        if ($earned <= 0) {
            return 0;
        }

        DB::transaction(function () use ($order, $earned): void {
            $customer = Customer::query()->lockForUpdate()->findOrFail($order->customer_id);

            // Use firstOrCreate with unique index [order_id, type] to prevent double-earn
            // even under concurrent webhook calls.
            $entry = PointLedgerEntry::firstOrCreate(
                ['order_id' => $order->id, 'type' => 'earn'],
                [
                    'customer_id' => $customer->id,
                    'points_delta' => $earned,
                    'balance_after' => $customer->points_balance + $earned,
                    'description' => 'Earned from paid order '.$order->order_number,
                ],
            );

            // If the entry already existed (created by a previous webhook call), skip increment.
            if (! $entry->wasRecentlyCreated) {
                return;
            }

            $customer->increment('points_balance', $earned);
            $order->update(['points_earned' => $earned]);
        });

        return $earned;
    }
}
