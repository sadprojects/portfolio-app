import type { SectionId, SectionIntro } from '@data/types';
import { OPENER_FADE_IN, OPENER_SPRING } from '@styles/motion';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import {
  useRef,
  type CSSProperties,
  type FocusEvent,
  type ReactNode,
} from 'react';
import styled, { useTheme, type DefaultTheme } from 'styled-components';

/** A rectangle inside a frame's artwork, in % of its box. */
export interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export type Tone = keyof DefaultTheme['colors'];

export interface WindowProps {
  id: SectionId;
  intro: SectionIntro;
  children: ReactNode;
}

const LEAVE_SCALE = 0.6;
const STARTUP_FADE_OUT = [0.85, 1];
const HANDOFF_FADE = [0.5, 1];

const Track = styled.section`
  position: relative;
  scroll-margin-top: 4rem;
`;

/* Pinned for the whole runway, above the section, so it shows only through the artwork's cutout. Centred on both axes even when the artwork outgrows the viewport. */
const Pin = styled.div`
  position: sticky;
  top: 0;
  z-index: 1;
  display: grid;
  place-content: center;
  place-items: center;
  height: 100vh;
  overflow: hidden;
  pointer-events: none;
`;

const Artwork = styled(motion.div)`
  position: relative;
  top: var(--shift);
  will-change: transform, opacity;
`;

/* The see-through part of the artwork; everything around it is masked in the frame's tone. */
export const Cutout = styled.div<{ $rect: Rect; $tone: Tone }>`
  --tone: ${({ theme, $tone }) => theme.colors[$tone]};
  position: absolute;
  left: ${({ $rect }) => $rect.left}%;
  top: ${({ $rect }) => $rect.top}%;
  width: ${({ $rect }) => $rect.width}%;
  height: ${({ $rect }) => $rect.height}%;
  box-shadow: 0 0 0 200vmax var(--tone);
`;

/* Fills the cutout while the frame arrives, then fades to let the section through. */
export const Startup = styled(motion.div)`
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: var(--tone);
`;

const Content = styled(motion.div)`
  position: relative;
  isolation: isolate;
  width: var(--cutout-width);
  margin: 0 auto;
  padding: var(--arrive) 0 var(--depart);
`;

type Anchor = 'centre' | 'bottom';

/* The artwork sits centred in the pin, or is pushed down until the cutout's bottom edge meets the viewport's. The section is as wide as the cutout and padded so its first line enters where the cutout, clipped to the viewport, ends once the frame has settled, and its last line leaves at the cutout's top as the frame departs, one viewport before the track ends. */
const frameGeometry = (
  width: string,
  aspect: number,
  cutout: Rect,
  anchor: Anchor,
) => {
  const height = `calc(${width} / ${aspect})`;
  const centred = (percent: number) =>
    `calc((100vh - ${height}) / 2 + ${height} * ${percent / 100})`;
  const bottom = centred(cutout.top + cutout.height);
  const shift = anchor === 'bottom' ? `calc(100vh - ${bottom})` : '0px';
  return {
    '--shift': shift,
    '--cutout-width': `calc(${width} * ${cutout.width / 100})`,
    '--arrive': `min(100vh, calc(${shift} + ${bottom}))`,
    '--depart': `calc(200vh - max(0px, calc(${shift} + ${centred(cutout.top)})))`,
  } as CSSProperties;
};

/* A keyboard user tabbing to something hidden behind the mask gets it scrolled into the cutout. */
const keepFocusInCutout = (event: FocusEvent<HTMLElement>) => {
  if (event.target.matches(':focus-visible')) {
    event.target.scrollIntoView({ block: 'center' });
  }
};

interface ScrollFrameProps {
  id: SectionId;
  /** Pinned width of the artwork, a CSS length. */
  width: string;
  /** Artwork width ÷ height. */
  aspect: number;
  /** Where the section shows through. */
  cutout: Rect;
  tone: Tone;
  /** Where the artwork sits while pinned; 'bottom' hides whatever lies below its cutout. */
  anchor?: Anchor;
  /** Scale the artwork arrives at before settling to 1. */
  start: number;
  /** The artwork, given the opacity of its startup screen. */
  artwork: (startupOpacity: MotionValue<number>) => ReactNode;
  children: ReactNode;
}

/** Pins a frame on screen while the section scrolls through its cutout: it zooms out to arrive, holds, then shrinks away. */
export const ScrollFrame = ({
  id,
  width,
  aspect,
  cutout,
  tone,
  anchor = 'centre',
  start,
  artwork,
  children,
}: ScrollFrameProps) => {
  const ref = useRef<HTMLElement>(null);
  const theme = useTheme();
  // Arrives over 1.3 viewports, the first 0.3 before the frame pins; leaves over the final viewport.
  const { scrollYProgress: arrival } = useScroll({
    target: ref,
    offset: ['start 70%', 'start -100%'],
  });
  const { scrollYProgress: departure } = useScroll({
    target: ref,
    offset: ['end 200%', 'end end'],
  });
  const arrive = useSpring(arrival, OPENER_SPRING);
  const leave = useSpring(departure, OPENER_SPRING);
  const zoomIn = useTransform(arrive, [0, 1], [start, 1]);
  const zoomOut = useTransform(leave, [0, 1], [1, LEAVE_SCALE]);
  const scale = useTransform(
    [zoomIn, zoomOut],
    ([entering, leaving]: number[]) => entering * leaving,
  );
  const opacity = useTransform(leave, HANDOFF_FADE, [1, 0]);
  // The section's backdrop wears the frame's tone and returns to the page's as the frame fades.
  const backgroundColor = useTransform(leave, HANDOFF_FADE, [
    theme.colors[tone],
    theme.colors.background,
  ]);
  const startupOpacity = useTransform(
    arrive,
    [...OPENER_FADE_IN, ...STARTUP_FADE_OUT],
    [0, 1, 1, 0],
  );
  const origin = `${cutout.left + cutout.width / 2}% ${cutout.top + cutout.height / 2}%`;

  return (
    <Track
      ref={ref}
      data-section={id}
      style={frameGeometry(width, aspect, cutout, anchor)}
    >
      <Pin>
        <Artwork style={{ scale, opacity, width, transformOrigin: origin }}>
          {artwork(startupOpacity)}
        </Artwork>
      </Pin>
      <Content style={{ backgroundColor }} onFocus={keepFocusInCutout}>
        {children}
      </Content>
    </Track>
  );
};
