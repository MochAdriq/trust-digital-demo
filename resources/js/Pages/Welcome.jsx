import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { ProductCard } from '@/Components/ui/product-card';
import CheckoutModal from '@/Components/ui/CheckoutModal';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};

export default function Welcome({ categories }) {
    const [selectedProduct, setSelectedProduct] = useState(null);

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

                    <form action="/produk" method="GET" className="mx-auto mt-6 flex max-w-xl items-center gap-2 rounded-full bg-white p-1.5 text-slate-950 shadow-xl shadow-blue-950/20">
                        <span className="pl-4 text-slate-400">⌕</span>
                        <input
                            type="text"
                            name="q"
                            placeholder="Cari Netflix, Spotify, Mobile Legends, Canva..."
                            className="min-w-0 flex-1 rounded-full border-0 bg-transparent px-2 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:ring-0"
                        />
                        <button type="submit" className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-800">
                            Cari
                        </button>
                    </form>

                    <div className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
                        <Link href="/produk?category=akun-premium" className="group rounded-2xl bg-white/10 p-4 text-center ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:bg-white/15">
                            <span className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-2xl">🎬</span>
                            <span className="mt-3 block text-sm font-extrabold">Akun Premium</span>
                            <span className="mt-1 block text-xs leading-5 text-blue-100">Produk populer</span>
                        </Link>
                        <Link href="/produk?category=top-up-game" className="group rounded-2xl bg-white/10 p-4 text-center ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:bg-white/15">
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

            <section className="bg-white py-6">
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
                                        <Link href="/produk" className="rounded-lg border border-white/30 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:bg-white hover:text-slate-950">
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
                    <div>
                        <p className="font-extrabold text-emerald-600">100% Aman</p>
                        <p>Garansi uang kembali</p>
                    </div>
                    <div>
                        <p className="font-extrabold text-blue-600">Aktivasi Cepat</p>
                        <p>Maksimal 15 menit</p>
                    </div>
                    <div>
                        <p className="font-extrabold text-blue-600">Terpercaya</p>
                        <p>50.000+ pelanggan puas</p>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-[1400px] w-full px-4 py-10 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-extrabold text-slate-900">Aplikasi Premium Pilihan</h2>
                    <p className="text-sm text-slate-500">Produk aktif siap checkout.</p>
                </div>

                <div className="mt-8">
                    {categories && categories.length > 0 && categories.map((category) => (
                        <motion.div 
                            key={category.id} 
                            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5 mb-10"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {category.products.map(product => (
                                <motion.div key={product.id} variants={itemVariants}>
                                    <ProductCard 
                                        product={product} 
                                        onClick={(prod) => setSelectedProduct(prod)} 
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    ))}
                </div>
            </section>

            <CheckoutModal 
                isOpen={!!selectedProduct} 
                onClose={() => setSelectedProduct(null)} 
                product={selectedProduct} 
            />
        </PublicLayout>
    );
}
