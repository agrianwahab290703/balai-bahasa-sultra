# Implementation Plan

## Phase 1: Foundation & Core Infrastructure

- [x] 1. Set up admin panel foundation

  - [x] 1.1 Create AdminLayout component with sidebar navigation, header, and breadcrumbs
    - Implement responsive sidebar with collapsible menu
    - Add user dropdown with logout option
    - Include toast notification system
    - _Requirements: 11.2_

  - [x] 1.2 Create reusable DataTable component with pagination, search, and sorting
    - Implement column definitions with custom renderers
    - Add checkbox selection for bulk operations
    - Include loading states and empty states
    - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1_

  - [x] 1.3 Write property test for DataTable search filter accuracy
    - **Property 3: Search Filter Accuracy**
    - **Validates: Requirements 1.5, 4.4, 8.3**

  - [x] 1.4 Create BulkActions component for multi-select operations
    - Implement action dropdown with confirmation dialogs
    - Handle selected items state management
    - _Requirements: 1.6_

  - [x] 1.5 Write property test for bulk operation completeness
    - **Property 4: Bulk Operation Completeness**
    - **Validates: Requirements 1.6**

- [x] 2. Implement database migrations and models

  - [x] 2.1 Create activity_logs migration and ActivityLog model
    - Add polymorphic relationship for loggable entities
    - Implement indexes for performance
    - _Requirements: 10.1_

  - [x] 2.2 Update admin_users table with role and is_active columns
    - Add migration for new columns
    - Update AdminUser model with role enum
    - _Requirements: 9.1, 9.3_

  - [x] 2.3 Enhance media table with thumbnail_path and metadata columns
    - Add migration for new columns
    - Update Media model
    - _Requirements: 8.1, 8.2_

  - [x] 2.4 Write property test for role validation
    - **Property 13: Role Validation**
    - **Validates: Requirements 9.3**

- [x] 3. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Phase 2: Core Services & Utilities

- [x] 4. Implement ActivityLogger service

  - [x] 4.1 Create ActivityLoggerService with log method
    - Implement automatic old/new value tracking
    - Add IP address and user agent capture
    - _Requirements: 10.1, 10.3_

  - [x] 4.2 Write property test for activity log creation
    - **Property 16: Activity Log Creation**
    - **Validates: Requirements 10.1**

  - [x] 4.3 Create HasActivityLog trait for models
    - Auto-log on create, update, delete events
    - _Requirements: 10.1_

- [x] 5. Implement MediaService

  - [x] 5.1 Create MediaService with upload and thumbnail generation
    - Implement file type validation
    - Generate thumbnails for images
    - Store metadata (dimensions, mime type)
    - _Requirements: 8.2_

  - [x] 5.2 Write property test for file upload validation
    - **Property 1: File Upload Validation**
    - **Validates: Requirements 1.3, 3.2, 5.2, 6.3, 8.2**

  - [x] 5.3 Implement media reference tracking
    - Track which entities use each media file
    - Prevent deletion of referenced media
    - _Requirements: 8.5_

  - [x] 5.4 Write property test for media reference tracking
    - **Property 12: Media Reference Tracking**
    - **Validates: Requirements 8.5**

- [x] 6. Implement SlugGenerator utility

  - [x] 6.1 Create SlugGenerator helper with uniqueness check
    - Generate URL-friendly slugs from titles
    - Ensure uniqueness within entity type
    - _Requirements: 1.4_

  - [x] 6.2 Write property test for slug generation consistency
    - **Property 2: Slug Generation Consistency**
    - **Validates: Requirements 1.4**

- [x] 7. Implement HtmlSanitizer utility

  - [x] 7.1 Create HtmlSanitizer service for rich text content
    - Remove script tags and event handlers
    - Whitelist allowed HTML tags and attributes
    - _Requirements: 12.3, 12.4_

  - [x] 7.2 Write property test for HTML sanitization security
    - **Property 18: HTML Sanitization Security**
    - **Validates: Requirements 12.3, 12.4**

- [x] 8. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Phase 3: Rich Text Editor & Media Library

- [x] 9. Implement Rich Text Editor component

  - [x] 9.1 Integrate TipTap or similar React rich text editor
    - Configure toolbar with formatting options
    - Add image insertion capability
    - _Requirements: 12.1, 12.2_

  - [x] 9.2 Connect editor to MediaService for image uploads
    - Implement drag-drop image upload
    - Open media picker modal for existing images
    - _Requirements: 12.2_

