/**
 * Responsive Grid Layout Utilities
 * 
 * These utilities help determine the correct grid column count based on viewport width.
 * Used for dashboard statistics and module summary grids.
 * 
 * Breakpoints (following Tailwind CSS defaults):
 * - Mobile: < 768px (grid-cols-1)
 * - Tablet: 768px - 1023px (md:grid-cols-2)
 * - Desktop: >= 1024px (lg:grid-cols-4)
 */

export type DeviceType = 'mobile' | 'tablet' | 'desktop'

export interface ResponsiveGridConfig {
  mobile: number
  tablet: number
  desktop: number
}

// Default grid configuration for main statistics
export const MAIN_STATS_GRID_CONFIG: ResponsiveGridConfig = {
  mobile: 1,
  tablet: 2,
  desktop: 4,
}

// Grid configuration for module summary (6 columns on desktop)
export const MODULE_SUMMARY_GRID_CONFIG: ResponsiveGridConfig = {
  mobile: 2,
  tablet: 3,
  desktop: 6,
}

// Tailwind CSS breakpoints
export const BREAKPOINTS = {
  md: 768,  // Tablet starts at 768px
  lg: 1024, // Desktop starts at 1024px
} as const

/**
 * Determines the device type based on viewport width
 * 
 * @param viewportWidth - The current viewport width in pixels
 * @returns The device type: 'mobile', 'tablet', or 'desktop'
 */
export function getDeviceType(viewportWidth: number): DeviceType {
  if (viewportWidth < BREAKPOINTS.md) {
    return 'mobile'
  }
  if (viewportWidth < BREAKPOINTS.lg) {
    return 'tablet'
  }
  return 'desktop'
}

/**
 * Gets the number of grid columns based on viewport width
 * 
 * @param viewportWidth - The current viewport width in pixels
 * @param config - The responsive grid configuration
 * @returns The number of columns to display
 */
export function getGridColumns(
  viewportWidth: number,
  config: ResponsiveGridConfig = MAIN_STATS_GRID_CONFIG
): number {
  const deviceType = getDeviceType(viewportWidth)
  return config[deviceType]
}

/**
 * Generates the Tailwind CSS grid classes based on configuration
 * 
 * @param config - The responsive grid configuration
 * @returns The Tailwind CSS class string
 */
export function getGridClasses(config: ResponsiveGridConfig): string {
  return `grid-cols-${config.mobile} md:grid-cols-${config.tablet} lg:grid-cols-${config.desktop}`
}

/**
 * Validates that a responsive grid configuration is valid
 * 
 * @param config - The responsive grid configuration to validate
 * @returns True if the configuration is valid
 */
export function isValidGridConfig(config: ResponsiveGridConfig): boolean {
  return (
    config.mobile >= 1 &&
    config.tablet >= 1 &&
    config.desktop >= 1 &&
    Number.isInteger(config.mobile) &&
    Number.isInteger(config.tablet) &&
    Number.isInteger(config.desktop)
  )
}

/**
 * Calculates the expected column count for any viewport width
 * This is the core function that implements the responsive grid logic
 * 
 * Requirements:
 * - Desktop (>= 1024px): 4 columns for main stats
 * - Tablet (768px - 1023px): 2 columns for main stats
 * - Mobile (< 768px): 1 column for main stats
 * 
 * @param viewportWidth - The viewport width in pixels
 * @returns The expected number of columns
 */
export function getMainStatsColumns(viewportWidth: number): number {
  return getGridColumns(viewportWidth, MAIN_STATS_GRID_CONFIG)
}

/**
 * Calculates the expected column count for module summary grid
 * 
 * Requirements:
 * - Desktop (>= 1024px): 6 columns
 * - Tablet (768px - 1023px): 3 columns
 * - Mobile (< 768px): 2 columns
 * 
 * @param viewportWidth - The viewport width in pixels
 * @returns The expected number of columns
 */
export function getModuleSummaryColumns(viewportWidth: number): number {
  return getGridColumns(viewportWidth, MODULE_SUMMARY_GRID_CONFIG)
}
