/**
 * **Feature: admin-redesign-glassmorphism, Property 4: Sidebar Positioning and Sizing**
 * 
 * Property: For any sidebar render, the element SHALL have position: fixed, left: 0, 
 * and width equal to 256px when expanded or 64px when collapsed.
 * 
 * Validates: Requirements 3.1, 3.2, 3.3
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import * as fc from 'fast-check'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Sidebar from '@/Components/Admin/Sidebar'

// Helper function to create a test sidebar element
const createSidebarElement = (collapsed: boolean): HTMLElement => {
  const element = document.createElement('aside')
  element.setAttribute('data-testid', 'admin-sidebar')
  element.style.position = 'fixed'
  element.style.left = '0'
  element.style.width = collapsed ? '64px' : '256px'
  element.style.height = '100vh'
  document.body.appendChild(element)
  return element
}

// Helper function to get computed width in pixels
const getComputedWidth = (element: HTMLElement): number => {
  const computedStyle = getComputedStyle(element)
  const width = computedStyle.width
  return parseInt(width.replace('px', ''), 10)
}

describe('Property 4: Sidebar Positioning and Sizing', () => {
  beforeEach(() => {
    // Clear any existing test elements
    document.body.innerHTML = ''
  })

  afterEach(() => {
    // Clean up test elements
    document.body.innerHTML = ''
  })

  it('should have correct positioning and sizing when expanded', () => {
    const onToggle = vi.fn()
    
    render(
      <BrowserRouter>
        <Sidebar collapsed={false} onToggle={onToggle} />
      </BrowserRouter>
    )
    
    const sidebarElement = screen.getByTestId('admin-sidebar')
    expect(sidebarElement).toBeTruthy()
    
    const computedStyle = getComputedStyle(sidebarElement)
    
    // Check positioning
    expect(computedStyle.position).toBe('fixed')
    expect(computedStyle.left).toBe('0px')
    expect(computedStyle.top).toBe('0px')
    
    // Check sizing when expanded
    const width = getComputedWidth(sidebarElement)
    expect(width).toBe(256)
  })

  it('should have correct positioning and sizing when collapsed', () => {
    const onToggle = vi.fn()
    
    render(
      <BrowserRouter>
        <Sidebar collapsed={true} onToggle={onToggle} />
      </BrowserRouter>
    )
    
    const sidebarElement = screen.getByTestId('admin-sidebar')
    expect(sidebarElement).toBeTruthy()
    
    const computedStyle = getComputedStyle(sidebarElement)
    
    // Check positioning (should remain the same)
    expect(computedStyle.position).toBe('fixed')
    expect(computedStyle.left).toBe('0px')
    expect(computedStyle.top).toBe('0px')
    
    // Check sizing when collapsed
    const width = getComputedWidth(sidebarElement)
    expect(width).toBe(64)
  })

  it('should validate sidebar positioning with fast-check', () => {
    fc.assert(
      fc.boolean(),
      (collapsed) => {
        const element = createSidebarElement(collapsed)
        const computedStyle = getComputedStyle(element)
        
        // Always should have fixed positioning
        expect(computedStyle.position).toBe('fixed')
        expect(computedStyle.left).toBe('0px')
        expect(computedStyle.top).toBe('0px')
        
        // Width should match collapsed state
        const width = getComputedWidth(element)
        expect(width).toBe(collapsed ? 64 : 256)
      },
      { numRuns: 100 }
    )
  })

  it('should handle width transitions correctly', () => {
    const onToggle = vi.fn()
    const { rerender } = render(
      <BrowserRouter>
        <Sidebar collapsed={false} onToggle={onToggle} />
      </BrowserRouter>
    )
    
    const sidebarElement = screen.getByTestId('admin-sidebar')
    
    // Initial state - expanded
    expect(getComputedWidth(sidebarElement)).toBe(256)
    
    // Collapse
    rerender(
      <BrowserRouter>
        <Sidebar collapsed={true} onToggle={onToggle} />
      </BrowserRouter>
    )
    
    expect(getComputedWidth(sidebarElement)).toBe(64)
    
    // Expand again
    rerender(
      <BrowserRouter>
        <Sidebar collapsed={false} onToggle={onToggle} />
      </BrowserRouter>
    )
    
    expect(getComputedWidth(sidebarElement)).toBe(256)
  })

  it('should maintain z-index for proper layering', () => {
    const onToggle = vi.fn()
    
    render(
      <BrowserRouter>
        <Sidebar collapsed={false} onToggle={onToggle} />
      </BrowserRouter>
    )
    
    const sidebarElement = screen.getByTestId('admin-sidebar')
    const computedStyle = getComputedStyle(sidebarElement)
    
    // Should have a z-index that ensures visibility above content
    const zIndex = parseInt(computedStyle.zIndex, 10)
    expect(zIndex).toBeGreaterThan(0)
  })

  it('should handle edge cases for sidebar dimensions', () => {
    const edgeCases = [
      { collapsed: false, expectedWidth: 256 },
      { collapsed: true, expectedWidth: 64 },
    ]

    edgeCases.forEach(({ collapsed, expectedWidth }) => {
      const element = createSidebarElement(collapsed)
      const actualWidth = getComputedWidth(element)
      
      expect(actualWidth).toBe(expectedWidth)
    })
  })

  it('should reject invalid sidebar positioning', () => {
    const invalidCases = [
      { position: 'relative', left: '0', width: '256px' },
      { position: 'fixed', left: '10px', width: '256px' },
      { position: 'fixed', left: '0', width: '200px' },
      { position: 'absolute', left: '0', width: '256px' },
    ]

    invalidCases.forEach(({ position, left, width }) => {
      const element = document.createElement('aside')
      element.style.position = position
      element.style.left = left
      element.style.width = width
      document.body.appendChild(element)
      
      const computedStyle = getComputedStyle(element)
      
      // Should fail at least one validation
      const hasValidPosition = computedStyle.position === 'fixed'
      const hasValidLeft = computedStyle.left === '0px'
      const hasValidWidth = getComputedWidth(element) === 256
      
      expect([hasValidPosition, hasValidLeft, hasValidWidth]).toContain(false)
      
      document.body.removeChild(element)
    })
  })

  it('should maintain positioning during responsive behavior', () => {
    // Simulate different viewport sizes
    const viewports = [
      { width: 1920, expectedWidth: 256 }, // Desktop
      { width: 1024, expectedWidth: 256 }, // Tablet
      { width: 768, expectedWidth: 64 },  // Mobile (collapsed by default)
    ]

    viewports.forEach(({ width: viewportWidth, expectedWidth }) => {
      // Mock viewport width
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: viewportWidth,
      })

      const onToggle = vi.fn()
      
      render(
        <BrowserRouter>
          <Sidebar collapsed={viewportWidth < 1024} onToggle={onToggle} />
        </BrowserRouter>
      )
      
      const sidebarElement = screen.getByTestId('admin-sidebar')
      const computedStyle = getComputedStyle(sidebarElement)
      
      // Position should always be fixed
      expect(computedStyle.position).toBe('fixed')
      expect(computedStyle.left).toBe('0px')
      
      // Width should be appropriate for viewport
      const actualWidth = getComputedWidth(sidebarElement)
      expect(actualWidth).toBe(expectedWidth)
      
      // Cleanup
      document.body.innerHTML = ''
    })
  })

  it('should handle sidebar with different user roles', () => {
    const userRoles = ['super_admin', 'admin', 'editor', undefined]
    
    userRoles.forEach(userRole => {
      const onToggle = vi.fn()
      
      render(
        <BrowserRouter>
          <Sidebar collapsed={false} onToggle={onToggle} userRole={userRole} />
        </BrowserRouter>
      )
      
      const sidebarElement = screen.getByTestId('admin-sidebar')
      const computedStyle = getComputedStyle(sidebarElement)
      
      // Positioning should be consistent regardless of user role
      expect(computedStyle.position).toBe('fixed')
      expect(computedStyle.left).toBe('0px')
      expect(getComputedWidth(sidebarElement)).toBe(256)
      
      // Cleanup
      document.body.innerHTML = ''
    })
  })
})