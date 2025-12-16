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
  Eye,
  EyeOff,
  Pencil,
  Trash2,
  HelpCircle,
} from 'lucide-react';

interface Ssd {
  id: string;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

interface Props {
  ssd: Ssd;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
  categories: Record<string, string>;
}

export function SortableSsdItem({
  ssd,
  isSelected,
  onSelect,
  onDelete,
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
  } = useSortable({ id: ssd.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Strip HTML tags for preview
  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const answerPreview = stripHtml(ssd.answer).substring(0, 150);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-lg border bg-card p-4 ${
        isSelected ? 'ring-2 ring-primary' : ''
      } ${!ssd.is_active ? 'opacity-60' : ''}`}
    >
      <div className="flex items-start gap-4">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-muted mt-1"
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>

        {/* Checkbox */}
        <div className="mt-1">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onSelect(ssd.id)}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <HelpCircle className="h-4 w-4 text-primary flex-shrink-0" />
                <h3 className="font-medium text-sm line-clamp-2">{ssd.question}</h3>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 ml-6">
                {answerPreview}{answerPreview.length >= 150 ? '...' : ''}
              </p>
              <div className="flex items-center gap-2 mt-2 ml-6">
                <Badge variant="outline" className="text-xs">
                  {categories[ssd.category] || ssd.category}
                </Badge>
                {!ssd.is_active && (
                  <Badge variant="secondary" className="text-xs">
                    <EyeOff className="h-3 w-3 mr-1" />
                    Nonaktif
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">
                  {new Date(ssd.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>

            {/* Actions Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={route('admin.ssd.show', ssd.id)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Lihat
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={route('admin.ssd.edit', ssd.id)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onToggleActive(ssd.id)}>
                  {ssd.is_active ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-2" />
                      Nonaktifkan
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Aktifkan
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(ssd.id)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Hapus
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
