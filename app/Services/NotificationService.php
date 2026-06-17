<?php

namespace App\Services;

use App\Mail\OrderPaidNotification;
use App\Models\CredentialStock;
use App\Models\CustomerNotification;
use App\Models\Order;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class NotificationService
{
    /**
     * Create a persistent notification for a paid order and send email.
     */
    public function createForPaidOrder(Order $order): ?CustomerNotification
    {
        try {
            $order->loadMissing(['customer', 'items', 'deliveredCredentials.product']);

            $customer = $order->customer;

            // Ensure the customer has a notification token for accessing the notifications page.
            if (! $customer->notification_token) {
                $customer->update(['notification_token' => Str::random(64)]);
                $customer->refresh();
            }

            // Build credential payload.
            $credentials = $order->deliveredCredentials->map(fn (CredentialStock $c) => [
                'label' => $c->label,
                'product_name' => $c->product?->name,
                'login_email' => $c->login_email,
                'login_password' => $c->login_password,
                'recovery_information' => $c->recovery_information,
                'notes' => $c->notes,
            ])->values()->toArray();

            $items = $order->items->map(fn ($item) => [
                'product_name' => $item->product_name,
                'quantity' => $item->quantity,
                'price' => $item->price,
            ])->values()->toArray();

            $totalPrice = $order->total_price;
            $credentialCount = count($credentials);

            $notification = CustomerNotification::create([
                'customer_id' => $customer->id,
                'order_id' => $order->id,
                'type' => 'payment_success',
                'title' => 'Pembayaran Berhasil - '.$order->order_number,
                'message' => "Pembayaran untuk pesanan {$order->order_number} telah berhasil."
                    .($credentialCount > 0
                        ? " {$credentialCount} akun telah dikirimkan kepada Anda."
                        : ' Pesanan sedang diproses.'),
                'payload' => [
                    'order_number' => $order->order_number,
                    'total_price' => $totalPrice,
                    'items' => $items,
                    'credentials' => $credentials,
                    'paid_at' => $order->paid_at?->toIso8601String(),
                ],
            ]);

            // Send email notification.
            Mail::to($customer->email)->send(new OrderPaidNotification($order, $credentials, $customer->notification_token));

            return $notification;
        } catch (\Throwable $e) {
            // Log but never let notification errors break the checkout flow.
            report($e);

            return null;
        }
    }
}
