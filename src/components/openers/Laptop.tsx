import { Statement } from '@components/motion/Statement';
import type { MotionValue } from 'framer-motion';
import type { ReactNode } from 'react';
import styled from 'styled-components';

import {
  Cutout,
  ScrollFrame,
  Startup,
  type Rect,
  type WindowProps,
} from './ScrollFrame';
import { Zoom } from './Zoom';

/* /media/images/laptop.svg is the public-domain MoonBook by Dmitry Chestnykh; the screen is in % of the artwork. */
const ARTWORK = { width: 707, height: 399 };
const SCREEN: Rect = { left: 14.84, top: 6.98, width: 69.97, height: 77.73 };
const SCREEN_CENTRE = `${SCREEN.left + SCREEN.width / 2}% ${SCREEN.top + SCREEN.height / 2}%`;
const START_SCALE = 2.2;
const OPENER_WIDTH = 'min(94vw, 80rem)';
/* Pinned, the screen spans up to 90% of the viewport's width or height; the keyboard sits below the fold. */
const PINNED_WIDTH = 'min(128vw, 205vh)';

/* The artwork minus its screen, so the section behind shows through. */
const screenCutout = ({ left, top, width, height }: Rect) =>
  `polygon(evenodd, 0 0, 100% 0, 100% 100%, 0 100%, 0 0, ${left}% ${top}%, ${left + width}% ${top}%, ${left + width}% ${top + height}%, ${left}% ${top + height}%, ${left}% ${top}%)`;

const Shell = styled.div`
  position: relative;
  aspect-ratio: ${ARTWORK.width} / ${ARTWORK.height};

  img {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
    clip-path: ${screenCutout(SCREEN)};
  }
`;

const Screen = styled(Cutout)`
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

const ScreenStartup = styled(Startup)`
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

const ScreenInset = styled.div`
  padding: 0 4%;
`;

interface LaptopFrameProps {
  startupOpacity: MotionValue<number>;
  children: ReactNode;
}

const LaptopFrame = ({ startupOpacity, children }: LaptopFrameProps) => (
  <Shell>
    <Screen $rect={SCREEN} $tone="background">
      <ScreenStartup style={{ opacity: startupOpacity }}>
        {children}
      </ScreenStartup>
    </Screen>
    <img
      src="/media/images/laptop.svg"
      alt=""
      width={ARTWORK.width}
      height={ARTWORK.height}
    />
  </Shell>
);

/** Opener alone: the laptop zooms out to show the line on its screen; the section follows below. */
export const Laptop = ({ children }: { children: ReactNode }) => (
  <Zoom origin={SCREEN_CENTRE} width={OPENER_WIDTH}>
    {(startupOpacity) => (
      <LaptopFrame startupOpacity={startupOpacity}>{children}</LaptopFrame>
    )}
  </Zoom>
);

/** The laptop stays pinned while the section scrolls on its screen, then shrinks away. */
export const LaptopWindow = ({ id, intro, children }: WindowProps) => (
  <ScrollFrame
    id={id}
    width={PINNED_WIDTH}
    aspect={ARTWORK.width / ARTWORK.height}
    cutout={SCREEN}
    tone="background"
    anchor="bottom"
    start={START_SCALE}
    artwork={(startupOpacity) => (
      <LaptopFrame startupOpacity={startupOpacity}>
        <Statement {...intro} exitOnScroll={false} />
      </LaptopFrame>
    )}
  >
    <ScreenInset>{children}</ScreenInset>
  </ScrollFrame>
);
