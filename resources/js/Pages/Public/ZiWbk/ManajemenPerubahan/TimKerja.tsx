import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { PublicLayout } from '@/Layouts/PublicLayout';
import { Card, CardContent } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { 
    ChevronRight, 
    ArrowLeft,
    Users,
    FileText,
    FolderOpen,
    CheckCircle2,
    Shield,
    X,
    Loader2,
    ExternalLink,
    ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DocumentItem {
    id: number;
    title: string;
    description: string;
    folderId: string;
}

interface TimKerjaProps {
    documents: DocumentItem[];
}

// Document Viewer Component - Embeds Google Drive folder
const DocumentViewer = ({ 
    folderId, 
    title, 
    onClose 
}: { 
    folderId: string; 
    title: string; 
    onClose: () => void;
}) => {
    const [isLoading, setIsLoading] = useState(true);
    
    // Check if folder ID is a placeholder
    const isPlaceholder = folderId.includes('PLACEHOLDER');
    
    // Google Drive embed URL for folder view
    const embedUrl = `https://drive.google.com/embeddedfolderview?id=${folderId}#list`;
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-6xl h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-slate-50 to-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                            <FolderOpen className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 text-lg leading-tight">{title}</h3>
                            <p className="text-sm text-gray-500">Dokumen Pendukung</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
                
                {/* Content Area */}
                <div className="relative h-[calc(100%-76px)] bg-gray-50">
                    {isPlaceholder ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-white">
                            <div className="text-center max-w-md px-6">
                                <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <FileText className="w-8 h-8 text-amber-600" />
                                </div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">Dokumen Belum Tersedia</h4>
                                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                    Folder dokumen untuk kriteria ini sedang dalam proses konfigurasi. 
                                    Silakan hubungi administrator untuk informasi lebih lanjut.
                                </p>
                                <Button onClick={onClose} variant="outline">
                                    Tutup
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {isLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                                    <div className="text-center">
                                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-3" />
                                        <p className="text-gray-600">Memuat dokumen...</p>
                                    </div>
                                </div>
                            )}
                            
                            {/* Iframe with custom styling overlay */}
                            <div className="w-full h-full overflow-hidden">
                                <iframe
                                    src={embedUrl}
                                    className="w-full h-full border-0"
                                    onLoad={() => setIsLoading(false)}
                                    title={title}
                                    allow="autoplay"
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// Document Card Component
const DocumentCard = ({ 
    document, 
    index, 
    onViewDocuments 
}: { 
    document: DocumentItem; 
    index: number;
    onViewDocuments: (doc: DocumentItem) => void;
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    return (
        <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden bg-white">
            <CardContent className="p-0">
                {/* Main Content */}
                <div 
                    className="p-6 cursor-pointer"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <div className="flex items-start gap-4">
                        {/* Number Badge */}
                        <div className="shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                            <span className="text-white font-bold text-lg">{index + 1}</span>
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 leading-relaxed mb-2 group-hover:text-blue-600 transition-colors">
                                {document.title}
                            </h3>
                            <p className="text-sm text-gray-500">{document.description}</p>
                        </div>
                        
                        {/* Expand Icon */}
                        <ChevronDown className={cn(
                            "w-5 h-5 text-gray-400 transition-transform duration-200 shrink-0",
                            isExpanded && "rotate-180"
                        )} />
                    </div>
                </div>
                
                {/* Expanded Actions */}
                <div className={cn(
                    "overflow-hidden transition-all duration-300",
                    isExpanded ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
                )}>
                    <div className="px-6 pb-6 pt-2 border-t border-gray-100 bg-gradient-to-b from-gray-50/50 to-white">
                        <div className="flex items-center gap-3">
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onViewDocuments(document);
                                }}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25"
                            >
                                <FolderOpen className="w-4 h-4 mr-2" />
                                Lihat Dokumen
                            </Button>
                            <Button
                                variant="outline"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(`https://drive.google.com/drive/folders/${document.folderId}`, '_blank');
                                }}
                                className="border-gray-200 hover:bg-gray-50"
                            >
                                <ExternalLink className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default function TimKerja({ documents }: TimKerjaProps) {
    const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);

    return (
        <PublicLayout 
            title="Tim Kerja - ZI-WBK" 
            description="Pembentukan Tim Kerja Zona Integritas Kantor Bahasa Sulawesi Tenggara"
        >
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-[#0c4a6e] via-[#1e6091] to-[#0369a1] py-16 lg:py-20 overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl" />
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
                            <Link href="/zi-wbk" className="hover:text-white transition-colors">ZI-WBK</Link>
                            <ChevronRight className="h-4 w-4" />
                            <Link href="/zi-wbk/manajemen-perubahan" className="hover:text-white transition-colors">Manajemen Perubahan</Link>
                            <ChevronRight className="h-4 w-4" />
                            <span className="text-white">Tim Kerja</span>
                        </div>

                        <div className="flex items-start gap-6">
                            <div className="hidden sm:flex shrink-0 w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl items-center justify-center">
                                <Users className="w-8 h-8 text-yellow-400" />
                            </div>
                            <div>
                                <Badge className="mb-4 bg-yellow-400/90 text-gray-900 hover:bg-yellow-400 font-medium px-4 py-1.5">
                                    <Shield className="w-4 h-4 mr-2" />
                                    Zona Integritas
                                </Badge>
                                <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl mb-4">
                                    Tim <span className="font-display italic text-yellow-400">Kerja</span>
                                </h1>
                                <p className="text-lg text-blue-100/90 max-w-2xl leading-relaxed">
                                    Pembentukan dan penentuan anggota tim untuk pembangunan Zona Integritas 
                                    menuju Wilayah Bebas dari Korupsi (WBK).
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Wave decoration */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                        <path d="M0 120L48 110C96 100 192 80 288 70C384 60 480 60 576 65C672 70 768 80 864 85C960 90 1056 90 1152 85C1248 80 1344 70 1392 65L1440 60V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z" fill="white"/>
                    </svg>
                </div>
            </section>

            {/* Content Section */}
            <section className="bg-gradient-to-b from-white to-gray-50 py-12 lg:py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        {/* Introduction */}
                        <div className="mb-10">
                            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-white overflow-hidden">
                                <CardContent className="p-6 lg:p-8">
                                    <div className="flex items-start gap-4">
                                        <div className="shrink-0 w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                                            <FileText className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900 mb-2">Dokumen Tim Kerja</h2>
                                            <p className="text-gray-600 leading-relaxed">
                                                Berikut adalah dokumen terkait pembentukan dan mekanisme penentuan 
                                                anggota tim pembangunan Zona Integritas. Klik pada setiap item untuk 
                                                melihat dokumen pendukung.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Document List */}
                        <div className="space-y-4">
                            {documents.map((doc, index) => (
                                <DocumentCard
                                    key={doc.id}
                                    document={doc}
                                    index={index}
                                    onViewDocuments={setSelectedDocument}
                                />
                            ))}
                        </div>

                        {/* Info Box */}
                        <div className="mt-10">
                            <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-white">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-1">Komitmen Transparansi</h3>
                                            <p className="text-sm text-gray-600 leading-relaxed">
                                                Kantor Bahasa Provinsi Sulawesi Tenggara berkomitmen untuk menjalankan 
                                                prinsip transparansi dalam pembangunan Zona Integritas. Seluruh dokumen 
                                                dapat diakses oleh publik sebagai bentuk akuntabilitas.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Navigation Links */}
            <section className="bg-gray-50 py-10 border-t border-gray-100">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <Link href="/zi-wbk/manajemen-perubahan">
                                <Button variant="outline" className="gap-2">
                                    <ArrowLeft className="w-4 h-4" />
                                    Kembali ke Manajemen Perubahan
                                </Button>
                            </Link>
                            <Link href="/zi-wbk/manajemen-perubahan/rencana-pembangunan">
                                <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                                    Rencana Pembangunan WBK
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Document Viewer Modal */}
            {selectedDocument && (
                <DocumentViewer
                    folderId={selectedDocument.folderId}
                    title={selectedDocument.title}
                    onClose={() => setSelectedDocument(null)}
                />
            )}
        </PublicLayout>
    );
}
