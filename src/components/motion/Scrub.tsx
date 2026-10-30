import { motion, useReducedMotion, useTransform } from 'framer-motion';
import { useRef, type ReactNode } from 'react';
import styled from 'styled-components';
import { useScrollReveal } from './useScrollReveal';

const Box = styled(motion.div)`
  will-change: transform, opacity;
`;

interface ScrubProps {
  children: ReactNode;
  className?: string;
  /** Travel in px: rises this far on entry, leaves the same distance upward on exit. */
  distance?: number;
}

/** Wraps any block so it fades and slides with scroll position in both directions. */
export const Scrub = ({ children, className, distance = 80 }: ScrubProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { enter, exit } = useScrollReveal(ref);
  const y = useTransform(
    [enter, exit],
    ([e, x]: number[]) => (1 - e) * distance - x * distance,
  );
  const opacity = useTransform([enter, exit], ([e, x]: number[]) =>
    Math.min(e, 1 - x),
  );

  return (
    <Box
      ref={ref}
      className={className}
      style={reduceMotion ? undefined : { y, opacity }}
    >
      {children}
    </Box>
  );
};
