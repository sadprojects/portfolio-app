import { debounce, throttle } from './helpers';

describe('debounce', () => {
  it('should delay function execution', async () => {
    vi.useFakeTimers();
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn('test');
    expect(mockFn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(50);
    expect(mockFn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(50);
    expect(mockFn).toHaveBeenCalledWith('test');
    expect(mockFn).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });

  it('should cancel previous timeout if called again', () => {
    vi.useFakeTimers();
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn('first');
    vi.advanceTimersByTime(50);

    debouncedFn('second');
    vi.advanceTimersByTime(50);
    expect(mockFn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(50);
    expect(mockFn).toHaveBeenCalledWith('second');
    expect(mockFn).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });

  it('should handle multiple arguments', () => {
    vi.useFakeTimers();
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn('arg1', 'arg2', 'arg3');
    vi.advanceTimersByTime(100);

    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2', 'arg3');

    vi.useRealTimers();
  });
});

describe('throttle', () => {
  it('should execute function immediately on first call', () => {
    vi.useFakeTimers();
    const mockFn = vi.fn();
    const throttledFn = throttle(mockFn, 100);

    throttledFn('test');
    expect(mockFn).toHaveBeenCalledWith('test');
    expect(mockFn).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });

  it('should ignore calls during throttle period', () => {
    vi.useFakeTimers();
    const mockFn = vi.fn();
    const throttledFn = throttle(mockFn, 100);

    throttledFn('first');
    expect(mockFn).toHaveBeenCalledTimes(1);

    throttledFn('second');
    throttledFn('third');
    expect(mockFn).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });

  it('should allow execution after throttle period', () => {
    vi.useFakeTimers();
    const mockFn = vi.fn();
    const throttledFn = throttle(mockFn, 100);

    throttledFn('first');
    expect(mockFn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(100);

    throttledFn('second');
    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenLastCalledWith('second');

    vi.useRealTimers();
  });

  it('should handle multiple arguments', () => {
    vi.useFakeTimers();
    const mockFn = vi.fn();
    const throttledFn = throttle(mockFn, 100);

    throttledFn('arg1', 'arg2', 'arg3');
    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2', 'arg3');

    vi.useRealTimers();
  });
});
