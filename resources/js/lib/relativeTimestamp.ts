/**
 * Relative Timestamp Utilities for Indonesian Format
 * 
 * This module provides validation and utilities for relative timestamps
 * in Indonesian format as used in the admin dashboard activity section.
 * 
 * **Validates: Requirements 3.4**
 * 
 * Expected formats include:
 * - "baru saja" (just now)
 * - "X detik yang lalu" (X seconds ago)
 * - "X menit yang lalu" (X minutes ago)
 * - "X jam yang lalu" (X hours ago)
 * - "kemarin" (yesterday)
 * - "X hari yang lalu" (X days ago)
 * - "X minggu yang lalu" (X weeks ago)
 * - "X bulan yang lalu" (X months ago)
 * - "X tahun yang lalu" (X years ago)
 */

/**
 * Valid Indonesian relative time patterns
 * These patterns match Laravel's diffForHumans() output with Indonesian locale
 */
export const INDONESIAN_TIME_PATTERNS = {
  // Immediate past
  justNow: /^baru saja$/i,
  
  // Seconds ago
  secondsAgo: /^\d+\s+detik\s+yang\s+lalu$/i,
  
  // Minutes ago
  minutesAgo: /^\d+\s+menit\s+yang\s+lalu$/i,
  
  // Hours ago
  hoursAgo: /^\d+\s+jam\s+yang\s+lalu$/i,
  
  // Yesterday
  yesterday: /^kemarin$/i,
  
  // Days ago
  daysAgo: /^\d+\s+hari\s+yang\s+lalu$/i,
  
  // Weeks ago
  weeksAgo: /^\d+\s+minggu\s+yang\s+lalu$/i,
  
  // Months ago
  monthsAgo: /^\d+\s+bulan\s+yang\s+lalu$/i,
  
  // Years ago
  yearsAgo: /^\d+\s+tahun\s+yang\s+lalu$/i,
  
  // Alternative patterns (some Laravel versions may use different formats)
  // "1 jam yang lalu" vs "sejam yang lalu"
  oneHourAgo: /^sejam\s+yang\s+lalu$/i,
  oneMinuteAgo: /^semenit\s+yang\s+lalu$/i,
  oneDayAgo: /^sehari\s+yang\s+lalu$/i,
  oneWeekAgo: /^seminggu\s+yang\s+lalu$/i,
  oneMonthAgo: /^sebulan\s+yang\s+lalu$/i,
  oneYearAgo: /^setahun\s+yang\s+lalu$/i,
} as const

/**
 * Combined regex pattern that matches any valid Indonesian relative time string
 */
export const VALID_INDONESIAN_TIME_REGEX = new RegExp(
  [
    // Just now
    '^baru saja$',
    // Seconds ago
    '^\\d+\\s+detik\\s+yang\\s+lalu$',
    // Minutes ago (including "semenit")
    '^(\\d+\\s+menit|semenit)\\s+yang\\s+lalu$',
    // Hours ago (including "sejam")
    '^(\\d+\\s+jam|sejam)\\s+yang\\s+lalu$',
    // Yesterday
    '^kemarin$',
    // Days ago (including "sehari")
    '^(\\d+\\s+hari|sehari)\\s+yang\\s+lalu$',
    // Weeks ago (including "seminggu")
    '^(\\d+\\s+minggu|seminggu)\\s+yang\\s+lalu$',
    // Months ago (including "sebulan")
    '^(\\d+\\s+bulan|sebulan)\\s+yang\\s+lalu$',
    // Years ago (including "setahun")
    '^(\\d+\\s+tahun|setahun)\\s+yang\\s+lalu$',
  ].join('|'),
  'i'
)

/**
 * Type for time unit in Indonesian
 */
export type IndonesianTimeUnit = 
  | 'detik'
  | 'menit'
  | 'jam'
  | 'hari'
  | 'minggu'
  | 'bulan'
  | 'tahun'

/**
 * Validates if a string is a valid Indonesian relative time format
 * 
 * @param timeAgo - The time_ago string to validate
 * @returns true if the string matches a valid Indonesian relative time format
 */
export function isValidIndonesianRelativeTime(timeAgo: string): boolean {
  if (!timeAgo || typeof timeAgo !== 'string') {
    return false
  }
  
  const trimmed = timeAgo.trim()
  if (trimmed.length === 0) {
    return false
  }
  
  return VALID_INDONESIAN_TIME_REGEX.test(trimmed)
}

