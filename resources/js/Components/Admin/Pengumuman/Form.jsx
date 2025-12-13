import React, { useEffect } from 'react';
import { useForm, usePage } from '@inertiajs/react';

export default function Form({ pengumuman = null }) {
    const { props } = usePage();
    
    const { data, setData, post, put, processing, errors } = useForm({
        judul: pengumuman?.judul || '',
        konten: pengumuman?.konten || '',
        tipe: pengumuman?.tipe || 'umum',
        tanggal_berlaku: pengumuman?.tanggal_berlaku || '',
        status: pengumuman?.status || 'draft',
        prioritas: pengumuman?.prioritas || 0,
        meta_description: pengumuman?.meta_description || '',
    });

    const submit = (e) => {
        e.preventDefault();
        
        if (pengumuman) {
            put(route('admin.pengumuman.update', pengumuman.id));
        } else {
            post(route('admin.pengumuman.store'));
        }
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div>
                <label htmlFor="judul" className="block text-sm font-medium text-gray-700">
                    Judul
                </label>
                <input
                    id="judul"
                    type="text"
                    value={data.judul}
                    onChange={(e) => setData('judul', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.judul && (
                    <p className="mt-2 text-sm text-red-600">{errors.judul}</p>
                )}
            </div>

            <div>
                <label htmlFor="tipe" className="block text-sm font-medium text-gray-700">
                    Tipe
                </label>
                <select
                    id="tipe"
                    value={data.tipe}
                    onChange={(e) => setData('tipe', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                    <option value="umum">Umum</option>
                    <option value="urgent">Urgent</option>
                    <option value="tanggal_spesifik">Tanggal Spesifik</option>
                </select>
                {errors.tipe && (
                    <p className="mt-2 text-sm text-red-600">{errors.tipe}</p>
                )}
            </div>

            <div>
                <label htmlFor="konten" className="block text-sm font-medium text-gray-700">
                    Konten
                </label>
                <textarea
                    id="konten"
                    rows={8}
                    value={data.konten}
                    onChange={(e) => setData('konten', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.konten && (
                    <p className="mt-2 text-sm text-red-600">{errors.konten}</p>
                )}
            </div>

            <div>
                <label htmlFor="tanggal_berlaku" className="block text-sm font-medium text-gray-700">
                    Tanggal Berlaku (opsional)
                </label>
                <input
                    id="tanggal_berlaku"
                    type="date"
                    value={data.tanggal_berlaku}
                    onChange={(e) => setData('tanggal_berlaku', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.tanggal_berlaku && (
                    <p className="mt-2 text-sm text-red-600">{errors.tanggal_berlaku}</p>
                )}
            </div>

            <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                </label>
                <select
                    id="status"
                    value={data.status}
                    onChange={(e) => setData('status', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    {pengumuman && <option value="expired">Expired</option>}
                </select>
                {errors.status && (
                    <p className="mt-2 text-sm text-red-600">{errors.status}</p>
                )}
            </div>

            <div>
                <label htmlFor="prioritas" className="block text-sm font-medium text-gray-700">
                    Prioritas (0-10)
                </label>
                <input
                    id="prioritas"
                    type="number"
                    min="0"
                    max="10"
                    value={data.prioritas}
                    onChange={(e) => setData('prioritas', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.prioritas && (
                    <p className="mt-2 text-sm text-red-600">{errors.prioritas}</p>
                )}
            </div>

            <div>
                <label htmlFor="meta_description" className="block text-sm font-medium text-gray-700">
                    Meta Description (opsional)
                </label>
                <input
                    id="meta_description"
                    type="text"
                    value={data.meta_description}
                    onChange={(e) => setData('meta_description', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.meta_description && (
                    <p className="mt-2 text-sm text-red-600">{errors.meta_description}</p>
                )}
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    {processing ? 'Menyimpan...' : (pengumuman ? 'Update' : 'Simpan')}
                </button>
            </div>
        </form>
    );
}
