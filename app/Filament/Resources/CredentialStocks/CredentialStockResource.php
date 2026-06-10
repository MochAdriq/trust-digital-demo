<?php

namespace App\Filament\Resources\CredentialStocks;

use App\Filament\Resources\CredentialStocks\Pages\CreateCredentialStock;
use App\Filament\Resources\CredentialStocks\Pages\EditCredentialStock;
use App\Filament\Resources\CredentialStocks\Pages\ListCredentialStocks;
use App\Filament\Resources\CredentialStocks\Schemas\CredentialStockForm;
use App\Filament\Resources\CredentialStocks\Tables\CredentialStocksTable;
use App\Models\CredentialStock;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class CredentialStockResource extends Resource
{
    protected static ?string $model = CredentialStock::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedKey;

    protected static ?string $recordTitleAttribute = 'label';

    public static function form(Schema $schema): Schema
    {
        return CredentialStockForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return CredentialStocksTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListCredentialStocks::route('/'),
            'create' => CreateCredentialStock::route('/create'),
            'edit' => EditCredentialStock::route('/{record}/edit'),
        ];
    }
}
