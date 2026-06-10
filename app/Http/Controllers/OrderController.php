<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Customer;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function track(Request $request)
    {
        return Inertia::render('OrderTracking');
    }

    public function status(Request $request)
    {
        $validated = $request->validate([
            'order_number' => 'required|string',
            'email' => 'required|email',
        ]);

        $customer = Customer::where('email', strtolower(trim($validated['email'])))->first();
        
        if (!$customer) {
            return Inertia::render('OrderTracking', [
                'error' => 'Email pelanggan tidak ditemukan.'
            ]);
        }

        $order = Order::where('order_number', strtoupper(trim($validated['order_number'])))
                       ->where('customer_id', $customer->id)
                       ->first();

        if (!$order) {
            return Inertia::render('OrderTracking', [
                'error' => 'Pesanan tidak ditemukan.'
            ]);
        }

        return redirect()->route('order.magic.show', $order->magic_link_token);
    }

    public function showMagic(string $token)
    {
        $order = Order::with(['customer', 'items', 'deliveredCredentials.product'])
            ->where('magic_link_token', $token)
            ->firstOrFail();

        if ($order->magic_link_expires_at && $order->magic_link_expires_at->isPast()) {
            abort(410, 'Magic link expired.');
        }

        return Inertia::render('OrderMagic', [
            'order' => [
                'order_number' => $order->order_number,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
                'fulfillment_status' => $order->fulfillment_status,
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
                ])->values(),
            ],
            'credentials' => $order->payment_status === 'paid'
                ? $order->deliveredCredentials->map(fn ($credential) => [
                    'label' => $credential->label,
                    'product_name' => $credential->product?->name,
                    'login_email' => $credential->login_email,
                    'login_password' => $credential->login_password,
                    'recovery_information' => $credential->recovery_information,
                    'notes' => $credential->notes,
                ])->values()
                : [],
        ]);
    }
}
