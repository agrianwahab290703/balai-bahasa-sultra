import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { PublicLayout } from '@/Layouts/PublicLayout';
import { Card, CardContent } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { 
    ChevronRight, 
    ArrowLeft,
    FileCode,
    FileText,
    FolderOpen,
    CheckCircle2,
    Shield,
    X,
    Loader2,
    ExternalLink,
    ChevronDown,
    Map,
    Settings,
    ClipboardCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DocumentItem {
    id: number;
    title: string;
    description: string;
    folderId: string;
}

interface SopKegiatanUtamaProps {
    documents: DocumentItem[];
}

const documentIcons = [Map, Settings, ClipboardCheck];

const DocumentViewer = ({ folderId, title, onClose }: { folderId: string; title: string; onClose: () => void; }) => {
    const [isLoading, setIsLoading] = useState(true);
    const isPlaceholder = folderId.includes('PLACEHOLDER');
    const embedUrl = `https://drive.google.com/embeddedfolderview?id=${folderId}#list`;
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-6xl h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-slate-50 to-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                            <FolderOpen className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 text-lg leading-tight line-clamp-1">{title}</h3>
                            <p className="text-sm text-gray-500">Dokumen SOP</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
                
                <div className="relative h-[calc(100%-76px)] bg-gray-50">
                    {isPlaceholder ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-white">
                            <div className="text-center max-w-md px-6">
                                <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <FileText className="w-8 h-8 text-amber-600" />
                                </div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">Dokumen Belum Tersedia</h4>
                                <p className="text-gray-600 text-sm leading-relaxed mb-4">Folder dokumen sedang dalam proses konfigurasi.</p>
                                <Button onClick={onClose} variant="outline">Tutup</Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {isLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                                    <div className="text-center">
                                        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mx-auto mb-3" />
                                        <p className="text-gray-600">Memuat dokumen...</p>
                                    </div>
                                </div>
                            )}
                            <div className="w-full h-full overflow-hidden">
                                <iframe src={embedUrl} className="w-full h-full border-0" onLoad={() => setIsLoading(false)} title={title} allow="autoplay" />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const DocumentCard = ({ document, index, onViewDocuments }: { document: DocumentItem; index: number; onViewDocuments: (doc: DocumentItem) => void; }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const Icon = documentIcons[index] || FileText;
    
    const colorSchemes = [
        { bg: 'from-emerald-500 to-emerald-600', shadow: 'shadow-emerald-500/25', light: 'bg-emerald-50', text: 'text-emerald-600' },
        { bg: 'from-teal-500 to-teal-600', shadow: 'shadow-teal-500/25', light: 'bg-teal-50', text: 'text-teal-600' },
        { bg: 'from-green-500 to-green-600', shadow: 'shadow-green-500/25', light: 'bg-green-50', text: 'text-green-600' },
    ];
    const colors = colorSchemes[index % colorSchemes.length];
    
    return (
        <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden bg-white">
            <CardContent className="p-0">
                <div className="p-6 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                    <div className="flex items-start gap-4">
                        <div className={cn("shrink-0 w-14 h-14 bg-gradient-to-br rounded-2xl flex items-center justify-center shadow-lg", colors.bg, colors.shadow)}>
                            <Icon className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <Badge className={cn("mb-2 text-xs font-medium", colors.light, colors.text)}>Kriteria {index + 1}</Badge>
                            <h3 className="text-base lg:text-lg font-semibold text-gray-900 leading-relaxed group-hover:text-emerald-600 transition-colors">{document.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">{document.description}</p>
                        </div>
                        <ChevronDown className={cn("w-5 h-5 text-gray-400 transition-transform duration-200 shrink-0 mt-1", isExpanded && "rotate-180")} />
                    </div>
                </div>
                
                <div className={cn("overflow-hidden transition-all duration-300", isExpanded ? "max-h-32 opacity-100" : "max-h-0 opacity-0")}>
                    <div className="px-6 pb-6 pt-2 border-t border-gray-100 bg-gradient-to-b from-gray-50/50 to-white">
                        <div className="flex items-center gap-3">
                            <Button onClick={(e) => { e.stopPropagation(); onViewDocuments(document); }} className={cn("flex-1 text-white shadow-lg", `bg-gradient-to-r ${colors.bg}`, colors.shadow)}>
                                <FolderOpen className="w-4 h-4 mr-2" />Lihat Dokumen
                            </Button>
                            <Button variant="outline" onClick={(e) => { e.stopPropagation(); window.open(`https://drive.google.com/drive/folders/${document.folderId}`, '_blank'); }} className="border-gray-200 hover:bg-gray-50">
                                <ExternalLink className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default function SopKegiatanUtama({ documents }: SopKegiatanUtamaProps) {
    const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);

    return (
        <PublicLayout title="SOP Kegiatan Utama - ZI-WBK" description="Prosedur Operasional Tetap (SOP) Kegiatan Utama">
            <section className="relative bg-gradient-to-br from-[#059669] via-[#047857] to-[#065f46] py-16 lg:py-20 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-emerald-300/20 rounded-full blur-3xl" />
                </div>
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '32px 32px'}}></div>
                </div>

                <div className="container relative mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center gap-2 text-emerald-200 mb-6 text-sm flex-wrap">
                            <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
                            <ChevronRight className="h-4 w-4" />
                            <Link href="/zi-wbk" className="hover:text-white transition-colors">ZI-WBK</Link>
                            <ChevronRight className="h-4 w-4" />
                            <Link href="/zi-wbk/penguatan-tata-laksana" className="hover:text-white transition-colors">Penguatan Tata Laksana</Link>
                            <ChevronRight className="h-4 w-4" />
                            <span className="text-white">SOP Kegiatan Utama</span>
                        </div>

                        <div className="flex items-start gap-6">
                            <div className="hidden sm:flex shrink-0 w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl items-center justify-center">
                                <FileCode className="w-8 h-8 text-yellow-400" />
                            </div>
                            <div>
                                <Badge className="mb-4 bg-yellow-400/90 text-gray-900 hover:bg-yellow-400 font-medium px-4 py-1.5">
                                    <Shield className="w-4 h-4 mr-2" />Penguatan Tata Laksana
                                </Badge>
                                <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl mb-4">
                                    SOP Kegiatan <span className="font-display italic text-yellow-400">Utama</span>
                                </h1>
                                <p className="text-lg text-emerald-100/90 max-w-2xl leading-relaxed">
                                    Prosedur Operasional Tetap yang mengacu pada peta proses bisnis instansi.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                        <path d="M0 120L48 110C96 100 192 80 288 70C384 60 480 60 576 65C672 70 768 80 864 85C960 90 1056 90 1152 85C1248 80 1344 70 1392 65L1440 60V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z" fill="white"/>
                    </svg>
                </div>
            </section>

            <section className="bg-gradient-to-b from-white to-gray-50 py-12 lg:py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-10">
                            <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-white overflow-hidden">
                                <CardContent className="p-6 lg:p-8">
                                    <div className="flex items-start gap-4">
                                        <div className="shrink-0 w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center">
                                            <FileCode className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900 mb-2">Dokumen SOP</h2>
                                            <p className="text-gray-600 leading-relaxed">
                                                Dokumen Prosedur Operasional Tetap (SOP) kegiatan utama. Klik untuk melihat detail.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-4">
                            {documents.map((doc, index) => (
                                <DocumentCard key={doc.id} document={doc} index={index} onViewDocuments={setSelectedDocument} />
                            ))}
                        </div>

                        <div className="mt-10 grid sm:grid-cols-3 gap-4">
                            <Card className="border-0 shadow-md bg-gradient-to-br from-emerald-50 to-white">
                                <CardContent className="p-5 text-center">
                                    <Map className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                                    <p className="text-sm font-medium text-gray-600">Peta Proses</p>
                                    <p className="text-xs text-gray-400 mt-1">Bisnis instansi</p>
                                </CardContent>
                            </Card>
                            <Card className="border-0 shadow-md bg-gradient-to-br from-teal-50 to-white">
                                <CardContent className="p-5 text-center">
                                    <Settings className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                                    <p className="text-sm font-medium text-gray-600">Penerapan</p>
                                    <p className="text-xs text-gray-400 mt-1">SOP aktif</p>
                                </CardContent>
                            </Card>
                            <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-white">
                                <CardContent className="p-5 text-center">
                                    <ClipboardCheck className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                    <p className="text-sm font-medium text-gray-600">Evaluasi</p>
                                    <p className="text-xs text-gray-400 mt-1">Perbaikan berkala</p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="mt-8">
                            <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-white">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-1">Standarisasi Proses</h3>
                                            <p className="text-sm text-gray-600 leading-relaxed">
                                                SOP memastikan konsistensi dan kualitas dalam pelaksanaan kegiatan utama instansi.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-gray-50 py-10 border-t border-gray-100">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <Link href="/zi-wbk/penguatan-tata-laksana/keterbukaan-informasi">
                                <Button variant="outline" className="gap-2"><ArrowLeft className="w-4 h-4" />Keterbukaan Informasi</Button>
                            </Link>
                            <Link href="/zi-wbk/penguatan-tata-laksana/spbe">
                                <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700">SPBE<ChevronRight className="w-4 h-4" /></Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {selectedDocument && <DocumentViewer folderId={selectedDocument.folderId} title={selectedDocument.title} onClose={() => setSelectedDocument(null)} />}
        </PublicLayout>
    );
}
