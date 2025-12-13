# Contoh Implementasi AI Rules

## 📝 Contoh 1: Membuat Fitur Berita Baru

User request: "Saya ingin menambahkan fitur kategori berita dengan filtering"

### 🛠️ MCP Tool Usage Log:
- Mengambil komponen 'Select' dan 'Badge' dari shadcn-ui
- Mencari referensi Laravel filter patterns via Context7
- Analisis struktur tabel database yang ada

### 📐 Analisis Arsitektur:
- Approach: Tambahkan kategori sebagai many-to-many relationship
- Pattern: Existing News model → Category model (baru) → news_category pivot table
- Integration: Filter di controller dengan query parameters

### 🗄️ Database Schema:
```sql
-- Migration baru
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE news_category (
    news_id UUID REFERENCES news(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (news_id, category_id)
);
```

### 🎨 UI/UX Specification:
- Components: Select (shadcn-ui), Badge (shadcn-ui)
- Icons: FilterIcon, TagIcon (hugeicons)
- Layout: Filter dropdown di header Berita page
- Accessibility: Label htmlFor dan aria-describedby

### ⚙️ Backend Logic:
```php
// routes/web.php
Route::get('/berita', [BeritaController::class, 'index'])
    ->name('berita.index');

// BeritaController.php
public function index(Request $request): Response
{
    $berita = $this->beritaService->getFilteredNews(
        category: $request->get('category'),
        search: $request->get('search'),
        perPage: 10
    );

    return Inertia::render('Public/Berita/Index', [
        'berita' => $berita,
        'categories' => Category::all(),
        'filters' => $request->only(['category', 'search'])
    ]);
}
```

### 🚀 Deployment & Cache Checklist:
- [ ] Migration for categories table
- [ ] Update News model with relationships
- [ ] Clear route cache: `php artisan route:clear`
- [ ] Test filtering functionality

---

## 📝 Contoh 2: Debugging Mobile Sync Issue

User report: "Update berita tidak muncul di mobile setelah 1 jam"

### 🛠️ MCP Tool Usage Log:
- Menggunakan chrome-devtools untuk inspect cache headers
- Analisis asset versioning dengan next-devtools
- Cek Service Worker status

### 🔍 Debugging Steps:
1. **Cache Headers Analysis**:
```javascript
// chrome-devtools output
Cache-Control: max-age=31536000, immutable
ETag: "v1.2.3-abc123"
```
2. **Asset Versioning Check**:
```javascript
// vite.config.js
export default defineConfig({
    build: {
        rollupOptions: {
            output: {
                entryFileNames: `assets/[name].[hash].js`,
                chunkFileNames: `assets/[name].[hash].js`
            }
        }
    }
});
```

### 🎯 Root Cause:
- Static assets cached terlalu lama (1 tahun)
- Tidak ada cache busting untuk content updates

### ✅ Solution:
1. Update cache headers untuk dynamic content:
```php
// routes/web.php
Route::middleware('cache.headers:public,max-age=300,no-store')
    ->get('/berita', [BeritaController::class, 'index']);
```

2. Implement cache invalidation:
```php
// NewsService.php
public function createNews(array $data): News
{
    $news = News::create($data);

    // Clear relevant caches
    Cache::tags(['news'])->flush();

    return $news;
}
```

---

## 📝 Contoh 3: Riset Library Baru

User question: "Library apa yang terbaik untuk form validation di React 2025?"

### 🛠️ MCP Tool Usage Log:
- Web search via Exa untuk benchmark terbaru
- Cross-check dengan multiple sources
- Analisis GitHub stars dan maintenance

### 📊 Research Results:

#### React Hook Form (Winner)
- ⭐ 35k+ stars, active maintenance
- 🚀 Performa terbaik (minimal re-renders)
- 📦 Ukuran kecil (25KB gzipped)
- 🔗 Integrasi sempurna dengan Zod

#### Formik (Alternative)
- ⭐ 32k+ stars, stable
- 📚 Dokumentasi lengkap
- 🐢 Performa lebih lambat
- 📦 Ukuran lebih besar (44KB gzipped)

