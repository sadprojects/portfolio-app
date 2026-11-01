import type { Rect } from './Cutout';

/* src/assets/laptop-lid.svg and laptop-base.svg are the public-domain MoonBook by Dmitry Chestnykh, split at its hinge; the screen (cut out of the lid) and the hinge are in % of the artwork. */
export const ARTWORK = { width: 707, height: 399 };
export const SCREEN: Rect = {
  left: 14.84,
  top: 6.98,
  width: 69.97,
  height: 77.73,
};
export const SCREEN_CENTRE = `${SCREEN.left + SCREEN.width / 2}% ${SCREEN.top + SCREEN.height / 2}%`;
/* Where the lid meets the base: everything below is the base. */
export const HINGE = 91.4;
/* Pinned, the screen spans up to 90% of the viewport's width or height, with the whole lid in view (its top 1.5vh under the edge); the keyboard sits below the fold. */
const PINNED_VW = 128;
const PINNED_VH = 206;
export const PINNED_WIDTH = `min(${PINNED_VW}vw, ${PINNED_VH}vh)`;
/* Half the screen's height, as a share of the laptop's width. */
const SCREEN_HALF = (SCREEN.height / 200) * (ARTWORK.height / ARTWORK.width);
/* On a viewport taller than the laptop is wide (tablets, phones), how far the laptop is lifted so its screen keeps the desktop's place, centred just under the middle, instead of sinking to the bottom edge; nothing where the laptop fills the height. */
export const SCREEN_LIFT = `max(0px, ${SCREEN_HALF * PINNED_VH}vh - ${SCREEN_HALF * PINNED_VW}vw)`;
/* The menu bar along the top of the screen, in % of its height; windows open below it. */
export const MENU_BAR_HEIGHT = 3.6;
