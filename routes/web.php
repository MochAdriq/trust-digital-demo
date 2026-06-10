<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentWebhookController;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/produk', [HomeController::class, 'produk'])->name('produk.index');
Route::get('/product/{slug}', [HomeController::class, 'show'])->name('product.show');

Route::get('/promo', [HomeController::class, 'promo'])->name('promo');
Route::get('/reseller', [HomeController::class, 'reseller'])->name('reseller');
Route::get('/faq', [HomeController::class, 'faq'])->name('faq');

Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');

Route::get('/track', [OrderController::class, 'track'])->name('order.track');
Route::post('/track', [OrderController::class, 'status'])->name('order.status');
Route::get('/orders/{token}', [OrderController::class, 'showMagic'])->name('order.magic.show');

Route::post('/payments/midtrans/notification', [PaymentWebhookController::class, 'midtrans'])
    ->name('payments.midtrans.notification');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
