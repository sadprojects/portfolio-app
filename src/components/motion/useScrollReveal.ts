import { clamp01 } from '@utils/math';
import { useScroll, useSpring, useTransform } from 'framer-motion';
import type { RefObject } from 'react';

const REVEAL_SPRING = { stiffness: 90, damping: 26, mass: 0.6 };
const PAGE_END_REVEAL_FRACTION = 0.45;

const progressTowardPageEnd = (scrollY: number) => {
  const viewportHeight = window.innerHeight;
  const remaining =
    document.documentElement.scrollHeight - viewportHeight - scrollY;
  return clamp01(1 - remaining / (viewportHeight * PAGE_END_REVEAL_FRACTION));
};

export const useScrollReveal = (ref: RefObject<HTMLElement | null>) => {
  const { scrollYProgress: enterByPosition } = useScroll({
    target: ref,
    offset: ['start 89%', 'start 51%'],
  });
  const { scrollYProgress: exitByPosition } = useScroll({
    target: ref,
    offset: ['end 39%', 'end 1%'],
  });
  const { scrollY } = useScroll();

  const enter = useSpring(
    useTransform(
      [enterByPosition, scrollY],
      ([byPosition, scrolled]: number[]) =>
        Math.max(byPosition, progressTowardPageEnd(scrolled)),
    ),
    REVEAL_SPRING,
  );
  const exit = useSpring(exitByPosition, REVEAL_SPRING);

  return { enter, exit };
};
