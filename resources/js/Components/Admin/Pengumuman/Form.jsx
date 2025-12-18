import React from 'react';
import { useForm } from '@inertiajs/react';
import { Bell, CalendarClock, Sparkles, AlertTriangle, Hash, Type, Wand2, Activity, Image } from 'lucide-react';
import SupportingImagesUploader from '@/Components/Admin/SupportingImagesUploader';

export default function Form({ pengumuman = null }) {
    const { data, setData, post, put, processing, errors } = useForm({
        judul: pengumuman?.judul || '',
        konten: pengumuman?.konten || '',
        tipe: pengumuman?.tipe || 'umum',
        tanggal_berlaku: pengumuman?.tanggal_berlaku || '',
        status: pengumuman?.status || 'draft',
        prioritas: pengumuman?.prioritas || 0,
        meta_description: pengumuman?.meta_description || '',
        gallery_images: pengumuman?.gallery_images || [],
    });

    const submit = (e) => {
        e.preventDefault();
        if (pengumuman) {
            put(route('admin.pengumuman.update', pengumuman.id));
        } else {
            post(route('admin.pengumuman.store'));
        }
    };

    const tipeOptions = [
        { value: 'umum', label: 'Umum', color: 'bg-blue-50 text-blue-700 border border-blue-100' },
        { value: 'urgent', label: 'Urgent', color: 'bg-red-50 text-red-700 border border-red-100' },
        { value: 'tanggal_spesifik', label: 'Tanggal Spesifik', color: 'bg-amber-50 text-amber-700 border border-amber-100' },
    ];

    const statusOptions = [
        { value: 'draft', label: 'Draft', color: 'bg-gray-100 text-gray-700 border border-gray-200' },
        { value: 'active', label: 'Publish', color: 'bg-emerald-50 text-emerald-700 border border-emerald-100' },
        ...(pengumuman ? [{ value: 'expired', label: 'Expired', color: 'bg-orange-50 text-orange-700 border border-orange-100' }] : []),
    ];

    return (
        <form onSubmit={submit} className="space-y-6">
            {/* Hero Banner */}
            <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-indigo-50 p-6">
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-100 blur-3xl opacity-60" />
                <div className="flex flex-col gap-2 relative">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-100 w-fit shadow-sm">
                        <Sparkles className="w-4 h-4" />
                        Form Pengumuman
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Bell className="w-5 h-5 text-blue-600" />
                        {pengumuman ? 'Perbarui Pengumuman' : 'Buat Pengumuman Baru'}
                    </h2>
                    <p className="text-sm text-gray-600">
                        Sampaikan informasi penting dengan cepat. Pilih tipe, atur jadwal, dan publikasikan dengan tampilan yang rapi.
                    </p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left: main fields */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 space-y-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                            <Type className="w-4 h-4 text-blue-600" />
                            Detail Utama
                        </div>

                        <div>
                            <label htmlFor="judul" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Judul Pengumuman
                            </label>
                            <input
                                id="judul"
                                type="text"
                                value={data.judul}
                                onChange={(e) => setData('judul', e.target.value)}
                                className="block w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-blue-500 focus:ring focus:ring-blue-100"
                                placeholder="Contoh: Pengumuman libur nasional..."
                            />
                            {errors.judul && <p className="mt-2 text-sm text-red-600">{errors.judul}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tipe Pengumuman</label>
                            <div className="flex flex-wrap gap-2">
                                {tipeOptions.map((opt) => (
                                    <button
                                        type="button"
                                        key={opt.value}
                                        onClick={() => setData('tipe', opt.value)}
                                        className={`px-3 py-2 rounded-lg text-sm font-semibold transition shadow-sm hover:shadow ${opt.color} ${
                                            data.tipe === opt.value ? 'ring-2 ring-offset-2 ring-blue-200' : ''
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                            {errors.tipe && <p className="mt-2 text-sm text-red-600">{errors.tipe}</p>}
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="konten" className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Konten
                                </label>
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <Wand2 className="w-4 h-4" />
                                    Gunakan enter untuk paragraf, boleh sisipkan link.
                                </span>
                            </div>
                            <textarea
                                id="konten"
                                rows={10}
                                value={data.konten}
                                onChange={(e) => setData('konten', e.target.value)}
                                className="block w-full rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm focus:border-blue-500 focus:ring focus:ring-blue-100"
                                placeholder="Tulis isi pengumuman..."
                            />
                            {errors.konten && <p className="mt-2 text-sm text-red-600">{errors.konten}</p>}
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Image className="w-4 h-4 text-blue-600" />
                                    Foto Pendukung (1-6)
                                </label>
                                <span className="text-xs text-gray-500">Sumber: Media Library</span>
                            </div>
                            <SupportingImagesUploader
                                value={data.gallery_images}
                                onChange={(next) => setData('gallery_images', next)}
                            />
                            {errors.gallery_images && <p className="mt-2 text-sm text-red-600">{errors.gallery_images}</p>}
                        </div>
                    </div>
                </div>

                {/* Right: meta */}
                <div className="space-y-6">
                    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 space-y-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                            <Activity className="w-4 h-4 text-emerald-600" />
                            Status & Jadwal
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                            <div className="flex flex-wrap gap-2">
                                {statusOptions.map((opt) => (
                                    <button
                                        type="button"
                                        key={opt.value}
                                        onClick={() => setData('status', opt.value)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${opt.color} ${
                                            data.status === opt.value ? 'ring-2 ring-offset-2 ring-emerald-200' : ''
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                            {errors.status && <p className="mt-2 text-sm text-red-600">{errors.status}</p>}
                        </div>

                        <div>
                            <label htmlFor="tanggal_berlaku" className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1">
                                <CalendarClock className="w-4 h-4 text-blue-600" />
                                Tanggal Berlaku (opsional)
                            </label>
                            <input
                                id="tanggal_berlaku"
                                type="date"
                                value={data.tanggal_berlaku}
                                onChange={(e) => setData('tanggal_berlaku', e.target.value)}
                                className="block w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-blue-500 focus:ring focus:ring-blue-100"
                            />
                            {errors.tanggal_berlaku && <p className="mt-2 text-sm text-red-600">{errors.tanggal_berlaku}</p>}
                        </div>

                        <div>
                            <label htmlFor="prioritas" className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1">
                                <Hash className="w-4 h-4 text-purple-600" />
                                Prioritas (0-10)
                            </label>
                            <div className="flex items-center gap-3">
                                <input
                                    id="prioritas"
                                    type="range"
                                    min="0"
                                    max="10"
                                    value={data.prioritas}
                                    onChange={(e) => setData('prioritas', e.target.value)}
                                    className="flex-1 accent-purple-500"
                                />
                                <input
                                    type="number"
                                    min="0"
                                    max="10"
                                    value={data.prioritas}
                                    onChange={(e) => setData('prioritas', e.target.value)}
                                    className="w-16 rounded-lg border border-gray-200 px-2 py-1.5 text-sm text-center focus:border-purple-500 focus:ring focus:ring-purple-100"
                                />
                            </div>
                            {errors.prioritas && <p className="mt-2 text-sm text-red-600">{errors.prioritas}</p>}
                        </div>

                        <div>
                            <label htmlFor="meta_description" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Meta Description (opsional)
                            </label>
                            <textarea
                                id="meta_description"
                                rows={3}
                                value={data.meta_description}
                                onChange={(e) => setData('meta_description', e.target.value)}
                                className="block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-100"
                                placeholder="Ringkasan singkat untuk SEO"
                            />
                            {errors.meta_description && <p className="mt-2 text-sm text-red-600">{errors.meta_description}</p>}
                        </div>
                    </div>

                    {/* Alert for urgent */}
                    {data.tipe === 'urgent' && (
                        <div className="rounded-2xl border border-red-100 bg-red-50/70 p-4 text-sm text-red-800 shadow-sm flex gap-3">
                            <AlertTriangle className="w-5 h-5 mt-0.5 text-red-600" />
                            <div>
                                <p className="font-semibold">Pengumuman Urgent</p>
                                <p className="text-red-700">Pastikan judul jelas dan waktu berlaku diisi dengan benar.</p>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:shadow-xl disabled:opacity-60"
                        >
                            {processing ? 'Menyimpan...' : pengumuman ? 'Simpan Perubahan' : 'Publish Pengumuman'}
                        </button>
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            Batal
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}
