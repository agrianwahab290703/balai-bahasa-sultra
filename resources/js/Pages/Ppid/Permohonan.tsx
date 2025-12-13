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
    User,
    Building2,
    Calendar,
    Coins,
    Send,
    FileCheck,
    Timer,
    Sparkles,
    Coffee,
    CheckCircle,
    AlertCircle,
    Heart,
    Plus,
    Minus,
    ClipboardList,
    PenLine
} from 'lucide-react';
import { Card, CardContent } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { PublicLayout } from '@/Layouts/PublicLayout';
import { MultiStepForm } from '@/Components/Ppid/MultiStepForm';
import type { FAQItem, TimelineStage, ScheduleItem } from '@/types/permohonan';

// ============================================================================
// HERO SECTION - With Framer Motion animations
// Validates: Requirements 1.1, 8.1
// ============================================================================
const HeroSection: React.FC<{ onScrollToContent: () => void }> = ({ onScrollToContent }) => {
    return (
        <section className="relative min-h-[480px] md:min-h-[540px] flex items-center overflow-hidden">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0c4a6e] via-[#1e6091] to-[#0369a1]" />
            
            {/* Animated floating orbs */}
            <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
                <motion.div 
                    className="absolute top-[15%] right-[8%] w-[280px] h-[280px] bg-amber-400/25 blur-3xl"
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
                    className="absolute -bottom-10 left-[3%] w-[350px] h-[350px] bg-sky-400/15 blur-3xl"
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
                    className="absolute top-[40%] left-[45%] w-[180px] h-[180px] bg-purple-400/12 blur-2xl"
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
                    className="absolute top-[25%] left-[20%] w-[80px] h-[80px] bg-emerald-400/20 blur-xl"
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
                        className="flex items-center gap-2 text-sm text-blue-300/70 mb-8" 
                        aria-label="Breadcrumb"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Link href="/" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                            <Home className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" aria-hidden="true" />
                            <span>Beranda</span>
                        </Link>
                        <ChevronRight className="w-3.5 h-3.5 text-blue-400/40" aria-hidden="true" />
                        <Link href="/ppid/profil" className="hover:text-white transition-colors">PPID</Link>
                        <ChevronRight className="w-3.5 h-3.5 text-blue-400/40" aria-hidden="true" />
                        <span className="text-amber-300/90">Permohonan Informasi</span>
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
                                <Sparkles className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
                                LAYANAN PPID
                            </Badge>
                            <span className="text-blue-300/60 text-sm hidden sm:inline">•</span>
                            <span className="text-blue-300/60 text-sm hidden sm:inline">Gratis & Transparan</span>
                        </motion.div>
                        
                        <motion.h1 
                            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.15]"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            Permohonan
                            <span className="block text-amber-400 mt-1">Informasi Publik</span>
                        </motion.h1>
                        
                        <motion.p 
                            className="text-base sm:text-lg text-blue-100/75 max-w-xl leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            Hak Anda untuk tahu. Kami di sini untuk membantu — prosesnya mudah, 
                            <span className="text-amber-300/90"> tanpa ribet</span>.
                        </motion.p>
                    </div>
                    
                    {/* Scroll indicator with bounce animation */}
                    <motion.button 
                        onClick={onScrollToContent}
                        className="mt-10 flex items-center gap-2 text-sm text-blue-200/60 hover:text-white transition-all group focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-lg px-3 py-2 -ml-3 hover:bg-white/5"
                        aria-label="Scroll ke konten"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <Coffee className="w-4 h-4" aria-hidden="true" />
                        <span>Yuk, pelajari caranya</span>
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
// Validates: Requirements 1.2, 1.5, 8.1
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
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-200/50">
                            <Heart className="w-6 h-6 text-white" aria-hidden="true" />
                        </div>
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
                                Selamat datang! 👋
                            </h2>
                            <p className="text-slate-500 text-sm">Kami senang Anda di sini</p>
                        </div>
                    </div>
                    
                    <div className="prose prose-slate max-w-none">
                        <p className="text-slate-600 leading-relaxed text-base sm:text-lg">
                            Permohonan informasi publik dapat diajukan dengan <strong>langsung datang ke ULT</strong> (Unit Layanan Terpadu), 
                            melalui <strong>pos-el</strong> (email), atau mengisi <strong>formulir online</strong> yang kami sediakan.
                        </p>
                        <p className="text-slate-600 leading-relaxed mt-4">
                            Sesuai <span className="text-blue-600 font-medium">Undang-Undang Nomor 14 Tahun 2008</span> tentang 
                            Keterbukaan Informasi Publik, permohonan akan diproses dalam waktu <strong>10 hari kerja</strong> dengan 
                            kemungkinan perpanjangan <strong>7 hari kerja</strong> jika diperlukan.
                        </p>
                    </div>
                </div>
            </div>
        </motion.section>
    );
};


