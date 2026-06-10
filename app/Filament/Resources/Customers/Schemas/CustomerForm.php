<?php

namespace App\Filament\Resources\Customers\Schemas;

use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;
use Illuminate\Support\Facades\Hash;

class CustomerForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('email')
                    ->email()
                    ->required()
                    ->unique(ignoreRecord: true),
                TextInput::make('pin_hash')
                    ->label('Set / Reset PIN Poin')
                    ->password()
                    ->revealable()
                    ->minLength(6)
                    ->maxLength(6)
                    ->dehydrateStateUsing(fn (?string $state): ?string => filled($state) ? Hash::make($state) : null)
                    ->dehydrated(fn (?string $state): bool => filled($state))
                    ->afterStateHydrated(fn ($component) => $component->state(null))
                    ->helperText('Kosongkan jika tidak ingin mengubah PIN. PIN disimpan sebagai hash.'),
                TextInput::make('points_balance')
                    ->required()
                    ->numeric()
                    ->default(0),
                Toggle::make('is_reseller')
                    ->default(false),
                Placeholder::make('last_order_at')
                    ->content(fn ($record): string => $record?->last_order_at?->format('d M Y H:i') ?? '-'),
            ]);
    }
}
