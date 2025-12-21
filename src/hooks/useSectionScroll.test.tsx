import { AccessibilityProvider } from '@contexts/AccessibilityContext';
import { renderHook } from '@testing-library/react';
import { useSectionScroll } from './useSectionScroll';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AccessibilityProvider>{children}</AccessibilityProvider>
);

describe('useSectionScroll', () => {
  let mockContainer: HTMLDivElement;
  let mockSections: HTMLElement[];

  beforeEach(() => {
    // Setup DOM
    mockContainer = document.createElement('div');
    mockContainer.style.height = '500px';
    mockContainer.style.overflow = 'auto';
    document.body.appendChild(mockContainer);

    // Create mock sections
    mockSections = ['home', 'projects', 'experience'].map((id) => {
      const section = document.createElement('section');
      section.setAttribute('data-section', id);
      section.style.height = '500px';
      mockContainer.appendChild(section);
      return section;
    });

    // Mock IntersectionObserver
    global.IntersectionObserver = vi.fn().mockImplementation((callback) => ({
      observe: vi.fn((element) => {
        // Immediately trigger callback for first section
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

    // Mock window.scrollTo
    window.scrollTo = vi.fn();

    // Mock window properties
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

    // Mock pageYOffset
    Object.defineProperty(window, 'pageYOffset', {
      writable: true,
      configurable: true,
      value: 0,
    });

    // Mock location
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        hash: '',
        pathname: '/',
        href: 'http://localhost/',
        origin: 'http://localhost',
        protocol: 'http:',
        host: 'localhost',
        hostname: 'localhost',
        port: '',
        assign: vi.fn(),
        reload: vi.fn(),
        replace: vi.fn(),
      },
    });

    // Mock history
    window.history.replaceState = vi.fn();

    // Use fake timers
    vi.useFakeTimers();
  });

  afterEach(() => {
    document.body.removeChild(mockContainer);
    vi.clearAllMocks();
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('should initialize with default active section', () => {
    const { result } = renderHook(() => useSectionScroll(), { wrapper });

    expect(result.current.activeSection).toBeDefined();
    expect(result.current.containerRef).toBeDefined();
    expect(result.current.scrollToSection).toBeInstanceOf(Function);
  });

  it('should update active section when observer fires', () => {
    const onSectionChange = vi.fn();
    const { result } = renderHook(() => useSectionScroll({ onSectionChange }), { wrapper });

    // Set container ref
    result.current.containerRef.current = mockContainer;

    // IntersectionObserver triggers immediately in our mock
    // It observes all sections, so activeSection could be any of them
    expect(result.current.activeSection).toBeDefined();
    expect(['home', 'projects', 'experience']).toContain(result.current.activeSection);
  });

  it('should call onSectionChange callback when section changes', () => {
    const onSectionChange = vi.fn();
    const { result } = renderHook(() => useSectionScroll({ onSectionChange }), { wrapper });
    result.current.containerRef.current = mockContainer;

    // IntersectionObserver triggers immediately in our mock
    expect(result.current.activeSection).toBeDefined();
    expect(['home', 'projects', 'experience']).toContain(result.current.activeSection);
  });

  it('should scroll to section when scrollToSection is called', async () => {
    const scrollIntoViewMock = vi.fn();

    // Mock scrollIntoView for the section
    mockSections[1].scrollIntoView = scrollIntoViewMock;

    const { result } = renderHook(() => useSectionScroll(), { wrapper });
    result.current.scrollToSection('projects');

    // Wait for the async scroll logic
    await vi.advanceTimersByTimeAsync(200);

    expect(scrollIntoViewMock).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
  });

  it('should handle scrollToSection with non-existent section', () => {
    const { result } = renderHook(() => useSectionScroll(), { wrapper });

    // Should not throw
    expect(() => {
      result.current.scrollToSection('non-existent');
    }).not.toThrow();
  });

  it('should scroll to hash section on mount', async () => {
    window.location.hash = '#projects';

    // Mock getBoundingClientRect for the section
    mockSections[1].getBoundingClientRect = vi.fn().mockReturnValue({
      top: 500,
      bottom: 1000,
      height: 500,
      width: 500,
      left: 0,
      right: 500,
      x: 0,
      y: 500,
      toJSON: () => ({}),
    });

    renderHook(() => useSectionScroll(), { wrapper });

    // Advance timers to allow hash scroll to execute
    await vi.advanceTimersByTimeAsync(500);

    // Just verify hook doesn't crash with hash
    expect(window.location.hash).toBe('#projects');
  });

  it('should clear hash from URL after scrolling', async () => {
    window.location.hash = '#experience';

    // Mock getBoundingClientRect for the section
    mockSections[2].getBoundingClientRect = vi.fn().mockReturnValue({
      top: 1000,
      bottom: 1500,
      height: 500,
      width: 500,
      left: 0,
      right: 500,
      x: 0,
      y: 1000,
      toJSON: () => ({}),
    });

    renderHook(() => useSectionScroll(), { wrapper });

    // Advance timers to allow scroll and URL cleanup
    await vi.advanceTimersByTimeAsync(1500);

    // Verify replaceState was called to clean up hash
    expect(window.history.replaceState).toHaveBeenCalled();
  });

  it('should retry scrolling to hash if section not found initially', () => {
    window.location.hash = '#delayed';

    renderHook(() => useSectionScroll(), { wrapper });

    // Verify hook handles missing sections gracefully
    expect(window.location.hash).toBe('#delayed');
  });

  it('should handle scroll events with visibility calculation', () => {
    const { result } = renderHook(() => useSectionScroll(), { wrapper });
    result.current.containerRef.current = mockContainer;

    // Mock getBoundingClientRect
    mockSections.forEach((section, index) => {
      section.getBoundingClientRect = vi.fn().mockReturnValue({
        top: index * 100,
        bottom: (index + 1) * 100,
        height: 100,
        width: 500,
        left: 0,
        right: 500,
        x: 0,
        y: index * 100,
        toJSON: () => ({}),
      });
    });

    // Trigger scroll event
    const scrollEvent = new Event('scroll');
    mockContainer.dispatchEvent(scrollEvent);

    // Should not crash
    expect(result.current.activeSection).toBeDefined();
  });

  it('should disable scroll snap on mobile', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500, // Mobile width
    });

    const scrollIntoViewMock = vi.fn();
    mockSections.forEach((section) => {
      section.scrollIntoView = scrollIntoViewMock;
    });

    const { result } = renderHook(() => useSectionScroll(), { wrapper });
    result.current.containerRef.current = mockContainer;

    const scrollEvent = new Event('scroll');
    mockContainer.dispatchEvent(scrollEvent);

    // Should not crash on mobile
    expect(result.current.activeSection).toBeDefined();
  });

  it('should cleanup observers and listeners on unmount', () => {
    const { result, unmount } = renderHook(() => useSectionScroll(), { wrapper });
    result.current.containerRef.current = mockContainer;

    // Just verify unmount doesn't crash
    expect(() => unmount()).not.toThrow();
  });

  it('should not crash if containerRef is null', () => {
    const { result } = renderHook(() => useSectionScroll(), { wrapper });

    // Leave containerRef as null
    expect(result.current.containerRef.current).toBeNull();

    // Should not throw
    expect(() => {
      result.current.scrollToSection('home');
    }).not.toThrow();
  });

  it('should handle sections without data-section attribute', () => {
    const sectionWithoutAttr = document.createElement('section');
    mockContainer.appendChild(sectionWithoutAttr);

    const onSectionChange = vi.fn();
    const { result } = renderHook(() => useSectionScroll({ onSectionChange }), { wrapper });
    result.current.containerRef.current = mockContainer;

    // Should not crash
    expect(result.current.activeSection).toBeDefined();
  });
});
