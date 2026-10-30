import { useMotionValue, useSpring, useTransform } from 'framer-motion';
import type { MouseEvent } from 'react';

/** Subtle 3D tilt that follows the pointer. Spread the result onto a motion element. */
export const useTilt = (maxDegrees = 8) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(
    useTransform(y, [-0.5, 0.5], [maxDegrees, -maxDegrees]),
    { stiffness: 220, damping: 18 },
  );
  const rotateY = useSpring(
    useTransform(x, [-0.5, 0.5], [-maxDegrees, maxDegrees]),
    { stiffness: 220, damping: 18 },
  );

  const onMouseMove = (event: MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width - 0.5);
    y.set((event.clientY - rect.top) / rect.height - 0.5);
  };
  const onMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return {
    style: { rotateX, rotateY, transformPerspective: 700 },
    onMouseMove,
    onMouseLeave,
  };
};
