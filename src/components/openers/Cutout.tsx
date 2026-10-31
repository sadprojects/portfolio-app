import { motion } from 'framer-motion';
import styled, { type DefaultTheme } from 'styled-components';

/** A rectangle inside a frame's artwork, in % of its box. */
export interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export type Tone = keyof DefaultTheme['colors'];

/* The see-through part of an artwork; everything around it is masked in the frame's tone. */
export const Cutout = styled.div<{ $rect: Rect; $tone: Tone }>`
  --tone: ${({ theme, $tone }) => theme.colors[$tone]};
  position: absolute;
  left: ${({ $rect }) => $rect.left}%;
  top: ${({ $rect }) => $rect.top}%;
  width: ${({ $rect }) => $rect.width}%;
  height: ${({ $rect }) => $rect.height}%;
  box-shadow: 0 0 0 200vmax var(--tone);
`;

/* Fills the cutout while the frame arrives, then fades to let what is behind through. */
export const Startup = styled(motion.div)`
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: var(--tone);
`;
