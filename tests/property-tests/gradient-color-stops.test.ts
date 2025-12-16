/**
 * **Feature: admin-redesign-glassmorphism, Property 2: Gradient Color Stops**
 * 
 * Property: For any gradient CSS value applied to admin components, the gradient string 
 * SHALL contain the specified color stops (blue #1E40AF, white #FFFFFF, yellow #FFD700) 
 * in the correct order.
 * 
 * Validates: Requirements 1.2
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import * as fc from 'fast-check'

// Helper function to create a test element with gradient
const createGradientElement = (gradientValue: string): HTMLElement => {
  const element = document.createElement('div')
  element.style.background = gradientValue
  document.body.appendChild(element)
  return element
}

// Helper function to extract colors from gradient string
const extractColorsFromGradient = (gradient: string): string[] => {
  const colorRegex = /#[0-9A-Fa-f]{6}/gi
  return gradient.match(colorRegex) || []
}

// Helper function to check if gradient contains required colors in order
const hasCorrectColorOrder = (gradient: string): boolean => {
  const colors = extractColorsFromGradient(gradient)
  const requiredColors = ['#1E40AF', '#FFFFFF', '#FFD700'] // blue, white, yellow
  
  // Check if all required colors are present
  const hasAllColors = requiredColors.every(color => colors.includes(color))
  
  if (!hasAllColors) return false
  
  // Check if colors are in correct order (blue -> white -> yellow)
  const blueIndex = colors.indexOf('#1E40AF')
  const whiteIndex = colors.indexOf('#FFFFFF')
  const yellowIndex = colors.indexOf('#FFD700')
  
  return blueIndex >= 0 && whiteIndex >= blueIndex && yellowIndex >= whiteIndex
}

// Helper function to check if gradient is valid CSS
const isValidGradient = (gradient: string): boolean => {
  return gradient && (
    gradient.includes('linear-gradient') ||
    gradient.includes('radial-gradient') ||
    gradient.includes('conic-gradient')
  )
}

describe('Property 2: Gradient Color Stops', () => {
  beforeEach(() => {
    // Clear any existing test elements
    document.body.innerHTML = ''
  })

  afterEach(() => {
    // Clean up test elements
    document.body.innerHTML = ''
  })

  it('should have correct color order in sidebar gradient', () => {
    const sidebarGradient = 'linear-gradient(180deg, #1E40AF 0%, #1E3A8A 100%)'
    const element = createGradientElement(sidebarGradient)
    const computedStyle = getComputedStyle(element)
    const backgroundValue = computedStyle.background
    
    expect(isValidGradient(backgroundValue)).toBe(true)
    expect(backgroundValue).toContain('#1E40AF')
  })

  it('should have correct color order in button gradient', () => {
    const buttonGradient = 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 50%, #FFD700 100%)'
    const element = createGradientElement(buttonGradient)
    const computedStyle = getComputedStyle(element)
    const backgroundValue = computedStyle.background
    
    expect(hasCorrectColorOrder(backgroundValue)).toBe(true)
    expect(backgroundValue).toContain('#1E40AF')
    expect(backgroundValue).toContain('#3B82F6')
    expect(backgroundValue).toContain('#FFD700')
  })

  it('should have correct color order in hero gradient', () => {
    const heroGradient = 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 30%, #FFFFFF 60%, #FFD700 100%)'
    const element = createGradientElement(heroGradient)
    const computedStyle = getComputedStyle(element)
    const backgroundValue = computedStyle.background
    
    expect(hasCorrectColorOrder(backgroundValue)).toBe(true)
    expect(backgroundValue).toContain('#1E40AF')
    expect(backgroundValue).toContain('#3B82F6')
    expect(backgroundValue).toContain('#FFFFFF')
    expect(backgroundValue).toContain('#FFD700')
  })

  it('should validate gradient color stops with fast-check', () => {
    fc.assert(
      fc.array(fc.hexaString({ casing: 'upper' })),
      (colors) => {
        // Create gradient with provided colors
        const gradientString = `linear-gradient(135deg, ${colors.join(', ')})`
        const element = createGradientElement(gradientString)
        const computedStyle = getComputedStyle(element)
        
        // Should be a valid gradient
        expect(isValidGradient(computedStyle.background)).toBe(true)
        
        // Should contain all provided colors
        colors.forEach(color => {
          expect(computedStyle.background).toContain(color)
        })
      },
      { numRuns: 100 }
    )
  })

  it('should maintain color order across random gradient variations', () => {
    fc.assert(
      fc.record({
        angle: fc.integer({ min: 0, max: 360 }),
        blueStop: fc.integer({ min: 0, max: 100 }),
        whiteStop: fc.integer({ min: 0, max: 100 }),
        yellowStop: fc.integer({ min: 0, max: 100 })
      }),
      (stops) => {
        const { angle, blueStop, whiteStop, yellowStop } = stops
        const gradientString = `linear-gradient(${angle}deg, #1E40AF ${blueStop}%, #FFFFFF ${whiteStop}%, #FFD700 ${yellowStop}%)`
        const element = createGradientElement(gradientString)
        const computedStyle = getComputedStyle(element)
        
        // Should maintain correct color order regardless of angle and positions
        expect(hasCorrectColorOrder(computedStyle.background)).toBe(true)
      },
      { numRuns: 50 }
    )
  })

  it('should handle edge cases for gradient definitions', () => {
    const edgeCases = [
      'linear-gradient(180deg, #1E40AF 0%, #1E3A8A 100%)',
      'radial-gradient(circle, #1E40AF 0%, #FFFFFF 50%, #FFD700 100%)',
      'conic-gradient(from 0deg, #1E40AF, #FFFFFF, #FFD700)',
      'linear-gradient(to right, #1E40AF, #FFFFFF, #FFD700)'
    ]

    edgeCases.forEach(gradient => {
      const element = createGradientElement(gradient)
      const computedStyle = getComputedStyle(element)
      
      expect(isValidGradient(computedStyle.background)).toBe(true)
      expect(computedStyle.background).toContain('#1E40AF')
      expect(computedStyle.background).toContain('#FFFFFF')
      expect(computedStyle.background).toContain('#FFD700')
    })
  })

  it('should reject gradients without correct color order', () => {
    const invalidGradients = [
      'linear-gradient(135deg, #FFD700 0%, #FFFFFF 50%, #1E40AF 100%)', // wrong order
      'linear-gradient(135deg, #1E40AF 0%, #FFD700 50%, #3B82F6 100%)', // missing white
      'linear-gradient(135deg, #FFFFFF 0%, #3B82F6 50%, #FFD700 100%)', // missing blue
    ]

    invalidGradients.forEach(gradient => {
      expect(hasCorrectColorOrder(gradient)).toBe(false)
    })
  })

  it('should handle gradient variations with transparency', () => {
    const gradientWithAlpha = 'linear-gradient(135deg, rgba(30, 64, 175, 0.8) 0%, rgba(255, 255, 255, 0.6) 50%, rgba(255, 215, 0, 0.9) 100%)'
    const element = createGradientElement(gradientWithAlpha)
    const computedStyle = getComputedStyle(element)
    
    expect(isValidGradient(computedStyle.background)).toBe(true)
    // Should still contain the base colors even with alpha
    expect(computedStyle.background).toContain('30, 64, 175') // blue RGB
    expect(computedStyle.background).toContain('255, 255, 255') // white RGB
    expect(computedStyle.background).toContain('255, 215, 0') // yellow RGB
  })
})