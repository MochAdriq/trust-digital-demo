<?php

namespace App\Http\Controllers;

use App\Http\Requests\CheckoutRequest;
use App\Models\Product;
use App\Models\SubscriptionPackage;
use App\Services\CheckoutService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    public function show(string $slug)
    {
        $package = SubscriptionPackage::with('product')
            ->where('is_active', true)
            ->where('slug', $slug)
            ->firstOrFail();

        return Inertia::render('Checkout', [
            'package' => $package,
            'product' => $package->product,
        ]);
    }

    public function verifyVoucher(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string',
            'package_id' => 'required|exists:subscription_packages,id',
        ]);

        $package = SubscriptionPackage::findOrFail($validated['package_id']);
        
        $voucher = \App\Models\Voucher::where('code', strtoupper(trim($validated['code'])))
            ->where('is_used', false)
            ->first();

        if (!$voucher) {
            return response()->json(['valid' => false, 'message' => 'Voucher tidak ditemukan atau sudah digunakan.']);
        }

        if ($voucher->product_id !== $package->product_id) {
            return response()->json(['valid' => false, 'message' => 'Voucher ini tidak berlaku untuk produk ini.']);
        }

        return response()->json([
            'valid' => true,
            'message' => 'Voucher berhasil diterapkan!',
            'voucher' => [
                'code' => $voucher->code
            ]
        ]);
    }

    public function store(Request $request, CheckoutService $checkout)
    {
        $validated = $request->validate([
            'email' => 'required|email|max:255',
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:50',
            'package_id' => 'required|exists:subscription_packages,id',
            'quantity' => 'required|integer|min:1|max:10',
            'payment_method' => 'required|in:gateway,points,voucher',
            'pin' => 'nullable|string|digits:6',
            'customer_input' => 'nullable|string|max:255',
            'voucher_code' => 'nullable|string',
        ]);

        // Pre-check: product must require customer_input if it has a label.
        $package = SubscriptionPackage::with('product')->where('is_active', true)->findOrFail($validated['package_id']);
        $product = $package->product;

        if ($product->customer_input_label && blank($validated['customer_input'] ?? null)) {
            return back()->withErrors([
                'customer_input' => $product->customer_input_label.' wajib diisi.',
            ]);
        }

        $order = $checkout->createOrder($validated);

        return redirect()->route('order.magic.show', $order->magic_link_token);
    }
}
