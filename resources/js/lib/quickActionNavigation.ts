/**
 * Quick Action Navigation Utility
 * 
 * This module provides the mapping between quick action labels and their
 * corresponding navigation URLs for the Admin Dashboard.
 * 
 * **Feature: admin-dashboard-uiux**
 * **Validates: Requirements 2.3**
 */

export interface QuickAction {
  label: string
  href: string
  group: 'content-creation' | 'management-tools'
}

/**
 * Quick action navigation mapping
 * Maps action labels to their corresponding URLs
 */
export const QUICK_ACTION_ROUTES: Record<string, string> = {
  'Tambah Berita': '/admin/berita/create',
  'Tambah Pengumuman': '/admin/pengumuman/create',
  'Upload Foto': '/admin/gallery/create',
  'Tambah Dokumen PPID': '/admin/ppid/create',
  'Tambah FAQ': '/admin/ssd/create',
  'Upload Media': '/admin/media',
}

/**
 * All quick actions with their metadata
 */
export const QUICK_ACTIONS: QuickAction[] = [
  { label: 'Tambah Berita', href: '/admin/berita/create', group: 'content-creation' },
  { label: 'Tambah Pengumuman', href: '/admin/pengumuman/create', group: 'content-creation' },
  { label: 'Upload Foto', href: '/admin/gallery/create', group: 'content-creation' },
  { label: 'Tambah Dokumen PPID', href: '/admin/ppid/create', group: 'content-creation' },
  { label: 'Tambah FAQ', href: '/admin/ssd/create', group: 'management-tools' },
  { label: 'Upload Media', href: '/admin/media', group: 'management-tools' },
]

/**
 * Get the navigation URL for a quick action label
 * @param label - The quick action label
 * @returns The corresponding URL or undefined if not found
 */
export function getQuickActionUrl(label: string): string | undefined {
  if (Object.prototype.hasOwnProperty.call(QUICK_ACTION_ROUTES, label)) {
    return QUICK_ACTION_ROUTES[label]
  }
  return undefined
}

/**
 * Validate that a quick action label has a valid URL mapping
 * @param label - The quick action label
 * @returns true if the label has a valid URL mapping
 */
export function isValidQuickAction(label: string): boolean {
  return Object.prototype.hasOwnProperty.call(QUICK_ACTION_ROUTES, label)
}

/**
 * Get all quick actions for a specific group
 * @param group - The group to filter by
 * @returns Array of quick actions in the specified group
 */
export function getQuickActionsByGroup(group: QuickAction['group']): QuickAction[] {
  return QUICK_ACTIONS.filter(action => action.group === group)
}

/**
 * Validate that a URL matches the expected pattern for admin routes
 * @param url - The URL to validate
 * @returns true if the URL is a valid admin route
 */
export function isValidAdminRoute(url: string): boolean {
  return url.startsWith('/admin/')
}

/**
 * Get all valid quick action labels
 * @returns Array of all valid quick action labels
 */
export function getAllQuickActionLabels(): string[] {
  return Object.keys(QUICK_ACTION_ROUTES)
}
