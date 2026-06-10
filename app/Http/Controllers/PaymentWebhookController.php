<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\PaymentTransaction;
use App\Services\OrderFulfillmentService;
use App\Services\PointLedgerService;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;

class PaymentWebhookController extends Controller
{
    public function midtrans(
        Request $request,
        PointLedgerService $points,
        OrderFulfillmentService $fulfillment,
    ) {
        $serverKey = config('services.midtrans.server_key');

        if (! $serverKey) {
            abort(503, 'Midtrans server key is not configured.');
        }

        $signature = hash('sha512', $request->order_id.$request->status_code.$request->gross_amount.$serverKey);

        if (! hash_equals($signature, (string) $request->signature_key)) {
            abort(403, 'Invalid Midtrans signature.');
        }

        $order = Order::where('order_number', $request->order_id)->firstOrFail();
        $transactionStatus = (string) $request->transaction_status;
        $fraudStatus = (string) $request->fraud_status;
        $isPaid = $transactionStatus === 'settlement'
            || ($transactionStatus === 'capture' && in_array($fraudStatus, ['', 'accept'], true));

        PaymentTransaction::updateOrCreate(
            [
                'provider' => 'midtrans',
                'provider_order_id' => $request->order_id,
            ],
            [
                'order_id' => $order->id,
                'provider_transaction_id' => $request->transaction_id,
                'status' => $transactionStatus,
                'amount' => (int) $request->gross_amount,
                'payload' => $request->all(),
                'paid_at' => $isPaid ? now() : null,
            ],
        );

        if ($isPaid && $order->payment_status !== 'paid') {
            $order->update([
                'status' => 'paid',
                'payment_status' => 'paid',
                'payment_reference' => $request->transaction_id,
                'paid_at' => now(),
            ]);

            $points->earnForOrder($order->refresh());
            $fulfillment->fulfillPaidOrder($order->refresh());
        } elseif (in_array($transactionStatus, ['cancel', 'deny', 'expire', 'failure'], true)) {
            $order->update([
                'status' => 'payment_failed',
                'payment_status' => Arr::get([
                    'cancel' => 'canceled',
                    'deny' => 'failed',
                    'expire' => 'expired',
                    'failure' => 'failed',
                ], $transactionStatus, 'failed'),
            ]);
        }

        return response()->json(['ok' => true]);
    }
}
