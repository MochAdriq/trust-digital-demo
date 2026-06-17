import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { ArrowLeft, CheckCircle, Copy, Eye } from 'lucide-react';
import { useState } from 'react';

const formatPrice = (amount) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount || 0);

function CopyButton({ text }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1 rounded-md bg-white/60 px-2 py-1 text-xs font-medium text-emerald-700 transition hover:bg-white"
            title="Salin"
        >
            {copied ? (
                <>
                    <CheckCircle className="h-3.5 w-3.5" />
                    Tersalin!
                </>
            ) : (
                <>
                    <Copy className="h-3.5 w-3.5" />
                    Salin
                </>
            )}
        </button>
    );
}

export default function CustomerNotificationDetail({ customer_email, notification_token, notification }) {
    const payload = notification.payload || {};
    const credentials = payload.credentials || [];
    const items = payload.items || [];

    return (
        <PublicLayout>
            <Head title={notification.title} />

            <div className="mx-auto max-w-3xl px-4 py-10 md:py-16">
                {/* Back link */}
                <Link
                    href={route('customer.notifications.index', notification_token)}
                    className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-800"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali ke semua notifikasi
                </Link>

                {/* Notification Header */}
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-blue-600">Detail Notifikasi</p>
                            <h1 className="mt-2 text-2xl font-extrabold text-slate-900">{notification.title}</h1>
                            <p className="mt-2 text-sm text-slate-500">{notification.message}</p>
                        </div>
                        {notification.read_at && (
                            <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                                <Eye className="h-3.5 w-3.5" />
                                Sudah dibaca
                            </span>
                        )}
                    </div>
                    <div className="mt-4 flex items-center gap-3 text-xs text-slate-400">
                        <span>{new Date(notification.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })} WIB</span>
                        {payload.order_number && (
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 font-mono font-medium text-slate-600">{payload.order_number}</span>
                        )}
                    </div>
                </div>

                {/* Order Summary */}
                {items.length > 0 && (
                    <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-extrabold text-slate-900">Produk yang Dibeli</h2>
                        <div className="space-y-3">
                            {items.map((item, i) => (
                                <div key={i} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4">
                                    <div>
                                        <h3 className="font-bold text-slate-900">{item.product_name}</h3>
                                        <p className="mt-0.5 text-sm text-slate-500">Qty {item.quantity}</p>
                                    </div>
                                    <span className="font-bold text-slate-900">{formatPrice(item.price)}</span>
                                </div>
                            ))}
                        </div>
                        {payload.total_price && (
                            <div className="mt-4 flex justify-between border-t border-slate-100 pt-4 text-sm">
                                <span className="font-medium text-slate-500">Total</span>
                                <span className="font-extrabold text-slate-900">{formatPrice(payload.total_price)}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Credentials */}
                {credentials.length > 0 && (
                    <div className="mt-6 rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-emerald-600" />
                            <h2 className="text-lg font-extrabold text-slate-900">Detail Akun Anda</h2>
                        </div>
                        <p className="mb-4 rounded-xl bg-emerald-50 border border-emerald-100 p-3 text-sm text-emerald-800">
                            Simpan informasi akun berikut dengan aman. Data ini tersimpan permanen di sistem kami dan dapat Anda akses kapan saja.
                        </p>
                        <div className="space-y-4">
                            {credentials.map((credential, index) => (
                                <div key={index} className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-5">
                                    <h3 className="mb-4 text-sm font-bold text-emerald-950">
                                        {credential.label || credential.product_name || 'Akun'}
                                    </h3>

                                    <dl className="space-y-3">
                                        <div className="flex items-start justify-between gap-4">
                                            <dt className="text-sm text-emerald-700">Email / Username</dt>
                                            <dd className="flex items-center gap-2">
                                                <span className="font-mono text-sm font-bold text-emerald-950">{credential.login_email || '-'}</span>
                                                {credential.login_email && <CopyButton text={credential.login_email} />}
                                            </dd>
                                        </div>
                                        <div className="flex items-start justify-between gap-4">
                                            <dt className="text-sm text-emerald-700">Password</dt>
                                            <dd className="flex items-center gap-2">
                                                <span className="font-mono text-sm font-bold text-emerald-950">{credential.login_password || '-'}</span>
                                                {credential.login_password && <CopyButton text={credential.login_password} />}
                                            </dd>
                                        </div>
                                        {credential.recovery_information && (
                                            <div>
                                                <dt className="mb-1 text-sm text-emerald-700">Recovery Information</dt>
                                                <dd className="flex items-start justify-between gap-2">
                                                    <span className="whitespace-pre-wrap font-mono text-sm text-emerald-950">{credential.recovery_information}</span>
                                                    <CopyButton text={credential.recovery_information} />
                                                </dd>
                                            </div>
                                        )}
                                        {credential.notes && (
                                            <div className="border-t border-emerald-100 pt-3">
                                                <dt className="mb-1 text-xs font-semibold uppercase tracking-wide text-emerald-600">Catatan</dt>
                                                <dd className="text-sm text-emerald-800">{credential.notes}</dd>
                                            </div>
                                        )}
                                    </dl>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* No credentials fallback */}
                {credentials.length === 0 && (
                    <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 p-5 text-sm text-amber-800">
                        Detail akun belum tersedia. Pesanan sedang menunggu stok atau proses manual oleh admin.
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
