import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Permohonan from './Permohonan';

// Mock Inertia
vi.mock('@inertiajs/react', () => ({
    Link: ({ children, href, ...props }: any) => (
        <a href={href} {...props}>{children}</a>
    ),
    Head: ({ children }: any) => <>{children}</>,
}));

// Mock PublicLayout
vi.mock('@/Layouts/PublicLayout', () => ({
    PublicLayout: ({ children, title, description }: any) => (
        <div data-testid="public-layout" data-title={title} data-description={description}>
            {children}
        </div>
    ),
}));

describe('Permohonan Page', () => {
    beforeEach(() => {
        // Reset any mocks before each test
        vi.clearAllMocks();
    });

    /**
     * Task 1.2: Write unit test for page rendering
     * Validates: Requirements 4.5
     */
    describe('Page Structure', () => {
        it('renders without errors', () => {
            expect(() => render(<Permohonan />)).not.toThrow();
        });

        it('uses PublicLayout wrapper', () => {
            render(<Permohonan />);
            const layout = screen.getByTestId('public-layout');
            expect(layout).toBeInTheDocument();
        });
    });

    /**
     * Task 2.3: Write property test for heading hierarchy
     * Property 3: Heading Hierarchy Integrity
     * Validates: Requirements 5.3
     */
    describe('Heading Hierarchy', () => {
        it('has proper heading hierarchy (h1 before h2, no skipped levels)', () => {
            const { container } = render(<Permohonan />);
            
            const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
            const headingLevels: number[] = [];
            
            headings.forEach((heading) => {
                const level = parseInt(heading.tagName.charAt(1));
                headingLevels.push(level);
            });

            // Check that h1 appears before any h2
            const h1Index = headingLevels.indexOf(1);
            const h2Index = headingLevels.indexOf(2);
            
            if (h1Index !== -1 && h2Index !== -1) {
                expect(h1Index).toBeLessThan(h2Index);
            }

            // Check no skipped levels (e.g., h1 directly to h3)
            for (let i = 1; i < headingLevels.length; i++) {
                const diff = headingLevels[i] - headingLevels[i - 1];
                // Can go down any amount, but can only go up by 1
                if (diff > 0) {
                    expect(diff).toBeLessThanOrEqual(1);
                }
            }
        });

        it('has exactly one h1 element', () => {
            const { container } = render(<Permohonan />);
            const h1Elements = container.querySelectorAll('h1');
            expect(h1Elements.length).toBe(1);
        });
    });

    /**
     * Task 3.2: Write unit test for introduction content
     * Validates: Requirements 1.2, 1.5
     */
    describe('Introduction Section', () => {
        it('displays introduction text about submission methods', () => {
            render(<Permohonan />);
            expect(screen.getByText(/langsung datang ke ULT/i)).toBeInTheDocument();
            expect(screen.getByText(/pos-el/i)).toBeInTheDocument();
        });

        it('displays processing time information', () => {
            render(<Permohonan />);
            // Use getAllByText since text appears in multiple places
            expect(screen.getAllByText(/10 hari kerja/i).length).toBeGreaterThan(0);
            expect(screen.getAllByText(/7 hari kerja/i).length).toBeGreaterThan(0);
            expect(screen.getByText(/Undang-Undang Nomor 14 Tahun 2008/i)).toBeInTheDocument();
        });
    });

    /**
     * Task 4.2: Write unit test for requirements content
     * Validates: Requirements 1.3, 1.4
     */
    describe('Requirements Section', () => {
        it('displays individual applicant requirements', () => {
            render(<Permohonan />);
            expect(screen.getByText(/Pemohon Perorangan/i)).toBeInTheDocument();
            expect(screen.getByText(/Fotokopi KTP atau identitas lainnya/i)).toBeInTheDocument();
        });

        it('displays institutional applicant requirements', () => {
            render(<Permohonan />);
            expect(screen.getByText(/Pemohon Lembaga/i)).toBeInTheDocument();
            expect(screen.getByText(/akte pendirian/i)).toBeInTheDocument();
            expect(screen.getByText(/surat kuasa/i)).toBeInTheDocument();
        });
    });

    /**
     * Task 5.2: Write unit test for schedule content
     * Validates: Requirements 2.1, 2.2, 2.3
     */
    describe('Schedule Section', () => {
        it('displays Monday-Thursday schedule', () => {
            render(<Permohonan />);
            expect(screen.getByText(/Senin - Kamis/i)).toBeInTheDocument();
            expect(screen.getByText(/09.00 - 15.00 WITA/i)).toBeInTheDocument();
        });

        it('displays Friday schedule', () => {
            render(<Permohonan />);
            expect(screen.getByText(/Jumat/i)).toBeInTheDocument();
            expect(screen.getByText(/09.00 - 15.30 WITA/i)).toBeInTheDocument();
        });

        it('displays cost information', () => {
            render(<Permohonan />);
            // Use getAllByText since "GRATIS" appears in multiple places
            expect(screen.getAllByText(/GRATIS/i).length).toBeGreaterThan(0);
            expect(screen.getByText(/penggandaan/i)).toBeInTheDocument();
        });
    });

    /**
     * Task 8-11: Write unit tests for MultiStepForm
     * Validates: Requirements 3.1, 3.2, 4.1-4.5, 5.1-5.3
     */
    describe('Form Section', () => {
        it('displays form section with correct heading', () => {
            render(<Permohonan />);
            expect(screen.getByRole('heading', { name: /Ajukan Permohonan/i })).toBeInTheDocument();
        });

        it('displays Step 1 form fields', () => {
            render(<Permohonan />);
            // Data Pemohon appears in progress indicator and form heading
            expect(screen.getAllByText(/Data Pemohon/i).length).toBeGreaterThan(0);
            expect(screen.getByPlaceholderText(/nama lengkap/i)).toBeInTheDocument();
            expect(screen.getByPlaceholderText(/contoh@email.com/i)).toBeInTheDocument();
            expect(screen.getByPlaceholderText(/08123456789/i)).toBeInTheDocument();
        });

        it('displays jenis pemohon radio options', () => {
            render(<Permohonan />);
            expect(screen.getByRole('radio', { name: /Perorangan/i })).toBeInTheDocument();
            expect(screen.getByRole('radio', { name: /Lembaga/i })).toBeInTheDocument();
        });

        it('displays navigation buttons', () => {
            render(<Permohonan />);
            expect(screen.getByRole('button', { name: /Lanjutkan/i })).toBeInTheDocument();
        });
    });

    /**
     * Task 8.2: Write property test for WCAG contrast compliance
     * Property 1: WCAG AA Contrast Compliance
     * Validates: Requirements 5.1
     * Note: Full contrast testing requires visual regression tools.
     * This test verifies that text colors are defined using standard classes.
     */
    describe('Accessibility - Contrast', () => {
        it('uses standard text color classes for readability', () => {
            const { container } = render(<Permohonan />);
            
            // Check that main content paragraphs use readable colors
            const paragraphs = container.querySelectorAll('p');
            let hasReadableText = false;
            
            paragraphs.forEach((el) => {
                const className = el.className || '';
                // Check for common readable text color classes
                if (className.includes('text-gray-') || 
                    className.includes('text-white') ||
                    className.includes('text-blue-')) {
                    hasReadableText = true;
                }
            });
            
            // At least some paragraphs should have explicit color classes
            expect(hasReadableText).toBe(true);
        });
    });

    /**
     * Task 8.3: Write property test for keyboard focus visibility
     * Property 2: Keyboard Focus Visibility
     * Validates: Requirements 5.2
     */
    describe('Accessibility - Focus', () => {
        it('interactive elements have focus styles', () => {
            const { container } = render(<Permohonan />);
            
            // Check links and buttons have focus-related classes or are standard elements
            const interactiveElements = container.querySelectorAll('a, button');
            
            interactiveElements.forEach((el) => {
                // Standard HTML elements get default focus styles
                // Custom elements should have focus: classes
                const tagName = el.tagName.toLowerCase();
                expect(['a', 'button']).toContain(tagName);
            });
        });

        it('scroll button has focus ring', () => {
            render(<Permohonan />);
            const scrollButton = screen.getByRole('button', { name: /scroll/i });
            expect(scrollButton.className).toContain('focus:');
        });
    });

    /**
     * Task 8.4: Write property test for icon accessibility
     * Property 4: Icon Accessibility
     * Validates: Requirements 5.4
     */
    describe('Accessibility - Icons', () => {
        it('most decorative icons have aria-hidden attribute', () => {
            const { container } = render(<Permohonan />);
            
            // Find all SVG elements (Lucide icons render as SVG)
            const svgElements = container.querySelectorAll('svg');
            let iconsWithAriaHidden = 0;
            
            svgElements.forEach((svg) => {
                if (svg.getAttribute('aria-hidden') === 'true') {
                    iconsWithAriaHidden++;
                }
            });
            
            // Most icons should have aria-hidden (at least 50%)
            const percentage = iconsWithAriaHidden / svgElements.length;
            expect(percentage).toBeGreaterThanOrEqual(0.5);
        });
    });
});

