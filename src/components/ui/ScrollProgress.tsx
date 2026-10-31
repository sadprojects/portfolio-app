import { motion, useScroll, useSpring } from 'framer-motion';
import styled from 'styled-components';

const PROGRESS_SPRING = { stiffness: 120, damping: 30, mass: 0.3 };

const ProgressBar = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: ${({ theme }) => theme.colors.foreground};
  transform-origin: 0 50%;
  z-index: 200;
  pointer-events: none;
`;

export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, PROGRESS_SPRING);
  return <ProgressBar style={{ scaleX }} aria-hidden />;
};
