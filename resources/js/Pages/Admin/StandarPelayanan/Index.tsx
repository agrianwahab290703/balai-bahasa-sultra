import React, { useCallback } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { DataTable, ColumnDef, PaginatedData, BulkAction } from '@/Components/Admin/DataTable';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { 
  Download, 
  Eye, 
  Pencil, 
  Trash2, 
  Check, 
  X, 
  Plus, 
  MoreHorizontal,
  FileText,
  Link as LinkIcon
} from 'lucide-react';
import { File02Icon, FileValidationIcon } from 'hugeicons-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Badge } from '@/Components/ui/badge';

interface StandarPelayananDocument {
  id: number;
  title: string;
  description: string | null;
  url: string | null;
  file_type: string | null;
  formatted_file_size: string;
  download_count: number;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  is_external: boolean;
  source_label: string;
}

interface StatsSummary {
  total: number;
  active: number;
  inactive: number;
  downloads: number;
  file_based: number;
  link_based: number;
}

interface Props {
  documents: PaginatedData<StandarPelayananDocument>;
  filters: {
    search: string;
    status: string;
    sort: string;
    direction: string;
  };
  statistics: StatsSummary;
}

export default function Index({ documents, filters, statistics }: Props) {
  const handleDelete = useCallback((id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus dokumen ini?')) {
      router.delete(route('admin.standar-pelayanan.destroy', id));
    }
  }, []);

  const columns: ColumnDef<StandarPelayananDocument>[] = [
    {
      key: 'title',
      label: 'Judul Dokumen',
      sortable: true,
      render: (_, row) => (
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl shrink-0 bg-primary/10 text-primary hidden sm:flex">
            {row.is_external ? <LinkIcon className="h-6 w-6" /> : <FileText className="h-6 w-6" />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-foreground line-clamp-2">{row.title}</p>
            <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-muted-foreground">
              <Badge variant="outline" className="rounded-md font-normal border-gray-300 bg-gray-50 text-gray-700">
                {row.source_label}
              </Badge>
              {row.file_type && (
                <Badge variant="secondary" className="rounded-md font-normal uppercase bg-blue-100 text-blue-700">
                  {row.file_type}
                </Badge>
              )}
              {row.formatted_file_size && (
                <span className="flex items-center gap-1">
                  • {row.formatted_file_size}
                </span>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'download_count',
      label: 'Unduhan',
      sortable: true,
      className: 'hidden md:table-cell text-center w-24',
      render: (value) => (
        <div className="flex items-center justify-center gap-1.5 text-muted-foreground font-medium">
          <Download className="h-3.5 w-3.5" />
          {(value as number).toLocaleString('id-ID')}
        </div>
      ),
    },
    {
      key: 'is_active',
      label: 'Status',
      className: 'w-24 text-center',
      render: (value) => (
        <Badge 
          variant={value ? 'default' : 'destructive'} 
          className={`justify-center w-full ${value ? 'bg-emerald-500 hover:bg-emerald-600' : ''}`}
        >
          {value ? 'Aktif' : 'Nonaktif'}
        </Badge>
      ),
    },
    {
      key: 'created_at',
      label: 'Tanggal',
      sortable: true,
      className: 'hidden lg:table-cell w-32',
      render: (value) => (
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {new Date(value as string).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Aksi',
      className: 'w-32',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1">
          {/* Edit Button - Visible */}
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2.5 text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
            asChild
          >
            <Link href={route('admin.standar-pelayanan.edit', row.id)}>
              <Pencil className="h-3.5 w-3.5 mr-1" />
              Edit
            </Link>
          </Button>
          
          {/* More Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-gray-200 hover:bg-gray-50">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4 text-gray-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Aksi Lainnya</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <a href={route('admin.standar-pelayanan.download', row.id)} target="_blank" className="cursor-pointer">
                  <Download className="mr-2 h-4 w-4" />
                  Unduh File
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={route('admin.standar-pelayanan.show', row.id)} className="cursor-pointer">
                  <Eye className="mr-2 h-4 w-4" />
                  Lihat Detail
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleDelete(row.id)}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  const bulkActions: BulkAction[] = [
    {
      key: 'activate',
      label: 'Aktifkan',
      icon: <Check className="h-4 w-4 mr-1" />,
      confirmMessage: 'Aktifkan semua dokumen yang dipilih?',
    },
    {
      key: 'deactivate',
      label: 'Nonaktifkan',
      icon: <X className="h-4 w-4 mr-1" />,
      confirmMessage: 'Nonaktifkan semua dokumen yang dipilih?',
    },
    {
      key: 'delete',
      label: 'Hapus',
      icon: <Trash2 className="h-4 w-4 mr-1" />,
      variant: 'destructive',
      confirmMessage: 'Hapus semua dokumen yang dipilih? Aksi ini tidak dapat dibatalkan.',
    },
  ];

  const filterConfigs = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'active', label: 'Aktif' },
        { value: 'inactive', label: 'Nonaktif' },
      ],
    },
  ];

  const handleBulkAction = useCallback((action: string, ids: (number | string)[]) => {
    router.post(route('admin.standar-pelayanan.bulk-action'), {
      action,
      ids,
    });
  }, []);

  const summaryCards = [
    {
      label: 'Total Dokumen',
      value: statistics.total ?? 0,
      subLabel: `${(statistics.downloads ?? 0).toLocaleString('id-ID')} total unduhan`,
      icon: FileValidationIcon,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
    },
    {
      label: 'Dokumen Aktif',
      value: statistics.active ?? 0,
      subLabel: `${statistics.inactive ?? 0} dokumen nonaktif`,
      icon: Check,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Jenis File',
      value: statistics.file_based ?? 0,
      subLabel: `${statistics.link_based ?? 0} berupa tautan`,
      icon: File02Icon,
      color: 'text-orange-500',
      bg: 'bg-orange-50',
    },
  ];

  return (
    <AdminLayout>
      <Head title="Kelola Standar Pelayanan" />

      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Standar Pelayanan</h1>
            <p className="text-muted-foreground mt-1">
              Kelola dan pantau dokumen standar pelayanan publik
            </p>
          </div>
          <Button onClick={() => router.visit(route('admin.standar-pelayanan.create'))} size="lg" className="shadow-sm bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-5 w-5 mr-2" /> 
            Tambah Dokumen
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {summaryCards.map((card, i) => (
            <Card key={i} className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                    <p className="text-xs text-muted-foreground">{card.subLabel}</p>
                  </div>
                  <div className={`rounded-2xl p-4 ${card.bg} ${card.color}`}>
                    <card.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border border-gray-200 shadow-sm bg-white">
          <CardHeader className="px-6 pt-6 pb-4">
            <CardTitle className="text-xl">Daftar Dokumen</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <DataTable
              data={documents}
              columns={columns}
              searchable
              searchPlaceholder="Cari judul atau deskripsi..."
              searchValue={filters.search}
              filters={filterConfigs}
              filterValues={{ status: filters.status }}
              bulkActions={bulkActions}
              sortColumn={filters.sort}
              sortDirection={filters.direction as 'asc' | 'desc'}
              baseUrl={route('admin.standar-pelayanan.index')}
              onBulkAction={handleBulkAction}
            />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}