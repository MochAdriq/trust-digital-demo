<?php

namespace App\Filament\Resources\LoyaltySettings;

use App\Filament\Resources\LoyaltySettings\Pages\CreateLoyaltySetting;
use App\Filament\Resources\LoyaltySettings\Pages\EditLoyaltySetting;
use App\Filament\Resources\LoyaltySettings\Pages\ListLoyaltySettings;
use App\Filament\Resources\LoyaltySettings\Schemas\LoyaltySettingForm;
use App\Filament\Resources\LoyaltySettings\Tables\LoyaltySettingsTable;
use App\Models\LoyaltySetting;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class LoyaltySettingResource extends Resource
{
    protected static ?string $model = LoyaltySetting::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedAdjustmentsHorizontal;

    protected static ?string $recordTitleAttribute = 'name';

    public static function form(Schema $schema): Schema
    {
        return LoyaltySettingForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return LoyaltySettingsTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListLoyaltySettings::route('/'),
            'create' => CreateLoyaltySetting::route('/create'),
            'edit' => EditLoyaltySetting::route('/{record}/edit'),
        ];
    }
}
