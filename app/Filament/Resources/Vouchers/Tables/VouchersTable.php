<?php

namespace App\Filament\Resources\Vouchers\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class VouchersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('code')
                    ->label('Kode Voucher')
                    ->searchable()
                    ->copyable()
                    ->copyMessage('Kode voucher berhasil disalin!')
                    ->sortable()
                    ->fontFamily('mono')
                    ->weight('bold'),
                TextColumn::make('product.name')
                    ->label('Produk')
                    ->searchable()
                    ->sortable(),
                IconColumn::make('is_used')
                    ->label('Status')
                    ->boolean()
                    ->trueIcon('heroicon-o-check-circle')
                    ->falseIcon('heroicon-o-clock')
                    ->trueColor('danger')
                    ->falseColor('success'),
                TextColumn::make('shopee_order_id')
                    ->label('Shopee Order ID')
                    ->searchable()
                    ->placeholder('—')
                    ->toggleable(),
                TextColumn::make('redeemedByUser.name')
                    ->label('Ditukar Oleh')
                    ->placeholder('—')
                    ->toggleable(),
                TextColumn::make('used_at')
                    ->label('Ditukar Pada')
                    ->dateTime()
                    ->sortable()
                    ->placeholder('—')
                    ->toggleable(),
                TextColumn::make('created_at')
                    ->label('Dibuat')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                TernaryFilter::make('is_used')
                    ->label('Status Voucher')
                    ->trueLabel('Sudah Digunakan')
                    ->falseLabel('Belum Digunakan')
                    ->placeholder('Semua'),
                SelectFilter::make('product_id')
                    ->relationship('product', 'name')
                    ->label('Produk')
                    ->searchable()
                    ->preload(),
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
