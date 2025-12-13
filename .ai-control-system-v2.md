# 🎮 Sistem Kontrol AI Deterministik V2

## 🎯 Tujuan
Mengontrol perilaku AI secara deterministik dan terukur dengan input/output spesifik menggunakan MCP tools yang telah terinstall. Sistem ini memastikan optimalisasi penggunaan tools yang tersedia.

## 📰 KONTEKS BERITA TERKINI: HAKORDIA 2025
**Tanggal:** 10 Desember 2025 | **Kategori:** Siaran Pers Nasional | **Nomor:** 879/sipers/A6/XII/2025

### 🏆 Penghargaan ZI WBK/WBBM Kemendikdasmen 2025
- **Tema Hari:** Hari Antikorupsi Sedunia (Hakordia) 2025 - *"Satukan Aksi Basmi Korupsi"*
- **Total Unit Kerja:** 62 unit diusulkan, 48 unit berhasil (77.4%)
- **Capaian WBK:** 34 unit (54.8%) - Peningkatan 65.25% dari tahun lalu
- **Capaian WBBM:** 14 unit (22.6%)
- **Tokoh Kunci:**
  - Wamendikdasmen: **Atip Latipulhayat** (Strategi integritas birokrasi)
  - Plh. Sekjen: **Abdullah Faqih** (Laporan pelaksanaan ZI)

### 📊 Proses Penilaian
- **Periode:** Januari - Mei 2025
- **Metode:** Dash evaluation + Visitasi lapangan
- **Kolaborasi:** Setjen, Pimpinan Unit Utama, Inspektorat Jenderal
- **Fokus:** Kepatuhan administratif + Implementasi budaya kerja

### 💡 Pesan Kunci Leadership
*"Pemberantasan dan pencegahan korupsi adalah fondasi utama untuk mewujudkan Indonesia maju serta bangsa yang berdaulat, adil, dan makmur."* - **Wamendikdasmen Atip Latipulhayat**

*"Masyarakat memiliki hak untuk mengetahui, hak untuk didengar, dan hak untuk dilayani oleh negara. Pelayanan publik pada hakikatnya adalah proses memanusiakan manusia."*

---

## 🔧 PARAMETER KONTROL

### 1. Skema Validasi Input
```typescript
interface InputTugasAI {
    // FIELD WAJIB
    jenis_tugas: 'fitur' | 'perbaikan_bug' | 'optimasi' | 'refaktor' | 'riset' | 'debug';
    prioritas: 'rendah' | 'sedang' | 'tinggi' | 'kritis';
    lingkup: 'frontend' | 'backend' | 'fullstack' | 'database' | 'infrastruktur';

    // SPESIFIK TUGAS
    area_target: string;          // contoh: "berita-controller", "form-ppid"
    deskripsi: string;            // Deskripsi dalam bahasa Indonesia
    kebutuhan?: string[];         // Array kebutuhan spesifik
    kendala?: string[];           // Batasan dan kendala

    // KONTROL KONTEKS
    level_konteks: 'minimal' | 'standar' | 'komprehensif';
    ikuti_ai_rules: boolean;      // Default: true
    format_output: 'standar' | 'detail' | 'minimal';

    // KONTROL RANTAI
    rantai_dengan_sebelumnya?: boolean;
    id_konteks_sebelumnya?: string;

    // VALIDASI
    kepercayaan_user: number;     // Skala 1-10
    kompleksitas_diharapkan: number; // Skala 1-10
}

interface ResponsAI {
    // METADATA
    id_tugas: string;
    waktu_eksekusi: number;
    skor_kepercayaan: number;

    // STATUS VALIDASI
    validasi_input: 'lulus' | 'gagal' | 'parsial';
    kebutuhan_terpenuhi: boolean;
    kendala_dihormati: boolean;

    // RESPONS AKTUAL
    mcp_tools_digunakan: string[];
    analisis: AnalisisArsitektur;
    implementasi: Implementasi;
    validasi: DaftarPeriksaValidasi;

    // PERBAIKAN
    prompt_optimal: PromptOptimal;
    saran_selanjutnya: SaranLangkahSelanjutnya[];
}
```

