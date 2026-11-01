import { easeOutCubic } from '@utils/math';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { useRef, type ReactNode } from 'react';
import styled from 'styled-components';

import { useScrollReveal } from './useScrollReveal';

const DEFAULT_PARALLAX_PX = 60;
const ZOOM_FROM = 1.35;
const ZOOM_ON_EXIT = 0.1;
const ENTER_LIFT_PX = 60;
const EXIT_LIFT_PX = 80;
const EXIT_MIN_OPACITY = 0.4;

const MediaFrame = styled(motion.div)<{ $ratio?: string }>`
  position: relative;
  overflow: hidden;
  border-radius: 2px;
  aspect-ratio: ${({ $ratio }) => $ratio ?? 'auto'};
  background: ${({ theme }) => theme.colors.accent};
`;

const DriftingMedia = styled(motion.div)`
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
  parallax?: number;
  className?: string;
}

export const RevealMedia = ({
  children,
  ratio,
  parallax = DEFAULT_PARALLAX_PX,
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

  const mediaY = useTransform(scrollYProgress, [0, 1], [drift, -drift]);
  const clipPath = useTransform(
    [enter, exit],
    ([entered, exited]: number[]) =>
      `inset(${(1 - easeOutCubic(entered)) * 100}% 0% ${easeOutCubic(exited) * 100}% 0%)`,
  );
  const scale = useTransform(
    [enter, exit],
    ([entered, exited]: number[]) =>
      ZOOM_FROM -
      (ZOOM_FROM - 1) * easeOutCubic(entered) +
      ZOOM_ON_EXIT * exited,
  );
  const opacity = useTransform(exit, [0, 1], [1, EXIT_MIN_OPACITY]);
  const frameY = useTransform(
    [enter, exit],
    ([entered, exited]: number[]) =>
      (1 - easeOutCubic(entered)) * ENTER_LIFT_PX - exited * EXIT_LIFT_PX,
  );

  return (
    <MediaFrame
      ref={ref}
      className={className}
      $ratio={ratio}
      style={reduceMotion ? undefined : { clipPath, opacity, y: frameY }}
    >
      <DriftingMedia style={reduceMotion ? undefined : { y: mediaY, scale }}>
        {children}
      </DriftingMedia>
    </MediaFrame>
  );
};
