import React from 'react';
import { Head } from '@inertiajs/react';
import Layout from '@/Layouts/AdminLayout';

export default function Dashboard({ statistics }) {
    const statCards = [
        {
            title: 'Total Berita',
            value: statistics.total_berita,
            icon: '📰',
            color: 'bg-blue-50',
        },
        {
            title: 'Pengumuman Aktif',
            value: statistics.active_pengumuman,
            icon: '📢',
            color: 'bg-green-50',
        },
        {
            title: 'Total Foto',
            value: statistics.total_foto,
            icon: '🖼️',
            color: 'bg-purple-50',
        },
    ];

    return (
        <Layout>
            <Head title="Dashboard Admin" />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                    
                    {/* Statistics Cards */}
                    <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {statCards.map((card, index) => (
                            <div key={index} className={`${card.color} overflow-hidden rounded-lg shadow`}>
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 text-3xl">
                                            {card.icon}
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">
                                                    {card.title}
                                                </dt>
                                                <dd className="text-lg font-medium text-gray-900">
                                                    {card.value}
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-8">
                        <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
                        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                                ➕ Tambah Berita
                            </button>
                            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700">
                                ➕ Tambah Pengumuman
                            </button>
                            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700">
                                📤 Upload Foto
                            </button>
                            <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                ⚙️ Pengaturan
                            </button>
                        </div>
                    </div>

                    {/* Recent Activities */}
                    <div className="mt-8">
                        <h2 className="text-lg font-medium text-gray-900">Aktivitas Terbaru</h2>
                        <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
                            <ul className="divide-y divide-gray-200">
                                <li className="px-6 py-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-900">Tidak ada aktivitas terbaru</p>
                                        <p className="text-sm text-gray-500">-</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
