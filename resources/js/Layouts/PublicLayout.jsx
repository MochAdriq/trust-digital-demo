import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Bell, Menu, X } from 'lucide-react';

export default function PublicLayout({ children }) {
    const [mobileOpen, setMobileOpen] = useState(false);

    const navLinks = [
        { href: '/', label: 'Beranda' },
        { href: '/?category=akun-premium', label: 'Akun Premium' },
        { href: '/?category=top-up-game', label: 'Top Up Game' },
        { href: '/?category=social-media', label: 'Social Media' },
        { href: '/track', label: 'Lacak Pesanan' },
        { href: '/faq', label: 'FAQ' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-950 antialiased">
            <div className="relative isolate overflow-x-clip">
                <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
                    <div className="mx-auto flex h-18 max-w-6xl items-center justify-between gap-6 px-4 py-2 sm:px-6">
                        <Link href="/" className="flex items-center gap-3">
                            <img src="/images/logo.png" alt="TrustDigital.ID" className="h-14 w-auto" />
                        </Link>

                        <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-700 lg:flex">
                            {navLinks.map((link) => (
                                <Link key={link.href} href={link.href} className="transition hover:text-blue-700">{link.label}</Link>
                            ))}
                        </nav>

                        <div className="flex items-center gap-3">
                            <a href="mailto:info@trustdigital.id" className="hidden items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-blue-700 lg:inline-flex">
                                Hubungi Kami
                            </a>
                            <button
                                type="button"
                                className="inline-flex items-center justify-center rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 lg:hidden"
                                onClick={() => setMobileOpen(!mobileOpen)}
                                aria-label="Toggle menu"
                            >
                                {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile menu */}
                    {mobileOpen && (
                        <nav className="border-t border-slate-200 bg-white px-4 pb-4 lg:hidden">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="block py-3 text-sm font-semibold text-slate-700 transition hover:text-blue-700"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <a href="mailto:info@trustdigital.id" className="block py-3 text-sm font-semibold text-slate-500 transition hover:text-blue-700">
                                Hubungi Kami
                            </a>
                        </nav>
                    )}
                </header>

                <main>{children}</main>

                <footer className="mt-auto bg-slate-900 py-12 text-white">
                    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                            <div>
                                <img alt="TrustDigital.ID" className="mb-4 h-10 w-auto brightness-0 invert" src="/images/logo.png" />
                                <p className="mb-4 text-sm text-slate-400">Teman terpercaya untuk berlangganan aplikasi premium dengan harga terjangkau dan pelayanan terbaik.</p>
                            </div>
                            <div>
                                <h3 className="mb-4 text-lg font-semibold">Layanan</h3>
                                <ul className="space-y-2 text-sm text-slate-400">
                                    <li><Link href="/?category=akun-premium" className="transition hover:text-white">Aplikasi Premium</Link></li>
                                    <li><Link href="/?category=top-up-game" className="transition hover:text-white">Top Up Game</Link></li>
                                    <li><Link href="/?category=social-media" className="transition hover:text-white">Social Media</Link></li>
                                    <li><Link href="/reseller" className="transition hover:text-white">Join Reseller</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="mb-4 text-lg font-semibold">Bantuan</h3>
                                <ul className="space-y-2 text-sm text-slate-400">
                                    <li><Link href="/faq" className="transition hover:text-white">Cara Berlangganan</Link></li>
                                    <li><Link href="/faq" className="transition hover:text-white">FAQ</Link></li>
                                    <li><Link href="/faq" className="transition hover:text-white">Syarat & Ketentuan</Link></li>
                                    <li><Link href="/faq" className="transition hover:text-white">Kebijakan Privasi</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="mb-4 text-lg font-semibold">Kontak</h3>
                                <div className="space-y-3 text-sm text-slate-400">
                                    <div>
                                        <span className="block font-semibold text-slate-300">Email</span>
                                        <span>info@trustdigital.id</span>
                                    </div>
                                    <div>
                                        <span className="block font-semibold text-slate-300">Lokasi</span>
                                        <span>Jakarta, Indonesia</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-12 border-t border-slate-800 pt-8 text-center text-sm text-slate-400">
                            <p>Copyright {new Date().getFullYear()} TrustDigital.ID. Semua hak dilindungi.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
