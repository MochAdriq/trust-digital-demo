import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { Check, Star, Users } from 'lucide-react';

const formatPrice = (amount) => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
}).format(amount || 0);

const getImageUrl = (path) => path ? (path.startsWith('http') || path.startsWith('/') ? path : `/storage/${path}`) : null;

export default function ProductDetailModal({ isOpen, onClose, product }) {
    if (!isOpen || !product) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl md:flex-row"
                >
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
                    >
                        ✕
                    </button>

                    {/* Left Column - Product Info */}
                    <div className="flex w-full flex-col bg-slate-50 p-6 md:w-2/5 md:p-8">
                        <div className="mb-6 flex items-center gap-4">
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white p-2">
                                {product.image ? (
                                    <img src={getImageUrl(product.image)} alt={product.name} className="h-full w-full object-contain" />
                                ) : (
                                    <span className="text-xl font-bold text-slate-300">TD</span>
                                )}
                            </div>
                            <h2 className="text-xl font-extrabold text-slate-900">{product.name}</h2>
                        </div>
                        
                        <p className="mb-4 text-sm leading-relaxed text-slate-600">
                            {product.description || 'Layanan premium terpercaya dengan garansi.'}
                        </p>

                        <div className="mb-6 flex items-center gap-6 text-sm font-semibold text-slate-600">
                            <div className="flex items-center gap-1.5">
                                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                <span>{product.rating || '5.0'} Rating</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Users className="h-4 w-4 text-blue-500" />
                                <span>{product.total_users || '0'} Pengguna</span>
                            </div>
                        </div>

                        <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
                            <h3 className="mb-3 text-sm font-bold text-blue-900">Keunggulan Berlangganan:</h3>
                            <ul className="space-y-2">
                                {product.features && product.features.length > 0 ? (
                                    product.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-blue-800">
                                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                                            <span>{feature}</span>
                                        </li>
                                    ))
                                ) : (
                                    <>
                                        <li className="flex items-start gap-2 text-sm text-blue-800">
                                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                                            <span>Akses penuh semua fitur premium</span>
                                        </li>
                                        <li className="flex items-start gap-2 text-sm text-blue-800">
                                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                                            <span>Garansi 100% uang kembali</span>
                                        </li>
                                        <li className="flex items-start gap-2 text-sm text-blue-800">
                                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                                            <span>Aktivasi maksimal 15 menit</span>
                                        </li>
                                        <li className="flex items-start gap-2 text-sm text-blue-800">
                                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                                            <span>Support 24/7 via WhatsApp</span>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* Right Column - Packages */}
                    <div className="flex w-full flex-col p-6 md:w-3/5 md:p-8 overflow-y-auto">
                        <h3 className="mb-4 text-lg font-bold text-slate-900">Paket Langganan:</h3>
                        
                        <div className="space-y-4">
                            {product.subscription_packages && product.subscription_packages.length > 0 ? (
                                product.subscription_packages.map(pkg => (
                                    <div key={pkg.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-md">
                                        <div>
                                            <h4 className="font-bold text-slate-900">{pkg.name}</h4>
                                            <span className="text-xs font-semibold text-slate-500">{pkg.duration_text}</span>
                                            
                                            <div className="mt-2 flex items-center gap-2">
                                                <span className="text-xl font-extrabold text-blue-600">{formatPrice(pkg.price)}</span>
                                                {pkg.original_price && (
                                                    <span className="text-xs text-slate-400 line-through">{formatPrice(pkg.original_price)}</span>
                                                )}
                                                {pkg.discount_percentage > 0 && (
                                                    <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                                                        Hemat {pkg.discount_percentage}%
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <Link 
                                            href={`/checkout/${pkg.slug}`}
                                            className="shrink-0 rounded-lg bg-blue-600 px-6 py-2.5 text-center text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
                                        >
                                            Checkout
                                        </Link>
                                    </div>
                                ))
                            ) : (
                                <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500 flex flex-col items-center">
                                    <p className="mb-4">Belum ada paket langganan untuk produk ini.</p>
                                    <Link 
                                        href={`/product/${product.slug}`}
                                        className="shrink-0 rounded-lg bg-blue-600 px-6 py-2.5 text-center text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
                                    >
                                        Beli Produk Langsung
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
