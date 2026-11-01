import { act, renderHook } from '@testing-library/react';

import { IntroProvider, useIntro } from './IntroContext';

describe('IntroContext', () => {
  it('starts with the curtain down and lifts it once finished', () => {
    const { result } = renderHook(() => useIntro(), { wrapper: IntroProvider });
    expect(result.current.done).toBe(false);
    act(() => result.current.finish());
    expect(result.current.done).toBe(true);
  });

  it('skips the curtain under reduced motion', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as MediaQueryList);
    const { result } = renderHook(() => useIntro(), { wrapper: IntroProvider });
    expect(result.current.done).toBe(true);
    vi.restoreAllMocks();
  });

  it('counts as lifted when there is no provider', () => {
    expect(renderHook(() => useIntro()).result.current.done).toBe(true);
  });
});
