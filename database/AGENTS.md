# Database Layer

## Package Identity
- Laravel Eloquent ORM with migrations
- MySQL database (configured in .env)
- Database version control via migrations

## Setup & Run
```bash
# Run migrations
php artisan migrate

# Create new migration
php artisan make:migration create_table_name

# Seed database
php artisan db:seed

# Reset and re-migrate
php artisan migrate:fresh --seed
```

## Patterns & Conventions
### Migrations
- Location: `database/migrations/`
- Use descriptive names: `create_.._table`, `add_.._to_.._table`
- Always include `->id()` and timestamps for new tables
- Use foreign key constraints where appropriate

✅ DO:
```php
Schema::create('documents', function (Blueprint $table) {
    $table->id();
    $table->string('title');
    $table->text('content');
    $table->foreignId('user_id')->constrained();
    $table->timestamps();
});
```

### Models
- Location: `app/Models/`
- Use `$fillable` for mass assignment
- Define relationships as methods
- Use casts for type conversion

Example:
```php
class Document extends Model {
    use HasFactory;
    
    protected $fillable = ['title', 'content', 'user_id'];
    
    protected $casts = [
        'published_at' => 'datetime',
    ];
    
    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
    }
}
```

### Seeders
- Location: `database/seeders/`
- Use factories for test data
- Call seeders in `DatabaseSeeder.php`

## Touch Points / Key Files
- Schema file: `database/schema/mysql-schema.dump` (if exists)
- Factory definitions: `database/factories/`
- Main seeder: `database/seeders/DatabaseSeeder.php`
- Connection config: `config/database.php`

## JIT Index Hints
- List migrations: `ls database/migrations/`
- Find models: `rg -n "class.*extends Model" app/Models`
- Find factories: `rg -n "class.*Factory" database/factories`
- Check schema: `php artisan schema:dump`

## Common Gotchas
- Always backup production DB before running migrations
- Use `php artisan migrate:status` to check migration state
- Foreign keys must reference existing tables
- Use `softDeletes()` trait for soft deletes if needed
- Remember to add indexes for frequently queried columns

## Pre-PR Checks
```bash
php artisan migrate:status && php artisan test --filter=Database
```
