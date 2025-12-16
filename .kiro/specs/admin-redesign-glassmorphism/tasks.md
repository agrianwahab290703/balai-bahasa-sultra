# Implementation Plan

## 1. Update Design Tokens dan CSS Variables

- [x] 1.1 Update admin-design-tokens.css dengan color palette baru
  - Update primary colors: Blue (#1E40AF, #3B82F6), Yellow (#FFD700, #FFC107)
  - Update gradient definitions dengan multi-color stops (blue → white → yellow)
  - Update glassmorphism variables (blur: 12px, opacity: 0.15-0.3)
  - _Requirements: 1.1, 1.2, 1.3_

- [ ]* 1.2 Write property test untuk CSS custom properties
  - **Property 1: CSS Custom Properties Definition**
  - **Validates: Requirements 1.1, 1.3**

- [ ]* 1.3 Write property test untuk gradient color stops
  - **Property 2: Gradient Color Stops**
  - **Validates: Requirements 1.2**

## 2. Redesign Sidebar Component

- [x] 2.1 Update Sidebar.tsx dengan glassmorphism dan gradient styling
  - Apply gradient background (blue → darker blue)
  - Add glassmorphism overlay dengan backdrop-filter blur 12px
  - Update menu item hover styles dengan rgba(255,255,255,0.15)
  - Add tooltip untuk collapsed mode
  - _Requirements: 3.1, 3.2, 3.3, 3.6, 3.7_

- [ ] 2.2 Implement sidebar state persistence dengan localStorage
  - Save collapsed state ke localStorage on toggle
  - Read initial state dari localStorage on mount
  - _Requirements: 3.5_

- [x] 2.3 Update sidebar transition animations
  - Set transition duration 300ms dengan ease-in-out
  - Animate width change smoothly
  - _Requirements: 3.4_

- [ ]* 2.4 Write property test untuk sidebar positioning dan sizing
  - **Property 4: Sidebar Positioning and Sizing**
  - **Validates: Requirements 3.1, 3.2, 3.3**

- [ ]* 2.5 Write property test untuk sidebar state persistence
  - **Property 5: Sidebar State Persistence**
  - **Validates: Requirements 3.5**

- [ ]* 2.6 Write property test untuk sidebar transition
  - **Property 6: Sidebar Transition Animation**
  - **Validates: Requirements 3.4, 10.2**

## 3. Checkpoint - Sidebar Complete

- [ ] 3. Ensure all tests pass, ask the user if questions arise.

## 4. Redesign Header Component

- [x] 4.1 Update Header.tsx dengan glassmorphism styling
  - Apply glassmorphism background dengan backdrop-filter blur 8px
  - Update sticky positioning dengan appropriate z-index
  - Style search bar dengan glassmorphism dan blue focus ring
  - Update user dropdown dengan gradient avatar background
  - _Requirements: 8.1, 8.2, 8.3, 8.5_

- [x] 4.2 Update header button hover effects
  - Apply background transition ke rgba(255,255,255,0.2) on hover
  - Add transition duration 200ms
  - _Requirements: 8.4, 4.5_

- [ ]* 4.3 Write property test untuk header glassmorphism dan positioning
  - **Property 11: Header Glassmorphism and Positioning**
  - **Validates: Requirements 8.1, 8.5**

## 5. Create GlassCard Component

- [ ] 5.1 Create GlassCard.tsx component
  - Implement glassmorphism effect (blur, opacity, border, shadow)
  - Add variant props (default, stat, activity)
  - Add hoverable prop dengan translateY(-2px) effect
  - Add gradient border option
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ]* 5.2 Write property test untuk glassmorphism properties
  - **Property 3: Glassmorphism Properties**
  - **Validates: Requirements 2.1, 2.2, 2.3, 2.4**

- [ ]* 5.3 Write property test untuk card hover effects
  - **Property 8: Card Hover Effects**
  - **Validates: Requirements 4.2**

## 6. Create GradientButton Component

- [ ] 6.1 Create GradientButton.tsx component
  - Implement gradient backgrounds (primary: blue→yellow, secondary: blue→white)
  - Add size variants (sm, md, lg)
  - Add hover effects dengan scale(1.02) dan brightness increase
  - Add transition duration 200ms
  - _Requirements: 4.1, 5.4, 7.4_

- [ ]* 6.2 Write property test untuk button hover transform
  - **Property 7: Hover Transform Effects**
  - **Validates: Requirements 4.1**

- [ ]* 6.3 Write property test untuk transition duration
  - **Property 10: Transition Duration Consistency**
  - **Validates: Requirements 4.5, 10.5**

## 7. Checkpoint - Core Components Complete

- [ ] 7. Ensure all tests pass, ask the user if questions arise.

## 8. Redesign DataTable Component

- [ ] 8.1 Update DataTable.tsx dengan glassmorphism styling
  - Apply glassmorphism effect pada table container
  - Update header row dengan gradient background (blue → lighter blue)
  - Add alternating row backgrounds dengan subtle opacity
  - Style action buttons dengan gradient backgrounds
  - _Requirements: 6.1, 6.2, 6.4, 6.5_

