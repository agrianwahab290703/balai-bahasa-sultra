import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import {
  QUICK_ACTION_ROUTES,
  QUICK_ACTIONS,
  getQuickActionUrl,
  isValidQuickAction,
  getQuickActionsByGroup,
  isValidAdminRoute,
  getAllQuickActionLabels,
  type QuickAction,
} from './quickActionNavigation'

/**
 * **Feature: admin-dashboard-uiux, Property 4: Quick Action Navigation**
 * **Validates: Requirements 2.3**
 * 
 * Property: For any quick action button, clicking the button SHALL navigate
 * to the correct create form URL:
 * - /admin/berita/create for "Tambah Berita"
 * - /admin/gallery/create for "Upload Foto"
 * - /admin/ppid/create for "Tambah Dokumen PPID"
 * - /admin/ssd/create for "Tambah FAQ"
 * - /admin/media for "Upload Media"
 */

// Arbitrary for valid quick action labels
const validQuickActionLabelArbitrary = fc.constantFrom(...getAllQuickActionLabels())

// Arbitrary for invalid quick action labels (random strings not in the mapping)
const invalidQuickActionLabelArbitrary = fc.string({ minLength: 1, maxLength: 50 })
  .filter(s => !getAllQuickActionLabels().includes(s))

// Arbitrary for quick action groups
const quickActionGroupArbitrary = fc.constantFrom<QuickAction['group']>('content-creation', 'management-tools')

describe('Quick Action Navigation - Property Tests', () => {
  /**
   * Property 4.1: Every valid quick action label maps to a valid admin URL
   * **Validates: Requirements 2.3**
   */
  it('every valid quick action label maps to a valid admin URL', () => {
    fc.assert(
      fc.property(validQuickActionLabelArbitrary, (label) => {
        const url = getQuickActionUrl(label)
        
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
   * Property 4.2: Quick action URL mapping is consistent with QUICK_ACTIONS array
   * **Validates: Requirements 2.3**
   */
  it('quick action URL mapping is consistent with QUICK_ACTIONS array', () => {
    fc.assert(
      fc.property(validQuickActionLabelArbitrary, (label) => {
        const urlFromRoutes = QUICK_ACTION_ROUTES[label]
        const actionFromArray = QUICK_ACTIONS.find(a => a.label === label)
        
        // Both sources must agree on the URL
        expect(actionFromArray).toBeDefined()
        expect(actionFromArray!.href).toBe(urlFromRoutes)
        
        return true
      }),
      { numRuns: 100 }
    )
  })

  /**
   * Property 4.3: Invalid labels return undefined
   * **Validates: Requirements 2.3**
   */
  it('invalid labels return undefined', () => {
    fc.assert(
      fc.property(invalidQuickActionLabelArbitrary, (label) => {
        const url = getQuickActionUrl(label)
        return url === undefined
      }),
      { numRuns: 100 }
    )
  })

  /**
   * Property 4.4: isValidQuickAction correctly identifies valid labels
   * **Validates: Requirements 2.3**
   */
  it('isValidQuickAction correctly identifies valid labels', () => {
    fc.assert(
      fc.property(validQuickActionLabelArbitrary, (label) => {
        return isValidQuickAction(label) === true
      }),
      { numRuns: 100 }
    )
  })

  /**
   * Property 4.5: isValidQuickAction correctly rejects invalid labels
   * **Validates: Requirements 2.3**
   */
  it('isValidQuickAction correctly rejects invalid labels', () => {
    fc.assert(
      fc.property(invalidQuickActionLabelArbitrary, (label) => {
        return isValidQuickAction(label) === false
      }),
      { numRuns: 100 }
    )
  })

  /**
   * Property 4.6: All quick actions belong to exactly one group
   * **Validates: Requirements 2.1, 2.3**
   */
  it('all quick actions belong to exactly one group', () => {
    fc.assert(
      fc.property(validQuickActionLabelArbitrary, (label) => {
        const action = QUICK_ACTIONS.find(a => a.label === label)
        
        // Action must exist
        expect(action).toBeDefined()
        
        // Group must be one of the valid groups
        expect(['content-creation', 'management-tools']).toContain(action!.group)
        
        return true
      }),
      { numRuns: 100 }
    )
  })

  /**
   * Property 4.7: getQuickActionsByGroup returns only actions from that group
   * **Validates: Requirements 2.1, 2.3**
   */
  it('getQuickActionsByGroup returns only actions from that group', () => {
    fc.assert(
      fc.property(quickActionGroupArbitrary, (group) => {
        const actions = getQuickActionsByGroup(group)
        
        // All returned actions must belong to the specified group
        return actions.every(action => action.group === group)
      }),
      { numRuns: 100 }
    )
  })

  /**
   * Property 4.8: All admin routes start with /admin/
   * **Validates: Requirements 2.3**
   */
  it('all admin routes start with /admin/', () => {
    fc.assert(
      fc.property(validQuickActionLabelArbitrary, (label) => {
        const url = getQuickActionUrl(label)
        return url !== undefined && url.startsWith('/admin/')
      }),
      { numRuns: 100 }
    )
  })
})

describe('Quick Action Navigation - Specific URL Mapping Tests', () => {
  /**
   * Verify exact URL mappings as specified in Requirements 2.3
   */
  it('Tambah Berita navigates to /admin/berita/create', () => {
    expect(getQuickActionUrl('Tambah Berita')).toBe('/admin/berita/create')
  })

  it('Upload Foto navigates to /admin/gallery/create', () => {
    expect(getQuickActionUrl('Upload Foto')).toBe('/admin/gallery/create')
  })

  it('Tambah Dokumen PPID navigates to /admin/ppid/create', () => {
    expect(getQuickActionUrl('Tambah Dokumen PPID')).toBe('/admin/ppid/create')
  })

  it('Tambah FAQ navigates to /admin/ssd/create', () => {
    expect(getQuickActionUrl('Tambah FAQ')).toBe('/admin/ssd/create')
  })

  it('Upload Media navigates to /admin/media', () => {
    expect(getQuickActionUrl('Upload Media')).toBe('/admin/media')
  })
})

describe('Quick Action Groups - Unit Tests', () => {
  it('content-creation group contains correct actions', () => {
    const contentCreationActions = getQuickActionsByGroup('content-creation')
    const labels = contentCreationActions.map(a => a.label)
    
    expect(labels).toContain('Tambah Berita')
    expect(labels).toContain('Upload Foto')
    expect(labels).toContain('Tambah Dokumen PPID')
  })

  it('management-tools group contains correct actions', () => {
    const managementActions = getQuickActionsByGroup('management-tools')
    const labels = managementActions.map(a => a.label)
    
    expect(labels).toContain('Tambah FAQ')
    expect(labels).toContain('Upload Media')
  })

  it('all quick actions are accounted for in groups', () => {
    const contentCreation = getQuickActionsByGroup('content-creation')
    const managementTools = getQuickActionsByGroup('management-tools')
    
    expect(contentCreation.length + managementTools.length).toBe(QUICK_ACTIONS.length)
  })
})
