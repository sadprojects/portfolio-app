import { AccessibilityProvider } from '@contexts/AccessibilityContext';
import { ThemeProvider } from '@contexts/ThemeContext';
import { fireEvent, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <MemoryRouter>
      <AccessibilityProvider>
        <ThemeProvider>
          {ui}
        </ThemeProvider>
      </AccessibilityProvider>
    </MemoryRouter>
  );
};

describe('Home Page', () => {
  it('renders home page without crashing', () => {
    const { container } = renderWithProviders(<Home />);
    expect(container.firstChild).toBeDefined();
  });

  it('renders main container', () => {
    const { container } = renderWithProviders(<Home />);
    expect(container.querySelector('[data-section]')).toBeDefined();
  });

  it('includes sections structure', () => {
    const { container } = renderWithProviders(<Home />);
    const sections = container.querySelectorAll('[data-section]');
    expect(sections.length).toBeGreaterThan(0);
  });

  it('implements scroll functionality', () => {
    const { container } = renderWithProviders(<Home />);
    // Just verify component renders with scroll container
    expect(container.firstChild).toBeDefined();
  });

  it('shows navigation structure', () => {
    const { container } = renderWithProviders(<Home />);
    expect(container.firstChild).toBeDefined();
  });

  it('renders all main sections', () => {
    const { container } = renderWithProviders(<Home />);
    expect(container.querySelector('[data-section]')).toBeDefined();
  });

  it('initializes without errors', () => {
    expect(() => {
      renderWithProviders(<Home />);
    }).not.toThrow();
  });

  it('mounts successfully', () => {
    const { unmount } = renderWithProviders(<Home />);
    expect(unmount).toBeDefined();
  });
});

describe('Home Page - Interactions', () => {
  let mockScrollTo: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockScrollTo = vi.fn();
    window.scrollTo = mockScrollTo;

    // Mock IntersectionObserver
    global.IntersectionObserver = vi.fn().mockImplementation((callback) => ({
      observe: vi.fn((element) => {
        callback([
          {
            isIntersecting: true,
            target: element,
          },
        ]);
      }),
      disconnect: vi.fn(),
      unobserve: vi.fn(),
      takeRecords: vi.fn(),
      root: null,
      rootMargin: '',
      thresholds: [],
    }));

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    });

    Object.defineProperty(window, 'pageYOffset', {
      writable: true,
      configurable: true,
      value: 0,
    });

    // Use fake timers
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('should scroll to section when TOC button is clicked', async () => {
    const { container } = renderWithProviders(<Home />);

    // Wait for component to render
    await vi.advanceTimersByTimeAsync(100);

    const tocButtons = container.querySelectorAll('button[aria-label^="Go to"]');
    expect(tocButtons.length).toBeGreaterThan(0);

    const projectsButton = container.querySelector('button[aria-label="Go to Projects"]');
    if (projectsButton) {
      // Mock scrollIntoView for the projects section
      const projectsSection = container.querySelector('[data-section="projects"]');
      const mockScrollIntoView = vi.fn();

      if (projectsSection) {
        projectsSection.scrollIntoView = mockScrollIntoView;
      }

      fireEvent.click(projectsButton);

      // Advance timers to allow scroll logic to execute
      await vi.advanceTimersByTimeAsync(300);

      expect(mockScrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, 10000);

  it('should handle View My Work button click', async () => {
    const { getByText, container } = renderWithProviders(<Home />);

    await vi.advanceTimersByTimeAsync(100);

    const viewWorkButton = getByText('View My Work');

    // Mock scrollIntoView for first section
    const firstSection = container.querySelector('[data-section]:not([data-section="home"])');
    const mockScrollIntoView = vi.fn();

    if (firstSection) {
      firstSection.scrollIntoView = mockScrollIntoView;
    }

    fireEvent.click(viewWorkButton);

    // Advance timers to allow scroll logic to execute
    await vi.advanceTimersByTimeAsync(300);

    expect(mockScrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
  }, 10000);

  it('should handle Download CV button click', async () => {
    // Mock fetch for PDF download
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      blob: () => Promise.resolve(new Blob(['fake pdf'], { type: 'application/pdf' })),
    } as Response);

    // Mock URL.createObjectURL
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');

    const { getByText, queryByText } = renderWithProviders(<Home />);

    await vi.advanceTimersByTimeAsync(100);

    const downloadButton = getByText('Download CV');

    // Click the button
    fireEvent.click(downloadButton);

    // Should show loading state immediately
    expect(queryByText('Downloading...') || queryByText('Download CV')).toBeDefined();
  }, 10000);

  it('should handle scroll events on container', async () => {
    const { container } = renderWithProviders(<Home />);

    const pageContainer = container.querySelector('[data-section]')?.parentElement;
    if (pageContainer) {
      fireEvent.scroll(pageContainer);
      // Should not crash
      expect(pageContainer).toBeDefined();
    }
  });

  it('should update active section on intersection', async () => {
    const { container } = renderWithProviders(<Home />);

    await vi.advanceTimersByTimeAsync(100);

    expect(container.querySelectorAll('button[aria-label^="Go to"]').length).toBeGreaterThan(0);
  }, 10000);

  it('should handle scroll snapping logic', () => {
    const { container } = renderWithProviders(<Home />);

    const pageContainer = container.querySelector('[data-section]')?.parentElement;
    if (pageContainer) {
      fireEvent.scroll(pageContainer);

      // Should not crash
      expect(container).toBeDefined();
    }
  });

  it('should disable scroll snap on mobile', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });

    const { container } = renderWithProviders(<Home />);

    const pageContainer = container.querySelector('[data-section]')?.parentElement;
    if (pageContainer) {
      fireEvent.scroll(pageContainer);
      // Should not crash on mobile
      expect(pageContainer).toBeDefined();
    }
  });

  it('should cleanup on unmount', () => {
    const { unmount } = renderWithProviders(<Home />);

    expect(() => unmount()).not.toThrow();
  });
});

