import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { ProductCard } from '@/Components/ui/product-card';
import ProductDetailModal from '@/Components/ui/ProductDetailModal';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Users } from 'lucide-react';
import { containerVariants, itemVariants } from '@/lib/animations';

export default function Welcome({ products, categories, filters }) {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchQuery, setSearchQuery] = useState(filters.q || '');

    const handleSearch = (e) => {
        e.preventDefault();
        const params = {};
        if (searchQuery) params.q = searchQuery;
        if (filters.category) params.category = filters.category;
        router.get('/', params, { preserveState: true, preserveScroll: true });
    };

    return (
        <PublicLayout>
            <Head title="TrustDigital.ID - Platform Digital Terpercaya" />

            <section className="bg-blue-700 text-white">
                <div className="mx-auto max-w-6xl px-4 py-10 text-center sm:px-6 lg:py-14">
                    <p className="text-xs font-bold uppercase tracking-[0.26em] text-blue-100">Langganan mudah + layanan cepat</p>
                    <h1 className="mx-auto mt-3 max-w-4xl text-4xl font-extrabold tracking-tight md:text-5xl">
                        Teman Langganan Aplikasi Premium
                    </h1>
                    <p className="mx-auto mt-3 max-w-3xl text-base leading-7 text-blue-50 md:text-lg">
                        Nikmati aplikasi premium favorit dan top up game dengan harga terjangkau, checkout Midtrans/Xendit, dan proses berlangganan yang dibuat sesederhana mungkin.
                    </p>

                    <form onSubmit={handleSearch} className="mx-auto mt-6 flex max-w-xl items-center gap-2 rounded-full bg-white p-1.5 text-slate-950 shadow-xl shadow-blue-950/20">
                        <span className="pl-4 text-slate-400">⌕</span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari Netflix, Spotify, Mobile Legends, Canva..."
                            className="min-w-0 flex-1 rounded-full border-0 bg-transparent px-2 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:ring-0"
                        />
                        <button type="submit" className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-800">
                            Cari
                        </button>
                    </form>

                    <div className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
                        <Link href="/?category=akun-premium" className="group rounded-2xl bg-white/10 p-4 text-center ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:bg-white/15">
                            <span className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-2xl">🎬</span>
                            <span className="mt-3 block text-sm font-extrabold">Akun Premium</span>
                            <span className="mt-1 block text-xs leading-5 text-blue-100">Produk populer</span>
                        </Link>
                        <Link href="/?category=top-up-game" className="group rounded-2xl bg-white/10 p-4 text-center ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:bg-white/15">
                            <span className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-2xl">🎮</span>
                            <span className="mt-3 block text-sm font-extrabold">Top Up Game</span>
                            <span className="mt-1 block text-xs leading-5 text-blue-100">Proses cepat</span>
                        </Link>
                        <Link href="/reseller" className="group rounded-2xl bg-white/10 p-4 text-center ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:bg-white/15">
                            <span className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-2xl">👥</span>
                            <span className="mt-3 block text-sm font-extrabold">Join Reseller</span>
                            <span className="mt-1 block text-xs leading-5 text-blue-100">Dapatkan komisi</span>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="bg-white py-6 border-b border-slate-100">
                <div className="mx-auto max-w-5xl px-4 sm:px-6">
                    <div className="relative overflow-hidden rounded-2xl bg-slate-950 shadow-[0_16px_44px_rgba(15,23,42,0.18)]">
                        <div className="relative h-56 overflow-hidden md:h-72">
                            <article className="absolute inset-0 overflow-hidden">
                                <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 18% 20%, #2563EB 0, transparent 28%), linear-gradient(135deg, #111827 0%, #172554 55%, #020617 100%)' }}></div>
                                <div className="absolute right-8 top-8 hidden h-32 w-32 rounded-[2rem] bg-white/10 blur-xl md:block"></div>
                                <div className="relative z-10 flex h-full max-w-2xl flex-col justify-end p-6 md:p-8">
                                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-100">Highlight</p>
                                    <h2 className="mt-3 text-2xl font-extrabold leading-tight text-white md:text-3xl">Promo aplikasi premium mingguan</h2>
                                    <p className="mt-2 max-w-xl text-sm leading-6 text-slate-200 md:text-base">Harga hemat untuk Netflix, Canva, Spotify, dan paket sharing populer.</p>
                                    <div className="mt-5 flex items-center gap-4">
                                        <Link href="/?category=aplikasi-premium" className="rounded-lg border border-white/30 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:bg-white hover:text-slate-950">
                                            Buka katalog
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        </div>
                    </div>
                </div>
            </section>

            <section className="border-y border-slate-100 bg-white">
                <div className="mx-auto grid max-w-4xl grid-cols-3 gap-4 px-4 py-5 text-center text-xs text-slate-600 sm:px-6 md:text-sm">
                    <div className="flex flex-col items-center">
                        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                        <p className="font-extrabold text-emerald-600">100% Aman</p>
                        <p>Garansi uang kembali</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                            <Zap className="h-5 w-5" />
                        </div>
                        <p className="font-extrabold text-blue-600">Aktivasi Cepat</p>
                        <p>Maksimal 15 menit</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                            <Users className="h-5 w-5" />
                        </div>
                        <p className="font-extrabold text-blue-600">Terpercaya</p>
                        <p>50.000+ pelanggan puas</p>
                    </div>
                </div>
            </section>

            <section className="bg-slate-50 py-10 min-h-screen">
                <div className="mx-auto max-w-[1400px] w-full px-4 sm:px-6 lg:px-8">
                    <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h2 className="text-3xl font-extrabold text-slate-900">Katalog Produk</h2>
                            <p className="mt-2 text-sm text-slate-500">Pilih layanan yang Anda butuhkan.</p>
                        </div>

                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            <Link href="/" className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${!filters.category ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'}`}>
                                Semua Produk
                            </Link>
                            {categories && categories.map(cat => (
                                <Link key={cat.id} href={`/?category=${cat.slug}`} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${filters.category === cat.slug ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'}`}>
                                    {cat.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {products && products.length > 0 ? (
                        <motion.div 
                            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {products.map(product => (
                                <motion.div key={product.id} variants={itemVariants}>
                                    <ProductCard 
                                        product={product} 
                                        onClick={(prod) => setSelectedProduct(prod)} 
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 border-dashed">
                            <span className="text-4xl block mb-4">🛒</span>
                            <p className="text-slate-500 font-medium">Produk tidak ditemukan.</p>
                        </div>
                    )}
                </div>
            </section>

            <ProductDetailModal 
                isOpen={!!selectedProduct} 
                onClose={() => setSelectedProduct(null)} 
                product={selectedProduct} 
            />
        </PublicLayout>
    );
}
