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
const OUTLINE_SAMPLES = 24;

const lerp = (from: number, to: number, by: number) => from + (to - from) * by;

/* The funnel at `progress`: where the window's top and bottom edges are, how wide, and centred where. */
const funnel = (progress: number, origin: GenieOrigin) => {
  const stretch = easeOut(clamp01(progress / STRETCH_ENDS));
  const release = easeInOut(
    clamp01((progress - STRETCH_ENDS) / (1 - STRETCH_ENDS)),
  );
  return {
    topY: origin.y * (1 - stretch),
    topWidth: lerp(origin.width, 1, stretch),
    topCentre: lerp(origin.x, 0.5, stretch),
    bottomY: lerp(origin.y, 1, release),
    bottomWidth: lerp(origin.width, 1, release),
    bottomCentre: lerp(origin.x, 0.5, release),
  };
};

/** The frame of a horizontal slice of the window, `top` of the way down it, at `progress` of the opening. */
export const genieSlice = (
  progress: number,
  top: number,
  origin: GenieOrigin,
): SliceFrame => {
  const shape = funnel(progress, origin);
  const width = lerp(shape.topWidth, shape.bottomWidth, top ** PINCH);
  const centre = lerp(shape.topCentre, shape.bottomCentre, top ** BEND);
  return {
    x: centre - width / 2,
    y: shape.topY + top * (shape.bottomY - shape.topY),
    scaleX: width,
    scaleY: shape.bottomY - shape.topY,
  };
};

/** The funnel's outline as a CSS polygon, so the sliced window has smooth sides instead of steps. */
export const genieOutline = (progress: number, origin: GenieOrigin) => {
  const left: string[] = [];
  const right: string[] = [];
  for (let sample = 0; sample <= OUTLINE_SAMPLES; sample++) {
    const top = sample / OUTLINE_SAMPLES;
    const { x, y, scaleX } = genieSlice(progress, top, origin);
    left.push(`${x * 100}% ${y * 100}%`);
    right.unshift(`${(x + scaleX) * 100}% ${y * 100}%`);
  }
  return `polygon(${[...left, ...right].join(', ')})`;
};
