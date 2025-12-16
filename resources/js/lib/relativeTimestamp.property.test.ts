import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import {
  isValidIndonesianRelativeTime,
  extractTimeUnit,
  extractTimeValue,
  validateActivityTimestamp,
  getValidExamples,
  getInvalidExamples,
  INDONESIAN_TIME_PATTERNS,
  VALID_INDONESIAN_TIME_REGEX,
  type IndonesianTimeUnit,
} from './relativeTimestamp'

/**
 * **Feature: admin-dashboard-uiux, Property 6: Relative Timestamp Display**
 * **Validates: Requirements 3.4**
 * 
 * Property: For any activity item with a created_at timestamp, the time_ago field
 * SHALL contain a valid relative time string in Indonesian format
 * (e.g., "2 jam yang lalu", "kemarin", "3 hari yang lalu").
 */

// Arbitrary for valid time units
const validTimeUnits: IndonesianTimeUnit[] = ['detik', 'menit', 'jam', 'hari', 'minggu', 'bulan', 'tahun']
const timeUnitArbitrary = fc.constantFrom<IndonesianTimeUnit>(...validTimeUnits)

// Arbitrary for positive integers (for time values)
const positiveIntArbitrary = fc.integer({ min: 1, max: 100 })

// Arbitrary for generating valid Indonesian relative time strings
const validIndonesianTimeArbitrary = fc.oneof(
  // "baru saja"
  fc.constant('baru saja'),
  // "kemarin"
  fc.constant('kemarin'),
  // "X detik yang lalu"
  fc.integer({ min: 1, max: 59 }).map(n => `${n} detik yang lalu`),
  // "X menit yang lalu" or "semenit yang lalu"
  fc.oneof(
    fc.constant('semenit yang lalu'),
    fc.integer({ min: 1, max: 59 }).map(n => `${n} menit yang lalu`)
  ),
  // "X jam yang lalu" or "sejam yang lalu"
  fc.oneof(
    fc.constant('sejam yang lalu'),
    fc.integer({ min: 1, max: 23 }).map(n => `${n} jam yang lalu`)
  ),
  // "X hari yang lalu" or "sehari yang lalu"
  fc.oneof(
    fc.constant('sehari yang lalu'),
    fc.integer({ min: 1, max: 30 }).map(n => `${n} hari yang lalu`)
  ),
  // "X minggu yang lalu" or "seminggu yang lalu"
  fc.oneof(
    fc.constant('seminggu yang lalu'),
    fc.integer({ min: 1, max: 4 }).map(n => `${n} minggu yang lalu`)
  ),
  // "X bulan yang lalu" or "sebulan yang lalu"
  fc.oneof(
    fc.constant('sebulan yang lalu'),
    fc.integer({ min: 1, max: 11 }).map(n => `${n} bulan yang lalu`)
  ),
  // "X tahun yang lalu" or "setahun yang lalu"
  fc.oneof(
    fc.constant('setahun yang lalu'),
    fc.integer({ min: 1, max: 10 }).map(n => `${n} tahun yang lalu`)
  )
)

// Arbitrary for invalid time strings (non-Indonesian formats)
const invalidTimeArbitrary = fc.oneof(
  // English formats
  fc.constant('just now'),
  fc.constant('yesterday'),
  fc.integer({ min: 1, max: 59 }).map(n => `${n} seconds ago`),
  fc.integer({ min: 1, max: 59 }).map(n => `${n} minutes ago`),
  fc.integer({ min: 1, max: 23 }).map(n => `${n} hours ago`),
  fc.integer({ min: 1, max: 30 }).map(n => `${n} days ago`),
  // Empty or whitespace
  fc.constant(''),
  fc.constant('   '),
  // Random strings
  fc.string({ minLength: 1, maxLength: 20 }).filter(s => 
    !s.includes('yang lalu') && 
    s !== 'baru saja' && 
    s !== 'kemarin'
  ),
  // Partial Indonesian (missing parts)
  fc.constant('yang lalu'),
  fc.constant('jam yang lalu'),
  fc.constant('2 jam'),
)

// Arbitrary for activity objects with valid time_ago
const validActivityArbitrary = validIndonesianTimeArbitrary.map(time_ago => ({
  time_ago,
  created_at: new Date().toISOString(),
}))

// Arbitrary for activity objects with invalid time_ago
const invalidActivityArbitrary = invalidTimeArbitrary.map(time_ago => ({
  time_ago,
  created_at: new Date().toISOString(),
}))

