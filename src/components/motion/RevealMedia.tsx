import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { useRef, type ReactNode } from 'react';
import styled from 'styled-components';
import { useScrollReveal } from './useScrollReveal';

const Frame = styled(motion.div)<{ $ratio?: string }>`
  position: relative;
  overflow: hidden;
  border-radius: 2px;
  aspect-ratio: ${({ $ratio }) => $ratio ?? 'auto'};
  background: ${({ theme }) => theme.colors.accent};
`;

/* Oversized so the parallax drift never exposes the frame behind the media. */
const Inner = styled(motion.div)`
  position: absolute;
  left: 0;
  top: -10%;
  width: 100%;
  height: 120%;
  will-change: transform;

  & > img,
  & > video {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

interface RevealMediaProps {
  children: ReactNode;
  ratio?: string;
  /** Vertical drift in px across the viewport; 0 disables parallax. */
  parallax?: number;
  className?: string;
}

/**
 * Media wipes up out of a mask while settling from a zoom as it scrolls in, drifts while
 * on screen, then collapses back into the mask as it leaves. All scrubbed by scroll position.
 */
export const RevealMedia = ({
  children,
  ratio,
  parallax = 60,
  className,
}: RevealMediaProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { enter, exit } = useScrollReveal(ref);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const drift = reduceMotion ? 0 : parallax;
  const y = useTransform(scrollYProgress, [0, 1], [drift, -drift]);
  const out = (t: number) => 1 - (1 - t) ** 3;
  const clipPath = useTransform(
    [enter, exit],
    ([e, x]: number[]) =>
      `inset(${(1 - out(e)) * 100}% 0% ${out(x) * 100}% 0%)`,
  );
  const scale = useTransform(
    [enter, exit],
    ([e, x]: number[]) => 1.35 - 0.35 * out(e) + 0.1 * x,
  );
  const opacity = useTransform(exit, [0, 1], [1, 0.4]);
  const frameY = useTransform(
    [enter, exit],
    ([e, x]: number[]) => (1 - out(e)) * 60 - x * 80,
  );

  return (
    <Frame
      ref={ref}
      className={className}
      $ratio={ratio}
      style={reduceMotion ? undefined : { clipPath, opacity, y: frameY }}
    >
      <Inner style={reduceMotion ? undefined : { y, scale }}>{children}</Inner>
    </Frame>
  );
};
