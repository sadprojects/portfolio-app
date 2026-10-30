import Lenis from 'lenis';

let lenis: Lenis | null = null;

/** Starts inertia scrolling for the whole page. Returns a stop function. */
export const startSmoothScroll = (): (() => void) => {
  if (lenis || window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    return () => {};
  try {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true, autoRaf: true });
  } catch {
    return () => {};
  }
  return () => {
    lenis?.destroy();
    lenis = null;
  };
};

/** Scrolls to an element, through Lenis when it is running. */
export const scrollToElement = (element: HTMLElement, offset = -64) => {
  if (lenis) {
    lenis.scrollTo(element, { offset, duration: 1.4 });
  } else {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};
