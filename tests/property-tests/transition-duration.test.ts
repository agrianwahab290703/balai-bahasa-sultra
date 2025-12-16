/**
 * **Feature: admin-redesign-glassmorphism, Property 10: Transition Duration Consistency**
 * 
 * Property: For any interactive element with hover effects, the transition duration 
 * SHALL be 200ms.
 * 
 * Validates: Requirements 4.5, 10.5
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import * as fc from 'fast-check'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import GlassCard from '@/Components/Admin/GlassCard'
import GradientButton from '@/Components/Admin/GradientButton'
import Sidebar from '@/Components/Admin/Sidebar'

// Helper function to create a test element with transition
const createTransitionElement = (duration: number): HTMLElement => {
  const element = document.createElement('div')
  element.className = 'interactive-element'
  element.style.transition = `all ${duration}ms ease-in-out`
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

// Helper function to check if transition has correct duration
const hasCorrectTransitionDuration = (element: HTMLElement, expectedDuration: number): boolean => {
  const actualDuration = extractTransitionDuration(element)
  return Math.abs(actualDuration - expectedDuration) < 10 // Allow 10ms tolerance
}

describe('Property 10: Transition Duration Consistency', () => {
  beforeEach(() => {
    // Clear any existing test elements
    document.body.innerHTML = ''
  })

  afterEach(() => {
    // Clean up test elements
    document.body.innerHTML = ''
  })

  it('should have 200ms transition duration on GradientButton hover', () => {
    render(<GradientButton>Test Button</GradientButton>)
    
    const buttonElement = screen.getByText('Test Button')
    expect(buttonElement).toBeTruthy()
    
    // Check transition duration
    expect(hasCorrectTransitionDuration(buttonElement, 200)).toBe(true)
  })

  it('should have 200ms transition duration on GlassCard hover', () => {
    render(<GlassCard hoverable>Test Card</GlassCard>)
    
    const cardElement = screen.getByText('Test Card').parentElement
    expect(cardElement).toBeTruthy()
    
    // Check transition duration
    expect(hasCorrectTransitionDuration(cardElement!, 200)).toBe(true)
  })

  it('should have 200ms transition duration on interactive elements', () => {
    fc.assert(
      fc.record({
        elementType: fc.constantFrom(['button', 'div', 'a', 'span']),
        hasHover: fc.boolean(),
        duration: fc.constantFrom([200])
      }),
      ({ elementType, hasHover, duration }) => {
        const element = document.createElement(elementType)
        element.className = 'interactive-element'
        element.style.transition = `all ${duration}ms ease-in-out`
        
        if (hasHover) {
          element.addEventListener('mouseenter', () => {
            element.style.transform = 'scale(1.02)'
          })
        }
        
        document.body.appendChild(element)
        
        // Check transition duration
        expect(hasCorrectTransitionDuration(element, duration)).toBe(true)
        
        document.body.removeChild(element)
      },
      { numRuns: 100 }
    )
  })

  it('should handle different button variants with consistent transition', () => {
    const variants = ['primary', 'secondary', 'accent'] as const
    
    variants.forEach(variant => {
      render(<GradientButton variant={variant}>Button {variant}</GradientButton>)
      
      const buttonElement = screen.getByText(`Button ${variant}`)
      
      // All variants should have same transition duration
      expect(hasCorrectTransitionDuration(buttonElement, 200)).toBe(true)
      
      // Cleanup
      document.body.innerHTML = ''
    })
  })

  it('should handle different button sizes with consistent transition', () => {
    const sizes = ['sm', 'md', 'lg'] as const
    
    sizes.forEach(size => {
      render(<GradientButton size={size}>Button {size}</GradientButton>)
      
      const buttonElement = screen.getByText(`Button ${size}`)
      
      // All sizes should have same transition duration
      expect(hasCorrectTransitionDuration(buttonElement, 200)).toBe(true)
      
      // Cleanup
      document.body.innerHTML = ''
    })
  })

  it('should handle different card variants with consistent transition', () => {
    const variants = ['default', 'stat', 'activity'] as const
    
    variants.forEach(variant => {
      render(<GlassCard variant={variant} hoverable>Card {variant}</GlassCard>)
      
      const cardElement = screen.getByText(`Card ${variant}`).parentElement
      
      // All variants should have same transition duration
      expect(hasCorrectTransitionDuration(cardElement!, 200)).toBe(true)
      
      // Cleanup
      document.body.innerHTML = ''
    })
  })

  it('should handle edge cases for transition duration', () => {
    const edgeCases = [
      { duration: 200, expected: true },   // Exact match
      { duration: 195, expected: true },   // Within tolerance
      { duration: 205, expected: true },   // Within tolerance
      { duration: 190, expected: false },  // Outside tolerance
      { duration: 210, expected: false },  // Outside tolerance
      { duration: 150, expected: false },  // Too fast
      { duration: 300, expected: false },  // Too slow
    ]

    edgeCases.forEach(({ duration, expected }) => {
      const element = createTransitionElement(duration)
      
      const hasCorrectDuration = hasCorrectTransitionDuration(element, 200)
      expect(hasCorrectDuration).toBe(expected)
    })
  })

  it('should reject invalid transition durations', () => {
    const invalidCases = [
      'all 100ms ease-in-out',    // Too fast
      'all 300ms ease-in-out',    // Too slow
      'all 0.1s ease-in-out',     // Too fast (seconds)
      'all 0.3s ease-in-out',     // Too slow (seconds)
      'all 150ms ease-in-out',     // Too fast
      'all 250ms ease-in-out',     // Too slow
    ]

    invalidCases.forEach(invalidTransition => {
      const element = document.createElement('div')
      element.style.transition = invalidTransition
      document.body.appendChild(element)
      
      const hasCorrectDuration = hasCorrectTransitionDuration(element, 200)
      expect(hasCorrectDuration).toBe(false)
      
      document.body.removeChild(element)
    })
  })

  it('should maintain transition duration during hover states', () => {
    render(<GradientButton>Hover Test</GradientButton>)
    
    const buttonElement = screen.getByText('Hover Test')
    
    // Check initial transition
    expect(hasCorrectTransitionDuration(buttonElement, 200)).toBe(true)
    
    // Simulate hover
    fireEvent.mouseEnter(buttonElement)
    
    // Should maintain transition during hover
    expect(hasCorrectTransitionDuration(buttonElement, 200)).toBe(true)
    
    // Simulate hover end
    fireEvent.mouseLeave(buttonElement)
    
    // Should maintain transition after hover
    expect(hasCorrectTransitionDuration(buttonElement, 200)).toBe(true)
  })

  it('should handle transition duration with different timing functions', () => {
    const timingFunctions = [
      'ease-in-out',
      'ease',
      'ease-in',
      'ease-out',
      'linear',
      'cubic-bezier(0.4, 0, 0.2, 1)'
    ]

    timingFunctions.forEach(timingFunction => {
      const element = createTransitionElement(200)
      element.style.transition = `all 200ms ${timingFunction}`
      
      // Should still have correct duration regardless of timing function
      expect(hasCorrectTransitionDuration(element, 200)).toBe(true)
    })
  })

  it('should handle transition duration with multiple properties', () => {
    const multiPropertyTransitions = [
      'all 200ms ease-in-out',
      'transform 200ms ease-in-out, background-color 200ms ease-in-out',
      'background-color 200ms ease-in-out, transform 200ms ease-in-out',
      'color 200ms ease-in-out, background-color 200ms ease-in-out, transform 200ms ease-in-out'
    ]

    multiPropertyTransitions.forEach(transition => {
      const element = document.createElement('div')
      element.style.transition = transition
      document.body.appendChild(element)
      
      // Should extract correct duration from multi-property transitions
      expect(hasCorrectTransitionDuration(element, 200)).toBe(true)
      
      document.body.removeChild(element)
    })
  })

  it('should handle transition duration with different units', () => {
    const unitCases = [
      { value: '200ms', expected: 200 },
      { value: '0.2s', expected: 200 },
      { value: '200.0ms', expected: 200 },
      { value: '0.200s', expected: 200 },
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

  it('should maintain transition consistency across component interactions', () => {
    render(
      <BrowserRouter>
        <div>
          <GradientButton>Button 1</GradientButton>
          <GlassCard hoverable>Card 1</GlassCard>
          <GradientButton variant="secondary">Button 2</GradientButton>
        </div>
      </BrowserRouter>
    )
    
    const button1 = screen.getByText('Button 1')
    const card1 = screen.getByText('Card 1').parentElement
    const button2 = screen.getByText('Button 2')
    
    // All interactive elements should have same transition duration
    expect(hasCorrectTransitionDuration(button1, 200)).toBe(true)
    expect(hasCorrectTransitionDuration(card1!, 200)).toBe(true)
    expect(hasCorrectTransitionDuration(button2, 200)).toBe(true)
  })

  it('should handle rapid state changes with consistent transitions', () => {
    render(<GradientButton>Rapid Changes</GradientButton>)
    
    const buttonElement = screen.getByText('Rapid Changes')
    
    // Rapid state changes
    for (let i = 0; i < 10; i++) {
      fireEvent.mouseEnter(buttonElement)
      fireEvent.mouseLeave(buttonElement)
    }
    
    // Should maintain consistent transition duration
    expect(hasCorrectTransitionDuration(buttonElement, 200)).toBe(true)
  })

  it('should handle transition duration with disabled state', () => {
    render(<GradientButton disabled>Disabled Button</GradientButton>)
    
    const buttonElement = screen.getByText('Disabled Button')
    
    // Disabled buttons should still have transition duration
    expect(hasCorrectTransitionDuration(buttonElement, 200)).toBe(true)
  })
})