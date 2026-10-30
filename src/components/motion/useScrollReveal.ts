import { useScroll, useTransform, type MotionValue } from 'framer-motion';
import type { RefObject } from 'react';

export interface ScrollReveal {
  /** 0 until the element's top reaches 88% of the viewport, 1 once it passes 52%. */
  enter: MotionValue<number>;
  /** 0 until the element's bottom reaches 38% of the viewport, 1 when it leaves the top. */
  exit: MotionValue<number>;
}

/**
 * Scroll-linked reveal progress. Everything driven by these values scrubs with the
 * scrollbar, so it plays forward on the way down and backward on the way up.
 * Elements in the last half-viewport of the page can never reach the 52% line, so the
 * final stretch of the document forces them in instead.
 */
export const useScrollReveal = (
  ref: RefObject<HTMLElement | null>,
): ScrollReveal => {
  const { scrollYProgress: fromTop } = useScroll({
    target: ref,
    offset: ['start 88%', 'start 52%'],
  });
  const { scrollYProgress: exit } = useScroll({
    target: ref,
    offset: ['end 38%', 'end 2%'],
  });
  const { scrollY } = useScroll();
  const enter = useTransform([fromTop, scrollY], ([e, y]: number[]) => {
    const vh = window.innerHeight;
    const remaining = document.documentElement.scrollHeight - vh - y;
    return Math.max(e, Math.min(1, Math.max(0, 1 - remaining / (vh * 0.45))));
  });
  return { enter, exit };
};
