import React, { useCallback } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Input } from '@/Components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  UserCheck,
  UserX,
  Key,
  Users,
  UserCog,
  Shield,
  Filter,
  UserPlus,
  Crown,
  Activity,
  TrendingUp,
  Clock,
  Calendar,
  Settings,
  Zap,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
}

interface PaginatedData {
  data: User[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Statistics {
  total: number;
  active: number;
  inactive: number;
  super_admin: number;
  admin: number;
  editor: number;
}

interface Props {
  users: PaginatedData;
  filters: {
    search: string;
    role: string;
    status: string;
    sort: string;
    direction: string;
  };
  roles: string[];
  statistics: Statistics;
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

export default function Index({ users, filters, roles, statistics }: Props) {
  const handleSearch = useCallback((value: string) => {
    router.get(route('admin.users.index'), { ...filters, search: value }, { preserveState: true });
  }, [filters]);

  const handleFilterChange = useCallback((key: string, value: string) => {
    router.get(route('admin.users.index'), { ...filters, [key]: value === 'all' ? '' : value }, { preserveState: true });
  }, [filters]);

  const handleDelete = useCallback((id: number) => {
    if (!id || typeof id !== 'number') {
      console.error('Invalid user ID for deletion:', id);
      alert('ID pengguna tidak valid. Tidak dapat menghapus pengguna.');
      return;
    }

    if (confirm('Hapus pengguna ini? Tindakan ini tidak dapat dibatalkan.')) {
      console.log('Deleting user with ID:', id);
      router.delete(route('admin.users.destroy', id));
    }
  }, []);

  const handleToggleActive = useCallback((id: number, isActive: boolean) => {
    const message = isActive
      ? 'Nonaktifkan pengguna ini? Pengguna tidak akan bisa login.'
      : 'Aktifkan pengguna ini?';

    if (confirm(message)) {
      router.post(route('admin.users.toggle-active', id), {}, {
        preserveState: true,
        preserveScroll: true,
      });
    }
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const breadcrumbs = [
    { label: 'Pengguna' }
  ];

  return (
    <AdminLayout title="Kelola Pengguna" breadcrumbs={breadcrumbs}>
      <Head title="Kelola Pengguna" />

      {/* Hero Section with Glassmorphism */}
      <div className="relative mb-12">
        {/* Soft background with subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl" />

        {/* Floating soft elements */}
        <div className="absolute top-8 left-8 w-20 h-20 rounded-full bg-blue-100 opacity-60 blur-xl animate-pulse" />
        <div className="absolute bottom-8 right-12 w-16 h-16 rounded-full bg-purple-100 opacity-50 blur-xl animate-pulse" style={{ animationDelay: '1s' }} />

        {/* Main content container */}
        <div className="relative bg-white/60 backdrop-blur-sm border border-white/20 rounded-3xl p-10 shadow-2xl shadow-blue-100/50">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-blue-50 rounded-full border border-blue-100">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-sm font-medium text-blue-700">User Management</span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-blue-500 to-white bg-clip-text text-transparent leading-tight">
                Manajemen Pengguna
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Kelola akun pengguna dengan sistem
                <span className="font-semibold text-blue-600 mx-1">modern</span> dan
                <span className="font-semibold text-purple-600 mx-1">terorganisir</span>
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                asChild
                className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-500 hover:shadow-xl hover:shadow-blue-200/50 px-8 py-3 rounded-2xl font-medium"
              >
                <Link href={route('admin.users.create')} className="flex items-center">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <UserPlus className="h-5 w-5 mr-3 relative z-10" />
                  <span className="relative z-10">Tambah Pengguna</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
        <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-gray-100/30 p-6 hover:shadow-xl hover:shadow-blue-100/40 transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <Users className="h-5 w-5 text-gray-600" />
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Total Pengguna</p>
            <p className="text-3xl font-bold text-gray-800">{statistics.total}</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-gray-100/30 p-6 hover:shadow-xl hover:shadow-green-100/40 transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
              <UserCheck className="h-5 w-5 text-green-600" />
            </div>
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <Activity className="h-4 w-4 text-green-600" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Pengguna Aktif</p>
            <p className="text-3xl font-bold text-green-600">{statistics.active}</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-gray-100/30 p-6 hover:shadow-xl hover:shadow-red-100/40 transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
              <UserX className="h-5 w-5 text-red-600" />
            </div>
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
              <XCircle className="h-4 w-4 text-red-600" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Pengguna Nonaktif</p>
            <p className="text-3xl font-bold text-red-600">{statistics.inactive}</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-gray-100/30 p-6 hover:shadow-xl hover:shadow-blue-100/40 transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
              <Shield className="h-5 w-5 text-blue-600" />
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Crown className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Super Admin</p>
            <p className="text-3xl font-bold text-blue-600">{statistics.super_admin}</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-gray-100/30 p-6 hover:shadow-xl hover:shadow-purple-100/40 transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
              <UserCog className="h-5 w-5 text-purple-600" />
            </div>
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
              <Settings className="h-4 w-4 text-purple-600" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Admin</p>
            <p className="text-3xl font-bold text-purple-600">{statistics.admin}</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-gray-100/30 p-6 hover:shadow-xl hover:shadow-gray-100/40 transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <Users className="h-5 w-5 text-gray-600" />
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <Pencil className="h-4 w-4 text-gray-600" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Editor</p>
            <p className="text-3xl font-bold text-gray-600">{statistics.editor}</p>
          </div>
        </div>
      </div>

      {/* Enhanced Filters */}
      <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-gray-100/30 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari nama atau email pengguna..."
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              className="h-12 pl-12 pr-4 rounded-xl border-2 bg-white/70 backdrop-blur-sm border-gray-200 hover:border-gray-300 focus:border-blue-400 focus:shadow-lg focus:shadow-blue-100/50 transition-all duration-300"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select
              value={filters.role || 'all'}
              onValueChange={(value) => handleFilterChange('role', value)}
            >
              <SelectTrigger className="w-40 h-12 rounded-xl border-2 bg-white/70 backdrop-blur-sm border-gray-200 hover:border-gray-300 focus:border-blue-400 transition-all duration-300">
                <SelectValue placeholder="Semua Role" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-2 border-gray-200 shadow-xl">
                <SelectItem value="all" className="rounded-lg hover:bg-blue-50">Semua Role</SelectItem>
                {roles.filter(role => role && role.trim() !== '').map((role) => (
                  <SelectItem key={role} value={role} className="rounded-lg hover:bg-blue-50">
                    {roleLabels[role] || role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-gray-500" />
            <Select
              value={filters.status || 'all'}
              onValueChange={(value) => handleFilterChange('status', value)}
            >
              <SelectTrigger className="w-40 h-12 rounded-xl border-2 bg-white/70 backdrop-blur-sm border-gray-200 hover:border-gray-300 focus:border-blue-400 transition-all duration-300">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-2 border-gray-200 shadow-xl">
                <SelectItem value="all" className="rounded-lg hover:bg-blue-50">Semua Status</SelectItem>
                <SelectItem value="active" className="rounded-lg hover:bg-green-50">Aktif</SelectItem>
                <SelectItem value="inactive" className="rounded-lg hover:bg-red-50">Nonaktif</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Enhanced Users Table */}
      <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl shadow-xl shadow-gray-100/30 overflow-hidden">
        {users.data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full flex items-center justify-center">
                <AlertCircle className="h-12 w-12 text-gray-400" />
              </div>
              <div className="absolute -inset-4 bg-gray-100 rounded-full animate-pulse opacity-30" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Tidak Ada Pengguna</h3>
            <p className="text-gray-600 text-center max-w-md">
              Belum ada pengguna yang terdaftar. Mulai dengan menambahkan pengguna baru menggunakan tombol "Tambah Pengguna" di atas.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-50 to-purple-50/30 border-b border-gray-200/50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Nama</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Login Terakhir</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Dibuat</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 w-24">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/50">
                {users.data.map((user, index) => (
                  <tr key={user.id} className="hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-purple-50/30 transition-all duration-300">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-200 flex items-center justify-center">
                          <span className="text-lg font-bold text-blue-600">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{user.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                          <span className="text-xs text-gray-500">📧</span>
                        </div>
                        <p className="text-sm text-gray-600 truncate max-w-xs">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          user.role === 'super_admin' ? 'default' :
                          user.role === 'admin' ? 'secondary' : 'outline'
                        }
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium border-2",
                          user.role === 'super_admin' ? "bg-blue-500 text-white border-blue-600" :
                          user.role === 'admin' ? "bg-purple-500 text-white border-purple-600" :
                          "bg-gray-500 text-white border-gray-600"
                        )}
                      >
                        {roleLabels[user.role] || user.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={user.is_active ? 'default' : 'destructive'}
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium border-2 flex items-center gap-1",
                          user.is_active
                            ? "bg-green-500 text-white border-green-600"
                            : "bg-red-500 text-white border-red-600"
                        )}
                      >
                        {user.is_active ? (
                          <>
                            <CheckCircle className="h-3 w-3" />
                            Aktif
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3" />
                            Nonaktif
                          </>
                        )}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{formatDate(user.last_login_at)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{formatDate(user.created_at)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-lg bg-white/60 backdrop-blur-sm border border-gray-200 hover:bg-white hover:border-blue-300 hover:shadow-md hover:shadow-blue-100/50 transition-all duration-300"
                          >
                            <MoreHorizontal className="h-4 w-4 text-gray-600" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl border-2 border-gray-200 shadow-xl bg-white/95 backdrop-blur-sm">
                          <DropdownMenuItem asChild className="rounded-lg hover:bg-blue-50">
                            <Link href={route('admin.users.show', user.id)} className="flex items-center gap-2 w-full px-3 py-2">
                              <Eye className="h-4 w-4 text-blue-600" />
                              <span>Lihat Detail</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild className="rounded-lg hover:bg-blue-50">
                            <Link href={route('admin.users.edit', user.id)} className="flex items-center gap-2 w-full px-3 py-2">
                              <Pencil className="h-4 w-4 text-blue-600" />
                              <span>Edit</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild className="rounded-lg hover:bg-blue-50">
                            <Link href={route('admin.users.edit', user.id) + '?tab=password'} className="flex items-center gap-2 w-full px-3 py-2">
                              <Key className="h-4 w-4 text-blue-600" />
                              <span>Ubah Password</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-gray-100" />
                          <DropdownMenuItem
                            onClick={() => handleToggleActive(user.id, user.is_active)}
                            className={cn(
                              "flex items-center gap-2 w-full px-3 py-2 rounded-lg",
                              user.is_active ? "hover:bg-red-50" : "hover:bg-green-50"
                            )}
                          >
                            {user.is_active ? (
                              <>
                                <UserX className="h-4 w-4 text-red-600" />
                                <span>Nonaktifkan</span>
                              </>
                            ) : (
                              <>
                                <UserCheck className="h-4 w-4 text-green-600" />
                                <span>Aktifkan</span>
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-gray-100" />
                          <DropdownMenuItem
                            onClick={() => {
                              console.log('Delete button clicked, user:', user);
                              if (user && user.id) {
                                handleDelete(user.id);
                              } else {
                                console.error('User or user.id is undefined:', user);
                                alert('Data pengguna tidak valid. Tidak dapat menghapus.');
                              }
                            }}
                            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg hover:bg-red-50 text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Hapus</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Enhanced Pagination */}
        {users.last_page > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200/50 bg-gradient-to-r from-gray-50 to-blue-50/30">
            <div className="text-sm text-gray-600">
              Menampilkan <span className="font-semibold text-gray-800">{users.data.length}</span> dari{' '}
              <span className="font-semibold text-gray-800">{users.total}</span> pengguna
            </div>
            <div className="flex gap-2">
              {users.links.map((link, index) => (
                <Button
                  key={index}
                  variant={link.active ? 'default' : 'outline'}
                  size="sm"
                  disabled={!link.url}
                  onClick={() => link.url && router.get(link.url)}
                  className={cn(
                    "px-4 py-2 rounded-lg transition-all duration-300",
                    link.active
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-100/50"
                      : "bg-white/60 backdrop-blur-sm border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md hover:shadow-blue-100/50"
                  )}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
