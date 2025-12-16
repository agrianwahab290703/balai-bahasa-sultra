import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { filterBySearch, itemMatchesSearch, getNestedValue } from './searchFilter'

/**
 * **Feature: admin-crud-management, Property 3: Search Filter Accuracy**
 * **Validates: Requirements 1.5, 4.4, 8.3**
 * 
 * Property: For any search query on a searchable entity, all returned results 
 * SHALL contain the search term in at least one of the searchable fields.
 */

interface TestItem {
  id: number
  title: string
  content: string
  category: string
  author: {
    name: string
  }
}

// Arbitrary for generating test items
const testItemArbitrary = fc.record({
  id: fc.integer({ min: 1, max: 10000 }),
  title: fc.string({ minLength: 1, maxLength: 100 }),
  content: fc.string({ minLength: 0, maxLength: 500 }),
  category: fc.string({ minLength: 1, maxLength: 50 }),
  author: fc.record({
    name: fc.string({ minLength: 1, maxLength: 50 }),
  }),
})

// Arbitrary for generating non-empty search queries
const searchQueryArbitrary = fc.string({ minLength: 1, maxLength: 20 })
  .filter(s => s.trim().length > 0)

describe('Search Filter - Property Tests', () => {
  /**
   * Property 3: Search Filter Accuracy
   * All returned results SHALL contain the search term in at least one searchable field
   */
  it('all filtered results contain the search term in at least one searchable field', () => {
    fc.assert(
      fc.property(
        fc.array(testItemArbitrary, { minLength: 0, maxLength: 50 }),
        searchQueryArbitrary,
        (items, searchQuery) => {
          const searchableFields = ['title', 'content', 'category']
          const results = filterBySearch(items, searchQuery, searchableFields)
          
          // Every result must contain the search term in at least one searchable field
          const normalizedQuery = searchQuery.toLowerCase().trim()
          
          return results.every((item) => {
            return searchableFields.some((field) => {
              const value = getNestedValue(item, field)
              if (value === null || value === undefined) return false
              return String(value).toLowerCase().includes(normalizedQuery)
            })
          })
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: Empty search returns all items
   */
  it('empty search query returns all items', () => {
    fc.assert(
      fc.property(
        fc.array(testItemArbitrary, { minLength: 0, maxLength: 50 }),
        fc.constantFrom('', '   ', '\t', '\n'),
        (items, emptyQuery) => {
          const searchableFields = ['title', 'content', 'category']
          const results = filterBySearch(items, emptyQuery, searchableFields)
          
          return results.length === items.length
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: Filtered results are a subset of original items
   */
  it('filtered results are always a subset of original items', () => {
    fc.assert(
      fc.property(
        fc.array(testItemArbitrary, { minLength: 0, maxLength: 50 }),
        searchQueryArbitrary,
        (items, searchQuery) => {
          const searchableFields = ['title', 'content', 'category']
          const results = filterBySearch(items, searchQuery, searchableFields)
          
          // Results should be a subset (length <= original)
          if (results.length > items.length) return false
          
          // Every result should exist in original items
          const itemIds = new Set(items.map(i => i.id))
          return results.every(r => itemIds.has(r.id))
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: Search is case-insensitive
   */
  it('search is case-insensitive', () => {
    fc.assert(
      fc.property(
        fc.array(testItemArbitrary, { minLength: 1, maxLength: 20 }),
        searchQueryArbitrary,
        (items, searchQuery) => {
          const searchableFields = ['title', 'content', 'category']
          
          const resultsLower = filterBySearch(items, searchQuery.toLowerCase(), searchableFields)
          const resultsUpper = filterBySearch(items, searchQuery.toUpperCase(), searchableFields)
          const resultsMixed = filterBySearch(items, searchQuery, searchableFields)
          
          // All variations should return the same results
          const idsLower = new Set(resultsLower.map(r => r.id))
          const idsUpper = new Set(resultsUpper.map(r => r.id))
          const idsMixed = new Set(resultsMixed.map(r => r.id))
          
          return (
            idsLower.size === idsUpper.size &&
            idsLower.size === idsMixed.size &&
            [...idsLower].every(id => idsUpper.has(id) && idsMixed.has(id))
          )
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: Nested field search works correctly
   */
  it('supports nested field search', () => {
    fc.assert(
      fc.property(
        fc.array(testItemArbitrary, { minLength: 0, maxLength: 30 }),
        searchQueryArbitrary,
        (items, searchQuery) => {
          const searchableFields = ['author.name']
          const results = filterBySearch(items, searchQuery, searchableFields)
          
          const normalizedQuery = searchQuery.toLowerCase().trim()
          
          return results.every((item) => {
            const authorName = item.author?.name
            if (!authorName) return false
            return authorName.toLowerCase().includes(normalizedQuery)
          })
        }
      ),
      { numRuns: 100 }
    )
  })
})

describe('itemMatchesSearch - Unit Tests', () => {
  const testItem: TestItem = {
    id: 1,
    title: 'Hello World',
    content: 'This is a test content',
    category: 'News',
    author: { name: 'John Doe' },
  }

  it('returns true when search term is found in title', () => {
    expect(itemMatchesSearch(testItem, 'Hello', ['title'])).toBe(true)
  })

  it('returns true when search term is found in content', () => {
    expect(itemMatchesSearch(testItem, 'test', ['content'])).toBe(true)
  })

  it('returns false when search term is not found', () => {
    expect(itemMatchesSearch(testItem, 'xyz123', ['title', 'content'])).toBe(false)
  })

  it('returns true for empty search query', () => {
    expect(itemMatchesSearch(testItem, '', ['title'])).toBe(true)
  })

  it('handles nested fields correctly', () => {
    expect(itemMatchesSearch(testItem, 'John', ['author.name'])).toBe(true)
  })
})

describe('getNestedValue - Unit Tests', () => {
  it('gets top-level value', () => {
    expect(getNestedValue({ name: 'test' }, 'name')).toBe('test')
  })

  it('gets nested value', () => {
    expect(getNestedValue({ user: { name: 'test' } }, 'user.name')).toBe('test')
  })

  it('returns undefined for non-existent path', () => {
    expect(getNestedValue({ name: 'test' }, 'invalid')).toBeUndefined()
  })

  it('returns undefined for null input', () => {
    expect(getNestedValue(null, 'name')).toBeUndefined()
  })
})
