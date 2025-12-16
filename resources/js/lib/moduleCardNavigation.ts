/**
 * Module Card Navigation Utility
 * 
 * This module provides the mapping between module card titles and their
 * corresponding navigation URLs for the Admin Dashboard Module Summary.
 * 
 * **Feature: admin-dashboard-uiux**
 * **Validates: Requirements 7.4**
 */

export interface ModuleCard {
  title: string
  href: string
}

/**
 * Module card navigation mapping
 * Maps module titles to their corresponding URLs
 * 
 * As per Requirements 7.4:
 * - SSD → /admin/ssd
 * - Standar Pelayanan → /admin/standar-pelayanan
 * - Profil Konten → /admin/profile-content
 * - Menu → /admin/menu
 * - Media Files → /admin/media
 * - Admin Users → /admin/users
 */
export const MODULE_CARD_ROUTES: Record<string, string> = {
  'SSD (FAQ)': '/admin/ssd',
  'Standar Pelayanan': '/admin/standar-pelayanan',
  'Profil Konten': '/admin/profile-content',
  'Menu': '/admin/menu',
  'Media Files': '/admin/media',
  'Admin Users': '/admin/users',
}

/**
 * All module cards with their metadata
 */
export const MODULE_CARDS: ModuleCard[] = [
  { title: 'SSD (FAQ)', href: '/admin/ssd' },
  { title: 'Standar Pelayanan', href: '/admin/standar-pelayanan' },
  { title: 'Profil Konten', href: '/admin/profile-content' },
  { title: 'Menu', href: '/admin/menu' },
  { title: 'Media Files', href: '/admin/media' },
  { title: 'Admin Users', href: '/admin/users' },
]

/**
 * Get the navigation URL for a module card title
 * @param title - The module card title
 * @returns The corresponding URL or undefined if not found
 */
export function getModuleCardUrl(title: string): string | undefined {
  if (Object.prototype.hasOwnProperty.call(MODULE_CARD_ROUTES, title)) {
    return MODULE_CARD_ROUTES[title]
  }
  return undefined
}

/**
 * Validate that a module card title has a valid URL mapping
 * @param title - The module card title
 * @returns true if the title has a valid URL mapping
 */
export function isValidModuleCard(title: string): boolean {
  return Object.prototype.hasOwnProperty.call(MODULE_CARD_ROUTES, title)
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
 * Get all valid module card titles
 * @returns Array of all valid module card titles
 */
export function getAllModuleCardTitles(): string[] {
  return Object.keys(MODULE_CARD_ROUTES)
}

/**
 * Get the expected number of module cards (6 as per Requirements 7.1)
 * @returns The expected count of module cards
 */
export function getExpectedModuleCardCount(): number {
  return 6
}
