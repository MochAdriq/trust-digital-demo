<?php

namespace App\Filament\Resources\Products\RelationManagers;

use Filament\Actions\AssociateAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class SubscriptionPackagesRelationManager extends RelationManager
{
    protected static string $relationship = 'subscriptionPackages';

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required(),
                TextInput::make('slug')
                    ->required(),
                TextInput::make('duration_text')
                    ->required()
                    ->default('1 Bulan'),
                TextInput::make('price')
                    ->required()
                    ->numeric()
                    ->prefix('Rp'),
                TextInput::make('discount_percentage')
                    ->numeric()
                    ->suffix('%'),
                TextInput::make('points_price')
                    ->numeric()
                    ->label('Points Price'),
                TextInput::make('sort_order')
                    ->required()
                    ->numeric()
                    ->default(0),
                Toggle::make('is_active')
                    ->default(true),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('name')
            ->columns([
                TextColumn::make('name')
                    ->searchable(),
                TextColumn::make('slug')
                    ->searchable(),
                TextColumn::make('duration_text')
                    ->searchable(),
                TextColumn::make('price')
                    ->money()
                    ->sortable(),
                TextColumn::make('discount_percentage')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('points_price')
                    ->money()
                    ->sortable(),
                TextColumn::make('sort_order')
                    ->numeric()
                    ->sortable(),
                IconColumn::make('is_active')
                    ->boolean(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->headerActions([
                CreateAction::make(),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
