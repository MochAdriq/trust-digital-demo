<?php

namespace App\Services;

use App\Enums\FulfillmentStatus;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\SubscriptionPackage;
use App\Models\Voucher;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class CheckoutService
{
    public function __construct(
        private readonly PointLedgerService $points,
        private readonly OrderFulfillmentService $fulfillment,
        private readonly NotificationService $notifications,
    ) {}

    /**
     * Create an order from validated checkout data.
     *
     * @param  array{email: string, name: string, phone?: string, package_id: int, quantity: int, payment_method: string, pin?: string, customer_input?: string}  $data
     */
    public function createOrder(array $data): Order
    {
        $package = SubscriptionPackage::with('product')->where('is_active', true)->findOrFail($data['package_id']);
        $product = $package->product;
        $quantity = (int) $data['quantity'];
        $email = Str::lower(trim($data['email']));
        $paymentMethod = $data['payment_method'];
        $pointsPrice = $package->points_price ? $package->points_price * $quantity : null;
        $totalPrice = $package->price * $quantity;
        
        $voucher = null;
        if ($paymentMethod === 'voucher') {
            $voucher = $this->validateVoucherPayment($data['voucher_code'] ?? '', $product->id);
        }

        return DB::transaction(function () use ($email, $package, $product, $quantity, $paymentMethod, $pointsPrice, $totalPrice, $data, $voucher): Order {
            $customer = Customer::firstOrCreate(
                ['email' => $email],
                ['points_balance' => 0, 'is_reseller' => false],
            );
            $customer->update([
                'name' => $data['name'] ?? $customer->name,
                'phone' => $data['phone'] ?? $customer->phone,
            ]);

            if (! $customer->pin_hash && filled($data['pin'] ?? null)) {
                $customer->update(['pin_hash' => Hash::make($data['pin'])]);
                $customer->refresh();
            }

            $this->validatePointsPayment($customer, $paymentMethod, $pointsPrice, $data);

            $isPaid = in_array($paymentMethod, ['points', 'voucher']);

            $order = Order::create([
                'order_number' => Order::generateOrderNumber(),
                'customer_id' => $customer->id,
                'status' => $isPaid ? OrderStatus::Paid : OrderStatus::PendingPayment,
                'payment_status' => $isPaid ? PaymentStatus::Paid : PaymentStatus::Unpaid,
                'fulfillment_status' => FulfillmentStatus::Pending,
                'total_price' => $totalPrice,
                'amount_payable' => $isPaid ? 0 : $totalPrice,
                'points_used' => $paymentMethod === 'points' ? $pointsPrice : 0,
                'payment_method' => $paymentMethod === 'points' ? 'points' : ($paymentMethod === 'voucher' ? 'voucher' : 'pending_gateway'),
                'magic_link_token' => Str::random(64),
                'magic_link_expires_at' => now()->addDays(90),
                'paid_at' => $isPaid ? now() : null,
                'customer_note' => $data['customer_input'] ?? null,
            ]);

            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $product->id,
                'product_name' => $product->name . ' - ' . $package->name,
                'product_type' => $product->product_type,
                'quantity' => $quantity,
                'price' => $package->price,
                'points_price' => $package->points_price,
                'customer_input' => $data['customer_input'] ?? null,
                'product_snapshot' => [
                    'name' => $product->name,
                    'package_name' => $package->name,
                    'slug' => $product->slug,
                    'package_slug' => $package->slug,
                    'price' => $package->price,
                    'points_price' => $package->points_price,
                    'product_type' => $product->product_type,
                ],
            ]);

            $customer->update(['last_order_at' => now()]);

            if ($paymentMethod === 'points') {
                $this->points->spendForOrder($order, $pointsPrice, 'Point purchase '.$order->order_number);
                $this->fulfillment->fulfillPaidOrder($order);
                $this->notifications->createForPaidOrder($order->refresh());
            } elseif ($paymentMethod === 'voucher' && $voucher) {
                // Update voucher status
                $voucher->update([
                    'is_used' => true,
                    'used_at' => now(),
                    // Optionally, we could add order_id to voucher if we added it to schema, 
                    // but since we only have redeemed_by which expects User id, we leave it null for customer redemptions
                ]);
                $this->fulfillment->fulfillPaidOrder($order);
                $this->notifications->createForPaidOrder($order->refresh());
            }

            return $order;
        });
    }

    /**
     * Validate points payment prerequisites.
     */
    private function validatePointsPayment(Customer $customer, string $paymentMethod, ?int $pointsPrice, array $data): void
    {
        if ($paymentMethod !== 'points') {
            return;
        }

        if (! $pointsPrice) {
            back()->withErrors(['payment_method' => 'Produk ini belum bisa dibeli dengan poin.'])->throwResponse();
        }

        if (! $customer->pin_hash || ! Hash::check((string) ($data['pin'] ?? ''), $customer->pin_hash)) {
            back()->withErrors(['pin' => 'PIN poin tidak valid.'])->throwResponse();
        }

        if ($customer->points_balance < $pointsPrice) {
            back()->withErrors(['payment_method' => 'Saldo poin tidak cukup untuk membeli produk ini.'])->throwResponse();
        }
    }

    /**
     * Validate voucher payment prerequisites.
     */
    private function validateVoucherPayment(string $code, int $productId): Voucher
    {
        if (blank($code)) {
            back()->withErrors(['voucher_code' => 'Kode voucher harus diisi.'])->throwResponse();
        }

        $voucher = Voucher::where('code', strtoupper(trim($code)))->lockForUpdate()->first();

        if (! $voucher || $voucher->is_used) {
            back()->withErrors(['voucher_code' => 'Voucher tidak valid atau sudah digunakan.'])->throwResponse();
        }

        if ($voucher->product_id !== $productId) {
            back()->withErrors(['voucher_code' => 'Voucher ini tidak berlaku untuk produk ini.'])->throwResponse();
        }

        return $voucher;
    }
}