// ============================================================================
// REQUIREMENTS SECTION
// Validates: Requirements 1.3, 1.4, 8.1
// ============================================================================
const RequirementsSection: React.FC = () => {
    const individualRequirements = [
        { icon: FileText, text: 'Fotokopi KTP atau identitas lainnya yang masih berlaku' }
    ];
    
    const institutionalRequirements = [
        { icon: FileText, text: 'Akte pendirian lembaga/organisasi' },
        { icon: FileCheck, text: 'Surat kuasa bermaterai dari pimpinan lembaga' },
        { icon: User, text: 'Fotokopi KTP penerima kuasa yang masih berlaku' }
    ];

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
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 tracking-wide uppercase mb-2">
                        <ClipboardList className="w-4 h-4" aria-hidden="true" />
                        Ketentuan Pemohon
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
                        Dokumen yang Diperlukan
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Siapkan dokumen berikut sesuai dengan jenis pemohon Anda
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Individual Applicant Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <Card className="h-full border-emerald-200/60 bg-emerald-50/50 hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                                        <User className="w-5 h-5 text-white" aria-hidden="true" />
                                    </div>
                                    <h3 className="font-semibold text-lg text-slate-900">Pemohon Perorangan</h3>
                                </div>
                                <ul className="space-y-3">
                                    {individualRequirements.map((req, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <req.icon className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                                            </div>
                                            <span className="text-slate-700">{req.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </motion.div>
                    
                    {/* Institutional Applicant Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Card className="h-full border-blue-200/60 bg-blue-50/50 hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                        <Building2 className="w-5 h-5 text-white" aria-hidden="true" />
                                    </div>
                                    <h3 className="font-semibold text-lg text-slate-900">Pemohon Lembaga</h3>
                                </div>
                                <ul className="space-y-3">
                                    {institutionalRequirements.map((req, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <req.icon className="w-3.5 h-3.5 text-blue-600" aria-hidden="true" />
                                            </div>
                                            <span className="text-slate-700">{req.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </motion.section>
    );
};

// ============================================================================
// SCHEDULE SECTION
// Validates: Requirements 2.1, 2.2, 2.3, 8.2
// ============================================================================
const ScheduleSection: React.FC = () => {
    const scheduleData: ScheduleItem[] = [
        { day: 'Senin - Kamis', pelayanan: '09.00 - 15.00 WITA', pendaftaran: '08.00 - 11.00 WITA', istirahat: '12.00 - 13.00 WITA' },
        { day: 'Jumat', pelayanan: '09.00 - 15.30 WITA', pendaftaran: '08.00 - 11.00 WITA', istirahat: '11.30 - 13.30 WITA' }
    ];

    return (
        <motion.section 
            className="py-14 lg:py-20 bg-slate-50"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
        >
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-10">
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 tracking-wide uppercase mb-2">
                        <Calendar className="w-4 h-4" aria-hidden="true" />
                        Jadwal Pelayanan
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
                        Jam Operasional
                    </h2>
                </div>
                
                <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-100">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Hari</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Pelayanan</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Pendaftaran</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Istirahat</th>
                                </tr>
                            </thead>
                            <tbody>
                                {scheduleData.map((schedule, index) => (
                                    <tr 
                                        key={index} 
                                        className="border-t border-slate-100 hover:bg-slate-50 transition-colors"
                                    >
                                        <td className="px-4 py-4 font-medium text-slate-900">{schedule.day}</td>
                                        <td className="px-4 py-4 text-slate-600">{schedule.pelayanan}</td>
                                        <td className="px-4 py-4 text-slate-600">{schedule.pendaftaran}</td>
                                        <td className="px-4 py-4 text-slate-600">{schedule.istirahat}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
                
                {/* Cost information */}
                <motion.div 
                    className="mt-6 flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                >
                    <Coins className="w-5 h-5 text-amber-600 flex-shrink-0" aria-hidden="true" />
                    <p className="text-sm text-amber-800">
                        <strong>Layanan ini GRATIS.</strong> Biaya penggandaan dokumen ditanggung oleh pemohon.
                    </p>
                </motion.div>
            </div>
        </motion.section>
    );
};


// ============================================================================
// TIMELINE SECTION
// Validates: Requirements 6.1, 6.2, 6.3, 9.1, 9.3
// ============================================================================
const TimelineSection: React.FC = () => {
    const stages: TimelineStage[] = [
        {
            id: 1,
            title: 'Pengajuan',
            description: 'Pemohon mengisi dan mengirimkan formulir permohonan',
            duration: '1 hari',
            icon: FileText
        },
        {
            id: 2,
            title: 'Verifikasi',
            description: 'PPID memverifikasi kelengkapan dokumen pemohon',
            duration: '2 hari kerja',
            icon: CheckCircle
        },
        {
            id: 3,
            title: 'Pemrosesan',
            description: 'PPID memproses dan menyiapkan informasi yang diminta',
            duration: '5-10 hari kerja',
            icon: Clock
        },
        {
            id: 4,
            title: 'Penyerahan',
            description: 'Informasi diserahkan kepada pemohon sesuai metode yang dipilih',
            duration: '1-2 hari kerja',
            icon: Send
        }
    ];

    return (
        <motion.section 
            className="py-14 lg:py-20 bg-white"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
        >
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-12">
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 tracking-wide uppercase mb-2">
                        <Timer className="w-4 h-4" aria-hidden="true" />
                        Alur Proses
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
                        Timeline Permohonan
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Berikut adalah tahapan proses permohonan informasi publik
                    </p>
                </div>
                
                {/* Desktop Timeline - Horizontal */}
                <div className="hidden md:block">
                    <div className="relative">
                        {/* Connection line */}
                        <div className="absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200" aria-hidden="true" />
                        
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
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-200/50 z-10">
                                        <stage.icon className="w-7 h-7 text-white" aria-hidden="true" />
                                    </div>
                                    
                                    <div className="mt-4">
                                        <h3 className="font-semibold text-slate-900 mb-1">{stage.title}</h3>
                                        <p className="text-sm text-slate-600 mb-2">{stage.description}</p>
                                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
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
                        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-blue-400 to-blue-200" aria-hidden="true" />
                        
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
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-200/50 z-10 flex-shrink-0">
                                        <stage.icon className="w-5 h-5 text-white" aria-hidden="true" />
                                    </div>
                                    
                                    <div className="flex-1 pb-6">
                                        <h3 className="font-semibold text-slate-900 mb-1">{stage.title}</h3>
                                        <p className="text-sm text-slate-600 mb-2">{stage.description}</p>
                                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                            {stage.duration}
                                        </Badge>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.section>
    );
};

// ============================================================================
// FAQ SECTION
// Validates: Requirements 7.1, 7.2, 7.3, 8.1
// ============================================================================
const FAQSection: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    
    const faqData: FAQItem[] = [
        {
            id: 1,
            question: 'Apa saja informasi yang dapat diminta kepada PPID?',
            answer: 'Pemohon dapat meminta informasi publik yang dihasilkan, disimpan, dikelola, dan/atau diterima oleh Balai Bahasa Sulawesi Tenggara, kecuali informasi yang dikecualikan sesuai UU No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik.'
        },
        {
            id: 2,
            question: 'Berapa lama proses permohonan informasi publik?',
            answer: 'Sesuai UU No. 14 Tahun 2008, permohonan akan diproses dalam waktu 10 hari kerja sejak diterimanya permohonan. Jika diperlukan, waktu dapat diperpanjang maksimal 7 hari kerja dengan pemberitahuan tertulis kepada pemohon.'
        },
        {
            id: 3,
            question: 'Apakah ada biaya untuk mengajukan permohonan?',
            answer: 'Layanan permohonan informasi publik ini GRATIS. Namun, jika pemohon memerlukan salinan dokumen, biaya penggandaan ditanggung oleh pemohon sesuai dengan standar biaya yang berlaku.'
        },
        {
            id: 4,
            question: 'Bagaimana jika permohonan saya ditolak?',
            answer: 'Jika permohonan ditolak, PPID akan memberikan alasan penolakan secara tertulis. Pemohon berhak mengajukan keberatan kepada atasan PPID dalam waktu 30 hari kerja sejak diterimanya surat penolakan.'
        },
        {
            id: 5,
            question: 'Apakah saya bisa mengajukan keberatan atas keputusan PPID?',
            answer: 'Ya, pemohon dapat mengajukan keberatan kepada atasan PPID jika tidak puas dengan keputusan yang diberikan. Jika keberatan tidak dikabulkan, pemohon dapat mengajukan sengketa ke Komisi Informasi.'
        }
    ];

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <motion.section 
            className="py-14 lg:py-20 bg-slate-50"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
        >
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-10">
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 tracking-wide uppercase mb-2">
                        <AlertCircle className="w-4 h-4" aria-hidden="true" />
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
                                className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
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
                                        <Minus className="w-5 h-5 text-blue-600" aria-hidden="true" />
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
// FORM SECTION - Interactive Multi-Step Form
// Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5
// ============================================================================
const FormSection: React.FC = () => {
    return (
        <motion.section 
            id="form-permohonan"
            className="py-14 lg:py-20 bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
        >
            <div className="max-w-2xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-10">
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 tracking-wide uppercase mb-2">
                        <PenLine className="w-4 h-4" aria-hidden="true" />
                        Formulir Online
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
                        Ajukan Permohonan
                    </h2>
                    <p className="text-slate-600 max-w-xl mx-auto">
                        Isi formulir di bawah ini untuk mengajukan permohonan informasi publik secara online
                    </p>
                </div>
                
                <MultiStepForm />
            </div>
        </motion.section>
    );
};

// ============================================================================
// MAIN PAGE COMPONENT
// Validates: Requirements 9.4, 9.5
// ============================================================================
const Permohonan: React.FC = () => {
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
                    <RequirementsSection />
                    <ScheduleSection />
                    <TimelineSection />
                    <FormSection />
                    <FAQSection />
                </div>
            </main>
        </PublicLayout>
    );
};

export default Permohonan;
