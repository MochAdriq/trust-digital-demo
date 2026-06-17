<?php

namespace App\Filament\Widgets;

use App\Enums\PaymentStatus;
use App\Models\Order;
use Carbon\CarbonPeriod;
use Filament\Widgets\ChartWidget;

class RevenueChart extends ChartWidget
{
    protected ?string $heading = 'Revenue Harian';

    protected ?string $description = null;

    protected static ?int $sort = 1;

    protected int | string | array $columnSpan = 'full';

    protected ?string $maxHeight = '300px';

    protected string $color = 'success';

    protected function getData(): array
    {
        $days = $this->getFilteredDays();
        $this->description = "Pendapatan {$days} hari terakhir (order yang sudah dibayar)";

        $period = CarbonPeriod::create(now()->subDays($days - 1), now());

        $labels = [];
        $revenue = [];

        foreach ($period as $date) {
            $labels[] = $date->format('d M');
            $dailyRevenue = Order::where('payment_status', PaymentStatus::Paid)
                ->whereDate('created_at', $date)
                ->sum('total_price');
            $revenue[] = $dailyRevenue;
        }

        return [
            'datasets' => [
                [
                    'label' => 'Revenue (Rp)',
                    'data' => $revenue,
                    'fill' => 'start',
                    'backgroundColor' => 'rgba(16, 185, 129, 0.1)',
                    'borderColor' => 'rgb(16, 185, 129)',
                    'tension' => 0.3,
                ],
            ],
            'labels' => $labels,
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }

    protected function getFilters(): ?array
    {
        return [
            '7' => '7 Hari Terakhir',
            '30' => '30 Hari Terakhir',
            '90' => '90 Hari Terakhir',
        ];
    }

    protected function getFilteredDays(): int
    {
        return match ($this->filter) {
            '7' => 7,
            '90' => 90,
            default => 30,
        };
    }
}
