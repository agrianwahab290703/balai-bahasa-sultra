import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Layout from '@/Layouts/AdminLayout';
import { CalendarClock, Clock, Image as ImageIcon } from 'lucide-react';

export default function Show({ pengumuman }) {
    const formatDate = (value) => {
        if (!value) return '-';
        const d = new Date(value);
        if (isNaN(d.getTime())) return value;
        return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const getImageUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        if (url.startsWith('/')) return url;
        if (url.startsWith('storage/')) return `/${url}`;
        return `/${url}`;
    };

    return (
        <Layout>
            <Head title={`Pengumuman: ${pengumuman.judul}`} />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900">{pengumuman.judul}</h1>
                        <Link
                            href={route('admin.pengumuman.index')}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            ↩️ Kembali
                        </Link>
                    </div>
                    
                    <div className="bg-white shadow rounded-lg p-6">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Judul</h3>
                                <p className="mt-1 text-gray-600">{pengumuman.judul}</p>
                            </div>
                            
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">Tipe</h3>
                                    <p className="mt-1 text-gray-600">{pengumuman.tipe}</p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">Status</h3>
                                    <p className="mt-1 text-gray-600">{pengumuman.status}</p>
                                </div>
                            </div>
                            
                            <div className="grid gap-4 sm:grid-cols-2">
                                {pengumuman.tanggal_berlaku && (
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                                            <CalendarClock className="w-4 h-4 text-blue-600" />
                                            Tanggal Berlaku
                                        </h3>
                                        <p className="mt-1 text-gray-600">
                                            {formatDate(pengumuman.tanggal_berlaku)}
                                        </p>
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-blue-600" />
                                        Dibuat
                                    </h3>
                                    <p className="mt-1 text-gray-600">{formatDate(pengumuman.created_at)}</p>
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Konten</h3>
                                <div
                                    className="mt-1 article-content text-gray-800"
                                    dangerouslySetInnerHTML={{ __html: pengumuman.konten }}
                                />
                            </div>

                            {pengumuman.gallery_images && pengumuman.gallery_images.length > 0 && (
                                <div className="space-y-3">
                                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                                        <ImageIcon className="w-4 h-4 text-blue-600" />
                                        Foto Pengumuman
                                    </h3>
                                    <div
                                        className={`grid gap-3 ${
                                            pengumuman.gallery_images.length === 1
                                                ? 'grid-cols-1'
                                                : pengumuman.gallery_images.length === 2
                                                ? 'grid-cols-2'
                                                : 'grid-cols-2 sm:grid-cols-3'
                                        }`}
                                    >
                                        {pengumuman.gallery_images.slice(0, 6).map((url, idx) => (
                                            <div key={idx} className="relative overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                                                <img
                                                    src={getImageUrl(url)}
                                                    alt={`Foto ${idx + 1}`}
                                                    className="w-full h-40 sm:h-48 object-cover"
                                                    loading="lazy"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <div className="mt-6 flex gap-2">
                            <Link
                                href={route('admin.pengumuman.edit', pengumuman.id)}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                            >
                                ✏️ Edit
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
