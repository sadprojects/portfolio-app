import { useEffect, type RefObject } from 'react';
import { useTheme } from 'styled-components';

const RAIN_GLYPHS =
  'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789';
const GLYPH_SIZE_PX = 14;
const FRAME_INTERVAL_MS = 50;
const MAX_START_DELAY_ROWS = 40;
const RESET_CHANCE = 0.04;

const randomGlyph = () =>
  RAIN_GLYPHS[Math.floor(Math.random() * RAIN_GLYPHS.length)];

export const useGlyphRain = (
  canvasRef: RefObject<HTMLCanvasElement | null>,
) => {
  const { colors, typography } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const pixelRatio = window.devicePixelRatio || 1;
    const { innerWidth: width, innerHeight: height } = window;
    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;
    context.scale(pixelRatio, pixelRatio);
    context.font = `${GLYPH_SIZE_PX}px ${typography.fonts.mono}`;

    const columns = Math.ceil(width / GLYPH_SIZE_PX);
    const dropRows = Array.from({ length: columns }, () =>
      Math.floor(Math.random() * -MAX_START_DELAY_ROWS),
    );

    let frameHandle = 0;
    let lastFrameAt = 0;
    const drawFrame = (now: number) => {
      frameHandle = requestAnimationFrame(drawFrame);
      if (now - lastFrameAt < FRAME_INTERVAL_MS) return;
      lastFrameAt = now;
      context.fillStyle = `${colors.background}2e`;
      context.fillRect(0, 0, width, height);
      context.fillStyle = `${colors.foreground}55`;
      dropRows.forEach((row, column) => {
        context.fillText(
          randomGlyph(),
          column * GLYPH_SIZE_PX,
          row * GLYPH_SIZE_PX,
        );
        const pastBottom = row * GLYPH_SIZE_PX > height;
        dropRows[column] =
          pastBottom && Math.random() < RESET_CHANCE ? 0 : row + 1;
      });
    };
    frameHandle = requestAnimationFrame(drawFrame);
    return () => cancelAnimationFrame(frameHandle);
  }, [canvasRef, colors, typography]);
};
