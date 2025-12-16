import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import {
  ACTION_COLORS,
  ACTION_ICON_NAMES,
  DOT_COLORS,
  ICON_COLORS,
  ACTION_LABELS,
  DEFAULT_COLOR,
  DEFAULT_ICON_NAME,
  getAllActionTypes,
  isValidActionType,
  getActionColor,
  getDotColor,
  getIconColor,
  getActionIconName,
  getActionLabel,
  getActionMapping,
  verifyActionColorMapping,
  verifyActionIconMapping,
  type ActionType,
} from './activityActionMapping'

/**
 * **Feature: admin-dashboard-uiux, Property 3: Activity Action Color Mapping**
 * **Validates: Requirements 3.2, 3.3**
 * 
 * Property: For any activity item with an action type (created, updated, deleted),
 * the badge SHALL display the correct color: green for created, blue for updated,
 * red for deleted, and the correct cultural icon: Lontar for created, CepatMenulis
 * for updated, Prasasti for deleted.
 */

// Arbitrary for valid action types
const validActionTypeArbitrary = fc.constantFrom<ActionType>('created', 'updated', 'deleted')

// Arbitrary for invalid action types (random strings not in the mapping)
const invalidActionTypeArbitrary = fc.string({ minLength: 1, maxLength: 50 })
  .filter(s => !getAllActionTypes().includes(s as ActionType))

describe('Activity Action Color Mapping - Property Tests', () => {
  /**
   * Property 3.1: Every valid action type maps to a color containing the correct color name
   * - created -> green
   * - updated -> blue
   * - deleted -> red
   * **Validates: Requirements 3.2**
   */
  it('every valid action type maps to the correct color', () => {
    fc.assert(
      fc.property(validActionTypeArbitrary, (action) => {
        const color = getActionColor(action)
        
        // Color must exist and not be the default
        expect(color).toBeDefined()
        expect(color).not.toBe(DEFAULT_COLOR)
        
        // Verify correct color mapping
        return verifyActionColorMapping(action)
      }),
      { numRuns: 100 }
    )
  })

  /**
   * Property 3.2: Every valid action type maps to the correct cultural icon
   * - created -> Lontar
   * - updated -> CepatMenulis
   * - deleted -> Prasasti
   * **Validates: Requirements 3.3**
   */
  it('every valid action type maps to the correct cultural icon', () => {
    fc.assert(
      fc.property(validActionTypeArbitrary, (action) => {
        const iconName = getActionIconName(action)
        
        // Icon name must exist and not be the default
        expect(iconName).toBeDefined()
        expect(iconName).not.toBe(DEFAULT_ICON_NAME)
        
        // Verify correct icon mapping
        return verifyActionIconMapping(action)
      }),
      { numRuns: 100 }
    )
  })

  /**
   * Property 3.3: Created action always maps to green color and Lontar icon
   * **Validates: Requirements 3.2, 3.3**
   */
  it('created action maps to green color and Lontar icon', () => {
    fc.assert(
      fc.property(fc.constant('created' as ActionType), (action) => {
        const color = getActionColor(action)
        const iconName = getActionIconName(action)
        
        expect(color).toContain('green')
        expect(iconName).toBe('Lontar')
        
        return true
      }),
      { numRuns: 100 }
    )
  })

  /**
   * Property 3.4: Updated action always maps to blue color and CepatMenulis icon
   * **Validates: Requirements 3.2, 3.3**
   */
  it('updated action maps to blue color and CepatMenulis icon', () => {
    fc.assert(
      fc.property(fc.constant('updated' as ActionType), (action) => {
        const color = getActionColor(action)
        const iconName = getActionIconName(action)
        
        expect(color).toContain('blue')
        expect(iconName).toBe('CepatMenulis')
        
        return true
      }),
      { numRuns: 100 }
    )
  })

  /**
   * Property 3.5: Deleted action always maps to red color and Prasasti icon
   * **Validates: Requirements 3.2, 3.3**
   */
  it('deleted action maps to red color and Prasasti icon', () => {
    fc.assert(
      fc.property(fc.constant('deleted' as ActionType), (action) => {
        const color = getActionColor(action)
        const iconName = getActionIconName(action)
        
        expect(color).toContain('red')
        expect(iconName).toBe('Prasasti')
        
        return true
      }),
      { numRuns: 100 }
    )
  })

  /**
   * Property 3.6: Invalid action types return default values
   * **Validates: Requirements 3.2, 3.3**
   */
  it('invalid action types return default values', () => {
    fc.assert(
      fc.property(invalidActionTypeArbitrary, (action) => {
        const color = getActionColor(action)
        const iconName = getActionIconName(action)
        
        expect(color).toBe(DEFAULT_COLOR)
        expect(iconName).toBe(DEFAULT_ICON_NAME)
        
        return true
      }),
      { numRuns: 100 }
    )
  })

  /**
   * Property 3.7: isValidActionType correctly identifies valid action types
   * **Validates: Requirements 3.2, 3.3**
   */
  it('isValidActionType correctly identifies valid action types', () => {
    fc.assert(
      fc.property(validActionTypeArbitrary, (action) => {
        return isValidActionType(action) === true
      }),
      { numRuns: 100 }
    )
  })

  /**
   * Property 3.8: isValidActionType correctly rejects invalid action types
   * **Validates: Requirements 3.2, 3.3**
   */
  it('isValidActionType correctly rejects invalid action types', () => {
    fc.assert(
      fc.property(invalidActionTypeArbitrary, (action) => {
        return isValidActionType(action) === false
      }),
      { numRuns: 100 }
    )
  })

  /**
   * Property 3.9: Color and icon mappings are consistent across all getter functions
   * **Validates: Requirements 3.2, 3.3**
   */
  it('color and icon mappings are consistent across all getter functions', () => {
    fc.assert(
      fc.property(validActionTypeArbitrary, (action) => {
        const mapping = getActionMapping(action)
        
        // All values should match individual getters
        expect(mapping.color).toBe(getActionColor(action))
        expect(mapping.iconName).toBe(getActionIconName(action))
        expect(mapping.iconColor).toBe(getIconColor(action))
        expect(mapping.dotColor).toBe(getDotColor(action))
        expect(mapping.label).toBe(getActionLabel(action))
        expect(mapping.isValid).toBe(true)
        
        return true
      }),
      { numRuns: 100 }
    )
  })

  /**
   * Property 3.10: Dot colors match the action type color scheme
   * **Validates: Requirements 3.1, 3.2**
   */
  it('dot colors match the action type color scheme', () => {
    fc.assert(
      fc.property(validActionTypeArbitrary, (action) => {
        const dotColor = getDotColor(action)
        
        switch (action) {
          case 'created':
            return dotColor.includes('green')
          case 'updated':
            return dotColor.includes('blue')
          case 'deleted':
            return dotColor.includes('red')
          default:
            return false
        }
      }),
      { numRuns: 100 }
    )
  })

  /**
   * Property 3.11: Icon colors match the action type color scheme
   * **Validates: Requirements 3.2, 3.3**
   */
  it('icon colors match the action type color scheme', () => {
    fc.assert(
      fc.property(validActionTypeArbitrary, (action) => {
        const iconColor = getIconColor(action)
        
        switch (action) {
          case 'created':
            return iconColor.includes('green')
          case 'updated':
            return iconColor.includes('blue')
          case 'deleted':
            return iconColor.includes('red')
          default:
            return false
        }
      }),
      { numRuns: 100 }
    )
  })
})

