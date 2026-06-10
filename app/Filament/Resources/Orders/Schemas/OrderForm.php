<?php

namespace App\Filament\Resources\Orders\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class OrderForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('order_number')
                    ->required(),
                Select::make('customer_id')
                    ->relationship('customer', 'email')
                    ->searchable()
                    ->preload()
                    ->required(),
                Select::make('status')
                    ->options([
                        'pending_payment' => 'Pending Payment',
                        'paid' => 'Paid',
                        'paid_awaiting_stock' => 'Paid Awaiting Stock',
                        'paid_manual_review' => 'Paid Manual Review',
                        'completed' => 'Completed',
                        'payment_failed' => 'Payment Failed',
                    ])
                    ->required()
                    ->default('pending'),
                Select::make('payment_status')
                    ->options([
                        'unpaid' => 'Unpaid',
                        'paid' => 'Paid',
                        'failed' => 'Failed',
                        'expired' => 'Expired',
                        'canceled' => 'Canceled',
                    ])
                    ->required()
                    ->default('unpaid'),
                Select::make('fulfillment_status')
                    ->options([
                        'pending' => 'Pending',
                        'awaiting_stock' => 'Awaiting Stock',
                        'manual_review' => 'Manual Review',
                        'fulfilled' => 'Fulfilled',
                    ])
                    ->required()
                    ->default('pending'),
                TextInput::make('total_price')
                    ->required()
                    ->numeric()
                    ->prefix('Rp'),
                TextInput::make('amount_payable')
                    ->required()
                    ->numeric()
                    ->prefix('Rp'),
                TextInput::make('points_used')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('points_earned')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('payment_method'),
                TextInput::make('payment_reference'),
                DateTimePicker::make('paid_at'),
                DateTimePicker::make('fulfilled_at'),
                Textarea::make('customer_note')
                    ->columnSpanFull(),
            ]);
    }
}
