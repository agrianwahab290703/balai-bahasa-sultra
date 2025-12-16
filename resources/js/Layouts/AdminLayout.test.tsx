import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import AdminLayout from './AdminLayout';

// Mock Inertia
vi.mock('@inertiajs/react', () => ({
  Link: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
  Head: ({ children }: any) => <>{children}</>,
  usePage: () => ({
    url: '/admin/dashboard',
    props: {
      auth: {
        user: {
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin'
        }
      },
      flash: {}
    }
  }),
  router: {
    post: vi.fn(),
    visit: vi.fn()
  }
}));

// Mock ToastProvider
vi.mock('@/Components/ui/toast', () => ({
  ToastProvider: ({ children }: any) => <>{children}</>
}));

// Mock Button, Input, DropdownMenu, Dialog, etc.
vi.mock('@/Components/ui/button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>
}));

vi.mock('@/Components/ui/input', () => ({
  Input: (props: any) => <input {...props} />
}));

vi.mock('@/Components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: any) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: any) => <div>{children}</div>,
  DropdownMenuItem: ({ children }: any) => <div>{children}</div>,
  DropdownMenuLabel: ({ children }: any) => <div>{children}</div>,
  DropdownMenuSeparator: () => <hr />,
  DropdownMenuTrigger: ({ children }: any) => <div>{children}</div>
}));

vi.mock('@/Components/ui/dialog', () => ({
  Dialog: ({ children }: any) => <div>{children}</div>,
  DialogContent: ({ children }: any) => <div>{children}</div>,
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <h2>{children}</h2>
}));

vi.mock('@/Components/ui/role-badge', () => ({
  RoleBadge: ({ role }: any) => <span data-testid="role-badge">{role}</span>
}));

// Mock lucide-react icons
vi.mock('lucide-react', async () => {
  const actual = await vi.importActual('lucide-react');
  return {
    ...actual,
    // Mock only icons used in AdminLayout
    ChevronLeft: () => <span data-testid="chevron-left" />,
    ChevronRight: () => <span data-testid="chevron-right" />,
    ChevronDown: () => <span data-testid="chevron-down" />,
    Home: () => <span data-testid="home-icon" />,
    Newspaper: () => <span data-testid="newspaper-icon" />,
    Image: () => <span data-testid="image-icon" />,
    FileText: () => <span data-testid="file-text-icon" />,
    HelpCircle: () => <span data-testid="help-circle-icon" />,
    ClipboardList: () => <span data-testid="clipboard-list-icon" />,
    Users: () => <span data-testid="users-icon" />,
    Building2: () => <span data-testid="building2-icon" />,
    Menu: () => <span data-testid="menu-icon" />,
    Settings: () => <span data-testid="settings-icon" />,
    LogOut: () => <span data-testid="logout-icon" />,
    User: () => <span data-testid="user-icon" />,
    Activity: () => <span data-testid="activity-icon" />,
    FolderOpen: () => <span data-testid="folder-open-icon" />,
    Search: () => <span data-testid="search-icon" />,
    Loader2: () => <span data-testid="loader2-icon" />,
    Lock: () => <span data-testid="lock-icon" />
  };
});

describe('AdminLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Layout Structure', () => {
    it('renders without errors', () => {
      expect(() => render(<AdminLayout>Content</AdminLayout>)).not.toThrow();
    });

    it('renders Sidebar component', () => {
      render(<AdminLayout>Content</AdminLayout>);
      // Sidebar is an aside element with fixed positioning
      const sidebar = document.querySelector('aside.fixed.left-0.top-0');
      expect(sidebar).toBeInTheDocument();
    });

    it('renders Header component', () => {
      render(<AdminLayout>Content</AdminLayout>);
      // Header is a header element with sticky positioning
      const header = document.querySelector('header.sticky.top-0');
      expect(header).toBeInTheDocument();
    });

    it('renders main content area', () => {
      render(<AdminLayout>Content</AdminLayout>);
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  describe('Enhanced Design Styling', () => {
    it('Sidebar uses blue-white-yellow gradient background', () => {
      render(<AdminLayout>Content</AdminLayout>);
      const sidebar = document.querySelector('aside.fixed.left-0.top-0');
      // Check for gradient classes (to be implemented)
      expect(sidebar?.className).toContain('bg-gradient-to-b');
      expect(sidebar?.className).toContain('from-blue-600');
      expect(sidebar?.className).toContain('via-white');
      expect(sidebar?.className).toContain('to-yellow-100');
    });

    it('Sidebar uses glassmorphism effect', () => {
      render(<AdminLayout>Content</AdminLayout>);
      const sidebar = document.querySelector('aside.fixed.left-0.top-0');
      // Check for glassmorphism classes (backdrop-blur, bg-opacity, border-opacity)
      expect(sidebar?.className).toContain('backdrop-blur');
      expect(sidebar?.className).toContain('bg-opacity-80');
      expect(sidebar?.className).toContain('border-opacity-10');
    });

    it('Header uses glassmorphism effect', () => {
      render(<AdminLayout>Content</AdminLayout>);
      const header = document.querySelector('header.sticky.top-0');
      expect(header?.className).toContain('backdrop-blur');
      expect(header?.className).toContain('bg-opacity-80');
    });

    it('Header uses gradient border or background', () => {
      render(<AdminLayout>Content</AdminLayout>);
      const header = document.querySelector('header.sticky.top-0');
      // Check for gradient border or background
      expect(header?.className).toMatch(/bg-gradient|border-gradient/);
    });
  });
});
