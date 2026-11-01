import type { PhotoExif } from '@data/types';
import { clamp01, smoothstep } from '@utils/math';

export const playbackIndex = (
  progress: number,
  playbackStart: number,
  photoCount: number,
): number => {
  const position =
    clamp01((progress - playbackStart) / (1 - playbackStart)) *
    (photoCount - 1);
  return Array.from({ length: photoCount - 1 }, (_, step) =>
    smoothstep(clamp01(position - step)),
  ).reduce((sum, part) => sum + part, 0);
};

const joinPresent = (parts: (string | number | false | undefined)[]) =>
  parts.filter(Boolean).join(' · ');

export const exposureLine = (exif?: PhotoExif) =>
  joinPresent([
    exif?.aperture,
    exif?.shutter,
    exif?.iso && `ISO ${exif.iso}`,
    exif?.focal,
  ]);

export const contextLine = (exif?: PhotoExif) =>
  joinPresent([exif?.camera, exif?.location, exif?.date]);
