import { PublicLayout } from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';
import { FileText, ExternalLink, Calendar, Compass, ChevronRight, MapPin, Download, BookOpen, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';

interface Document {
    id: number;
    period: string;
    title: string;
    link: string;
    type: 'pdf' | 'gdrive';
    isRevision?: boolean;
}

const documents: Document[] = [
    {
        id: 1,
        period: '2020-2024',
        title: 'Rencana Strategis Revisi 2020-2024',
        link: 'https://drive.google.com/file/d/1isf1m105_xbJ87HQk3VcjUJlitlkXKax/view',
        type: 'gdrive',
        isRevision: true
    },
    {
        id: 2,
        period: '2020-2024',
        title: 'Rencana Strategis 2020-2024',
        link: 'https://drive.google.com/file/d/109uFFvuKPkyzx4XNcCIRPWD0V8k8E2tn/view',
        type: 'gdrive'
    },
    {
        id: 3,
        period: '2015-2019',
        title: 'Rencana Strategis 2015-2019',
        link: 'https://drive.google.com/file/d/1wx6mChNHdq0Z0CTbrL-A09ev2BPLQjDO/view',
        type: 'gdrive'
    },
];

export default function RencanaStrategis() {
    return (
        <PublicLayout
            title="Rencana Strategis"
            description="Dokumen Rencana Strategis Balai Bahasa Provinsi Sulawesi Tenggara"
        >
            <Head title="Rencana Strategis - SAKIP" />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-[#4c1d95] via-[#6d28d9] to-[#4c1d95] py-16 lg:py-24 overflow-hidden">
                {/* Background decorations */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-violet-400/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-purple-300/10 rounded-full blur-3xl" />
                </div>
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '32px 32px'}}></div>
                </div>

                <div className="container relative mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-violet-200 mb-6 text-sm flex-wrap">
                            <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
                            <ChevronRight className="h-4 w-4" />
                            <span className="text-white">SAKIP</span>
                            <ChevronRight className="h-4 w-4" />
                            <span className="text-white font-medium">Rencana Strategis</span>
                        </div>

                        <div className="flex items-start gap-6">
                            <div className="hidden sm:flex shrink-0 w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl items-center justify-center">
                                <Compass className="w-8 h-8 text-violet-400" />
                            </div>
                            <div>
                                <Badge className="mb-4 bg-violet-400/90 text-gray-900 hover:bg-violet-400 font-medium px-4 py-1.5">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    SAKIP
                                </Badge>
                                <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl mb-4">
                                    Rencana <span className="font-display italic text-violet-400">Strategis</span>
                                </h1>
                                <p className="text-lg text-violet-100/90 max-w-2xl leading-relaxed">
                                    Dokumen perencanaan jangka menengah yang memuat visi, misi, tujuan, strategi, 
                                    kebijakan, program, dan kegiatan pembangunan Balai Bahasa Provinsi Sulawesi Tenggara
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Wave decoration */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                        <path d="M0 60L60 55C120 50 240 40 360 35C480 30 600 30 720 33.3C840 37 960 43 1080 45C1200 47 1320 45 1380 44L1440 43V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z" fill="#f8fafc"/>
                    </svg>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-slate-50 py-8 border-b border-slate-200">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
                                <FileText className="w-6 h-6 text-violet-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-800">{documents.length}</p>
                                <p className="text-sm text-slate-500">Total Dokumen</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-800">5 Tahun</p>
                                <p className="text-sm text-slate-500">Periode Renstra</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                                <Compass className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-800">2015-2024</p>
                                <p className="text-sm text-slate-500">Arsip Tersedia</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content Section */}
            <section className="py-12 lg:py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        {/* Featured Renstra Card */}
                        <div className="mb-12">
                            <Card className="border-0 shadow-2xl overflow-hidden bg-white">
                                <div className="grid lg:grid-cols-5 gap-0">
                                    {/* Image Section */}
                                    <div className="lg:col-span-2 relative bg-gradient-to-br from-violet-600 to-purple-700 p-8 flex items-center justify-center min-h-[300px]">
                                        <div className="absolute inset-0 opacity-10">
                                            <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)', backgroundSize: '20px 20px'}}></div>
                                        </div>
                                        <div className="relative z-10 text-center">
                                            {/* Book illustration */}
                                            <div className="w-40 h-52 mx-auto bg-white rounded-lg shadow-2xl overflow-hidden relative transform hover:scale-105 transition-transform duration-300">
                                                <div className="absolute inset-0 bg-gradient-to-br from-violet-100 to-purple-50"></div>
                                                <div className="absolute inset-x-4 top-4 bottom-4 border-2 border-violet-200 rounded flex flex-col items-center justify-center p-3">
                                                    <BookOpen className="w-10 h-10 text-violet-500 mb-2" />
                                                    <p className="text-xs font-bold text-violet-800 text-center leading-tight">RENSTRA</p>
                                                    <p className="text-[10px] text-violet-600 text-center mt-1">Balai Bahasa</p>
                                                    <p className="text-[10px] text-violet-600 text-center">Sulawesi Tenggara</p>
                                                    <div className="mt-2 px-2 py-1 bg-violet-500 rounded text-white text-[9px] font-medium">
                                                        2020-2024
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-violet-200 text-sm mt-4">Dokumen Renstra Terbaru</p>
                                        </div>
                                    </div>

                                    {/* Documents List Section */}
                                    <div className="lg:col-span-3 p-6 lg:p-8">
                                        <h2 className="text-2xl font-bold text-slate-800 mb-2">
                                            Dokumen Rencana Strategis
                                        </h2>
                                        <p className="text-slate-600 mb-6">
                                            Pilih dokumen Renstra yang ingin Anda lihat atau unduh
                                        </p>

                                        <div className="space-y-4">
                                            {documents.map((doc, index) => (
                                                <a
                                                    key={doc.id}
                                                    href={doc.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="group block"
                                                >
                                                    <div className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 ${
                                                        index === 0 
                                                            ? 'border-violet-300 bg-violet-50 hover:bg-violet-100 hover:border-violet-400' 
                                                            : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                                                    }`}>
                                                        {/* Period Badge */}
                                                        <div className={`shrink-0 w-16 h-16 rounded-xl flex flex-col items-center justify-center ${
                                                            index === 0 
                                                                ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white' 
                                                                : 'bg-slate-100 text-slate-600'
                                                        }`}>
                                                            <span className="text-[10px] font-medium opacity-80">Periode</span>
                                                            <span className="text-xs font-bold leading-tight">{doc.period.split('-')[0]}</span>
                                                            <span className="text-[10px]">-</span>
                                                            <span className="text-xs font-bold leading-tight">{doc.period.split('-')[1]}</span>
                                                        </div>

                                                        {/* Content */}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                {doc.isRevision && (
                                                                    <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-[10px]">
                                                                        Revisi
                                                                    </Badge>
                                                                )}
                                                                {index === 0 && (
                                                                    <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-100 text-[10px]">
                                                                        Terbaru
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <h3 className={`font-semibold truncate transition-colors ${
                                                                index === 0 
                                                                    ? 'text-violet-800 group-hover:text-violet-900' 
                                                                    : 'text-slate-800 group-hover:text-violet-600'
                                                            }`}>
                                                                {doc.title}
                                                            </h3>
                                                            <p className="text-xs text-slate-500 mt-0.5">
                                                                Google Drive • Klik untuk melihat
                                                            </p>
                                                        </div>

                                                        {/* Action */}
                                                        <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                                                            index === 0 
                                                                ? 'bg-violet-200 group-hover:bg-violet-500 text-violet-600 group-hover:text-white' 
                                                                : 'bg-slate-100 group-hover:bg-violet-500 text-slate-400 group-hover:text-white'
                                                        }`}>
                                                            <ExternalLink className="w-5 h-5" />
                                                        </div>
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Quick Links */}
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {documents.map((doc, index) => (
                                <a
                                    key={`quick-${doc.id}`}
                                    href={doc.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group"
                                >
                                    <Card className="border border-slate-200 hover:border-violet-300 hover:shadow-lg transition-all duration-300 h-full">
                                        <CardContent className="p-5 flex items-center gap-4">
                                            <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                                                index === 0 ? 'bg-violet-500 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-violet-100 group-hover:text-violet-600'
                                            } transition-colors`}>
                                                <FileText className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-slate-800 group-hover:text-violet-600 transition-colors truncate">
                                                    Renstra {doc.period}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {doc.isRevision ? 'Dokumen Revisi' : 'Dokumen Asli'}
                                                </p>
                                            </div>
                                            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-violet-500 transition-colors" />
                                        </CardContent>
                                    </Card>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Info Section */}
            <section className="py-12 lg:py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <Card className="border-0 shadow-lg bg-gradient-to-br from-violet-50 to-purple-50 overflow-hidden">
                            <CardContent className="p-6 lg:p-8">
                                <div className="flex items-start gap-4">
                                    <div className="shrink-0 w-12 h-12 bg-violet-600 rounded-xl flex items-center justify-center">
                                        <Compass className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 mb-2">Tentang Rencana Strategis</h2>
                                        <p className="text-gray-600 leading-relaxed mb-4">
                                            Rencana Strategis (Renstra) adalah dokumen perencanaan untuk periode 5 (lima) tahun 
                                            yang memuat visi, misi, tujuan, strategi, kebijakan, program, dan kegiatan pembangunan 
                                            sesuai dengan tugas dan fungsi Balai Bahasa Provinsi Sulawesi Tenggara. Renstra disusun 
                                            dengan berpedoman pada Rencana Pembangunan Jangka Menengah Nasional (RPJMN) dan 
                                            Rencana Strategis Kementerian.
                                        </p>
                                        <ul className="text-gray-600 text-sm space-y-2">
                                            <li className="flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 bg-violet-500 rounded-full mt-2 shrink-0"></span>
                                                <span>Menjadi acuan penyusunan rencana kerja tahunan</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 bg-violet-500 rounded-full mt-2 shrink-0"></span>
                                                <span>Mengarahkan pembangunan selama 5 tahun ke depan</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 bg-violet-500 rounded-full mt-2 shrink-0"></span>
                                                <span>Menjadi tolok ukur pencapaian kinerja jangka menengah</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
