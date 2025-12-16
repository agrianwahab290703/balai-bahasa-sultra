/**
 * Search filter utility for DataTable
 * Filters data based on search query across specified searchable fields
 */

export interface SearchableItem {
  id: number | string
  [key: string]: unknown
}

/**
 * Filters an array of items based on a search query
 * @param items - Array of items to filter
 * @param searchQuery - The search term to filter by
 * @param searchableFields - Array of field keys to search within
 * @returns Filtered array where each item contains the search term in at least one searchable field
 */
export function filterBySearch<T extends SearchableItem>(
  items: T[],
  searchQuery: string,
  searchableFields: (keyof T | string)[]
): T[] {
  if (!searchQuery || searchQuery.trim() === '') {
    return items
  }

  const normalizedQuery = searchQuery.toLowerCase().trim()

  return items.filter((item) => {
    return searchableFields.some((field) => {
      const value = getNestedValue(item, String(field))
      if (value === null || value === undefined) {
        return false
      }
      const stringValue = String(value).toLowerCase()
      return stringValue.includes(normalizedQuery)
    })
  })
}

/**
 * Gets a nested value from an object using dot notation
 * @param obj - The object to get the value from
 * @param path - The path to the value (e.g., 'user.name')
 * @returns The value at the path, or undefined if not found
 */
export function getNestedValue(obj: unknown, path: string): unknown {
  if (!obj || typeof obj !== 'object') {
    return undefined
  }

  const keys = path.split('.')
  let value: unknown = obj

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = (value as Record<string, unknown>)[key]
    } else {
      return undefined
    }
  }

  return value
}

/**
 * Checks if a single item matches the search query in any of the searchable fields
 * @param item - The item to check
 * @param searchQuery - The search term
 * @param searchableFields - Array of field keys to search within
 * @returns true if the item matches the search query
 */
export function itemMatchesSearch<T extends SearchableItem>(
  item: T,
  searchQuery: string,
  searchableFields: (keyof T | string)[]
): boolean {
  if (!searchQuery || searchQuery.trim() === '') {
    return true
  }

  const normalizedQuery = searchQuery.toLowerCase().trim()

  return searchableFields.some((field) => {
    const value = getNestedValue(item, String(field))
    if (value === null || value === undefined) {
      return false
    }
    const stringValue = String(value).toLowerCase()
    return stringValue.includes(normalizedQuery)
  })
}
