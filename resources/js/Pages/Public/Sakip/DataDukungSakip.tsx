import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { PublicLayout } from '@/Layouts/PublicLayout';
import { Card, CardContent } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';

import { 
    ChevronRight, FileText, ExternalLink, Search, FileDown, BarChart3, 
    FileCheck, Folder, Filter, X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DocumentItem {
    id: number;
    title: string;
    link: string;
    type: 'gdrive' | 'pdf' | 'external';
}

interface Props {
    documents: DocumentItem[];
}

const getDocumentIcon = (type: string) => {
    switch (type) {
        case 'pdf':
            return FileDown;
        case 'external':
            return ExternalLink;
        default:
            return FileText;
    }
};

const getDocumentBadge = (type: string) => {
    switch (type) {
        case 'pdf':
            return { label: 'PDF', className: 'bg-red-100 text-red-700' };
        case 'external':
            return { label: 'Eksternal', className: 'bg-amber-100 text-amber-700' };
        default:
            return { label: 'Google Drive', className: 'bg-blue-100 text-blue-700' };
    }
};

const DocumentRow = ({ document, index }: { document: DocumentItem; index: number }) => {
    const Icon = getDocumentIcon(document.type);
    const badge = getDocumentBadge(document.type);

    return (
        <tr className="group border-b border-gray-100 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-white transition-colors">
            <td className="py-4 px-4 lg:px-6">
                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-xl items-center justify-center group-hover:from-indigo-200 group-hover:to-indigo-100 transition-colors">
                        <Icon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <span className="font-medium text-gray-900 group-hover:text-indigo-700 transition-colors line-clamp-2 text-sm lg:text-base">
                            {document.title}
                        </span>
                        <Badge className={cn("mt-1 text-xs font-medium sm:hidden", badge.className)}>
                            {badge.label}
                        </Badge>
                    </div>
                </div>
            </td>
            <td className="hidden sm:table-cell py-4 px-4">
                <Badge className={cn("text-xs font-medium", badge.className)}>
                    {badge.label}
                </Badge>
            </td>
            <td className="py-4 px-4 lg:px-6 text-right">
                <Button 
                    onClick={() => window.open(document.link, '_blank')}
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-md transition-all text-xs lg:text-sm"
                >
                    <span className="hidden sm:inline">Lihat</span>
                    <ExternalLink className="w-4 h-4 sm:ml-2" />
                </Button>
            </td>
        </tr>
    );
};

const DocumentCard = ({ document }: { document: DocumentItem }) => {
    const Icon = getDocumentIcon(document.type);
    const badge = getDocumentBadge(document.type);

    return (
        <Card className="group border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden bg-white hover:border-indigo-200">
            <CardContent className="p-4">
                <div className="flex items-start gap-3">
                    <div className="shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-xl flex items-center justify-center group-hover:from-indigo-200 group-hover:to-indigo-100 transition-colors">
                        <Icon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <Badge className={cn("mb-2 text-xs font-medium", badge.className)}>
                            {badge.label}
                        </Badge>
                        <h3 className="font-medium text-gray-900 group-hover:text-indigo-700 transition-colors text-sm leading-relaxed line-clamp-2">
                            {document.title}
                        </h3>
                    </div>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100">
                    <Button 
                        onClick={() => window.open(document.link, '_blank')}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-md transition-all text-sm"
                        size="sm"
                    >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Lihat Dokumen
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default function DataDukungSakip({ documents }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

    const filteredDocuments = documents.filter(doc => 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const documentStats = {
        total: documents.length,
        gdrive: documents.filter(d => d.type === 'gdrive').length,
        pdf: documents.filter(d => d.type === 'pdf').length,
        external: documents.filter(d => d.type === 'external').length,
    };

    return (
        <PublicLayout 
            title="Data Dukung SAKIP" 
            description="Data Dukung Sistem Akuntabilitas Kinerja Instansi Pemerintah Balai Bahasa Provinsi Sulawesi Tenggara"
        >
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-[#4f46e5] via-[#4338ca] to-[#3730a3] py-16 lg:py-20 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-indigo-300/20 rounded-full blur-3xl" />
                </div>
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '32px 32px'}}></div>
                </div>
                
                <div className="container relative mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-indigo-200 mb-6 text-sm flex-wrap">
                            <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
                            <ChevronRight className="h-4 w-4" />
                            <span className="text-white">SAKIP</span>
                            <ChevronRight className="h-4 w-4" />
                            <span className="text-white">Data Dukung</span>
                        </div>
                        
                        <div className="flex items-start gap-6">
                            <div className="hidden sm:flex shrink-0 w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl items-center justify-center">
                                <BarChart3 className="w-8 h-8 text-blue-400" />
                            </div>
                            <div>
                                <Badge className="mb-4 bg-blue-400/90 text-gray-900 hover:bg-blue-400 font-medium px-4 py-1.5">
                                    <FileCheck className="w-4 h-4 mr-2" />
                                    SAKIP
                                </Badge>
                                <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl mb-4">
                                    Data Dukung <span className="font-display italic text-blue-400">SAKIP</span>
                                </h1>
                                <p className="text-lg text-indigo-100/90 max-w-2xl leading-relaxed">
                                    Dokumen pendukung Sistem Akuntabilitas Kinerja Instansi Pemerintah
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

            {/* Stats Section */}
            <section className="bg-white py-8 border-b border-gray-100">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl p-4 border border-indigo-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                                        <Folder className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">{documentStats.total}</p>
                                        <p className="text-sm text-gray-600">Total Dokumen</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-4 border border-blue-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">{documentStats.gdrive}</p>
                                        <p className="text-sm text-gray-600">Google Drive</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-red-50 to-white rounded-xl p-4 border border-red-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                                        <FileDown className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">{documentStats.pdf}</p>
                                        <p className="text-sm text-gray-600">PDF</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-amber-50 to-white rounded-xl p-4 border border-amber-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
                                        <ExternalLink className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">{documentStats.external}</p>
                                        <p className="text-sm text-gray-600">Eksternal</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Document Table Section */}
            <section className="bg-gradient-to-b from-white to-gray-50 py-12 lg:py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        {/* Search and Filter */}
                        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input 
                                    type="text"
                                    placeholder="Cari dokumen..."
                                    value={searchQuery}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-10 h-11 border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors"
                                />
                                {searchQuery && (
                                    <button 
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600 hidden sm:inline">Tampilan:</span>
                                <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                                    <button 
                                        onClick={() => setViewMode('table')}
                                        className={cn("px-3 py-2 text-sm font-medium transition-colors", viewMode === 'table' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50')}
                                    >
                                        <Filter className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => setViewMode('grid')}
                                        className={cn("px-3 py-2 text-sm font-medium transition-colors", viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50')}
                                    >
                                        <Folder className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Results Count */}
                        <div className="mb-4 text-sm text-gray-600">
                            Menampilkan <span className="font-semibold text-gray-900">{filteredDocuments.length}</span> dari <span className="font-semibold text-gray-900">{documents.length}</span> dokumen
                        </div>

                        {/* Table View */}
                        {viewMode === 'table' && (
                            <Card className="border-0 shadow-lg overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
                                                <th className="text-left py-4 px-4 lg:px-6 font-semibold text-sm">Nama Dokumen</th>
                                                <th className="hidden sm:table-cell text-left py-4 px-4 font-semibold text-sm">Tipe</th>
                                                <th className="text-right py-4 px-4 lg:px-6 font-semibold text-sm">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-100">
                                            {filteredDocuments.map((doc, index) => (
                                                <DocumentRow key={doc.id} document={doc} index={index} />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                
                                {filteredDocuments.length === 0 && (
                                    <div className="py-16 text-center">
                                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                            <Search className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Dokumen tidak ditemukan</h3>
                                        <p className="text-gray-600 mb-4">Coba ubah kata kunci pencarian Anda</p>
                                        <Button onClick={() => setSearchQuery('')} variant="outline">
                                            Reset Pencarian
                                        </Button>
                                    </div>
                                )}
                            </Card>
                        )}

                        {/* Grid View */}
                        {viewMode === 'grid' && (
                            <>
                                {filteredDocuments.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {filteredDocuments.map((doc) => (
                                            <DocumentCard key={doc.id} document={doc} />
                                        ))}
                                    </div>
                                ) : (
                                    <Card className="border-0 shadow-lg">
                                        <CardContent className="py-16 text-center">
                                            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                                <Search className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Dokumen tidak ditemukan</h3>
                                            <p className="text-gray-600 mb-4">Coba ubah kata kunci pencarian Anda</p>
                                            <Button onClick={() => setSearchQuery('')} variant="outline">
                                                Reset Pencarian
                                            </Button>
                                        </CardContent>
                                    </Card>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Info Section */}
            <section className="bg-gray-50 py-10 border-t border-gray-100">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-white overflow-hidden">
                            <CardContent className="p-6 lg:p-8">
                                <div className="flex items-start gap-4">
                                    <div className="shrink-0 w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
                                        <BarChart3 className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 mb-2">Tentang Data Dukung SAKIP</h2>
                                        <p className="text-gray-600 leading-relaxed">
                                            Data Dukung SAKIP merupakan kumpulan dokumen pendukung dalam implementasi 
                                            Sistem Akuntabilitas Kinerja Instansi Pemerintah di Balai Bahasa Provinsi 
                                            Sulawesi Tenggara. Dokumen-dokumen ini mencakup berbagai aspek perencanaan, 
                                            pengukuran, pelaporan, dan evaluasi kinerja organisasi.
                                        </p>
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
