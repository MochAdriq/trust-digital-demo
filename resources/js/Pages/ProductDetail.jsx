import { Head, useForm } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

const formatPrice = (amount) => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
}).format(amount || 0);

export default function ProductDetail({ product }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        pin: '',
        product_id: product.id,
        quantity: 1,
        payment_method: 'gateway',
        customer_input: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/checkout');
    };

    return (
        <PublicLayout>
            <Head title={product.name} />

            <div className="mx-auto max-w-4xl px-4 py-12 md:py-20">
                <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl md:flex">
                    <div className="flex flex-col items-center justify-center border-r border-slate-100 bg-slate-50 p-8 text-center md:w-1/2">
                        <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                            {product.image ? (
                                <img src={product.image} alt={product.name} className="h-full w-full object-contain" />
                            ) : (
                                <span className="text-lg font-bold text-slate-400">TD</span>
                            )}
                        </div>
                        <span className="mb-2 text-xs font-bold uppercase tracking-widest text-indigo-600">{product.category.name}</span>
                        <h1 className="mb-4 text-3xl font-extrabold text-slate-900">{product.name}</h1>
                        <p className="mb-8 text-slate-500">{product.description}</p>

                        <div className="w-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                            <span className="mb-1 block text-sm text-slate-500">Harga</span>
                            <span className="text-3xl font-extrabold text-blue-700">{formatPrice(product.price)}</span>
                            {product.points_price && (
                                <span className="mt-2 block text-sm font-bold text-slate-600">{product.points_price} poin</span>
                            )}
                        </div>
                    </div>

                    <div className="p-8 md:w-1/2 md:p-12">
                        <h2 className="mb-3 text-2xl font-bold text-slate-900">Checkout Cepat</h2>
                        <p className="mb-8 text-sm text-slate-500">Tidak perlu registrasi. Email digunakan untuk invoice, magic link tracking, dan pengiriman detail pesanan.</p>

                        <form onSubmit={submit} className="space-y-6">
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
                                        Gateway
                                    </button>
                                    <button
                                        type="button"
                                        disabled={!product.points_price}
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
                                {errors.pin && <div className="mt-1 text-sm text-red-500">{errors.pin}</div>}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-xl bg-blue-600 py-4 font-bold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing ? 'Memproses...' : 'Buat Pesanan'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
