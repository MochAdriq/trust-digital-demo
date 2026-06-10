import { Head, useForm } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function OrderTracking({ error }) {
    const { data, setData, post, processing } = useForm({
        order_number: '',
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/track');
    };

    return (
        <PublicLayout>
            <Head title="Lacak Pesanan" />

            <div className="mx-auto max-w-3xl px-4 py-12 md:py-20">
                <div className="mb-10 text-center">
                    <h1 className="mb-4 text-4xl font-extrabold text-slate-900">Lacak Pesanan</h1>
                    <p className="text-slate-500">Gunakan email dan nomor pesanan untuk membuka magic link pesanan.</p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-xl md:p-12">
                    <form onSubmit={submit} className="mx-auto max-w-lg space-y-6">
                        <div>
                            <label className="mb-2 block text-sm font-bold text-slate-700">Nomor Pesanan</label>
                            <input
                                type="text"
                                required
                                placeholder="TRX-260607-ABC123"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono font-medium uppercase text-slate-900 transition-all focus:ring-2 focus:ring-blue-500"
                                value={data.order_number}
                                onChange={(e) => setData('order_number', e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-bold text-slate-700">Email</label>
                            <input
                                type="email"
                                required
                                placeholder="nama@email.com"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium text-slate-900 transition-all focus:ring-2 focus:ring-blue-500"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                        </div>

                        {error && (
                            <div className="rounded-r-lg border-l-4 border-red-500 bg-red-50 p-4">
                                <p className="text-sm font-medium text-red-700">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full rounded-xl bg-slate-900 py-4 font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:opacity-50"
                        >
                            {processing ? 'Mencari...' : 'Buka Pesanan'}
                        </button>
                    </form>
                </div>
            </div>
        </PublicLayout>
    );
}
