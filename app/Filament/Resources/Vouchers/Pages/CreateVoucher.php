<?php

namespace App\Filament\Resources\Vouchers\Pages;

use App\Filament\Resources\Vouchers\VoucherResource;
use App\Models\Voucher;
use Filament\Resources\Pages\CreateRecord;

class CreateVoucher extends CreateRecord
{
    protected static string $resource = VoucherResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        // Auto-generate kode jika tidak diisi manual
        if (empty($data['code'])) {
            $data['code'] = Voucher::generateCode();
        } else {
            $data['code'] = strtoupper(trim($data['code']));
        }

        return $data;
    }
}
