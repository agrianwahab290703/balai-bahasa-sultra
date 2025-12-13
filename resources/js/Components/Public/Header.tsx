import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/Components/ui/sheet';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { Menu, ChevronDown, ChevronRight, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

// Menu items configuration
const profilItems = [
    { title: 'Sejarah', href: '/profil/sejarah' },
    { title: 'Kedudukan', href: '/profil/kedudukan' },
    { title: 'Visi & Misi', href: '/profil/visi-misi' },
    { title: 'Struktur Organisasi', href: '/profil/struktur' },
];

const informasiItems = [
    { title: 'Berita', href: '/berita' },
    { title: 'Pengumuman', href: '/pengumuman' },
];

const layananItems = [
    { title: 'Konsultasi Bahasa', href: '/layanan/konsultasi' },
    { title: 'Penyuntingan', href: '/layanan/penyuntingan' },
    { title: 'Penerjemahan', href: '/layanan/penerjemahan' },
    { title: 'Pelatihan', href: '/layanan/pelatihan' },
];

const produkItems = [
    { title: 'Publikasi', href: '/produk/publikasi' },
    { title: 'Buku', href: '/produk/buku' },
    { title: 'Jurnal', href: '/produk/jurnal' },
];

const galeriItems = [
    { title: 'Foto', href: '/galeri' },
    { title: 'Video', href: '/galeri/video' },
];

const informasiMenuItems = [
    ...informasiItems,
    ...produkItems,
    ...galeriItems,
];

// SAKIP menu items
const sakipItems = [
    { title: 'Data Dukung SAKIP', href: '/sakip/data-dukung' },
    { title: 'Laporan Kinerja', href: '/sakip/laporan-kinerja' },
    { title: 'Perjanjian Kinerja', href: '/sakip/perjanjian-kinerja' },
    { title: 'Rencana Aksi', href: '/sakip/rencana-aksi' },
    { title: 'Rencana Strategis', href: '/sakip/rencana-strategis' },
    { title: 'DIPA / RKA', href: '/sakip/dipa-rka' },
];

// Terbitan menu items with nested structure
const terbitanMenuData = [
    {
        title: 'Majalah',
        href: '#', // Parent category - tidak bisa diklik langsung, harus pilih sub-menu
        children: [
            { title: 'Pabitara', href: '/terbitan/majalah/pabitara' },
            { title: 'Glitera', href: '/terbitan/majalah/glitera' },
            { title: 'Pogsa', href: '/terbitan/majalah/pogsa' },
        ]
    },
    {
        title: 'Cerita Rakyat',
        href: '/terbitan/cerita-rakyat',
        children: []
    },
    {
        title: 'Hasil Penelitian',
        href: '/terbitan/hasil-penelitian',
        children: [
            { title: 'Bahasa', href: '/terbitan/hasil-penelitian/bahasa' },
            { title: 'Sastra', href: '/terbitan/hasil-penelitian/sastra' },
        ]
    },
    {
        title: 'Kamus',
        href: '/terbitan/kamus',
        children: []
    },
    {
        title: 'Cerita Anak',
        href: '/terbitan/cerita-anak',
        children: [
            { title: '2024', href: '/terbitan/cerita-anak/2024' }
        ]
    },
];

