# Routes Directory

## Package Identity
- Laravel route definitions
- Inertia.js responses for web routes
- API routes if needed

## Setup & Run
```bash
# List all routes
php artisan route:list

# Cache routes (production)
php artisan route:cache

# Clear route cache
php artisan route:clear
```

## Patterns & Conventions
### Web Routes (web.php)
- Use Inertia::render for page responses
- Group related routes with `Route::group`
- Use resource routes for CRUD operations
- Include middleware where needed

✅ DO:
```php
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('documents', DocumentController::class);
});
```

### Route Naming
- Use snake_case for route names
- Follow pattern: `resource.action`
- Be descriptive and consistent

Examples:
- `documents.index` - List documents
- `documents.show` - Show single document
- `documents.create` - Create form
- `documents.store` - Save new document
- `documents.edit` - Edit form
- `documents.update` - Update document
- `documents.destroy` - Delete document

## Touch Points / Key Files
- Web routes: `routes/web.php`
- API routes: `routes/api.php` (if exists)
- Console routes: `routes/console.php`
- Channel routes: `routes/channels.php` (if exists)

## JIT Index Hints
- Find all routes: `rg -n "Route::" routes/`
- List web routes: `php artisan route:list --path=web`
- Find controller usage: `rg -n "Controller::class" routes/`
- Check middleware: `rg -n "->middleware" routes/`

## Common Gotchas
- Always include CSRF token for web forms
- API routes need `api/` prefix automatically
- Route parameters are case-sensitive
- Remember to add new routes to navigation menus
- Use route helpers (`route()`, `url()`) not hardcoded URLs

## Pre-PR Checks
```bash
php artisan route:list && php artisan route:cache
```
