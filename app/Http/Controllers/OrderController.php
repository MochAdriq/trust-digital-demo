<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Order;
use App\Presenters\OrderPresenter;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function track()
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

        if (! $customer) {
            return Inertia::render('OrderTracking', [
                'error' => 'Email pelanggan tidak ditemukan.',
            ]);
        }

        $order = Order::where('order_number', strtoupper(trim($validated['order_number'])))
            ->where('customer_id', $customer->id)
            ->first();

        if (! $order) {
            return Inertia::render('OrderTracking', [
                'error' => 'Pesanan tidak ditemukan.',
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
            'customer_notification_token' => $order->customer->notification_token,
            'order' => OrderPresenter::toMagicArray($order),
            'credentials' => OrderPresenter::credentialsArray($order),
        ]);
    }
}
