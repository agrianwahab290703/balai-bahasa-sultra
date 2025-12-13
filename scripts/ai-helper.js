#!/usr/bin/env node

/**
 * AI Helper Script untuk Balai Bahasa Project
 * Memudahkan penerapan AI rules dalam development workflow
 */

const { readFileSync, existsSync } = require('fs');
const { join } = require('path');

const RULES_PATH = join(__dirname, '../.ai-rules.md');

class AIHelper {
    constructor() {
        this.rules = this.loadRules();
        this.commands = {
            'check': 'Check if implementation follows AI rules',
            'component': 'Get component from shadcn-ui before creating custom',
            'debug': 'Debug mobile sync issues',
            'validate': 'Validate code quality and standards',
            'migrate': 'Check migration best practices',
            'help': 'Show available commands'
        };
    }

    loadRules() {
        if (!existsSync(RULES_PATH)) {
            console.error('❌ .ai-rules.md not found!');
            process.exit(1);
        }
        return readFileSync(RULES_PATH, 'utf8');
    }

    showHelp() {
        console.log(`
🤖 AI Helper - Balai Bahasa Sulawesi Tenggara

Available Commands:
${Object.entries(this.commands).map(([cmd, desc]) =>
    `  ${cmd.padEnd(12)} ${desc}`
).join('\n')}

Usage:
  node scripts/ai-helper.js <command> [options]

Examples:
  node scripts/ai-helper.js component card
  node scripts/ai-helper.js check BeritaController.php
  node scripts/ai-helper.js debug mobile
  node scripts/ai-helper.js migrate create_categories_table
        `);
    }

    checkComponent(componentName) {
        console.log(`🔍 Checking component: ${componentName}`);
        console.log(`
🛠️ MCP Tool Commands to Run:

# 1. Cek di shadcn-ui
mcp_shadcn-ui_get_component_details("${componentName}")

# 2. Cari similar components
mcp_shadcn-ui_search_components("${componentName}")

# 3. Cek icon yang relevan
mcp_hugeicons_search_icons("${componentName}")

# 4. Get examples if available
mcp_shadcn-ui_get_component_examples("${componentName}")

📝 Implementation Checklist:
[ ] Component exists in shadcn-ui?
[ ] Already installed in project?
[ ] Need custom styling?
[ ] Accessibility requirements met?

⚡ Quick Install (if exists):
npx shadcn-ui@latest add ${componentName}
        `);
    }

    checkFile(filePath) {
        console.log(`📁 Checking file: ${filePath}`);
        console.log(`
🔍 AI Rules Validation:

Backend (PHP):
- Using Service layer for business logic?
- Proper dependency injection?
- Form Request validation?
- Bilingual error messages?
- Consistent naming conventions?

Frontend (TSX):
- TypeScript interfaces defined?
- shadcn-ui components used?
- Responsive design implemented?
- Accessibility attributes added?
- Error handling implemented?

Database:
- Proper migrations with indexes?
- Unique constraints for deduplication?
- Foreign key relationships defined?
- Soft deletes where needed?

🚀 Next Steps:
1. Run linter: ./vendor/bin/pint or npm run lint
2. Run tests: composer run test or npm run test
3. Check manual functionality
4. Validate on mobile devices
        `);
    }

    debugMobile() {
        console.log(`
🐛 Mobile Debugging Protocol:

🛠️ MCP Tools to Use:

# 1. Take screenshot for visual inspection
mcp_chrome-devtools_take_screenshot("fullpage")

# 2. Check network requests and caching
mcp_chrome-devtools_list_network_requests()

# 3. Analyze asset loading
mcp_next-devtools_browser_eval("start", "chrome", true, "http://localhost:3000")

🔍 Common Issues & Solutions:

1. **Asset Not Updating**:
   - Check Cache-Control headers
   - Verify asset versioning in vite.config.js
   - Clear browser cache

2. **Styles Not Applied**:
   - Validate CSS bundle loading
   - Check Tailwind CSS compilation
   - Inspect mobile viewport settings

3. **JavaScript Errors**:
   - Check browser console
   - Validate TypeScript compilation
   - Review React component lifecycle

4. **Performance Issues**:
   - Analyze bundle size
   - Check for memory leaks
   - Optimize images and assets

🚀 Quick Fixes:
npm run build:prod
php artisan view:clear
php artisan config:clear
        `);
    }

    validateMigration(migrationName) {
        console.log(`
🗄️ Migration Validation: ${migrationName}

📝 Best Practices Checklist:

Schema Design:
[ ] UUID primary keys for new tables?
[ ] Proper foreign key constraints?
[ ] Unique indexes for natural keys?
[ ] Timestamps (created_at, updated_at)?
[ ] Soft deletes if needed (deleted_at)?

Naming Conventions:
[ ] Table names: plural, snake_case
[ ] Column names: snake_case
[ ] Foreign keys: {table}_id
[ ] Indexes: idx_{table}_{column}

Performance:
[ ] Indexes for frequently queried columns?
[ ] Composite indexes for complex queries?
[ ] Proper column types and lengths?
[ ] Not null constraints where applicable?

Example Migration:
```php
Schema::create('categories', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->string('name');
    $table->string('slug')->unique();
    $table->text('description')->nullable();
    $table->boolean('is_active')->default(true);
    $table->timestamps();
    $table->softDeletes();

    // Indexes
    $table->index(['is_active', 'created_at']);
});
```

🚀 Commands:
php artisan make:migration create_${migrationName}_table
php artisan migrate
php artisan db:seed
        `);
    }

    runCommand(command, ...args) {
        switch (command) {
            case 'help':
                this.showHelp();
                break;
            case 'component':
                this.checkComponent(args[0] || 'card');
                break;
            case 'check':
                this.checkFile(args[0] || 'app/Http/Controllers');
                break;
            case 'debug':
                this.debugMobile();
                break;
            case 'migrate':
                this.validateMigration(args[0] || 'table_name');
                break;
            case 'validate':
                console.log(`
✅ AI Rules Validation Mode:

🔍 Running comprehensive checks...

Backend Standards:
- Laravel Pint code style
- Proper Service layer usage
- Form Request validation
- Bilingual error messages

Frontend Standards:
- TypeScript strict mode
- shadcn-ui component usage
- Responsive design
- Accessibility compliance

Database Standards:
- UUID primary keys
- Unique constraints
- Proper indexing
- Migration best practices

🚀 Auto-fix Commands:
./vendor/bin/pint --fix          # Fix PHP style
npm run lint --fix               # Fix JS/TS style
php artisan optimize:clear       # Clear all caches
npm run build                    # Rebuild assets

📊 Quality Metrics:
- Test coverage: Run composer run test && npm run test
- Bundle size: Check npm run analyze (if available)
- Performance: Test with Lighthouse CI
                `);
                break;
            default:
                console.error(`❌ Unknown command: ${command}`);
                this.showHelp();
                process.exit(1);
        }
    }
}

// CLI Handler
const [,, command, ...args] = process.argv;
const helper = new AIHelper();

if (!command || command === 'help') {
    helper.showHelp();
    process.exit(0);
}

helper.runCommand(command, ...args);