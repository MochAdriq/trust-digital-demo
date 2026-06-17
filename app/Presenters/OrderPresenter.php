<?php

namespace App\Presenters;

use App\Enums\PaymentStatus;
use App\Models\CredentialStock;
use App\Models\Order;

class OrderPresenter
{
    /**
     * Shape order data for Inertia props.
     */
    public static function toMagicArray(Order $order): array
    {
        return [
            'order_number' => $order->order_number,
            'status' => $order->status->value,
            'payment_status' => $order->payment_status->value,
            'fulfillment_status' => $order->fulfillment_status->value,
            'total_price' => $order->total_price,
            'amount_payable' => $order->amount_payable,
            'points_used' => $order->points_used,
            'points_earned' => $order->points_earned,
            'payment_method' => $order->payment_method,
            'paid_at' => $order->paid_at,
            'fulfilled_at' => $order->fulfilled_at,
            'created_at' => $order->created_at,
            'customer_email' => $order->customer->email,
            'items' => $order->items->map(fn ($item) => [
                'product_name' => $item->product_name,
                'product_type' => $item->product_type,
                'quantity' => $item->quantity,
                'price' => $item->price,
                'points_price' => $item->points_price,
                'customer_input' => $item->customer_input,
            ])->values()->toArray(),
        ];
    }

    /**
     * Shape delivered credentials for Inertia props.
     */
    public static function credentialsArray(Order $order): array
    {
        if ($order->payment_status !== PaymentStatus::Paid) {
            return [];
        }

        return $order->deliveredCredentials->map(fn (CredentialStock $c) => [
            'label' => $c->label,
            'product_name' => $c->product?->name,
            'login_email' => $c->login_email,
            'login_password' => $c->login_password,
            'recovery_information' => $c->recovery_information,
            'notes' => $c->notes,
        ])->values()->toArray();
    }
}
