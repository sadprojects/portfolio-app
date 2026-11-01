import { clamp01 } from '@utils/math';
import { easeInOut, easeOut } from 'framer-motion';

/** Where the window comes from, as fractions of the window: the icon's centre and width. */
export interface GenieOrigin {
  x: number;
  y: number;
  width: number;
}

export interface SliceFrame {
  /** Left edge, as a fraction of the window's width. */
  x: number;
  /** Top edge, as a fraction of the window's height. */
  y: number;
  scaleX: number;
  scaleY: number;
}

/* The Dock's genie in two phases: the window's top edge rises out of the icon while its bottom stays in it, then the bottom lets go and follows. Along the funnel the width and the centre bend from the top edge to the icon, pinching sharply near the icon. */
const STRETCH_ENDS = 0.65;
const PINCH = 2.4;
const BEND = 1.8;

const lerp = (from: number, to: number, by: number) => from + (to - from) * by;

/** The frame of a horizontal slice of the window, `top` of the way down it, at `progress` of the opening. */
export const genieSlice = (
  progress: number,
  top: number,
  origin: GenieOrigin,
): SliceFrame => {
  const stretch = easeOut(clamp01(progress / STRETCH_ENDS));
  const release = easeInOut(
    clamp01((progress - STRETCH_ENDS) / (1 - STRETCH_ENDS)),
  );
  const topY = origin.y * (1 - stretch);
  const topWidth = lerp(origin.width, 1, stretch);
  const topCentre = lerp(origin.x, 0.5, stretch);
  const bottomY = lerp(origin.y, 1, release);
  const bottomWidth = lerp(origin.width, 1, release);
  const bottomCentre = lerp(origin.x, 0.5, release);
  const width = lerp(topWidth, bottomWidth, top ** PINCH);
  const centre = lerp(topCentre, bottomCentre, top ** BEND);
  return {
    x: centre - width / 2,
    y: topY + top * (bottomY - topY),
    scaleX: width,
    scaleY: bottomY - topY,
  };
};