---

## 🛠️ MCP TOOLS YANG TERSEDIA (VERIFIED)

### 1. UI Components (shadcn-ui + Hugeicons)
```bash
# ✅ Komponen shadcn-ui (76+ tersedia)
mcp_shadcn_ui_list_shadcn_components()           # Daftar semua komponen
mcp_shadcn_ui_get_component_details("nama_komponen")  # Detail komponen
mcp_shadcn_ui_search_components("kata_kunci")         # Cari komponen
mcp_shadcn_ui_get_component_examples("nama_komponen")  # Contoh penggunaan

# ✅ Icons Hugeicons (7350+ tersedia)
mcp_hugeicons_list_icons()                             # Daftar semua icon
mcp_hugeicons_search_icons("home, search, menu")        # Cari icon
mcp_hugeicons_get_platform_usage("react")              # Platform usage
mcp_hugeicons_get_icon_glyphs("home-01")               # Glyph icon
mcp_hugeicons_get_icon_glyph_by_style("home-01", "solid-rounded")
```

### 2. Dokumentasi & Riset (Context7 + Web Search)
```bash
# ✅ Dokumentasi Context7 (Laravel focus)
mcp_context7_resolve_library_id("laravel")             # Cari library ID
mcp_context7_get_library_docs("/websites/laravel_12_x", "code")  # Get docs
mcp_context7_get_library_docs("/laravel/laravel", "info")        # Get guides

# ✅ Web Research
mcp_exa_mcp_server_web_search_exa("Laravel 12 fitur 2025", 8, "deep")
mcp_firecrawl_mcp_firecrawl_search("website pemerintah best practices")
mcp_firecrawl_mcp_firecrawl_scrape("https://example.com", ["markdown"])
mcp_firecrawl_mcp_firecrawl_crawl("https://website.com", 10)

# ✅ Ref Documentation
mcp_Ref_ref_search_documentation("Laravel Inertia.js patterns")
mcp_Ref_ref_read_url("https://laravel.com/docs")
```

### 3. Debugging & Analisis Visual
```bash
# ✅ Browser Automation (Chrome DevTools)
mcp_chrome_devtools_list_pages()                         # Daftar tab
mcp_chrome_devtools_take_screenshot("fullpage", "png", 100, "", true)
mcp_chrome_devtools_list_network_requests(50, "xhr,fetch")
mcp_chrome_devtools_evaluate_script("() => document.title")
mcp_chrome_devtools_click("uid-123")
mcp_chrome_devtools_fill("uid-456", "input value")

# ✅ Visual Analysis
mcp_zai_mcp_server_analyze_image("screenshot.png", "Identifikasi layout UI dan masalah aksesibilitas")
mcp_zai_mcp_server_analyze_video("demo-video.mp4", "Analisis pola interaksi user")

# ✅ Next.js Tools
mcp_next_devtools_browser_eval("start", "chrome", true, "http://localhost:3000")
mcp_next_devtools_enable_cache_components("path/to/project")
```

---

## 🔄 PROTOCOL PENGGUNAAN MCP

### 1. Prioritas Tools Berdasarkan Jenis Tugas

#### 🏛️ Content & News Management (Fokus: Berita ZI WBK/WBBM)
```bash
Priority 1: Web Research + Documentation
- Riset konten: mcp_firecrawl_mcp_firecrawl_search()
- Dokumen analysis: mcp_zai_mcp_server_analyze_image()
- Cari referensi: mcp_exa_mcp_server_web_search_exa()

Contoh implementasi:
"Update berita ZI WBK 2025" →
1. Firecrawl search untuk data terbaru
2. Web research untuk verifikasi
3. Image analysis untuk dokumen PDF
```