describe('Activity Action Color Mapping - Specific Mapping Tests', () => {
  /**
   * Verify exact color mappings as specified in Requirements 3.2
   */
  it('created action has green badge color', () => {
    expect(ACTION_COLORS.created).toBe('bg-green-100 text-green-800')
  })

  it('updated action has blue badge color', () => {
    expect(ACTION_COLORS.updated).toBe('bg-blue-100 text-blue-800')
  })

  it('deleted action has red badge color', () => {
    expect(ACTION_COLORS.deleted).toBe('bg-red-100 text-red-800')
  })

  /**
   * Verify exact icon mappings as specified in Requirements 3.3
   */
  it('created action uses Lontar cultural icon', () => {
    expect(ACTION_ICON_NAMES.created).toBe('Lontar')
  })

  it('updated action uses CepatMenulis cultural icon', () => {
    expect(ACTION_ICON_NAMES.updated).toBe('CepatMenulis')
  })

  it('deleted action uses Prasasti cultural icon', () => {
    expect(ACTION_ICON_NAMES.deleted).toBe('Prasasti')
  })
})

describe('Activity Action Labels - Unit Tests', () => {
  it('created action has Indonesian label "Dibuat"', () => {
    expect(ACTION_LABELS.created).toBe('Dibuat')
    expect(getActionLabel('created')).toBe('Dibuat')
  })

  it('updated action has Indonesian label "Diperbarui"', () => {
    expect(ACTION_LABELS.updated).toBe('Diperbarui')
    expect(getActionLabel('updated')).toBe('Diperbarui')
  })

  it('deleted action has Indonesian label "Dihapus"', () => {
    expect(ACTION_LABELS.deleted).toBe('Dihapus')
    expect(getActionLabel('deleted')).toBe('Dihapus')
  })

  it('invalid action returns the action string as label', () => {
    expect(getActionLabel('unknown')).toBe('unknown')
    expect(getActionLabel('random')).toBe('random')
  })
})
