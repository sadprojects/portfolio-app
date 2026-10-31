import type { ReactNode } from 'react';
import styled from 'styled-components';

import { Cutout, Startup, type Rect } from './Cutout';
import { ARTWORK, SCREEN, SCREEN_CENTRE } from './laptopArtwork';
import { Zoom } from './Zoom';

const OPENER_WIDTH = 'min(94vw, 80rem)';

/* The artwork minus its screen, so whatever is behind shows through. */
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

export const ScreenInset = styled.div`
  padding: 0 4%;
`;

/** The laptop artwork; children sit on its screen. */
export const LaptopFrame = ({ children }: { children: ReactNode }) => (
  <Shell>
    <Screen $rect={SCREEN} $tone="background">
      {children}
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
    {(lineOpacity) => (
      <LaptopFrame>
        <Startup style={{ opacity: lineOpacity }}>{children}</Startup>
      </LaptopFrame>
    )}
  </Zoom>
);
