<?php

namespace App\Filament\Resources\LoyaltySettings\Pages;

use App\Filament\Resources\LoyaltySettings\LoyaltySettingResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditLoyaltySetting extends EditRecord
{
    protected static string $resource = LoyaltySettingResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
