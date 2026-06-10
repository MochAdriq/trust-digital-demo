import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from '@inertiajs/react';

const formatPrice = (amount) => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
}).format(amount || 0);

export default function CheckoutModal({ isOpen, onClose, product }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        pin: '',
        product_id: '',
        quantity: 1,
        payment_method: 'gateway',
        customer_input: '',
    });

    useEffect(() => {
        if (product) {
            setData('product_id', product.id);
        }
    }, [product]);

    useEffect(() => {
        if (!isOpen) {
            reset();
        }
    }, [isOpen]);

    const submit = (e) => {
        e.preventDefault();
        post('/checkout', {
            onSuccess: () => onClose(),
        });
    };

    if (!isOpen || !product) return null;

    const canPayWithPoints = Boolean(product.points_price);

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
                    className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
                >
                    <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 p-5">
                        <h3 className="text-lg font-extrabold text-slate-900">Checkout Cepat</h3>
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-full px-3 py-1.5 text-xl leading-none text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            aria-label="Tutup checkout"
                        >
                            x
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="mb-6 flex items-center gap-4 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-white p-2">
                                {product.image ? (
                                    <img src={product.image} alt={product.name} className="h-full w-full object-contain" />
                                ) : (
                                    <span className="text-sm font-bold text-slate-400">TD</span>
                                )}
                            </div>
                            <div>
                                <h4 className="line-clamp-2 font-bold text-slate-900">{product.name}</h4>
                                <p className="mt-1 font-extrabold text-blue-600">{formatPrice(product.price)}</p>
                                {product.points_price && (
                                    <p className="mt-1 text-xs font-semibold text-slate-500">{product.points_price} poin</p>
                                )}
                            </div>
                        </div>

                        <form id="checkout-form" onSubmit={submit} className="space-y-5">
                            <div>
                                <label className="mb-2 block text-sm font-bold text-slate-700">Email</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="nama@email.com"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium text-slate-900 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                {errors.email && <div className="mt-1 text-sm text-red-500">{errors.email}</div>}
                            </div>

                            {product.customer_input_label && (
                                <div>
                                    <label className="mb-2 block text-sm font-bold text-slate-700">{product.customer_input_label}</label>
                                    <input
                                        type="text"
                                        placeholder={product.customer_input_placeholder || product.customer_input_label}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium text-slate-900 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                        value={data.customer_input}
                                        onChange={(e) => setData('customer_input', e.target.value)}
                                    />
                                    {errors.customer_input && <div className="mt-1 text-sm text-red-500">{errors.customer_input}</div>}
                                </div>
                            )}

                            <div>
                                <label className="mb-2 block text-sm font-bold text-slate-700">Metode Pembayaran</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setData('payment_method', 'gateway')}
                                        className={`rounded-xl border px-4 py-3 text-sm font-bold transition ${data.payment_method === 'gateway' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-600'}`}
                                    >
                                        Payment Gateway
                                    </button>
                                    <button
                                        type="button"
                                        disabled={!canPayWithPoints}
                                        onClick={() => setData('payment_method', 'points')}
                                        className={`rounded-xl border px-4 py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-40 ${data.payment_method === 'points' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-600'}`}
                                    >
                                        Poin
                                    </button>
                                </div>
                                {errors.payment_method && <div className="mt-1 text-sm text-red-500">{errors.payment_method}</div>}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-bold text-slate-700">PIN Poin</label>
                                <input
                                    type="password"
                                    inputMode="numeric"
                                    maxLength="6"
                                    placeholder="6 digit"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium tracking-widest text-slate-900 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                    value={data.pin}
                                    onChange={(e) => setData('pin', e.target.value)}
                                />
                                <p className="mt-1 text-xs text-slate-500">Dipakai untuk pembelian dengan poin. Jika belum punya PIN, admin bisa mengaktifkannya dari data customer.</p>
                                {errors.pin && <div className="mt-1 text-sm text-red-500">{errors.pin}</div>}
                            </div>
                        </form>
                    </div>

                    <div className="border-t border-slate-100 bg-white p-5">
                        <button
                            type="submit"
                            form="checkout-form"
                            disabled={processing}
                            className="w-full rounded-xl bg-blue-600 py-3.5 font-bold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {processing ? 'Memproses...' : 'Buat Pesanan'}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
