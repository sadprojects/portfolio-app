import { act, renderHook } from '@testing-library/react';
import useDimensions from './useDimensions';

describe('useDimensions', () => {
  it('should return initial dimensions', () => {
    const { result } = renderHook(() => useDimensions());
    const [isMobile, width, height] = result.current;

    expect(width).toBeGreaterThan(0);
    expect(height).toBeGreaterThan(0);
    expect(typeof isMobile).toBe('boolean');
  });

  it('should detect mobile viewport', () => {
    global.innerWidth = 500;
    global.innerHeight = 800;

    const { result } = renderHook(() => useDimensions());
    const [isMobile] = result.current;

    expect(isMobile).toBe(true);
  });

  it('should detect desktop viewport', () => {
    global.innerWidth = 1200;
    global.innerHeight = 800;

    const { result } = renderHook(() => useDimensions());
    const [isMobile] = result.current;

    expect(isMobile).toBe(false);
  });

  it('should update dimensions on resize', async () => {
    vi.useFakeTimers();

    const { result } = renderHook(() => useDimensions());

    act(() => {
      global.innerWidth = 1200;
      global.innerHeight = 900;
      window.dispatchEvent(new Event('resize'));
      vi.advanceTimersByTime(200); // Wait for debounce (150ms + buffer)
    });

    const [, width, height] = result.current;
    expect(width).toBe(1200);
    expect(height).toBe(900);

    vi.useRealTimers();
  });

  it('should cleanup resize listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useDimensions());
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'resize',
      expect.any(Function),
    );

    removeEventListenerSpy.mockRestore();
  });
});
