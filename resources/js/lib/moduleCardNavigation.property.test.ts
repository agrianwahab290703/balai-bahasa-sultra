import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import {
  MODULE_CARD_ROUTES,
  MODULE_CARDS,
  getModuleCardUrl,
  isValidModuleCard,
  isValidAdminRoute,
  getAllModuleCardTitles,
  getExpectedModuleCardCount,
} from './moduleCardNavigation'

/**
 * **Feature: admin-dashboard-uiux, Property 5: Module Card Navigation**
 * **Validates: Requirements 7.4**
 * 
 * Property: For any module summary card, clicking the card SHALL navigate
 * to the correct module list page:
 * - /admin/ssd for SSD
 * - /admin/standar-pelayanan for Standar Pelayanan
 * - /admin/profile-content for Profil Konten
 * - /admin/menu for Menu
 * - /admin/media for Media Files
 * - /admin/users for Admin Users
 */

// Arbitrary for valid module card titles
const validModuleCardTitleArbitrary = fc.constantFrom(...getAllModuleCardTitles())

// Arbitrary for invalid module card titles (random strings not in the mapping)
const invalidModuleCardTitleArbitrary = fc.string({ minLength: 1, maxLength: 50 })
  .filter(s => !getAllModuleCardTitles().includes(s))

describe('Module Card Navigation - Property Tests', () => {
  /**
   * Property 5.1: Every valid module card title maps to a valid admin URL
   * **Validates: Requirements 7.4**
   */
  it('every valid module card title maps to a valid admin URL', () => {
    fc.assert(
      fc.property(validModuleCardTitleArbitrary, (title) => {
        const url = getModuleCardUrl(title)
        
        // URL must exist
        expect(url).toBeDefined()
        
        // URL must be a valid admin route
        expect(isValidAdminRoute(url!)).toBe(true)
        
        return true
      }),
      { numRuns: 100 }
    )
  })

  /**
   * Property 5.2: Module card URL mapping is consistent with MODULE_CARDS array
   * **Validates: Requirements 7.4**
   */
  it('module card URL mapping is consistent with MODULE_CARDS array', () => {
    fc.assert(
      fc.property(validModuleCardTitleArbitrary, (title) => {
        const urlFromRoutes = MODULE_CARD_ROUTES[title]
        const cardFromArray = MODULE_CARDS.find(c => c.title === title)
        
        // Both sources must agree on the URL
        expect(cardFromArray).toBeDefined()
        expect(cardFromArray!.href).toBe(urlFromRoutes)
        
        return true
      }),
      { numRuns: 100 }
    )
  })

  /**
   * Property 5.3: Invalid titles return undefined
   * **Validates: Requirements 7.4**
   */
  it('invalid titles return undefined', () => {
    fc.assert(
      fc.property(invalidModuleCardTitleArbitrary, (title) => {
        const url = getModuleCardUrl(title)
        return url === undefined
      }),
      { numRuns: 100 }
    )
  })

  /**
   * Property 5.4: isValidModuleCard correctly identifies valid titles
   * **Validates: Requirements 7.4**
   */
  it('isValidModuleCard correctly identifies valid titles', () => {
    fc.assert(
      fc.property(validModuleCardTitleArbitrary, (title) => {
        return isValidModuleCard(title) === true
      }),
      { numRuns: 100 }
    )
  })

  /**
   * Property 5.5: isValidModuleCard correctly rejects invalid titles
   * **Validates: Requirements 7.4**
   */
  it('isValidModuleCard correctly rejects invalid titles', () => {
    fc.assert(
      fc.property(invalidModuleCardTitleArbitrary, (title) => {
        return isValidModuleCard(title) === false
      }),
      { numRuns: 100 }
    )
  })

  /**
   * Property 5.6: All admin routes start with /admin/
   * **Validates: Requirements 7.4**
   */
  it('all admin routes start with /admin/', () => {
    fc.assert(
      fc.property(validModuleCardTitleArbitrary, (title) => {
        const url = getModuleCardUrl(title)
        return url !== undefined && url.startsWith('/admin/')
      }),
      { numRuns: 100 }
    )
  })

  /**
   * Property 5.7: Module card count matches expected count (6 cards)
   * **Validates: Requirements 7.1, 7.4**
   */
  it('module card count matches expected count', () => {
    expect(MODULE_CARDS.length).toBe(getExpectedModuleCardCount())
    expect(Object.keys(MODULE_CARD_ROUTES).length).toBe(getExpectedModuleCardCount())
  })
})

describe('Module Card Navigation - Specific URL Mapping Tests', () => {
  /**
   * Verify exact URL mappings as specified in Requirements 7.4
   */
  it('SSD (FAQ) navigates to /admin/ssd', () => {
    expect(getModuleCardUrl('SSD (FAQ)')).toBe('/admin/ssd')
  })

  it('Standar Pelayanan navigates to /admin/standar-pelayanan', () => {
    expect(getModuleCardUrl('Standar Pelayanan')).toBe('/admin/standar-pelayanan')
  })

  it('Profil Konten navigates to /admin/profile-content', () => {
    expect(getModuleCardUrl('Profil Konten')).toBe('/admin/profile-content')
  })

  it('Menu navigates to /admin/menu', () => {
    expect(getModuleCardUrl('Menu')).toBe('/admin/menu')
  })

  it('Media Files navigates to /admin/media', () => {
    expect(getModuleCardUrl('Media Files')).toBe('/admin/media')
  })

  it('Admin Users navigates to /admin/users', () => {
    expect(getModuleCardUrl('Admin Users')).toBe('/admin/users')
  })
})

describe('Module Card Navigation - Completeness Tests', () => {
  /**
   * Verify all 6 module cards are present as per Requirements 7.1
   */
  it('all 6 module cards are defined', () => {
    const expectedTitles = [
      'SSD (FAQ)',
      'Standar Pelayanan',
      'Profil Konten',
      'Menu',
      'Media Files',
      'Admin Users',
    ]
    
    const actualTitles = getAllModuleCardTitles()
    
    expectedTitles.forEach(title => {
      expect(actualTitles).toContain(title)
    })
  })

  it('each module card has a unique URL', () => {
    const urls = MODULE_CARDS.map(card => card.href)
    const uniqueUrls = new Set(urls)
    
    expect(uniqueUrls.size).toBe(urls.length)
  })

  it('each module card has a unique title', () => {
    const titles = MODULE_CARDS.map(card => card.title)
    const uniqueTitles = new Set(titles)
    
    expect(uniqueTitles.size).toBe(titles.length)
  })
})
