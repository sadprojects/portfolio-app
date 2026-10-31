import {
  motion,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import type { ReactNode } from 'react';
import styled from 'styled-components';

import { Zoom } from './Zoom';

/* Display rectangle of /media/images/laptop.svg (public-domain MoonBook by Dmitry Chestnykh), in % of the artwork. */
const SCREEN = { left: 14.84, top: 6.98, width: 69.97, height: 77.73 };
const SCREEN_CENTRE = `${SCREEN.left + SCREEN.width / 2}% ${SCREEN.top + SCREEN.height / 2}%`;
const CONTENT_FADE_IN = [0.05, 0.4];

const LaptopShell = styled.div`
  position: relative;

  img {
    display: block;
    width: 100%;
    height: auto;
  }
`;

const LaptopScreen = styled.div`
  position: absolute;
  left: ${SCREEN.left}%;
  top: ${SCREEN.top}%;
  width: ${SCREEN.width}%;
  height: ${SCREEN.height}%;
  display: grid;
  place-items: center;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.background};

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(
      115deg,
      rgba(255, 255, 255, 0.07),
      transparent 48%
    );
  }
`;

const ScreenContent = styled(motion.div)`
  width: 100%;

  && > section {
    padding-top: clamp(1rem, 2vw, 2.5rem);
    padding-bottom: clamp(1rem, 2vw, 2.5rem);
  }

  @media (max-width: 768px) {
    && p {
      font-size: 1rem;
    }

    && p:first-of-type {
      font-size: 0.55rem;
    }
  }
`;

interface LaptopFrameProps {
  progress: MotionValue<number>;
  children: ReactNode;
}

const LaptopFrame = ({ progress, children }: LaptopFrameProps) => {
  const opacity = useTransform(progress, CONTENT_FADE_IN, [0, 1]);
  return (
    <LaptopShell>
      <img src="/media/images/laptop.svg" alt="" width={707} height={399} />
      <LaptopScreen>
        <ScreenContent style={{ opacity }}>{children}</ScreenContent>
      </LaptopScreen>
    </LaptopShell>
  );
};

export const Laptop = ({ children }: { children: ReactNode }) => {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return children;
  return (
    <Zoom origin={SCREEN_CENTRE} width="min(94vw, 80rem)">
      {(progress) => <LaptopFrame progress={progress}>{children}</LaptopFrame>}
    </Zoom>
  );
};