### 💡 Rekomendasi:
Tetap gunakan React Hook Form yang sudah ada di project, dengan tips:
- Gunakan `useForm` dengan proper default values
- Implement resolver Zod untuk type safety
- Manfaatkan `Controller` component untuk complex forms

---

## 📝 Contoh 4: Component dari shadcn-ui

User request: "Saya butuh accordion untuk FAQ PPID"

### 🛠️ MCP Tool Usage Log:
- Mengambil detail komponen 'Accordion' dari shadcn-ui
- Mendapatkan examples untuk implementasi
- Cek icon 'ChevronDown' di hugeicons

### 🎨 Implementation:

#### 1. Install Component (jika belum ada):
```bash
npx shadcn-ui@latest add accordion
```

#### 2. Component Usage:
```tsx
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/Components/ui/accordion";
import { ChevronDownIcon } from "hugeicons-react";

const PpidFaq = () => {
    const faqs = [
        {
            question: "Bagaimana cara mengajukan permohonan informasi?",
            answer: "Anda dapat mengajukan permohonan melalui formulir online..."
        }
    ];

    return (
        <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                        {faq.question}
                    </AccordionTrigger>
                    <AccordionContent>
                        {faq.answer}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
};
```

### 🚀 Best Practices:
- Gunakan semantic HTML (h2 untuk accordion headers)
- Tambahkan keyboard navigation support
- Implement smooth animations dengan Framer Motion
- Test accessibility dengan screen reader

---

## 📝 Contoh 5: Error Handling Pattern

User report: "Form PPID error tanpa pesan jelas"

### 🔍 Pattern Analysis:

#### Current Problem:
```tsx
// ❌ Tanpa proper error handling
const submitForm = async (data) => {
    await fetch('/api/ppid', { method: 'POST', body: data });
};
```

#### Fixed Implementation:
```tsx
// ✅ Dengan comprehensive error handling
const submitForm = async (data: FormDataType) => {
    try {
        const response = await fetch('/api/ppid/permohonan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();

            // Handle validation errors (422)
            if (response.status === 422) {
                setError('root', {
                    type: 'validation',
                    message: errorData.message || 'Data tidak valid'
                });

                // Set field errors
                Object.entries(errorData.errors || {}).forEach(([field, messages]) => {
                    setError(field, {
                        type: 'validation',
                        message: Array.isArray(messages) ? messages[0] : messages
                    });
                });

                return;
            }

            // Handle other errors
            throw new Error(errorData.message || 'Terjadi kesalahan server');
        }

        const result = await response.json();

        // Success handling
        toast.success('Permohonan berhasil dikirim!');
        router.visit('/ppid/permohonan/success', {
            data: { id: result.data.id }
        });

    } catch (error) {
        console.error('Submit error:', error);

        // User-friendly error message
        toast.error(
            error.message || 'Gagal mengirim permohonan. Silakan coba lagi.'
        );

        // Set form error
        setError('root', {
            type: 'server',
            message: error.message
        });
    }
};
```

### 🎯 Key Improvements:
1. **Bilingual error messages**
2. **Field-level validation errors**
3. **Proper CSRF token handling**
4. **User-friendly toast notifications**
5. **Fallback error messages**
6. **Error logging untuk debugging**

---

## 📝 Quick Reference Commands

### MCP Tools Usage:
```bash
# 1. Cek komponen sebelum buat custom
mcp_shadcn-ui_get_component_details("nama-komponen")

# 2. Cari icon yang tepat
mcp_hugeicons_search_icons("search, menu, close")

# 3. Riset library terbaru
mcp_exa-mcp-server_web_search_exa("react library name 2025")

# 4. Debug mobile issues
mcp_chrome-devtools_take_screenshot("fullpage")

# 5. Dokumentasi Laravel
mcp_context7_get-library-docs("/laravel/laravel", "code")
```

### Development Workflow:
```bash
# 1. Start development
composer run dev

# 2. Check code style
./vendor/bin/pint
npm run lint

# 3. Run tests
composer run test
npm run test

# 4. Build for production
npm run build:prod

# 5. Clear caches
php artisan optimize:clear
```