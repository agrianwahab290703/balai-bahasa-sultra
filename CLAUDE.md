# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Laravel 12 + Inertia.js + React website for Balai Bahasa Kemendikdasmen Sulawesi Tenggara (Language Center). The application serves as a government institution website with features for news, services, galleries, PPID (public information), and various government program documentation (ZI-WBK, SAKIP).

**Tech Stack:**
- **Backend:** Laravel 12 (PHP 8.2+), Eloquent ORM, Laravel Fortify (authentication), Spatie Permissions
- **Frontend:** React 19, Inertia.js 2.x, TypeScript
- **UI Framework:** Tailwind CSS 4.0, Shadcn UI (Radix primitives), Hugeicons React
- **Build Tool:** Vite 7.x
- **Testing:** PHPUnit (backend), Vitest + Testing Library (frontend)
- **Forms:** React Hook Form + Zod validation

## Development Commands

### Initial Setup
```bash
composer setup  # Runs composer install, creates .env, generates key, migrates DB, npm install & build
```

### Development Workflow
```bash
# Full development stack (recommended)
composer dev    # Runs: php artisan serve + queue:listen + pail (logs) + npm run dev
                # Uses concurrently to run all services with color-coded output

# Alternative: separate terminals
php artisan serve                # Start Laravel server (http://localhost:8000)
npm run dev                      # Start Vite dev server (port 5173)
php artisan queue:listen         # Process background jobs
php artisan pail                 # Watch logs
```

### Mobile Development
```bash
npm run dev:mobile              # Vite with --host --port 5174
npm run sync:mobile             # Build + dev:mobile
npm run dev:all                 # Run both dev and dev:mobile
```

### Build & Deployment
```bash
npm run build                   # Standard production build
npm run build:prod              # Production build with mode flag
npm run build:memory            # Build with increased Node memory (4GB)
npm run build:watch             # Build in watch mode
composer run-script build       # Not defined, use npm run build
```

### Testing
```bash
# Backend (PHPUnit)
composer test                   # Clears config + runs tests
php artisan test                # Direct test run
php artisan test --filter TestName  # Run specific test

# Frontend (Vitest)
npm test                        # Run tests in watch mode
npm run test:run                # Run tests once (CI mode)
npm run test:ui                 # Open Vitest UI
```

### Code Quality
```bash
php artisan pint                # Laravel Pint (code formatting)
```

### Database
```bash
php artisan migrate             # Run migrations
php artisan migrate:fresh --seed  # Fresh DB with seeders
php artisan db:seed             # Run seeders only
```

## Architecture & Code Organization

### Backend Architecture

**Service Layer Pattern:**
The application uses a service layer to separate business logic from controllers. Key services:
- `NewsService` - News/berita CRUD and queries
- `ActivityService` - Activities/kegiatan management
- `ServiceService` - Public services (layanan)
- `VisitorService` - Analytics tracking

Controllers should be thin, delegating to services:
```php
// app/Http/Controllers/BeritaController.php
public function index(Request $request)
{
    $berita = $this->newsService->getAll($filters);
    return Inertia::render('Public/Berita/Index', ['berita' => $berita]);
}
```

**Models with Translation Support:**
Many models (`News`, `Activity`, `Service`) use a translation pattern with separate `*Translation` models:
- Primary model (e.g., `News`) contains shared fields: slug, images, status
- Translation model (e.g., `NewsTranslation`) contains locale-specific content: title, content, excerpt
- Use `byLocale()` scope to filter translations
- Services handle transaction-wrapped creation/updates of both models

**Image Management:**
News and Activities have dedicated `*Image` models for galleries:
- `NewsImage` - Additional images for news articles
- `ActivityImage` - Gallery images for activities
- `featured_image` is stored directly on parent model
- Images have `sort_order` for manual ordering

### Frontend Architecture

**Inertia.js Page Resolution:**
- Pages in `resources/js/Pages/**/*.tsx` (excludes test files)
- Route name maps to file path: `berita.index` → `Public/Berita/Index.tsx`
- All pages receive shared data from `HandleInertiaRequests` middleware

**Layout System:**
- `PublicLayout` (`resources/js/Layouts/PublicLayout.tsx`) - Main public-facing layout
  - Includes Header, Footer, and sets page title with "Balai Bahasa Sultra" suffix
  - Adds 28px/36px top padding for fixed header
- Future admin layouts will go in same directory

**Component Organization:**
```
resources/js/
├── Components/
│   ├── ui/              # Shadcn UI components (button, card, dialog, etc.)
│   ├── Public/          # Public website components (Header, Footer)
│   ├── Ppid/            # PPID-specific components (MultiStepForm, etc.)
│   └── StandarPelayanan/  # Document management components
├── Pages/
│   └── Public/          # All public pages organized by feature
├── Layouts/             # Layout components
├── hooks/               # Custom React hooks (useDeviceDetection, usePermohonanForm)
├── schemas/             # Zod validation schemas
├── types/               # TypeScript type definitions
└── lib/                 # Utilities (utils.ts with cn() helper)
```

