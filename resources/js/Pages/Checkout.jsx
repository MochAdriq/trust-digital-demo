import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';
import PublicLayout from '@/Layouts/PublicLayout';
import { ShieldCheck, Lock, CreditCard, Ticket, X } from 'lucide-react';

const formatPrice = (amount) => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
}).format(amount || 0);

const getImageUrl = (path) => path ? (path.startsWith('http') || path.startsWith('/') ? path : `/storage/${path}`) : null;

export default function Checkout({ product, package: pkg }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        name: '',
        phone: '',
        package_id: pkg.id,
        quantity: 1,
        payment_method: 'gateway',
        pin: '',
        customer_input: '',
        voucher_code: '',
        agree_terms: false,
        agree_newsletter: false,
    });

    const [voucherCodeInput, setVoucherCodeInput] = useState('');
    const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);
    const [voucherError, setVoucherError] = useState('');
    const [showVoucherInput, setShowVoucherInput] = useState(false);

    const applyVoucher = async () => {
        if (!voucherCodeInput) return;
        setIsApplyingVoucher(true);
        setVoucherError('');
        try {
            const response = await axios.post('/checkout/verify-voucher', {
                code: voucherCodeInput,
                package_id: pkg.id,
            });
            if (response.data.valid) {
                setData({
                    ...data,
                    voucher_code: response.data.voucher.code,
                    payment_method: 'voucher'
                });
                setShowVoucherInput(false);
            } else {
                setVoucherError(response.data.message);
            }
        } catch (error) {
            setVoucherError(error.response?.data?.message || 'Terjadi kesalahan saat memverifikasi voucher.');
        } finally {
            setIsApplyingVoucher(false);
        }
    };

    const removeVoucher = () => {
        setData({
            ...data,
            voucher_code: '',
            payment_method: 'gateway'
        });
        setVoucherCodeInput('');
    };

    const submit = (e) => {
        e.preventDefault();
        post('/checkout');
    };

    const convenienceFee = 0; // Hardcoded for now based on requirement
    const subtotal = pkg.price * data.quantity;
    const isVoucherApplied = Boolean(data.voucher_code);
    const discount = isVoucherApplied ? subtotal : 0;
    const total = isVoucherApplied ? 0 : (subtotal + convenienceFee);

    const canPayWithPoints = Boolean(pkg.points_price);

    return (
        <PublicLayout>
            <Head title={`Checkout - ${pkg.name}`} />

            <div className="mx-auto max-w-5xl px-4 py-8 md:py-12">
                <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4">
                    <button type="button" onClick={() => window.history.back()} className="text-slate-500 hover:text-slate-900 font-medium">
                        ← Kembali
                    </button>
                    <h1 className="text-xl font-bold text-slate-900">Checkout</h1>
                    <div className="w-16"></div> {/* Spacer for centering */}
                </div>

                <form onSubmit={submit} id="checkout-form" className="flex flex-col gap-8 md:flex-row">
                    {/* Left Column: Product & Buyer Info */}
                    <div className="flex w-full flex-col gap-6 md:w-3/5">
                        
                        {/* Product Detail Card */}
                        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">PRODUCT</h2>
                            <div className="flex items-center gap-4">
                                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 p-2">
                                    {product.image ? (
                                        <img src={getImageUrl(product.image)} alt={product.name} className="h-full w-full object-contain" />
                                    ) : (
                                        <span className="text-sm font-bold text-slate-400">TD</span>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-900 uppercase">{pkg.name}</h3>
                                    <p className="text-sm font-semibold text-emerald-600">{pkg.duration_text}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-sm font-semibold text-slate-500">x 1</span>
                                </div>
                                <div className="text-right w-24">
                                    <span className="font-bold text-slate-900">{formatPrice(pkg.price)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Buyer Info Form */}
                        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-6 text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                BUYER INFO <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-200 text-[10px] text-slate-500">i</span>
                            </h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="mb-1 block text-sm font-bold text-slate-700">
                                        <span className="text-red-500">*</span> Email
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="Your Email"
                                        className="w-full rounded-lg border border-emerald-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 outline-none transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                    />
                                    {errors.email && <div className="mt-1 text-xs text-red-500">{errors.email}</div>}
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-bold text-slate-700">
                                        <span className="text-red-500">*</span> Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Your Name"
                                        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 outline-none transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                    />
                                    {errors.name && <div className="mt-1 text-xs text-red-500">{errors.name}</div>}
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-bold text-slate-700">
                                        <span className="text-red-500">*</span> Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        placeholder="08xxxxxxx"
                                        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 outline-none transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                    />
                                    {errors.phone && <div className="mt-1 text-xs text-red-500">{errors.phone}</div>}
                                </div>

                                {product.customer_input_label && (
                                    <div>
                                        <label className="mb-1 block text-sm font-bold text-slate-700">
                                            <span className="text-red-500">*</span> {product.customer_input_label}
                                        </label>
                                        <input
                                            type="text"
                                            placeholder={product.customer_input_placeholder || product.customer_input_label}
                                            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 outline-none transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                            value={data.customer_input}
                                            onChange={(e) => setData('customer_input', e.target.value)}
                                        />
                                        {errors.customer_input && <div className="mt-1 text-xs text-red-500">{errors.customer_input}</div>}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Payment Details */}
                    <div className="w-full md:w-2/5">
                        <div className="sticky top-24 flex flex-col gap-4">
                            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">PAYMENT DETAIL</h2>
                                
                                <div className="space-y-3 border-b border-slate-100 pb-4 text-sm">
                                    <div className="flex justify-between text-slate-600">
                                        <span>Subtotal</span>
                                        <span className="font-semibold text-slate-900">{formatPrice(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600">
                                        <span>Discount</span>
                                        <span className={`font-semibold ${isVoucherApplied ? 'text-emerald-600' : 'text-slate-900'}`}>
                                            {isVoucherApplied ? `- ${formatPrice(discount)}` : 'Rp 0'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-slate-600">
                                        <span>Convenience fee</span>
                                        <span className="font-semibold text-slate-900">{formatPrice(convenienceFee)}</span>
                                    </div>
                                </div>
                                
                                <div className="flex justify-between py-4">
                                    <span className="font-bold text-slate-900">TOTAL</span>
                                    <span className="font-bold text-slate-900">{formatPrice(total)}</span>
                                </div>

                                {/* Voucher Section */}
                                {!isVoucherApplied ? (
                                    <>
                                        {!showVoucherInput ? (
                                            <button 
                                                type="button" 
                                                onClick={() => setShowVoucherInput(true)}
                                                className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg border border-emerald-500 px-4 py-2.5 text-sm font-bold text-emerald-600 transition hover:bg-emerald-50"
                                            >
                                                <Ticket className="h-4 w-4" /> Add Voucher
                                            </button>
                                        ) : (
                                            <div className="mb-4 flex flex-col gap-2">
                                                <div className="flex items-center gap-2">
                                                    <input 
                                                        type="text" 
                                                        placeholder="Masukkan Kode Voucher" 
                                                        className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm uppercase outline-none focus:border-emerald-500"
                                                        value={voucherCodeInput}
                                                        onChange={e => setVoucherCodeInput(e.target.value.toUpperCase())}
                                                    />
                                                    <button 
                                                        type="button" 
                                                        onClick={applyVoucher}
                                                        disabled={isApplyingVoucher || !voucherCodeInput}
                                                        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-50"
                                                    >
                                                        {isApplyingVoucher ? 'Cek...' : 'Pakai'}
                                                    </button>
                                                    <button 
                                                        type="button" 
                                                        onClick={() => { setShowVoucherInput(false); setVoucherError(''); }}
                                                        className="p-2 text-slate-400 hover:text-slate-600"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                                {voucherError && <span className="text-xs text-red-500">{voucherError}</span>}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="mb-4 flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                                        <div className="flex items-center gap-2">
                                            <Ticket className="h-4 w-4 text-emerald-600" />
                                            <div>
                                                <p className="text-xs font-bold text-emerald-700">Voucher Terpakai</p>
                                                <p className="text-[10px] font-semibold text-emerald-600">{data.voucher_code}</p>
                                            </div>
                                        </div>
                                        <button 
                                            type="button" 
                                            onClick={removeVoucher}
                                            className="text-xs font-bold text-red-500 hover:text-red-700"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                )}

                                {!isVoucherApplied && (
                                    <div className="mb-4">
                                        <div className="flex w-full items-center justify-between rounded-t-lg border border-emerald-500 px-4 py-3 cursor-pointer">
                                            <div className="flex items-center gap-3">
                                                <CreditCard className="h-5 w-5 text-emerald-600" />
                                                <span className="font-bold text-slate-900 text-sm">Select payment method</span>
                                            </div>
                                            <span className="text-emerald-600">›</span>
                                        </div>
                                        
                                        <div className="border border-t-0 border-emerald-500 rounded-b-lg p-4 bg-slate-50 flex items-start gap-3">
                                            <Lock className="h-8 w-8 text-emerald-500 shrink-0" />
                                            <div>
                                                <p className="text-xs font-bold text-slate-900">Secure Payment</p>
                                                <p className="text-[10px] text-slate-500">All your payments are secured with RSA encryption</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {!isVoucherApplied && data.payment_method === 'points' && (
                                    <div className="mb-4">
                                        <label className="mb-1 block text-sm font-bold text-slate-700">PIN Poin</label>
                                        <input
                                            type="password"
                                            inputMode="numeric"
                                            maxLength="6"
                                            placeholder="6 digit PIN"
                                            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm tracking-widest outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                            value={data.pin}
                                            onChange={(e) => setData('pin', e.target.value)}
                                        />
                                        {errors.pin && <div className="mt-1 text-xs text-red-500">{errors.pin}</div>}
                                    </div>
                                )}

                                <div className="mb-6 space-y-3">
                                    <label className="flex items-start gap-2 cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                            checked={data.agree_terms}
                                            onChange={(e) => setData('agree_terms', e.target.checked)}
                                            required
                                        />
                                        <span className="text-xs text-slate-600">
                                            I agree to the <a href="#" className="font-semibold text-emerald-600">Terms of Use</a>
                                        </span>
                                    </label>
                                    <label className="flex items-start gap-2 cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                            checked={data.agree_newsletter}
                                            onChange={(e) => setData('agree_newsletter', e.target.checked)}
                                        />
                                        <span className="text-[10px] leading-relaxed text-slate-500">
                                            I agree that my email and phone number may be used to receive newsletters or marketing messages, which I can unsubscribe from at any time.
                                        </span>
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full rounded-lg bg-emerald-500 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {processing ? 'PROCESSING...' : `BUY NOW - ${formatPrice(total)}`}
                                </button>
                                {errors.payment_method && <div className="mt-2 text-center text-xs text-red-500">{errors.payment_method}</div>}
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </PublicLayout>
    );
}