/**
 * Extracts the time unit from an Indonesian relative time string
 * 
 * @param timeAgo - The time_ago string to parse
 * @returns The time unit or null if not found
 */
export function extractTimeUnit(timeAgo: string): IndonesianTimeUnit | 'kemarin' | 'baru saja' | null {
  if (!timeAgo || typeof timeAgo !== 'string') {
    return null
  }
  
  const trimmed = timeAgo.trim().toLowerCase()
  
  if (trimmed === 'baru saja') return 'baru saja'
  if (trimmed === 'kemarin') return 'kemarin'
  
  if (trimmed.includes('detik')) return 'detik'
  if (trimmed.includes('menit') || trimmed.startsWith('semenit')) return 'menit'
  if (trimmed.includes('jam') || trimmed.startsWith('sejam')) return 'jam'
  if (trimmed.includes('hari') || trimmed.startsWith('sehari')) return 'hari'
  if (trimmed.includes('minggu') || trimmed.startsWith('seminggu')) return 'minggu'
  if (trimmed.includes('bulan') || trimmed.startsWith('sebulan')) return 'bulan'
  if (trimmed.includes('tahun') || trimmed.startsWith('setahun')) return 'tahun'
  
  return null
}

/**
 * Extracts the numeric value from an Indonesian relative time string
 * 
 * @param timeAgo - The time_ago string to parse
 * @returns The numeric value or null if not found (returns 1 for "sejam", "semenit", etc.)
 */
export function extractTimeValue(timeAgo: string): number | null {
  if (!timeAgo || typeof timeAgo !== 'string') {
    return null
  }
  
  const trimmed = timeAgo.trim().toLowerCase()
  
  // Special cases that imply 1
  if (trimmed === 'baru saja') return 0
  if (trimmed === 'kemarin') return 1
  if (trimmed.startsWith('se') && trimmed.includes('yang lalu')) return 1
  
  // Extract numeric value
  const match = trimmed.match(/^(\d+)/)
  if (match) {
    return parseInt(match[1], 10)
  }
  
  return null
}

/**
 * Validates an activity item's time_ago field
 * 
 * @param activity - Activity object with time_ago field
 * @returns Validation result with details
 */
export function validateActivityTimestamp(activity: { time_ago: string; created_at?: string }): {
  isValid: boolean
  timeAgo: string
  unit: IndonesianTimeUnit | 'kemarin' | 'baru saja' | null
  value: number | null
  error?: string
} {
  const { time_ago } = activity
  
  if (!time_ago) {
    return {
      isValid: false,
      timeAgo: '',
      unit: null,
      value: null,
      error: 'time_ago field is missing or empty',
    }
  }
  
  const isValid = isValidIndonesianRelativeTime(time_ago)
  const unit = extractTimeUnit(time_ago)
  const value = extractTimeValue(time_ago)
  
  return {
    isValid,
    timeAgo: time_ago,
    unit,
    value,
    error: isValid ? undefined : `Invalid Indonesian relative time format: "${time_ago}"`,
  }
}

/**
 * Get all valid example Indonesian relative time strings
 * Useful for testing and documentation
 */
export function getValidExamples(): string[] {
  return [
    'baru saja',
    '5 detik yang lalu',
    '30 detik yang lalu',
    'semenit yang lalu',
    '1 menit yang lalu',
    '5 menit yang lalu',
    '30 menit yang lalu',
    'sejam yang lalu',
    '1 jam yang lalu',
    '2 jam yang lalu',
    '12 jam yang lalu',
    'kemarin',
    'sehari yang lalu',
    '1 hari yang lalu',
    '3 hari yang lalu',
    'seminggu yang lalu',
    '1 minggu yang lalu',
    '2 minggu yang lalu',
    'sebulan yang lalu',
    '1 bulan yang lalu',
    '6 bulan yang lalu',
    'setahun yang lalu',
    '1 tahun yang lalu',
    '2 tahun yang lalu',
  ]
}

/**
 * Get invalid example strings for testing
 */
export function getInvalidExamples(): string[] {
  return [
    '',
    '   ',
    '2 hours ago',
    'yesterday',
    'just now',
    '5 minutes ago',
    'hace 2 horas',
    '2時間前',
    'invalid',
    '123',
    'yang lalu',
    'jam yang lalu',
  ]
}
