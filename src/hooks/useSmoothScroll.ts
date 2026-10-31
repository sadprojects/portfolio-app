import { easeOutQuart } from '@utils/math';
import Lenis from 'lenis';
import { useCallback, useEffect, useRef } from 'react';

const SCROLL_LERP = 0.075;
const SCROLL_DURATION_SECONDS = 1.8;
const DEFAULT_OFFSET_PX = -64;

export type ScrollTo = (element: HTMLElement, offset?: number) => void;

export const useSmoothScroll = (): ScrollTo => {
  const lenis = useRef<Lenis | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    try {
      lenis.current = new Lenis({
        lerp: SCROLL_LERP,
        smoothWheel: true,
        autoRaf: true,
      });
    } catch {
      return;
    }
    return () => {
      lenis.current?.destroy();
      lenis.current = null;
    };
  }, []);

  return useCallback((element: HTMLElement, offset = DEFAULT_OFFSET_PX) => {
    if (lenis.current) {
      lenis.current.scrollTo(element, {
        offset,
        duration: SCROLL_DURATION_SECONDS,
        easing: easeOutQuart,
      });
    } else {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);
};