- [x] 10. Implement Media Library module

  - [x] 10.1 Create Admin/MediaController with CRUD operations
    - Implement index with grid view and search
    - Add upload endpoint with validation
    - _Requirements: 8.1, 8.2, 8.3_

  - [x] 10.2 Create Media Library React pages (Index, Upload modal)
    - Grid view with thumbnails
    - Search and filter functionality
    - _Requirements: 8.1, 8.3_

  - [x] 10.3 Create MediaPicker modal component
    - Allow single or multiple selection
    - Show selected items preview
    - _Requirements: 8.4_

- [x] 11. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Phase 4: Berita Management (Priority Module)

- [x] 12. Implement Berita Admin CRUD

  - [x] 12.1 Create Admin/BeritaController with full CRUD
    - Index with pagination, search, filters
    - Store with validation and slug generation
    - Update with activity logging
    - Soft delete implementation
    - _Requirements: 1.1, 1.2, 1.4, 1.5, 1.7_

  - [x] 12.2 Write property test for data loading integrity
    - **Property 5: Data Loading Integrity**
    - **Validates: Requirements 1.7**

  - [x] 12.3 Create Berita React pages (Index, Create, Edit, Show)
    - Index with DataTable component
    - Create/Edit forms with rich text editor
    - Hero image upload with MediaPicker
    - _Requirements: 1.1, 1.2, 1.7_

  - [x] 12.4 Implement bulk actions for Berita (publish, unpublish, delete)
    - Connect to BulkActions component
    - Add confirmation dialogs
    - _Requirements: 1.6_

  - [x] 12.5 Add Berita routes to web_admin.php
    - Resource routes for CRUD
    - Bulk action route
    - _Requirements: 1.1_

- [x] 13. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Phase 5: Gallery Management

- [x] 14. Implement Gallery Admin CRUD

  - [x] 14.1 Create Admin/GalleryController with CRUD and reorder
    - Index with grid view
    - Store with image processing
    - Reorder endpoint for drag-drop
    - _Requirements: 2.1, 2.2, 2.4_

  - [x] 14.2 Write property test for sort order persistence
    - **Property 6: Sort Order Persistence**
    - **Validates: Requirements 2.4, 4.3, 5.4, 6.4, 7.3**

  - [x] 14.3 Create Gallery React pages with drag-drop reorder
    - Grid view with thumbnails
    - Drag-drop reordering using dnd-kit
    - Featured toggle with limit enforcement
    - _Requirements: 2.1, 2.4, 2.5_

  - [x] 14.4 Write property test for featured items constraint
    - **Property 7: Featured Items Constraint**
    - **Validates: Requirements 2.5**

  - [x] 14.5 Add Gallery routes to web_admin.php
    - _Requirements: 2.1_

- [x] 15. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Phase 6: PPID Document Management

- [x] 16. Implement PPID Admin CRUD

  - [x] 16.1 Create Admin/PpidDocumentController with CRUD
    - Index grouped by category
    - Store with file upload and validation
    - Download count tracking
    - _Requirements: 3.1, 3.2, 3.4_

  - [x] 16.2 Write property test for category grouping accuracy
    - **Property 8: Category Grouping Accuracy**
    - **Validates: Requirements 3.1, 6.1**

  - [x] 16.3 Write property test for single category assignment
    - **Property 9: Single Category Assignment**
    - **Validates: Requirements 3.3, 5.3**

  - [x] 16.4 Create PPID React pages (Index, Create, Edit)
    - Tabbed view by category
    - File upload with type validation
    - Statistics display
    - _Requirements: 3.1, 3.2, 3.4_

  - [x] 16.5 Write property test for visibility toggle effect






    - **Property 10: Visibility Toggle Effect**
    - **Validates: Requirements 3.5, 4.5, 6.5, 7.5**

  - [x] 16.6 Add PPID routes to web_admin.php
    - _Requirements: 3.1_

- [x] 17. Checkpoint - Ensure all tests pass





  - Ensure all tests pass, ask the user if questions arise.

## Phase 7: SSD & Standar Pelayanan Management

- [x] 18. Implement SSD (FAQ) Admin CRUD






  - [x] 18.1 Create Admin/SsdController with CRUD and reorder


    - Index with category filter
    - Drag-drop reorder support
    - Active toggle
    - _Requirements: 4.1, 4.3, 4.4, 4.5_


  - [x] 18.2 Create SSD React pages with drag-drop

    - List view with category tabs
    - Rich text editor for answers
    - Drag-drop reordering
    - _Requirements: 4.1, 4.2, 4.3_


  - [x] 18.3 Add SSD routes to web_admin.php

    - _Requirements: 4.1_

