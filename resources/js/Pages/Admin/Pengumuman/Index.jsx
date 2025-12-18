import React, { useMemo, useState, useEffect } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import Layout from '@/Layouts/AdminLayout';
import {
    Search,
    Filter,
    Bell,
    Plus,
    AlertTriangle,
    CheckCircle2,
    Clock,
    Eye,
    Pencil,
    Trash2,
    CalendarClock,
    Calendar,
    TrendingUp,
    Grid,
    List,
    MoreVertical,
    ChevronDown,
    Zap,
    FileText,
    Star,
    Archive,
    Download,
    Upload,
    RefreshCw,
    X,
    Check,
    Users,
    BarChart3,
    Target,
    Activity,
    Settings,
    Heart
} from 'lucide-react';

export default function Index({ pengumuman }) {
    const [selectedItems, setSelectedItems] = useState([]);
    const [viewMode, setViewMode] = useState('grid'); // grid or list
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [tipeFilter, setTipeFilter] = useState('');
    const [sortBy, setSortBy] = useState('created_at');
    const [sortOrder, setSortOrder] = useState('desc');
    const [showBulkActions, setShowBulkActions] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    const { delete: destroy, processing } = useForm();

    // Sync with URL params
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        setSearchQuery(urlParams.get('search') || '');
        setStatusFilter(urlParams.get('status') || '');
        setTipeFilter(urlParams.get('tipe') || '');
    }, []);

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
        if (!selectedItems || selectedItems.length === 0) {
            alert('Silakan pilih pengumuman terlebih dahulu');
            return;
        }

        const confirmMessages = {
            publish: `Apakah Anda yakin ingin mempublikasikan ${selectedItems.length} pengumuman yang dipilih?`,
            draft: `Apakah Anda yakin ingin menjadikan draft ${selectedItems.length} pengumuman yang dipilih?`,
            delete: `Apakah Anda yakin ingin menghapus ${selectedItems.length} pengumuman yang dipilih? Tindakan ini tidak dapat dibatalkan.`
        };

        if (confirm(confirmMessages[action] || `Apakah Anda yakin ingin ${action} ${selectedItems.length} pengumuman?`)) {
            router.post(route('admin.pengumuman.bulk-action'), {
                action,
                pengumuman_ids: selectedItems
            }, {
                onSuccess: () => {
                    setSelectedItems([]);
                },
                onError: (errors) => {
                    console.error('Bulk action error:', errors);
                    if (errors.message) {
                        alert('Error: ' + errors.message);
                    }
                }
            });
        }
    };

    const applyFilters = () => {
        const params = new URLSearchParams();
        if (searchQuery) params.set('search', searchQuery);
        if (statusFilter) params.set('status', statusFilter);
        if (tipeFilter) params.set('tipe', tipeFilter);
        params.set('sort', sortBy);
        params.set('order', sortOrder);

        router.get(route('admin.pengumuman.index') + '?' + params.toString(), {}, {
            preserveState: true
        });
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus pengumuman ini?')) {
            destroy.delete(route('admin.pengumuman.destroy', id));
        }
    };

    const total = pengumuman?.total ?? pengumuman?.meta?.total ?? pengumuman?.data?.length ?? 0;
    const activeCount = useMemo(() => pengumuman.data.filter((p) => p.status === 'active').length, [pengumuman.data]);
    const draftCount = useMemo(() => pengumuman.data.filter((p) => p.status === 'draft').length, [pengumuman.data]);
    const urgentCount = useMemo(() => pengumuman.data.filter((p) => p.tipe === 'urgent').length, [pengumuman.data]);

    // Filter and sort data
    const filteredData = useMemo(() => {
        let filtered = [...pengumuman.data];

        if (searchQuery) {
            filtered = filtered.filter(item =>
                item.judul?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.konten?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (statusFilter) {
            filtered = filtered.filter(item => item.status === statusFilter);
        }

        if (tipeFilter) {
            filtered = filtered.filter(item => item.tipe === tipeFilter);
        }

        // Sort
        filtered.sort((a, b) => {
            let aVal = a[sortBy];
            let bVal = b[sortBy];

            if (sortBy === 'created_at' || sortBy === 'tanggal_berlaku') {
                aVal = new Date(aVal || 0);
                bVal = new Date(bVal || 0);
            }

            if (sortOrder === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });

        return filtered;
    }, [pengumuman.data, searchQuery, statusFilter, tipeFilter, sortBy, sortOrder]);

    useEffect(() => {
        setShowBulkActions(selectedItems.length > 0);
    }, [selectedItems]);

    const formatDate = (value) => {
        if (!value) return '-';
        const d = new Date(value);
        if (isNaN(d.getTime())) return value;
        return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const formatTime = (value) => {
        if (!value) return '-';
        const d = new Date(value);
        if (isNaN(d.getTime())) return value;
        return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    };

    const getStatusConfig = (status) => {
        const configs = {
            active: {
                icon: CheckCircle2,
                color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
                label: 'Aktif',
                bgLight: 'bg-emerald-50'
            },
            draft: {
                icon: FileText,
                color: 'bg-gray-100 text-gray-700 border-gray-200',
                label: 'Draft',
                bgLight: 'bg-gray-50'
            },
            expired: {
                icon: Clock,
                color: 'bg-red-100 text-red-700 border-red-200',
                label: 'Kadaluarsa',
                bgLight: 'bg-red-50'
            }
        };
        return configs[status] || configs.draft;
    };

    const getTipeConfig = (tipe) => {
        const configs = {
            urgent: {
                icon: Zap,
                gradient: 'from-red-500 to-orange-500',
                label: 'Urgent',
                bgLight: 'bg-red-50'
            },
            umum: {
                icon: FileText,
                gradient: 'from-blue-500 to-blue-600',
                label: 'Umum',
                bgLight: 'bg-blue-50'
            },
            tanggal_spesifik: {
                icon: Calendar,
                gradient: 'from-amber-500 to-yellow-500',
                label: 'Acara Spesial',
                bgLight: 'bg-amber-50'
            }
        };
        return configs[tipe] || configs.umum;
    };

    const PengumumanCard = ({ item, isSelected }) => {
        const statusConfig = getStatusConfig(item.status);
        const tipeConfig = getTipeConfig(item.tipe);
        const StatusIcon = statusConfig.icon;
        const TipeIcon = tipeConfig.icon;

        return (
            <div className={`group relative bg-white rounded-2xl border-2 transition-all duration-200 hover:shadow-lg hover:border-blue-200 ${
                isSelected ? 'border-blue-500 bg-blue-50/30' : 'border-gray-100'
            }`}>
                {/* Selection Checkbox */}
                <div className="absolute top-4 left-4 z-10">
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectItem(item.id)}
                        className="w-5 h-5 rounded border-2 border-gray-300 bg-white text-blue-600 focus:ring-blue-500 focus:ring-2"
                    />
                </div>

                {/* Type Badge */}
                <div className="absolute top-4 right-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${tipeConfig.gradient} shadow-sm`}>
                        <TipeIcon className="w-3.5 h-3.5" />
                        {tipeConfig.label}
                    </span>
                </div>

                {/* Content */}
                <div className="p-6 pt-16">
                    <div className="mb-4">
                        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2 pr-20">
                            {item.judul}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-3">
                            {item.konten?.replace(/<[^>]*>/g, '').substring(0, 150)}...
                        </p>
                    </div>

                    {/* Meta Info */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 text-gray-500">
                                <CalendarClock className="w-4 h-4" />
                                <span>{formatDate(item.created_at)}</span>
                            </div>
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                                <StatusIcon className="w-3.5 h-3.5" />
                                {statusConfig.label}
                            </span>
                        </div>

                        {item.tanggal_berlaku && (
                            <div className="flex items-center gap-2 text-sm text-blue-600">
                                <Calendar className="w-4 h-4" />
                                <span>Berlaku: {formatDate(item.tanggal_berlaku)} {formatTime(item.tanggal_berlaku)}</span>
                            </div>
                        )}

                        {/* Priority Indicator */}
                        {item.prioritas > 5 && (
                            <div className="flex items-center gap-2 text-sm">
                                <Star className="w-4 h-4 text-amber-500" />
                                <span className="font-medium text-amber-700">Prioritas Tinggi ({item.prioritas})</span>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                            <Link
                                href={route('admin.pengumuman.show', item.id)}
                                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                            >
                                <Eye className="w-4 h-4" />
                                Lihat
                            </Link>
                            <Link
                                href={route('admin.pengumuman.edit', item.id)}
                                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors"
                            >
                                <Pencil className="w-4 h-4" />
                                Edit
                            </Link>
                            <button
                                type="button"
                                onClick={() => handleDelete(item.id)}
                                disabled={processing}
                                className="inline-flex items-center justify-center p-2 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-50"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
        );
    };

    const PengumumanListItem = ({ item, isSelected }) => {
        const statusConfig = getStatusConfig(item.status);
        const tipeConfig = getTipeConfig(item.tipe);
        const StatusIcon = statusConfig.icon;
        const TipeIcon = tipeConfig.icon;

        return (
            <div className={`group bg-white rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
                isSelected ? 'border-blue-500 bg-blue-50/30' : 'border-gray-100'
            }`}>
                <div className="p-4">
                    <div className="flex items-start gap-4">
                        {/* Checkbox */}
                        <div className="pt-1">
                            <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleSelectItem(item.id)}
                                className="w-5 h-5 rounded border-2 border-gray-300 bg-white text-blue-600 focus:ring-blue-500 focus:ring-2"
                            />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-2">
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-base font-semibold text-gray-900 truncate">
                                        {item.judul}
                                    </h3>
                                    <p className="text-sm text-gray-600 line-clamp-1 mt-1">
                                        {item.konten?.replace(/<[^>]*>/g, '').substring(0, 100)}...
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${tipeConfig.gradient}`}>
                                        <TipeIcon className="w-3 h-3" />
                                        {tipeConfig.label}
                                    </span>
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                                        <StatusIcon className="w-3 h-3" />
                                        {statusConfig.label}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <CalendarClock className="w-4 h-4" />
                                        {formatDate(item.created_at)}
                                    </span>
                                    {item.prioritas > 5 && (
                                        <span className="flex items-center gap-1 text-amber-600">
                                            <Star className="w-4 h-4" />
                                            {item.prioritas}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Link
                                        href={route('admin.pengumuman.show', item.id)}
                                        className="p-2 rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </Link>
                                    <Link
                                        href={route('admin.pengumuman.edit', item.id)}
                                        className="p-2 rounded-lg text-amber-600 bg-amber-50 hover:bg-amber-100 transition-colors"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(item.id)}
                                        disabled={processing}
                                        className="p-2 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-50"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Layout>
            <Head title="Kelola Pengumuman" />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
                {/* Header Stats Bar */}
                <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white">
                                        <Bell className="w-6 h-6" />
                                    </div>
                                    Pengumuman
                                </h1>
                                <div className="hidden sm:flex items-center gap-4">
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-200">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                        <span className="text-sm font-medium text-emerald-700">{activeCount} Aktif</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg border border-gray-200">
                                        <FileText className="w-4 h-4 text-gray-600" />
                                        <span className="text-sm font-medium text-gray-700">{draftCount} Draft</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 rounded-lg border border-red-200">
                                        <Zap className="w-4 h-4 text-red-600" />
                                        <span className="text-sm font-medium text-red-700">{urgentCount} Urgent</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Link
                                    href={route('admin.pengumuman.create')}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all"
                                >
                                    <Plus className="w-5 h-5" />
                                    Tambah Baru
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
                    {/* Search and Filters Bar */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="flex flex-col lg:flex-row gap-4">
                            {/* Search */}
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Cari pengumuman..."
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0"
                                    />
                                </div>
                            </div>

                            {/* Quick Filters */}
                            <div className="flex items-center gap-3">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 min-w-[140px]"
                                >
                                    <option value="">Semua Status</option>
                                    <option value="active">Aktif</option>
                                    <option value="draft">Draft</option>
                                    <option value="expired">Kadaluarsa</option>
                                </select>

                                <select
                                    value={tipeFilter}
                                    onChange={(e) => setTipeFilter(e.target.value)}
                                    className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 min-w-[140px]"
                                >
                                    <option value="">Semua Tipe</option>
                                    <option value="umum">Umum</option>
                                    <option value="urgent">Urgent</option>
                                    <option value="tanggal_spesifik">Acara Spesial</option>
                                </select>

                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0"
                                >
                                    <option value="created_at">Tanggal Dibuat</option>
                                    <option value="judul">Judul</option>
                                    <option value="prioritas">Prioritas</option>
                                    <option value="tanggal_berlaku">Tanggal Berlaku</option>
                                </select>

                                <button
                                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                    className="p-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-colors"
                                >
                                    {sortOrder === 'asc' ? (
                                        <TrendingUp className="w-5 h-5 text-gray-600" />
                                    ) : (
                                        <TrendingUp className="w-5 h-5 text-gray-600 rotate-180" />
                                    )}
                                </button>

                                <button
                                    onClick={applyFilters}
                                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
                                >
                                    Terapkan
                                </button>
                            </div>
                        </div>

                        {/* Active Filters */}
                        {(searchQuery || statusFilter || tipeFilter) && (
                            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                                <span className="text-sm font-medium text-gray-700">Filter Aktif:</span>
                                {searchQuery && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm">
                                        Cari: {searchQuery}
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="hover:text-blue-900"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </span>
                                )}
                                {statusFilter && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                                        Status: {getStatusConfig(statusFilter).label}
                                        <button
                                            onClick={() => setStatusFilter('')}
                                            className="hover:text-gray-900"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </span>
                                )}
                                {tipeFilter && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                                        Tipe: {getTipeConfig(tipeFilter).label}
                                        <button
                                            onClick={() => setTipeFilter('')}
                                            className="hover:text-gray-900"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Bulk Actions Bar */}
                    {showBulkActions && (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200 p-4 animate-slide-down">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-medium text-blue-900">
                                        {selectedItems.length} item terpilih
                                    </span>
                                    <button
                                        onClick={() => setSelectedItems([])}
                                        className="text-sm text-blue-600 hover:text-blue-700"
                                    >
                                        Hapus seleksi
                                    </button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleBulkAction('publish')}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                                    >
                                        <CheckCircle2 className="w-4 h-4" />
                                        Publikasikan
                                    </button>
                                    <button
                                        onClick={() => handleBulkAction('draft')}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
                                    >
                                        <FileText className="w-4 h-4" />
                                        Jadikan Draft
                                    </button>
                                    <button
                                        onClick={() => handleBulkAction('delete')}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* View Toggle and Select All */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <input
                                    type="checkbox"
                                    checked={selectedItems.length === filteredData.length && filteredData.length > 0}
                                    onChange={handleSelectAll}
                                    className="w-5 h-5 rounded border-2 border-gray-300 bg-white text-blue-600 focus:ring-blue-500"
                                />
                                Pilih Semua ({filteredData.length})
                            </label>
                        </div>

                        <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-xl">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-colors ${
                                    viewMode === 'grid'
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                <Grid className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-colors ${
                                    viewMode === 'list'
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                <List className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Results */}
                    {filteredData.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                            <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
                                <FileText className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak ada pengumuman</h3>
                            <p className="text-gray-600 mb-6">Belum ada pengumuman yang sesuai dengan filter yang dipilih</p>
                            <Link
                                href={route('admin.pengumuman.create')}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                                Buat Pengumuman Pertama
                            </Link>
                        </div>
                    ) : (
                        <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-3'}>
                            {filteredData.map((item) => (
                                <div key={item.id}>
                                    {viewMode === 'grid' ? (
                                        <PengumumanCard item={item} isSelected={selectedItems.includes(item.id)} />
                                    ) : (
                                        <PengumumanListItem item={item} isSelected={selectedItems.includes(item.id)} />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {pengumuman.links && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-600">
                                    Menampilkan {pengumuman.from || 0} - {pengumuman.to || 0} dari {total} pengumuman
                                </div>
                                <div className="flex items-center gap-2">
                                    {pengumuman.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                link.active
                                                    ? 'bg-blue-600 text-white'
                                                    : link.url
                                                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .line-clamp-1 {
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                }
                .line-clamp-2 {
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                }
                .line-clamp-3 {
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                }
                @keyframes slide-down {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-slide-down {
                    animation: slide-down 0.3s ease-out;
                }
                .rotate-180 {
                    transform: rotate(180deg);
                }
            `}</style>
        </Layout>
    );
}