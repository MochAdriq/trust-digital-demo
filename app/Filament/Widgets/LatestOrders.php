<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\Orders\OrderResource;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget;

class LatestOrders extends TableWidget
{
    protected static ?int $sort = 2;

    protected int | string | array $columnSpan = 'full';

    public function table(Table $table): Table
    {
        return $table
            ->heading('Order Terbaru')
            ->description('10 order terakhir masuk ke sistem')
            ->query(
                Order::query()
                    ->with(['customer'])
                    ->latest()
                    ->limit(10)
            )
            ->columns([
                TextColumn::make('order_number')
                    ->label('No. Order')
                    ->searchable()
                    ->weight('bold')
                    ->color('primary'),

                TextColumn::make('customer.email')
                    ->label('Customer')
                    ->searchable()
                    ->icon('heroicon-m-user')
                    ->limit(30),

                TextColumn::make('total_price')
                    ->label('Total')
                    ->money('IDR', divideBy: 1)
                    ->sortable()
                    ->weight('bold'),

                TextColumn::make('payment_status')
                    ->label('Pembayaran')
                    ->badge()
                    ->color(fn (PaymentStatus $state): string => match ($state->value) {
                        'paid' => 'success',
                        'unpaid' => 'warning',
                        'canceled', 'failed' => 'danger',
                        'expired' => 'gray',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (PaymentStatus $state): string => match ($state->value) {
                        'paid' => 'Lunas',
                        'unpaid' => 'Belum Bayar',
                        'canceled' => 'Dibatalkan',
                        'failed' => 'Gagal',
                        'expired' => 'Kadaluarsa',
                        default => $state->value,
                    }),

                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn (OrderStatus $state): string => match ($state->value) {
                        'completed' => 'success',
                        'paid', 'paid_awaiting_stock' => 'info',
                        'pending_payment' => 'warning',
                        'paid_manual_review' => 'warning',
                        'payment_failed' => 'danger',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (OrderStatus $state): string => match ($state->value) {
                        'pending_payment' => 'Menunggu Bayar',
                        'paid' => 'Dibayar',
                        'paid_awaiting_stock' => 'Menunggu Stok',
                        'paid_manual_review' => 'Review Manual',
                        'completed' => 'Selesai',
                        'payment_failed' => 'Gagal',
                        default => $state->value,
                    }),

                TextColumn::make('created_at')
                    ->label('Tanggal')
                    ->dateTime('d M Y, H:i')
                    ->sortable()
                    ->color('gray'),
            ])
            ->defaultSort('created_at', 'desc')
            ->paginated(false)
            ->recordUrl(fn (Order $record): string =>
                OrderResource::getUrl('edit', ['record' => $record])
            );
    }
}
