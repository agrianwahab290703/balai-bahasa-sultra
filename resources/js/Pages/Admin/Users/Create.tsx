import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Switch } from '@/Components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/ui/select';
import { ArrowLeft, Save, Eye, EyeOff, User, Mail, Shield, Lock, CheckCircle2, Circle } from 'lucide-react';

interface Props {
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

export default function Create({ roles }: Props) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'editor',
    is_active: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('admin.users.store'));
  };

  const breadcrumbs = [
    { label: 'Pengguna', href: route('admin.users.index') },
    { label: 'Tambah Pengguna' }
  ];

  return (
    <AdminLayout title="Tambah Pengguna" breadcrumbs={breadcrumbs}>
      <Head title="Tambah Pengguna" />

      <div className="space-y-8">
        {/* Hero Section - Glassmorphism Design */}
        <div className="relative bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl shadow-gray-100/30 overflow-hidden">
          {/* Floating Blur Elements */}
          <div className="absolute top-4 right-8 w-32 h-32 bg-gradient-to-br from-blue-200/60 to-indigo-100/60 rounded-full blur-2xl"></div>
          <div className="absolute top-16 left-12 w-24 h-24 bg-gradient-to-br from-green-200/50 to-emerald-100/50 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-8 right-20 w-36 h-36 bg-gradient-to-br from-purple-200/40 to-pink-100/40 rounded-full blur-2xl"></div>

          <div className="relative z-10 p-8">
            <div className="flex items-center gap-6">
              {/* Back Button */}
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="h-14 w-14 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 hover:bg-white hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300"
              >
                <Link href={route('admin.users.index')} className="flex items-center justify-center">
                  <ArrowLeft className="h-6 w-6 text-gray-700" />
                </Link>
              </Button>

              {/* Title Section */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-2">
                  Tambah Pengguna
                </h1>
                <p className="text-gray-600 text-lg font-medium">
                  Buat akun admin baru untuk panel administrasi
                </p>
              </div>

              {/* Floating Icon */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl shadow-blue-500/30 flex items-center justify-center">
                <User className="h-10 w-10 text-white" />
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Basic Information Card */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl shadow-xl shadow-gray-100/30 hover:shadow-2xl hover:shadow-blue-100/40 transition-all duration-300">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/60 border-b border-gray-100/50 p-6 rounded-t-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 flex items-center justify-center">
                    <User className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Informasi Dasar</h2>
                    <p className="text-gray-600 text-sm">Data identitas pengguna</p>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 space-y-6">
                {/* Name Field */}
                <div className="space-y-3">
                  <Label htmlFor="name" className="flex items-center gap-2 text-gray-700 font-medium">
                    <User className="h-4 w-4 text-blue-600" />
                    Nama Lengkap *
                  </Label>
                  <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="Masukkan nama lengkap"
                    className={`h-12 rounded-xl border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100/50 transition-all duration-300 ${errors.name ? 'border-red-400 focus:border-red-400 focus:ring-red-100/50' : ''}`}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 font-medium flex items-center gap-1">
                      <Circle className="h-3 w-3 fill-current" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div className="space-y-3">
                  <Label htmlFor="email" className="flex items-center gap-2 text-gray-700 font-medium">
                    <Mail className="h-4 w-4 text-blue-600" />
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    placeholder="contoh@email.com"
                    className={`h-12 rounded-xl border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100/50 transition-all duration-300 ${errors.email ? 'border-red-400 focus:border-red-400 focus:ring-red-100/50' : ''}`}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 font-medium flex items-center gap-1">
                      <Circle className="h-3 w-3 fill-current" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Role Field */}
                <div className="space-y-3">
                  <Label htmlFor="role" className="flex items-center gap-2 text-gray-700 font-medium">
                    <Shield className="h-4 w-4 text-blue-600" />
                    Role *
                  </Label>
                  <Select
                    value={data.role || undefined}
                    onValueChange={(value) => setData('role', value)}
                  >
                    <SelectTrigger className={`h-12 rounded-xl border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100/50 transition-all duration-300 ${errors.role ? 'border-red-400 focus:border-red-400 focus:ring-red-100/50' : ''}`}>
                      <SelectValue placeholder="Pilih role" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border border-gray-200 shadow-xl">
                      {roles.filter(role => role && role.trim() !== '').map((role) => (
                        <SelectItem key={role} value={role} className="rounded-lg">
                          {roleLabels[role] || role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {data.role && (
                    <div className="p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
                      <p className="text-sm text-blue-700 font-medium">
                        {roleDescriptions[data.role]}
                      </p>
                    </div>
                  )}
                  {errors.role && (
                    <p className="text-sm text-red-500 font-medium flex items-center gap-1">
                      <Circle className="h-3 w-3 fill-current" />
                      {errors.role}
                    </p>
                  )}
                </div>

                {/* Active Status */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100">
                  <div className="space-y-1">
                    <Label htmlFor="is_active" className="text-gray-700 font-medium">Status Aktif</Label>
                    <p className="text-sm text-gray-600">Pengguna dapat login ke panel admin</p>
                  </div>
                  <Switch
                    id="is_active"
                    checked={data.is_active}
                    onCheckedChange={(checked) => setData('is_active', checked)}
                    className="data-[state=checked]:bg-green-500 data-[state=checked]:shadow-lg data-[state=checked]:shadow-green-500/30"
                  />
                </div>
              </div>
            </div>

            {/* Password Card */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl shadow-xl shadow-gray-100/30 hover:shadow-2xl hover:shadow-indigo-100/40 transition-all duration-300">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-indigo-50/80 to-purple-50/60 border-b border-gray-100/50 p-6 rounded-t-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 flex items-center justify-center">
                    <Lock className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Password</h2>
                    <p className="text-gray-600 text-sm">Minimal 8 karakter, kombinasi huruf besar, kecil, dan angka</p>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 space-y-6">
                {/* Password Field */}
                <div className="space-y-3">
                  <Label htmlFor="password" className="flex items-center gap-2 text-gray-700 font-medium">
                    <Lock className="h-4 w-4 text-indigo-600" />
                    Password *
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={data.password}
                      onChange={(e) => setData('password', e.target.value)}
                      placeholder="Masukkan password"
                      className={`h-12 rounded-xl pr-12 border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100/50 transition-all duration-300 ${errors.password ? 'border-red-400 focus:border-red-400 focus:ring-red-100/50' : ''}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-300"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500 font-medium flex items-center gap-1">
                      <Circle className="h-3 w-3 fill-current" />
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-3">
                  <Label htmlFor="password_confirmation" className="flex items-center gap-2 text-gray-700 font-medium">
                    <Lock className="h-4 w-4 text-indigo-600" />
                    Konfirmasi Password *
                  </Label>
                  <div className="relative">
                    <Input
                      id="password_confirmation"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={data.password_confirmation}
                      onChange={(e) => setData('password_confirmation', e.target.value)}
                      placeholder="Ulangi password"
                      className="h-12 rounded-xl pr-12 border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100/50 transition-all duration-300"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-300"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {errors.password_confirmation && (
                    <p className="text-sm text-red-500 font-medium flex items-center gap-1">
                      <Circle className="h-3 w-3 fill-current" />
                      {errors.password_confirmation}
                    </p>
                  )}
                </div>

                {/* Password Requirements */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100">
                  <p className="text-sm font-semibold text-indigo-800 mb-3 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Persyaratan Password:
                  </p>
                  <ul className="space-y-2">
                    <li className={`text-sm font-medium flex items-center gap-2 transition-colors duration-300 ${data.password.length >= 8 ? 'text-green-600' : 'text-gray-600'}`}>
                      {data.password.length >= 8 ? (
                        <CheckCircle2 className="h-4 w-4 fill-current" />
                      ) : (
                        <Circle className="h-4 w-4" />
                      )}
                      Minimal 8 karakter
                    </li>
                    <li className={`text-sm font-medium flex items-center gap-2 transition-colors duration-300 ${/[A-Z]/.test(data.password) ? 'text-green-600' : 'text-gray-600'}`}>
                      {/[A-Z]/.test(data.password) ? (
                        <CheckCircle2 className="h-4 w-4 fill-current" />
                      ) : (
                        <Circle className="h-4 w-4" />
                      )}
                      Minimal 1 huruf besar
                    </li>
                    <li className={`text-sm font-medium flex items-center gap-2 transition-colors duration-300 ${/[a-z]/.test(data.password) ? 'text-green-600' : 'text-gray-600'}`}>
                      {/[a-z]/.test(data.password) ? (
                        <CheckCircle2 className="h-4 w-4 fill-current" />
                      ) : (
                        <Circle className="h-4 w-4" />
                      )}
                      Minimal 1 huruf kecil
                    </li>
                    <li className={`text-sm font-medium flex items-center gap-2 transition-colors duration-300 ${/[0-9]/.test(data.password) ? 'text-green-600' : 'text-gray-600'}`}>
                      {/[0-9]/.test(data.password) ? (
                        <CheckCircle2 className="h-4 w-4 fill-current" />
                      ) : (
                        <Circle className="h-4 w-4" />
                      )}
                      Minimal 1 angka
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons - Glassmorphism Design */}
          <div className="flex items-center gap-4 mt-8">
            <Button
              type="submit"
              disabled={processing}
              className="h-14 px-8 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <Save className="h-5 w-5 mr-2" />
              Simpan Pengguna
            </Button>

            <Button
              type="button"
              variant="outline"
              asChild
              className="h-14 px-8 rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-white/50 text-gray-700 font-semibold hover:bg-white hover:border-gray-300 hover:shadow-xl hover:shadow-gray-100/50 transition-all duration-300 hover:scale-[1.02]"
            >
              <Link href={route('admin.users.index')} className="flex items-center">
                Batal
              </Link>
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
