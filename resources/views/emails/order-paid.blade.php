<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pembayaran Berhasil - {{ $order->order_number }}</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f1f5f9;padding:32px 0;">
        <tr>
            <td align="center">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
                    {{-- Header --}}
                    <tr>
                        <td style="background-color:#2563eb;padding:28px 32px;text-align:center;">
                            <img src="http://43.157.198.223/assets/images/logo_td_2.png" alt="TrustDigital.ID" style="height:48px;width:auto;filter:brightness(0) invert(1);" />
                        </td>
                    </tr>

                    {{-- Greeting --}}
                    <tr>
                        <td style="padding:32px 32px 16px;">
                            <h1 style="margin:0;font-size:22px;font-weight:800;color:#0f172a;">Pembayaran Berhasil!</h1>
                            <p style="margin:12px 0 0;font-size:15px;color:#475569;line-height:1.6;">
                                Halo! Pembayaran untuk pesanan Anda telah berhasil kami terima. Berikut detail pesanan Anda.
                            </p>
                        </td>
                    </tr>

                    {{-- Order Info --}}
                    <tr>
                        <td style="padding:0 32px 24px;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;">
                                <tr>
                                    <td style="padding:16px 20px;">
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td style="font-size:13px;color:#64748b;padding-bottom:8px;">Nomor Pesanan</td>
                                                <td style="font-size:13px;font-weight:700;color:#0f172a;text-align:right;padding-bottom:8px;">{{ $order->order_number }}</td>
                                            </tr>
                                            <tr>
                                                <td style="font-size:13px;color:#64748b;padding-bottom:8px;">Total Pembayaran</td>
                                                <td style="font-size:13px;font-weight:700;color:#0f172a;text-align:right;padding-bottom:8px;">
                                                    Rp {{ number_format($order->total_price, 0, ',', '.') }}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="font-size:13px;color:#64748b;">Tanggal</td>
                                                <td style="font-size:13px;font-weight:700;color:#0f172a;text-align:right;">
                                                    {{ $order->paid_at ? $order->paid_at->format('d M Y, H:i') : $order->created_at->format('d M Y, H:i') }} WIB
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    {{-- Items --}}
                    <tr>
                        <td style="padding:0 32px 24px;">
                            <h2 style="margin:0 0 12px;font-size:16px;font-weight:700;color:#0f172a;">Produk yang Dibeli</h2>
                            @foreach($order->items as $item)
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:8px;">
                                    <tr>
                                        <td style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px 16px;">
                                            <span style="font-size:14px;font-weight:600;color:#0f172a;">{{ $item->product_name }}</span>
                                            <span style="font-size:13px;color:#64748b;display:block;margin-top:4px;">
                                                Qty {{ $item->quantity }} &middot; Rp {{ number_format($item->price, 0, ',', '.') }}
                                            </span>
                                        </td>
                                    </tr>
                                </table>
                            @endforeach
                        </td>
                    </tr>

                    {{-- Credentials --}}
                    @if(count($credentials) > 0)
                    <tr>
                        <td style="padding:0 32px 24px;">
                            <h2 style="margin:0 0 12px;font-size:16px;font-weight:700;color:#0f172a;">Detail Akun Anda</h2>
                            <p style="margin:0 0 12px;font-size:13px;color:#475569;">Simpan informasi ini dengan aman. Ini adalah akun yang telah dikirimkan untuk Anda.</p>
                            @foreach($credentials as $credential)
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:12px;">
                                    <tr>
                                        <td style="background-color:#ecfdf5;border:1px solid #a7f3d0;border-radius:8px;padding:16px;">
                                            <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:#064e3b;">
                                                {{ $credential['label'] ?? $credential['product_name'] ?? 'Akun' }}
                                            </p>
                                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                                <tr>
                                                    <td style="font-size:13px;color:#047857;padding-bottom:6px;">Email / Username</td>
                                                    <td style="font-size:13px;font-weight:700;color:#064e3b;text-align:right;padding-bottom:6px;font-family:monospace;">
                                                        {{ $credential['login_email'] ?? '-' }}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="font-size:13px;color:#047857;padding-bottom:6px;">Password</td>
                                                    <td style="font-size:13px;font-weight:700;color:#064e3b;text-align:right;padding-bottom:6px;font-family:monospace;">
                                                        {{ $credential['login_password'] ?? '-' }}
                                                    </td>
                                                </tr>
                                                @if(!empty($credential['recovery_information']))
                                                <tr>
                                                    <td style="font-size:13px;color:#047857;padding-bottom:6px;vertical-align:top;">Recovery</td>
                                                    <td style="font-size:13px;font-weight:700;color:#064e3b;text-align:right;padding-bottom:6px;font-family:monospace;">
                                                        {{ $credential['recovery_information'] }}
                                                    </td>
                                                </tr>
                                                @endif
                                                @if(!empty($credential['notes']))
                                                <tr>
                                                    <td colspan="2" style="font-size:12px;color:#047857;padding-top:8px;border-top:1px solid #a7f3d0;">
                                                        <strong>Catatan:</strong> {{ $credential['notes'] }}
                                                    </td>
                                                </tr>
                                                @endif
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            @endforeach
                        </td>
                    </tr>
                    @endif

                    {{-- CTA Button --}}
                    <tr>
                        <td style="padding:0 32px 32px;text-align:center;">
                            <a href="{{ route('customer.notifications.index', $notificationToken) }}"
                               style="display:inline-block;background-color:#2563eb;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:8px;">
                                Lihat Semua Notifikasi Saya
                            </a>
                            <p style="margin:16px 0 0;font-size:12px;color:#94a3b8;">
                                Atau salin link ini:<br/>
                                <span style="font-family:monospace;word-break:break-all;">{{ route('customer.notifications.index', $notificationToken) }}</span>
                            </p>
                        </td>
                    </tr>

                    {{-- Footer --}}
                    <tr>
                        <td style="background-color:#0f172a;padding:24px 32px;text-align:center;">
                            <p style="margin:0;font-size:13px;color:#94a3b8;">
                                &copy; {{ date('Y') }} TrustDigital.ID &mdash; Semua hak dilindungi.
                            </p>
                            <p style="margin:8px 0 0;font-size:12px;color:#64748b;">
                                Jika Anda tidak merasa melakukan pembelian ini, silakan hubungi
                                <a href="mailto:info@trustdigital.id" style="color:#60a5fa;text-decoration:underline;">info@trustdigital.id</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
