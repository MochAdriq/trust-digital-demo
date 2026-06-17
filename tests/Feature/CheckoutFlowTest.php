<?php

namespace Tests\Feature;

use App\Enums\FulfillmentStatus;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Category;
use App\Models\CredentialStock;
use App\Models\Customer;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class CheckoutFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_email_checkout_creates_pending_gateway_order_with_magic_link(): void
    {
        $product = $this->createProduct();

        $response = $this->post('/checkout', [
            'email' => 'Buyer@Example.com',
            'product_id' => $product->id,
            'quantity' => 1,
            'payment_method' => 'gateway',
        ]);

        $customer = Customer::where('email', 'buyer@example.com')->firstOrFail();
        $order = $customer->orders()->firstOrFail();

        $response->assertRedirect(route('order.magic.show', $order->magic_link_token, absolute: false));
        $this->assertSame(OrderStatus::PendingPayment, $order->status);
        $this->assertSame(PaymentStatus::Unpaid, $order->payment_status);
        $this->assertSame('pending_gateway', $order->payment_method);
        $this->assertSame(35000, $order->total_price);
        $this->assertNotEmpty($order->magic_link_token);
    }

    public function test_points_checkout_fulfills_available_credential_stock(): void
    {
        $product = $this->createProduct();
        $customer = Customer::create([
            'email' => 'reseller@example.com',
            'pin_hash' => Hash::make('123456'),
            'points_balance' => 50,
            'is_reseller' => true,
        ]);

        CredentialStock::create([
            'product_id' => $product->id,
            'label' => 'Netflix Stock 1',
            'login_email' => 'stock@example.com',
            'login_password' => 'secret',
            'status' => 'available',
        ]);

        $response = $this->post('/checkout', [
            'email' => 'reseller@example.com',
            'product_id' => $product->id,
            'quantity' => 1,
            'payment_method' => 'points',
            'pin' => '123456',
        ]);

        $order = $customer->orders()->firstOrFail();

        $response->assertRedirect(route('order.magic.show', $order->magic_link_token, absolute: false));
        $this->assertSame(OrderStatus::Completed, $order->fresh()->status);
        $this->assertSame(PaymentStatus::Paid, $order->fresh()->payment_status);
        $this->assertSame(FulfillmentStatus::Fulfilled, $order->fresh()->fulfillment_status);
        $this->assertSame(15, $customer->fresh()->points_balance);

        $credential = CredentialStock::where('login_email', 'stock@example.com')->firstOrFail();
        $this->assertSame('delivered', $credential->status);
        $this->assertSame($order->id, $credential->delivered_order_id);
    }

    private function createProduct(): Product
    {
        $category = Category::create([
            'name' => 'Akun Premium',
            'slug' => 'akun-premium',
            'is_active' => true,
        ]);

        return Product::create([
            'category_id' => $category->id,
            'name' => 'Netflix Premium 1 Bulan',
            'slug' => 'netflix-premium-1-bulan',
            'description' => 'Akun premium demo.',
            'product_type' => 'credential_stock',
            'price' => 35000,
            'points_price' => 35,
            'is_active' => true,
        ]);
    }
}
