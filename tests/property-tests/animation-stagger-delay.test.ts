/**
 * **Feature: admin-redesign-glassmorphism, Property 13: Animation Stagger Delay**
 * 
 * Property: For any dashboard statistics cards, each card SHALL have animation-delay 
 * incrementing by 50ms from the previous card.
 * 
 * Validates: Requirements 10.3
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import * as fc from 'fast-check'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Dashboard from '@/Pages/Admin/Dashboard'

// Helper function to create a test element with animation delay
const createAnimatedElement = (delay: number): HTMLElement => {
  const element = document.createElement('div')
  element.className = 'animate-fade-in'
  element.style.animationDelay = `${delay}ms`
  element.style.animation = 'fadeIn 0.3s ease-in-out forwards'
  document.body.appendChild(element)
  return element
}

// Helper function to extract animation delay in milliseconds
const extractAnimationDelay = (element: HTMLElement): number => {
  const computedStyle = getComputedStyle(element)
  const delay = computedStyle.animationDelay
  
  if (delay.endsWith('ms')) {
    return parseFloat(delay)
  } else if (delay.endsWith('s')) {
    return parseFloat(delay) * 1000
  }
  
  return 0
}

// Helper function to check if delays follow stagger pattern
const hasCorrectStaggerPattern = (delays: number[], expectedIncrement: number): boolean => {
  for (let i = 1; i < delays.length; i++) {
    const expectedDelay = delays[i - 1] + expectedIncrement
    const actualDelay = delays[i]
    
    if (Math.abs(actualDelay - expectedDelay) > 5) { // Allow 5ms tolerance
      return false
    }
  }
  return true
}

describe('Property 13: Animation Stagger Delay', () => {
  beforeEach(() => {
    // Clear any existing test elements
    document.body.innerHTML = ''
  })

  afterEach(() => {
    // Clean up test elements
    document.body.innerHTML = ''
  })

  it('should have correct stagger delay on dashboard statistics cards', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    )
    
    // Find statistics cards (they should have stagger animation)
    const statsCards = screen.getAllByText(/Total|Berita|Galeri|Kunjungan|Pengguna/i)
      .map(text => text.closest('[style*="animation-delay"]'))
      .filter(Boolean)
    
    expect(statsCards.length).toBeGreaterThan(0)
    
    // Extract animation delays
    const delays = statsCards.map(card => 
      extractAnimationDelay(card as HTMLElement)
    )
    
    // Check if delays follow 50ms increment pattern
    expect(hasCorrectStaggerPattern(delays, 50)).toBe(true)
    
    // First card should have 0ms delay
    expect(delays[0]).toBe(0)
    
    // Second card should have 50ms delay
    expect(delays[1]).toBe(50)
    
    // Third card should have 100ms delay
    expect(delays[2]).toBe(100)
    
    // Fourth card should have 150ms delay
    expect(delays[3]).toBe(150)
  })

  it('should validate stagger delay with fast-check', () => {
    fc.assert(
      fc.array(fc.integer({ min: 0, max: 1000 }), { minLength: 2, maxLength: 10 }),
      (baseDelays) => {
        // Create staggered delays with 50ms increment
        const staggeredDelays = baseDelays.map((delay, index) => 
          index === 0 ? delay : delay + (index * 50)
        )
        
        // Create elements with these delays
        const elements = staggeredDelays.map(delay => 
          createAnimatedElement(delay)
        )
        
        // Verify each element has correct delay
        const actualDelays = elements.map(element => 
          extractAnimationDelay(element)
        )
        
        // Check stagger pattern
        expect(hasCorrectStaggerPattern(actualDelays, 50)).toBe(true)
        
        // Clean up
        elements.forEach(element => {
          if (element.parentNode) {
            element.parentNode.removeChild(element)
          }
        })
      },
      { numRuns: 50 }
    )
  })

  it('should handle edge cases for stagger delays', () => {
    const edgeCases = [
      [0, 50, 100, 150],        // Standard pattern
      [0, 50, 100],               // Three cards
      [0, 50],                     // Two cards
      [0],                           // Single card
    ]

    edgeCases.forEach(expectedDelays => {
      // Create elements with expected delays
      const elements = expectedDelays.map(delay => 
        createAnimatedElement(delay)
      )
      
      // Verify delays
      const actualDelays = elements.map(element => 
        extractAnimationDelay(element)
      )
      
      expect(actualDelays).toEqual(expectedDelays)
      expect(hasCorrectStaggerPattern(actualDelays, 50)).toBe(true)
      
      // Clean up
      elements.forEach(element => {
        if (element.parentNode) {
          element.parentNode.removeChild(element)
        }
      })
    })
  })

  it('should reject invalid stagger patterns', () => {
    const invalidCases = [
      [0, 100, 200, 300],        // 100ms increment (too much)
      [0, 25, 50, 75],          // 25ms increment (too little)
      [50, 100, 150, 200],        // Doesn't start with 0ms
      [0, 60, 110, 160],         // Inconsistent increments
      [0, 50, 90, 140],          // Inconsistent increments
    ]

    invalidCases.forEach(invalidDelays => {
      // Create elements with invalid delays
      const elements = invalidDelays.map(delay => 
        createAnimatedElement(delay)
      )
      
      // Verify delays
      const actualDelays = elements.map(element => 
        extractAnimationDelay(element)
      )
      
      // Should not follow correct 50ms stagger pattern
      expect(hasCorrectStaggerPattern(actualDelays, 50)).toBe(false)
      
      // Clean up
      elements.forEach(element => {
        if (element.parentNode) {
          element.parentNode.removeChild(element)
        }
      })
    })
  })

  it('should handle animation delay with different units', () => {
    const unitCases = [
      { delay: 0, expected: 0, unit: 'ms' },
      { delay: 50, expected: 50, unit: 'ms' },
      { delay: 0.05, expected: 50, unit: 's' },
      { delay: 0.1, expected: 100, unit: 's' },
      { delay: 0.15, expected: 150, unit: 's' },
    ]

    unitCases.forEach(({ delay, expected, unit }) => {
      const element = document.createElement('div')
      element.style.animationDelay = `${delay}${unit}`
      document.body.appendChild(element)
      
      const actualDelay = extractAnimationDelay(element)
      expect(actualDelay).toBe(expected)
      
      document.body.removeChild(element)
    })
  })

  it('should maintain stagger pattern with animation properties', () => {
    const elements = [0, 50, 100, 150].map(delay => {
      const element = createAnimatedElement(delay)
      
      // Verify other animation properties are set correctly
      const computedStyle = getComputedStyle(element)
      
      // Should have animation name
      expect(computedStyle.animationName).toBeTruthy()
      
      // Should have animation duration
      expect(computedStyle.animationDuration).toContain('0.3s')
      
      // Should have animation timing function
      expect(computedStyle.animationTimingFunction).toContain('ease-in-out')
      
      // Should have animation fill mode
      expect(computedStyle.animationFillMode).toContain('forwards')
      
      return element
    })
    
    // Verify stagger pattern is maintained
    const delays = elements.map(element => extractAnimationDelay(element))
    expect(hasCorrectStaggerPattern(delays, 50)).toBe(true)
    
    // Clean up
    elements.forEach(element => {
      if (element.parentNode) {
        element.parentNode.removeChild(element)
      }
    })
  })

  it('should handle rapid re-rendering with stagger delays', () => {
    const { rerender } = render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    )
    
    // Get initial delays
    const initialCards = screen.getAllByText(/Total|Berita|Galeri|Kunjungan|Pengguna/i)
      .map(text => text.closest('[style*="animation-delay"]'))
      .filter(Boolean)
    
    const initialDelays = initialCards.map(card => 
      extractAnimationDelay(card as HTMLElement)
    )
    
    // Re-render multiple times
    for (let i = 0; i < 5; i++) {
      rerender(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      )
    }
    
    // Get final delays
    const finalCards = screen.getAllByText(/Total|Berita|Galeri|Kunjungan|Pengguna/i)
      .map(text => text.closest('[style*="animation-delay"]'))
      .filter(Boolean)
    
    const finalDelays = finalCards.map(card => 
      extractAnimationDelay(card as HTMLElement)
    )
    
    // Stagger pattern should be maintained across re-renders
    expect(hasCorrectStaggerPattern(finalDelays, 50)).toBe(true)
    expect(finalDelays).toEqual(initialDelays)
  })

  it('should handle stagger delay with responsive behavior', () => {
    // Test different viewport sizes
    const viewports = [
      { width: 1920, expectedCards: 4 }, // Desktop
      { width: 1024, expectedCards: 4 }, // Tablet
      { width: 768, expectedCards: 4 },  // Mobile (should still animate)
    ]

    viewports.forEach(({ width: viewportWidth, expectedCards }) => {
      // Mock viewport width
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: viewportWidth,
      })

      render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      )
      
      const statsCards = screen.getAllByText(/Total|Berita|Galeri|Kunjungan|Pengguna/i)
        .map(text => text.closest('[style*="animation-delay"]'))
        .filter(Boolean)
      
      // Should have expected number of animated cards
      expect(statsCards.length).toBeGreaterThanOrEqual(expectedCards)
      
      if (statsCards.length >= 2) {
        const delays = statsCards.map(card => 
          extractAnimationDelay(card as HTMLElement)
        )
        
        // Should maintain stagger pattern regardless of viewport
        expect(hasCorrectStaggerPattern(delays, 50)).toBe(true)
      }
      
      // Cleanup
      document.body.innerHTML = ''
    })
  })

  it('should handle animation delay tolerance correctly', () => {
    const toleranceCases = [
      { delays: [0, 52, 98, 151], tolerance: 5, expected: true },   // Within tolerance
      { delays: [0, 55, 105, 155], tolerance: 5, expected: true },   // Within tolerance
      { delays: [0, 56, 106, 156], tolerance: 5, expected: false },  // Outside tolerance
      { delays: [0, 45, 95, 145], tolerance: 5, expected: false },  // Outside tolerance
    ]

    toleranceCases.forEach(({ delays, tolerance, expected }) => {
      const elements = delays.map(delay => createAnimatedElement(delay))
      const actualDelays = elements.map(element => extractAnimationDelay(element))
      
      // Check with custom tolerance
      const hasCorrectPattern = (() => {
        for (let i = 1; i < actualDelays.length; i++) {
          const expectedDelay = actualDelays[i - 1] + 50
          const actualDelay = actualDelays[i]
          
          if (Math.abs(actualDelay - expectedDelay) > tolerance) {
            return false
          }
        }
        return true
      })()
      
      expect(hasCorrectPattern).toBe(expected)
      
      // Clean up
      elements.forEach(element => {
        if (element.parentNode) {
          element.parentNode.removeChild(element)
        }
      })
    })
  })
})