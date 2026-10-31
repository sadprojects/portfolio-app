import { motion } from 'framer-motion';
import styled, { type DefaultTheme } from 'styled-components';

/** A rectangle inside a frame's artwork, in % of its box. */
export interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

type Tone = keyof DefaultTheme['colors'];

/* The see-through part of an artwork; everything around it is masked in the frame's tone, as far as --mask reaches. */
export const Cutout = styled.div<{ $rect: Rect; $tone: Tone }>`
  --tone: ${({ theme, $tone }) => theme.colors[$tone]};
  --mask: 200vmax;
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
