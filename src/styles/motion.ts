import { css } from 'styled-components';

/** Hover: the card lifts towards the reader. */
export const lift = css`
  transition:
    transform 0.45s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.45s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.3s ease;

  &:hover {
    transform: translateY(-6px) scale(1.012);
    box-shadow: ${({ theme }) => theme.shadows.xl};
    border-color: ${({ theme }) => theme.colors.foreground};
  }

  @media (prefers-reduced-motion: reduce) {
    &:hover {
      transform: none;
    }
  }
`;

/** Shared framer-motion variants: a staggered parent and a fade-up child. */
export const stagger = (children = 0.1) => ({
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: children } },
});

export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

/** Scroll-driven openers settle with this spring and fade their line in over this part of their progress. */
export const OPENER_SPRING = { stiffness: 80, damping: 24, mass: 0.4 };
export const OPENER_FADE_IN = [0.05, 0.4];
