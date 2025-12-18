import React, { useMemo, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { PublicLayout } from '@/Layouts/PublicLayout';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { AlertTriangle, Bell, CalendarClock, Clock, Search } from 'lucide-react';

type PengumumanItem = {
    id: number;
    judul: string;
    slug: string;
    konten: string;
    tipe: 'umum' | 'urgent' | 'tanggal_spesifik';
    tanggal_berlaku: string | null;
    status: string;
    prioritas: number | null;
    created_at: string;
};

type Pagination = {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
};

type Props = {
    pengumuman: {
        data: PengumumanItem[];
        meta?: Pagination;
        links?: Pagination['links'];
        current_page?: number;
        last_page?: number;
        total?: number;
        per_page?: number;
    };
    filters: {
        q?: string;
        tipe?: string | null;
    };
};

const tipeLabel: Record<PengumumanItem['tipe'], { label: string; className: string }> = {
    umum: { label: 'Umum', className: 'bg-blue-50 text-blue-600 border-blue-100' },
    urgent: { label: 'Urgent', className: 'bg-red-50 text-red-600 border-red-100' },
    tanggal_spesifik: { label: 'Tanggal Spesifik', className: 'bg-amber-50 text-amber-700 border-amber-100' },
};

const formatDateTimeSafe = (value?: string | null) => {
    if (!value) return '-';
    const date = new Date(value);
    if (isNaN(date.getTime())) return value;
    return date.toLocaleString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const plainExcerpt = (html: string, limit = 170) => {
    const text = html
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/(p|div|li|h[1-6])>/gi, '$&\n')
        .replace(/<[^>]+>/g, '')
        .replace(/\s+\n/g, '\n')
        .replace(/\n+/g, ' ')
        .trim();
    if (text.length <= limit) return text;
    return text.slice(0, limit).trim() + '…';
};

export default function PengumumanIndex({ pengumuman, filters }: Props) {
    const [query, setQuery] = useState(filters.q ?? '');
    const [tipe, setTipe] = useState<string>(filters.tipe ?? '');

    const items = pengumuman.data ?? [];

    const handleFilter = () => {
        router.get(
            route('pengumuman.index'),
            { q: query || undefined, tipe: tipe || undefined },
            { preserveScroll: true, preserveState: true }
        );
    };

    const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleFilter();
        }
    };

    const hero = items[0];
    const rest = items.slice(1);

    const totalText = useMemo(() => {
        const total = pengumuman.total ?? pengumuman.meta?.total ?? items.length;
        return `${total} pengumuman`;
    }, [pengumuman, items.length]);

    return (
        <PublicLayout>
            <Head title="Pengumuman" />

            <section className="bg-gradient-to-b from-blue-50 via-white to-white border-b border-blue-100/60">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
                    <div className="flex flex-col gap-6 sm:gap-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-blue-500 font-semibold">
                                    Informasi Resmi
                                </p>
                                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">Pengumuman</h1>
                                <p className="text-gray-600 mt-2">{totalText}</p>
                            </div>
                            <div className="flex gap-3 w-full sm:w-auto">
                                <div className="flex-1 sm:flex-none sm:w-64">
                                    <label className="text-xs text-gray-500">Jenis</label>
                                    <select
                                        value={tipe}
                                        onChange={(e) => setTipe(e.target.value)}
                                        className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-400 focus:ring focus:ring-blue-100"
                                    >
                                        <option value="">Semua jenis</option>
                                        <option value="umum">Umum</option>
                                        <option value="urgent">Urgent</option>
                                        <option value="tanggal_spesifik">Tanggal Spesifik</option>
                                    </select>
                                </div>
                                <div className="flex-1 sm:w-72">
                                    <label className="text-xs text-gray-500">Cari</label>
                                    <div className="mt-1 flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3">
                                        <Search className="w-4 h-4 text-gray-400" />
                                        <input
                                            type="search"
                                            placeholder="Cari judul atau isi..."
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            onKeyDown={handleEnter}
                                            className="w-full py-2 text-sm focus:outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="sm:self-end">
                                    <Button className="mt-6 sm:mt-0" onClick={handleFilter}>
                                        Terapkan
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {hero ? (
                            <Link href={route('pengumuman.show', hero.slug)} className="group">
                                <Card className="overflow-hidden border-blue-100 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
                                    <CardContent className="p-6 sm:p-8 flex flex-col gap-4">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <Badge
                                                className={`border ${tipeLabel[hero.tipe].className} px-3 py-1 text-xs font-semibold`}
                                            >
                                                {tipeLabel[hero.tipe].label}
                                            </Badge>
                                            <span className="flex items-center gap-2 text-sm text-gray-500">
                                                <CalendarClock className="w-4 h-4 text-blue-500" />
                                                {formatDateTimeSafe(hero.tanggal_berlaku ?? hero.created_at)}
                                            </span>
                                        </div>
                                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors leading-snug">
                                            {hero.judul}
                                        </h2>
                                        <p className="text-gray-600 text-base leading-relaxed">{plainExcerpt(hero.konten, 220)}</p>
                                        <div className="flex items-center gap-3 text-sm text-blue-600 font-semibold">
                                            <span className="inline-flex items-center gap-2">
                                                <Bell className="w-4 h-4" />
                                                Baca selengkapnya
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ) : (
                            <div className="rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center text-gray-500">
                                Belum ada pengumuman aktif.
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {rest.length > 0 && (
                <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {rest.map((item) => (
                            <Link key={item.id} href={route('pengumuman.show', item.slug)} className="group">
                                <Card className="h-full border-gray-100 hover:border-blue-100 shadow-sm hover:shadow-md transition-all duration-300">
                                    <CardContent className="p-5 flex flex-col h-full gap-3">
                                        <div className="flex items-center gap-3">
                                            <Badge className={`border ${tipeLabel[item.tipe].className} px-3 py-1 text-xs font-semibold`}>
                                                {tipeLabel[item.tipe].label}
                                            </Badge>
                                            <span className="flex items-center gap-2 text-xs text-gray-500">
                                                <Clock className="w-4 h-4 text-blue-500" />
                                                {formatDateTimeSafe(item.tanggal_berlaku ?? item.created_at)}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-blue-700 transition-colors">
                                            {item.judul}
                                        </h3>
                                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 flex-1">
                                            {plainExcerpt(item.konten, 160)}
                                        </p>
                                        <div className="flex items-center gap-2 text-sm text-blue-600 font-semibold">
                                            <span>Selengkapnya</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {items.length === 0 && (
                <section className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
                    <div className="rounded-xl border border-dashed border-gray-200 bg-white p-10 text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-orange-500">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <p className="text-lg font-semibold text-gray-900">Belum ada pengumuman</p>
                        <p className="text-gray-600 mt-2">Coba cek kembali nanti.</p>
                    </div>
                </section>
            )}
        </PublicLayout>
    );
}

