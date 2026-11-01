import { act, renderHook } from '@testing-library/react';

import { useSectionScroll } from './useSectionScroll';

type ObserverCallback = (entries: Partial<IntersectionObserverEntry>[]) => void;

describe('useSectionScroll', () => {
  const observer = { callback: null as ObserverCallback | null };
  const observe = vi.fn();
  const disconnect = vi.fn();
  const scrollTo = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    document.body.innerHTML =
      '<div data-section="home"></div><div data-section="projects"></div>';
    window.history.replaceState(null, '', '/');
    vi.stubGlobal(
      'IntersectionObserver',
      vi.fn(function (cb: ObserverCallback) {
        observer.callback = cb;
        return {
          observe,
          disconnect,
          unobserve: vi.fn(),
          takeRecords: () => [],
        };
      }),
    );
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('starts on home and observes every section', () => {
    const { result } = renderHook(() => useSectionScroll(scrollTo));
    expect(result.current.activeSection).toBe('home');
    expect(observe).toHaveBeenCalledTimes(2);
  });

  it('updates the active section when a section intersects', () => {
    const { result } = renderHook(() => useSectionScroll(scrollTo));
    act(() => {
      observer.callback?.([
        {
          isIntersecting: true,
          target: document.querySelector('[data-section="projects"]')!,
        },
      ]);
    });
    expect(result.current.activeSection).toBe('projects');
  });

  it('scrolls to a section by id and ignores unknown ids', () => {
    const { result } = renderHook(() => useSectionScroll(scrollTo));
    act(() => result.current.scrollToSection('projects'));
    expect(scrollTo).toHaveBeenCalledWith(
      document.querySelector('[data-section="projects"]'),
    );
    act(() => result.current.scrollToSection('nope'));
    expect(scrollTo).toHaveBeenCalledTimes(1);
  });

  it('scrolls to the hash target on mount and then clears the hash', () => {
    window.history.replaceState(null, '', '/#projects');
    renderHook(() => useSectionScroll(scrollTo));
    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(scrollTo).toHaveBeenCalledTimes(1);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(window.location.hash).toBe('');
  });

  it('disconnects the observer on unmount', () => {
    const { unmount } = renderHook(() => useSectionScroll(scrollTo));
    unmount();
    expect(disconnect).toHaveBeenCalled();
  });
});
