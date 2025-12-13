# App Directory - Laravel Backend

## Package Identity
- Contains Laravel application code (Controllers, Models, Services)
- Follows Laravel MVC architecture with additional service layer

## Setup & Run
```bash
# Start Laravel server
php artisan serve

# Run queue worker
php artisan queue:work

# Run tests
php artisan test

# Code formatting
./vendor/bin/pint
```

## Patterns & Conventions
### Controllers
- Location: `app/Http/Controllers/`
- Naming: PascalCase + "Controller" suffix
- Use dependency injection for services and models
- Always return Inertia responses for web routes

✅ DO: `class UserController extends Controller`
❌ DON'T: `class usercontroller`

### Models
- Location: `app/Models/`
- Use fillable property for mass assignment
- Include relationships as methods
- Use accessors/mutators for formatted data

### Services
- Location: `app/Services/`
- For complex business logic
- Use dependency injection
- Single responsibility principle

Example:
```php
class DocumentService {
    public function __construct(private DocumentRepository $repo) {}
    
    public function publishDocument(Document $doc): bool {
        // Complex business logic here
    }
}
```

## Touch Points / Key Files
- HTTP Kernel: `app/Http/Kernel.php`
- Service Providers: `app/Providers/`
- Auth configuration: `config/auth.php`
- Middleware: `app/Http/Middleware/`

## JIT Index Hints
- Find controllers: `rg -n "class.*Controller" app/Http/Controllers`
- Find models: `rg -n "class.*extends Model" app/Models`
- Find services: `rg -n "class.*Service" app/Services`
- Find middleware: `ls app/Http/Middleware/`

## Common Gotchas
- Always validate input using Laravel's `validate()` method
- Use Inertia `redirect()->back()->with()` for form errors
- Remember to add routes to `routes/web.php`
- Model relationships must be eager loaded to prevent N+1 queries

## Pre-PR Checks
```bash
./vendor/bin/pint && php artisan test && php artisan config:clear
```
