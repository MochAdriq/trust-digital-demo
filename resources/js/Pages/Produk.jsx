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

export default function Produk({ products, categories, filters }) {
    const [selectedProduct, setSelectedProduct] = useState(null);

    return (
        <PublicLayout>
            <Head title="Katalog Produk - TrustDigital.ID" />

            <section className="bg-slate-50 py-10 min-h-screen">
                <div className="mx-auto max-w-[1400px] w-full px-4 sm:px-6 lg:px-8">
                    <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-900">Marketplace</h1>
                            <p className="mt-2 text-sm text-slate-500">Temukan layanan premium yang Anda butuhkan.</p>
                        </div>

                        <form action="/produk" method="GET" className="flex items-center gap-2 rounded-full bg-white p-1.5 shadow-sm border border-slate-200">
                            <span className="pl-4 text-slate-400">⌕</span>
                            <input
                                type="text"
                                name="q"
                                defaultValue={filters.q || ''}
                                placeholder="Cari layanan..."
                                className="min-w-0 flex-1 rounded-full border-0 bg-transparent px-2 py-2 text-sm outline-none placeholder:text-slate-400 focus:ring-0"
                            />
                            {filters.category && <input type="hidden" name="category" value={filters.category} />}
                            <button type="submit" className="rounded-full bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-800">
                                Cari
                            </button>
                        </form>
                    </div>

                    <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                        <Link href="/produk" className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${!filters.category ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'}`}>
                            Semua Produk
                        </Link>
                        {categories.map(cat => (
                            <Link key={cat.id} href={`/produk?category=${cat.slug}`} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${filters.category === cat.slug ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'}`}>
                                {cat.name}
                            </Link>
                        ))}
                    </div>

                    {products.length > 0 ? (
                        <motion.div 
                            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5"
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

            <CheckoutModal 
                isOpen={!!selectedProduct} 
                onClose={() => setSelectedProduct(null)} 
                product={selectedProduct} 
            />
        </PublicLayout>
    );
}
