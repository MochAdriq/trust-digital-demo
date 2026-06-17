<?php

namespace App\Filament\Resources\Vouchers\Pages;

use App\Filament\Resources\Vouchers\VoucherResource;
use App\Models\Product;
use App\Models\Voucher;
use Filament\Actions\Action;
use Filament\Actions\CreateAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ListRecords;

class ListVouchers extends ListRecords
{
    protected static string $resource = VoucherResource::class;

    protected function getHeaderActions(): array
    {
        return [
            // ============================================================
            // ACTION: Generate Batch Voucher
            // ============================================================
            // Tombol ini memunculkan modal untuk admin memilih produk
            // dan jumlah voucher yang ingin di-generate sekaligus.
            Action::make('generateBatch')
                ->label('Generate Batch Voucher')
                ->icon('heroicon-o-bolt')
                ->color('success')
                ->form([
                    Select::make('product_id')
                        ->label('Produk')
                        ->options(
                            Product::query()
                                ->where('is_active', true)
                                ->where('product_type', 'credential_stock')
                                ->pluck('name', 'id')
                        )
                        ->searchable()
                        ->required(),
                    TextInput::make('quantity')
                        ->label('Jumlah Voucher')
                        ->numeric()
                        ->minValue(1)
                        ->maxValue(500)
                        ->default(10)
                        ->required()
                        ->helperText('Maksimal 500 voucher per batch.'),
                ])
                ->action(function (array $data): void {
                    $product = Product::findOrFail($data['product_id']);
                    $quantity = (int) $data['quantity'];
                    $generated = 0;

                    for ($i = 0; $i < $quantity; $i++) {
                        Voucher::create([
                            'code'       => Voucher::generateCode(),
                            'product_id' => $product->id,
                        ]);
                        $generated++;
                    }

                    Notification::make()
                        ->title('Batch Voucher Berhasil!')
                        ->body("{$generated} voucher berhasil di-generate untuk produk \"{$product->name}\".")
                        ->success()
                        ->send();
                })
                ->modalHeading('Generate Batch Voucher')
                ->modalDescription('Pilih produk dan tentukan jumlah voucher yang ingin di-generate.')
                ->modalSubmitActionLabel('Generate')
                ->requiresConfirmation(false),

            CreateAction::make()
                ->label('Buat Voucher Satuan'),
        ];
    }
}
