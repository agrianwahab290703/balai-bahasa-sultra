import React from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Home,
    ChevronRight,
    Shield,
    FileText,
    Users,
    Clock,
    AlertCircle,
    Construction
} from 'lucide-react';
import { Card, CardContent } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { PublicLayout } from '@/Layouts/PublicLayout';

interface ProfileData {
    id: number;
    title: string;
    content: string;
    order: number;
}

interface PpidContentData {
    id: number;
    title: string;
    content: string;
    type: string;
    order: number;
}

interface TeamMemberData {
    id: number;
    name: string;
    position: string;
    role: 'ketua' | 'anggota';
    order: number;
}

interface ProfilProps {
    profile: ProfileData | null;
    legalBasis: PpidContentData[];
    principles: PpidContentData[];
    tasks: PpidContentData[];
    address: PpidContentData | null;
    teamMembers: TeamMemberData[];
}

export default function Profil({ profile, legalBasis, principles, tasks, address, teamMembers }: ProfilProps) {
    return (
        <PublicLayout title="Profil PPID" description="Profil PPID Balai Bahasa Sulawesi Tenggara">
            <section className="relative min-h-[400px] md:min-h-[500px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0c4a6e] via-[#1e6091] to-[#0369a1]" />
                
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div 
                        className="absolute -top-24 -right-24 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl"
                        animate={{ y: [0, 30, 0], scale: [1, 1.1, 1] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div 
                        className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl"
                        animate={{ y: [0, -40, 0], scale: [1, 1.15, 1] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    />
                </div>
                
                <div className="relative z-10 text-center text-white px-4">
                    <div className="max-w-4xl mx-auto">
                        <motion.nav 
                            className="flex items-center justify-center gap-2 text-sm text-blue-200 mb-8"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
                                <Home className="w-4 h-4" />
                                Beranda
                            </Link>
                            <ChevronRight className="w-4 h-4" />
                            <span>PPID</span>
                            <ChevronRight className="w-4 h-4" />
                            <span className="text-white font-medium">Profil</span>
                        </motion.nav>
                        
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <Badge className="mb-6 bg-yellow-400/90 text-gray-900 hover:bg-yellow-400 font-medium px-4 py-1.5 text-sm">
                                <Shield className="w-4 h-4 mr-2" />
                                Keterbukaan Informasi Publik
                            </Badge>
                        </motion.div>
                        
                        <motion.h1 
                            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                        >
                            Profil <span className="font-display italic text-yellow-400">PPID</span>
                        </motion.h1>
                        
                        <motion.p 
                            className="text-lg md:text-xl lg:text-2xl mb-10 text-blue-100/90 max-w-3xl mx-auto leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.5 }}
                        >
                            Pejabat Pengelola Informasi dan Dokumentasi 
                            <br className="hidden sm:block" />
                            Balai Bahasa Provinsi Sulawesi Tenggara
                        </motion.p>
                    </div>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                        <path d="M0 120L48 110C96 100 192 80 288 70C384 60 480 60 576 65C672 70 768 80 864 85C960 90 1056 90 1152 85C1248 80 1344 70 1392 65L1440 60V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z" fill="white"/>
                    </svg>
                </div>
            </section>

            <main className="py-16 lg:py-24">
                <div className="max-w-4xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Card className="border border-gray-200 shadow-2xl overflow-hidden bg-white">
                            <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
                            
                            <CardContent className="p-8 lg:p-12">
                                <div className="text-center">
                                    <motion.div
                                        className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mb-8"
                                        animate={{ 
                                            scale: [1, 1.05, 1],
                                            rotate: [0, 5, -5, 0]
                                        }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    >
                                        <Construction className="w-12 h-12 text-blue-600" />
                                    </motion.div>
                                    
                                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                                        Halaman Sedang Dalam Pengembangan
                                    </h2>
                                    
                                    <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                                        Konten halaman Profil PPID akan segera tersedia. 
                                        Saat ini kami sedang menyiapkan sistem pengelolaan konten melalui panel admin 
                                        untuk memastikan informasi yang ditampilkan selalu akurat dan terkini.
                                    </p>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                        <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                                            <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                            <p className="text-sm font-medium text-blue-900">Profil & Dasar Hukum</p>
                                            <p className="text-xs text-blue-600 mt-1">Segera hadir</p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
                                            <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                                            <p className="text-sm font-medium text-purple-900">Struktur Organisasi</p>
                                            <p className="text-xs text-purple-600 mt-1">Segera hadir</p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-green-50 border border-green-100">
                                            <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                            <p className="text-sm font-medium text-green-900">Jam Layanan</p>
                                            <p className="text-xs text-green-600 mt-1">Segera hadir</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 mb-8">
                                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                        <p className="text-sm">
                                            Konten akan dikelola melalui panel admin untuk sinkronisasi data yang lebih baik.
                                        </p>
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                        <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                                            <Link href="/">
                                                <Home className="w-5 h-5 mr-2" />
                                                Kembali ke Beranda
                                            </Link>
                                        </Button>
                                        <Button asChild variant="outline" size="lg" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                                            <Link href="/ppid/informasi-publik">
                                                <FileText className="w-5 h-5 mr-2" />
                                                Lihat Informasi Publik
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </main>
        </PublicLayout>
    );
}
