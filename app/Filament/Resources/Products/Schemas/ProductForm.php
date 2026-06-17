<?php

namespace App\Filament\Resources\Products\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\TagsInput;
use Filament\Schemas\Schema;

class ProductForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('category_id')
                    ->relationship('category', 'name')
                    ->searchable()
                    ->preload()
                    ->required(),
                TextInput::make('name')
                    ->required(),
                TextInput::make('slug')
                    ->required(),
                Textarea::make('description')
                    ->columnSpanFull(),
                TagsInput::make('features')
                    ->label('Keunggulan Berlangganan')
                    ->placeholder('Misal: Akses penuh semua fitur, Garansi 100%')
                    ->columnSpanFull(),
                TextInput::make('rating')
                    ->numeric()
                    ->inputMode('decimal')
                    ->step(0.1)
                    ->minValue(0)
                    ->maxValue(5)
                    ->label('Rating (Bintang)'),
                TextInput::make('total_users')
                    ->numeric()
                    ->label('Total Pengguna'),
                Select::make('product_type')
                    ->options([
                        'credential_stock' => 'Credential Stock',
                        'voucher_code' => 'Voucher Code',
                        'manual_topup' => 'Manual Top Up',
                        'social_boost' => 'Social Boost',
                    ])
                    ->default('credential_stock')
                    ->required(),
                TextInput::make('price')
                    ->required()
                    ->numeric()
                    ->prefix('Rp'),
                TextInput::make('discount_percentage')
                    ->label('Persentase Diskon (%)')
                    ->numeric()
                    ->minValue(0)
                    ->maxValue(100)
                    ->suffix('%')
                    ->helperText('Otomatis menghitung dan menampilkan "harga coret" yang lebih tinggi di katalog produk.'),
                TextInput::make('points_price')
                    ->label('Harga Poin')
                    ->numeric()
                    ->helperText('Jumlah poin yang dibutuhkan untuk membeli produk ini.'),
                FileUpload::make('image')
                    ->image(),
                TextInput::make('customer_input_label'),
                TextInput::make('customer_input_placeholder'),
                TextInput::make('stock_alert_threshold')
                    ->required()
                    ->numeric()
                    ->default(0),
                Toggle::make('is_active')
                    ->default(true),
            ]);
    }
}
