import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Link } from '@inertiajs/react';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Checkbox } from '@/Components/ui/checkbox';
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
  Star,
  StarOff,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
} from 'lucide-react';

interface Gallery {
  id: number;
  title: string;
  description: string | null;
  image: string | null;
  image_url: string | null;
  thumbnail_url: string | null;
  category: string | null;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  date: string;
}

interface Props {
  gallery: Gallery;
  isSelected: boolean;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
  onToggleFeatured: (id: number) => void;
  onToggleActive: (id: number) => void;
  categories: Record<string, string>;
}

export function SortableGalleryItem({
  gallery,
  isSelected,
  onSelect,
  onDelete,
  onToggleFeatured,
  onToggleActive,
  categories,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: gallery.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-lg border bg-card overflow-hidden ${
        isSelected ? 'ring-2 ring-primary' : ''
      } ${!gallery.is_active ? 'opacity-60' : ''}`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 z-10 cursor-grab active:cursor-grabbing p-1 rounded bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <GripVertical className="h-4 w-4" />
      </div>

      {/* Checkbox */}
      <div className="absolute top-2 right-2 z-10">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onSelect(gallery.id)}
          className="bg-white/80"
        />
      </div>

      {/* Featured Badge */}
      {gallery.is_featured && (
        <div className="absolute top-2 left-10 z-10">
          <Badge variant="default" className="bg-yellow-500">
            <Star className="h-3 w-3 mr-1" />
            Featured
          </Badge>
        </div>
      )}

      {/* Image */}
      <div className="aspect-square bg-muted">
        {(() => {
          const raw =
            gallery.thumbnail_url ||
            gallery.image_url ||
            gallery.image ||
            '';
          const src =
            raw.startsWith('http')
              ? raw
              : raw.includes('storage/')
              ? (raw.startsWith('/') ? raw : `/${raw}`)
              : raw
              ? `/storage/${raw}`
              : '';
          return src ? (
            <img
              src={src}
              alt={gallery.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No Image
            </div>
          );
        })()}
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-medium text-sm truncate" title={gallery.title}>
          {gallery.title}
        </h3>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-2">
            {gallery.category && (
              <Badge variant="outline" className="text-xs">
                {categories[gallery.category] || gallery.category}
              </Badge>
            )}
            {!gallery.is_active && (
              <Badge variant="secondary" className="text-xs">
                <EyeOff className="h-3 w-3 mr-1" />
                Hidden
              </Badge>
            )}
          </div>
          
          {/* Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={route('admin.gallery.edit', gallery.id)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onToggleFeatured(gallery.id)}>
                {gallery.is_featured ? (
                  <>
                    <StarOff className="h-4 w-4 mr-2" />
                    Unfeature
                  </>
                ) : (
                  <>
                    <Star className="h-4 w-4 mr-2" />
                    Feature
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onToggleActive(gallery.id)}>
                {gallery.is_active ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Hide
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Show
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(gallery.id)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{gallery.date}</p>
      </div>
    </div>
  );
}
