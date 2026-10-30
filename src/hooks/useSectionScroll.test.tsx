import { act, renderHook } from '@testing-library/react';
import { useSectionScroll } from './useSectionScroll';

type ObserverCallback = (entries: Partial<IntersectionObserverEntry>[]) => void;

describe('useSectionScroll', () => {
  let callback: ObserverCallback;
  const observe = vi.fn();
  const disconnect = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML =
      '<div data-section="home"></div><div data-section="projects"></div>';
    window.history.replaceState(null, '', '/');
    vi.stubGlobal(
      'IntersectionObserver',
      vi.fn((cb: ObserverCallback) => {
        callback = cb;
        return {
          observe,
          disconnect,
          unobserve: vi.fn(),
          takeRecords: () => [],
        };
      }),
    );
    Element.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('starts on home and observes every section', () => {
    const { result } = renderHook(() => useSectionScroll());
    expect(result.current.activeSection).toBe('home');
    expect(observe).toHaveBeenCalledTimes(2);
  });

  it('updates the active section and notifies when a section intersects', () => {
    const onSectionChange = vi.fn();
    const { result } = renderHook(() => useSectionScroll({ onSectionChange }));
    act(() => {
      callback([
        {
          isIntersecting: true,
          target: document.querySelector('[data-section="projects"]')!,
        },
      ]);
    });
    expect(result.current.activeSection).toBe('projects');
    expect(onSectionChange).toHaveBeenCalledWith('projects');
  });

  it('scrolls to a section by id and ignores unknown ids', () => {
    const { result } = renderHook(() => useSectionScroll());
    act(() => result.current.scrollToSection('projects'));
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledTimes(1);
    act(() => result.current.scrollToSection('nope'));
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledTimes(1);
  });

  it('scrolls to the hash target on mount and then clears the hash', () => {
    window.history.replaceState(null, '', '/#projects');
    renderHook(() => useSectionScroll());
    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(window.location.hash).toBe('');
  });

  it('disconnects the observer on unmount', () => {
    const { unmount } = renderHook(() => useSectionScroll());
    unmount();
    expect(disconnect).toHaveBeenCalled();
  });
});
