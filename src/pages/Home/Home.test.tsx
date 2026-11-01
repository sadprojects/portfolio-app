import { ThemeProvider } from '@contexts/ThemeContext';
import { fireEvent, render } from '@testing-library/react';

import Home from './Home';

const renderWithProviders = (ui: React.ReactElement) =>
  render(<ThemeProvider>{ui}</ThemeProvider>);

describe('Home', () => {
  let mockScrollTo: ReturnType<typeof vi.fn<() => void>>;

  beforeEach(() => {
    mockScrollTo = vi.fn();
    window.scrollTo = mockScrollTo;

    // Mock IntersectionObserver
    global.IntersectionObserver = vi
      .fn()
      .mockImplementation(function (callback) {
        return {
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
        };
      });

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

    const tocButtons = container.querySelectorAll(
      'button[aria-label^="Go to"]',
    );
    expect(tocButtons.length).toBeGreaterThan(0);

    const projectsButton = container.querySelector(
      'button[aria-label="Go to Projects"]',
    );
    if (projectsButton) {
      // Mock scrollIntoView for the projects section
      const projectsSection = container.querySelector(
        '[data-section="projects"]',
      );
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
    const firstSection = container.querySelector(
      '[data-section]:not([data-section="home"])',
    );
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

  it('links the Download CV button straight to the PDF', async () => {
    const { getByText } = renderWithProviders(<Home />);

    await vi.advanceTimersByTimeAsync(100);

    const link = getByText('Download CV').closest('a');
    expect(link).toHaveAttribute('href', expect.stringMatching(/\.pdf$/));
    expect(link).toHaveAttribute('download');
  });
});
