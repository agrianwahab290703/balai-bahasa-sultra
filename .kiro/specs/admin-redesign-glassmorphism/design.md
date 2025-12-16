# Design Document: Admin Panel Redesign dengan Glassmorphism

## Overview

Redesign komprehensif untuk seluruh halaman admin panel Balai Bahasa Sultra dengan tema visual modern yang menggabungkan:
- Kombinasi warna biru (#1E40AF, #3B82F6), putih (#FFFFFF), dan kuning cerah (#FFD700, #FFC107)
- Gradient multi-color stops (biru → putih → kuning)
- Glassmorphism effect (backdrop blur, semi-transparent backgrounds, subtle borders)
- Sidebar collapsible dengan animasi smooth
- Hover effects yang konsisten di seluruh komponen
- Responsive design untuk desktop dan mobile

## Architecture

### Design System Architecture

```mermaid
graph TB
    subgraph "Design Tokens Layer"
        DT[admin-design-tokens.css]
        DT --> Colors[Color Variables]
        DT --> Gradients[Gradient Variables]
        DT --> Glass[Glassmorphism Variables]
        DT --> Animations[Animation Variables]
    end
    
    subgraph "Component Layer"
        Sidebar[AdminSidebar]
        Header[AdminHeader]
        Cards[GlassCard]
        Tables[GlassDataTable]
        Forms[GlassForm]
        Buttons[GradientButton]
    end
    
    subgraph "Layout Layer"
        AdminLayout[AdminLayout.tsx]
        AdminLayout --> Sidebar
        AdminLayout --> Header
    end
    
    subgraph "Page Layer"
        Dashboard[Dashboard.tsx]
        Berita[Berita Pages]
        Gallery[Gallery Pages]
        Other[Other Admin Pages]
    end
    
    DT --> Component Layer
    Component Layer --> Layout Layer
    Layout Layer --> Page Layer
```

### File Structure

```
resources/
├── js/
│   ├── Components/
│   │   ├── Admin/
│   │   │   ├── Sidebar.tsx          # Redesigned sidebar
│   │   │   ├── Header.tsx           # Redesigned header
│   │   │   ├── GlassCard.tsx        # New glassmorphism card
│   │   │   ├── GlassDataTable.tsx   # Redesigned data table
│   │   │   ├── GradientButton.tsx   # New gradient button
│   │   │   └── index.ts             # Exports
│   │   └── ui/
│   │       └── glass-*.tsx          # Glass UI primitives
│   ├── Layouts/
│   │   └── AdminLayout.tsx          # Updated layout
│   └── Pages/
│       └── Admin/
│           └── Dashboard.tsx        # Redesigned dashboard
└── css/
    └── styles/
        └── admin-design-tokens.css  # Updated design tokens
```

## Components and Interfaces

### 1. Design Tokens (CSS Custom Properties)

```typescript
interface AdminDesignTokens {
  // Primary Colors
  '--admin-primary-blue': string      // #1E40AF
  '--admin-secondary-blue': string    // #3B82F6
  '--admin-accent-yellow': string     // #FFD700
  '--admin-secondary-yellow': string  // #FFC107
  '--admin-white': string             // #FFFFFF
  
  // Gradients
  '--admin-gradient-sidebar': string  // linear-gradient(180deg, #1E40AF 0%, #1E3A8A 100%)
  '--admin-gradient-header': string   // linear-gradient(90deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)
  '--admin-gradient-button': string   // linear-gradient(135deg, #1E40AF 0%, #3B82F6 50%, #FFD700 100%)
  '--admin-gradient-card': string     // linear-gradient(135deg, rgba(30,64,175,0.1) 0%, rgba(255,215,0,0.1) 100%)
  
  // Glassmorphism
  '--admin-glass-bg': string          // rgba(255, 255, 255, 0.15)
  '--admin-glass-border': string      // rgba(255, 255, 255, 0.2)
  '--admin-glass-shadow': string      // 0 8px 32px rgba(0, 0, 0, 0.1)
  '--admin-glass-blur': string        // 12px
  
  // Transitions
  '--admin-transition-fast': string   // 150ms ease
  '--admin-transition-normal': string // 300ms ease
  '--admin-transition-slow': string   // 500ms ease
  
  // Sizing
  '--admin-sidebar-width': string           // 256px
  '--admin-sidebar-width-collapsed': string // 64px
  '--admin-header-height': string           // 64px
}
```

### 2. Sidebar Component Interface

```typescript
interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  userRole?: string
}

interface MenuItem {
  label: string
  href: string
  icon: React.ReactNode
  roles?: string[]
}

// Sidebar styling requirements:
// - Fixed position left: 0, top: 0
// - Width: 256px (expanded) / 64px (collapsed)
// - Background: gradient blue with glassmorphism overlay
// - Transition: 300ms ease-in-out
// - localStorage persistence for collapse state
```

### 3. Header Component Interface

```typescript
interface HeaderProps {
  onMenuClick: () => void
  onSearchOpen: () => void
}

// Header styling requirements:
// - Sticky position top: 0
// - Height: 64px
// - Background: glassmorphism with white semi-transparent
// - Backdrop-filter: blur(8px)
// - Search bar with glassmorphism styling
// - User dropdown with gradient avatar
```

### 4. GlassCard Component Interface

```typescript
interface GlassCardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'stat' | 'activity'
  hoverable?: boolean
  gradient?: boolean
}

// GlassCard styling requirements:
// - Background: rgba(255, 255, 255, 0.15)
// - Backdrop-filter: blur(12px)
// - Border: 1px solid rgba(255, 255, 255, 0.2)
// - Border-radius: 12px
// - Box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1)
// - Hover: translateY(-2px), increased shadow
```

### 5. GradientButton Component Interface

```typescript
interface GradientButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'accent'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  disabled?: boolean
  className?: string
}

// GradientButton styling requirements:
// - Primary: gradient blue → yellow
// - Secondary: gradient blue → white
// - Accent: solid yellow with blue text
// - Hover: scale(1.02), brightness(1.1)
// - Transition: 200ms ease
```

### 6. GlassDataTable Component Interface

```typescript
interface GlassDataTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  onRowClick?: (row: T) => void
  pagination?: boolean
  searchable?: boolean
}

// GlassDataTable styling requirements:
// - Container: glassmorphism effect
// - Header: gradient blue background
// - Rows: alternating opacity backgrounds
// - Hover: yellow accent with 10% opacity
// - Action buttons: gradient backgrounds
```

## Data Models

### Sidebar State Model

```typescript
interface SidebarState {
  collapsed: boolean
  mobileOpen: boolean
}

// localStorage key: 'admin-sidebar-collapsed'
// Default: false (expanded)
```

### Theme Configuration Model

```typescript
interface AdminThemeConfig {
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
  }
  glassmorphism: {
    blur: number
    opacity: number
    borderOpacity: number
  }
  animations: {
    fast: number
    normal: number
    slow: number
  }
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: CSS Custom Properties Definition
*For any* admin page render, all required CSS custom properties (--admin-primary-blue, --admin-accent-yellow, --admin-glass-bg, --admin-glass-blur, etc.) SHALL be defined in the :root element with valid CSS values.
**Validates: Requirements 1.1, 1.3**

### Property 2: Gradient Color Stops
*For any* gradient CSS value applied to admin components, the gradient string SHALL contain the specified color stops (blue #1E40AF, white #FFFFFF, yellow #FFD700) in the correct order.
**Validates: Requirements 1.2**

### Property 3: Glassmorphism Properties
*For any* glassmorphism component (sidebar, header, cards), the element SHALL have backdrop-filter with blur >= 12px, background with rgba alpha between 0.1-0.3, and border with rgba(255,255,255,0.2).
**Validates: Requirements 2.1, 2.2, 2.3, 2.4**

### Property 4: Sidebar Positioning and Sizing
*For any* sidebar render, the element SHALL have position: fixed, left: 0, and width equal to 256px when expanded or 64px when collapsed.
**Validates: Requirements 3.1, 3.2, 3.3**

### Property 5: Sidebar State Persistence
*For any* sidebar toggle action, the collapsed state SHALL be persisted to localStorage, and on page reload, the sidebar SHALL restore the persisted state.
**Validates: Requirements 3.5**

### Property 6: Sidebar Transition Animation
*For any* sidebar toggle between collapsed and expanded modes, the transition SHALL have duration of 300ms with ease-in-out timing function.
**Validates: Requirements 3.4, 10.2**

### Property 7: Hover Transform Effects
*For any* hoverable button element, the hover state SHALL apply transform: scale(1.02) and filter with brightness increase.
**Validates: Requirements 4.1**

### Property 8: Card Hover Effects
*For any* hoverable card component, the hover state SHALL apply transform: translateY(-2px) and increased box-shadow.
**Validates: Requirements 4.2**

### Property 9: Table Row Hover
*For any* data table row, the hover state SHALL apply background color with yellow accent (#FFD700) at 10% opacity.
**Validates: Requirements 4.4, 6.3**

### Property 10: Transition Duration Consistency
*For any* interactive element with hover effects, the transition duration SHALL be 200ms.
**Validates: Requirements 4.5, 10.5**

### Property 11: Header Glassmorphism and Positioning
*For any* header render, the element SHALL have position: sticky, top: 0, backdrop-filter with blur, and semi-transparent white background.
**Validates: Requirements 8.1, 8.5**

### Property 12: Touch Target Size
*For any* interactive element on mobile viewport (< 768px), the element SHALL have minimum height and width of 44px.
**Validates: Requirements 9.5**

### Property 13: Animation Stagger Delay
*For any* dashboard statistics cards, each card SHALL have animation-delay incrementing by 50ms from the previous card.
**Validates: Requirements 10.3**

## Error Handling

### CSS Fallbacks
- Jika browser tidak mendukung `backdrop-filter`, gunakan solid background color sebagai fallback
- Jika browser tidak mendukung CSS custom properties, gunakan hardcoded values

### State Management Errors
- Jika localStorage tidak tersedia, sidebar state tidak akan dipersist
- Default ke expanded mode jika state tidak dapat dibaca

### Responsive Breakpoints
- Desktop: >= 1024px (sidebar visible)
- Tablet: 768px - 1023px (sidebar collapsible)
- Mobile: < 768px (sidebar hidden, hamburger menu)

## Testing Strategy

### Unit Testing
- Test CSS custom properties are defined correctly
- Test component renders with correct classes
- Test sidebar toggle updates state
- Test localStorage persistence

### Property-Based Testing
Library: **fast-check** (untuk TypeScript/JavaScript)

Setiap property-based test akan:
1. Generate random valid inputs
2. Verify the property holds for all generated inputs
3. Run minimum 100 iterations per property

Property tests akan di-tag dengan format:
`**Feature: admin-redesign-glassmorphism, Property {number}: {property_text}**`

### Visual Regression Testing
- Screenshot comparison untuk setiap komponen
- Test di berbagai viewport sizes
- Test hover states dengan Playwright

### Integration Testing
- Test sidebar collapse/expand flow
- Test navigation between admin pages
- Test responsive behavior

