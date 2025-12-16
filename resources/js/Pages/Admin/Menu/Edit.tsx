import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Switch } from '@/Components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';

interface MenuItem {
  id: number;
  label: string;
  url: string | null;
  parent_id: number | null;
  order: number;
  location: string;
  icon: string | null;
  is_visible: boolean;
}

interface ParentMenu {
  id: number;
  label: string;
}

interface Props {
  menu: MenuItem;
  locations: Record<string, string>;
  parentMenus: ParentMenu[];
}

export default function Edit({ menu, locations, parentMenus }: Props) {
  const { data, setData, put, processing, errors } = useForm({
    label: menu.label,
    url: menu.url || '',
    parent_id: menu.parent_id ? String(menu.parent_id) : '',
    location: menu.location,
    icon: menu.icon || '',
    is_visible: menu.is_visible,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('admin.menu.update', menu.id));
  };

  return (
    <AdminLayout>
      <Head title={`Edit Menu: ${menu.label}`} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={route('admin.menu.index', { location: menu.location })}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Edit Menu</h1>
            <p className="text-muted-foreground">
              Perbarui informasi menu "{menu.label}"
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Informasi Menu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Label */}
              <div className="space-y-2">
                <Label htmlFor="label">Label Menu *</Label>
                <Input
                  id="label"
                  value={data.label}
                  onChange={(e) => setData('label', e.target.value)}
                  placeholder="Contoh: Beranda, Tentang Kami"
                  className={errors.label ? 'border-destructive' : ''}
                />
                {errors.label && (
                  <p className="text-sm text-destructive">{errors.label}</p>
                )}
              </div>

              {/* URL */}
              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  value={data.url}
                  onChange={(e) => setData('url', e.target.value)}
                  placeholder="Contoh: /tentang-kami atau https://example.com"
                />
                <p className="text-sm text-muted-foreground">
                  Kosongkan jika menu hanya sebagai parent (dropdown)
                </p>
                {errors.url && (
                  <p className="text-sm text-destructive">{errors.url}</p>
                )}
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Lokasi *</Label>
                <Select
                  value={data.location}
                  onValueChange={(value) => setData('location', value)}
                >
                  <SelectTrigger className={errors.location ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Pilih lokasi" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(locations).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.location && (
                  <p className="text-sm text-destructive">{errors.location}</p>
                )}
              </div>

              {/* Parent Menu */}
              <div className="space-y-2">
                <Label htmlFor="parent_id">Parent Menu</Label>
                <Select
                  value={data.parent_id || 'none'}
                  onValueChange={(value) => setData('parent_id', value === 'none' ? '' : value)}
                >
                  <SelectTrigger className={errors.parent_id ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Pilih parent (opsional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Tidak ada (Menu Utama)</SelectItem>
                    {parentMenus.map((parent) => (
                      <SelectItem key={parent.id} value={String(parent.id)}>
                        {parent.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Pilih parent untuk membuat submenu (maksimal 2 level)
                </p>
                {errors.parent_id && (
                  <p className="text-sm text-destructive">{errors.parent_id}</p>
                )}
              </div>

              {/* Icon */}
              <div className="space-y-2">
                <Label htmlFor="icon">Icon (opsional)</Label>
                <Input
                  id="icon"
                  value={data.icon}
                  onChange={(e) => setData('icon', e.target.value)}
                  placeholder="Contoh: home, info, file-text"
                />
                <p className="text-sm text-muted-foreground">
                  Nama icon dari Lucide Icons
                </p>
                {errors.icon && (
                  <p className="text-sm text-destructive">{errors.icon}</p>
                )}
              </div>

              {/* Visibility */}
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="is_visible">Tampilkan Menu</Label>
                  <p className="text-sm text-muted-foreground">
                    Menu akan ditampilkan di navigasi website
                  </p>
                </div>
                <Switch
                  id="is_visible"
                  checked={data.is_visible}
                  onCheckedChange={(checked) => setData('is_visible', checked)}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 pt-4">
                <Button type="submit" disabled={processing}>
                  <Save className="h-4 w-4 mr-2" />
                  Simpan Perubahan
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href={route('admin.menu.index', { location: menu.location })}>
                    Batal
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </AdminLayout>
  );
}
