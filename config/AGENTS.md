# Configuration Directory

## Package Identity
- Laravel application configuration
- Environment-specific settings
- Service provider registrations

## Setup & Run
```bash
# Clear config cache
php artisan config:clear

# Cache config (production)
php artisan config:cache

# Show config value
php artisan config:get app.name
```

## Patterns & Conventions
### Configuration Files
- Location: `config/`
- Use arrays for configuration
- Access via `config('key')` helper
- Environment variables in `.env`

✅ DO:
```php
return [
    'default' => env('MAIL_MAILER', 'smtp'),
    'mailers' => [
        'smtp' => [
            'transport' => 'smtp',
            'host' => env('MAIL_HOST'),
            'port' => env('MAIL_PORT', 587),
        ],
    ],
];
```

### Environment Variables
- Define in `.env.example` for documentation
- Use `env('KEY', 'default')` for optional values
- Never commit actual `.env` file
- Use descriptive variable names

## Key Configuration Files
- `app.php` - Application settings, timezone, locale
- `database.php` - Database connections
- `filesystems.php` - File storage configuration
- `mail.php` - Email settings
- `services.php` - Third-party service keys
- `inertia.php` - Inertia.js configuration
- `cors.php` - CORS settings for API

## Touch Points / Key Files
- Environment: `.env` and `.env.example`
- Application config: `config/app.php`
- Inertia config: `config/inertia.php`
- Service providers: `config/app.php` providers array

## JIT Index Hints
- Find config files: `ls config/`
- Search config usage: `rg -n "config\(" app/`
- Check env variables: `rg -n "env\(" config/`
- Service providers: `rg -n "App\\\\Providers" config/app.php`

## Common Gotchas
- Clear config cache after changes in production
- Use `.env.example` to document all required variables
- Don't hardcode URLs, use `asset()` helper
- Remember to set `APP_URL` correctly for assets
- Inertia shared data goes in `HandleInertiaRequests` middleware

## Pre-PR Checks
```bash
php artisan config:clear && php artisan config:cache
```
