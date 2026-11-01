import { motion, useTransform, type MotionValue } from 'framer-motion';
import type { ReactNode } from 'react';
import styled from 'styled-components';

import { genieSlice, type GenieOrigin } from './genieSlice';

const SLICES = 60;

const Window = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
`;

const Slice = styled(motion.div)`
  position: absolute;
  left: 0;
  width: 100%;
  height: ${100 / SLICES}%;
  overflow: hidden;
  transform-origin: 0 0;
  will-change: transform;
`;

/* The whole face, shifted up so this slice shows its own strip of it. */
const SliceContent = styled.div`
  position: absolute;
  left: 0;
  width: 100%;
  height: ${SLICES * 100}%;
`;

interface SliceProps {
  index: number;
  progress: MotionValue<number>;
  origin: GenieOrigin;
  children: ReactNode;
}

const GenieSlice = ({ index, progress, origin, children }: SliceProps) => {
  const top = index / SLICES;
  const transform = useTransform(progress, (opened) => {
    const { x, y, scaleX, scaleY } = genieSlice(opened, top, origin);
    return `translate(${x * 100}%, ${(y - top) * SLICES * 100}%) scale(${scaleX}, ${scaleY})`;
  });
  return (
    <Slice style={{ top: `${top * 100}%`, transform }}>
      <SliceContent style={{ top: `${-index * 100}%` }}>
        {children}
      </SliceContent>
    </Slice>
  );
};

interface GenieProps {
  /** How far open, 0 to 1. */
  progress: MotionValue<number>;
  origin: GenieOrigin;
  /** A still of the window's face; it is drawn once per slice, so it must cost nothing. */
  children: ReactNode;
}

/** A window opening the way the Dock opens one: sliced into strips, each pulled along a funnel out of its icon. */
export const Genie = ({ progress, origin, children }: GenieProps) => (
  <Window aria-hidden="true">
    {Array.from({ length: SLICES }, (_, index) => (
      <GenieSlice key={index} index={index} progress={progress} origin={origin}>
        {children}
      </GenieSlice>
    ))}
  </Window>
);
