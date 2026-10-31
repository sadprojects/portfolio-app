import {
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import type { ReactNode } from 'react';
import styled from 'styled-components';

import { Cutout, Startup } from './Cutout';
import { ARTWORK, HINGE, SCREEN, SCREEN_CENTRE } from './laptopArtwork';
import { Zoom } from './Zoom';

const OPENER_WIDTH = 'min(94vw, 80rem)';

const Shell = styled.div`
  position: relative;
  aspect-ratio: ${ARTWORK.width} / ${ARTWORK.height};
  perspective: 3200px;
  perspective-origin: 50% ${HINGE}%;

  img {
    position: absolute;
    inset: 0;
    display: block;
    width: 100%;
    height: 100%;
  }
`;

/* Hides whatever is behind the frame except through the screen. It stays flat in the frame's plane while the lid folds, so the lid's own layer is no bigger than the artwork; once the display is dark a solid backdrop has taken over and it is dropped unseen. */
const Mask = motion.create(styled(Cutout)`
  pointer-events: none;
`);

/* Folds down around the hinge, towards the viewer, when the laptop closes. Its artwork has the screen cut out, so nothing here needs a clip. */
const Lid = styled(motion.div)`
  position: absolute;
  inset: 0;
  transform-origin: 50% ${HINGE}%;
  backface-visibility: hidden;
  will-change: transform;
`;

/* The screen's box inside the lid, with its gloss; the mask around it is the frame's, not the lid's. */
const Screen = styled(Cutout)`
  box-shadow: none;

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

/* The display going dark as the lid comes down. */
const ScreenOff = styled(motion.div)`
  position: absolute;
  inset: 0;
  background: linear-gradient(160deg, #141416, #060607);
  will-change: opacity;
`;

export const ScreenInset = styled.div`
  padding: 0 4%;
`;

interface LaptopFrameProps {
  children: ReactNode;
  /** Degrees the lid has folded down; open when absent. */
  lidAngle?: MotionValue<number>;
  /** How far the display has gone dark; lit when absent. */
  screenOff?: MotionValue<number>;
}

/** The laptop artwork; children sit on its screen. */
export const LaptopFrame = ({
  children,
  lidAngle,
  screenOff,
}: LaptopFrameProps) => {
  const lit = useMotionValue(0);
  const maskVisibility = useTransform(screenOff ?? lit, (dark) =>
    dark < 1 ? 'visible' : 'hidden',
  );
  return (
    <Shell>
      <Mask
        $rect={SCREEN}
        $tone="background"
        style={{ visibility: maskVisibility }}
      />
      <Lid style={{ rotateX: lidAngle }}>
        <Screen $rect={SCREEN} $tone="background">
          {children}
          {screenOff && <ScreenOff style={{ opacity: screenOff }} />}
        </Screen>
        <img
          src="/media/images/laptop-lid.svg"
          alt=""
          width={ARTWORK.width}
          height={ARTWORK.height}
        />
      </Lid>
      <img src="/media/images/laptop-base.svg" alt="" aria-hidden="true" />
    </Shell>
  );
};

/** Opener alone: the laptop zooms out to show the line on its screen; the section follows below. */
export const Laptop = ({ children }: { children: ReactNode }) => (
  <Zoom origin={SCREEN_CENTRE} width={OPENER_WIDTH}>
    {(lineOpacity) => (
      <LaptopFrame>
        <Startup style={{ opacity: lineOpacity }}>{children}</Startup>
      </LaptopFrame>
    )}
  </Zoom>
);
