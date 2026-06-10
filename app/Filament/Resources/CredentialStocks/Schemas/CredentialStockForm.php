<?php

namespace App\Filament\Resources\CredentialStocks\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class CredentialStockForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('product_id')
                    ->relationship('product', 'name')
                    ->searchable()
                    ->preload()
                    ->required(),
                Select::make('status')
                    ->options([
                        'available' => 'Available',
                        'reserved' => 'Reserved',
                        'delivered' => 'Delivered',
                        'replaced' => 'Replaced',
                        'revoked' => 'Revoked',
                    ])
                    ->default('available')
                    ->required(),
                TextInput::make('label')
                    ->maxLength(255),
                TextInput::make('login_email')
                    ->label('Credential Email / Username')
                    ->maxLength(255),
                TextInput::make('login_password')
                    ->password()
                    ->revealable(),
                Textarea::make('recovery_information')
                    ->columnSpanFull(),
                Textarea::make('notes')
                    ->columnSpanFull(),
                Select::make('reserved_order_id')
                    ->relationship('reservedOrder', 'order_number')
                    ->searchable()
                    ->preload(),
                Select::make('delivered_order_id')
                    ->relationship('deliveredOrder', 'order_number')
                    ->searchable()
                    ->preload(),
                DateTimePicker::make('reserved_at'),
                DateTimePicker::make('delivered_at'),
            ]);
    }
}
