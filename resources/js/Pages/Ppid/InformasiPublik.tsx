import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { usePpidErrorHandler } from '@/hooks/usePpidErrorHandler';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Input } from '@/Components/ui/input';
import { Search, Download, FileText, FolderOpen, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

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

interface Category {
    [key: string]: Document[];
}

interface InformasiPublikProps {
    categories: Category;
}

const InformasiPublik: React.FC<InformasiPublikProps> = ({ categories }) => {
    // Use the PPID error handler hook to prevent galeri-wrapper related errors
    usePpidErrorHandler();

    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('setiap-saat');

    const filteredCategories = activeTab && categories[activeTab] 
        ? categories[activeTab].filter(doc => 
            doc.title.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : [];

    const categoryInfo = {
        'setiap-saat': {
            title: 'Informasi Setiap Saat',
            description: 'Informasi yang wajib disediakan dan diumumkan secara berkala',
            icon: FileText,
            color: 'bg-blue-100 text-blue-700'
        },
        'serta-merta': {
            title: 'Informasi Serta Merta', 
            description: 'Informasi yang dapat mengancam hajat hidup orang dan ekonomi',
            icon: Eye,
            color: 'bg-orange-100 text-orange-700'
        },
        'berkala': {
            title: 'Informasi Berkala',
            description: 'Informasi yang wajib disediakan dan diumumkan secara berkala',
            icon: FolderOpen,
            color: 'bg-green-100 text-green-700'
        },
        'dikecualikan': {
            title: 'Informasi yang Dikecualikan',
            description: 'Informasi yang tidak dapat diakses sesuai ketentuan peraturan perundang-undangan',
            icon: FileText,
            color: 'bg-red-100 text-red-700'
        }
    };

    const handleDownload = (documentId: number) => {
        window.open(`/ppid/download/${documentId}`, '_blank');
    };

    return (
        <>
            <Head title="Informasi Publik" />
            
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4 lg:px-8">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Informasi Publik
                        </h1>
                        <p className="text-gray-600 max-w-3xl mx-auto">
                            Akses informasi publik Balai Bahasa Provinsi Sulawesi Tenggara sesuai ketentuan Undang-Undang No. 14 Tahun 2008
                        </p>
                    </div>

                    {/* Search */}
                    <Card className="mb-8">
                        <CardContent className="pt-6">
                            <div className="relative max-w-2xl mx-auto">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Cari dokumen atau informasi..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Category Tabs */}
                    <div className="flex flex-wrap gap-2 mb-8 justify-center">
                        {Object.keys(categoryInfo).map((key) => {
                            const info = categoryInfo[key as keyof typeof categoryInfo];
                            const Icon = info.icon;
                            const isActive = activeTab === key;
                            
                            return (
                                <Button
                                    key={key}
                                    variant={isActive ? 'default' : 'outline'}
                                    onClick={() => setActiveTab(key)}
                                    className={cn("flex items-center gap-2", isActive ? info.color : "")}
                                >
                                    <Icon className="h-4 w-4" />
                                    {info.title}
                                    {categories[key] && (
                                        <Badge variant="secondary" className="ml-2">
                                            {categories[key].length}
                                        </Badge>
                                    )}
                                </Button>
                            );
                        })}
                    </div>

                    {/* Category Description */}
                    <Card className="mb-8">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <div className={cn("p-3 rounded-lg", categoryInfo[activeTab as keyof typeof categoryInfo].color)}>
                                    {React.createElement(categoryInfo[activeTab as keyof typeof categoryInfo].icon, { 
                                        className: "h-6 w-6" 
                                    })}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {categoryInfo[activeTab as keyof typeof categoryInfo].title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {categoryInfo[activeTab as keyof typeof categoryInfo].description}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Document List */}
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Daftar Dokumen {categoryInfo[activeTab as keyof typeof categoryInfo].title}
                            </CardTitle>
                            <CardDescription>
                                {filteredCategories.length} dokumen ditemukan
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {filteredCategories.length > 0 ? (
                                <div className="space-y-4">
                                    {filteredCategories.map((document) => (
                                        <div key={document.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                            <div className="flex-1">
                                                <h4 className="text-base font-medium text-gray-900 mb-1">
                                                    {document.title}
                                                </h4>
                                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                                    <span>{document.file_type.toUpperCase()}</span>
                                                    <span>{(document.file_size / 1024).toFixed(1)} KB</span>
                                                    <span>{document.download_count} kali diunduh</span>
                                                </div>
                                            </div>
                                            <Button
                                                onClick={() => handleDownload(document.id)}
                                                size="sm"
                                                className="flex items-center gap-2"
                                            >
                                                <Download className="h-4 w-4" />
                                                Unduh
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500 mb-4">
                                        {searchQuery 
                                            ? `Tidak ada dokumen yang cocok dengan "${searchQuery}"`
                                            : 'Belum ada dokumen tersedia'
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
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="hover:shadow-md transition-shadow">
                            <Link href="/ppid/permohonan" className="block p-4">
                                <CardContent className="p-0">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <FileText className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900">Permohonan Informasi</h4>
                                            <p className="text-sm text-gray-600">Ajukan permohonan informasi publik</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Link>
                        </Card>
                        
                        <Card className="hover:shadow-md transition-shadow">
                            <Link href="/ppid/pengajuan-keberatan" className="block p-4">
                                <CardContent className="p-0">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-orange-100 rounded-lg">
                                            <FileText className="h-5 w-5 text-orange-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900">Pengajuan Keberatan</h4>
                                            <p className="text-sm text-gray-600">Ajukan keberatan atas informasi</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Link>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
};

export default InformasiPublik;
