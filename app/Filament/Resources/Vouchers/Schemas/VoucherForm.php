<?php

namespace App\Filament\Resources\Vouchers\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class VoucherForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('code')
                    ->label('Kode Voucher')
                    ->maxLength(16)
                    ->unique(ignoreRecord: true)
                    ->placeholder('Auto-generate jika dikosongkan')
                    ->helperText('Kosongkan untuk generate otomatis.'),
                Select::make('product_id')
                    ->relationship('product', 'name')
                    ->searchable()
                    ->preload()
                    ->required(),
                Toggle::make('is_used')
                    ->label('Sudah Digunakan')
                    ->disabled(fn (string $operation) => $operation === 'edit')
                    ->dehydrated(),
                TextInput::make('shopee_order_id')
                    ->label('Shopee Order ID')
                    ->maxLength(100)
                    ->disabled(fn (string $operation) => $operation === 'edit'),
                Select::make('credential_stock_id')
                    ->relationship('credentialStock', 'login_email')
                    ->searchable()
                    ->preload()
                    ->disabled(fn (string $operation) => $operation === 'edit'),
                Select::make('redeemed_by')
                    ->relationship('redeemedByUser', 'name')
                    ->searchable()
                    ->preload()
                    ->disabled(fn (string $operation) => $operation === 'edit'),
                DateTimePicker::make('used_at')
                    ->label('Digunakan Pada')
                    ->disabled(fn (string $operation) => $operation === 'edit'),
            ]);
    }
}