// ZI-WBK nested menu structure
const ziWbkMenuData = [
    {
        title: 'Manajemen Perubahan',
        href: '/zi-wbk/manajemen-perubahan',
        children: [
            { title: 'Tim Kerja', href: '/zi-wbk/manajemen-perubahan/tim-kerja' },
            { title: 'Rencana Pembangunan WBK', href: '/zi-wbk/manajemen-perubahan/rencana-pembangunan' },
            { title: 'Pemantauan dan Evaluasi Pembangunan WBK/WBBM', href: '/zi-wbk/manajemen-perubahan/pemantauan-evaluasi' },
            { title: 'Perubahan Pola Pikir dan Budaya Kerja', href: '/zi-wbk/manajemen-perubahan/perubahan-pola-pikir' },
        ]
    },
    {
        title: 'Penguatan Tata Laksana',
        href: '/zi-wbk/penguatan-tata-laksana',
        children: [
            { title: 'Keterbukaan Informasi Publik', href: '/zi-wbk/penguatan-tata-laksana/keterbukaan-informasi' },
            { title: 'Prosedur Operasional Tetap (SOP) Kegiatan Utama', href: '/zi-wbk/penguatan-tata-laksana/sop-kegiatan-utama' },
            { title: 'Sistem Pemerintahan Berbasis Elektronik (SPBE)', href: '/zi-wbk/penguatan-tata-laksana/spbe' },
        ]
    },
    {
        title: 'Manajemen SDM',
        href: '/zi-wbk/manajemen-sdm',
        children: [
            { title: 'Perencanaan Kebutuhan Pegawai Sesuai Dengan Kebutuhan Organisasi', href: '/zi-wbk/manajemen-sdm/perencanaan-kebutuhan' },
            { title: 'Pola Mutasi Internal', href: '/zi-wbk/manajemen-sdm/pola-mutasi' },
            { title: 'Pengembangan Pegawai Berbasis Kompetensi', href: '/zi-wbk/manajemen-sdm/pengembangan-pegawai' },
            { title: 'Penetapan Kinerja Individu', href: '/zi-wbk/manajemen-sdm/penetapan-kinerja' },
            { title: 'Sistem Informasi Kepegawaian', href: '/zi-wbk/manajemen-sdm/sistem-informasi' },
            { title: 'Penegakan Aturan Disiplin/Kode Etik/Kode Perilaku Pegawai', href: '/zi-wbk/manajemen-sdm/penegakan-aturan' },
        ]
    },
    {
        title: 'Akuntabilitas Kerja',
        href: '/zi-wbk/akuntabilitas-kerja',
        children: [
            { title: 'Keterlibatan Pimpinan', href: '/zi-wbk/akuntabilitas-kerja/keterlibatan-pimpinan' },
            { title: 'Pengelolaan Akuntabilitas Kinerja', href: '/zi-wbk/akuntabilitas-kerja/pengelolaan-akuntabilitas' },
        ]
    },
    {
        title: 'Penguatan Pengawasan',
        href: '/zi-wbk/penguatan-pengawasan',
        children: [
            { title: 'Pengendalian Gratifikasi', href: '/zi-wbk/penguatan-pengawasan/pengendalian-gratifikasi' },
            { title: 'Penerapan Sistem Pengendalian Intern Pemerintah (SPIP)', href: '/zi-wbk/penguatan-pengawasan/penerapan-spip' },
            { title: 'Pengaduan Masyarakat', href: '/zi-wbk/penguatan-pengawasan/pengaduan-masyarakat' },
            { title: 'Whistle-Blowing System', href: '/zi-wbk/penguatan-pengawasan/whistle-blowing' },
            { title: 'Penanganan Benturan Kepentingan', href: '/zi-wbk/penguatan-pengawasan/penanganan-benturan' },
        ]
    },
    {
        title: 'Penguatan Kualitas Pelayanan Publik',
        href: '/zi-wbk/penguatan-kualitas-pelayanan-publik',
        children: [
            { title: 'Budaya Pelayanan Prima', href: '/zi-wbk/penguatan-kualitas-pelayanan-publik/budaya-pelayanan' },
            { title: 'Pemanfaatan Teknologi Informasi', href: '/zi-wbk/penguatan-kualitas-pelayanan-publik/pemanfaatan-teknologi' },
            { title: 'Pengelolaan Pengaduan', href: '/zi-wbk/penguatan-kualitas-pelayanan-publik/pengelolaan-pengaduan' },
            { title: 'Penilaian Kepuasan Terhadap Pelayanan', href: '/zi-wbk/penguatan-kualitas-pelayanan-publik/penilaian-kepuasan' },
            { title: 'Standar Pelayanan', href: '/zi-wbk/penguatan-kualitas-pelayanan-publik/standar-pelayanan' },
            { title: 'Penerapan SPIP', href: '/zi-wbk/penguatan-kualitas-pelayanan-publik/penerapan-spip' },
            { title: 'Penanganan Benturan Kepentingan', href: '/zi-wbk/penguatan-kualitas-pelayanan-publik/penanganan-benturan' },
        ]
    },
];

// PPID menu items with nested structure
const ppidMenuData = [
    {
        title: 'Profil PPID',
        href: '/ppid/profil',
        children: []
    },
    {
        title: 'Informasi Publik',
        href: '/ppid/informasi-publik',
        children: [
            { title: 'Informasi Setiap Saat', href: '/ppid/informasi-publik/setiap-saat' },
            { title: 'Informasi Serta Merta', href: '/ppid/informasi-publik/serta-merta' },
            { title: 'Informasi Berkala', href: '/ppid/informasi-publik/berkala' },
            { title: 'Informasi yang Dikecualikan', href: '/ppid/informasi-publik/dikecualikan' },
        ]
    },
    {
        title: 'Permohonan Informasi Publik',
        href: '/ppid/permohonan',
        children: []
    },
    {
        title: 'Pengajuan Keberatan atas Permohonan Informasi Publik',
        href: '/ppid/pengajuan-keberatan',
        children: []
    },
];

