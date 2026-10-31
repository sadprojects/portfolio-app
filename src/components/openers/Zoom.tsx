import { OPENER_LINE, OPENER_SETTLES, OPENER_SPRING } from '@styles/motion';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { useRef, type ReactNode } from 'react';
import styled from 'styled-components';

const DEFAULT_START_SCALE = 2.2;

const ZoomTrack = styled.div`
  height: 290vh;
`;

const ZoomStage = styled.div`
  position: sticky;
  top: 0;
  display: grid;
  place-items: center;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
`;

const ZoomedFrame = styled(motion.div)`
  will-change: transform;
`;

interface ZoomProps {
  origin?: string;
  start?: number;
  width: string;
  /** The zoomed content, given the opacity its line fades in and out with. */
  children: (lineOpacity: MotionValue<number>) => ReactNode;
}

export const Zoom = ({
  origin = '50% 50%',
  start = DEFAULT_START_SCALE,
  width,
  children,
}: ZoomProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 70%', 'end end'],
  });
  const progress = useSpring(scrollYProgress, OPENER_SPRING);
  const scale = useTransform(progress, OPENER_SETTLES, [start, 1]);
  const lineOpacity = useTransform(progress, OPENER_LINE, [0, 1, 1, 0]);

  return (
    <ZoomTrack ref={ref}>
      <ZoomStage>
        <ZoomedFrame style={{ scale, transformOrigin: origin, width }}>
          {children(lineOpacity)}
        </ZoomedFrame>
      </ZoomStage>
    </ZoomTrack>
  );
};
