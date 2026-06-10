<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Category;

class HomeController extends Controller
{
    public function index()
    {
        $categories = Category::with(['products' => function($q) {
            $q->where('is_active', true)->limit(8);
        }])->where('is_active', true)->get();

        return Inertia::render('Welcome', [
            'categories' => $categories
        ]);
    }

    public function produk(Request $request)
    {
        $query = \App\Models\Product::with('category')->where('is_active', true);
        
        if ($request->has('category')) {
            $query->whereHas('category', function($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        if ($request->has('q')) {
            $query->where('name', 'like', '%' . $request->q . '%');
        }

        $products = $query->get();
        $categories = Category::where('is_active', true)->get();

        return Inertia::render('Produk', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $request->only(['category', 'q'])
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

    public function show($slug)
    {
        $product = \App\Models\Product::with('category')->where('slug', $slug)->firstOrFail();
        return Inertia::render('ProductDetail', [
            'product' => $product
        ]);
    }
}
