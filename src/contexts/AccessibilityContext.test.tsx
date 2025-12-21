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
});
