<?php

namespace App\Filament\Widgets;

use App\Enums\PaymentStatus;
use App\Models\Customer;
use App\Models\CredentialStock;
use App\Models\Order;
use Carbon\Carbon;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends StatsOverviewWidget
{
    protected static ?int $sort = 0;

    protected function getStats(): array
    {
        // Revenue dari order yang sudah dibayar
        $paidOrders = Order::where('payment_status', PaymentStatus::Paid);
        $totalRevenue = (clone $paidOrders)->sum('total_price');
        $totalPaidOrders = (clone $paidOrders)->count();

        // Revenue bulan ini vs bulan lalu
        $revenueThisMonth = Order::where('payment_status', PaymentStatus::Paid)
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->sum('total_price');

        $revenueLastMonth = Order::where('payment_status', PaymentStatus::Paid)
            ->whereMonth('created_at', now()->subMonth()->month)
            ->whereYear('created_at', now()->subMonth()->year)
            ->sum('total_price');

        $revenueChange = $revenueLastMonth > 0
            ? round((($revenueThisMonth - $revenueLastMonth) / $revenueLastMonth) * 100, 1)
            : ($revenueThisMonth > 0 ? 100 : 0);

        // Revenue per hari (7 hari terakhir) untuk sparkline chart
        $revenuePerDay = [];
        for ($i = 6; $i >= 0; $i--) {
            $revenuePerDay[] = (float) Order::where('payment_status', PaymentStatus::Paid)
                ->whereDate('created_at', now()->subDays($i))
                ->sum('total_price') / 100; // convert to rupiah display-ready
        }

        // Total semua orders
        $totalOrders = Order::count();
        $completedOrders = Order::where('status', 'completed')->count();

        // Orders bulan ini vs bulan lalu
        $ordersThisMonth = Order::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();
        $ordersLastMonth = Order::whereMonth('created_at', now()->subMonth()->month)
            ->whereYear('created_at', now()->subMonth()->year)
            ->count();
        $ordersChange = $ordersLastMonth > 0
            ? round((($ordersThisMonth - $ordersLastMonth) / $ordersLastMonth) * 100, 1)
            : ($ordersThisMonth > 0 ? 100 : 0);

        // Orders per hari (7 hari) untuk sparkline
        $ordersPerDay = [];
        for ($i = 6; $i >= 0; $i--) {
            $ordersPerDay[] = (float) Order::whereDate('created_at', now()->subDays($i))->count();
        }

        // Rata-rata order value
        $averageOrderValue = $totalPaidOrders > 0
            ? round($totalRevenue / $totalPaidOrders)
            : 0;

        // Total customers
        $totalCustomers = Customer::count();
        $newCustomersThisMonth = Customer::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        // Credential stock tersedia
        $availableStock = CredentialStock::whereNull('delivered_order_id')
            ->whereNull('reserved_order_id')
            ->count();

        return [
            Stat::make('Total Revenue', 'Rp ' . number_format($totalRevenue, 0, ',', '.'))
                ->description($revenueChange >= 0 ? "{$revenueChange}% naik dari bulan lalu" : abs($revenueChange) . '% turun dari bulan lalu')
                ->descriptionIcon($revenueChange >= 0 ? 'heroicon-m-arrow-trending-up' : 'heroicon-m-arrow-trending-down')
                ->descriptionColor($revenueChange >= 0 ? 'success' : 'danger')
                ->chart($revenuePerDay)
                ->chartColor('success')
                ->color('success'),

            Stat::make('Total Orders', number_format($totalOrders))
                ->description("{$completedOrders} selesai · {$ordersThisMonth} bulan ini")
                ->descriptionIcon($ordersChange >= 0 ? 'heroicon-m-arrow-trending-up' : 'heroicon-m-arrow-trending-down')
                ->descriptionColor($ordersChange >= 0 ? 'success' : 'danger')
                ->chart($ordersPerDay)
                ->chartColor('info')
                ->color('info'),

            Stat::make('Rata-rata Order', 'Rp ' . number_format($averageOrderValue, 0, ',', '.'))
                ->description('Per transaksi yang dibayar')
                ->descriptionIcon('heroicon-m-calculator')
                ->descriptionColor('warning')
                ->color('warning'),

            Stat::make('Total Customers', number_format($totalCustomers))
                ->description("{$newCustomersThisMonth} baru bulan ini · {$availableStock} stok tersedia")
                ->descriptionIcon('heroicon-m-user-group')
                ->descriptionColor('info')
                ->color('info'),
        ];
    }
}
