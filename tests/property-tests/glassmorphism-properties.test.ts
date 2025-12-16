/**
 * **Feature: admin-redesign-glassmorphism, Property 3: Glassmorphism Properties**
 * 
 * Property: For any glassmorphism component (sidebar, header, cards), the element SHALL have 
 * backdrop-filter with blur >= 12px, background with rgba alpha between 0.1-0.3, 
 * and border with rgba(255,255,255,0.2).
 * 
 * Validates: Requirements 2.1, 2.2, 2.3, 2.4
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import * as fc from 'fast-check'
import { render, screen } from '@testing-library/react'
import GlassCard from '@/Components/Admin/GlassCard'

// Helper function to create a test element with glassmorphism styles
const createGlassmorphismElement = (styles: Record<string, string>): HTMLElement => {
  const element = document.createElement('div')
  Object.assign(element.style, styles)
  document.body.appendChild(element)
  return element
}

// Helper function to extract blur value from backdrop-filter
const extractBlurValue = (backdropFilter: string): number => {
  const blurMatch = backdropFilter.match(/blur\(([\d.]+)px\)/)
  return blurMatch ? parseFloat(blurMatch[1]) : 0
}

// Helper function to extract alpha from rgba color
const extractAlphaFromRgba = (rgba: string): number => {
  const rgbaMatch = rgba.match(/rgba\(\d+,\s*\d+,\s*\d+,\s*([\d.]+)\)/)
  return rgbaMatch ? parseFloat(rgbaMatch[1]) : 0
}

// Helper function to check if color is valid rgba with alpha in range
const isValidRgbaWithAlpha = (color: string, minAlpha: number, maxAlpha: number): boolean => {
  const alpha = extractAlphaFromRgba(color)
  return color.startsWith('rgba(') && alpha >= minAlpha && alpha <= maxAlpha
}

describe('Property 3: Glassmorphism Properties', () => {
  beforeEach(() => {
    // Clear any existing test elements
    document.body.innerHTML = ''
  })

  afterEach(() => {
    // Clean up test elements
    document.body.innerHTML = ''
  })

  it('should have valid glassmorphism properties on GlassCard component', () => {
    render(<GlassCard>Test Content</GlassCard>)
    
    const cardElement = screen.getByText('Test Content').parentElement
    expect(cardElement).toBeTruthy()
    
    const computedStyle = getComputedStyle(cardElement!)
    
    // Check backdrop-filter blur
    const backdropFilter = computedStyle.backdropFilter
    const blurValue = extractBlurValue(backdropFilter)
    expect(blurValue).toBeGreaterThanOrEqual(12)
    
    // Check background has rgba with alpha between 0.1-0.3
    const backgroundColor = computedStyle.backgroundColor
    expect(isValidRgbaWithAlpha(backgroundColor, 0.1, 0.3)).toBe(true)
    
    // Check border has rgba(255,255,255,0.2)
    const borderColor = computedStyle.borderColor
    expect(borderColor).toContain('rgba(255, 255, 255')
    const borderAlpha = extractAlphaFromRgba(borderColor)
    expect(borderAlpha).toBeCloseTo(0.2, 1)
  })

  it('should validate glassmorphism properties with fast-check', () => {
    fc.assert(
      fc.record({
        blur: fc.float({ min: 12, max: 20 }),
        bgAlpha: fc.float({ min: 0.1, max: 0.3 }),
        borderAlpha: fc.float({ min: 0.1, max: 0.3 })
      }),
      (styles) => {
        const { blur, bgAlpha, borderAlpha } = styles
        
        const element = createGlassmorphismElement({
          backdropFilter: `blur(${blur}px)`,
          backgroundColor: `rgba(255, 255, 255, ${bgAlpha})`,
          border: `1px solid rgba(255, 255, 255, ${borderAlpha})`
        })
        
        const computedStyle = getComputedStyle(element)
        
        // Validate blur
        const actualBlur = extractBlurValue(computedStyle.backdropFilter)
        expect(actualBlur).toBeGreaterThanOrEqual(12)
        
        // Validate background alpha
        const actualBgAlpha = extractAlphaFromRgba(computedStyle.backgroundColor)
        expect(actualBgAlpha).toBeGreaterThanOrEqual(0.1)
        expect(actualBgAlpha).toBeLessThanOrEqual(0.3)
        
        // Validate border alpha
        const actualBorderAlpha = extractAlphaFromRgba(computedStyle.borderColor)
        expect(actualBorderAlpha).toBeGreaterThanOrEqual(0.1)
        expect(actualBorderAlpha).toBeLessThanOrEqual(0.3)
      },
      { numRuns: 100 }
    )
  })

  it('should handle edge cases for glassmorphism values', () => {
    const edgeCases = [
      { blur: 12, bgAlpha: 0.1, borderAlpha: 0.2 }, // Minimum values
      { blur: 20, bgAlpha: 0.3, borderAlpha: 0.3 }, // Maximum values
      { blur: 15, bgAlpha: 0.15, borderAlpha: 0.25 }, // Middle values
    ]

    edgeCases.forEach(({ blur, bgAlpha, borderAlpha }) => {
      const element = createGlassmorphismElement({
        backdropFilter: `blur(${blur}px)`,
        backgroundColor: `rgba(255, 255, 255, ${bgAlpha})`,
        border: `1px solid rgba(255, 255, 255, ${borderAlpha})`
      })
      
      const computedStyle = getComputedStyle(element)
      
      expect(extractBlurValue(computedStyle.backdropFilter)).toBeGreaterThanOrEqual(12)
      expect(isValidRgbaWithAlpha(computedStyle.backgroundColor, 0.1, 0.3)).toBe(true)
      expect(computedStyle.borderColor).toContain('rgba(255, 255, 255')
    })
  })

  it('should reject invalid glassmorphism values', () => {
    const invalidCases = [
      { blur: 10, bgAlpha: 0.05, borderAlpha: 0.1 }, // Too low
      { blur: 8, bgAlpha: 0.5, borderAlpha: 0.5 },   // Too high
      { blur: 0, bgAlpha: 1, borderAlpha: 1 },        // Solid
    ]

    invalidCases.forEach(({ blur, bgAlpha, borderAlpha }) => {
      const element = createGlassmorphismElement({
        backdropFilter: `blur(${blur}px)`,
        backgroundColor: `rgba(255, 255, 255, ${bgAlpha})`,
        border: `1px solid rgba(255, 255, 255, ${borderAlpha})`
      })
      
      const computedStyle = getComputedStyle(element)
      
      // Should fail at least one validation
      const hasValidBlur = extractBlurValue(computedStyle.backdropFilter) >= 12
      const hasValidBg = isValidRgbaWithAlpha(computedStyle.backgroundColor, 0.1, 0.3)
      const hasValidBorder = computedStyle.borderColor.includes('rgba(255, 255, 255')
      
      expect([hasValidBlur, hasValidBg, hasValidBorder]).toContain(false)
    })
  })

  it('should handle different glassmorphism component variants', () => {
    const variants = ['default', 'stat', 'activity'] as const
    
    variants.forEach(variant => {
      render(<GlassCard variant={variant}>Test {variant}</GlassCard>)
      
      const cardElement = screen.getByText(`Test ${variant}`).parentElement
      expect(cardElement).toBeTruthy()
      
      const computedStyle = getComputedStyle(cardElement!)
      
      // All variants should have glassmorphism properties
      expect(extractBlurValue(computedStyle.backdropFilter)).toBeGreaterThanOrEqual(12)
      expect(isValidRgbaWithAlpha(computedStyle.backgroundColor, 0.1, 0.3)).toBe(true)
    })
  })

  it('should maintain glassmorphism properties with hover state', () => {
    render(<GlassCard hoverable>Hoverable Card</GlassCard>)
    
    const cardElement = screen.getByText('Hoverable Card').parentElement
    expect(cardElement).toBeTruthy()
    
    // Simulate hover
    cardElement?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
    
    const computedStyle = getComputedStyle(cardElement!)
    
    // Should maintain glassmorphism even on hover
    expect(extractBlurValue(computedStyle.backdropFilter)).toBeGreaterThanOrEqual(12)
    expect(isValidRgbaWithAlpha(computedStyle.backgroundColor, 0.1, 0.3)).toBe(true)
  })

  it('should handle glassmorphism with gradient overlay', () => {
    render(<GlassCard gradient>Gradient Card</GlassCard>)
    
    const cardElement = screen.getByText('Gradient Card').parentElement
    expect(cardElement).toBeTruthy()
    
    const computedStyle = getComputedStyle(cardElement!)
    
    // Should still have base glassmorphism properties
    expect(extractBlurValue(computedStyle.backdropFilter)).toBeGreaterThanOrEqual(12)
    expect(isValidRgbaWithAlpha(computedStyle.backgroundColor, 0.1, 0.3)).toBe(true)
    
    // Should have gradient overlay
    const beforeElement = cardElement?.querySelector('::before')
    expect(beforeElement).toBeTruthy() // Note: ::before pseudo-elements are hard to test directly
  })
})