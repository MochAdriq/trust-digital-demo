<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'subscriptionPackages' => function ($q) {
            $q->where('is_active', true)->orderBy('sort_order');
        }])->where('is_active', true);

        if ($request->filled('category')) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $request->category));
        }

        if ($request->filled('q')) {
            $query->where('name', 'like', '%'.$request->q.'%');
        }

        return Inertia::render('Welcome', [
            'products' => $query->get(),
            'categories' => Category::where('is_active', true)->get(),
            'filters' => $request->only(['category', 'q']),
        ]);
    }

    public function show(string $slug)
    {
        $product = Product::with(['category', 'subscriptionPackages' => function ($q) {
            $q->where('is_active', true)->orderBy('sort_order');
        }])
            ->where('is_active', true)
            ->where('slug', $slug)
            ->firstOrFail();

        return Inertia::render('ProductDetail', [
            'product' => $product,
        ]);
    }

    public function promo()
    {
        return Inertia::render('Promo');
    }

    public function reseller()
    {
        return Inertia::render('Reseller');
    }

    public function faq()
    {
        return Inertia::render('FAQ');
    }
}
