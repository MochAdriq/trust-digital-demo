<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\SubscriptionPackage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class SubscriptionPackageSeeder extends Seeder
{
    public function run(): void
    {
        $products = Product::all();
        
        foreach ($products as $product) {
            $basePrice = $product->price > 0 ? $product->price : 25000;
            
            // Package 1: Basic / Sharing
            SubscriptionPackage::updateOrCreate(
                ['product_id' => $product->id, 'slug' => $product->slug . '-sharing-1-bulan'],
                [
                    'name' => $product->name . ' Sharing',
                    'duration_text' => '1 Bulan',
                    'price' => $basePrice,
                    'discount_percentage' => rand(10, 40),
                    'points_price' => $product->points_price ?: ($basePrice / 100),
                    'sort_order' => 1,
                    'is_active' => true,
                ]
            );

            // Package 2: Private / Premium
            SubscriptionPackage::updateOrCreate(
                ['product_id' => $product->id, 'slug' => $product->slug . '-private-1-bulan'],
                [
                    'name' => $product->name . ' Private',
                    'duration_text' => '1 Bulan',
                    'price' => $basePrice * 1.5,
                    'discount_percentage' => rand(10, 30),
                    'points_price' => $product->points_price ? $product->points_price * 1.5 : (($basePrice * 1.5) / 100),
                    'sort_order' => 2,
                    'is_active' => true,
                ]
            );

            // Package 3: VIP (3 Bulan)
            SubscriptionPackage::updateOrCreate(
                ['product_id' => $product->id, 'slug' => $product->slug . '-vip-3-bulan'],
                [
                    'name' => $product->name . ' VIP',
                    'duration_text' => '3 Bulan',
                    'price' => $basePrice * 4,
                    'discount_percentage' => rand(20, 50),
                    'points_price' => null,
                    'sort_order' => 3,
                    'is_active' => true,
                ]
            );
            
            // Update features & rating as well
            if (!$product->features) {
                $product->update([
                    'features' => [
                        'Akses penuh semua fitur premium',
                        'Garansi 100% uang kembali',
                        'Aktivasi maksimal 15 menit',
                        'Support 24/7 via WhatsApp',
                        'Dapat diperpanjang kapan saja'
                    ],
                    'rating' => rand(45, 50) / 10, // 4.5 - 5.0
                    'total_users' => rand(1000, 20000),
                ]);
            }
        }
    }
}
