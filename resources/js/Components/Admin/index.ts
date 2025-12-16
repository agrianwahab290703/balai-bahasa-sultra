/**
 * Admin Components Index
 * Export all admin-related components for easy importing
 */

// Core components
export { DataTable } from './DataTable';
export type { DataTableProps, ColumnDef, PaginatedData, FilterConfig } from './DataTable';

export { BulkActions } from './BulkActions';
export type { BulkActionsProps, BulkAction } from './BulkActions';

// Layout components
export { default as Sidebar } from './Sidebar';
export { default as Header } from './Header';

// Rich Text Editor
export { RichTextEditor, useRichTextEditor } from './RichTextEditor';
export type { RichTextEditorProps } from './RichTextEditor';

// Media components
export { MediaPicker } from './MediaPicker';
export type { MediaPickerProps, MediaItem } from './MediaPicker';
