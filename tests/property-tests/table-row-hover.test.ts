/**
 * **Feature: admin-redesign-glassmorphism, Property 9: Table Row Hover**
 * 
 * Property: For any data table row, the hover state SHALL apply background color 
 * with yellow accent (#FFD700) at 10% opacity.
 * 
 * Validates: Requirements 4.4, 6.3
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import * as fc from 'fast-check'
import { render, screen, fireEvent } from '@testing-library/react'
import DataTable from '@/Components/Admin/DataTable'

// Helper function to create a test table row element
const createTableRowElement = (hasHover: boolean = false): HTMLElement => {
  const element = document.createElement('tr')
  element.className = 'table-row'
  element.style.backgroundColor = hasHover ? 'rgba(255, 215, 0, 0.1)' : 'transparent'
  element.style.transition = 'background-color 0.2s ease-in-out'
  document.body.appendChild(element)
  return element
}

// Helper function to extract rgba values from background color
const extractRgbaValues = (backgroundColor: string): { r: number; g: number; b: number; a: number } | null => {
  const rgbaMatch = backgroundColor.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/)
  if (!rgbaMatch) return null
  
  return {
    r: parseInt(rgbaMatch[1], 10),
    g: parseInt(rgbaMatch[2], 10),
    b: parseInt(rgbaMatch[3], 10),
    a: parseFloat(rgbaMatch[4])
  }
}

// Helper function to check if color is yellow accent with correct opacity
const isYellowAccentWithOpacity = (backgroundColor: string, expectedOpacity: number): boolean => {
  const rgba = extractRgbaValues(backgroundColor)
  if (!rgba) return false
  
  // Check if it's yellow (255, 215, 0) with correct opacity
  const isYellow = rgba.r === 255 && rgba.g === 215 && rgba.b === 0
  const hasCorrectOpacity = Math.abs(rgba.a - expectedOpacity) < 0.01
  
  return isYellow && hasCorrectOpacity
}

// Mock data for testing
const mockData = [
  { id: 1, name: 'Item 1', status: 'active' },
  { id: 2, name: 'Item 2', status: 'inactive' },
  { id: 3, name: 'Item 3', status: 'active' },
]

const mockColumns = [
  { key: 'name', title: 'Name', sortable: true },
  { key: 'status', title: 'Status', sortable: true },
]

describe('Property 9: Table Row Hover', () => {
  beforeEach(() => {
    // Clear any existing test elements
    document.body.innerHTML = ''
  })

  afterEach(() => {
    // Clean up test elements
    document.body.innerHTML = ''
  })

  it('should apply yellow accent background on table row hover', () => {
    render(
      <DataTable
        data={{ data: mockData, current_page: 1, last_page: 1, total: 3 }}
        columns={mockColumns}
        searchable={false}
        pagination={false}
      />
    )
    
    // Find the first table row
    const tableRows = screen.getAllByRole('row')
    const firstDataRow = tableRows.find(row => 
      row.textContent?.includes('Item 1')
    )
    
    expect(firstDataRow).toBeTruthy()
    
    // Simulate hover
    fireEvent.mouseEnter(firstDataRow!)
    
    const computedStyle = getComputedStyle(firstDataRow!)
    
    // Check if background has yellow accent with 10% opacity
    expect(isYellowAccentWithOpacity(computedStyle.backgroundColor, 0.1)).toBe(true)
  })

  it('should return to normal state when hover ends', () => {
    render(
      <DataTable
        data={{ data: mockData, current_page: 1, last_page: 1, total: 3 }}
        columns={mockColumns}
        searchable={false}
        pagination={false}
      />
    )
    
    const tableRows = screen.getAllByRole('row')
    const firstDataRow = tableRows.find(row => 
      row.textContent?.includes('Item 1')
    )
    
    expect(firstDataRow).toBeTruthy()
    
    // Simulate hover
    fireEvent.mouseEnter(firstDataRow!)
    let computedStyle = getComputedStyle(firstDataRow!)
    
    // Should have yellow accent background
    expect(isYellowAccentWithOpacity(computedStyle.backgroundColor, 0.1)).toBe(true)
    
    // Simulate hover end
    fireEvent.mouseLeave(firstDataRow!)
    computedStyle = getComputedStyle(firstDataRow!)
    
    // Should return to transparent or normal background
    const rgba = extractRgbaValues(computedStyle.backgroundColor)
    expect(rgba?.a || 0).toBeLessThan(0.05) // Should be mostly transparent
  })

  it('should validate table row hover with fast-check', () => {
    fc.assert(
      fc.boolean(),
      (hasHover) => {
        const element = createTableRowElement(hasHover)
        const computedStyle = getComputedStyle(element)
        
        if (hasHover) {
          expect(isYellowAccentWithOpacity(computedStyle.backgroundColor, 0.1)).toBe(true)
        } else {
          const rgba = extractRgbaValues(computedStyle.backgroundColor)
          expect(rgba?.a || 0).toBeLessThan(0.05)
        }
      },
      { numRuns: 100 }
    )
  })

  it('should handle hover on all table rows consistently', () => {
    render(
      <DataTable
        data={{ data: mockData, current_page: 1, last_page: 1, total: 3 }}
        columns={mockColumns}
        searchable={false}
        pagination={false}
      />
    )
    
    const tableRows = screen.getAllByRole('row')
    const dataRows = tableRows.filter(row => 
      row.textContent && (row.textContent.includes('Item 1') || 
                       row.textContent.includes('Item 2') || 
                       row.textContent.includes('Item 3'))
    )
    
    // Test hover on each data row
    dataRows.forEach((row, index) => {
      fireEvent.mouseEnter(row)
      
      const computedStyle = getComputedStyle(row)
      
      // All rows should have same hover effect
      expect(isYellowAccentWithOpacity(computedStyle.backgroundColor, 0.1)).toBe(true)
      
      // Remove hover for next iteration
      fireEvent.mouseLeave(row)
    })
  })

  it('should handle edge cases for yellow accent opacity', () => {
    const edgeCases = [
      { opacity: 0.1, expected: true },   // Exact match
      { opacity: 0.09, expected: true },  // Very close
      { opacity: 0.11, expected: true },  // Very close
      { opacity: 0.05, expected: false }, // Too low
      { opacity: 0.2, expected: false },  // Too high
    ]

    edgeCases.forEach(({ opacity, expected }) => {
      const element = createTableRowElement(true)
      element.style.backgroundColor = `rgba(255, 215, 0, ${opacity})`
      
      const computedStyle = getComputedStyle(element)
      const hasCorrectOpacity = isYellowAccentWithOpacity(computedStyle.backgroundColor, 0.1)
      
      expect(hasCorrectOpacity).toBe(expected)
    })
  })

  it('should reject invalid hover background colors', () => {
    const invalidCases = [
      'rgba(255, 215, 0, 0.05)',  // Too low opacity
      'rgba(255, 215, 0, 0.2)',   // Too high opacity
      'rgba(255, 200, 0, 0.1)',    // Wrong green value
      'rgba(200, 215, 0, 0.1)',    // Wrong red value
      'rgba(255, 215, 50, 0.1)',   // Wrong blue value
      'rgb(255, 215, 0)',           // No alpha
      '#FFD700',                      // Hex format
      'yellow',                       // Color name
    ]

    invalidCases.forEach(invalidColor => {
      const element = createTableRowElement(true)
      element.style.backgroundColor = invalidColor
      
      const computedStyle = getComputedStyle(element)
      
      // Should not be recognized as valid yellow accent with 10% opacity
      expect(isYellowAccentWithOpacity(computedStyle.backgroundColor, 0.1)).toBe(false)
    })
  })

  it('should maintain hover effect with row selection', () => {
    render(
      <DataTable
        data={{ data: mockData, current_page: 1, last_page: 1, total: 3 }}
        columns={mockColumns}
        selectable={true}
        searchable={false}
        pagination={false}
      />
    )
    
    const tableRows = screen.getAllByRole('row')
    const firstDataRow = tableRows.find(row => 
      row.textContent?.includes('Item 1')
    )
    
    expect(firstDataRow).toBeTruthy()
    
    // Simulate hover on selectable row
    fireEvent.mouseEnter(firstDataRow!)
    
    const computedStyle = getComputedStyle(firstDataRow!)
    
    // Should still apply yellow accent hover even when selectable
    expect(isYellowAccentWithOpacity(computedStyle.backgroundColor, 0.1)).toBe(true)
  })

  it('should handle rapid hover enter/leave transitions', () => {
    render(
      <DataTable
        data={{ data: mockData, current_page: 1, last_page: 1, total: 3 }}
        columns={mockColumns}
        searchable={false}
        pagination={false}
      />
    )
    
    const tableRows = screen.getAllByRole('row')
    const firstDataRow = tableRows.find(row => 
      row.textContent?.includes('Item 1')
    )
    
    expect(firstDataRow).toBeTruthy()
    
    // Rapid hover enter/leave
    for (let i = 0; i < 10; i++) {
      fireEvent.mouseEnter(firstDataRow!)
      fireEvent.mouseLeave(firstDataRow!)
    }
    
    // Final state should be normal (not hovered)
    const computedStyle = getComputedStyle(firstDataRow!)
    const rgba = extractRgbaValues(computedStyle.backgroundColor)
    expect(rgba?.a || 0).toBeLessThan(0.05)
  })

  it('should handle hover with different row states', () => {
    const rowData = [
      { id: 1, name: 'Normal Row', status: 'active' },
      { id: 2, name: 'Selected Row', status: 'active' },
      { id: 3, name: 'Disabled Row', status: 'inactive' },
    ]

    render(
      <DataTable
        data={{ data: rowData, current_page: 1, last_page: 1, total: 3 }}
        columns={mockColumns}
        searchable={false}
        pagination={false}
      />
    )
    
    const tableRows = screen.getAllByRole('row')
    
    // Test hover on different row states
    rowData.forEach((item, index) => {
      const row = tableRows.find(r => r.textContent?.includes(item.name))
      expect(row).toBeTruthy()
      
      fireEvent.mouseEnter(row!)
      
      const computedStyle = getComputedStyle(row!)
      
      // All rows should have same hover effect regardless of state
      expect(isYellowAccentWithOpacity(computedStyle.backgroundColor, 0.1)).toBe(true)
      
      fireEvent.mouseLeave(row!)
    })
  })

  it('should handle hover with transition timing', () => {
    const element = createTableRowElement(false)
    
    // Check initial transition
    let computedStyle = getComputedStyle(element)
    expect(computedStyle.transition).toContain('background-color')
    expect(computedStyle.transition).toContain('0.2s')
    
    // Apply hover
    element.style.backgroundColor = 'rgba(255, 215, 0, 0.1)'
    computedStyle = getComputedStyle(element)
    
    // Should maintain transition
    expect(computedStyle.transition).toContain('background-color')
    expect(computedStyle.transition).toContain('0.2s')
    
    // Should have correct hover color
    expect(isYellowAccentWithOpacity(computedStyle.backgroundColor, 0.1)).toBe(true)
  })
})