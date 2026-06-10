<?php

namespace App\Filament\Resources\CredentialStocks\Pages;

use App\Filament\Resources\CredentialStocks\CredentialStockResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListCredentialStocks extends ListRecords
{
    protected static string $resource = CredentialStockResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
