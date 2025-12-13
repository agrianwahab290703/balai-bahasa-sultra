import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { usePpidErrorHandler } from '@/hooks/usePpidErrorHandler';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Search, Download, FileText, AlertTriangle, Calendar } from 'lucide-react';

interface Document {
    id: number;
    title: string;
    file_path: string;
    category: string;
    file_type: string;
    file_size: number;
    download_count: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface SertaMertaProps {
    documents: {
        data: Document[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

const SertaMerta: React.FC<SertaMertaProps> = ({ documents }) => {
    const [searchQuery, setSearchQuery] = useState('');
    
    const handleDownload = (documentId: number) => {
        window.open(`/ppid/download/${documentId}`, '_blank');
    };

    const formatFileSize = (bytes: number) => {
        return (bytes / 1024).toFixed(1) + ' KB';
    };

    return (
        <>
            <Head title="Informasi Serta Merta - PPID" />
            
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                            <Link href="/ppid/profil" className="hover:text-blue-600">
                                PPID
                            </Link>
                            <span>/</span>
                            <Link href="/ppid/informasi-publik" className="hover:text-blue-600">
                                Informasi Publik
                            </Link>
                            <span>/</span>
                            <span className="text-gray-900 font-medium">Informasi Serta Merta</span>
                        </div>
                        
                        <div className="text-center">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Informasi Serta Merta
                            </h1>
                            <div className="flex items-center justify-center gap-3 mb-6">
                                <div className="p-3 bg-orange-100 rounded-lg">
                                    <AlertTriangle className="h-6 w-6 text-orange-600" />
                                </div>
                                <p className="text-gray-600 max-w-2xl">
                                    Informasi yang dapat mengancam hajat hidup orang dan kepentingan umum lainnya
                                </p>
                            </div>
                        </div>

                        {/* Search */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="relative max-w-2xl mx-auto">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Cari dokumen informasi serta merta..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Alert Notice */}
                    <Card className="mb-8 border-orange-200 bg-orange-50">
                        <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">
                                        Informasi Penting
                                    </h3>
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        Informasi serta merta adalah informasi yang harus segera disediakan karena dapat 
                                        mengancam hajat hidup orang atau kepentingan umum. Dokumen dalam kategori ini 
                                        memiliki prioritas tinggi dan perlu akses cepat.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Document List */}
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Daftar Dokumen Informasi Serta Merta
                            </CardTitle>
                            <CardDescription>
                                {documents.total} dokumen tersedia
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {documents.data.length > 0 ? (
                                <div className="space-y-4">
                                    {documents.data.map((document) => (
                                        <div key={document.id} className="flex items-center justify-between p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors border-l-4 border-orange-500">
                                            <div className="flex-1">
                                                <h4 className="text-base font-medium text-gray-900 mb-2">
                                                    {document.title}
                                                </h4>
                                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <FileText className="h-3 w-3" />
                                                        {document.file_type.toUpperCase()}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(document.created_at).toLocaleDateString('id-ID')}
                                                    </span>
                                                    <span>{formatFileSize(document.file_size)}</span>
                                                    <span>{document.download_count} kali diunduh</span>
                                                </div>
                                            </div>
                                            <Button
                                                onClick={() => handleDownload(document.id)}
                                                size="sm"
                                                className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700"
                                            >
                                                <Download className="h-4 w-4" />
                                                Unduh
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <AlertTriangle className="h-12 w-12 text-orange-400 mx-auto mb-4" />
                                    <p className="text-gray-500 mb-4">
                                        {searchQuery 
                                            ? `Tidak ada dokumen yang cocok dengan "${searchQuery}"`
                                            : 'Belum ada dokumen informasi serta merta tersedia'
                                        }
                                    </p>
                                    {searchQuery && (
                                        <Button 
                                            variant="outline" 
                                            onClick={() => setSearchQuery('')}
                                        >
                                            Hapus Pencarian
                                        </Button>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick Links */}
                    <div className="mt-8">
                        <div className="flex items-center gap-2 mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Kategori Informasi Lainnya:
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <Card className="hover:shadow-md transition-shadow">
                                <Link href="/ppid/informasi-publik/setiap-saat" className="block p-4">
                                    <CardContent className="p-0">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                <FileText className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900">Informasi Setiap Saat</h4>
                                                <p className="text-sm text-gray-600">Informasi yang tersedia setiap saat</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Link>
                            </Card>
                            
                            <Card className="hover:shadow-md transition-shadow">
                                <Link href="/ppid/informasi-publik/berkala" className="block p-4">
                                    <CardContent className="p-0">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-green-100 rounded-lg">
                                                <FileText className="h-5 w-5 text-green-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900">Informasi Berkala</h4>
                                                <p className="text-sm text-gray-600">Informasi berkala reguler</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Link>
                            </Card>
                            
                            <Card className="hover:shadow-md transition-shadow">
                                <Link href="/ppid/informasi-publik/dikecualikan" className="block p-4">
                                    <CardContent className="p-0">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-red-100 rounded-lg">
                                                <FileText className="h-5 w-5 text-red-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900">Informasi Dikecualikan</h4>
                                                <p className="text-sm text-gray-600">Informasi yang dikecualikan</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Link>
                            </Card>
                        </div>
                    </div>

                    {/* Back to All Categories */}
                    <div className="mt-8 text-center">
                        <Link href="/ppid/informasi-publik">
                            <Button variant="outline" className="flex items-center gap-2">
                                <span>Lihat Semua Kategori Informasi Publik</span>
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SertaMerta;
