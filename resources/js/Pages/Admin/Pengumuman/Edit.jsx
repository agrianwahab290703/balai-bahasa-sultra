import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Layout from '@/Layouts/AdminLayout';
import Form from '@/Components/Admin/Pengumuman/Form';

export default function Edit({ pengumuman }) {
    return (
        <Layout>
            <Head title={`Edit Pengumuman: ${pengumuman.judul}`} />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900">Edit Pengumuman</h1>
                        <Link
                            href={route('admin.pengumuman.index')}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            ↩️ Kembali
                        </Link>
                    </div>
                    
                    <div className="bg-white shadow rounded-lg p-6">
                        <Form pengumuman={pengumuman} />
                    </div>
                </div>
            </div>
        </Layout>
    );
}
