import { motion, useReducedMotion, useTransform } from 'framer-motion';
import { useRef, type ReactNode } from 'react';
import styled from 'styled-components';

import { useScrollReveal } from './useScrollReveal';

const DEFAULT_TRAVEL_PX = 80;

const ScrubFrame = styled(motion.div)`
  will-change: transform, opacity;
`;

interface ScrubProps {
  children: ReactNode;
  className?: string;
  distance?: number;
}

export const Scrub = ({
  children,
  className,
  distance = DEFAULT_TRAVEL_PX,
}: ScrubProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { enter, exit } = useScrollReveal(ref);
  const y = useTransform(
    [enter, exit],
    ([entered, exited]: number[]) =>
      (1 - entered) * distance - exited * distance,
  );
  const opacity = useTransform([enter, exit], ([entered, exited]: number[]) =>
    Math.min(entered, 1 - exited),
  );

  return (
    <ScrubFrame
      ref={ref}
      className={className}
      style={reduceMotion ? undefined : { y, opacity }}
    >
      {children}
    </ScrubFrame>
  );
};