**UI Component Standards:**
- ALWAYS use Shadcn UI components from `@/Components/ui/` - never create custom components if Shadcn equivalent exists
- ALWAYS use Hugeicons React for icons - search available icons before assuming names
- Use `cn()` utility from `@/lib/utils` for conditional className merging
- Prefer Tailwind utility classes over custom CSS

**Form Handling:**
- Use React Hook Form + Zod for all forms
- Create schemas in `resources/js/schemas/`
- Create custom hooks for complex forms (see `usePermohonanForm`, `useKeberatanForm`)
- Multi-step forms use custom components (see `MultiStepForm`, `KeberatanMultiStepForm`)

### Path Alias

Both Vite and Vitest use `@` alias for `resources/js/`:
```typescript
import { Button } from '@/Components/ui/button'
import { PublicLayout } from '@/Layouts/PublicLayout'
```

### Route Organization

Routes are organized by feature in `routes/web.php`:
- Public routes (no auth): Homepage, News, Services, Profile, Contact
- PPID routes: Public information, document requests, objections
- ZI-WBK routes: Integrity zone documentation (6 main areas, multiple sub-pages each)
- SAKIP routes: Government performance accountability
- Terbitan routes: Publications (magazines, books, research)

All routes use named routes (e.g., `route('berita.show', ['slug' => $slug])`).

### Database Conventions

- Uses SQLite by default (see `.env.example`)
- Migrations in chronological order with date prefixes
- Translation tables follow pattern: `{model}s` + `{model}_translations`
- Soft deletes used on `berita` table
- Many tables have `categories` as JSON column for flexibility
- View tracking through `content_views` table
- Visitor analytics in `visitors` table

### Vite Configuration

**Build Optimization:**
- Manual chunks split vendor code: `vendor`, `inertia`, `ui`, `forms`, `animation`, `utils`, `icons`
- Terser minification with `drop_console` and `drop_debugger`
- 1500KB chunk size warning limit

**Development Server:**
- Configured for network access on local IP (10.10.152.83)
- Uses polling for file watching (WSL compatibility)
- WebSocket HMR on port 5173
- CORS enabled

## Project-Specific Rules (from AGENTS.md)

### The Holy Trinity
Every feature must maintain synchronization between:
1. **UI (Visual)** - React components with Shadcn UI
2. **Logic (Backend)** - Laravel controllers + services
3. **Data (DB)** - Migrations with proper constraints

### Database is Single Source of Truth
- Always use unique constraints and foreign keys in migrations
- Never rely solely on application-level validation for data integrity
- Use database transactions in services for multi-model operations

### UI Component Priority
1. Check if Shadcn UI component exists before creating custom
2. Use Hugeicons React - search icon names, don't guess
3. Never hardcode CSS if Tailwind utility exists
4. Maintain mobile responsiveness (the app targets both desktop and mobile)

### Code Completeness
- NEVER use placeholders like `// ... rest of code`
- Always write complete implementations
- Don't truncate code in responses

### Before Making Changes
- Check `package.json` and `composer.json` for available dependencies
- Use `read_file` before `replace` to ensure exact context
- Verify import paths match alias configuration

### MCP Tools Reference (from AGENTS.md)
This project expects use of MCP tools for:
- **Investigation:** `codebase_investigator`, `glob`, `list_directory`
- **Knowledge:** `exa` for technical docs, `google_web_search`
- **UI:** `shadcn-ui` component lookup, `hugeicons` icon search
- **Execution:** `run_shell_command`, `browser_eval` for verification

## Special Features & Patterns

### Multi-Step Forms
See `usePermohonanForm` and `MultiStepForm` for pattern:
- Step state management with validation per step
- Progress indicators
- Form data persistence across steps
- Final submission via Inertia post

### Document Management
See `StandarPelayanan` components for pattern:
- Document filtering, preview, download
- Skeleton loading states
- Floating action buttons
- Document cards with metadata

### Device Detection
Use `useDeviceDetection` hook for responsive behavior:
```typescript
const { isMobile, isTablet, isDesktop } = useDeviceDetection()
```

### File Sync Scripts
The project has custom file watcher and build process scripts:
- `scripts/file-watcher.js` - Real-time sync watcher
- `scripts/build-process.js` - Platform build validation
- `scripts/sync-validator.js` - Full/quick sync testing

## Testing Patterns

### Frontend Testing (Vitest)
- Use Testing Library queries (getByRole, getByText)
- Test accessibility with jest-axe
- Mock Inertia router with custom setup
- See `resources/js/Pages/Ppid/Permohonan.test.tsx` for example

### Backend Testing (PHPUnit)
- Feature tests for HTTP endpoints
- Use factories for test data
- Database transactions for test isolation

## Common Pitfalls

1. **Don't start dev servers automatically** - Always ask user first
2. **Check HMR host in vite.config.js** - Currently set to specific IP, may need adjustment
3. **Translation models** - Remember to eager load with `with(['translations'])`
4. **Image paths** - Use `featured_image_url` accessor for proper URL generation
5. **Inertia responses** - Always return `Inertia::render()` not `view()`
6. **TypeScript paths** - Use `@/` not relative paths for better refactoring

## Git Workflow

- Follow Conventional Commits specification
- Current branch: `feature/ppid-profil-ux-enhancement`
- Main branch not configured (verify before creating PRs)
- ALWAYS commit after completing a task
