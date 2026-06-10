<?php

namespace App\Filament\Resources\LoyaltySettings\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class LoyaltySettingForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required(),
                Toggle::make('is_active')
                    ->default(true),
                TextInput::make('points_per_1000_idr')
                    ->label('Points per Rp1.000')
                    ->required()
                    ->numeric()
                    ->default(1),
                TextInput::make('minimum_paid_amount')
                    ->label('Minimum Paid Amount')
                    ->required()
                    ->numeric()
                    ->prefix('Rp')
                    ->default(10000),
            ]);
    }
}
