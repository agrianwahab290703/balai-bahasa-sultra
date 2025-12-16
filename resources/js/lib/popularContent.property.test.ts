import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import {
  RANK_MEDALS,
  CONTENT_TYPE_ICONS,
  EMPTY_STATE_MESSAGES,
  sortPopularContent,
  addMedalIndicators,
  sortAndAddMedals,
  getCulturalIconName,
  isValidContentType,
  getEmptyStateMessage,
  isContentEmpty,
  verifySortingOrder,
  verifyMedalAssignment,
  verifyCulturalIcon,
  getMetricValue,
  type PopularItem,
  type PopularItemWithMedal,
  type ContentType,
  type MetricType,
} from './popularContent'

/**
 * **Feature: admin-dashboard-uiux, Property 1: Popular Content Sorting**
 * **Validates: Requirements 4.1, 5.1, 6.1**
 * 
 * Property: For any list of popular content items (berita, PPID, standar pelayanan),
 * the items SHALL be sorted in descending order by their respective metric
 * (view_count for berita, download_count for PPID and standar pelayanan),
 * and the top 3 items SHALL have medal indicators (🥇, 🥈, 🥉).
 */

// Arbitrary for generating popular items
// Use a simple date string format to avoid invalid date issues
const popularItemArbitrary = fc.record({
  id: fc.integer({ min: 1, max: 10000 }),
  title: fc.string({ minLength: 1, maxLength: 100 }),
  views: fc.integer({ min: 0, max: 100000 }),
  downloads: fc.integer({ min: 0, max: 100000 }),
  type: fc.constantFrom('berita', 'ppid', 'standar'),
  created_at: fc.tuple(
    fc.integer({ min: 2020, max: 2025 }),
    fc.integer({ min: 1, max: 12 }),
    fc.integer({ min: 1, max: 28 })
  ).map(([year, month, day]) => `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`),
})

// Arbitrary for array of popular items
const popularItemsArbitrary = fc.array(popularItemArbitrary, { minLength: 0, maxLength: 10 })

// Arbitrary for content types
const contentTypeArbitrary = fc.constantFrom<ContentType>('berita', 'ppid', 'standar')

// Arbitrary for metric types
const metricTypeArbitrary = fc.constantFrom<MetricType>('views', 'downloads')

