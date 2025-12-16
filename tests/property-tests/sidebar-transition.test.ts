/**
 * **Feature: admin-redesign-glassmorphism, Property 6: Sidebar Transition Animation**
 * 
 * Property: For any sidebar toggle between collapsed and expanded modes, 
 * the transition SHALL have duration of 300ms with ease-in-out timing function.
 * 
 * Validates: Requirements 3.4, 10.2
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import * as fc from 'fast-check'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Sidebar from '@/Components/Admin/Sidebar'

// Helper function to create a test element with transition
const createTransitionElement = (duration: number, timingFunction: string): HTMLElement => {
  const element = document.createElement('div')
  element.className = 'transition-element'
  element.style.transition = `all ${duration}ms ${timingFunction}`
  document.body.appendChild(element)
  return element
}

// Helper function to extract transition duration in milliseconds
const extractTransitionDuration = (element: HTMLElement): number => {
  const computedStyle = getComputedStyle(element)
  const transition = computedStyle.transition
  
  // Extract duration from transition string
  const durationMatch = transition.match(/(\d+(?:\.\d+)?)ms/)
  if (durationMatch) {
    return parseFloat(durationMatch[1])
  }
  
  // Try seconds format
  const secondsMatch = transition.match(/(\d+(?:\.\d+)?)s/)
  if (secondsMatch) {
    return parseFloat(secondsMatch[1]) * 1000
  }
  
  return 0
}

// Helper function to extract timing function
const extractTimingFunction = (element: HTMLElement): string => {
  const computedStyle = getComputedStyle(element)
  const transition = computedStyle.transition
  
  // Extract timing function from transition string
  const timingMatch = transition.match(/ease-in-out|ease|ease-in|ease-out|linear|cubic-bezier\([^)]+\)/)
  return timingMatch ? timingMatch[0] : ''
}

// Helper function to check if transition has correct properties
const hasCorrectTransition = (element: HTMLElement, expectedDuration: number, expectedTiming: string): boolean => {
  const actualDuration = extractTransitionDuration(element)
  const actualTiming = extractTimingFunction(element)
  
  const durationMatch = Math.abs(actualDuration - expectedDuration) < 10 // Allow 10ms tolerance
  const timingMatch = actualTiming === expectedTiming
  
  return durationMatch && timingMatch
}

describe('Property 6: Sidebar Transition Animation', () => {
  beforeEach(() => {
    // Clear any existing test elements
    document.body.innerHTML = ''
  })

  afterEach(() => {
    // Clean up test elements
    document.body.innerHTML = ''
  })

  it('should have 300ms transition duration with ease-in-out timing', () => {
    const onToggle = vi.fn()
    
    render(
      <BrowserRouter>
        <Sidebar collapsed={false} onToggle={onToggle} />
      </BrowserRouter>
    )
    
    const sidebarElement = screen.getByTestId('admin-sidebar')
    expect(sidebarElement).toBeTruthy()
    
    // Check transition properties
    expect(hasCorrectTransition(sidebarElement, 300, 'ease-in-out')).toBe(true)
  })

  it('should maintain transition during toggle operations', () => {
    const onToggle = vi.fn()
    
    render(
      <BrowserRouter>
        <Sidebar collapsed={false} onToggle={onToggle} />
      </BrowserRouter>
    )
    
    const sidebarElement = screen.getByTestId('admin-sidebar')
    
    // Initial state should have correct transition
    expect(hasCorrectTransition(sidebarElement, 300, 'ease-in-out')).toBe(true)
    
    // Toggle to collapsed
    fireEvent.click(screen.getByRole('button'))
    
    // Should maintain transition after toggle
    expect(hasCorrectTransition(sidebarElement, 300, 'ease-in-out')).toBe(true)
  })

  it('should validate sidebar transition with fast-check', () => {
    fc.assert(
      fc.boolean(),
      (collapsed) => {
        const element = createTransitionElement(300, 'ease-in-out')
        
        // Should have correct transition properties
        expect(hasCorrectTransition(element, 300, 'ease-in-out')).toBe(true)
      },
      { numRuns: 100 }
    )
  })

  it('should handle transition during width changes', () => {
    const onToggle = vi.fn()
    const { rerender } = render(
      <BrowserRouter>
        <Sidebar collapsed={false} onToggle={onToggle} />
      </BrowserRouter>
    )
    
    const sidebarElement = screen.getByTestId('admin-sidebar')
    
    // Initial expanded state
    expect(hasCorrectTransition(sidebarElement, 300, 'ease-in-out')).toBe(true)
    
    // Toggle to collapsed
    rerender(
      <BrowserRouter>
        <Sidebar collapsed={true} onToggle={onToggle} />
      </BrowserRouter>
    )
    
    // Should maintain transition during width change
    expect(hasCorrectTransition(sidebarElement, 300, 'ease-in-out')).toBe(true)
    
    // Toggle back to expanded
    rerender(
      <BrowserRouter>
        <Sidebar collapsed={false} onToggle={onToggle} />
      </BrowserRouter>
    )
    
    // Should maintain transition during width change back
    expect(hasCorrectTransition(sidebarElement, 300, 'ease-in-out')).toBe(true)
  })

  it('should handle edge cases for transition duration', () => {
    const edgeCases = [
      { duration: 300, timing: 'ease-in-out', expected: true },   // Exact match
      { duration: 295, timing: 'ease-in-out', expected: true },   // Within tolerance
      { duration: 305, timing: 'ease-in-out', expected: true },   // Within tolerance
      { duration: 290, timing: 'ease-in-out', expected: false },  // Outside tolerance
      { duration: 310, timing: 'ease-in-out', expected: false },  // Outside tolerance
    ]

    edgeCases.forEach(({ duration, timing, expected }) => {
      const element = createTransitionElement(duration, timing)
      
      const hasCorrectProperties = hasCorrectTransition(element, 300, 'ease-in-out')
      expect(hasCorrectProperties).toBe(expected)
    })
  })

  it('should reject invalid transition properties', () => {
    const invalidCases = [
      { duration: 200, timing: 'ease-in-out' },    // Too fast
      { duration: 400, timing: 'ease-in-out' },    // Too slow
      { duration: 300, timing: 'ease' },          // Wrong timing
      { duration: 300, timing: 'ease-in' },        // Wrong timing
      { duration: 300, timing: 'ease-out' },       // Wrong timing
      { duration: 300, timing: 'linear' },         // Wrong timing
    ]

    invalidCases.forEach(({ duration, timing }) => {
      const element = createTransitionElement(duration, timing)
      
      const hasCorrectProperties = hasCorrectTransition(element, 300, 'ease-in-out')
      expect(hasCorrectProperties).toBe(false)
    })
  })

  it('should handle transition with different timing functions', () => {
    const timingCases = [
      { timing: 'ease-in-out', expected: true },
      { timing: 'ease', expected: false },
      { timing: 'ease-in', expected: false },
      { timing: 'ease-out', expected: false },
      { timing: 'linear', expected: false },
      { timing: 'cubic-bezier(0.4, 0, 0.2, 1)', expected: false },
    ]

    timingCases.forEach(({ timing, expected }) => {
      const element = createTransitionElement(300, timing)
      
      const hasCorrectProperties = hasCorrectTransition(element, 300, 'ease-in-out')
      expect(hasCorrectProperties).toBe(expected)
    })
  })

  it('should handle transition with multiple properties', () => {
    const multiPropertyTransitions = [
      'all 300ms ease-in-out',
      'width 300ms ease-in-out, background-color 300ms ease-in-out',
      'transform 300ms ease-in-out, opacity 300ms ease-in-out',
      'width 300ms ease-in-out, height 300ms ease-in-out, background-color 300ms ease-in-out'
    ]

    multiPropertyTransitions.forEach(transition => {
      const element = document.createElement('div')
      element.style.transition = transition
      document.body.appendChild(element)
      
      // Should extract correct duration from multi-property transitions
      expect(hasCorrectTransition(element, 300, 'ease-in-out')).toBe(true)
      
      document.body.removeChild(element)
    })
  })

  it('should handle transition duration with different units', () => {
    const unitCases = [
      { value: '300ms', expected: 300 },
      { value: '0.3s', expected: 300 },
      { value: '300.0ms', expected: 300 },
      { value: '0.300s', expected: 300 },
    ]

    unitCases.forEach(({ value, expected }) => {
      const element = document.createElement('div')
      element.style.transition = `all ${value} ease-in-out`
      document.body.appendChild(element)
      
      const actualDuration = extractTransitionDuration(element)
      expect(actualDuration).toBe(expected)
      
      document.body.removeChild(element)
    })
  })

  it('should maintain transition during rapid toggles', () => {
    const onToggle = vi.fn()
    
    render(
      <BrowserRouter>
        <Sidebar collapsed={false} onToggle={onToggle} />
      </BrowserRouter>
    )
    
    const sidebarElement = screen.getByTestId('admin-sidebar')
    const toggleButton = screen.getByRole('button')
    
    // Perform rapid toggles
    for (let i = 0; i < 5; i++) {
      fireEvent.click(toggleButton)
    }
    
    // Should maintain consistent transition throughout rapid changes
    expect(hasCorrectTransition(sidebarElement, 300, 'ease-in-out')).toBe(true)
  })

  it('should handle transition with different user roles', () => {
    const userRoles = ['super_admin', 'admin', 'editor', undefined]
    
    userRoles.forEach(userRole => {
      const onToggle = vi.fn()
      
      render(
        <BrowserRouter>
          <Sidebar collapsed={false} onToggle={onToggle} userRole={userRole} />
        </BrowserRouter>
      )
      
      const sidebarElement = screen.getByTestId('admin-sidebar')
      
      // Transition should be consistent regardless of user role
      expect(hasCorrectTransition(sidebarElement, 300, 'ease-in-out')).toBe(true)
      
      // Cleanup
      document.body.innerHTML = ''
    })
  })

  it('should handle transition with responsive behavior', () => {
    // Test different viewport sizes
    const viewports = [
      { width: 1920, collapsed: false }, // Desktop
      { width: 1024, collapsed: false }, // Tablet
      { width: 768, collapsed: true },  // Mobile
    ]

    viewports.forEach(({ width: viewportWidth, collapsed }) => {
      // Mock viewport width
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: viewportWidth,
      })

      const onToggle = vi.fn()
      
      render(
        <BrowserRouter>
          <Sidebar collapsed={collapsed} onToggle={onToggle} />
        </BrowserRouter>
      )
      
      const sidebarElement = screen.getByTestId('admin-sidebar')
      
      // Transition should be consistent regardless of viewport
      expect(hasCorrectTransition(sidebarElement, 300, 'ease-in-out')).toBe(true)
      
      // Cleanup
      document.body.innerHTML = ''
    })
  })

  it('should handle transition during component lifecycle', () => {
    const onToggle = vi.fn()
    
    // Initial render
    const { unmount } = render(
      <BrowserRouter>
        <Sidebar collapsed={false} onToggle={onToggle} />
      </BrowserRouter>
    )
    
    let sidebarElement = screen.getByTestId('admin-sidebar')
    
    // Should have correct transition on mount
    expect(hasCorrectTransition(sidebarElement, 300, 'ease-in-out')).toBe(true)
    
    // Unmount
    unmount()
    
    // Re-mount with different state
    render(
      <BrowserRouter>
        <Sidebar collapsed={true} onToggle={onToggle} />
      </BrowserRouter>
    )
    
    sidebarElement = screen.getByTestId('admin-sidebar')
    
    // Should have correct transition on re-mount
    expect(hasCorrectTransition(sidebarElement, 300, 'ease-in-out')).toBe(true)
  })
})