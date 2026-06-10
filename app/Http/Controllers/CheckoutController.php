<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Services\OrderFulfillmentService;
use App\Services\PointLedgerService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class CheckoutController extends Controller
{
    public function store(
        Request $request,
        PointLedgerService $points,
        OrderFulfillmentService $fulfillment,
    )
    {
        $validated = $request->validate([
            'email' => 'required|email|max:255',
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1|max:10',
            'payment_method' => 'required|in:gateway,points',
            'pin' => 'nullable|string|digits:6',
            'customer_input' => 'nullable|string|max:255',
        ]);

        $product = Product::where('is_active', true)->findOrFail($validated['product_id']);
        $quantity = (int) $validated['quantity'];
        $email = Str::lower(trim($validated['email']));
        $paymentMethod = $validated['payment_method'];
        $pointsPrice = $product->points_price ? $product->points_price * $quantity : null;
        $totalPrice = $product->price * $quantity;

        if ($product->customer_input_label && blank($validated['customer_input'] ?? null)) {
            return back()->withErrors([
                'customer_input' => $product->customer_input_label.' wajib diisi.',
            ]);
        }

        $order = DB::transaction(function () use ($email, $product, $quantity, $paymentMethod, $pointsPrice, $totalPrice, $validated, $points, $fulfillment) {
            $customer = Customer::firstOrCreate(
                ['email' => $email],
                ['points_balance' => 0, 'is_reseller' => false],
            );

            if (! $customer->pin_hash && filled($validated['pin'] ?? null)) {
                $customer->update(['pin_hash' => Hash::make($validated['pin'])]);
                $customer->refresh();
            }

            if ($paymentMethod === 'points') {
                if (! $pointsPrice) {
                    back()->withErrors(['payment_method' => 'Produk ini belum bisa dibeli dengan poin.'])->throwResponse();
                }

                if (! $customer->pin_hash || ! Hash::check((string) ($validated['pin'] ?? ''), $customer->pin_hash)) {
                    back()->withErrors(['pin' => 'PIN poin tidak valid.'])->throwResponse();
                }

                if ($customer->points_balance < $pointsPrice) {
                    back()->withErrors(['payment_method' => 'Saldo poin tidak cukup untuk membeli produk ini.'])->throwResponse();
                }
            }

            $order = Order::create([
                'order_number' => $this->generateOrderNumber(),
                'customer_id' => $customer->id,
                'status' => $paymentMethod === 'points' ? 'paid' : 'pending_payment',
                'payment_status' => $paymentMethod === 'points' ? 'paid' : 'unpaid',
                'fulfillment_status' => 'pending',
                'total_price' => $totalPrice,
                'amount_payable' => $paymentMethod === 'points' ? 0 : $totalPrice,
                'points_used' => $paymentMethod === 'points' ? $pointsPrice : 0,
                'payment_method' => $paymentMethod === 'points' ? 'points' : 'pending_gateway',
                'magic_link_token' => Str::random(64),
                'magic_link_expires_at' => now()->addDays(90),
                'paid_at' => $paymentMethod === 'points' ? now() : null,
                'customer_note' => $validated['customer_input'] ?? null,
            ]);

            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $product->id,
                'product_name' => $product->name,
                'product_type' => $product->product_type,
                'quantity' => $quantity,
                'price' => $product->price,
                'points_price' => $product->points_price,
                'customer_input' => $validated['customer_input'] ?? null,
                'product_snapshot' => [
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'price' => $product->price,
                    'points_price' => $product->points_price,
                    'product_type' => $product->product_type,
                ],
            ]);

            $customer->update(['last_order_at' => now()]);

            if ($paymentMethod === 'points') {
                $points->spendForOrder($order, $pointsPrice, 'Point purchase '.$order->order_number);
                $fulfillment->fulfillPaidOrder($order);
            }

            return $order;
        });

        return redirect()->route('order.magic.show', $order->magic_link_token);
    }

    private function generateOrderNumber(): string
    {
        do {
            $number = 'TRX-'.now()->format('ymd').'-'.Str::upper(Str::random(6));
        } while (Order::where('order_number', $number)->exists());

        return $number;
    }
}
