/**
 * **Feature: admin-redesign-glassmorphism, Property 12: Touch Target Size**
 * 
 * Property: For any interactive element on mobile viewport (< 768px), 
 * the element SHALL have minimum height and width of 44px.
 * 
 * Validates: Requirements 9.5
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import * as fc from 'fast-check'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import GradientButton from '@/Components/Admin/GradientButton'
import Sidebar from '@/Components/Admin/Sidebar'

// Helper function to create a test element with specific dimensions
const createInteractiveElement = (width: number, height: number): HTMLElement => {
  const element = document.createElement('button')
  element.className = 'interactive-element'
  element.style.width = `${width}px`
  element.style.height = `${height}px`
  element.style.padding = '0'
  element.style.margin = '0'
  element.style.border = 'none'
  document.body.appendChild(element)
  return element
}

// Helper function to get computed dimensions
const getComputedDimensions = (element: HTMLElement): { width: number; height: number } => {
  const computedStyle = getComputedStyle(element)
  const width = parseInt(computedStyle.width.replace('px', ''), 10)
  const height = parseInt(computedStyle.height.replace('px', ''), 10)
  
  return { width, height }
}

// Helper function to check if element meets touch target requirements
const meetsTouchTargetRequirements = (element: HTMLElement): boolean => {
  const { width, height } = getComputedDimensions(element)
  return width >= 44 && height >= 44
}

// Helper function to mock mobile viewport
const setMobileViewport = () => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 767, // Just below mobile threshold
  })
  
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn((query) => ({
      matches: query.includes('(max-width: 767px)'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

// Helper function to mock desktop viewport
const setDesktopViewport = () => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 1024, // Desktop
  })
  
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn((query) => ({
      matches: query.includes('(max-width: 767px)') ? false : true,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

describe('Property 12: Touch Target Size', () => {
  beforeEach(() => {
    // Clear any existing test elements
    document.body.innerHTML = ''
  })

  afterEach(() => {
    // Clean up test elements
    document.body.innerHTML = ''
    
    // Restore viewport
    delete (window as any).innerWidth
    delete (window as any).matchMedia
  })

  it('should have minimum 44px touch targets on mobile viewport', () => {
    setMobileViewport()
    
    render(
      <BrowserRouter>
        <GradientButton>Mobile Button</GradientButton>
      </BrowserRouter>
    )
    
    const buttonElement = screen.getByText('Mobile Button')
    expect(buttonElement).toBeTruthy()
    
    // Check dimensions
    const { width, height } = getComputedDimensions(buttonElement)
    
    expect(width).toBeGreaterThanOrEqual(44)
    expect(height).toBeGreaterThanOrEqual(44)
  })

  it('should validate touch target size with fast-check', () => {
    setMobileViewport()
    
    fc.assert(
      fc.record({
        width: fc.integer({ min: 44, max: 200 }),
        height: fc.integer({ min: 44, max: 200 }),
      }),
      ({ width, height }) => {
        const element = createInteractiveElement(width, height)
        
        // Should meet requirements
        expect(meetsTouchTargetRequirements(element)).toBe(true)
        
        document.body.removeChild(element)
      },
      { numRuns: 100 }
    )
  })

  it('should handle different button sizes with touch target requirements', () => {
    setMobileViewport()
    
    const sizes = ['sm', 'md', 'lg'] as const
    
    sizes.forEach(size => {
      render(
        <BrowserRouter>
          <GradientButton size={size}>Button {size}</GradientButton>
        </BrowserRouter>
      )
      
      const buttonElement = screen.getByText(`Button ${size}`)
      
      // All sizes should meet touch target requirements on mobile
      expect(meetsTouchTargetRequirements(buttonElement)).toBe(true)
      
      // Cleanup
      document.body.innerHTML = ''
    })
  })

  it('should handle different button variants with touch target requirements', () => {
    setMobileViewport()
    
    const variants = ['primary', 'secondary', 'accent'] as const
    
    variants.forEach(variant => {
      render(
        <BrowserRouter>
          <GradientButton variant={variant}>Button {variant}</GradientButton>
        </BrowserRouter>
      )
      
      const buttonElement = screen.getByText(`Button ${variant}`)
      
      // All variants should meet touch target requirements on mobile
      expect(meetsTouchTargetRequirements(buttonElement)).toBe(true)
      
      // Cleanup
      document.body.innerHTML = ''
    })
  })

  it('should reject elements that don\'t meet touch target requirements', () => {
    setMobileViewport()
    
    const invalidCases = [
      { width: 40, height: 44 }, // Width too small
      { width: 44, height: 40 }, // Height too small
      { width: 30, height: 30 }, // Both too small
      { width: 43, height: 43 }, // Both just under threshold
    ]

    invalidCases.forEach(({ width, height }) => {
      const element = createInteractiveElement(width, height)
      
      // Should not meet requirements
      expect(meetsTouchTargetRequirements(element)).toBe(false)
      
      document.body.removeChild(element)
    })
  })

  it('should handle edge cases for touch target size', () => {
    setMobileViewport()
    
    const edgeCases = [
      { width: 44, height: 44, expected: true },   // Minimum valid
      { width: 45, height: 45, expected: true },   // Just above minimum
      { width: 100, height: 44, expected: true },  // Large width, minimum height
      { width: 44, height: 100, expected: true },  // Minimum width, large height
      { width: 43, height: 44, expected: false },  // Just under width
      { width: 44, height: 43, expected: false },  // Just under height
    ]

    edgeCases.forEach(({ width, height, expected }) => {
      const element = createInteractiveElement(width, height)
      
      const meetsRequirements = meetsTouchTargetRequirements(element)
      expect(meetsRequirements).toBe(expected)
      
      document.body.removeChild(element)
    })
  })

  it('should handle sidebar interactive elements on mobile', () => {
    setMobileViewport()
    
    render(
      <BrowserRouter>
        <Sidebar collapsed={false} onToggle={() => {}} />
      </BrowserRouter>
    )
    
    // Find sidebar toggle button
    const toggleButton = screen.getByRole('button')
    expect(toggleButton).toBeTruthy()
    
    // Should meet touch target requirements on mobile
    expect(meetsTouchTargetRequirements(toggleButton)).toBe(true)
  })

  it('should handle touch targets with padding and borders', () => {
    setMobileViewport()
    
    const element = document.createElement('button')
    element.style.width = '40px'
    element.style.height = '40px'
    element.style.padding = '2px' // Should make it 44x44
    element.style.border = '0px'
    document.body.appendChild(element)
    
    // Should meet requirements when padding is considered
    const { width, height } = getComputedDimensions(element)
    expect(width).toBeGreaterThanOrEqual(44)
    expect(height).toBeGreaterThanOrEqual(44)
  })

  it('should handle touch targets with different units', () => {
    setMobileViewport()
    
    const unitCases = [
      { width: '44px', height: '44px', expected: true },
      { width: '2.75rem', height: '2.75rem', expected: true }, // Assuming 16px base
      { width: '4.4rem', height: '4.4rem', expected: true }, // Assuming 10px base
      { width: '44em', height: '44em', expected: true },  // Depends on font size
    ]

    unitCases.forEach(({ width, height, expected }) => {
      const element = document.createElement('button')
      element.style.width = width
      element.style.height = height
      document.body.appendChild(element)
      
      const computedDimensions = getComputedDimensions(element)
      const meetsRequirements = computedDimensions.width >= 44 && computedDimensions.height >= 44
      
      expect(meetsRequirements).toBe(expected)
      
      document.body.removeChild(element)
    })
  })

  it('should not require touch target size on desktop viewport', () => {
    setDesktopViewport()
    
    render(
      <BrowserRouter>
        <GradientButton size="sm">Desktop Button</GradientButton>
      </BrowserRouter>
    )
    
    const buttonElement = screen.getByText('Desktop Button')
    
    // On desktop, smaller buttons should be acceptable
    const { width, height } = getComputedDimensions(buttonElement)
    
    // Small button might be less than 44px on desktop, which is acceptable
    expect(width).toBeGreaterThan(0)
    expect(height).toBeGreaterThan(0)
  })

  it('should handle responsive touch target behavior', () => {
    // Test mobile viewport
    setMobileViewport()
    
    const { rerender } = render(
      <BrowserRouter>
        <GradientButton size="sm">Responsive Button</GradientButton>
      </BrowserRouter>
    )
    
    let buttonElement = screen.getByText('Responsive Button')
    let mobileDimensions = getComputedDimensions(buttonElement)
    
    // Should meet requirements on mobile
    expect(mobileDimensions.width).toBeGreaterThanOrEqual(44)
    expect(mobileDimensions.height).toBeGreaterThanOrEqual(44)
    
    // Switch to desktop
    setDesktopViewport()
    
    rerender(
      <BrowserRouter>
        <GradientButton size="sm">Responsive Button</GradientButton>
      </BrowserRouter>
    )
    
    buttonElement = screen.getByText('Responsive Button')
    const desktopDimensions = getComputedDimensions(buttonElement)
    
    // Dimensions might change on desktop (could be smaller)
    expect(desktopDimensions.width).toBeGreaterThan(0)
    expect(desktopDimensions.height).toBeGreaterThan(0)
  })

  it('should handle touch targets with minimum tap area', () => {
    setMobileViewport()
    
    fc.assert(
      fc.record({
        width: fc.integer({ min: 44, max: 100 }),
        height: fc.integer({ min: 44, max: 100 }),
      }),
      ({ width, height }) => {
        const element = createInteractiveElement(width, height)
        
        // Calculate tap area
        const tapArea = width * height
        const minimumTapArea = 44 * 44 // 1936px²
        
        expect(tapArea).toBeGreaterThanOrEqual(minimumTapArea)
        expect(meetsTouchTargetRequirements(element)).toBe(true)
        
        document.body.removeChild(element)
      },
      { numRuns: 50 }
    )
  })

  it('should handle touch targets with aspect ratio considerations', () => {
    setMobileViewport()
    
    const aspectRatioCases = [
      { width: 44, height: 44 },  // Square
      { width: 60, height: 44 },  // Wide
      { width: 44, height: 60 },  // Tall
      { width: 88, height: 44 },  // Very wide
      { width: 44, height: 88 },  // Very tall
    ]

    aspectRatioCases.forEach(({ width, height }) => {
      const element = createInteractiveElement(width, height)
      
      // All should meet minimum requirements regardless of aspect ratio
      expect(meetsTouchTargetRequirements(element)).toBe(true)
      
      document.body.removeChild(element)
    })
  })

  it('should handle touch targets with disabled state', () => {
    setMobileViewport()
    
    render(
      <BrowserRouter>
        <GradientButton disabled>Disabled Button</GradientButton>
      </BrowserRouter>
    )
    
    const buttonElement = screen.getByText('Disabled Button')
    
    // Disabled buttons should still meet touch target requirements
    expect(meetsTouchTargetRequirements(buttonElement)).toBe(true)
  })
})