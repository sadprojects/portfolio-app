import { act, renderHook } from '@testing-library/react';
import {
  AccessibilityProvider,
  useAccessibility,
} from './AccessibilityContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AccessibilityProvider>{children}</AccessibilityProvider>
);

describe('AccessibilityContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should provide default scrollSnapEnabled as true', () => {
    const { result } = renderHook(() => useAccessibility(), { wrapper });
    expect(result.current.scrollSnapEnabled).toBe(true);
  });

  it('should toggle scrollSnapEnabled', () => {
    const { result } = renderHook(() => useAccessibility(), { wrapper });

    expect(result.current.scrollSnapEnabled).toBe(true);

    act(() => {
      result.current.toggleScrollSnap();
    });

    expect(result.current.scrollSnapEnabled).toBe(false);

    act(() => {
      result.current.toggleScrollSnap();
    });

    expect(result.current.scrollSnapEnabled).toBe(true);
  });

  it('should persist scrollSnapEnabled to localStorage', () => {
    const { result } = renderHook(() => useAccessibility(), { wrapper });

    act(() => {
      result.current.toggleScrollSnap();
    });

    expect(localStorage.getItem('scrollSnapEnabled')).toBe('false');
  });

  it('should load scrollSnapEnabled from localStorage on init', () => {
    localStorage.setItem('scrollSnapEnabled', 'false');

    const { result } = renderHook(() => useAccessibility(), { wrapper });

    expect(result.current.scrollSnapEnabled).toBe(false);
  });

  it('should throw error when useAccessibility is used outside provider', () => {
    expect(() => {
      renderHook(() => useAccessibility());
    }).toThrow('useAccessibility must be used within AccessibilityProvider');
  });

  it('should provide default snowfallEnabled based on season (winter = true)', () => {
    const { result } = renderHook(() => useAccessibility(), { wrapper });
    // Default depends on current month: Dec, Jan, Feb = true, otherwise false
    const month = new Date().getMonth();
    const isWinter = month === 11 || month === 0 || month === 1;
    expect(result.current.snowfallEnabled).toBe(isWinter);
  });

  it('should toggle snowfallEnabled', () => {
    const { result } = renderHook(() => useAccessibility(), { wrapper });

    const initialValue = result.current.snowfallEnabled;

    act(() => {
      result.current.toggleSnowfall();
    });

    expect(result.current.snowfallEnabled).toBe(!initialValue);

    act(() => {
      result.current.toggleSnowfall();
    });

    expect(result.current.snowfallEnabled).toBe(initialValue);
  });

  it('should persist snowfallEnabled to localStorage', () => {
    const { result } = renderHook(() => useAccessibility(), { wrapper });

    act(() => {
      result.current.toggleSnowfall();
    });

    expect(localStorage.getItem('snowfallEnabled')).toBe('false');
  });

  it('should load snowfallEnabled from localStorage on init', () => {
    localStorage.setItem('snowfallEnabled', 'false');

    const { result } = renderHook(() => useAccessibility(), { wrapper });

    expect(result.current.snowfallEnabled).toBe(false);
  });

  it('should show toast when toggling scrollSnap', () => {
    const { result } = renderHook(() => useAccessibility(), { wrapper });

    expect(result.current.toast.isVisible).toBe(false);

    act(() => {
      result.current.toggleScrollSnap();
    });

    expect(result.current.toast.isVisible).toBe(true);
    expect(result.current.toast.message).toBe('Scroll snap disabled');
  });

  it('should show toast when toggling snowfall', () => {
    const { result } = renderHook(() => useAccessibility(), { wrapper });

    expect(result.current.toast.isVisible).toBe(false);

    act(() => {
      result.current.toggleSnowfall();
    });

    expect(result.current.toast.isVisible).toBe(true);
    expect(result.current.toast.message).toBe('Snowfall disabled');
  });

  it('should hide toast when hideToast is called', () => {
    const { result } = renderHook(() => useAccessibility(), { wrapper });

    act(() => {
      result.current.toggleSnowfall();
    });

    expect(result.current.toast.isVisible).toBe(true);

    act(() => {
      result.current.hideToast();
    });

    expect(result.current.toast.isVisible).toBe(false);
  });
});
