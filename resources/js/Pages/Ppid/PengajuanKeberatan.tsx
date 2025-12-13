import React, { useRef, useState } from 'react';
import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePpidErrorHandler } from '@/hooks/usePpidErrorHandler';
import {
    FileText,
    ChevronRight,
    ChevronDown,
    Home,
    Clock,
    AlertTriangle,
    Scale,
    FileCheck,
    Timer,
    Shield,
    Gavel,
    Plus,
    Minus,
    PenLine,
    BookOpen,
    Users,
    Send,
    CheckCircle,
    XCircle,
    MessageSquare,
    FileWarning,
    Download,
    ExternalLink,
    Info
} from 'lucide-react';
import { Card, CardContent } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { PublicLayout } from '@/Layouts/PublicLayout';
import { KeberatanMultiStepForm } from '@/Components/Ppid/KeberatanMultiStepForm';
import type { KeberatanFAQItem, KeberatanTimelineStage } from '@/types/keberatan';

// ============================================================================
// HERO SECTION - With Framer Motion animations
// ============================================================================
const HeroSection: React.FC<{ onScrollToContent: () => void }> = ({ onScrollToContent }) => {
    return (
        <section className="relative min-h-[480px] md:min-h-[540px] flex items-center overflow-hidden">
            {/* Gradient background - Orange/Amber theme for keberatan */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#7c2d12] via-[#c2410c] to-[#ea580c]" />
            
            {/* Animated floating orbs */}
            <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
                <motion.div 
                    className="absolute top-[15%] right-[8%] w-[280px] h-[280px] bg-yellow-400/25 blur-3xl"
                    style={{ borderRadius: '63% 37% 54% 46% / 55% 48% 52% 45%' }}
                    animate={{
                        x: [0, 20, 0],
                        y: [0, -15, 0],
                        scale: [1, 1.05, 1],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div 
                    className="absolute -bottom-10 left-[3%] w-[350px] h-[350px] bg-orange-300/15 blur-3xl"
                    style={{ borderRadius: '45% 55% 62% 38% / 53% 45% 55% 47%' }}
                    animate={{
                        x: [0, -15, 0],
                        y: [0, 20, 0],
                        scale: [1, 1.08, 1],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div 
                    className="absolute top-[40%] left-[45%] w-[180px] h-[180px] bg-red-400/12 blur-2xl"
                    style={{ borderRadius: '52% 48% 43% 57% / 47% 58% 42% 53%' }}
                    animate={{
                        x: [0, 10, 0],
                        y: [0, -10, 0],
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div 
                    className="absolute top-[25%] left-[20%] w-[80px] h-[80px] bg-amber-400/20 blur-xl"
                    style={{ borderRadius: '58% 42% 55% 45% / 45% 52% 48% 55%' }}
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.2, 0.3, 0.2],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>
            
            {/* Dot pattern overlay */}
            <div 
                className="absolute inset-0 opacity-[0.04]" 
                aria-hidden="true" 
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }} 
            />
            
            {/* Content */}
            <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto lg:ml-[10%]">
                    {/* Breadcrumb */}
                    <motion.nav 
                        className="flex items-center gap-2 text-sm text-orange-200/70 mb-8" 
                        aria-label="Breadcrumb"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Link href="/" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                            <Home className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" aria-hidden="true" />
                            <span>Beranda</span>
                        </Link>
                        <ChevronRight className="w-3.5 h-3.5 text-orange-300/40" aria-hidden="true" />
                        <Link href="/ppid/profil" className="hover:text-white transition-colors">PPID</Link>
                        <ChevronRight className="w-3.5 h-3.5 text-orange-300/40" aria-hidden="true" />
                        <span className="text-amber-200/90">Pengajuan Keberatan</span>
                    </motion.nav>
                    
                    {/* Title area */}
                    <div className="space-y-5">
                        <motion.div 
                            className="flex items-center gap-3"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <Badge className="bg-amber-400/90 text-slate-900 hover:bg-amber-300 font-medium px-3 py-1.5 text-xs tracking-wide">
                                <Shield className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
                                HAK PEMOHON
                            </Badge>
                            <span className="text-orange-200/60 text-sm hidden sm:inline">•</span>
                            <span className="text-orange-200/60 text-sm hidden sm:inline">UU No. 14 Tahun 2008</span>
                        </motion.div>
                        
                        <motion.h1 
                            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.15]"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            Pengajuan Keberatan
                            <span className="block text-amber-300 mt-1">Permohonan Informasi</span>
                        </motion.h1>
                        
                        <motion.p 
                            className="text-base sm:text-lg text-orange-100/75 max-w-xl leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            Hak Anda untuk mengajukan keberatan jika tidak puas dengan keputusan PPID. 
                            <span className="text-amber-200/90"> Prosesnya transparan dan sesuai regulasi</span>.
                        </motion.p>
                    </div>
                    
                    {/* Scroll indicator with bounce animation */}
                    <motion.button 
                        onClick={onScrollToContent}
                        className="mt-10 flex items-center gap-2 text-sm text-orange-200/60 hover:text-white transition-all group focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:ring-offset-2 focus:ring-offset-orange-900 rounded-lg px-3 py-2 -ml-3 hover:bg-white/5"
                        aria-label="Scroll ke konten"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <Gavel className="w-4 h-4" aria-hidden="true" />
                        <span>Pelajari hak keberatan Anda</span>
                        <motion.div
                            animate={{ y: [0, 4, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <ChevronDown className="w-4 h-4" aria-hidden="true" />
                        </motion.div>
                    </motion.button>
                </div>
            </div>
            
            {/* Wave decoration at bottom */}
            <div className="absolute bottom-0 left-0 right-0" aria-hidden="true">
                <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
                    <path d="M0 100L40 95C80 90 160 80 240 73C320 66 400 62 480 63C560 64 640 70 720 74C800 78 880 80 960 78C1040 76 1120 70 1200 68C1280 66 1360 68 1400 69L1440 70V100H0Z" fill="#f8fafc"/>
                </svg>
            </div>
        </section>
    );
};

// ============================================================================
// INTRODUCTION SECTION
// ============================================================================
const IntroductionSection: React.FC = () => {
    return (
        <motion.section 
            className="py-12 lg:py-16 bg-slate-50"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
        >
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm border border-slate-100">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-200/50">
                            <Scale className="w-6 h-6 text-white" aria-hidden="true" />
                        </div>
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
                                Apa itu Pengajuan Keberatan?
                            </h2>
                            <p className="text-slate-500 text-sm">Hak Anda sebagai pemohon informasi</p>
                        </div>
                    </div>
                    
                    <div className="prose prose-slate max-w-none">
                        <p className="text-slate-600 leading-relaxed text-base sm:text-lg">
                            Pengajuan keberatan adalah hak yang diberikan kepada pemohon informasi publik yang tidak puas 
                            dengan keputusan PPID. Berdasarkan <span className="text-orange-600 font-medium">UU No. 14 Tahun 2008</span> tentang 
                            Keterbukaan Informasi Publik dan <span className="text-orange-600 font-medium">Peraturan Komisi Informasi No. 1 Tahun 2010</span>, 
                            pemohon dapat mengajukan keberatan kepada <strong>Atasan PPID</strong> dalam waktu <strong>30 hari kerja</strong> 
                            sejak diterimanya keputusan.
                        </p>
                        <p className="text-slate-600 leading-relaxed mt-4">
                            Keberatan dapat diajukan jika permohonan informasi <strong>ditolak</strong>, <strong>tidak ditanggapi</strong>, 
                            <strong> tidak dipenuhi</strong>, atau Anda merasa <strong>biaya yang dikenakan tidak wajar</strong>.
                        </p>
                    </div>

                    {/* Legal basis cards */}
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <BookOpen className="w-4 h-4 text-orange-600" />
                                <span className="font-semibold text-orange-900 text-sm">UU No. 14 Tahun 2008</span>
                            </div>
                            <p className="text-sm text-orange-800">
                                Tentang Keterbukaan Informasi Publik (Pasal 35-37)
                            </p>
                        </div>
                        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <BookOpen className="w-4 h-4 text-amber-600" />
                                <span className="font-semibold text-amber-900 text-sm">Peraturan KIP No. 1/2010</span>
                            </div>
                            <p className="text-sm text-amber-800">
                                Tentang Standar Layanan Informasi Publik (Pasal 11-13)
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.section>
    );
};


// ============================================================================
// REASONS SECTION - Alasan Pengajuan Keberatan
// ============================================================================
const ReasonsSection: React.FC = () => {
    const reasons = [
        { 
            icon: XCircle, 
            title: 'Permohonan Ditolak', 
            description: 'Permohonan informasi Anda ditolak oleh PPID tanpa alasan yang jelas',
            color: 'red'
        },
        { 
            icon: Clock, 
            title: 'Tidak Ditanggapi', 
            description: 'Permohonan tidak mendapat tanggapan dalam jangka waktu yang ditentukan (10 hari kerja)',
            color: 'orange'
        },
        { 
            icon: FileWarning, 
            title: 'Informasi Tidak Sesuai', 
            description: 'Informasi yang diberikan tidak sesuai dengan yang diminta dalam permohonan',
            color: 'amber'
        },
        { 
            icon: AlertTriangle, 
            title: 'Biaya Tidak Wajar', 
            description: 'Biaya yang dikenakan untuk memperoleh informasi dianggap tidak wajar',
            color: 'yellow'
        },
    ];

    const colorClasses = {
        red: 'from-red-500 to-red-600 shadow-red-200/50 bg-red-50 border-red-200',
        orange: 'from-orange-500 to-orange-600 shadow-orange-200/50 bg-orange-50 border-orange-200',
        amber: 'from-amber-500 to-amber-600 shadow-amber-200/50 bg-amber-50 border-amber-200',
        yellow: 'from-yellow-500 to-yellow-600 shadow-yellow-200/50 bg-yellow-50 border-yellow-200',
    };

    return (
        <motion.section 
            className="py-14 lg:py-20 bg-white"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
        >
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-10">
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-orange-600 tracking-wide uppercase mb-2">
                        <AlertTriangle className="w-4 h-4" aria-hidden="true" />
                        Alasan Keberatan
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
                        Kapan Anda Dapat Mengajukan Keberatan?
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Anda dapat mengajukan keberatan jika mengalami salah satu kondisi berikut
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {reasons.map((reason, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card className={`h-full border hover:shadow-lg transition-shadow ${colorClasses[reason.color as keyof typeof colorClasses].split(' ').slice(3).join(' ')}`}>
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[reason.color as keyof typeof colorClasses].split(' ').slice(0, 2).join(' ')} flex items-center justify-center flex-shrink-0 shadow-lg ${colorClasses[reason.color as keyof typeof colorClasses].split(' ')[2]}`}>
                                            <reason.icon className="w-6 h-6 text-white" aria-hidden="true" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg text-slate-900 mb-1">{reason.title}</h3>
                                            <p className="text-slate-600 text-sm">{reason.description}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
};


// ============================================================================
// TIMELINE SECTION
// ============================================================================
const TimelineSection: React.FC = () => {
    const stages: KeberatanTimelineStage[] = [
        {
            id: 1,
            title: 'Pengajuan Keberatan',
            description: 'Pemohon mengisi dan mengirimkan formulir keberatan kepada Atasan PPID',
            duration: '30 hari kerja',
            icon: FileText
        },
        {
            id: 2,
            title: 'Verifikasi & Registrasi',
            description: 'Atasan PPID memverifikasi kelengkapan dokumen dan memberikan nomor registrasi',
            duration: '3 hari kerja',
            icon: CheckCircle
        },
        {
            id: 3,
            title: 'Pemeriksaan',
            description: 'Atasan PPID memeriksa dan mempertimbangkan alasan keberatan yang diajukan',
            duration: '30 hari kerja',
            icon: Scale
        },
        {
            id: 4,
            title: 'Keputusan',
            description: 'Atasan PPID memberikan keputusan atas keberatan yang diajukan',
            duration: 'Tertulis',
            icon: Gavel
        }
    ];

    return (
        <motion.section 
            className="py-14 lg:py-20 bg-slate-50"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
        >
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-12">
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-orange-600 tracking-wide uppercase mb-2">
                        <Timer className="w-4 h-4" aria-hidden="true" />
                        Alur Proses
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
                        Timeline Pengajuan Keberatan
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Berikut adalah tahapan proses pengajuan keberatan atas permohonan informasi publik
                    </p>
                </div>
                
                {/* Desktop Timeline - Horizontal */}
                <div className="hidden md:block">
                    <div className="relative">
                        {/* Connection line */}
                        <div className="absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-200 via-orange-400 to-orange-200" aria-hidden="true" />
                        
                        <div className="grid grid-cols-4 gap-4">
                            {stages.map((stage, index) => (
                                <motion.div
                                    key={stage.id}
                                    className="relative flex flex-col items-center text-center"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    {/* Stage number circle */}
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-200/50 z-10">
                                        <stage.icon className="w-7 h-7 text-white" aria-hidden="true" />
                                    </div>
                                    
                                    <div className="mt-4">
                                        <h3 className="font-semibold text-slate-900 mb-1">{stage.title}</h3>
                                        <p className="text-sm text-slate-600 mb-2">{stage.description}</p>
                                        <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                                            {stage.duration}
                                        </Badge>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
                
                {/* Mobile Timeline - Vertical */}
                <div className="md:hidden">
                    <div className="relative">
                        {/* Vertical line */}
                        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-200 via-orange-400 to-orange-200" aria-hidden="true" />
                        
                        <div className="space-y-6">
                            {stages.map((stage, index) => (
                                <motion.div
                                    key={stage.id}
                                    className="relative flex gap-4"
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    {/* Stage circle */}
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-200/50 z-10 flex-shrink-0">
                                        <stage.icon className="w-5 h-5 text-white" aria-hidden="true" />
                                    </div>
                                    
                                    <div className="flex-1 pb-6">
                                        <h3 className="font-semibold text-slate-900 mb-1">{stage.title}</h3>
                                        <p className="text-sm text-slate-600 mb-2">{stage.description}</p>
                                        <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                                            {stage.duration}
                                        </Badge>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Important note */}
                <motion.div 
                    className="mt-10 bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-4"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                >
                    <Info className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold text-amber-900 mb-1">Catatan Penting</p>
                        <p className="text-sm text-amber-800">
                            Jika Atasan PPID tidak memberikan tanggapan atas keberatan dalam waktu 30 hari kerja, 
                            atau Anda tidak puas dengan keputusan Atasan PPID, Anda dapat mengajukan penyelesaian 
                            sengketa informasi kepada <strong>Komisi Informasi</strong> paling lambat 14 hari kerja 
                            setelah diterimanya keputusan Atasan PPID.
                        </p>
                    </div>
                </motion.div>
            </div>
        </motion.section>
    );
};

// ============================================================================
// FAQ SECTION
// ============================================================================
const FAQSection: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    
    const faqData: KeberatanFAQItem[] = [
        {
            id: 1,
            question: 'Siapa yang berhak mengajukan keberatan?',
            answer: 'Pemohon informasi yang permohonannya ditolak, tidak ditanggapi, tidak dipenuhi, atau merasa dikenakan biaya yang tidak wajar oleh PPID. Keberatan dapat diajukan langsung oleh pemohon atau melalui kuasa yang sah.'
        },
        {
            id: 2,
            question: 'Berapa lama batas waktu untuk mengajukan keberatan?',
            answer: 'Keberatan harus diajukan dalam waktu paling lambat 30 (tiga puluh) hari kerja sejak diterimanya keputusan atas permohonan informasi oleh PPID, atau sejak berakhirnya jangka waktu untuk menanggapi permohonan.'
        },
        {
            id: 3,
            question: 'Kepada siapa keberatan diajukan?',
            answer: 'Keberatan diajukan kepada Atasan PPID (Pejabat Pengelola Informasi dan Dokumentasi). Di lingkungan Balai Bahasa Sulawesi Tenggara, Atasan PPID adalah Kepala Balai Bahasa.'
        },
        {
            id: 4,
            question: 'Berapa lama proses penanganan keberatan?',
            answer: 'Atasan PPID wajib memberikan tanggapan atas keberatan yang diajukan dalam waktu paling lambat 30 (tiga puluh) hari kerja sejak diterimanya pengajuan keberatan secara lengkap.'
        },
        {
            id: 5,
            question: 'Apa yang harus dilakukan jika keberatan tidak dikabulkan?',
            answer: 'Jika keberatan tidak dikabulkan atau Anda tidak puas dengan keputusan Atasan PPID, Anda dapat mengajukan permohonan penyelesaian sengketa informasi kepada Komisi Informasi paling lambat 14 hari kerja setelah diterimanya keputusan Atasan PPID.'
        },
        {
            id: 6,
            question: 'Apakah ada biaya untuk mengajukan keberatan?',
            answer: 'Pengajuan keberatan tidak dikenakan biaya (GRATIS). Namun, jika ada biaya penggandaan dokumen pendukung, biaya tersebut ditanggung oleh pemohon.'
        }
    ];

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <motion.section 
            className="py-14 lg:py-20 bg-white"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
        >
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-10">
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-orange-600 tracking-wide uppercase mb-2">
                        <MessageSquare className="w-4 h-4" aria-hidden="true" />
                        FAQ
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
                        Pertanyaan yang Sering Diajukan
                    </h2>
                </div>
                
                <div className="space-y-3">
                    {faqData.map((faq, index) => (
                        <motion.div
                            key={faq.id}
                            className="bg-white rounded-xl border border-slate-200 overflow-hidden"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
                                aria-expanded={openIndex === index}
                                aria-controls={`faq-answer-${faq.id}`}
                            >
                                <span className="font-medium text-slate-900 pr-4">{faq.question}</span>
                                <motion.div
                                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex-shrink-0"
                                >
                                    {openIndex === index ? (
                                        <Minus className="w-5 h-5 text-orange-600" aria-hidden="true" />
                                    ) : (
                                        <Plus className="w-5 h-5 text-slate-400" aria-hidden="true" />
                                    )}
                                </motion.div>
                            </button>
                            
                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        id={`faq-answer-${faq.id}`}
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    >
                                        <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
};


// ============================================================================
// DOWNLOAD SECTION
// ============================================================================
const DownloadSection: React.FC = () => {
    return (
        <motion.section 
            className="py-14 lg:py-20 bg-slate-50"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
        >
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <div className="bg-gradient-to-br from-orange-600 to-red-700 rounded-3xl p-6 sm:p-8 lg:p-10 text-white">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                            <Download className="w-8 h-8 text-white" aria-hidden="true" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-xl sm:text-2xl font-bold mb-2">
                                Download Formulir Keberatan (PDF)
                            </h3>
                            <p className="text-orange-100 text-sm sm:text-base mb-4">
                                Unduh formulir pengajuan keberatan dalam format PDF untuk diisi secara manual 
                                dan diserahkan langsung ke kantor PPID atau dikirim via pos.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                                <Button 
                                    variant="secondary" 
                                    className="bg-white text-orange-700 hover:bg-orange-50"
                                    asChild
                                >
                                    <a href="/documents/formulir-keberatan.pdf" download>
                                        <Download className="w-4 h-4 mr-2" />
                                        Download Formulir
                                    </a>
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="border-white/30 text-white hover:bg-white/10"
                                    asChild
                                >
                                    <Link href="/ppid/permohonan">
                                        <ExternalLink className="w-4 h-4 mr-2" />
                                        Ajukan Permohonan Baru
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.section>
    );
};


// ============================================================================
// FORM SECTION - Interactive Multi-Step Form
// ============================================================================
const FormSection: React.FC = () => {
    return (
        <motion.section 
            id="form-keberatan"
            className="py-14 lg:py-20 bg-gradient-to-br from-slate-100 via-orange-50 to-slate-100"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
        >
            <div className="max-w-2xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-10">
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-orange-600 tracking-wide uppercase mb-2">
                        <PenLine className="w-4 h-4" aria-hidden="true" />
                        Formulir Online
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
                        Ajukan Keberatan
                    </h2>
                    <p className="text-slate-600 max-w-xl mx-auto">
                        Isi formulir di bawah ini untuk mengajukan keberatan atas permohonan informasi publik secara online
                    </p>
                </div>
                
                <KeberatanMultiStepForm />
            </div>
        </motion.section>
    );
};

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================
const PengajuanKeberatan: React.FC = () => {
    // Use the PPID error handler hook to prevent galeri-wrapper related errors
    usePpidErrorHandler();

    const contentRef = useRef<HTMLDivElement>(null);

    const scrollToContent = () => {
        contentRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <PublicLayout>
            <main>
                {/* Hero Section */}
                <HeroSection onScrollToContent={scrollToContent} />
                
                {/* Content sections */}
                <div ref={contentRef}>
                    <IntroductionSection />
                    <ReasonsSection />
                    <TimelineSection />
                    <DownloadSection />
                    <FormSection />
                    <FAQSection />
                </div>
            </main>
        </PublicLayout>
    );
};

export default PengajuanKeberatan;
