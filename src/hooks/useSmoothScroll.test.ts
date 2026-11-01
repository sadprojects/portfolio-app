import { renderHook } from '@testing-library/react';

const lenis = vi.hoisted(() => ({
  scrollTo: vi.fn(),
  destroy: vi.fn(),
  construct: vi.fn(),
}));
vi.mock('lenis', () => ({
  default: class {
    constructor(options: unknown) {
      lenis.construct(options);
    }
    scrollTo = lenis.scrollTo;
    destroy = lenis.destroy;
  },
}));

const prefersReducedMotion = (matches: boolean) =>
  vi.spyOn(window, 'matchMedia').mockImplementation(
    (query) =>
      ({
        matches: query.includes('reduced-motion') ? matches : false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }) as unknown as MediaQueryList,
  );

describe('useSmoothScroll', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Element.prototype.scrollIntoView = vi.fn();
  });
  afterEach(() => vi.restoreAllMocks());

  it('scrolls through Lenis while mounted and tears it down after', async () => {
    const { useSmoothScroll } = await import('./useSmoothScroll');
    prefersReducedMotion(false);
    const { result, unmount } = renderHook(() => useSmoothScroll());
    expect(lenis.construct).toHaveBeenCalledTimes(1);

    const target = document.createElement('section');
    result.current(target, -32);
    expect(lenis.scrollTo).toHaveBeenCalledWith(
      target,
      expect.objectContaining({ offset: -32 }),
    );
    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();

    unmount();
    expect(lenis.destroy).toHaveBeenCalledTimes(1);
  });

  it('leaves scrolling to the browser under reduced motion', async () => {
    const { useSmoothScroll } = await import('./useSmoothScroll');
    prefersReducedMotion(true);
    const { result } = renderHook(() => useSmoothScroll());
    expect(lenis.construct).not.toHaveBeenCalled();

    const target = document.createElement('section');
    result.current(target);
    expect(target.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
  });
});
