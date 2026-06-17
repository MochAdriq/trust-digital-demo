<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class TrustDigitalProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Buat Kategori (Jika Belum Ada)
        $category = Category::firstOrCreate(
            ['slug' => 'aplikasi-premium'],
            [
                'name' => 'Aplikasi Premium',
                'icon' => 'heroicon-o-star',
            ]
        );

        // 2. Data Produk dari TrustDigital.id
        $products = [
            [
                'name' => 'Netflix Premium',
                'description' => 'Streaming film & series unlimited dengan kualitas 4K',
                'price' => 35000,
                'image' => 'https://www.google.com/s2/favicons?domain=netflix.com&sz=128'
            ],
            [
                'name' => 'Spotify Premium',
                'description' => 'Musik tanpa iklan dengan kualitas tinggi & download offline',
                'price' => 15000,
                'image' => 'https://www.google.com/s2/favicons?domain=spotify.com&sz=128'
            ],
            [
                'name' => 'YouTube Premium',
                'description' => 'YouTube tanpa iklan + YouTube Music premium',
                'price' => 20000,
                'image' => 'https://www.google.com/s2/favicons?domain=youtube.com&sz=128'
            ],
            [
                'name' => 'Disney+ Premium',
                'description' => 'Konten Disney, Marvel, Star Wars & Pixar',
                'price' => 25000,
                'image' => 'https://www.google.com/s2/favicons?domain=disneyplus.com&sz=128'
            ],
            [
                'name' => 'VIU Premium',
                'description' => 'Drama Asia terlengkap dengan subtitle Indonesia',
                'price' => 15000,
                'image' => 'https://www.google.com/s2/favicons?domain=viu.com&sz=128'
            ],
            [
                'name' => 'Apple Music',
                'description' => 'Streaming musik Hi-Fi dengan Spatial Audio',
                'price' => 20000,
                'image' => 'https://www.google.com/s2/favicons?domain=apple.com&sz=128'
            ],
            [
                'name' => 'CapCut Pro',
                'description' => 'Video editor profesional dengan template premium',
                'price' => 25000,
                'image' => 'https://www.google.com/s2/favicons?domain=capcut.com&sz=128'
            ],
            [
                'name' => 'ChatGPT Plus',
                'description' => 'AI Assistant terdepan dengan akses GPT-4',
                'price' => 150000,
                'image' => 'https://www.google.com/s2/favicons?domain=openai.com&sz=128'
            ],
            [
                'name' => 'Zoom Pro',
                'description' => 'Video conference profesional untuk bisnis',
                'price' => 95000,
                'image' => 'https://www.google.com/s2/favicons?domain=zoom.us&sz=128'
            ],
            [
                'name' => 'iQIYI Premium',
                'description' => 'Drama Asia & film eksklusif dengan subtitle Indonesia',
                'price' => 20000,
                'image' => 'https://www.google.com/s2/favicons?domain=iq.com&sz=128'
            ],
            [
                'name' => 'LokLok Premium',
                'description' => 'Film & drama gratis dengan subtitle Indonesia',
                'price' => 10000,
                'image' => 'https://www.google.com/s2/favicons?domain=loklok.com&sz=128'
            ],
            [
                'name' => 'Vidio Premier',
                'description' => 'Streaming lokal & internasional terlengkap',
                'price' => 25000,
                'image' => 'https://www.google.com/s2/favicons?domain=vidio.com&sz=128'
            ],
            [
                'name' => 'HBO GO Premium',
                'description' => 'Series & film Hollywood terbaru',
                'price' => 35000,
                'image' => 'https://www.google.com/s2/favicons?domain=hbo.com&sz=128'
            ],
            [
                'name' => 'Prime Video',
                'description' => 'Amazon Prime Video dengan konten eksklusif',
                'price' => 30000,
                'image' => 'https://www.google.com/s2/favicons?domain=primevideo.com&sz=128'
            ],
            [
                'name' => 'Canva Pro',
                'description' => 'Design grafis profesional dengan template premium',
                'price' => 20000,
                'image' => 'https://www.google.com/s2/favicons?domain=canva.com&sz=128'
            ],
            [
                'name' => 'Vimeo Pro',
                'description' => 'Platform video profesional untuk kreator',
                'price' => 75000,
                'image' => 'https://www.google.com/s2/favicons?domain=vimeo.com&sz=128'
            ],
        ];

        // 3. Masukkan ke Database
        foreach ($products as $item) {
            Product::updateOrCreate(
                ['slug' => Str::slug($item['name'])],
                [
                    'category_id' => $category->id,
                    'name' => $item['name'],
                    'description' => $item['description'],
                    'price' => $item['price'],
                    'image' => $item['image'] ?? null,
                    'product_type' => 'credential_stock',
                    'is_active' => true,
                ]
            );
        }
    }
}
