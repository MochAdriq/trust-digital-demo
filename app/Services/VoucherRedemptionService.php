<?php

namespace App\Services;

use App\Exceptions\InsufficientStockException;
use App\Exceptions\VoucherAlreadyUsedException;
use App\Exceptions\VoucherNotFoundException;
use App\Models\CredentialStock;
use App\Models\User;
use App\Models\Voucher;
use Illuminate\Support\Facades\DB;

class VoucherRedemptionService
{
    /**
     * Menukarkan kode voucher dengan CredentialStock (akun digital).
     *
     * Proses ini menggunakan Database Transaction dan Pessimistic Locking
     * untuk mencegah Race Condition dan Double Redemption.
     *
     * @param  string  $code          Kode voucher yang akan ditukar
     * @param  string  $shopeeOrderId ID Pesanan dari Shopee (untuk jejak audit)
     * @param  User    $cashier       User kasir yang melakukan penukaran
     * @return array   Detail credential yang diberikan
     *
     * @throws VoucherNotFoundException    Jika kode voucher tidak ditemukan
     * @throws VoucherAlreadyUsedException Jika voucher sudah pernah digunakan
     * @throws InsufficientStockException  Jika stok akun digital habis
     */
    public function redeem(string $code, string $shopeeOrderId, User $cashier): array
    {
        return DB::transaction(function () use ($code, $shopeeOrderId, $cashier): array {
            // ========================================================
            // STEP 1: Ambil voucher dengan Pessimistic Lock
            // ========================================================
            // lockForUpdate() mengunci baris ini di database sehingga
            // tidak ada transaksi lain yang bisa membaca/mengubah baris
            // ini sampai transaksi ini selesai (commit/rollback).
            // Ini MENCEGAH race condition jika kasir menekan tombol
            // berkali-kali secara cepat (double-click).
            $voucher = Voucher::query()
                ->where('code', strtoupper(trim($code)))
                ->lockForUpdate()
                ->first();

            // Validasi: voucher harus ada
            if (! $voucher) {
                throw new VoucherNotFoundException($code);
            }

            // Validasi: voucher belum pernah digunakan
            if ($voucher->is_used) {
                throw new VoucherAlreadyUsedException($code);
            }

            // ========================================================
            // STEP 2: Ambil CredentialStock yang available dengan
            //         Pessimistic Lock
            // ========================================================
            // lockForUpdate() juga diterapkan pada CredentialStock
            // untuk mencegah race condition dimana dua transaksi
            // berbeda mengambil credential yang sama secara bersamaan.
            // Hanya satu transaksi yang bisa mengunci baris ini;
            // transaksi lain akan menunggu (blocking) sampai lock
            // dilepas.
            $credential = CredentialStock::query()
                ->where('product_id', $voucher->product_id)
                ->where('status', 'available')
                ->lockForUpdate()
                ->first();

            // Validasi: stok credential harus tersedia
            if (! $credential) {
                throw new InsufficientStockException(
                    $voucher->product?->name ?? ''
                );
            }

            // ========================================================
            // STEP 3: Update voucher sebagai sudah terpakai
            // ========================================================
            $voucher->update([
                'is_used'             => true,
                'used_at'             => now(),
                'shopee_order_id'     => $shopeeOrderId,
                'credential_stock_id' => $credential->id,
                'redeemed_by'         => $cashier->id,
            ]);

            // ========================================================
            // STEP 4: Update credential stock sebagai delivered
            // ========================================================
            $credential->update([
                'status'       => 'delivered',
                'voucher_id'   => $voucher->id,
                'delivered_at' => now(),
            ]);

            // ========================================================
            // STEP 5: Return detail credential untuk ditampilkan
            //         ke kasir
            // ========================================================
            return [
                'voucher'    => [
                    'code'            => $voucher->code,
                    'formatted_code'  => $voucher->formatted_code,
                    'shopee_order_id' => $shopeeOrderId,
                    'used_at'         => $voucher->used_at->toDateTimeString(),
                ],
                'product'    => [
                    'name' => $voucher->product->name,
                ],
                'credential' => [
                    'login_email'          => $credential->login_email,
                    'login_password'       => $credential->login_password,
                    'recovery_information' => $credential->recovery_information,
                    'notes'                => $credential->notes,
                ],
            ];
        });
    }
}
