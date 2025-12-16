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
  Eye,
  EyeOff,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

interface MenuItem {
  id: number;
  label: string;
  url: string | null;
  parent_id: number | null;
  order: number;
  location: string;
  icon: string | null;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
  parent?: MenuItem;
  children?: MenuItem[];
}

interface Props {
  menu: MenuItem;
  locations: Record<string, string>;
}

export default function Show({ menu, locations }: Props) {
  const handleDelete = () => {
    if (confirm('Hapus menu ini? Semua submenu juga akan dihapus.')) {
      router.delete(route('admin.menu.destroy', menu.id));
    }
  };

  const handleToggleVisible = () => {
    router.post(route('admin.menu.toggle-visible', menu.id));
  };

  return (
    <AdminLayout>
      <Head title={`Menu: ${menu.label}`} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href={route('admin.menu.index', { location: menu.location })}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold">{menu.label}</h1>
                <Badge variant={menu.is_visible ? 'default' : 'secondary'}>
                  {menu.is_visible ? 'Ditampilkan' : 'Tersembunyi'}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                {locations[menu.location]} • {menu.parent ? 'Submenu' : 'Menu Utama'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleToggleVisible}>
              {menu.is_visible ? (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Sembunyikan
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Tampilkan
                </>
              )}
            </Button>
            <Button variant="outline" asChild>
              <Link href={route('admin.menu.edit', menu.id)}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Hapus
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Menu Details */}
          <Card>
            <CardHeader>
              <CardTitle>Detail Menu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Label</p>
                <p className="mt-1">{menu.label}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">URL</p>
                <p className="mt-1">
                  {menu.url ? (
                    <span className="flex items-center gap-1">
                      <ExternalLink className="h-4 w-4" />
                      {menu.url}
                    </span>
                  ) : (
                    <span className="text-muted-foreground italic">Tidak ada URL</span>
                  )}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Lokasi</p>
                <p className="mt-1">{locations[menu.location]}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Icon</p>
                <p className="mt-1">
                  {menu.icon || <span className="text-muted-foreground italic">Tidak ada</span>}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Urutan</p>
                <p className="mt-1">{menu.order}</p>
              </div>

              {menu.parent && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Parent Menu</p>
                  <p className="mt-1">
                    <Link
                      href={route('admin.menu.show', menu.parent.id)}
                      className="text-primary hover:underline"
                    >
                      {menu.parent.label}
                    </Link>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Waktu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Dibuat</p>
                <p className="mt-1">
                  {new Date(menu.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Terakhir Diperbarui</p>
                <p className="mt-1">
                  {new Date(menu.updated_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Children (Submenus) */}
        {menu.children && menu.children.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Submenu ({menu.children.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {menu.children.map((child) => (
                  <div
                    key={child.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{child.label}</p>
                        {child.url && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <ExternalLink className="h-3 w-3" />
                            {child.url}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={child.is_visible ? 'default' : 'secondary'}>
                        {child.is_visible ? 'Ditampilkan' : 'Tersembunyi'}
                      </Badge>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={route('admin.menu.show', child.id)}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={route('admin.menu.edit', child.id)}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
