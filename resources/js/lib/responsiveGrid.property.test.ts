import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import {
  getDeviceType,
  getGridColumns,
  getMainStatsColumns,
  getModuleSummaryColumns,
  MAIN_STATS_GRID_CONFIG,
  MODULE_SUMMARY_GRID_CONFIG,
  BREAKPOINTS,
  type DeviceType,
} from './responsiveGrid'

/**
 * **Feature: admin-dashboard-uiux, Property 7: Responsive Grid Layout**
 * **Validates: Requirements 8.1, 8.2, 8.3**
 * 
 * Property: For any viewport width, the main statistics grid SHALL display:
 * - 4 columns for desktop (>= 1024px)
 * - 2 columns for tablet (768px - 1023px)
 * - 1 column for mobile (< 768px)
 */

// Arbitrary for mobile viewport widths (1 to 767)
const mobileViewportArbitrary = fc.integer({ min: 1, max: BREAKPOINTS.md - 1 })

// Arbitrary for tablet viewport widths (768 to 1023)
const tabletViewportArbitrary = fc.integer({ min: BREAKPOINTS.md, max: BREAKPOINTS.lg - 1 })

// Arbitrary for desktop viewport widths (1024 to 4000)
const desktopViewportArbitrary = fc.integer({ min: BREAKPOINTS.lg, max: 4000 })

// Arbitrary for any valid viewport width
const anyViewportArbitrary = fc.integer({ min: 1, max: 4000 })

describe('Responsive Grid Layout - Property Tests', () => {
  /**
   * Property 7.1: Mobile viewport (< 768px) SHALL display 1 column
   * **Validates: Requirements 8.3**
   */
  it('mobile viewport (< 768px) displays 1 column for main stats', () => {
    fc.assert(
      fc.property(mobileViewportArbitrary, (viewportWidth) => {
        const columns = getMainStatsColumns(viewportWidth)
        return columns === 1
      }),
      { numRuns: 100 }
    )
  })

  /**
   * Property 7.2: Tablet viewport (768px - 1023px) SHALL display 2 columns
   * **Validates: Requirements 8.2**
   */
  it('tablet viewport (768px - 1023px) displays 2 columns for main stats', () => {
    fc.assert(
      fc.property(tabletViewportArbitrary, (viewportWidth) => {
        const columns = getMainStatsColumns(viewportWidth)
        return columns === 2
      }),
      { numRuns: 100 }
    )
  })

  /**
   * Property 7.3: Desktop viewport (>= 1024px) SHALL display 4 columns
   * **Validates: Requirements 8.1**
   */
  it('desktop viewport (>= 1024px) displays 4 columns for main stats', () => {
    fc.assert(
      fc.property(desktopViewportArbitrary, (viewportWidth) => {
        const columns = getMainStatsColumns(viewportWidth)
        return columns === 4
      }),
      { numRuns: 100 }
    )
  })

  /**
   * Property 7.4: Device type detection is consistent with breakpoints
   */
  it('device type detection is consistent with breakpoints', () => {
    fc.assert(
      fc.property(anyViewportArbitrary, (viewportWidth) => {
        const deviceType = getDeviceType(viewportWidth)
        
        if (viewportWidth < BREAKPOINTS.md) {
          return deviceType === 'mobile'
        }
        if (viewportWidth < BREAKPOINTS.lg) {
          return deviceType === 'tablet'
        }
        return deviceType === 'desktop'
      }),
      { numRuns: 100 }
    )
  })

  /**
   * Property 7.5: Grid columns are always positive integers
   */
  it('grid columns are always positive integers', () => {
    fc.assert(
      fc.property(anyViewportArbitrary, (viewportWidth) => {
        const mainStatsColumns = getMainStatsColumns(viewportWidth)
        const moduleSummaryColumns = getModuleSummaryColumns(viewportWidth)
        
        return (
          mainStatsColumns >= 1 &&
          Number.isInteger(mainStatsColumns) &&
          moduleSummaryColumns >= 1 &&
          Number.isInteger(moduleSummaryColumns)
        )
      }),
      { numRuns: 100 }
    )
  })

  /**
   * Property 7.6: Column count increases or stays same as viewport increases
   * (monotonic non-decreasing property)
   */
  it('column count is monotonically non-decreasing as viewport increases', () => {
    fc.assert(
      fc.property(
        anyViewportArbitrary,
        fc.integer({ min: 1, max: 500 }),
        (viewportWidth, increment) => {
          const columnsSmaller = getMainStatsColumns(viewportWidth)
          const columnsLarger = getMainStatsColumns(viewportWidth + increment)
          
          return columnsLarger >= columnsSmaller
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 7.7: Breakpoint boundaries are correctly handled
   */
  it('breakpoint boundaries are correctly handled', () => {
    // Test exact breakpoint values
    expect(getDeviceType(BREAKPOINTS.md - 1)).toBe('mobile')
    expect(getDeviceType(BREAKPOINTS.md)).toBe('tablet')
    expect(getDeviceType(BREAKPOINTS.lg - 1)).toBe('tablet')
    expect(getDeviceType(BREAKPOINTS.lg)).toBe('desktop')
    
    // Test column counts at breakpoints
    expect(getMainStatsColumns(BREAKPOINTS.md - 1)).toBe(1)
    expect(getMainStatsColumns(BREAKPOINTS.md)).toBe(2)
    expect(getMainStatsColumns(BREAKPOINTS.lg - 1)).toBe(2)
    expect(getMainStatsColumns(BREAKPOINTS.lg)).toBe(4)
  })
})

describe('Module Summary Grid - Property Tests', () => {
  /**
   * Property: Module summary grid follows its own responsive configuration
   * - Desktop (>= 1024px): 6 columns
   * - Tablet (768px - 1023px): 3 columns
   * - Mobile (< 768px): 2 columns
   */
  it('module summary grid follows correct responsive configuration', () => {
    fc.assert(
      fc.property(anyViewportArbitrary, (viewportWidth) => {
        const columns = getModuleSummaryColumns(viewportWidth)
        const deviceType = getDeviceType(viewportWidth)
        
        switch (deviceType) {
          case 'mobile':
            return columns === MODULE_SUMMARY_GRID_CONFIG.mobile
          case 'tablet':
            return columns === MODULE_SUMMARY_GRID_CONFIG.tablet
          case 'desktop':
            return columns === MODULE_SUMMARY_GRID_CONFIG.desktop
          default:
            return false
        }
      }),
      { numRuns: 100 }
    )
  })
})

describe('getGridColumns - Unit Tests', () => {
  it('returns correct columns for mobile viewport', () => {
    expect(getGridColumns(320, MAIN_STATS_GRID_CONFIG)).toBe(1)
    expect(getGridColumns(375, MAIN_STATS_GRID_CONFIG)).toBe(1)
    expect(getGridColumns(767, MAIN_STATS_GRID_CONFIG)).toBe(1)
  })

  it('returns correct columns for tablet viewport', () => {
    expect(getGridColumns(768, MAIN_STATS_GRID_CONFIG)).toBe(2)
    expect(getGridColumns(900, MAIN_STATS_GRID_CONFIG)).toBe(2)
    expect(getGridColumns(1023, MAIN_STATS_GRID_CONFIG)).toBe(2)
  })

  it('returns correct columns for desktop viewport', () => {
    expect(getGridColumns(1024, MAIN_STATS_GRID_CONFIG)).toBe(4)
    expect(getGridColumns(1440, MAIN_STATS_GRID_CONFIG)).toBe(4)
    expect(getGridColumns(1920, MAIN_STATS_GRID_CONFIG)).toBe(4)
  })
})