describe('Popular Content Sorting - Property Tests', () => {
  /**
   * **Feature: admin-dashboard-uiux, Property 1: Popular Content Sorting**
   * **Validates: Requirements 4.1, 5.1, 6.1**
   * 
   * Property 1.1: Sorted items are always in descending order by metric
   */
  it('sorted items are always in descending order by metric', () => {
    fc.assert(
      fc.property(popularItemsArbitrary, metricTypeArbitrary, (items, metric) => {
        const sorted = sortPopularContent(items, metric)
        
        // Verify descending order
        return verifySortingOrder(sorted, metric)
      }),
      { numRuns: 100 }
    )
  })

  /**
   * **Feature: admin-dashboard-uiux, Property 1: Popular Content Sorting**
   * **Validates: Requirements 4.1, 5.1, 6.1**
   * 
   * Property 1.2: Sorting preserves all original items (no items lost or added)
   */
  it('sorting preserves all original items', () => {
    fc.assert(
      fc.property(popularItemsArbitrary, metricTypeArbitrary, (items, metric) => {
        const sorted = sortPopularContent(items, metric)
        
        // Same length
        expect(sorted.length).toBe(items.length)
        
        // All original items are present
        const originalIds = items.map(i => i.id).sort()
        const sortedIds = sorted.map(i => i.id).sort()
        expect(sortedIds).toEqual(originalIds)
        
        return true
      }),
      { numRuns: 100 }
    )
  })

  /**
   * **Feature: admin-dashboard-uiux, Property 1: Popular Content Sorting**
   * **Validates: Requirements 4.1, 5.1, 6.1**
   * 
   * Property 1.3: Top 3 items get medal indicators (🥇, 🥈, 🥉)
   */
  it('top 3 items get medal indicators', () => {
    fc.assert(
      fc.property(
        fc.array(popularItemArbitrary, { minLength: 3, maxLength: 10 }),
        metricTypeArbitrary,
        (items, metric) => {
          const sortedWithMedals = sortAndAddMedals(items, metric)
          
          // Top 3 should have medals
          expect(sortedWithMedals[0].medal).toBe('🥇')
          expect(sortedWithMedals[1].medal).toBe('🥈')
          expect(sortedWithMedals[2].medal).toBe('🥉')
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * **Feature: admin-dashboard-uiux, Property 1: Popular Content Sorting**
   * **Validates: Requirements 4.1, 5.1, 6.1**
   * 
   * Property 1.4: Items beyond top 3 do not have medal indicators
   */
  it('items beyond top 3 do not have medal indicators', () => {
    fc.assert(
      fc.property(
        fc.array(popularItemArbitrary, { minLength: 4, maxLength: 10 }),
        metricTypeArbitrary,
        (items, metric) => {
          const sortedWithMedals = sortAndAddMedals(items, metric)
          
          // Items 4+ should not have medals
          for (let i = 3; i < sortedWithMedals.length; i++) {
            expect(sortedWithMedals[i].medal).toBeUndefined()
          }
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * **Feature: admin-dashboard-uiux, Property 1: Popular Content Sorting**
   * **Validates: Requirements 4.1, 5.1, 6.1**
   * 
   * Property 1.5: Medal assignment is verified correctly
   */
  it('medal assignment is verified correctly', () => {
    fc.assert(
      fc.property(popularItemsArbitrary, metricTypeArbitrary, (items, metric) => {
        const sortedWithMedals = sortAndAddMedals(items, metric)
        
        return verifyMedalAssignment(sortedWithMedals)
      }),
      { numRuns: 100 }
    )
  })

  /**
   * **Feature: admin-dashboard-uiux, Property 1: Popular Content Sorting**
   * **Validates: Requirements 4.1, 5.1, 6.1**
   * 
   * Property 1.6: Sorting is idempotent (sorting twice gives same result)
   */
  it('sorting is idempotent', () => {
    fc.assert(
      fc.property(popularItemsArbitrary, metricTypeArbitrary, (items, metric) => {
        const sortedOnce = sortPopularContent(items, metric)
        const sortedTwice = sortPopularContent(sortedOnce, metric)
        
        // Both should have same order
        for (let i = 0; i < sortedOnce.length; i++) {
          expect(sortedTwice[i].id).toBe(sortedOnce[i].id)
        }
        
        return true
      }),
      { numRuns: 100 }
    )
  })

  /**
   * **Feature: admin-dashboard-uiux, Property 1: Popular Content Sorting**
   * **Validates: Requirements 4.1, 5.1, 6.1**
   * 
   * Property 1.7: First item always has highest metric value
   */
  it('first item always has highest metric value', () => {
    fc.assert(
      fc.property(
        fc.array(popularItemArbitrary, { minLength: 1, maxLength: 10 }),
        metricTypeArbitrary,
        (items, metric) => {
          const sorted = sortPopularContent(items, metric)
          const firstValue = getMetricValue(sorted[0], metric)
          
          // First item should have highest or equal value
          for (const item of sorted) {
            expect(firstValue).toBeGreaterThanOrEqual(getMetricValue(item, metric))
          }
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })
})

/**
 * **Feature: admin-dashboard-uiux, Property 2: Cultural Icon Consistency**
 * **Validates: Requirements 4.2, 5.2, 6.2, 10.3**
 * 
 * Property: For any content item displayed in the dashboard (berita, PPID, standar pelayanan),
 * the item SHALL display the correct cultural icon based on its type:
 * Lontar for berita, Prasasti for PPID, CanangSari for standar pelayanan.
 */
describe('Cultural Icon Consistency - Property Tests', () => {
  /**
   * **Feature: admin-dashboard-uiux, Property 2: Cultural Icon Consistency**
   * **Validates: Requirements 4.2, 5.2, 6.2, 10.3**
   * 
   * Property 2.1: Every content type maps to the correct cultural icon
   */
  it('every content type maps to the correct cultural icon', () => {
    fc.assert(
      fc.property(contentTypeArbitrary, (type) => {
        return verifyCulturalIcon(type)
      }),
      { numRuns: 100 }
    )
  })

  /**
   * **Feature: admin-dashboard-uiux, Property 2: Cultural Icon Consistency**
   * **Validates: Requirements 4.2, 5.2, 6.2, 10.3**
   * 
   * Property 2.2: Berita content type always maps to Lontar icon
   */
  it('berita content type always maps to Lontar icon', () => {
    fc.assert(
      fc.property(fc.constant('berita' as ContentType), (type) => {
        const iconName = getCulturalIconName(type)
        expect(iconName).toBe('Lontar')
        return true
      }),
      { numRuns: 100 }
    )
  })

  /**
   * **Feature: admin-dashboard-uiux, Property 2: Cultural Icon Consistency**
   * **Validates: Requirements 4.2, 5.2, 6.2, 10.3**
   * 
   * Property 2.3: PPID content type always maps to Prasasti icon
   */
  it('ppid content type always maps to Prasasti icon', () => {
    fc.assert(
      fc.property(fc.constant('ppid' as ContentType), (type) => {
        const iconName = getCulturalIconName(type)
        expect(iconName).toBe('Prasasti')
        return true
      }),
      { numRuns: 100 }
    )
  })

  /**
   * **Feature: admin-dashboard-uiux, Property 2: Cultural Icon Consistency**
   * **Validates: Requirements 4.2, 5.2, 6.2, 10.3**
   * 
   * Property 2.4: Standar pelayanan content type always maps to CanangSari icon
   */
  it('standar content type always maps to CanangSari icon', () => {
    fc.assert(
      fc.property(fc.constant('standar' as ContentType), (type) => {
        const iconName = getCulturalIconName(type)
        expect(iconName).toBe('CanangSari')
        return true
      }),
      { numRuns: 100 }
    )
  })

  /**
   * **Feature: admin-dashboard-uiux, Property 2: Cultural Icon Consistency**
   * **Validates: Requirements 4.2, 5.2, 6.2, 10.3**
   * 
   * Property 2.5: Icon mapping is consistent across multiple calls
   */
  it('icon mapping is consistent across multiple calls', () => {
    fc.assert(
      fc.property(contentTypeArbitrary, fc.integer({ min: 1, max: 10 }), (type, times) => {
        const firstCall = getCulturalIconName(type)
        
        for (let i = 0; i < times; i++) {
          expect(getCulturalIconName(type)).toBe(firstCall)
        }
        
        return true
      }),
      { numRuns: 100 }
    )
  })

  /**
   * **Feature: admin-dashboard-uiux, Property 2: Cultural Icon Consistency**
   * **Validates: Requirements 4.2, 5.2, 6.2, 10.3**
   * 
   * Property 2.6: All content types have defined icons
   */
  it('all content types have defined icons', () => {
    fc.assert(
      fc.property(contentTypeArbitrary, (type) => {
        const iconName = getCulturalIconName(type)
        expect(iconName).toBeDefined()
        expect(iconName.length).toBeGreaterThan(0)
        return true
      }),
      { numRuns: 100 }
    )
  })
})

/**
 * **Feature: admin-dashboard-uiux, Property 8: Empty State Handling**
 * **Validates: Requirements 4.5, 5.5, 6.5**
 * 
 * Property: For any content list (berita, PPID, standar pelayanan) that is empty,
 * the component SHALL display a friendly empty state message with muted styling
 * instead of rendering an empty container.
 */
describe('Empty State Handling - Property Tests', () => {
  /**
   * **Feature: admin-dashboard-uiux, Property 8: Empty State Handling**
   * **Validates: Requirements 4.5, 5.5, 6.5**
   * 
   * Property 8.1: Empty arrays are correctly identified as empty
   */
  it('empty arrays are correctly identified as empty', () => {
    fc.assert(
      fc.property(fc.constant([]), (items) => {
        return isContentEmpty(items) === true
      }),
      { numRuns: 100 }
    )
  })

  /**
   * **Feature: admin-dashboard-uiux, Property 8: Empty State Handling**
   * **Validates: Requirements 4.5, 5.5, 6.5**
   * 
   * Property 8.2: Non-empty arrays are correctly identified as not empty
   */
  it('non-empty arrays are correctly identified as not empty', () => {
    fc.assert(
      fc.property(
        fc.array(popularItemArbitrary, { minLength: 1, maxLength: 10 }),
        (items) => {
          return isContentEmpty(items) === false
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * **Feature: admin-dashboard-uiux, Property 8: Empty State Handling**
   * **Validates: Requirements 4.5, 5.5, 6.5**
   * 
   * Property 8.3: Every content type has a defined empty state message
   */
  it('every content type has a defined empty state message', () => {
    fc.assert(
      fc.property(contentTypeArbitrary, (type) => {
        const message = getEmptyStateMessage(type)
        expect(message).toBeDefined()
        expect(message.length).toBeGreaterThan(0)
        return true
      }),
      { numRuns: 100 }
    )
  })

  /**
   * **Feature: admin-dashboard-uiux, Property 8: Empty State Handling**
   * **Validates: Requirements 4.5, 5.5, 6.5**
   * 
   * Property 8.4: Empty state messages are in Indonesian
   */
  it('empty state messages contain Indonesian text', () => {
    fc.assert(
      fc.property(contentTypeArbitrary, (type) => {
        const message = getEmptyStateMessage(type)
        // Indonesian messages should contain "Belum ada data"
        expect(message).toContain('Belum ada data')
        return true
      }),
      { numRuns: 100 }
    )
  })

  /**
   * **Feature: admin-dashboard-uiux, Property 8: Empty State Handling**
   * **Validates: Requirements 4.5, 5.5, 6.5**
   * 
   * Property 8.5: Null/undefined arrays are treated as empty
   */
  it('null and undefined arrays are treated as empty', () => {
    expect(isContentEmpty(null as unknown as PopularItem[])).toBe(true)
    expect(isContentEmpty(undefined as unknown as PopularItem[])).toBe(true)
  })
})

describe('Popular Content - Unit Tests', () => {
  /**
   * Verify exact medal mappings
   */
  it('rank 1 gets gold medal 🥇', () => {
    expect(RANK_MEDALS[1]).toBe('🥇')
  })

  it('rank 2 gets silver medal 🥈', () => {
    expect(RANK_MEDALS[2]).toBe('🥈')
  })

  it('rank 3 gets bronze medal 🥉', () => {
    expect(RANK_MEDALS[3]).toBe('🥉')
  })

  /**
   * Verify exact icon mappings
   */
  it('berita uses Lontar cultural icon', () => {
    expect(CONTENT_TYPE_ICONS.berita).toBe('Lontar')
  })

  it('ppid uses Prasasti cultural icon', () => {
    expect(CONTENT_TYPE_ICONS.ppid).toBe('Prasasti')
  })

  it('standar uses CanangSari cultural icon', () => {
    expect(CONTENT_TYPE_ICONS.standar).toBe('CanangSari')
  })

  /**
   * Verify empty state messages
   */
  it('berita has correct empty state message', () => {
    expect(EMPTY_STATE_MESSAGES.berita).toBe('Belum ada data berita')
  })

  it('ppid has correct empty state message', () => {
    expect(EMPTY_STATE_MESSAGES.ppid).toBe('Belum ada data dokumen PPID')
  })

  it('standar has correct empty state message', () => {
    expect(EMPTY_STATE_MESSAGES.standar).toBe('Belum ada data standar pelayanan')
  })

  /**
   * Verify isValidContentType
   */
  it('isValidContentType returns true for valid types', () => {
    expect(isValidContentType('berita')).toBe(true)
    expect(isValidContentType('ppid')).toBe(true)
    expect(isValidContentType('standar')).toBe(true)
  })

  it('isValidContentType returns false for invalid types', () => {
    expect(isValidContentType('invalid')).toBe(false)
    expect(isValidContentType('')).toBe(false)
    expect(isValidContentType('news')).toBe(false)
  })
})
