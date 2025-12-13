import React, { useState } from 'react';
import { PublicLayout } from '@/Layouts/PublicLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Separator } from '@/Components/ui/separator';
import { MapPin, Phone, Mail, Clock, Send, Facebook, Instagram, Youtube, MessageCircle, CheckCircle } from 'lucide-react';

export default function Kontak() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSubmitting(false);
        setSubmitted(true);
        console.log(formData);
    };

    return (
        <PublicLayout title="Kontak">
            {/* Hero Section - Different style */}
            <section className="relative bg-gradient-to-br from-[#0c4a6e] via-[#1e6091] to-[#0369a1] py-20">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl" />
                </div>
                <div className="container relative mx-auto px-4">
                    <div className="max-w-3xl">
                        <Badge className="mb-4 bg-yellow-400/90 text-gray-900 font-medium px-4 py-1.5">
                            <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                            Hubungi Kami
                        </Badge>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
                            Mari <span className="font-display italic text-yellow-400">Berdiskusi</span>
                        </h1>
                        <p className="text-lg text-blue-100 max-w-2xl">
                            Kami senang mendengar dari Anda. Silakan hubungi kami melalui berbagai saluran yang tersedia atau kirimkan pesan langsung.
                        </p>
                    </div>
                </div>
                {/* Wave decoration */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                        <path d="M0 60L48 55C96 50 192 40 288 35C384 30 480 30 576 32.5C672 35 768 40 864 42.5C960 45 1056 45 1152 42.5C1248 40 1344 35 1392 32.5L1440 30V60H1392C1344 60 1248 60 1152 60C1056 60 960 60 864 60C768 60 672 60 576 60C480 60 384 60 288 60C192 60 96 60 48 60H0Z" fill="#f9fafb"/>
                    </svg>
                </div>
            </section>

            {/* Contact Info & Form */}
            <section className="bg-gray-50 py-16 sm:py-20">
                <div className="container mx-auto px-4">
                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Contact Info */}
                        <div className="space-y-6">
                            <Card className="border-0 shadow-lg overflow-hidden">
                                <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                                <CardHeader>
                                    <CardTitle className="text-xl">Informasi Kontak</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-5">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                                            <MapPin className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Alamat Kantor</p>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Jalan Haluoleo, Kompleks Bumi Praja,<br />
                                                Anduonohu, Kendari,<br />
                                                Sulawesi Tenggara
                                            </p>
                                        </div>
                                    </div>
                                    <Separator />
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                                            <Phone className="h-5 w-5 text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Telepon</p>
                                            <a href="tel:+6281342520567" className="text-sm text-muted-foreground hover:text-blue-600 transition-colors mt-1 block">
                                                (0813) 4252-0567
                                            </a>
                                        </div>
                                    </div>
                                    <Separator />
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                                            <Mail className="h-5 w-5 text-amber-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Email</p>
                                            <a href="mailto:balai.bahasa.sultra@kemdikbud.go.id" className="text-sm text-muted-foreground hover:text-blue-600 transition-colors mt-1 block break-all">
                                                balai.bahasa.sultra@kemdikbud.go.id
                                            </a>
                                        </div>
                                    </div>
                                    <Separator />
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
                                            <Clock className="h-5 w-5 text-violet-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Jam Operasional</p>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Senin - Jumat: 07:30 - 16:00 WITA<br />
                                                Sabtu - Minggu: Tutup
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Social Media */}
                            <Card className="border-0 shadow-lg overflow-hidden">
                                <div className="h-1 bg-gradient-to-r from-pink-500 to-purple-600"></div>
                                <CardHeader>
                                    <CardTitle className="text-xl">Ikuti Kami</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground mb-4">Dapatkan informasi terbaru melalui media sosial kami</p>
                                    <div className="flex gap-3">
                                        <a href="https://facebook.com/balaibahasa.sultra" target="_blank" rel="noopener noreferrer">
                                            <Button variant="outline" size="icon" className="hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all">
                                                <Facebook className="h-4 w-4" />
                                            </Button>
                                        </a>
                                        <a href="https://instagram.com/balaibahasa.sultra" target="_blank" rel="noopener noreferrer">
                                            <Button variant="outline" size="icon" className="hover:bg-pink-600 hover:text-white hover:border-pink-600 transition-all">
                                                <Instagram className="h-4 w-4" />
                                            </Button>
                                        </a>
                                        <a href="https://youtube.com/@balaibahasa.sultra" target="_blank" rel="noopener noreferrer">
                                            <Button variant="outline" size="icon" className="hover:bg-red-600 hover:text-white hover:border-red-600 transition-all">
                                                <Youtube className="h-4 w-4" />
                                            </Button>
                                        </a>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>


                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <Card className="border-0 shadow-lg overflow-hidden">
                                <div className="h-1 bg-gradient-to-r from-yellow-400 to-amber-500"></div>
                                <CardHeader>
                                    <CardTitle className="text-xl">Kirim Pesan</CardTitle>
                                    <p className="text-sm text-muted-foreground">Isi formulir di bawah dan kami akan segera merespons</p>
                                </CardHeader>
                                <CardContent>
                                    {submitted ? (
                                        <div className="text-center py-12">
                                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
                                                <CheckCircle className="h-8 w-8 text-emerald-600" />
                                            </div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Pesan Terkirim!</h3>
                                            <p className="text-muted-foreground mb-6">Terima kasih telah menghubungi kami. Kami akan segera merespons pesan Anda.</p>
                                            <Button onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', phone: '', subject: '', message: '' }); }}>
                                                Kirim Pesan Lagi
                                            </Button>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-5">
                                            <div className="grid gap-5 sm:grid-cols-2">
                                                <div>
                                                    <label className="text-sm font-medium text-gray-900">Nama Lengkap <span className="text-red-500">*</span></label>
                                                    <input
                                                        type="text"
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                        className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                        placeholder="Masukkan nama lengkap"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-900">Email <span className="text-red-500">*</span></label>
                                                    <input
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                        className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                        placeholder="email@example.com"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid gap-5 sm:grid-cols-2">
                                                <div>
                                                    <label className="text-sm font-medium text-gray-900">Nomor Telepon</label>
                                                    <input
                                                        type="tel"
                                                        value={formData.phone}
                                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                                        className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                        placeholder="08xx-xxxx-xxxx"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-900">Subjek <span className="text-red-500">*</span></label>
                                                    <input
                                                        type="text"
                                                        value={formData.subject}
                                                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                                        className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                        placeholder="Konsultasi Bahasa / Layanan / Lainnya"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-900">Pesan <span className="text-red-500">*</span></label>
                                                <textarea
                                                    value={formData.message}
                                                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                                                    rows={6}
                                                    className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                                                    placeholder="Tuliskan pesan atau pertanyaan Anda di sini..."
                                                    required
                                                />
                                            </div>
                                            <div className="flex items-center justify-between pt-2">
                                                <p className="text-xs text-muted-foreground">* Wajib diisi</p>
                                                <Button 
                                                    type="submit" 
                                                    disabled={isSubmitting}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                                                >
                                                    {isSubmitting ? (
                                                        <span className="flex items-center">
                                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            Mengirim...
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center">
                                                            <Send className="mr-2 h-4 w-4" />
                                                            Kirim Pesan
                                                        </span>
                                                    )}
                                                </Button>
                                            </div>
                                        </form>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="bg-white py-12">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">Lokasi Kami</h2>
                        <p className="text-muted-foreground mt-2">Kunjungi kantor kami di Kendari, Sulawesi Tenggara</p>
                    </div>
                    <div className="rounded-2xl overflow-hidden shadow-lg">
                        <iframe
                            src="https://maps.google.com/maps?q=Balai+Bahasa+Provinsi+Sulawesi+Tenggara+Jalan+Haluoleo+Kompleks+Bumi+Praja+Anduonohu+Kendari&t=&z=13&ie=UTF8&iwloc=&output=embed"
                            width="100%"
                            height="450"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Lokasi Balai Bahasa Sulawesi Tenggara"
                            className="grayscale hover:grayscale-0 transition-all duration-500"
                        />
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
