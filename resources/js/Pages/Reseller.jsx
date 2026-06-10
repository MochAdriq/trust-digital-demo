import { Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function Reseller() {
    return (
        <PublicLayout>
            <Head title="Join Reseller - TrustDigital.ID" />
            <section className="bg-blue-700 py-20 text-center text-white">
                <div className="mx-auto max-w-3xl px-4">
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-blue-100">Program reseller</p>
                    <h1 className="mb-4 text-4xl font-extrabold">Gabung Menjadi Reseller</h1>
                    <p className="mb-8 text-lg text-blue-100">Admin akan mengaktifkan status reseller dan PIN poin pada data customer berbasis email.</p>
                    <a href="mailto:info@trustdigital.id?subject=Daftar%20Reseller%20TrustDigital" className="inline-block rounded-full bg-white px-8 py-4 font-bold text-blue-700 shadow-lg transition hover:bg-slate-50">
                        Daftar via Email
                    </a>
                </div>
            </section>
        </PublicLayout>
    );
}
