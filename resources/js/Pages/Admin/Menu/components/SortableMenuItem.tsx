import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Link, router } from '@inertiajs/react';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import {
  GripVertical,
  MoreVertical,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
  ChevronRight,
  ExternalLink,
  Plus,
  Link as LinkIcon,
  FileText,
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
  children?: MenuItem[];
}

interface Props {
  menu: MenuItem;
  onDelete: (id: number) => void;
  onToggleVisible: (id: number) => void;
  locations: Record<string, string>;
  isChild?: boolean;
}

export function SortableMenuItem({
  menu,
  onDelete,
  onToggleVisible,
  locations,
  isChild = false,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: menu.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleDeleteChild = (id: number) => {
    if (confirm('Hapus submenu ini?')) {
      router.delete(route('admin.menu.destroy', id));
    }
  };

  const handleToggleChildVisible = (id: number) => {
    router.post(route('admin.menu.toggle-visible', id), {}, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-gray-100/30 hover:shadow-xl hover:shadow-blue-100/40 transition-all duration-300 hover:scale-[1.02] ${
        !menu.is_visible ? 'opacity-60' : ''
      } ${isChild ? 'ml-8 border-gray-200/50' : ''}`}
    >
      <div className={`p-4 ${!isChild ? 'bg-gradient-to-r from-white/60 to-blue-50/30 rounded-t-2xl' : ''}`}>
        <div className="flex items-center gap-4">
          {/* Drag Handle */}
          {!isChild && (
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-2 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:shadow-md hover:shadow-blue-100/50 transition-all duration-300"
            >
              <GripVertical className="h-5 w-5 text-gray-500 group-hover:text-blue-600 transition-colors duration-300" />
            </div>
          )}

          {/* Menu Icon/Indicator */}
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            isChild
              ? 'bg-gradient-to-br from-purple-100 to-purple-50 border border-purple-200'
              : 'bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-200'
          }`}>
            {menu.url ? (
              <LinkIcon className={`h-6 w-6 ${isChild ? 'text-purple-600' : 'text-blue-600'}`} />
            ) : (
              <FileText className={`h-6 w-6 ${isChild ? 'text-purple-600' : 'text-blue-600'}`} />
            )}
          </div>

          {/* Menu Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              {isChild && <ChevronRight className="h-4 w-4 text-purple-500" />}
              <h3 className="font-semibold text-gray-800 text-base group-hover:text-blue-600 transition-colors duration-300">
                {menu.label}
              </h3>
              {!menu.is_visible && (
                <Badge variant="secondary" className="px-2 py-1 bg-gray-100 text-gray-600 border border-gray-200 text-xs font-medium rounded-full">
                  <EyeOff className="h-3 w-3 mr-1" />
                  Tersembunyi
                </Badge>
              )}
            </div>
            {menu.url && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ExternalLink className="h-3 w-3 text-gray-400" />
                <span className="truncate font-medium">{menu.url}</span>
              </div>
            )}
          </div>

          {/* Children Count */}
          {menu.children && menu.children.length > 0 && (
            <div className="px-3 py-1 bg-gradient-to-r from-yellow-100 to-yellow-50 border border-yellow-200 rounded-full">
              <span className="text-sm font-semibold text-yellow-700">
                {menu.children.length} submenu
              </span>
            </div>
          )}

          {/* Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-200 hover:bg-white hover:border-blue-300 hover:shadow-md hover:shadow-blue-100/50 transition-all duration-300"
              >
                <MoreVertical className="h-4 w-4 text-gray-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl border-2 border-gray-200 shadow-xl bg-white/95 backdrop-blur-sm">
              <DropdownMenuItem asChild className="rounded-lg hover:bg-blue-50 focus:bg-blue-100">
                <Link href={route('admin.menu.show', menu.id)} className="flex items-center">
                  <Eye className="h-4 w-4 mr-2 text-blue-600" />
                  Lihat
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="rounded-lg hover:bg-blue-50 focus:bg-blue-100">
                <Link href={route('admin.menu.edit', menu.id)} className="flex items-center">
                  <Pencil className="h-4 w-4 mr-2 text-blue-600" />
                  Edit
                </Link>
              </DropdownMenuItem>
              {!isChild && !menu.parent_id && (
                <DropdownMenuItem asChild className="rounded-lg hover:bg-green-50 focus:bg-green-100">
                  <Link href={route('admin.menu.create', { location: menu.location, parent_id: menu.id })} className="flex items-center">
                    <Plus className="h-4 w-4 mr-2 text-green-600" />
                    Tambah Submenu
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => onToggleVisible(menu.id)}
                className="rounded-lg hover:bg-yellow-50 focus:bg-yellow-100"
              >
                {menu.is_visible ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2 text-yellow-600" />
                    Sembunyikan
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2 text-green-600" />
                    Tampilkan
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(menu.id)}
                className="rounded-lg hover:bg-red-50 focus:bg-red-100 text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Children (Submenus) */}
      {menu.children && menu.children.length > 0 && (
        <div className="border-t border-gray-200/50 bg-gradient-to-br from-gray-50/50 to-white/30 p-4 space-y-3">
          {menu.children.map((child) => (
            <div
              key={child.id}
              className={`flex items-center gap-4 p-3 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-200/50 hover:bg-white hover:border-purple-300 hover:shadow-md hover:shadow-purple-100/50 transition-all duration-300 ${
                !child.is_visible ? 'opacity-60' : ''
              }`}
            >
              <ChevronRight className="h-4 w-4 text-purple-500 ml-1" />
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-purple-50 border border-purple-200 flex items-center justify-center">
                {child.url ? (
                  <LinkIcon className="h-5 w-5 text-purple-600" />
                ) : (
                  <FileText className="h-5 w-5 text-purple-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-800 text-sm">{child.label}</span>
                  {!child.is_visible && (
                    <Badge variant="secondary" className="px-2 py-0.5 bg-gray-100 text-gray-600 border border-gray-200 text-xs font-medium rounded-full">
                      <EyeOff className="h-2.5 w-2.5 mr-1" />
                      Tersembunyi
                    </Badge>
                  )}
                </div>
                {child.url && (
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <ExternalLink className="h-3 w-3 text-gray-400" />
                    <span className="truncate">{child.url}</span>
                  </div>
                )}
              </div>

              {/* Child Actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg bg-white/60 backdrop-blur-sm border border-gray-200 hover:bg-white hover:border-purple-300 hover:shadow-md hover:shadow-purple-100/50 transition-all duration-300"
                  >
                    <MoreVertical className="h-3.5 w-3.5 text-gray-600" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-lg border border-gray-200 shadow-lg bg-white/95 backdrop-blur-sm">
                  <DropdownMenuItem asChild className="rounded-md hover:bg-blue-50 focus:bg-blue-100">
                    <Link href={route('admin.menu.show', child.id)} className="flex items-center">
                      <Eye className="h-4 w-4 mr-2 text-blue-600" />
                      Lihat
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-md hover:bg-blue-50 focus:bg-blue-100">
                    <Link href={route('admin.menu.edit', child.id)} className="flex items-center">
                      <Pencil className="h-4 w-4 mr-2 text-blue-600" />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleToggleChildVisible(child.id)}
                    className="rounded-md hover:bg-yellow-50 focus:bg-yellow-100"
                  >
                    {child.is_visible ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-2 text-yellow-600" />
                        Sembunyikan
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2 text-green-600" />
                        Tampilkan
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleDeleteChild(child.id)}
                    className="rounded-md hover:bg-red-50 focus:bg-red-100 text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Hapus
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
