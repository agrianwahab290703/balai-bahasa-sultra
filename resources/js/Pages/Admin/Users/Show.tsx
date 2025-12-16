import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import {
  ArrowLeft,
  Pencil,
  Trash2,
  UserCheck,
  UserX,
  Key,
  Mail,
  Calendar,
  Clock,
  Shield,
} from 'lucide-react';

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

interface Props {
  user: UserData;
  roles: string[];
}

const roleLabels: Record<string, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  editor: 'Editor',
};

const roleBadgeVariants: Record<string, 'default' | 'secondary' | 'outline'> = {
  super_admin: 'default',
  admin: 'secondary',
  editor: 'outline',
};

const roleDescriptions: Record<string, string> = {
  super_admin: 'Akses penuh ke semua fitur termasuk manajemen pengguna',
  admin: 'Akses ke semua fitur konten, tidak bisa mengelola pengguna',
  editor: 'Hanya bisa mengelola konten (berita, galeri, dll)',
};

export default function Show({ user }: Props) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDelete = () => {
    if (confirm('Hapus pengguna ini? Tindakan ini tidak dapat dibatalkan.')) {
      router.delete(route('admin.users.destroy', user.id));
    }
  };

  const handleToggleActive = () => {
    const message = user.is_active 
      ? 'Nonaktifkan pengguna ini? Pengguna tidak akan bisa login.'
      : 'Aktifkan pengguna ini?';
    
    if (confirm(message)) {
      router.post(route('admin.users.toggle-active', user.id));
    }
  };

  return (
    <AdminLayout>
      <Head title={`Detail Pengguna - ${user.name}`} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href={route('admin.users.index')}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-semibold">{user.name}</h1>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href={route('admin.users.edit', user.id) + '?tab=password'}>
                <Key className="h-4 w-4 mr-2" />
                Ubah Password
              </Link>
            </Button>
            <Button asChild>
              <Link href={route('admin.users.edit', user.id)}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* User Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Pengguna</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <span className="text-lg font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    {user.email}
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Role
                  </span>
                  <div className="text-right">
                    <Badge variant={roleBadgeVariants[user.role] || 'outline'}>
                      {roleLabels[user.role] || user.role}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
                      {roleDescriptions[user.role]}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant={user.is_active ? 'default' : 'destructive'}>
                    {user.is_active ? 'Aktif' : 'Nonaktif'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Information */}
          <Card>
            <CardHeader>
              <CardTitle>Aktivitas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Login Terakhir
                </span>
                <span>{formatDate(user.last_login_at)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Dibuat
                </span>
                <span>{formatDate(user.created_at)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Diperbarui
                </span>
                <span>{formatDate(user.updated_at)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Aksi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={handleToggleActive}
              >
                {user.is_active ? (
                  <>
                    <UserX className="h-4 w-4 mr-2" />
                    Nonaktifkan Pengguna
                  </>
                ) : (
                  <>
                    <UserCheck className="h-4 w-4 mr-2" />
                    Aktifkan Pengguna
                  </>
                )}
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Hapus Pengguna
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
