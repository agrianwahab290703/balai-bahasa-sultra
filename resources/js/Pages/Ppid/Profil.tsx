import React, { useRef, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Info,
    ChevronRight,
    Sparkles,
    Scale,
    ClipboardList,
    Users,
    MapPin,
    Home,
    ChevronDown,
    BookOpen,
    Shield,
    FileText,
    Phone,
    Mail,
    Quote,
    Clock,
    Calendar,
    Download,
    MessageCircle,
    CheckCircle,
    Building,
    User,
    FileCheck,
    Globe,
    Printer
} from 'lucide-react';
import { Card, CardContent } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Separator } from '@/Components/ui/separator';
import { PublicLayout } from '@/Layouts/PublicLayout';
import { ExpandableText } from '@/Components/ui/expandable-text';
import { SectionHeader } from '@/Components/ui/section-header';
import { TeamMemberCard } from '@/Components/ui/team-member-card';
import { ProgressIndicator } from '@/Components/ui/progress-indicator';
import { SmoothScrollNav } from '@/Components/ui/smooth-scroll-nav';
import { usePpidErrorHandler } from '@/hooks/usePpidErrorHandler';

// Interfaces
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


// Hero Section Component with enhanced visuals and animations
const HeroSection: React.FC<{ onScrollToContent: () => void }> = ({ onScrollToContent }) => {
    return (
        <section className="relative min-h-[500px] md:min-h-[600px] flex items-center justify-center overflow-hidden">
            {/* Animated gradient background */}
            <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-[#0c4a6e] via-[#1e6091] to-[#0369a1]"
                animate={{
                    background: [
                        'linear-gradient(135deg, #0c4a6e 0%, #1e6091 50%, #0369a1 100%)',
                        'linear-gradient(135deg, #0369a1 0%, #0c4a6e 50%, #1e6091 100%)',
                        'linear-gradient(135deg, #1e6091 0%, #0369a1 50%, #0c4a6e 100%)',
                        'linear-gradient(135deg, #0c4a6e 0%, #1e6091 50%, #0369a1 100%)',
                    ]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Enhanced floating orbs with motion */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div 
                    className="absolute -top-24 -right-24 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl"
                    animate={{
                        y: [0, 30, 0],
                        x: [0, 20, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div 
                    className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl"
                    animate={{
                        y: [0, -40, 0],
                        x: [0, 30, 0],
                        scale: [1, 1.15, 1],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                />
                <motion.div 
                    className="absolute top-1/2 right-1/4 w-64 h-64 bg-purple-400/10 rounded-full blur-2xl"
                    animate={{
                        y: [0, 25, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                />
                <motion.div 
                    className="absolute top-1/4 left-1/3 w-48 h-48 bg-cyan-400/10 rounded-full blur-2xl"
                    animate={{
                        x: [0, -15, 0],
                        y: [0, 20, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                />
            </div>
            
            {/* Enhanced dot pattern overlay */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
                    backgroundSize: '32px 32px'
                }} />
            </div>
            
            {/* Content with enhanced animations */}
            <div className="relative z-10 text-center text-white px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Breadcrumb */}
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
                    
                    {/* Badge with animation */}
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
                    
                    {/* Animated title */}
                    <motion.h1 
                        className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                    >
                        Profil <motion.span 
                            className="font-display italic text-yellow-400"
                            animate={{ 
                                textShadow: [
                                    '0 0 20px rgba(250, 204, 21, 0.5)',
                                    '0 0 40px rgba(250, 204, 21, 0.8)',
                                    '0 0 20px rgba(250, 204, 21, 0.5)',
                                ]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            PPID
                        </motion.span>
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
                    
                    {/* Enhanced CTA Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.7 }}
                    >
                        <Button 
                            size="lg" 
                            className="bg-white text-blue-700 hover:bg-yellow-400 hover:text-gray-900 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 font-semibold px-8"
                            onClick={onScrollToContent}
                        >
                            <Sparkles className="w-5 h-5 mr-2" />
                            Jelajahi Lebih Lanjut
                        </Button>
                    </motion.div>
                    
                    {/* Animated scroll indicator */}
                    <motion.div 
                        className="mt-12"
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        <ChevronDown className="w-8 h-8 mx-auto text-white/50" />
                    </motion.div>
                </div>
            </div>
            
            {/* Wave decoration */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                    <path d="M0 120L48 110C96 100 192 80 288 70C384 60 480 60 576 65C672 70 768 80 864 85C960 90 1056 90 1152 85C1248 80 1344 70 1392 65L1440 60V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z" fill="white"/>
                </svg>
            </div>
        </section>
    );
};


// Quick Stats Section - New visual element
const QuickStatsSection: React.FC = () => {
    const stats = [
        { icon: FileText, label: 'Informasi Publik', value: '4 Kategori' },
        { icon: Users, label: 'Tim PPID', value: '7 Anggota' },
        { icon: ClipboardList, label: 'Tugas & Fungsi', value: '10 Poin' },
        { icon: Scale, label: 'Prinsip', value: '4 Prinsip' },
    ];

    return (
        <section className="py-8 bg-white">
            <div className="max-w-5xl mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="group flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-all duration-300 hover:shadow-md"
                        >
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-900">{stat.value}</span>
                            <span className="text-sm text-gray-600">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// Service Information Section - Enhanced with working hours and contact details
const ServiceInfoSection: React.FC = () => {
    const serviceInfo = [
        {
            icon: Clock,
            title: 'Jam Layanan',
            description: 'Senin - Kamis: 08:00 - 15:30',
            subDescription: 'Jumat: 08:00 - 16:00',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            icon: Calendar,
            title: 'Hari Kerja',
            description: 'Senin - Jumat',
            subDescription: 'Libur Nasional: Tutup',
            color: 'from-purple-500 to-pink-500'
        },
        {
            icon: Phone,
            title: 'Kontak Langsung',
            description: '(0401) 3190308',
            subDescription: 'Fax: (0401) 3190477',
            color: 'from-green-500 to-emerald-500'
        },
        {
            icon: Mail,
            title: 'Email',
            description: 'ppid@balaibahasasultra.kemdikbud.go.id',
            subDescription: 'balaibahasasultra@kemdikbud.go.id',
            color: 'from-orange-500 to-red-500'
        }
    ];

    const documents = [
        { title: 'Standar Layanan', type: 'PDF', size: '245 KB' },
        { title: 'Prosedur Permohonan', type: 'PDF', size: '189 KB' },
        { title: 'Daftar Informasi Publik', type: 'PDF', size: '567 KB' },
        { title: 'Laporan PPID Tahun 2023', type: 'PDF', size: '1.2 MB' }
    ];

    return (
        <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-6xl mx-auto px-4">
                {/* Service Info Cards */}
                <motion.div
                    className="mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Informasi Layanan</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {serviceInfo.map((info, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                            >
                                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden">
                                    <motion.div
                                        className={`h-1 bg-gradient-to-r ${info.color}`}
                                        initial={{ scaleX: 0 }}
                                        whileInView={{ scaleX: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
                                    />
                                    <CardContent className="p-6">
                                        <motion.div
                                            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${info.color} flex items-center justify-center mb-4`}
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <info.icon className="w-6 h-6 text-white" />
                                        </motion.div>
                                        <h3 className="font-semibold text-gray-900 mb-2">{info.title}</h3>
                                        <p className="text-gray-700 text-sm font-medium">{info.description}</p>
                                        <p className="text-gray-500 text-xs mt-1">{info.subDescription}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Downloadable Documents */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Dokumen Penting</h2>
                    <Card className="border-0 shadow-xl">
                        <CardContent className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {documents.map((doc, index) => (
                                    <motion.div
                                        key={index}
                                        className="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-all duration-300 cursor-pointer"
                                        whileHover={{ x: 5 }}
                                        whileTap={{ scale: 0.98 }}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-white shadow-sm group-hover:shadow-md transition-shadow duration-300 flex items-center justify-center">
                                                <FileText className="w-5 h-5 text-red-500" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                                                    {doc.title}
                                                </p>
                                                <p className="text-xs text-gray-500">{doc.type} • {doc.size}</p>
                                            </div>
                                        </div>
                                        <Download className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                    </motion.div>
                                ))}
                            </div>
                            <motion.div
                                className="mt-6 text-center"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                            >
                                <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                                    <Globe className="w-4 h-4 mr-2" />
                                    Lihat Semua Dokumen
                                </Button>
                            </motion.div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </section>
    );
};

// Introduction Section Component with enhanced styling and scroll animations
const IntroductionSection: React.FC<{ profile: ProfileData | null; legalBasis: PpidContentData[] }> = ({ profile, legalBasis }) => {
    if (!profile) {
        return (
            <section id="introduction" className="py-16 lg:py-20">
                <div className="max-w-5xl mx-auto px-4">
                    <SectionHeader title="Tentang PPID" icon={Info} description="Informasi umum tentang PPID Balai Bahasa Sultra" />
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-white">
                        <CardContent className="p-8 lg:p-10">
                            <p className="text-gray-500 text-center">Belum ada data profil.</p>
                        </CardContent>
                    </Card>
                </div>
            </section>
        );
    }

    const legalBasisContent = legalBasis.length > 0 ? legalBasis[0].content : '';
    const fullContent = `${profile.content}\n\n${legalBasisContent}`;

    return (
        <section id="introduction" className="py-16 lg:py-20 bg-gradient-to-b from-white via-blue-50/20 to-white">
            <div className="max-w-5xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                >
                    <SectionHeader title="Tentang PPID" icon={Info} description="Informasi umum tentang PPID Balai Bahasa Sultra" />
                </motion.div>
                
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group">
                        <motion.div 
                            className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        />
                        <CardContent className="p-8 lg:p-10 relative">
                            {/* Decorative quote icon */}
                            <div className="absolute top-4 right-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                                <BookOpen className="w-24 h-24 text-blue-600" />
                            </div>
                            <ExpandableText content={fullContent} previewLength={350} />
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </section>
    );
};


// Principles Section Component with enhanced cards and scroll animations
const PrinciplesSection: React.FC<{ principles: PpidContentData[] }> = ({ principles }) => {
    if (principles.length === 0) return null;

    const principleIcons = [Shield, Scale, FileText, BookOpen];

    return (
        <section id="principles" className="py-16 lg:py-20 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl" />
            
            <div className="max-w-5xl mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                >
                    <SectionHeader 
                        title="Prinsip Keterbukaan Informasi" 
                        icon={Scale} 
                        description="Prinsip-prinsip yang harus dipenuhi dalam keterbukaan informasi publik"
                    />
                </motion.div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {principles.map((principle, index) => {
                        const IconComponent = principleIcons[index % principleIcons.length];
                        return (
                            <motion.div
                                key={principle.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Card 
                                    className="group border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 overflow-hidden bg-white/80 backdrop-blur-sm h-full"
                                >
                                    <CardContent className="p-6 relative">
                                        {/* Gradient accent line */}
                                        <motion.div 
                                            className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"
                                            initial={{ scaleX: 0 }}
                                            whileInView={{ scaleX: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                                        />
                                        
                                        <div className="flex items-start gap-5">
                                            {/* Number badge with icon */}
                                            <div className="relative">
                                                <motion.div 
                                                    className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg"
                                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                                    transition={{ type: "spring", stiffness: 300 }}
                                                >
                                                    <span className="text-white font-bold text-xl">{index + 1}</span>
                                                </motion.div>
                                                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center shadow">
                                                    <IconComponent className="w-3 h-3 text-gray-900" />
                                                </div>
                                            </div>
                                            
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900 mb-2">Prinsip {index + 1}</h3>
                                                <p className="text-gray-600 leading-relaxed">{principle.content}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};


// Tasks and Functions Section Component with enhanced list and scroll animations
const TasksFunctionsSection: React.FC<{ tasks: PpidContentData[] }> = ({ tasks }) => {
    if (tasks.length === 0) return null;

    const taskItems = tasks.filter(task => task.content && task.content.trim() !== '');

    return (
        <section id="tasks" className="py-16 lg:py-20 bg-gradient-to-b from-white via-gray-50/50 to-white">
            <div className="max-w-5xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                >
                    <SectionHeader 
                        title="Tugas dan Fungsi" 
                        icon={ClipboardList} 
                        description="Tugas dan fungsi PPID sesuai Permendikbud 41 Tahun 2020"
                    />
                </motion.div>
                
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <Card className="border-0 shadow-xl overflow-hidden">
                        {/* Header accent */}
                        <motion.div 
                            className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        />
                        
                        <CardContent className="p-8 lg:p-10">
                            <div className="space-y-4">
                                {taskItems.map((task, index) => (
                                    <motion.div 
                                        key={task.id} 
                                        className="group flex items-start gap-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300"
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: index * 0.05 }}
                                    >
                                        {/* Animated number badge */}
                                        <div className="relative">
                                            <motion.span 
                                                className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 text-blue-700 font-bold text-sm group-hover:from-blue-500 group-hover:to-purple-500 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-md"
                                                whileHover={{ scale: 1.1, rotate: 5 }}
                                                transition={{ type: "spring", stiffness: 300 }}
                                            >
                                                {String(index + 1).padStart(2, '0')}
                                            </motion.span>
                                        </div>
                                        
                                        <p className="text-gray-700 leading-relaxed pt-2 group-hover:text-gray-900 transition-colors duration-300 flex-1">
                                            {task.content}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </section>
    );
};

// Structure Section Component with enhanced team cards and scroll animations
const StructureSection: React.FC<{ teamMembers: TeamMemberData[] }> = ({ teamMembers }) => {
    if (teamMembers.length === 0) {
        return (
            <section id="structure" className="py-16 lg:py-20">
                <div className="max-w-5xl mx-auto px-4">
                    <SectionHeader title="Struktur Organisasi PPID" icon={Users} description="Tim Pengelola Informasi dan Dokumentasi" />
                    <Card className="border-0 shadow-lg">
                        <CardContent className="p-8 lg:p-10">
                            <p className="text-gray-500 text-center">Belum ada data anggota tim.</p>
                        </CardContent>
                    </Card>
                </div>
            </section>
        );
    }

    const ketua = teamMembers.find(m => m.role === 'ketua');
    const anggota = teamMembers.filter(m => m.role === 'anggota');

    return (
        <section id="structure" className="py-16 lg:py-20 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-white to-blue-50/30" />
            
            <div className="max-w-5xl mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                >
                    <SectionHeader title="Struktur Organisasi PPID" icon={Users} description="Tim Pengelola Informasi dan Dokumentasi" />
                </motion.div>
                
                {/* Ketua Section */}
                {ketua && (
                    <div className="max-w-lg mx-auto mb-10">
                        <TeamMemberCard member={ketua} isKetua />
                    </div>
                )}
                
                {/* Connector line */}
                {ketua && anggota.length > 0 && (
                    <motion.div 
                        className="flex justify-center mb-8"
                        initial={{ scaleY: 0 }}
                        whileInView={{ scaleY: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="w-px h-12 bg-gradient-to-b from-purple-300 to-blue-300" />
                    </motion.div>
                )}
                
                {/* Anggota Section */}
                {anggota.length > 0 && (
                    <div>
                        <motion.div 
                            className="flex items-center justify-center gap-4 mb-6"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <Separator className="flex-1 max-w-24" />
                            <Badge variant="outline" className="px-4 py-1 text-sm font-medium border-blue-200 text-blue-700">
                                Anggota PPID
                            </Badge>
                            <Separator className="flex-1 max-w-24" />
                        </motion.div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {anggota.map((member) => (
                                <TeamMemberCard key={member.id} member={member} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};


// Address Section Component with enhanced styling and scroll animations
const AddressSection: React.FC<{ address: PpidContentData | null }> = ({ address }) => {
    if (!address) return null;

    return (
        <section id="address" className="py-16 lg:py-20 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-5xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                >
                    <SectionHeader title="Alamat Kantor" icon={MapPin} description="Lokasi kantor PPID Balai Bahasa Sultra" />
                </motion.div>
                
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <Card className="border-0 shadow-2xl bg-gradient-to-br from-[#0c4a6e] via-[#1e6091] to-[#0369a1] text-white max-w-3xl mx-auto overflow-hidden group">
                        {/* Decorative elements */}
                        <motion.div 
                            className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.3, 0.5, 0.3],
                            }}
                            transition={{ duration: 4, repeat: Infinity }}
                        />
                        <motion.div 
                            className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-400/10 rounded-full blur-2xl"
                            animate={{
                                scale: [1, 1.3, 1],
                                opacity: [0.2, 0.4, 0.2],
                            }}
                            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                        />
                        
                        <CardContent className="p-8 lg:p-10 relative">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                {/* Icon container */}
                                <motion.div 
                                    className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0 ring-2 ring-white/20"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <MapPin className="w-10 h-10 text-yellow-400" />
                                </motion.div>
                                
                                <div className="text-center md:text-left flex-1">
                                    <h3 className="text-lg font-semibold text-yellow-400 mb-2">Alamat Lengkap</h3>
                                    <p className="text-xl leading-relaxed text-white/90">{address.content}</p>
                                    
                                    {/* Enhanced Contact info */}
                                    <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4 pt-4 border-t border-white/10">
                                        <motion.div
                                            className="flex items-center gap-2 text-blue-200"
                                            whileHover={{ x: 5 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <Phone className="w-4 h-4" />
                                            <span className="text-sm">(0401) 3190308</span>
                                        </motion.div>
                                        <motion.div
                                            className="flex items-center gap-2 text-blue-200"
                                            whileHover={{ x: 5 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <Printer className="w-4 h-4" />
                                            <span className="text-sm">(0401) 3190477</span>
                                        </motion.div>
                                        <motion.div
                                            className="flex items-center gap-2 text-blue-200"
                                            whileHover={{ x: 5 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <Mail className="w-4 h-4" />
                                            <span className="text-sm">ppid@balaibahasasultra.kemdikbud.go.id</span>
                                        </motion.div>
                                    </div>

                                    {/* Service Hours Badge */}
                                    <motion.div
                                        className="mt-4 inline-flex items-center gap-2 bg-yellow-400/20 backdrop-blur-sm rounded-full px-4 py-2"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <Clock className="w-4 h-4 text-yellow-400" />
                                        <span className="text-sm text-yellow-100 font-medium">
                                            Senin-Jumat: 08:00-15:30 WITA
                                        </span>
                                    </motion.div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </section>
    );
};

// FAQ Section - New addition for common queries
const FAQSection: React.FC = () => {
    const faqs = [
        {
            question: 'Apa itu PPID?',
            answer: 'PPID (Pejabat Pengelola Informasi dan Dokumentasi) adalah unit kerja yang berfungsi menyediakan, memberikan, dan/atau menerbitkan informasi publik.'
        },
        {
            question: 'Bagaimana cara mengajukan permohonan informasi?',
            answer: 'Permohonan informasi dapat diajukan secara langsung di kantor, melalui surat, email, atau melalui formulir online di website.'
        },
        {
            question: 'Berapa lama waktu penyelesaian permohonan?',
            answer: 'Permohonan informasi akan diproses paling lama 10 hari kerja sejak diterimanya permohonan.'
        },
        {
            question: 'Apakah permohonan informasi gratis?',
            answer: 'Informasi publik dapat diperoleh tanpa biaya. Namun untuk penyalinan informasi dikenakan biaya sesuai peraturan.'
        },
        {
            question: 'Bagaimana jika tidak puas dengan jawaban PPID?',
            answer: 'Pemohon dapat mengajukan keberatan kepada Atasan PPID dalam waktu 30 hari sejak menerima tanggapan.'
        }
    ];

    return (
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-4xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="text-center mb-12">
                        <MessageCircle className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Pertanyaan yang Sering Diajukan</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Temukan jawaban untuk pertanyaan umum tentang layanan PPID
                        </p>
                    </div>
                </motion.div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                        >
                            <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 group">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                                                {faq.question}
                                            </h3>
                                            <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    className="mt-8 text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Ajukan Pertanyaan
                    </Button>
                </motion.div>
            </div>
        </section>
    );
};

// Quote Section - New visual element
const QuoteSection: React.FC = () => {
    return (
        <section className="py-16 bg-gradient-to-br from-blue-800 via-blue-900 to-purple-900 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
            </div>

            <div className="max-w-4xl mx-auto px-4 relative z-10">
                <div className="text-center">
                    <Quote className="w-12 h-12 mx-auto mb-6 text-yellow-400/50 rotate-180" />
                    <blockquote className="text-2xl sm:text-3xl font-medium italic text-white leading-relaxed mb-6">
                        "Keterbukaan informasi publik adalah hak setiap warga negara untuk memperoleh informasi
                        yang berkaitan dengan kepentingan publik."
                    </blockquote>
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-px w-12 bg-yellow-400" />
                        <div>
                            <cite className="not-italic font-semibold text-yellow-400">UU No. 14 Tahun 2008</cite>
                            <p className="text-sm text-blue-200">Keterbukaan Informasi Publik</p>
                        </div>
                        <div className="h-px w-12 bg-yellow-400" />
                    </div>
                </div>
            </div>
        </section>
    );
};

// CTA Section - New visual element
const CTASection: React.FC = () => {
    return (
        <section className="py-12 sm:py-16 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4">
                <Card className="border-0 bg-gradient-to-r from-yellow-400 to-amber-400 shadow-xl overflow-hidden">
                    <CardContent className="p-8 sm:p-12 text-center relative">
                        {/* Decorative circles */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                        
                        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl mb-4 relative z-10">
                            Butuh Informasi Lebih Lanjut?
                        </h2>
                        <p className="text-gray-800 mb-6 max-w-2xl mx-auto relative z-10">
                            Ajukan permohonan informasi publik atau hubungi tim PPID kami untuk mendapatkan 
                            informasi yang Anda butuhkan.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                            <Link href="/ppid/permohonan">
                                <Button size="lg" className="bg-blue-700 text-white hover:bg-blue-800 shadow-lg w-full sm:w-auto">
                                    <FileText className="w-5 h-5 mr-2" />
                                    Ajukan Permohonan
                                </Button>
                            </Link>
                            <Link href="/kontak">
                                <Button size="lg" variant="outline" className="border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white w-full sm:w-auto">
                                    <Phone className="w-5 h-5 mr-2" />
                                    Hubungi Kami
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
};


// Main Page Component with all enhancements
export default function Profil({
    profile,
    legalBasis = [],
    principles = [],
    tasks = [],
    address,
    teamMembers = []
}: ProfilProps) {
    const mainContentRef = useRef<HTMLDivElement>(null);

    const scrollToContent = () => {
        mainContentRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Use the PPID error handler hook to prevent galeri-wrapper related errors
    usePpidErrorHandler();

    return (
        <PublicLayout title="Profil PPID" description="Profil PPID Balai Bahasa Sulawesi Tenggara">
            {/* Progress Indicator */}
            <ProgressIndicator />
            
            {/* Smooth Scroll Navigation */}
            <SmoothScrollNav />
            
            {/* Hero Section */}
            <HeroSection onScrollToContent={scrollToContent} />
            
            {/* Main Content */}
            <main ref={mainContentRef}>
                <QuickStatsSection />
                <ServiceInfoSection />
                <IntroductionSection profile={profile} legalBasis={legalBasis} />
                <PrinciplesSection principles={principles} />
                <TasksFunctionsSection tasks={tasks} />
                <StructureSection teamMembers={teamMembers} />
                <AddressSection address={address} />
                <FAQSection />
                <QuoteSection />
                <CTASection />
            </main>
        </PublicLayout>
    );
}