describe('Relative Timestamp Display - Property Tests', () => {
  /**
   * Property 6.1: All valid Indonesian relative time strings are recognized
   * **Validates: Requirements 3.4**
   */
  it('all valid Indonesian relative time strings are recognized', () => {
    fc.assert(
      fc.property(validIndonesianTimeArbitrary, (timeAgo) => {
        const isValid = isValidIndonesianRelativeTime(timeAgo)
        expect(isValid).toBe(true)
        return isValid
      }),
      { numRuns: 100 }
    )
  })

  /**
   * Property 6.2: Invalid time strings are rejected
   * **Validates: Requirements 3.4**
   */
  it('invalid time strings are rejected', () => {
    fc.assert(
      fc.property(invalidTimeArbitrary, (timeAgo) => {
        const isValid = isValidIndonesianRelativeTime(timeAgo)
        expect(isValid).toBe(false)
        return !isValid
      }),
      { numRuns: 100 }
    )
  })

  /**
   * Property 6.3: Time unit extraction is consistent for valid strings
   * **Validates: Requirements 3.4**
   */
  it('time unit extraction is consistent for valid strings', () => {
    fc.assert(
      fc.property(validIndonesianTimeArbitrary, (timeAgo) => {
        const unit = extractTimeUnit(timeAgo)
        
        // Unit should be extracted for all valid strings
        expect(unit).not.toBeNull()
        
        // Verify unit matches the string content
        if (timeAgo === 'baru saja') {
          expect(unit).toBe('baru saja')
        } else if (timeAgo === 'kemarin') {
          expect(unit).toBe('kemarin')
        } else if (timeAgo.includes('detik')) {
          expect(unit).toBe('detik')
        } else if (timeAgo.includes('menit') || timeAgo.startsWith('semenit')) {
          expect(unit).toBe('menit')
        } else if (timeAgo.includes('jam') || timeAgo.startsWith('sejam')) {
          expect(unit).toBe('jam')
        } else if (timeAgo.includes('hari') || timeAgo.startsWith('sehari')) {
          expect(unit).toBe('hari')
        } else if (timeAgo.includes('minggu') || timeAgo.startsWith('seminggu')) {
          expect(unit).toBe('minggu')
        } else if (timeAgo.includes('bulan') || timeAgo.startsWith('sebulan')) {
          expect(unit).toBe('bulan')
        } else if (timeAgo.includes('tahun') || timeAgo.startsWith('setahun')) {
          expect(unit).toBe('tahun')
        }
        
        return true
      }),
      { numRuns: 100 }
    )
  })

  /**
   * Property 6.4: Time value extraction returns valid numbers for valid strings
   * **Validates: Requirements 3.4**
   */
  it('time value extraction returns valid numbers for valid strings', () => {
    fc.assert(
      fc.property(validIndonesianTimeArbitrary, (timeAgo) => {
        const value = extractTimeValue(timeAgo)
        
        // Value should be extracted for all valid strings
        expect(value).not.toBeNull()
        expect(typeof value).toBe('number')
        expect(value).toBeGreaterThanOrEqual(0)
        
        return true
      }),
      { numRuns: 100 }
    )
  })

  /**
   * Property 6.5: Activity validation returns correct structure for valid activities
   * **Validates: Requirements 3.4**
   */
  it('activity validation returns correct structure for valid activities', () => {
    fc.assert(
      fc.property(validActivityArbitrary, (activity) => {
        const result = validateActivityTimestamp(activity)
        
        expect(result.isValid).toBe(true)
        expect(result.timeAgo).toBe(activity.time_ago)
        expect(result.unit).not.toBeNull()
        expect(result.value).not.toBeNull()
        expect(result.error).toBeUndefined()
        
        return true
      }),
      { numRuns: 100 }
    )
  })

  /**
   * Property 6.6: Activity validation returns error for invalid activities
   * **Validates: Requirements 3.4**
   */
  it('activity validation returns error for invalid activities', () => {
    fc.assert(
      fc.property(invalidActivityArbitrary, (activity) => {
        const result = validateActivityTimestamp(activity)
        
        expect(result.isValid).toBe(false)
        expect(result.error).toBeDefined()
        
        return true
      }),
      { numRuns: 100 }
    )
  })

  /**
   * Property 6.7: "se-" prefix forms are equivalent to "1 X yang lalu"
   * **Validates: Requirements 3.4**
   */
  it('"se-" prefix forms are equivalent to "1 X yang lalu"', () => {
    const sePrefixForms = [
      { se: 'semenit yang lalu', numeric: '1 menit yang lalu' },
      { se: 'sejam yang lalu', numeric: '1 jam yang lalu' },
      { se: 'sehari yang lalu', numeric: '1 hari yang lalu' },
      { se: 'seminggu yang lalu', numeric: '1 minggu yang lalu' },
      { se: 'sebulan yang lalu', numeric: '1 bulan yang lalu' },
      { se: 'setahun yang lalu', numeric: '1 tahun yang lalu' },
    ]
    
    fc.assert(
      fc.property(fc.constantFrom(...sePrefixForms), ({ se, numeric }) => {
        // Both forms should be valid
        expect(isValidIndonesianRelativeTime(se)).toBe(true)
        expect(isValidIndonesianRelativeTime(numeric)).toBe(true)
        
        // Both should extract value of 1
        expect(extractTimeValue(se)).toBe(1)
        expect(extractTimeValue(numeric)).toBe(1)
        
        // Both should extract the same unit
        const seUnit = extractTimeUnit(se)
        const numericUnit = extractTimeUnit(numeric)
        expect(seUnit).toBe(numericUnit)
        
        return true
      }),
      { numRuns: 100 }
    )
  })

  /**
   * Property 6.8: Numeric values in time strings are correctly parsed
   * **Validates: Requirements 3.4**
   */
  it('numeric values in time strings are correctly parsed', () => {
    fc.assert(
      fc.property(
        positiveIntArbitrary,
        timeUnitArbitrary,
        (num, unit) => {
          const timeAgo = `${num} ${unit} yang lalu`
          const extractedValue = extractTimeValue(timeAgo)
          
          expect(extractedValue).toBe(num)
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })
})

describe('Relative Timestamp Display - Example Tests', () => {
  /**
   * Verify all documented valid examples pass validation
   * **Validates: Requirements 3.4**
   */
  it('all documented valid examples pass validation', () => {
    const validExamples = getValidExamples()
    
    validExamples.forEach(example => {
      expect(isValidIndonesianRelativeTime(example)).toBe(true)
    })
  })

  /**
   * Verify all documented invalid examples fail validation
   * **Validates: Requirements 3.4**
   */
  it('all documented invalid examples fail validation', () => {
    const invalidExamples = getInvalidExamples()
    
    invalidExamples.forEach(example => {
      expect(isValidIndonesianRelativeTime(example)).toBe(false)
    })
  })

  /**
   * Specific examples from Requirements 3.4
   */
  it('validates "2 jam yang lalu" as specified in requirements', () => {
    expect(isValidIndonesianRelativeTime('2 jam yang lalu')).toBe(true)
    expect(extractTimeUnit('2 jam yang lalu')).toBe('jam')
    expect(extractTimeValue('2 jam yang lalu')).toBe(2)
  })

  it('validates "kemarin" as specified in requirements', () => {
    expect(isValidIndonesianRelativeTime('kemarin')).toBe(true)
    expect(extractTimeUnit('kemarin')).toBe('kemarin')
    expect(extractTimeValue('kemarin')).toBe(1)
  })

  it('validates "3 hari yang lalu" as specified in requirements', () => {
    expect(isValidIndonesianRelativeTime('3 hari yang lalu')).toBe(true)
    expect(extractTimeUnit('3 hari yang lalu')).toBe('hari')
    expect(extractTimeValue('3 hari yang lalu')).toBe(3)
  })
})

describe('Relative Timestamp Display - Edge Cases', () => {
  /**
   * Edge case: Empty and whitespace strings
   */
  it('rejects empty strings', () => {
    expect(isValidIndonesianRelativeTime('')).toBe(false)
    expect(isValidIndonesianRelativeTime('   ')).toBe(false)
  })

  /**
   * Edge case: Null and undefined handling
   */
  it('handles null and undefined gracefully', () => {
    expect(isValidIndonesianRelativeTime(null as unknown as string)).toBe(false)
    expect(isValidIndonesianRelativeTime(undefined as unknown as string)).toBe(false)
  })

  /**
   * Edge case: Case insensitivity
   */
  it('handles case variations', () => {
    expect(isValidIndonesianRelativeTime('BARU SAJA')).toBe(true)
    expect(isValidIndonesianRelativeTime('Kemarin')).toBe(true)
    expect(isValidIndonesianRelativeTime('2 JAM YANG LALU')).toBe(true)
  })

  /**
   * Edge case: Whitespace trimming
   */
  it('handles leading/trailing whitespace', () => {
    expect(isValidIndonesianRelativeTime('  baru saja  ')).toBe(true)
    expect(isValidIndonesianRelativeTime('\t2 jam yang lalu\n')).toBe(true)
  })
})
