import { useMotionValue, useSpring, useTransform } from 'framer-motion';
import type { MouseEvent } from 'react';

const TILT_SPRING = { stiffness: 220, damping: 18 };
const TILT_PERSPECTIVE_PX = 700;
const DEFAULT_MAX_DEGREES = 8;

export const useTilt = (maxDegrees = DEFAULT_MAX_DEGREES) => {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateX = useSpring(
    useTransform(pointerY, [-0.5, 0.5], [maxDegrees, -maxDegrees]),
    TILT_SPRING,
  );
  const rotateY = useSpring(
    useTransform(pointerX, [-0.5, 0.5], [-maxDegrees, maxDegrees]),
    TILT_SPRING,
  );

  const onMouseMove = (event: MouseEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - bounds.left) / bounds.width - 0.5);
    pointerY.set((event.clientY - bounds.top) / bounds.height - 0.5);
  };
  const onMouseLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return {
    style: { rotateX, rotateY, transformPerspective: TILT_PERSPECTIVE_PX },
    onMouseMove,
    onMouseLeave,
  };
};
