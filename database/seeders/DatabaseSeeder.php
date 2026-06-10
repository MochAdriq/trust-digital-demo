<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\CredentialStock;
use App\Models\LoyaltySetting;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Admin TrustDigital',
            'email' => 'admin@trustdigital.id',
            'password' => bcrypt('password'),
            'is_admin' => true,
        ]);

        LoyaltySetting::create([
            'name' => 'Default',
            'is_active' => true,
            'points_per_1000_idr' => 1,
            'minimum_paid_amount' => 10000,
        ]);

        $premium = Category::create(['name' => 'Akun Premium', 'slug' => 'akun-premium', 'icon' => 'movie']);
        $game = Category::create(['name' => 'Top Up Game', 'slug' => 'top-up-game', 'icon' => 'game']);
        $social = Category::create(['name' => 'Social Media', 'slug' => 'social-media', 'icon' => 'social']);

        $netflix = Product::create([
            'category_id' => $premium->id,
            'name' => 'Netflix Premium 1 Bulan',
            'slug' => 'netflix-premium-1-bulan',
            'description' => 'Akun sharing 1 profil, 4K UHD. Garansi full 1 bulan.',
            'product_type' => 'credential_stock',
            'price' => 35000,
            'points_price' => 35,
            'image' => 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
        ]);

        Product::create([
            'category_id' => $premium->id,
            'name' => 'Spotify Premium 1 Bulan',
            'slug' => 'spotify-premium-1-bulan',
            'description' => 'Invite ke family plan. Bebas iklan.',
            'product_type' => 'credential_stock',
            'price' => 15000,
            'points_price' => 15,
            'image' => 'https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg',
        ]);

        Product::create([
            'category_id' => $game->id,
            'name' => 'Mobile Legends 86 Diamonds',
            'slug' => 'mlbb-86-diamonds',
            'description' => 'Proses 1 menit, legal 100%.',
            'product_type' => 'manual_topup',
            'price' => 20000,
            'points_price' => 20,
            'image' => 'https://upload.wikimedia.org/wikipedia/en/e/e5/Mobile_Legends_Bang_Bang_logo.png',
            'customer_input_label' => 'User ID / Server ID',
            'customer_input_placeholder' => 'Contoh: 12345678 (1234)',
        ]);

        Product::create([
            'category_id' => $social->id,
            'name' => 'Instagram Followers Starter',
            'slug' => 'instagram-followers-starter',
            'description' => 'Paket social boost dengan proses manual oleh admin.',
            'product_type' => 'social_boost',
            'price' => 25000,
            'points_price' => 25,
            'customer_input_label' => 'Username / Link Target',
            'customer_input_placeholder' => 'Contoh: https://instagram.com/username',
        ]);

        CredentialStock::create([
            'product_id' => $netflix->id,
            'label' => 'Demo Netflix Stock',
            'login_email' => 'demo-netflix@example.com',
            'login_password' => 'change-me',
            'notes' => 'Demo credential. Replace before production.',
        ]);
    }
}
