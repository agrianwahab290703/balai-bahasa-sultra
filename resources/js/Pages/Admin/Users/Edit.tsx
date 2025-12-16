import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Switch } from '@/Components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/ui/select';
import { ArrowLeft, Save, Eye, EyeOff, User, Key } from 'lucide-react';

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
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

const roleDescriptions: Record<string, string> = {
  super_admin: 'Akses penuh ke semua fitur termasuk manajemen pengguna',
  admin: 'Akses ke semua fitur konten, tidak bisa mengelola pengguna',
  editor: 'Hanya bisa mengelola konten (berita, galeri, dll)',
};

export default function Edit({ user, roles }: Props) {
  // Get initial tab from URL
  const urlParams = new URLSearchParams(window.location.search);
  const initialTab = urlParams.get('tab') || 'profile';
  
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Profile form
  const profileForm = useForm({
    name: user.name,
    email: user.email,
    role: user.role,
    is_active: user.is_active,
  });

  // Password form
  const passwordForm = useForm({
    password: '',
    password_confirmation: '',
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    profileForm.put(route('admin.users.update', user.id));
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    passwordForm.put(route('admin.users.update-password', user.id), {
      onSuccess: () => {
        passwordForm.reset();
      },
    });
  };

  const breadcrumbs = [
    { label: 'Pengguna', href: route('admin.users.index') },
    { label: 'Edit Pengguna' }
  ];

  return (
    <AdminLayout title={`Edit Pengguna - ${user.name}`} breadcrumbs={breadcrumbs}>
      <Head title={`Edit Pengguna - ${user.name}`} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={route('admin.users.index')}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Edit Pengguna</h1>
            <p className="text-muted-foreground">
              {user.name} ({user.email})
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="password" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              Password
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="mt-6">
            <form onSubmit={handleProfileSubmit}>
              <Card>
                <CardHeader>
                  <CardTitle>Informasi Profil</CardTitle>
                  <CardDescription>
                    Update data identitas dan role pengguna
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap *</Label>
                    <Input
                      id="name"
                      value={profileForm.data.name}
                      onChange={(e) => profileForm.setData('name', e.target.value)}
                      placeholder="Masukkan nama lengkap"
                      className={profileForm.errors.name ? 'border-destructive' : ''}
                    />
                    {profileForm.errors.name && (
                      <p className="text-sm text-destructive">{profileForm.errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileForm.data.email}
                      onChange={(e) => profileForm.setData('email', e.target.value)}
                      placeholder="contoh@email.com"
                      className={profileForm.errors.email ? 'border-destructive' : ''}
                    />
                    {profileForm.errors.email && (
                      <p className="text-sm text-destructive">{profileForm.errors.email}</p>
                    )}
                  </div>

                  {/* Role */}
                  <div className="space-y-2">
                    <Label htmlFor="role">Role *</Label>
                    <Select
                      value={profileForm.data.role || undefined}
                      onValueChange={(value) => profileForm.setData('role', value)}
                    >
                      <SelectTrigger className={profileForm.errors.role ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Pilih role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.filter(role => role && role.trim() !== '').map((role) => (
                          <SelectItem key={role} value={role}>
                            {roleLabels[role] || role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {profileForm.data.role && (
                      <p className="text-sm text-muted-foreground">
                        {roleDescriptions[profileForm.data.role]}
                      </p>
                    )}
                    {profileForm.errors.role && (
                      <p className="text-sm text-destructive">{profileForm.errors.role}</p>
                    )}
                  </div>

                  {/* Active Status */}
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label htmlFor="is_active">Status Aktif</Label>
                      <p className="text-sm text-muted-foreground">
                        Pengguna dapat login ke panel admin
                      </p>
                    </div>
                    <Switch
                      id="is_active"
                      checked={profileForm.data.is_active}
                      onCheckedChange={(checked) => profileForm.setData('is_active', checked)}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4 pt-4">
                    <Button type="submit" disabled={profileForm.processing}>
                      <Save className="h-4 w-4 mr-2" />
                      Simpan Perubahan
                    </Button>
                    <Button type="button" variant="outline" asChild>
                      <Link href={route('admin.users.index')}>
                        Batal
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          </TabsContent>

          {/* Password Tab */}
          <TabsContent value="password" className="mt-6">
            <form onSubmit={handlePasswordSubmit}>
              <Card>
                <CardHeader>
                  <CardTitle>Ubah Password</CardTitle>
                  <CardDescription>
                    Minimal 8 karakter, kombinasi huruf besar, kecil, dan angka
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password">Password Baru *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={passwordForm.data.password}
                        onChange={(e) => passwordForm.setData('password', e.target.value)}
                        placeholder="Masukkan password baru"
                        className={passwordForm.errors.password ? 'border-destructive pr-10' : 'pr-10'}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {passwordForm.errors.password && (
                      <p className="text-sm text-destructive">{passwordForm.errors.password}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password_confirmation">Konfirmasi Password *</Label>
                    <div className="relative">
                      <Input
                        id="password_confirmation"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={passwordForm.data.password_confirmation}
                        onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                        placeholder="Ulangi password baru"
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Password Requirements */}
                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-sm font-medium mb-2">Persyaratan Password:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li className={passwordForm.data.password.length >= 8 ? 'text-green-600' : ''}>
                        • Minimal 8 karakter
                      </li>
                      <li className={/[A-Z]/.test(passwordForm.data.password) ? 'text-green-600' : ''}>
                        • Minimal 1 huruf besar
                      </li>
                      <li className={/[a-z]/.test(passwordForm.data.password) ? 'text-green-600' : ''}>
                        • Minimal 1 huruf kecil
                      </li>
                      <li className={/[0-9]/.test(passwordForm.data.password) ? 'text-green-600' : ''}>
                        • Minimal 1 angka
                      </li>
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4 pt-4">
                    <Button type="submit" disabled={passwordForm.processing}>
                      <Save className="h-4 w-4 mr-2" />
                      Ubah Password
                    </Button>
                    <Button type="button" variant="outline" asChild>
                      <Link href={route('admin.users.index')}>
                        Batal
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
