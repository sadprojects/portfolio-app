import { motion, useTransform, type MotionValue } from 'framer-motion';
import styled, { type DefaultTheme } from 'styled-components';

/** A rectangle inside a frame's artwork, in % of its box. */
export interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

type Tone = keyof DefaultTheme['colors'];

/* The see-through part of an artwork; everything around it is masked in the frame's tone, as far as --mask reaches: enough to cover a viewport above the screen when the frame has shrunk to half, without the layer growing past what the compositor tiles comfortably. */
export const Cutout = styled.div<{ $rect: Rect; $tone: Tone }>`
  --tone: ${({ theme, $tone }) => theme.colors[$tone]};
  --mask: 120vh;
  position: absolute;
  left: ${({ $rect }) => $rect.left}%;
  top: ${({ $rect }) => $rect.top}%;
  width: ${({ $rect }) => $rect.width}%;
  height: ${({ $rect }) => $rect.height}%;
  box-shadow: 0 0 0 var(--mask) var(--tone);
`;

/* Fills the cutout with the section's line while the frame arrives, then fades to let what is behind through. Sized for a statement on a small screen. */
export const Startup = styled(motion.div)`
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  overflow: hidden;
  background: var(--tone);

  && section {
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

/* A macOS-style overlay scrollbar at the frame's right edge: the thumb sits as far down as the content has been scrolled. */
const SCROLLBAR_THUMB_PERCENT = 14;
const SCROLLBAR_INSET_PERCENT = 1;

const Thumb = styled(motion.i)`
  position: absolute;
  right: 0.5%;
  width: 0.45%;
  height: ${SCROLLBAR_THUMB_PERCENT}%;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.foreground};
  opacity: 0.35;
  pointer-events: none;
  will-change: transform;
`;

interface ScrollbarProps {
  /** How far through the content the frame is, 0 to 1. */
  progress: MotionValue<number>;
  opacity?: MotionValue<number>;
  /** Where the track starts, in % of the frame, below any chrome along its top. */
  top?: number;
}

export const Scrollbar = ({ progress, opacity, top = 0 }: ScrollbarProps) => {
  const trackStart = top + SCROLLBAR_INSET_PERCENT;
  const travel =
    ((100 - trackStart - SCROLLBAR_INSET_PERCENT - SCROLLBAR_THUMB_PERCENT) /
      SCROLLBAR_THUMB_PERCENT) *
    100;
  const y = useTransform(progress, [0, 1], ['0%', `${travel}%`]);
  return (
    <Thumb style={{ top: `${trackStart}%`, y, opacity }} aria-hidden="true" />
  );
};
