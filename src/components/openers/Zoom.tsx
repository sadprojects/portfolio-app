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
const ZOOM_SPRING = { stiffness: 80, damping: 24, mass: 0.4 };
const FADE_IN_RANGE = [0.05, 0.4];

const ZoomTrack = styled.div`
  height: 200vh;
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

interface FadeInProps {
  progress: MotionValue<number>;
  children: ReactNode;
}

export const FadeIn = ({ progress, children }: FadeInProps) => {
  const opacity = useTransform(progress, FADE_IN_RANGE, [0, 1]);
  return <motion.div style={{ opacity }}>{children}</motion.div>;
};

interface ZoomProps {
  origin?: string;
  start?: number;
  width: string;
  children: (progress: MotionValue<number>) => ReactNode;
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
  const progress = useSpring(scrollYProgress, ZOOM_SPRING);
  const scale = useTransform(progress, [0, 1], [start, 1]);

  return (
    <ZoomTrack ref={ref}>
      <ZoomStage>
        <ZoomedFrame style={{ scale, transformOrigin: origin, width }}>
          {children(progress)}
        </ZoomedFrame>
      </ZoomStage>
    </ZoomTrack>
  );
};
