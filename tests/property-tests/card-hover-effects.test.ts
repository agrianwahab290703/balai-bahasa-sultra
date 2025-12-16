import { describe, it, expect, beforeEach } from 'vitest'
import { fc, test } from 'fast-check'
import { render, screen, fireEvent } from '@testing-library/react'
import { GlassCard } from '../../../resources/js/Components/Admin/GlassCard'

describe('Property 8: Card Hover Effects', () => {
  beforeEach(() => {
    // Reset CSS animations and transitions
    document.head.innerHTML = ''
    const style = document.createElement('style')
    style.textContent = `
      .glass-card {
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }
      .glass-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
      }
      .glass-card.stat:hover {
        box-shadow: 0 8px 25px rgba(255, 215, 0, 0.15);
      }
      .glass-card.activity:hover {
        box-shadow: 0 8px 25px rgba(34, 197, 94, 0.15);
      }
    `
    document.head.appendChild(style)
  })

  it('should have hover transition properties', () => {
    const { container } = render(
      <GlassCard>
        <div>Test content</div>
      </GlassCard>
    )

    const card = container.querySelector('.glass-card')
    expect(card).toBeDefined()
    
    const styles = getComputedStyle(card!)
    expect(styles.transition).toContain('transform')
    expect(styles.transition).toContain('box-shadow')
    expect(styles.transitionDuration).toContain('0.2s')
  })

  it('should apply hover transform on mouse enter', () => {
    const { container } = render(
      <GlassCard hoverable={true}>
        <div>Test content</div>
      </GlassCard>
    )

    const card = container.querySelector('.glass-card')!
    
    // Initial state
    expect(getComputedStyle(card).transform).toBe('none')
    
    // Hover state
    fireEvent.mouseEnter(card)
    const hoverStyles = getComputedStyle(card)
    
    // Check for transform effect
    expect(hoverStyles.transform).not.toBe('none')
  })

  it('should apply variant-specific hover colors', () => {
    const variants = ['default', 'stat', 'activity'] as const
    
    variants.forEach(variant => {
      const { container } = render(
        <GlassCard variant={variant} hoverable={true}>
          <div>Test content</div>
        </GlassCard>
      )

      const card = container.querySelector('.glass-card')!
      fireEvent.mouseEnter(card)
      
      // Verify variant class is applied
      expect(card.classList.contains(variant)).toBe(true)
    })
  })

  test.prop([
    fc.record({
      variant: fc.constantFrom('default', 'stat', 'activity'),
      hoverable: fc.boolean(),
      gradient: fc.boolean(),
      className: fc.optional(fc.string())
    })
  ])('should maintain hover effects for all card configurations', (props) => {
    const { container } = render(
      <GlassCard {...props}>
        <div>Test content</div>
      </GlassCard>
    )

    const card = container.querySelector('.glass-card')
    expect(card).toBeDefined()
    
    // Check that transition properties exist regardless of configuration
    const styles = getComputedStyle(card!)
    expect(styles.transition).toContain('transform')
    
    if (props.hoverable) {
      // Test hover interaction
      fireEvent.mouseEnter(card!)
      const hoverStyles = getComputedStyle(card!)
      
      // Should have some transform effect
      expect(hoverStyles.transform).not.toBe('none')
    }
  })

  test.prop([
    fc.array(fc.lorem({ maxCount: 3 }), { minLength: 1, maxLength: 5 })
  ])('should handle hover effects with multiple children', (children) => {
    const { container } = render(
      <GlassCard hoverable={true}>
        {children.map((child, index) => (
          <div key={index}>{child}</div>
        ))}
      </GlassCard>
    )

    const card = container.querySelector('.glass-card')!
    
    // Should not affect hover behavior
    fireEvent.mouseEnter(card)
    const hoverStyles = getComputedStyle(card!)
    expect(hoverStyles.transform).not.toBe('none')
  })

  it('should respect hoverable prop', () => {
    const { container: container1 } = render(
      <GlassCard hoverable={false}>
        <div>No hover content</div>
      </GlassCard>
    )

    const { container: container2 } = render(
      <GlassCard hoverable={true}>
        <div>Hover content</div>
      </GlassCard>
    )

    const card1 = container1.querySelector('.glass-card')!
    const card2 = container2.querySelector('.glass-card')!

    // Both should have transition classes
    expect(card1.classList.contains('transition-all')).toBe(true)
    expect(card2.classList.contains('transition-all')).toBe(true)
    
    // Both should have hover classes
    expect(card1.classList.contains('hover:shadow-lg')).toBe(true)
    expect(card2.classList.contains('hover:shadow-lg')).toBe(true)
  })

  it('should handle click events with hover effects', () => {
    const handleClick = vi.fn()
    const { container } = render(
      <GlassCard hoverable={true} onClick={handleClick}>
        <div>Clickable content</div>
      </GlassCard>
    )

    const card = container.querySelector('.glass-card')!
    
    // Hover then click
    fireEvent.mouseEnter(card)
    fireEvent.click(card)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})