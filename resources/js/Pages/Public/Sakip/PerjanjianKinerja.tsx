import { PublicLayout } from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';
import { FileText, ExternalLink, Calendar, ClipboardCheck, ChevronRight, Award, Download } from 'lucide-react';
import { Card, CardContent } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';

interface Document {
    id: number;
    year: number;
    title: string;
    link: string;
    type: 'pdf' | 'gdrive';
}

const documents: Document[] = [
    {
        id: 1,
        year: 2025,
        title: 'Perjanjian Kinerja Tahun 2025',
        link: 'https://balaibahasasultra.kemendikdasmen.go.id/wp-content/uploads/2025/09/Perjanjian-Kinerja-2025.pdf',
        type: 'pdf'
    },
    {
        id: 2,
        year: 2024,
        title: 'Perjanjian Kinerja Tahun 2024',
        link: 'https://kantorbahasasultra.kemdikbud.go.id/wp-content/uploads/2024/06/Perjanjian-Kinerja-2024.pdf',
        type: 'pdf'
    },
    {
        id: 3,
        year: 2023,
        title: 'Perjanjian Kinerja Tahun 2023',
        link: 'https://kantorbahasasultra.kemdikbud.go.id/wp-content/uploads/2024/06/PK-Gabung-2023.pdf',
        type: 'pdf'
    },
    {
        id: 4,
        year: 2022,
        title: 'Perjanjian Kinerja Tahun 2022',
        link: 'https://drive.google.com/file/d/1FPAR0-F1hz1CxMt2a8jtetmyfzNBPse4/view',
        type: 'gdrive'
    },
    {
        id: 5,
        year: 2021,
        title: 'Perjanjian Kinerja Tahun 2021',
        link: 'https://drive.google.com/file/d/1CvakG-e41RsmdTPd-FuWYin7010QGOWh/view',
        type: 'gdrive'
    },
    {
        id: 6,
        year: 2019,
        title: 'Perjanjian Kinerja Tahun 2019',
        link: 'https://drive.google.com/file/d/1WCA-7mVLjToF4OLptJuGY7rcPApXJLyr/view',
        type: 'gdrive'
    },
    {
        id: 7,
        year: 2018,
        title: 'Perjanjian Kinerja Tahun 2018',
        link: 'https://drive.google.com/file/d/1RDtyXPuoXCtc0tgxuuNpXo3DGVppxz_N/view',
        type: 'gdrive'
    },
];

