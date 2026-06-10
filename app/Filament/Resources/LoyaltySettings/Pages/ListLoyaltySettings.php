<?php

namespace App\Filament\Resources\LoyaltySettings\Pages;

use App\Filament\Resources\LoyaltySettings\LoyaltySettingResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListLoyaltySettings extends ListRecords
{
    protected static string $resource = LoyaltySettingResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