#### 🎨 UI/UX Development
```bash
Priority 2: shadcn-ui + hugeicons (setelah konten valid)
- Cek komponen: mcp_shadcn_ui_get_component_details()
- Cari icon: mcp_hugeicons_search_icons()
- Contoh kode: mcp_shadcn_ui_get_component_examples()

Contoh implementasi:
"Membuat form kontak" →
1. Cek "form" di shadcn-ui
2. Cari icon "mail, phone" di hugeicons
3. Get examples untuk best practices
```

#### 📚 Riset & Dokumentasi
```bash
Priority 1: Context7 (untuk Laravel) → Exa/Web Search
- Laravel docs: mcp_context7_get_library_docs("/websites/laravel_12_x")
- Web research: mcp_exa_mcp_server_web_search_exa()
- Competitor analysis: mcp_firecrawl_mcp_firecrawl_search()

Contoh implementasi:
"Mencari best practices auth Laravel 12" →
1. Context7 untuk docs resmi
2. Exa search untuk artikel terbaru
```

#### 🐛 Debugging & Testing
```bash
Priority 1: Chrome DevTools → Visual Analysis
- Screenshot: mcp_chrome_devtools_take_screenshot()
- Network: mcp_chrome_devtools_list_network_requests()
- Image analysis: mcp_zai_mcp_server_analyze_image()

Contoh implementasi:
"Mobile sync issues" →
1. Screenshot mobile view
2. Check network headers
3. Analyze visual layout problems
```

---

## 📋 TEMPLATE PROMPT OPTIMASI

### Template Standar dengan MCP Integration
```yaml
prompt_template:
  jenis_tugas: "[fitur/perbaikan_bug/optimasi]"
  prioritas: "[rendah/sedang/tinggi/kritis]"
  lingkup: "[frontend/backend/fullstack]"
  area_target: "[spesifik komponen/controller]"
  deskripsi: "[deskripsi jelas dalam bahasa Indonesia]"

  kebutuhan:
    - gunakan_komponen_shadcn: true
    - gunakan_icon_hugeicons: true
    - gunakan_dokumentasi_context7: true
    - validasi_mobile: true
    - bilingual_support: true

  kendala:
    - hanya_gunakan_stack_existing: true
    - ikuti_pattern_proyek: true
    - mobile_first: true

# MCP Tools Auto-Selection:
- Jika membutuhkan UI: shadcn-ui + hugeicons
- Jika butuh docs Laravel: context7
- Jika riset terkini: exa-mcp-server
- Jika debug visual: chrome-devtools + zai-mcp-server
```

---

## ⚡ WORKFLOW EKSEKUSI

### Step 1: Validasi & Optimasi Input
```typescript
function validasiInput(input: InputTugasAI): HasilValidasi {
    // 1. Cek field wajib
    const fieldWajib = ['jenis_tugas', 'prioritas', 'lingkup', 'area_target', 'deskripsi'];

    // 2. Deteksi MCP tools yang dibutuhkan
    const toolsDibutuhkan = deteksiTools(input);

    // 3. Optimasi prompt
    const promptOptimal = optimasiPrompt(input);

    return {
        valid: fieldWajib.every(field => input[field]),
        tools_rekomendasi: toolsDibutuhkan,
        prompt_ditingkatkan: promptOptimal
    };
}
```

### Step 2: Eksekusi dengan MCP Tools
```typescript
async function eksekusiTugas(input: InputTugasAI): ResponsAI {
    const toolsDigunakan = [];

    // UI Components
    if (input.lingkup === 'frontend' || input.lingkup === 'fullstack') {
        toolsDigunakan.push(
            await mcp_shadcn_ui_search_components(input.area_target),
            await mcp_hugeicons_search_icons(input.area_target)
        );
    }

    // Documentation
    if (input.level_konteks === 'komprehensif') {
        toolsDigunakan.push(
            await mcp_context7_get_library_docs("/websites/laravel_12_x", "code")
        );
    }

    // Research jika needed
    if (input.jenis_tugas === 'riset') {
        toolsDigunakan.push(
            await mcp_exa_mcp_server_web_search_exa(input.deskripsi, 5, "fast")
        );
    }

    return generateRespons(input, toolsDigunakan);
}
```