export default function PerjanjianKinerja() {
    const sortedDocuments = [...documents].sort((a, b) => b.year - a.year);

    const getYearColor = (index: number) => {
        const colors = [
            { bg: 'bg-blue-500', gradient: 'from-blue-500 to-blue-600', light: 'bg-blue-50 border-blue-200' },
            { bg: 'bg-emerald-500', gradient: 'from-emerald-500 to-emerald-600', light: 'bg-emerald-50 border-emerald-200' },
            { bg: 'bg-purple-500', gradient: 'from-purple-500 to-purple-600', light: 'bg-purple-50 border-purple-200' },
            { bg: 'bg-orange-500', gradient: 'from-orange-500 to-orange-600', light: 'bg-orange-50 border-orange-200' },
            { bg: 'bg-rose-500', gradient: 'from-rose-500 to-rose-600', light: 'bg-rose-50 border-rose-200' },
            { bg: 'bg-cyan-500', gradient: 'from-cyan-500 to-cyan-600', light: 'bg-cyan-50 border-cyan-200' },
            { bg: 'bg-amber-500', gradient: 'from-amber-500 to-amber-600', light: 'bg-amber-50 border-amber-200' },
        ];
        return colors[index % colors.length];
    };

    return (
        <PublicLayout
            title="Perjanjian Kinerja"
            description="Dokumen Perjanjian Kinerja Balai Bahasa Provinsi Sulawesi Tenggara"
        >
            <Head title="Perjanjian Kinerja - SAKIP" />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-[#0d4f6c] via-[#1a6b8a] to-[#0d4f6c] py-16 lg:py-24 overflow-hidden">
                {/* Background decorations */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-cyan-300/10 rounded-full blur-3xl" />
                </div>
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '32px 32px'}}></div>
                </div>

                <div className="container relative mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-blue-200 mb-6 text-sm flex-wrap">
                            <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
                            <ChevronRight className="h-4 w-4" />
                            <span className="text-white">SAKIP</span>
                            <ChevronRight className="h-4 w-4" />
                            <span className="text-white font-medium">Perjanjian Kinerja</span>
                        </div>

                        <div className="flex items-start gap-6">
                            <div className="hidden sm:flex shrink-0 w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl items-center justify-center">
                                <ClipboardCheck className="w-8 h-8 text-cyan-400" />
                            </div>
                            <div>
                                <Badge className="mb-4 bg-cyan-400/90 text-gray-900 hover:bg-cyan-400 font-medium px-4 py-1.5">
                                    <Award className="w-4 h-4 mr-2" />
                                    SAKIP
                                </Badge>
                                <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl mb-4">
                                    Perjanjian <span className="font-display italic text-cyan-400">Kinerja</span>
                                </h1>
                                <p className="text-lg text-blue-100/90 max-w-2xl leading-relaxed">
                                    Dokumen komitmen pencapaian kinerja antara pimpinan dan bawahan
                                    Balai Bahasa Provinsi Sulawesi Tenggara
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
                            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                                <FileText className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-800">{documents.length}</p>
                                <p className="text-sm text-slate-500">Total Dokumen</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-800">
                                    {Math.min(...documents.map(d => d.year))} - {Math.max(...documents.map(d => d.year))}
                                </p>
                                <p className="text-sm text-slate-500">Periode</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                                <ClipboardCheck className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-800">Tahunan</p>
                                <p className="text-sm text-slate-500">Penyusunan</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Documents List Section */}
            <section className="py-12 lg:py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        {/* Section Header */}
                        <div className="text-center mb-10">
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">
                                Dokumen Perjanjian Kinerja
                            </h2>
                            <p className="text-slate-600">
                                Klik untuk melihat atau mengunduh dokumen
                            </p>
                        </div>

                        {/* Documents Table/Cards */}
                        <div className="space-y-4">
                            {sortedDocuments.map((doc, index) => {
                                const colors = getYearColor(index);
                                return (
                                    <a
                                        key={doc.id}
                                        href={doc.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group block"
                                    >
                                        <Card className={`border ${colors.light} hover:shadow-lg transition-all duration-300 overflow-hidden group-hover:scale-[1.01]`}>
                                            <CardContent className="p-0">
                                                <div className="flex items-center">
                                                    {/* Year Badge */}
                                                    <div className={`hidden sm:flex w-24 h-full bg-gradient-to-br ${colors.gradient} items-center justify-center py-6`}>
                                                        <span className="text-2xl font-bold text-white">{doc.year}</span>
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-1 p-4 sm:p-5 flex items-center justify-between gap-4">
                                                        <div className="flex items-center gap-4">
                                                            {/* Mobile Year */}
                                                            <div className={`sm:hidden flex w-14 h-14 rounded-xl bg-gradient-to-br ${colors.gradient} items-center justify-center shrink-0`}>
                                                                <span className="text-lg font-bold text-white">{doc.year}</span>
                                                            </div>
                                                            
                                                            <div className="hidden sm:flex w-10 h-10 rounded-lg bg-slate-100 items-center justify-center shrink-0">
                                                                <FileText className="w-5 h-5 text-slate-500" />
                                                            </div>
                                                            
                                                            <div>
                                                                <h3 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                                                                    {doc.title}
                                                                </h3>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <Badge variant="secondary" className="text-xs">
                                                                        {doc.type === 'pdf' ? 'PDF' : 'Google Drive'}
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Action */}
                                                        <div className="flex items-center gap-2 shrink-0">
                                                            <span className="hidden lg:inline text-sm text-slate-500 group-hover:text-blue-600 transition-colors">
                                                                Lihat Dokumen
                                                            </span>
                                                            <div className="w-10 h-10 rounded-lg bg-slate-100 group-hover:bg-blue-500 flex items-center justify-center transition-colors">
                                                                <ExternalLink className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Info Section */}
            <section className="py-12 lg:py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <Card className="border-0 shadow-lg bg-gradient-to-br from-cyan-50 to-blue-50 overflow-hidden">
                            <CardContent className="p-6 lg:p-8">
                                <div className="flex items-start gap-4">
                                    <div className="shrink-0 w-12 h-12 bg-cyan-600 rounded-xl flex items-center justify-center">
                                        <ClipboardCheck className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 mb-2">Tentang Perjanjian Kinerja</h2>
                                        <p className="text-gray-600 leading-relaxed mb-4">
                                            Perjanjian Kinerja (PK) adalah lembar/dokumen yang berisikan penugasan dari pimpinan 
                                            instansi yang lebih tinggi kepada pimpinan instansi yang lebih rendah untuk melaksanakan 
                                            program/kegiatan yang disertai dengan indikator kinerja. Melalui perjanjian kinerja, 
                                            terwujudlah komitmen dan kesepakatan antara penerima amanah dan pemberi amanah atas 
                                            kinerja terukur tertentu berdasarkan tugas, fungsi dan wewenang serta sumber daya 
                                            yang tersedia.
                                        </p>
                                        <ul className="text-gray-600 text-sm space-y-2">
                                            <li className="flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full mt-2 shrink-0"></span>
                                                <span>Menjadi dasar penilaian keberhasilan/kegagalan pencapaian tujuan</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full mt-2 shrink-0"></span>
                                                <span>Sebagai dasar pemberian reward atau punishment</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full mt-2 shrink-0"></span>
                                                <span>Sebagai dasar bagi pemberi amanah untuk melakukan monitoring kinerja</span>
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
