import {
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import type { ReactNode } from 'react';
import styled from 'styled-components';

import baseArtwork from '@/assets/laptop-base.svg';
import lidArtwork from '@/assets/laptop-lid.svg';

import { Cutout, Startup } from './Cutout';
import { ARTWORK, HINGE, SCREEN, SCREEN_CENTRE } from './laptopArtwork';
import { Zoom } from './Zoom';

const OPENER_WIDTH = 'min(94vw, 80rem)';

const Shell = styled.div`
  position: relative;
  aspect-ratio: ${ARTWORK.width} / ${ARTWORK.height};
  perspective: 3200px;
  perspective-origin: 50% ${HINGE}%;
`;

const Artwork = styled.img`
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
`;

/* Hides whatever is behind the frame except through the screen. It stays flat in the frame's plane while the lid folds, so the lid's own layer is no bigger than the artwork; once the screen is covered by a sheet of its own it is dropped unseen. */
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

export const ScreenInset = styled.div`
  padding: 0 4%;
`;

interface LaptopFrameProps {
  children: ReactNode;
  /** Degrees the lid has folded down; open when absent. */
  lidAngle?: MotionValue<number>;
  /** How far a sheet of the screen's own has covered it, so the mask behind can go; open to what is behind when absent. */
  screenCovered?: MotionValue<number>;
}

/** The laptop artwork; children sit on its screen. */
export const LaptopFrame = ({
  children,
  lidAngle,
  screenCovered,
}: LaptopFrameProps) => {
  const open = useMotionValue(0);
  const maskVisibility = useTransform(screenCovered ?? open, (covered) =>
    covered < 1 ? 'visible' : 'hidden',
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
        </Screen>
        <Artwork
          src={lidArtwork}
          alt=""
          width={ARTWORK.width}
          height={ARTWORK.height}
        />
      </Lid>
      <Artwork src={baseArtwork} alt="" aria-hidden="true" />
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
