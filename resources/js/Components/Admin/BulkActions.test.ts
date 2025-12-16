import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { executeBulkOperation } from './BulkActions'

/**
 * **Feature: admin-crud-management, Property 4: Bulk Operation Completeness**
 * **Validates: Requirements 1.6**
 * 
 * Property: For any bulk action (publish, unpublish, delete) on a set of selected items,
 * the action SHALL be applied to ALL selected items, and the count of affected items
 * SHALL equal the count of selected items.
 */

interface TestItem {
  id: number
  title: string
  status: 'draft' | 'published'
  isDeleted: boolean
}

// Arbitrary for generating test items
const testItemArbitrary = fc.record({
  id: fc.integer({ min: 1, max: 10000 }),
  title: fc.string({ minLength: 1, maxLength: 100 }),
  status: fc.constantFrom('draft', 'published') as fc.Arbitrary<'draft' | 'published'>,
  isDeleted: fc.boolean(),
})

// Generate unique items (no duplicate IDs)
const uniqueItemsArbitrary = fc
  .array(testItemArbitrary, { minLength: 1, maxLength: 50 })
  .map((items) => {
    const seen = new Set<number>()
    return items.filter((item) => {
      if (seen.has(item.id)) return false
      seen.add(item.id)
      return true
    })
  })
  .filter((items) => items.length > 0)

describe('Bulk Operations - Property Tests', () => {
  /**
   * Property 4: Bulk Operation Completeness
   * The count of affected items SHALL equal the count of selected items
   */
  it('processed count equals selected count for valid selections', () => {
    fc.assert(
      fc.property(
        uniqueItemsArbitrary,
        (items) => {
          // Select a random subset of item IDs
          const allIds = items.map((i) => i.id)
          const selectedIds = allIds.filter(() => Math.random() > 0.5)
          
          if (selectedIds.length === 0) return true // Skip empty selections
          
          const publishOperation = (item: TestItem): TestItem => ({
            ...item,
            status: 'published',
          })
          
          const { processedCount } = executeBulkOperation(
            items,
            selectedIds,
            publishOperation
          )
          
          // The processed count must equal the number of selected IDs that exist in items
          const existingSelectedIds = selectedIds.filter((id) =>
            items.some((item) => item.id === id)
          )
          
          return processedCount === existingSelectedIds.length
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: All selected items are modified by the operation
   */
  it('all selected items are modified by the operation', () => {
    fc.assert(
      fc.property(
        uniqueItemsArbitrary,
        (items) => {
          const allIds = items.map((i) => i.id)
          const selectedIds = allIds.filter(() => Math.random() > 0.5)
          
          if (selectedIds.length === 0) return true
          
          // Operation that sets status to 'published'
          const publishOperation = (item: TestItem): TestItem => ({
            ...item,
            status: 'published',
          })
          
          const { processedItems } = executeBulkOperation(
            items,
            selectedIds,
            publishOperation
          )
          
          // All selected items should now have status 'published'
          const selectedIdSet = new Set(selectedIds)
          return processedItems.every((item) => {
            if (selectedIdSet.has(item.id)) {
              return item.status === 'published'
            }
            return true // Non-selected items can have any status
          })
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: Non-selected items remain unchanged
   */
  it('non-selected items remain unchanged', () => {
    fc.assert(
      fc.property(
        uniqueItemsArbitrary,
        (items) => {
          const allIds = items.map((i) => i.id)
          const selectedIds = allIds.filter(() => Math.random() > 0.5)
          
          const deleteOperation = (item: TestItem): TestItem => ({
            ...item,
            isDeleted: true,
          })
          
          const { processedItems } = executeBulkOperation(
            items,
            selectedIds,
            deleteOperation
          )
          
          const selectedIdSet = new Set(selectedIds)
          const originalItemMap = new Map(items.map((i) => [i.id, i]))
          
          // Non-selected items should remain unchanged
          return processedItems.every((item) => {
            if (!selectedIdSet.has(item.id)) {
              const original = originalItemMap.get(item.id)
              return (
                original &&
                item.title === original.title &&
                item.status === original.status &&
                item.isDeleted === original.isDeleted
              )
            }
            return true
          })
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: Total item count remains the same after bulk operation
   */
  it('total item count remains the same after bulk operation', () => {
    fc.assert(
      fc.property(
        uniqueItemsArbitrary,
        fc.array(fc.integer({ min: 1, max: 10000 }), { minLength: 0, maxLength: 20 }),
        (items, selectedIds) => {
          const operation = (item: TestItem): TestItem => ({
            ...item,
            status: 'published',
          })
          
          const { processedItems } = executeBulkOperation(items, selectedIds, operation)
          
          return processedItems.length === items.length
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: Empty selection results in zero processed count
   */
  it('empty selection results in zero processed count', () => {
    fc.assert(
      fc.property(
        uniqueItemsArbitrary,
        (items) => {
          const operation = (item: TestItem): TestItem => ({
            ...item,
            status: 'published',
          })
          
          const { processedCount, processedItems } = executeBulkOperation(
            items,
            [], // Empty selection
            operation
          )
          
          // No items should be processed
          if (processedCount !== 0) return false
          
          // All items should remain unchanged
          return processedItems.every((item, index) => {
            const original = items[index]
            return (
              item.id === original.id &&
              item.title === original.title &&
              item.status === original.status &&
              item.isDeleted === original.isDeleted
            )
          })
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: Selecting all items processes all items
   */
  it('selecting all items processes all items', () => {
    fc.assert(
      fc.property(
        uniqueItemsArbitrary,
        (items) => {
          const allIds = items.map((i) => i.id)
          
          const operation = (item: TestItem): TestItem => ({
            ...item,
            status: 'published',
          })
          
          const { processedCount, processedItems } = executeBulkOperation(
            items,
            allIds,
            operation
          )
          
          // All items should be processed
          if (processedCount !== items.length) return false
          
          // All items should have the new status
          return processedItems.every((item) => item.status === 'published')
        }
      ),
      { numRuns: 100 }
    )
  })
})

describe('executeBulkOperation - Unit Tests', () => {
  const testItems: TestItem[] = [
    { id: 1, title: 'Item 1', status: 'draft', isDeleted: false },
    { id: 2, title: 'Item 2', status: 'draft', isDeleted: false },
    { id: 3, title: 'Item 3', status: 'published', isDeleted: false },
  ]

  it('publishes selected items', () => {
    const { processedItems, processedCount } = executeBulkOperation(
      testItems,
      [1, 2],
      (item) => ({ ...item, status: 'published' })
    )

    expect(processedCount).toBe(2)
    expect(processedItems[0].status).toBe('published')
    expect(processedItems[1].status).toBe('published')
    expect(processedItems[2].status).toBe('published') // Already published
  })

  it('handles non-existent IDs gracefully', () => {
    const { processedItems, processedCount } = executeBulkOperation(
      testItems,
      [999, 1000], // Non-existent IDs
      (item) => ({ ...item, status: 'published' })
    )

    expect(processedCount).toBe(0)
    expect(processedItems.length).toBe(3)
  })

  it('soft deletes selected items', () => {
    const { processedItems, processedCount } = executeBulkOperation(
      testItems,
      [1, 3],
      (item) => ({ ...item, isDeleted: true })
    )

    expect(processedCount).toBe(2)
    expect(processedItems[0].isDeleted).toBe(true)
    expect(processedItems[1].isDeleted).toBe(false) // Not selected
    expect(processedItems[2].isDeleted).toBe(true)
  })
})
