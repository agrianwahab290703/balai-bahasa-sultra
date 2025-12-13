# 🤖 AI Rules untuk Balai Bahasa Sulawesi Tenggara

## 📖 Panduan Lengkap Penggunaan AI Rules

### 🎯 Apa ini?
Dokumen ini mendefinisikan aturan perilaku AI yang deterministik dan terukur untuk pengembangan aplikasi web Balai Bahasa Sulawesi Tenggara. AI akan mengikuti rules ini secara konsisten dalam setiap interaksi.

### 🚀 Quick Start

#### 1. Menjalankan AI Helper
```bash
# Lihat semua command yang tersedia
npm run ai:help

# Cek komponen sebelum membuat custom
npm run ai:component card

# Debug issue mobile/desktop
npm run ai:debug

# Validasi implementasi
npm run ai:check

# Best practices migration
npm run ai:migrate create_categories_table
```

#### 2. Menggunakan AI Rules
```bash
# saat memberikan perintah ke AI:
"Tambahkan fitur filter berita dengan kategori, ikuti AI rules"

# AI akan otomatis:
1. Cek komponen di shadcn-ui
2. Rancang database dengan unique constraints
3. Implement dengan pattern yang sudah ditetapkan
4. Validasi mobile compatibility
5. Berikan checklist deployment
```

---

## 📋 File Structure

```
project-root/
├── .ai-rules.md              # Aturan utama AI behavior
├── AI_RULES_EXAMPLES.md      # Contoh implementasi lengkap
├── AI_RULES_README.md        # Dokumen ini (panduan pengguna)
├── scripts/
│   └── ai-helper.js          # Helper script untuk development
└── package.json              # AI commands di npm scripts
```

---

## 🛠️ MCP Tools Integration

### UI Components Development
```bash
# Query ke AI:
"Saya butuh carousel untuk galeri foto"

# AI akan menjalankan:
mcp_shadcn-ui_get_component_details("carousel")
mcp_hugeicons_search_icons("gallery, photo, image")

# Hasil: Rekomendasi komponen yang sudah ada
```

### Debugging Protocol
```bash
# Report ke AI:
"Update tidak muncul di HP"

# AI akan menjalankan:
mcp_chrome-devtools_take_screenshot("fullpage")
mcp_chrome-devtools_list_network_requests()

# Hasil: Root cause analysis dan solution
```

### Research Tasks
```bash
# Query ke AI:
"Library PDF parsing terbaik 2025?"

# AI akan menjalankan:
mcp_exa-mcp-server_web_search_exa("PDF parsing library benchmark 2025")

# Hasil: Rekomendasi berbasis data aktual
```

---

## 🎨 Component Development Flow

### 1. Sebelum Membuat Custom Component
```bash
npm run ai:component <nama-komponen>
```

AI akan:
- ✅ Cek di shadcn-ui
- ✅ Cari icon di hugeicons
- ✅ Berikan examples jika ada
- ✅ Install command jika tersedia

### 2. Jika Tidak Ada
AI akan membuat custom component dengan:
- TypeScript interfaces
- shadcn-ui primitives
- Accessibility compliance
- Mobile-first responsive design
- Consistent styling patterns

---

## 🗄️ Database Design Rules

### Mandatory Patterns
```sql
-- 1. UUID Primary Keys
CREATE TABLE example (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid()
);

-- 2. Unique Constraints untuk deduplication
CREATE TABLE news (
    slug VARCHAR(255) UNIQUE NOT NULL
);

-- 3. Proper Indexes
CREATE INDEX idx_news_category_published
ON news(category_id, published_at);

-- 4. Timestamps dan Soft Deletes
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
deleted_at TIMESTAMP NULL
```

AI selalu akan:
- ✅ Gunakan UUID untuk primary keys
- ✅ Tambahkan UNIQUE constraints
- ✅ Buat indexes untuk performa
- ✅ Implement soft deletes jika perlu

---

## 📝 Code Implementation Standards

### Backend (Laravel)
```php
// Controller pattern
class ExampleController extends Controller
{
    public function __construct(
        private ExampleService $service
    ) {}

    public function index(Request $request): Response
    {
        $data = $this->service->getPaginated(
            page: $request->get('page', 1),
            filters: $request->only(['search', 'category'])
        );

        return Inertia::render('Example/Index', [
            'data' => $data,
            'filters' => $request->only(['search', 'category'])
        ]);
    }
}

// Service layer untuk business logic
class ExampleService
{
    public function create(array $data): Model
    {
        DB::beginTransaction();
        try {
            $model = Model::create($data);
            // Business logic here
            DB::commit();
            return $model;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
```

