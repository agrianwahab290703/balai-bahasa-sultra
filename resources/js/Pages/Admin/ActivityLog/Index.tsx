import React, { useCallback, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { GlassCard } from '@/Components/Admin/GlassCard';
import { GradientButton } from '@/Components/Admin/GradientButton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/Components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/Components/ui/dialog';
import {
  Search,
  Eye,
  Activity,
  Plus,
  Pencil,
  Trash2,
  Calendar,
  Filter,
  X,
} from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
}

interface ActivityLog {
  id: number;
  user_id: number;
  action: string;
  loggable_type: string;
  loggable_id: number;
  old_values: Record<string, any> | null;
  new_values: Record<string, any> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  user: User | null;
  entity_name: string;
  entity_label: string;
}

interface PaginatedData {
  data: ActivityLog[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface EntityType {
  value: string;
  label: string;
}

interface Statistics {
  total: number;
  today: number;
  this_week: number;
  created: number;
  updated: number;
  deleted: number;
}

interface Props {
  logs: PaginatedData;
  filters: {
    search: string;
    user_id: string;
    action: string;
    entity_type: string;
    date_from: string;
    date_to: string;
    sort: string;
    direction: string;
  };
  users: User[];
  entityTypes: EntityType[];
  actions: string[];
  statistics: Statistics;
}


const actionLabels: Record<string, string> = {
  created: 'Dibuat',
  updated: 'Diperbarui',
  deleted: 'Dihapus',
};

const actionBadgeVariants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  created: 'default',
  updated: 'secondary',
  deleted: 'destructive',
};

const actionIcons: Record<string, React.ReactNode> = {
  created: <Plus className="h-3 w-3" />,
  updated: <Pencil className="h-3 w-3" />,
  deleted: <Trash2 className="h-3 w-3" />,
};

export default function Index({ logs, filters, users, entityTypes, actions, statistics }: Props) {
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = useCallback((value: string) => {
    router.get(route('admin.activity-logs.index'), { ...filters, search: value }, { preserveState: true });
  }, [filters]);

  const handleFilterChange = useCallback((key: string, value: string) => {
    router.get(
      route('admin.activity-logs.index'), 
      { ...filters, [key]: value === 'all' ? '' : value }, 
      { preserveState: true }
    );
  }, [filters]);

  const clearFilters = useCallback(() => {
    router.get(route('admin.activity-logs.index'), {}, { preserveState: true });
  }, []);

  const hasActiveFilters = filters.user_id || filters.action || filters.entity_type || filters.date_from || filters.date_to;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'boolean') return value ? 'Ya' : 'Tidak';
    if (typeof value === 'object') return JSON.stringify(value);
    if (typeof value === 'string' && value.length > 50) {
      return value.substring(0, 50) + '...';
    }
    return String(value);
  };

  const breadcrumbs = [
    { label: 'Log Aktivitas' }
  ];

  return (
    <AdminLayout title="Log Aktivitas" breadcrumbs={breadcrumbs}>
      <Head title="Log Aktivitas" />

      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-white bg-clip-text text-transparent">Log Aktivitas</h1>
              <p className="text-muted-foreground">
                Pantau semua perubahan yang dilakukan pada konten
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <GlassCard variant="stat" className="p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
              <Activity className="h-4 w-4" />
              Total
            </div>
            <div className="text-2xl font-bold">{statistics.total}</div>
          </GlassCard>
          <GlassCard variant="stat" className="p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
              <Calendar className="h-4 w-4" />
              Hari Ini
            </div>
            <div className="text-2xl font-bold">{statistics.today}</div>
          </GlassCard>
          <GlassCard variant="stat" className="p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
              <Calendar className="h-4 w-4" />
              Minggu Ini
            </div>
            <div className="text-2xl font-bold">{statistics.this_week}</div>
          </GlassCard>
          <GlassCard variant="stat" className="p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
              <Plus className="h-4 w-4 text-green-500" />
              Dibuat
            </div>
            <div className="text-2xl font-bold text-green-600">{statistics.created}</div>
          </GlassCard>
          <GlassCard variant="stat" className="p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
              <Pencil className="h-4 w-4 text-blue-500" />
              Diperbarui
            </div>
            <div className="text-2xl font-bold text-blue-600">{statistics.updated}</div>
          </GlassCard>
          <GlassCard variant="stat" className="p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
              <Trash2 className="h-4 w-4 text-red-500" />
              Dihapus
            </div>
            <div className="text-2xl font-bold text-red-600">{statistics.deleted}</div>
          </GlassCard>
        </div>

        {/* Filters */}
        <GlassCard className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari dalam log..."
                    value={filters.search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filter
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-1">
                      Aktif
                    </Badge>
                  )}
                </Button>
                {hasActiveFilters && (
                  <Button variant="ghost" onClick={clearFilters} className="flex items-center gap-2">
                    <X className="h-4 w-4" />
                    Reset
                  </Button>
                )}
              </div>


              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 pt-4 border-t">
                  <Select
                    value={filters.user_id || 'all'}
                    onValueChange={(value) => handleFilterChange('user_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Semua Pengguna" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Pengguna</SelectItem>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={String(user.id)}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={filters.action || 'all'}
                    onValueChange={(value) => handleFilterChange('action', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Semua Aksi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Aksi</SelectItem>
                      {actions.map((action) => (
                        <SelectItem key={action} value={action}>
                          {actionLabels[action] || action}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={filters.entity_type || 'all'}
                    onValueChange={(value) => handleFilterChange('entity_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Semua Entitas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Entitas</SelectItem>
                      {entityTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    type="date"
                    placeholder="Dari Tanggal"
                    value={filters.date_from}
                    onChange={(e) => handleFilterChange('date_from', e.target.value)}
                  />

                  <Input
                    type="date"
                    placeholder="Sampai Tanggal"
                    value={filters.date_to}
                    onChange={(e) => handleFilterChange('date_to', e.target.value)}
                  />
                </div>
              )}
            </div>
          </GlassCard>

        {/* Activity Logs Table */}
        <GlassCard className="p-0 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Pengguna</TableHead>
                  <TableHead>Aksi</TableHead>
                  <TableHead>Entitas</TableHead>
                  <TableHead>Detail</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Tidak ada log aktivitas ditemukan
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.data.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-muted-foreground whitespace-nowrap">
                        {formatDate(log.created_at)}
                      </TableCell>
                      <TableCell>
                        {log.user ? (
                          <div>
                            <div className="font-medium">{log.user.name}</div>
                            <div className="text-xs text-muted-foreground">{log.user.email}</div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={actionBadgeVariants[log.action] || 'outline'} className="flex items-center gap-1 w-fit">
                          {actionIcons[log.action]}
                          {actionLabels[log.action] || log.action}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{log.entity_name}</div>
                          <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {log.entity_label}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {log.ip_address && (
                          <span className="text-xs">IP: {log.ip_address}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedLog(log)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </GlassCard>


        {/* Pagination */}
        {logs.last_page > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Menampilkan {logs.data.length} dari {logs.total} log
            </p>
            <div className="flex gap-2">
              {logs.links.map((link, index) => (
                <Button
                  key={index}
                  variant={link.active ? 'default' : 'outline'}
                  size="sm"
                  disabled={!link.url}
                  onClick={() => link.url && router.get(link.url)}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Detail Modal */}
        <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Detail Log Aktivitas
              </DialogTitle>
            </DialogHeader>
            
            {selectedLog && (
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Waktu</label>
                    <p className="mt-1">{formatDate(selectedLog.created_at)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Pengguna</label>
                    <p className="mt-1">{selectedLog.user?.name || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Aksi</label>
                    <div className="mt-1">
                      <Badge variant={actionBadgeVariants[selectedLog.action] || 'outline'}>
                        {actionLabels[selectedLog.action] || selectedLog.action}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Entitas</label>
                    <p className="mt-1">{selectedLog.entity_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">IP Address</label>
                    <p className="mt-1">{selectedLog.ip_address || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">ID Entitas</label>
                    <p className="mt-1">{selectedLog.loggable_id}</p>
                  </div>
                </div>

                {/* User Agent */}
                {selectedLog.user_agent && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">User Agent</label>
                    <p className="mt-1 text-xs text-muted-foreground break-all">
                      {selectedLog.user_agent}
                    </p>
                  </div>
                )}

                {/* Changes */}
                {(selectedLog.old_values || selectedLog.new_values) && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">
                      Perubahan Data
                    </label>
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[150px]">Field</TableHead>
                            <TableHead>Nilai Lama</TableHead>
                            <TableHead>Nilai Baru</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(() => {
                            const allKeys = new Set([
                              ...Object.keys(selectedLog.old_values || {}),
                              ...Object.keys(selectedLog.new_values || {}),
                            ]);
                            
                            return Array.from(allKeys).map((key) => {
                              const oldVal = selectedLog.old_values?.[key];
                              const newVal = selectedLog.new_values?.[key];
                              const hasChanged = oldVal !== newVal;
                              
                              return (
                                <TableRow key={key} className={hasChanged ? 'bg-yellow-50 dark:bg-yellow-950/20' : ''}>
                                  <TableCell className="font-medium">{key}</TableCell>
                                  <TableCell className="text-muted-foreground">
                                    <span className={hasChanged && oldVal !== undefined ? 'line-through text-red-500' : ''}>
                                      {formatValue(oldVal)}
                                    </span>
                                  </TableCell>
                                  <TableCell>
                                    <span className={hasChanged && newVal !== undefined ? 'text-green-600 font-medium' : ''}>
                                      {formatValue(newVal)}
                                    </span>
                                  </TableCell>
                                </TableRow>
                              );
                            });
                          })()}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