- [ ] 8.2 Update table row hover effects
  - Apply yellow accent background dengan 10% opacity on hover
  - Add transition duration 200ms
  - _Requirements: 6.3, 4.4_

- [ ] 8.3 Update pagination styling
  - Style page buttons dengan gradient hover effects
  - _Requirements: 6.6_

- [ ]* 8.4 Write property test untuk table row hover
  - **Property 9: Table Row Hover**
  - **Validates: Requirements 4.4, 6.3**

## 9. Update Form Components Styling

- [ ] 9.1 Update input field styles
  - Apply glassmorphism background
  - Add blue border dan glow effect on focus
  - Add transition untuk focus state
  - _Requirements: 7.1, 7.2_

- [ ] 9.2 Update select dropdown styles
  - Apply glassmorphism pada dropdown
  - Add gradient arrow indicator
  - _Requirements: 7.3_

- [ ] 9.3 Update form label dan validation styles
  - Style labels dengan blue color dan medium font weight
  - Add red border dan background tint untuk invalid fields
  - _Requirements: 7.5, 7.6_

## 10. Redesign Dashboard Page

- [ ] 10.1 Update Dashboard hero section
  - Apply gradient background (blue → yellow)
  - Add glassmorphism overlay
  - _Requirements: 5.1_

- [ ] 10.2 Update statistics cards dengan GlassCard
  - Apply glassmorphism effect
  - Add gradient accent borders
  - Add icon dengan gradient background circle
  - Add stagger animation dengan 50ms delay
  - _Requirements: 5.2, 5.3, 10.3_

- [ ] 10.3 Update quick action buttons dengan GradientButton
  - Apply gradient backgrounds
  - Add hover scale effects
  - _Requirements: 5.4_

- [ ] 10.4 Update activity timeline section
  - Apply glassmorphism card container
  - Add color-coded badges
  - _Requirements: 5.5_

- [ ] 10.5 Update popular content sections
  - Add ranking indicators
  - Add hover highlight effects
  - _Requirements: 5.6_

- [ ]* 10.6 Write property test untuk animation stagger delay
  - **Property 13: Animation Stagger Delay**
  - **Validates: Requirements 10.3**

## 11. Checkpoint - Dashboard Complete

- [ ] 11. Ensure all tests pass, ask the user if questions arise.

## 12. Implement Responsive Design

- [ ] 12.1 Update sidebar responsive behavior
  - Hide sidebar by default pada viewport < 1024px
  - Show via hamburger menu
  - _Requirements: 9.1_

- [ ] 12.2 Update card layout responsive behavior
  - Stack cards vertically pada viewport < 768px
  - _Requirements: 9.2_

- [ ] 12.3 Update header responsive behavior
  - Display compact search icon pada mobile
  - _Requirements: 9.4_

- [ ] 12.4 Ensure touch target sizes
  - Set minimum 44px height dan width untuk interactive elements pada mobile
  - _Requirements: 9.5_

- [ ]* 12.5 Write property test untuk touch target size
  - **Property 12: Touch Target Size**
  - **Validates: Requirements 9.5**

## 13. Implement Page Animations

- [ ] 13.1 Add fade-in animation untuk page load
  - Apply fade-in dengan 300ms duration
  - _Requirements: 10.1_

- [ ] 13.2 Add modal animations
  - Apply scale dan fade animation dari 95% ke 100%
  - _Requirements: 10.4_

## 14. Apply Redesign ke Semua Admin Pages

- [ ] 14.1 Update Berita pages (Index, Create, Edit, Show)
  - Apply GlassCard untuk content containers
  - Apply GlassDataTable untuk list view
  - Apply GradientButton untuk actions
  - _Requirements: 1.4, 4.6_

- [ ] 14.2 Update Gallery pages
  - Apply glassmorphism styling
  - Update grid layout dengan hover effects
  - _Requirements: 1.4, 4.6_

- [ ] 14.3 Update PPID pages
  - Apply glassmorphism styling
  - Update document list dengan GlassDataTable
  - _Requirements: 1.4, 4.6_

- [ ] 14.4 Update SSD (FAQ) pages
  - Apply glassmorphism styling
  - Update FAQ list dengan hover effects
  - _Requirements: 1.4, 4.6_

- [ ] 14.5 Update Standar Pelayanan pages
  - Apply glassmorphism styling
  - _Requirements: 1.4, 4.6_

- [ ] 14.6 Update Profile Content pages
  - Apply glassmorphism styling
  - _Requirements: 1.4, 4.6_

- [ ] 14.7 Update Menu pages
  - Apply glassmorphism styling
  - _Requirements: 1.4, 4.6_

- [ ] 14.8 Update Media Library pages
  - Apply glassmorphism styling
  - Update media grid dengan hover effects
  - _Requirements: 1.4, 4.6_

- [ ] 14.9 Update Users pages
  - Apply glassmorphism styling
  - Update user list dengan GlassDataTable
  - _Requirements: 1.4, 4.6_

- [ ] 14.10 Update Activity Log pages
  - Apply glassmorphism styling
  - Update log list dengan timeline styling
  - _Requirements: 1.4, 4.6_

## 15. Final Checkpoint - All Tests Pass

- [ ] 15. Ensure all tests pass, ask the user if questions arise.
