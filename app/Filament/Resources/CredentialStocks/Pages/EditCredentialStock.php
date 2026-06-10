<?php

namespace App\Filament\Resources\CredentialStocks\Pages;

use App\Filament\Resources\CredentialStocks\CredentialStockResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditCredentialStock extends EditRecord
{
    protected static string $resource = CredentialStockResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
