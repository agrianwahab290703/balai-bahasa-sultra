// Berita Types
export interface BeritaDetail {
    id: number;
    judul_utama: string;
    slug: string;
    ringkasan_inti: string;
    hero_image: string;
    hero_image_alt: string;
    lokasi: string;
    tanggal_rilis: string;
    teras_berita: string;
    konteks_latar_belakang: string;
    quote_pejabat: string;
    nama_pejabat: string;
    jabatan_pejabat: string;
    data_capaian_kinerja: string;
    statistik_kinerja: Record<string, number | string | object>;
    mekanisme_penilaian: string;
    kesimpulan_komitmen: string;
    kategori: string;
    sub_kategori: string;
    tag: string;
    is_published: boolean;
    is_featured: boolean;
    view_count: number;
    author: string;
    sumber_rilis: string;
    created_at: string;
    updated_at: string;
    og_image?: string;
    reading_time?: number;
    time_ago?: string;
}

export interface GaleriFoto {
    id: number;
    berita_id: number;
    file_path: string;
    file_name: string;
    caption?: string;
    alt_text?: string;
    urutan: number;
    tipe: 'hero' | 'gallery' | 'thumbnail';
}

export interface BeritaList {
    id: number;
    judul_utama: string;
    slug: string;
    ringkasan_inti: string;
    hero_image?: string;
    kategori: string;
    tanggal_rilis: string;
    view_count: number;
    time_ago: string;
    is_featured?: boolean;
    reading_time?: number;
}

export interface BeritaIndex {
    data: BeritaList[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    next_page_url?: string;
    prev_page_url?: string;
}

export interface BeritaFilters {
    search?: string;
    category?: string;
    page?: number;
    per_page?: number;
}

export interface BeritaCategory {
    name: string;
    display_name: string;
    count: number;
}

export interface BeritaStatistics {
    total: number;
    published: number;
    featured: number;
    total_views: number;
    categories: Record<string, BeritaCategory>;
}

export interface BeritaApiResponse {
    data: BeritaList[] | BeritaDetail | BeritaStatistics;
    pagination?: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        next_page_url?: string;
        prev_page_url?: string;
    };
    message?: string;
}

// Component Props Types
export interface BeritaShowProps {
    berita: BeritaDetail;
    galeri: GaleriFoto[];
    beritaTerkait: BeritaList[];
}

export interface BeritaIndexProps {
    berita: BeritaIndex;
    featuredNews: BeritaList[];
    popularNews: BeritaList[];
    categories: Record<string, BeritaCategory>;
    filters: BeritaFilters;
}

// Form Types
export interface BeritaSearchForm {
    query: string;
    category: string;
}

export interface BeritaFilterOptions {
    categories: BeritaCategory[];
    sortBy: 'latest' | 'popular' | 'oldest';
    perPage: 6 | 9 | 12 | 18;
}

// API Response Types
export interface ApiResponse<T = any> {
    success: boolean;
    data: T;
    message?: string;
    errors?: Record<string, string[]>;
}

export interface PaginationLinks {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
}

export interface MetaPagination {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
}

// Utility Types
export type BeritaStatus = 'published' | 'draft' | 'archived';
export type BeritaSortBy = 'created_at' | 'view_count' | 'judul_utama' | 'updated_at';
export type SortOrder = 'asc' | 'desc';

// Context Types for React
export interface BeritaContextType {
    berita: BeritaList[];
    loading: boolean;
    error: string | null;
    filters: BeritaFilters;
    categories: Record<string, BeritaCategory>;
    statistics: BeritaStatistics;
    searchBerita: (query: string) => Promise<void>;
    loadBerita: (page?: number, filters?: BeritaFilters) => Promise<void>;
    setFilters: (filters: Partial<BeritaFilters>) => void;
    refreshBerita: () => Promise<void>;
}

// Hook Return Types
export interface UseBeritaReturn {
    berita: BeritaList[];
    loading: boolean;
    error: string | null;
    pagination: BeritaIndex;
    hasMore: boolean;
    loadMore: () => Promise<void>;
    refresh: () => Promise<void>;
}

export interface UseBeritaDetailReturn {
    berita: BeritaDetail | null;
    galeri: GaleriFoto[];
    loading: boolean;
    error: string | null;
    incrementView: (id: number) => Promise<void>;
}

// Event Types
export interface BeritaViewEvent {
    berita_id: number;
    timestamp: string;
    user_agent?: string;
    ip_address?: string;
}

export interface BeritaShareEvent {
    berita_id: number;
    platform: 'facebook' | 'twitter' | 'whatsapp' | 'telegram' | 'link';
    timestamp: string;
}

// Validation Types
export interface BeritaValidationRules {
    judul_utama: {
        required: boolean;
        max: number;
        min: number;
    };
    ringkasan_inti: {
        required: boolean;
        max: number;
    };
    hero_image: {
        required: boolean;
        mimes: string[];
        max: number; // in KB
    };
    konteks_latar_belakang: {
        required: boolean;
    };
    quote_pejabat: {
        required: boolean;
    };
}

// Error Types
export interface BeritaError {
    code: string;
    message: string;
    details?: Record<string, any>;
}

// SEO Types
export interface BeritaSEO {
    title: string;
    description: string;
    keywords: string[];
    og_image: string;
    canonical_url: string;
    structured_data: {
        '@context': string;
        '@type': string;
        headline: string;
        image: string[];
        datePublished: string;
        dateModified: string;
        author: {
            '@type': string;
            name: string;
        };
        publisher: {
            '@type': string;
            name: string;
        };
    };
}