### Step 3: Validasi Output
```typescript
function validasiOutput(respons: ResponsAI): SkorKualitas {
    return {
        kelengkapan: cekHolyTrinity(respons.implementasi),
        penggunaan_mcp: validasiTools(respons.mcp_tools_digunakan),
        kualitas_kode: cekCodingStandards(respons.implementasi),
        aksesibilitas: validasiA11y(respons.implementasi.ui_specification),
        performa: analisisPerforma(respons.implementasi)
    };
}
```

---

## 📊 METRIK KEBERHASILAN

### MCP Tools Utilization
```yaml
target_utilization:
  shadcn_ui: 90%+ dari kebutuhan UI
  hugeicons: 85%+ dari kebutuhan icon
  context7: 80%+ dari kebutuhan docs Laravel
  exa_search: 70%+ dari kebutuhan riset
  chrome_devtools: 95%+ dari debugging task

success_indicators:
  prompt_optimization_rate: > 80%
  task_completion_rate: > 90%
  user_satisfaction: > 85%
  error_reduction: > 60%
```

### Quality Gates
```typescript
interface QualityGates {
    mcp_utilization: {
        minimum_tools_used: 2;
        relevant_tools_ratio: 0.8;
        tool_success_rate: 0.9;
    };

    output_quality: {
        completeness_score: 85;
        correctness_score: 90;
        consistency_score: 95;
    };

    language_compliance: {
        indonesia_communication: 100%;
        english_code_comments: 100%;
    }
}
```

---

## 🎯 CONTOH IMPLEMENTASI LENGKAP

### User Input:
```
"update berita ZI WBK/WBBM Hakordia 2025 untuk website Balai Bahasa Sultra"
```

### AI Response dengan Sistem Kontrol V2 + Konteks Berita:

```markdown
🛠️ **Log Penggunaan MCP Tools:**
- mcp_firecrawl_mcp_firecrawl_scrape("https://balaibahasasultra.kemendikdasmen.go.id/...")
- mcp_zai_mcp_server_analyze_image("KEMENDIKDASMEN APRESIASI ZI WBK.pdf")
- mcp_exa_mcp_server_web_search_exa("Hakordia 2025 ZI WBK WBBM Kemendikdasmen", 8, "deep")
- mcp_shadcn_ui_search_components("card, badge, timeline")
- mcp_hugeicons_search_icons("award, shield, checkmark")

📐 **Analisis Konten & Arsitektur:**
- **Data Valid:** 62 unit diajukan, 48 unit berhasil (77.4%)
- **Tokoh:** Wamendikdasmen Atip Latipulhayat, Plh. Sekjen Abdullah Faqih
- **Backend:** News model dengan kategori 'siaran-pers-nasional'
- **Frontend:** Timeline component dengan milestone achievements

🎨 **UI/UX Specification:**
- **Components:** Card (shadcn-ui), Badge untuk statistik, Timeline untuk proses
- **Icons:** AwardIcon, ShieldCheckIcon (hugeicons)
- **Layout:** Hero section dengan data statistik, timeline proses penilaian

⚙️ **Backend Logic:**
```php
// NewsController.php - Update existing method
public function updateZIWBKNews(Request $request): JsonResponse
{
    $validated = $request->validate([
        'total_unit' => 'required|integer',
        'wbk_count' => 'required|integer',
        'wbbm_count' => 'required|integer',
        'increase_percentage' => 'required|numeric',
        'key_figures' => 'required|array'
    ]);

    $news = News::where('slug', 'zi-wbk-wbbm-hakordia-2025')->firstOrFail();

    $news->update([
        'judul' => 'Kemendikdasmen Apresiasi Unit Kerja Berintegritas...',
        'konten' => $this->generateZIWBKContent($validated),
        'metadata' => json_encode([
            'siaran_pers_nomor' => '879/sipers/A6/XII/2025',
            'tanggal' => '2025-12-10',
            'tema_hakordia' => 'Satukan Aksi Basmi Korupsi'
        ])
    ]);

    return response()->json(['success' => true, 'data' => $news]);
}
```

🚀 **Deployment Checklist:**
- [x] Validasi data dari PDF resmi & website
- [x] Update struktur database untuk metadata berita
- [x] Implement timeline component dengan proses penilaian
- [x] Add responsive design untuk mobile view
- [x] Test integrasi dengan existing news system

💡 **Prompt Optimization untuk Next Time:**
```
Jenis Tugas: perbaikan_bug
Prioritas: kritis
Lingkup: fullstack
Area Target: zi-wbk-news-update-hakordia-2025
Kebutuhan:
- validasi_data_official: true
- metadata_siarpres: true
- responsive_timeline: true
- statistic_badges: true
- mobile_first: true
- bilingual_support: true
```

📊 **Data Integration Valid:**
- ✅ Source: PDF Kemendikdasmen resmi + website Balai Bahasa Sultra
- ✅ Statistik: 62 unit → 48 unit berhasil (65.25% increase)
- ✅ Tokoh: Atip Latipulhayat + Abdullah Faqih
- ✅ Proses: Januari-Mei 2025, Dash evaluation + Visitasi
```

