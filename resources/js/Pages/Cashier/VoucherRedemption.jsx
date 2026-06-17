import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Ticket,
    ShoppingBag,
    Send,
    CheckCircle2,
    Copy,
    AlertCircle,
    Eye,
    EyeOff,
    RotateCcw,
    Shield,
} from 'lucide-react';

// ============================================================
// Halaman Form Penukaran Voucher — Kasir
// ============================================================
// Kasir memasukkan kode voucher dari Shopee beserta Order ID,
// lalu mendapatkan detail akun digital (CredentialStock) untuk
// diberikan ke pelanggan Shopee.

export default function VoucherRedemption() {
    const { flash } = usePage().props;
    const redemption = flash?.redemption || null;

    const { data, setData, post, processing, errors, reset } = useForm({
        code: '',
        shopee_order_id: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [copiedField, setCopiedField] = useState(null);
    const [showResult, setShowResult] = useState(!!redemption);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('cashier.voucher.redeem'), {
            preserveScroll: true,
            onSuccess: () => {
                setShowResult(true);
                setShowPassword(false);
            },
        });
    };

    const handleReset = () => {
        reset();
        setShowResult(false);
        setShowPassword(false);
        setCopiedField(null);
    };

    const copyToClipboard = async (text, fieldName) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(fieldName);
            setTimeout(() => setCopiedField(null), 2000);
        } catch {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopiedField(fieldName);
            setTimeout(() => setCopiedField(null), 2000);
        }
    };

    const hasError = Object.keys(errors).length > 0;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg shadow-orange-500/25">
                        <Ticket className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            Penukaran Voucher Shopee
                        </h2>
                        <p className="text-sm text-gray-500">
                            Tukarkan kode voucher untuk mendapatkan akun digital
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Penukaran Voucher" />

            <div className="py-8">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">

                    {/* ===== FORM CARD ===== */}
                    <AnimatePresence mode="wait">
                        {!showResult || !redemption ? (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl shadow-gray-200/50">
                                    {/* Header gradient */}
                                    <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <Shield className="h-8 w-8 text-white/90" />
                                            <div>
                                                <h3 className="text-lg font-bold text-white">
                                                    Form Penukaran Voucher
                                                </h3>
                                                <p className="text-sm text-white/80">
                                                    Masukkan kode voucher dan ID pesanan Shopee
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Form body */}
                                    <form onSubmit={handleSubmit} className="space-y-6 p-8">
                                        {/* Error Alert */}
                                        <AnimatePresence>
                                            {hasError && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                                                        <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
                                                        <div>
                                                            <p className="text-sm font-semibold text-red-800">
                                                                Penukaran Gagal
                                                            </p>
                                                            {Object.values(errors).map((error, idx) => (
                                                                <p key={idx} className="mt-1 text-sm text-red-600">
                                                                    {error}
                                                                </p>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Input: Kode Voucher */}
                                        <div>
                                            <label
                                                htmlFor="voucher-code"
                                                className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700"
                                            >
                                                <Ticket className="h-4 w-4 text-orange-500" />
                                                Kode Voucher
                                            </label>
                                            <input
                                                id="voucher-code"
                                                type="text"
                                                value={data.code}
                                                onChange={(e) =>
                                                    setData('code', e.target.value.toUpperCase())
                                                }
                                                placeholder="Contoh: A1B2C3D4E5F6G7H8"
                                                className={`block w-full rounded-xl border-2 px-4 py-3.5 font-mono text-lg font-bold tracking-wider transition-all duration-200 placeholder:text-gray-300 placeholder:font-normal placeholder:tracking-normal placeholder:text-sm focus:ring-2 focus:ring-offset-1 ${
                                                    errors.code
                                                        ? 'border-red-300 bg-red-50 text-red-900 focus:border-red-500 focus:ring-red-500/20'
                                                        : 'border-gray-200 bg-gray-50 text-gray-900 focus:border-orange-500 focus:bg-white focus:ring-orange-500/20'
                                                }`}
                                                autoComplete="off"
                                                autoFocus
                                            />
                                        </div>

                                        {/* Input: Shopee Order ID */}
                                        <div>
                                            <label
                                                htmlFor="shopee-order-id"
                                                className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700"
                                            >
                                                <ShoppingBag className="h-4 w-4 text-orange-500" />
                                                Shopee Order ID
                                            </label>
                                            <input
                                                id="shopee-order-id"
                                                type="text"
                                                value={data.shopee_order_id}
                                                onChange={(e) =>
                                                    setData('shopee_order_id', e.target.value)
                                                }
                                                placeholder="Contoh: 2406120ABCDEFG"
                                                className={`block w-full rounded-xl border-2 px-4 py-3.5 text-base transition-all duration-200 placeholder:text-gray-300 focus:ring-2 focus:ring-offset-1 ${
                                                    errors.shopee_order_id
                                                        ? 'border-red-300 bg-red-50 text-red-900 focus:border-red-500 focus:ring-red-500/20'
                                                        : 'border-gray-200 bg-gray-50 text-gray-900 focus:border-orange-500 focus:bg-white focus:ring-orange-500/20'
                                                }`}
                                                autoComplete="off"
                                            />
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            disabled={processing || !data.code || !data.shopee_order_id}
                                            className="group relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-4 text-base font-bold text-white shadow-lg shadow-orange-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/40 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
                                        >
                                            {/* Shimmer effect */}
                                            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                                            {processing ? (
                                                <>
                                                    <svg
                                                        className="h-5 w-5 animate-spin"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        />
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                                        />
                                                    </svg>
                                                    Memproses...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="h-5 w-5" />
                                                    Tukarkan Voucher
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </div>
                            </motion.div>
                        ) : (
                            /* ===== RESULT CARD ===== */
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.4, ease: 'easeOut' }}
                            >
                                <div className="overflow-hidden rounded-2xl border border-green-200 bg-white shadow-xl shadow-green-100/50">
                                    {/* Success Header */}
                                    <div className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{
                                                    type: 'spring',
                                                    stiffness: 260,
                                                    damping: 20,
                                                    delay: 0.2,
                                                }}
                                            >
                                                <CheckCircle2 className="h-10 w-10 text-white" />
                                            </motion.div>
                                            <div>
                                                <h3 className="text-lg font-bold text-white">
                                                    Voucher Berhasil Ditukar! 🎉
                                                </h3>
                                                <p className="text-sm text-white/80">
                                                    Berikut detail akun digital untuk pelanggan
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6 p-8">
                                        {/* Voucher Info */}
                                        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                                <div>
                                                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                                                        Produk
                                                    </p>
                                                    <p className="mt-1 font-semibold text-gray-900">
                                                        {redemption.product.name}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                                                        Kode Voucher
                                                    </p>
                                                    <p className="mt-1 font-mono font-bold text-orange-600">
                                                        {redemption.voucher.formatted_code}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                                                        Shopee Order ID
                                                    </p>
                                                    <p className="mt-1 font-semibold text-gray-900">
                                                        {redemption.voucher.shopee_order_id}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Credential Details */}
                                        <div className="space-y-4">
                                            <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-500">
                                                <Shield className="h-4 w-4" />
                                                Detail Akun Digital
                                            </h4>

                                            {/* Email */}
                                            {redemption.credential.login_email && (
                                                <CredentialField
                                                    label="Email / Username"
                                                    value={redemption.credential.login_email}
                                                    fieldName="email"
                                                    copiedField={copiedField}
                                                    onCopy={copyToClipboard}
                                                />
                                            )}

                                            {/* Password */}
                                            {redemption.credential.login_password && (
                                                <div className="group rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-orange-200 hover:shadow-sm">
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                                                            Password
                                                        </p>
                                                        <div className="flex gap-1">
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowPassword(!showPassword)}
                                                                className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                                                                title={showPassword ? 'Sembunyikan' : 'Tampilkan'}
                                                            >
                                                                {showPassword ? (
                                                                    <EyeOff className="h-4 w-4" />
                                                                ) : (
                                                                    <Eye className="h-4 w-4" />
                                                                )}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    copyToClipboard(
                                                                        redemption.credential.login_password,
                                                                        'password'
                                                                    )
                                                                }
                                                                className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                                                                    copiedField === 'password'
                                                                        ? 'bg-green-100 text-green-700'
                                                                        : 'bg-gray-100 text-gray-500 hover:bg-orange-100 hover:text-orange-700'
                                                                }`}
                                                            >
                                                                {copiedField === 'password' ? (
                                                                    <>
                                                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                                                        Tersalin!
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Copy className="h-3.5 w-3.5" />
                                                                        Salin
                                                                    </>
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <p className="mt-2 break-all font-mono text-base font-semibold text-gray-900">
                                                        {showPassword
                                                            ? redemption.credential.login_password
                                                            : '••••••••••••'}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Recovery Info */}
                                            {redemption.credential.recovery_information && (
                                                <CredentialField
                                                    label="Recovery Information"
                                                    value={redemption.credential.recovery_information}
                                                    fieldName="recovery"
                                                    copiedField={copiedField}
                                                    onCopy={copyToClipboard}
                                                />
                                            )}

                                            {/* Notes */}
                                            {redemption.credential.notes && (
                                                <CredentialField
                                                    label="Catatan"
                                                    value={redemption.credential.notes}
                                                    fieldName="notes"
                                                    copiedField={copiedField}
                                                    onCopy={copyToClipboard}
                                                />
                                            )}
                                        </div>

                                        {/* Reset Button */}
                                        <button
                                            type="button"
                                            onClick={handleReset}
                                            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-6 py-4 text-base font-bold text-gray-700 transition-all duration-200 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700"
                                        >
                                            <RotateCcw className="h-5 w-5" />
                                            Tukarkan Voucher Lainnya
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

// ============================================================
// Sub-component: CredentialField
// ============================================================
// Reusable component untuk menampilkan satu field credential
// dengan tombol copy.

function CredentialField({ label, value, fieldName, copiedField, onCopy }) {
    return (
        <div className="group rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-orange-200 hover:shadow-sm">
            <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    {label}
                </p>
                <button
                    type="button"
                    onClick={() => onCopy(value, fieldName)}
                    className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                        copiedField === fieldName
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-500 hover:bg-orange-100 hover:text-orange-700'
                    }`}
                >
                    {copiedField === fieldName ? (
                        <>
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Tersalin!
                        </>
                    ) : (
                        <>
                            <Copy className="h-3.5 w-3.5" />
                            Salin
                        </>
                    )}
                </button>
            </div>
            <p className="mt-2 break-all font-mono text-base font-semibold text-gray-900">
                {value}
            </p>
        </div>
    );
}
