<?php

namespace App\Filament\Resources\Orders\Schemas;

use App\Enums\FulfillmentStatus;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
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
                    ->options(collect(OrderStatus::cases())->mapWithKeys(fn ($s) => [$s->value => $s->label()])->toArray())
                    ->required()
                    ->default(OrderStatus::PendingPayment->value),
                Select::make('payment_status')
                    ->options(collect(PaymentStatus::cases())->mapWithKeys(fn ($s) => [$s->value => ucfirst($s->value)])->toArray())
                    ->required()
                    ->default(PaymentStatus::Unpaid->value),
                Select::make('fulfillment_status')
                    ->options(collect(FulfillmentStatus::cases())->mapWithKeys(fn ($s) => [$s->value => ucfirst(str_replace('_', ' ', $s->value))])->toArray())
                    ->required()
                    ->default(FulfillmentStatus::Pending->value),
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
