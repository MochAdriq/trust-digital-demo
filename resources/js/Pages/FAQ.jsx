import { Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function FAQ() {
    return (
        <PublicLayout>
            <Head title="FAQ - TrustDigital.ID" />
            <section className="mx-auto min-h-[60vh] max-w-4xl bg-slate-50 px-4 py-20">
                <h1 className="mb-8 text-center text-3xl font-extrabold text-slate-900">Tanya Jawab (FAQ)</h1>

                <div className="space-y-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="mb-2 font-bold text-slate-900">Bagaimana cara memesan?</h3>
                        <p className="text-sm text-slate-600">Pilih produk, masukkan email, lalu buat pesanan. Sistem akan menyiapkan magic link tracking untuk membuka status dan detail pesanan.</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="mb-2 font-bold text-slate-900">Kapan akun muncul?</h3>
                        <p className="text-sm text-slate-600">Akun muncul di magic link setelah pembayaran tercatat paid dan stok credential tersedia. Produk top up atau social boost diproses manual oleh admin.</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="mb-2 font-bold text-slate-900">Poin digunakan untuk apa?</h3>
                        <p className="text-sm text-slate-600">Poin adalah saldo reward untuk membeli produk lain, bukan diskon sebagian dari harga checkout.</p>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
