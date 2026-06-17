<?php

namespace App\Http\Controllers;

use App\Exceptions\InsufficientStockException;
use App\Exceptions\VoucherAlreadyUsedException;
use App\Exceptions\VoucherNotFoundException;
use App\Http\Requests\RedeemVoucherRequest;
use App\Services\VoucherRedemptionService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class VoucherRedemptionController extends Controller
{
    public function __construct(
        private readonly VoucherRedemptionService $redemptionService,
    ) {}

    /**
     * Tampilkan halaman form penukaran voucher (untuk kasir).
     */
    public function index(): Response
    {
        return Inertia::render('Cashier/VoucherRedemption');
    }

    /**
     * Proses penukaran voucher.
     */
    public function redeem(RedeemVoucherRequest $request): RedirectResponse
    {
        try {
            $result = $this->redemptionService->redeem(
                code: $request->validated('code'),
                shopeeOrderId: $request->validated('shopee_order_id'),
                cashier: $request->user(),
            );

            return back()->with('redemption', $result);
        } catch (VoucherNotFoundException $e) {
            return back()->withErrors([
                'code' => $e->getMessage(),
            ])->withInput();
        } catch (VoucherAlreadyUsedException $e) {
            return back()->withErrors([
                'code' => $e->getMessage(),
            ])->withInput();
        } catch (InsufficientStockException $e) {
            return back()->withErrors([
                'code' => $e->getMessage(),
            ])->withInput();
        }
    }
}
