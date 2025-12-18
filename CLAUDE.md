# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Laravel + React Inertia.js web application for Balai Bahasa Sulawesi Tenggara (Language Development Center of Southeast Sulawesi). The application serves as a government website with both public-facing content and an admin panel for content management.

### Tech Stack

- **Backend**: Laravel 12.0, PHP 8.2+
- **Frontend**: React 19.2, TypeScript, Tailwind CSS 4.0
- **Admin UI**: Custom components using Radix UI primitives, Lucide & HugeIcons React
- **Rich Text**: TipTap editor for content management
- **Authentication**: Laravel Fortify + custom admin authentication
- **File Management**: Custom media library with Intervention Image
- **Permissions**: Spatie Laravel Permission package

## Key Architecture

### Frontend Structure

- **Entry Points**:
  - `resources/js/app.tsx` - Main React application entry
  - `resources/css/app.css` - Tailwind CSS with custom design tokens

- **Components Organization**:
  - `resources/js/Components/` - Reusable components (UI, Admin, Public)
  - `resources/js/Layouts/` - Layout templates (AdminLayout, PublicLayout)
  - `resources/js/Pages/` - Inertia.js page components organized by route

- **Admin Panel Features**:
  - Glassmorphism design system with cultural Indonesian icons
  - Rich text editor with image upload capabilities
  - Media library with bulk operations
  - Drag-and-drop sortable galleries
  - Activity logging and user management

### Backend Structure

- **Controllers**: Organized by feature (Admin, Public)
  - `App/Http/Controllers/Admin/` - Admin panel controllers
  - `App/Http/Controllers/` - Public-facing controllers

- **Models**: Eloquent models with proper relationships
  - `Berita` - News articles with view tracking
  - `Gallery` - Photo galleries with ordering
  - `Pengumuman` - Announcements with supporting images
  - `StandarPelayanan` - Service standards with document downloads
  - `ProfileContent` - Profile pages with ordering
  - `AdminUser` - Admin users with role-based permissions

- **Middleware**:
  - `AdminAuthMiddleware` - Admin authentication guard
  - `HandleInertiaRequests` - Inertia.js data sharing
  - Custom CSRF and validation middleware

- **Services**:
  - `MediaService` - File upload and management
  - `HtmlSanitizer` - Content sanitization
  - `PengumumanService` - Business logic for announcements
  - `SlugGenerator` - URL slug generation

### Key Features

1. **Admin Authentication**: Separate admin guard with role-based access (admin, super_admin)
2. **Media Management**: Centralized media library with automatic image optimization
3. **Content Management**: Full CRUD for news, galleries, announcements, and standards
4. **Public Frontend**: Clean, responsive public website with SEO-friendly URLs
5. **Activity Logging**: Track all admin actions for audit purposes
6. **Bulk Operations**: Efficient bulk editing and deletion capabilities

## Common Development Commands

### Backend Development

```bash
# Start Laravel development server with all services
composer run dev

# Start only Laravel server
php artisan serve

# Run database migrations
php artisan migrate

# Fresh database with seeding
php artisan migrate:fresh --seed

# Create new migration
php artisan make:migration create_table_name

# Run tests
php artisan test

# Clear caches
php artisan config:clear
php artisan cache:clear
php artisan view:clear
```

### Frontend Development

```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev

# Build for production
npm run build

# Build with memory optimization
npm run build:memory

# Watch for changes and rebuild
npm run build:watch

# Development with mobile support
npm run dev:mobile

# Run tests
npm run test

# Test in UI mode
npm run test:ui

# Clean build artifacts
npm run clean
```

### Full Stack Development

```bash
# Run both backend and frontend concurrently
npm run dev:all

# Sync files between platforms (if needed)
npm run sync:platforms
```

## File Upload & Media Handling

- **Upload Path**: `public/storage/uploads/`
- **Allowed Formats**: Images (jpg, jpeg, png, gif, webp), Documents (pdf, doc, docx)
- **Image Processing**: Auto-resize with Intervention Image
- **Storage**: Public disk with organized folder structure

## Testing

- **PHP Tests**: PHPUnit in `tests/` directory
- **JavaScript Tests**: Vitest with React Testing Library
- **Test Configuration**: `phpunit.xml`, `vitest.config.ts`

## Development Notes

1. **Code Style**: Follow PSR-12 for PHP, use TypeScript for frontend
2. **Routing**: Separate route files for public (`web.php`) and admin (`web_admin.php`)
3. **Security**: All admin routes protected by authentication middleware
4. **Performance**: Eager loading relationships, optimized queries, and image caching
5. **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation support

## Database Seeding

Default admin credentials (check database seeders):
- Username: `admin@example.com`
- Password: `password` (change in production)

## AI Agent Integration

The project includes several custom AI agent configurations and scripts for enhanced development workflow:
- Located in `.claude/agents/` and `.skills/` directories
- Custom MCP server integrations for web scraping and content analysis
- Specialized agents for debugging, validation, and autonomous development

## Media Gallery Features

- **Sortable Items**: Drag-and-drop reordering with @dnd-kit
- **Bulk Operations**: Select multiple items for batch actions
- **Featured Status**: Toggle featured status for galleries
- **Image Optimization**: Automatic resizing on upload
- **Lazy Loading**: Optimized image display with blur effects