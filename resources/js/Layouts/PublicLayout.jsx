import { Link } from '@inertiajs/react';

export default function PublicLayout({ children }) {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-950 antialiased">
            <div className="relative isolate overflow-x-clip">
                <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
                    <div className="mx-auto flex h-18 max-w-6xl items-center justify-between gap-6 px-4 py-2 sm:px-6">
                        <Link href="/" className="flex items-center gap-3">
                            <img src="http://43.157.198.223/assets/images/logo_td_2.png" alt="TrustDigital.ID" className="h-14 w-auto" />
                        </Link>

                        <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-700 lg:flex">
                            <Link href="/" className="transition hover:text-blue-700">Beranda</Link>
                            <Link href="/produk?category=akun-premium" className="transition hover:text-blue-700">Akun Premium</Link>
                            <Link href="/produk?category=top-up-game" className="transition hover:text-blue-700">Top Up Game</Link>
                            <Link href="/produk?category=social-media" className="transition hover:text-blue-700">Social Media</Link>
                            <Link href="/track" className="transition hover:text-blue-700">Lacak Pesanan</Link>
                            <Link href="/faq" className="transition hover:text-blue-700">FAQ</Link>
                        </nav>

                        <div className="flex items-center gap-3">
                            <a href="mailto:info@trustdigital.id" className="hidden items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-blue-700 lg:inline-flex">
                                Hubungi Kami
                            </a>
                        </div>
                    </div>
                </header>

                <main>{children}</main>

                <footer className="mt-auto bg-slate-900 py-12 text-white">
                    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                            <div>
                                <img alt="TrustDigital.ID" className="mb-4 h-10 w-auto brightness-0 invert" src="http://43.157.198.223/assets/images/logo_td_2.png" />
                                <p className="mb-4 text-sm text-slate-400">Teman terpercaya untuk berlangganan aplikasi premium dengan harga terjangkau dan pelayanan terbaik.</p>
                            </div>
                            <div>
                                <h3 className="mb-4 text-lg font-semibold">Layanan</h3>
                                <ul className="space-y-2 text-sm text-slate-400">
                                    <li><Link href="/produk?category=akun-premium" className="transition hover:text-white">Aplikasi Premium</Link></li>
                                    <li><Link href="/produk?category=top-up-game" className="transition hover:text-white">Top Up Game</Link></li>
                                    <li><Link href="/produk?category=social-media" className="transition hover:text-white">Social Media</Link></li>
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
