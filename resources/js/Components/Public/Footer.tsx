import React from 'react';
import { Link } from '@inertiajs/react';
import { Badge } from '@/Components/ui/badge';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube, ExternalLink, Heart } from 'lucide-react';

interface FooterProps {
    visitorStats?: {
        total: number;
        today: number;
        thisMonth: number;
    };
}

export const Footer: React.FC<FooterProps> = ({ visitorStats }) => {
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300">
            {/* Main Footer Content */}
            <div className="container mx-auto px-4 py-12 lg:py-16">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
                    {/* Logo & Description */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center space-x-3 mb-5">
                            <img 
                                src="/images/logo-tut-wuri-handayani.svg" 
                                alt="Logo Kemendikdasmen" 
                                className="h-12 w-12"
                            />
                            <div>
                                <span className="font-bold text-white text-lg block leading-tight">
                                    Balai Bahasa
                                </span>
                                <span className="text-sm text-gray-400">Sulawesi Tenggara</span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed mb-5">
                            Lembaga pemerintah di bawah Kementerian Pendidikan Dasar dan Menengah yang bertugas melakukan pengembangan, pembinaan, dan pelindungan bahasa dan sastra Indonesia.
                        </p>
                        {/* Social Media */}
                        <div className="flex gap-3">
                            <a href="https://facebook.com/balaibahasa.sultra" target="_blank" rel="noopener noreferrer" 
                               className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-colors">
                                <Facebook className="h-4 w-4" />
                            </a>
                            <a href="https://instagram.com/balaibahasa.sultra" target="_blank" rel="noopener noreferrer"
                               className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-pink-600 flex items-center justify-center transition-colors">
                                <Instagram className="h-4 w-4" />
                            </a>
                            <a href="https://youtube.com/@balaibahasa.sultra" target="_blank" rel="noopener noreferrer"
                               className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-red-600 flex items-center justify-center transition-colors">
                                <Youtube className="h-4 w-4" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-white mb-5 text-lg">Navigasi</h3>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link href="/" className="hover:text-yellow-400 transition-colors flex items-center gap-2">
                                    Beranda
                                </Link>
                            </li>
                            <li>
                                <Link href="/profil" className="hover:text-yellow-400 transition-colors flex items-center gap-2">
                                    Tentang Kami
                                </Link>
                            </li>
                            <li>
                                <Link href="/berita" className="hover:text-yellow-400 transition-colors flex items-center gap-2">
                                    Berita & Artikel
                                </Link>
                            </li>
                            <li>
                                <Link href="/layanan" className="hover:text-yellow-400 transition-colors flex items-center gap-2">
                                    Layanan
                                </Link>
                            </li>
                            <li>
                                <Link href="/galeri" className="hover:text-yellow-400 transition-colors flex items-center gap-2">
                                    Galeri
                                </Link>
                            </li>
                            <li>
                                <Link href="/kontak" className="hover:text-yellow-400 transition-colors flex items-center gap-2">
                                    Kontak
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-semibold text-white mb-5 text-lg">Kontak Kami</h3>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-yellow-400 shrink-0 mt-0.5" />
                                <span className="text-gray-400">
                                    Jl. Jenderal Ahmad Yani No. 6,<br />
                                    Kelurahan Wundudopi, Kec. Baruga,<br />
                                    Kota Kendari, Sulawesi Tenggara 93116
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-yellow-400 shrink-0" />
                                <a href="tel:+6285255603441" className="text-gray-400 hover:text-yellow-400 transition-colors">
                                    +62 852-5560-3441
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-yellow-400 shrink-0" />
                                <a href="mailto:balai.bahasa.sultra@kemdikbud.go.id" className="text-gray-400 hover:text-yellow-400 transition-colors">
                                    balai.bahasa.sultra@kemdikbud.go.id
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Clock className="h-5 w-5 text-yellow-400 shrink-0" />
                                <span className="text-gray-400">
                                    Senin - Jumat: 07:30 - 16:00 WITA
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Visitor Stats & Links */}
                    <div>
                        <h3 className="font-semibold text-white mb-5 text-lg">Statistik Pengunjung</h3>
                        {visitorStats && (
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                                    <span className="text-sm text-gray-400">Total Pengunjung</span>
                                    <Badge className="bg-blue-600 text-white">
                                        {new Intl.NumberFormat('id-ID').format(visitorStats.total)}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                                    <span className="text-sm text-gray-400">Hari Ini</span>
                                    <Badge variant="outline" className="border-gray-600 text-gray-300">
                                        {new Intl.NumberFormat('id-ID').format(visitorStats.today)}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                                    <span className="text-sm text-gray-400">Bulan Ini</span>
                                    <Badge variant="outline" className="border-gray-600 text-gray-300">
                                        {new Intl.NumberFormat('id-ID').format(visitorStats.thisMonth)}
                                    </Badge>
                                </div>
                            </div>
                        )}
                        
                        <h4 className="font-medium text-white mb-3 text-sm">Tautan Terkait</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="https://kemdikbud.go.id" target="_blank" rel="noopener noreferrer" 
                                   className="text-gray-400 hover:text-yellow-400 transition-colors flex items-center gap-2">
                                    Kemendikbudristek
                                    <ExternalLink className="h-3 w-3" />
                                </a>
                            </li>
                            <li>
                                <a href="https://badanbahasa.kemdikbud.go.id" target="_blank" rel="noopener noreferrer"
                                   className="text-gray-400 hover:text-yellow-400 transition-colors flex items-center gap-2">
                                    Badan Bahasa
                                    <ExternalLink className="h-3 w-3" />
                                </a>
                            </li>
                            <li>
                                <a href="https://kbbi.kemdikbud.go.id" target="_blank" rel="noopener noreferrer"
                                   className="text-gray-400 hover:text-yellow-400 transition-colors flex items-center gap-2">
                                    KBBI Daring
                                    <ExternalLink className="h-3 w-3" />
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
                        <p className="text-center md:text-left">
                            &copy; {currentYear} Balai Bahasa Provinsi Sulawesi Tenggara.<br className="sm:hidden" />
                            <span className="hidden sm:inline"> </span>Hak Cipta Dilindungi.
                        </p>
                        <p className="flex items-center gap-1 text-center">
                            Dibuat dengan <Heart className="h-4 w-4 text-red-500 fill-red-500" /> untuk pelestarian bahasa Indonesia
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};