### Frontend (React/TypeScript)
```tsx
// Component structure
const ExampleComponent: React.FC<ExampleProps> = ({ data }) => {
    const [state, setState] = useState<Type>();

    // Event handlers
    const handleClick = useCallback(() => {
        // Logic
    }, []);

    return (
        <>
            <Head title="Page Title" />
            <main className="container mx-auto px-4">
                {/* JSX dengan shadcn-ui components */}
            </main>
        </>
    );
};

export default ExampleComponent;
```

---

## 🔄 Request Response Format

Setiap AI response akan mengikuti format:

### 1. MCP Tool Usage Log
```
🛠️ MCP Tool Usage Log:
- Mengambil komponen 'Card' dari shadcn-ui...
- Mencari referensi via Exa...
- Analisis asset dengan chrome-devtools...
```

### 2. Arsitektur Analysis
```
📐 Analisis Arsitektur:
- Approach: Component-first dengan shadcn-ui
- Pattern: Controller → Service → Model
- Integration: Inertia.js teroptimasi
```

### 3. Implementation Details
```
🎨 UI/UX Specification:
- Components: Card, Button, Badge (shadcn-ui)
- Icons: HomeIcon, SearchIcon (hugeicons)

⚙️ Backend Logic:
- Endpoint: GET/POST /api/resource
- Validation: Laravel Form Request
- Response: JSON API standard

🚀 Deployment Checklist:
- [ ] Migration applied
- [ ] Assets versioned
- [ ] Cache cleared
```

---

## 🧪 Testing & Validation

### Automated Checks
```bash
# Code style
./vendor/bin/pint
npm run lint

# Tests
composer run test
npm run test

# AI validation
npm run ai:validate
```

### Manual Checklist
- [ ] Functionality works as expected
- [ ] Responsive on mobile/tablet/desktop
- [ ] Accessibility with screen reader
- [ ] Form validation proper
- [ ] Error handling user-friendly
- [ ] Loading states implemented
- [ ] Console errors none

---

## 🐛 Common Issues & Solutions

### Mobile Sync Issues
```bash
npm run ai:debug
```
AI akan:
1. Check cache headers
2. Analyze asset versioning
3. Inspect service worker
4. Provide solution steps

### Component Implementation
```bash
npm run ai:component <nama>
```
AI akan:
1. Cek shadcn-ui availability
2. Provide implementation
3. Show examples
4. Install command if exists

### Performance Issues
AI akan menganalisis:
- Database queries dengan proper indexing
- Frontend bundle optimization
- Caching strategies
- Mobile performance metrics

---

## 📞 Getting Help

### AI Commands
```bash
npm run ai:help        # Show all commands
npm run ai:check       # Validate implementation
npm run ai:debug       # Debug mobile issues
npm run ai:validate    # Comprehensive check
```

### Direct AI Queries
Gunakan format ini untuk hasil terbaik:
```
"[Task description] dengan mengikuti AI rules.
Fokus pada [specific aspect] dan pastikan [requirement]."
```

Examples:
- "Tambah fitur search berita dengan AI rules compliance"
- "Debug form validation error dengan protocol AI"
- "Optimize performance untuk mobile loading"

### MCP Tool References
- `shadcn-ui` → UI components
- `hugeicons` → Icon library
- `exa-mcp-server` → Web search
- `chrome-devtools` → Debugging
- `context7` → Documentation
- `firecrawl-mcp` → Web scraping

---

## 🎯 Success Metrics

AI Rules dianggap berhasil jika:
- ✅ Code konsisten dengan patterns
- ✅ Mobile/Desktop synchronized
- ✅ Zero duplicate data di database
- ✅ Components menggunakan library standar
- ✅ Accessibility compliance terpenuhi
- ✅ Performance optimal
- ✅ Security best practices

---

## 📚 Additional Resources

- [Laravel Documentation](https://laravel.com/docs)
- [React Documentation](https://react.dev)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

*Dokumen ini update terakhir: 12 December 2024*
*Maintainer: AI Assistant untuk Balai Bahasa Sulawesi Tenggara*