- [x] 19. Implement Standar Pelayanan Admin CRUD






  - [x] 19.1 Create Admin/StandarPelayananController with CRUD


    - Index with category filter
    - File upload with auto-detection
    - Download statistics
    - _Requirements: 5.1, 5.2, 5.5_


  - [x] 19.2 Create Standar Pelayanan React pages
    - List view with category filter
    - File upload form
    - Statistics display
    - _Requirements: 5.1, 5.2_


  - [x] 19.3 Add Standar Pelayanan routes to web_admin.php

    - _Requirements: 5.1_

- [x] 20. Checkpoint - Ensure all tests pass





  - Ensure all tests pass, ask the user if questions arise.

## Phase 8: Profile Content & Menu Management

- [x] 21. Implement Profile Content Admin CRUD






  - [x] 21.1 Create Admin/ProfileContentController with CRUD


    - Index grouped by type
    - Rich text content editing
    - Image upload for struktur
    - _Requirements: 6.1, 6.2, 6.3_


  - [x] 21.2 Create Profile Content React pages

    - Tabbed view by content type
    - Rich text editor integration
    - Image upload for organization structure
    - _Requirements: 6.1, 6.2, 6.3_


  - [x] 21.3 Add Profile Content routes to web_admin.php

    - _Requirements: 6.1_

- [x] 22. Implement Menu Management






  - [x] 22.1 Create Admin/MenuController with CRUD and reorder


    - Hierarchical tree structure
    - Parent-child relationship management
    - Depth validation (max 2 levels)
    - _Requirements: 7.1, 7.2, 7.4_

  - [x] 22.2 Write property test for menu depth constraint






    - **Property 11: Menu Depth Constraint**
    - **Validates: Requirements 7.4**

  - [x] 22.3 Create Menu React pages with tree view

    - Tree structure display
    - Drag-drop reordering within levels
    - Add/edit modal for menu items
    - _Requirements: 7.1, 7.2, 7.3_

  - [x] 22.4 Add Menu routes to web_admin.php


    - _Requirements: 7.1_

- [x] 23. Checkpoint - Ensure all tests pass





  - Ensure all tests pass, ask the user if questions arise.

## Phase 9: User Management & Activity Logs

- [x] 24. Implement User Management






  - [x] 24.1 Create Admin/UserController with CRUD (super_admin only)


    - Index with role filter
    - Create with password validation
    - Deactivate functionality
    - _Requirements: 9.1, 9.2, 9.4_

  - [x] 24.2 Write property test for deactivated user authentication block






    - **Property 14: Deactivated User Authentication Block**
    - **Validates: Requirements 9.4**


  - [x] 24.3 Write property test for password strength validation





    - **Property 15: Password Strength Validation**
    - **Validates: Requirements 9.5**

  - [x] 24.4 Create User Management React pages


    - User list with role badges
    - Create/edit forms with role selection
    - Password change form
    - _Requirements: 9.1, 9.2, 9.5_


  - [x] 24.5 Add User Management routes with super_admin middleware

    - _Requirements: 9.1_

- [x] 25. Implement Activity Log Viewer



  - [x] 25.1 Create Admin/ActivityLogController


    - Index with filters (user, action, date range)
    - Show detail with old/new values
    - _Requirements: 10.2, 10.3_

  - [x] 25.2 Write property test for activity log filtering






    - **Property 17: Activity Log Filtering**
    - **Validates: Requirements 10.2**


  - [x] 25.3 Create Activity Log React pages

    - List view with filters
    - Detail modal with change diff
    - _Requirements: 10.2, 10.3_

  - [x] 25.4 Add Activity Log routes to web_admin.php
    - _Requirements: 10.2_


- [x] 26. Checkpoint - Ensure all tests pass




  - Ensure all tests pass, ask the user if questions arise.

## Phase 10: Dashboard Enhancement & Final Integration

- [x] 27. Enhance Dashboard








  - [x] 27.1 Update DashboardController with comprehensive statistics


    - Total counts for all entities
    - Recent activities summary
    - Popular content metrics
    - _Requirements: 11.1, 11.3_

  - [x] 27.2 Update Dashboard React page with charts and widgets


    - Statistics cards
    - Recent activities list
    - Quick action buttons
    - Simple charts for views over time
    - _Requirements: 11.1, 11.2, 11.3_




- [x] 28. Final integration and navigation



  - [x] 28.1 Update admin sidebar navigation with all modules


    - Add menu items for all CRUD modules
    - Implement role-based menu visibility
    - _Requirements: 7.1_


  - [x] 28.2 Add breadcrumb navigation to all admin pages

    - Consistent breadcrumb structure
    - _Requirements: 11.2_


  - [x] 28.3 Implement global search across all entities

    - Search bar in header
    - Results grouped by entity type
    - _Requirements: 1.5_

- [x] 29. Final Checkpoint - Ensure all tests pass





  - Ensure all tests pass, ask the user if questions arise.
