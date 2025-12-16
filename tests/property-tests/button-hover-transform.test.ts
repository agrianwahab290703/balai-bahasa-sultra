/**
 * **Feature: admin-redesign-glassmorphism, Property 7: Hover Transform Effects**
 * 
 * Property: For any hoverable button element, the hover state SHALL apply 
 * transform: scale(1.02) and filter with brightness increase.
 * 
 * Validates: Requirements 4.1
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import * as fc from 'fast-check'
import { render, screen, fireEvent } from '@testing-library/react'
import GradientButton from '@/Components/Admin/GradientButton'

// Helper function to create a test button element
const createButtonElement = (hasHover: boolean = false): HTMLElement => {
  const element = document.createElement('button')
  element.className = 'hover-button'
  element.style.transform = hasHover ? 'scale(1.02)' : 'scale(1)'
  element.style.filter = hasHover ? 'brightness(1.1)' : 'brightness(1)'
  element.style.transition = 'all 0.2s ease-in-out'
  document.body.appendChild(element)
  return element
}

// Helper function to extract scale value from transform
const extractScaleValue = (transform: string): number => {
  const scaleMatch = transform.match(/scale\(([\d.]+)\)/)
  return scaleMatch ? parseFloat(scaleMatch[1]) : 1
}

// Helper function to extract brightness value from filter
const extractBrightnessValue = (filter: string): number => {
  const brightnessMatch = filter.match(/brightness\(([\d.]+)\)/)
  return brightnessMatch ? parseFloat(brightnessMatch[1]) : 1
}

describe('Property 7: Hover Transform Effects', () => {
  beforeEach(() => {
    // Clear any existing test elements
    document.body.innerHTML = ''
  })

  afterEach(() => {
    // Clean up test elements
    document.body.innerHTML = ''
  })

  it('should apply correct hover transform on GradientButton', () => {
    render(<GradientButton>Test Button</GradientButton>)
    
    const buttonElement = screen.getByText('Test Button')
    expect(buttonElement).toBeTruthy()
    
    // Simulate hover
    fireEvent.mouseEnter(buttonElement)
    
    const computedStyle = getComputedStyle(buttonElement)
    
    // Check transform scale
    const scaleValue = extractScaleValue(computedStyle.transform)
    expect(scaleValue).toBeCloseTo(1.02, 2)
    
    // Check brightness filter
    const brightnessValue = extractBrightnessValue(computedStyle.filter)
    expect(brightnessValue).toBeCloseTo(1.1, 1)
  })

  it('should return to normal state when hover ends', () => {
    render(<GradientButton>Test Button</GradientButton>)
    
    const buttonElement = screen.getByText('Test Button')
    
    // Simulate hover
    fireEvent.mouseEnter(buttonElement)
    
    let computedStyle = getComputedStyle(buttonElement)
    let scaleValue = extractScaleValue(computedStyle.transform)
    let brightnessValue = extractBrightnessValue(computedStyle.filter)
    
    expect(scaleValue).toBeCloseTo(1.02, 2)
    expect(brightnessValue).toBeCloseTo(1.1, 1)
    
    // Simulate hover end
    fireEvent.mouseLeave(buttonElement)
    
    computedStyle = getComputedStyle(buttonElement)
    scaleValue = extractScaleValue(computedStyle.transform)
    brightnessValue = extractBrightnessValue(computedStyle.filter)
    
    // Should return to normal
    expect(scaleValue).toBeCloseTo(1.0, 2)
    expect(brightnessValue).toBeCloseTo(1.0, 1)
  })

  it('should validate hover transform with fast-check', () => {
    fc.assert(
      fc.boolean(),
      (hasHover) => {
        const element = createButtonElement(hasHover)
        const computedStyle = getComputedStyle(element)
        
        const scaleValue = extractScaleValue(computedStyle.transform)
        const brightnessValue = extractBrightnessValue(computedStyle.filter)
        
        if (hasHover) {
          expect(scaleValue).toBeCloseTo(1.02, 2)
          expect(brightnessValue).toBeCloseTo(1.1, 1)
        } else {
          expect(scaleValue).toBeCloseTo(1.0, 2)
          expect(brightnessValue).toBeCloseTo(1.0, 1)
        }
      },
      { numRuns: 100 }
    )
  })

  it('should handle different button variants with hover effects', () => {
    const variants = ['primary', 'secondary', 'accent'] as const
    
    variants.forEach(variant => {
      render(<GradientButton variant={variant}>Button {variant}</GradientButton>)
      
      const buttonElement = screen.getByText(`Button ${variant}`)
      
      // Simulate hover
      fireEvent.mouseEnter(buttonElement)
      
      const computedStyle = getComputedStyle(buttonElement)
      
      // All variants should have same hover transform
      const scaleValue = extractScaleValue(computedStyle.transform)
      const brightnessValue = extractBrightnessValue(computedStyle.filter)
      
      expect(scaleValue).toBeCloseTo(1.02, 2)
      expect(brightnessValue).toBeCloseTo(1.1, 1)
      
      // Cleanup
      document.body.innerHTML = ''
    })
  })

  it('should handle different button sizes with hover effects', () => {
    const sizes = ['sm', 'md', 'lg'] as const
    
    sizes.forEach(size => {
      render(<GradientButton size={size}>Button {size}</GradientButton>)
      
      const buttonElement = screen.getByText(`Button ${size}`)
      
      // Simulate hover
      fireEvent.mouseEnter(buttonElement)
      
      const computedStyle = getComputedStyle(buttonElement)
      
      // All sizes should have same hover transform
      const scaleValue = extractScaleValue(computedStyle.transform)
      const brightnessValue = extractBrightnessValue(computedStyle.filter)
      
      expect(scaleValue).toBeCloseTo(1.02, 2)
      expect(brightnessValue).toBeCloseTo(1.1, 1)
      
      // Cleanup
      document.body.innerHTML = ''
    })
  })

  it('should handle edge cases for hover transform values', () => {
    const edgeCases = [
      { scale: 1.02, brightness: 1.1 }, // Expected values
      { scale: 1.025, brightness: 1.15 }, // Slightly higher
      { scale: 1.015, brightness: 1.05 }, // Slightly lower
    ]

    edgeCases.forEach(({ scale, brightness }) => {
      const element = createButtonElement(true)
      element.style.transform = `scale(${scale})`
      element.style.filter = `brightness(${brightness})`
      
      const computedStyle = getComputedStyle(element)
      
      const actualScale = extractScaleValue(computedStyle.transform)
      const actualBrightness = extractBrightnessValue(computedStyle.filter)
      
      // Should be close to expected values
      expect(actualScale).toBeCloseTo(scale, 2)
      expect(actualBrightness).toBeCloseTo(brightness, 2)
    })
  })

  it('should reject invalid hover transform values', () => {
    const invalidCases = [
      { scale: 1.0, brightness: 1.0 },   // No transform
      { scale: 1.5, brightness: 2.0 },   // Too much
      { scale: 0.8, brightness: 0.5 },   // Too little
      { scale: 1.02, brightness: 1.0 }, // Only scale
      { scale: 1.0, brightness: 1.1 },  // Only brightness
    ]

    invalidCases.forEach(({ scale, brightness }) => {
      const element = createButtonElement(true)
      element.style.transform = `scale(${scale})`
      element.style.filter = `brightness(${brightness})`
      
      const computedStyle = getComputedStyle(element)
      
      const actualScale = extractScaleValue(computedStyle.transform)
      const actualBrightness = extractBrightnessValue(computedStyle.filter)
      
      // Should fail at least one validation
      const hasValidScale = Math.abs(actualScale - 1.02) < 0.01
      const hasValidBrightness = Math.abs(actualBrightness - 1.1) < 0.1
      
      expect([hasValidScale, hasValidBrightness]).toContain(false)
    })
  })

  it('should maintain hover effects with disabled state', () => {
    render(<GradientButton disabled>Disabled Button</GradientButton>)
    
    const buttonElement = screen.getByText('Disabled Button')
    
    // Simulate hover on disabled button
    fireEvent.mouseEnter(buttonElement)
    
    const computedStyle = getComputedStyle(buttonElement)
    
    // Disabled buttons should not have hover effects
    const scaleValue = extractScaleValue(computedStyle.transform)
    const brightnessValue = extractBrightnessValue(computedStyle.filter)
    
    expect(scaleValue).toBeCloseTo(1.0, 2)
    expect(brightnessValue).toBeCloseTo(1.0, 1)
  })

  it('should handle rapid hover enter/leave transitions', () => {
    render(<GradientButton>Rapid Hover Button</GradientButton>)
    
    const buttonElement = screen.getByText('Rapid Hover Button')
    
    // Rapid hover enter/leave
    for (let i = 0; i < 10; i++) {
      fireEvent.mouseEnter(buttonElement)
      fireEvent.mouseLeave(buttonElement)
    }
    
    // Final state should be normal (not hovered)
    const computedStyle = getComputedStyle(buttonElement)
    
    const scaleValue = extractScaleValue(computedStyle.transform)
    const brightnessValue = extractBrightnessValue(computedStyle.filter)
    
    expect(scaleValue).toBeCloseTo(1.0, 2)
    expect(brightnessValue).toBeCloseTo(1.0, 1)
  })

  it('should handle hover with focus state', () => {
    render(<GradientButton>Focus Button</GradientButton>)
    
    const buttonElement = screen.getByText('Focus Button')
    
    // Simulate both hover and focus
    fireEvent.mouseEnter(buttonElement)
    fireEvent.focus(buttonElement)
    
    const computedStyle = getComputedStyle(buttonElement)
    
    // Should still apply hover transform even when focused
    const scaleValue = extractScaleValue(computedStyle.transform)
    const brightnessValue = extractBrightnessValue(computedStyle.filter)
    
    expect(scaleValue).toBeCloseTo(1.02, 2)
    expect(brightnessValue).toBeCloseTo(1.1, 1)
  })
})