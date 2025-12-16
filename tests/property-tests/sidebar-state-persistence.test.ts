/**
 * **Feature: admin-redesign-glassmorphism, Property 5: Sidebar State Persistence**
 * 
 * Property: For any sidebar toggle action, the collapsed state SHALL be persisted 
 * to localStorage, and on page reload, the sidebar SHALL restore the persisted state.
 * 
 * Validates: Requirements 3.5
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import * as fc from 'fast-check'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Sidebar from '@/Components/Admin/Sidebar'

// Mock localStorage
const createMockLocalStorage = () => {
  let store: Record<string, string> = {}
  
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
    get length() {
      return Object.keys(store).length
    },
    key: vi.fn((index: number) => {
      const keys = Object.keys(store)
      return keys[index] || null
    })
  }
}

describe('Property 5: Sidebar State Persistence', () => {
  const SIDEBAR_STATE_KEY = 'admin-sidebar-collapsed'
  let mockLocalStorage: ReturnType<typeof createMockLocalStorage>

  beforeEach(() => {
    // Clear any existing test elements
    document.body.innerHTML = ''
    
    // Setup mock localStorage
    mockLocalStorage = createMockLocalStorage()
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    })
    
    // Clear mock store
    mockLocalStorage.clear()
  })

  afterEach(() => {
    // Clean up test elements
    document.body.innerHTML = ''
    
    // Restore original localStorage if needed
    delete (window as any).localStorage
  })

  it('should persist collapsed state to localStorage on toggle', () => {
    const onToggle = vi.fn()
    
    render(
      <BrowserRouter>
        <Sidebar collapsed={false} onToggle={onToggle} />
      </BrowserRouter>
    )
    
    // Find toggle button
    const toggleButton = screen.getByRole('button')
    expect(toggleButton).toBeTruthy()
    
    // Click to collapse
    fireEvent.click(toggleButton)
    
    // Check if localStorage was called with correct key and value
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      SIDEBAR_STATE_KEY,
      'true'
    )
  })

  it('should persist expanded state to localStorage on toggle', () => {
    const onToggle = vi.fn()
    
    render(
      <BrowserRouter>
        <Sidebar collapsed={true} onToggle={onToggle} />
      </BrowserRouter>
    )
    
    const toggleButton = screen.getByRole('button')
    
    // Click to expand
    fireEvent.click(toggleButton)
    
    // Check if localStorage was called with correct key and value
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      SIDEBAR_STATE_KEY,
      'false'
    )
  })

  it('should restore collapsed state from localStorage on mount', () => {
    // Set initial state in localStorage
    mockLocalStorage.setItem(SIDEBAR_STATE_KEY, 'true')
    
    const onToggle = vi.fn()
    
    render(
      <BrowserRouter>
        <Sidebar collapsed={false} onToggle={onToggle} />
      </BrowserRouter>
    )
    
    // Check if localStorage was read
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith(SIDEBAR_STATE_KEY)
    
    // Sidebar should be in collapsed state (verify by checking width)
    const sidebarElement = screen.getByTestId('admin-sidebar')
    const computedStyle = getComputedStyle(sidebarElement)
    const width = parseInt(computedStyle.width.replace('px', ''), 10)
    
    expect(width).toBe(64) // Collapsed width
  })

  it('should restore expanded state from localStorage on mount', () => {
    // Set initial state in localStorage
    mockLocalStorage.setItem(SIDEBAR_STATE_KEY, 'false')
    
    const onToggle = vi.fn()
    
    render(
      <BrowserRouter>
        <Sidebar collapsed={true} onToggle={onToggle} />
      </BrowserRouter>
    )
    
    // Check if localStorage was read
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith(SIDEBAR_STATE_KEY)
    
    // Sidebar should be in expanded state (verify by checking width)
    const sidebarElement = screen.getByTestId('admin-sidebar')
    const computedStyle = getComputedStyle(sidebarElement)
    const width = parseInt(computedStyle.width.replace('px', ''), 10)
    
    expect(width).toBe(256) // Expanded width
  })

  it('should handle missing localStorage gracefully', () => {
    // Don't set anything in localStorage
    const onToggle = vi.fn()
    
    render(
      <BrowserRouter>
        <Sidebar collapsed={false} onToggle={onToggle} />
      </BrowserRouter>
    )
    
    // Check if localStorage was read
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith(SIDEBAR_STATE_KEY)
    
    // Should default to expanded state
    const sidebarElement = screen.getByTestId('admin-sidebar')
    const computedStyle = getComputedStyle(sidebarElement)
    const width = parseInt(computedStyle.width.replace('px', ''), 10)
    
    expect(width).toBe(256) // Default expanded width
  })

  it('should validate state persistence with fast-check', () => {
    fc.assert(
      fc.boolean(),
      (initialCollapsedState) => {
        // Set initial state in mock localStorage
        mockLocalStorage.setItem(SIDEBAR_STATE_KEY, initialCollapsedState.toString())
        
        const onToggle = vi.fn()
        
        render(
          <BrowserRouter>
            <Sidebar collapsed={!initialCollapsedState} onToggle={onToggle} />
          </BrowserRouter>
        )
        
        // Should read from localStorage
        expect(mockLocalStorage.getItem).toHaveBeenCalledWith(SIDEBAR_STATE_KEY)
        
        // Find toggle button
        const toggleButton = screen.getByRole('button')
        
        // Toggle to opposite state
        fireEvent.click(toggleButton)
        
        // Should persist new state
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          SIDEBAR_STATE_KEY,
          (!initialCollapsedState).toString()
        )
        
        // Cleanup
        document.body.innerHTML = ''
      },
      { numRuns: 50 }
    )
  })

  it('should handle multiple toggle actions correctly', () => {
    const onToggle = vi.fn()
    
    render(
      <BrowserRouter>
        <Sidebar collapsed={false} onToggle={onToggle} />
      </BrowserRouter>
    )
    
    const toggleButton = screen.getByRole('button')
    
    // Perform multiple toggles
    fireEvent.click(toggleButton) // Collapse
    fireEvent.click(toggleButton) // Expand
    fireEvent.click(toggleButton) // Collapse
    fireEvent.click(toggleButton) // Expand
    
    // Check localStorage calls
    expect(mockLocalStorage.setItem).toHaveBeenCalledTimes(4)
    
    // Verify the sequence of states
    expect(mockLocalStorage.setItem).toHaveBeenNthCalledWith(1, SIDEBAR_STATE_KEY, 'true')
    expect(mockLocalStorage.setItem).toHaveBeenNthCalledWith(2, SIDEBAR_STATE_KEY, 'false')
    expect(mockLocalStorage.setItem).toHaveBeenNthCalledWith(3, SIDEBAR_STATE_KEY, 'true')
    expect(mockLocalStorage.setItem).toHaveBeenNthCalledWith(4, SIDEBAR_STATE_KEY, 'false')
  })

  it('should handle localStorage errors gracefully', () => {
    // Mock localStorage to throw an error
    const errorLocalStorage = {
      ...mockLocalStorage,
      setItem: vi.fn(() => {
        throw new Error('Storage quota exceeded')
      })
    }
    
    Object.defineProperty(window, 'localStorage', {
      value: errorLocalStorage,
      writable: true
    })
    
    const onToggle = vi.fn()
    
    render(
      <BrowserRouter>
        <Sidebar collapsed={false} onToggle={onToggle} />
      </BrowserRouter>
    )
    
    const toggleButton = screen.getByRole('button')
    
    // Should not throw error
    expect(() => {
      fireEvent.click(toggleButton)
    }).not.toThrow()
    
    // Should still attempt to set item
    expect(errorLocalStorage.setItem).toHaveBeenCalled()
  })

  it('should handle corrupted localStorage data gracefully', () => {
    // Set corrupted data
    mockLocalStorage.setItem(SIDEBAR_STATE_KEY, 'invalid-json')
    
    const onToggle = vi.fn()
    
    render(
      <BrowserRouter>
        <Sidebar collapsed={false} onToggle={onToggle} />
      </BrowserRouter>
    )
    
    // Should default to expanded state when data is corrupted
    const sidebarElement = screen.getByTestId('admin-sidebar')
    const computedStyle = getComputedStyle(sidebarElement)
    const width = parseInt(computedStyle.width.replace('px', ''), 10)
    
    expect(width).toBe(256) // Default expanded width
  })

  it('should maintain persistence across page reloads', () => {
    // Simulate first page load
    mockLocalStorage.setItem(SIDEBAR_STATE_KEY, 'true')
    
    const onToggle1 = vi.fn()
    
    render(
      <BrowserRouter>
        <Sidebar collapsed={false} onToggle={onToggle1} />
      </BrowserRouter>
    )
    
    // Toggle to expand
    const toggleButton1 = screen.getByRole('button')
    fireEvent.click(toggleButton1)
    
    // Verify state was saved
    expect(mockLocalStorage.setItem).toHaveBeenLastCalledWith(SIDEBAR_STATE_KEY, 'false')
    
    // Cleanup and simulate page reload
    document.body.innerHTML = ''
    
    // Simulate second page load (should read saved state)
    const onToggle2 = vi.fn()
    
    render(
      <BrowserRouter>
        <Sidebar collapsed={true} onToggle={onToggle2} />
      </BrowserRouter>
    )
    
    // Should restore the saved state
    const sidebarElement = screen.getByTestId('admin-sidebar')
    const computedStyle = getComputedStyle(sidebarElement)
    const width = parseInt(computedStyle.width.replace('px', ''), 10)
    
    expect(width).toBe(256) // Should be expanded (saved state)
  })

  it('should handle localStorage unavailability', () => {
    // Mock localStorage as undefined
    Object.defineProperty(window, 'localStorage', {
      value: undefined,
      writable: true
    })
    
    const onToggle = vi.fn()
    
    // Should not throw error
    expect(() => {
      render(
        <BrowserRouter>
          <Sidebar collapsed={false} onToggle={onToggle} />
        </BrowserRouter>
      )
    }).not.toThrow()
    
    // Should still render with default state
    const sidebarElement = screen.getByTestId('admin-sidebar')
    const computedStyle = getComputedStyle(sidebarElement)
    const width = parseInt(computedStyle.width.replace('px', ''), 10)
    
    expect(width).toBe(256) // Default expanded width
  })

  it('should use correct localStorage key', () => {
    const onToggle = vi.fn()
    
    render(
      <BrowserRouter>
        <Sidebar collapsed={false} onToggle={onToggle} />
      </BrowserRouter>
    )
    
    const toggleButton = screen.getByRole('button')
    fireEvent.click(toggleButton)
    
    // Should use the correct key
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'admin-sidebar-collapsed',
      expect.any(String)
    )
  })
})