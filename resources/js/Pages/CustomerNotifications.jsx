import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Bell, BellRing, Package, CreditCard, CheckCircle } from 'lucide-react';

const typeIcon = {
    payment_success: CreditCard,
    credential_delivered: Package,
};

const typeColor = {
    payment_success: 'bg-blue-50 text-blue-700 border-blue-100',
    credential_delivered: 'bg-emerald-50 text-emerald-700 border-emerald-100',
};

export default function CustomerNotifications({ customer_email, notification_token, notifications, unread_count }) {
    return (
        <PublicLayout>
            <Head title="Notifikasi Saya" />

            <div className="mx-auto max-w-3xl px-4 py-10 md:py-16">
                {/* Header */}
                <div className="mb-8">
                    <p className="text-sm font-bold uppercase tracking-widest text-blue-600">Pusat Notifikasi</p>
                    <h1 className="mt-2 text-3xl font-extrabold text-slate-900">Notifikasi Saya</h1>
                    <p className="mt-2 text-sm text-slate-500">{customer_email}</p>
                    {unread_count > 0 && (
                        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-bold text-amber-700">
                            <BellRing className="h-3.5 w-3.5" />
                            {unread_count} belum dibaca
                        </span>
                    )}
                </div>

                {/* Notification List */}
                {notifications.length === 0 ? (
                    <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center shadow-sm">
                        <Bell className="mx-auto h-12 w-12 text-slate-300" />
                        <p className="mt-4 text-sm font-medium text-slate-500">Belum ada notifikasi.</p>
                        <p className="mt-1 text-xs text-slate-400">Notifikasi akan muncul setelah pembayaran berhasil.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {notifications.map((n) => {
                            const Icon = typeIcon[n.type] || Bell;
                            const colorClass = typeColor[n.type] || 'bg-slate-50 text-slate-700 border-slate-100';
                            const isUnread = !n.read_at;

                            return (
                                <Link
                                    key={n.id}
                                    href={route('customer.notifications.show', [notification_token, n.id])}
                                    className={`block rounded-2xl border p-5 transition hover:shadow-md ${
                                        isUnread
                                            ? 'border-blue-200 bg-blue-50/50 shadow-sm'
                                            : 'border-slate-100 bg-white shadow-sm hover:border-slate-200'
                                    }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${colorClass}`}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className={`text-sm font-bold ${isUnread ? 'text-blue-900' : 'text-slate-900'}`}>
                                                    {n.title}
                                                </h3>
                                                {isUnread && (
                                                    <span className="inline-flex h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                                                )}
                                            </div>
                                            <p className="mt-1 text-sm text-slate-500 line-clamp-2">{n.message}</p>
                                            <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
                                                <span>{new Date(n.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                                {n.order_number && (
                                                    <span className="rounded-full bg-slate-100 px-2 py-0.5 font-mono font-medium text-slate-600">
                                                        {n.order_number}
                                                    </span>
                                                )}
                                                {n.credential_count > 0 && (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 font-medium text-emerald-600">
                                                        <CheckCircle className="h-3 w-3" />
                                                        {n.credential_count} akun
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
