import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Bell, ExternalLink, Copy, Check } from 'lucide-react';

const CopyableField = ({ label, value }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (!value) return;
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col gap-1.5">
            <dt className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">{label}</dt>
            <dd className="flex items-center justify-between rounded-xl border border-emerald-200 bg-white p-3 shadow-sm transition-colors hover:border-emerald-300">
                <span className="font-mono text-sm font-extrabold text-emerald-950">{value || '-'}</span>
                {value && (
                    <button
                        onClick={handleCopy}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 transition-colors hover:bg-emerald-100 hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
                        title="Copy"
                    >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                )}
            </dd>
        </div>
    );
};

const formatPrice = (amount) => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
}).format(amount || 0);

const statusLabel = {
    pending_payment: 'Menunggu Pembayaran',
    paid: 'Pembayaran Berhasil',
    paid_awaiting_stock: 'Menunggu Stok',
    paid_manual_review: 'Diproses Manual',
    completed: 'Selesai',
    payment_failed: 'Pembayaran Gagal',
};

export default function OrderMagic({ order, credentials, customer_notification_token }) {
    const hasCredentials = credentials && credentials.length > 0;

    return (
        <PublicLayout>
            <Head title={`Pesanan ${order.order_number}`} />

            <div className="mx-auto max-w-5xl px-4 py-10 md:py-16">
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-widest text-blue-600">Magic Link Pesanan</p>
                        <h1 className="mt-2 text-3xl font-extrabold text-slate-900">{order.order_number}</h1>
                        <p className="mt-2 text-sm text-slate-500">{order.customer_email}</p>
                    </div>
                    <span className="w-fit rounded-full bg-blue-50 px-4 py-2 text-sm font-extrabold text-blue-700">
                        {statusLabel[order.status] || order.status}
                    </span>
                </div>

                {/* Notification banner */}
                {customer_notification_token && order.payment_status === 'paid' && (
                    <Link
                        href={route('customer.notifications.index', customer_notification_token)}
                        className="mb-6 flex items-center gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 transition hover:shadow-md"
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100">
                            <Bell className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-blue-900">Lihat Semua Notifikasi Anda</p>
                            <p className="mt-0.5 text-xs text-blue-600">Akses permanen detail akun dan riwayat pesanan Anda di pusat notifikasi.</p>
                        </div>
                        <ExternalLink className="h-5 w-5 shrink-0 text-blue-400" />
                    </Link>
                )}

                <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                        <h2 className="mb-5 text-lg font-extrabold text-slate-900">Detail Pesanan</h2>
                        <div className="space-y-4">
                            {order.items.map((item, index) => (
                                <div key={`${item.product_name}-${index}`} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h3 className="font-bold text-slate-900">{item.product_name}</h3>
                                            <p className="mt-1 text-sm text-slate-500">Qty {item.quantity}</p>
                                            {item.customer_input && (
                                                <p className="mt-1 text-sm text-slate-500">Input: {item.customer_input}</p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-slate-900">{formatPrice(item.price)}</p>
                                            {item.points_price && <p className="mt-1 text-xs font-bold text-slate-500">{item.points_price} poin</p>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {order.payment_status === 'paid' && hasCredentials && (
                            <div className="mt-8 border-t border-slate-100 pt-8">
                                <h2 className="mb-5 text-lg font-extrabold text-slate-900">Detail Akun</h2>
                                <div className="space-y-4">
                                    {credentials.map((credential, index) => (
                                        <div key={`${credential.login_email}-${index}`} className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                                            <div className="mb-3 flex items-center justify-between gap-4">
                                                <h3 className="font-bold text-emerald-950">{credential.label || credential.product_name || 'Credential'}</h3>
                                                <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white">Delivered</span>
                                            </div>
                                            <dl className="mt-4 space-y-4">
                                                <CopyableField label="Email / Username" value={credential.login_email} />
                                                <CopyableField label="Password" value={credential.login_password} />
                                                
                                                {credential.recovery_information && (
                                                    <div className="rounded-xl border border-emerald-100 bg-white/60 p-3">
                                                        <dt className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Recovery</dt>
                                                        <dd className="mt-1 whitespace-pre-wrap font-mono text-sm text-emerald-950">{credential.recovery_information}</dd>
                                                    </div>
                                                )}
                                                {credential.notes && (
                                                    <div className="rounded-xl border border-emerald-100 bg-white/60 p-3">
                                                        <dt className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Catatan</dt>
                                                        <dd className="mt-1 whitespace-pre-wrap text-sm text-emerald-950">{credential.notes}</dd>
                                                    </div>
                                                )}
                                            </dl>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {order.payment_status === 'paid' && !hasCredentials && (
                            <div className="mt-8 rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm font-medium text-amber-800">
                                Pembayaran sudah tercatat. Pesanan ini menunggu stok atau proses manual admin.
                            </div>
                        )}

                        {order.payment_status !== 'paid' && (
                            <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm font-medium text-blue-800">
                                Pembayaran gateway belum aktif pada fondasi ini. Setelah Midtrans/Xendit diaktifkan dan webhook menerima status paid, detail akun akan muncul otomatis di halaman ini.
                            </div>
                        )}
                    </section>

                    <aside className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                        <h2 className="mb-5 text-lg font-extrabold text-slate-900">Ringkasan</h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between gap-4">
                                <span className="text-slate-500">Payment</span>
                                <span className="font-bold capitalize text-slate-900">{order.payment_status}</span>
                            </div>
                            <div className="flex justify-between gap-4">
                                <span className="text-slate-500">Fulfillment</span>
                                <span className="font-bold capitalize text-slate-900">{order.fulfillment_status}</span>
                            </div>
                            <div className="flex justify-between gap-4">
                                <span className="text-slate-500">Total</span>
                                <span className="font-bold text-slate-900">{formatPrice(order.total_price)}</span>
                            </div>
                            <div className="flex justify-between gap-4">
                                <span className="text-slate-500">Tagihan</span>
                                <span className="font-bold text-slate-900">{formatPrice(order.amount_payable)}</span>
                            </div>
                            {order.points_used > 0 && (
                                <div className="flex justify-between gap-4">
                                    <span className="text-slate-500">Poin digunakan</span>
                                    <span className="font-bold text-slate-900">{order.points_used}</span>
                                </div>
                            )}
                            {order.points_earned > 0 && (
                                <div className="flex justify-between gap-4">
                                    <span className="text-slate-500">Poin didapat</span>
                                    <span className="font-bold text-slate-900">{order.points_earned}</span>
                                </div>
                            )}
                            <div className="flex justify-between gap-4">
                                <span className="text-slate-500">Dibuat</span>
                                <span className="font-bold text-slate-900">{new Date(order.created_at).toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </PublicLayout>
    );
}
