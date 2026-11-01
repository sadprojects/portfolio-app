import { clamp01 } from '@utils/math';
import { useScroll, useTransform } from 'framer-motion';
import type { RefObject } from 'react';

const PAGE_END_REVEAL_FRACTION = 0.45;

const progressTowardPageEnd = (scrollY: number) => {
  const viewportHeight = window.innerHeight;
  const remaining =
    document.documentElement.scrollHeight - viewportHeight - scrollY;
  return clamp01(1 - remaining / (viewportHeight * PAGE_END_REVEAL_FRACTION));
};

/* No springs here: the page's scroll is already smoothed, and a spring on every revealed element was most of the per-frame work. */
export const useScrollReveal = (ref: RefObject<HTMLElement | null>) => {
  const { scrollYProgress: enterByPosition } = useScroll({
    target: ref,
    offset: ['start 92%', 'start 62%'],
  });
  const { scrollYProgress: exit } = useScroll({
    target: ref,
    offset: ['end 28%', 'end 1%'],
  });
  const { scrollY } = useScroll();

  const enter = useTransform(
    [enterByPosition, scrollY],
    ([byPosition, scrolled]: number[]) =>
      Math.max(byPosition, progressTowardPageEnd(scrolled)),
  );

  return { enter, exit };
};
