/**
 * Popular Content Sorting and Display Utilities
 * 
 * This module provides the sorting logic and display utilities for popular content
 * (berita, PPID documents, standar pelayanan) in the admin dashboard.
 * 
 * Requirements: 4.1, 5.1, 6.1 (sorting by metric)
 * Requirements: 4.2, 5.2, 6.2 (cultural icons)
 * Requirements: 4.5, 5.5, 6.5 (empty state handling)
 */

// Content types
export type ContentType = 'berita' | 'ppid' | 'standar'

// Metric types for sorting
export type MetricType = 'views' | 'downloads'

// Popular item interface
export interface PopularItem {
  id: number
  title: string
  views?: number
  downloads?: number
  type: string
  created_at: string
}

// Item with medal indicator
export interface PopularItemWithMedal extends PopularItem {
  medal?: string
  rank: number
}

// Medal indicators for top 3 - Requirements: 4.1, 5.1, 6.1
export const RANK_MEDALS: Record<number, string> = {
  1: '🥇',
  2: '🥈',
  3: '🥉',
}

// Cultural icon names for content types - Requirements: 4.2, 5.2, 6.2
// Lontar for berita, Prasasti for PPID, CanangSari for standar pelayanan
export const CONTENT_TYPE_ICONS: Record<ContentType, string> = {
  berita: 'Lontar',
  ppid: 'Prasasti',
  standar: 'CanangSari',
}

// Metric type mapping for content types
export const CONTENT_TYPE_METRICS: Record<ContentType, MetricType> = {
  berita: 'views',
  ppid: 'downloads',
  standar: 'downloads',
}

// Empty state messages - Requirements: 4.5, 5.5, 6.5
export const EMPTY_STATE_MESSAGES: Record<ContentType, string> = {
  berita: 'Belum ada data berita',
  ppid: 'Belum ada data dokumen PPID',
  standar: 'Belum ada data standar pelayanan',
}

/**
 * Get the metric value from an item based on metric type
 */
export function getMetricValue(item: PopularItem, metric: MetricType): number {
  if (metric === 'views') {
    return item.views ?? 0
  }
  return item.downloads ?? 0
}

/**
 * Sort popular content items by metric in descending order
 * Requirements: 4.1, 5.1, 6.1
 * 
 * @param items - Array of popular items to sort
 * @param metric - The metric to sort by ('views' or 'downloads')
 * @returns Sorted array in descending order by metric
 */
export function sortPopularContent(items: PopularItem[], metric: MetricType): PopularItem[] {
  return [...items].sort((a, b) => {
    const valueA = getMetricValue(a, metric)
    const valueB = getMetricValue(b, metric)
    return valueB - valueA // Descending order
  })
}

/**
 * Add medal indicators to sorted items
 * Top 3 items get medal indicators (🥇, 🥈, 🥉)
 * Requirements: 4.1, 5.1, 6.1
 * 
 * @param items - Array of popular items (should be pre-sorted)
 * @returns Array with medal indicators and rank added
 */
export function addMedalIndicators(items: PopularItem[]): PopularItemWithMedal[] {
  return items.map((item, index) => {
    const rank = index + 1
    return {
      ...item,
      rank,
      medal: rank <= 3 ? RANK_MEDALS[rank] : undefined,
    }
  })
}

/**
 * Sort and add medals in one operation
 * Requirements: 4.1, 5.1, 6.1
 */
export function sortAndAddMedals(items: PopularItem[], metric: MetricType): PopularItemWithMedal[] {
  const sorted = sortPopularContent(items, metric)
  return addMedalIndicators(sorted)
}

/**
 * Get the cultural icon name for a content type
 * Requirements: 4.2, 5.2, 6.2
 * 
 * @param type - The content type
 * @returns The cultural icon name
 */
export function getCulturalIconName(type: ContentType): string {
  return CONTENT_TYPE_ICONS[type]
}

/**
 * Check if a content type is valid
 */
export function isValidContentType(type: string): type is ContentType {
  return ['berita', 'ppid', 'standar'].includes(type)
}

/**
 * Get the appropriate metric for a content type
 */
export function getMetricForContentType(type: ContentType): MetricType {
  return CONTENT_TYPE_METRICS[type]
}

/**
 * Get empty state message for a content type
 * Requirements: 4.5, 5.5, 6.5
 */
export function getEmptyStateMessage(type: ContentType): string {
  return EMPTY_STATE_MESSAGES[type]
}

/**
 * Check if content list is empty
 * Requirements: 4.5, 5.5, 6.5
 */
export function isContentEmpty(items: PopularItem[]): boolean {
  return !items || items.length === 0
}

/**
 * Verify that items are sorted in descending order by metric
 * Used for property-based testing
 */
export function verifySortingOrder(items: PopularItem[], metric: MetricType): boolean {
  if (items.length <= 1) return true
  
  for (let i = 1; i < items.length; i++) {
    const prevValue = getMetricValue(items[i - 1], metric)
    const currValue = getMetricValue(items[i], metric)
    if (prevValue < currValue) {
      return false
    }
  }
  return true
}

/**
 * Verify that medals are correctly assigned to top 3 items
 * Used for property-based testing
 */
export function verifyMedalAssignment(items: PopularItemWithMedal[]): boolean {
  for (let i = 0; i < items.length; i++) {
    const rank = i + 1
    const item = items[i]
    
    if (rank <= 3) {
      // Top 3 should have medals
      if (item.medal !== RANK_MEDALS[rank]) {
        return false
      }
    } else {
      // Items beyond top 3 should not have medals
      if (item.medal !== undefined) {
        return false
      }
    }
  }
  return true
}

/**
 * Verify that a content type has the correct cultural icon
 * Used for property-based testing
 */
export function verifyCulturalIcon(type: ContentType): boolean {
  const iconName = getCulturalIconName(type)
  
  switch (type) {
    case 'berita':
      return iconName === 'Lontar'
    case 'ppid':
      return iconName === 'Prasasti'
    case 'standar':
      return iconName === 'CanangSari'
    default:
      return false
  }
}
