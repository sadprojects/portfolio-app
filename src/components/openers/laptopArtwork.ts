import type { Rect } from './Cutout';

/* /media/images/laptop.svg is the public-domain MoonBook by Dmitry Chestnykh; the screen and the hinge are in % of the artwork. */
export const ARTWORK = { width: 707, height: 399 };
export const SCREEN: Rect = {
  left: 14.84,
  top: 6.98,
  width: 69.97,
  height: 77.73,
};
export const SCREEN_CENTRE = `${SCREEN.left + SCREEN.width / 2}% ${SCREEN.top + SCREEN.height / 2}%`;
/* Where the lid meets the base: everything below is the base. */
export const HINGE = 97.2;
/* Pinned, the screen spans up to 90% of the viewport's width or height, with the whole lid in view (its top 1.5vh under the edge); the keyboard sits below the fold. */
export const PINNED_WIDTH = 'min(128vw, 206vh)';
