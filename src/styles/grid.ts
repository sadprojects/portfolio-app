import styled, { css } from 'styled-components';

/** 12-column page grid: 16px gutters, inset on wide screens, capped at 2088px. */
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: 16px;
  width: 100%;
  max-width: 2088px;
  margin: 0 auto;
  padding: 0 16px;

  @media (min-width: 1024px) {
    padding: 0 32px;
  }
`;

/** Column placement per breakpoint: desktop, tablet (≤1024), mobile (≤768). */
export const col = (
  desktop: string,
  tablet = desktop,
  mobile = '1 / -1',
) => css`
  grid-column: ${desktop};

  @media (max-width: 1024px) {
    grid-column: ${tablet};
  }

  @media (max-width: 768px) {
    grid-column: ${mobile};
  }
`;

/** Shared easing for every reveal: fast start, long settle. */
export const EASE = [0.22, 1, 0.36, 1] as const;
