import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/Components/ui/table';
import {
  ArrowLeft,
  Activity,
  Plus,
  Pencil,
  Trash2,
  User,
  Clock,
  Globe,
  Monitor,
  FileText,
} from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Change {
  field: string;
  old_value: any;
  new_value: any;
  type: 'added' | 'removed' | 'modified';
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

interface Props {
  log: ActivityLog;
  relatedEntity: Record<string, any> | null;
  changes: Change[];
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
  created: <Plus className="h-4 w-4" />,
  updated: <Pencil className="h-4 w-4" />,
  deleted: <Trash2 className="h-4 w-4" />,
};

const changeTypeLabels: Record<string, string> = {
  added: 'Ditambahkan',
  removed: 'Dihapus',
  modified: 'Diubah',
};

const changeTypeBadgeVariants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  added: 'default',
  removed: 'destructive',
  modified: 'secondary',
};

export default function Show({ log, relatedEntity, changes }: Props) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'boolean') return value ? 'Ya' : 'Tidak';
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return String(value);
  };

  const isLongValue = (value: any): boolean => {
    const str = formatValue(value);
    return str.length > 100 || str.includes('\n');
  };

  return (
    <AdminLayout>
      <Head title={`Log Aktivitas #${log.id}`} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={route('admin.activity-logs.index')}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              <Activity className="h-6 w-6" />
              Detail Log Aktivitas
            </h1>
            <p className="text-muted-foreground">
              Log #{log.id} - {log.entity_name}
            </p>
          </div>
          <Badge variant={actionBadgeVariants[log.action] || 'outline'} className="flex items-center gap-1 text-base px-3 py-1">
            {actionIcons[log.action]}
            {actionLabels[log.action] || log.action}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Changes Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Perubahan Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                {changes.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    Tidak ada perubahan data tercatat
                  </p>
                ) : (
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[150px]">Field</TableHead>
                          <TableHead className="w-[100px]">Tipe</TableHead>
                          <TableHead>Nilai Lama</TableHead>
                          <TableHead>Nilai Baru</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {changes.map((change, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium align-top">
                              {change.field}
                            </TableCell>
                            <TableCell className="align-top">
                              <Badge variant={changeTypeBadgeVariants[change.type] || 'outline'}>
                                {changeTypeLabels[change.type] || change.type}
                              </Badge>
                            </TableCell>
                            <TableCell className="align-top">
                              {isLongValue(change.old_value) ? (
                                <pre className="text-xs bg-muted p-2 rounded overflow-x-auto max-w-[300px] whitespace-pre-wrap text-red-600 line-through">
                                  {formatValue(change.old_value)}
                                </pre>
                              ) : (
                                <span className={change.type !== 'added' ? 'text-red-600 line-through' : ''}>
                                  {formatValue(change.old_value)}
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="align-top">
                              {isLongValue(change.new_value) ? (
                                <pre className="text-xs bg-muted p-2 rounded overflow-x-auto max-w-[300px] whitespace-pre-wrap text-green-600">
                                  {formatValue(change.new_value)}
                                </pre>
                              ) : (
                                <span className={change.type !== 'removed' ? 'text-green-600 font-medium' : ''}>
                                  {formatValue(change.new_value)}
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Raw Data Card */}
            {(log.old_values || log.new_values) && (
              <Card>
                <CardHeader>
                  <CardTitle>Data Mentah (JSON)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">
                        Nilai Lama
                      </label>
                      <pre className="text-xs bg-muted p-3 rounded overflow-x-auto max-h-[300px]">
                        {log.old_values ? JSON.stringify(log.old_values, null, 2) : '-'}
                      </pre>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">
                        Nilai Baru
                      </label>
                      <pre className="text-xs bg-muted p-3 rounded overflow-x-auto max-h-[300px]">
                        {log.new_values ? JSON.stringify(log.new_values, null, 2) : '-'}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Activity Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informasi Aktivitas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Waktu</label>
                    <p className="text-sm">{formatDate(log.created_at)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Pengguna</label>
                    {log.user ? (
                      <div>
                        <p className="text-sm font-medium">{log.user.name}</p>
                        <p className="text-xs text-muted-foreground">{log.user.email}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">-</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">IP Address</label>
                    <p className="text-sm">{log.ip_address || '-'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Monitor className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">User Agent</label>
                    <p className="text-xs text-muted-foreground break-all">
                      {log.user_agent || '-'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Entity Info */}
            <Card>
              <CardHeader>
                <CardTitle>Entitas Terkait</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tipe</label>
                  <p className="text-sm">{log.entity_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">ID</label>
                  <p className="text-sm">{log.loggable_id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Label</label>
                  <p className="text-sm">{log.entity_label}</p>
                </div>
                {relatedEntity && (
                  <div className="pt-2 border-t">
                    <Badge variant="outline" className="text-green-600">
                      Entitas masih ada
                    </Badge>
                  </div>
                )}
                {!relatedEntity && log.action === 'deleted' && (
                  <div className="pt-2 border-t">
                    <Badge variant="destructive">
                      Entitas telah dihapus
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
