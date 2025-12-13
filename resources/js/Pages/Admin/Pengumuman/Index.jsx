import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import Layout from '@/Layouts/AdminLayout';

export default function Index({ pengumuman }) {
    const [selectedItems, setSelectedItems] = useState([]);
    
    const { delete: destroy } = useForm();
    
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedItems(pengumuman.data.map(item => item.id));
        } else {
            setSelectedItems([]);
        }
    };
    
    const handleSelectItem = (id) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(item => item !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    const handleBulkAction = (action) => {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = route('admin.pengumuman.bulk-action');
        
        const actionInput = document.createElement('input');
        actionInput.type = 'hidden';
        actionInput.name = 'action';
        actionInput.value = action;
        form.appendChild(actionInput);
        
        selectedItems.forEach(id => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'pengumuman_ids[]';
            input.value = id;
            form.appendChild(input);
        });
        
        document.body.appendChild(form);
        form.submit();
    };

    return (
        <Layout>
            <Head title="Kelola Pengumuman" />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-900">Pengumuman</h1>
                        <Link
                            href={route('admin.pengumuman.create')}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            ➕ Tambah Pengumuman
                        </Link>
                    </div>
                    
                    {/* Filters */}
                    <div className="mt-6 bg-white shadow rounded-lg p-4">
                        <form className="flex gap-4">
                            <input
                                type="text"
                                placeholder="Cari pengumuman..."
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                defaultValue={new URLSearchParams(window.location.search).get('search')}
                            />
                            <select className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                                <option value="">Semua Status</option>
                                <option value="draft">Draft</option>
                                <option value="active">Active</option>
                                <option value="expired">Expired</option>
                            </select>
                            <select className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                                <option value="">Semua Tipe</option>
                                <option value="umum">Umum</option>
                                <option value="urgent">Urgent</option>
                                <option value="tanggal_spesifik">Tanggal Spesifik</option>
                            </select>
                            <button type="submit" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                                🔍
                            </button>
                        </form>
                    </div>

                    {/* Bulk Actions */}
                    {selectedItems.length > 0 && (
                        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-blue-800">
                                    {selectedItems.length} item terpilih
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleBulkAction('publish')}
                                        className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                                    >
                                        Publish
                                    </button>
                                    <button
                                        onClick={() => handleBulkAction('unpublish')}
                                        className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
                                    >
                                        Unpublish
                                    </button>
                                    <button
                                        onClick={() => handleBulkAction('delete')}
                                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                                    >
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Table */}
                    <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-md">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left">
                                        <input
                                            type="checkbox"
                                            onChange={handleSelectAll}
                                            checked={selectedItems.length === pengumuman.data.length}
                                        />
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Judul
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tipe
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Dibuat
                                    </th>
                                    <th className="relative px-6 py-3">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {pengumuman.data.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.includes(item.id)}
                                                onChange={() => handleSelectItem(item.id)}
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {item.judul}
                                            </div>
                                            {item.tanggal_berlaku && (
                                                <div className="text-sm text-gray-500">
                                                    Berlaku: {new Date(item.tanggal_berlaku).toLocaleDateString('id-ID')}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2 text-xs font-semibold rounded-full ${
                                                item.tipe === 'urgent' ? 'bg-red-100 text-red-800' :
                                                item.tipe === 'tanggal_spesifik' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-green-100 text-green-800'
                                            }`}>
                                                {item.tipe}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2 text-xs font-semibold rounded-full ${
                                                item.status === 'active' ? 'bg-green-100 text-green-800' :
                                                item.status === 'expired' ? 'bg-red-100 text-red-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(item.created_at).toLocaleDateString('id-ID')}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={route('admin.pengumuman.show', item.id)}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    👁️
                                                </Link>
                                                <Link
                                                    href={route('admin.pengumuman.edit', item.id)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    ✏️
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        if (confirm('Hapus pengumuman ini?')) {
                                                            destroy.delete(route('admin.pengumuman.destroy', item.id));
                                                        }
                                                    }}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
