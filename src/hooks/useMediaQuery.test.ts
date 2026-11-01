import { act, renderHook } from '@testing-library/react';

import { useMediaQuery } from './useMediaQuery';

const PHONE = '(max-width: 768px)';

/* The hook subscribes on one of the matchMedia results; the snapshot reads make others. */
const changeListener = () => {
  const subscribed = vi
    .mocked(window.matchMedia)
    .mock.results.map((result) => result.value)
    .find((media) => media.addEventListener.mock.calls.length > 0);
  return subscribed.addEventListener.mock.calls[0][1] as () => void;
};

describe('useMediaQuery', () => {
  const width = window.innerWidth;
  afterEach(() => {
    window.innerWidth = width;
  });

  it('follows the viewport width', () => {
    window.innerWidth = 1024;
    expect(renderHook(() => useMediaQuery(PHONE)).result.current).toBe(false);
    window.innerWidth = 500;
    expect(renderHook(() => useMediaQuery(PHONE)).result.current).toBe(true);
  });

  it('updates when the query flips', () => {
    window.innerWidth = 1024;
    const { result } = renderHook(() => useMediaQuery(PHONE));
    const onChange = changeListener();
    window.innerWidth = 500;
    act(() => onChange());
    expect(result.current).toBe(true);
  });
});