---

## 🔧 KONFIGURASI RUNTIME

### Environment Variables
```bash
# AI Control System Configuration
AI_MCP_OPTIMIZATION=true
AI_STRICT_VALIDATION=true
AI_INDONESIA_COMMUNICATION=true
AI_CODE_COMMENTS_ENGLISH=true
AI_MCP_UTILIZATION_TARGET=90

# Content Validation (NEW)
AI_NEWS_VALIDATION_REQUIRED=true
AI_OFFICIAL_SOURCE_VERIFICATION=true
AI_ZI_WBK_DATA_VALIDATION=true
AI_HAKORDIA_2025_CONTEXT=true
```

### Runtime Settings
```javascript
const aiControlConfig = {
    // MCP Tools Optimization
    mcpOptimization: 'aggressive',
    preferExistingComponents: true,
    toolSelectionStrategy: 'smart',

    // Quality Control
    strictValidation: true,
    minimumMCPScore: 85,
    requireIndonesianCommunication: true,

    // Performance
    toolTimeout: 10000, // 10 seconds
    maxConcurrentTools: 3,
    cacheToolResults: true,

    // News & Content Validation (NEW)
    contentValidation: {
        requireOfficialSources: true,
        validateZIWBKData: true,
        checkHakordiaContext: true,
        verifyKeyFigures: true,
        crossReferencePDF: true
    },

    // Data Sources Priority
    dataSources: [
        'official_kemdikdasmen_pdf',
        'balaibahasasultra_website',
        'siaran_pers_resmi',
        'government_news_portal'
    ]
};
```

### Content Validation Rules (NEW)
```yaml
zi_wbk_validation_rules:
  required_fields:
    - total_unit_kerja: integer
    - wbk_count: integer
    - wbbm_count: integer
    - increase_percentage: numeric
    - key_figures: array
    - evaluation_period: string

  verification_sources:
    - kemendikdasmen_official_pdf
    - balaibahasasultra_website
    - siaran_pers_nomor: "879/sipers/A6/XII/2025"

  data_consistency:
    wbk_percentage: "54.8%"
    wbbm_percentage: "22.6%"
    total_success_rate: "77.4%"
    year_over_year_increase: "65.25%"
```

---

*Sistem kontrol V2 ini memastikan penggunaan optimal MCP tools yang terinstall dengan validasi input/output yang ketat dan bahasa Indonesia sebagai primary communication.*