// Flat items for simple dropdown fallback (computed once, no need for useMemo at module level)
const ziWbkItems = ziWbkMenuData.map(item => ({ title: item.title, href: item.href }));

// Dropdown Menu Component with improved positioning and z-index
// Fix: Using custom dropdown instead of Radix to prevent portal repositioning issues
const NavDropdown = ({ 
    title, 
    items 
}: { 
    title: string; 
    items: { title: string; href: string; external?: boolean }[] 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Memoize items for performance
    const memoizedItems = useMemo(() => items, [items]);

    const handleMouseEnter = useCallback(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsOpen(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        timeoutRef.current = setTimeout(() => {
            setIsOpen(false);
        }, 150);
    }, []);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    return (
        <div 
            ref={dropdownRef}
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <button 
                className="flex items-center gap-1.5 px-5 py-3.5 text-sm font-medium text-white hover:bg-white/10 rounded-md transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                {title}
                <ChevronDown className={cn("h-3.5 w-3.5 opacity-70 transition-transform duration-200", isOpen && "rotate-180")} />
            </button>
            
            {/* Custom dropdown panel - no portal, stays in DOM flow */}
            <div 
                className={cn(
                    "absolute left-0 top-full pt-2 z-[101]",
                    "transition-[opacity,visibility] duration-150 ease-out",
                    isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
                )}
            >
                <div className="bg-white min-w-[200px] p-2 shadow-lg rounded-xl border border-gray-100">
                    {memoizedItems.map((item) => (
                        <div key={item.href} className="rounded-md">
                            {item.external ? (
                                <a 
                                    href={item.href} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="block w-full cursor-pointer py-2.5 px-3 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50/60 rounded-lg transition-colors"
                                >
                                    {item.title}
                                </a>
                            ) : (
                                <Link 
                                    href={item.href} 
                                    className="block w-full cursor-pointer py-2.5 px-3 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50/60 rounded-lg transition-colors"
                                >
                                    {item.title}
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Simple Nav Link
const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link 
        href={href} 
        className="px-5 py-3.5 text-sm font-medium text-white hover:bg-white/10 rounded-md transition-colors"
    >
        {children}
    </Link>
);

// ZI-WBK Mega Menu with elegant multi-level design
const ZiWbkMegaMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState<number>(0); // Default to first category
    const menuRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsOpen(false);
        }, 150);
    };

    const handleCategoryEnter = (index: number) => {
        setActiveCategory(index);
    };

    const handleMenuOpen = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setActiveCategory(0); // Reset to first category when opening
        }
    };

    return (
        <div 
            ref={menuRef}
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <button 
                className="flex items-center gap-1.5 px-5 py-3.5 text-sm font-medium text-white hover:bg-white/10 rounded-md transition-colors"
                onClick={handleMenuOpen}
            >
                ZI-WBK
                <ChevronDown className={cn("h-3.5 w-3.5 opacity-70 transition-transform duration-200", isOpen && "rotate-180")} />
            </button>

            {/* Mega Menu Panel */}
            <div 
                className={cn(
                    "absolute left-0 top-full pt-2 transition-all duration-200 ease-out z-50",
                    isOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
                )}
            >
                <div className="flex bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
                    {/* Left Panel - Categories */}
                    <div className="w-[260px] bg-gradient-to-b from-slate-50 to-white py-3 border-r border-gray-100">
                        {ziWbkMenuData.map((category, index) => (
                            <div
                                key={category.href}
                                onMouseEnter={() => handleCategoryEnter(index)}
                                className="relative"
                            >
                                <Link
                                    href={category.href}
                                    className={cn(
                                        "flex items-center justify-between px-5 py-3 text-sm transition-all duration-150",
                                        activeCategory === index 
                                            ? "text-blue-600 bg-blue-50/80 font-medium" 
                                            : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                                    )}
                                >
                                    <span className="leading-snug pr-2">{category.title}</span>
                                    <ChevronRight className={cn(
                                        "h-4 w-4 flex-shrink-0 transition-transform duration-150",
                                        activeCategory === index && "translate-x-0.5 text-blue-500"
                                    )} />
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* Right Panel - Subcategories (Always visible with active category) */}
                    <div className="w-[320px] bg-white py-3">
                        <div className="px-2">
                            <div className="px-4 pb-3 mb-2 border-b border-gray-100">
                                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                                    {ziWbkMenuData[activeCategory]?.title}
                                </span>
                            </div>
                            <div className="space-y-0.5 max-h-[300px] overflow-y-auto">
                                {ziWbkMenuData[activeCategory]?.children.map((child, childIndex) => (
                                    <Link
                                        key={child.href}
                                        href={child.href}
                                        className="block px-4 py-2.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50/60 rounded-lg transition-all duration-150 leading-relaxed"
                                    >
                                        {child.title}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Terbitan Mega Menu with nested submenus
const TerbitanMegaMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState<number | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsOpen(false);
            setActiveCategory(null);
        }, 150);
    };

    const handleCategoryEnter = (index: number) => {
        const category = terbitanMenuData[index];
        if (category.children && category.children.length > 0) {
            setActiveCategory(index);
        } else {
            setActiveCategory(null);
        }
    };

    const handleMenuOpen = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setActiveCategory(null);
        }
    };

    return (
        <div 
            ref={menuRef}
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <button 
                className="flex items-center gap-1.5 px-5 py-3.5 text-sm font-medium text-white hover:bg-white/10 rounded-md transition-colors"
                onClick={handleMenuOpen}
            >
                Terbitan
                <ChevronDown className={cn("h-3.5 w-3.5 opacity-70 transition-transform duration-200", isOpen && "rotate-180")} />
            </button>

            {/* Dropdown Panel */}
            <div 
                className={cn(
                    "absolute left-0 top-full pt-2 transition-all duration-200 ease-out z-50",
                    isOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
                )}
            >
                <div className="flex bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
                    {/* Left Panel - Categories */}
                    <div className="w-[200px] bg-gradient-to-b from-slate-50 to-white py-3">
                        {terbitanMenuData.map((category, index) => (
                            <div
                                key={category.href + index}
                                onMouseEnter={() => handleCategoryEnter(index)}
                                className="relative"
                            >
                                {/* Jika punya children dan href='#', jadikan non-clickable */}
                                {category.children && category.children.length > 0 && category.href === '#' ? (
                                    <div
                                        className={cn(
                                            "flex items-center justify-between px-5 py-3 text-sm transition-all duration-150 cursor-default",
                                            activeCategory === index 
                                                ? "text-blue-600 bg-blue-50/80 font-medium" 
                                                : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                                        )}
                                    >
                                        <span className="leading-snug pr-2">{category.title}</span>
                                        <ChevronRight className={cn(
                                            "h-4 w-4 flex-shrink-0 transition-transform duration-150",
                                            activeCategory === index && "translate-x-0.5 text-blue-500"
                                        )} />
                                    </div>
                                ) : (
                                    <Link
                                        href={category.href}
                                        className={cn(
                                            "flex items-center justify-between px-5 py-3 text-sm transition-all duration-150",
                                            activeCategory === index 
                                                ? "text-blue-600 bg-blue-50/80 font-medium" 
                                                : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                                        )}
                                    >
                                        <span className="leading-snug pr-2">{category.title}</span>
                                        {category.children && category.children.length > 0 && (
                                            <ChevronRight className={cn(
                                                "h-4 w-4 flex-shrink-0 transition-transform duration-150",
                                                activeCategory === index && "translate-x-0.5 text-blue-500"
                                            )} />
                                        )}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Right Panel - Subcategories (Only visible when category has children) */}
                    {activeCategory !== null && terbitanMenuData[activeCategory]?.children?.length > 0 && (
                        <div className="w-[200px] bg-white py-3 border-l border-gray-100">
                            <div className="px-2">
                                <div className="px-4 pb-3 mb-2 border-b border-gray-100">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                                        {terbitanMenuData[activeCategory]?.title}
                                    </span>
                                </div>
                                <div className="space-y-0.5">
                                    {terbitanMenuData[activeCategory]?.children.map((child) => (
                                        <Link
                                            key={child.href}
                                            href={child.href}
                                            className="block px-4 py-2.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50/60 rounded-lg transition-all duration-150 leading-relaxed"
                                        >
                                            {child.title}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Mobile Terbitan Nested Accordion
const MobileTerbitanMenu = ({ onItemClick }: { onItemClick: () => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [expandedCategory, setExpandedCategory] = useState<number | null>(null);

    return (
        <div className="border-b border-gray-100">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between py-3 text-left font-medium text-gray-900"
            >
                Terbitan
                <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
            </button>
            {isOpen && (
                <div className="pb-3 space-y-1">
                    {terbitanMenuData.map((category, index) => (
                        <div key={category.href} className="pl-2">
                            {category.children && category.children.length > 0 ? (
                                <>
                                    <button
                                        onClick={() => setExpandedCategory(expandedCategory === index ? null : index)}
                                        className={cn(
                                            "flex w-full items-center justify-between py-2 px-2 text-sm rounded-md transition-colors",
                                            expandedCategory === index 
                                                ? "bg-blue-50 text-blue-700 font-medium" 
                                                : "text-gray-600 hover:bg-gray-50"
                                        )}
                                    >
                                        <span>{category.title}</span>
                                        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", expandedCategory === index && "rotate-180")} />
                                    </button>
                                    {expandedCategory === index && (
                                        <div className="pl-4 py-2 space-y-1">
                                            {category.children.map((child) => (
                                                <Link
                                                    key={child.href}
                                                    href={child.href}
                                                    className="block py-1.5 text-xs text-gray-500 hover:text-blue-600 transition-colors"
                                                    onClick={onItemClick}
                                                >
                                                    {child.title}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <Link
                                    href={category.href}
                                    className="flex w-full items-center py-2 px-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                                    onClick={onItemClick}
                                >
                                    {category.title}
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// PPID Mega Menu with nested submenu for Informasi Publik
const PpidMegaMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState<number | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsOpen(false);
            setActiveCategory(null);
        }, 150);
    };

    const handleCategoryEnter = (index: number) => {
        const category = ppidMenuData[index];
        if (category.children && category.children.length > 0) {
            setActiveCategory(index);
        } else {
            setActiveCategory(null);
        }
    };

    const handleMenuOpen = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setActiveCategory(null);
        }
    };

    return (
        <div 
            ref={menuRef}
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <button 
                className="flex items-center gap-1.5 px-5 py-3.5 text-sm font-medium text-white hover:bg-white/10 rounded-md transition-colors"
                onClick={handleMenuOpen}
            >
                PPID
                <ChevronDown className={cn("h-3.5 w-3.5 opacity-70 transition-transform duration-200", isOpen && "rotate-180")} />
            </button>

            {/* Dropdown Panel */}
            <div 
                className={cn(
                    "absolute left-0 top-full pt-2 transition-all duration-200 ease-out z-50",
                    isOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
                )}
            >
                <div className="flex bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
                    {/* Left Panel - Categories */}
                    <div className="w-[260px] bg-gradient-to-b from-slate-50 to-white py-3">
                        {ppidMenuData.map((category, index) => (
                            <div
                                key={category.href}
                                onMouseEnter={() => handleCategoryEnter(index)}
                                className="relative"
                            >
                                <Link
                                    href={category.href}
                                    className={cn(
                                        "flex items-center justify-between px-5 py-3 text-sm transition-all duration-150",
                                        activeCategory === index 
                                            ? "text-blue-600 bg-blue-50/80 font-medium" 
                                            : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                                    )}
                                >
                                    <span className="leading-snug pr-2">{category.title}</span>
                                    {category.children && category.children.length > 0 && (
                                        <ChevronRight className={cn(
                                            "h-4 w-4 flex-shrink-0 transition-transform duration-150",
                                            activeCategory === index && "translate-x-0.5 text-blue-500"
                                        )} />
                                    )}
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* Right Panel - Subcategories (Only visible when category has children) */}
                    {activeCategory !== null && ppidMenuData[activeCategory]?.children?.length > 0 && (
                        <div className="w-[260px] bg-white py-3 border-l border-gray-100">
                            <div className="px-2">
                                <div className="px-4 pb-3 mb-2 border-b border-gray-100">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                                        {ppidMenuData[activeCategory]?.title}
                                    </span>
                                </div>
                                <div className="space-y-0.5">
                                    {ppidMenuData[activeCategory]?.children.map((child) => (
                                        <Link
                                            key={child.href}
                                            href={child.href}
                                            className="block px-4 py-2.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50/60 rounded-lg transition-all duration-150 leading-relaxed"
                                        >
                                            {child.title}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Mobile PPID Nested Accordion
const MobilePpidMenu = ({ onItemClick }: { onItemClick: () => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [expandedCategory, setExpandedCategory] = useState<number | null>(null);

    return (
        <div className="border-b border-gray-100">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between py-3 text-left font-medium text-gray-900"
            >
                PPID
                <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
            </button>
            {isOpen && (
                <div className="pb-3 space-y-1">
                    {ppidMenuData.map((category, index) => (
                        <div key={category.href} className="pl-2">
                            {category.children && category.children.length > 0 ? (
                                <>
                                    <button
                                        onClick={() => setExpandedCategory(expandedCategory === index ? null : index)}
                                        className={cn(
                                            "flex w-full items-center justify-between py-2 px-2 text-sm rounded-md transition-colors",
                                            expandedCategory === index 
                                                ? "bg-blue-50 text-blue-700 font-medium" 
                                                : "text-gray-600 hover:bg-gray-50"
                                        )}
                                    >
                                        <span>{category.title}</span>
                                        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", expandedCategory === index && "rotate-180")} />
                                    </button>
                                    {expandedCategory === index && (
                                        <div className="pl-4 py-2 space-y-1">
                                            {category.children.map((child) => (
                                                <Link
                                                    key={child.href}
                                                    href={child.href}
                                                    className="block py-1.5 text-xs text-gray-500 hover:text-blue-600 transition-colors"
                                                    onClick={onItemClick}
                                                >
                                                    {child.title}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <Link
                                    href={category.href}
                                    className="flex w-full items-center py-2 px-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                                    onClick={onItemClick}
                                >
                                    {category.title}
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Mobile ZI-WBK Nested Accordion
const MobileZiWbkMenu = ({ onItemClick }: { onItemClick: () => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [expandedCategory, setExpandedCategory] = useState<number | null>(null);

    return (
        <div className="border-b border-gray-100">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between py-3 text-left font-medium text-gray-900"
            >
                ZI-WBK
                <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
            </button>
            {isOpen && (
                <div className="pb-3 space-y-1">
                    {ziWbkMenuData.map((category, index) => (
                        <div key={category.href} className="pl-2">
                            <button
                                onClick={() => setExpandedCategory(expandedCategory === index ? null : index)}
                                className={cn(
                                    "flex w-full items-center justify-between py-2 px-2 text-sm rounded-md transition-colors",
                                    expandedCategory === index 
                                        ? "bg-blue-50 text-blue-700 font-medium" 
                                        : "text-gray-600 hover:bg-gray-50"
                                )}
                            >
                                <span>{category.title}</span>
                                <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", expandedCategory === index && "rotate-180")} />
                            </button>
                            {expandedCategory === index && (
                                <div className="pl-4 py-2 space-y-1">
                                    {category.children.map((child) => (
                                        <Link
                                            key={child.href}
                                            href={child.href}
                                            className="block py-1.5 text-xs text-gray-500 hover:text-blue-600 transition-colors"
                                            onClick={onItemClick}
                                        >
                                            {child.title}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


// Mobile Menu Item with Accordion and memoization
const MobileMenuItem = React.memo(({ 
    title, 
    items,
    onItemClick
}: { 
    title: string; 
    items: { title: string; href: string; external?: boolean }[];
    onItemClick: () => void;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    
    // Memoize items to prevent unnecessary re-renders
    const memoizedItems = useMemo(() => items, [items]);
    
    return (
        <div className="border-b border-gray-100">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between py-3 text-left font-medium text-gray-900"
            >
                {title}
                <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
            </button>
            {isOpen && (
                <div className="pb-3 pl-4 space-y-2">
                    {memoizedItems.map((item) => (
                        item.external ? (
                            <a
                                key={item.href}
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block py-2 text-sm text-muted-foreground hover:text-blue-600"
                                onClick={onItemClick}
                            >
                                {item.title}
                            </a>
                        ) : (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="block py-2 text-sm text-muted-foreground hover:text-blue-600"
                                onClick={onItemClick}
                            >
                                {item.title}
                            </Link>
                        )
                    ))}
                </div>
            )}
        </div>
    );
});

export const Header: React.FC = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isVisible, setIsVisible] = useState(true);
    const [isAtTop, setIsAtTop] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isDropdownActive, setIsDropdownActive] = useState(false); // Track dropdown state
    const lastScrollY = useRef(0);
    const scrollThreshold = 50; // Minimum scroll distance before hiding
    const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Lock scroll-based size changes when dropdown is active to prevent flickering
    // This prevents the header from resizing while user is interacting with dropdowns
    const effectiveIsScrolled = isDropdownActive ? isScrolled : isScrolled;

    // Optimized scroll handler with batched updates
    const handleScroll = useCallback(() => {
        // Skip scroll handling completely if dropdown is active to prevent any layout shifts
        if (isDropdownActive) return;
        
        const currentScrollY = window.scrollY;
        const scrollDifference = currentScrollY - lastScrollY.current;

        // Calculate all states first, then batch update
        const newIsScrolled = currentScrollY > 10;
        const newIsAtTop = currentScrollY < 10;
        let newIsVisible = isVisible;

        // Visibility logic with hysteresis to prevent flicker
        if (scrollDifference < 0 || currentScrollY < 50) {
            newIsVisible = true;
        } else if (scrollDifference > 0 && currentScrollY > 100 && Math.abs(scrollDifference) > scrollThreshold) {
            newIsVisible = false;
        }

        // Batch all state updates together to prevent multiple re-renders
        requestAnimationFrame(() => {
            setIsScrolled(newIsScrolled);
            setIsAtTop(newIsAtTop);
            if (newIsVisible !== isVisible) {
                setIsVisible(newIsVisible);
            }
        });

        lastScrollY.current = currentScrollY;
    }, [isVisible, isDropdownActive]);

    // Optimized scroll event listener with longer debounce and throttling
    useEffect(() => {
        let ticking = false;
        
        const throttledScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        const debouncedScroll = () => {
            if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
            scrollTimeoutRef.current = setTimeout(throttledScroll, 100); // Increased debounce for better stability
        };

        window.addEventListener('scroll', debouncedScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', debouncedScroll);
            if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        };
    }, [handleScroll]);

    const closeMobileMenu = () => setMobileMenuOpen(false);

    return (
        <header 
            className={cn(
                "fixed top-0 left-0 right-0 z-[100] w-full will-change-transform",
                "transition-[transform,box-shadow] duration-300 ease-out", // Only animate transform and shadow, not all properties
                !isVisible && "-translate-y-full pointer-events-none",
                isScrolled ? "bg-white shadow-lg" : "bg-white"
            )}
            onMouseEnter={() => setIsDropdownActive(true)}
            onMouseLeave={() => setIsDropdownActive(false)}
        >
            {/* Top Bar - White Background with Logo */}
            <div className={cn(
                "w-full transition-[padding] duration-300 ease-out",
                isScrolled ? "py-2" : "py-4"
            )}>
                <div className="container mx-auto px-4 lg:px-8">
                    <div className={cn(
                        "flex items-center justify-between w-full transition-[height] duration-300 ease-out",
                        isScrolled ? "h-16" : "h-20"
                    )}>
                        {/* Logo */}
                        <Link href="/" className="flex items-center hover:opacity-90 transition-opacity duration-200">
                            <img 
                                src="/images/logo-BB-SULTRA-scaled-237x56.png" 
                                alt="Balai Bahasa Sultra" 
                                className={cn(
                                    "transition-[height] duration-300 ease-out",
                                    isScrolled ? "h-10 sm:h-11" : "h-12 sm:h-14"
                                )}
                            />
                        </Link>

                        {/* Desktop: Search Box */}
                        <div className={cn(
                            "hidden lg:flex items-center transition-[gap] duration-300 ease-out",
                            isScrolled ? "gap-3" : "gap-4"
                        )}>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Masukkan kata kunci"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && console.log('Search:', searchQuery)}
                                    className={cn(
                                        "pl-11 pr-4 text-sm rounded-l-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-[width,padding] duration-300 ease-out",
                                        isScrolled 
                                            ? "w-52 py-2 text-sm" 
                                            : "w-64 py-2.5"
                                    )}
                                />
                            </div>
                            <Button 
                                onClick={() => console.log('Search:', searchQuery)}
                                className={cn(
                                    "-ml-4 rounded-l-none rounded-r-lg bg-amber-500 hover:bg-amber-600 text-white font-medium shadow-sm transition-[padding,height] duration-300 ease-out",
                                    isScrolled 
                                        ? "px-4 h-10 text-sm" 
                                        : "px-6 h-[42px]"
                                )}
                            >
                                Cari
                            </Button>
                        </div>

                        {/* Mobile Menu Trigger */}
                        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="lg:hidden h-12 w-12">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[300px] sm:w-[350px]">
                                <SheetHeader>
                                    <SheetTitle>
                                        <img
                                            src="/images/logo-BB-SULTRA-scaled-237x56.png"
                                            alt="Logo"
                                            className="h-10"
                                        />
                                    </SheetTitle>
                                    <SheetDescription>
                                        Menu navigasi untuk Balai Bahasa Provinsi Sulawesi Tenggara
                                    </SheetDescription>
                                </SheetHeader>
                                
                                {/* Mobile Search */}
                                <div className="mt-4 flex gap-2">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Cari..."
                                            className="w-full pl-9 pr-3 py-2 text-sm rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <ScrollArea className="h-[calc(100vh-150px)] mt-6">
                                    <div className="space-y-1">
                                        <Link 
                                            href="/" 
                                            className="block py-3 font-medium text-gray-900 border-b border-gray-100"
                                            onClick={closeMobileMenu}
                                        >
                                            Beranda
                                        </Link>
                                        <MobileMenuItem title="Tentang Kami" items={profilItems} onItemClick={closeMobileMenu} />
                                        <MobileZiWbkMenu onItemClick={closeMobileMenu} />
                                        <MobileMenuItem title="SAKIP" items={sakipItems} onItemClick={closeMobileMenu} />
                                        <MobileTerbitanMenu onItemClick={closeMobileMenu} />
                                        <MobilePpidMenu onItemClick={closeMobileMenu} />
                                        <Link 
                                            href="/standar-pelayanan" 
                                            className="block py-3 font-medium text-gray-900 border-b border-gray-100"
                                            onClick={closeMobileMenu}
                                        >
                                            Standar Pelayanan
                                        </Link>
                                        <Link 
                                            href="/ssd" 
                                            className="block py-3 font-medium text-gray-900 border-b border-gray-100"
                                            onClick={closeMobileMenu}
                                        >
                                            SSD
                                        </Link>
                                        <MobileMenuItem title="Informasi" items={informasiMenuItems} onItemClick={closeMobileMenu} />
                                        <MobileMenuItem title="Layanan" items={layananItems} onItemClick={closeMobileMenu} />
                                        <Link 
                                            href="/kontak" 
                                            className="block py-3 font-medium text-gray-900 border-b border-gray-100"
                                            onClick={closeMobileMenu}
                                        >
                                            Kontak
                                        </Link>
                                    </div>
                                </ScrollArea>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>


            {/* Navigation Bar - Blue Background */}
            <nav className={cn(
                "hidden lg:block bg-gradient-to-r from-[#1a5580] via-[#1e6091] to-[#1a5580] w-full transition-[padding] duration-300 ease-out",
                isScrolled ? "py-1" : "py-2"
            )}>
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="flex items-center justify-center gap-1 flex-wrap">
                        <NavLink href="/">Beranda</NavLink>
                        <NavDropdown title="Tentang Kami" items={profilItems} />
                        <ZiWbkMegaMenu />
                        <NavDropdown title="SAKIP" items={sakipItems} />
                        <TerbitanMegaMenu />
                        <PpidMegaMenu />
                        <NavLink href="/standar-pelayanan">Standar Pelayanan</NavLink>
                        <NavLink href="/ssd">SSD</NavLink>
                        <NavDropdown title="Informasi" items={informasiMenuItems} />
                        <NavDropdown title="Layanan" items={layananItems} />
                    </div>
                </div>
            </nav>

            {/* Mobile Navigation Bar - Clean & Complete */}
            <nav className={cn(
                "lg:hidden bg-gradient-to-r from-[#1a5580] via-[#1e6091] to-[#1a5580] w-full transition-[padding] duration-300 ease-out",
                isScrolled ? "py-1" : "py-2"
            )}>
                <div className="container mx-auto px-4">
                    <div className={cn(
                        "flex items-center overflow-x-auto gap-2 text-xs scrollbar-hide whitespace-nowrap transition-[padding] duration-300 ease-out",
                        isScrolled ? "py-1.5" : "py-2"
                    )}>
                        <Link href="/" className="shrink-0 px-3 py-2 text-white whitespace-nowrap hover:bg-white/10 rounded-md transition-colors font-medium">
                            Beranda
                        </Link>
                        <Link href="/profil" className="shrink-0 px-3 py-2 text-white whitespace-nowrap hover:bg-white/10 rounded-md transition-colors">
                            Tentang Kami
                        </Link>
                        <Link href="/zi-wbk" className="shrink-0 px-3 py-2 text-white whitespace-nowrap hover:bg-white/10 rounded-md transition-colors">
                            ZI-WBK
                        </Link>
                        <Link href="/sakip/data-dukung" className="shrink-0 px-3 py-2 text-white whitespace-nowrap hover:bg-white/10 rounded-md transition-colors">
                            SAKIP
                        </Link>
                        <Link href="/terbitan/majalah" className="shrink-0 px-3 py-2 text-white whitespace-nowrap hover:bg-white/10 rounded-md transition-colors">
                            Terbitan
                        </Link>
                        <Link href="/berita" className="shrink-0 px-3 py-2 text-white whitespace-nowrap hover:bg-white/10 rounded-md transition-colors">
                            Berita
                        </Link>
                        <Link href="/ppid" className="shrink-0 px-3 py-2 text-white whitespace-nowrap hover:bg-white/10 rounded-md transition-colors">
                            PPID
                        </Link>
                        <Link href="/standar-pelayanan" className="shrink-0 px-3 py-2 text-white whitespace-nowrap hover:bg-white/10 rounded-md transition-colors">
                            Standar Pelayanan
                        </Link>
                        <Link href="/ssd" className="shrink-0 px-3 py-2 text-white whitespace-nowrap hover:bg-white/10 rounded-md transition-colors">
                            SSD
                        </Link>
                        <Link href="/layanan" className="shrink-0 px-3 py-2 text-white whitespace-nowrap hover:bg-white/10 rounded-md transition-colors">
                            Layanan
                        </Link>
                        <Link href="/galeri" className="shrink-0 px-3 py-2 text-white whitespace-nowrap hover:bg-white/10 rounded-md transition-colors">
                            Galeri
                        </Link>
                        <Link href="/kontak" className="shrink-0 px-3 py-2 text-white whitespace-nowrap hover:bg-white/10 rounded-md transition-colors">
                            Kontak
                        </Link>
                    </div>
                </div>
            </nav>
        </header>
    );
};
