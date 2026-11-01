import { act, renderHook } from '@testing-library/react';

import { SnowfallProvider, useSnowfall } from './SnowfallContext';

describe('SnowfallContext', () => {
  beforeEach(() => localStorage.clear());

  it('defaults to on in winter and off otherwise', () => {
    const { result } = renderHook(() => useSnowfall(), {
      wrapper: SnowfallProvider,
    });
    const month = new Date().getMonth();
    expect(result.current.enabled).toBe(month === 11 || month <= 1);
  });

  it('toggles and remembers the choice', () => {
    localStorage.setItem('snowfallEnabled', 'true');
    const { result } = renderHook(() => useSnowfall(), {
      wrapper: SnowfallProvider,
    });
    expect(result.current.enabled).toBe(true);
    act(() => result.current.toggle());
    expect(result.current.enabled).toBe(false);
    expect(localStorage.getItem('snowfallEnabled')).toBe('false');
  });

  it('is off and inert without a provider', () => {
    const { result } = renderHook(() => useSnowfall());
    expect(result.current.enabled).toBe(false);
    act(() => result.current.toggle());
    expect(result.current.enabled).toBe(false);
  });
});
