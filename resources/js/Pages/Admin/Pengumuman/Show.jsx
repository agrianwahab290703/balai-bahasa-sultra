import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Layout from '@/Layouts/AdminLayout';

export default function Show({ pengumuman }) {
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
                            
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Tipe</h3>
                                <p className="mt-1 text-gray-600">{pengumuman.tipe}</p>
                            </div>
                            
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Status</h3>
                                <p className="mt-1 text-gray-600">{pengumuman.status}</p>
                            </div>
                            
                            {pengumuman.tanggal_berlaku && (
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">Tanggal Berlaku</h3>
                                    <p className="mt-1 text-gray-600">
                                        {new Date(pengumuman.tanggal_berlaku).toLocaleDateString('id-ID')}
                                    </p>
                                </div>
                            )}
                            
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Konten</h3>
                                <div className="mt-1 prose prose-sm text-gray-600">
                                    {pengumuman.konten.split('\n').map((paragraph, index) => (
                                        <p key={index}>{paragraph}</p>
                                    ))}
                                </div>
                            </div>
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
