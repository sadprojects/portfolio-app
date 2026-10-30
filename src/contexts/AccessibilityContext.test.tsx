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
    // Default depends on the season, so pin the starting value.
    localStorage.setItem('snowfallEnabled', 'true');
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

  it('should show toast when toggling snowfall', () => {
    localStorage.setItem('snowfallEnabled', 'true');
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
