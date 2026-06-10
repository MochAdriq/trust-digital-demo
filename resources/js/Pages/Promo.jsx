import { Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function Promo() {
    return (
        <PublicLayout>
            <Head title="Promo Terbaru - TrustDigital.ID" />
            <section className="bg-slate-50 py-20 min-h-[60vh] flex items-center justify-center text-center">
                <div>
                    <span className="text-6xl block mb-6">🎉</span>
                    <h1 className="text-3xl font-extrabold text-slate-900 mb-4">Promo Sedang Disiapkan</h1>
                    <p className="text-slate-500 max-w-md mx-auto">Kami sedang menyiapkan promo menarik untuk Anda. Cek kembali secara berkala ya!</p>
                </div>
            </section>
        </PublicLayout>
    );
}
