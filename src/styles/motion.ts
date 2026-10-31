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

/** Scroll-driven openers settle with this spring. Their frame settles over the first part of their progress; their line fades in, holds to be read, and fades out again over these beats, leaving the screen clear before the section follows. */
export const OPENER_SPRING = { stiffness: 80, damping: 24, mass: 0.4 };
export const OPENER_SETTLES = [0, 0.55];
export const OPENER_LINE = [0.04, 0.3, 0.74, 0.86];