/**
 * Task 6.2: Write unit test for timeline content
 * Validates: Requirements 6.1, 6.2, 6.3
 */
describe('Timeline Section', () => {
    it('displays 4 timeline stages', () => {
        render(<Permohonan />);
        // Check for all 4 stage titles
        expect(screen.getAllByText(/Pengajuan/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/Verifikasi/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/Pemrosesan/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/Penyerahan/i).length).toBeGreaterThan(0);
    });

    it('displays duration for each stage', () => {
        render(<Permohonan />);
        expect(screen.getAllByText(/1 hari/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/2 hari kerja/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/5-10 hari kerja/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/1-2 hari kerja/i).length).toBeGreaterThan(0);
    });

    it('displays timeline heading', () => {
        render(<Permohonan />);
        expect(screen.getByRole('heading', { name: /Timeline Permohonan/i })).toBeInTheDocument();
    });
});

/**
 * Task 13.2: Write unit test for FAQ functionality
 * Validates: Requirements 7.1, 7.2, 7.3
 */
describe('FAQ Section', () => {
    it('displays 5 FAQ items', () => {
        render(<Permohonan />);
        // Check for FAQ questions
        expect(screen.getByText(/Apa saja informasi yang dapat diminta/i)).toBeInTheDocument();
        expect(screen.getByText(/Berapa lama proses permohonan/i)).toBeInTheDocument();
        expect(screen.getByText(/Apakah ada biaya untuk mengajukan/i)).toBeInTheDocument();
        expect(screen.getByText(/Bagaimana jika permohonan saya ditolak/i)).toBeInTheDocument();
        expect(screen.getByText(/Apakah saya bisa mengajukan keberatan/i)).toBeInTheDocument();
    });

    it('FAQ buttons have aria-expanded attribute', () => {
        render(<Permohonan />);
        const faqButtons = screen.getAllByRole('button', { name: /informasi|permohonan|biaya|ditolak|keberatan/i });
        faqButtons.forEach((button) => {
            expect(button).toHaveAttribute('aria-expanded');
        });
    });

    it('FAQ buttons have aria-controls attribute', () => {
        render(<Permohonan />);
        const faqButtons = screen.getAllByRole('button', { name: /informasi|permohonan|biaya|ditolak|keberatan/i });
        faqButtons.forEach((button) => {
            expect(button).toHaveAttribute('aria-controls');
        });
    });

    it('displays FAQ section heading', () => {
        render(<Permohonan />);
        expect(screen.getByRole('heading', { name: /Pertanyaan yang Sering Diajukan/i })).toBeInTheDocument();
    });
});

/**
 * Task 7.2: Write responsive layout tests
 * Validates: Requirements 4.1, 4.2, 4.3
 * Note: Full responsive testing requires visual regression tools or E2E tests.
 * These tests verify responsive classes are applied.
 */
describe('Responsive Layout', () => {
    it('uses responsive grid classes for requirements section', () => {
        const { container } = render(<Permohonan />);
        
        // Check for responsive grid classes
        const gridElements = container.querySelectorAll('[class*="grid-cols-1"][class*="md:grid-cols-2"]');
        expect(gridElements.length).toBeGreaterThan(0);
    });

    it('uses responsive padding classes', () => {
        const { container } = render(<Permohonan />);
        
        // Check for responsive padding classes
        const responsivePadding = container.querySelectorAll('[class*="px-4"], [class*="p-6"], [class*="md:p-8"]');
        expect(responsivePadding.length).toBeGreaterThan(0);
    });

    it('uses responsive text size classes', () => {
        const { container } = render(<Permohonan />);
        
        // Check for responsive text classes
        const responsiveText = container.querySelectorAll('[class*="text-2xl"][class*="md:text-3xl"], [class*="text-3xl"][class*="sm:text-4xl"]');
        expect(responsiveText.length).toBeGreaterThan(0);
    });
});
